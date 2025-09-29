function getView(){
    let view ={
        body:()=>{
            return `
                <div class="col-12 p-0 bg-white">
                    <div class="tab-content" id="myTabHomeContent">
                        <div class="tab-pane fade show active" id="uno" role="tabpanel" aria-labelledby="receta-tab">
                                ${view.vista_listado()}
                        </div>
                        <div class="tab-pane fade" id="dos" role="tabpanel" aria-labelledby="home-tab">
                                ${view.vista_detalle()}
                        </div>
                        <div class="tab-pane fade" id="tres" role="tabpanel" aria-labelledby="home-tab">
                                
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
                    </ul>
                </div>
               
            `
        },
        vista_listado:()=>{
            return `
            <div class="card card-rounded shadow col-12 p-2">
                <div class="card-body">

                    <div class="row">
                        <div class="col-6">
                           
                        </div>
                        <div class="col-6">
                            <label class="negrita">Precios Descargados:</label>
                            <button class="btn btn-sm btn-info btn-circle" id="btnDescargarP"><i class="fal fa-download"></i></button>
                            <h5 class="negrita text-danger" id="lbTotalProductos">0</h5>
                        </div>    
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label class="negrita">Búsqueda de productos</label>
                                <div class="input-group">
                                    <input type="text" id="txtBuscar" class="form-control border-info text-info" placeholder="Escriba para buscar...">
                                    
                                    <select class="form-control border-info negrita text-danger" id="cmbTipoPrecio">
                                        <option value="P">DETALLE (C)</option>
                                        <option value="C">PRECIO B</option>
                                        <option value="B">PRECIO A</option>
                                        <option value="A">MAYORISTA</option>
                                    </select>

                                    <button class="btn btn-info hand" id="btnBuscar">
                                        <i class="fal fa-search"></i>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <table class="table table-responsive table-striped table-hover col-12">
                            <thead class="bg-secondary text-white">
                                <tr>
                                    <td>Producto</td>
                                    <td>Precio</td>                         
                                    <td>Existencia</td>
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="tblResultadoBusqueda">
                            

                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
            `
        },
        vista_detalle:()=>{
            return `

            <div class="card card-rounded shadow col-12 p-2">
                <div class="card-body">


                
                </div>
            </div>

            
            <button class="btn btn-bottom-left btn-circle btn-hand btn-secondary btn-xl shadow" onclick="document.getElementById('tab-uno').click()">
                <i class="fal fa-arrow-left"></i>
            </button>
            `
        }
    };

    root.innerHTML = view.body();

};


async function addListeners(){
         
    updateDateDownload();


    // OBTIENE EL TOTAL DE PRODUCTOS DESCARGADOS
    try {
        getTotalProductos('lbTotalProductos');
    } catch (error) {
        
    };


    // DESCARGA LA ÚLTIMA VERSIÓN DE PRODUCTOS Y PRECIOS
    apigen.config_get_codupdate(GlobalCodSucursal)
    .then((code)=>{
        SelectedCodUpdate = code;
        selectDateDownload().then(()=>{
                if(SelectedCodUpdate.toString()==SelectedLocalCodUpdate.toString()){
                    funciones.showToast('Su catálogo de precios está actualizado')
                }else{
                    funciones.showToast('Catálogo de precios desactualizado, iniciando descarga');
                    btnDescargarP.disabled = true;
                    btnDescargarP.innerHTML = `<i class="fal fa-sync fa-spin"></i>`;
    
                    downloadProductos()
                    .then((data)=>{
                        funciones.showToast(`Productos descargados, guardándolos localmente`);
                        deleteProductos()
                        .then(()=>{
                            let contador = 1;
                            let totalrows = Number(data.rowsAffected[0]);
                              
                            data.recordset.map(async(rows)=>{
                                var datosdb = {
                                    CODSUCURSAL:rows.CODSUCURSAL,
                                    CODPROD:rows.CODPROD,
                                    DESPROD:rows.DESPROD,
                                    CODMEDIDA:rows.CODMEDIDA,
                                    EQUIVALE:rows.EQUIVALE,
                                    COSTO:rows.COSTO,
                                    PRECIO:rows.PRECIO,
                                    PRECIOA:rows.PRECIOA,
                                    PRECIOB:rows.PRECIOB,
                                    PRECIOC:rows.PRECIOC,
                                    DESMARCA:rows.DESMARCA,
                                    EXENTO:rows.EXENTO,
                                    EXISTENCIA:rows.EXISTENCIA,
                                    DESPROD3:rows.DESPROD3
                                }                
                                var noOfRowsInserted = await connection.insert({
                                    into: "productos",
                                    values: [datosdb], //you can insert multiple values at a time
                                });
                                if (noOfRowsInserted > 0) {
                                    let porc = (Number(contador) / Number(totalrows)) * 100;
                                    //setLog(`<label>Productos agregados: ${contador} de ${totalrows} (${porc.toFixed(2)}%)</label>`,'rootWait')
                                    contador += 1;
                                    if(totalrows==contador){
                                       
                                        funciones.Aviso('Productos descargados exitosamente!!');
                                       
                                        btnDescargarP.disabled = false;
                                        btnDescargarP.innerHTML = `<i class="fal fa-download"></i>`;
    
                                        try {
                                            getTotalProductos('lbTotalProductos');
                                        } catch (error) {
                                            
                                        }
                                    }
                                }
                            });
                        })
                        .catch(()=>{
                          
                           funciones.AvisoError('No se pudieron eliminar los productos previos');
                           btnDescargarP.disabled = false;
                           btnDescargarP.innerHTML = `<i class="fal fa-download"></i>`;
    
                        })
                    })
                    .catch(()=>{
                       
                        funciones.AvisoError('No se pudieron descargar los productos');
                        btnDescargarP.disabled = false;
                        btnDescargarP.innerHTML = `<i class="fal fa-download"></i>`;
    
                    })

                }
        });
        //console.log('downloaded: ' + SelectedCodUpdate);
        //console.log('local: ' + SelectedLocalCodUpdate);
    })
    .catch(()=>{SelectedCodUpdate='NOCODE'});
    



    document.getElementById('txtBuscar').addEventListener('keyup',(e)=>{
        if(e.code=='Enter'){
            fcnBusquedaProducto('txtBuscar','tblResultadoBusqueda','cmbTipoPrecio');
        }
        if(e.code=='NumpadEnter'){
            fcnBusquedaProducto('txtBuscar','tblResultadoBusqueda','cmbTipoPrecio');
        }
    });

    document.getElementById('btnBuscar').addEventListener('click',()=>{
        fcnBusquedaProducto('txtBuscar','tblResultadoBusqueda','cmbTipoPrecio');
    });




};


function initView(){
    
    getView();
    addListeners();

};


function fcnBusquedaProducto(idFiltro,idTablaResultado,idTipoPrecio){
    
    let cmbTipoPrecio = document.getElementById(idTipoPrecio);

    let filtro = document.getElementById(idFiltro).value;
    
    let tabla = document.getElementById(idTablaResultado);
    tabla.innerHTML = GlobalLoader;


    let str = ""; 

    selectProducto(filtro)
    .then((response) => {
        const data = response;
        //con esta variable determino el tipo de precio a usar            
        let pre = 0;
            
            data.map((rows)=>{
                let exist = Number(rows.EXISTENCIA)/Number(rows.EQUIVALE); let strC = '';
                if(Number(rows.EXISTENCIA<=0)){strC='text-danger'}else{strC='text-success'};
                let totalexento = 0;
                if (rows.EXENTO==1){totalexento=Number(rows.PRECIO)}
                
                switch (cmbTipoPrecio.value) {
                    case 'P':
                        pre = Number(rows.PRECIO)
                        break;
                    case 'C':
                        pre = Number(rows.PRECIOC)
                        break;
                    case 'B':
                        pre = Number(rows.PRECIOB)
                        break;
                    case 'A':
                        pre = Number(rows.PRECIOA)
                        break;
                }

                str += `<tr id="${rows.CODPROD}" onclick="getDataMedidaProducto('${rows.CODPROD}','${funciones.quitarCaracteres(rows.DESPROD,'"'," plg",true)}','${rows.CODMEDIDA}',1,${rows.EQUIVALE},${rows.EQUIVALE},${rows.COSTO},${pre},${totalexento},${Number(rows.EXISTENCIA)});" class="border-bottom">
                <td >
                    ${funciones.quitarCaracteres(rows.DESPROD,'"'," pulg",true)}
                    <br>
                    <small class="text-danger"><b>${rows.CODPROD}</b></small><small class="text-info">//Escala:${rows.DESPROD3}</small>
                    <br>
                    <b class"bg-danger text-white">${rows.CODMEDIDA}</b>
                    <small>(${rows.EQUIVALE})</small>
                </td>
                <td>${funciones.setMoneda(pre || 0,'Q ')}</td>
                <td>
                    <b class="${strC}">${funciones.setMoneda(exist,'')}</b>
                </td>
                <td>
                    <button class="btn btn-sm btn-info btn-circle text-white" 
                    onclick="get_data_producto('${rows.CODPROD}')">
                        <i class="fal fa-shopping-cart"></i>
                    </button>
                </td>
            </tr>`
            })
            tabla.innerHTML= str;
        
    }, (error) => {
        console.log(error);
        tabla.innerHTML ='<label>Debe descargar los productos al menos una vez al día.. Descárguelos nuevamente por favor.</label>';
    })
    .catch((error)=>{
        //funciones.AvisoError(error);
        tabla.innerHTML ='<label>Debe descargar los productos al menos una vez al día.. Descárguelos nuevamente por favor.</label>';
    })




};



function get_data_producto(codprod){

    document.getElementById('tab-dos').click();



};