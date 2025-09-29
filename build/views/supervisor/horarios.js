function getView(){
    let view = {
        body:()=>{
            return `
                 <div class="col-12 p-0 shadow bg-white card-rounded">

                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="inicio" role="tabpanel" aria-labelledby="inicio-tab">    
                            ${view.dia()}
                        </div>
                        <div class="tab-pane fade" id="marcas" role="tabpanel" aria-labelledby="">
                            
                        </div>
                        <div class="tab-pane fade" id="vendedor" role="tabpanel" aria-labelledby="">  
                            
                        </div>
                        <div class="tab-pane fade" id="reportes" role="tabpanel" aria-labelledby="">
                           
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
                                
                    </ul>

                  

                </div>
               
            `
        },
        dia:()=>{
            return `  
                <div class="form-group p-4">
                    <label>Seleccione una fecha:</label>
                    <input type="date" class="form-control col-6" id="txtFecha">
                </div>

                <div class="form-group p-4">
                    <label>Seleccione un vendedor:</label>
                    <select class="form-control col-6" id="cmbVendedor"></select>
                </div>

                <div class="row text-right">
                    <label>Total Venta:</label>
                    <h5 class="text-danger negrita" id="lbTotalVentadia">---</h5>
                </div>

                <hr class="solid">

                <div class="table-responsive" id="tblVtaDia"></div>
                
                                

                `
        }
    }

    root .innerHTML = view.body();

};


function addListeners(){

  

    document.getElementById('txtFecha').addEventListener('change',()=>{
        let codven = document.getElementById('cmbVendedor').value;
        apigen.supervisor_pedidos_vendedor_horarios(GlobalCodSucursal,codven,funciones.devuelveFecha('txtFecha'),'tblVtaDia','lbTotalVentadia')
    });


    document.getElementById('cmbVendedor').addEventListener('change',()=>{
        let codven = document.getElementById('cmbVendedor').value;
        apigen.supervisor_pedidos_vendedor_horarios(GlobalCodSucursal,codven,funciones.devuelveFecha('txtFecha'),'tblVtaDia','lbTotalVentadia')
    });

    document.getElementById('txtFecha').value = funciones.getFecha();

    apigen.comboVendedores2(GlobalCodSucursal,'cmbVendedor')
    .then(()=>{
        let codven = document.getElementById('cmbVendedor').value;
        apigen.supervisor_pedidos_vendedor_horarios(GlobalCodSucursal,codven,funciones.devuelveFecha('txtFecha'),'tblVtaDia','lbTotalVentadia')
    })

  
    funciones.slideAnimationTabs();

};


function initView(){
    getView();
    addListeners();

};



function get_tbl_horarios(){

}