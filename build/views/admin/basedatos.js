function iniciarVistaAdminBaseDatos() {
    GlobalSelectedForm = 'ADMIN_BD';
    root.innerHTML = `
        <div class="supervisor-page" id="adminBaseDatosPage">
            <div class="supervisor-card">
                <div class="supervisor-card-head-row">
                    <div class="supervisor-card-head mb-0">
                        <h4 class="supervisor-title"><i class="fal fa-database mr-1"></i> Base de datos</h4>
                        <p class="supervisor-subtitle mb-0">Espacio usado por tabla</p>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-primary" id="btnAdminRecargarTablas">
                        <i class="fal fa-sync"></i>
                    </button>
                </div>
                <div class="supervisor-subtitle mt-2 mb-2" id="lbAdminTotalMb"></div>
                <div class="supervisor-table-wrap">
                    <table class="table table-sm table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Tabla</th>
                                <th class="text-right">MB</th>
                            </tr>
                        </thead>
                        <tbody id="tblAdminTablas">
                            <tr><td colspan="2" class="text-center text-muted">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    document.getElementById('btnAdminRecargarTablas').addEventListener('click', cargarTablasAdmin);
    cargarTablasAdmin();
}

function escHtmlAdminBd(v) {
    return String(v == null ? '' : v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

async function cargarTablasAdmin() {
    const tbody = document.getElementById('tblAdminTablas');
    const lb = document.getElementById('lbAdminTotalMb');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="2" class="text-center">${GlobalLoader}</td></tr>`;
    try {
        const response = await axios.post('/admin/tablas', {
            usuario: GlobalUsuario,
            clave: GlobalPassUsuario
        });
        const rows = (response.data && response.data.recordset) ? response.data.recordset : [];
        if (!rows.length) {
            tbody.innerHTML = '<tr><td colspan="2" class="text-center text-muted">Sin tablas</td></tr>';
            if (lb) lb.textContent = '';
            return;
        }
        let total = 0;
        tbody.innerHTML = rows.map((r) => {
            const mb = Number(r.MB) || 0;
            total += mb;
            return `<tr>
                <td>${escHtmlAdminBd(r.TABLA)}</td>
                <td class="text-right">${mb.toFixed(2)}</td>
            </tr>`;
        }).join('');
        if (lb) lb.textContent = `Total usado: ${total.toFixed(2)} MB · ${rows.length} tablas`;
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="2" class="text-center text-danger">No se pudo cargar</td></tr>';
    }
}
