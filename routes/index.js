var express = require('express');
var router = express.Router();
var sesion = require('express-session');
var controller = require('../controllers/controllers');
var controllerproducto = require('../controllers/controllerproducto');
var Publicacion = require('../schemas/schemasproducto').Publicacion;
var Usuarios = require('../schemas/schemas').Usuarios;
var nodemailer = require('nodemailer');
var dialog = require('dialog');

var method_override = require('method-override');
var app = express();
app.use(method_override("_method"));


/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.user_id){
		res.render('index');
		console.log(req.session.user_id);
	}else{
//-- Busquedas de Publicaciones recientes
        Publicacion.find({
        fechaPub: {"$gt" : new Date("2016-11-1")}},
        function(err, productos){
          if(err){
            console.log(String(err));
            console.log("Error al Buscar Productos")
            res.render("/");
          }else{
            return res.render("index", {title: 'Home', productos: productos})

          }
        }).limit(3);
  }
});

router.get('/registro/index', function(req, res, next) {
  res.render('registro/index');
  
});

router.get('/registro/recuperar', function(req, res, next) {
  res.render('registro/recuperar');
  
});

router.post('/registro', controller.create);
router.post('/publicaciones', controllerproducto.create);

router.get('/sesion/index', function(req, res, next) {
  res.render('sesion/index');
  
});

router.post('/sesion', controller.login);

router.post('/recuperar', controller.recuperar);

router.get('/info/somos', function(req, res,next){
	res.render('info/somos');
});

/////Evaluar si esta parte se esta usando...... Creo que no
router.get('/perfil', function(req, res){
  Publicacion.find(req.session.user_id, function(err, doc){
    if(err){ console.log(err);}
    res.render("perfil/perfil", {productos: doc});
  });
});

router.get('/mias', function(req, res,next){
Publicacion.find({
        sIduser: req.session.user_id},
        function(err, productos){
          if(!req.session.user_id){
            console.log("Inicia Sesion Para Ver tus publicaciones")
            //res.render('sesion/index');
            //res.send("Inicia Sesion Para Ver tus publicaciones");
            dialog.info('Debes Iniciar Sesion para Ver Tus Publicaciones', 'ViviGuate', function(err){
            if (!err) res.render("sesion/index");
              })
            }
          else if(err){
            console.log(String(err));
            console.log("Error al Buscar Productos")
            res.render("/");
          }else{
            return res.render("publicaciones/homeUser", {title: 'Lista de Productos', productos: productos})

          }
        });
});


router.get('/publica', function(req, res,next){
Publicacion.find({
        sIduser: req.session.user_id},
        function(err, productos){
          if(!req.session.user_id){
            console.log("Inicia Secion para Publicar")
            //res.render('sesion/index');
            //res.send("Inicia Sesion para Publicar");
            dialog.info('Debes Iniciar Sesion para Publicar en la plataforma', 'ViviGuate', function(err){
            if (!err) res.render("sesion/index");
              })
            }
          else if(err){
            console.log(String(err));
            console.log("Error al Buscar Productos")
            res.render("/");
          }else{
            return res.render("publicaciones/index");

          }
        });
});
//-----------------Funcion para cerrar sesion
router.get('/salir', function(req, res,next){
  if (req.session.user_id) {
       req.session.user_id = null;
   res.render('index');
 }else{
          dialog.info('Debes Iniciar Sesion Usar esta Opcion', 'ViviGuate', function(err){
            if (!err) res.render("sesion/index");
              })
 }

});

//-----------------Funcion para editar producto
router.get('/publicaciones/editarProducto/:id', function(req, res,next){
  if (!req.session.user_id) {
       dialog.info('Debes Iniciar Sesion Usar esta Opcion', 'ViviGuate', function(err){
            if (!err) res.render("sesion/index");
              }) }else{
                var id_producto = req.params.id;
                Publicacion.findOne({"_id": id_producto}, function(err, publicado){
                  console.log("publicado");
                  res.render("publicaciones/editarProducto", {title: 'Lista de Productos', publicado: publicado})
                  })
          
              }
 })


router.post('/buscar/:id', function(req, res){
    var datapublicacion = ({
    nombrePub: req.body.nombrePub,
    descripcionPub: req.body.descripcionPub,
    departamentoPub: req.body.departamentoPub,
    municipioPub: req.body.municipioPub,
    direccionPub: req.body.direccionPub,
    precio:req.body.precio,
    contextoPrecio:req.body.contextoPrecio,
    alquilerCompra: req.body.alquilerCompra,
    financiamientoPub: req.body.financiamientoPub, 
    fechaPub: req.body.fechaPub,
    estadoPub: req.body.Pub,
    sIduser: req.session.user_id
    
  });
      Publicacion.update({"_id": req.params.id}, datapublicacion, function(publicado){
        res.render('index');
        });
});
//********************Fin de Edicion de Productos*******************************

//------------------Inicio de la eliminacion de Productos----------
router.get('/publicaciones/:id/eliminar', function(req, res,next){
  var id = req.params.id;
  Publicacion.findOne({"_id": id}, function(err, publicado){
    console.log("Encontrado");
    res.render("publicaciones/eliminarProducto", {title: 'Eliminar una publicacion', publicado: publicado})
  })
});

//detalle de producto
router.get('/Producto/:id', function(req, res,next){
  var id = req.params.id;
  Publicacion.findOne({"_id": id}, function(err, publicado){
    if(err){
       console.log(String(err));
       console.log("Error al Buscar Productos")
       res.render("/");
     }else {
        Usuarios.populate(publicado, {path: "sIduser"},
        function(err, publicado){
         console.log("Encontrado");
        return res.render("publicaciones/mostrarDetalle", {title: 'Detalle de Inmueble', publicado: publicado})
         }); }

  })
});

///--------Finde Detalle


///---------Eliminar Producto-------------------------
router.post('/eliminar/:id', function(req, res,next){
    var id = req.params.id;
    if(!req.body.pass){
      //res.send("Ingresa una contraseña Para continuar")
      dialog.info('Ingresa tu Contraseña Para continuar', 'ViviGuate - Eliminar Producto', function(err){
          if (!err) res.render("publicaciones/:id/eliminar");
        })

    }else {
       Usuarios.findOne({"_id": req.session.user_id}, function(err, usuario){
          console.log("Usuario Encontrado");
            if (req.body.pass != usuario.pass){
                //res.send("La contraseña Ingreasada no es correcta")
                dialog.info('La contraeña Ingresada no es Correcta', 'ViviGuate - Eliminar Producto', function(err){
                  if (!err) res.render("publicaciones/:id/eliminar");
                  })
            }else{
                Publicacion.remove({"_id": id}, function(err){
                console.log(err);
                res.redirect("/");
              });
            }
  })
    }
});


//********************Fin de la eliminacion de Productos*******************
//-----------------vista de reportes de problema
router.get('/reportar', function(req, res, next) {
  res.render('otros/reporteErrores');
  
});
///*****************Fin de vista de reportes de problema
//-----------------Funcion para Reporte de problemas--------------------
router.post('/btnreportar', function(req, res,next){
  if (!req.body.tituloProblema || !req.body.problema) {
    //res.send("Ingresa Toda la Informacion solicitada");
    dialog.info('Ingresa Toda La Informacion Solicitada', 'ViviGuate - Reporte de Problemas', function(err){
          if (!err) res.render("otros/reporteErrores");
        })
  }else{
      console.log("Listo para enviar mail");
//****
             var email = "prof.jadalberto@gmail.com";
            if( /(.+)@(.+){2,}\.(.+){2,}/.test(email) ){
              var smtpTransport = nodemailer.createTransport("SMTP",{
                service: "Gmail",
              auth: {
                user: "prof.jadalberto@gmail.com",
                pass: "juliansito"
              }
              });


              var mailOptions = {
                from: "prof.jadalberto@gmail.com", // sender address
              to: email, // list of receivers
              subject: "Reporte de Problema - ViviGuate", // Subject line
              html: "Es un gusto para mi hacer reporte del problema de tipo: " + req.body.tituloProblema + " que explico a continuacion: " + req.body.problema // html body
              }

                        
              smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                //res.send("ocurrio un error, intentalo mas tarde");
                dialog.info('Ha Ocurrido Un Problema, Intentalo Mas Tarde', 'ViviGuate - Reporte de Problemas', function(err){
                  if (!err) res.render("otros/reporteErrores");
                  })
                console.log(error);
              }else{
                //res.send("email enviado con exito")
                dialog.info('Email Enviado Con Exito', 'ViviGuate - Reporte de Problemas', function(err){
                  if (!err) res.render("otros/reporteErrores");
                  })
              }

              }); 
            }else {
              //res.send("El email no se valido Volver")  
              dialog.info('El Email No Se valido, Volver', 'ViviGuate - Reporte de Problemas', function(err){
                if (!err) res.render("otros/reporteErrores");
                })
            } 
  }
     res.render('index');
});
//**********************FIn de reportar**********************************

///------------------Inicio Busqueda de publicacion----------------------------
router.post('/buscar', function(req, res, next) {
//---------------------------Busqueda que muestra la informacion del usuario quien Publico el inmueble-----------

Publicacion.find({
                  departamentoPub: req.body.departamentoPub, alquilerCompra: req.body.alquilerCompra, contextoPrecio: req.body.contextoPrecio}, 
                  function(err, productos) {
                          if(!req.body.departamentoPub || !req.body.alquilerCompra || !req.body.contextoPrecio){
                           console.log("Ingresa Todos los valores solicitados")
                            //res.send("Ingresa Todos los valores solicitados");
                            dialog.info('Ingresa Todos los valores solicitados', 'ViviGuate', function(err){
                            if (!err) res.render("index");
                             })
                            }else if(err){
                              console.log(String(err));
                              console.log("Error al Buscar Productos")
                              res.render("/");
                              }
                                else {
                                 Usuarios.populate(productos, {path: "sIduser"},
                                 function(err, productos){
                                 //res.status(200).send(productos);
                                return res.render("busquedas/busqueda", {title: 'Lista de Productos', productos: productos})
                                  }); }
                 });
//----------------------Fin de Segmento de Codigo------------------------------------------------
/*
//--------------Funcional al 90%  No Muesta Informacion del usuario que lo publico-----------------
Publicacion.find({
        departamentoPub: req.body.departamentoPub, alquilerCompra: req.body.alquilerCompra, contextoPrecio: req.body.contextoPrecio},
        function(err, productos){
          if(!req.body.departamentoPub || !req.body.alquilerCompra || !req.body.contextoPrecio){
            console.log("Ingresa Todos los valores solicitados")
            //res.render('sesion/index');
            res.send("Ingresa Todos los valores solicitados");
            }
          else if(err){
            console.log(String(err));
            console.log("Error al Buscar Productos")
            res.render("/");
          }else{
             return res.render("busquedas/busqueda", {title: 'Lista de Productos', productos: productos})

          }
        });  
//---------------------------------Fin de Segmento de Codigo ----------------------------------
*/

});


module.exports = router;
