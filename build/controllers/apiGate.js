/**
 * Control central de peticiones al API.
 * Sin tokens: limita frecuencia, evita duplicados en vuelo y encola visitas offline.
 */
const ApiGate = (function () {
    'use strict';

    const STORAGE_KEY = 'me_apigate_state';
    const inFlight = new Set();
    let state = loadState();

    const RULES = [
        { pattern: /\/empleados\/login/i, key: 'login', minIntervalMs: 3000, maxPerWindow: 5, windowMs: 300000 },
        { pattern: /\/ventas\/insertventa/i, key: 'insertventa', minIntervalMs: 2000, blockConcurrent: true },
        { pattern: /\/ventas\/descargar_catalogo/i, key: 'catalogo', oncePerDay: true },
        { pattern: /\/clientes\/descargar_clientes/i, key: 'clientes', minIntervalMs: 3600000 },
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

    function getRule(url) {
        const target = (url || '').toString();
        return RULES.find((rule) => rule.pattern.test(target)) || null;
    }

    function getRequestKey(config) {
        const url = (config.baseURL || '') + (config.url || '');
        const rule = getRule(url);
        if (!rule) return null;
        const body = config.data || {};
        const codven = body.codven || body.codemp || (typeof GlobalCodUsuario !== 'undefined' ? GlobalCodUsuario : '');
        return `${rule.key}:${codven}`;
    }

    function generateLocalId() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return 'ME-' + crypto.randomUUID();
        }
        return 'ME-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
    }

    function catalogAlreadyDownloadedToday() {
        const today = new Date().getDate();
        return Number(state.catalogDay) === today;
    }

    function recordCatalogDownload() {
        state.catalogDay = new Date().getDate();
        saveState();
    }

    function recordClientesDownload() {
        state.clientesDay = new Date().getDate();
        saveState();
    }

    function clientesAlreadyDownloadedRecently() {
        const today = new Date().getDate();
        return Number(state.clientesDay) === today;
    }

    function checkRule(rule, key) {
        const now = Date.now();
        const entry = state[key] || { last: 0, hits: [] };

        if (rule.oncePerDay && catalogAlreadyDownloadedToday()) {
            return { allowed: false, reason: 'El catálogo ya fue descargado hoy.' };
        }

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

    function canRequest(url) {
        const rule = getRule(url);
        if (!rule) return { allowed: true };
        return checkRule(rule, rule.key);
    }

    function assertCanDownloadCatalog() {
        const result = canRequest('/ventas/descargar_catalogo');
        if (!result.allowed) {
            throw new Error(result.reason);
        }
    }

    function assertCanDownloadClientes() {
        if (clientesAlreadyDownloadedRecently()) {
            throw new Error('La lista de clientes ya fue descargada hoy.');
        }
        const result = canRequest('/clientes/descargar_clientes_ruta');
        if (!result.allowed) {
            throw new Error(result.reason);
        }
    }

    function installAxiosInterceptors() {
        if (typeof axios === 'undefined') return;

        axios.interceptors.request.use(
            (config) => {
                const key = getRequestKey(config);
                if (!key) return config;

                const rule = getRule((config.baseURL || '') + (config.url || ''));
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
        recordSuccess,
        recordCatalogDownload,
        recordClientesDownload,
        insertVisita,
        queueVisita,
        getRule
    };
})();
