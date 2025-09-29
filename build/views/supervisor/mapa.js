function getView(){
    let view ={
        gpsventas: ()=>{
            return `
            <div class="row">

                <div id="panel-3" class="panel col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class="panel-hdr">
                        <h2>Ubicación del equipo de ventas</h2>  
                        <div class="panel-toolbar">
                            <button class="btn btn-panel" data-action="panel-collapse" data-toggle="tooltip" data-offset="0,10" data-original-title="Collapse"></button>
                            <button class="btn btn-panel" data-action="panel-fullscreen" data-toggle="tooltip" data-offset="0,10" data-original-title="Fullscreen"></button>          
                        </div>
                    </div>
                    <div class="panel-container">
                        <div class="panel-content">
                            
                            <div class="" id="rootUbicaciones">
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }      
    };

    root.innerHTML = view.gpsventas();

};

function Lmap(lat,long,nombre,telefono,horamin,fecha){
    //INICIALIZACION DEL MAPA            
      var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {center: [lat, long],maxZoom: 20, attribution: osmAttrib});    
      map = L.map('mapcontainer').setView([lat, long], 18).addLayer(osm);

      L.marker([lat, long])
        .addTo(map)
        .bindPopup(`${nombre} -  Updated:${funciones.convertDateNormal(fecha)} - ${horamin}`, {closeOnClick: false, autoClose: false})
        .openPopup()
      return map;
};

async function addListeners(){
         
    await apigen.supervisorStatusGpsVentas('rootUbicaciones');
};


function initView(){
    
    getView();
    addListeners();

};