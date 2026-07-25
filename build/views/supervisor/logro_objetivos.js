var objetivosVendedorChartDia = null;
var objetivosVendedorChartMarca = null;
var objetivosVendedorSection = 'dashboard';

function getView() {
    root.innerHTML = `
        <div class="objetivos-vendedor-page">
            <div class="objetivos-vendedor-header" id="objetivosVendedorHeader">
                <div class="objetivos-vendedor-filters">
                    <label>Mes, año y vendedor</label>
                    <div class="input-group input-group-sm">
                        <select class="form-control negrita text-danger" id="cmbMes"></select>
                        <select class="form-control negrita text-danger" id="cmbAnio"></select>
                        <select class="form-control negrita text-info" id="cmbVendedorLogro"></select>
                    </div>
                </div>
                <div class="objetivos-vendedor-nav">
                    <button type="button" class="btn btn-sm objetivos-vendedor-nav-btn active" data-section="dashboard">DASHBOARD</button>
                    <button type="button" class="btn btn-sm objetivos-vendedor-nav-btn" data-section="marcas">OBJETIVOS MARCA</button>
                    <button type="button" class="btn btn-sm objetivos-vendedor-nav-btn" data-section="venta">VENTA/DEVOLUCION</button>
                </div>
            </div>
            <div id="objetivosVendedorContent" class="objetivos-vendedor-content"></div>
        </div>
    `;
}

function destroyObjetivosCharts() {
    [objetivosVendedorChartDia, objetivosVendedorChartMarca].forEach((chart) => {
        if (chart) {
            try { chart.destroy(); } catch (e) {}
        }
    });
    objetivosVendedorChartDia = null;
    objetivosVendedorChartMarca = null;
}

function ensureChartJs() {
    return new Promise((resolve, reject) => {
        if (typeof Chart !== 'undefined') {
            resolve();
            return;
        }
        const existing = document.querySelector('script[data-objetivos-chart]');
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('No se pudo cargar Chart.js')));
            return;
        }
        const script = document.createElement('script');
        script.src = './libs/chartjs.bundle.js';
        script.setAttribute('data-objetivos-chart', '1');
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('No se pudo cargar Chart.js'));
        document.head.appendChild(script);
    });
}

function setObjetivosNavActive(section) {
    document.querySelectorAll('.objetivos-vendedor-nav-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-section') === section);
    });
}

function getContentRoot() {
    return document.getElementById('objetivosVendedorContent');
}

function getPeriodo() {
    return {
        mes: document.getElementById('cmbMes').value,
        anio: document.getElementById('cmbAnio').value
    };
}

function getFiltroVendedor() {
    const cmb = document.getElementById('cmbVendedorLogro');
    const value = cmb ? cmb.value : 'ALL';
    const todos = !value || value === 'ALL';
    return {
        todos,
        codemp: todos ? 'ALL' : Number(value)
    };
}

function showObjetivosSection(section) {
    objetivosVendedorSection = section || 'dashboard';
    setObjetivosNavActive(objetivosVendedorSection);
    destroyObjetivosCharts();

    const content = getContentRoot();
    if (!content) return;

    if (objetivosVendedorSection === 'dashboard') {
        renderDashboard(content);
    } else if (objetivosVendedorSection === 'marcas') {
        renderObjetivosMarca(content);
    } else {
        renderVentaDevolucion(content);
    }
}

function postBiReport(url, extra) {
    const { mes, anio } = getPeriodo();
    const filtro = getFiltroVendedor();
    return axios.post(url, Object.assign({
        sucursal: GlobalCodSucursal,
        codemp: filtro.codemp,
        todos: filtro.todos,
        mes,
        anio
    }, extra || {}))
    .then((response) => {
        const data = response.data;
        if (!data || data === 'error') {
            throw new Error('error');
        }
        return data;
    });
}

function data_rpt_fechas() {
    return postBiReport('/reportes/rpt_fechas').then((data) => {
        if (!data.recordset || !data.recordset.length) throw new Error('empty');
        return data;
    });
}

function data_rpt_marcas() {
    return postBiReport('/reportes/rpt_marcas').then((data) => {
        return (data && data.recordset) ? data.recordset : [];
    }).catch(() => []);
}

function data_rpt_top_productos() {
    return postBiReport('/reportes/rpt_top_productos').then((data) => {
        return (data && data.recordset) ? data.recordset : [];
    }).catch(() => []);
}

function data_objetivos_marca() {
    const { mes, anio } = getPeriodo();
    const filtro = getFiltroVendedor();
    return axios.post('/objetivos/detalle', {
        mes,
        anio,
        todos: filtro.todos,
        codusuario: filtro.todos ? 0 : filtro.codemp
    }).then((response) => {
        const data = response.data;
        if (!data || data === 'error' || !data.recordset) throw new Error('error');
        return data.recordset;
    });
}

function sumObjetivosMarca(rows) {
    return (rows || []).reduce((acc, r) => acc + (Number(r.OBJETIVO) || 0), 0);
}

function normalizeMarcaKey(value) {
    return (value == null ? '' : value).toString().trim().toUpperCase();
}

function chartMoneyTooltip() {
    return {
        callbacks: {
            label: function (tooltipItem, chartData) {
                const dataset = chartData.datasets[tooltipItem.datasetIndex];
                return dataset.label + ': ' + funciones.setMoneda(tooltipItem.yLabel != null ? tooltipItem.yLabel : tooltipItem.xLabel, 'Q');
            }
        }
    };
}

function renderDashboard(content) {
    content.innerHTML = `
        <div class="objetivos-vendedor-card">
            <div class="objetivos-vendedor-card-head">
                <h4 class="objetivos-vendedor-title">Dashboard</h4>
                <small class="objetivos-vendedor-hint">Ventas y devoluciones del período</small>
            </div>
            <div class="objetivos-vendedor-kpi">
                <div class="objetivos-vendedor-kpi-item">
                    <span>Ventas</span>
                    <strong id="dashTotalVenta">---</strong>
                </div>
                <div class="objetivos-vendedor-kpi-item">
                    <span>Devoluciones</span>
                    <strong id="dashTotalDev">---</strong>
                </div>
                <div class="objetivos-vendedor-kpi-item">
                    <span>Subtotal</span>
                    <strong id="dashTotalSub">---</strong>
                </div>
            </div>
        </div>

        <div class="objetivos-vendedor-card">
            <h5 class="objetivos-vendedor-title mb-2">Ventas y devoluciones por día</h5>
            <div class="objetivos-vendedor-chart-wrap">
                <canvas id="chartVentasDia"></canvas>
            </div>
            <div id="dashEmptyDia" class="text-muted text-center py-2" style="display:none;">Sin datos diarios</div>
        </div>

        <div class="objetivos-vendedor-card">
            <h5 class="objetivos-vendedor-title mb-2">Ventas y devoluciones por marca</h5>
            <div class="objetivos-vendedor-chart-wrap objetivos-vendedor-chart-marca">
                <canvas id="chartVentasMarca"></canvas>
            </div>
            <div id="dashEmptyMarca" class="text-muted text-center py-2" style="display:none;">Sin datos por marca</div>
        </div>

        <div class="objetivos-vendedor-card">
            <h5 class="objetivos-vendedor-title mb-2">Top 5 productos más vendidos</h5>
            <div class="objetivos-vendedor-table-wrap">
                <table class="table table-sm objetivos-vendedor-table mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>PRODUCTO</th>
                            <th class="text-right">UNIDADES</th>
                            <th class="text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody id="tblTopProductos">
                        <tr><td colspan="4" class="text-center">${GlobalLoader}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    Promise.all([
        data_rpt_fechas().catch(() => null),
        data_rpt_marcas(),
        data_rpt_top_productos(),
        ensureChartJs().catch(() => null)
    ]).then(([dataFechas, marcas, topProductos]) => {
        let totalVenta = 0;
        let totalDev = 0;

        if (dataFechas && dataFechas.recordset && dataFechas.recordset.length) {
            const labels = [];
            const ventas = [];
            const devoluciones = [];

            dataFechas.recordset.forEach((r) => {
                labels.push(funciones.convertDateNormal(r.FECHA));
                const v = Number(r.VENTA) || 0;
                const d = Number(r.DEVOLUCION) || 0;
                ventas.push(v);
                devoluciones.push(d);
                totalVenta += v;
                totalDev += d;
            });

            if (typeof Chart !== 'undefined') {
                const ctxDia = document.getElementById('chartVentasDia');
                objetivosVendedorChartDia = new Chart(ctxDia.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [
                            {
                                label: 'Ventas',
                                backgroundColor: 'rgba(37, 99, 235, 0.75)',
                                borderColor: '#1d4ed8',
                                borderWidth: 1,
                                data: ventas
                            },
                            {
                                label: 'Devoluciones',
                                backgroundColor: 'rgba(220, 38, 38, 0.7)',
                                borderColor: '#b91c1c',
                                borderWidth: 1,
                                data: devoluciones
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: { position: 'bottom' },
                        tooltips: chartMoneyTooltip(),
                        scales: {
                            xAxes: [{ ticks: { autoSkip: true, maxRotation: 45 } }],
                            yAxes: [{ ticks: { beginAtZero: true } }]
                        }
                    }
                });
            }
        } else {
            document.getElementById('dashEmptyDia').style.display = 'block';
        }

        document.getElementById('dashTotalVenta').innerText = funciones.setMoneda(totalVenta, 'Q');
        document.getElementById('dashTotalDev').innerText = funciones.setMoneda(totalDev, 'Q');
        document.getElementById('dashTotalSub').innerText = funciones.setMoneda(totalVenta - totalDev, 'Q');

        // Si no hubo fechas, calcular KPIs desde marcas
        if (!dataFechas && marcas.length) {
            totalVenta = marcas.reduce((a, r) => a + (Number(r.VENTA) || 0), 0);
            totalDev = marcas.reduce((a, r) => a + (Number(r.DEVOLUCION) || 0), 0);
            document.getElementById('dashTotalVenta').innerText = funciones.setMoneda(totalVenta, 'Q');
            document.getElementById('dashTotalDev').innerText = funciones.setMoneda(totalDev, 'Q');
            document.getElementById('dashTotalSub').innerText = funciones.setMoneda(totalVenta - totalDev, 'Q');
        }

        if (marcas.length && typeof Chart !== 'undefined') {
            const labelsM = marcas.map((r) => r.DESMARCA || 'SIN MARCA');
            const ventasM = marcas.map((r) => Number(r.VENTA) || 0);
            const devM = marcas.map((r) => Number(r.DEVOLUCION) || 0);
            const chartHeight = Math.max(220, labelsM.length * 28);
            const wrap = document.querySelector('.objetivos-vendedor-chart-marca');
            if (wrap) wrap.style.height = chartHeight + 'px';

            const ctxMarca = document.getElementById('chartVentasMarca');
            objetivosVendedorChartMarca = new Chart(ctxMarca.getContext('2d'), {
                type: 'horizontalBar',
                data: {
                    labels: labelsM,
                    datasets: [
                        {
                            label: 'Ventas',
                            backgroundColor: 'rgba(37, 99, 235, 0.75)',
                            borderColor: '#1d4ed8',
                            borderWidth: 1,
                            data: ventasM
                        },
                        {
                            label: 'Devoluciones',
                            backgroundColor: 'rgba(220, 38, 38, 0.7)',
                            borderColor: '#b91c1c',
                            borderWidth: 1,
                            data: devM
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: { position: 'bottom' },
                    tooltips: chartMoneyTooltip(),
                    scales: {
                        xAxes: [{ ticks: { beginAtZero: true } }],
                        yAxes: [{ ticks: { autoSkip: false } }]
                    }
                }
            });
        } else {
            document.getElementById('dashEmptyMarca').style.display = 'block';
        }

        const tbody = document.getElementById('tblTopProductos');
        if (!topProductos.length) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Sin productos en el período</td></tr>`;
            return;
        }

        tbody.innerHTML = topProductos.map((r, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>
                    <div class="negrita">${r.PRODUCTO || ''}</div>
                    <small class="text-muted">${r.CODPRODUCTO || ''}</small>
                </td>
                <td class="text-right align-middle">${funciones.setMoneda(r.TOTALUNIDADES || 0, '')}</td>
                <td class="text-right align-middle">${funciones.setMoneda(r.TOTALPRECIO || 0, 'Q')}</td>
            </tr>
        `).join('');
    }).catch((err) => {
        console.log(err);
        document.getElementById('dashEmptyDia').style.display = 'block';
        document.getElementById('dashEmptyMarca').style.display = 'block';
        document.getElementById('tblTopProductos').innerHTML =
            `<tr><td colspan="4" class="text-center text-muted">No se cargaron datos</td></tr>`;
    });
}

function renderObjetivosMarca(content) {
    content.innerHTML = `
        <div class="objetivos-vendedor-card">
            <div class="objetivos-vendedor-card-head">
                <h4 class="objetivos-vendedor-title">Objetivos por marca</h4>
                <small class="objetivos-vendedor-hint">Venta neta vs objetivo del período</small>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="objetivos-vendedor-hint mb-0">Totales</span>
                <div class="text-right">
                    <div><small class="text-muted">Venta neta</small> <strong id="lbTotalVentaNetaMarcas">---</strong></div>
                    <div><small class="text-muted">Objetivo</small> <strong class="text-danger" id="lbTotalObjMarcas">---</strong></div>
                </div>
            </div>
            <div class="objetivos-vendedor-table-wrap">
                <table class="table table-sm objetivos-vendedor-table mb-0">
                    <thead>
                        <tr>
                            <th>MARCA</th>
                            <th class="text-right">VENTA NETA</th>
                            <th class="text-right">OBJETIVO</th>
                            <th class="text-right">LOGRADO</th>
                        </tr>
                    </thead>
                    <tbody id="tblObjMarcasCompare">
                        <tr><td colspan="4" class="text-center">${GlobalLoader}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    Promise.all([
        data_objetivos_marca().catch(() => []),
        data_rpt_marcas()
    ]).then(([objetivos, ventasMarca]) => {
        const ventasMap = {};
        ventasMarca.forEach((r) => {
            ventasMap[normalizeMarcaKey(r.DESMARCA)] = Number(r.VENTA_NETA != null
                ? r.VENTA_NETA
                : ((Number(r.VENTA) || 0) - (Number(r.DEVOLUCION) || 0)));
        });

        // Solo marcas con objetivo > 0
        const rows = (objetivos || []).filter((r) => Number(r.OBJETIVO) > 0);

        let totalNeta = 0;
        let totalObj = 0;
        const tbody = document.getElementById('tblObjMarcasCompare');

        if (!rows.length) {
            document.getElementById('lbTotalVentaNetaMarcas').innerText = 'Q 0.00';
            document.getElementById('lbTotalObjMarcas').innerText = 'Q 0.00';
            tbody.innerHTML =
                `<tr><td colspan="4" class="text-center text-muted">Sin objetivos mayores a cero para este período</td></tr>`;
            return;
        }

        tbody.innerHTML = rows.map((r) => {
            const objetivo = Number(r.OBJETIVO) || 0;
            const ventaNeta = Number(ventasMap[normalizeMarcaKey(r.DESMARCA)] || 0);
            const pct = objetivo > 0 ? (ventaNeta / objetivo) * 100 : 0;
            const pctShow = Math.max(0, pct);
            const barWidth = Math.min(100, Math.max(0, pctShow));
            const barColor = pctShow >= 100 ? 'success' : (pctShow >= 60 ? 'info' : 'warning');

            totalNeta += ventaNeta;
            totalObj += objetivo;

            return `
                <tr>
                    <td class="align-middle negrita">${r.DESMARCA || 'SIN MARCA'}</td>
                    <td class="text-right align-middle">${funciones.setMoneda(ventaNeta, 'Q')}</td>
                    <td class="text-right align-middle">${funciones.setMoneda(objetivo, 'Q')}</td>
                    <td class="text-right align-middle">
                        ${funciones.setMoneda(ventaNeta, 'Q')}
                        <small class="text-muted d-block">${pctShow.toFixed(1)}%</small>
                    </td>
                </tr>
                <tr class="objetivos-marca-progress-row">
                    <td colspan="4" class="pt-0 pb-2">
                        <div class="progress objetivos-marca-progress mb-0">
                            <div class="progress-bar bg-${barColor}"
                                role="progressbar"
                                style="width:${barWidth}%"
                                aria-valuenow="${pctShow}"
                                aria-valuemin="0"
                                aria-valuemax="100">
                                ${pctShow.toFixed(0)}%
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        document.getElementById('lbTotalVentaNetaMarcas').innerText = funciones.setMoneda(totalNeta, 'Q');
        document.getElementById('lbTotalObjMarcas').innerText = funciones.setMoneda(totalObj, 'Q');
    }).catch((err) => {
        console.log(err);
        document.getElementById('tblObjMarcasCompare').innerHTML =
            `<tr><td colspan="4" class="text-center text-danger">No se pudo cargar la comparación</td></tr>`;
    });
}

function renderVentaDevolucion(content) {
    content.innerHTML = `
        <div class="objetivos-vendedor-card">
            <div class="objetivos-vendedor-card-head">
                <h4 class="objetivos-vendedor-title">Ventas por fechas</h4>
                <small class="objetivos-vendedor-hint">Clic en la fecha para ver más detalles</small>
            </div>
            <div id="container_progreso" class="objetivos-vendedor-progress"></div>
            <div class="objetivos-vendedor-table-wrap">
                <table class="table table-sm objetivos-vendedor-table mb-0">
                    <thead>
                        <tr>
                            <th>FECHA</th>
                            <th>VENTA</th>
                            <th>DEVOLUCION</th>
                            <th>SUBTOTAL</th>
                        </tr>
                    </thead>
                    <tbody id="tbl_data_fechas">
                        <tr><td colspan="4" class="text-center">${GlobalLoader}</td></tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td><span id="lbTotalVentas"></span></td>
                            <td><span id="lbTotalDevoluciones"></span></td>
                            <td><span id="lbTotalImporte"></span></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;

    tbl_fechas();
}

function renderDetalleFecha(fecha) {
    destroyObjetivosCharts();
    setObjetivosNavActive('venta');

    const content = getContentRoot();
    content.innerHTML = `
        <div class="objetivos-vendedor-card mb-2">
            <div class="d-flex justify-content-between align-items-center">
                <h4 class="objetivos-vendedor-title mb-0">Resumen ${funciones.convertDateNormal(fecha)}</h4>
                <button class="btn btn-sm btn-outline-secondary hand" id="btnAtrasDetalle">
                    <i class="fal fa-arrow-left"></i> Volver
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-12 col-md-6">
                <div class="objetivos-vendedor-card">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <label class="text-success negrita mb-0">VENTAS</label>
                        <h5 class="negrita text-success mb-0" id="lbFechaVenta"></h5>
                    </div>
                    <div class="objetivos-vendedor-table-wrap">
                        <table class="table table-sm objetivos-vendedor-table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>DOCUMENTO</th>
                                    <th>CLIENTE</th>
                                    <th>IMPORTE</th>
                                </tr>
                            </thead>
                            <tbody id="tbl_data_detalle_facturas"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col-sm-12 col-md-6">
                <div class="objetivos-vendedor-card">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <label class="text-danger negrita mb-0">DEVOLUCIONES</label>
                        <h5 class="negrita text-danger mb-0" id="lbFechaDevolucion"></h5>
                    </div>
                    <div class="objetivos-vendedor-table-wrap">
                        <table class="table table-sm objetivos-vendedor-table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>DOCUMENTO</th>
                                    <th>CLIENTE</th>
                                    <th>IMPORTE</th>
                                </tr>
                            </thead>
                            <tbody id="tbl_data_detalle_devoluciones"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btnAtrasDetalle').addEventListener('click', () => {
        showObjetivosSection('venta');
    });

    tbl_fechas_detalle(fecha);
}

function addListeners() {
    const cmbMes = document.getElementById('cmbMes');
    const cmbAnio = document.getElementById('cmbAnio');
    const cmbVendedor = document.getElementById('cmbVendedorLogro');

    cmbMes.innerHTML = funciones.ComboMeses();
    cmbAnio.innerHTML = funciones.ComboAnio();

    const f = new Date();
    cmbMes.value = f.getUTCMonth() + 1;
    cmbAnio.value = f.getFullYear();

    const reloadCurrent = () => showObjetivosSection(objetivosVendedorSection);
    cmbMes.addEventListener('change', reloadCurrent);
    cmbAnio.addEventListener('change', reloadCurrent);
    cmbVendedor.addEventListener('change', reloadCurrent);

    document.querySelectorAll('.objetivos-vendedor-nav-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            showObjetivosSection(btn.getAttribute('data-section'));
        });
    });

    cmbVendedor.innerHTML = `<option value="ALL">Todos</option>`;
    axios.post('/objetivos/vendedores', {})
        .then((response) => {
            const data = response.data;
            if (data && data !== 'error' && data.recordset) {
                cmbVendedor.innerHTML = `<option value="ALL">Todos</option>` +
                    data.recordset.map((r) =>
                        `<option value="${r.CODUSUARIO}">${r.NOMBRE}</option>`
                    ).join('');
            }
            showObjetivosSection('dashboard');
        })
        .catch(() => {
            showObjetivosSection('dashboard');
        });
}

function initView() {
    getView();
    addListeners();
}

function tbl_fechas() {
    const container = document.getElementById('tbl_data_fechas');
    const prog = document.getElementById('container_progreso');
    if (!container) return;

    container.innerHTML = `<tr><td colspan="4" class="text-center">${GlobalLoader}</td></tr>`;
    if (prog) prog.innerHTML = '';

    Promise.all([
        data_rpt_fechas().catch(() => null),
        data_objetivos_marca().catch(() => [])
    ]).then(([dataFechas, rowsObj]) => {
        const totalObjetivo = sumObjetivosMarca(rowsObj);
        let var_total_venta = 0;
        let var_total_devolucion = 0;
        let var_total_importe = 0;

        if (!dataFechas || !dataFechas.recordset) {
            container.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No se cargaron datos...</td></tr>`;
            document.getElementById('lbTotalVentas').innerText = '---';
            document.getElementById('lbTotalDevoluciones').innerText = '---';
            document.getElementById('lbTotalImporte').innerText = '---';
            if (prog) {
                prog.innerHTML = totalObjetivo > 0
                    ? funciones.barra_progreso('success', 0, totalObjetivo, 0, 'Logro vs objetivos marca ')
                    : `<small class="text-muted">Sin objetivos de marca para comparar</small>`;
            }
            return;
        }

        let str = '';
        dataFechas.recordset.forEach((r) => {
            const importe = Number(r.VENTA) - Number(r.DEVOLUCION);
            var_total_venta += Number(r.VENTA);
            var_total_devolucion += Number(r.DEVOLUCION);
            var_total_importe += Number(importe);

            str += `
            <tr class="hand" onclick="get_detalle_fecha('${r.FECHA}')">
                <td><small>${funciones.convertDateNormal(r.FECHA)}</small></td>
                <td><small>${funciones.setMoneda(r.VENTA, 'Q')}</small></td>
                <td><small>${funciones.setMoneda(r.DEVOLUCION, 'Q')}</small></td>
                <td><small>${funciones.setMoneda(importe, 'Q')}</small></td>
            </tr>`;
        });

        container.innerHTML = str;
        document.getElementById('lbTotalVentas').innerText = funciones.setMoneda(var_total_venta, 'Q');
        document.getElementById('lbTotalDevoluciones').innerText = funciones.setMoneda(var_total_devolucion, 'Q');
        document.getElementById('lbTotalImporte').innerText = funciones.setMoneda(var_total_importe, 'Q');

        if (prog) {
            if (totalObjetivo > 0) {
                prog.innerHTML = funciones.barra_progreso('success', 0, totalObjetivo, var_total_importe, 'Logro vs objetivos marca ');
            } else {
                prog.innerHTML = `<small class="text-muted">Sin objetivos de marca para este período (total objetivo Q 0.00)</small>`;
            }
        }
    });
}

function get_detalle_fecha(fecha) {
    renderDetalleFecha(fecha);
}

function data_fecha_movimientos(fecha) {
    return postBiReport('/reportes/rpt_fecha_movimientos', { fecha }).then((data) => {
        if (!data.recordset || !Number(data.rowsAffected && data.rowsAffected[0])) {
            throw new Error('empty');
        }
        return data;
    });
}

function tbl_fechas_detalle(fecha) {
    const container1 = document.getElementById('tbl_data_detalle_facturas');
    const container2 = document.getElementById('tbl_data_detalle_devoluciones');
    container1.innerHTML = GlobalLoader;
    container2.innerHTML = GlobalLoader;
    document.getElementById('lbFechaVenta').innerText = '';
    document.getElementById('lbFechaDevolucion').innerText = '';

    let varTotalVenta = 0;
    let varTotalDevolucion = 0;

    data_fecha_movimientos(fecha)
        .then((data) => {
            let strFac = '';
            let strDev = '';

            data.recordset.forEach((r) => {
                let importe = Number(r.IMPORTE);
                if (r.TIPO === 'FAC') {
                    varTotalVenta += Number(importe);
                    strFac += `
                        <tr>
                            <td>${r.CODDOC}-${r.CORRELATIVO}</td>
                            <td>${r.CLIENTE}</td>
                            <td>${funciones.setMoneda(importe, 'Q')}</td>
                        </tr>`;
                } else {
                    importe = (importe * -1);
                    varTotalDevolucion += Number(importe);
                    strDev += `
                        <tr>
                            <td>${r.CODDOC}-${r.CORRELATIVO}</td>
                            <td>${r.CLIENTE}</td>
                            <td>${funciones.setMoneda(importe, 'Q')}</td>
                        </tr>`;
                }
            });

            container1.innerHTML = strFac || `<tr><td colspan="3" class="text-muted text-center">Sin ventas</td></tr>`;
            container2.innerHTML = strDev || `<tr><td colspan="3" class="text-muted text-center">Sin devoluciones</td></tr>`;
            document.getElementById('lbFechaVenta').innerText = funciones.setMoneda(varTotalVenta, 'Q');
            document.getElementById('lbFechaDevolucion').innerText = funciones.setMoneda(varTotalDevolucion, 'Q');
        })
        .catch(() => {
            container1.innerHTML = 'No se cargaron datos...';
            container2.innerHTML = 'No se cargaron datos...';
        });
}
