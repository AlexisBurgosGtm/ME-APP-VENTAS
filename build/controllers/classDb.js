const DbName = "mercadosefectivos_db_01";
const DbName_config = "mercadosefectivos_config";

var tblDocumentos = {
    name: 'documentos',
    columns: {
        ID:{ primaryKey: true, autoIncrement: true },
        CODSUCURSAL:{dataType: "string"},
        EMPNIT:{dataType: "string"},
        CODDOC:{dataType: "string"},
        ANIO:{dataType: "number"},
        MES:{dataType: "number"},
        DIA:{dataType: "number"},
        FECHA:{dataType: "string"},
        FECHAENTREGA:{dataType: "string"},
        FORMAENTREGA:{dataType: "string"},
        NITCLIE:{dataType: "string"},
        CODCLIE:{dataType: "string"},
        NOMCLIE:{dataType: "string"},
        DIRCLIE:{dataType: "string"},
        TOTALCOSTO:{dataType: "number"},
        TOTALPRECIO:{dataType: "number"},
        DIRENTREGA:{dataType: "string"},
        OBS:{dataType: "string"},
        USUARIO:{dataType: "string"},
        CODVEN:{dataType: "number"},
        LAT:{dataType: "string"},
        LONG:{dataType: "string"},
        JSONPRODUCTOS:{dataType: "string"}
    }
};

var tblProductos = {
    name: 'productos',
    columns: {
        ID:{ primaryKey: true, autoIncrement: true },
        CODSUCURSAL:{dataType: "string"},
        CODPROD:{dataType: "string"},
        DESPROD:{dataType: "string"},
        CODMEDIDA:{dataType: "string"},
        EQUIVALE:{dataType: "number"},
        COSTO:{dataType: "number"},
        PRECIO:{dataType: "number"},
        PRECIOA:{dataType: "number"},
        PRECIOB:{dataType: "number"},
        PRECIOC:{dataType: "number"},
        DESMARCA:{dataType: "string"},
        EXENTO:{dataType: "number"},
        EXISTENCIA:{dataType: "number"},
        DESPROD3:{dataType: "string"},
        CODUPDATE:{dataType: "string"}
    }
};

var tblMunicipios = {
    name: 'municipios',
    columns: {
        CODMUNI:{dataType: "string"},
        DESMUNI:{dataType: "string"}
    }
};

var tblDepartamentos = {
    name: 'departamentos',
    columns: {
        CODDEPTO:{dataType: "string"},
        DESDEPTO:{dataType: "string"}
    }
};

var tblClientes = {
    name: 'clientes',
    columns: {
        ID:{ primaryKey: true, autoIncrement: true },
        CODSUCURSAL:{dataType: "string"},
        CODIGO:{dataType: "string"},
        DESMUNI:{dataType: "string"},
        DIRCLIE:{dataType: "string"},
        LASTSALE:{dataType: "string"},
        LAT:{dataType: "string"},
        LONG:{dataType: "string"},
        NIT:{dataType: "string"},
        NOMCLIE:{dataType: "string"},
        REFERENCIA:{dataType: "string"},
        STVISITA:{dataType: "string"},
        VISITA:{dataType: "string"},
        TELEFONO:{dataType: "string"},
        TIPONEGOCIO:{dataType:"string"},
        NEGOCIO:{dataType:"string"},
        CODRUTA:{dataType:"number"}
    }
};

var tblTempventas = {
    name: 'tempventa',
    columns: {
        ID:{ primaryKey: true, autoIncrement: true },
        CODSUCURSAL:{dataType: "string"},
        EMPNIT:{dataType: "string"},
        CODDOC:{dataType: "string"},
        CODPROD:{dataType: "string"},
        DESPROD:{dataType: "string"},
        CODMEDIDA:{dataType: "string"},
        EQUIVALE:{dataType: "number"},
        CANTIDAD:{dataType: "number"},
        TOTALUNIDADES:{dataType: "number"},
        COSTO:{dataType: "number"},
        PRECIO:{dataType: "number"},
        TOTALCOSTO:{dataType: "number"},
        TOTALPRECIO:{dataType: "number"},       
        EXENTO:{dataType: "number"},
        USUARIO:{dataType: "string"},
        TIPOPRECIO:{dataType: "string"},
        EXISTENCIA:{dataType: "number"}
    }
};

var tblCredenciales = {
    name: 'credenciales',
    columns: {
        ID:{ primaryKey: true, autoIncrement: true },
        CODSUCURSAL:{dataType: "string"},
        USUARIO:{dataType: "string"},
        PASS:{dataType: "string"},
        NIVEL:{dataType: "string"},
        DAYUPDATED:{dataType: "number"},
        CODUPDATE:{dataType: "string"}
    }

};

var tempcenso = {
    name: "tempcenso",
    columns: { 
        ID: {primaryKey: true, autoIncrement: true},
        CODSUCURSAL: {dataType: "string" },
        CODVEN: {dataType: "number" },
        FECHA: {dataType: "string" },
        CODCLIE: {dataType: "number" },
        NITCLIE: {dataType: "string" },
        TIPONEGOCIO: {dataType: "string"},
        NEGOCIO: {dataType: "string"},
        NOMCLIE: {dataType: "string"},
        REFERENCIA: {dataType: "string"},
        CODMUNI: {dataType: "string"},
        CODDEPTO: {dataType: "string"},
        OBS: {dataType: "string"},
        TELEFONO: {dataType: "string"},
        VISITA: {dataType: "string"},
        LAT: {dataType: "number" },
        LONG: {dataType: "number" },
        SECTOR: {dataType: "string"}
    }
};


var database = {
    name: DbName,
    tables: [tblDocumentos,tblProductos,tblClientes,tblTempventas,tblCredenciales,tempcenso,tblMunicipios,tblDepartamentos]
};

//-------------------------------------

var tbl_config = {
    name: 'config',
    columns: {
        CODIGO:{primaryKey: true,dataType: "number"},
        DESCRIPCION:{dataType: "string"},
        VALOR:{dataType: "string"}
    }
};

var database_config = {
    name: DbName_config,
    tables: [tbl_config]
};
 
// initiate jsstore connection
var connection = new JsStore.Connection();
var connection_config = new JsStore.Connection();

async function connectDb(){
   
        var isDbCreated = await connection.initDb(database);
        // isDbCreated will be true when database will be initiated for first time
        if(isDbCreated){
            //alert('Db Created & connection is opened');
           
        }
        else{
            //alert('Connection is opened');
          
        }
    
}

async function connectDb_config(){
   
    var isDbCreatedOld = await connection_config.initDb(database_config);
    // isDbCreated will be true when database will be initiated for first time
    if(isDbCreatedOld){
        //alert('Db Created & connection is opened');
       
    }
    else{
        //alert('Connection is opened');
      console.log('db configuraciones...')
    }


    //INSERTA LOS VALORES INICIALES
    let datos = [{ID:1,DESCRIPCION:"INICIA EN MAPA O CLIENTES",VALOR:"CLIENTES"}]

    connection_config.insert({
            into: "config",
            values: [datos], //you can insert multiple values at a time
    })
    .then(()=>{
            console.log('db configuraciones')  
    })
    .catch(()=>{
            console.log('db config no inserto datos iniciales')
    })


}
//inicia la conexión a la db
connectDb();

connectDb_config(); //conecta a la versión vieja de la base de datos