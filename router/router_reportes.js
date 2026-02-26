const execute = require('./connection');
const express = require('express');
const router = express.Router();

router.post("/rpt_fechas", async(req,res)=>{

    const{sucursal,codemp,mes,anio} = req.body;

    let qry = `
            SELECT   
                FECHA, SUM(VENTA) AS VENTA, SUM(DEVOLUCION * -1) AS DEVOLUCION
            FROM rpt_data_venta_vendedor
            WHERE 
                (MES = ${mes}) AND 
                (ANIO = ${anio}) AND 
                (CODSUCURSAL = '${sucursal}') AND 
                (CODVEN = ${codemp})
            GROUP BY FECHA
            ORDER BY FECHA
    `

    
     execute.query_bi(res,qry);
     
});


router.post("/rpt_fecha_movimientos", async(req,res)=>{

    const{sucursal,codemp,fecha} = req.body;

    let qry = `
        SELECT 
            TIPO, FECHA, 
            CODDOC, CORRELATIVO, 
            NOMBRECLIENTE AS CLIENTE, 
            SUM(TOTALPRECIO) AS IMPORTE
        FROM BI_RPT_GENERAL
        WHERE 
            (CODSUCURSAL = '${sucursal}') AND 
            (CODVEN = ${codemp})
        GROUP BY TIPO, FECHA, CODDOC, CORRELATIVO, NOMBRECLIENTE
        HAVING (FECHA = '${fecha}')
        `

    
     execute.query_bi(res,qry);
     
});



module.exports = router;

