
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.frag_parametros()}
                            <br>
                            ${view.frag_fechas()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.frag_detalle_fecha()}
                            
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            
                        </div>    
                    </div>

                    <ul class="nav nav-tabs hidden" id="myTabHome" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active negrita text-success" id="tab-uno" data-toggle="tab" href="#uno" role="tab" aria-controls="profile" aria-selected="false">
                                <i class="fal fa-list"></i></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-dos" data-toggle="tab" href="#dos" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-tres" data-toggle="tab" href="#tres" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>         
                    </ul>
                </div>
               
            `
        },
        frag_parametros:()=>{
            return `
            <div class="card card-rounded col-12">
                <div class="card-body p-4">
                    
                    <div class="row">
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            
                            <div class="form-group">
                                <label>Mes y año</label>
                                <div class="input-group">
                                    <select class="form-control negrita text-danger" id="cmbMes">
                                    </select>
                                    <select class="form-control negrita text-danger" id="cmbAnio">
                                    </select>
                                </div>
                            </div>

                        </div>
                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                        </div>
                    </div>

                </div>
            </div>
            `
        },
        frag_fechas:()=>{
            return `
           
            <div class="card card-rounded shadow">
                <div class="card-body p-2">

                    <h4 class="negrita text-danger">VENTAS POR FECHAS</h4>
                    <small>Clic en la fecha para ver mas detalles</small>
                    <br>
                    <h5 class="negrita text-personal">
                        Objetivo venta ${funciones.setMoneda(GlobalObjetivoVenta,'Q')}
                    </h5>
                    <div class="col-12" id="container_progreso">
                    </div>
                    <br>

                    <div class="table-responsive col-12">

                        <table class="table table-bordered h-full col-12">
                            <thead class="bg-personal text-white fontsmall2">
                                <tr>
                                    <td>FECHA</td>
                                    <td>VENTA</td>
                                    <td>DEVOLUCION</td>
                                    <td>SUBTOTAL</td>
                                </tr>
                            </thead>
                            <tbody id="tbl_data_fechas">
                            </tbody>
                            <tfoot class="bg-personal text-warning negrita fontsmall2">
                                <tr>
                                    <td></td>
                                    <td><small id="lbTotalVentas"></small></td>
                                    <td><small id="lbTotalDevoluciones"></small></td>
                                    <td ><small id="lbTotalImporte"></small></td>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
            `
        },
        frag_detalle_fecha:()=>{
            return `
            <h3 class="negrita text-personal text-center" id="lbDetalleFecha"></h3>
            <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    
                    <div class="card card-rounded shadow">
                        <div class="card-body p-2">

                            <div class="row">
                                <div class="col-6">
                                    <label class="text-success negrita">VENTAS</label>
                                </div>
                                <div class="col-6">
                                    <h5 class="negrita text-success" id="lbFechaVenta"></h5>
                                </div>
                            </div>

                            

                            <div class="table-responsive col-12">
                                <table class="table h-full table-hover col-12">
                                    <thead class="bg-success text-white">
                                        <tr>
                                            <td>DOCUMENTO</td>
                                            <td>CLIENTE</td>
                                            <td>IMPORTE</td>
                                        </tr>
                                    </thead>
                                    <tbody id="tbl_data_detalle_facturas">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                
                    <div class="card card-rounded shadow">
                        <div class="card-body p-2">
                            
                            <div class="row">
                                <div class="col-6">
                                    <label class="text-danger negrita">DEVOLUCIONES</label>
                                </div>
                                <div class="col-6">
                                    <h5 class="negrita text-danger" id="lbFechaDevolucion"></h5>
                                </div>
                            </div>

                            

                            <div class="table-responsive col-12">
                                <table class="table  table-hover h-full col-12">
                                    <thead class="bg-danger text-white">
                                        <tr>
                                            <td>DOCUMENTO</td>
                                            <td>CLIENTE</td>
                                            <td>IMPORTE</td>                                            
                                        </tr>
                                    </thead>
                                    <tbody id="tbl_data_detalle_devoluciones">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            <button class="btn btn-secondary btn-xl btn-circle btn-bottom-left hand shadow" id="btnAtrasDetalle">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        backup:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-2">
                    <div class="table-responsive col-12">
                        <table class="table table-responsive table-hover col-12">
                            <thead class="bg-naranja text-white">
                                <tr>
                                    <td>PEDIDO</td>
                                    <td>VENDEDOR</td>
                                    <td>CLIENTE</td>
                                    <td>IMPORTE</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblPedidos">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){


    funciones.slideAnimationTabs();

    selected_tab = 'tab_fechas';


    let cmbMes = document.getElementById('cmbMes');
    cmbMes.innerHTML = funciones.ComboMeses();
    let cmbAnio = document.getElementById('cmbAnio');
    cmbAnio.innerHTML = funciones.ComboAnio();

    let f = new Date();
    cmbMes.value = f.getUTCMonth()+1;
    cmbAnio.value = f.getFullYear();

    cmbMes.addEventListener('change',()=>{
        tbl_fechas();    
    });
    cmbAnio.addEventListener('change',()=>{
        tbl_fechas();    
    });

    
   
    document.getElementById('btnAtrasDetalle').addEventListener('click',()=>{
        
        document.getElementById('tab-uno').click();


    });



    tbl_fechas();


};

function initView(){

    getView();
    addListeners();

};



function data_rpt_fechas(){

    return new Promise((resolve,reject)=>{

            let mes = document.getElementById('cmbMes').value;
            let anio = document.getElementById('cmbAnio').value;
        
                axios.post('/reportes/rpt_fechas',
                {
                    sucursal:GlobalCodSucursal,
                    codemp:GlobalCodUsuario,
                    mes:mes,
                    anio:anio
                })
                .then((response) => {
                    if(response.status.toString()=='200'){
                        let data = response.data;
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);
                        }else{
                            reject();
                        }            
                    }else{
                        reject();
                    }             
                }, (error) => {
                    reject();
                });
    })

};
function tbl_fechas(){

    let container = document.getElementById('tbl_data_fechas');
    container.innerHTML = GlobalLoader;

    document.getElementById('container_progreso').innerHTML = '';

    let var_total_venta = 0;
    let var_total_devolucion = 0;
    let var_total_importe = 0;

    data_rpt_fechas()
    .then((data)=>{
        let str = '';

        data.recordset.map((r)=>{
            let importe = Number(r.VENTA)-Number(r.DEVOLUCION);

            var_total_venta += Number(r.VENTA);
            var_total_devolucion += Number(r.DEVOLUCION);
            var_total_importe += Number(importe);
            

            str += `
            <tr class="hand"
                onclick="get_detalle_fecha('${r.FECHA}')">
                <td><small>${funciones.convertDateNormal(r.FECHA)}</small></td>
                <td><small>${funciones.setMoneda(r.VENTA,'Q')}</small></td>
                <td><small>${funciones.setMoneda(r.DEVOLUCION,'Q')}</small></td>
                <td><small>${funciones.setMoneda(importe,'Q')}</small></td>
            </tr>
            `
        })
        container.innerHTML = str;

        document.getElementById('lbTotalVentas').innerText = funciones.setMoneda(var_total_venta,'Q');
        document.getElementById('lbTotalDevoluciones').innerText = funciones.setMoneda(var_total_venta,'Q');
        document.getElementById('lbTotalImporte').innerText = funciones.setMoneda(var_total_importe,'Q');
        
        document.getElementById('container_progreso').innerHTML = funciones.barra_progreso('success',0,GlobalObjetivoVenta,var_total_importe,'Logro actual ')
    })
    .catch((err)=>{
        console.log(err)
        container.innerHTML ='No se cargaron datos...';

        document.getElementById('lbTotalVentas').innerText = '---';
        document.getElementById('lbTotalDevoluciones').innerText = '---';
        document.getElementById('lbTotalImporte').innerText = '---'
        document.getElementById('container_progreso').innerHTML = '';
    })


};
function get_detalle_fecha(fecha){
    
    document.getElementById('tab-dos').click();

    document.getElementById('lbDetalleFecha').innerText = `Resumen ${funciones.convertDateNormal(fecha)}`;

    tbl_fechas_detalle(fecha);
    //funciones.convertDateNormal(fecha).replace('/','-')
}   

function data_fecha_movimientos(fecha){

      return new Promise((resolve,reject)=>{

        
                axios.post('/reportes/rpt_fecha_movimientos',
                {
                    sucursal:GlobalCodSucursal,
                    codemp:GlobalCodUsuario,
                    fecha:fecha
                })
                .then((response) => {
                    if(response.status.toString()=='200'){
                        let data = response.data;
                        if(Number(data.rowsAffected[0])>0){
                            resolve(data);
                        }else{
                            reject();
                        }            
                    }else{
                        reject();
                    }             
                }, (error) => {
                    reject();
                });
    })

};

function tbl_fechas_detalle(fecha){

    let container1 = document.getElementById('tbl_data_detalle_facturas');
    container1.innerHTML = GlobalLoader;

    let container2 = document.getElementById('tbl_data_detalle_devoluciones');
    container2.innerHTML = GlobalLoader;

    document.getElementById('lbFechaVenta').innerText = '';
    document.getElementById('lbFechaDevolucion').innerText = '';

    let varTotalVenta = 0; let varTotalDevolucion = 0;
    
    data_fecha_movimientos(fecha)
    .then((data)=>{
        let strFac = ''; let strDev = '';

        data.recordset.map((r)=>{

            let importe = Number(r.IMPORTE);
            if(r.TIPO=='FAC'){
                varTotalVenta += Number(importe);
                 strFac += `
                    <tr>
                        <td>${r.CODDOC}-${r.CORRELATIVO}</td>
                        <td>${r.CLIENTE}</td>
                        <td>${funciones.setMoneda(importe,'Q')}</td>                                            
                    </tr>
                    `
                    
            }else{
                importe = (importe * -1);
                varTotalDevolucion += Number(importe);
                strDev += `
                    <tr>
                        <td>${r.CODDOC}-${r.CORRELATIVO}</td>
                        <td>${r.CLIENTE}</td>
                        <td>${funciones.setMoneda(importe,'Q')}</td>                                            
                    </tr>
                    `
            }
                     
           
        })
        container1.innerHTML = strFac;
        document.getElementById('lbFechaVenta').innerText = funciones.setMoneda(varTotalVenta,'Q');
        container2.innerHTML = strDev;
        document.getElementById('lbFechaDevolucion').innerText = funciones.setMoneda(varTotalDevolucion,'Q');

    })
    .catch((err)=>{
        console.log(err)
        container1.innerHTML = 'No se cargaron datos...';
        container2.innerHTML = 'No se cargaron datos...';
        document.getElementById('lbFechaVenta').innerText = '';
        document.getElementById('lbFechaDevolucion').innerText = '';
    })


};
