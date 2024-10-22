document.addEventListener('DOMContentLoaded', function() {
    const addGameForm = document.getElementById('addGameForm');
    const gamesList = document.getElementById('games');

    function fetchGames() {
        fetch('http://localhost:3000/api/games')
            .then(response => response.json())
            .then(games => displayGames(games))
            .catch(error => console.error('Error fetching games:', error));
    }

    // Функция для отображения списка игр на странице
    function displayGames(games) {
        gamesList.innerHTML = '';
        games.forEach(game => {
            const li = document.createElement('li');
            li.textContent = `${game.title} - ${game.genre} - Rating: ${game.rating}`;

            // Добавление кнопки удаления для каждой игры
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteGame(game._id);
            li.appendChild(deleteButton);

            gamesList.appendChild(li);
        });
    }

    // Обработчик для добавления новой игры через форму
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
});
