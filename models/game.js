const mongoose = require('mongoose');

// Define the Game Schema
const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    releaseDate: {
        type: Date,
        default: Date.now
    }
});

// Create the Game model
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
