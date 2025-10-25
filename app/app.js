
const Path = require('path');

const express = require('express');
const app = express();
const cors = require("cors");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Routers are imported but will be used in index.js
const shops = require('./shopsRouter.js');
const categs = require('./categoriesRouter.js');
const prods = require('./productsRouter.js');
const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');
const utentiBase = require('./utentiBase.js');
const users = require('./usersRouter.js');
const favorites = require('./favoritesRouter.js');

var corsOptions = {
  //origin: process.env.NODE_ENV === 'production' 
    //? (process.env.FRONTEND || 'https://sofiaz17.github.io') 
    //: '*', // Allow all origins in development
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

/**
 * Serve front-end static files
 */
const FRONTEND = process.env.FRONTEND || Path.join( __dirname, '..', 'node_modules', 'tnavigatevue', 'dist' );
console.log('FRONTEND: '+ FRONTEND);
app.use('/TNavigateApp/', express.static( FRONTEND ));

// If process.env.FRONTEND folder does not contain index.html then use the one from static
app.use('/', express.static('static')); // expose also this folder


app.use((req,res,next) => {
  console.log(req.method + ' ' + req.url)
  next()
})

const swaggerDefinition = require('./api-docs');

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./app/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

//
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 







// // Redirect to login..html 
// app.get('/login.html', function (req, res) {
//   res.sendFile(path.join(__dirname, '../static/login.html'));
// });

// app.get('/home.html', function (req, res) {
//   res.sendFile(path.join(__dirname, '../static/home.html'));
// });



// simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Helloooo" });
// });

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

module.exports = app;