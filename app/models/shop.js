const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Shop', new Schema({ 
	name: String,
	owner: String,
	address: String,
	coordinates: Number,
	category: { 
		type: String,
		enum : ['supermercato', 
				'farmacia',
				'abbigliamento',
				'ferramenta',
				'elettronica',
				'ristorazione',
				'alimentari',
				'sport']
	},
	information: String,
	dataModified: Boolean
}));