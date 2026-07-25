const execute = require('./connection');
const express = require('express');
const router = express.Router();

/**
 * Objetivos y marcas: base BI (configBi en connection.js).
 * Empleados/vendedores: base principal (.env / config).
 */

function getSucursal() {
    return (process.env.SUCURSAL || '').toString().replace(/^['"]|['"]$/g, '');
}

function esc(value) {
    return (value == null ? '' : value).toString().replace(/'/g, "''");
}

function toNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

// Listado agrupado por vendedor (BI) + nombres desde BD principal
router.post('/listado', async (req, res) => {
    const sucursal = getSucursal();
    const mes = toNumber(req.body.mes, 0);
    const anio = toNumber(req.body.anio, 0);

    try {
        const qryBi = `
            SELECT
                O.CODUSUARIO,
                O.MES,
                O.ANIO,
                COUNT(O.ID) AS MARCAS,
                ISNULL(SUM(O.OBJETIVO), 0) AS TOTAL
            FROM OBJETIVOS_VENDEDORES O
            WHERE O.CODSUCURSAL = '${esc(sucursal)}'
              AND O.MES = ${mes}
              AND O.ANIO = ${anio}
            GROUP BY O.CODUSUARIO, O.MES, O.ANIO
            ORDER BY O.CODUSUARIO
        `;

        const biResult = await execute.QueryBiData(qryBi);
        const rows = (biResult && biResult.recordset) ? biResult.recordset : [];

        if (!rows.length) {
            return res.send({ recordset: [] });
        }

        const ids = rows.map((r) => Number(r.CODUSUARIO)).filter((n) => Number.isFinite(n));
        let nameMap = {};

        if (ids.length) {
            const qryUsers = `
                SELECT CODUSUARIO, NOMBRE
                FROM ME_USUARIOS
                WHERE CODSUCURSAL = '${esc(sucursal)}'
                  AND CODUSUARIO IN (${ids.join(',')})
            `;
            try {
                const usersResult = await execute.QueryData(qryUsers);
                (usersResult.recordset || []).forEach((u) => {
                    nameMap[Number(u.CODUSUARIO)] = u.NOMBRE;
                });
            } catch (e) {
                console.log('objetivos listado nombres: ' + e);
            }
        }

        const recordset = rows.map((r) => ({
            CODUSUARIO: r.CODUSUARIO,
            NOMBRE: nameMap[Number(r.CODUSUARIO)] || ('Código ' + r.CODUSUARIO),
            MES: r.MES,
            ANIO: r.ANIO,
            MARCAS: r.MARCAS,
            TOTAL: r.TOTAL
        })).sort((a, b) => String(a.NOMBRE).localeCompare(String(b.NOMBRE)));

        res.send({ recordset });
    } catch (e) {
        console.log('objetivos listado: ' + e);
        res.send('error');
    }
});

// Vendedores: BD principal (.env)
router.post('/vendedores', async (req, res) => {
    const sucursal = getSucursal();
    const qry = `
        SELECT CODUSUARIO, NOMBRE
        FROM ME_USUARIOS
        WHERE CODSUCURSAL = '${esc(sucursal)}'
          AND TIPO = 'VENDEDOR'
        ORDER BY NOMBRE
    `;
    execute.Query(res, qry);
});

// Marcas generales: BD BI (sin filtro de sucursal)
router.post('/marcas', async (req, res) => {
    const qry = `
        SELECT CODMARCA, DESMARCA
        FROM BI_GENERALES_MARCAS
        ORDER BY DESMARCA
    `;
    execute.query_bi(res, qry);
});

// Detalle: marcas BI + objetivos BI (un vendedor o todos)
router.post('/detalle', async (req, res) => {
    const sucursal = getSucursal();
    const mes = toNumber(req.body.mes, 0);
    const anio = toNumber(req.body.anio, 0);
    const codusuario = toNumber(req.body.codusuario, 0);
    const todos = req.body.todos === true || req.body.todos === 'SI' || req.body.todos === 1 || req.body.todos === '1';

    let qry = '';

    if (todos || !codusuario) {
        qry = `
            SELECT
                CAST(M.CODMARCA AS VARCHAR(10)) AS CODMARCA,
                M.DESMARCA,
                ISNULL(O.OBJETIVO, 0) AS OBJETIVO,
                NULL AS ID
            FROM BI_GENERALES_MARCAS M
            LEFT JOIN (
                SELECT
                    CODMARCA,
                    SUM(ISNULL(OBJETIVO, 0)) AS OBJETIVO
                FROM OBJETIVOS_VENDEDORES
                WHERE CODSUCURSAL = '${esc(sucursal)}'
                  AND MES = ${mes}
                  AND ANIO = ${anio}
                GROUP BY CODMARCA
            ) O ON O.CODMARCA = CAST(M.CODMARCA AS VARCHAR(10))
            ORDER BY M.DESMARCA
        `;
    } else {
        qry = `
            SELECT
                CAST(M.CODMARCA AS VARCHAR(10)) AS CODMARCA,
                M.DESMARCA,
                ISNULL(O.OBJETIVO, 0) AS OBJETIVO,
                O.ID
            FROM BI_GENERALES_MARCAS M
            LEFT JOIN OBJETIVOS_VENDEDORES O
                ON O.CODMARCA = CAST(M.CODMARCA AS VARCHAR(10))
               AND O.CODUSUARIO = ${codusuario}
               AND O.MES = ${mes}
               AND O.ANIO = ${anio}
               AND O.CODSUCURSAL = '${esc(sucursal)}'
            ORDER BY M.DESMARCA
        `;
    }

    execute.query_bi(res, qry);
});

// Guardar en BD BI
router.post('/guardar', async (req, res) => {
    const sucursal = getSucursal();
    const mes = toNumber(req.body.mes, 0);
    const anio = toNumber(req.body.anio, 0);
    const codusuario = toNumber(req.body.codusuario, 0);
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    if (!mes || !anio || !codusuario) {
        return res.send('error');
    }

    let inserts = '';
    items.forEach((item) => {
        const codmarca = esc(item.codmarca);
        const desmarca = esc(item.desmarca);
        const objetivo = toNumber(item.objetivo, 0);

        inserts += `
            INSERT INTO OBJETIVOS_VENDEDORES
                (CODSUCURSAL, MES, ANIO, CODUSUARIO, CODMARCA, DESMARCA, OBJETIVO)
            VALUES
                ('${esc(sucursal)}', ${mes}, ${anio}, ${codusuario}, '${codmarca}', '${desmarca}', ${objetivo});
        `;
    });

    const qry = `
        DELETE FROM OBJETIVOS_VENDEDORES
        WHERE CODSUCURSAL = '${esc(sucursal)}'
          AND MES = ${mes}
          AND ANIO = ${anio}
          AND CODUSUARIO = ${codusuario};
        ${inserts}
    `;

    execute.query_bi(res, qry);
});

// Eliminar en BD BI
router.post('/eliminar', async (req, res) => {
    const sucursal = getSucursal();
    const mes = toNumber(req.body.mes, 0);
    const anio = toNumber(req.body.anio, 0);
    const codusuario = toNumber(req.body.codusuario, 0);

    const qry = `
        DELETE FROM OBJETIVOS_VENDEDORES
        WHERE CODSUCURSAL = '${esc(sucursal)}'
          AND MES = ${mes}
          AND ANIO = ${anio}
          AND CODUSUARIO = ${codusuario};
    `;

    execute.query_bi(res, qry);
});

module.exports = router;
