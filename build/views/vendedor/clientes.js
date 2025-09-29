function getView(){
    let view = {
        body :()=>{
            return `
            <div class="panel-container show">
                <div class="panel-content bg-white">
                    <div class="tab-content py-3">

                        <div class="tab-pane fade active show" id="panelInicio" role="tabpanel">
                                ${view.tab_inicio()}
                        </div>

                        <div class="tab-pane fade" id="panelNoVisitados" role="tabpanel">
                                ${view.tab_no_visitados()}
                        </div>
                        
                        <div class="tab-pane fade" id="panelVisitados" role="tabpanel">
                                ${view.tab_visitados()}

                        </div>

                        <div class="tab-pane fade" id="panelAjenos" role="tabpanel">
                                ${view.tab_ajenos()}
                        </div>


                    </div>
                    
                    <ul class="nav nav-pills nav-justified hidden" role="tablist">
                        <li class="nav-item"><a id="tab-inicio" class="nav-link nav-link-custom active" data-toggle="tab" href="#panelInicio">Inicio</a></li>
                        <li class="nav-item"><a id="tab-no-visitados" class="nav-link nav-link-custom " data-toggle="tab" href="#panelNoVisitados">No Visit</a></li>
                        <li class="nav-item"><a id="tab-visitados" class="nav-link nav-link-custom " data-toggle="tab" href="#panelVisitados">Visitados</a></li>
                        <li class="nav-item"><a id="tab-ajenos" class="nav-link nav-link-custom " data-toggle="tab" href="#panelAjenos">Ajenos</a></li>
                    </ul>


                </div>
            </div>
            `
        },
        tab_inicio : ()=>{
            return `
                    <div class="card card-rounded">
           
                        <div class="card-body">

                            <div class="row">
                                <div class="card card-rounded col-12">
                                    <div class="card-body">

                                        <label>Total del día:</label><br>
                                        <h4 class="negrita" id="lbTotalDia">Total venta 0 - pedidos 0</h4>
                                        
                                        <div class="row">
                                            <div class="col-6">
                                                <label>Precios Descargados:</label>
                                                <button class="btn btn-sm btn-info btn-circle" id="btnDescargarP"><i class="fal fa-download"></i></button>
                                                <h5 class="negrita text-danger" id="lbTotalProductos">0</h5>
                                            </div>
                                            <div class="col-6">
                                                <label>Clientes Descargados:</label>
                                                <button class="btn btn-sm btn-info btn-circle" id="btnDescargarC"><i class="fal fa-download"></i></button>
                                                <h5 class="negrita text-danger" id="lbTotalClientes">0</h5>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-6">
                                                <label>Precios en Nube:</label>
                                                <h5 class="negrita text-success" id="lbTotalProductosOnline">0</h5>
                                            </div>
                                            <div class="col-6">
                                                <label>Clientes en Nube:</label>
                                                <h5 class="negrita text-success" id="lbTotalClientesOnline">0</h5>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                              
                            </div>
                           

                            <br>

                            <div class="row">
                                <div class="col-6">
                                    <div class="card card-rounded shadow hand col-12" onclick="getListaClientes('LUNES')">
                                        <div class="card-body p-2 text-center">
                                            <h5>LUNES</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="card card-rounded shadow hand col-12" onclick="getListaClientes('MARTES')">
                                        <div class="card-body p-2 text-center">
                                            <h5>MARTES</h5>
                                        </div>
                                    </div>
                                </div>    
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-6">
                                    <div class="card card-rounded shadow hand col-12" onclick="getListaClientes('MIERCOLES')">
                                        <div class="card-body p-2 text-center">
                                            <h5>MIERCOLES</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="card card-rounded shadow hand col-12" onclick="getListaClientes('JUEVES')">
                                        <div class="card-body p-2 text-center">
                                            <h5>JUEVES</h5>
                                        </div>
                                    </div>
                                </div>
                                
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-6">
                                    <div class="card card-rounded shadow hand col-12" onclick="getListaClientes('VIERNES')">
                                        <div class="card-body p-2 text-center">
                                            <h5>VIERNES</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="card card-rounded shadow hand col-12" onclick="getListaClientes('SABADO')">
                                        <div class="card-body p-2 text-center">
                                            <h5>SABADO</h5>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="col-6">
                                    <div class="card card-rounded shadow hand col-12" onclick="getListaClientes('DOMINGO')">
                                        <div class="card-body p-2 text-center">
                                            <h5>DOMINGO</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="card card-rounded shadow hand col-12" onclick="getListaClientes('OTROS')">
                                        <div class="card-body p-2 text-center">
                                            <h5>OTROS</h5>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                            <br>
                            <div class="row">
                                <div class="card card-rounded shadow hand col-12 border-info text-info" onclick="getListaClientes('AJENOS')">
                                    <div class="card-body p-2 text-center">
                                        <h5>BUSCAR CLIENTE AJENO</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                    </div>
            `
        },
        tab_no_visitados: ()=>{
            return `
            <div class="table-responsive">
             
                      
          
                    <label class="negrita text-primary" id="lbNombreDia">Clientes del día</label>             <button class="btn btn-sm btn-warning shadow hand" id="btnVvisitados">
                                                                            Ver visitados ->>
                                                                        </button>
                    <br>
                    <label class="negrita text-info" id="lbTotalClientesConteo"></label>
                    <br>                                                
                    <input type="text" id="txtFiltrarCliente" class="form-control border-primary" placeholder="Buscar en la lista...">
               

                <table class="table table-responsive col-12 p-0" id="tblLista">
                    <thead class="bg-secondary text-white">
                        <tr>
                            <td class="negrita">Cliente <small class="text-secondary">---------</small>Dirección</td>
                        
                        </tr>
                    </thead>
                    <tbody id="tblClientes">

                    </tbody>
                </table>
            </div>
            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-r" id="btnTabNVAtras">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        tab_visitados: ()=>{
            return `
            <div class="table-responsive">
                <table class="table table-responsive" id="tblLista">
                <thead class="bg-warning">
                    <tr>
                            <td class="negrita">Cliente / Dirección</td>
                        </tr>
                    </thead>
                    <tbody id="tblClientesVisitados">
                    </tbody>
                </table>
            </div>
            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-r" id="btnTabVAtras">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        tab_ajenos: ()=>{
            return `
            <div class="form-group p-2">
                <label class="negrita">Clientes ajenos:</label>
                <div class="input-group">
                                  
                    <input type="text" class="form-control border-secondary" id="txtClientesAjenosBuscar" placeholder="Escriba para buscar cliente...">    
                    <div class="input-group-append">
                        <button class="btn btn-md btn-icon btn-round" id="btnClientesAjenosBuscar">
                            <i class="fal fa-search"></i>
                        </button>    
                    </div>
                </div>                            
            </div>

            <div class="table-responsive">
                <table class="table table-responsive col-12" id="">
                    <thead class="bg-trans-gradient text-white">
                        <tr>
                            <td class="negrita">Cliente / Dirección</td>
                        </tr>
                    </thead>
                    <tbody id="tblClientesAjenos">

                    </tbody>
                </table>
            </div>
            <button class="btn btn-secondary btn-circle btn-xl hand shadow btn-bottom-r" id="btnTabAAtras">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        modalMenuCliente: ()=>{
            return `<div class="card">
                        <div class="card-header bg-trans-gradient text-white text-center">
                            <label id="lbNombreCliente"></label>
                        </div>
                        
                        <div class="card-body">
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-2">
                                        <label>Código:<label>    
                                    </div>
                                    <div class="col-3">
                                        <input type="text" id="txtCodClie" class="form-control">    
                                    </div>
                                    <div class="col-3">
                                        <input type="text" id="txtNitClie" class="form-control">
                                    </div>
                                </div>      
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-2">
                                        <label>Dirección:<label>
                                    </div>
                                    <div class="col-9">
                                        <input type="text" id="txtDirClie" class="form-control">
                                    </div>
                                </div>                                
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-2">
                                        <label>Teléfono:<label>    
                                    </div>
                                    <div class="col-9">
                                        <input type="text" id="txtTelClie" class="form-control">
                                    </div>
                                </div>                               
                            </div>

                        </div>    
                        
                    </div>

                    <div class="col-10" align="right"> 
                                         
                        <div class="row">
                            <div class="col-6">
                                
                                <div class="card card-rounded shadow bg-warning text-white" id="btnTiendaCerrada">
                                    <div class="card-body">
                                        <button class="btn btn-xl btn-warning btn-rounded hand col-12">
                                            <i class="fal fa-credit-card-front"></i>
                                            TIENDA CERRADA
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div class="col-6">
                                    <div class="card card-rounded shadow bg-secondary text-white"  id="btnNoDinero">
                                        <div class="card-body">
                                            <button class="btn btn-xl btn-secondary btn-rounded hand col-12">
                                                <i class="fal fa-credit-card-front"></i>
                                                NO DINERO
                                            </button>
                                        </div>
                                    </div>

                               
                            </div>
                            
                        </div>
                        
                        <div class="row hidden">
                            <button class="btn btn-lg btn-success col-12" id="btnVenderCliente">
                                <i class="fal fa-tag"></i>
                                VENDER
                            </button>
                        </div>          

                        <hr class="solid">
                        <hr class="solid">
                        
                        <div class="row">
                            <button class="btn btn-lg btn-danger btn-round col-12" id="btnCerrarModalCliente">
                                <i class="fal fa-times"></i>
                                CANCELAR
                            </button>
                        </div> 

                    </div>
                            `
        },
        modalHistorialCliente: ()=>{
            return `
            <div class="modal fade modal-with-scroll" id="ModalHistorialCliente" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-right" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <label class="modal-title text-danger h3" id="">Historial de Compras del Cliente</label>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><i class="fal fa-times"></i></span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <div class="table-reponsive">
                                <table class="table table-responsive table-hover table-striped table-bordered">
                                    <thead>
                                        <td>Fecha</td>
                                        <td>Producto</td>
                                        <td>Importe</td>
                                    </thead>
                                    <tbody id="tblHistorial"></tbody>
                                </table>
                            </div>
                        </div>

                    
                    </div>
                </div>
            </div>
            `
        },
        modalCambiarDatosCliente: ()=>{
            return `
            <div class="modal fade modal-with-scroll" id="ModalCambiarDatosCliente" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-right" role="document">
                    <div class="modal-content">
                       
                        <div class="modal-body">

                            <h5 class="negrita text-info3" id="">Cambiar datos Cliente</h5>
                           
                            <div class="card card-rounded shadow border-info p-4" style="font-size:80%">
                                
                                <div class="form-group">
                                    <label class="negrita">NIT</label>
                                    <input type="text" id="txtEditNit" class="form-control">
                                </div>

                                <div class="form-group">
                                    <label class="negrita">Tipo Negocio</label>
                                    <select class="form-control" id="cmbEditTipoNegocio"></select>
                                </div>
                                <div class="form-group">
                                    <label class="negrita">Nombre Negocio</label>
                                    <input type="text" id="txtEditNegocio" class="form-control">
                                </div>
                                
                                <div class="form-group">
                                    <label class="negrita">Nombre Cliente</label>
                                    <input type="text" id="txtEditNombre" class="form-control">
                                </div>

                                <div class="form-group">
                                    <label class="negrita">Dirección</label>
                                    <input type="text" id="txtEditDireccion" class="form-control">
                                </div>

                                <div class="form-group">
                                    <label class="negrita">Teléfono</label>
                                    <input type="text" id="txtEditTelefono" class="form-control">
                                </div>


                                <div class="form-group">
                                    <label class="negrita">Referencia</label>
                                    <input type="text" id="txtEditReferencia" class="form-control">
                                </div>

                                
                               
                                <div class="row">
                                    
                                    <div class="col-2">
                                        <button class="btn btn-md btn-danger btn-circle hand shadow" id="btnEditGps">
                                            <i class="fal fa-map"></i>
                                        </button>
                                    </div>

                                    <div class="col-5">
                                        <div class="form-group">
                                            <label>Latitud</label>
                                            <input type="number" id="txtEditLatitud" class="form-control">
                                        </div>
                                    </div>
                                    <div class="col-5">
                                        <div class="form-group">
                                            <label>Longitud</label>
                                            <input type="number" id="txtEditLongitud" class="form-control">
                                        </div>
                                    </div>

                                </div>

                                <hr class="solid">

                                <div class="row">
                                    <div class="col-6">
                                        <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                            <i class="fal fa-arrow-left"></i>
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-info btn-circle btn-xl hand shadow" id="btnEnviarCambiosCliente">
                                            <i class="fal fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </div>

                                <hr class="solid">


                            </div>
                        </div>

                    
                    </div>
                </div>
            </div>
            `
        },
        modalGps: ()=>{
            return `
            <div class="modal fade" id="ModalGps" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-right" role="document">
                    <div class="modal-content">
                       
                        <div class="modal-body">

                            <h5 class="negrita text-info3" id="">Cambiar ubicación Cliente</h5>
                           
                            <div class="card card-rounded shadow p-2" id="gpsMap">
                                
                               
                             

                           


                            </div>
                            
                            <hr class="solid">
                            
                            <div class="row">
                                <div class="col-6">
                                    <button class="btn btn-secondary btn-circle btn-xl hand shadow" data-dismiss="modal">
                                        <i class="fal fa-arrow-left"></i>
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button class="btn btn-success btn-circle btn-xl hand shadow" id="btnAceptarNuevoGps">
                                        <i class="fal fa-check"></i>
                                    </button>
                                </div>
                            </div>

                        </div>

                    
                    </div>
                </div>
            </div>
            `
        }
    }

    root.innerHTML = view.body() + view.modalHistorialCliente() + view.modalCambiarDatosCliente() +  view.modalGps();
    rootMenuLateral.innerHTML = view.modalMenuCliente();
};

function Lmap(lat,long){
                      
          var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          osm = L.tileLayer(osmUrl, {center: [lat, long],maxZoom: 20, attribution: osmAttrib});    
          map = L.map('mapcontainer').setView([lat, long], 18).addLayer(osm);

          L.marker([lat, long], {draggable:'true'})
            .addTo(map)
            .bindPopup(`Marque la nueva posición GPS del cliente`, {closeOnClick: false, autoClose: false})
            .openPopup()
            .on("dragend",function(e) {
                    this.openPopup();
                    var position = e.target._latlng;
               
                    GlobalSelectedLat = position.lat.toString();
                    GlobalSelectedLong = position.lng.toString();                  
            });
           
            return map;

};

function getMenuCliente(codigo,nombre,direccion,telefono,lat,long,nit){
    
    
    //map.remove()
    //map = Lmap(lat,long,nombre,telefono);

    document.getElementById('lbNombreCliente').innerHTML = nombre;
    document.getElementById('txtCodClie').value = codigo;
    document.getElementById('txtNitClie').value = nit;
    document.getElementById('txtDirClie').value = direccion;
    document.getElementById('txtTelClie').value = telefono;
    
    GlobalSelectedCodCliente = codigo;
    GlobalSelectedNomCliente = nombre;
    GlobalSelectedDirCliente = direccion;
    

    classNavegar.ventas(GlobalSelectedCodCliente,GlobalSelectedNomCliente,GlobalSelectedDirCliente);

    //showMenuLateral('Opciones del Cliente');

};

function getMenuCliente2(codigo,nombre,direccion,telefono,lat,long,nit){
    
    
    //map.remove()
    //map = Lmap(lat,long,nombre,telefono);

    document.getElementById('lbNombreCliente').innerHTML = nombre;
    document.getElementById('txtCodClie').value = codigo;
    document.getElementById('txtNitClie').value = nit;
    document.getElementById('txtDirClie').value = direccion;
    document.getElementById('txtTelClie').value = telefono;
    
    GlobalSelectedCodCliente = codigo;
    GlobalSelectedNomCliente = nombre;
    GlobalSelectedDirCliente = direccion;
    

    //classNavegar.ventas(GlobalSelectedCodCliente,GlobalSelectedNomCliente,GlobalSelectedDirCliente);

    showMenuLateral('Opciones del Cliente');

};

function getEditCliente(codigo,nombre,direccion,referencia,telefono,lat,long,nit,tiponegocio,negocio){
    
    
    //map.remove()
    //map = Lmap(lat,long,nombre,telefono);

    document.getElementById('txtEditNit').value = nit;
    document.getElementById('txtEditNombre').value = nombre;
    document.getElementById('txtEditDireccion').value = direccion; 
    document.getElementById('txtEditReferencia').value = referencia;
    document.getElementById('txtEditLatitud').value = lat;
    document.getElementById('txtEditLongitud').value = long;
    document.getElementById('cmbEditTipoNegocio').value = tiponegocio;
    document.getElementById('txtEditNegocio').value = negocio;

    GlobalSelectedCodCliente = codigo;
    GlobalSelectedNomCliente = nombre;
    GlobalSelectedDirCliente = direccion;
    

    $("#ModalCambiarDatosCliente").modal('show');



};

async function getHistorialCliente(codigo,nit,nombre){
    
    await apigen.vendedorHistorialCliente(codigo,'tblHistorial');

    $('#ModalHistorialCliente').modal('show')

};

async function setRecordatorioVisita(codigo, nit, nombre, direccion){
    
    await funciones.hablar(`¿Quieres establecer el recordatorio de visita a ${nombre}`);
    
    let recordatorio = 'Retomar visita';

    funciones.Confirmacion(`¿Quieres establecer el recordatorio de visita a ${nombre}`)
    .then((value)=>{
        if (value==true){

            apigen.clientesSetReminder(codigo,nit,nombre,direccion,recordatorio,0,0,funciones.getFecha())
            .then(()=>{
                funciones.Aviso('Recordatorio establecido exitosamente');
            })
            .catch(()=>{
                funciones.AvisoError('No se pudo establecer el recordatorio');
            })
            //funciones.setReminder(`Visitar a ${nombre}, ubicado en ${direccion}`, 60);
            
        }
    })
    
};

async function addListeners(){

    document.getElementById('btnTabNVAtras').addEventListener('click',()=>{
        document.getElementById('tab-inicio').click();
    });

    document.getElementById('btnTabVAtras').addEventListener('click',()=>{
        document.getElementById('tab-no-visitados').click();
    });

    document.getElementById('btnTabAAtras').addEventListener('click',()=>{
        document.getElementById('tab-inicio').click();
    });

    document.getElementById('btnVvisitados').addEventListener('click',()=>{
        document.getElementById('tab-visitados').click();
    });
    
    document.getElementById('cmbEditTipoNegocio').innerHTML = funciones.getComboTipoClientes();


    document.getElementById('txtClientesAjenosBuscar').addEventListener('keyup',(e)=>{
        if(e.code=='Enter'){
            document.getElementById('btnClientesAjenosBuscar').click();
        }
        if(e.code=='NumpadEnter'){
            document.getElementById('btnClientesAjenosBuscar').click();
        }
    });
  
    let f = new Date();
  
    
    let btnCerrarModalCliente = document.getElementById('btnCerrarModalCliente');
    btnCerrarModalCliente.addEventListener('click',()=>{
        hideMenuLateral()
    });

    let btnTiendaCerrada = document.getElementById('btnTiendaCerrada');
    btnTiendaCerrada.addEventListener('click',()=>{
        funciones.Confirmacion('Se marcará este cliente como CERRADA. ¿Está seguro?')
        .then((value)=>{
            if(value==true){
                apigen.updateClientesLastSale(GlobalSelectedCodCliente,'CERRADO')
                .then(async()=>{
                    funciones.Aviso('TIENDA CERRADA');
                })
                .catch(()=>{
                    funciones.AvisoError('No se marcar esta tienda. Inténtelo de nuevo')
                })
                
                hideMenuLateral();
            }
        })
        
        
    });

    let btnNoDinero = document.getElementById('btnNoDinero');
    btnNoDinero.addEventListener('click',()=>{
        funciones.Confirmacion('Se marcará este cliente como SIN DINERO. ¿Está seguro?')
        .then(async(value)=>{
            if(value==true){
                apigen.updateClientesLastSale(GlobalSelectedCodCliente,'NODINERO')
                .then(async()=>{
                    funciones.Aviso('TIENDA SIN DINERO');
                })
                .catch(()=>{
                    funciones.AvisoError('No se marcar esta tienda. Inténtelo de nuevo')
                })

                hideMenuLateral();
            }
        })
        
        
    });


    let btnVenderCliente = document.getElementById('btnVenderCliente');
    btnVenderCliente.addEventListener('click',()=>{
        hideMenuLateral();
        classNavegar.ventas(GlobalSelectedCodCliente,GlobalSelectedNomCliente,GlobalSelectedDirCliente);
    });

    let txtFiltrarCliente = document.getElementById('txtFiltrarCliente');
    txtFiltrarCliente.addEventListener('keyup',(e)=>{
        funciones.FiltrarTabla('tblLista','txtFiltrarCliente');
    });


    let btnClientesAjenosBuscar = document.getElementById('btnClientesAjenosBuscar');
    btnClientesAjenosBuscar.addEventListener('click', async ()=>{
        let txtClientesAjenosBuscar = document.getElementById('txtClientesAjenosBuscar');
        await apigen.clientesAjenosVendedor(GlobalCodSucursal,txtClientesAjenosBuscar.value,'tblClientesAjenos')
    })
    
    await apigen.vendedorTotalDia(GlobalCodSucursal,GlobalCodUsuario,funciones.getFecha(),'lbTotalDia');

    
    //verifica si hay pedidos pendientes
    dbCargarPedidosPendientes();


    //BOTON PARA CAMBIAR GPS EN MODAL EDIT CLIENTE
    document.getElementById('btnEditGps').addEventListener('click',()=>{

        funciones.Confirmacion('¿Está seguro que desea SOLICITAR CAMBIOS de Datos de este Cliente?')
        .then((value)=>{
            if(value==true){

                    let latitud = document.getElementById('txtEditLatitud').value;
                    let longitud = document.getElementById('txtEditLongitud').value;
                    let nombre = document.getElementById('txtEditNombre').value;
            
                    let container = document.getElementById('gpsMap');
                    container.innerHTML = GlobalLoader;                 
                    let tbl = `<div class="mapcontainer4" id="mapcontainer"></div>`;        
                    container.innerHTML = tbl;

                    var map;
                    map = Lmap(Number(latitud), Number(longitud));
                            
                    setTimeout(function(){try { map.invalidateSize(); } catch (error) { }}, 500);            
                                    
                    $("#ModalGps").modal('show');
            
                 

                  

                



            }
        })
     

    });




    document.getElementById('btnAceptarNuevoGps').addEventListener('click',()=>{

        document.getElementById('txtEditLatitud').value = GlobalSelectedLat;
        document.getElementById('txtEditLongitud').value = GlobalSelectedLong;
        $("#ModalGps").modal('hide');

    });



    let btnEnviarCambiosCliente = document.getElementById('btnEnviarCambiosCliente');
    btnEnviarCambiosCliente.addEventListener('click',()=>{

        funciones.Confirmacion('¿Está seguro que desea Enviar esta solicitud de Cambio de Datos?')
        .then((value)=>{
            if(value==true){

                   
                    
                    let nit = document.getElementById('txtEditNit').value || 'CF';
                    let tiponegocio = document.getElementById('cmbEditTipoNegocio').value || 'OTROS';
                    let negocio = document.getElementById('txtEditNegocio').value || '';
                    let nombre = document.getElementById('txtEditNombre').value || '';
                    let direccion = document.getElementById('txtEditDireccion').value || 'CIUDAD';
                    let telefono = document.getElementById('txtEditTelefono').value || '0';
                    let referencia = document.getElementById('txtEditReferencia').value || 'SN';
                    let latitud = document.getElementById('txtEditLatitud').value || 0;
                    let longitud = document.getElementById('txtEditLongitud').value || 0;

                    

                    if (negocio==''){funciones.AvisoError('Escriba el nombre del negocio');return;}
                    if (nombre==''){funciones.AvisoError('Escriba el nombre del negocio');return;}


                    btnEnviarCambiosCliente.disabled = true;
                    btnEnviarCambiosCliente.innerHTML = '<i class="fal fa-paper-plane fa-spin"></i>';

                    send_solicitud_cliente(GlobalSelectedCodCliente,nit,tiponegocio,negocio,nombre,direccion,telefono,referencia,latitud,longitud)
                    .then(()=>{
                        funciones.Aviso('Solicitud enviada exitosamente!!');
                        btnEnviarCambiosCliente.disabled = false;
                        btnEnviarCambiosCliente.innerHTML = '<i class="fal fa-paper-plane"></i>';

                        $("#ModalCambiarDatosCliente").modal('hide');
                    })
                    .catch(()=>{
                        funciones.AvisoError('No se pudo enviar la solicitud');
                        btnEnviarCambiosCliente.disabled = false;
                        btnEnviarCambiosCliente.innerHTML = '<i class="fal fa-paper-plane"></i>';
                    })

            }

           

        });

    });


    await getTotalClientes('lbTotalClientes');
    await getTotalProductos('lbTotalProductos');

    //muestra la lista de clientes del día si ya ingresó una vez
    //if(GlobalSelectedClientesDia=='SN'){}else{getListaClientes(GlobalSelectedClientesDia)};

    apigen.getTotalProductosOnline()
    .then((total)=>{
        document.getElementById('lbTotalProductosOnline').innerText = total;
    })
    .catch(()=>{
        document.getElementById('lbTotalProductosOnline').innerText = '---';
    })

    apigen.getTotalClientesOnline()
    .then((total)=>{
        document.getElementById('lbTotalClientesOnline').innerText = total;
    })
    .catch(()=>{
        document.getElementById('lbTotalClientesOnline').innerText = '---';
    });



    //botones para actualizar
    let btnDescargarP = document.getElementById('btnDescargarP')
    btnDescargarP.addEventListener('click',()=>{
        funciones.Confirmacion('¿Está seguro que desea Descargar el catálogo de Productos?')
        .then((value)=>{
            if(value==true){
                
                btnDescargarP.disabled = true;
                btnDescargarP.innerHTML = `<i class="fal fa-sync fa-spin"></i>`;

                downloadProductos()
                .then((data)=>{
                    funciones.showToast(`Productos descargados, guardándolos localmente`);
                    deleteProductos()
                    .then(()=>{
                        let contador = 1;
                        let totalrows = Number(data.rowsAffected[0]);
                          
                        data.recordset.map(async(rows)=>{
                            var datosdb = {
                                CODSUCURSAL:rows.CODSUCURSAL,
                                CODPROD:rows.CODPROD,
                                DESPROD:rows.DESPROD,
                                CODMEDIDA:rows.CODMEDIDA,
                                EQUIVALE:rows.EQUIVALE,
                                COSTO:rows.COSTO,
                                PRECIO:rows.PRECIO,
                                PRECIOA:rows.PRECIOA,
                                PRECIOB:rows.PRECIOB,
                                PRECIOC:rows.PRECIOC,
                                DESMARCA:rows.DESMARCA,
                                EXENTO:rows.EXENTO,
                                EXISTENCIA:rows.EXISTENCIA,
                                DESPROD3:rows.DESPROD3
                            }                
                            var noOfRowsInserted = await connection.insert({
                                into: "productos",
                                values: [datosdb], //you can insert multiple values at a time
                            });
                            if (noOfRowsInserted > 0) {
                                let porc = (Number(contador) / Number(totalrows)) * 100;
                                //setLog(`<label>Productos agregados: ${contador} de ${totalrows} (${porc.toFixed(2)}%)</label>`,'rootWait')
                                contador += 1;
                                if(totalrows==contador){
                                   
                                    funciones.Aviso('Productos descargados exitosamente!!');
                                   
                                    btnDescargarP.disabled = false;
                                    btnDescargarP.innerHTML = `<i class="fal fa-download"></i>`;

                                    try {
                                        getTotalProductos('lbTotalProductos');
                                    } catch (error) {
                                        
                                    }
                                }
                            }
                        });
                    })
                    .catch(()=>{
                      
                       funciones.AvisoError('No se pudieron eliminar los productos previos');
                       btnDescargarP.disabled = false;
                       btnDescargarP.innerHTML = `<i class="fal fa-download"></i>`;

                    })
                })
                .catch(()=>{
                   
                    funciones.AvisoError('No se pudieron descargar los productos');
                    btnDescargarP.disabled = false;
                    btnDescargarP.innerHTML = `<i class="fal fa-download"></i>`;

                })
    
                
                
            }
        })
    });

    let btnDescargarC = document.getElementById('btnDescargarC');
    btnDescargarC.addEventListener('click',()=>{
        funciones.Confirmacion('¿Está seguro que desea Descargar el catálogo de Clientes?')
        .then((value)=>{
            if(value==true){
    
                btnDescargarC.disabled = true;
                btnDescargarC.innerHTML = `<i class="fal fa-sync fa-spin"></i>`;
    
                downloadClientes()
                .then((data)=>{
                    funciones.showToast(`Clientes descargados, ahora se guardarán localmente`)
                    deleteClientes()
                    .then(()=>{
                        let totalrows = Number(data.rowsAffected[0]);
                        let contador = 1;
    
                        data.recordset.map(async(rows)=>{
                            var datosdb = {
                                CODSUCURSAL:rows.CODSUCURSAL,
                                CODIGO:rows.CODIGO,
                                DESMUNI:rows.DESMUNI,
                                DIRCLIE:rows.DIRCLIE,
                                LASTSALE:rows.LASTSALE,
                                LAT:rows.LAT,
                                LONG:rows.LONG,
                                NIT:rows.NIT,
                                NOMCLIE:rows.NOMCLIE,
                                REFERENCIA:rows.REFERENCIA,
                                STVISITA:rows.STVISITA,
                                VISITA:rows.VISITA,
                                TELEFONO:rows.TELEFONO,
                                TIPONEGOCIO:rows.TIPONEGOCIO,
                                NEGOCIO:rows.NEGOCIO
                            }                
                            var noOfRowsInserted = await connection.insert({
                                into: "clientes",
                                values: [datosdb], //you can insert multiple values at a time
                            });
                            if (noOfRowsInserted > 0) {
                                let porc = (Number(contador)/Number(totalrows))*100;
                                //setLog(`<label>Clientes agregados: ${contador} de ${totalrows} (${porc.toFixed(2)} %)</label>`,'rootWait')
                                contador += 1;
                                if(totalrows==contador){
                                   
                                    funciones.Aviso('Clientes descargados exitosamente!!');
                                    btnDescargarC.disabled = false;
                                    btnDescargarC.innerHTML = `<i class="fal fa-download"></i>`;
                                    try {
                                        getTotalClientes('lbTotalClientes');
                                       
                                    } catch (error) {
                                        
                                    }
                                }
                            }
                        });
                        fcn_get_mun_deptos();
                    })
                    .catch(()=>{
                       
                        funciones.AvisoError('No se pudieron eliminar los Clientes previos');
                        btnDescargarC.disabled = false;
                        btnDescargarC.innerHTML = `<i class="fal fa-download"></i>`;
                    })
                })
                .catch(()=>{
                   
                    funciones.AvisoError('No se pudieron descargar los clientes');
                    btnDescargarC.disabled = false;
                    btnDescargarC.innerHTML = `<i class="fal fa-download"></i>`;
                })
                      
                
            }
        })
    });


    funciones.slideAnimationTabs();
    
    
    apigen.config_get_codupdate(GlobalCodSucursal)
    .then((code)=>{
        SelectedCodUpdate = code;
        selectDateDownload().then(()=>{
                if(SelectedCodUpdate.toString()==SelectedLocalCodUpdate.toString()){
                    funciones.showToast('Su catálogo de precios está actualizado')
                }else{
                    funciones.showToast('Catálogo de precios desactualizado, iniciando descarga');
                    btnDescargarP.disabled = true;
                    btnDescargarP.innerHTML = `<i class="fal fa-sync fa-spin"></i>`;
    
                    downloadProductos()
                    .then((data)=>{
                        funciones.showToast(`Productos descargados, guardándolos localmente`);
                        deleteProductos()
                        .then(()=>{
                            let contador = 1;
                            let totalrows = Number(data.rowsAffected[0]);
                              
                            data.recordset.map(async(rows)=>{
                                var datosdb = {
                                    CODSUCURSAL:rows.CODSUCURSAL,
                                    CODPROD:rows.CODPROD,
                                    DESPROD:rows.DESPROD,
                                    CODMEDIDA:rows.CODMEDIDA,
                                    EQUIVALE:rows.EQUIVALE,
                                    COSTO:rows.COSTO,
                                    PRECIO:rows.PRECIO,
                                    PRECIOA:rows.PRECIOA,
                                    PRECIOB:rows.PRECIOB,
                                    PRECIOC:rows.PRECIOC,
                                    DESMARCA:rows.DESMARCA,
                                    EXENTO:rows.EXENTO,
                                    EXISTENCIA:rows.EXISTENCIA,
                                    DESPROD3:rows.DESPROD3
                                }                
                                var noOfRowsInserted = await connection.insert({
                                    into: "productos",
                                    values: [datosdb], //you can insert multiple values at a time
                                });
                                if (noOfRowsInserted > 0) {
                                    let porc = (Number(contador) / Number(totalrows)) * 100;
                                    //setLog(`<label>Productos agregados: ${contador} de ${totalrows} (${porc.toFixed(2)}%)</label>`,'rootWait')
                                    contador += 1;
                                    if(totalrows==contador){
                                       
                                        funciones.Aviso('Productos descargados exitosamente!!');
                                       
                                        btnDescargarP.disabled = false;
                                        btnDescargarP.innerHTML = `<i class="fal fa-download"></i>`;
    
                                        try {
                                            getTotalProductos('lbTotalProductos');
                                        } catch (error) {
                                            
                                        }
                                    }
                                }
                            });
                        })
                        .catch(()=>{
                          
                           funciones.AvisoError('No se pudieron eliminar los productos previos');
                           btnDescargarP.disabled = false;
                           btnDescargarP.innerHTML = `<i class="fal fa-download"></i>`;
    
                        })
                    })
                    .catch(()=>{
                       
                        funciones.AvisoError('No se pudieron descargar los productos');
                        btnDescargarP.disabled = false;
                        btnDescargarP.innerHTML = `<i class="fal fa-download"></i>`;
    
                    })

                }
        });
        //console.log('downloaded: ' + SelectedCodUpdate);
        //console.log('local: ' + SelectedLocalCodUpdate);
    })
    .catch(()=>{SelectedCodUpdate='NOCODE'});
    

    
    
};

function getListaClientes(nodia){

    GlobalSelectedClientesDia = nodia;

    if(nodia=='AJENOS'){
        document.getElementById('tab-ajenos').click();
    }else{
        apigen.clientesVendedor(GlobalCodSucursal,GlobalCodUsuario,nodia,'tblClientes','tblClientesVisitados','lbTotalClientesConteo');
        document.getElementById('tab-no-visitados').click();
    };

    document.getElementById('lbNombreDia').innerText = 'CLIENTES: ' + nodia;

   
  

};

function inicializarVista(){
    getView();
    addListeners();
};




function send_solicitud_cliente(codclie,nitclie,tiponegocio,negocio,nomclie,dirclie,telefono,referencia,lat,long){
    
    return new Promise((resolve,reject)=>{
        axios.post('/clientes/solicitud_cambios_cliente',{
           sucursal: GlobalCodSucursal,
           codclie: codclie,
           nitclie: nitclie,
           tiponegocio: tiponegocio,
           negocio: negocio,
           nomclie: nomclie,
           dirclie: dirclie,
           telefono:telefono,
           referencia: referencia,
           lat: lat,
           long: long,
           fecha:funciones.getFecha()
        })
        .then((response) => {
            console.log(response);
            const data = response.data;
            if (data.rowsAffected[0]==0){
                reject();
            }else{
                resolve();
            }            
        }, (error) => {
            reject();
        });
    })

}