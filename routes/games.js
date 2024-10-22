router.post('/', async (req, res) => {
    try {
        const game = new Game(req.body); // Create a new Game instance with the data from the request body
        await game.save(); // Save the game to MongoDB
        res.status(201).send(game);
    } catch (error) {
        res.status(400).send({ message: 'Error adding game', error });
    }
});

router.get('/:gameId', async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId); // Find the game by ID
        if (!game) return res.status(404).send({ message: 'Game not found' }); // Handle case if game not found
        res.send(game); // Send game details
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving game', error }); // Send error response
    }
});

router.put('/:gameId', async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.gameId, req.body, {
            new: true,
            runValidators: true,
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


