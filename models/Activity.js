
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['tree_planting', 'waste_segregation', 'water_conservation', 'energy_saving'],
        required: true,
    },
    pointsReward: {
        type: Number,
        required: true,
    },
    difficultyLevel: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    },
    duration: {
        type: Number,
        required: true, // in minutes
    },
    image: {
        type: String,
        default: null,
    },
    gameType: {
        type: String,
        enum: ['interactive_game', 'photo_proof', 'quiz'],
        default: 'photo_proof',
    },
    instructions: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Activity', ActivitySchema);