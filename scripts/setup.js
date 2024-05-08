require('dotenv').config()
var Shop   = require('../app/models/shop'); // get our mongoose model

var mongoose = require('mongoose');
// connect to database
// mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
// .then ( () => {
// 	console.log("Connected to Database")
// });


// Clear users
Shop.deleteMany().then( () => {
	var coop = new Shop({ 
		name: 'Coop',
		address: 'Via Salè',
		category: 'supermercato'
	});
	return coop.save();
}).then( () => {
	console.log('shop Coop saved successfully');
}).then( () => {
	var farmacia = new Shop({ 
		name: 'Farmacia Igea',
		address: 'Via Milano',
		category: 'farmacia'
	});
	return farmacia.save();
}).then( () => {
	console.log('shop Farmacia Igea saved successfully');
	//process.exit();
}).then( () => {
	var conad = new Shop({ 
		name: 'Conad',
		address: 'Via Buc',
		category: 'supermercato'
	});
	return conad.save();
}).then( () => {
	console.log('shop Conad saved successfully');
	//process.exit();
});