const mongoose = require('mongoose');

const userFavoriteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: [true, 'Shop ID is required'],
        index: true
    }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

// Add unique constraint to prevent duplicate favorites
userFavoriteSchema.index({ user_id: 1, shop_id: 1 }, { unique: true });

// Add compound index for better query performance
userFavoriteSchema.index({ user_id: 1, createdAt: -1 });

const UserFavorite = mongoose.model('UserFavorite', userFavoriteSchema);

module.exports = UserFavorite;
