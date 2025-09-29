
function getView(){

    let view = {
        body:()=>{
            return `
                <div class="form-group">
                    <label class="negrita">Seleccione Mes / Año</label>
                    <div class="input-group">
                        <select class="form-control" id="cmbMes">
                        </select>
                        <select class="form-control" id="cmbAnio">
                        </select>
                    </div>
                </div>
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                                ${view.vista_listado()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                                ${view.vista_detalle()}
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
        vista_listado:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">
                    <table class="table table-responsive">
                        <thead class="bg-secondary text-white">
                            <tr>
                                <td>VENDEDOR</td>
                                <td>UNIVERSO</td>
                                <td>ALCANCE</td>
                                <td>FALTAN</td>
                                <td>LOGRO</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody id="tblDataLista">
                        </tbody>
                    </table>
                </div>
            </div>
            `

        },
        vista_detalle:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-2">
                    <h1 class="negrita text-danger" id="lbNomven">VENDEDOR</h1>
                    <hr class="solid">
                        
                    <table class="table table-responsive">
                        <thead class="bg-info text-white">
                            <tr>
                                <td>CLIENTE</td>
                                <td>VISITA</td>
                                <td>IMPORTE</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody id="tblDataDetalle">
                        </tbody>
                    </table>
                
                </div>
            </div>

            <button class="btn btn-secondary btn-circle btn-xl btn-bottom-left hand shadow" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `

        }
    }


    root.innerHTML = view.body();


};




function addEventListeners(){

    let f = new Date();
    let cmbMes = document.getElementById('cmbMes');
    cmbMes.innerHTML = funciones.ComboMeses();
    let cmbAnio = document.getElementById('cmbAnio');
    cmbAnio.innerHTML = funciones.ComboAnio();

    cmbMes.value = f.getMonth()+1;
    cmbAnio.value = f.getFullYear();

    cmbMes.addEventListener('change',()=>{
        rpt_tbl_lista();
    });

    cmbAnio.addEventListener('change',()=>{
        rpt_tbl_lista();
    });
    

    rpt_tbl_lista();




    funciones.slideAnimationTabs();

};



function initView(){
    getView();
    addEventListeners();

};


function get_data_tbl_lista(){



    return new Promise((resolve,reject)=>{
        axios.post('/ventas/rpt_alcance_clientes_mes',{
        sucursal:GlobalCodSucursal
        })
        .then((response) => {
            let data = response.data;
            if(response=='error'){
                reject('NOCODE')
            }else{
                if(Number(data.rowsAffected[0])>0){
                    let datos = data.recordset; 
                    resolve(datos);             
                }else{
                    reject('NOCODE');
                }
            }             
        }, (error) => {
            reject();
        });
    })
    
}


function update_data_ventaclie(){

    let mes = document.getElementById('cmbMes').value;
    let anio = document.getElementById('cmbAnio').value;


    return new Promise((resolve,reject)=>{
        axios.post('/ventas/update_alcance_clientes_mes',{
        sucursal:GlobalCodSucursal,
        mes:mes,
        anio:anio
        })
        .then((response) => {
            let data = response.data;
            if(response=='error'){
                reject('NOCODE')
            }else{
                if(Number(data.rowsAffected[0])>0){
                    let datos = data.recordset; 
                    resolve(datos);             
                }else{
                    reject('NOCODE');
                }
            }             
        }, (error) => {
            reject();
        });
    })
    
}


function rpt_tbl_lista(){


    let container = document.getElementById('tblDataLista');
    container.innerHTML = 'GENERANDO REPORTE....' + GlobalLoader;

    update_data_ventaclie()
    .then(()=>{
        get_data_tbl_lista()
        .then((data)=>{
            let str = '';


            data.map((r)=>{
                let logro = (Number(r.ALCANCE)/Number(r.UNIVERSO))     
                str += `
                    <tr>
                        <td>${r.NOMVEN}</td>
                        <td>${r.UNIVERSO}</td>
                        <td>${r.ALCANCE}</td>
                        <td>${Number(r.UNIVERSO)-Number(r.ALCANCE)}</td>
                        <td>${funciones.setMoneda((Number(logro)*100),'')}%</td>
                        <td>
                            <button class="btn btn-info btn-md btn-circle hand shadow"
                            onclick="get_detalle_vendedor('${r.CODVEN}','${r.NOMVEN}','${r.UNIVERSO}')">
                                <i class="fal fa-arrow-right"></i>
                            </button>
                        </td>
                    </tr>
                `
                
            })
            container.innerHTML = str;
        })
        .catch(()=>{
            container.innerHTML = 'No se cargaron datos...';
        })

    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...';
    })

        

};


function get_detalle_vendedor(codven,nomven, universo){

        document.getElementById('tab-dos').click();
        document.getElementById('lbNomven').innerText = nomven;

        get_tbl_detalle(codven)

};



function get_data_tbl_detalle(codven){



    return new Promise((resolve,reject)=>{
        axios.post('/ventas/rpt_clientes_novisitados',{
        sucursal:GlobalCodSucursal,
        codven:codven
        })
        .then((response) => {
            let data = response.data;
            if(response=='error'){
                reject('NOCODE')
            }else{
                if(Number(data.rowsAffected[0])>0){
                    let datos = data.recordset; 
                    resolve(datos);             
                }else{
                    reject('NOCODE');
                }
            }             
        }, (error) => {
            reject();
        });
    })
    
}


function get_tbl_detalle(codven){


    let container = document.getElementById('tblDataDetalle')
    container.innerHTML = GlobalLoader;

    get_data_tbl_detalle(codven)
    .then((data)=>{
        let str = '';
        data.map((r)=>{
            str += `
            <tr>
                <td>${r.NOMCLIE}
                    <br>
                    <small>${r.DIRCLIE}</small>
                </td>
                <td>${r.VISITA}</td>
                <td>${funciones.setMoneda(r.VENTA,'Q')}</td>
                <td>
                    <button class="btn btn-md btn-circle btn-success hand shadow"
                    onclick="funciones.gotoGoogleMaps('${r.LATITUD}','${r.LONGITUD}')">
                        <i class="fal fa-map"></i>
                    </button>
                </td>
                <td>
                <button class="btn btn-md btn-circle btn-secondary hand shadow"
                    onclick="funciones.phone_call('${r.TELCLIE}')">
                        <i class="fal fa-phone"></i>
                    </button>
                </td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...'
    })


}
