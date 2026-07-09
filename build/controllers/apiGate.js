/**
 * Control central de peticiones al API.
 * Sin tokens: limita frecuencia, evita duplicados en vuelo y encola visitas offline.
 */
const ApiGate = (function () {
    'use strict';

    const STORAGE_KEY = 'me_apigate_state';
    const inFlight = new Set();
    let state = loadState();

    /** Rutas que nunca deben limitarse (p. ej. verificación de catálogo y envío de pedidos). */
    const EXEMPT_URLS = [
        /\/ventas\/get_codupdate/i,
        /\/ventas\/insertventa/i
    ];

    const RULES = [
        { pattern: /\/empleados\/login/i, key: 'login', minIntervalMs: 3000, maxPerWindow: 5, windowMs: 300000 },
        { pattern: /\/clientes\/descargar_clientes/i, key: 'clientes', minIntervalMs: 3600000, perUser: true },
        { pattern: /\/empleados\/location/i, key: 'gps', minIntervalMs: 300000 },
        { pattern: /\/clientes\/insert_visita/i, key: 'visita', minIntervalMs: 1000 }
    ];

    function loadState() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            // ignorar si storage no disponible
        }
    }

    function isExemptUrl(url) {
        const target = (url || '').toString();
        return EXEMPT_URLS.some((pattern) => pattern.test(target));
    }

    function getRule(url) {
        const target = (url || '').toString();
        if (isExemptUrl(target)) return null;
        return RULES.find((rule) => rule.pattern.test(target)) || null;
    }

    function getCurrentCodven(body) {
        const data = body || {};
        return data.codven || data.codemp || (typeof GlobalCodUsuario !== 'undefined' ? GlobalCodUsuario : '');
    }

    function getClientesDayKey(codven) {
        return `clientesDay_${codven || '0'}`;
    }

    function buildRuleKey(rule, configOrBody) {
        const body = configOrBody && configOrBody.data ? configOrBody.data : (configOrBody || {});
        const codven = getCurrentCodven(body);

        if (rule.perUser || rule.key === 'clientes') {
            return `${rule.key}:${codven}`;
        }

        if (rule.key === 'login') {
            const user = body.user || body.usuario || '';
            return `${rule.key}:${user}`;
        }

        return `${rule.key}:${codven}`;
    }

    function getRequestKey(config) {
        const url = (config.baseURL || '') + (config.url || '');
        if (isExemptUrl(url)) return null;

        const rule = getRule(url);
        if (!rule) return null;

        return buildRuleKey(rule, config);
    }

    function generateLocalId() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return 'ME-' + crypto.randomUUID();
        }
        return 'ME-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
    }

    async function getLocalCatalogCodUpdate() {
        try {
            const rows = await connection.select({
                from: 'credenciales',
                limit: 1
            });
            if (rows && rows.length > 0 && rows[0].CODUPDATE != null && rows[0].CODUPDATE !== '') {
                return rows[0].CODUPDATE.toString();
            }
        } catch (e) {
            // IndexedDB no disponible aún
        }

        if (typeof SelectedLocalCodUpdate !== 'undefined' && SelectedLocalCodUpdate != null && SelectedLocalCodUpdate !== '') {
            return SelectedLocalCodUpdate.toString();
        }

        return '';
    }

    async function fetchServerCatalogCodUpdate() {
        const sucursal = typeof GlobalCodSucursal !== 'undefined' ? GlobalCodSucursal : '';
        const response = await axios.post('/ventas/get_codupdate', { sucursal });
        const data = response.data;

        if (data && data.recordset && data.recordset.length > 0 && data.recordset[0].CODUPDATE != null) {
            return data.recordset[0].CODUPDATE.toString();
        }

        return '';
    }

    async function compareCatalogCodUpdate() {
        const localCode = await getLocalCatalogCodUpdate();
        let serverCode = '';

        try {
            serverCode = await fetchServerCatalogCodUpdate();
        } catch (e) {
            return {
                localCode,
                serverCode: '',
                isUpToDate: false,
                checkFailed: true
            };
        }

        return {
            localCode,
            serverCode,
            isUpToDate: Boolean(localCode && serverCode && localCode === serverCode),
            checkFailed: false
        };
    }

    async function assertCanDownloadCatalog() {
        const comparison = await compareCatalogCodUpdate();

        if (comparison.isUpToDate) {
            throw new Error('Ya descargaste los productos');
        }
    }

    function recordClientesDownload(codven) {
        const userId = codven || getCurrentCodven();
        state[getClientesDayKey(userId)] = new Date().getDate();
        saveState();
    }

    function clientesAlreadyDownloadedRecently(codven) {
        const userId = codven || getCurrentCodven();
        const today = new Date().getDate();
        return Number(state[getClientesDayKey(userId)]) === today;
    }

    function checkRule(rule, key) {
        const now = Date.now();
        const entry = state[key] || { last: 0, hits: [] };

        if (rule.minIntervalMs && now - entry.last < rule.minIntervalMs) {
            const waitSec = Math.ceil((rule.minIntervalMs - (now - entry.last)) / 1000);
            return { allowed: false, reason: `Espere ${waitSec}s antes de repetir esta acción.` };
        }

        if (rule.maxPerWindow && rule.windowMs) {
            const hits = (entry.hits || []).filter((t) => now - t < rule.windowMs);
            if (hits.length >= rule.maxPerWindow) {
                return { allowed: false, reason: 'Demasiados intentos. Intente más tarde.' };
            }
        }

        if (rule.blockConcurrent && inFlight.has(key)) {
            return { allowed: false, reason: 'Ya hay una operación similar en curso.' };
        }

        return { allowed: true };
    }

    function recordSuccess(key, rule) {
        const now = Date.now();
        const entry = state[key] || { last: 0, hits: [] };
        entry.last = now;
        if (rule && rule.maxPerWindow) {
            entry.hits = (entry.hits || []).filter((t) => now - t < rule.windowMs);
            entry.hits.push(now);
        }
        state[key] = entry;
        saveState();
    }

    function canRequest(url, body) {
        if (isExemptUrl(url)) return { allowed: true };

        const rule = getRule(url);
        if (!rule) return { allowed: true };

        const key = buildRuleKey(rule, body || {});
        return checkRule(rule, key);
    }

    function assertCanDownloadClientes() {
        const codven = getCurrentCodven();

        if (clientesAlreadyDownloadedRecently(codven)) {
            throw new Error('La lista de clientes ya fue descargada hoy.');
        }

        const result = canRequest('/clientes/descargar_clientes_ruta', {
            codven: codven,
            sucursal: typeof GlobalCodSucursal !== 'undefined' ? GlobalCodSucursal : ''
        });

        if (!result.allowed) {
            throw new Error(result.reason);
        }
    }

    function installAxiosInterceptors() {
        if (typeof axios === 'undefined') return;

        axios.interceptors.request.use(
            (config) => {
                const url = (config.baseURL || '') + (config.url || '');
                if (isExemptUrl(url)) return config;

                const key = getRequestKey(config);
                if (!key) return config;

                const rule = getRule(url);
                const check = checkRule(rule, key);
                if (!check.allowed) {
                    return Promise.reject(new Error(check.reason || 'Petición bloqueada por ApiGate'));
                }

                if (rule.blockConcurrent) {
                    inFlight.add(key);
                    config._apiGateKey = key;
                    config._apiGateRule = rule;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        axios.interceptors.response.use(
            (response) => {
                const config = response.config || {};
                if (config._apiGateKey) {
                    recordSuccess(config._apiGateKey, config._apiGateRule);
                    inFlight.delete(config._apiGateKey);
                }
                return response;
            },
            (error) => {
                const config = (error && error.config) || {};
                if (config._apiGateKey) {
                    inFlight.delete(config._apiGateKey);
                }
                return Promise.reject(error);
            }
        );
    }

    async function queueVisita(payload) {
        const localId = generateLocalId();
        const record = Object.assign({}, payload, {
            LOCAL_ID: localId,
            CREATED_AT: Date.now()
        });

        await connection.insert({
            into: 'visitas_queue',
            values: [record]
        });

        return { queued: true, local_id: localId };
    }

    async function insertVisita(codclie, motivo, latitud, longitud) {
        const fecha = funciones.getFecha();
        const hora = funciones.getHora();
        const payload = {
            CODSUCURSAL: GlobalCodSucursal,
            CODCLIE: codclie,
            CODEMP: GlobalCodUsuario,
            MOTIVO: motivo,
            HORA: hora,
            FECHA: fecha,
            LAT: String(latitud),
            LONG: String(longitud)
        };

        if (!navigator.onLine) {
            await queueVisita(payload);
            return { rowsAffected: [1], queued: true };
        }

        try {
            const response = await axios.post('/clientes/insert_visita', {
                sucursal: payload.CODSUCURSAL,
                codclie: payload.CODCLIE,
                codemp: payload.CODEMP,
                motivo: payload.MOTIVO,
                hora: payload.HORA,
                fecha: payload.FECHA,
                lat: payload.LAT,
                long: payload.LONG
            });
            return response.data;
        } catch (e) {
            if (!navigator.onLine) {
                await queueVisita(payload);
                return { rowsAffected: [1], queued: true };
            }
            throw e;
        }
    }

    installAxiosInterceptors();

    return {
        generateLocalId,
        canRequest,
        assertCanDownloadCatalog,
        assertCanDownloadClientes,
        compareCatalogCodUpdate,
        getLocalCatalogCodUpdate,
        fetchServerCatalogCodUpdate,
        recordSuccess,
        recordClientesDownload,
        insertVisita,
        queueVisita,
        getRule,
        isExemptUrl
    };
})();
