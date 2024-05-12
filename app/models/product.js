const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
	category: { 
		type: [String],
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
	},
    keywords: [String]
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
