document.addEventListener('DOMContentLoaded', function() {
    const addGameForm = document.getElementById('addGameForm');
    const gamesList = document.getElementById('games');
    const searchForm = document.getElementById('searchForm');
    const filterForm = document.getElementById('filterForm');

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

            const gameInfo = document.createElement('div');
            gameInfo.className = 'game-info';
            gameInfo.textContent = `${game.title} - ${game.genre} - Hinnang: ${game.rating}`;
            li.appendChild(gameInfo);

            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'buttons-container';

            const editButton = document.createElement('button');
            editButton.textContent = 'Muuda';
            editButton.onclick = () => loadGameForEdit(game);
            buttonsContainer.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Kustuta';
            deleteButton.onclick = () => deleteGame(game._id);
            buttonsContainer.appendChild(deleteButton);

            li.appendChild(buttonsContainer);
            gamesList.appendChild(li);
        });
    }

    // Обработчик для формы поиска
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Предотвращаем перезагрузку страницы

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
    }

    // Обработчик для формы фильтрации
    if (filterForm) {
        filterForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Предотвращаем перезагрузку страницы

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

    // Первоначальный вызов для загрузки списка игр
    fetchGames();
});
