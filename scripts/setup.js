require('dotenv').config()
var Shop   = require('../app/models/shop'); // get our mongoose model
var Product = require('../app/models/product');

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
}).then( () => {
	var aldi = new Shop({ 
		name: 'Aldi',
		address: 'Corso 3 novembre',
		category: 'supermercato'
	});
	return aldi.save();
}).then( () => {
	var coop = new Shop({ 
		name: 'Coop',
		address: 'Via Brigata Acqui',
		category: 'supermercato'
	});
	return coop.save();
}).then( () => {
	var laRomana = new Shop({ 
		name: 'La Romana',
		category: 'gelateria',
		address: 'Via Rosmini'
	});
	return laRomana.save();
});

Product.deleteMany().then( () => {
	var fruttaFresca = new Product({ 
		name: 'frutta fresca',
		category: ['supermercato','ortofrutta'],
		keywords: ['frutta', 'ortofrutta']
	});
	return fruttaFresca.save();
}).then( () => {
	console.log('frutta fresca saved successfully');
}).then( () => {
	var carnePollo = new Product({ 
		name: 'carne di pollo',
		category: ['supermercato'],
		keywords: ['carne', 'pollo', 'carne bianca', 'carne di pollo']
	});
	return carnePollo.save();
}).then( () => {
	var cavoUsb = new Product({ 
		name: 'cavo usb',
		category: ['elettronica'],
		keywords: ['cavo', 'usb']
	});
	return cavoUsb.save();
});