function getView(){
    let view = {
        body : ()=>{
            return `
                <div class="card card-rounded shadow">
                    <div class="card-header bg-secondary text-white">
                        <h3 class="negrita">Configuraciones</h3>
                    </div>
                    <div class="card-body">

                        <hr class="solid">

                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div class="form-group">
                                <label class="negrita text-success">Nueva Clave de Inicio</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="txtPassNueva">
                                    <button class="btn btn-outline-success hand shadow" id="btnActualizarPass">
                                        <i class="fal fa-save"></i>
                                        Cambiar Clave
                                    </button>
                                </div>
                            </div>
                            
                        </div>

                        <hr class="solid">
                        <hr class="solid">

                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div class="form-group">
                                <label class="negrita text-info">Adelantar Correlativo de Pedidos</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" disabled="true" id="txtCorrelativo">
                                    <button class="btn btn-outline-info hand shadow" id="btnActualizarCorrelativo">
                                        <i class="fal fa-save"></i>
                                        Actualizar Correlativo
                                    </button>
                                </div>
                            </div>
                            
                        </div>

                        <hr class="solid">


                        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                          
                            <button class="btn btn-outline-info btn-lg hand shadow" id="btnGps">
                                <i class="fal fa-map"></i>
                                Permiso GPS
                            </button>
                        </div>

                    </div>
                </div>
               
            `
        },
        modalCambiarPass: ()=>{
            return `
                <div class="modal fade" id="modalCambiarPass" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-md" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <label class="modal-title h3" id="">Cambie su Contraseña de Usuario</label>
                            </div>

                            <div class="modal-body">
                                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <div class="form-group">
                                        <label class="negrita">Nueva Clave</label>
                                        <input type="text" class="form-control" id="">
                                    </div>
                                </div>

                                <button class="btn btn-outline-success btn-lg" id="btnActualizarPass">
                                    <i class="fal fa-save"></i>
                                    Cambiar Clave
                                </button>
                                
                            </div>
                            
                        </div>
                    </div>
                </div>
            `
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){



    classTipoDocumentos.getCorrelativoDocumento('',GlobalCoddoc)
    .then((correlativo)=>{
        document.getElementById('txtCorrelativo').value = Number(correlativo.replace(' ',''));
    })
    .catch(()=>{
        document.getElementById('txtCorrelativo').value = '0';
    });

    let btnActualizarCorrelativo = document.getElementById('btnActualizarCorrelativo');
    btnActualizarCorrelativo.addEventListener('click',()=>{
        funciones.Confirmacion('¿Está seguro que desea actualizar este Correlativo?')
        .then((value)=>{
            if(value==true){

                btnActualizarCorrelativo.disabled = true;
                btnActualizarCorrelativo.innerHTML = `<i class="fal fa-save"></i>
                                                    Actualizando...`

                let nuevo = Number(document.getElementById('txtCorrelativo').value)
                classTipoDocumentos.updateCorrelativoDocumento(GlobalCoddoc,nuevo)
                .then(()=>{
                    funciones.Aviso('Correlativo actualizado Exitosamente!!');

                    classTipoDocumentos.getCorrelativoDocumento('',GlobalCoddoc)
                    .then((correlativo)=>{
                        document.getElementById('txtCorrelativo').value = Number(correlativo.replace(' ',''));
                    })
                    .catch(()=>{
                        document.getElementById('txtCorrelativo').value = '0';
                    });
                    
                    btnActualizarCorrelativo.disabled = false;
                    btnActualizarCorrelativo.innerHTML = `<i class="fal fa-save"></i>
                                                        Actualizar Correlativo`
                })
                .catch(()=>{
                    funciones.AvisoError('No se pudo actualizar');
                    btnActualizarCorrelativo.disabled = false;
                    btnActualizarCorrelativo.innerHTML = `<i class="fal fa-save"></i>
                                                        Actualizar Correlativo`
                });

            }
        })
    });

    

    //cambio de clave de usuario
    //--------------------------------
    let txtPassNueva = document.getElementById('txtPassNueva');
    txtPassNueva.value = GlobalPassUsuario;

    let btnActualizarPass = document.getElementById('btnActualizarPass');
    btnActualizarPass.addEventListener('click',()=>{
        funciones.Confirmacion('¿Está seguro que desea cambiar su clave de inicio, esto también aplica a la app de censo?')
        .then((value)=>{
            if(value==true){

                btnActualizarPass.disabled = true;
                btnActualizarPass.innerHTML = `<i class="fal fa-save fa-spin"></i>`;

                apigen.config_cambiar_clave(GlobalCodSucursal,GlobalCodUsuario,txtPassNueva.value)
                .then((data)=>{
                  
                    funciones.Aviso('Clave actualizada exitosamente !!');
                    
                    btnActualizarPass.disabled = false;
                    btnActualizarPass.innerHTML = `<i class="fal fa-save"></i> Cambiar Clave`;
                    GlobalPassUsuario = txtPassNueva.value;
                })
                .catch(()=>{
                    funciones.AvisoError('No se pudo cambiar la clave de usuario');
                    btnActualizarPass.disabled = false;
                    btnActualizarPass.innerHTML = `<i class="fal fa-save"></i> Cambiar Clave`;
                })


            }
        })
    });

    //--------------------------------

    var noop = function () {};
    let btnGps = document.getElementById('btnGps');
    btnGps.addEventListener('click',()=>{
        navigator.geolocation.getCurrentPosition(noop);
    })

};


function initView(){
    
    getView();
    addListeners();

};