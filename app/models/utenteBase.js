var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up mongoose model for UtenteBase
module.exports = mongoose.model('UtenteBase', new Schema({ 
	email: String, 
	username: String, 
	password: String
}));