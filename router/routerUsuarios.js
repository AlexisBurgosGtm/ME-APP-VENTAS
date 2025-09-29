const execute = require('./connection');
const express = require('express');
const router = express.Router();

// ELIMINA UN USUARIOS
router.post("/updatepass", async(req,res)=>{
    
    const {sucursal, codven, nuevaclave} = req.body;
        
    let qry =''; 
    qry = `UPDATE ME_USUARIOS
            SET PASS='${nuevaclave}'
            WHERE CODSUCURSAL='${sucursal}'AND CODUSUARIO=${codven};`;     
    
      
    execute.Query(res, qry);

    
});


// OBTIENE LOS USUARIOS DE UN DETERMINADO TIPO
router.post("/listado", async(req,res)=>{
    
    const {sucursal,tipo} = req.body;
    
    let qry ='';

    if(tipo=='GERENTE'){
        qry = `SELECT ID,CODUSUARIO as CODIGO,NOMBRE AS USUARIO,PASS AS CLAVE,TELEFONO,CODDOC FROM ME_USUARIOS WHERE CODSUCURSAL='${sucursal}' `;     
    }else{
        qry = `SELECT ID,CODUSUARIO as CODIGO,NOMBRE AS USUARIO,PASS AS CLAVE,TELEFONO,CODDOC FROM ME_USUARIOS WHERE CODSUCURSAL='${sucursal}'AND TIPO='${tipo}'`;     
    }
        
    execute.Query(res,qry);

});




// ELIMINA UN USUARIOS
router.post("/eliminar", async(req,res)=>{
    
    const {sucursal,id, codven,tipo} = req.body;
        
    let qry =''; let qryVendedor = '';

    qry = `DELETE FROM ME_USUARIOS WHERE CODSUCURSAL='${sucursal}'AND ID=${id};`;     
    
    if(tipo=='VENDEDOR'){
        qryVendedor = `DELETE FROM ME_VENDEDORES WHERE CODSUCURSAL='${sucursal}' AND CODVEN=${codven};`
    };
    
    execute.Query(res, qry + qryVendedor);

});

// NUEVO USUARIO
router.post("/nuevo", async(req,res)=>{
    
    const {sucursal,tipo,codusuario,usuario,clave,coddoc,telefono} = req.body;
        
    
    let qry ='';let qryV ='';

    qry = `INSERT INTO ME_USUARIOS 
        (CODUSUARIO,NOMBRE,PASS,TIPO,TELEFONO,CODDOC,CODSUCURSAL) VALUES
        (${codusuario},'${usuario}','${clave}','${tipo}','${telefono}','${coddoc}','${sucursal}');`;     
    
    if(tipo=='VENDEDOR'){
        qryV = `INSERT INTO ME_VENDEDORES 
        (EMP_NIT,CODVEN,NOMVEN,ACTIVO,CODDOC,CODSUCURSAL) VALUES
        ('1034261-3',${codusuario},'${usuario}','SI','${coddoc}','${sucursal}');`;    
    };

    

    execute.Query(res,qry + qryV);

});

// EDITA EL USUARIO
router.post("/editar", async(req,res)=>{
    
    const {id,sucursal,tipo,codusuario,usuario,clave,coddoc,telefono} = req.body;
        
    let qry =''; let qryV ='';

    qry = `UPDATE ME_USUARIOS SET 
            CODUSUARIO=${codusuario},
            NOMBRE='${usuario}',
            PASS='${clave}',
            TIPO='${tipo}',
            TELEFONO='${telefono}',
            CODDOC='${coddoc}'
            WHERE ID=${id} AND CODSUCURSAL='${sucursal}';`;     

            if(tipo=='VENDEDOR'){
                qryV = `UPDATE ME_VENDEDORES SET NOMVEN='${usuario}', CODDOC='${coddoc}' WHERE CODSUCURSAL='${sucursal}' AND CODVEN=${codusuario};`
            }
    
  
    execute.Query(res,qry + qryV);

});




router.post("/listado_supervisor", async(req,res)=>{
    
    const {sucursal} = req.body;
    
    let qry ='';
    qry = `SELECT ID,CODUSUARIO as CODIGO,NOMBRE AS USUARIO,PASS AS CLAVE,TELEFONO,CODDOC,TIPO 
            FROM ME_USUARIOS 
            WHERE CODSUCURSAL='${sucursal}'AND TIPO IN('VENDEDOR','SUPERVISOR'); `;     
  
        
    execute.Query(res,qry);

});


router.post("/update_clave", async(req,res)=>{
    
    const {codigo,sucursal,nuevaclave} = req.body;
        
    let qry ='';

    qry = `UPDATE ME_USUARIOS 
            SET 
            PASS='${nuevaclave}'
            WHERE ID=${codigo} AND CODSUCURSAL='${sucursal}';`;     

          
  
    execute.Query(res,qry );

});

router.post("/update_usuario", async(req,res)=>{
    
    const {codigo,sucursal,nuevousuario} = req.body;
        
    let qry ='';

    qry = `UPDATE ME_USUARIOS 
            SET 
            NOMBRE='${nuevousuario}'
            WHERE ID=${codigo} AND CODSUCURSAL='${sucursal}';`;     

            
          
  
    execute.Query(res,qry );

});


module.exports = router;