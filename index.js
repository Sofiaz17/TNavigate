const app = require('./app/app.js');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

// Import routers
const authentication = require('./app/authentication.js');
const shops = require('./app/shopsRouter.js');
const categs = require('./app/categoriesRouter.js');
const prods = require('./app/productsRouter.js');
const tokenChecker = require('./app/tokenChecker.js');
const utentiBase = require('./app/utentiBase.js');
const users = require('./app/usersRouter.js');
const favorites = require('./app/favoritesRouter.js');


mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('| Connesso a MongoDB | HOST: localhost:27017');

    // Configure express-session with MongoStore AFTER DB connection
    app.use(session({
        secret: process.env.SESSION_SECRET || 'your_default_secret',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            client: mongoose.connection.getClient(), // Use existing Mongoose connection
            collectionName: 'sessions',
            ttl: 14 * 24 * 60 * 60 // 14 days
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production' ? true : false,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'lax'
        },
        name: 'tnavigate.sid'
    }));

    // Initialize Passport AFTER session middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Mount authentication router AFTER passport setup
    app.use('/api/v1/authentications', authentication);

    // Mount all routers AFTER passport setup
    app.use('/api/v1/shops', shops);
    app.use('/api/v1/shopCategories', categs);
    app.use('/api/v1/products', prods);
    app.use('/api/v1/users', favorites);
    app.use('/api/v1/users', users);
    app.use('/api/v1/utentiBase/me', tokenChecker);
    app.use('/api/v1/utentiBase', utentiBase);


    // Mount 404 and error handlers LAST
    app.use((req, res) => {
        res.status(404).json({ error: 'Not found' });
    });

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Something broke!' });
    });

    // Start server AFTER all middleware/routes are registered
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}.`);
    });
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error);
  });

