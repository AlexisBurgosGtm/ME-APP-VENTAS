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
    inicioVendedor : async ()=>{
       
                                
        let strFooter =    `<button class="btn btn-sm "  id="btnMenu2VendedorClientesMapa">
                                <i class="fal fa-map"></i>
                                Mapa
                            </button> 
                            <button class="btn btn-sm "  id="btnMenu2VendedorClientes">
                                <i class="fal fa-shopping-cart"></i>
                                Cliente
                            </button>
                          
                            <button class="btn btn-sm " id="btnMenu2Censo">
                                <i class="fal fa-edit"></i>
                                Censo
                            </button>

                            <button class="btn btn-sm " id="btnMenu2VendedorLogro">
                                <i class="fal fa-chart-pie"></i>
                                Logro
                            </button>

                            <button class="btn btn-sm " id="btnMenu2VendedorLogroReal">
                                <i class="fal fa-chart-bar"></i>
                                Objetivos
                            </button>
                            
                            <button class="btn btn-sm"  id="btnMenu2Configuraciones">
                                <i class="fal fa-cog"></i>
                                Cnfg
                            </button>

                                                   
                    
                            `

                    rootMenuFooter.innerHTML = strFooter;
                                                 
                    let btnMenu2VendedorClientes = document.getElementById('btnMenu2VendedorClientes');
                    btnMenu2VendedorClientes.addEventListener('click',()=>{
                         //efecto nieve
                        detener_efecto();
                        classNavegar.inicioVendedorListado();
                    });

                    let btnMenu2VendedorClientesMapa = document.getElementById('btnMenu2VendedorClientesMapa');
                    btnMenu2VendedorClientesMapa.addEventListener('click',()=>{
                         //efecto nieve
                        detener_efecto();
                        classNavegar.ventasMapaClientes();
                    });
             
                    let btnMenu2VendedorLogro = document.getElementById('btnMenu2VendedorLogro');
                    btnMenu2VendedorLogro.addEventListener('click',()=>{
                         //efecto nieve
                        detener_efecto();
                        classNavegar.logrovendedor();
                    });
                 
                    let btnMenu2Censo = document.getElementById('btnMenu2Censo');
                    btnMenu2Censo.addEventListener('click',()=>{
                        //efecto nieve
                        detener_efecto();
                        classNavegar.inicio_censo();
                    });

                    let btnMenu2Configuraciones = document.getElementById('btnMenu2Configuraciones');
                    btnMenu2Configuraciones.addEventListener('click',()=>{
                    
                        classNavegar.ConfigVendedor();
                    });
                   
                   

                    await classEmpleados.updateMyLocation();

                    btnMenu2VendedorClientes.click();
                    //classNavegar.inicioVendedorListado();

                    document.getElementById('btnPedidosPend').style="visibility:visible";

             
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
        let strFooter =    `<button class="btn btn-sm "  id="btnMenu2SuperMapa">
                                <i class="fal fa-map"></i>
                                Gps
                            </button> 
                            <button class="btn btn-sm "  id="btnMenu2SuperVentas">
                                <i class="fal fa-shopping-cart"></i>
                                Reportes
                            </button>
                            <button class="btn btn-sm "  id="btnMenu2SuperCobertura">
                                <i class="fal fa-user"></i>
                                Cobertura
                            </button>
                            <button class="btn btn-sm "  id="btnMenu2SuperHorarios">
                                <i class="fal fa-clock"></i>
                                Horarios
                            </button>
                            <button class="btn btn-sm "  id="btnMenu2SuperPrecios">
                                <i class="fal fa-box"></i>
                                Precios
                            </button>
                             <button class="btn btn-sm "  id="btnMenu2SuperUsuarios">
                                <i class="fal fa-unlock"></i>
                                Usuarios
                            </button>
                            `
                    rootMenuFooter.innerHTML = strFooter;
                                               
                                        
                    let btnMenu2SuperMapa = document.getElementById('btnMenu2SuperMapa');
                    btnMenu2SuperMapa.addEventListener('click',()=>{
                            classNavegar.supervisor_mapa();
                    });

                    let btnMenu2SuperVentas = document.getElementById('btnMenu2SuperVentas');
                    btnMenu2SuperVentas.addEventListener('click',()=>{
                            classNavegar.supervisor_ventas();
                    });

                    let btnMenu2SuperCobertura = document.getElementById('btnMenu2SuperCobertura');
                    btnMenu2SuperCobertura.addEventListener('click',()=>{
                            classNavegar.supervisor_cobertura();
                    });

                    let btnMenu2SuperHorarios = document.getElementById('btnMenu2SuperHorarios');
                    btnMenu2SuperHorarios.addEventListener('click',()=>{
                            classNavegar.supervisor_horarios();
                    });

                    let btnMenu2SuperPrecios = document.getElementById('btnMenu2SuperPrecios');
                    btnMenu2SuperPrecios.addEventListener('click',()=>{
                            classNavegar.supervisor_precios();
                    });

                    let btnMenu2SuperUsuarios = document.getElementById('btnMenu2SuperUsuarios');
                    btnMenu2SuperUsuarios.addEventListener('click',()=>{
                            classNavegar.supervisor_usuarios();
                    });

                
                 
                    //actualiza la ubicación del empleado
                    await classEmpleados.updateMyLocation();

                    //actualiza las credenciales
                    updateDateDownload();

                    document.getElementById('btnPedidosPend').style="visibility:hidden";

                    classNavegar.supervisor_ventas();

                  
             
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