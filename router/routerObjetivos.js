const execute = require('./connection');
const express = require('express');
const router = express.Router();

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

// Listado agrupado por vendedor para mes/año
router.post('/listado', async (req, res) => {
    const sucursal = getSucursal();
    const mes = toNumber(req.body.mes, 0);
    const anio = toNumber(req.body.anio, 0);

    const qry = `
        SELECT
            O.CODUSUARIO,
            ISNULL(U.NOMBRE, 'SIN NOMBRE') AS NOMBRE,
            O.MES,
            O.ANIO,
            COUNT(O.ID) AS MARCAS,
            ISNULL(SUM(O.OBJETIVO), 0) AS TOTAL
        FROM OBJETIVOS_VENDEDORES O
        LEFT JOIN ME_USUARIOS U
            ON U.CODSUCURSAL = O.CODSUCURSAL
           AND U.CODUSUARIO = O.CODUSUARIO
        WHERE O.CODSUCURSAL = '${esc(sucursal)}'
          AND O.MES = ${mes}
          AND O.ANIO = ${anio}
        GROUP BY O.CODUSUARIO, U.NOMBRE, O.MES, O.ANIO
        ORDER BY U.NOMBRE
    `;

    execute.Query(res, qry);
});

// Vendedores activos de la sucursal
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

// Marcas de la sucursal
router.post('/marcas', async (req, res) => {
    const sucursal = getSucursal();
    const qry = `
        SELECT CODMARCA, DESMARCA
        FROM ME_MARCAS
        WHERE CODSUCURSAL = '${esc(sucursal)}'
        ORDER BY DESMARCA
    `;
    execute.Query(res, qry);
});

// Detalle de objetivos (todas las marcas + valor existente o 0)
router.post('/detalle', async (req, res) => {
    const sucursal = getSucursal();
    const mes = toNumber(req.body.mes, 0);
    const anio = toNumber(req.body.anio, 0);
    const codusuario = toNumber(req.body.codusuario, 0);

    const qry = `
        SELECT
            M.CODMARCA,
            M.DESMARCA,
            ISNULL(O.OBJETIVO, 0) AS OBJETIVO,
            O.ID
        FROM ME_MARCAS M
        LEFT JOIN OBJETIVOS_VENDEDORES O
            ON O.CODSUCURSAL = M.CODSUCURSAL
           AND O.CODMARCA = M.CODMARCA
           AND O.CODUSUARIO = ${codusuario}
           AND O.MES = ${mes}
           AND O.ANIO = ${anio}
        WHERE M.CODSUCURSAL = '${esc(sucursal)}'
        ORDER BY M.DESMARCA
    `;

    execute.Query(res, qry);
});

// Guardar (reemplaza objetivos del vendedor/mes/año)
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

    execute.Query(res, qry);
});

// Eliminar objetivos de un vendedor/mes/año
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

    execute.Query(res, qry);
});

module.exports = router;
