function getView(){
    let view = {
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                            ${view.vista_listado()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                           ${view.vista_documentos()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_detalle()}
                        </div>  
                        <div class="tab-pane fade" id="cuatro" role="tabpanel" aria-labelledby="home-tab">
                            ${view.vista_mapa()}
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
                        <li class="nav-item">
                            <a class="nav-link negrita text-danger" id="tab-cuatro" data-toggle="tab" href="#cuatro" role="tab" aria-controls="home" aria-selected="true">
                                <i class="fal fa-comments"></i></a>
                        </li>         
                    </ul>
                </div>
               
            `
        },
        vista_listado:()=>{
            return `
            <div class="card card-rounded col-12 shadow">
                <div class="card-body p-4 text-center">
                        <h1 class="text-secondary negrita">Pickings Asignados</h1>
                        <h3 class="negrita text-danger">${GlobalUsuario}</h3>
                </div>
            </div>
            <br>
            <div class="card card-rounded col-12">
                <div class="card-body p-1" id="tblEmbarques">
                    
                    
                </div>
            </div>
            `
        },
        vista_documentos:()=>{
            return `
            <div class="card card-rounded shadow col-12">
                <div class="card-body p-4">
                    <h5 class="negrita text-danger" id="lbEmbarque"></h5>
                    <div class="table-responsive">
                        <table class="table table-responsive col-12 table-striped table-bordered">
                            <thead class="bg-info text-white">
                                <tr>
                                    <td>FACTURA</td>
                                    <td>IMPORTE</td>
                                </tr>
                            </thead>
                            <tbody id="tblDocumentos"></tbody>
                        </table>
                    </div>
                    
                </div>
            </div>
            <button class="btn btn-secondary btn-bottom-ml btn-xl btn-circle hand shadow" id="btnAtrasDocumentos">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        vista_detalle:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-4">
                    
                    
                </div>
            </div>
            <button class="btn btn-secondary btn-bottom-ml btn-xl btn-circle hand shadow" id="btnAtrasDetalle">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        },
        vista_mapa:()=>{
            return `
            <div class="card card-rounded shadow">
                <div class="card-body p-0">
                    <h5 class="negrita text-danger" id="lbEmbarqueMapa"></h5>

                    <div class="" id="container_mapa"></div>
                    
                    
                </div>
            </div>
            <button class="btn btn-secondary btn-bottom-ml btn-xl btn-circle hand shadow" id="btnAtrasMapa">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        }
    }

    root.innerHTML = view.body();

};

function addListeners(){

    document.getElementById('btnAtrasDocumentos').addEventListener('click',()=>{
        document.getElementById('tab-uno').click();
    });
    
    document.getElementById('btnAtrasDetalle').addEventListener('click',()=>{
        document.getElementById('tab-dos').click();
    });

    document.getElementById('btnAtrasMapa').addEventListener('click',()=>{
        document.getElementById('tab-uno').click();
    });


    get_tbl_embarques_pendientes();


    funciones.slideAnimationTabs();
};

function initView(){

    getView();
    addListeners();

};



function get_data_embarques_pendientes(){

    return new Promise((resolve,reject)=>{
        console.log('intenta cargar...')

        axios.post('/repartidor/embarques_repartidor',{
            sucursal:GlobalCodSucursal,
            codrep:GlobalCodUsuario
         })
         .then((response) => {
             console.log('pasa por aqui...')
             let data = response.data;
             /*
             if(Number(data.rowsAffected[0])>0){
                 resolve(data);             
             }else{
                 reject();
             } */            
             if(response=='error'){reject()}else{resolve(data)}
         }, (error) => {
            console.log('error en solicitud')
            console.log(error);
             reject();
         });


    })

};

function get_tbl_embarques_pendientes(){

    let container = document.getElementById('tblEmbarques');
    container.innerHTML = GlobalLoader;

    get_data_embarques_pendientes()
    .then((data)=>{
        let str = ''; let strClassFinalizado = '';
        data.recordset.map((r)=>{
            if(r.FINALIZADO=='SI'){
                strClassFinalizado='border-danger bg-danger text-white'
            }else{
                strClassFinalizado='border-info'
            }
            str += `
            <div class="card card-rounded ${strClassFinalizado} col-12 hand shadow">
                <div class="card-body p-4 text-center" id="">
                    <h5 class="negrita text-info">${r.RUTA}</h5>    
                    <h5>${r.CODEMBARQUE}</h5>
                    <label class="negrita text-danger">Fecha: ${funciones.convertDateNormal(r.FECHA)}</label>
                    <div class="row">
                        <div class="col-6">
                            <button class="btn btn-secondary btn-lg hand shadow" onclick="get_mapa_embarque('${r.CODEMBARQUE}')">
                                <i class="fal fa-map"></i> Mapa
                            </button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-info btn-lg hand shadow" onclick="get_data_embarque('${r.CODEMBARQUE}')">
                                <i class="fal fa-list"></i> Facturas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        console.log('embarque no cargados')
        container.innerHTML = 'No hay datos...';
    })

}


function get_data_embarque(codembarque){

    document.getElementById('tab-dos').click();

    document.getElementById('lbEmbarque').innerText = codembarque;


    get_tbl_documentos_embarque(codembarque);


};

function get_data_documentos_embarque(codembarque){

    return new Promise((resolve,reject)=>{
        console.log('intenta cargar...')

        axios.post('/repartidor/embarque_documentos',{
            sucursal:GlobalCodSucursal,
            codembarque:codembarque
         })
         .then((response) => {
             console.log('pasa por aqui...')
             let data = response.data;
             /*
             if(Number(data.rowsAffected[0])>0){
                 resolve(data);             
             }else{
                 reject();
             } */            
             if(response=='error'){reject()}else{resolve(data)}
         }, (error) => {
            console.log('error en solicitud')
            console.log(error);
             reject();
         });


    })

};

function get_tbl_documentos_embarque(codembarque){

    let container = document.getElementById('tblDocumentos');
    container.innerHTML = GlobalLoader;


    get_data_documentos_embarque(codembarque)
    .then((data)=>{
        let str = '';
        data.recordset.map((r)=>{
            str += `
            <tr class="hand" onclick="get_detalle_factura('${r.CODDOC}','${r.CORRELATIVO}')">
                <td>
                    ${r.CLIENTE}
                    <br>
                    <small>${r.DIRECCION},${r.MUNICIPIO}</small>
                    <br>
                    <small class="text-danger">Fac:${r.CODDOC},${r.CORRELATIVO}</small>
                </td>
                <td>${funciones.setMoneda(r.IMPORTE,'Q')}</td>
            </tr>
            `
        })
        container.innerHTML = str;
    })
    .catch(()=>{
        container.innerHTML = 'No hay datos...';
    })
};


function get_detalle_factura(coddoc,correlativo){

    document.getElementById('tab-tres').click();




};


function get_mapa_embarque(codembarque){

    document.getElementById('tab-cuatro').click();

    document.getElementById('lbEmbarqueMapa').innerText = codembarque;


    cargarMapaClientes(codembarque);


};

// mapa

function showUbicacion(){
    return new Promise((resolve,reject)=>{
        try {
            navigator.geolocation.getCurrentPosition(function (location) {
                console.log(location);
                resolve(location);
            })
        } catch (error) {
            reject();
        }
    })
};

function Lmap(lat,long){

    //INICIALIZACION DEL MAPA            
      var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {center: [lat, long],maxZoom: 20, attribution: osmAttrib});    
      map = L.map('mapcontainer').setView([lat, long], 11).addLayer(osm);

      var userIcon = L.icon({
        iconUrl: '../img/userIcon.png',
        shadowUrl: '../img/marker-shadow.png',
    
        iconSize:     [30, 45], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

      L.marker([lat, long],{icon:userIcon})
        .addTo(map)
        .bindPopup('Mi Ubicación', {closeOnClick: true, autoClose: false})   
        .openPopup()
                
      return map;
};

function cargarMapaClientes(codembarque){
    //carga la ubicación actual y general el mapa
    showUbicacion()
    .then((location)=>{
            let lat = location.coords.latitude.toString();
            let longg = location.coords.longitude.toString();
            //Number(lat),Number(longg));
            clientes_embarque(codembarque,'container_mapa',Number(lat),Number(longg))
            
    });

};


function clientes_embarque(codembarque,idContenedor, lt, lg){

    let container = document.getElementById(idContenedor);
    container.innerHTML = GlobalLoader;
    
    let tbl = `<div class="mapcontainer4" id="mapcontainer"></div>`;        
    
    container.innerHTML = tbl;
    
    let mapcargado = 0;
    var map;
    map = Lmap(lt, lg);

    get_data_documentos_embarque(codembarque)
    .then((response) => {
        const data = response.recordset;

        data.map((rows)=>{
           
                L.marker([rows.LAT, rows.LONG])
                .addTo(map)
                .bindPopup(`${rows.NIT} - ${rows.CLIENTE} <br><small>${rows.DIRECCION}</small><br><small>${funciones.setMoneda(rows.IMPORTE,'Q')}</small>`, {closeOnClick: true, autoClose: true})   
                .on('click', function(e){
                    GlobalMarkerId = Number(e.sourceTarget._leaflet_id);
                    //agregar function 
                })
            
        })

        //RE-AJUSTA EL MAPA A LA PANTALLA
        setTimeout(function () {
            try {
                map.invalidateSize();    
            } catch (error) {
                
            }
        }, 500);

    }, (error) => {
        funciones.AvisoError('Error en la solicitud');
        container.innerHTML = '';
    });
       
}