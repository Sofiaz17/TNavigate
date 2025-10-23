const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("FATAL ERROR: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not defined in your .env file. Please check your configuration.");
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/authentications/google/callback",
    scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            // Existing user - just return it
            return done(null, user);
        } else {
            // New user - create a partial user object
            // userType will be set in the callback route
            const newUser = new User({
                googleId: profile.id,
                name: profile.name.givenName,
                surname: profile.name.familyName,
                email: profile.emails[0].value,
            });
            return done(null, newUser, { newUser: true });
        }
    } catch (err) {
        return done(err, null);
    }
}
));

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user.id); // Store only user ID in session
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user); // Attach full user object to req.user
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
