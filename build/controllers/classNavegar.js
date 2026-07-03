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
        divUsuario.innerText = GlobalUsuario;
        lbTipo.innerText = GlobalTipoUsuario;

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
    setupMenuFooter(options = {}) {
        const {
            itemsHtml = '',
            showPedidosPend = true,
            onReady = null,
            autoNavigateId = null,
            bindEvents = null
        } = options;

        const strFooter = `
            <div class="vendor-menu-shell">
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

        rootMenuFooter.innerHTML = strFooter;

        const vendorMenuPanel = document.getElementById('vendorMenuPanel');
        const btnToggleMenuVendedor = document.getElementById('btnToggleMenuVendedor');

        btnToggleMenuVendedor.addEventListener('click', () => {
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
        const vendedorItems = `
                    <button class="vendor-menu-item" id="btnMenu2VendedorClientesMapa">
                        <i class="fal fa-map"></i>
                        <span>Mapa</span>
                    </button>
                    <button class="vendor-menu-item" id="btnMenu2VendedorClientes">
                        <i class="fal fa-shopping-cart"></i>
                        <span>Cliente</span>
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
    inicio_supervisor : async ()=>{
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
                    <button class="vendor-menu-item" id="btnMenu2SuperUsuarios">
                        <i class="fal fa-unlock"></i>
                        <span>Usuarios</span>
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

                document.getElementById('btnMenu2SuperUsuarios').addEventListener('click', () => {
                    closeMenu();
                    classNavegar.supervisor_usuarios();
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
    supervisor_usuarios:()=>{
        funciones.loadScript('./views/supervisor/usuarios.js','root')
        .then(()=>{
            GlobalSelectedForm ='SUPERVISOR';
            initView();
            //window.history.pushState({"page":2}, "facturacion", GlobalUrl + '/facturacion')
        })
    },
    inicio_repartidor : async ()=>{
        console.log('inicio Repartidor....')

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