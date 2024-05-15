var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up mongoose model for UtenteBase
module.exports = mongoose.model('ShopOwner', new Schema({ 
	email: String,
	shop: String,
	password: String
}));