let funciones = {
    phone_call: (telefono)=>{
      
      let llamar = telefono.replace(" ","");
      llamar = llamar.replace("-","");
      llamar = llamar.replace("/","");
      llamar = llamar.replace("*","");
      llamar = llamar.replace("$","");
      llamar = llamar.replace("&","");
      llamar = llamar.replace("'","");
      llamar = llamar.replace('"',"");

      window.location.href = 'tel:' + llamar;
      
    },
    beep(duration,type,finishedCallback){
  
      
          var ctxClass = window.audioContext ||window.AudioContext || window.AudioContext || window.webkitAudioContext
          var ctx = new ctxClass();
          return function (duration, type, finishedCallback) {

              duration = +duration;

              // Only 0-4 are valid types.
              type = (type % 5) || 0;

              if (typeof finishedCallback != "function") {
                  finishedCallback = function () {};
              }

              var osc = ctx.createOscillator();

              osc.type = type;
              //osc.type = "sine";

              osc.connect(ctx.destination);
              if (osc.noteOn) osc.noteOn(0);
              if (osc.start) osc.start();

              setTimeout(function () {
                  if (osc.noteOff) osc.noteOff(0);
                  if (osc.stop) osc.stop();
                  finishedCallback();
              }, duration);

          };
    },
    convertDateNormal(date) {
      const [yy, mm, dd] = date.split(/-/g);
      return `${dd}/${mm}/${yy}`.replace('T00:00:00.000Z', '');
    },
    shareApp:async()=>{
        const shareData = {
          title: 'MERCADOS EFECTIVOS',
          text: `App para Ventas (${versionapp})`,
          url: window.location.origin
        }

        try {
            await navigator.share(shareData)
            //resultPara.textContent = 'MDN shared successfully'
        } catch(err) {
            //resultPara.textContent = 'Error: ' + err
            console.log('Error al compartir: ' + err);
        }
    },
    shareAppWhatsapp: ()=>{
     let url= window.location.origin
     swal({
      text: 'Escriba el número a donde se enviará el link de la aplicación:',
      content: "input",
      button: {
        text: "Enviar Whatsapp",
        closeModal: true,
      },
    })
    .then(numero => {
      if (!numero) throw null;
        let stn = '502' + numero.toString();
        let msg = encodeURIComponent(`Aplicación Ventas Mercados Efectivos ${versionapp} `);
            window.open('https://api.whatsapp.com/send?phone='+stn+'&text='+msg+url)
    })   

    },
    enviarPedidoWhatsapp2: function(fecha,coddoc,correlativo){
    swal({
      text: 'Escriba el número a donde se enviará:',
      content: "input",
      button: {
        text: "Whatsapp",
        closeModal: true,
      },
    })
    .then(numero => {
      if (!numero) throw null;
        let stn = '502' + numero.toString();
        apigen.digitadorDetallePedidoWhatsapp(fecha,coddoc,correlativo,stn);
    })
    },
    enviarPedidoWhatsapp:(fecha,coddoc,correlativo)=>{

    var apiwha = (navigator.contacts || navigator.mozContacts);
      
    if (apiwha && !!apiwha.select) { // new Chrome API
      apiwha.select(['name', 'email', 'tel'], {multiple: false})
        .then(function (contacts) {
          //console.log('Found ' + contacts.length + ' contacts.');
          if (contacts.length) {
            let numero = contacts[0].tel.toString()
            numero = numero.replace('+502','');
            let stn = '502' + numero.toString();
            stn = stn.replace(' ','');
            apigen.digitadorDetallePedidoWhatsapp(fecha,coddoc,correlativo,stn);
          }
        })
        .catch(function (err) {
          console.log('Fetching contacts failed: ' + err.name);
          funciones.AvisoError('Fetching contacts failed 1 : ' +  err.toString())
        });
        
    } else if (apiwha && !!apiwha.find) { // old Firefox OS API
      var criteria = {
        sortBy: 'familyName',
        sortOrder: 'ascending'
      };
  
      apiwha.find(criteria)
        .then(function (contacts) {
          //console.log('Found ' + contacts.length + ' contacts.');
          if (contacts.length) {
            let numero = contacts[0].tel.toString()
            numero = numero.replace('+502','');
            let stn = '502' + numero.toString();
            stn = stn.replace(' ','');
            apigen.digitadorDetallePedidoWhatsapp(fecha,coddoc,correlativo,stn);
          }
        })
        .catch(function (err) {
          console.log('Fetching contacts failed: ' + err.name);
          funciones.AvisoError('Fetching contacts failed 2 : ' + err.toString())
        });
        
    } else {
      console.log('Contacts API not supported.');
    }
    },
    readContacts:(idResult)=>{

    let container = document.getElementById(idResult);

    var api = (navigator.contacts || navigator.mozContacts);
      
    if (api && !!apigen.select) { // new Chrome API
      apigen.select(['name', 'email', 'tel'], {multiple: false})
        .then(function (contacts) {
          console.log('Found ' + contacts.length + ' contacts.');
          if (contacts.length) {
            
            let numero = contacts[0].tel.toString()
            numero = numero.replace('+502','');
            let stn = '502' + numero.toString();
            stn = stn.replace(' ','');
            funciones.Aviso(stn);
            container.innerHTML = JSON.stringify(contacts);
            
          }
        })
        .catch(function (err) {
          console.log('Fetching contacts failed: ' + err.name);
          funciones.AvisoError('Fetching contacts failed: ' + err.name)
        });
        
    } else if (api && !!apigen.find) { // old Firefox OS API
      var criteria = {
        sortBy: 'familyName',
        sortOrder: 'ascending'
      };
  
      apigen.find(criteria)
        .then(function (contacts) {
          console.log('Found ' + contacts.length + ' contacts.');
          container.innerHTML = JSON.stringify(contacts);
          if (contacts.length) {
            let numero = contacts[0].tel.toString()
            numero = numero.replace('+502','');
            let stn = '502' + numero.toString();
            stn = stn.replace(' ','');
            funciones.Aviso(stn);
            container.innerHTML = JSON.stringify(contacts);
            
          }
        })
        .catch(function (err) {
          console.log('Fetching contacts failed: ' + err.name);
          funciones.AvisoError('Fetching contacts failed: ' + err.name)
        });
        
    } else {
      console.log('Contacts API not supported.');
      container.innerHTML = 'Contacts API not supported.'
    }
    },
    GetDataNit: async (idNit,idCliente,idDireccion)=>{

      return new Promise((resolve, reject) => {
        let nit = document.getElementById(idNit).value;                    
        let url = 'https://free.feel.com.gt/api/v1/obtener_contribuyente';
        
        axios.post(url,{nit: nit})
        .then((response) => {
            let json = response.data;
            console.log(response.data);
            
            //document.getElementById(idCliente).value = json.descripcion;
            //document.getElementById(idDireccion).value = json.direcciones.direccion;    

            resolve(json);
        }, (error) => {
            console.log(error);
            reject();
        });
  


      });

    },
    GetDataNIS: async (NIS,idTxtPropietario,idTxtDireccion)=>{

      return new Promise((resolve, reject) => {
        
        let url = 'https://oficinavirtual.energuate.com/mifactura/GetHistorial?nisrad=' + NIS;
        
        axios.get(url)
        .then((response) => {
            let json = response.data.dataPersonBill;
            //console.log(response.data.dataPersonBill);
            
            //document.getElementById(idTxtPropietario).value = json.TITULAR_SERVICIO;
            //document.getElementById(idTxtDireccion).value = json.DIRECCION_SERVICIO;    
  
            resolve(json);
        }, (error) => {
            console.log(error);
            reject(error);
        });
  
  
  
      });

    },
    instalationHandlers: (idBtnInstall)=>{
      //INSTALACION APP
      let btnInstalarApp = document.getElementById(idBtnInstall);
      btnInstalarApp.hidden = true;

      let capturedInstallEvent;
      window.addEventListener('beforeinstallprompt',(e)=>{
        e.preventDefault();
        btnInstalarApp.hidden = false;
        capturedInstallEvent = e;
      });
      btnInstalarApp.addEventListener('click',(e)=>{
        capturedInstallEvent.prompt();
      capturedInstallEvent.userChoice.then((choice)=>{
          //solicita al usuario confirmacion para instalar
      })
    })
    //INSTALACION APP
    },
    instalationHandlers2: (idContainer,idBtnInstall)=>{
      //INSTALACION APP
      let btnInstalarApp = document.getElementById(idBtnInstall);
      btnInstalarApp.hidden = true;

      let container = document.getElementById(idContainer);

      let capturedInstallEvent;
      window.addEventListener('beforeinstallprompt',(e)=>{
        e.preventDefault();
        container.hidden = false;
        capturedInstallEvent = e;
      });
      btnInstalarApp.addEventListener('click',(e)=>{
        capturedInstallEvent.prompt();
        capturedInstallEvent.userChoice.then((choice)=>{
          //solicita al usuario confirmacion para instalar
        })
      })
      //INSTALACION APP
    },
    Confirmacion: function(msn){
        try {
            if (typeof Swal !== 'undefined' && typeof Swal.isVisible === 'function' && Swal.isVisible()) {
                Swal.close();
            }
        } catch (e) {}
        return swal({
            title: 'Confirme',
            text: msn,
            icon: 'warning',
            buttons: {
                cancel: 'Cancelar',
                confirm: 'Aceptar',
            }
        })
    },
    // Avisos no bloqueantes: toast (no congelan la UI ni dejan overlay)
    Aviso: function(msn){
        try {
            if (typeof Noty !== 'undefined') {
                new Noty({
                    type: 'success',
                    layout: 'topRight',
                    timeout: 2200,
                    theme: 'relax',
                    progressBar: true,
                    text: String(msn || '')
                }).show();
            } else if (typeof Swal !== 'undefined') {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: String(msn || ''),
                    showConfirmButton: false,
                    timer: 2200,
                    timerProgressBar: true
                });
            }
        } catch (e) {
            console.log(msn);
        }
        try {
            navigator.vibrate(500);
        } catch (error) {
            
        }
    },
    AvisoError: function(msn){
        try {
            if (typeof Noty !== 'undefined') {
                new Noty({
                    type: 'error',
                    layout: 'topRight',
                    timeout: 2800,
                    theme: 'relax',
                    progressBar: true,
                    text: String(msn || '')
                }).show();
            } else if (typeof Swal !== 'undefined') {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: String(msn || ''),
                    showConfirmButton: false,
                    timer: 2800,
                    timerProgressBar: true
                });
            }
        } catch (e) {
            console.log(msn);
        }
        try {
            navigator.vibrate([100,200,500]);
        } catch (error) {
            
        }
    },
    clearUiBlockers: function(){
        try {
            if (typeof Swal !== 'undefined' && typeof Swal.isVisible === 'function' && Swal.isVisible()) {
                Swal.close();
            }
        } catch (e) {}
        try {
            document.querySelectorAll('.swal2-container').forEach((el) => {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            });
        } catch (e) {}
        try {
            const wait = document.getElementById('modalWait');
            if (wait && (wait.classList.contains('show') || wait.style.display === 'block')) {
                try { $('#modalWait').modal('hide'); } catch (e2) {}
                wait.classList.remove('show', 'factura-wait-modal');
                wait.style.display = 'none';
            }
        } catch (e) {}
        try {
            const overlay = document.getElementById('progressOverlay');
            if (overlay) {
                overlay.classList.remove('show');
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }
        } catch (e) {}
        try {
            const openModals = document.querySelectorAll('.modal.show');
            if (!openModals.length) {
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                document.querySelectorAll('.modal-backdrop').forEach((b) => {
                    if (b && b.parentNode) b.parentNode.removeChild(b);
                });
            }
        } catch (e) {}
    },
    FiltrarListaProductos: function(idTabla){
        swal({
          text: 'Escriba para buscar...',
          content: "input",
          button: {
            text: "Buscar",
            closeModal: true,
          },
        })
        .then(name => {
          if (!name) throw null;
            funciones.FiltrarTabla(idTabla,name);

            //'tblProductosVentas'
        })
    },
    solicitarClave: function(){
      return new Promise((resolve,reject)=>{
          swal({
            title: 'Confirme',
            text: 'Escriba su contraseña de usuario',
            input: 'password',
            inputAttributes: {
              autocapitalize: 'off',
              autocorrect: 'off',
              autocomplete: 'current-password'
            },
            buttons: {
              cancel: 'Cancelar',
              confirm: 'Aceptar',
            },
          })
          .then(name => {
            if (!name) throw null;
                resolve(name);
          })
          .catch(()=>{
            reject('no');
          })
      })     
    },
    BACKUP_setMoneda: function(num,signo) {
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num)) num = "0";
        let sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        let cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10) cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + signo + ' ' + num + ((cents == "00") ? '' : '.' + cents)).toString();
    },
    setMoneda: function(num,signo) {
          num = num.toString().replace(/\$|\,/g, '');
          if (isNaN(num)) num = "0";
          let sign = (num == (num = Math.abs(num)));
          num = Math.floor(num * 100 + 0.50000000001);
          let cents = num % 100;
          num = Math.floor(num / 100).toString();
          if (cents < 10) cents = "0" + cents;
          for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
              num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
          let resultado = ((((sign) ? '' : '-') + signo + ' ' + num + ((cents == "00") ? '' : '.' + cents)).toString());
          
          if(resultado.includes('.')){}else{resultado = resultado + ".00"}
          
          return resultado; //.replace('-','');

    },
    setNumero: function(num) {
          
          let signo = '';

          num = num.toString().replace(/\$|\,/g, '');
          if (isNaN(num)) num = "0";
          let sign = (num == (num = Math.abs(num)));
          num = Math.floor(num * 100 + 0.50000000001);
          let cents = num % 100;
          num = Math.floor(num / 100).toString();
          if (cents < 10) cents = "0" + cents;
          for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
              num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
          let resultado = ((((sign) ? '' : '-') + signo + ' ' + num + ((cents == "00") ? '' : '.' + cents)).toString());
          
          
          let valorfinal = resultado; //Number(resultado);
          //valorfinal = valorfinal.toFixed(Number(decimales));
          
          return valorfinal; //.replace('-','');

    },
    setMargen: function(num,signo) {
      
      num = num.toString().replace(/\$|\,/g, '');
      if (isNaN(num)) num = "0";
      let sign = (num == (num = Math.abs(num)));
      num = Math.floor(num * 100 + 0.50000000001);
      let cents = num % 100;
      num = Math.floor(num / 100).toString();
      if (cents < 10) cents = "0" + cents;
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
          num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
      return ( ((sign) ? '' : '-') +  num + ((cents == "00") ? '' : '.' + cents) + ' ' + signo  ).toString();
    },
    loadScript: function(url, idContainer) {
        return new Promise((resolve, reject) => {
          try {
            if (typeof funciones.clearUiBlockers === 'function') {
              funciones.clearUiBlockers();
            }
          } catch (e) {}
          var script = document.createElement('script');
          script.src = url;
    
          script.onload = resolve;
          script.onerror = reject;
             
          document.getElementById(idContainer).appendChild(script)
        });
    },
    loadView: (url, idContainer)=> {
        return new Promise((resolve, reject) => {
            
            let contenedor = document.getElementById(idContainer);

            axios.get(url)
            .then((response) => {
                contenedor.innerHTML ='';
                contenedor.innerHTML = response.data;
                resolve();
            }, (error) => {
                console.log(error);
                reject();
            });
      
          });
    },   
    hablar: function(msn){
        var utterance = new SpeechSynthesisUtterance(msn);
        return window.speechSynthesis.speak(utterance); 
    },
    crearBusquedaTabla: function(idTabla,idBusqueda){
    var tableReg = document.getElementById(idTabla);
    var searchText = document.getElementById(idBusqueda).value.toLowerCase();
      var cellsOfRow="";
      var found=false;
      var compareWith="";
   
      // Recorremos todas las filas con contenido de la tabla
        for (var i = 1; i < tableReg.rows.length; i++)
                {
                  cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
                    found = false;
                    // Recorremos todas las celdas
                    for (var j = 0; j < cellsOfRow.length && !found; j++)
                    {
                      compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                      // Buscamos el texto en el contenido de la celda
                      if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1))
                      {
                          found = true;
                      }
                  }
                  if(found)
                  {
                      tableReg.rows[i].style.display = '';
                  } else {
                      // si no ha encontrado ninguna coincidencia, esconde la
                      // fila de la tabla
                      tableReg.rows[i].style.display = 'none';
                  }
              }
    },
    FiltrarTabla: function(idTabla,idfiltro){
    var tableReg = document.getElementById(idTabla);
    let filtro = document.getElementById(idfiltro).value;

    var searchText = filtro.toLowerCase();
      var cellsOfRow="";
      var found=false;
      var compareWith="";
   
      // Recorremos todas las filas con contenido de la tabla
        for (var i = 1; i < tableReg.rows.length; i++)
                {
                  cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
                    found = false;
                    // Recorremos todas las celdas
                    for (var j = 0; j < cellsOfRow.length && !found; j++)
                    {
                      compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                      // Buscamos el texto en el contenido de la celda
                      if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1))
                      {
                          found = true;
                      }
                  }
                  if(found)
                  {
                      tableReg.rows[i].style.display = '';
                  } else {
                      // si no ha encontrado ninguna coincidencia, esconde la
                      // fila de la tabla
                      tableReg.rows[i].style.display = 'none';
                  }
              }
        //funciones.scrollUp(1000, 'easing');
    },
    OcultarRows: function(idTabla){
    var tableReg = document.getElementById(idTabla);
        // Recorremos todas las filas con contenido de la tabla
        for (var i = 1; i < tableReg.rows.length; i++)
        {
            if(i>15){
                tableReg.rows[i].style.display = 'none';
            }
        }
    },
    NotificacionPersistent : (titulo,msn)=>{

    function InicializarServiceWorkerNotif(){
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () =>
       navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(err => 'SW registration failed'));
      };
      
      requestPermission();
    }
    
    if ('Notification' in window) {};
    
    function requestPermission() {
      if (!('Notification' in window)) {
        funciones.Aviso('Notification API not supported!');
        return;
      }
      
      Notification.requestPermission(function (result) {
        //$status.innerText = result;
      });
    }

    InicializarServiceWorkerNotif();
    
    const options = {
        body : titulo,
        icon: "../favicon.png",
        vibrate: [1,2,3],
      }
      //image: "../favicon.png",
         if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
          console.log('Persistent Notification API not supported!');
          return;
        }
        
        try {
          navigator.serviceWorker.getRegistration()
            .then(reg => 
                    reg.showNotification(msn, options)
                )
            .catch(err => console.log('Service Worker registration error: ' + err));
        } catch (err) {
          console.log('Notification API error: ' + err);
        }
      
    },
    ObtenerUbicacion: async(idlat,idlong)=>{
        let lat = document.getElementById(idlat);
        let long = document.getElementById(idlong);
        
        try {
            navigator.geolocation.getCurrentPosition(function (location) {
                lat.innerText = location.coords.latitude.toString();
                long.innerText = location.coords.longitude.toString();
            })
        } catch (error) {
            funciones.AvisoError(error.toString());
        }
    },
    Obtiene_ubicacion_lat_long: async()=>{

      return new Promise((resolve)=>{
          try {
              if (!navigator.geolocation) {
                  selected_latitud = 0;
                  selected_longitud = 0;
                  resolve();
                  return;
              }
              navigator.geolocation.getCurrentPosition(
                  function (location) {
                      selected_latitud = Number(location.coords.latitude.toString());
                      selected_longitud = Number(location.coords.longitude.toString());
                      resolve();
                  },
                  function () {
                      // Si falla GPS, igual permite registrar la visita
                      selected_latitud = 0;
                      selected_longitud = 0;
                      resolve();
                  },
                  { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
              );
          } catch (error) {
              selected_latitud = 0;
              selected_longitud = 0;
              resolve();
          }
      })
        
         

    },
    ComboSemana :(letnum)=>{
      let str = '';
      if(letnum=="LETRAS"){
        str =  `<option value="LUNES">LUNES</option>
                <option value="MARTES">MARTES</option>
                <option value="MIERCOLES">MIERCOLES</option>
                <option value="JUEVES">JUEVES</option>
                <option value="VIERNES">VIERNES</option>
                <option value="SABADO">SABADO</option>
                <option value="DOMINGO">DOMINGO</option>
                <option value="OTROS">OTROS</option>
                `
      }else{
        str =  `<option value="1">LUNES</option>
                <option value="2">MARTES</option>
                <option value="3">MIERCOLES</option>
                <option value="4">JUEVES</option>
                <option value="5">VIERNES</option>
                <option value="6">SABADO</option>
                <option value="7">DOMINGO</option>
                <option value="0">OTROS</option>
                `
      };

      return str;
      
    },
    getDiaSemana:(numdia)=>{
      switch (numdia) {
        case 0:
          return 'DOMINGO';
          break;
        case 1:
          return 'LUNES';
          break;
        case 2:
          return 'MARTES';
          break;
        case 3:
          return 'MIERCOLES';
          break;
        case 4:
          return 'JUEVES';
          break;
        case 5:
          return 'VIERNES';
          break;
        case 6:
          return 'SABADO';
          break;
      
        default:
          break;
      }
    },
    ComboMeses: ()=>{
    let str =`<option value='1'>Enero</option>
              <option value='2'>Febrero</option>
              <option value='3'>Marzo</option>
              <option value='4'>Abril</option>
              <option value='5'>Mayo</option>
              <option value='6'>Junio</option>
              <option value='7'>Julio</option>
              <option value='8'>Agosto</option>
              <option value='9'>Septiembre</option>
              <option value='10'>Octubre</option>
              <option value='11'>Noviembre</option>
              <option value='12'>Diciembre</option>`
    return str;
    },
    ComboAnio: ()=>{
    let str =`<option value='2017'>2017</option>
              <option value='2018'>2018</option>
              <option value='2019'>2019</option>
              <option value='2020'>2020</option>
              <option value='2021'>2021</option>
              <option value='2022'>2022</option>
              <option value='2023'>2023</option>
              <option value='2024'>2024</option>
              <option value='2025'>2025</option>
              <option value='2026'>2026</option>
              <option value='2027'>2027</option>
              <option value='2028'>2028</option>
              <option value='2029'>2029</option>
              <option value='2030'>2030</option>`
    return str;
    },
    get_mes_curso:()=>{
        
        let mes = 0;
        let f = new Date();
        mes = f.getUTCMonth()+1;
        return mes;

    },
    get_anio_curso:()=>{
        
        let anio = 0;
        let f = new Date();
        anio = f.getFullYear();
        return anio;

    },
    getFecha(){
      let fecha
      let f = new Date(); 
      let d = f.getDate(); 
      let m = f.getUTCMonth()+1; 

      switch (d.toString()) {
        case '30':
          m = f.getMonth()+1; 
          break;
        case '31':
          m = f.getMonth()+1; 
            break;
      
        default:

          break;
      }

      
      let y = f.getFullYear();
     
      di = d;
      var D = '0' + di;
      let DDI 
      if(D.length==3){DDI=di}else{DDI=D}
      
      ma = m;
      var MA = '0' + ma;
      let DDM 
      if(MA.length==3){DDM=ma}else{DDM=MA}


      fecha = y + '-' + DDM + '-' + DDI;
      return fecha;
    },
    limpiarTexto: (texto) =>{
      texto = texto.replace("'","");
      texto = texto.replace("&","");
      texto = texto.replace('"',"");
      texto = texto.replace("$","");
      texto = texto.replace("%","");
      texto = texto.replace("/","");
      texto = texto.replace("#","");
      texto = texto.replace("*","");
      texto = texto.replace('@',"");
      texto = texto.replace(/(\r\n|\n|\r)/gm, "");
      return texto;
    },
    limpiarTextoX: (texto) =>{
      texto = texto.replace("'","");
      texto = texto.replace("&","");
      texto = texto.replace('"',"");
      var ignorarMayMin = true;
      var reemplazarCon = "";
      var reemplazarQue = '"';
      reemplazarQue = reemplazarQue.replace(/[\\^$.|?*+()[{]/g, "\\$&"),
      reemplazarCon = reemplazarCon.replace(/\$(?=[$&`"'\d])/g, "$$$$"),
      modif = "g" + (ignorarMayMin ? "i" : ""),
      regex = new RegExp(reemplazarQue, modif);
      return texto.replace(regex,reemplazarCon);
    },
    quitarCaracteres: ( texto, reemplazarQue, reemplazarCon, ignorarMayMin) =>{
      var reemplazarQue = reemplazarQue.replace(/[\\^$.|?*+()[{]/g, "\\$&"),
      reemplazarCon = reemplazarCon.replace(/\$(?=[$&`"'\d])/g, "$$$$"),
      modif = "g" + (ignorarMayMin ? "i" : ""),
      regex = new RegExp(reemplazarQue, modif);
      return texto.replace(regex,reemplazarCon);
    },
    devuelveFecha: (idInputFecha)=>{
      let fe = new Date(document.getElementById(idInputFecha).value);
      let ae = fe.getFullYear();
      let me = fe.getUTCMonth()+1;
      let de = fe.getUTCDate() 
      let fret = ae + '-' + me + '-' + de;
      return fret;
    },
    getComboTipoEmpleados: (idcontainer)=>{
      let str = `
        <option value="VENDEDOR">VENDEDORES</option>
        <option value="SUPERVISOR">SUPERVISOR</option>
        <option value="REPARTIDOR">REPARTIDORES</option>
      `
      document.getElementById(idcontainer).innerHTML = str;

    },
    showToast: (text)=>{
      //depente de la libreria noty
      new Noty({
        type: 'warning', //info, alert, notificacion, warning, error, information, success
        layout: 'topRight',
        timeout: '1000',
        theme: 'relax', //relax, metroui, mint, sunset,bootstrap-v3,
        progressBar: true, //true false
        text,
      }).show();
    },
    setReminder: async (msg,minutos)=>{

      
        if (!('Notification' in window)) {
          alert('Notification API not supported');
          return;
        }
        if (!('showTrigger' in Notification.prototype)) {
          alert('Notification Trigger API not supported');
          return;
        }
        
        await Notification.requestPermission()
          .then(() => {
            if (Notification.permission !== 'granted') {
              throw 'Notification permission is not granted';
            }
          })
          .then(() => navigator.serviceWorker.getRegistration())
          .then((reg) => {
            reg.showNotification(msg, {
                showTrigger: new TimestampTrigger(new Date().getTime() + Number(minutos) * 60000)
            })
          })
          .catch((err) => {
            alert('Notification Trigger API error: ' + err);
          });
      
    
    },
    getComboSucursales: ()=>{
      let str = '';
      
      dataEmpresas.map((rows)=>{
        str = str + `<option value='${rows.codsucursal}'>${rows.nomsucursal}</option>`;
      });

      return str;
      
    },
    getComboTipoClientes:()=>{
      return `
        <option value="TIENDITA">TIENDITA</option>
        <option value="ABARROTERIA">ABARROTERIA</option>
        <option value="FARMACIA">FARMACIA</option>
        <option value="LIBRERIA">LIBRERIA</option>
        <option value="PIÑATERIA">PIÑATERIA</option>
        <option value="MUNDO DE 3">MUNDO DE 3</option>
        <option value="RESTAURANTE">RESTAURANTE</option>
        <option value="COMEDOR">COMEDOR</option>
        <option value="PAPEROS">PAPEROS</option>
        <option value="HOTEL">HOTEL</option>
        <option value="AUTOHOTEL">AUTOHOTEL</option>
        <option value="CARNICERIA">CARNICERIA</option>
        <option value="MERCERIA">MERCERIA</option>
        <option value="BAR">BAR</option>
        <option value="BARBERIA">BARBERIA</option>
        <option value="SALON DE BELLEZA">SALON DE BELLEZA</option>
        <option value="COLEGIO">COLEGIO</option>
        <option value="MINISUPER">MINISUPER</option>
        <option value="SUPERMERCADO">SUPERMERCADO</option>
        <option value="RUTEROS">RUTEROS</option>
        <option value="OTROS">OTROS</option>
      `
    },
    slideAnimationTabs: ()=>{
      // Una sola vez: CSS transform/opacity (GPU), sin jQuery.animate ni left/right
      if (funciones._slideTabsBound) return;
      funciones._slideTabsBound = true;

      const reduceMotion = () =>
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const clearTabAnim = (pane) => {
        if (!pane) return;
        pane.classList.remove(
          'tabs-slide-prep',
          'tabs-slide-from-left',
          'tabs-slide-from-right',
          'tabs-slide-in'
        );
        pane.style.willChange = '';
      };

      $(document)
        .off('show.bs.tab.slideAnim', 'a[data-toggle="tab"]')
        .on('show.bs.tab.slideAnim', 'a[data-toggle="tab"]', function (e) {
          if (reduceMotion()) return;

          const hrefNew = $(e.target).attr('href');
          const hrefOld = e.relatedTarget ? $(e.relatedTarget).attr('href') : null;
          const newTab = hrefNew ? document.querySelector(hrefNew) : null;
          const oldTab = hrefOld ? document.querySelector(hrefOld) : null;
          if (!newTab) return;

          const fromRight = !oldTab || $(newTab).index() >= $(oldTab).index();
          clearTabAnim(newTab);
          newTab.style.willChange = 'transform, opacity';
          newTab.classList.add('tabs-slide-prep', fromRight ? 'tabs-slide-from-right' : 'tabs-slide-from-left');

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              newTab.classList.add('tabs-slide-in');
              newTab.classList.remove('tabs-slide-from-left', 'tabs-slide-from-right');
            });
          });

          const onEnd = (ev) => {
            if (ev && ev.target !== newTab) return;
            if (ev && ev.propertyName && ev.propertyName !== 'opacity' && ev.propertyName !== 'transform') return;
            newTab.removeEventListener('transitionend', onEnd);
            clearTabAnim(newTab);
          };
          newTab.addEventListener('transitionend', onEnd);
          setTimeout(() => {
            newTab.removeEventListener('transitionend', onEnd);
            clearTabAnim(newTab);
          }, 260);
        });
    },
    exportTableToExcel: (tableID, filename = '')=>{
      var downloadLink;
      var dataType = 'application/vnd.ms-excel;charset=UTF-8';
      var tableSelect = document.getElementById(tableID);
      var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
      
      // Specify file name
      filename = filename?filename+'.xls':'excel_data.xlsx';
      
      // Create download link element
      downloadLink = document.createElement("a");
      
      document.body.appendChild(downloadLink);
      
      if(navigator.msSaveOrOpenBlob){
          var blob = new Blob(['ufeff', tableHTML], {
              type: "text/plain;charset=utf-8;"//dataType
          });
          navigator.msSaveOrOpenBlob( blob, filename);
      }else{
          // Create a link to the file
          downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
      
          // Setting the file name
          downloadLink.download = filename;
          
          //triggering the function
          downloadLink.click();
      }
    },
    getTipoPrecio: (tipo)=>{
      let str = '';
      switch (tipo) {
        case 'A':
            str = 'MAYOREO';
            break;
        case 'B':
            str = 'PRECIO A';
            break;
        case 'C':
            str = 'PRECIO B';
            break;
        case 'K':
            str = 'CAMBIO';
            break;
      };
      return str;
    },
    getHora:()=>{
      let hoy = new Date();
      let hora = String(hoy.getHours()).padStart(2, '0');
      let minuto = String(hoy.getMinutes()).padStart(2, '0');
      return `${hora}:${minuto}`;
    },
    gotoGoogleMaps:(lat,long)=>{
      window.open(`https://www.google.com/maps?q=${lat},${long}`);
    },
    create_qr_code:(codigo,idcontainer)=>{

          let container = document.getElementById(idcontainer);
          container.innerHTML = '';

          let qrcodetext = `MERCADOS-${codigo}`;
          new QRCode(container, qrcodetext);

    },
    export_json_to_xlsx:(data,nombre)=>{

         
          filename= nombre.toString() + '.xlsx'; 
          var ws = XLSX.utils.json_to_sheet(data); 
          var wb = XLSX.utils.book_new(); 
          XLSX.utils.book_append_sheet(wb, ws, "rpt"); 
          XLSX.writeFile(wb,filename); 

    },
    animateCSS: (element, animation, prefix = 'animate__') =>
        //utiliza Animate.css
        // We create a Promise and return it
        new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.getElementById(element);

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true});
    }),
    devuelve_dia_semana:()=>{

        //const input = document.getElementById(idInput);
        //const fecha = new Date(input.value + 'T00:00'); // 'T00:00' evita zona horaria UTC
        const fecha = new Date(); // 'T00:00' evita zona horaria UTC
        const diaSemana = fecha.getDay(); // 0 (Dom) - 6 (Sab)


        switch (diaSemana) {
          case 0:
            return 'DOMINGO';
            break;
          case 1:
            return 'LUNES';
            break;
          case 2:
            return 'MARTES';
            break;
          case 3:
            return 'MIERCOLES';
            break;
          case 4:
            return 'JUEVES';
            break;
          case 5:
            return 'VIERNES';
            break;
          case 6:
            return 'SABADO';
            break;
        
          default:
            break;
        }
    },
    barra_progreso:(color,minimo,maximo,valor, leyenda)=>{
      
      let porcentaje = ((Number(valor)/Number(maximo)) * 100)


      return `
          <div class="progress col-12" style="height: 40px;">
            <div class="progress-bar bg-${color} progress-bar-animated" 
                role="progressbar" 
                aria-valuenow="${Number(valor)}"
                aria-valuemin="${Number(minimo)}" 
                aria-valuemax="${Number(maximo)}" 
                style="width:${porcentaje}%">
                ${funciones.setMoneda(valor,'Q')} ${leyenda} ${funciones.setMoneda(porcentaje,'')}%
            </div>
          </div>
          `

      /*
        return `
          <label for="pBar">Progreso</label>
          <progress class="" id="pBar" value="${Number(valor)}" max="${Number(maximo)}">${funciones.setMoneda(porcentaje,'')}%</progress>
          `
          */
    }
};

//export default funciones;