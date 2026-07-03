/**
 * Cola de sincronización: pedidos pendientes y visitas encoladas offline.
 */
const SyncQueue = (function () {
    'use strict';

    let syncing = false;

    function isLoggedIn() {
        return typeof GlobalUsuario !== 'undefined'
            && GlobalUsuario
            && GlobalUsuario !== 'MERCADOSEFECTIVOS'
            && GlobalUsuario !== '';
    }

    async function sendPedidoCore(id, options) {
        const silent = options && options.silent;
        const correlativo = await classTipoDocumentos.get_Correlativo_Documento_service('PED', GlobalCoddoc);
        const rows = await getPedidoEnviar(id);

        if (!rows || !rows.length) {
            throw new Error('Pedido no encontrado');
        }

        const rs = rows[0];
        let localId = rs.LOCAL_ID;

        if (!localId) {
            localId = ApiGate.generateLocalId();
            await connection.update({
                in: 'documentos',
                set: { LOCAL_ID: localId },
                where: { ID: Number(id) }
            });
        }

        let jsonProductos = rs.JSONPRODUCTOS;
        try {
            const parsed = JSON.parse(rs.JSONPRODUCTOS);
            if (Array.isArray(parsed)) {
                jsonProductos = JSON.stringify(parsed.map((p, index) => ({
                    ...p,
                    ID: index + 1,
                    DOC_ITEM: index + 1
                })));
            }
        } catch (e) {
            /* conserva JSON original */
        }

        const datos = {
            jsondocproductos: jsonProductos,
            codsucursal: rs.CODSUCURSAL,
            empnit: rs.EMPNIT,
            coddoc: rs.CODDOC,
            correl: correlativo.toString(),
            anio: rs.ANIO,
            mes: rs.MES,
            dia: rs.DIA,
            fecha: rs.FECHA,
            fechaentrega: rs.FECHAENTREGA,
            formaentrega: rs.FORMAENTREGA,
            codbodega: GlobalCodBodega,
            codcliente: rs.CODCLIE,
            nomclie: rs.NOMCLIE,
            totalcosto: rs.TOTALCOSTO,
            totalprecio: rs.TOTALPRECIO,
            nitclie: rs.NITCLIE,
            dirclie: rs.DIRCLIE,
            obs: rs.OBS,
            direntrega: rs.DIRENTREGA,
            usuario: rs.USUARIO,
            codven: rs.CODVEN,
            lat: rs.LAT,
            long: rs.LONG,
            hora: funciones.getHora(),
            local_id: localId
        };

        const response = await axios.post(GlobalUrlServicePedidos + '/ventas/insertventa', datos);
        const data = response.data;

        if (data && data.toString() === 'error') {
            throw new Error('Error al enviar pedido');
        }

        await classEmpleados.updateMyLocation();
        await apigen.updateClientesLastSale(rs.NITCLIE, 'VENTA');
        await deletePedidoEnviado(id);

        if (!silent) {
            funciones.showToast('Pedido sincronizado correctamente');
        }

        return data;
    }

    async function syncPendingPedidos(usuario, options) {
        const rows = await selectVentasPendientes(usuario || GlobalUsuario);
        const results = { ok: 0, fail: 0 };

        for (const row of rows) {
            try {
                await sendPedidoCore(row.ID, options);
                results.ok += 1;
            } catch (e) {
                results.fail += 1;
                break;
            }
        }

        return results;
    }

    async function syncPendingVisitas(options) {
        const silent = options && options.silent;
        const pending = await connection.select({
            from: 'visitas_queue',
            order: { by: 'ID', type: 'asc' }
        });

        let sent = 0;

        for (const visita of pending) {
            try {
                const response = await axios.post('/clientes/insert_visita', {
                    sucursal: visita.CODSUCURSAL,
                    codclie: visita.CODCLIE,
                    codemp: visita.CODEMP,
                    motivo: visita.MOTIVO,
                    hora: visita.HORA,
                    fecha: visita.FECHA,
                    lat: visita.LAT,
                    long: visita.LONG
                });

                if (response.data && Number(response.data.rowsAffected && response.data.rowsAffected[0]) > 0) {
                    await connection.remove({
                        from: 'visitas_queue',
                        where: { ID: visita.ID }
                    });
                    sent += 1;
                }
            } catch (e) {
                break;
            }
        }

        if (!silent && sent > 0) {
            funciones.showToast(`${sent} visita(s) sincronizada(s)`);
        }

        return { sent };
    }

    async function runBackgroundSync(options) {
        if (syncing || !navigator.onLine || !isLoggedIn()) {
            return { skipped: true };
        }

        syncing = true;
        const silent = options && options.silent;

        try {
            const visitas = await syncPendingVisitas({ silent: true });
            const pedidos = await syncPendingPedidos(GlobalUsuario, { silent: true });

            if (typeof dbCargarPedidosPendientes === 'function') {
                dbCargarPedidosPendientes();
            }

            if (!silent && (visitas.sent > 0 || pedidos.ok > 0)) {
                funciones.showToast(`Sync: ${pedidos.ok} pedido(s), ${visitas.sent} visita(s)`);
            }

            return { visitas, pedidos };
        } finally {
            syncing = false;
        }
    }

    return {
        sendPedidoCore,
        syncPendingPedidos,
        syncPendingVisitas,
        runBackgroundSync
    };
})();
