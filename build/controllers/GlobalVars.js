let versionapp = 'Mod:14.09.2026.5';
let GlobalServerUrl = '';
let GlobalUrlServicePedidos = '';

const APPVENTAS_SEDE_KEY = 'appventas_sede';
const APPVENTAS_LAST_LOGIN_KEY = 'appventas_last_login';

function getCachedSede() {
    try {
        return String(localStorage.getItem(APPVENTAS_SEDE_KEY) || '').trim();
    } catch (e) {
        return '';
    }
}

function setCachedSede(sede) {
    try {
        const value = String(sede == null ? '' : sede).trim();
        if (!value || value === 'offline' || value === 'error' || value.startsWith('{')) return;
        localStorage.setItem(APPVENTAS_SEDE_KEY, value);
    } catch (e) {}
}

function getCachedLastLogin() {
    try {
        const raw = localStorage.getItem(APPVENTAS_LAST_LOGIN_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || typeof data !== 'object') return null;
        return {
            sucursal: String(data.sucursal || '').trim(),
            user: String(data.user || '').trim(),
            pass: String(data.pass || '')
        };
    } catch (e) {
        return null;
    }
}

async function almacenarCredenciales() {
    try {
        const cmb = document.getElementById('cmbSucursal');
        const txtUsr = document.getElementById('txtUsr');
        const txtPass = document.getElementById('txtPass');
        const sucursal = String((cmb && cmb.value) || GlobalCodSucursal || '').trim();
        const user = String((txtUsr && txtUsr.value) || '').trim();
        const pass = String((txtPass && txtPass.value) || '');
        if (sucursal) setCachedSede(sucursal);
        localStorage.setItem(APPVENTAS_LAST_LOGIN_KEY, JSON.stringify({
            sucursal,
            user,
            pass
        }));
    } catch (e) {}
}

function cargarCredencialesGuardadas() {
    const cached = getCachedLastLogin();
    if (!cached) return;
    const txtUsr = document.getElementById('txtUsr');
    const txtPass = document.getElementById('txtPass');
    if (txtUsr && cached.user) txtUsr.value = cached.user;
    if (txtPass && cached.pass) txtPass.value = cached.pass;
}


let root = document.getElementById('root');
let rootMenu = document.getElementById('rootMenu');
let rootMenuFooter = document.getElementById('rootMenuFooter');

let lbMenuTitulo = document.getElementById('lbMenuTitulo');
let rootMenuLateral = document.getElementById('rootMenuLateral');
const showMenuLateral =(titulo)=>{ $("#modalMenu").modal('show'); lbMenuTitulo.innerText = titulo;};
const hideMenuLateral =()=>{ $("#modalMenu").modal('hide'); lbMenuTitulo.innerText = '';};

let divUsuario = document.getElementById('divUsuario');
let lbTipo = document.getElementById('lbTipo');

divUsuario.innerText = "DESCONECTADO";
lbTipo.innerText = "Inicie sesión";


let selected_tab = '';

let GlobalSelectedClientesDia ='SN';
let GlobalSelectedDiaUpdated  = 0;
let SelectedCodUpdate = '';
let SelectedLocalCodUpdate = '';
let GlobalObjetivoVenta = 0;
let GlobalCodUsuario = 99999;
let GlobalUsuario = 'MERCADOSEFECTIVOS';
let GlobalPassUsuario = '';
let GlobalNivelUser = 0;
let GlobalTipoUsuario ='';
let GlobalSelectedDia ='';
let GlobalBool = false;

let GlobalSelectedForm = '';

let map; //mapa de leaflet
let GlobalGpsLat = 0;
let GlobalGpsLong = 0;
let GlobalSelectedLat = ''; let GlobalSelectedLong='';
let GlobalMarkerId = 0;
let GlobalSelectedId;
let GlobalSelectedCodigo;
let GlobalSelectedFecha;
let GlobalCoddoc = 'PED01';
let GlobalCodRuta = 0;
let GlobalTipoCatalogo =''; //0=TODOS, 1=CATALOGO 1, 2=CATALOGO 2
let GlobalTotalDocumento = 0;
let GlobalTotalCostoDocumento = 0;
let GlobalCodBodega = '01';
let GlobalTipoCobro = 'TERMINAR';

let GlobalSelectedCodven = 0;

let selected_latitud = 0;
let selected_longitud = 0;

let GlobalSelectedCodCliente;
let GlobalSelectedNomCliente;
let GlobalSelectedDirCliente;

// global vars para cantidad producto
let GlobalSelectedCodprod = '';
let GlobalSelectedDesprod = '';
let GlobalSelectedCodmedida = '';
let GlobalSelectedEquivale = 0;
let GlobalSelectedCantidad = 0;
let GlobalSelectedExento = 0;
let GlobalSelectedCosto = 0;
let GlobalSelectedPrecio = 0;
let GlobalSelectedExistencia = 0;
// global vars para cantidad producto

let GlobalSelectedCodEmbarque ='';
let GlobalSelectedStatus=0;
let GlobalSelectedSt = 'O';
let GlobalSelectedCoddoc = '';
let GlobalSelectedCorrelativo = '';

let GlobalSelectedApp = '';

let GlobalSistema = 'ISC';


let GlobalLoaderMini = `<div class="modern-loader-shell modern-loader-shell-sm"><div class="modern-loader-ring"></div><span class="modern-loader-text">Cargando...</span></div>`;

function buildModernLoader(message = 'Cargando...') {
    return `
        <div class="modern-loader-shell">
            <div class="modern-loader-ring"></div>
            <div class="modern-loader-text">${message}</div>
        </div>
    `;
}

let GlobalLoader = buildModernLoader();

//'<div class="spinner-grow text-info" role="status"><span class="sr-only">Loading...</span></div>'


//'<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>';

let GlobalUrl = document.location.origin.toString();

let nowhatsapp = '50257255092';


function showWaitForm(){
    $('#modalWait').modal('show');
};


function hideWaitForm(){
    //esta linea ayuda a que las modales cierren
    if ($('.modal-backdrop').is(':visible')) {
        $('body').removeClass('modal-open'); 
        $('.modal-backdrop').remove(); 
    };

    //$('#modalWait').modal('hide');
    document.getElementById('btnCerrarModalWait').click();

};


//elimina los mensajes de console (  logger.disableLogger()  )
var logger = function()
{
    var oldConsoleLog = null;
    var pub = {};

    pub.enableLogger =  function enableLogger() 
                        {
                            if(oldConsoleLog == null)
                                return;

                            window['console']['log'] = oldConsoleLog;
                        };

    pub.disableLogger = function disableLogger()
                        {
                            oldConsoleLog = console.log;
                            window['console']['log'] = function() {};
                        };

    return pub;
}();


