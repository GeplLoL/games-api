document.addEventListener('DOMContentLoaded', function() {
    const addGameForm = document.getElementById('addGameForm');
    const gamesList = document.getElementById('games');
    const searchForm = document.getElementById('searchForm');
    const filterForm = document.getElementById('filterForm');
    const editGameContainer = document.getElementById('editGameContainer');
    const editGameForm = document.getElementById('editGameForm');

    function fetchGames() {
        fetch('http://localhost:3000/api/games')
            .then(response => response.json())
            .then(games => displayGames(games))
            .catch(error => console.error('Error fetching games:', error));
    }

    function displayGames(games) {
        gamesList.innerHTML = '';
        games.forEach(game => {
            const li = document.createElement('li');

            // Kontainer mänguinfo jaoks
            const gameInfo = document.createElement('div');
            gameInfo.className = 'game-info';
            gameInfo.textContent = `${game.title} - ${game.genre} - Hinnang: ${game.rating}`;
            li.appendChild(gameInfo);

            // Nuppude kontainer
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'buttons-container';

            // Muutmisnupp
            const editButton = document.createElement('button');
            editButton.textContent = 'Muuda';
            editButton.onclick = () => loadGameForEdit(game);
            buttonsContainer.appendChild(editButton);

            // Kustutamisnupp
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Kustuta';
            deleteButton.onclick = () => deleteGame(game._id);
            buttonsContainer.appendChild(deleteButton);

            li.appendChild(buttonsContainer);
            gamesList.appendChild(li);
        });
    }

    addGameForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const gameData = {
            title: document.getElementById('title').value,
            genre: document.getElementById('genre').value,
            rating: document.getElementById('rating').value,
        };

        console.log('Adding game:', gameData);

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
                fetchGames();
            })
            .catch(error => {
                console.error('Error adding game:', error);
            });
    });

    function loadGameForEdit(game) {
        document.getElementById('editGameId').value = game._id;
        document.getElementById('editTitle').value = game.title;
        document.getElementById('editGenre').value = game.genre;
        document.getElementById('editRating').value = game.rating;

        editGameContainer.style.display = 'block';
    }

    editGameForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const gameId = document.getElementById('editGameId').value;
        const updatedGameData = {
            title: document.getElementById('editTitle').value,
            genre: document.getElementById('editGenre').value,
            rating: document.getElementById('editRating').value,
        };

        fetch(`http://localhost:3000/api/games/${gameId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedGameData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Game updated successfully:', data);
                editGameContainer.style.display = 'none';
                fetchGames();
            })
            .catch(error => {
                console.error('Error updating game:', error);
            });
    });

    function deleteGame(gameId) {
        fetch(`http://localhost:3000/api/games/${gameId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log(`Game with ID ${gameId} deleted successfully.`);
                fetchGames();
            })
            .catch(error => console.error('Error deleting game:', error));
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();

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
                    displayGames(games);
                })
                .catch(error => console.error('Error searching games:', error));
        });
    }

    if (filterForm) {
        filterForm.addEventListener('submit', function(event) {
            event.preventDefault();

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
    }

    // Kõikide mängude esialgne laadimine
    fetchGames();
});