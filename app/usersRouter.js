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
                message: 'Validation error'
            });
        }

        // Validate userType
        if (!['base_user', 'shop_owner'].includes(userType)) {
            return res.status(400).json({
                message: 'Invalid user type'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Validation error'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                message: 'Email already exists'
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
            message: 'User registered successfully',
            user: {
                id: savedUser._id.toString(),
                userType: savedUser.userType,
                name: savedUser.name,
                surname: savedUser.surname,
                email: savedUser.email,
                phone: savedUser.phone || '',
                address: savedUser.address || ''
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error'
            });
        }

        // Handle duplicate key error (email)
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            message: 'Internal server error'
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
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - access denied
 *       404:
 *         description: User not found
 */
router.get('/:userId', tokenChecker, async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user is accessing their own profile
        if (req.loggedUser.id !== userId) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        // Find user by ID
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            id: user._id.toString(),
            userType: user.userType,
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone || '',
            address: user.address || ''
        });

    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update user profile
 *     description: Update user profile information
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - access denied
 *       404:
 *         description: User not found
 */
router.put('/:userId', tokenChecker, async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, surname, email, phone, address, currentPassword, newPassword } = req.body;

        // Check if user is updating their own profile
        if (req.loggedUser.id !== userId) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        // Find user by ID
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Check if email is being changed and if it already exists
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(400).json({
                    message: 'Email already exists'
                });
            }
        }

        // Handle password change
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    message: 'Current password is required to change password'
                });
            }

            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    message: 'Current password is incorrect'
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    message: 'New password must be at least 6 characters long'
                });
            }

            user.password = newPassword; // Will be hashed by pre-save middleware
        }

        // Update user fields
        if (name) user.name = name.trim();
        if (surname) user.surname = surname.trim();
        if (email) user.email = email.toLowerCase().trim();
        if (phone !== undefined) user.phone = phone ? phone.trim() : '';
        if (address !== undefined) user.address = address ? address.trim() : '';

        // Save updated user
        const updatedUser = await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id.toString(),
                userType: updatedUser.userType,
                name: updatedUser.name,
                surname: updatedUser.surname,
                email: updatedUser.email,
                phone: updatedUser.phone || '',
                address: updatedUser.address || ''
            }
        });

    } catch (error) {
        console.error('Update user profile error:', error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error'
            });
        }

        // Handle duplicate key error (email)
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete user account
 *     description: Delete user account permanently
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
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - access denied
 *       404:
 *         description: User not found
 */
router.delete('/:userId', tokenChecker, async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user is deleting their own account
        if (req.loggedUser.id !== userId) {
            return res.status(403).json({
                message: 'Access denied'
            });
        }

        // Find and delete user
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            message: 'Account deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

module.exports = router;
