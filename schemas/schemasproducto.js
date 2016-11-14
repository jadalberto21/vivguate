var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


var Schema = mongoose.Schema;



var publicaciones= new Schema({
		nombrePub: String,
		descripcionPub: String,
		departamentoPub: String,
		municipioPub: String,
		direccionPub:String,
		precio:Number,
		contextoPrecio: String,
		alquilerCompra: String,
		financiamientoPub:String,
		Fotografias: String,
		Fotografias1: String,
		Fotografias2: String,
		Fotografias3: String,
		Fotografias4: String,
		fechaPub: Date,
		estadoPub: String,
		sIduser: String
	});

var Publicacion = mongoose.model("Publicacion", publicaciones);
module.exports.Publicacion = Publicacion;
