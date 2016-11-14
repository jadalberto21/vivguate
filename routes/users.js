var express = require('express');
var router = express.Router();
var sesion = require('express-session');



var controller = require('../controllers/controllers');
var controllerproducto = require('../controllers/controllerproducto');


router.get("/", function(req, res){
	res.render("publicaciones/index")
});

router.get('/perfil', function(req, res){
  Publicacion.find(({sIduser:req.sesion.user_id}), function(err, doc){
  	if(err){ console.log(err);}
  	res.render("perfil/perfil", {productos: doc});
  });
});


module.exports = router;
