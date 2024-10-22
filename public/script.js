document.addEventListener('DOMContentLoaded', function() {
    const addGameForm = document.getElementById('addGameForm');
    const gamesList = document.getElementById('games');

    function displayGames(games) {
        gamesList.innerHTML = '';
        games.forEach(game => {
            const li = document.createElement('li');
            li.textContent = `${game.title} - ${game.genre} - Rating: ${game.rating}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteGame(game._id);
            li.appendChild(deleteButton);

            gamesList.appendChild(li);
        });
    }

    function fetchGames() {
        fetch('http://localhost:3000/api/games')
            .then(response => response.json())
            .then(games => displayGames(games))
            .catch(error => console.error('Error fetching games:', error));
    }

    addGameForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const gameData = {
            title: document.getElementById('title').value,
            genre: document.getElementById('genre').value,
            rating: document.getElementById('rating').value,
        };

        fetch('http://localhost:3000/api/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Game added successfully:', data);
                // Обновить список игр после добавления новой
                fetchGames();
            })
            .catch(error => {
                console.error('Error adding game:', error);
            });
    });

    function deleteGame(gameId) {
        fetch(`http://localhost:3000/api/games/${gameId}`, {
            method: 'DELETE',
        })
            .then(() => {
                console.log(`Game with ID ${gameId} deleted successfully.`);
                fetchGames();
            })
            .catch(error => console.error('Error deleting game:', error));
    }

    fetchGames();

    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем стандартное поведение формы

        const searchQuery = document.getElementById('searchQuery').value;

        fetch(`http://localhost:3000/api/games?search=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(games => {
                displayGames(games); // Отображаем результаты поиска
            })
            .catch(error => console.error('Error searching games:', error));
    });

    document.getElementById('filterForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем стандартное поведение формы

        const genre = document.getElementById('filterGenre').value;
        const minRating = document.getElementById('minRating').value;

        let query = 'http://localhost:3000/api/games?';
        const params = [];

        if (genre) {
            params.push(`genre=${encodeURIComponent(genre)}`);
        }
        if (minRating) {
            params.push(`minRating=${encodeURIComponent(minRating)}`);
        }

        if (params.length > 0) {
            query += params.join('&');
        }

        fetch(query, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(games => {
                displayGames(games);
            })
            .catch(error => console.error('Error filtering games:', error));
    });
});
