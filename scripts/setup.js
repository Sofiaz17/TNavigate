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
		address: 'Piazza Giannantonio Manci, 8, 38123 Povo TN',
		category: 'supermercato',
		coordinates: [46.059392,11.1330611],
		opening_hours:[
			  {
				day: 'LUN',
				state: 'open',
				periods:[{
					startHours: 8,
					startMinutes: 0,
					  endHours: 20,
					  endMinutes: 0
				  }],
			  },
			  {
				day: 'MAR',
				state: 'open',
				periods:[{
					startHours: 8,
					startMinutes: 0,
					  endHours: 20,
					  endMinutes: 0
				  }],
			  },
			  {
				day: 'MER',
				state: 'open',
				periods:[{
					startHours: 8,
					startMinutes: 0,
					  endHours: 20,
					  endMinutes: 0
				  }],
			  },
			  {
				day: 'GIO',
				state: 'open',
				periods:[{
					startHours: 8,
					startMinutes: 0,
					  endHours: 20,
					  endMinutes: 0
				  }],
			  },
			  {
				day: 'VEN',
				state: 'open',
				periods:[{
					startHours: 8,
					startMinutes: 0,
					  endHours: 20,
					  endMinutes: 0
				  }],
			  },
			  {
				day: 'SAB',
				state: 'open',
				periods:[{
					startHours: 8,
					startMinutes: 0,
					  endHours: 20,
					  endMinutes: 0
				  }],
			  },
			  {
				day: 'DOM',
				state: 'open',
				periods:[{
					startHours: 8,
					startMinutes: 0,
					  endHours: 20,
					  endMinutes: 0
				  }],
			  }]
	
});
	return coop.save();
}).then( () => {
	console.log('shop Coop saved successfully');
}).then( () => {
	var farmacia = new Shop({ 
		name: 'Farmacia Igea',
		address: 'Via Milano, 66/68, 38122 Trento TN',
		category: 'farmacia',
		coordinates: [46.0609025,11.1255008],
		opening_hours:[
			{
			  day: 'LUN',
			  state: 'open',
			  periods:[{
				startHours: 8,
				startMinutes: 30,
			  	endHours: 12,
			  	endMinutes: 30
			  },
			  {
				startHours: 15,
				startMinutes: 0,
			  	endHours: 19,
			  	endMinutes: 0
			  }]
			},
			{
			  day: 'MAR',
			  state: 'open',
			  periods:[{
				startHours: 8,
				startMinutes: 30,
			  	endHours: 12,
			  	endMinutes: 30
			  },
			  {
				startHours: 15,
				startMinutes: 0,
			  	endHours: 19,
			  	endMinutes: 0
			  }]
			},
			{
			  day: 'MER',
			  state: 'open',
			  periods:[{
				startHours: 8,
				startMinutes: 30,
			  	endHours: 12,
			  	endMinutes: 30
			  },
			  {
				startHours: 15,
				startMinutes: 0,
			  	endHours: 19,
			  	endMinutes: 0
			  }]
			},
			{
			  day: 'GIO',
			  state: 'open',
			  periods:[{
				startHours: 8,
				startMinutes: 30,
			  	endHours: 12,
			  	endMinutes: 30
			  },
			  {
				startHours: 15,
				startMinutes: 0,
			  	endHours: 19,
			  	endMinutes: 0
			  }]
			},
			{
			  day: 'VEN',
			  state: 'open',
			  periods:[{
				startHours: 8,
				startMinutes: 30,
			  	endHours: 12,
			  	endMinutes: 30
			  },
			  {
				startHours: 15,
				startMinutes: 0,
			  	endHours: 19,
			  	endMinutes: 0
			  }]
			},
			{
			  day: 'SAB',
			  state: 'open',
			  periods:[{
				startHours: 8,
				startMinutes: 30,
			  	endHours: 12,
			  	endMinutes: 30
			  },
			  {
				startHours: 15,
				startMinutes: 0,
			  	endHours: 19,
			  	endMinutes: 0
			  }]
			},
			{
			  day: 'DOM',
			  state: 'closed'
			}]
	});
	return farmacia.save();
}).then( () => {
	console.log('shop Farmacia Igea saved successfully');
	//process.exit();
}).then( () => {
	var conad = new Shop({ 
		name: 'Conad',
		address: 'Via Roberto da Sanseverino, 97, 38122 Trento TN',
		category: 'supermercato',
		opening_hours:[
			{
			  day: 'LUN',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			},
			{
			  day: 'MAR',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			},
			{
			  day: 'MER',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			},
			{
			  day: 'GIO',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			},
			{
			  day: 'VEN',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			},
			{
			  day: 'SAB',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			},
			{
			  day: 'DOM',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			}]
	});
	return conad.save();
}).then( () => {
	console.log('shop Conad saved successfully');
	//process.exit();
}).then( () => {
	var aldi = new Shop({ 
		name: 'Aldi',
		address: 'Corso 3 Novembre 1918, 59, 38122 Trento TN',
		category: 'supermercato',
		opening_hours:[
			{
			  day: 'LUN',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			},
			{
			  day: 'MAR',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			},
			{
			  day: 'MER',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			},
			{
			  day: 'GIO',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			},
			{
			  day: 'VEN',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			},
			{
			  day: 'SAB',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 0,
					endHours: 20,
					endMinutes: 0
				}],
			},
			{
			  day: 'DOM',
			  state: 'open',
			  periods:[{
				  startHours: 8,
				  startMinutes: 30,
					endHours: 20,
					endMinutes: 0
				}],
			}]
	});
	return aldi.save();
}).then( () => {
	var coop = new Shop({ 
		name: 'Coop',
		address: 'Via Brigata Acqui, 2, 38122 Trento TN',
		category: 'supermercato',
		opening_hours:[
			{
			  day: 'LUN',
			  state: 'open',
			  periods:[{
				  startHours: 7,
				  startMinutes: 30,
					endHours: 19,
					endMinutes: 30
				}],
			},
			{
			  day: 'MAR',
			  state: 'open',
			  periods:[{
				  startHours: 7,
				  startMinutes: 30,
					endHours: 19,
					endMinutes: 30
				}],
			},
			{
			  day: 'MER',
			  state: 'open',
			  periods:[{
				  startHours: 7,
				  startMinutes: 30,
					endHours: 19,
					endMinutes: 30
				}],
			},
			{
			  day: 'GIO',
			  state: 'open',
			  periods:[{
				  startHours: 7,
				  startMinutes: 30,
					endHours: 19,
					endMinutes: 30
				}],
			},
			{
			  day: 'VEN',
			  state: 'open',
			  periods:[{
				  startHours: 7,
				  startMinutes: 30,
					endHours: 19,
					endMinutes: 30
				}],
			},
			{
			  day: 'SAB',
			  state: 'open',
			  periods:[{
				  startHours: 7,
				  startMinutes: 30,
					endHours: 19,
					endMinutes: 30
				}],
			},
			{
			  day: 'DOM',
			  state: 'closed'
			}]
  });
  return coop.save();
}).then( () => {
	var laRomana = new Shop({ 
		name: 'La Romana',
		category: 'gelateria',
		address: 'Via Antonio Rosmini, 5, 38122 Trento TN',
		opening_hours:[
			{
			  day: 'LUN',
			  state: 'open',
			  periods:[{
				  startHours: 11,
				  startMinutes: 0,
					endHours: 23,
					endMinutes: 30
				}],
			},
			{
			  day: 'MAR',
			  state: 'open',
			  periods:[{
				  startHours: 11,
				  startMinutes: 0,
					endHours: 23,
					endMinutes: 30
				}],
			},
			{
			  day: 'MER',
			  state: 'open',
			  periods:[{
				  startHours: 11,
				  startMinutes: 0,
					endHours: 23,
					endMinutes: 30
				}],
			},
			{
			  day: 'GIO',
			  state: 'open',
			  periods:[{
				  startHours: 11,
				  startMinutes: 0,
					endHours: 23,
					endMinutes: 30
				}],
			},
			{
			  day: 'VEN',
			  state: 'open',
			  periods:[{
				  startHours: 11,
				  startMinutes: 0,
					endHours: 23,
					endMinutes: 59
				}],
			},
			{
			  day: 'SAB',
			  state: 'open',
			  periods:[{
				  startHours: 11,
				  startMinutes: 0,
					endHours: 23,
					endMinutes: 59
				}],
			},
			{
			  day: 'DOM',
			  state: 'open',
			  periods:[{
				  startHours: 11,
				  startMinutes: 0,
					endHours: 23,
					endMinutes: 30
				}],
			}]
  
	});
	return laRomana.save();
});

Product.deleteMany().then( () => {
	var fruttaFresca = new Product({ 
		name: 'frutta fresca',
		category: ['ortofrutta'],
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
	var sale = new Product({ 
		name: 'sale',
		category: ['supermercato'],
		keywords: ['sale grosso', 'sale fino', 'sale iodato', 'sale fino iodato']
	});
	return sale.save();
}).then( () => {
	var jeans = new Product({ 
		name: 'jeans',
		category: ['abbigliamento'],
		keywords: ['pantaloni', 'blue jeans']
	});
	return jeans.save();
}).then( () => {
	var cavoUSB = new Product({ 
		name: 'cavo USB',
		category: ['elettronica'],
		keywords: ['cavo', 'USB']
	});
	return cavoUSB.save();
}).then( () => {
	var chiaveInglese = new Product({ 
		name: 'chiave inglese',
		category: ['ferramenta'],
		keywords: ['chiave']
	});
	return chiaveInglese.save();
}).then( () => {
	var cacciavite = new Product({ 
		name: 'cacciavite',
		category: ['ferramenta'],
		keywords: ['cacciavite stella']
	});
	return cacciavite.save();
}).then( () => {
	var buscofen = new Product({ 
		name: 'buscofen',
		category: ['farmacia'],
		keywords: ['buscofen act']
	});
	return buscofen.save();
}).then( () => {
	var crepes = new Product({ 
		name: 'crepes',
		category: ['gelateria'],
		keywords: ['']
	});
	return crepes.save();
});