//var socket = io();

let timerEfecto;

function detener_efecto(){

  //clearTimeout(timerEfecto);
  //document.getElementById('bod').style="visibility:hidden";
  
}

document.getElementById('btnCerrarSesion').addEventListener('click',(e)=>{
    e.preventDefault();

    if(GlobalCodSucursal==''){}else{

        funciones.Confirmacion('¿Está seguro que desea CERRAR SESIÓN?')
        .then((value)=>{
            if(value==true){
                classNavegar.login();
            }
        })
    
    }

});

function getAppVentasThemeMode(){
    try {
        return localStorage.getItem('appventas_theme_mode') === 'night' ? 'night' : 'day';
    } catch (e) {
        return 'day';
    }
}

function setAppVentasThemeMode(mode){
    const next = mode === 'night' ? 'night' : 'day';
    try {
        localStorage.setItem('appventas_theme_mode', next);
    } catch (e) {}
    document.body.classList.toggle('theme-night', next === 'night');
    syncThemeModeButton();
}

function syncThemeModeButton(){
    const icon = document.getElementById('iconThemeMode');
    const btn = document.getElementById('btnThemeMode');
    if (!icon || !btn) return;
    const night = getAppVentasThemeMode() === 'night';
    icon.className = night ? 'fal fa-sun' : 'fal fa-moon';
    btn.title = night ? 'Cambiar a modo día' : 'Cambiar a modo noche';
    btn.setAttribute('aria-label', btn.title);
}

function toggleAppVentasThemeMode(){
    setAppVentasThemeMode(getAppVentasThemeMode() === 'night' ? 'day' : 'night');
}

function updateHeaderUserBadge(nombre){
    const badge = document.getElementById('headerUserBadge');
    const label = document.getElementById('lbUsuarioData');
    if (!badge || !label) return;
    const name = String(nombre == null ? (typeof GlobalUsuario !== 'undefined' ? GlobalUsuario : '') : nombre).trim();
    if (!name) {
        label.textContent = '';
        badge.style.display = 'none';
        return;
    }
    label.textContent = name;
    badge.style.display = 'inline-flex';
}

function clearHeaderUserBadge(){
    updateHeaderUserBadge('');
}

(function initHeaderThemeToggle(){
    const btn = document.getElementById('btnThemeMode');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAppVentasThemeMode();
        });
    }
    // sincroniza ícono con lo ya aplicado en <head>
    setAppVentasThemeMode(getAppVentasThemeMode());
})();


//-------- PERFIL DEL CLIENTE -------

function get_ficha_cliente(codigo,nit,negocio,nombre,direccion,telefono,lat,long){

    //mandar tambien empnit

    GlobalSelectedCodCliente = codigo;
    GlobalSelectedNomCliente = nombre;
    GlobalSelectedDirCliente = direccion;

    document.getElementById('lbProfileNomclie').innerText = nombre;
    document.getElementById('lbProfileNegocio').innerText = negocio;
    document.getElementById('lbProfileDirclie').innerText = direccion;



    

    //crea el boton para ubicarlo en google maps
    document.getElementById('container_btn_ubicacion').innerHTML = '';
    document.getElementById('container_btn_ubicacion').innerHTML = `
                            <button 
                                class="btn btn-outline-primary btn-bottom-r btn-xl btn-circle hand shadow"
                                onclick="funciones.gotoGoogleMaps('${lat}','${long}')">
                                    <i class="fal fa-map-marker"></i>
                            </button> 
                            `;


    $("#modal_perfil_cliente").modal('show');

    

};


function listeners_profile_cliente(){

      const reloadListaTrasVisita = () => {
          try {
              if (typeof getListaClientes === 'function') {
                  const dia = (typeof GlobalSelectedClientesDia !== 'undefined' && GlobalSelectedClientesDia && GlobalSelectedClientesDia !== 'SN')
                      ? GlobalSelectedClientesDia
                      : (typeof funciones !== 'undefined' ? funciones.devuelve_dia_semana() : '');
                  if (dia) getListaClientes(dia);
              }
          } catch (e) {}
      };

      const registrarMotivoVisita = (btn, motivoTexto, confirmMsg) => {
          funciones.Confirmacion(confirmMsg)
          .then((value)=>{
            if(value!=true) return;

            funciones.showToast('Enviando datos...');
            btn.disabled = true;

            funciones.Obtiene_ubicacion_lat_long()
            .then(()=>{
                return GF.insert_visita(
                    GlobalSelectedCodCliente,
                    motivoTexto,
                    selected_latitud,
                    selected_longitud
                );
            })
            .then(()=>{
                funciones.Aviso('Visita registrada exitosamente!!');
                $("#modal_perfil_cliente").modal('hide');
                reloadListaTrasVisita();
            })
            .catch(()=>{
                funciones.AvisoError('No se pudo actualizar la visita');
            })
            .finally(()=>{
                btn.disabled = false;
            });
          });
      };

      document.getElementById('btnProfileVenta').addEventListener('click',()=>{
          $("#modal_perfil_cliente").modal('hide');
          classNavegar.ventas(GlobalSelectedCodCliente,GlobalSelectedNomCliente,GlobalSelectedDirCliente);
      })

      document.getElementById('btnProfileCerrado').addEventListener('click',()=>{
          registrarMotivoVisita(
              document.getElementById('btnProfileCerrado'),
              'TIENDA CERRADA',
              '¿Esta seguro que quiere registrar que la tienda esta CERRADA?'
          );
      })

      document.getElementById('btnProfileDinero').addEventListener('click',()=>{
          registrarMotivoVisita(
              document.getElementById('btnProfileDinero'),
              'NO TIENE DINERO',
              '¿Esta seguro que quiere registrar que la tienda NO TIENE DINERO?'
          );
      })

      document.getElementById('btnProfileBloqueado').addEventListener('click',()=>{
          registrarMotivoVisita(
              document.getElementById('btnProfileBloqueado'),
              'NO HABIA PASO',
              '¿Esta seguro que desea registrar que EL PASO ESTABA BLOQUEADO?'
          );
      })

      document.getElementById('btnProfileProducto').addEventListener('click',()=>{
          registrarMotivoVisita(
              document.getElementById('btnProfileProducto'),
              'TIENE PRODUCTO',
              '¿Esta seguro que quiere registrar que el cliente TIENE PRODUCTO?'
          );
      })

};

listeners_profile_cliente();

//-------- PERFIL DEL CLIENTE -------


//inicializa la instalacion de la app
funciones.instalationHandlers('btnInstalarApp');

let btnCerrarModalWait = document.getElementById('btnCerrarModalWait');

function InicializarServiceWorkerNotif(){

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () =>
   navigator.serviceWorker.register('./sw.js')
    .then(registration => console.log('Service Worker registered'))
    .catch(err => 'SW registration failed'));
  };
 
  requestPermission();

}

if ('Notification' in window) {};

function requestPermission() {
  if (!('Notification' in window)) {
    //alert('Notification API not supported!');
    return;
  }
  
  Notification.requestPermission(function (result) {
    //$status.innerText = result;
  });
}


InicializarServiceWorkerNotif();



// LISTENER DE LOS BOTONES DEL MENU
let btnMenuInicioSalir = document.getElementById('btnMenuInicioSalir');
btnMenuInicioSalir.addEventListener('click',()=>{
    classNavegar.login();
});

// LISTENER DEL BOTON PARA CERRAR EL MODAL DEL MENU LATERAL
let btnCerrarModalMenuLateral = document.getElementById('btnCerrarModalMenuLateral');
btnCerrarModalMenuLateral.addEventListener('click',()=>{
  $('#modalMenu').modal('hide');
})


function setLog(msg,idcontainer){

  document.getElementById(idcontainer).innerHTML = msg;

};


classNavegar.login();


//manejador de las rutas
window.onpopstate = function(event) {
  

    let url =''// 'http://localhost:4400/';
 
    //alert(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
    switch (document.location.pathname.toString()) {
      case url + '/login':
        classNavegar.login('SI');
        break;
      case url + '/clientes':
        classNavegar.inicioVendedorListado('SI');
          break;
      case url + '/facturacion':
        classNavegar.ventas('SI');
          break;
      case url + '/facturacion':
          //classNavegar.ventas();
              break;
      case url + '/mapaclientes':
          classNavegar.ventasMapaClientes('SI');
          break;
      case url + '/logro':
          classNavegar.pedidos('SI');    
          break;
      case url + '/logromes':
          classNavegar.logrovendedor('SI');    
            break;
        case url + '/gps':
            classNavegar.inicio_getgps();
      default:
        classNavegar.login();  
        break;
    }
}

let cmbTipoDb = document.getElementById('cmbTipoDb');
cmbTipoDb.addEventListener('change',()=>{

      switch (cmbTipoDb.value) {
        case 'PROPIO':
          GlobalUrlServicePedidos = '';
          break;
        
        case 'RENDER':
          GlobalUrlServicePedidos = 'https://backend-mercados-efectivos.onrender.com';
          break;
        default:
          GlobalUrlServicePedidos = '';
          break;
      }
             
      
})

//VENTANA DE PEDIDOS PENDIENTES
let btnPedidosPend = document.getElementById('btnPedidosPend');
btnPedidosPend.addEventListener('click',()=>{
    $('#ModalPendientes').modal('show');
    dbCargarPedidosPendientes();
    if (navigator.onLine && typeof SyncQueue !== 'undefined') {
        SyncQueue.runBackgroundSync({ silent: true });
    }
});


//ERRORES AL ENVIAR PEDIDOS
const ERRORES_PEDIDOS_KEY = 'me_errores_pedidos';

function registrarErrorPedido(mensaje){
    try {
        let errores = JSON.parse(localStorage.getItem(ERRORES_PEDIDOS_KEY) || '[]');
        errores.unshift({
            fecha: new Date().toLocaleString(),
            mensaje: (mensaje == null ? 'Error desconocido' : mensaje).toString()
        });
        errores = errores.slice(0, 50);
        localStorage.setItem(ERRORES_PEDIDOS_KEY, JSON.stringify(errores));
    } catch (e) {
        console.log('No se pudo registrar el error del pedido: ' + e);
    }
    try { cargarErroresPedidos(); } catch (e) {}
}

function cargarErroresPedidos(){
    let label = document.getElementById('lbErroresPedidos');
    if(!label) return;

    let errores = [];
    try {
        errores = JSON.parse(localStorage.getItem(ERRORES_PEDIDOS_KEY) || '[]');
    } catch (e) {
        errores = [];
    }

    if(!errores.length){
        label.innerHTML = 'No hay errores registrados';
        return;
    }

    label.innerHTML = errores.map((e)=>{
        return `<div class="border-bottom pb-1 mb-2">
                    <small class="text-muted d-block">${e.fecha}</small>
                    <span>${e.mensaje}</span>
                </div>`;
    }).join('');
}

function limpiarErroresPedidos(){
    try {
        localStorage.removeItem(ERRORES_PEDIDOS_KEY);
    } catch (e) {}
    cargarErroresPedidos();
}

let btnVerErroresPedidos = document.getElementById('btnVerErroresPedidos');
if(btnVerErroresPedidos){
    btnVerErroresPedidos.addEventListener('click',()=>{
        cargarErroresPedidos();
        $('#ModalErroresPedidos').modal('show');
    });
}

let btnLimpiarErroresPedidos = document.getElementById('btnLimpiarErroresPedidos');
if(btnLimpiarErroresPedidos){
    btnLimpiarErroresPedidos.addEventListener('click',()=>{
        limpiarErroresPedidos();
    });
}



//deshabilita los mensajes de consola
//logger.disableLogger();


//manejador de online, offline
(function () {
  'use strict';

  // :: Internet Connection Detect
  var internetStatus = document.getElementById('internetStatus');

  if (window.navigator.onLine) {
      internetStatus.textContent = "De vuelta en línea";
      internetStatus.style.backgroundColor = "#00b894";
      internetStatus.style.display = "none";
  } else {
      internetStatus.textContent = "No tienes conexión a internet";
      internetStatus.style.backgroundColor = "#ea4c62";
      internetStatus.style.boxShadow = "0 .5rem 1rem rgba(0,0,0,.15)";
      internetStatus.style.display = "block";
  }

  window.addEventListener('online', function () {
      internetStatus.textContent = "De vuelta en línea";
      internetStatus.style.backgroundColor = "#00b894";
      internetStatus.style.boxShadow = "0 .5rem 1rem rgba(0,0,0,.15)";
      $("#internetStatus").delay("5000").fadeOut(500);

      if (typeof SyncQueue !== 'undefined') {
          SyncQueue.runBackgroundSync({ silent: true });
      }
  });

  window.addEventListener('offline', function () {
      internetStatus.textContent = "No tienes conexión a internet";
      internetStatus.style.backgroundColor = "#ea4c62";
      internetStatus.style.boxShadow = "0 .5rem 1rem rgba(0,0,0,.15)";
      $("#internetStatus").fadeIn(500);
  });

})();