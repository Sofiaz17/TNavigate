
const Path = require('path');

const express = require('express');
const app = express();
const cors = require("cors");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const passport = require('./google-auth.js');


const shops = require('./shopsRouter.js');
const categs = require('./categoriesRouter.js');
const prods = require('./productsRouter.js');
const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');
const utentiBase = require('./utentiBase.js');
const users = require('./usersRouter.js');
const favorites = require('./favoritesRouter.js');

var corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND || 'http://Sofiaz17.github.io/TNavigateVue/') 
    : '*', // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());




// app.use(function (req, res, next) { // Add headers before the routes are defined
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', "https://github.com/Sofiaz17/TNavigateApp.git");
//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   // Pass to next layer of middleware
//   next();
// });
  

app.use(cors(corsOptions));

/**
 * Serve front-end static files
 */
const FRONTEND = process.env.FRONTEND || Path.join( __dirname, '..', 'node_modules', 'tnavigatevue', 'dist' );
console.log('FRONTEND: '+ FRONTEND);
app.use('/TNavigateApp/', express.static( FRONTEND ));

// If process.env.FRONTEND folder does not contain index.html then use the one from static
//app.use('/', express.static('static')); // expose also this folder


app.use((req,res,next) => {
  console.log(req.method + ' ' + req.url)
  next()
})

// set port, listen for requests
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

app.use('./tokenChecker.js', function (req, res, next) {
  console.log("Authenticate and Redirect")
  res.redirect('../static/login.html');
  next();
});



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

app.use('/api/v1/shops', shops);
app.use('/api/v1/shopCategories', categs);
app.use('/api/v1/products', prods);
// Authentication routing and middleware
app.use('/api/v1/authentications', authentication);
// User favorites routes - mount first
app.use('/api/v1/users', favorites);
// User management routes
app.use('/api/v1/users', users);
// Access is restricted only to authenticated users a valid token must be provided in the request
app.use('/api/v1/utentiBase/me', tokenChecker);
// Resource routing
app.use('/api/v1/utentiBase', utentiBase);

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

/* Default error handler */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;