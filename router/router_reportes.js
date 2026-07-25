const execute = require('./connection');
const express = require('express');
const router = express.Router();

function esc(value) {
    return (value == null ? '' : value).toString().replace(/'/g, "''");
}

function toNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

// Ventas / devoluciones por día (tabla rpt_data_venta_vendedor)
router.post('/rpt_fechas', async (req, res) => {
    const { sucursal, codemp, mes, anio } = req.body;

    const qry = `
        SELECT
            FECHA,
            SUM(VENTA) AS VENTA,
            SUM(DEVOLUCION * -1) AS DEVOLUCION
        FROM rpt_data_venta_vendedor
        WHERE (MES = ${toNumber(mes, 0)})
          AND (ANIO = ${toNumber(anio, 0)})
          AND (CODSUCURSAL = '${esc(sucursal)}')
          AND (CODVEN = ${toNumber(codemp, 0)})
        GROUP BY FECHA
        ORDER BY FECHA
    `;

    execute.query_bi(res, qry);
});

// Ventas / devoluciones por marca (misma tabla)
router.post('/rpt_marcas', async (req, res) => {
    const { sucursal, codemp, mes, anio } = req.body;

    const qry = `
        SELECT
            ISNULL(DESMARCA, 'SIN MARCA') AS DESMARCA,
            SUM(VENTA) AS VENTA,
            SUM(ISNULL(DEVOLUCION, 0) * -1) AS DEVOLUCION,
            SUM(VENTA) - SUM(ISNULL(DEVOLUCION, 0) * -1) AS VENTA_NETA
        FROM rpt_data_venta_vendedor
        WHERE (MES = ${toNumber(mes, 0)})
          AND (ANIO = ${toNumber(anio, 0)})
          AND (CODSUCURSAL = '${esc(sucursal)}')
          AND (CODVEN = ${toNumber(codemp, 0)})
        GROUP BY ISNULL(DESMARCA, 'SIN MARCA')
        ORDER BY SUM(VENTA) DESC
    `;

    execute.query_bi(res, qry);
});

// Top 5 productos más vendidos (BI_RPT_GENERAL)
router.post('/rpt_top_productos', async (req, res) => {
    const { sucursal, codemp, mes, anio } = req.body;

    const qry = `
        SELECT TOP 5
            CODPRODUCTO,
            PRODUCTO,
            SUM(ISNULL(TOTALUNIDADES, 0)) AS TOTALUNIDADES,
            SUM(ISNULL(TOTALPRECIO, 0)) AS TOTALPRECIO
        FROM BI_RPT_GENERAL
        WHERE (MES = ${toNumber(mes, 0)})
          AND (ANIO = ${toNumber(anio, 0)})
          AND (CODSUCURSAL = '${esc(sucursal)}')
          AND (CODVEN = ${toNumber(codemp, 0)})
          AND (TIPO = 'FAC')
        GROUP BY CODPRODUCTO, PRODUCTO
        ORDER BY SUM(ISNULL(TOTALPRECIO, 0)) DESC
    `;

    execute.query_bi(res, qry);
});

router.post('/rpt_fecha_movimientos', async (req, res) => {
    const { sucursal, codemp, fecha } = req.body;

    const qry = `
        SELECT
            TIPO, FECHA,
            CODDOC, CORRELATIVO,
            NOMBRECLIENTE AS CLIENTE,
            SUM(TOTALPRECIO) AS IMPORTE
        FROM BI_RPT_GENERAL
        WHERE (CODSUCURSAL = '${esc(sucursal)}')
          AND (CODVEN = ${toNumber(codemp, 0)})
        GROUP BY TIPO, FECHA, CODDOC, CORRELATIVO, NOMBRECLIENTE
        HAVING (FECHA = '${esc(fecha)}')
    `;

    execute.query_bi(res, qry);
});

module.exports = router;
