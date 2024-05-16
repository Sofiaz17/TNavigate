
const Path = require('path');

const express = require('express');
const app = express();
const cors = require("cors");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const shops = require('./shopsRouter.js');
const categs = require('./categoriesRouter.js');
const prods = require('./productsRouter.js');

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


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for shops',
    version: '1.0.0',
    description:
    'This is a REST API application made with Express.',
  },
  externalDocs: {                // <<< this will add the link to your swagger page
    description: "swagger.json", // <<< link title
    url: "/swagger.json"         // <<< and the file added below in app.get(...)
  },
    servers: [
      {
        url: 'http://localhost:3000/api/v1'
      },
    ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./app/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
console.log('swagger: ', swaggerSpec);
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

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api/v1/shops', shops);
app.use('/api/v1/shopCategories', categs);
app.use('/api/v1/products', prods);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;