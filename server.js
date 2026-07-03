try {
  process.loadEnvFile() //process.loadEnvFile(['./dev.env','./dev2.env'])
  
} catch (error) {
  
}

var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

const execute = require('./router/connection');
var routerNoticias = require('./router/routerNoticias');
var routerVentas = require('./router/routerVentas');
var routerSucursales = require('./router/routerSucursales');
let routerRepartidor = require('./router/routerRepartidor');
var routerTipoDocs = require('./router/routerTipoDocs');
var routerEmpleados = require('./router/routerEmpleados');
var routerClientes = require('./router/routerClientes');
var routerProductos = require('./router/routerProductos');
let routerDigitacion = require('./router/routerDigitacion');
let routerUsuarios = require('./router/routerUsuarios');
let routerCenso = require('./router/routerCenso');
let router_reportes= require('./router/router_reportes');

var http = require('http').Server(app);
//var io = require('socket.io')(http);
var io = require('socket.io')(http, { cors: { origin: '*' } });


const PORT = process.env.PORT || 5400;

const cors = require('cors');
app.use(cors({
    origin: '*' //orign: ["www.app1.com","www.app2.com"]
}));

app.use(bodyParser.json());

function createRateLimiter(options) {
  const windowMs = options.windowMs || 60000;
  const max = options.max || 30;
  const buckets = new Map();

  return function rateLimiter(req, res, next) {
    const key = options.keyGenerator ? options.keyGenerator(req) : req.ip;
    const now = Date.now();
    const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);

    if (hits.length >= max) {
      return res.status(429).json({ error: 'too_many_requests', message: 'Demasiadas peticiones. Intente más tarde.' });
    }

    hits.push(now);
    buckets.set(key, hits);
    next();
  };
}

const loginLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => `${req.ip}:${req.query.user || req.body.user || ''}`
});

const writeLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 15,
  keyGenerator: (req) => `${req.ip}:${req.body.codven || req.body.usuario || ''}`
});

const catalogLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => `${req.ip}:${req.body.sucursal || req.query.sucursal || ''}`
});

const clientesDownloadLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    const codven = req.body.codven || req.body.usuario || req.body.codemp || '';
    const sucursal = req.body.sucursal || req.query.sucursal || '';
    return `clientes:${sucursal}:${codven}`;
  }
});

app.use('/empleados/login', loginLimiter);
app.use('/ventas/insertventa', writeLimiter);
app.use('/ventas/descargar_catalogo', catalogLimiter);
app.use('/clientes/descargar_clientes_ruta', clientesDownloadLimiter);

app.use(express.static('build'));

var path = __dirname + '/'

//manejador de rutas
router.use(function (req,res,next) {
 
  next();
});

app.get("/",function(req,res){
  execute.start();
	res.sendFile(path + 'index.html');

}); 

app.get("/sede",function(req,res){
 
	res.send(process.env.SUCURSAL);
  
}); 

app.get("/login",function(req,res){
  res.redirect('/');
}); 

app.get("/test_service",function(req,res){
  res.send('ONLINE')
}); 


//Router para SUCURSALES
app.use('/sucursales', routerSucursales);

//Router para app NOTICIAS
app.use('/noticias', routerNoticias);

//Router para app CENSO
app.use('/censo', routerCenso);

//Router para app VENTAS
app.use('/ventas', routerVentas);

//Router para app REPARTIDOR
app.use('/repartidor', routerRepartidor);

// Router para Tipodocumentos
app.use('/tipodocumentos', routerTipoDocs);

// Router para empleados o vendedores
app.use('/empleados', routerEmpleados);

// Router para clientes
app.use('/clientes', routerClientes);

// Router para productos
app.use('/productos', routerProductos);

// Router para digitacion
app.use('/digitacion', routerDigitacion);

// Router para usuarios
app.use('/usuarios', routerUsuarios);


// Router para reportes de bi
app.use('/reportes', router_reportes);


app.use("/",router);

app.use("*",function(req,res){
  res.redirect('/');
  //res.send('<h1 class="text-danger">NO DISPONIBLE</h1>');
});




// SOCKET HANDLER
io.on('connection', function(socket){
  
  socket.on('avisos', (tipo,mensaje)=>{
    io.emit('avisos', tipo, mensaje);
  });

  socket.on('noticias nueva', (msg,usuario)=>{
    io.emit('noticias nueva', msg,usuario);
  });

  socket.on('productos precio', function(msg,usuario){
	  io.emit('productos precio', msg, usuario);
  });

  socket.on('productos bloqueado', function(msg,usuario){
	  io.emit('productos bloqueado', msg, usuario);
  });

  socket.on('ventas nueva', (msg,usuario)=>{
    io.emit('ventas nueva', msg,usuario);
  })

  // sucede cuando el repartidor marca un pedido y notifica a su respectivo vendedor
  socket.on('reparto pedidomarcado', (msg,status,vendedor)=>{
    io.emit('reparto pedidomarcado', msg,status,vendedor);
  })

  
});


http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});

