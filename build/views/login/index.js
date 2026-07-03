function getView(){
    let view = {
        login : ()=>{
            return `
        <div class="login-page">
            <div class="login-bg-shape login-bg-shape-1" aria-hidden="true"></div>
            <div class="login-bg-shape login-bg-shape-2" aria-hidden="true"></div>

            <div class="login-card">
                <div class="login-brand">
                    <div id="parallax_logo" class="login-logo-wrap">
                        <img data-depth="1.0" src="./anuncio.png" width="88" height="88" alt="Mercados Efectivos">
                    </div>
                    <h1 class="login-brand-title">Mercados Efectivos</h1>
                    <p class="login-brand-sub">Equipo de Ventas</p>
                </div>

                <div class="login-form" autocomplete="off">
                    <div class="login-field">
                        <label class="login-label" for="cmbSucursal">Sede</label>
                        <div class="login-input-wrap">
                            <span class="login-input-icon"><i class="fal fa-building"></i></span>
                            <select class="form-control login-input" id="cmbSucursal" disabled="true">
                            </select>
                        </div>
                    </div>

                    <div class="login-field">
                        <label class="login-label" for="txtUsr">Usuario</label>
                        <div class="login-input-wrap">
                            <span class="login-input-icon"><i class="fal fa-user"></i></span>
                            <input class="form-control login-input" type="text" id="txtUsr" placeholder="Escriba su usuario" required="true">
                        </div>
                    </div>

                    <div class="login-field">
                        <label class="login-label" for="txtPass">Contraseña</label>
                        <div class="login-input-wrap">
                            <span class="login-input-icon"><i class="fal fa-lock"></i></span>
                            <input class="form-control login-input" type="password" id="txtPass" placeholder="Escriba su contraseña" required="true">
                        </div>
                    </div>

                    <div class="login-actions">
                        <button type="button" class="login-share-btn hand" onclick="funciones.shareAppWhatsapp()" title="Compartir app">
                            <img src="./img/mercados.png" width="40" height="40" alt="Compartir">
                        </button>
                        <button class="btn login-submit-btn shadow" type="submit" id="btnIniciar">
                            <i class="fal fa-unlock"></i>
                            Ingresar
                        </button>
                    </div>
                </div>

                <div class="login-footer">
                    <small class="login-version">Mercados Efectivos · ${versionapp}</small>
                    <a class="login-support-link" href="https://apigen.whatsapp.com/send?phone=50257255092&text=Ayudame%20con%20la%20app%20de%20Mercados%20Efectivos.2025...%20">
                        <i class="fab fa-whatsapp"></i> Soporte
                    </a>
                </div>
            </div>

            <div id="root_efecto"></div>
        </div>
            `
        }
    };

    root.innerHTML = view.login();
};



function addListeners(){
    
   

    document.getElementById('lbUsuarioData').innerText = '';

    //carga las sucursales directamente desde código
    document.getElementById('cmbSucursal').innerHTML = '<option value="" disabled selected hidden>Selecciona una sede</option>' + funciones.getComboSucursales();

    GlobalCodSucursal = '';

    get_sede()
    .then((sede)=>{
        document.getElementById('cmbSucursal').value = sede;
    })
    .catch(()=>{
        document.getElementById('cmbSucursal').disabled = false;
    })


   
   
    
    let btnIniciar = document.getElementById('btnIniciar');
    const btnIniciarDefaultHtml = '<i class="fal fa-unlock"></i> Ingresar';

    btnIniciar.addEventListener('click',()=>{
      
            btnIniciar.innerHTML = '<i class="fal fa-unlock fa-spin"></i> Ingresando...';
            btnIniciar.disabled = true;

            let suc = document.getElementById('cmbSucursal').value;
            let usu = document.getElementById('txtUsr').value;
            let pas = document.getElementById('txtPass').value;
        
            almacenarCredenciales()
        
            apigen.empleadosLogin(suc, usu.trim(), pas.trim())
            .then(()=>{

            })
            .catch(()=>{
                btnIniciar.disabled = false;
                btnIniciar.innerHTML = btnIniciarDefaultHtml;
            });

    });



    selectDateDownload() //carga la info inicial
    .then(()=>{
        try {

            //document.getElementById('cmbSucursal').value = GlobalCodSucursal;
            //console.log(GlobalCodSucursal);

            deleteDateDownload();
            
        } catch (error) {
            console.log('error al cargar sucursal')
            console.log(error)
        }
    })
   

    
    var parallax_logo = document.getElementById('parallax_logo');
    var parallaxInstance = new Parallax(parallax_logo);
   



};

function get_sede(){
            
    return new Promise((resolve,reject)=>{

        axios.get('/sede')
        .then((response) => {
            let sede = response.data;
            
            console.log('sede:');
            console.log(sede);

            if(response=='error'){
                reject();
            }else{
                resolve(sede);
            }             
        }, (error) => {
            reject();
        });

    });

};


function InicializarVista(){
   document.body.classList.add('login-active');
   getView();
   addListeners();

   //getCredenciales();

   iniciar_efecto();
   
};

function iniciar_efecto(){
    
    return;

    funciones.loadScript('./efectos/confetti.browser.min.js','root_efecto')
    .then(()=>{
        efecto_fireworks();
    })

};

function efecto_fireworks(){
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
    
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
    
      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
};



function getCredenciales(){
   if ('credentials' in navigator) {
  navigator.credentials.get({password: true})
  .then(function(creds) {

    
    //Do something with the credentials.
    document.getElementById('txtUser').value = creds.id;
    document.getElementById('cmbSucursal').value = creds.name;
    document.getElementById('txtPass').value = creds.password;

  });
    } else {
    //Handle sign-in the way you did before.
    };
};





