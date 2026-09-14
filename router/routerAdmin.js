const execute = require('./connection');
const express = require('express');
const router = express.Router();

const SUPER_USER = 'ALEXIS BURGOS';
const SUPER_PASS = '2410201415082017';

function esc(v) {
    return String(v == null ? '' : v).replace(/'/g, "''");
}

function isSuper(req) {
    const body = req.body || {};
    const user = String(body.usuario || '').trim().toUpperCase();
    const pass = String(body.clave || '');
    return user === SUPER_USER && pass === SUPER_PASS;
}

function deny(res) {
    res.status(403).send('error');
}

router.post('/sucursales', async (req, res) => {
    if (!isSuper(req)) return deny(res);
    const qry = `
        SELECT CODSUCURSAL, ISNULL(NOMBRE, CODSUCURSAL) AS NOMBRE
        FROM ME_SUCURSALES
        ORDER BY NOMBRE
    `;
    execute.Query(res, qry);
});

router.post('/usuarios', async (req, res) => {
    if (!isSuper(req)) return deny(res);
    const sucursal = esc(req.body && req.body.sucursal);
    if (!sucursal) {
        res.send({ recordset: [], rowsAffected: [0] });
        return;
    }
    const qry = `
        SELECT
            ID,
            CODUSUARIO,
            ISNULL(NOMBRE, '') AS NOMBRE,
            ISNULL(PASS, '') AS PASS,
            ISNULL(TIPO, '') AS TIPO,
            ISNULL(CODDOC, '') AS CODDOC,
            ISNULL(CORRELATIVO, 0) AS CORRELATIVO
        FROM ME_USUARIOS
        WHERE CODSUCURSAL = '${sucursal}'
        ORDER BY TIPO, NOMBRE
    `;
    execute.Query(res, qry);
});

router.post('/updatepass', async (req, res) => {
    if (!isSuper(req)) return deny(res);
    const sucursal = esc(req.body && req.body.sucursal);
    const pass = esc(req.body && req.body.pass);
    const id = Number(req.body && req.body.id);
    const codusuario = Number(req.body && req.body.codusuario);
    if (!sucursal || !Number.isFinite(id) || id <= 0) {
        res.send('error');
        return;
    }
    const qry = `
        UPDATE ME_USUARIOS
        SET PASS = '${pass}'
        WHERE ID = ${Math.trunc(id)}
          AND CODSUCURSAL = '${sucursal}'
          AND CODUSUARIO = ${Number.isFinite(codusuario) ? Math.trunc(codusuario) : 0}
    `;
    execute.Query(res, qry);
});

router.post('/correlativo', async (req, res) => {
    if (!isSuper(req)) return deny(res);
    const sucursal = esc(req.body && req.body.sucursal);
    const coddoc = esc(req.body && req.body.coddoc);
    if (!sucursal || !coddoc) {
        res.send('error');
        return;
    }
    const qry = `
        SELECT ISNULL(MAX(DOC_NUMERO), 0) AS ULTIMO
        FROM ME_DOCUMENTOS
        WHERE CODSUCURSAL = '${sucursal}'
          AND CODDOC = '${coddoc}'
    `;
    execute.QueryData(qry)
        .then((data) => {
            let ultimo = 0;
            const rows = (data && data.recordset) ? data.recordset : [];
            if (rows.length) ultimo = Number(rows[0].ULTIMO) || 0;
            const nuevo = ultimo + 1;
            const upd = `
                UPDATE ME_TIPODOCUMENTOS
                SET CORRELATIVO = ${nuevo}
                WHERE CODSUCURSAL = '${sucursal}' AND CODDOC = '${coddoc}';
                UPDATE ME_USUARIOS
                SET CORRELATIVO = ${nuevo}
                WHERE CODSUCURSAL = '${sucursal}' AND CODDOC = '${coddoc}';
            `;
            execute.Query(res, upd);
        })
        .catch(() => res.send('error'));
});

router.post('/tablas', async (req, res) => {
    if (!isSuper(req)) return deny(res);
    const qry = `
        SELECT
            t.name AS TABLA,
            CAST(ROUND(SUM(a.used_pages) * 8.0 / 1024, 2) AS decimal(18, 2)) AS MB
        FROM sys.tables t
        INNER JOIN sys.indexes i ON t.object_id = i.object_id
        INNER JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
        INNER JOIN sys.allocation_units a ON p.partition_id = a.container_id
        WHERE t.is_ms_shipped = 0
        GROUP BY t.name
        ORDER BY SUM(a.used_pages) DESC, t.name
    `;
    execute.Query(res, qry);
});

module.exports = router;
