/**
 * Registro de visitas — vendedor (solo su CODEMP) y supervisor (toda la sucursal).
 * Uso: iniciarVistaRegistroVisitas({ supervisor: false|true })
 */
let _registroVisitasCache = [];
let _registroVisitasIsSuper = false;

const MOTIVOS_VISITA_BASE = [
    'TIENDA CERRADA',
    'NO TIENE DINERO',
    'NO HABIA PASO',
    'TIENE PRODUCTO',
    'VENTA'
];

function getFechaVisitasGuatemala() {
    try {
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Guatemala',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date());
    } catch (e) {
        const f = new Date();
        return `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`;
    }
}

function formatFechaVisitaUi(fecha) {
    const s = String(fecha || '');
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    return s;
}

function escAttrVisita(v) {
    return String(v == null ? '' : v)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '&quot;');
}

function escHtmlVisita(v) {
    return String(v == null ? '' : v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function clienteTextoVisita(r) {
    return `${r.NEGOCIO ? r.NEGOCIO + ' // ' : ''}${r.CLIENTE || r.CODCLIENTE || ''}`;
}

function iniciarVistaRegistroVisitas(options) {
    const isSuper = !!(options && options.supervisor);
    _registroVisitasIsSuper = isSuper;
    _registroVisitasCache = [];
    GlobalSelectedForm = isSuper ? 'SUPERVISOR_VISITAS' : 'VENDEDOR_VISITAS';
    const hoy = getFechaVisitasGuatemala();

    root.innerHTML = `
        <div class="${isSuper ? 'supervisor-page' : 'modern-dashboard-shell'} w-100" id="registroVisitasPage">
            <div class="${isSuper ? 'supervisor-card' : 'glass-card'} p-3">
                <div class="${isSuper ? 'supervisor-card-head' : 'mb-3'}">
                    <h4 class="${isSuper ? 'supervisor-title' : 'mb-1'}">
                        <i class="fal fa-clipboard-list mr-2"></i>Registro visitas
                    </h4>
                    <p class="${isSuper ? 'supervisor-subtitle mb-0' : 'text-muted small mb-0'}">
                        ${isSuper
                            ? 'Visitas de la sucursal por rango de fechas'
                            : 'Tus visitas registradas por rango de fechas'}
                    </p>
                </div>

                <div class="row mb-2">
                    <div class="col-5">
                        <label class="negrita small mb-1">Fecha inicial</label>
                        <input type="date" class="form-control form-control-sm" id="txtVisitasFechaIni" value="${hoy}">
                    </div>
                    <div class="col-5">
                        <label class="negrita small mb-1">Fecha final</label>
                        <input type="date" class="form-control form-control-sm" id="txtVisitasFechaFin" value="${hoy}">
                    </div>
                    <div class="col-2 d-flex align-items-end">
                        <button class="btn btn-info btn-sm btn-block" id="btnVisitasFiltrar" title="Filtrar">
                            <i class="fal fa-search"></i>
                        </button>
                    </div>
                </div>

                ${isSuper ? `
                <div class="row mb-2">
                    <div class="col-6">
                        <label class="negrita small mb-1">Empleado</label>
                        <select class="form-control form-control-sm" id="cmbVisitasEmpleado">
                            <option value="">Todos</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <label class="negrita small mb-1">Motivo</label>
                        <select class="form-control form-control-sm" id="cmbVisitasMotivo">
                            <option value="">Todos</option>
                        </select>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-12">
                        <label class="negrita small mb-1">Buscar cliente</label>
                        <input type="search" class="form-control form-control-sm" id="txtVisitasBuscar"
                            placeholder="Nombre o negocio..." autocomplete="off">
                    </div>
                </div>
                <div class="registro-visitas-totales mb-3" id="boxVisitasTotales">
                    <div class="registro-visitas-total-main">
                        Total: <strong id="lbVisitasTotal">0</strong>
                    </div>
                    <div class="registro-visitas-total-motivos" id="lbVisitasTotalesMotivo"></div>
                </div>
                ` : ''}

                <div class="table-responsive supervisor-table-wrap">
                    <table class="table table-sm table-striped table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                ${isSuper ? '<th>Empleado</th>' : ''}
                                <th>Cliente</th>
                                <th>Motivo</th>
                                <th class="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tblRegistroVisitas">
                            <tr><td colspan="${isSuper ? 6 : 5}" class="text-center text-muted">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btnVisitasFiltrar').addEventListener('click', () => cargarListaRegistroVisitas(isSuper));
    document.getElementById('txtVisitasFechaIni').addEventListener('change', () => cargarListaRegistroVisitas(isSuper));
    document.getElementById('txtVisitasFechaFin').addEventListener('change', () => cargarListaRegistroVisitas(isSuper));

    if (isSuper) {
        const cmbEmp = document.getElementById('cmbVisitasEmpleado');
        const cmbMot = document.getElementById('cmbVisitasMotivo');
        const txtBuscar = document.getElementById('txtVisitasBuscar');
        cmbEmp.addEventListener('change', () => aplicarFiltrosRegistroVisitas());
        cmbMot.addEventListener('change', () => aplicarFiltrosRegistroVisitas());
        let buscarTimer = null;
        txtBuscar.addEventListener('input', () => {
            clearTimeout(buscarTimer);
            buscarTimer = setTimeout(() => aplicarFiltrosRegistroVisitas(), 180);
        });
    }

    cargarListaRegistroVisitas(isSuper);
}

function actualizarSelectsRegistroVisitas(rows) {
    const cmbEmp = document.getElementById('cmbVisitasEmpleado');
    const cmbMot = document.getElementById('cmbVisitasMotivo');
    if (!cmbEmp || !cmbMot) return;

    const prevEmp = cmbEmp.value;
    const prevMot = cmbMot.value;

    const empMap = new Map();
    const motivosSet = new Set(MOTIVOS_VISITA_BASE);
    (rows || []).forEach((r) => {
        const cod = Number(r.CODEMP) || 0;
        if (cod > 0 && !empMap.has(cod)) {
            empMap.set(cod, r.EMPLEADO || ('#' + cod));
        }
        const mot = String(r.MOTIVO || '').trim();
        if (mot) motivosSet.add(mot);
    });

    const empOpts = ['<option value="">Todos</option>'];
    Array.from(empMap.entries())
        .sort((a, b) => String(a[1]).localeCompare(String(b[1]), 'es'))
        .forEach(([cod, nom]) => {
            empOpts.push(`<option value="${cod}">${escHtmlVisita(nom)}</option>`);
        });
    cmbEmp.innerHTML = empOpts.join('');
    if (prevEmp && empMap.has(Number(prevEmp))) cmbEmp.value = prevEmp;

    const motOpts = ['<option value="">Todos</option>'];
    Array.from(motivosSet)
        .sort((a, b) => a.localeCompare(b, 'es'))
        .forEach((m) => {
            motOpts.push(`<option value="${escHtmlVisita(m)}">${escHtmlVisita(m)}</option>`);
        });
    cmbMot.innerHTML = motOpts.join('');
    if (prevMot && motivosSet.has(prevMot)) cmbMot.value = prevMot;
}

function obtenerFilasFiltradasRegistroVisitas() {
    let rows = Array.isArray(_registroVisitasCache) ? _registroVisitasCache.slice() : [];
    if (!_registroVisitasIsSuper) return rows;

    const cmbEmp = document.getElementById('cmbVisitasEmpleado');
    const cmbMot = document.getElementById('cmbVisitasMotivo');
    const txtBuscar = document.getElementById('txtVisitasBuscar');

    const emp = cmbEmp ? String(cmbEmp.value || '').trim() : '';
    const mot = cmbMot ? String(cmbMot.value || '').trim().toUpperCase() : '';
    const q = txtBuscar ? String(txtBuscar.value || '').trim().toLowerCase() : '';

    if (emp) {
        const empN = Number(emp);
        rows = rows.filter((r) => Number(r.CODEMP) === empN);
    }
    if (mot) {
        rows = rows.filter((r) => String(r.MOTIVO || '').trim().toUpperCase() === mot);
    }
    if (q) {
        rows = rows.filter((r) => {
            const txt = `${r.NEGOCIO || ''} ${r.CLIENTE || ''} ${r.CODCLIENTE || ''} ${r.EMPLEADO || ''}`.toLowerCase();
            return txt.includes(q);
        });
    }
    return rows;
}

function actualizarTotalesRegistroVisitas(rows) {
    const lbTotal = document.getElementById('lbVisitasTotal');
    const lbMotivos = document.getElementById('lbVisitasTotalesMotivo');
    if (!lbTotal || !lbMotivos) return;

    const list = rows || [];
    lbTotal.textContent = String(list.length);

    const counts = {};
    list.forEach((r) => {
        const m = String(r.MOTIVO || '').trim() || 'SIN MOTIVO';
        counts[m] = (counts[m] || 0) + 1;
    });

    const keys = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b, 'es'));
    if (!keys.length) {
        lbMotivos.innerHTML = '';
        return;
    }

    lbMotivos.innerHTML = keys.map((k) =>
        `<span class="registro-visitas-chip"><b>${counts[k]}</b> ${escHtmlVisita(k)}</span>`
    ).join('');
}

function pintarTablaRegistroVisitas(rows) {
    const tbody = document.getElementById('tblRegistroVisitas');
    if (!tbody) return;
    const isSuper = _registroVisitasIsSuper;
    const cols = isSuper ? 6 : 5;

    if (!rows || !rows.length) {
        tbody.innerHTML = `<tr><td colspan="${cols}" class="text-center text-muted">Sin visitas con los filtros actuales</td></tr>`;
        return;
    }

    let html = '';
    rows.forEach((r) => {
        const codClie = escAttrVisita(r.CODCLIENTE);
        const motivo = escAttrVisita(r.MOTIVO);
        const hora = escAttrVisita(r.HORA);
        const fecha = escAttrVisita(r.FECHA);
        const codemp = Number(r.CODEMP) || 0;
        const lat = Number(r.LAT) || 0;
        const long = Number(r.LONG) || 0;
        const clienteTxt = escHtmlVisita(clienteTextoVisita(r));

        html += `<tr>
            <td>${formatFechaVisitaUi(r.FECHA)}</td>
            <td>${escHtmlVisita(r.HORA || '')}</td>
            ${isSuper ? `<td>${escHtmlVisita(r.EMPLEADO || ('#' + codemp))}</td>` : ''}
            <td>${clienteTxt}</td>
            <td><span class="negrita">${escHtmlVisita(r.MOTIVO || '')}</span></td>
            <td class="text-center text-nowrap">
                ${isSuper ? `
                <button class="btn btn-sm btn-outline-primary btn-circle mr-1" title="Ver en mapa"
                    onclick="abrirMapaVisitaRegistro(${lat},${long})">
                    <i class="fal fa-map-marker-alt"></i>
                </button>` : ''}
                <button class="btn btn-sm btn-danger btn-circle" title="Eliminar visita"
                    onclick="eliminarRegistroVisita('${fecha}','${hora}',${codemp},'${codClie}','${motivo}',${isSuper ? 'true' : 'false'})">
                    <i class="fal fa-trash"></i>
                </button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

function aplicarFiltrosRegistroVisitas() {
    const filtered = obtenerFilasFiltradasRegistroVisitas();
    pintarTablaRegistroVisitas(filtered);
    if (_registroVisitasIsSuper) {
        actualizarTotalesRegistroVisitas(filtered);
    }
}

async function cargarListaRegistroVisitas(isSuper) {
    const tbody = document.getElementById('tblRegistroVisitas');
    if (!tbody) return;
    _registroVisitasIsSuper = !!isSuper;
    const cols = isSuper ? 6 : 5;
    tbody.innerHTML = `<tr><td colspan="${cols}" class="text-center">${GlobalLoader}</td></tr>`;

    const normalize = (v) => {
        const m = String(v || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
        return m ? `${m[1]}-${m[2]}-${m[3]}` : getFechaVisitasGuatemala();
    };
    let ini = normalize(document.getElementById('txtVisitasFechaIni').value);
    let fin = normalize(document.getElementById('txtVisitasFechaFin').value);
    if (ini > fin) {
        const tmp = ini; ini = fin; fin = tmp;
        document.getElementById('txtVisitasFechaIni').value = ini;
        document.getElementById('txtVisitasFechaFin').value = fin;
    }

    const payload = {
        sucursal: GlobalCodSucursal,
        fechaini: ini,
        fechafin: fin,
        _: Date.now()
    };
    if (!isSuper) {
        payload.codemp = GlobalCodUsuario;
    }

    try {
        const response = await axios.post('/clientes/list_visitas', payload, {
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        const data = response.data;
        if (!data || data.toString() === 'error' || !data.recordset) {
            _registroVisitasCache = [];
            tbody.innerHTML = `<tr><td colspan="${cols}" class="text-center text-danger">No se pudo cargar</td></tr>`;
            if (isSuper) actualizarTotalesRegistroVisitas([]);
            return;
        }

        _registroVisitasCache = Array.isArray(data.recordset) ? data.recordset : [];

        if (isSuper) {
            actualizarSelectsRegistroVisitas(_registroVisitasCache);
        }

        if (!_registroVisitasCache.length) {
            tbody.innerHTML = `<tr><td colspan="${cols}" class="text-center text-muted">Sin visitas en el rango</td></tr>`;
            if (isSuper) actualizarTotalesRegistroVisitas([]);
            return;
        }

        aplicarFiltrosRegistroVisitas();
    } catch (e) {
        console.log(e);
        _registroVisitasCache = [];
        tbody.innerHTML = `<tr><td colspan="${cols}" class="text-center text-danger">Error de conexión</td></tr>`;
        if (isSuper) actualizarTotalesRegistroVisitas([]);
    }
}

function abrirMapaVisitaRegistro(lat, long) {
    const la = Number(lat) || 0;
    const lo = Number(long) || 0;
    if (!la && !lo) {
        funciones.AvisoError('El vendedor no tenía disponible la ubicación cuando la registró');
        return;
    }
    funciones.gotoGoogleMaps(la, lo);
}

async function eliminarRegistroVisita(fecha, hora, codemp, codclie, motivo, isSuperFlag) {
    const isSuper = isSuperFlag === true || isSuperFlag === 'true';
    const ok = await funciones.Confirmacion('¿Eliminar esta visita? El cliente volverá a pendientes.');
    if (!ok) return;

    try {
        const response = await axios.post('/clientes/delete_visita', {
            sucursal: GlobalCodSucursal,
            fecha,
            hora,
            codemp,
            codclie,
            motivo,
            _: Date.now()
        }, {
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });

        const data = response.data;
        if (!data || data.toString() === 'error') {
            funciones.AvisoError('No se pudo eliminar la visita');
            return;
        }

        let fechaRevertida = '';
        try {
            if (data.recordset && data.recordset[0] && data.recordset[0].FECHA_REVERTIDA) {
                fechaRevertida = String(data.recordset[0].FECHA_REVERTIDA).substring(0, 10);
            }
        } catch (e) {}

        if (!fechaRevertida) {
            // fallback local: día anterior a la fecha de la visita
            const p = String(fecha).split('-');
            if (p.length === 3) {
                const d = new Date(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2])));
                d.setUTCDate(d.getUTCDate() - 1);
                fechaRevertida = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
            } else {
                fechaRevertida = getFechaVisitasGuatemala();
            }
        }

        if (typeof revertSaleCliente === 'function') {
            try { await revertSaleCliente(codclie, fechaRevertida); } catch (e) {}
        }

        funciones.Aviso('Visita eliminada');
        cargarListaRegistroVisitas(isSuper);
    } catch (e) {
        console.log(e);
        funciones.AvisoError('No se pudo eliminar la visita');
    }
}
