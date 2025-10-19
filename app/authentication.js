const express = require('express');
const router = express.Router();
const User = require('./models/user'); 
const jwt = require('jsonwebtoken'); 

/**
 * @swagger
 * /authentications:
 *   post:
 *     summary: Authenticate user and get token
 *     description: Authenticate user with email and password, return JWT token and user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 email:
 *                   type: string
 *                 id:
 *                   type: string
 *                 self:
 *                   type: string
 *                 userType:
 *                   type: string
 *                 name:
 *                   type: string
 *                 surname:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *       401:
 *         description: Authentication failed
 */
router.post('', async function(req, res) {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }

        // Find the user
        let user = await User.findOne({
            email: email.toLowerCase().trim()
        }).exec();
        
        // User not found
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }
        
        // Check if password matches using bcrypt
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }
        
        // If user is found and password is right, create a token
        var payload = {
            email: user.email,
            id: user._id.toString(),
            userType: user.userType
        }
        var options = {
            expiresIn: 86400 // expires in 24 hours
        }
        var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        res.json({
            token: token,
            id: user._id.toString(),
            email: user.email,
            userType: user.userType,
            name: user.name,
            surname: user.surname,
            phone: user.phone || '',
            address: user.address || '',
            self: "/api/v1/users/" + user._id
        });

    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            message: 'Internal server error during authentication'
        });
    }
});

module.exports = router;