require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Подключаем CORS

// Инициализация Express приложения
const app = express();

// Используем CORS Middleware для всех маршрутов
app.use(cors());  // Добавляем CORS для разрешения кросс-доменных запросов

// Middleware для обработки JSON тел запросов
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Could not connect to MongoDB:', error));

// Маршруты
const gamesRouter = require('./routes/games');  // Подключаем файл с маршрутами
app.use('/api/games', gamesRouter);  // Настраиваем базовый маршрут для работы с играми

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
