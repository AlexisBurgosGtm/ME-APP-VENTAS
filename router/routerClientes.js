const execute = require('./connection');
const express = require('express');
const router = express.Router();

function getFechaGuatemalaYmd(dateInput) {
    try {
        const d = dateInput ? new Date(dateInput) : new Date();
        if (isNaN(d.getTime())) throw new Error('invalid date');
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Guatemala',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(d);
    } catch (e) {
        const n = new Date();
        return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
    }
}

function normalizeYmdGuatemala(v) {
    const s = String(v == null ? '' : v).trim();
    const plain = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (plain) return `${plain[1]}-${plain[2]}-${plain[3]}`;
    if (s) {
        const d = new Date(s);
        if (!isNaN(d.getTime())) return getFechaGuatemalaYmd(d);
    }
    return '';
}

function dayBeforeYmd(ymd) {
    const m = String(ymd || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return getFechaGuatemalaYmd();
    const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    d.setUTCDate(d.getUTCDate() - 1);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

function setNoStore(res) {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
}

router.post("/insert_visita", async(req,res)=>{
   
    const { sucursal, codemp, codclie, fecha, hora, motivo, lat, long } = req.body;

    const sede = String(sucursal || '').replace(/'/g, "''");
    const motivoTxt = String(motivo || '').replace(/'/g, "''").trim();
    const fechaSql = normalizeYmdGuatemala(fecha) || getFechaGuatemalaYmd();
    const horaSql = String(hora || '').replace(/'/g, "''");
    const codClieRaw = String(codclie == null ? '' : codclie).trim();
    const codClieEsc = codClieRaw.replace(/'/g, "''");
    const codClieSql = /^\d+$/.test(codClieRaw) ? codClieRaw : `'${codClieEsc}'`;
    const codEmpSql = Number(codemp) || 0;
    const latN = Number(lat);
    const longN = Number(long);
    const latSql = Number.isFinite(latN) ? latN : 0;
    const longSql = Number.isFinite(longN) ? longN : 0;

    // FAXCLIE = resultado de visita en lista (VENTA / CERRADO / NODINERO / BLOQUEADO / PRODUCTO)
    const u = motivoTxt.toUpperCase();
    let stVisita = 'VISITADO';
    if (u.includes('CERRAD')) stVisita = 'CERRADO';
    else if (u.includes('DINERO')) stVisita = 'NODINERO';
    else if (u.includes('PASO') || u.includes('BLOQUE')) stVisita = 'BLOQUEADO';
    else if (u.includes('PRODUCTO')) stVisita = 'PRODUCTO';
    else if (u.includes('VENTA')) stVisita = 'VENTA';

    // 1) Historial de visitas  2) Marca cliente visitado hoy (FECHAINGRESO = LASTSALE en app)
    const qry = `
        INSERT INTO CLIENTES_VISITAS (EMPNIT, CODCLIENTE, FECHA, HORA, CODEMP, MOTIVO, LATITUD, LONGITUD)
        VALUES (
            '${sede}',
            ${codClieSql},
            '${fechaSql}',
            '${horaSql}',
            ${codEmpSql},
            '${motivoTxt}',
            ${latSql},
            ${longSql}
        );

        UPDATE ME_CLIENTES
        SET FECHAINGRESO = '${fechaSql}',
            FAXCLIE = '${stVisita}'
        WHERE CODSUCURSAL = '${sede}'
          AND NITCLIE = '${codClieEsc}';
    `;

    execute.Query(res, qry);
});

/** Lista visitas por rango de fechas (calendario Guatemala). */
router.post("/list_visitas", async (req, res) => {
    setNoStore(res);
    const { sucursal, fechaini, fechafin, codemp } = req.body || {};
    const sede = String(sucursal || '').replace(/'/g, "''");
    let ini = normalizeYmdGuatemala(fechaini);
    let fin = normalizeYmdGuatemala(fechafin);
    const today = getFechaGuatemalaYmd();
    if (!ini) ini = today;
    if (!fin) fin = today;
    if (ini > fin) {
        const tmp = ini; ini = fin; fin = tmp;
    }
    const codEmpN = Number(codemp);
    const filterEmp = Number.isFinite(codEmpN) && codEmpN > 0
        ? `AND V.CODEMP = ${Math.trunc(codEmpN)}`
        : '';

    const qry = `
        SELECT
            CONVERT(varchar(10), V.FECHA, 23) AS FECHA,
            ISNULL(V.HORA, '') AS HORA,
            V.CODCLIENTE,
            ISNULL(C.NOMCLIE, '') AS CLIENTE,
            ISNULL(C.NOMFAC, '') AS NEGOCIO,
            ISNULL(V.MOTIVO, '') AS MOTIVO,
            ISNULL(V.CODEMP, 0) AS CODEMP,
            ISNULL(E.NOMVEN, '') AS EMPLEADO,
            ISNULL(V.LATITUD, 0) AS LAT,
            ISNULL(V.LONGITUD, 0) AS LONG
        FROM CLIENTES_VISITAS V
        LEFT JOIN ME_CLIENTES C
            ON C.CODSUCURSAL = V.EMPNIT
           AND (
                C.NITCLIE = CONVERT(varchar(50), V.CODCLIENTE)
             OR (ISNUMERIC(C.NITCLIE) = 1 AND ISNUMERIC(CONVERT(varchar(50), V.CODCLIENTE)) = 1
                 AND CONVERT(numeric(18,0), C.NITCLIE) = CONVERT(numeric(18,0), V.CODCLIENTE))
           )
        LEFT JOIN ME_VENDEDORES E
            ON E.CODSUCURSAL = V.EMPNIT
           AND E.CODVEN = V.CODEMP
        WHERE V.EMPNIT = '${sede}'
          AND CONVERT(varchar(10), V.FECHA, 23) BETWEEN '${ini}' AND '${fin}'
          ${filterEmp}
        ORDER BY CONVERT(varchar(10), V.FECHA, 23) DESC, V.HORA DESC, V.CODEMP, V.CODCLIENTE
    `;
    execute.Query(res, qry);
});

/**
 * Elimina visita y revierte FECHAINGRESO al día anterior
 * para que el cliente vuelva a pendientes.
 */
router.post("/delete_visita", async (req, res) => {
    setNoStore(res);
    const { sucursal, codclie, fecha, hora, codemp, motivo } = req.body || {};
    const sede = String(sucursal || '').replace(/'/g, "''");
    const fechaSql = normalizeYmdGuatemala(fecha);
    const horaSql = String(hora || '').replace(/'/g, "''");
    const motivoTxt = String(motivo || '').replace(/'/g, "''");
    const codClieRaw = String(codclie == null ? '' : codclie).trim();
    const codClieEsc = codClieRaw.replace(/'/g, "''");
    const codClieSql = /^\d+$/.test(codClieRaw) ? codClieRaw : `'${codClieEsc}'`;
    const codEmpSql = Number(codemp) || 0;
    const fechaAnterior = dayBeforeYmd(fechaSql || getFechaGuatemalaYmd());

    if (!sede || !codClieRaw || !fechaSql) {
        return res.send('error');
    }

    const qry = `
        DELETE FROM CLIENTES_VISITAS
        WHERE EMPNIT = '${sede}'
          AND (
                CODCLIENTE = ${codClieSql}
             OR CONVERT(varchar(50), CODCLIENTE) = '${codClieEsc}'
          )
          AND CONVERT(varchar(10), FECHA, 23) = '${fechaSql}'
          AND ISNULL(HORA, '') = '${horaSql}'
          AND CODEMP = ${codEmpSql}
          AND ISNULL(MOTIVO, '') = '${motivoTxt}';

        UPDATE ME_CLIENTES
        SET FECHAINGRESO = '${fechaAnterior}',
            FAXCLIE = ''
        WHERE CODSUCURSAL = '${sede}'
          AND NITCLIE = '${codClieEsc}';

        SELECT '${fechaAnterior}' AS FECHA_REVERTIDA;
    `;
    execute.Query(res, qry);
});



router.post("/datos_cliente", async(req,res)=>{

    const {sucursal,codclie}  = req.body;
    
    let qry = '';
    qry = `SELECT 
                ME_Clientes.NITCLIE AS CODIGO, 
                ME_Clientes.NITFACTURA AS NIT,
                ME_Clientes.FAXCLIE AS TIPONEGOCIO,
                 ME_Clientes.NOMFAC AS NEGOCIO, 
                ME_Clientes.NOMCLIE, 
                ME_Clientes.DIRCLIE, 
                ME_Municipios.DESMUNI, 
                ME_Clientes.TELCLIE AS TELEFONO, 
                ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
                ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, 
                ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, 
                '' AS STVISITA, 
                ME_Clientes.REFERENCIA, 
                ME_Clientes.VISITA
            FROM ME_Clientes LEFT OUTER JOIN
                ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL 
                AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
            WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
                AND (ME_Clientes.NITCLIE='${codclie}')
           `;
       
    
    execute.Query(res,qry);

})


router.post("/solicitud_cambios_cliente", async(req,res)=>{

    const{sucursal,codclie,nitclie,tiponegocio,negocio,nomclie,dirclie,telefono,referencia,lat,long,fecha} = req.body;

    let qry = `INSERT INTO ME_CENSO_SOLICITUDES (
            CODSUCURSAL, CODCLIE,NITCLIE,TIPONEGOCIO,NEGOCIO,NOMCLIE,DIRCLIE,TELEFONO,REFERENCIA,LAT,LONG,FECHA)
    VALUES ('${sucursal}',${codclie},'${nitclie}','${tiponegocio}','${negocio}','${nomclie}','${dirclie}','${telefono}',
    '${referencia}',${lat},${long},'${fecha}');`
    
 
    
     execute.Query(res,qry);
     

     /*

       const{sucursal,codven,fecha,codclie,nitclie,tiponegocio,negocio,nomclie,dirclie,codmun,coddepto,referencia,obs,telefono,visita,lat,long,sector} = req.body;

    let qry = `INSERT INTO ME_CENSO_SOLICITUDES (
            CODSUCURSAL,   CODVEN,     FECHA, CODCLIE,NITCLIE,TIPONEGOCIO,NEGOCIO,NOMCLIE,DIRCLIE,REFERENCIA,CODMUN,CODDEPTO,OBS,VISITA,LAT,LONG,TELEFONO, STATUS, SECTOR)
    VALUES ('${sucursal}',${codven},'${fecha}',${codclie},'${nitclie}','${tiponegocio}','${negocio}','${nomclie}','${dirclie}','${referencia}','${codmun}','${coddepto}','${obs}','${visita}',${lat},${long},'${telefono}','PENDIENTE','${sector}');`
    

      */
});


router.post("/setreminder", async(req,res)=>{

    const{sucursal,codclie,nit,nombre,direccion,fecha,hora,minuto,recordatorio} = req.body;

    let qry = `INSERT INTO ME_RECORDATORIOS (CODSUCURSAL,CODCLIE,NIT,NOMCLIE,DIRECCION,HORA,MINUTO,FECHA,RECORDATORIO)
     VALUES ('${sucursal}',${codclie},'${nit}','${nombre}','${direccion}',${hora},${minuto},'${fecha}','${recordatorio}');`

     execute.Query(res,qry);
     
});

//CENSO
router.post('/censovendedor',async(req,res)=>{

    const {sucursal,codven,visita} = req.body;
    
    let qry = `SELECT ME_CENSO.ID, ME_CENSO.FECHA, ME_CENSO.CODCLIE, ME_CENSO.NITCLIE, ME_CENSO.TIPONEGOCIO, ME_CENSO.NEGOCIO, ME_CENSO.NOMCLIE, ME_CENSO.DIRCLIE, ISNULL(ME_CENSO.REFERENCIA, 'SN') AS REFERENCIA, ME_CENSO.CODMUN, 
    ME_Municipios.DESMUNI, ME_CENSO.CODDEPTO, ME_Departamentos.DESDEPTO, ISNULL(ME_CENSO.OBS,'SN') AS OBS, ISNULL(ME_CENSO.TELEFONO,'SN') AS TELEFONO, ME_CENSO.VISITA, ME_CENSO.LAT, ME_CENSO.LONG
    FROM ME_CENSO LEFT OUTER JOIN
    ME_Departamentos ON ME_CENSO.CODDEPTO = ME_Departamentos.CODDEPTO AND ME_CENSO.CODSUCURSAL = ME_Departamentos.CODSUCURSAL LEFT OUTER JOIN
    ME_Municipios ON ME_CENSO.CODMUN = ME_Municipios.CODMUNI AND ME_CENSO.CODSUCURSAL = ME_Municipios.CODSUCURSAL
    WHERE (ME_CENSO.CODSUCURSAL = '${sucursal}') AND (ME_CENSO.CODVEN = ${codven}) AND (ME_CENSO.VISITA='${visita}')
    ORDER BY ME_CENSO.ID`;

    execute.Query(res,qry);
    
})

router.post("/listavendedortodos", async(req,res)=>{

    const {app,sucursal,codven}  = req.body;
    
    let qry = '';

  
    
        qry = `SELECT '${sucursal}' AS CODSUCURSAL, ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
        ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, 
        ME_Clientes.FAXCLIE AS TIPONEGOCIO, '' AS STVISITA, ME_Clientes.REFERENCIA, ME_Clientes.VISITA, ME_Clientes.NOMFAC AS NEGOCIO
                FROM ME_Clientes LEFT OUTER JOIN
        ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
                WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
                AND (ME_Clientes.CODVEN = ${codven})
                AND (ME_Clientes.CODCLIE=0)
                ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
       
    
    execute.Query(res,qry);

})
router.post("/descargar_clientes_ruta", async(req,res)=>{

    const {app,sucursal,codven,codruta}  = req.body;
    
    let qry = '';
    qry = `SELECT 
                '${sucursal}' AS CODSUCURSAL, 
                ME_Clientes.NITCLIE AS CODIGO, 
                ME_Clientes.NITFACTURA AS NIT, 
                ME_Clientes.NOMCLIE, 
                ME_Clientes.DIRCLIE, 
                ME_Municipios.DESMUNI, 
                ME_Clientes.TELCLIE AS TELEFONO, 
                ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
                ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, 
                ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, 
                ME_Clientes.FAXCLIE AS TIPONEGOCIO, 
                ISNULL(ME_Clientes.FAXCLIE, '') AS STVISITA, 
                ME_Clientes.REFERENCIA, 
                ME_Clientes.VISITA, 
                ME_Clientes.NOMFAC AS NEGOCIO
            FROM ME_Clientes LEFT OUTER JOIN
                ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL 
                AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
            WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
                AND (ME_Clientes.CODCLIE=0)
                AND (ME_Clientes.CODRUTA=${codruta})
            ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
       
    
    execute.Query(res,qry);

})

router.post("/listavendedor", async(req,res)=>{

    const {app,sucursal,codven,dia}  = req.body;
    let qry = '';

    if (dia=='OTROS'){
        qry = `SELECT ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
        ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, ME_Clientes.FAXCLIE AS STVISITA, ME_Clientes.REFERENCIA
                FROM ME_Clientes LEFT OUTER JOIN
        ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
                WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}')  
                AND (ME_Clientes.CODVEN = ${codven})
                AND (ME_Clientes.CODCLIE=0)
                ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
    
    }else{
        qry = `SELECT ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
        ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, ME_Clientes.FAXCLIE AS STVISITA, ME_Clientes.REFERENCIA
                FROM ME_Clientes LEFT OUTER JOIN
        ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
                WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
                AND (ME_Clientes.VISITA = '${dia}') 
                AND (ME_Clientes.CODVEN = ${codven})
                AND (ME_Clientes.CODCLIE=0)
                ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`;
    
    }

    
    
    execute.Query(res,qry);

})

router.post("/listaajenosvendedor", async(req,res)=>{

    const {app,sucursal,filtro}  = req.body;

    let qry = '';
    qry = `SELECT TOP 30 ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Municipios.DESMUNI, ME_Clientes.TELCLIE AS TELEFONO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, 
    ISNULL(ME_Clientes.LONGITUD, 0) AS LONG, ISNULL(ME_Clientes.FECHAINGRESO,'2020-04-15') AS LASTSALE, ME_Clientes.REFERENCIA,
    ME_Clientes.FAXCLIE AS TIPONEGOCIO, '' AS STVISITA, ME_Clientes.REFERENCIA, ME_Clientes.VISITA, ME_Clientes.NOMFAC AS NEGOCIO
            FROM ME_Clientes LEFT OUTER JOIN
    ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
            WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') 
            AND (CONCAT(ME_Clientes.NOMFAC,'-',ME_Clientes.NOMCLIE) LIKE '%${filtro}%') 
            AND (ME_Clientes.CODCLIE=0) 
            OR
            (ME_Clientes.CODSUCURSAL = '${sucursal}') 
            AND (ME_Clientes.NITCLIE= '${filtro}') 
            AND (ME_Clientes.CODCLIE=0)
            ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.NOMCLIE`
    
    execute.Query(res,qry);

})

//LISTADO DE CLIENTES POR SUCURSAL
router.post('/clientesvendedor',async(req,res)=>{

    const {sucursal,codven} = req.body;
    
    let qry = `SELECT ME_Clientes.NITCLIE AS CODIGO, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Clientes.CODMUNI, ME_Municipios.DESMUNI, ME_Clientes.CODDEPTO, ME_Departamentos.DESDEPTO, 
    ME_Clientes.TELCLIE AS TELEFONO, ME_Clientes.CODVEN, ME_Vendedores.NOMVEN, ME_Clientes.LATITUD AS LAT, ME_Clientes.LONGITUD AS LONG, ME_Clientes.VISITA, ME_Clientes.CODCLIE AS ACTIVO, 
    ME_Clientes.CODSUCURSAL, ME_Clientes.FECHAINGRESO AS LASTSALE
        FROM            ME_Clientes LEFT OUTER JOIN
    ME_Vendedores ON ME_Clientes.CODVEN = ME_Vendedores.CODVEN AND ME_Clientes.CODSUCURSAL = ME_Vendedores.CODSUCURSAL LEFT OUTER JOIN
    ME_Departamentos ON ME_Clientes.CODSUCURSAL = ME_Departamentos.CODSUCURSAL AND ME_Clientes.CODDEPTO = ME_Departamentos.CODDEPTO LEFT OUTER JOIN
    ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
    WHERE (ME_Clientes.CODSUCURSAL = '${sucursal}') AND (ME_Clientes.CODVEN=${codven})
    ORDER BY ME_Clientes.FECHAINGRESO,ME_Clientes.VISITA,ME_Clientes.NOMCLIE`;

    execute.Query(res,qry);
    
})

//ESTABLECE LA FECHA DE ULTIMA VENTA DEL CLIENTE
router.post('/lastsale',async(req,res)=>{
    const {sucursal,nitclie,fecha,visita} = req.body;

    //FAXCLIE= SERÁ USADO PARA INDICAR EL RESULTADO DE LA VISITA: VENTA,NODINERO,CERRADO
    let qry = `UPDATE ME_CLIENTES SET FECHAINGRESO='${fecha}',FAXCLIE='${visita}' WHERE CODSUCURSAL='${sucursal}' AND NITCLIE='${nitclie}' `;

    execute.Query(res,qry);

})

//DESACTIVA EL CLIENTE CAMBIANDO EL CAMPO CODCLIE DE 0 A 1
router.put('/desactivar',async(req,res)=>{
    const {sucursal,nitclie} = req.body;
    
    let qry = `UPDATE ME_CLIENTES SET CODCLIE=1 WHERE CODSUCURSAL='${sucursal}' AND NITCLIE='${nitclie}' `;

    execute.Query(res,qry);

})

//RE-ACTIVA EL CLIENTE CAMBIANDO EL CAMPO CODCLIE DE 1 A 0
router.put('/reactivar',async(req,res)=>{
    const {sucursal,nitclie} = req.body;
    
    let qry = `UPDATE ME_CLIENTES SET CODCLIE=0 WHERE CODSUCURSAL='${sucursal}' AND NITCLIE='${nitclie}' `;

    execute.Query(res,qry);

})


// BUSCA CLIENTE POR NOMBRE
router.get("/buscarcliente", async(req,res)=>{
    const {app,empnit,filtro} = req.query;
        
    let qry ='';

            qry = `SELECT ME_Clientes.NITCLIE AS CODCLIE, ME_Clientes.NITFACTURA AS NIT, ME_Clientes.NOMCLIE, ME_Clientes.DIRCLIE, ME_Clientes.CODMUNI AS CODMUNICIPIO, ME_Municipios.DESMUNI AS DESMUNICIPIO, 
            ME_Clientes.CODDEPTO, ME_Departamentos.DESDEPTO, ME_Clientes.LISTA AS PRECIO, 0 AS SALDO, ISNULL(ME_Clientes.LATITUD, 0) AS LAT, ISNULL(ME_Clientes.LONGITUD, 0) AS LONG
            FROM ME_Clientes LEFT OUTER JOIN
            ME_Municipios ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI LEFT OUTER JOIN
            ME_Departamentos ON ME_Clientes.CODSUCURSAL = ME_Departamentos.CODSUCURSAL AND ME_Clientes.CODDEPTO = ME_Departamentos.CODDEPTO
        WHERE (ME_Clientes.CODSUCURSAL = '${app}') 
        AND (ME_Clientes.NOMCLIE LIKE '%${filtro}%')
        `     
    
    execute.Query(res,qry);

});

// BUSCA CLIENTE PARA COTIZACIONES (NIT, nombre, negocio)
router.get("/buscarcliente_cotizacion", async(req,res)=>{
    const {app, filtro} = req.query;
    const sede = String(app || '').replace(/'/g, "''");
    const q = String(filtro || '').replace(/'/g, "''").trim();

    const qry = `
        SELECT TOP 50
            ME_Clientes.NITCLIE AS CODCLIE,
            ME_Clientes.NITFACTURA AS NIT,
            ME_Clientes.NOMCLIE,
            ISNULL(ME_Clientes.NOMFAC, '') AS NEGOCIO,
            ME_Clientes.DIRCLIE,
            ISNULL(ME_Municipios.DESMUNI, '') AS DESMUNICIPIO
        FROM ME_Clientes
        LEFT OUTER JOIN ME_Municipios
            ON ME_Clientes.CODSUCURSAL = ME_Municipios.CODSUCURSAL
           AND ME_Clientes.CODMUNI = ME_Municipios.CODMUNI
        WHERE ME_Clientes.CODSUCURSAL = '${sede}'
          AND (
                ME_Clientes.NITFACTURA LIKE '%${q}%'
             OR ME_Clientes.NITCLIE LIKE '%${q}%'
             OR ME_Clientes.NOMCLIE LIKE '%${q}%'
             OR ME_Clientes.NOMFAC LIKE '%${q}%'
          )
        ORDER BY ME_Clientes.NOMCLIE
    `;

    execute.Query(res, qry);
});

// AGREGA UN NUEVO CLIENTE
router.post("/clientenuevo", async(req,res)=>{
    const {app,fecha,codven,empnit,codclie,nitclie,nomclie,nomfac,dirclie,coddepto,codmunicipio,codpais,telclie,emailclie,codbodega,tipoprecio,lat,long} = req.body;
    
    let qry ='';

    
            qry = `INSERT INTO ME_CLIENTES (
                EMP_NIT, NITCLIE, CODCLIE, NOMCLIE, DIRCLIE,
                CODDEPTO, CODMUNI, TELCLIE, EMAILCLIE, TIPOCLIE,
                ACEPTACHEQUE, FECHAINGRESO, NITFACTURA, CODVEN, LIMITECREDITO,
                DIASCREDITO, CODPAIS, NOMFAC, CODBODEGA, DESCUENTO,
                CODTIPOCLIE, COMISION, IMPUESTO1, TEMPORADACREDITO, TEMPORADADIAS,
                VENTADOLARES, VENTAEXPORTA, MONTOIVARET, PORIVARET, CODTIPOFP,
                UTILIZAPUNTOS, TIPOPUNTOS, NCUOTAS, VARIASLISTAS, DIASPRIMERCUOTA,
                DIASCUOTAS, CALCULOCUOTAS, CLIE_CARGOAUT, TIPO_CARGOAUT, LATITUDCLIE, LONGITUDCLIE,
                LATITUD, LONGITUD
            )VALUES(
                '${empnit}','${codclie}',0,'${nomclie}','${dirclie}',
                '${coddepto}','${codmunicipio}','${telclie}','${emailclie}','${tipoprecio}',
                0,'${fecha}','${nitclie}','${codven}',0,
                30,'${codpais}','${nomfac}','${codbodega}',0,
                'A',0,0,0,0,
                0,0,0,0,0,
                0,'NUNCA',0,0,0,
                0,0,0,0,0,0,
                '${lat}','${long}'
            )`         
    
    execute.Query(res,qry);

});

//LISTADO DE MUNICIPIOS EN EL SISTEMA
router.get("/municipios", async(req,res)=>{
    const {app,empnit} = req.query;
    let qry ='';

    qry = `SELECT CODMUNI AS CODMUNICIPIO, DESMUNI AS DESMUNICIPIO FROM ME_MUNICIPIOS WHERE CODSUCURSAL='${app}' ORDER BY PRIMERO DESC`         

    execute.Query(res,qry);
});

//LISTADO DE MUNICIPIOS EN EL SISTEMA
router.get("/departamentos", async(req,res)=>{
    const {app,empnit} = req.query;
    let qry ='';

    qry = `SELECT CODDEPTO, DESDEPTO FROM ME_DEPARTAMENTOS WHERE CODSUCURSAL='${app}' ORDER BY PRIMERO DESC`         

    execute.Query(res,qry);
    
});


router.post("/municipios", async(req,res)=>{
    const {sucursal} = req.body;
    let qry ='';

    qry = `SELECT CODMUNI, DESMUNI FROM ME_MUNICIPIOS WHERE CODSUCURSAL='${sucursal}' ORDER BY PRIMERO DESC`         

    execute.Query(res,qry);
});

//LISTADO DE MUNICIPIOS EN EL SISTEMA
router.post("/departamentos", async(req,res)=>{
    const {sucursal} = req.body;
    let qry ='';

    qry = `SELECT CODDEPTO, DESDEPTO FROM ME_DEPARTAMENTOS WHERE CODSUCURSAL='${sucursal}' ORDER BY PRIMERO DESC`         

    execute.Query(res,qry);
    
});



module.exports = router;
