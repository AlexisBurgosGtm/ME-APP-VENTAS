function getView() {
    const view = {
        body: () => `
            <div class="supervisor-page">
                <div class="supervisor-card">
                    <div class="supervisor-card-head">
                        <h4 class="supervisor-title">Gestión Objetivos</h4>
                        <p class="supervisor-subtitle">Objetivos por marca / vendedor</p>
                    </div>

                    <div class="supervisor-filters">
                        <div class="supervisor-field">
                            <label>Mes</label>
                            <select class="form-control form-control-sm" id="cmbMes"></select>
                        </div>
                        <div class="supervisor-field">
                            <label>Año</label>
                            <select class="form-control form-control-sm" id="cmbAnio"></select>
                        </div>
                        <div class="supervisor-field supervisor-field-action">
                            <label>&nbsp;</label>
                            <button class="btn btn-sm btn-primary shadow hand" id="btnNuevoObjetivo">
                                <i class="fal fa-plus"></i> Nuevo
                            </button>
                        </div>
                    </div>
                </div>

                <div class="tab-content" id="myTabHomeContent">
                    <div class="tab-pane fade show active" id="uno" role="tabpanel">
                        ${view.vista_listado()}
                    </div>
                    <div class="tab-pane fade" id="dos" role="tabpanel">
                        ${view.vista_formulario()}
                    </div>
                </div>

                <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="tab-uno" data-toggle="tab" href="#uno" role="tab">lista</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="tab-dos" data-toggle="tab" href="#dos" role="tab">form</a>
                    </li>
                </ul>
            </div>
        `,
        vista_listado: () => `
            <div class="supervisor-card">
                <div class="supervisor-table-wrap">
                    <table class="table table-sm supervisor-table mb-0">
                        <thead>
                            <tr>
                                <th>Vendedor</th>
                                <th class="text-right">Marcas</th>
                                <th class="text-right">Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="tblObjetivosListado"></tbody>
                    </table>
                </div>
            </div>
        `,
        vista_formulario: () => `
            <div class="supervisor-card">
                <div class="supervisor-card-head supervisor-card-head-row">
                    <div>
                        <h5 class="supervisor-title mb-0" id="lbFormTitulo">Nuevo objetivo</h5>
                        <p class="supervisor-subtitle mb-0" id="lbFormPeriodo"></p>
                    </div>
                    <button class="btn btn-sm btn-outline-secondary hand" id="btnVolverListado">
                        <i class="fal fa-arrow-left"></i>
                    </button>
                </div>

                <div class="supervisor-field mb-2">
                    <label>Vendedor</label>
                    <select class="form-control form-control-sm" id="cmbVendedor"></select>
                </div>

                <div class="supervisor-table-wrap supervisor-objetivos-marcas">
                    <table class="table table-sm supervisor-table mb-0">
                        <thead>
                            <tr>
                                <th>Marca</th>
                                <th class="text-right" style="width:42%">Objetivo (Q)</th>
                            </tr>
                        </thead>
                        <tbody id="tblObjetivosMarcas"></tbody>
                    </table>
                </div>

                <div class="supervisor-objetivos-footer">
                    <div>
                        <span class="supervisor-subtitle d-block mb-0">Total objetivos</span>
                        <strong class="text-danger" id="lbTotalObjetivos">Q 0.00</strong>
                    </div>
                    <button class="btn btn-success btn-sm shadow hand" id="btnGuardarObjetivos">
                        <i class="fal fa-save"></i> Guardar
                    </button>
                </div>
            </div>
        `
    };

    root.innerHTML = view.body();
}

let modoEdicion = false;

function getPeriodo() {
    return {
        mes: Number(document.getElementById('cmbMes').value),
        anio: Number(document.getElementById('cmbAnio').value)
    };
}

function formatQuetzal(valor) {
    return funciones.setMoneda(Number(valor) || 0, 'Q');
}

function actualizarTotalObjetivos() {
    let total = 0;
    document.querySelectorAll('.input-objetivo-marca').forEach((input) => {
        total += Number(input.value) || 0;
    });
    document.getElementById('lbTotalObjetivos').innerText = formatQuetzal(total);
}

function cargarListado() {
    const { mes, anio } = getPeriodo();
    const tbody = document.getElementById('tblObjetivosListado');
    tbody.innerHTML = `<tr><td colspan="4" class="text-center">${GlobalLoader}</td></tr>`;

    axios.post('/objetivos/listado', { mes, anio })
        .then((response) => {
            const data = response.data;
            if (!data || data === 'error' || !data.recordset) {
                tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">No se pudo cargar el listado</td></tr>`;
                return;
            }

            if (!data.recordset.length) {
                tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Sin objetivos para este período</td></tr>`;
                return;
            }

            tbody.innerHTML = data.recordset.map((row) => `
                <tr>
                    <td>
                        <div class="supervisor-cell-title">${row.NOMBRE}</div>
                        <small class="text-muted">Código ${row.CODUSUARIO}</small>
                    </td>
                    <td class="text-right align-middle">${row.MARCAS}</td>
                    <td class="text-right align-middle negrita">${formatQuetzal(row.TOTAL)}</td>
                    <td class="text-right align-middle text-nowrap">
                        <button class="btn btn-sm btn-info btn-circle hand shadow btn-editar-objetivo"
                            data-codusuario="${row.CODUSUARIO}"
                            data-nombre="${encodeURIComponent(row.NOMBRE || '')}">
                            <i class="fal fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-circle hand shadow btn-eliminar-objetivo"
                            data-codusuario="${row.CODUSUARIO}"
                            data-nombre="${encodeURIComponent(row.NOMBRE || '')}">
                            <i class="fal fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');

            tbody.querySelectorAll('.btn-editar-objetivo').forEach((btn) => {
                btn.addEventListener('click', () => {
                    editarObjetivos(
                        Number(btn.getAttribute('data-codusuario')),
                        decodeURIComponent(btn.getAttribute('data-nombre') || '')
                    );
                });
            });

            tbody.querySelectorAll('.btn-eliminar-objetivo').forEach((btn) => {
                btn.addEventListener('click', () => {
                    eliminarObjetivos(
                        Number(btn.getAttribute('data-codusuario')),
                        decodeURIComponent(btn.getAttribute('data-nombre') || '')
                    );
                });
            });
        })
        .catch(() => {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error de conexión</td></tr>`;
        });
}

function cargarVendedores(selected) {
    return axios.post('/objetivos/vendedores', {})
        .then((response) => {
            const data = response.data;
            const cmb = document.getElementById('cmbVendedor');
            if (!data || data === 'error' || !data.recordset) {
                cmb.innerHTML = `<option value="">Sin vendedores</option>`;
                return;
            }

            cmb.innerHTML = data.recordset.map((row) =>
                `<option value="${row.CODUSUARIO}">${row.NOMBRE}</option>`
            ).join('');

            if (selected) {
                cmb.value = selected;
            }
        });
}

function pintarMarcas(rows) {
    const tbody = document.getElementById('tblObjetivosMarcas');
    if (!rows || !rows.length) {
        tbody.innerHTML = `<tr><td colspan="2" class="text-center text-muted">No hay marcas</td></tr>`;
        actualizarTotalObjetivos();
        return;
    }

    tbody.innerHTML = rows.map((row) => `
        <tr>
            <td class="align-middle">
                <div class="supervisor-cell-title">${row.DESMARCA}</div>
                <small class="text-muted">${row.CODMARCA}</small>
            </td>
            <td class="align-middle">
                <div class="input-group input-group-sm supervisor-money-input">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Q</span>
                    </div>
                    <input type="number"
                        class="form-control text-right input-objetivo-marca"
                        min="0"
                        step="0.01"
                        data-codmarca="${row.CODMARCA}"
                        data-desmarca="${encodeURIComponent(row.DESMARCA || '')}"
                        value="${Number(row.OBJETIVO) || 0}">
                </div>
            </td>
        </tr>
    `).join('');

    document.querySelectorAll('.input-objetivo-marca').forEach((input) => {
        input.addEventListener('input', actualizarTotalObjetivos);
        input.addEventListener('change', () => {
            if (input.value === '' || input.value == null) {
                input.value = 0;
            }
            actualizarTotalObjetivos();
        });
    });

    actualizarTotalObjetivos();
}

function cargarFormularioMarcas(codusuario) {
    const { mes, anio } = getPeriodo();
    const tbody = document.getElementById('tblObjetivosMarcas');
    tbody.innerHTML = `<tr><td colspan="2" class="text-center">${GlobalLoader}</td></tr>`;

    axios.post('/objetivos/detalle', { mes, anio, codusuario })
        .then((response) => {
            const data = response.data;
            if (!data || data === 'error' || !data.recordset) {
                tbody.innerHTML = `<tr><td colspan="2" class="text-center text-danger">No se pudieron cargar las marcas</td></tr>`;
                return;
            }
            pintarMarcas(data.recordset);
        })
        .catch(() => {
            tbody.innerHTML = `<tr><td colspan="2" class="text-center text-danger">Error de conexión</td></tr>`;
        });
}

function abrirFormulario(codusuario, nombre) {
    const { mes, anio } = getPeriodo();
    modoEdicion = Boolean(codusuario);

    document.getElementById('lbFormTitulo').innerText = modoEdicion ? 'Editar objetivo' : 'Nuevo objetivo';
    document.getElementById('lbFormPeriodo').innerText =
        `${document.getElementById('cmbMes').selectedOptions[0].text} ${anio}` +
        (nombre ? ` · ${nombre}` : '');

    document.getElementById('tab-dos').click();

    cargarVendedores(codusuario)
        .then(() => {
            const cmb = document.getElementById('cmbVendedor');
            cmb.disabled = modoEdicion;
            const selected = Number(cmb.value);
            if (selected) {
                cargarFormularioMarcas(selected);
            }
        })
        .catch(() => {
            funciones.AvisoError('No se pudieron cargar los vendedores');
        });
}

function editarObjetivos(codusuario, nombre) {
    abrirFormulario(codusuario, nombre);
}

function eliminarObjetivos(codusuario, nombre) {
    const { mes, anio } = getPeriodo();

    funciones.Confirmacion(`¿Eliminar los objetivos de ${nombre} para este período?`)
        .then((value) => {
            if (value !== true) return;

            axios.post('/objetivos/eliminar', { mes, anio, codusuario })
                .then((response) => {
                    if (response.data === 'error') {
                        funciones.AvisoError('No se pudo eliminar');
                        return;
                    }
                    funciones.Aviso('Objetivos eliminados');
                    cargarListado();
                })
                .catch(() => funciones.AvisoError('Error de conexión'));
        });
}

function guardarObjetivos() {
    const { mes, anio } = getPeriodo();
    const cmbVendedor = document.getElementById('cmbVendedor');
    const codusuario = Number(cmbVendedor.value);
    const btn = document.getElementById('btnGuardarObjetivos');

    if (!codusuario) {
        funciones.AvisoError('Seleccione un vendedor');
        return;
    }

    const items = [];
    document.querySelectorAll('.input-objetivo-marca').forEach((input) => {
        items.push({
            codmarca: input.getAttribute('data-codmarca'),
            desmarca: decodeURIComponent(input.getAttribute('data-desmarca') || ''),
            objetivo: input.value === '' || input.value == null ? 0 : Number(input.value)
        });
    });

    if (!items.length) {
        funciones.AvisoError('No hay marcas para guardar');
        return;
    }

    funciones.Confirmacion('¿Guardar objetivos por marca para este vendedor?')
        .then((value) => {
            if (value !== true) return;

            const prevHtml = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = `<i class="fal fa-save fa-spin"></i> Guardando...`;

            axios.post('/objetivos/guardar', { mes, anio, codusuario, items })
                .then((response) => {
                    btn.disabled = false;
                    btn.innerHTML = prevHtml;

                    if (response.data === 'error') {
                        funciones.AvisoError('No se pudo guardar');
                        return;
                    }

                    funciones.Aviso('Objetivos guardados');
                    document.getElementById('tab-uno').click();
                    cargarListado();
                })
                .catch(() => {
                    btn.disabled = false;
                    btn.innerHTML = prevHtml;
                    funciones.AvisoError('Error de conexión');
                });
        });
}

function addListeners() {
    funciones.slideAnimationTabs();

    const f = new Date();
    const cmbMes = document.getElementById('cmbMes');
    const cmbAnio = document.getElementById('cmbAnio');

    cmbMes.innerHTML = funciones.ComboMeses();
    cmbAnio.innerHTML = funciones.ComboAnio();
    cmbMes.value = f.getMonth() + 1;
    cmbAnio.value = f.getFullYear();

    cmbMes.addEventListener('change', cargarListado);
    cmbAnio.addEventListener('change', cargarListado);

    document.getElementById('btnNuevoObjetivo').addEventListener('click', () => {
        abrirFormulario(null, null);
    });

    document.getElementById('btnVolverListado').addEventListener('click', () => {
        document.getElementById('tab-uno').click();
        cargarListado();
    });

    document.getElementById('cmbVendedor').addEventListener('change', () => {
        const codusuario = Number(document.getElementById('cmbVendedor').value);
        if (codusuario) {
            cargarFormularioMarcas(codusuario);
        }
    });

    document.getElementById('btnGuardarObjetivos').addEventListener('click', guardarObjetivos);

    cargarListado();
}

function initView() {
    getView();
    addListeners();
}
