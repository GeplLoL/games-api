document.getElementById('addGameForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const gameData = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        rating: document.getElementById('rating').value,
    };

    // Send POST request to add the game
    fetch('/api/games', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
    })
        .then(response => response.json())
        .then(() => {
            fetchGames(); // Refresh games list to show the newly added game
        })
        .catch(error => console.error('Error adding game:', error));
});
