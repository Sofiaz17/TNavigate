const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
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
		enum : ['supermercato', 
				'farmacia',
				'abbigliamento',
				'ferramenta',
				'elettronica',
				'ristorazione',
				'alimentari',
				'sport',
			    'cartoleria',
			    'ortofrutta',
				'gelateria']
		//enum: categoryEnumSchema
	},
	information: String,
	dataModified: Boolean
});

const Shop = mongoose.model('Shop', shopSchema);
//const categEnum = mongoose.model("Category", categoryEnumSchema)
//.exports = Shop;
module.exports = Shop;
