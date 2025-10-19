const express = require('express');
const router = express.Router();
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const tokenChecker = require('./tokenChecker');

/**
 * @swagger
 * components:
 *  schemas:
 *   User:
 *      type: object
 *      required:
 *          - userType
 *          - name
 *          - surname
 *          - email
 *          - password
 *      properties:
 *          userType:
 *             type: string
 *             enum: ['base_user', 'shop_owner']
 *             description: 'Type of user'
 *          name:
 *             type: string
 *             description: 'First name of the user'
 *          surname:
 *             type: string
 *             description: 'Last name of the user'
 *          email:
 *             type: string
 *             description: 'Email address of the user'
 *          password:
 *             type: string
 *             description: 'Password of the user (minimum 6 characters)'
 *          phone:
 *             type: string
 *             description: 'Phone number of the user (optional)'
 *          address:
 *             type: string
 *             description: 'Address of the user (optional)'
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with user type selection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *       400:
 *         description: Bad request - validation error
 *       409:
 *         description: Conflict - email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', async (req, res) => {
    try {
        const { userType, name, surname, email, password, phone, address } = req.body;

        // Validate required fields
        if (!userType || !name || !surname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userType, name, surname, email, password'
            });
        }

        // Validate userType
        if (!['base_user', 'shop_owner'].includes(userType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid userType. Must be either "base_user" or "shop_owner"'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const newUser = new User({
            userType,
            name: name.trim(),
            surname: surname.trim(),
            email: email.toLowerCase().trim(),
            password,
            phone: phone ? phone.trim() : undefined,
            address: address ? address.trim() : undefined
        });

        // Save user (password will be hashed by pre-save middleware)
        const savedUser = await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: savedUser._id.toString()
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors
            });
        }

        // Handle duplicate key error (email)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error during registration'
        });
    }
});

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user profile
 *     description: Get user profile information by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
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
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - access denied
 *       404:
 *         description: User not found
 */
// Apply token checker middleware to protected routes
router.get('/:userId', tokenChecker, async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.loggedUser) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const { userId } = req.params;

        // Find user by ID
        const user = await User.findById(userId).select('-password -auth');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is accessing their own profile or has admin rights
        if (req.loggedUser.id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only view your own profile.'
            });
        }

        res.status(200).json({
            id: user._id.toString(),
            email: user.email,
            userType: user.userType,
            name: user.name,
            surname: user.surname,
            phone: user.phone || '',
            address: user.address || ''
        });

    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;
