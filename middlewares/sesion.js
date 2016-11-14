var sesion = require('express-session');

var Usuarios = require('../schemas/schemas').Usuarios;


module.exports = function(req, res, next){
	if (!req.session.user_id) {
		res.redirect("sesion/index");
		
	}else{
		Usuarios.findById(req.sesion.user_id, function(err, user){
			if(err){
				console.log(err);
				res.redirect("sesion/index");
			}else{
				res.locals = {user: user};
				console.log("paso la busqueda de usuario");
				next();

			}
		});
	}
}