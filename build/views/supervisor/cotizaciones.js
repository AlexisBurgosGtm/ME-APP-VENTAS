var CotizEditMode = false;
var CotizEditCorrelativo = 0;
var CotizEditCoddoc = 'cotiz';

function pad2Cotiz(n) {
    const v = Number(n) || 0;
    return v < 10 ? ('0' + v) : String(v);
}

function formatFechaCotiz(fecha, anio, mes, dia) {
    const ai = Number(anio);
    const mi = Number(mes);
    const di = Number(dia);
    if (ai >= 2000 && mi >= 1 && mi <= 12 && di >= 1 && di <= 31) {
        return pad2Cotiz(di) + '/' + pad2Cotiz(mi) + '/' + ai;
    }
    if (!fecha) return '';
    const s = String(fecha);
    // Preferir yyyy-mm-dd puro (sin hora) para no aplicar TZ
    const plain = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (plain) return plain[3] + '/' + plain[2] + '/' + plain[1];
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m && !/[T ]\d/.test(s)) return m[3] + '/' + m[2] + '/' + m[1];
    // ISO con hora: interpretar en calendario Guatemala
    try {
        const d = new Date(fecha);
        if (!isNaN(d.getTime())) {
            const gt = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'America/Guatemala',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(d); // YYYY-MM-DD
            const p = gt.split('-');
            if (p.length === 3) return p[2] + '/' + p[1] + '/' + p[0];
        }
    } catch (e) {}
    return s;
}

function formatHoraCotiz(hora, minuto) {
    return pad2Cotiz(hora) + ':' + pad2Cotiz(minuto);
}

function getView(){
    let view = {
        encabezadoClienteDocumento :()=>{
            return `
        <div class="row">
            
            <div class="hidden-md-down col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div id="panel-2" class="panel col-12">
                    <div class="panel-hdr">
                        <h2>Datos del Cliente</h2>
                        <div class="panel-toolbar">
                            <button class="btn btn-panel" data-action="panel-collapse" data-toggle="tooltip" data-offset="0,10" data-original-title="Collapse"></button>
                            <button class="btn btn-panel" data-action="panel-fullscreen" data-toggle="tooltip" data-offset="0,10" data-original-title="Fullscreen"></button>
                        </div>
                    </div>
                    <div class="panel-container collapse">
                        <div class="panel-content">
                            <div class="">
                                <div class="input-group">
                                    <input id="txtNit" type="text" ref="txtNit" class="form-control" placeholder="Código del cliente.." aria-label="" aria-describedby="button-addon4" />
                                    <div class="input-group-prepend">
                                        <button class="btn btn-info waves-effect waves-themed" type="button" id="btnBusquedaClientes">
                                            <i class="fal fa-search"></i>
                                        </button>
                                        <div class="card"></div>
                                        <button class="btn btn-success waves-effect waves-themed" id="btnNuevoCliente">
                                            +
                                        </button>
                                    </div>
                                    
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="hidden-md-down col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div id="panel-3" class="panel col-12">
                    <div class="panel-hdr">
                        <h2>Datos del Documento</h2>
                        <div class="panel-toolbar">
                            <button class="btn btn-panel" data-action="panel-collapse" data-toggle="tooltip" data-offset="0,10" data-original-title="Collapse"></button>
                            <button class="btn btn-panel" data-action="panel-fullscreen" data-toggle="tooltip" data-offset="0,10" data-original-title="Fullscreen"></button>
                            
                        </div>
                    </div>
                    <div class="panel-container collapse"> <!--show-->
                        <div class="panel-content">
                            <div class="row">
                                <div class="col-6">
                                    <input type="text" class="form-control input-sm" id="cmbCoddoc">
                                    
                                </div>
                                <div class="col-6">
                                    <input type="text" class="form-control" value="0" id="txtCorrelativo" readonly="true">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    Fecha: <input type="date" class="form-control bg-subtlelight pl-4 text-sm" id="txtFecha">
                                </div>
                                <div class="col-6">
                                    Vendedor:
                                    <input type="text" class="form-control" id="cmbVendedor">
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

        </div>
            `
            //<select class="form-control input-sm" id="cmbCoddoc"></select>
            //<select class="form-control" id="cmbVendedor"></select>
        },
        gridTempVenta :()=>{
            return `
        <div class="factura-page">
            <div class="factura-card-shell">
                <div class="factura-card-header">
                    <div>
                        <label class="text-info mb-0" id="lbNomClien">Consumidor Final</label>
                        <div class="factura-card-meta text-secondary" id="txtTotalItems">0 items</div>
                    </div>
                    <h1 id="txtTotalVenta" class="text-danger negrita mb-0"></h1>
                </div>
                <div class="factura-card-body">
                    <div class="factura-cart-table-wrap">
                        <table class="table factura-cart-table w-100 mb-0">
                            <thead class="factura-cart-thead">
                                <tr>
                                    <th>Producto</th>
                                    <th class="text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody id="tblGridTempVentas"></tbody>
                        </table>
                    </div>
                </div>
                <div class="factura-card-actions">
                    <button class="btn btn-xl btn-secondary btn-bottom-ml btn-circle hand shadow" id="btnCambiarCliente">
                        <i class="fal fa-user"></i>
                    </button>
                    <button class="btn btn-circle btn-xl btn-success shadow btn-bottom-mr hand" id="btnAgregarProd">
                        <i class="fal fa-search"></i>
                    </button>
                    <button class="btn btn-danger btn-xl btn-circle btn-bottom-r shadow hand" id="btnCobrar">
                        <i class="fal fa-save"></i>
                    </button>
                </div>
                <div id="containerModalesVentas"></div>
            </div>
        </div>
            `
        },
        gridTempVentaModalBusquedaProductos :()=>{
            return `
        <div class="row">
            <div id="panel-2" class="panel col-12">


                <div class="panel-hdr">
                    <h2 id="txtTotalVenta" class="text-danger"></h2>
                    <div class="panel-toolbar">
                                               
                        <button class="btn btn-warning" data-action="panel-fullscreen" data-toggle="tooltip" data-offset="0,10" data-original-title="Fullscreen">
                            <i class="fal fa-angle-double-up"></i>
                        </button>
                    </div>
                </div>
                <div class="panel-container show">
                    <div class="panel-content">
                        <div class="col-sm-12 col-md-8 col-lg-8 col-xl-8">
                            <div class="input-group">
                                <select class="form-control col-3 shadow border-info" id="cmbTipoPrecio">
                                    <option value="P">DET</option>
                                    <option value="C">PreB</option>
                                    <option value="B">PreC</option>
                                    <option value="A">MAY</option>
                                    <option value="K">CAMBIO</option>
                                </select>
                                <input id="txtBusqueda" type="text" ref="txtBusqueda" class="form-control col-7  shadow border-info" placeholder="Buscar código o descripción..." aria-label="" aria-describedby="button-addon4" />
                                <div class="input-group-prepend">
                                    <button class="btn btn-info waves-effect waves-themed shadow" type="button" id="btnBuscarProducto">
                                        <i class="fal fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover table-striped"><!--mt-5-->
                                <thead>
                                    <tr>
                                        <th class="border-top-0 table-scale-border-bottom fw-700">Producto</th>
                                        <th class="text-right border-top-0 table-scale-border-bottom fw-700">Medida</th>
                                        <th class="text-center border-top-0 table-scale-border-bottom fw-700">Cant.</th>
                                        <th class="text-right border-top-0 table-scale-border-bottom fw-700">Subtotal</th>
                                        <th class="text-center border-top-0 table-scale-border-bottom fw-700"></th>
                                    </tr>
                                </thead>
                                <tbody id="tblGridTempVentas"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="modal fade modal-with-scroll" id="ModalBusqueda" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-right" role="document">
                        <div class="modal-content">
                            <div class="modal-header p-2">
                                <label class="modal-title text-danger h5" id="">Búsqueda de Productos</label>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true"><i class="fal fa-times"></i></span>
                               </button>
                            </div>
                            <div class="modal-body">
                            <table class="table table-responsive table-striped table-hover">
                                <thead class="bg-trans-gradient text-white">
                                    <tr>
                                        <td>Producto</td>
                                        <td>Precio</td>                         
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody id="tblResultadoBusqueda">
                                
                                </tbody>
                            </table>
                            </div>        
                        </div>
                    </div>

                    <div class="shortcut-menu align-left">
                        <button class="btn btn-danger btn-md" data-dismiss="modal">
                            <i class="fal fa-angle-double-left"></i>Atrás
                        </button>
                    </div>

                </div>

                <div class="modal fade  modal-with-scroll" id="ModalCantidadProducto" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-right" role="document">
                        <div class="modal-content">
                            <br><br><br><br><br>
                            <div class="modal-header">
                                <label class="modal-title" id="txtDesProducto">Azucar don Justo Cabal Kilo</label>
                            </div>
                            <div class="modal-body" align="right">
                                <div class="col-8">
                                    <div class="row">
                                        <b id="txtCodMedida">UNIDAD</b>
                                    </div>
                                    <div class="form-group">
                                        <div class="row">
                                            <div class="input-group">  
                                                <div class="input-group-prepend">
                                                    <button class="btn btn-md btn-icon btn-round btn-info" id="btnCantidadDown">
                                                        -
                                                    </button>
                                                </div>
                                    
                                                <input type="number" class="text-center form-control" id="txtCantidad" value="1">    
                                    
                                                <div class="input-group-append">
                                                    <button class="btn btn-md btn-icon btn-round btn-info" id="btnCantidadUp">
                                                        +
                                                    </button>    
                                                </div>
                                            </div>                            
                                        </div>                              
                                    </div>
                                    <div class="col-12">
                                        <label>Precio: </label>
                                        <label class="text-success" id="txtPrecioProducto">Q500</label>
                                        <br>
                                        <label>Subtotal:</label>
                                        <label class="text-danger" id="txtSubTotal">Q500</label>
                                    </div>
                                    <br>
                                    <div class="">
                                        <button type="button" class="btn btn-outline-secondary btn-round" data-dismiss="modal" id="btnCancelarModalProducto">
                                            <i class="fal fa-ban"></i>Cancelar
                                        </button>
                                        <button type="button" class="btn btn-primary btn-round" id="btnAgregarProducto">
                                            <i class="fal fa-check"></i>Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>  
            `
        },
        modalBusquedaProductos :()=>{
            return `
            <div class="modal fade factura-search-modal" id="ModalBusqueda" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-lg factura-search-dialog" role="document">
                    <div class="modal-content factura-search-modal-content">
                        <div class="modal-header border-0 pb-0 factura-search-header">
                            <label class="modal-title text-secondary h5 mb-0">Búsqueda de Productos</label>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true"><i class="fal fa-times"></i></span>
                            </button>
                        </div>
                        <div class="modal-body factura-search-body pt-2">
                            <div class="factura-search-toolbar">
                                <select class="form-control factura-price-select text-left" id="cmbTipoPrecio">
                                    <option value="P">DETALLE</option>
                                    <option value="C">PRECIO B</option>
                                    <option value="B">PRECIO A</option>
                                    <option value="A">MAYORISTA</option>
                                    <option value="K">CAMBIO</option>
                                </select>
                                <input id="txtBusqueda" type="text" ref="txtBusqueda" class="form-control factura-search-input" placeholder="Buscar código o descripción..." />
                                <button class="btn btn-success factura-search-btn" type="button" id="btnBuscarProducto">
                                    <i class="fal fa-search"></i>
                                </button>
                            </div>
                            <div class="factura-search-table-wrap">
                                <table class="table factura-search-table w-100 mb-0">
                                    <thead class="factura-search-thead">
                                        <tr>
                                            <th>Producto</th>
                                            <th>Precio</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody id="tblResultadoBusqueda"></tbody>
                                </table>
                            </div>
                        </div>
                        <button type="button" class="factura-search-fab-close btn btn-danger shadow" data-dismiss="modal" id="btnCerrarModalBusqueda" aria-label="Cerrar búsqueda">
                            <i class="fal fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
            `
        },
        modalBusquedaCliente :()=>{
            return `
            <div class="modal fade  modal-with-scroll" id="ModalBusquedaCliente" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-left" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="btn btn-sm btn-outline-secondary mr-2" id="btnClienteAtrasLista">
                                <i class="fal fa-arrow-left"></i> Atrás
                            </button>
                            <label class="modal-title text-danger h3 mb-0" id="">Búsqueda de Clientes</label>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><i class="fal fa-times"></i></span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <div class="input-group">
                                    <input id="txtBusquedaCliente" type="text" ref="txtBusquedaCliente" class="form-control" placeholder="Buscar por nombre de cliente..." aria-label="" aria-describedby="button-addon4" />
                                    <div class="input-group-prepend">
                                        <button class="btn btn-info waves-effect waves-themed" type="button" id="btnBuscarCliente">
                                            <i class="fal fa-search"></i>
                                        </button>
                                    </div>
                            </div>
                        <table class="table table-responsive table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <td>Nombre</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblResultadoBusquedaCliente">
                            

                            </tbody>
                        </table>
                        </div>

                    
                    </div>
                </div>
            </div>
            `
        },
        modalNuevoCliente :()=>{
            return `
            <div class="modal fade" id="ModalNuevoCliente" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <label class="modal-title text-danger h3" id="">Datos del Cliente</label>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><i class="fal fa-times"></i></span>
                            </button>
                        </div>
            
                        <div class="modal-body">
                            <form class="col-12" id="formNuevoCliente">
                                <div class="form-group col-6">
                                    <label>Código/NIT:</label>
                                    <input type="text" class="form-control" id='txtClienteNit' required='true' readonly="true">
                                </div>

                                <div class="row">
                                    <div class="form-group col-6">
                                        <label>Nombre Cliente:</label>
                                        <input type="text" class="form-control" id='txtClienteNombre' required='true'>
                                    </div>                               
                                    <div class="form-group col-6">
                                        <label>Nombre para Factura:</label>
                                        <input type="text" class="form-control" id='txtClienteNombreFac' required='true'>
                                    </div>                               
                                </div>
                                
                                <div class="form-group">
                                    <label>Dirección:</label>
                                    <input type="text" class="form-control" id='txtClienteDireccion' required='true'>
                                </div>

                                <div class="row">
                                    <div class="form-group col-6">
                                        <label>Teléfono:</label>
                                        <div class="row">
                                            <select class="form-control col-3">
                                                <option value="502">+502</option>
                                            </select>
                                            <input type="number" class="form-control col-9" id='txtClienteTelefono'>    
                                        </div>
                                    </div>
                                    <div class="form-group col-6">
                                        <label>Email:</label>
                                        <input type="email" class="form-control" id='txtClienteEmail'>
                                    </div>                               
                                </div>

                                <div class="row">
                                    <div class="form-group col-7">
                                        <label>Municipio:</label>
                                        <select class="form-control" id="cmbClienteMunicipio">
                                            <option value="01">GUATEMALA</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-5">
                                        <label>Departamento:</label>
                                        <select class="form-control" id="cmbClienteDepartamento">
                                            <option value="01">GUATEMALA</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-group col-6">
                                    <label>Tipo de Precio:</label>
                                    <select class="form-control" id="cmbClienteTipoPrecio">
                                        
                                    </select>
                                </div>

                                <div class="form-group table-scale-border-top border-left-0 border-right-0 border-bottom-0 text-right">
                                    <br>
                                    <button class="btn btn-warning btn-round btn-lg" data-dismiss="modal" id="btnCancelarCliente">
                                        CANCELAR
                                    </button>
                                    <button class="btn btn-transparent"></button>
                                    <input type="submit" class="btn btn-primary btn-round btn-lg" value="GUARDAR">
                                        
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </div>
            `
        },
        modalTerminar :()=>{
            return `
                <div class="modal fade cotiz-finalizar-modal" id="ModalFinalizarPedido" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <label class="modal-title text-danger h3" id="">Finalización del Pedido</label>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true"><i class="fal fa-times"></i></span>
                                </button>
                            </div>
                
                            <div class="modal-body shadow">
                                    <div class="">      
                                    
                                        <div class="form-group">
                                            <label>Cliente:</label>
                                            <input class="form-control" style="font-size:80%" id="txtNombre" disabled="true">
                                            <label>Dirección:</label>
                                            <input class="form-control" style="font-size:80%" id="txtDireccion" disabled="true">
                                        </div>

                                        <div class="form-group">
                                            <label>Total Venta:</label>
                                            <h3 class="negrita text-danger" id="lbTotalPedido2"></h3>
                                            
                                        </div>
                                        

                                        <div class="form-group">
                                            <label>Forma de Pago:</label>
                                            <select id="cmbEntregaConcre" class="form-control">
                                                <option value="CONTADO">CONTADO</option>
                                                <option value="CREDITO">CREDITO</option>
                                                <option value="VALE">VALE AL VENDEDOR</option>
                                                <option value="FACTURA">FACTURA CONTABLE</option>
                                            </select>
                                        </div>

                                        <div class="form-group">
                                            <label>Prioridad:</label>
                                            <select id="cmbCotizPrioridad" class="form-control">
                                                <option value="NORMAL" selected>NORMAL</option>
                                                <option value="BAJA">BAJA</option>
                                                <option value="ALTA">ALTA</option>
                                            </select>
                                        </div>

                                        <div class="form-group">
                                            <label>Observaciones</label>
                                            <textarea rows="3" cols="80" class="form-control" id="txtEntregaObs" placeholder="Escriba aqui sus observaciones..."></textarea>
                                        </div>                                                              
                                            
                                    </div>

                                    <div class="row">
                                        <label class="text-white" id="lbDocLat">0</label>
                                        <label class="text-white" id="lbDocLong">0</label class="text-white">
                                    </div>
                                    
                                    <br>
            
                                    <div class="row">
                                        <div class="col-5">
                                            <button class="btn btn-outline-secondary btn-lg  btn-pills btn-block waves-effect waves-themed" data-dismiss="modal" id="btnEntregaCancelar">
                                                <i class="fal fa-ban mr-1"></i>
                                                Cancelar
                                            </button>                                
                                        </div>
            
                                        <div class="col-1"></div>
            
                                        <div class="col-5">
                                            <button class="btn btn-outline-success btn-lg btn-pills btn-block waves-effect waves-themed" id="btnFinalizarPedido">
                                                <i class="fal fa-paper-plane mr-1"></i>Enviar
                                            </button>
                                        </div>
                                        
                                        
                                    </div>
                            
                            </div>
                        
                        </div>
                    </div>
                </div>`
        },
        modalCantidadProducto:()=>{
            return `
            <div class="modal fade factura-qty-modal" id="ModalCantidadProducto" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
                    <div class="modal-content factura-qty-modal-content">
                        <div class="modal-header border-0 pb-0">
                            <label class="modal-title text-secondary h6 mb-0" id="txtDesProducto">Producto</label>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body pt-2">
                            <div class="text-center mb-2">
                                <span class="badge badge-info px-3 py-2" id="txtCodMedida">UNIDAD</span>
                            </div>
                            <div class="input-group factura-qty-input-group mb-3">
                                <div class="input-group-prepend">
                                    <button class="btn btn-info btn-round" id="btnCantidadDown" type="button">-</button>
                                </div>
                                <input type="number" class="text-center form-control" id="txtCantidad" value="1">
                                <div class="input-group-append">
                                    <button class="btn btn-info btn-round" id="btnCantidadUp" type="button">+</button>
                                </div>
                            </div>
                            <div class="factura-qty-summary text-center mb-3">
                                <div><span class="text-secondary">Precio:</span> <strong class="text-success" id="txtPrecioProducto">Q0.00</strong></div>
                                <div><span class="text-secondary">Subtotal:</span> <strong class="text-danger" id="txtSubTotal">Q0.00</strong></div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <button type="button" class="btn btn-outline-secondary btn-block btn-round" data-dismiss="modal" id="btnCancelarModalProducto">
                                        <i class="fal fa-ban"></i> Cancelar
                                    </button>
                                </div>
                                <div class="col-6">
                                    <button type="button" class="btn btn-primary btn-block btn-round" id="btnAgregarProducto">
                                        <i class="fal fa-check"></i> Agregar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        },
        modalCambiarCantidadProducto :()=>{
            return `
                <div class="modal fade" id="modalCambiarCantidadProducto" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-md" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <label class="modal-title text-info h3" id="">Cambiar cantidad de producto</label>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true"><i class="fal fa-times"></i></span>
                                </button>
                            </div>
                
                            <div class="modal-body shadow">
                                    <div class="">            
                                        
                                        <div class="form-group">
                                            <label>Nueva cantidad:</label>
                                            <input type="number" class="form-control border-info shadow col-10" id="txtCantNuevaCant">
                                        </div>                                                             
                                            
                                    </div>
                                    
                                    <br>
            
                                    <div class="row">
                                        <div class="col-5">
                                            <button class="btn btn-secondary btn-lg  btn-pills btn-block waves-effect waves-themed" data-dismiss="modal" id="">
                                                <i class="fal fa-times mr-1"></i>
                                                Cancelar
                                            </button>                                
                                        </div>
            
                                        <div class="col-1"></div>
            
                                        <div class="col-5">
                                            <button class="btn btn-success btn-lg btn-pills btn-block waves-effect waves-themed" id="btnCantGuardar">
                                                <i class="fal fa-check mr-1"></i>Aceptar
                                            </button>
                                        </div>
                                        
                                        
                                    </div>
                            
                            </div>
                        
                        </div>
                    </div>
                </div>`
        }
    }


    root.innerHTML = view.encabezadoClienteDocumento() 
                + view.gridTempVenta() 
                + view.modalBusquedaCliente() 
                + view.modalNuevoCliente() 
                + view.modalTerminar(); 
                //+ view.modalCantidadCalculadora();

    let containerModalesVentas = document.getElementById('containerModalesVentas');
    containerModalesVentas.innerHTML = view.modalBusquedaProductos() 
                                        + view.modalCantidadProducto()
                                        + view.modalCambiarCantidadProducto();

};

async function iniciarVistaCotizaciones(){
    CotizEditMode = false;
    CotizEditCorrelativo = 0;
    CotizEditCoddoc = 'cotiz';
    GlobalSelectedCodCliente = '';
    cleanupCotizUiLocks();
    try { await deleteTempVenta(GlobalUsuario); } catch (e) {}
    showListaCotizaciones();
};

function getFechaCotizLocal(){
    // Siempre calendario de Guatemala (no UTC del host ni del navegador en otra zona)
    try {
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Guatemala',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date()); // YYYY-MM-DD
    } catch (e) {
        const f = new Date();
        const y = f.getFullYear();
        const m = String(f.getMonth() + 1).padStart(2, '0');
        const d = String(f.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
}

function cleanupCotizUiLocks(){
    try {
        if (typeof window._cotizBodyKeyup === 'function') {
            document.body.removeEventListener('keyup', window._cotizBodyKeyup);
            window._cotizBodyKeyup = null;
        }
        document.body.classList.remove('modal-open', 'cotiz-finalizar-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.querySelectorAll('.modal-backdrop').forEach((el) => {
            if (el && el.parentNode) el.parentNode.removeChild(el);
        });
        document.querySelectorAll('.modal.show').forEach((el) => {
            try { $(el).modal('hide'); } catch (e) {}
            el.classList.remove('show');
            el.style.display = 'none';
            el.setAttribute('aria-hidden', 'true');
        });
        const wait = document.getElementById('modalWait');
        if (wait) {
            try { $('#modalWait').modal('hide'); } catch (e) {}
            wait.classList.remove('show', 'factura-wait-modal');
            wait.style.display = 'none';
            wait.setAttribute('aria-hidden', 'true');
        }
        const pdfHost = document.getElementById('cotizPdfHost');
        if (pdfHost && pdfHost.parentNode) pdfHost.parentNode.removeChild(pdfHost);
        if (typeof hideFacturaPedidoWait === 'function') {
            try { hideFacturaPedidoWait(); } catch (e) {}
        }
        if (typeof hideWaitForm === 'function') {
            try { hideWaitForm(); } catch (e) {}
        }
        // Segunda pasada por si Bootstrap recrea el backdrop al cerrar
        document.querySelectorAll('.modal-backdrop').forEach((el) => {
            if (el && el.parentNode) el.parentNode.removeChild(el);
        });
        document.body.classList.remove('modal-open', 'cotiz-finalizar-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    } catch (e) {
        console.log('cleanupCotizUiLocks', e);
    }
}

function showListaCotizaciones(){
    GlobalSelectedForm = 'COTIZACIONES';
    cleanupCotizUiLocks();
    const hoy = getFechaCotizLocal();
    root.innerHTML = `
        <div class="supervisor-page" id="cotizListaPage">
            <div class="supervisor-card">
                <div class="supervisor-card-head">
                    <h4 class="supervisor-title"><i class="fal fa-file-alt mr-2"></i>Cotizaciones</h4>
                    <p class="supervisor-subtitle mb-0">Cotizaciones guardadas de la sede</p>
                </div>
                <div class="row mb-3">
                    <div class="col-5">
                        <label class="negrita small mb-1">Fecha inicial</label>
                        <input type="date" class="form-control form-control-sm" id="txtCotizFechaIni" value="${hoy}">
                    </div>
                    <div class="col-5">
                        <label class="negrita small mb-1">Fecha final</label>
                        <input type="date" class="form-control form-control-sm" id="txtCotizFechaFin" value="${hoy}">
                    </div>
                    <div class="col-2 d-flex align-items-end">
                        <button class="btn btn-info btn-sm btn-block" id="btnCotizFiltrar" title="Filtrar">
                            <i class="fal fa-search"></i>
                        </button>
                    </div>
                </div>
                <div class="supervisor-table-wrap table-responsive">
                    <table class="table table-sm supervisor-table table-striped table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Documento</th>
                                <th>Cliente</th>
                                <th class="text-right">Importe</th>
                                <th class="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tblCotizacionesLista">
                            <tr><td colspan="6" class="text-center text-muted">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <button type="button" class="btn btn-circle btn-xl shadow" id="btnCotizNueva"
                title="Nueva cotización">
                <i class="fal fa-plus"></i>
            </button>
            <div id="containerModalesVentas"></div>
        </div>
    `;

    document.getElementById('btnCotizFiltrar').addEventListener('click', () => cargarListaCotizaciones());
    document.getElementById('btnCotizNueva').addEventListener('click', () => {
        CotizEditMode = false;
        CotizEditCorrelativo = 0;
        GlobalSelectedCodCliente = '';
        showSelectorClienteCotizacion(true);
    });
    document.getElementById('txtCotizFechaIni').addEventListener('change', () => cargarListaCotizaciones());
    document.getElementById('txtCotizFechaFin').addEventListener('change', () => cargarListaCotizaciones());
    cargarListaCotizaciones();
};

async function cargarListaCotizaciones(){
    const tbody = document.getElementById('tblCotizacionesLista');
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">${GlobalLoader}</td></tr>`;

    const normalizeFecha = (v) => {
        const s = String(v || '').trim();
        const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m) return `${m[1]}-${m[2]}-${m[3]}`;
        return getFechaCotizLocal();
    };
    let ini = normalizeFecha(document.getElementById('txtCotizFechaIni').value);
    let fin = normalizeFecha(document.getElementById('txtCotizFechaFin').value);
    if (ini > fin) {
        const tmp = ini; ini = fin; fin = tmp;
        document.getElementById('txtCotizFechaIni').value = ini;
        document.getElementById('txtCotizFechaFin').value = fin;
    }

    try {
        // POST + no-cache: en Render/CDN los GET se cacheaban y el filtro parecía “roto”
        const response = await axios.post('/ventas/listcotizaciones', {
            codsucursal: GlobalCodSucursal,
            fechaini: ini,
            fechafin: fin,
            tz: 'America/Guatemala',
            _: Date.now()
        }, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        const data = response.data;
        if (!data || data.toString() === 'error' || !data.recordset) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">No se pudo cargar la lista</td></tr>`;
            return;
        }
        if (data.recordset.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Sin cotizaciones en el rango</td></tr>`;
            return;
        }
        let html = '';
        data.recordset.forEach((r) => {
            const docLabel = `${r.CODDOC}-${r.CORRELATIVO}`;
            const corr = Number(r.CORRELATIVO);
            html += `<tr>
                <td>${formatFechaCotiz(r.FECHA, r.ANIO, r.MES, r.DIA)}</td>
                <td>${formatHoraCotiz(r.HORA, r.MINUTO)}</td>
                <td><span class="negrita">${docLabel}</span></td>
                <td>${r.CLIENTE || ''}</td>
                <td class="text-right negrita text-danger">${funciones.setMoneda(r.TOTALPRECIO, 'Q')}</td>
                <td class="text-center text-nowrap">
                    <button class="btn btn-sm btn-outline-info btn-circle mr-1" title="Imprimir"
                        onclick="fcnImprimirCotizacion('${r.CODDOC}',${corr})">
                        <i class="fal fa-print"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary btn-circle mr-1" title="Descargar PDF"
                        onclick="fcnDescargarCotizacionPdf('${r.CODDOC}',${corr})">
                        <i class="fal fa-download"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning btn-circle mr-1" title="Editar productos"
                        onclick="fcnEditarCotizacion('${r.CODDOC}',${corr})">
                        <i class="fal fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-circle" title="Eliminar"
                        onclick="fcnEliminarCotizacion('${r.CODDOC}',${corr})">
                        <i class="fal fa-trash"></i>
                    </button>
                </td>
            </tr>`;
        });
        tbody.innerHTML = html;
    } catch (e) {
        console.log(e);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error de conexión</td></tr>`;
    }
};

function fcnImprimirCotizacion(coddoc, correlativo){
    fcnAbrirImprimibleCotizacion(coddoc, correlativo, 'print');
};

async function fcnDescargarCotizacionPdf(coddoc, correlativo){
    fcnAbrirImprimibleCotizacion(coddoc, correlativo, 'pdf');
};

function getCotizLogoUrl(){
    try {
        return new URL('./img/logoag.png', window.location.href).href;
    } catch (e) {
        try {
            if (typeof GlobalUrl !== 'undefined' && GlobalUrl) {
                return String(GlobalUrl).replace(/\/$/, '') + '/img/logoag.png';
            }
        } catch (e2) {}
        return './img/logoag.png';
    }
}

async function getCotizLogoDataUrl(){
    const url = getCotizLogoUrl();
    try {
        const res = await fetch(url, { cache: 'force-cache' });
        if (!res.ok) throw new Error('logo http ' + res.status);
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.log('logo dataurl fallback', e);
        return url;
    }
}

function escHtmlCotiz(v){
    return String(v == null ? '' : v)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

async function fetchCotizacionDetalle(coddoc, correlativo){
    const response = await axios.get(`/ventas/cotizaciondetalle?codsucursal=${encodeURIComponent(GlobalCodSucursal)}&coddoc=${encodeURIComponent(coddoc)}&correlativo=${correlativo}`);
    const data = response.data;
    if (!data || data.toString() === 'error' || !data.cabecera) {
        throw new Error('No se pudo cargar la cotización');
    }
    return data;
}

function getCotizPrintStyles(){
    // Márgenes van en el PDF / @page. El root se dimensiona al área útil.
    return `
  @page { size: letter portrait; margin: 12mm; }
  * { box-sizing: border-box; }
  .cotiz-print-root {
    font-family: Arial, Helvetica, sans-serif;
    color: #111111;
    font-size: 11.5px;
    line-height: 1.35;
    margin: 0;
    padding: 12px 14px;
    background: #ffffff;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }
  .cotiz-print-root table { border-collapse: collapse; width: 100%; }
  .cotiz-print-root .head-table { width: 100%; margin-bottom: 10px; border-bottom: 2px solid #222; padding-bottom: 8px; }
  .cotiz-print-root .head-table td { vertical-align: middle; border: none; padding: 0; }
  .cotiz-print-root .brand-cell { width: 58%; }
  .cotiz-print-root .brand-inner { width: 100%; }
  .cotiz-print-root .brand-inner td { vertical-align: middle; border: none; padding: 0; }
  .cotiz-print-root .logo { height: 56px; max-height: 56px; max-width: 100px; object-fit: contain; display: block; }
  .cotiz-print-root .empresa { margin: 0 0 2px 8px; font-size: 15px; font-weight: 800; letter-spacing: 0.2px; color: #111; }
  .cotiz-print-root .sucursal { margin: 0 0 0 8px; font-size: 11px; font-weight: 600; color: #444; }
  .cotiz-print-root .title-cell { width: 42%; text-align: right; padding-left: 8px; }
  .cotiz-print-root .title-cell h1 { margin: 0; font-size: 18px; letter-spacing: 0.3px; white-space: nowrap; }
  .cotiz-print-root .title-cell .doc { font-size: 12px; font-weight: 700; margin-top: 3px; white-space: nowrap; }
  .cotiz-print-root .title-cell .fecha { font-size: 11px; margin-top: 2px; white-space: nowrap; }
  .cotiz-print-root .meta { width: 100%; margin: 8px 0 10px; }
  .cotiz-print-root .meta td { padding: 3px 4px; vertical-align: top; border: none; }
  .cotiz-print-root .meta .lbl { width: 82px; font-weight: 700; color: #333; white-space: nowrap; }
  .cotiz-print-root table.items { width: 100%; table-layout: fixed; margin-top: 4px; }
  .cotiz-print-root table.items th,
  .cotiz-print-root table.items td {
    border: 1px solid #444;
    padding: 5px 4px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    vertical-align: middle;
  }
  .cotiz-print-root table.items th {
    background: #f2f2f2;
    font-size: 9.5px;
    text-transform: uppercase;
    text-align: center;
  }
  .cotiz-print-root table.items .c { text-align: center; }
  .cotiz-print-root table.items .r { text-align: right; white-space: nowrap; }
  .cotiz-print-root .col-n { width: 5%; }
  .cotiz-print-root .col-cod { width: 13%; }
  .cotiz-print-root .col-des { width: 36%; }
  .cotiz-print-root .col-med { width: 9%; }
  .cotiz-print-root .col-cant { width: 8%; }
  .cotiz-print-root .col-pre { width: 14%; }
  .cotiz-print-root .col-sub { width: 15%; }
  .cotiz-print-root .totals-table { width: 100%; margin-top: 10px; }
  .cotiz-print-root .totals-table td { border: none; padding: 0; }
  .cotiz-print-root .totals-box {
    display: inline-block;
    min-width: 190px;
    max-width: 100%;
    border: 2px solid #222;
    padding: 7px 10px;
    text-align: right;
    font-size: 14px;
    background: #fff;
    white-space: nowrap;
    box-sizing: border-box;
  }
  .cotiz-print-root .totals-box strong { font-size: 16px; }
  .cotiz-print-root .obs {
    margin-top: 12px;
    padding: 7px;
    border: 1px dashed #666;
    min-height: 38px;
  }
  .cotiz-print-root .leyenda {
    margin-top: 20px;
    text-align: center;
    font-weight: 700;
    font-size: 12px;
    border-top: 1px solid #222;
    padding-top: 10px;
  }
  @media print {
    body { padding: 0; margin: 0; background: #fff; }
    .no-print { display: none !important; }
  }`;
}

function buildCotizacionPrintableContent(cab, productos, logoUrl){
    const docNo = `${cab.CODDOC || 'cotiz'}-${cab.CORRELATIVO}`;
    const fecha = formatFechaCotiz(cab.FECHA, cab.ANIO, cab.MES, cab.DIA);
    const hora = formatHoraCotiz(cab.HORA, cab.MINUTO);
    const cliente = escHtmlCotiz(cab.CLIENTE || '');
    const nit = escHtmlCotiz(cab.DOC_NIT || '');
    const dir = escHtmlCotiz(cab.DOC_DIRCLIE || '');
    const obs = escHtmlCotiz(cab.OBS || '');
    const prioridad = escHtmlCotiz(cab.PRIORIDAD || 'NORMAL');
    const tipopago = escHtmlCotiz(cab.TIPOPAGO || cab.CONCRE || '');
    const total = funciones.setMoneda(cab.TOTALPRECIO || 0, 'Q');
    const sucursalTxt = String(GlobalCodSucursal || '').replace(/^ME-/i, '').trim()
        || String(GlobalCodSucursal || '');
    const sucursalLabel = escHtmlCotiz('Sucursal ' + sucursalTxt);
    const logo = escHtmlCotiz(logoUrl || getCotizLogoUrl());

    let rows = '';
    let i = 0;
    (productos || []).forEach((p) => {
        i += 1;
        rows += `<tr>
            <td class="c col-n">${i}</td>
            <td class="col-cod">${escHtmlCotiz(p.CODPROD)}</td>
            <td class="col-des">${escHtmlCotiz(p.DESPROD)}</td>
            <td class="c col-med">${escHtmlCotiz(p.CODMEDIDA)}</td>
            <td class="r col-cant">${Number(p.CANTIDAD || 0)}</td>
            <td class="r col-pre">${funciones.setMoneda(p.PRECIO || 0, 'Q')}</td>
            <td class="r col-sub">${funciones.setMoneda(p.TOTALPRECIO || 0, 'Q')}</td>
        </tr>`;
    });
    if (!rows) {
        rows = `<tr><td colspan="7" class="c">Sin productos</td></tr>`;
    }

    const inner = `
  <table class="head-table">
    <tr>
      <td class="brand-cell">
        <table class="brand-inner">
          <tr>
            <td style="width:120px;"><img class="logo" src="${logo}" alt="Logo"/></td>
            <td>
              <div class="empresa">MERCADOS EFECTIVOS</div>
              <div class="sucursal">${sucursalLabel}</div>
            </td>
          </tr>
        </table>
      </td>
      <td class="title-cell">
        <h1>COTIZACIÓN</h1>
        <div class="doc">${escHtmlCotiz(docNo)}</div>
        <div class="fecha">${fecha} ${hora}</div>
      </td>
    </tr>
  </table>

  <table class="meta">
    <tr><td class="lbl">Cliente:</td><td>${cliente}</td><td class="lbl">Código/NIT:</td><td>${nit}</td></tr>
    <tr><td class="lbl">Dirección:</td><td colspan="3">${dir}</td></tr>
    <tr><td class="lbl">Pago:</td><td>${tipopago}</td><td class="lbl">Prioridad:</td><td>${prioridad}</td></tr>
  </table>

  <table class="items">
    <thead>
      <tr>
        <th class="col-n">#</th>
        <th class="col-cod">Código</th>
        <th class="col-des">Descripción</th>
        <th class="col-med">Medida</th>
        <th class="col-cant">Cant.</th>
        <th class="col-pre">Precio</th>
        <th class="col-sub">Subtotal</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <table class="totals-table">
    <tr>
      <td style="width:58%;"></td>
      <td style="width:42%; text-align:right;">
        <div class="totals-box">Total: <strong>${total}</strong></div>
      </td>
    </tr>
  </table>

  <div class="obs"><strong>Observaciones:</strong> ${obs || 'SN'}</div>
  <div class="leyenda">Esta cotización tiene una validez de 8 días</div>`;

    return { docNo, inner };
}

function buildCotizacionPrintableHtml(cab, productos, logoUrl){
    const { docNo, inner } = buildCotizacionPrintableContent(cab, productos, logoUrl);
    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Cotización ${escHtmlCotiz(docNo)}</title>
<style>
${getCotizPrintStyles()}
body { margin: 0; padding: 0; background: #fff; }
.cotiz-print-root { margin: 0 auto; max-width: 190mm; width: 100%; }
</style>
</head>
<body>
<div class="cotiz-print-root">${inner}</div>
</body>
</html>`;
}

async function fcnAbrirImprimibleCotizacion(coddoc, correlativo, mode){
    try {
        showFacturaPedidoWait(mode === 'pdf' ? 'Generando PDF...' : 'Preparando impresión...', 'loading');
        const data = await fetchCotizacionDetalle(coddoc, correlativo);
        const logoUrl = await getCotizLogoDataUrl();

        if (mode === 'pdf') {
            await descargarCotizacionPdfDirecto(data.cabecera, data.productos || [], logoUrl, `${coddoc || 'cotiz'}-${correlativo}`);
            hideFacturaPedidoWait();
            return;
        }

        const html = buildCotizacionPrintableHtml(data.cabecera, data.productos || [], logoUrl);
        hideFacturaPedidoWait();

        const w = window.open('', '_blank');
        if (!w) {
            funciones.AvisoError('Permita ventanas emergentes para imprimir');
            return;
        }
        w.document.open();
        w.document.write(html);
        w.document.close();
        const triggerPrint = () => {
            try { w.focus(); w.print(); } catch (e) {}
        };
        if (w.document.readyState === 'complete') {
            setTimeout(triggerPrint, 350);
        } else {
            w.onload = () => setTimeout(triggerPrint, 350);
        }
    } catch (e) {
        hideFacturaPedidoWait();
        console.log(e);
        funciones.AvisoError(e.message || 'No se pudo generar el imprimible');
    }
}

function ensureHtml2PdfLoaded(){
    return new Promise((resolve, reject) => {
        if (typeof html2pdf !== 'undefined') {
            resolve();
            return;
        }
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('No se pudo cargar html2pdf'));
        document.head.appendChild(s);
    });
}

async function descargarCotizacionPdfDirecto(cab, productos, logoUrl, filename){
    await ensureHtml2PdfLoaded();
    if (typeof html2pdf === 'undefined') {
        throw new Error('html2pdf no disponible');
    }

    // Carta 8.5x11 in @96dpi. El margen del PDF reduce el área útil:
    // si el HTML mide 816px y además hay margin, se corta la derecha.
    const MARGIN_IN = 0.35;
    const CONTENT_W = Math.round((8.5 - (MARGIN_IN * 2)) * 96); // ~749px
    const CONTENT_H = Math.round((11 - (MARGIN_IN * 2)) * 96);   // ~989px
    const { inner } = buildCotizacionPrintableContent(cab, productos, logoUrl);

    const host = document.createElement('div');
    host.id = 'cotizPdfHost';
    host.style.cssText = [
        'position:fixed',
        'left:-10000px',
        'top:0',
        'width:' + CONTENT_W + 'px',
        'min-width:' + CONTENT_W + 'px',
        'max-width:' + CONTENT_W + 'px',
        'background:#ffffff',
        'z-index:2147483646',
        'opacity:1',
        'pointer-events:none',
        'overflow:hidden'
    ].join(';');

    const styleEl = document.createElement('style');
    styleEl.textContent = getCotizPrintStyles();
    host.appendChild(styleEl);

    const root = document.createElement('div');
    root.className = 'cotiz-print-root';
    root.style.width = CONTENT_W + 'px';
    root.style.minWidth = CONTENT_W + 'px';
    root.style.maxWidth = CONTENT_W + 'px';
    root.style.boxSizing = 'border-box';
    root.style.background = '#ffffff';
    root.innerHTML = inner;
    host.appendChild(root);
    document.body.appendChild(host);

    const imgs = Array.from(root.querySelectorAll('img'));
    await Promise.all(imgs.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            setTimeout(resolve, 1500);
        });
    }));
    await new Promise((r) => setTimeout(r, 200));

    // Forzar layout completo antes de capturar
    void root.offsetHeight;

    const opt = {
        margin: [MARGIN_IN, MARGIN_IN, MARGIN_IN, MARGIN_IN],
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: CONTENT_W,
            windowWidth: CONTENT_W,
            windowHeight: Math.max(CONTENT_H, root.scrollHeight + 20),
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0
        },
        jsPDF: {
            unit: 'in',
            format: 'letter',
            orientation: 'portrait',
            compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
        await html2pdf().set(opt).from(root).save();
        funciones.showToast('PDF descargado');
    } finally {
        if (host.parentNode) host.parentNode.removeChild(host);
    }
}


async function fcnEliminarCotizacion(coddoc, correlativo){
    const ok = await funciones.Confirmacion('¿Está seguro que desea eliminar la cotización ' + coddoc + '-' + correlativo + '?');
    if (!ok) return;
    try {
        const response = await axios.post('/ventas/deletecotizacion', {
            codsucursal: GlobalCodSucursal,
            coddoc: coddoc,
            correlativo: correlativo
        });
        if (response.data && response.data.toString() === 'error') {
            funciones.AvisoError('No se pudo eliminar la cotización');
            return;
        }
        funciones.showToast('Cotización eliminada');
        cargarListaCotizaciones();
    } catch (e) {
        console.log(e);
        funciones.AvisoError('Error al eliminar. Requiere conexión.');
    }
};

async function fcnEditarCotizacion(coddoc, correlativo){
    showFacturaPedidoWait('Cargando cotización...', 'loading');
    try {
        const response = await axios.get(`/ventas/cotizaciondetalle?codsucursal=${encodeURIComponent(GlobalCodSucursal)}&coddoc=${encodeURIComponent(coddoc)}&correlativo=${correlativo}`);
        const data = response.data;
        hideFacturaPedidoWait();
        if (!data || data.toString() === 'error' || !data.cabecera) {
            funciones.AvisoError('No se pudo cargar la cotización');
            return;
        }
        const cab = data.cabecera;
        CotizEditMode = true;
        CotizEditCorrelativo = Number(cab.CORRELATIVO);
        CotizEditCoddoc = cab.CODDOC || 'cotiz';
        GlobalSelectedCodCliente = cab.CODCLIENTE || cab.DOC_NIT || '';

        await deleteTempVenta(GlobalUsuario);
        const productos = data.productos || [];
        for (const p of productos) {
            await insertTempVentas({
                EMPNIT: GlobalCodSucursal,
                CODSUCURSAL: GlobalCodSucursal,
                CODDOC: CotizEditCoddoc,
                CODPROD: p.CODPROD,
                DESPROD: p.DESPROD,
                CODMEDIDA: p.CODMEDIDA,
                CANTIDAD: Number(p.CANTIDAD),
                EQUIVALE: Number(p.EQUIVALE || 1),
                TOTALUNIDADES: Number(p.TOTALUNIDADES),
                COSTO: Number(p.COSTO),
                PRECIO: Number(p.PRECIO),
                TOTALCOSTO: Number(p.TOTALCOSTO),
                TOTALPRECIO: Number(p.TOTALPRECIO),
                EXENTO: Number(p.EXENTO || 0),
                USUARIO: GlobalUsuario,
                TIPOPRECIO: p.TIPOPRECIO || 'P',
                EXISTENCIA: 999999
            });
        }

        await iniciarEditorCotizacion(cab.DOC_NIT || '', cab.CLIENTE || '', cab.DOC_DIRCLIE || '', {
            editMode: true,
            correlativo: CotizEditCorrelativo,
            obs: cab.OBS || '',
            tipopago: cab.TIPOPAGO || '',
            concre: cab.CONCRE || '',
            prioridad: cab.PRIORIDAD || 'NORMAL',
            codven: cab.CODVEN
        });
    } catch (e) {
        hideFacturaPedidoWait();
        console.log(e);
        funciones.AvisoError('Error al cargar cotización');
    }
};

function showSelectorClienteCotizacion(fromLista){
    GlobalSelectedForm = 'COTIZACIONES';
    root.innerHTML = `
        <div class="supervisor-page" id="cotizClientePage">
            <div class="supervisor-card">
                <div class="d-flex align-items-center mb-3">
                    <button type="button" class="btn btn-outline-secondary btn-sm mr-2" id="btnClienteVolverLista">
                        <i class="fal fa-arrow-left"></i> Atrás
                    </button>
                    <div>
                        <h4 class="supervisor-title mb-0">Seleccionar cliente</h4>
                        <p class="supervisor-subtitle mb-0">Busque por NIT, nombre o negocio</p>
                    </div>
                </div>
                <div class="input-group mb-3">
                    <input id="txtBusquedaCliente" type="text" class="form-control" placeholder="NIT, nombre o negocio..." />
                    <div class="input-group-append">
                        <button class="btn btn-info" type="button" id="btnBuscarCliente">
                            <i class="fal fa-search"></i>
                        </button>
                    </div>
                </div>
                <div class="supervisor-table-wrap table-responsive">
                    <table class="table table-sm table-striped table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th style="width:60px;"></th>
                            </tr>
                        </thead>
                        <tbody id="tblResultadoBusquedaCliente">
                            <tr><td colspan="2" class="text-muted text-center">Escriba un filtro para buscar</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btnClienteVolverLista').addEventListener('click', () => {
        showListaCotizaciones();
    });

    const txt = document.getElementById('txtBusquedaCliente');
    txt.addEventListener('keyup', (e) => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            fcnBusquedaCliente('txtBusquedaCliente', 'tblResultadoBusquedaCliente');
        }
    });
    document.getElementById('btnBuscarCliente').addEventListener('click', () => {
        fcnBusquedaCliente('txtBusquedaCliente', 'tblResultadoBusquedaCliente');
    });
    setTimeout(() => txt.focus(), 200);
};

async function iniciarEditorCotizacion(nit,nombre,direccion,options){
    options = options || {};
    CotizEditMode = !!options.editMode;
    if (options.correlativo) CotizEditCorrelativo = Number(options.correlativo);

    
    //inicializa la vista
    getView();


    let lbNomClien = document.getElementById('lbNomClien');
    lbNomClien.innerText = `${nombre} // ${direccion}`;
    
    document.getElementById('btnCambiarCliente').addEventListener('click',()=>{
        if (CotizEditMode) {
            // En edición no se cambia cliente: vuelve a la lista
            showListaCotizaciones();
            return;
        }
        // En alta: vuelve al selector de cliente (no al inicio supervisor)
        showSelectorClienteCotizacion(false);
    })


    let txtFecha = document.getElementById('txtFecha');txtFecha.value = getFechaCotizLocal();
    let txtEntregaFecha = getFechaCotizLocal();// document.getElementById('txtEntregaFecha');txtEntregaFecha.value = funciones.getFecha();

    // listener para el nit
    let txtNit = document.getElementById('txtNit');
    txtNit.addEventListener('keydown',(e)=>{
        if(e.code=='Enter'){
            fcnBuscarCliente('txtNit','txtNombre','txtDireccion');    
        }
        if(e.code=='NumpadEnter'){
            fcnBuscarCliente('txtNit','txtNombre','txtDireccion');    
        }
    });

    document.getElementById('btnBuscarCliente').addEventListener('click',()=>{
        //fcnBuscarCliente('txtNit','txtNombre','txtDireccion');    
    });

    document.getElementById('txtBusqueda').addEventListener('keyup',(e)=>{
        if(e.code=='Enter'){
            fcnBusquedaProducto('txtBusqueda','tblResultadoBusqueda','cmbTipoPrecio');
            //$('#ModalBusqueda').modal('show');
        }
        if(e.code=='NumpadEnter'){
            fcnBusquedaProducto('txtBusqueda','tblResultadoBusqueda','cmbTipoPrecio');
            //$('#ModalBusqueda').modal('show');
        }
    });
    document.getElementById('btnBuscarProducto').addEventListener('click',()=>{
        fcnBusquedaProducto('txtBusqueda','tblResultadoBusqueda','cmbTipoPrecio');
        //$('#ModalBusqueda').modal('show');
    });

    let btnCobrar = document.getElementById('btnCobrar');
    btnCobrar.addEventListener('click',()=>{
       
        fcnCargarGridTempVentas('tblGridTempVentas');
        
        //ALEXIS REVISAR LOGICA
        if(btnCobrar.innerText=='Terminar'){
            funciones.AvisoError('No puede finalizar una cotización sin productos')
        }else{
           if(txtNit.value==''){
               funciones.AvisoError('Especifique el cliente a quien se carga la venta');
           }else{

               funciones.ObtenerUbicacion('lbDocLat','lbDocLong')
               document.getElementById('lbTotalPedido2').innerText = funciones.setMoneda(GlobalTotalDocumento,'Q');

               const $modalFin = $('#ModalFinalizarPedido');
               $modalFin.off('shown.bs.modal.cotizblur hidden.bs.modal.cotizblur');
               $modalFin.on('shown.bs.modal.cotizblur', () => {
                   document.body.classList.add('cotiz-finalizar-open');
                   document.querySelectorAll('.modal-backdrop').forEach((el) => {
                       el.classList.add('cotiz-finalizar-backdrop');
                   });
               });
               $modalFin.on('hidden.bs.modal.cotizblur', () => {
                   document.body.classList.remove('cotiz-finalizar-open');
                   document.querySelectorAll('.modal-backdrop').forEach((el) => {
                       el.classList.remove('cotiz-finalizar-backdrop');
                   });
               });
               $modalFin.modal('show');
                               
           }
       }
       
    });

    let cmbCoddoc = document.getElementById('cmbCoddoc');
    //classTipoDocumentos.comboboxTipodoc('PED','cmbCoddoc');
    cmbCoddoc.value = 'cotiz';
    cmbCoddoc.readOnly = true;

    cmbCoddoc.addEventListener('change',async ()=>{
       try { document.getElementById('txtCorrelativo').value = CotizEditMode ? CotizEditCorrelativo : 'AUTO'; } catch (e) {}
    });

    let cmbVendedor = document.getElementById('cmbVendedor');

    let btnFinalizarPedido = document.getElementById('btnFinalizarPedido');
    btnFinalizarPedido.addEventListener('click',async ()=>{
        fcnFinalizarPedido();
    });

    //BUSQUEDA CLIENTES
    let frmNuevoCliente = document.getElementById('formNuevoCliente');
    frmNuevoCliente.addEventListener('submit',(e)=>{
        e.preventDefault();
        funciones.Confirmacion('¿Está seguro que desea guardar este cliente?')
        .then((value)=>{
            if(value==true){
                fcnGuardarNuevoCliente(frmNuevoCliente);
            }
        })

    });

    let btnBusquedaClientes = document.getElementById('btnBusquedaClientes');
    btnBusquedaClientes.addEventListener('click',()=>{
        if (CotizEditMode) {
            funciones.AvisoError('En edición no se puede cambiar el cliente');
            return;
        }
        $('#ModalBusquedaCliente').modal('show');
        const btnAtras = document.getElementById('btnClienteAtrasLista');
        if (btnAtras) {
            btnAtras.onclick = () => {
                $('#ModalBusquedaCliente').modal('hide');
                showListaCotizaciones();
            };
        }
    });
    
    let txtBusquedaCliente = document.getElementById('txtBusquedaCliente');
    txtBusquedaCliente.addEventListener('keyup',(e)=>{
        if(e.code=='Enter'){
            fcnBusquedaCliente('txtBusquedaCliente','tblResultadoBusquedaCliente');
        }
        if(e.code=='NumpadEnter'){
            fcnBusquedaCliente('txtBusquedaCliente','tblResultadoBusquedaCliente');
        }
    });

    document.getElementById('btnBuscarCliente').addEventListener('click',()=>{
        fcnBusquedaCliente('txtBusquedaCliente','tblResultadoBusquedaCliente');
    });
    document.getElementById('btnNuevoCliente').addEventListener('click',()=>{
        //$('#ModalNuevoCliente').modal('show');
        if(txtNit.value!==''){
            fcnBuscarCliente('txtNit','txtNombre','txtDireccion');
        }else{
            funciones.AvisoError('Escriba el NIT o código de cliente para comprobar');
        };
        
    })

    // EVENTOS DE LOS BOTONES (evitar listeners apilados al reentrar)
    if (typeof window._cotizBodyKeyup === 'function') {
        document.body.removeEventListener('keyup', window._cotizBodyKeyup);
    }
    window._cotizBodyKeyup = (e) => {
        if (GlobalSelectedForm == 'COTIZACIONES') {
            switch (e.keyCode) {
                case 118: //f7
                    btnCobrar.click();
                    break;
                case 113: //f2
                    if (!CotizEditMode) btnBusquedaClientes.click();
                    break;
                default:
                    break;
            }
        }
    };
    document.body.addEventListener('keyup', window._cotizBodyKeyup);
    // carga el grid
   
    
    try { document.getElementById('txtCorrelativo').value = CotizEditMode ? CotizEditCorrelativo : 'AUTO'; } catch (e) {}
    await fcnCargarGridTempVentas('tblGridTempVentas');
    //await fcnCargarTotal('txtTotalVenta','txtTotalVentaCobro');

    cmbVendedor.value = options.codven || GlobalCodUsuario;

    fcnCargarComboTipoPrecio();
  
    // inicializa la calculadora de cantidad
    //iniciarModalCantidad();
    addEventsModalCambioCantidad();

    //carga los datos del cliente
    document.getElementById('txtNit').value = nit;
    document.getElementById('txtNombre').value = nombre;
    document.getElementById('txtDireccion').value = direccion;
    if (options.obs) {
        try { document.getElementById('txtEntregaObs').value = options.obs; } catch (e) {}
    }
    if (options.tipopago) {
        try {
            const cmb = document.getElementById('cmbEntregaConcre');
            const val = String(options.tipopago).toUpperCase();
            if ([...cmb.options].some(o => o.value === val)) cmb.value = val;
            else if (String(options.concre || '').toUpperCase().startsWith('CRE')) cmb.value = 'CREDITO';
            else cmb.value = 'CONTADO';
        } catch (e) {}
    }
    try {
        const cmbP = document.getElementById('cmbCotizPrioridad');
        if (cmbP) {
            const p = String(options.prioridad || 'NORMAL').toUpperCase();
            if (p.startsWith('ALT')) cmbP.value = 'ALTA';
            else if (p.startsWith('BAJ')) cmbP.value = 'BAJA';
            else cmbP.value = 'NORMAL';
        }
    } catch (e) {}
    
    //inicia los eventos de la ventana Cantidad al agregar productos
    fcnIniciarModalCantidadProductos();

    document.getElementById('btnAgregarProd').addEventListener('click',()=>{
        $('#ModalBusqueda').modal('show');
    });

    try {
        const titulo = document.querySelector('#ModalFinalizarPedido .modal-title');
        if (titulo) titulo.textContent = CotizEditMode ? 'Actualizar Cotización' : 'Finalización de Cotización';
        const btnFin = document.getElementById('btnFinalizarPedido');
        if (btnFin) btnFin.innerHTML = CotizEditMode
            ? '<i class="fal fa-save mr-1"></i>Actualizar Cotización'
            : '<i class="fal fa-paper-plane mr-1"></i>Guardar Cotización';
        if (CotizEditMode) {
            txtNit.readOnly = true;
            btnBusquedaClientes.style.display = 'none';
            document.getElementById('btnNuevoCliente').style.display = 'none';
        }
        const btnAtrasModal = document.getElementById('btnClienteAtrasLista');
        if (btnAtrasModal) {
            btnAtrasModal.onclick = () => {
                $('#ModalBusquedaCliente').modal('hide');
                showListaCotizaciones();
            };
        }
    } catch (e) {}
};

function addEventsModalCambioCantidad(){

    document.getElementById('btnCantGuardar').addEventListener('click',()=>{
        let nuevacantidad = Number(document.getElementById('txtCantNuevaCant').value);
        if(nuevacantidad>0){
            fcnUpdateTempRow(GlobalSelectedId,nuevacantidad)
            .then(()=>{
                $('#modalCambiarCantidadProducto').modal('hide');
            })
        }else{
            funciones.AvisoError('Escriba una cantidad válida')
        }  
    }) 

};

function fcnIniciarModalCantidadProductos(){

        
    let btnAgregarProducto = document.getElementById('btnAgregarProducto'); //boton agregar 
    let txtCantidad = document.getElementById('txtCantidad'); //input
    let btnCantidadUp = document.getElementById('btnCantidadUp');
    let btnCantidadDown = document.getElementById('btnCantidadDown');
    let txtSubTotal = document.getElementById('txtSubTotal'); //label

    btnAgregarProducto.addEventListener('click',()=>{
        GlobalSelectedCantidad = Number(txtCantidad.value);
        let totalunidades = (Number(GlobalSelectedEquivale) * Number(GlobalSelectedCantidad));
        let totalexento = GlobalSelectedCantidad * GlobalSelectedExento;

        
        
        fcnAgregarProductoVenta(GlobalSelectedCodprod,GlobalSelectedDesprod,GlobalSelectedCodmedida,GlobalSelectedCantidad,GlobalSelectedEquivale,totalunidades,GlobalSelectedCosto,GlobalSelectedPrecio,totalexento);
        
        
    });

    txtCantidad.addEventListener('click',()=>{txtCantidad.value =''});

    btnCantidadUp.addEventListener('click',()=>{
        let cant = parseInt(txtCantidad.value);
        txtCantidad.value = cant + 1;

        let _SubTotal = parseFloat(GlobalSelectedPrecio) * parseFloat(txtCantidad.value);
        //_SubTotalCosto = parseFloat(_Costo) * parseFloat(txtCantidad.value);
        txtSubTotal.innerHTML = funciones.setMoneda(_SubTotal,'Q');
        
    })

    btnCantidadDown.addEventListener('click',()=>{
        if (parseInt(txtCantidad.value)==1){

        }else{
        let cant = parseInt(txtCantidad.value);
        txtCantidad.value = cant - 1;

        let _SubTotal = parseFloat(GlobalSelectedPrecio) * parseFloat(txtCantidad.value);
        //s_SubTotalCosto = parseFloat(_Costo) * parseFloat(txtCantidad.value);
        txtSubTotal.innerHTML = funciones.setMoneda(_SubTotal,'Q');
        }
        
    })

};

function fcnBusquedaProducto(idFiltro,idTablaResultado,idTipoPrecio){
    
    let cmbTipoPrecio = document.getElementById(idTipoPrecio);

    let filtro = (document.getElementById(idFiltro).value || '').trim();
    
    let tabla = document.getElementById(idTablaResultado);
    tabla.innerHTML = GlobalLoader;

    if (!filtro) {
        tabla.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Escriba un producto o código</td></tr>';
        return;
    }

    const sede = encodeURIComponent(GlobalCodSucursal);
    const q = encodeURIComponent(filtro);

    axios.get(`/ventas/buscarproducto_cotizacion?codsucursal=${sede}&filtro=${q}`)
    .then((response) => {
        const payload = response.data;
        const data = (payload && payload.recordset) ? payload.recordset : [];
        if (!Array.isArray(data) || data.length === 0) {
            tabla.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Sin resultados</td></tr>';
            return;
        }

        let str = '';
        let pre = 0;

        data.forEach((rows) => {
            let exist = Number(rows.EXISTENCIA) / Number(rows.EQUIVALE || 1);
            let strC = '';
            if (Number(rows.EXISTENCIA) <= 0) { strC = 'bg-danger text-white'; } else { strC = 'bg-success text-white'; }
            let totalexento = 0;
            if (rows.EXENTO == 1) { totalexento = Number(rows.PRECIO); }

            switch (cmbTipoPrecio.value) {
                case 'P':
                    pre = Number(rows.PRECIO);
                    break;
                case 'C':
                    pre = Number(rows.PRECIOC);
                    break;
                case 'B':
                    pre = Number(rows.PRECIOB);
                    break;
                case 'A':
                    pre = Number(rows.PRECIOA);
                    break;
                case 'K':
                    pre = Number(0.01);
                    break;
                default:
                    pre = Number(rows.PRECIO);
                    break;
            }

            str += `<tr id="${rows.CODPROD}" onclick="getDataMedidaProducto('${rows.CODPROD}','${funciones.quitarCaracteres(rows.DESPROD,'"'," plg",true)}','${rows.CODMEDIDA}',1,${rows.EQUIVALE},${rows.EQUIVALE},${rows.COSTO},${pre},${totalexento},${Number(rows.EXISTENCIA)});" class="border-bottom">
                <td >
                    ${funciones.quitarCaracteres(rows.DESPROD,'"'," pulg",true)}
                    <br>
                    <small class="text-danger"><b>${rows.CODPROD}</b></small><small class="text-info">//Escala:${rows.DESPROD3 || ''}</small>
                    <br>
                    <b class"bg-danger text-white">${rows.CODMEDIDA}</b>
                    <small>(${rows.EQUIVALE})</small>
                </td>
                <td>${funciones.setMoneda(pre || 0,'Q ')}
                    <br>
                    <small class="${strC}">E:${funciones.setMoneda(exist,'')}</small>
                </td>
                
                <td>
                    <button class="btn btn-sm btn-success btn-circle text-white" 
                    onclick="getDataMedidaProducto('${rows.CODPROD}','${funciones.quitarCaracteres(rows.DESPROD,'"'," plg",true)}','${rows.CODMEDIDA}',1,${rows.EQUIVALE},${rows.EQUIVALE},${rows.COSTO},${pre},${totalexento},${Number(rows.EXISTENCIA)});">
                        +
                    </button>
                <td>
                
            </tr>`;
        });

        tabla.innerHTML = str;
    })
    .catch((error) => {
        console.log(error);
        tabla.innerHTML = '<tr><td colspan="3" class="text-center text-danger">No se pudo buscar en el servidor. Verifique la conexión.</td></tr>';
    });
};

//gestiona la apertura de la cantidad
function getDataMedidaProducto(codprod,desprod,codmedida,cantidad,equivale,totalunidades,costo,precio,exento,existencia){
    console.log('existencia: ' + existencia);

    if(parseInt(existencia)>0){
        GlobalSelectedCodprod = codprod;
        GlobalSelectedDesprod = desprod;
        GlobalSelectedCodmedida = codmedida;
        GlobalSelectedEquivale = parseInt(equivale);
        GlobalSelectedCosto = parseFloat(costo);
        GlobalSelectedPrecio = parseFloat(precio);
        
        GlobalSelectedExento = parseInt(exento);
        GlobalSelectedExistencia = parseInt(existencia);
    
        //modal para la cantidad del producto
        document.getElementById('txtDesProducto').innerText = desprod; //label
        document.getElementById('txtCodMedida').innerText = codmedida; //label
        document.getElementById('txtPrecioProducto').innerText = funciones.setMoneda(precio,'Q'); //label
        document.getElementById('txtSubTotal').innerText = funciones.setMoneda(precio,'Q'); //label
            
        document.getElementById('txtCantidad').value = 1;
    
        $("#ModalCantidadProducto").modal('show');    
    }else{
        funciones.AvisoError('Producto SIN EXISTENCIA')
    }


};

//GRID TEMP VENTAS

// agrega el producto a temp_ventas
async function fcnAgregarProductoVenta(codprod,desprod,codmedida,cantidad,equivale,totalunidades,costo,precio,exento){
   
    db_totalunidades_producto(codprod)
    .then((totaluns)=>{
        //---------------------------------------------------------

        if(Number(GlobalSelectedExistencia)<(Number(totalunidades)+Number(totaluns))){
            funciones.AvisoError('No pude agregar una cantidad mayor a la existencia');
            return;
        };
    
        document.getElementById('btnAgregarProducto').innerHTML = GlobalLoader;
        document.getElementById('btnAgregarProducto').disabled = true;
    
        //document.getElementById('tblResultadoBusqueda').innerHTML = '';
        let cmbTipoPrecio = document.getElementById('cmbTipoPrecio');
            let totalcosto = Number(costo) * Number(cantidad);
            let totalprecio = Number(precio) * Number(cantidad);
            console.log('intenta agregar la fila')
            let coddoc = document.getElementById('cmbCoddoc').value;
            try {        
                    var data = {
                        EMPNIT:GlobalCodSucursal,
                        CODSUCURSAL:GlobalCodSucursal,
                        CODDOC:'cotiz',
                        CODPROD:codprod,
                        DESPROD:desprod,
                        CODMEDIDA:codmedida,
                        CANTIDAD:cantidad,
                        EQUIVALE:equivale,
                        TOTALUNIDADES:totalunidades,
                        COSTO:costo,
                        PRECIO:precio,
                        TOTALCOSTO:totalcosto,
                        TOTALPRECIO:totalprecio,
                        EXENTO:exento,
                        USUARIO:GlobalUsuario,
                        TIPOPRECIO:cmbTipoPrecio.value,
                        EXISTENCIA:GlobalSelectedExistencia
                    };
    
                    insertTempVentas(data)
                    .then(()=>{                    
          
                            $('#ModalCantidadProducto').modal('hide') //MARCADOR
                            funciones.showToast('Agregado: ' + desprod);
                            
                            fcnCargarGridTempVentas('tblGridTempVentas');
                            
                            document.getElementById('btnAgregarProducto').innerHTML  = `<i class="fal fa-check"></i>Agregar`;
                            document.getElementById('btnAgregarProducto').disabled = false;
                            let txbusqueda = document.getElementById('txtBusqueda');
                            txbusqueda.value = '';
                            
                      })
                      .catch(
                          ()=>{
                            document.getElementById('btnAgregarProducto').innerHTML  = `<i class="fal fa-check"></i>Agregar`;
                            document.getElementById('btnAgregarProducto').disabled = false;
                            funciones.AvisoError('No se pudo agregar este producto a la venta actual');
                          }
                      )
            
            } catch (error) {
                document.getElementById('btnAgregarProducto').innerHTML  = `<i class="fal fa-check"></i>Agregar`;
                document.getElementById('btnAgregarProducto').disabled = false;
            }
       

        //---------------------------------------------------------
    })
 

};

function fcnEliminarItem(id){
    funciones.Confirmacion('¿Está seguro que desea quitar este item?')
    .then((value)=>{
        if(value==true){
                deleteItemVenta(id)
                  .then(()=>{                       
                        //document.getElementById(id.toString()).remove();
                        funciones.showToast('item eliminado');
                        fcnCargarGridTempVentas('tblGridTempVentas');
                  })
                  .catch(
                      ()=>{
                        funciones.AvisoError('No se pudo remover este producto a la venta actual');
                      }
                  )
        }        
    })
    
};

async function fcnCargarGridTempVentas(idContenedor){
    
    let tabla = document.getElementById(idContenedor);
    tabla.innerHTML = GlobalLoader;

    let varTotalVenta = 0; let varTotalCosto = 0;
    let varTotalItems =0;

    let btnCobrarTotal = document.getElementById('btnCobrar')
    btnCobrarTotal.disabled = true; //.innerText =  'Terminar';
   
    let coddoc = document.getElementById('cmbCoddoc').value;
    
    let containerTotalVenta = document.getElementById('txtTotalVenta');
    containerTotalVenta.innerHTML = '--';

    let containerTotalItems = document.getElementById('txtTotalItems');
    containerTotalItems.innerHTML = '--'

    try {
        selectTempventas(GlobalUsuario)
        .then((response)=>{
            let idcant = 0;
            let data = response.map((rows)=>{
                idcant = idcant + 1;
                varTotalItems += 1;
                varTotalVenta = varTotalVenta + Number(rows.TOTALPRECIO);
                varTotalCosto = varTotalCosto + Number(rows.TOTALCOSTO);
                return `<tr id="${rows.ID.toString()}" class="factura-cart-row" ondblclick="funciones.hablar('${rows.DESPROD}')">
                            <td class="text-left">
                                <div class="factura-cart-prod-name">${rows.DESPROD}</div>
                                <small class="text-danger factura-cart-prod-code"><b>${rows.CODPROD} (${rows.EQUIVALE} item)</b></small>
                                <div class="factura-cart-prod-meta">
                                    Cant:<b class="text-danger">${rows.CANTIDAD}</b> ${rows.CODMEDIDA}
                                    &nbsp;|&nbsp; Precio:<b>${funciones.setMoneda(rows.PRECIO,'Q')}</b>
                                </div>
                                <div class="factura-cart-actions">
                                    <button class="btn btn-secondary btn-sm btn-circle" onClick="fcnCambiarCantidad(${rows.ID},${rows.CANTIDAD},'${rows.CODPROD}',${rows.EXISTENCIA});">
                                        <i class="fal fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger btn-circle" onclick="fcnEliminarItem(${rows.ID});">
                                        <i class="fal fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                            <td class="text-right factura-cart-subtotal">${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                        </tr>`
           }).join('\n');
           tabla.innerHTML = data;
           GlobalTotalDocumento = varTotalVenta;
           GlobalTotalCostoDocumento = varTotalCosto;
           containerTotalVenta.innerHTML = `${funciones.setMoneda(GlobalTotalDocumento,'Q ')}`;
           if(GlobalTotalDocumento==0){
                btnCobrarTotal.disabled = true;
           }else{
                btnCobrarTotal.disabled = false;
           }
             //innerHTML = '<h1>Terminar : ' + funciones.setMoneda(GlobalTotalDocumento,'Q ') + '</h1>';
           containerTotalItems.innerHTML = `${varTotalItems} items`;
        })
    } catch (error) {
        console.log('NO SE LOGRO CARGAR LA LISTA ' + error);
        tabla.innerHTML = 'No se logró cargar la lista...';
        containerTotalVenta.innerHTML = '0';
        btnCobrarTotal.disabled = true; //innerText =  'Terminar';
        containerTotalItems.innerHTML = `0 items`;
    }
};

async function fcnUpdateTempRow(id,cantidad){

    //--------------------------
    if(Number(GlobalSelectedExistencia)<Number(cantidad)){
        funciones.AvisoError('No pude agregar una cantidad mayor a la existencia');
        return;
    };
    //--------------------------

    return new Promise((resolve, reject) => {
            //OBTIENE LOS DATOS DE LA ROW    
            selectDataRowVenta(id,cantidad)
            .then(()=>{
                fcnCargarGridTempVentas('tblGridTempVentas');
                resolve();
            })
            .catch(()=>{
                funciones.AvisoError('No se logró Eliminar la lista de productos agregados');
                reject();
            })

        });
};

async function fcnCambiarCantidad(id,cantidad,codprod, existencia){
    
    GlobalSelectedId = id;
    GlobalSelectedExistencia = Number(existencia);
    //$('#ModalCantidad').modal('show');
    document.getElementById('txtCantNuevaCant').value = cantidad;
    $('#modalCambiarCantidadProducto').modal('show');
    
};


//CLIENTE
async function fcnBuscarCliente(idNit,idNombre,idDireccion){
    return;

    let nit = document.getElementById(idNit);
    let nombre = document.getElementById(idNombre);
    let direccion = document.getElementById(idDireccion);

    axios.get('/ventas/buscarcliente?empnit=' + GlobalEmpnit + '&nit=' + nit.value  + '&app=' + GlobalSistema)
    .then((response) => {
        const data = response.data;
        if (data.rowsAffected[0]==0){
            funciones.AvisoError('No existe un cliente con este código')
            nit.value = '';
            nombre.value = '';
            direccion.value = '';
        }else{
            data.recordset.map((rows)=>{
                GlobalSelectedCodCliente= nit.value;
                nombre.value = rows.NOMCLIENTE;
                direccion.value = rows.DIRCLIENTE;
            });
        }
        
                
    }, (error) => {
        console.log(error);
    });
};

async function fcnBusquedaCliente(idFiltro,idTablaResultado){
    
    let filtro = document.getElementById(idFiltro).value;
    let tabla = document.getElementById(idTablaResultado);
    tabla.innerHTML = GlobalLoader;


    let str = ""; 
    axios.get('/clientes/buscarcliente_cotizacion?empnit=' + GlobalCodSucursal + '&filtro=' + encodeURIComponent(filtro) + '&app=' + GlobalCodSucursal)
    .then((response) => {
        const data = response.data;
        if (!data || !data.recordset || data.recordset.length === 0 || data.toString() === 'error') {
            tabla.innerHTML = '<tr><td colspan="2" class="text-center text-muted">Sin resultados</td></tr>';
            return;
        }
        data.recordset.map((rows)=>{
            const negocio = rows.NEGOCIO ? rows.NEGOCIO : '';
            const nomSafe = String(rows.NOMCLIE || '').replace(/'/g, "\\'");
            const dirSafe = String(rows.DIRCLIE || '').replace(/'/g, "\\'");
            str += `<tr id="${rows.CODCLIE}">
                        <td>
                            ${rows.NOMCLIE}
                            <br>
                            <small class="bg-warning">Código: ${rows.CODCLIE} / Nit: ${rows.NIT}</small>
                            <br>
                            <small class="text-info">Negocio: ${negocio}</small>
                            <br>
                            <small>${rows.DIRCLIE || ''}${rows.DESMUNICIPIO ? ', ' + rows.DESMUNICIPIO : ''}</small>
                        </td>
                        
                        <td>
                            <button class="btn btn-sm btn-success btn-circle text-white" 
                            onclick="fcnAgregarClienteVenta('${rows.CODCLIE}','${rows.NIT}','${nomSafe}','${dirSafe}')">
                                +
                            </button>
                        <td>
                    </tr>`
        })
        tabla.innerHTML= str;
        
    }, (error) => {
        console.log(error);
        tabla.innerHTML = '<tr><td colspan="2" class="text-center text-danger">Error al buscar cliente</td></tr>';
    });

};

async function fcnAgregarClienteVenta(codigo,nit,nombre,direccion){
    GlobalSelectedCodCliente = codigo;
    CotizEditMode = false;
    CotizEditCorrelativo = 0;
    try { $('#ModalBusquedaCliente').modal('hide'); } catch (e) {}
    await iniciarEditorCotizacion(codigo || nit || '', nombre || '', direccion || '', { editMode: false });
};

async function fcnGuardarNuevoCliente(form){
    
    let nit = form[0].value;
    let nomclie = form[1].value;
    let nomfac = form[2].value;
    let dirclie = form[3].value;
    let codpais = form[4].value;
    let telclie = form[5].value;
    let emailclie = form[6].value;
    let codmunicipio = form[7].value;
    let coddepto = form[8].value;
    let tipoprecio = form[9].value;

    let codven = document.getElementById('cmbVendedor').value;

    // OBTIENE LA LATITUD Y LONGITUD DEL CLIENTE
    let lat = ''; let long = '';
    try {navigator.geolocation.getCurrentPosition(function (location) {lat = location.coords.latitude.toString();long = location.coords.longitude.toString(); })
    } catch (error) {lat = '0'; long = '0'; };
    
    // FECHA DE CREACION DEL CLIENTE
    let f = funciones.getFecha();

    axios.post('/clientes/clientenuevo', {
        app:GlobalSistema,
        empnit: GlobalEmpnit,
        codclie:nit,
        nitclie:nit,
        nomclie:nomclie,
        nomfac:nomfac,
        dirclie:dirclie,
        coddepto:coddepto,
        codmunicipio:codmunicipio,
        codpais:codpais,
        telclie:telclie,
        emailclie:emailclie,
        codbodega:GlobalCodBodega,
        tipoprecio:tipoprecio,
        lat:lat,
        long:long,
        codven:codven,
        fecha:f        
    })
    .then((response) => {
        const data = response.data;
        if (data.rowsAffected[0]==0){
            funciones.AvisoError('No se logró Guardar el nuevo cliente');
        }else{
            funciones.Aviso('Nuevo Cliente Agregado Exitosamente !!')
            document.getElementById('txtNit').value = nit;
            document.getElementById('txtNombre').value = nomclie;
            document.getElementById('txtDireccion').value = dirclie;
            document.getElementById('btnCancelarCliente').click();
        }
    }, (error) => {
        funciones.AvisoError('No se logró Guardar el nuevo cliente');
        console.log(error);
    });


};




async function fcnEliminarTempVentas(usuario){
    let coddoc = document.getElementById('cmbCoddoc').value;
    axios.post('/ventas/tempVentastodos', {
        empnit: GlobalEmpnit,
        usuario:usuario,
        coddoc:coddoc,
        app:GlobalSistema
    })
    .then((response) => {
        const data = response.data;
        if (data.rowsAffected[0]==0){
            funciones.AvisoError('No se logró Eliminar la lista de productos agregados');
        }else{
            
        }
    }, (error) => {
        console.log(error);
    });
};

async function fcnNuevoPedido(){
    CotizEditMode = false;
    CotizEditCorrelativo = 0;
    showListaCotizaciones();
};



async function fcnGetMunicipios(idContainer){
    let container = document.getElementById(idContainer);
    container.innerHTML = GlobalLoader;

    let str = ""; 
    axios.get('/clientes/municipios?empnit=' + GlobalEmpnit + '&app=' + GlobalSistema)
    .then((response) => {
        const data = response.data;        
        data.recordset.map((rows)=>{
            str += `<option value='${rows.CODMUNICIPIO}'>${rows.DESMUNICIPIO}</option>`
        })
        container.innerHTML= str;
        
    }, (error) => {
        console.log(error);
        container.innerHTML = '';
    });
};

async function fcnGetDepartamentos(idContainer){
    let container = document.getElementById(idContainer);
    container.innerHTML = GlobalLoader;

    let str = ""; 
    axios.get('/clientes/departamentos?empnit=' + GlobalEmpnit + '&app=' + GlobalSistema)
    .then((response) => {
        const data = response.data;        
        data.recordset.map((rows)=>{
            str += `<option value='${rows.CODDEPTO}'>${rows.DESDEPTO}</option>`
        })
        container.innerHTML= str;
        
    }, (error) => {
        console.log(error);
        container.innerHTML = '';
    });
};

async function fcnCargarComboTipoPrecio(){
   let cmbp = document.getElementById('cmbClienteTipoPrecio');
  
    cmbp.innerHTML =`<option value="P">PÚBLICO</option>
                     <option value="C">MAYORISTA C</option>
                     <option value="B">MAYORISTA B</option>
                     <option value="A">MAYORISTA A</option>`;
   
   
};



function buildFacturaWaitHtml(message, tone) {
    const tones = {
        loading: { icon: 'fa-paper-plane', spin: true, title: 'Procesando pedido' },
        offline: { icon: 'fa-mobile-alt', spin: false, title: 'Guardando en el teléfono' },
        error: { icon: 'fa-exclamation-circle', spin: false, title: 'No se pudo enviar' }
    };
    const cfg = tones[tone] || tones.loading;
    const spinClass = cfg.spin ? ' fa-spin' : '';
    return `<div class="factura-wait-panel factura-wait-${tone || 'loading'}">
        <div class="factura-wait-icon"><i class="fal ${cfg.icon}${spinClass}"></i></div>
        <h4 class="factura-wait-title">${cfg.title}</h4>
        <p class="factura-wait-msg">${message}</p>
        <div class="factura-wait-dots" aria-hidden="true"><span></span><span></span><span></span></div>
    </div>`;
}

function showFacturaPedidoWait(message, tone) {
    const modalWait = document.getElementById('modalWait');
    if (modalWait) modalWait.classList.add('factura-wait-modal');
    setLog(buildFacturaWaitHtml(message, tone || 'loading'), 'rootWait');
    if (!$('#modalWait').hasClass('show')) {
        $('#modalWait').modal('show');
    }
}

function hideFacturaPedidoWait() {
    const modalWait = document.getElementById('modalWait');
    if (modalWait) modalWait.classList.remove('factura-wait-modal');
    hideWaitForm();
}



//FINALIZAR PEDIDO
async function fcnFinalizarPedido(){

    if(GlobalTotalDocumento==0){
        funciones.AvisoError('Esta cotización no tiene productos, revise por favor');
        return;
    };

    if(GlobalSelectedCodCliente.toString()=='SI' || !GlobalSelectedCodCliente){
        funciones.AvisoError('Datos del cliente incorrectos, por favor, seleccione cliente nuevamente');
        return;
    }

    let codcliente = GlobalSelectedCodCliente;
    let ClienteNombre = document.getElementById('txtNombre').value;
    let dirclie = document.getElementById('txtDireccion').value;
    let obs = funciones.limpiarTexto(document.getElementById('txtEntregaObs').value);
    let direntrega = "SN";
    let cmbTipoEntrega = document.getElementById('cmbEntregaConcre').value;
    let prioridad = (document.getElementById('cmbCotizPrioridad') || {}).value || 'NORMAL';
    // Usar FECHA del input (yyyy-mm-dd), no reconstruir con día/mes/año
    let fechaRaw = (document.getElementById('txtFecha').value || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaRaw)) {
        fechaRaw = getFechaCotizLocal();
    }
    let fecha = fechaRaw;
    let fechaParts = fechaRaw.split('-');
    let anio = Number(fechaParts[0]);
    let mes = Number(fechaParts[1]);
    let dia = Number(fechaParts[2]);
    let fechaentrega = fecha;
    let cmbVendedor = document.getElementById('cmbVendedor');
    let nit = document.getElementById('txtNit').value;
    let latdoc = document.getElementById('lbDocLat').innerText;
    let longdoc = document.getElementById('lbDocLong').innerText;
    // Sede fija: EMPNIT y CODSUCURSAL = sede
    let sede = GlobalCodSucursal;
    let coddoc = 'cotiz';

    document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-paper-plane mr-1 fa-spin"></i>';
    document.getElementById('btnFinalizarPedido').disabled = true;

    gettempDocproductos(GlobalUsuario)
    .then((response)=>{
        let docproductos_ped = response;

        funciones.Confirmacion(CotizEditMode
            ? '¿Está seguro que desea actualizar esta Cotización? (solo en línea)'
            : '¿Está seguro que desea guardar esta Cotización? (solo en línea)')
        .then((value)=>{
            if(value==true){

                showFacturaPedidoWait(CotizEditMode
                    ? 'Actualizando cotización en el servidor...'
                    : 'Conectando con el servidor y registrando la cotización...', 'loading');

                const payload = {
                    jsondocproductos: JSON.stringify(docproductos_ped),
                    codsucursal: sede,
                    empnit: sede,
                    coddoc: coddoc,
                    correlativo: CotizEditCorrelativo,
                    anio: anio,
                    mes: mes,
                    dia: dia,
                    fecha: fecha,
                    fechaentrega: fechaentrega,
                    formaentrega: cmbTipoEntrega,
                    prioridad: prioridad,
                    codcliente: codcliente,
                    nomclie: ClienteNombre,
                    totalcosto: GlobalTotalCostoDocumento,
                    totalprecio: GlobalTotalDocumento,
                    nitclie: nit,
                    dirclie: dirclie,
                    obs: obs,
                    direntrega: direntrega,
                    usuario: GlobalUsuario,
                    codven: cmbVendedor.value,
                    lat: latdoc,
                    long: longdoc,
                    hora: funciones.getHora()
                };

                const url = CotizEditMode ? '/ventas/updatecotizacion' : '/ventas/insertcotizacion';

                axios.post(url, payload)
                .then(async(response) => {
                    const data = response.data;
                    if(data.toString()=='error'){
                        hideFacturaPedidoWait();
                        document.getElementById('btnFinalizarPedido').innerHTML = CotizEditMode
                            ? '<i class="fal fa-save mr-1"></i>Actualizar Cotización'
                            : '<i class="fal fa-paper-plane mr-1"></i>Guardar Cotización';
                        document.getElementById('btnFinalizarPedido').disabled = false;
                        funciones.AvisoError('No se pudo guardar la cotización. Requiere conexión a internet.');
                    }else{
                        hideFacturaPedidoWait();
                        const corr = data && data.correlativo ? (' No. ' + data.correlativo) : '';
                        funciones.Aviso((CotizEditMode ? 'Cotización actualizada' : 'Cotización guardada exitosamente') + corr);
                        try { document.getElementById('btnEntregaCancelar').click(); } catch (e) {}
                        await classEmpleados.updateMyLocation();
                        deleteTempVenta(GlobalUsuario);
                        CotizEditMode = false;
                        CotizEditCorrelativo = 0;
                        fcnNuevoPedido();
                    }
                }, (error) => {
                    console.log(error);
                    hideFacturaPedidoWait();
                    document.getElementById('btnFinalizarPedido').innerHTML = CotizEditMode
                        ? '<i class="fal fa-save mr-1"></i>Actualizar Cotización'
                        : '<i class="fal fa-paper-plane mr-1"></i>Guardar Cotización';
                    document.getElementById('btnFinalizarPedido').disabled = false;
                    funciones.AvisoError('Sin conexión: la cotización solo se puede guardar en línea.');
                });

            }else{
                document.getElementById('btnFinalizarPedido').innerHTML = CotizEditMode
                    ? '<i class="fal fa-save mr-1"></i>Actualizar Cotización'
                    : '<i class="fal fa-paper-plane mr-1"></i>Guardar Cotización';
                document.getElementById('btnFinalizarPedido').disabled = false;
            }
        })

    })
    .catch((error)=>{
        hideFacturaPedidoWait();
        document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-paper-plane mr-1"></i>Guardar Cotización';
        document.getElementById('btnFinalizarPedido').disabled = false;
        funciones.AvisoError('No pude crear la tabla de productos de la cotización ' + error);
    })

};

async function BACKUP_10_03_2023_fcnFinalizarPedido(){
    
    if(Number(GlobalTotalDocumento)<Number(GlobalVentaMinima)){
        funciones.AvisoError('Pedido menor al mínimo de venta');
        try {
            funciones.hablar('Advertencia. Este pedido es menor al mínimo de venta permitido');    
        } catch (error) {          
        }      
    };

    if(GlobalTotalDocumento==0){
        funciones.AvisoError('Este pedido no tiene productos, revise por favor');
        return;
    };

    if(GlobalSelectedCodCliente.toString()=='SI'){funciones.AvisoError('Datos del cliente incorrectos, por favor, seleccione cliente nuevamente');return;}

    let codcliente = GlobalSelectedCodCliente;
    let ClienteNombre = document.getElementById('txtNombre').value;
    let dirclie = document.getElementById('txtDireccion').value; // CAMPO DIR_ENTREGA
    let obs = document.getElementById('txtEntregaObs').value; 
    let direntrega = "SN"; //document.getElementById('txtEntregaDireccion').value; //CAMPO MATSOLI
    let codbodega = GlobalCodBodega;
    let cmbTipoEntrega = document.getElementById('cmbEntregaConcre').value; //campo TRANSPORTE
    let txtFecha = new Date(document.getElementById('txtFecha').value);
    let anio = txtFecha.getFullYear();
    let mes = txtFecha.getUTCMonth()+1;
    let d = txtFecha.getUTCDate() 
    let fecha = anio + '-' + mes + '-' + d; // CAMPO DOC_FECHA
    let dia = d;
    let hora = funciones.getHora();
    let fe = txtFecha;// new Date(document.getElementById('txtEntregaFecha').value);
    let ae = fe.getFullYear();
    let me = fe.getUTCMonth()+1;
    let de = fe.getUTCDate() 
    let fechaentrega = ae + '-' + me + '-' + de;  // CAMPO DOC_FECHAENT
    let coddoc = document.getElementById('cmbCoddoc').value;//GlobalCoddoc;
    let correlativoDoc = document.getElementById('txtCorrelativo').value;
    let cmbVendedor = document.getElementById('cmbVendedor');
    let nit = document.getElementById('txtNit').value;
    let latdoc = document.getElementById('lbDocLat').innerText;
    let longdoc = document.getElementById('lbDocLong').innerText;


    document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-paper-plane mr-1 fa-spin"></i>';
    document.getElementById('btnFinalizarPedido').disabled = true;

    gettempDocproductos(GlobalUsuario)
    .then((response)=>{
        let docproductos_ped = response;  

        //guarda el pedido localmente
        const localPedidoId = ApiGate.generateLocalId();
        var datospedido = {
                CODSUCURSAL:GlobalCodSucursal,
                EMPNIT: GlobalEmpnit,
                CODDOC:coddoc,
                ANIO:anio,
                MES:mes,
                DIA:dia,
                FECHA:fecha,
                FECHAENTREGA:fechaentrega,
                FORMAENTREGA:cmbTipoEntrega,
                CODCLIE: codcliente,
                NOMCLIE:ClienteNombre,
                TOTALCOSTO:GlobalTotalCostoDocumento,
                TOTALPRECIO:GlobalTotalDocumento,
                NITCLIE:nit,
                DIRCLIE:dirclie,
                OBS:obs,
                DIRENTREGA:direntrega,
                USUARIO:GlobalUsuario,
                CODVEN:Number(cmbVendedor.value),
                LAT:latdoc,
                LONG:longdoc,
                JSONPRODUCTOS:JSON.stringify(docproductos_ped),
                LOCAL_ID:localPedidoId
        };

        //UNA VEZ OBTENIDO EL DETALLE, PROCEDE A GUARDARSE O ENVIARSE

        //OBTIENE EL CORRELATIVO DEL DOCUMENTO
        classTipoDocumentos.getCorrelativoDocumento('PED',GlobalCoddoc)
        .then((correlativo)=>{
            correlativoDoc = correlativo;             
          
            funciones.Confirmacion('¿Está seguro que desea Finalizar este Pedido')
            .then((value)=>{
                if(value==true){

                    setLog(`<label class="text-danger">Creando el pedido a enviar...</label>`,'rootWait');
                    $('#modalWait').modal('show');
                                                
                    //ENVIANDOLO ONLINE
                        
                        setLog(`<label class="text-info">Pedido creado, enviado pedido...</label>`,'rootWait');
                                    
                        axios.post('/ventas/insertventa', {
                            jsondocproductos:JSON.stringify(response),
                            codsucursal:GlobalCodSucursal,
                            empnit: GlobalEmpnit,
                            coddoc:coddoc,
                            correl: correlativoDoc,
                            anio:anio,
                            mes:mes,
                            dia:dia,
                            fecha:fecha,
                            fechaentrega:fechaentrega,
                            formaentrega:cmbTipoEntrega,
                            codbodega:codbodega,
                            codcliente: codcliente,
                            nomclie:ClienteNombre,
                            totalcosto:GlobalTotalCostoDocumento,
                            totalprecio:GlobalTotalDocumento,
                            nitclie:nit,
                            dirclie:dirclie,
                            obs:obs,
                            direntrega:direntrega,
                            usuario:GlobalUsuario,
                            codven:cmbVendedor.value,
                            lat:latdoc,
                            long:longdoc,
                            hora:hora,
                            local_id:localPedidoId
                        })
                        .then(async(response) => {
                            const data = response.data;
                            if (data.rowsAffected[0]==0){
                                setLog(`<label class="text-info">No se logró Enviar este pedido, se intentará guardarlo en el teléfono</label>`,'rootWait');
                                                    
                                insertVenta(datospedido)
                                .then(async()=>{   
                                    hideWaitForm();
                                    document.getElementById('btnEntregaCancelar').click();                                                                                       
                                    //actualiza la ubicación del empleado
                                    await classEmpleados.updateMyLocation();           
                                    //actualiza la última venta del cliente
                                    apigen.updateClientesLastSale(nit,'VENTA');            
                                    //elimina el temp ventas asociado al empleado
                                    deleteTempVenta(GlobalUsuario)
                                                                    
                                    funciones.showToast('El pedido será guardado localmente, recuerde enviarlo');
                                            
                                    //prepara todo para un nuevo pedido
                                    fcnNuevoPedido();
                                })
                                .catch(()=>{
                                    hideWaitForm();    
                                    
                                    document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-paper-plane mr-1"></i>Enviar';
                                    document.getElementById('btnFinalizarPedido').disabled = false;

                                    funciones.AvisoError('No se pudo guardar este pedido');
                                })

                            }else{
                                            
                                hideWaitForm();
                                funciones.Aviso('Pedido Generado Exitosamente !!!')
                                document.getElementById('btnEntregaCancelar').click();                                                           
                                //actualiza la ubicación del empleado
                                await classEmpleados.updateMyLocation();            
                                //actualiza la última venta del cliente
                                apigen.updateClientesLastSale(nit,'VENTA');
                                //elimina el temp ventas asociado al empleado
                                deleteTempVenta(GlobalUsuario)     
                                //prepara todo para un nuevo pedido
                                fcnNuevoPedido();
                            }
                        }, (error) => {
                            console.log(error);
                            setLog(`<label class="text-info">Ha ocurrido un error y no se pudo enviar, se intentará guardar en el teléfono</label>`,'rootWait');
                                                                
                            insertVenta(datospedido)
                            .then(async()=>{
                                document.getElementById('btnEntregaCancelar').click();
                                //actualiza la ubicación del empleado
                                await classEmpleados.updateMyLocation();
                                //actualiza la última venta del cliente
                                apigen.updateClientesLastSale(nit,'VENTA');
                                //elimina el temp ventas asociado al empleado
                                deleteTempVenta(GlobalUsuario)                                                                                                               
                                funciones.showToast('El pedido será guardado localmente, recuerde enviarlo');
                                //prepara todo para un nuevo pedido
                                fcnNuevoPedido();                                                    
                                hideWaitForm();
                            })
                            .catch(()=>{
                                hideWaitForm();
                                document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-paper-plane mr-1"></i>Enviar';
                                document.getElementById('btnFinalizarPedido').disabled = false;
                                funciones.AvisoError('No se pudo guardar este pedido')
                            }) 
                        });        

                    
                }
            })

        })
        .catch(()=>{
                                            
                setLog(`<label class="text-info">No se logró Enviar este pedido, se intentará guardarlo en el teléfono</label>`,'rootWait');
                $('#modalWait').modal('show');
                                                                                
                insertVenta(datospedido)
                .then(async()=>{
                    hideWaitForm();
                    document.getElementById('btnEntregaCancelar').click();                                                                                       
                    //actualiza la ubicación del empleado
                    await classEmpleados.updateMyLocation();
                    //actualiza la última venta del cliente
                    apigen.updateClientesLastSale(nit,'VENTA');
                    //elimina el temp ventas asociado al empleado
                    deleteTempVenta(GlobalUsuario)
                    funciones.showToast('El pedido será guardado localmente, recuerde enviarlo');
                    //prepara todo para un nuevo pedido
                    fcnNuevoPedido();
                
                })                    
        })

    })
    .catch((error)=>{
        hideWaitForm();
        document.getElementById('btnFinalizarPedido').innerHTML = '<i class="fal fa-paper-plane mr-1"></i>Enviar';
        document.getElementById('btnFinalizarPedido').disabled = false;
        funciones.AvisoError('No pude crear la tabla de productos del pedido ' + error);
    })
  
};