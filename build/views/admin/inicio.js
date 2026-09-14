function iniciarVistaAdminInicio() {
    GlobalSelectedForm = 'ADMIN';
    root.innerHTML = `
        <div class="supervisor-page" id="adminInicioPage">
            <div class="supervisor-card">
                <div class="supervisor-card-head">
                    <h4 class="supervisor-title"><i class="fal fa-user-shield mr-1"></i> Administración</h4>
                    <p class="supervisor-subtitle mb-0">${GlobalUsuario || 'Superusuario'}</p>
                </div>
                <div class="admin-home-actions">
                    <button type="button" class="btn btn-primary btn-block mb-2" id="btnAdminIrUsuarios">
                        <i class="fal fa-users"></i> Usuarios
                    </button>
                    <button type="button" class="btn btn-info btn-block" id="btnAdminIrBaseDatos">
                        <i class="fal fa-database"></i> Base de datos
                    </button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('btnAdminIrUsuarios').addEventListener('click', () => classNavegar.admin_usuarios());
    document.getElementById('btnAdminIrBaseDatos').addEventListener('click', () => classNavegar.admin_basedatos());
}
