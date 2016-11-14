
var sesion = require('express-session');
var Usuarios = require('../schemas/schemas').Usuarios;
var nodemailer = require('nodemailer');
var dialog = require('dialog');



//------controlador del registro de usuarios
exports.create = function(req, res) {
			var nusuarios = new Usuarios ({
		nombres: req.body.nombres,
		apellidos: req.body.apellidos,
		email: req.body.email,
		pass: req.body.pass,
		telefono: req.body.telefono,
		password_confirmation: req.body.password_confirmation
	});
		  Usuarios.findOne({email: req.body.email,}, function(err, usuario){
    		if(usuario){
    			dialog.info('Usuario ya Existe, Inicia Sesion Para Continuar', 'ViviGuate-Inicio de Sesion', function(err){
  				if (!err) res.render("sesion/index");
				})
    		}else if(!req.body.nombres || !req.body.apellidos || !req.body.email || !req.body.pass || !req.body.telefono || !req.body.password_confirmation){
			//res.send("Ingresa Todos Los Campos Solicitados");
			dialog.info('Por Favor Ingresa Todos Los campos Solicitados', 'ViviGuate-Inicio de Sesion', function(err){
  				if (!err) res.render("registro/index");
				})

		}else{
					if ((req.body.pass).length <= 7) {
							dialog.info('Tu contraseña debe poseer al menos 8 caracteres, Intentalo Nuevamente', 'ViviGuate', function(err){
		  				if (!err) res.render("registro/index");
						})
					}else if (req.body.pass != req.body.password_confirmation) {
							dialog.info('Tus contraseñas no coinciden, Intentalo Nuevamente', 'ViviGuate', function(err){
		  						if (!err) res.render("registro/index");
								})
					}else if (req.body.telefono <= 20000000 || req.body.telefono >= 79999999) {
							dialog.info('Tu numero de telefono no es correcto, Intentalo Nuevamente', 'ViviGuate', function(err){
		  						if (!err) res.render("registro/index");
								})
					}else{
							nusuarios.save(function(err) {
								if(err){
									console.log(String(err));
								}else{
								console.log(nusuarios);
								console.log("Se inserto el usuario");
								res.render("sesion/index");
								}
							});
						}
			
			}
  })
	
}
//-----------Fin-----------

exports.login = function(req, res) {
	Usuarios.findOne({
		email: req.body.email, 
		pass: req.body.pass},
		function(err, user){
			if(!req.body.email || !req.body.pass){
				console.log("Campo Vacio, Ingresa la informacion solicitada")
				//res.send("Campo Vacio, Ingresa la informacion solicitada");
				dialog.info('Campo Vacio, Ingresa toda la informacion solicitada.', 'ViviGuate-Inicio de Sesion', function(err){
				    if (!err) res.render("sesion/index");
				})
				}
			else if(err){
				console.log(String(err));
				console.log("Ingresa un mail")
				res.render("/");
			}else{
				if (!user) {
						console.log("ENtra al else");
						//res.send("La Informacion Ingresada No Coincide");
						dialog.info('La Informacion Ingresada No Coincide, Intentalo Nuevamente.', 'ViviGuate-Inicio de Sesion', function(err){
  						if (!err) res.render("sesion/index");
						})
					}else{
						console.log("ENtra al if");
						req.session.user_id = user._id;
						res.render("publicaciones/index");
						}	

			}
		});
}

//controler de recuperacion de contraseña
exports.recuperar = function(req, res) {
	Usuarios.findOne({
		email: req.body.email},
		function(err, mail){
			if(!req.body.email){
				console.log("Campo Vacio, Ingresa la informacion solicitada")
				//res.send("Campo Vacio, Ingresa la informacion solicitada");
				dialog.info('campo vacio, Ingresa Tu Correo Electronico', 'ViviGuate-Recuperar Contraseña', function(err){
  				if (!err) res.render("registro/recuperar");
				})
				}
			else if(err){
				console.log(String(err));
				console.log("Ingresa un mail")
				res.render("/");
			}else{
				if (!mail) {
						console.log("ENtra al else");
						//res.send("El Correo Ingresado no Esta Registrado");
						dialog.info('El Correo Ingresado No esta Registrado, Registrate Para Usar la Plataforma', 'ViviGuate-Recuperar Contraseña', function(err){
  						if (!err) res.render("registro/index");
						})
					}else{
						console.log("Correo Encontrado");
//****
						 var email = req.body.email;
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
							subject: "Recuperacion de Contraseña - ViviGuate", // Subject line
							html: "Este es un email enviado a peticion del Usuario, Su contraseña de acceso a la plataforma es: " + mail.pass // html body
						  }

										    
						  smtpTransport.sendMail(mailOptions, function(error, response){
						    if(error){
							  //res.send("ocurrio un error, intentalo mas tarde");
							  dialog.info('Ocurrio Un error, Intentalo mas Tarde.', 'ViviGuate-Recuperar Contraseña', function(err){
  								if (!err) res.render("registro/recuperar");
								})
							  console.log(error);
							}else{
							  //res.send("email enviado con exito")
							  dialog.info('Recuperacion exitosa, Revisa Tu Bandeja de entrada para ver tu contraseña.', 'ViviGuate-Recuperar Contraseña', function(err){
  								if (!err) res.render("sesion/index");
								})
							}

						  });	
						}else {
						  //res.send("El email no se valido Volver")
						  dialog.info('Email Incorrecto, Escribe un Email válido', 'ViviGuate-Recuperar Contraseña', function(err){
  							if (!err) res.render("registro/recuperar");
							})	
						}							
//****
						}	

			}
		});
}