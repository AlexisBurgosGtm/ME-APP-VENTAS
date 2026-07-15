function getView(){
    let view = {
        body:()=>{
            return `
                 <div class="supervisor-page">
                    <div class="supervisor-card">
                        <div class="supervisor-card-head">
                            <h4 class="supervisor-title">Horarios</h4>
                            <p class="supervisor-subtitle">Pedidos del día por vendedor</p>
                        </div>

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
                </div>
               
            `
        },
        dia:()=>{
            return `  
                <div class="supervisor-filters mb-2">
                    <div class="supervisor-field">
                        <label>Fecha</label>
                        <input type="date" class="form-control form-control-sm" id="txtFecha">
                    </div>
                    <div class="supervisor-field">
                        <label>Vendedor</label>
                        <select class="form-control form-control-sm" id="cmbVendedor"></select>
                    </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="supervisor-subtitle mb-0">Total Venta</span>
                    <h5 class="text-danger negrita mb-0" id="lbTotalVentadia">---</h5>
                </div>

                <div class="supervisor-table-wrap" id="tblVtaDia"></div>
                `
        }
    }

    root.innerHTML = view.body();

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