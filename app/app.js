const Path = require('path');

const express = require('express');
const app = express();
const cors = require('cors')

const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');

const students = require('./utentiBase.js');
const shops = require('./shops.js');


/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/**
 * CORS requests
 */
app.use(cors())

/**
 * Serve front-end static files
 */
//const FRONTEND = process.env.FRONTEND || Path.join( __dirname, '..', 'node_modules', 'easylibvue', 'dist' );
//app.use('/EasyLibApp/', express.static( FRONTEND ));

// If process.env.FRONTEND folder does not contain index.html then use the one from static
app.use('/', express.static('static')); // expose also this folder

/**
app.use('./tokenChecker.js', function (req, res, next) {
    console.log("Authenticate and Redirect")
    res.redirect('../static/login.html');
    next();
});
*/

app.get('/login.html', function (req, res) {
    res.sendFile(path.join(__dirname, '../static/login.html'));
});

/** 
app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});
*/

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

/**
 * Authentication routing and middleware
 */
app.use('/api/v1/authentications', authentication);

// Protect booklendings endpoint
// access is restricted only to authenticated users
// a valid token must be provided in the request
//app.use('/api/v1/booklendings', tokenChecker);
app.use('/api/v1/utentiBase/me', tokenChecker);
 
/**
 * Resource routing
 */

app.use('/api/v1/shops', shops);
app.use('/api/v1/utentiBase', students);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;