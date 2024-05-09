
const Path = require('path');

const express = require('express');
const app = express();
const cors = require("cors");

const shops = require('./shopsRouter.js');
const categs = require('./categoriesRouter.js');

var corsOptions = {
  origin: "http://localhost:8081"
};

//app.use(cors(corsOptions));


// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Serve front-end static files
 */
//const FRONTEND = process.env.FRONTEND || Path.join( __dirname, '..', 'node_modules', 'easylibvue', 'dist' );
//app.use('/EasyLibApp/', express.static( FRONTEND ));

// If process.env.FRONTEND folder does not contain index.html then use the one from static
app.use('/', express.static('static')); // expose also this folder

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Helloooo" });
});

app.use('/api/v1/shops', shops);
app.use('/api/v1/shopCategories', categs);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;