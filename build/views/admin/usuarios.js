let _adminUsuariosRows = [];

function adminPayload() {
    return {
        usuario: GlobalUsuario,
        clave: GlobalPassUsuario
    };
}

function escHtmlAdmin(v) {
    return String(v == null ? '' : v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function iniciarVistaAdminUsuarios() {
    GlobalSelectedForm = 'ADMIN_USUARIOS';
    _adminUsuariosRows = [];
    root.innerHTML = `
        <div class="supervisor-page" id="adminUsuariosPage">
            <div class="supervisor-card">
                <div class="supervisor-card-head">
                    <h4 class="supervisor-title"><i class="fal fa-users mr-1"></i> Usuarios</h4>
                    <p class="supervisor-subtitle mb-0">Lista de ME_USUARIOS por sucursal</p>
                </div>
                <div class="form-group mb-2">
                    <label class="negrita small mb-1">Sucursal</label>
                    <select class="form-control form-control-sm" id="cmbAdminSucursal">
                        <option value="">Cargando...</option>
                    </select>
                </div>
                <div class="supervisor-table-wrap">
                    <table class="table table-sm table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Pass</th>
                                <th>Tipo</th>
                            </tr>
                        </thead>
                        <tbody id="tblAdminUsuarios">
                            <tr><td colspan="3" class="text-center text-muted">Seleccione una sucursal</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalAdminUsuario" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="lbAdminUsuarioTitulo">Usuario</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p class="small text-muted mb-2" id="lbAdminUsuarioMeta"></p>
                        <label class="negrita small">Contraseña</label>
                        <input type="text" class="form-control" id="txtAdminPass" autocomplete="off">
                        <button type="button" class="btn btn-primary btn-block mt-2" id="btnAdminGuardarPass">
                            <i class="fal fa-save"></i> Actualizar contraseña
                        </button>
                        <hr>
                        <button type="button" class="btn btn-warning btn-block" id="btnAdminCorrelativo">
                            <i class="fal fa-sync"></i> Actualizar correlativo
                        </button>
                        <small class="text-muted d-block mt-2" id="lbAdminCoddoc"></small>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('cmbAdminSucursal').addEventListener('change', cargarAdminUsuarios);
    document.getElementById('btnAdminGuardarPass').addEventListener('click', guardarPassAdminUsuario);
    document.getElementById('btnAdminCorrelativo').addEventListener('click', actualizarCorrelativoAdminUsuario);
    cargarSucursalesAdmin();
}

async function cargarSucursalesAdmin() {
    const cmb = document.getElementById('cmbAdminSucursal');
    if (!cmb) return;
    try {
        const response = await axios.post('/admin/sucursales', adminPayload());
        const rows = (response.data && response.data.recordset) ? response.data.recordset : [];
        if (!rows.length) {
            cmb.innerHTML = '<option value="">Sin sucursales</option>';
            return;
        }
        cmb.innerHTML = rows.map((r) =>
            `<option value="${escHtmlAdmin(r.CODSUCURSAL)}">${escHtmlAdmin(r.NOMBRE || r.CODSUCURSAL)}</option>`
        ).join('');
        cargarAdminUsuarios();
    } catch (e) {
        cmb.innerHTML = '<option value="">No se pudo cargar</option>';
    }
}

async function cargarAdminUsuarios() {
    const tbody = document.getElementById('tblAdminUsuarios');
    const cmb = document.getElementById('cmbAdminSucursal');
    if (!tbody || !cmb) return;
    const sucursal = cmb.value;
    if (!sucursal) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Seleccione una sucursal</td></tr>';
        return;
    }
    tbody.innerHTML = `<tr><td colspan="3" class="text-center">${GlobalLoader}</td></tr>`;
    try {
        const response = await axios.post('/admin/usuarios', Object.assign({ sucursal }, adminPayload()));
        const rows = (response.data && response.data.recordset) ? response.data.recordset : [];
        _adminUsuariosRows = rows;
        if (!rows.length) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Sin usuarios</td></tr>';
            return;
        }
        tbody.innerHTML = rows.map((r, i) => `
            <tr class="hand" data-admin-user="${i}">
                <td>${escHtmlAdmin(r.NOMBRE)}</td>
                <td>${escHtmlAdmin(r.PASS)}</td>
                <td>${escHtmlAdmin(r.TIPO)}</td>
            </tr>
        `).join('');
        tbody.querySelectorAll('tr[data-admin-user]').forEach((tr) => {
            tr.addEventListener('click', () => abrirModalAdminUsuario(Number(tr.getAttribute('data-admin-user'))));
        });
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">No se pudo cargar</td></tr>';
    }
}

function usuarioAdminSeleccionado() {
    const idx = Number(document.getElementById('modalAdminUsuario').getAttribute('data-idx'));
    return _adminUsuariosRows[idx] || null;
}

function abrirModalAdminUsuario(index) {
    const row = _adminUsuariosRows[index];
    if (!row) return;
    const modal = document.getElementById('modalAdminUsuario');
    modal.setAttribute('data-idx', String(index));
    document.getElementById('lbAdminUsuarioTitulo').textContent = row.NOMBRE || 'Usuario';
    document.getElementById('lbAdminUsuarioMeta').textContent = `${row.TIPO || ''} · código ${row.CODUSUARIO || ''}`;
    document.getElementById('txtAdminPass').value = row.PASS || '';
    document.getElementById('lbAdminCoddoc').textContent = row.CODDOC
        ? `Correlativo del documento ${row.CODDOC}`
        : 'Este usuario no tiene CODDOC. No se puede actualizar el correlativo.';
    $('#modalAdminUsuario').modal('show');
}

async function guardarPassAdminUsuario() {
    const row = usuarioAdminSeleccionado();
    const cmb = document.getElementById('cmbAdminSucursal');
    const pass = document.getElementById('txtAdminPass').value;
    if (!row || !cmb) return;
    const ok = await funciones.Confirmacion('¿Actualizar la contraseña de este usuario?');
    if (!ok) return;
    try {
        const response = await axios.post('/admin/updatepass', Object.assign({
            sucursal: cmb.value,
            id: row.ID,
            codusuario: row.CODUSUARIO,
            pass
        }, adminPayload()));
        if (!response.data || response.data.toString() === 'error') {
            funciones.AvisoError('No se pudo actualizar la contraseña');
            return;
        }
        row.PASS = pass;
        funciones.Aviso('Contraseña actualizada');
        $('#modalAdminUsuario').modal('hide');
        cargarAdminUsuarios();
    } catch (e) {
        funciones.AvisoError('No se pudo actualizar la contraseña');
    }
}

async function actualizarCorrelativoAdminUsuario() {
    const row = usuarioAdminSeleccionado();
    const cmb = document.getElementById('cmbAdminSucursal');
    if (!row || !cmb) return;
    if (!row.CODDOC) {
        funciones.AvisoError('Este usuario no tiene documento (CODDOC)');
        return;
    }
    const ok = await funciones.Confirmacion(`¿Actualizar el correlativo de ${row.CODDOC} con el último pedido de la sucursal?`);
    if (!ok) return;
    const btn = document.getElementById('btnAdminCorrelativo');
    const html = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fal fa-spinner fa-spin"></i> Actualizando...';
    try {
        const response = await axios.post('/admin/correlativo', Object.assign({
            sucursal: cmb.value,
            coddoc: row.CODDOC
        }, adminPayload()));
        if (!response.data || response.data.toString() === 'error') {
            funciones.AvisoError('No se pudo actualizar el correlativo');
            return;
        }
        funciones.Aviso('Correlativo actualizado');
    } catch (e) {
        funciones.AvisoError('No se pudo actualizar el correlativo');
    } finally {
        btn.disabled = false;
        btn.innerHTML = html;
    }
}
