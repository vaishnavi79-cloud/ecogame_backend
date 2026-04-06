const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    icon: String,

    requiredPoints: {
        type: Number,
        required: true,
    },

    category: {
        type: String,
        enum: ['achievement', 'activity', 'special'],
        default: 'achievement',
    },

    rarity: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common',
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Badge', BadgeSchema);