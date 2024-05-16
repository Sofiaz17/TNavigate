const Path = require('path');

const express = require('express');
const app = express();
const cors = require('cors')

const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');

const students = require('./utentiBase.js');
const shops = require('./shops.js');


// Configure Express.js parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// CORS requests
app.use(cors())

app.use('./tokenChecker.js', function (req, res, next) {
    console.log("Authenticate and Redirect")
    res.redirect('../static/login.html');
    next();
});

app.use('/', express.static('static'));

// Redirect to login..html 
app.get('/login.html', function (req, res) {
    res.sendFile(path.join(__dirname, '../static/login.html'));
});


app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

// Authentication routing and middleware
app.use('/api/v1/authentications', authentication);

// Access is restricted only to authenticated users a valid token must be provided in the request
app.use('/api/v1/utentiBase/me', tokenChecker);
 

// Resource routing
app.use('/api/v1/shops', shops);
app.use('/api/v1/utentiBase', students);

// Default 404 handler
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;