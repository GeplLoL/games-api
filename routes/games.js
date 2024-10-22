const express = require('express');
const Game = require('../models/game');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const game = new Game(req.body);
        await game.save();
        res.status(201).json(game);
    } catch (error) {
        res.status(400).json({ message: 'Error adding game', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        console.log('Request query:', req.query); // Логируем параметры запроса
        const { search, genre, minRating } = req.query;
        const filterCriteria = {};

        if (search) {
            filterCriteria.title = new RegExp(search, 'i');
        }
        if (genre) {
            filterCriteria.genre = new RegExp(genre, 'i');
        }
        if (minRating) {
            filterCriteria.rating = { $gte: parseInt(minRating, 10) };
        }

        const games = await Game.find(filterCriteria);
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching games', error: error.message });
    }
});



router.put('/:gameId', async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.gameId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(game);
    } catch (error) {
        res.status(400).json({ message: 'Error updating game', error: error.message });
    }
});

router.delete('/:gameId', async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting game', error: error.message });
    }
});

module.exports = router;
