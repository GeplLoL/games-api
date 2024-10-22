router.post('/', async (req, res) => {
    try {
        const game = new Game(req.body); // Create a new Game instance with the data from the request body
        await game.save(); // Save the game to MongoDB
        res.status(201).send(game);
    } catch (error) {
        res.status(400).send({ message: 'Error adding game', error });
    }
});