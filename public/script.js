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

function fetchGames() {
    fetch('/api/games')
        .then(response => response.json())
        .then(games => {
            const gamesList = document.getElementById('games');
            gamesList.innerHTML = ''; // Clear previous games
            games.forEach(game => {
                const li = document.createElement('li');
                li.textContent = `${game.title} - ${game.genre} - Rating: ${game.rating}`;
                gamesList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching games:', error));
}

// Initially fetch games when page loads
fetchGames();

