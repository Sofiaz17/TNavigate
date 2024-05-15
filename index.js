const app = require('./app/app.js');
const mongoose = require('mongoose');
const setup = require('./scripts/setup.js');

/**
 * https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment#4-listen-on-the-correct-port
 */
const port = process.env.PORT || 3000;

const uri = 'mongodb+srv://giug:Rex.giugi03@giugdb.kpoknan.mongodb.net/pereCotte?retryWrites=true&w=majority&appName=giugDB'
/**
 * Configure mongoose
 */
// mongoose.Promise = global.Promise;
app.locals.db = mongoose.connect(uri)
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});