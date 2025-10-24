const express = require('express');
const router = express.Router();
const UserFavorite = require('./models/userFavorite');
const Shop = require('./models/shop');
const tokenChecker = require('./tokenChecker');

/**
 * @swagger
 * components:
 *  schemas:
 *   UserFavorite:
 *      type: object
 *      required:
 *          - user_id
 *          - shop_id
 *      properties:
 *          user_id:
 *             type: string
 *             description: 'ID of the user'
 *          shop_id:
 *             type: string
 *             description: 'ID of the shop'
 *          created_at:
 *             type: string
 *             format: date-time
 *             description: 'When the favorite was created'
 *          updated_at:
 *             type: string
 *             format: date-time
 *             description: 'When the favorite was last updated'
 */

/**
 * @swagger
 * /users/me/favorites:
 *   get:
 *     summary: Get user's favorite shops
 *     description: Retrieve all favorite shops for the authenticated user
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: User's favorite shops retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favorites:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       address:
 *                         type: string
 *                       category:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/users/me/favorites', tokenChecker, async (req, res) => {
    try {
        const userId = req.loggedUser.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalFavorites = await UserFavorite.countDocuments({ user_id: userId });
        const totalPages = Math.ceil(totalFavorites / limit);

        // Get user's favorites with shop details
        const favorites = await UserFavorite.find({ user_id: userId })
            .populate('shop_id', 'name address category coordinates city provincia information')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Filter out favorites where shop might have been deleted
        const validFavorites = favorites.filter(fav => fav.shop_id);

        // Format response
        const formattedFavorites = validFavorites.map(fav => ({
            id: fav.shop_id._id.toString(),
            name: fav.shop_id.name,
            address: fav.shop_id.address,
            category: fav.shop_id.category,
            city: fav.shop_id.city,
            provincia: fav.shop_id.provincia,
            coordinates: fav.shop_id.coordinates,
            information: fav.shop_id.information,
            favorited_at: fav.createdAt
        }));

        res.status(200).json({
            favorites: formattedFavorites,
            pagination: {
                page,
                limit,
                total: totalFavorites,
                pages: totalPages
            }
        });

    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

/**
 * @swagger
 * /users/me/favorites:
 *   post:
 *     summary: Add shop to favorites
 *     description: Add a shop to the authenticated user's favorites
 *     parameters:
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
 *             required:
 *               - shop_id
 *             properties:
 *               shop_id:
 *                 type: string
 *                 description: ID of the shop to add to favorites
 *     responses:
 *       201:
 *         description: Shop added to favorites successfully
 *       400:
 *         description: Bad request - invalid shop ID or missing shop_id
 *       404:
 *         description: Shop not found
 *       409:
 *         description: Shop already in favorites
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post('/users/me/favorites', tokenChecker, async (req, res) => {
    try {
        const userId = req.loggedUser.id;
        const { shop_id } = req.body;

        // Validate input
        if (!shop_id) {
            return res.status(400).json({
                message: 'shop_id is required'
            });
        }

        // Validate shop_id format
        if (!shop_id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: 'Invalid shop_id format'
            });
        }

        // Check if shop exists
        const shop = await Shop.findById(shop_id);
        if (!shop) {
            return res.status(404).json({
                message: 'Shop not found'
            });
        }

        // Check if already in favorites
        const existingFavorite = await UserFavorite.findOne({
            user_id: userId,
            shop_id: shop_id
        });

        if (existingFavorite) {
            return res.status(409).json({
                message: 'Shop already in favorites'
            });
        }

        // Add to favorites
        const newFavorite = new UserFavorite({
            user_id: userId,
            shop_id: shop_id
        });

        await newFavorite.save();

        res.status(201).json({
            message: 'Shop added to favorites'
        });

    } catch (error) {
        console.error('Add favorite error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Shop already in favorites'
            });
        }

        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

/**
 * @swagger
 * /users/me/favorites/{shop_id}:
 *   delete:
 *     summary: Remove shop from favorites
 *     description: Remove a shop from the authenticated user's favorites
 *     parameters:
 *       - in: path
 *         name: shop_id
 *         required: true
 *         description: ID of the shop to remove from favorites
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
 *         description: Shop removed from favorites successfully
 *       404:
 *         description: Favorite not found
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.delete('/users/me/favorites/:shop_id', tokenChecker, async (req, res) => {
    try {
        const userId = req.loggedUser.id;
        const { shop_id } = req.params;

        // Validate shop_id format
        if (!shop_id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: 'Invalid shop_id format'
            });
        }

        // Find and delete the favorite
        const deletedFavorite = await UserFavorite.findOneAndDelete({
            user_id: userId,
            shop_id: shop_id
        });

        if (!deletedFavorite) {
            return res.status(404).json({
                message: 'Favorite not found'
            });
        }

        res.status(200).json({
            message: 'Shop removed from favorites'
        });

    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

/**
 * @swagger
 * /users/me/favorites/{shop_id}:
 *   get:
 *     summary: Check if shop is favorited
 *     description: Check if a specific shop is in the authenticated user's favorites
 *     parameters:
 *       - in: path
 *         name: shop_id
 *         required: true
 *         description: ID of the shop to check
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
 *         description: Favorite status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_favorite:
 *                   type: boolean
 *                 favorited_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Shop not found or not in favorites
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/users/me/favorites/:shop_id', tokenChecker, async (req, res) => {
    try {
        const userId = req.loggedUser.id;
        const { shop_id } = req.params;

        // Validate shop_id format
        if (!shop_id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: 'Invalid shop_id format'
            });
        }

        // Check if shop exists
        const shop = await Shop.findById(shop_id);
        if (!shop) {
            return res.status(404).json({
                message: 'Shop not found'
            });
        }

        // Check if in favorites
        const favorite = await UserFavorite.findOne({
            user_id: userId,
            shop_id: shop_id
        });

        if (!favorite) {
            return res.status(404).json({
                message: 'Shop not in favorites'
            });
        }

        res.status(200).json({
            is_favorite: true,
            favorited_at: favorite.createdAt
        });

    } catch (error) {
        console.error('Check favorite error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

module.exports = router;
