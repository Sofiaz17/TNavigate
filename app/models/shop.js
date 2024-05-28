var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up mongoose model for Shop
module.exports = mongoose.model('Shop', new Schema({ 
	name: String,
	owner: String,
	address: String,
	civico: Number,
	cap: Number,
	city: String,
	provincia: String,
	coordinates: [Number],
	category: {
		type: String,
		enum: ['supermercato' ,
				'farmacia' ,
				'abbigliamento',
				'ferramenta' ,
				'elettronica' ,
				'ristorazione' ,
				'alimentari' ,
				'sport' ,
				'cartoleria' ,
				'ortofrutta' ,
				'gelateria']
	},
	information: String
}));