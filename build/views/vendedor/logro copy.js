function getView(){
    let view ={
        encabezado : ()=>{
            return `
            <div class="row bg-trans-gradient text-white">
                <div class="col-12">
                    <h5>Seleccione un Mes y un Reporte</h5>
                </div>               
            </div>

            <div class="row">
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="row">

                        <div class="col-6">
                            <div class="form-group">
                                <select class="form-control" id="cmbMes"></select>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <select class="form-control" id="cmbAnio"></select>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                    <div class="form-group">
                        <label>Por Fecha</label>
                        <input type="date" class="form-control" id="txtFecha">
                    </div>
                </div>
                <div class="col-sm-8 col-md-8 col-lg-8 col-xl-8">
                    <div class="form-group">
                        <label>Seleccione un Reporte</label>
                        <select class="form-control border-danger negrita text-danger" id="cmbReporte">
                            <option value="1">PEDIDOS DEL DIA (DIA)</option>
                            <option value="2">MARCAS VENDIDAS (DIA)</option>
                            <option value="3">PRODUCTOS VENDIDOS (DIA)</option>
                            <option value="4">VENTAS POR FECHA (MES)</option>
                            <option value="5">PRODUCTOS DEL MES (MES)</option>
                            <option value="6">MARCAS DEL MES (MES)</option>
                            <option value="7">VENTAS NETAS - OBJETIVO (MES)</option>
                        </select>
                    </div>
                </div>
            </div>
            `
        },
        listado: ()=>{
            return `
                <hr class="solid">
            <div class="" id="containerTotal"></div>
                <br>
            <div class="row card">
                <div class="table-responsive" id="tblReport">
                  
                </div>
            </div>
            `
        },
        modalDetallePedido:()=>{
            return `
            <div class="card">          
            <br>
            <div class="table-responsive">
                <table class="table table-responsive table-hover table-striped table-bordered">
                    <thead class="bg-trans-gradient text-white">
                        <tr>
                            <td>Producto</td>
                            <td>Medida</td>
                            <td>Cant</td>
                            <td>Precio</td>
                            <td>Subtotal</td>
                        </tr>
                    </thead>
                    <tbody id="tblDetallePedido"></tbody>
                    
                </table>
            </div>
            <br>
            <div class="">
                <div class="col-1"></div>
                <div class="col-5">
                    <label>Total Pedido : </label>
                    <h2 class="text-danger" id="lbTotalDetallePedido"></h2>
                </div>
            </div>
            <div class="row">
                <button class="btn btn-info btn-lg" id="btnEditarPedido">
                    <i class="fal fa-edit"></i>
                    Editar Pedido
                </button>
            </div>
        </div>
        `
        },
        modalCantidad:()=>{
            return `
            <div class="modal fade" id="ModalCantidad" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-md" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <label class="modal-title text-danger h3" id="">Nueva Cantidad</label>
                        </div>

                        <div class="modal-body">

                            <div class="row">
                                <div class="col-2">
                                    <h1 class="text-danger fw-700">Cant:</h1>
                                </div>
                                <div class="col-8 text-center">
                                    <h1 class="text-danger fw-700" id="lbCalcTotal">0</h1>
                                </div>
                                <div class="col-2"></div>
                            </div>
                            
                            <br>

                            <div class="row">
                                <div class="col-4">
                                    <button class="btn btn-xl btn-circle btn-info" id="btnCalc1">1</button>
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-xl btn-circle btn-info" id="btnCalc2">2</button>
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-xl btn-circle btn-info" id="btnCalc3">3</button>
                                </div>
                            </div>
                            
                            <br>

                            <div class="row">
                                <div class="col-4">
                                    <button class="btn btn-xl btn-circle btn-info" id="btnCalc4">4</button>
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-xl btn-circle btn-info" id="btnCalc5">5</button>
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-xl btn-circle btn-info" id="btnCalc6">6</button>
                                </div>
                            </div>
                            
                            <br>

                            <div class="row">
                                <div class="col-4">
                                    <button class="btn btn-xl btn-circle btn-info" id="btnCalc7">7</button>
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-xl btn-circle btn-info" id="btnCalc8">8</button>
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-xl btn-circle btn-info" id="btnCalc9">9</button>
                                </div>
                            </div>
                            <br>
                            <div class="row">
                                <div class="col-4">
                            
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-xl btn-circle btn-info" id="btnCalc0">0</button>
                                </div>
                                <div class="col-4">
                            
                                </div>
                            </div>

                            <br><br><br>

                            <div class="row">
                                <div class="col-4">
                                    <button class="btn btn-danger btn-md" id="btnCalcCancelar">Cancelar</button>
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-primary btn-md" id="btnCalcLimpiar">Limpiar</button>
                                </div>
                                <div class="col-4">
                                    <button class="btn btn-success btn-md" id="btnCalcAceptar">Aceptar</button>
                                </div>
                            </div>
                        
                        </div>
                        
                    </div>
                </div>
            </div>
            `
        }
    };

    root.innerHTML = view.encabezado() + view.listado();
    rootMenuLateral.innerHTML = view.modalDetallePedido() + view.modalCantidad();
    lbMenuTitulo.innerText = "Detalle del Pedido";

};

function addListeners(){

    document.getElementById('txtFecha').value = funciones.getFecha();
    document.getElementById('txtFecha').addEventListener('change',()=>{
        getCargarGrid();
    })

    let f = new Date();
    let cmbMes = document.getElementById('cmbMes');
    cmbMes.innerHTML = funciones.ComboMeses();
    let cmbAnio = document.getElementById('cmbAnio');
    cmbAnio.innerHTML = funciones.ComboAnio();

    cmbMes.value = f.getMonth()+1;
    cmbAnio.value = f.getFullYear();


    //CARGA DE LOS REPORTES
    let cmbReporte = document.getElementById('cmbReporte');
    cmbReporte.addEventListener('change',()=>{
        
        getCargarGrid();

    });


    let btnEditarPedido = document.getElementById('btnEditarPedido');
    btnEditarPedido.addEventListener('click',()=>{
        cargarPedidoEdicion(GlobalSelectedCoddoc,GlobalSelectedCorrelativo,GlobalSelectedSt);    
    });


    apigen.pedidosVendedor(GlobalCodSucursal,GlobalCodUsuario,funciones.devuelveFecha('txtFecha'),'tblReport','containerTotal');

   

};

function getCargarGrid(){

    let cmbReporte = document.getElementById('cmbReporte');
    let cmbMes = document.getElementById('cmbMes');
    let cmbAnio = document.getElementById('cmbAnio');

    switch (cmbReporte.value.toString()) {
        case '1':
            //PEDIDOS POR FECHA
            apigen.pedidosVendedor(GlobalCodSucursal,GlobalCodUsuario,funciones.devuelveFecha('txtFecha'),'tblReport','containerTotal');
            break;
    
        case '2':
            //MARCAS POR FECHA
            apigen.reporteDiaMarcas(GlobalCodSucursal,GlobalCodUsuario,funciones.devuelveFecha('txtFecha'),'tblReport','containerTotal');
            break;

        case '3':
            //PRODUCTOS POR FECHA
            apigen.reporteDiaProductos(GlobalCodSucursal,GlobalCodUsuario,funciones.devuelveFecha('txtFecha'),'tblReport','containerTotal');
            break;
        
        case '4':
            //VENTAS POR FECHA
            getRptDinero(cmbMes.value, cmbAnio.value);
            break;
        case '5':
            //PRODUCTOS DEL MES
            getRptProductos(cmbMes.value, cmbAnio.value);
            break;
        
        case '6':
            //MARCAS POR MES
            getRptMarcas(cmbMes.value, cmbAnio.value);
            break;
        
        case '7':
            //VENTAS NETAS MES
            getRptDinero2(cmbMes.value, cmbAnio.value);
            break;
        default:
            break;
    }
};



function inicializarVistaLogro(){
    getView();
    addListeners();
};

function getRptDinero2(mes,anio){
    apigen.reporteDinero2(GlobalCodSucursal,GlobalCodUsuario,anio,mes,'tblReport','containerTotal');
};
function getRptDinero(mes,anio){
    apigen.reporteDinero(GlobalCodSucursal,GlobalCodUsuario,anio,mes,'tblReport','containerTotal');
};
function getRptProductos(mes,anio){
    apigen.reporteProductos(GlobalCodSucursal,GlobalCodUsuario,anio,mes,'tblReport','containerTotal');
};
function getRptMarcas(mes,anio){
    apigen.reporteMarcas(GlobalCodSucursal,GlobalCodUsuario,anio,mes,'tblReport','containerTotal');
};



//POR DIA

function deletePedidoVendedor(fecha,coddoc,correlativo,st){
  
    if(st=='O'){
        funciones.Confirmacion('¿Está seguro que desea Eliminar este Pedido?')
        .then((value)=>{
            if(value==true){
                funciones.solicitarClave()
                    .then((clave)=>{
                        if(clave==GlobalPassUsuario){

                            apigen.deletePedidoVendedor(GlobalCodSucursal,GlobalCodUsuario,fecha,coddoc,correlativo)
                            .then(()=>{
                                funciones.Aviso('Pedido Eliminado Exitosamente!!');
                                console.log('recargandolista');
                                //apigen.pedidosVendedor(GlobalCodSucursal,GlobalCodUsuario,funciones.devuelveFecha('txtFechaPedido'),'tblListaPedidos','lbTotalPedidos');
                                apigen.pedidosVendedor(GlobalCodSucursal,GlobalCodUsuario,funciones.devuelveFecha('txtFecha'),'tblReport','containerTotal');
                            })
                            .catch(()=>{
                                funciones.AvisoError('No se pudo eliminar')
                            })

                        }else{
                            funciones.AvisoError('Clave incorrecta')
                        }
                    }
                )        
            }
        });

    }else{
        funciones.AvisoError('No se puede Eliminar un pedido que ya fué confirmado por Digitación');
        funciones.hablar('No se puede Eliminar un pedido que ya fué confirmado por Digitación, comuníquese a oficina para solucionarlo');
    }  

};

function getDetallePedido(fecha,coddoc,correlativo,codclie,nomclie,dirclie,st){

    GlobalSelectedSt = st;
    GlobalSelectedFecha = fecha;
    GlobalSelectedCoddoc = coddoc;
    GlobalSelectedCorrelativo = correlativo;
    GlobalSelectedCodCliente=codclie;
    GlobalSelectedNomCliente=nomclie;
    GlobalSelectedDirCliente=dirclie;

    lbMenuTitulo.innerText = `Pedido: ${coddoc}-${correlativo}`;
    apigen.digitadorDetallePedido(fecha,coddoc,correlativo,'tblDetallePedido','lbTotalDetallePedido')
    $("#modalMenu").modal('show');
    
};

function getModalCantidad(idRow){

    document.getElementById('lbCalcTotal').innerText='';    
    $("#ModalCantidad").modal('show');


};

function deleteProductoPedido(idRow,coddoc,correlativo,totalprecio,totalcosto){
    funciones.Confirmacion('¿Está seguro que desea Quitar este Producto en este Pedido?')
    .then((value)=>{
        if(value==true){

            apigen.digitadorQuitarRowPedido(idRow,coddoc,correlativo,totalprecio,totalcosto)
            .then(async()=>{
                
                await apigen.pedidosVendedor(GlobalCodSucursal,GlobalCodUsuario,funciones.devuelveFecha('txtFechaPedido'),'tblListaPedidos','lbTotalPedidos');

                document.getElementById(idRow).remove();
                
                apigen.digitadorDetallePedido(GlobalSelectedFecha,coddoc,correlativo,'tblDetallePedido','lbTotalDetallePedido')

                funciones.Aviso('Item removido exitosamente !!')
            })
            .catch((error)=>{
                console.log(error)
                funciones.AvisoError('No se pudo remover el item')
            })
            
            
        }
    })    
};

function iniciarModalCantidad(){
    let total = document.getElementById('lbCalcTotal');
    total.innerText = "";
    let btnCalcAceptar = document.getElementById('btnCalcAceptar');
    let btnCalcLimpiar = document.getElementById('btnCalcLimpiar');
    let btnCalcCancelar = document.getElementById('btnCalcCancelar');

    let b0 = document.getElementById('btnCalc0');
    let b1 = document.getElementById('btnCalc1');
    let b2 = document.getElementById('btnCalc2');
    let b3 = document.getElementById('btnCalc3');
    let b4 = document.getElementById('btnCalc4');
    let b5 = document.getElementById('btnCalc5');
    let b6 = document.getElementById('btnCalc6');
    let b7 = document.getElementById('btnCalc7');
    let b8 = document.getElementById('btnCalc8');
    let b9 = document.getElementById('btnCalc9');

    b0.addEventListener('click',()=>{total.innerText = total.innerText + "0"})
    b1.addEventListener('click',()=>{total.innerText = total.innerText + "1"})
    b2.addEventListener('click',()=>{total.innerText = total.innerText + "2"})
    b3.addEventListener('click',()=>{total.innerText = total.innerText + "3"})
    b4.addEventListener('click',()=>{total.innerText = total.innerText + "4"})
    b5.addEventListener('click',()=>{total.innerText = total.innerText + "5"})
    b6.addEventListener('click',()=>{total.innerText = total.innerText + "6"})
    b7.addEventListener('click',()=>{total.innerText = total.innerText + "7"})
    b8.addEventListener('click',()=>{total.innerText = total.innerText + "8"})
    b9.addEventListener('click',()=>{total.innerText = total.innerText + "9"})
    btnCalcLimpiar.addEventListener('click',()=>{total.innerText = ""})

    btnCalcAceptar.addEventListener('click',async ()=>{
        let n = Number(total.innerText);
        
        fcnUpdateRowPedido();
        //fcnUpdateTempRow(GlobalSelectedId,n)
        //.then(async()=>{
            
            //
        //})
        total.innerText = "";
        
        $("#ModalCantidad").modal('hide');
    })

    btnCalcCancelar.addEventListener('click',()=>{
        $("#ModalCantidad").modal('hide');
    });

};

function cargarPedidoEdicion(coddoc,correlativo,st){
    if(st=='O'){

        funciones.Confirmacion('¿Está seguro que desea EDITAR este pedido, no se podrá deshacer lo que haga?')
        .then((value)=>{
            if(value==true){
                $("#modalMenu").modal('hide');
                funciones.solicitarClave()
                        .then((clave)=>{
                            if(clave==GlobalPassUsuario){
                                setLog(`<label>Eliminando datos de algún pedido pendiente...</label>`,'rootWait')
                                $('#modalWait').modal('show');

                                //document.getElementById('btnEditarPedido').innerHTML = GlobalLoaderMini;
                                //document.getElementById('btnEditarPedido').disabled = true;
                                
                                deleteTempVenta(GlobalUsuario)
                                .then(()=>{
                                    setLog(`<label>Descargando datos del pedido a editar...</label>`,'rootWait')
                                    //descarga el pedido y lo inserta en el indexed
                                    loadDetallePedido(coddoc,correlativo)
                                    .then(()=>{
                                        funciones.showToast('Pedido cargado...');

                                        setLog(`<label>Eliminando pedido anterior...</label>`,'rootWait')
                                        fcnDeletePedidoCargado(coddoc,correlativo)
                                        .then(()=>{
                                            funciones.showToast('Pedido anterior eliminado con éxito!!');
                                            
                                            $('#modalWait').modal('hide');
                                            classNavegar.ventas(GlobalSelectedCodCliente,GlobalSelectedNomCliente,GlobalSelectedDirCliente);
                                        })
                                        .catch(()=>{
                                            $('#modalWait').modal('hide');
                                            //document.getElementById('btnEditarPedido').innerHTML = `<i class="fal fa-edit"></i>Editar Pedido`;
                                            //document.getElementById('btnEditarPedido').disabled = false;
                                            funciones.AvisoError('No se pudo eliminar el pedido anterior');
                                        })
        
                                    })
                                    .catch((error)=>{
                                        $('#modalWait').modal('hide');
                                        //document.getElementById('btnEditarPedido').innerHTML = `<i class="fal fa-edit"></i>Editar Pedido`;
                                        //document.getElementById('btnEditarPedido').disabled = false;
                                        funciones.AvisoError('No se pudo cargar el pedido. Error: ' + error);
                                    })
                                })
                                .catch(()=>{
                                    $('#modalWait').modal('hide');

                                    funciones.AvisoError('No se pudo limpiar el pedido')
                                })

                                
    
                            }
                        })
    
            }
        })

    }else{
        funciones.AvisoError('No se puede EDITAR un pedido que ya fue confirmado en digitación');
    }

    
    
};

//SELECCIONA EL DETALLE DEL PEDIDO Y LO CARGA
function loadDetallePedido(coddoc,correlativo){
    
    return new Promise((resolve,reject)=>{
        axios.post('/ventas/loadpedido', {
            sucursal:GlobalCodSucursal,
            coddoc: coddoc,
            correlativo: correlativo,
            usuario: GlobalUsuario
        })
        .then((response) => {
            const data = response.data;
           data.recordset.map((rows)=>{
                insertTempVentas(rows);
           })
            resolve();
        }, (error) => {
            //funciones.AvisoError('Error en la solicitud');
            reject('Error de solicitud');
        });

    })
    
    
};

function loadDetallePedido_online(coddoc,correlativo){
    
    return new Promise((resolve,reject)=>{
        axios.post('/ventas/loadpedido', {
            sucursal:GlobalCodSucursal,
            coddoc: coddoc,
            correlativo: correlativo,
            usuario: GlobalUsuario
        })
        .then((response) => {
            console.log(response);
            const data = response.data;
            if (data.rowsAffected[1]==0){
                //funciones.AvisoError('No se cargó el pedido');
                reject('No se cargó el pedido');
            }else{
                //funciones.Aviso('Pedido Cargado con éxito')
                resolve();
            }
            
        }, (error) => {
            //funciones.AvisoError('Error en la solicitud');
            resolve('Error de solicitud');
        });

    })
    
    
};

function fcnDeletePedidoCargado(coddoc,correlativo){
    return new Promise((resolve,reject)=>{
        axios.post('/ventas/eliminarpedidocargado', {
            sucursal:GlobalCodSucursal,
            coddoc: coddoc,
            correlativo: correlativo
        })
        .then((response) => {
            
            const data = response.data;
            if(Number(data.rowsAffected[0])>0){
                resolve();             
            }else{
                reject();
            }
          
        }, (error) => {
            //funciones.AvisoError('Error en la solicitud');
            reject();
        });
    })
    
};