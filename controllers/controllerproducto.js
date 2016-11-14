var cloudinary = require('cloudinary');
var multer = require('multer');
var express = require('express').app;
var sesion = require('express-session');
var Usuarios = require('../schemas/schemas').Usuarios;
var Publicacion = require('../schemas/schemasproducto').Publicacion;
var dialog = require('dialog');



//controller de crear producto nuevo
exports.create = function(req, res){
	
		var datapublicacion = new Publicacion ({
		nombrePub: req.body.nombrePub,
		descripcionPub: req.body.descripcionPub,
		departamentoPub: req.body.departamentoPub,
		municipioPub: req.body.municipioPub,
		direccionPub: req.body.mapajs,
		precio:req.body.precio,
		contextoPrecio:req.body.contextoPrecio,
		alquilerCompra: req.body.alquilerCompra,
		financiamientoPub: req.body.financiamientoPub, 
		Fotografias: "Patito.jpg",
		Fotografias1: "Patito.jpg",
		Fotografias2: "Patito.jpg",
		Fotografias3: "Patito.jpg",
		Fotografias4: "Patito.jpg",
		fechaPub: req.body.fechaPub,
		estadoPub: req.body.estadoPub,
		sIduser: req.session.user_id
		
	});
	    if(!req.body.nombrePub || !req.body.descripcionPub || !req.body.departamentoPub || !req.body.municipioPub || !req.body.mapajs || !req.body.precio || !req.body.contextoPrecio || !req.body.alquilerCompra || !req.body.financiamientoPub || !req.body.fechaPub){
	       dialog.info('Debes Ingresar Todos Los Campos Solicitados', 'ViviGuate - Publicacion', function(err){
	            if (!err) res.redirect("publica");
	              })
	      }
	    else if(!req.files.image_avatar.path || !req.files.image_avatar1.path){
	        dialog.info('Debes subir Al menos dos imagenes', 'ViviGuate - Publicacion', function(err){
	                if (!err) res.redirect("/publicaciones");
	                })
	      }
	    else {      
	        cloudinary.uploader.upload(req.files.image_avatar.path,
	        function(result) { 
	          datapublicacion.Fotografias = result.url;
	            cloudinary.uploader.upload(req.files.image_avatar1.path,
	              function(result1) { 
	              datapublicacion.Fotografias1 = result1.url;
	                cloudinary.uploader.upload(req.files.image_avatar2.path,
	                  function(result2) { 
	                  datapublicacion.Fotografias2 = result2.url;
	                    cloudinary.uploader.upload(req.files.image_avatar3.path,
	                      function(result3) { 
	                      datapublicacion.Fotografias3 = result3.url;
	                        cloudinary.uploader.upload(req.files.image_avatar4.path,
	                          function(result4) { 
	                          datapublicacion.Fotografias4 = result4.url;
	                              datapublicacion.save(function(err){
	                              if(err){
	                                console.log(String(err));
	                              }else{
	                                console.log(datapublicacion);
	                                console.log("Publicacion Guardada");
	                                res.render("index");
	                                }
	                              });
	                          })
	                      })
	                  })
	              })
	        })
	    }
}


/*
		cloudinary.uploader.upload(req.files.image_avatar.path,
			function(result) { 
				datapublicacion.Fotografias = result.url;
				if(!req.body.nombrePub || !req.body.descripcionPub || !req.body.departamentoPub || !req.body.municipioPub || !req.body.direccionPub || !req.body.precio || !req.body.contextoPrecio || !req.body.alquilerCompra || !req.body.financiamientoPub || !req.body.fechaPub){
	            res.send("Ingresa Todos Los Campos Solicitados");
				}else{
					datapublicacion.save(function(err){
					if(err){
						console.log(String(err));
					}else{
						console.log(datapublicacion);
						console.log("Publicacion Guardada");
						res.render("index");
					}
				});
			}
		})
		*/
