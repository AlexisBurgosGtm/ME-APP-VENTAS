function getView(){
    let view = {
        login : ()=>{
            return `
        <div class="row">
     
            <div class="col-md-3 col-sm-0 col-lg-3 col-lx-3">
                
            </div>

            <div class="col-md-5 col-sm-12 col-lg-5 col-lx-5">
   
                <div class="card shadow p-2 card-rounded border-secondary">

                    <div class="card-header text-center bg-white">
                        <div class="row">
                            <div id="parallax_logo" class="col-4">
                                <img data-depth="1.0" src="./anuncio.png" width="100" height="100">                            
                            </div>    
                            <div class="col-4">
                                                            
                            </div>  
                             <div id="parallax_logo" class="col-4">
                                <img data-depth="1.0" src="./img/logoag.png" width="70" height="70">                            
                            </div>    
                        </div>
                        
                    </div>
                    <div class="card-body">
                        <form class="" id="frmLogin" autocomplete="off">
                            <div class="form-group">
                                <select class="negrita form-control border-secondary border-top-0 border-right-0 border-left-0" id="cmbSucursal">
                                    
                                </select>
                                
                            </div>
                            <div class="form-group">
                                
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                            <i class="fal fa-user"></i>
                                        </span>
                                    </div>
                                    <input class="form-control border-secondary border-top-0 border-right-0 border-left-0" type="text" id="txtUsr" placeholder="Escriba su usuario" required="true">
                                </div>
                                
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">
                                            <i class="fal fa-lock"></i>
                                        </span>
                                    </div>
                                    <input class="form-control border-secondary border-top-0 border-right-0 border-left-0" type="password" id="txtPass" placeholder="Escriba su contraseña" required="true">
                                </div>
                                        
                            </div>
                            <br>
                            <div class="form-group" align="center">
                                <div class="row">
                                    
                                    <div class="col-2">
                                       
                                    </div>  
                                    <div class="col-10">
                                        <button class="btn btn-secondary btn-lg shadow col-12 btn-rounded"  type="submit" id="btnIniciar">
                                            <i class="fal fa-unlock"></i>
                                            Ingresar
                                        </button>
                                    </div> 
                                                                 
                                </div>

                                
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    
                                </div>
                                <div class="col-6">
                                    <small class="">Mercados Efectivos - ${versionapp}</small>
                                </div>
                            </div>
                            <div class="form-group" align="right">
                                <br>
                                <small>                             
                                    <a href="https://apigen.whatsapp.com/send?phone=50257255092&text=Ayudame%20con%20la%20app%20de%20Mercados%20Efectivos...%20">
                                        por Alexis Burgos
                                    </a>
                                </small>
                            </div>
                        </form>
                    </div>

                </div>
            </div>

            <div class="col-md-4 col-sm-12 col-lg-4 col-lx-4"></div>
            <div id="root_efecto"></div>

                         

       
            `
        }
    };

    root.innerHTML = view.login();
};



function addListeners(){
    
    GlobalCodSucursal = '';
    console.log('iniciando login... ' + GlobalCodSucursal);
    

    
    let frmLogin = document.getElementById('frmLogin');
    let btnIniciar = document.getElementById('btnIniciar');
    frmLogin.addEventListener('submit',(e)=>{
        e.preventDefault();
    
       
        btnIniciar.innerHTML = '<i class="fal fa-unlock fa-spin"></i>';
        btnIniciar.disabled = true;

        let suc = document.getElementById('cmbSucursal').value;
        let usu = document.getElementById('txtUsr').value;
        let pas = document.getElementById('txtPass').value;
        almacenarCredenciales()
        //apigen.empleadosLogin(frmLogin.cmbSucursal.value,frmLogin.txtUser.value.trim(),frmLogin.txtPass.value.trim())
        apigen.empleadosLogin(suc, usu.trim(), pas.trim())
        .then(()=>{
            
            //almacenarCredenciales();


            //document.body.requestFullscreen();
            //por lo visto se deshabilitan las scroll bars en fullscreen
            //selectDateDownload();
        })
        .catch(()=>{
            btnIniciar.disabled = false;
            btnIniciar.innerHTML = '<i class="fal fa-unlock"></i>Ingresar'
        });
    });


    //carga las sucursales directamente desde código
    document.getElementById('cmbSucursal').innerHTML = '<option value="" disabled selected hidden>Selecciona una sede</option>' + funciones.getComboSucursales();

    selectDateDownload() //carga la info inicial
    .then(()=>{
        try {
            document.getElementById('cmbSucursal').value = GlobalCodSucursal;
            console.log(GlobalCodSucursal);

            deleteDateDownload();
        } catch (error) {
            console.log('error al cargar sucursal')
            console.log(error)
        }
    })
   

    
    var parallax_logo = document.getElementById('parallax_logo');
    var parallaxInstance = new Parallax(parallax_logo);
   

};


function InicializarVista(){
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

      console.log(creds);
    //Do something with the credentials.
    document.getElementById('txtUser').value = creds.id;
    document.getElementById('cmbSucursal').value = creds.name;
    document.getElementById('txtPass').value = creds.password;

  });
    } else {
    //Handle sign-in the way you did before.
    };
};





