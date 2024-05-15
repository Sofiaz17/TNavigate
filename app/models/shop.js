var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up mongoose model for UtenteBase
module.exports = mongoose.model('Shop', new Schema({ 
	name: String,
	address: String
}));