
function getView(){
    let view = {
        body:()=>{
            return `
                <div class="supervisor-page">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_editar()}
                            
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
            <div class="supervisor-card">
                <div class="supervisor-card-head">
                    <h4 class="supervisor-title text-danger">Gestión de Usuarios</h4>
                    <p class="supervisor-subtitle">Vendedores y supervisores</p>
                </div>
                <div class="supervisor-table-wrap">
                    <table class="table table-sm supervisor-table table-hover mb-0">
                        <thead>
                            <tr>
                                <th>USUARIO-TIPO</th>
                                <th>CLAVE</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="tblDataUsuarios">
                        </tbody>
                    </table>
                </div>
            </div>
            `
        },
        vista_editar:()=>{

            return `
            
            <div class="supervisor-card">
                <div class="supervisor-card-head">
                    <h5 class="supervisor-title">Editar usuario</h5>
                </div>

                <div class="form-group">
                    <label class="negrita">Usuario</label>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control negrita" id="txtUsuario">
                        <div class="input-group-append">
                            <button class="btn btn-primary hand shadow" id="btnGuardarUsuario">
                                <i class="fal fa-save"></i>
                            </button>
                        </div>
                    </div>                    
                </div>

                <div class="form-group mb-0">
                    <label class="negrita">Clave</label>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control negrita" id="txtClave">
                        <div class="input-group-append">
                            <button class="btn btn-primary hand shadow" id="btnGuardarClave">
                                <i class="fal fa-save"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <input type="text" class="form-control negrita hidden" id="txtId" disabled="true">
            </div>



            <button class="btn btn-secondary btn-circle btn-bottom-l hand shadow" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `

        }
    }

    root.innerHTML = view.body();

};

function addListeners(){


        funciones.slideAnimationTabs();




        get_tbl_usuarios();



        let btnGuardarUsuario = document.getElementById('btnGuardarUsuario');
        btnGuardarUsuario.addEventListener('click',()=>{


            funciones.Confirmacion('¿Está seguro que desea CAMBIAR este nombre de usuario?')
            .then((value)=>{
                if(value==true){


                    
                    let id = document.getElementById('txtId').value;
                    let clave = document.getElementById('txtUsuario').value || '';
                    if(clave.toString()==''){funciones.AvisoError('Escriba un nombre de usuario');return};

                    btnGuardarUsuario.disabled = true;
                    btnGuardarUsuario.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                        fcn_actualizar_usuario(id,clave)
                        .then(()=>{
                            funciones.Aviso('Clave actualizada exitosamente!!');

                            btnGuardarUsuario.disabled = false;
                            btnGuardarUsuario.innerHTML = `<i class="fal fa-save"></i>`;
                    
                            get_tbl_usuarios();
                        })
                        .catch(()=>{
                            funciones.AvisoError('No se pudo actualizar');
                            btnGuardarUsuario.disabled = false;
                            btnGuardarUsuario.innerHTML = `<i class="fal fa-save"></i>`;
                    
                        })

                }
                
            })

        });

        let btnGuardarClave = document.getElementById('btnGuardarClave');
        btnGuardarClave.addEventListener('click',()=>{

            funciones.Confirmacion('¿Está seguro que desea CAMBIAR esta clave de usuario?')
            .then((value)=>{
                if(value==true){

                    
                    let id = document.getElementById('txtId').value;
                    let clave = document.getElementById('txtClave').value || '';
                    if(clave.toString()==''){funciones.AvisoError('Escriba una clave');return};

                        btnGuardarClave.disabled = true;
                        btnGuardarClave.innerHTML = `<i class="fal fa-save fa-spin"></i>`;
                    
                        fcn_actualizar_clave(id,clave)
                        .then(()=>{
                            funciones.Aviso('Clave actualizada exitosamente!!');
                            get_tbl_usuarios();
                            btnGuardarClave.disabled = false;
                            btnGuardarClave.innerHTML = `<i class="fal fa-save"></i>`;
                        
                        })
                        .catch(()=>{
                            funciones.AvisoError('No se pudo actualizar');
                            btnGuardarClave.disabled = false;
                            btnGuardarClave.innerHTML = `<i class="fal fa-save"></i>`;
                        
                        })

                }
                
            })

        });



};

function initView(){

    getView();
    addListeners();

};


function get_data_usuarios(){

    return new Promise((resolve,reject)=>{
           
        let data = {
            sucursal:GlobalCodSucursal,
        }
        //updatecorrelativo
        axios.post('/usuarios/listado_supervisor', data)
        .then((response) => {
        
            if(response.toString()=='error'){
                reject();
            }else{
                let data = response.data;
        
                if(Number(data.rowsAffected[0])>0){
                    resolve(data);             
                }else{
                    reject();
                }
            }
                        
        }, (error) => {
            reject();
        });
    })

};

function get_tbl_usuarios(){


    let container = document.getElementById('tblDataUsuarios');
    container.innerHTML = GlobalLoader;


    get_data_usuarios()
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{

            str += `<tr>
                        <td>${r.USUARIO}
                            <br>
                            <small class="negrita text-danger">${r.TIPO}</small>
                        </td>
                        <td>${r.CLAVE}
                            <br>
                            <small class="negrita text-info">${r.CODDOC}</small>
                        </td>
                        <td>
                            <button class="btn btn-circle btn-md btn-info hand shadow" onclick="fcn_cambiar_datos('${r.ID}','${r.USUARIO}','${r.CLAVE}')">
                                <i class="fal fa-edit"></i>
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-circle btn-md btn-danger hand shadow" onclick="fcn_eliminar('${r.ID}','${r.USUARIO}','${r.CLAVE}')">
                                <i class="fal fa-trash"></i>
                            </button>
                        </td>
                    </tr>`

        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No se cargaron datos...'
    })





};




function fcn_cambiar_datos(id,nombre,clave){

    document.getElementById('tab-dos').click();

    document.getElementById('txtId').value = id;
    document.getElementById('txtUsuario').value = nombre;
    document.getElementById('txtClave').value = clave;
    





};



function fcn_eliminar(id,nombre,clave){

    funciones.AvisoError('De momento no se puede ELIMINAR')

};



function fcn_actualizar_clave(codigo,nuevaclave){
    return new Promise((resolve,reject)=>{
           
        let data = {
            sucursal:GlobalCodSucursal,
            codigo:codigo,
            nuevaclave:nuevaclave
        }
        //updatecorrelativo
        axios.post('/usuarios/update_clave', data)
        .then((response) => {
        
            if(response.data.toString()=='error'){
                reject();
            }else{
                let data = response.data;
        
                if(Number(data.rowsAffected[0])>0){
                    resolve(data);             
                }else{
                    reject();
                }
            }
                        
        }, (error) => {
            reject();
        });
    })
}



function fcn_actualizar_usuario(codigo,nuevousuario){

    return new Promise((resolve,reject)=>{
           
        let data = {
            sucursal:GlobalCodSucursal,
            codigo:codigo,
            nuevousuario:nuevousuario
        }
        //updatecorrelativo
        axios.post('/usuarios/update_usuario', data)
        .then((response) => {
        
            console.log(response)


            if(response.data.toString()=='error'){
                reject();
            }else{
                let data = response.data;
        
                if(Number(data.rowsAffected[0])>0){
                    resolve(data);             
                }else{
                    reject();
                }
            }
                        
        }, (error) => {
            reject();
        });
    })
}