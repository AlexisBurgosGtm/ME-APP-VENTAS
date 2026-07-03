function getView(){

    let view = {

        body : ()=>{

            return `

                <div class="config-page">

                    <div class="config-shell">

                        <div class="config-header">

                            <div>

                                <h3 class="config-title mb-1">Configuraciones</h3>

                                <p class="config-subtitle mb-0">Ajustes de cuenta, documentos y aplicación</p>

                            </div>

                            <span class="config-header-badge"><i class="fal fa-cog"></i></span>

                        </div>



                        <div class="config-sections">



                            <section class="config-section">

                                <div class="config-section-icon config-icon-success">

                                    <i class="fal fa-key"></i>

                                </div>

                                <div class="config-section-body">

                                    <h4 class="config-section-title">Nueva clave de inicio</h4>

                                    <p class="config-section-desc">Actualiza la contraseña de acceso. También aplica a la app de censo.</p>

                                    <div class="config-field-row">

                                        <input type="text" class="form-control config-input" id="txtPassNueva" placeholder="Nueva clave">

                                        <button class="btn btn-success config-action-btn hand shadow" id="btnActualizarPass">

                                            <i class="fal fa-save"></i>

                                            Cambiar clave

                                        </button>

                                    </div>

                                </div>

                            </section>



                            <section class="config-section">

                                <div class="config-section-icon config-icon-primary">

                                    <i class="fal fa-sort-numeric-up"></i>

                                </div>

                                <div class="config-section-body">

                                    <h4 class="config-section-title">Corregir correlativo de pedidos</h4>

                                    <p class="config-section-desc">Sincroniza el número correlativo de documentos de venta con el servidor.</p>

                                    <button class="btn btn-primary config-action-btn hand shadow" id="btnActualizarCorrelativo">

                                        <i class="fal fa-sync"></i>

                                        Corregir correlativo

                                    </button>

                                </div>

                            </section>


                            <section class="config-section config-section-highlight">

                                <div class="config-section-icon config-icon-warning">

                                    <i class="fal fa-cloud-download"></i>

                                </div>

                                <div class="config-section-body">

                                    <h4 class="config-section-title">Forzar actualización</h4>

                                    <p class="config-section-desc">Limpia la caché local, actualiza el service worker y recarga la aplicación con los archivos más recientes.</p>

                                    <button class="btn btn-warning config-action-btn hand shadow" id="btnForzarActualizacion">

                                        <i class="fal fa-redo"></i>

                                        Forzar actualización

                                    </button>

                                    <div class="config-update-status" id="configUpdateStatus" aria-live="polite"></div>

                                </div>

                            </section>

                            <section class="config-section">

                                <div class="config-section-icon config-icon-info">

                                    <i class="fal fa-map-marker-alt"></i>

                                </div>

                                <div class="config-section-body">

                                    <h4 class="config-section-title">Permiso GPS</h4>

                                    <p class="config-section-desc">Solicita nuevamente el permiso de ubicación del dispositivo.</p>

                                    <button class="btn btn-info config-action-btn hand shadow" id="btnGps">

                                        <i class="fal fa-map"></i>

                                        Solicitar permiso GPS

                                    </button>

                                </div>

                            </section>



                



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



function setConfigUpdateStatus(message, tone) {

    const el = document.getElementById('configUpdateStatus');

    if (!el) return;

    el.className = 'config-update-status' + (tone ? ' config-update-status-' + tone : '');

    el.innerHTML = message ? `<i class="fal fa-info-circle"></i> ${message}` : '';

}



async function fcnForzarActualizacion() {

    const btn = document.getElementById('btnForzarActualizacion');

    const defaultHtml = '<i class="fal fa-redo"></i> Forzar actualización';



    const setBusy = (msg) => {

        btn.disabled = true;

        btn.innerHTML = `<i class="fal fa-spinner fa-spin"></i> ${msg}`;

        setConfigUpdateStatus(msg, 'loading');

    };



    try {

        setBusy('Limpiando caché local...');



        if ('caches' in window) {

            const cacheNames = await caches.keys();

            await Promise.all(cacheNames.map((name) => caches.delete(name)));

        }



        setBusy('Actualizando service worker...');



        if ('serviceWorker' in navigator) {

            const registrations = await navigator.serviceWorker.getRegistrations();

            await Promise.all(registrations.map((reg) => reg.unregister()));



            try {

                await navigator.serviceWorker.register('./sw.js?force=' + Date.now());

            } catch (regError) {

                console.warn('Re-registro SW:', regError);

            }

        }



        setBusy('Recargando aplicación...');

        setConfigUpdateStatus('Actualización completada. Recargando...', 'success');



        const reloadUrl = new URL(window.location.href);

        reloadUrl.searchParams.set('_refresh', Date.now().toString());

        reloadUrl.searchParams.delete('nocache');



        setTimeout(() => {

            window.location.replace(reloadUrl.toString());

        }, 600);



    } catch (error) {

        console.error('Forzar actualización:', error);

        btn.disabled = false;

        btn.innerHTML = defaultHtml;

        setConfigUpdateStatus('No se pudo completar la actualización. Intente de nuevo.', 'error');

        funciones.AvisoError('No se pudo forzar la actualización de la aplicación');

    }

}



function addListeners(){



    let btnActualizarCorrelativo = document.getElementById('btnActualizarCorrelativo');

    const correlativoDefaultHtml = '<i class="fal fa-sync"></i> Corregir correlativo';



    btnActualizarCorrelativo.addEventListener('click',()=>{



        funciones.Confirmacion('¿Está seguro que desea corregir el Correlativo de documento de ventas?')

        .then((value)=>{

            if(value==true){



                btnActualizarCorrelativo.disabled = true;

                btnActualizarCorrelativo.innerHTML = `<i class="fal fa-spinner fa-spin"></i> Corrigiendo...`



                classTipoDocumentos.updateCorrelativoDocumento(GlobalCoddoc)

                .then(()=>{

                    funciones.Aviso('Correlativo actualizado Exitosamente!!');

                    btnActualizarCorrelativo.disabled = false;

                    btnActualizarCorrelativo.innerHTML = correlativoDefaultHtml;

                })

                .catch(()=>{

                    funciones.AvisoError('No se pudo actualizar');

                    btnActualizarCorrelativo.disabled = false;

                    btnActualizarCorrelativo.innerHTML = correlativoDefaultHtml;

                });



            }

        })

    });



    let txtPassNueva = document.getElementById('txtPassNueva');

    txtPassNueva.value = GlobalPassUsuario;



    const passDefaultHtml = '<i class="fal fa-save"></i> Cambiar clave';

    let btnActualizarPass = document.getElementById('btnActualizarPass');



    btnActualizarPass.addEventListener('click',()=>{

        funciones.Confirmacion('¿Está seguro que desea cambiar su clave de inicio, esto también aplica a la app de censo?')

        .then((value)=>{

            if(value==true){



                btnActualizarPass.disabled = true;

                btnActualizarPass.innerHTML = `<i class="fal fa-save fa-spin"></i> Guardando...`;



                apigen.config_cambiar_clave(GlobalCodSucursal,GlobalCodUsuario,txtPassNueva.value)

                .then(()=>{

                    funciones.Aviso('Clave actualizada exitosamente !!');

                    btnActualizarPass.disabled = false;

                    btnActualizarPass.innerHTML = passDefaultHtml;

                    GlobalPassUsuario = txtPassNueva.value;

                })

                .catch(()=>{

                    funciones.AvisoError('No se pudo cambiar la clave de usuario');

                    btnActualizarPass.disabled = false;

                    btnActualizarPass.innerHTML = passDefaultHtml;

                })



            }

        })

    });



    var noop = function () {};

    let btnGps = document.getElementById('btnGps');

    btnGps.addEventListener('click',()=>{

        navigator.geolocation.getCurrentPosition(noop);

    });



    let btnForzarActualizacion = document.getElementById('btnForzarActualizacion');

    btnForzarActualizacion.addEventListener('click', () => {

        funciones.Confirmacion('¿Desea forzar la actualización de la aplicación? Se limpiará la caché y se recargará todo.')

        .then((value) => {

            if (value === true) {

                fcnForzarActualizacion();

            }

        });

    });



};





function initView(){

    

    getView();

    addListeners();



};






