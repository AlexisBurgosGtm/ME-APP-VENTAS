function getView(){
    let view ={
        gpsventas: ()=>{
            return `
            <div class="supervisor-page">
                <div class="supervisor-card p-0 overflow-hidden">
                    <div class="panel-hdr px-3 py-2">
                        <h2 class="supervisor-title mb-0">Ubicación del equipo de ventas</h2>
                        <div class="panel-toolbar">
                            <button class="btn btn-panel" data-action="panel-collapse" data-toggle="tooltip" data-offset="0,10" data-original-title="Collapse"></button>
                            <button class="btn btn-panel" data-action="panel-fullscreen" data-toggle="tooltip" data-offset="0,10" data-original-title="Fullscreen"></button>
                        </div>
                    </div>
                    <div class="p-2" id="rootUbicaciones"></div>
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