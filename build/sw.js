const shellCacheName = 'app-shell-v2026-044';

const API_PREFIXES = [
    '/ventas/',
    '/empleados/',
    '/clientes/',
    '/sucursales/',
    '/noticias/',
    '/censo/',
    '/repartidor/',
    '/tipodocumentos/',
    '/productos/',
    '/digitacion/',
    '/usuarios/',
    '/objetivos/',
    '/admin/',
    '/reportes/',
    '/type/',
    '/api/',
    '/router/'
];

// App shell: HTML, CSS, JS de vistas y libs. Las APIs no van aquí.
const precacheAssets = [
    '/',
    './index.html',
    './index.js',
    './manifest.json',
    './offline.html',
    './favicon.png',
    './listaprecios.js',
    './css/vendors.bundle.css',
    './css/app.bundle.css',
    './css/btn.css',
    './css/personalizado.css',
    './css/modern-design.css',
    './css/fa-solid.css',
    './css/fa-regular.css',
    './css/fa-brands.css',
    './css/bootstrap.min.css',
    './css/bootstrap-toggle.css',
    './libs/animate.min.css',
    './libs/leaflet/leaflet.css',
    './libs/noty/noty.min.css',
    './libs/noty/noty.min.js',
    './libs/funciones.js',
    './libs/sweetalert2-compat.js',
    './libs/sweetalert2.min.js',
    './libs/axios.min.js',
    './libs/parallax.min.js',
    './libs/qrcode.min.js',
    './libs/xlsx.full.min.js',
    './libs/chartjs.bundle.js',
    './libs/leaflet/leaflet.js',
    './libs/jsstore/jsstore.min.js',
    './libs/jsstore/jsstore.worker.min.js',
    './js/vendors.bundle.js',
    './js/app.bundle.js',
    './js/script.js',
    './controllers/GlobalVars.js',
    './controllers/dbcalls.js',
    './controllers/CustomerVars.js',
    './controllers/classNavegar.js',
    './controllers/classDb.js',
    './controllers/apicallsx.js',
    './controllers/apiGate.js',
    './controllers/syncQueue.js',
    './models/classTipoDocumentos.js',
    './models/classEmpleados.js',
    './views/login/index.js',
    './views/programador.js',
    './views/config.js',
    './views/vendedor/clientes.js',
    './views/vendedor/censo.js',
    './views/vendedor/facturacion.js',
    './views/vendedor/mapaclientes.js',
    './views/vendedor/reparto.js',
    './views/vendedor/logro.js',
    './views/vendedor/registro_visitas.js',
    './views/pedidos/vendedor.js',
    './views/reportes/view_reportes.js',
    './views/repartidor/repartidor.js',
    './views/supervisor/ventas.js',
    './views/supervisor/cobertura.js',
    './views/supervisor/mapa.js',
    './views/supervisor/horarios.js',
    './views/supervisor/precios.js',
    './views/supervisor/cotizaciones.js',
    './views/supervisor/usuarios.js',
    './views/supervisor/objetivos.js',
    './views/supervisor/logro_objetivos.js',
    './views/admin/inicio.js',
    './views/admin/usuarios.js',
    './views/admin/basedatos.js',
    './img/logoag.png',
    './img/mercados.png',
    './img/usericon.png',
    './img/logo.png',
    './img/cog.png',
    './img/favicon.png'
];

function isApiRequest(url) {
    const path = url.pathname.toLowerCase();
    if (path === '/sede' || path === '/test_service') return true;
    return API_PREFIXES.some((prefix) => path === prefix.slice(0, -1) || path.startsWith(prefix));
}

function isHtmlRequest(request, url) {
    if (request.mode === 'navigate') return true;
    const accept = request.headers.get('accept') || '';
    return accept.includes('text/html');
}

async function precacheOne(cache, asset) {
    try {
        const response = await fetch(new Request(asset, { cache: 'reload' }));
        if (response && response.ok) {
            await cache.put(asset, response);
        }
    } catch (e) {}
}

async function matchShell(request) {
    const hit = await caches.match(request, { ignoreSearch: true });
    if (hit) return hit;
    if (request.mode === 'navigate') {
        return (await caches.match('./index.html'))
            || (await caches.match('/index.html'))
            || (await caches.match('/'));
    }
    return null;
}

async function networkFirstShell(request) {
    try {
        const response = await fetch(request);
        if (response && response.ok && response.type !== 'opaque') {
            const cache = await caches.open(shellCacheName);
            await cache.put(request, response.clone());
        }
        return response;
    } catch (e) {
        const cached = await matchShell(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
            const offline = await caches.match('./offline.html');
            if (offline) return offline;
        }
        return new Response('offline', { status: 503, statusText: 'offline' });
    }
}

self.addEventListener('install', function (event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(shellCacheName).then(function (cache) {
            return Promise.all(precacheAssets.map((asset) => precacheOne(cache, asset)));
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys
                .filter((key) => key !== shellCacheName)
                .map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', function (event) {
    const request = event.request;
    if (!request || request.method !== 'GET') return;

    let url;
    try {
        url = new URL(request.url);
    } catch (e) {
        return;
    }
    if (url.origin !== self.location.origin) return;

    // Datos en vivo: siempre red, nunca caché (cotizaciones, precios, visitas, etc.)
    if (isApiRequest(url)) {
        event.respondWith(
            fetch(request).catch(function () {
                return new Response(JSON.stringify({ error: 'offline' }), {
                    status: 503,
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    event.respondWith(networkFirstShell(request));
});
