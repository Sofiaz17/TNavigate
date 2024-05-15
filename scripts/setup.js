require('dotenv').config()
var UtenteBase   = require('../app/models/utenteBase'); // get our mongoose model

var mongoose    = require('mongoose');


// Clear users
UtenteBase.deleteMany().then( () => {
	var marco = new UtenteBase({ 
		email: 'marco@unitn.com',
		password: '123'
	});
	return marco.save();
}).then( () => {
	console.log('User marco@unitn.com saved successfully');
}).then( () => {
	var mario = new UtenteBase({ 
		email: 'mario.rossi@unitn.com',
		password: '123'
	});
	return mario.save();
}).then( () => {
	console.log('User mario.rossi@unitn.com saved successfully');
	//process.exit();
});