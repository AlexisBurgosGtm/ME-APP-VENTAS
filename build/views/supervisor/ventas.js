function getView(){
    let view = {
        encabezado : ()=>{
            return `
                <div class="supervisor-card">
                    <div class="supervisor-card-head">
                        <h4 class="supervisor-title text-danger">Reportes de Ventas</h4>
                        <p class="supervisor-subtitle">Pedidos levantados</p>
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
                    </div>

                    <div class="supervisor-actions-row mt-2">
                        <button class="btn btn-info shadow hand" id="btnVentasDia">Ventas del Día</button>
                        <button class="btn btn-success shadow hand" id="btnVentasMarca">Mes / Marca</button>
                        <button class="btn btn-warning shadow hand" id="btnVentasVendedor">Mes / Vendedor</button>
                    </div>
                </div>
            `
        },
        body:()=>{
            return `
                 <div class="supervisor-card p-0 overflow-hidden">

                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="inicio" role="tabpanel" aria-labelledby="inicio-tab">    
                            ${view.dia()}
                        </div>
                        <div class="tab-pane fade" id="marcas" role="tabpanel" aria-labelledby="">
                            ${view.marcas_mes()}
                        </div>
                        <div class="tab-pane fade" id="vendedor" role="tabpanel" aria-labelledby="">  
                            ${view.vendedores_mes()}
                        </div>
                        <div class="tab-pane fade" id="reportes" role="tabpanel" aria-labelledby="">
                           
                        </div>
                        <div class="tab-pane fade" id="detalle" role="tabpanel" aria-labelledby="">
                            ${view.data_vendedor() + view.modal_cambiar_fecha()}
                        </div>
                    </div>
                    
                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-inicio" data-toggle="tab" href="#inicio" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i>Inicio</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-marcas" data-toggle="tab" href="#marcas" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i>Marcas</a>
                        </li> 
                        <li class="nav-item">
                            <a class="nav-link negrita text-info" id="tab-vendedor" data-toggle="tab" href="#vendedor" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-edit"></i>Vendedor</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-warning" id="tab-reportes" data-toggle="tab" href="#reportes" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-chart-pie"></i>Reportes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-warning" id="tab-detalle" data-toggle="tab" href="#detalle" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-chart-pie"></i>detalle</a>
                        </li> 
                                
                    </ul>

                </div>
               
            `
        },
        dia:()=>{
            return `  
                <div class="p-2">
                    <div class="supervisor-field">
                        <label>Seleccione una fecha</label>
                        <input type="date" class="form-control form-control-sm" id="txtFecha">
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="supervisor-subtitle mb-0">Total Venta</span>
                        <h5 class="text-danger negrita mb-0" id="lbTotalVentadia">---</h5>
                    </div>

                    <div class="supervisor-table-wrap">
                        <table class="table table-sm supervisor-table table-striped table-hover mb-2">
                            <thead>
                                <tr>
                                    <th>Vendedor</th>
                                    <th>Venta</th>
                                    <th>Pedidos</th>
                                    <th>Promedio</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="tblVtaDia"></tbody>
                        </table>
                    </div>
                    
                    <hr class="solid">
                    
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="supervisor-subtitle mb-0">Total Marcas</span>
                        <h5 class="text-danger negrita mb-0" id="lbTotalVentadiaMarcas">---</h5>
                    </div>
                    
                    <div class="supervisor-table-wrap">
                        <table class="table table-sm supervisor-table table-striped table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Marca</th>
                                    <th>Importe</th>
                                </tr>
                            </thead>
                            <tbody id="tblVtaDiaMarcas"></tbody>
                        </table>
                    </div>
                </div>

                `
        },
        marcas_mes: ()=>{
            return `
                    <div class="p-2">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="supervisor-subtitle mb-0">Total Venta</span>
                            <h5 class="text-danger negrita mb-0" id="lbtotalMesMarcas">---</h5>
                        </div>

                        <div class="supervisor-table-wrap">
                            <table class="table table-sm supervisor-table table-striped table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Marca</th>
                                        <th>Importe</th>
                                    </tr>
                                </thead>
                                <tbody id="tblMesMarcas"></tbody>
                            </table>
                        </div>
                    </div>
            `
        },
        vendedores_mes: ()=>{
            return `
            <div class="p-2">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="supervisor-subtitle mb-0">Total Venta</span>
                    <h5 class="text-danger negrita mb-0" id="lbTotalVentaVendedoresMes">---</h5>
                </div>

                <div class="supervisor-table-wrap">
                    <table class="table table-sm supervisor-table table-striped table-hover mb-0">
                        <thead>
                            <tr>
                                <th>Vendedor</th>
                                <th>Venta</th>
                                <th>Pedidos</th>
                                <th>Promedio</th>
                            </tr>
                        </thead>
                        <tbody id="tblVentasVendedoresMes"></tbody>
                    </table>
                </div>
            </div>
            `
        },
        data_vendedor:()=>{
            return `
            <div class="p-2">
                <h5 class="supervisor-title text-danger">Pedidos del Vendedor</h5>
                <div id="rpt_pedidos"></div>
            </div>
            <button class="btn btn-secondary btn-circle btn-hand shadow btn-bottom-l" onclick="document.getElementById('tab-inicio').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        modal_cambiar_fecha:()=>{
            return `
            <div class="modal fade" id="modal_cambiar_fecha" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-md" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <label class="modal-title text-danger h5 mb-0">Cambiar Fecha a Pedido</label>
                        </div>

                        <div class="modal-body">
                            <p class="supervisor-subtitle">No cambiar entre meses</p>

                            <div class="form-group">
                                <label>Fecha Actual</label>
                                <input type="date" class="form-control form-control-sm" id="txtFechaActual">
                            </div>

                            <div class="form-group">
                                <label>Nueva Fecha</label>
                                <input type="date" class="form-control form-control-sm" id="txtFechaNueva">
                            </div>

                            <div class="d-flex justify-content-between">
                                <button class="btn btn-secondary btn-circle hand shadow" data-dismiss="modal">
                                    <i class="fal fa-arrow-left"></i>
                                </button>
                                <button class="btn btn-success btn-circle hand shadow" id="btnGuardarCambioFecha">
                                    <i class="fal fa-check"></i>
                                </button>
                            </div>
                        
                        </div>
                        
                    </div>
                </div>
            </div>
            `
        }
    }

    root.innerHTML = `<div class="supervisor-page">${view.encabezado()}${view.body()}</div>`;

};


function addListeners(){

    let f = new Date();
    let cmbMes = document.getElementById('cmbMes');
    cmbMes.innerHTML = funciones.ComboMeses();
    let cmbAnio = document.getElementById('cmbAnio');
    cmbAnio.innerHTML = funciones.ComboAnio();

    cmbMes.value = f.getMonth()+1;
    cmbAnio.value = f.getFullYear();

    cmbMes.addEventListener('change',()=>{
        rpt_supervisor_marcasmes(cmbMes.value,cmbAnio.value, 'tblMesMarcas','lbtotalMesMarcas');
        rpt_supervisor_vendedores_mes(cmbMes.value,cmbAnio.value, 'tblVentasVendedoresMes','lbTotalVentaVendedoresMes');
    });

    cmbAnio.addEventListener('change',()=>{
        rpt_supervisor_marcasmes(cmbMes.value,cmbAnio.value, 'tblMesMarcas','lbtotalMesMarcas');
        rpt_supervisor_vendedores_mes(cmbMes.value,cmbAnio.value, 'tblVentasVendedoresMes','lbTotalVentaVendedoresMes');
    });
    


    document.getElementById('txtFecha').addEventListener('change',()=>{
        //btnVentasDia.click();
        rpt_supervisor_ventadia(funciones.devuelveFecha('txtFecha'), 'tblVtaDia','lbTotalVentadia');
        rpt_supervisor_marcas_dia(funciones.devuelveFecha('txtFecha'), 'tblVtaDiaMarcas','lbTotalVentadiaMarcas')
    })

    document.getElementById('txtFecha').value = funciones.getFecha();


    let btnVentasDia = document.getElementById('btnVentasDia');
    btnVentasDia.addEventListener('click',()=>{

        document.getElementById('tab-inicio').click();
        
        //rpt_supervisor_ventadia(funciones.devuelveFecha('txtFecha'), 'tblVtaDia','lbTotalVentadia')

    });

    let btnVentasMarca = document.getElementById('btnVentasMarca');
    btnVentasMarca.addEventListener('click',()=>{

        document.getElementById('tab-marcas').click();

        rpt_supervisor_marcasmes(cmbMes.value,cmbAnio.value, 'tblMesMarcas','lbtotalMesMarcas')
    })

    
    let btnVentasVendedor = document.getElementById('btnVentasVendedor');
    btnVentasVendedor.addEventListener('click',()=>{

        document.getElementById('tab-vendedor').click();

        rpt_supervisor_vendedores_mes(cmbMes.value,cmbAnio.value, 'tblVentasVendedoresMes','lbTotalVentaVendedoresMes')
    })



    //iniciarles DEL
    rpt_supervisor_ventadia(funciones.devuelveFecha('txtFecha'), 'tblVtaDia','lbTotalVentadia');
    rpt_supervisor_marcas_dia(funciones.devuelveFecha('txtFecha'), 'tblVtaDiaMarcas','lbTotalVentadiaMarcas');



    let btnGuardarCambioFecha = document.getElementById('btnGuardarCambioFecha');
    btnGuardarCambioFecha.addEventListener('click',()=>{
        funciones.Confirmacion('¿Está seguro que desea Cambiar la fecha de este pedido?')
        .then((value)=>{
            if(value==true){
                    btnGuardarCambioFecha.disabled = true;
                    btnGuardarCambioFecha.innerHTML = `<i class="fal fa-check fa-spin"></i>`;
                

                    set_fecha_pedido(funciones.devuelveFecha('txtFechaNueva'),GlobalSelectedCoddoc,GlobalSelectedCorrelativo)
                    .then(()=>{
                        funciones.Aviso('Fecha cambiada exitosamente!!');
                        btnGuardarCambioFecha.disabled = false;
                        btnGuardarCambioFecha.innerHTML = `<i class="fal fa-check"></i>`;
                
                    })
                    .catch(()=>{
                        funciones.AvisoError('No se pudo cambiar la fecha');
                        btnGuardarCambioFecha.disabled = false;
                        btnGuardarCambioFecha.innerHTML = `<i class="fal fa-check"></i>`;
                    })
            }
        })
    });

    funciones.slideAnimationTabs();

};


function initView(){
    getView();
    addListeners();

};



function rpt_supervisor_ventadia(fecha,idContenedor,idLbTotal){
        
    let container = document.getElementById(idContenedor);
    container.innerHTML = GlobalLoader;

    let lbTotal = document.getElementById(idLbTotal);
    lbTotal.innerText = '---';
        
    let strdata = '';
  

    axios.post('/ventas/rptrankingvendedoressucursal2', {
        fecha:fecha,
        sucursal: GlobalCodSucursal
    })
    .then((response) => {
        const data = response.data.recordset;
        let total =0;
        data.map((rows)=>{
                total = total + Number(rows.TOTALPRECIO);
                let promedio = Number(rows.TOTALPRECIO) / Number(rows.PEDIDOS);
                strdata = strdata + `
                <tr class="hand">
                    <td>${rows.NOMVEN}</td>
                    <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                    <td>${rows.PEDIDOS}</td>
                    <td>${funciones.setMoneda(promedio,'Q')}</td>
                    <td>
                        <button class="btn btn-md btn-circle btn-info hand shadow" onclick="get_data_vendedor('${rows.CODVEN}')">
                            <i class="fal fa-list"></i>
                        </button>
                    </td>
                </tr>
                `
        })
      

        container.innerHTML = strdata;
        lbTotal.innerText = funciones.setMoneda(total,'Q ');
    }, (error) => {
        funciones.AvisoError('Error en la solicitud');
        lbTotal.innerText = 'Q 0.00'
        strdata = '';
        container.innerHTML = '';
    });
};

function rpt_supervisor_marcas_dia(fecha,idContenedor,idLbTotal){

    let container = document.getElementById(idContenedor);
    container.innerHTML = GlobalLoader;
    
    let lbTotal = document.getElementById(idLbTotal);
    lbTotal.innerText = '---';

    let strdata = '';
  

    axios.post('/ventas/reportemarcasfecha', {
        sucursal: GlobalCodSucursal,
        fecha:fecha
    })
    .then((response) => {
        const data = response.data.recordset;
        let total =0;
        data.map((rows)=>{
                total = total + Number(rows.TOTALPRECIO);
                strdata = strdata + `<tr>
                                        <td>${rows.DESMARCA}</td>
                                        <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                                    </tr>`
        })
        container.innerHTML = strdata;
        lbTotal.innerText = funciones.setMoneda(total,'Q ');
    }, (error) => {
        funciones.AvisoError('Error en la solicitud');
        strdata = '';
        container.innerHTML = '';
        lbTotal.innerText = 'Q 0.00';
    });
       
};


function rpt_supervisor_marcasmes(mes,anio,idContenedor,idLbTotal){

    let container = document.getElementById(idContenedor);
    container.innerHTML = GlobalLoader;
    
    let lbTotal = document.getElementById(idLbTotal);
    lbTotal.innerText = '---';

    let strdata = '';
 
    axios.post('/ventas/reportemarcasmes', {
        sucursal: GlobalCodSucursal,
        mes:mes,
        anio:anio
    })
    .then((response) => {
        const data = response.data.recordset;
        let total =0;
        data.map((rows)=>{
                total = total + Number(rows.TOTALPRECIO);
                strdata = strdata + `<tr>
                                        <td>${rows.DESMARCA}</td>
                                        <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                                    </tr>`
        })
        container.innerHTML = strdata;
        lbTotal.innerText = funciones.setMoneda(total,'Q ');
    }, (error) => {
        funciones.AvisoError('Error en la solicitud');
        strdata = '';
        container.innerHTML = '';
        lbTotal.innerText = 'Q 0.00';
    });
       
};


function rpt_supervisor_vendedores_mes(mes,anio,idContenedor, idLbTotal){
        
    let container = document.getElementById(idContenedor);
    container.innerHTML = GlobalLoader;

    let lbTotal = document.getElementById(idLbTotal);
    lbTotal.innerText = '---';
        
    let strdata = '';
   
    axios.post('/ventas/rptrankingvendedoressucursalmes', {
        anio:anio,
        mes:mes,
        sucursal: GlobalCodSucursal
    })
    .then((response) => {
        const data = response.data.recordset;
        let total =0;
        data.map((rows)=>{
                total = total + Number(rows.TOTALPRECIO);
                let promedio = Number(rows.TOTALPRECIO) / Number(rows.PEDIDOS);
                strdata = strdata + `
                <tr>
                    <td>${rows.NOMVEN}</td>
                    <td>${funciones.setMoneda(rows.TOTALPRECIO,'Q')}</td>
                    <td>${rows.PEDIDOS}</td>
                    <td>${funciones.setMoneda(promedio,'Q')}</td>
                </tr>
                `
        })
        container.innerHTML = strdata;
        lbTotal.innerText = funciones.setMoneda(total,'Q ');
    }, (error) => {
        funciones.AvisoError('Error en la solicitud');
        lbTotal.innerText = 'Q 0.00'
        strdata = '';
        container.innerHTML = '';
    });
};


function get_data_vendedor(codven){

        document.getElementById('tab-detalle').click();

        let fecha = funciones.devuelveFecha('txtFecha');
        let container = document.getElementById('rpt_pedidos');

        
        let tableheader = `
        <div class="form-group">
            <label>Escriba para buscar</label>
            <input type="text" class="form-control border-info negrita text-info" id="txtBuscarPedido" oninput="funciones.FiltrarTabla('tblPedidos','txtBuscarPedido')">
        </div>
        <br>
        <table id="tblPedidos" class="table table-responsive table-hover table-striped table-bordered">
        <thead class="bg-trans-gradient text-white">
            <tr>
                <td>Documento</td>
                <td>Cliente</td>
                <td>Importe</td>
            </tr>
        </thead>
        <tbody id="tblListaPedidos">`;
        
        let tablefoooter ='</tbody></table>';

        let strdata = '';
        let totalpedidos = 0;
        axios.post('/ventas/listapedidos', {
                sucursal: GlobalCodSucursal,
                codven:codven,
                fecha:fecha   
        })
        .then((response) => {
        const data = response.data.recordset;
        let total =0;
        data.map((rows)=>{
       
        totalpedidos = totalpedidos + 1;
        strdata = strdata + `<tr>
                <td colspan="2">
                        <b class="text-danger">${rows.CODDOC + '-' + rows.CORRELATIVO}</b>
                    <br>
                        ${rows.NEGOCIO} - ${rows.NOMCLIE}
                    <br>
                        <small class="text-secondary">${rows.DIRCLIE + ', ' + rows.DESMUNI}</small>
                    <br>
                        <small class="text-white bg-secondary">${rows.OBS}</small>
                    <br>
                    
                    <div class="row">
                        <div class="col-6">
                            <button class="btn btn-info btn-sm"
                                onclick="get_fecha_pedido('${rows.FECHA.toString().replace('T00:00:00.000Z','')}','${rows.CODDOC}','${rows.CORRELATIVO}')">
                                <i class="fal fa-edit"></i> Cambiar Fecha
                            </button>    
                        </div>
                        
                        <div class="col-6">
                            <button class="btn btn-outline-success btn-sm"
                                onclick="funciones.enviarPedidoWhatsapp2('${rows.FECHA.toString().replace('T00:00:00.000Z','')}','${rows.CODDOC}','${rows.CORRELATIVO}');">
                                Enviar por Whatsapp
                            </button>    
                        </div>
                    </div>
                </td>
                <td>
                    <b>${funciones.setMoneda(rows.IMPORTE,'Q')}</b>
                </td>
            </tr>`
        })
            container.innerHTML = tableheader + strdata + tablefoooter;
    }, (error) => {
        funciones.AvisoError('Error en la solicitud');
        strdata = '';
        container.innerHTML = '';
        
    });



};

function get_fecha_pedido(fecha,coddoc,correlativo){

        GlobalSelectedCoddoc = coddoc;
        GlobalSelectedCorrelativo = correlativo;

        $('#modal_cambiar_fecha').modal('show');

        document.getElementById('txtFechaActual').value = fecha;

        document.getElementById('txtFechaNueva').value = fecha;

};


function set_fecha_pedido(fecha,coddoc,correlativo){
    
        return new Promise((resolve,reject)=>{
            axios.post('/ventas/update_fecha_pedido',{
               sucursal:GlobalCodSucursal,
               coddoc:coddoc,
               correlativo:correlativo,
               nuevafecha:fecha
            })
            .then((response) => {
                let data = response.data;
                if(response=='error'){
                    reject('NO')
                }else{
                    if(Number(data.rowsAffected[0])>0){ 
                        resolve();             
                    }else{
                        reject('NO');
                    }
                }             
            }, (error) => {
                reject();
            });
        })

}