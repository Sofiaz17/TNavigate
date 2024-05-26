const mongoose = require('mongoose');

// Define a schema for the time intervals
const timeIntervalSchema = new mongoose.Schema({
	day: {
	  type: String,
	 // required: true,
	  enum: ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM']
	},
	state: {
		type: String,
		enum: ['open', 'closed']
	},
	periods: [{
		startHours: {
			type: Number,
			min: 0,
			max: 23,
		  //  required: true
		  },
		  startMinutes: {
			type: Number,
			min: 0,
			max: 59,
		  //  required: true
		  },
		  endHours: {
			type: Number,
			min: 0,
			max: 23,
		  //  required: true
		  },
		  endMinutes: {
			type: Number,
			min: 0,
			max: 59,
		  //  required: true
		  }
	}]
  });
  


const shopSchema = new mongoose.Schema({
    name: String,
	owner: String,
	address: String,
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
	opening_hours: [{type: timeIntervalSchema}],
	dataModified: Boolean
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;