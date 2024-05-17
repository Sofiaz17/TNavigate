const app = require('./app/app.js');
const setup = require('./scripts/setup.js');
const mongoose = require('mongoose');


var Shop   = require('./app/models/shop');

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('| Connesso a MongoDB | HOST: localhost:27017');
  })
  .catch((error) => {
    console.log(
      '| Si è verificato un errore durante la connessione a MongoDB: ',
      error
    );
  });



const port = process.env.PORT || 3000;


/**
 * Configure mongoose
 */
// mongoose.Promise = global.Promise;
// app.locals.db = mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
// .then ( () => {
    
//     console.log("Connected to Database");
    
//     app.listen(port, () => {
//         console.log(`Server listening on port ${port}`);
//     });
    
// });

