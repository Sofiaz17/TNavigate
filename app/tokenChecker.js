const jwt = require('jsonwebtoken'); 

const tokenChecker = function(req, res, next) {
    // Accept token from multiple places for compatibility with various clients
    // 1) Authorization: Bearer <token>
    // 2) Authorization: <token>
    // 3) x-access-token header
    // 4) query parameter: ?token=...
    // 5) body.token

    const authHeader = req.headers && req.headers['authorization'];
    let token = null;

    if (authHeader) {
        const parts = authHeader.split(' ');
        token = parts.length === 2 ? parts[1] : parts[0];
    }

    // Fallbacks
    token = token || req.headers['x-access-token'] || req.query.token || req.body.token;

    if (!token) {
        return res.status(401).json({ 
            message: 'Unauthorized'
        });
    }

    // Verify token
    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {			
        if (err) {
            return res.status(401).json({
                message: 'Unauthorized'
            });		
        }

        req.loggedUser = decoded;
        next();
    });
};

module.exports = tokenChecker;