var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var dialog = require('dialog');

var Schema = mongoose.Schema;

//var email_match = [^[\\w-]+(\\.[\\w-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$, "Ingresa un Email Valido"];

var users = new Schema({
	nombres:String,
	apellidos:String,
	email:{type: String, require: "Este Campo es obligatorio"},
	pass:{
		type: String, 
		minlength: [8, "Ingresa una contraseña mayor de 8 caracteres"],
		validate: {
			validator: function(p){
				return this.password_confirmation == p;
			},
			message: "Las Contrasenas no coinciden"
		}
	},
	telefono:{type: Number, min:[20000000, "Ingresa un Numero Valido"], max:[79999999, "Ingresa un Numero Valido"]},
	//photo: String,
	});


//validaciones con virtuals
users.virtual('password_confirmation').get(function(){
	return this.p_c;
}).set(function(pass){
	this.p_c = pass;
});



var Usuarios = mongoose.model("Usuarios", users);
module.exports.Usuarios = Usuarios;

/*
//------modelo de BD  propusto-----

var modeloviviguate =new Schema({
	nombres:String,
	apellidos:String,
	email:String,
	pass:String,
	telefono:Number
	publicaciones[{
		NombrePub: String,
		DescripcionPub: String,
		DepartamentoPub: String,
		MunicipioPub: String,
		DireccionPub:String.
		Precio: Number,
		ContectoPrecio: String,
		AlquilerCompra: String,
		Fotografias: [{img, img2, img3, img4, img5}],
		fechaPub: Date
	}]
});
module.exports = mongoose.model(ModeloViviguate, modeloviviguate);
*/