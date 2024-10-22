const express = require('express');
const Game = require('../models/game');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log('Request body:', req.body);
    try {
        const game = new Game(req.body);
        await game.save();
        res.status(201).json(game);
    } catch (error) {
        console.error('Error saving game:', error);
        res.status(400).json({ message: 'Error adding game', error: error.message });
    }
});



router.get('/', async (req, res) => {
    const { search } = req.query;
    try {
        const games = await Game.find({
            $or: [
                { title: new RegExp(search, 'i') },
                { genre: new RegExp(search, 'i') }
            ]
        });
        res.send(games);
    } catch (error) {
        res.status(500).send({ message: 'Error searching for games', error });
    }
});

router.get('/:gameId', async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);
        if (!game) return res.status(404).send({ message: 'Game not found' });
        res.send(game);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving game', error });
    }
});

router.put('/:gameId', async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.gameId, req.body, {
            new: true,
            runValidators: true
        });
        if (!game) return res.status(404).send({ message: 'Game not found' });
        res.send(game);
    } catch (error) {
        res.status(400).send({ message: 'Error updating game', error });
    }
});

router.delete('/:gameId', async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.gameId);
        if (!game) return res.status(404).send({ message: 'Game not found' });
        res.send({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting game', error });
    }
});

router.get('/filter', async (req, res) => {
    const { genre, minRating } = req.query;
    try {
        const filterCriteria = {};
        if (genre) filterCriteria.genre = new RegExp(genre, 'i');
        if (minRating) filterCriteria.rating = { $gte: Number(minRating) };

        const games = await Game.find(filterCriteria);
        res.send(games);
    } catch (error) {
        res.status(500).send({ message: 'Error filtering games', error });
    }
});

module.exports = router;
