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

})


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


      document.getElementById('btnProfileVenta').addEventListener('click',()=>{
          $("#modal_perfil_cliente").modal('hide');
          classNavegar.ventas(GlobalSelectedCodCliente,GlobalSelectedNomCliente,GlobalSelectedDirCliente);
      })

      document.getElementById('btnProfileCerrado').addEventListener('click',()=>{
          $("#modal_perfil_cliente").modal('hide');
          
      })

      document.getElementById('btnProfileDinero').addEventListener('click',()=>{
          $("#modal_perfil_cliente").modal('hide');
          
      })

      document.getElementById('btnProfileBloqueado').addEventListener('click',()=>{
          $("#modal_perfil_cliente").modal('hide');
          
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
});



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
  });

  window.addEventListener('offline', function () {
      internetStatus.textContent = "No tienes conexión a internet";
      internetStatus.style.backgroundColor = "#ea4c62";
      internetStatus.style.boxShadow = "0 .5rem 1rem rgba(0,0,0,.15)";
      $("#internetStatus").fadeIn(500);
  });

})();