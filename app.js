var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require('cloudinary');
var routes = require('./routes/index');
var users = require('./routes/users');
var Usuarios = require('./schemas/schemas').Usuarios;
var sesion = require('express-session');
var session_middleware = require('./middlewares/sesion');
var nodemailer = require('nodemailer');
var method_override = require('method-override');

//configuracion de acceso a la cuenta de cloudinary
cloudinary.config({
  cloud_name: "dgiytkbsh",
  api_key: "712791278117747",
  api_secret: "11Mtfo1e-o2xhl21puRml0FYkG4"
});

mongoose.connect ("mongodb://localhost/viviguate3"); //es la ruta de conecxion a mongodb como motor de BD

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//configuracion de la sesion de usuario
app.use(sesion({
  secret: "ViviGuate32016",
  resave: false,
  saveUninitialized: false
}));
//ruta de destino de las imagenes antes de cargar a cloudinary
app.use(multer({dest: "./uploads"}));


app.use('/', routes);
app.use('/users', session_middleware);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('ViviGuate - La Pagina que buscas No Fue Encontrada o No Esta Disponible, Inicia Sesion Para Acceder a la Plataforma');
  err.status = 404;
  next(err);
});

// --method override
app.use(method_override("_method"));

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
