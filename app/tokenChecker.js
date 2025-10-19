const jwt = require('jsonwebtoken'); 

const tokenChecker = function(req, res, next) {
    // Check for Bearer token in Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // If there is no token
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'No token provided.'
        });
    }

    // Decode token, verifies secret and checks exp
    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {			
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Failed to authenticate token.'
            });		
        } else {
            // if everything is good, save to request for use in other routes
            req.loggedUser = decoded;
            next();
        }
    });
};

module.exports = tokenChecker;