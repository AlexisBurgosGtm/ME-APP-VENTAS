let classNavegar = {
    login : async(historial)=>{
        divUsuario.innerText = 'DESCONECTADO';
        lbTipo.innerText = "Inicie sesión";
        rootMenu.innerHTML = '';
        GlobalCoddoc = '';
        GlobalCodUsuario=99999;
        GlobalUsuario = '';
        GlobalPassUsuario = '';
        GlobalTipoUsuario ='';
        document.body.classList.remove('supervisor-active');
        classNavegar.removeFloatingMenu();
        
            funciones.loadScript('../views/login/index.js','root')
            .then(()=>{
                GlobalSelectedForm='LOGIN';
                InicializarVista();

                rootMenuFooter.innerHTML = '<b class="text-white">Mercados Efectivos</b>';
                if(historial=='SI'){

                }else{
                    //window.history.pushState({"page":0}, "login", GlobalUrl + '/login')
                }

                document.getElementById('btnPedidosPend').style="visibility:hidden";
                
            })
        
            
    },
    inicio : async(tipousuario)=>{
        document.body.classList.remove('login-active');
        document.body.classList.remove('supervisor-active');
        divUsuario.innerText = GlobalUsuario;
        lbTipo.innerText = GlobalTipoUsuario;
        if (typeof updateHeaderUserBadge === 'function') updateHeaderUserBadge(GlobalUsuario);

        switch (tipousuario) {
            case 'VENDEDOR':
                classNavegar.inicioVendedor();
                break;
            default:
                funciones.AvisoError('Esta aplicación es solo para VENTAS');
                break;
        };
    },
    inicioProgramador: ()=>{
        funciones.loadScript('../views/programador.js','root')
        .then(async()=>{
            GlobalSelectedForm='DEVELOPER';
            InicializarVista();
        })
    },
    removeFloatingMenu() {
        if (classNavegar._menuViewportCleanup) {
            classNavegar._menuViewportCleanup();
            classNavegar._menuViewportCleanup = null;
        }
        const existing = document.getElementById('vendorMenuShell');
        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }
        if (typeof rootMenuFooter !== 'undefined' && rootMenuFooter) {
            rootMenuFooter.innerHTML = '';
        }
    },
    syncFloatingMenuToViewport() {
        const shell = document.getElementById('vendorMenuShell');
        if (!shell) return;

        const isSmall = window.innerWidth <= 576;
        const gap = isSmall ? 20 : 16;
        let bottomPx = gap;

        const vv = window.visualViewport;
        if (vv) {
            // Compensa la barra del navegador / viewport visual más corto que el layout
            const hiddenBelow = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
            bottomPx = gap + hiddenBelow;
        }

        shell.style.setProperty('bottom', bottomPx + 'px', 'important');
        shell.style.setProperty('left', (isSmall ? 0.65 : 0.75) + 'rem', 'important');
        shell.style.setProperty('top', 'auto', 'important');
        shell.style.setProperty('right', 'auto', 'important');

        // Panel: alto máximo hasta el header (scroll solo si no caben todos los items)
        const panel = document.getElementById('vendorMenuPanel');
        if (panel) {
            const shellTop = shell.getBoundingClientRect().top;
            const header = document.querySelector('.page-header') || document.querySelector('header') || document.getElementById('header');
            let headerBottom = 0;
            if (header) {
                headerBottom = header.getBoundingClientRect().bottom;
            } else if (vv) {
                headerBottom = (vv.offsetTop || 0) + 64;
            } else {
                headerBottom = 64;
            }
            const gapTop = 10;
            const available = Math.floor(shellTop - headerBottom - gapTop);
            const maxH = Math.max(220, available);
            panel.style.setProperty('max-height', maxH + 'px', 'important');
        }
    },
    bindFloatingMenuViewport() {
        if (classNavegar._menuViewportCleanup) {
            classNavegar._menuViewportCleanup();
        }

        const sync = () => classNavegar.syncFloatingMenuToViewport();
        sync();

        const vv = window.visualViewport;
        if (vv) {
            vv.addEventListener('resize', sync);
            vv.addEventListener('scroll', sync);
        }
        window.addEventListener('resize', sync);
        window.addEventListener('orientationchange', sync);

        classNavegar._menuViewportCleanup = () => {
            if (vv) {
                vv.removeEventListener('resize', sync);
                vv.removeEventListener('scroll', sync);
            }
            window.removeEventListener('resize', sync);
            window.removeEventListener('orientationchange', sync);
        };
    },
    setupMenuFooter(options = {}) {
        const {
            itemsHtml = '',
            showPedidosPend = true,
            onReady = null,
            autoNavigateId = null,
            bindEvents = null
        } = options;

        classNavegar.removeFloatingMenu();

        const strFooter = `
            <div class="vendor-menu-shell" id="vendorMenuShell">
                <button class="vendor-menu-toggle" id="btnToggleMenuVendedor" type="button">
                    <i class="fal fa-bars"></i> Menu
                </button>
                <div class="vendor-menu-panel" id="vendorMenuPanel">
                    <div class="vendor-menu-panel-head">
                        <span>Menú</span>
                    </div>
                    ${itemsHtml}
                </div>
            </div>
        `;

        // Montado en body para que quede fijo al viewport (no atrapado por el footer)
        const wrap = document.createElement('div');
        wrap.innerHTML = strFooter;
        document.body.appendChild(wrap.firstElementChild);

        if (typeof rootMenuFooter !== 'undefined' && rootMenuFooter) {
            rootMenuFooter.innerHTML = '';
        }

        classNavegar.bindFloatingMenuViewport();

        const vendorMenuPanel = document.getElementById('vendorMenuPanel');
        const btnToggleMenuVendedor = document.getElementById('btnToggleMenuVendedor');

        btnToggleMenuVendedor.addEventListener('click', () => {
            classNavegar.syncFloatingMenuToViewport();
            vendorMenuPanel.classList.toggle('open');
        });

        document.addEventListener('click', (event) => {
            if (!vendorMenuPanel.contains(event.target) && !btnToggleMenuVendedor.contains(event.target)) {
                vendorMenuPanel.classList.remove('open');
            }
        });

        const closeMenu = () => vendorMenuPanel.classList.remove('open');

        if (bindEvents) {
            bindEvents({ closeMenu });
        }

        document.getElementById('btnPedidosPend').style = showPedidosPend
            ? 'visibility:visible'
            : 'visibility:hidden';

        if (onReady) {
            return Promise.resolve(onReady({ closeMenu })).then(() => {
                classNavegar.syncFloatingMenuToViewport();
                if (autoNavigateId) {
                    const autoBtn = document.getElementById(autoNavigateId);
                    if (autoBtn) autoBtn.click();
                }
            });
        }

        if (autoNavigateId) {
            const autoBtn = document.getElementById(autoNavigateId);
            if (autoBtn) autoBtn.click();
        }
    },
    inicioVendedor : async ()=>{
        document.body.classList.remove('login-active');
        document.body.classList.remove('supervisor-active');
        if (typeof divUsuario !== 'undefined' && divUsuario) divUsuario.innerText = GlobalUsuario;
        if (typeof lbTipo !== 'undefined' && lbTipo) lbTipo.innerText = GlobalTipoUsuario || 'VENDEDOR';
        if (typeof updateHeaderUserBadge === 'function') updateHeaderUserBadge(GlobalUsuario);

        const vendedorItems = `
                    <button class="vendor-menu-item" id="btnMenu2VendedorClientesMapa">
                        <i class="fal fa-map"></i>
                        <span>Mapa</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2VendedorClientes">
                        <i class="fal fa-shopping-cart"></i>
                        <span>Cliente</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2VendedorVisitas">
                        <i class="fal fa-clipboard-list"></i>
                        <span>Registro visitas</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2Censo">
                        <i class="fal fa-edit"></i>
                        <span>Censo</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2VendedorLogro">
                        <i class="fal fa-chart-pie"></i>
                        <span>Logro</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2VendedorLogroReal">
                        <i class="fal fa-chart-bar"></i>
                        <span>Objetivos</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2Configuraciones">
                        <i class="fal fa-cog"></i>
                        <span>Configuración</span>
                    </button>
        `;

        await classNavegar.setupMenuFooter({
            itemsHtml: vendedorItems,
            showPedidosPend: true,
            autoNavigateId: 'btnMenu2VendedorClientes',
            bindEvents: ({ closeMenu }) => {
                document.getElementById('btnMenu2VendedorClientes').addEventListener('click', () => {
                    closeMenu();
                    detener_efecto();
                    classNavegar.inicioVendedorListado();
                });

                document.getElementById('btnMenu2VendedorVisitas').addEventListener('click', () => {
                    closeMenu();
                    detener_efecto();
                    classNavegar.vendedor_registro_visitas();
                });

                document.getElementById('btnMenu2VendedorClientesMapa').addEventListener('click', () => {
                    closeMenu();
                    detener_efecto();
                    classNavegar.ventasMapaClientes();
                });

                document.getElementById('btnMenu2VendedorLogro').addEventListener('click', () => {
                    closeMenu();
                    detener_efecto();
                    classNavegar.logrovendedor();
                });

                document.getElementById('btnMenu2Censo').addEventListener('click', () => {
                    closeMenu();
                    detener_efecto();
                    classNavegar.inicio_censo();
                });

                document.getElementById('btnMenu2Configuraciones').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.ConfigVendedor();
                });

                document.getElementById('btnMenu2VendedorLogroReal').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.vendedor_reportes();
                });
            },
            onReady: async () => {
                await classEmpleados.updateMyLocation();
            }
        });
    },
    inicioVendedorListado :async ()=>{
        funciones.loadScript('../views/vendedor/clientes.js','root')
        .then(async()=>{

            //efecto nieve
            detener_efecto();

            GlobalSelectedForm='INICIO';
          
            InicializarVista();
            window.history.pushState({"page":1}, "clientes", '/clientes');
        })
    },
    inicio_censo :async ()=>{
        funciones.loadScript('../views/vendedor/censo.js','root')
        .then(async()=>{
            
           

            GlobalSelectedForm='INICIO';
            InicializarVista();
            window.history.pushState({"page":5}, "censo", '/censo');
        })
    },
    ventas: async(nit,nombre,direccion)=>{
        
            funciones.loadScript('./views/vendedor/facturacion.js','root')
            .then(()=>{
               
                //efecto nieve
                detener_efecto();
                
                GlobalSelectedForm ='VENTAS';
                iniciarVistaVentas(nit,nombre,direccion);
                window.history.pushState({"page":2}, "facturacion", GlobalUrl + '/facturacion')
            })
          
    },
    vendedorCenso: async()=>{
        
         //efecto nieve
         detener_efecto();
               

        funciones.loadScript('./views/vendedor/censo.js','root')
        .then(()=>{
            GlobalSelectedForm ='VENDEDORCENSO';
            iniciarVistaVendedorCenso();
        })
      
    },
    vendedor_reportes: async()=>{
        
        //efecto nieve
        detener_efecto();
               

        funciones.loadScript('./views/reportes/view_reportes.js','root')
        .then(()=>{
            GlobalSelectedForm ='REPORTES';
            initView();
        })
      
    },
    ventasMapaClientes: async(historial)=>{
        //efecto nieve
        detener_efecto();

        funciones.loadScript('./views/vendedor/mapaclientes.js','root')
        .then(()=>{
             
            
               
            GlobalSelectedForm ='VENDEDORMAPACLIENTES';
            iniciarVistaVendedorMapaClientes();
            if(historial=='SI'){

            }else{
            window.history.pushState({"page":3}, "mapaclientes", GlobalUrl + '/mapaclientes')
            }
        })
    },
    vendedorReparto: async()=>{
        
        funciones.loadScript('./views/vendedor/reparto.js','root')
        .then(()=>{
            GlobalSelectedForm ='VENDEDORREPARTO';
            iniciarVistaVendedorReparto();
        })
      
    },
    pedidos: async (historial)=>{
        funciones.loadScript('../views/pedidos/vendedor.js','root')
        .then(()=>{
            GlobalSelectedForm='PEDIDOS';
            inicializarVistaPedidos();
            if(historial=='SI'){

            }else{
            window.history.pushState({"page":4}, "logro", GlobalUrl + '/logro')
            }
        })             
    },
    logrovendedor: (historial)=>{
        //efecto nieve
        detener_efecto();
        
        funciones.loadScript('../views/vendedor/logro.js','root')
            .then(()=>{
                GlobalSelectedForm='LOGROVENDEDOR';
                inicializarVistaLogro();
                if(historial=='SI'){

                }else{
                window.history.pushState({"page":5}, "logromes", GlobalUrl + '/logromes')
                }
        })
    },
    ConfigVendedor: ()=>{
        funciones.loadScript('../views/config.js','root')
        .then(()=>{
            GlobalSelectedForm='CONFIG';
            initView();
        })
    },
    inicio_superusuario: async () => {
        document.body.classList.remove('login-active');
        document.body.classList.add('supervisor-active');
        if (typeof divUsuario !== 'undefined' && divUsuario) divUsuario.innerText = GlobalUsuario;
        if (typeof lbTipo !== 'undefined' && lbTipo) lbTipo.innerText = GlobalTipoUsuario || 'SUPERUSUARIO';
        if (typeof updateHeaderUserBadge === 'function') updateHeaderUserBadge(GlobalUsuario);

        const items = `
                    <button class="vendor-menu-item" id="btnMenu2AdminInicio">
                        <i class="fal fa-home"></i>
                        <span>Inicio</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2AdminUsuarios">
                        <i class="fal fa-users"></i>
                        <span>Usuarios</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2AdminBaseDatos">
                        <i class="fal fa-database"></i>
                        <span>Base de datos</span>
                    </button>
        `;

        await classNavegar.setupMenuFooter({
            itemsHtml: items,
            showPedidosPend: false,
            autoNavigateId: 'btnMenu2AdminInicio',
            bindEvents: ({ closeMenu }) => {
                document.getElementById('btnMenu2AdminInicio').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.admin_inicio();
                });
                document.getElementById('btnMenu2AdminUsuarios').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.admin_usuarios();
                });
                document.getElementById('btnMenu2AdminBaseDatos').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.admin_basedatos();
                });
            }
        });
    },
    admin_inicio: () => {
        funciones.loadScript('./views/admin/inicio.js', 'root')
            .then(() => iniciarVistaAdminInicio());
    },
    admin_usuarios: () => {
        funciones.loadScript('./views/admin/usuarios.js', 'root')
            .then(() => iniciarVistaAdminUsuarios());
    },
    admin_basedatos: () => {
        funciones.loadScript('./views/admin/basedatos.js', 'root')
            .then(() => iniciarVistaAdminBaseDatos());
    },
    inicio_supervisor : async ()=>{
        document.body.classList.remove('login-active');
        document.body.classList.add('supervisor-active');
        if (typeof divUsuario !== 'undefined' && divUsuario) divUsuario.innerText = GlobalUsuario;
        if (typeof lbTipo !== 'undefined' && lbTipo) lbTipo.innerText = GlobalTipoUsuario || 'SUPERVISOR';
        if (typeof updateHeaderUserBadge === 'function') updateHeaderUserBadge(GlobalUsuario);

        const supervisorItems = `
                    <button class="vendor-menu-item" id="btnMenu2SuperMapa">
                        <i class="fal fa-map-marker-alt"></i>
                        <span>Gps</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2SuperVentas">
                        <i class="fal fa-chart-line"></i>
                        <span>Reportes</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2SuperCobertura">
                        <i class="fal fa-user"></i>
                        <span>Cobertura</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2SuperHorarios">
                        <i class="fal fa-clock"></i>
                        <span>Horarios</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2SuperPrecios">
                        <i class="fal fa-box"></i>
                        <span>Precios</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2SuperCotizaciones">
                        <i class="fal fa-file-alt"></i>
                        <span>Cotizaciones</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2SuperVisitas">
                        <i class="fal fa-clipboard-list"></i>
                        <span>Registro visitas</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2SuperUsuarios">
                        <i class="fal fa-unlock"></i>
                        <span>Usuarios</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2SuperLogroObjetivos">
                        <i class="fal fa-chart-pie"></i>
                        <span>Logro de Objetivos</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2SuperObjetivos">
                        <i class="fal fa-bullseye"></i>
                        <span>Gestión Objetivos</span>
                    </button>
        `;

        await classNavegar.setupMenuFooter({
            itemsHtml: supervisorItems,
            showPedidosPend: false,
            autoNavigateId: 'btnMenu2SuperVentas',
            bindEvents: ({ closeMenu }) => {
                document.getElementById('btnMenu2SuperMapa').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.supervisor_mapa();
                });

                document.getElementById('btnMenu2SuperVentas').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.supervisor_ventas();
                });

                document.getElementById('btnMenu2SuperCobertura').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.supervisor_cobertura();
                });

                document.getElementById('btnMenu2SuperHorarios').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.supervisor_horarios();
                });

                document.getElementById('btnMenu2SuperPrecios').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.supervisor_precios();
                });

                document.getElementById('btnMenu2SuperCotizaciones').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.supervisor_cotizaciones();
                });

                document.getElementById('btnMenu2SuperVisitas').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.supervisor_registro_visitas();
                });

                document.getElementById('btnMenu2SuperUsuarios').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.supervisor_usuarios();
                });

                document.getElementById('btnMenu2SuperLogroObjetivos').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.supervisor_logro_objetivos();
                });

                document.getElementById('btnMenu2SuperObjetivos').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.supervisor_objetivos();
                });
            },
            onReady: async () => {
                await classEmpleados.updateMyLocation();
                updateDateDownload();
            }
        });
    },
    supervisor_ventas:()=>{
        funciones.loadScript('./views/supervisor/ventas.js','root')
        .then(()=>{
            GlobalSelectedForm ='SUPERVISOR';
            initView();
            //window.history.pushState({"page":2}, "facturacion", GlobalUrl + '/facturacion')
        })
    },
    supervisor_cobertura:()=>{
        funciones.loadScript('./views/supervisor/cobertura.js','root')
        .then(()=>{
            GlobalSelectedForm ='SUPERVISOR';
            initView();
            //window.history.pushState({"page":2}, "facturacion", GlobalUrl + '/facturacion')
        })
    },
    supervisor_mapa:()=>{
        funciones.loadScript('./views/supervisor/mapa.js','root')
        .then(()=>{
            GlobalSelectedForm ='SUPERVISORMAPA';
            initView();
            //window.history.pushState({"page":2}, "facturacion", GlobalUrl + '/facturacion')
        })
    },
    supervisor_horarios:()=>{
        funciones.loadScript('./views/supervisor/horarios.js','root')
        .then(()=>{
            GlobalSelectedForm ='SUPERVISORHORARIOS';
            initView();
            //window.history.pushState({"page":2}, "facturacion", GlobalUrl + '/facturacion')
        })
    },
    supervisor_precios:()=>{
        funciones.loadScript('./views/supervisor/precios.js','root')
        .then(()=>{
            GlobalSelectedForm ='SUPERVISOR';
            initView();
            //window.history.pushState({"page":2}, "facturacion", GlobalUrl + '/facturacion')
        })
    },
    supervisor_cotizaciones:()=>{
        // Liberar bloqueos de modal/backdrop antes de cargar la vista
        try {
            document.body.classList.remove('modal-open', 'cotiz-finalizar-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            document.querySelectorAll('.modal-backdrop').forEach((el) => {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            });
            const wait = document.getElementById('modalWait');
            if (wait) {
                try { $('#modalWait').modal('hide'); } catch (e) {}
                wait.classList.remove('show', 'factura-wait-modal');
                wait.style.display = 'none';
            }
            const pdfHost = document.getElementById('cotizPdfHost');
            if (pdfHost && pdfHost.parentNode) pdfHost.parentNode.removeChild(pdfHost);
        } catch (e) {}
        funciones.loadScript('./views/supervisor/cotizaciones.js','root')
        .then(()=>{
            detener_efecto();
            GlobalSelectedForm ='COTIZACIONES';
            GlobalSelectedCodCliente = '';
            iniciarVistaCotizaciones();
        })
    },
    supervisor_registro_visitas:()=>{
        funciones.loadScript('./views/vendedor/registro_visitas.js','root')
        .then(()=>{
            detener_efecto();
            iniciarVistaRegistroVisitas({ supervisor: true });
        })
    },
    vendedor_registro_visitas:()=>{
        funciones.loadScript('./views/vendedor/registro_visitas.js','root')
        .then(()=>{
            detener_efecto();
            iniciarVistaRegistroVisitas({ supervisor: false });
        })
    },
    supervisor_usuarios:()=>{
        funciones.loadScript('./views/supervisor/usuarios.js','root')
        .then(()=>{
            GlobalSelectedForm ='SUPERVISOR';
            initView();
            //window.history.pushState({"page":2}, "facturacion", GlobalUrl + '/facturacion')
        })
    },
    supervisor_objetivos:()=>{
        funciones.loadScript('./views/supervisor/objetivos.js','root')
        .then(()=>{
            GlobalSelectedForm ='SUPERVISOR';
            initView();
        })
    },
    supervisor_logro_objetivos:()=>{
        funciones.loadScript('./views/supervisor/logro_objetivos.js','root')
        .then(()=>{
            GlobalSelectedForm ='SUPERVISOR';
            initView();
        })
    },
    inicio_repartidor : async ()=>{
        console.log('inicio Repartidor....')
        document.body.classList.remove('login-active');
        document.body.classList.remove('supervisor-active');
        if (typeof divUsuario !== 'undefined' && divUsuario) divUsuario.innerText = GlobalUsuario;
        if (typeof lbTipo !== 'undefined' && lbTipo) lbTipo.innerText = GlobalTipoUsuario || 'REPARTIDOR';
        if (typeof updateHeaderUserBadge === 'function') updateHeaderUserBadge(GlobalUsuario);

        let strFooter =    `
                            `
                    rootMenuFooter.innerHTML = strFooter;
                                               
                                        
                  
                    //actualiza la ubicación del empleado
                    await classEmpleados.updateMyLocation();

                    
                    document.getElementById('btnPedidosPend').style="visibility:hidden";

                    classNavegar.repartidor_inicio();

                  
             
    },
    repartidor_inicio:()=>{
        funciones.loadScript('./views/repartidor/repartidor.js','root')
        .then(()=>{
            GlobalSelectedForm ='REPARTIDOR';
            initView();
        })
    },
}