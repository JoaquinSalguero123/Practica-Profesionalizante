// Elementos del DOM
const gameContainer = document.getElementById('game-container');
const input = document.getElementById('input');
const scoreElement = document.getElementById('score');
const maxScoreElement = document.getElementById('max-score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const usernameDisplay = document.getElementById('username-display');

// Variables del juego
let score = 0;
let interval;
let words = []; // Se cargan dinámicamente según la dificultad o archivo
let wordSpeed = 1;
let wordInterval = 3000; // Intervalo para lanzar palabras
let fallingWords = [];

// Variables para la máxima puntuación
let maxScore = 0;
let maxScorePlayer = 'Nadie';

// Cargar el nombre del usuario y la dificultad desde la URL
const params = new URLSearchParams(window.location.search);
const username = params.get('username');
const difficulty = params.get('difficulty');
const wordsFromFile = params.get('words'); // Palabras desde archivo si las hay
usernameDisplay.textContent = `Jugador: ${username}`;

// Si hay palabras en el archivo, usarlas. Si no, cargar desde la base de datos
if (wordsFromFile) {
    words = wordsFromFile.split(';'); // Palabras separadas por ';'
    startGame(); // Inicia el juego con las palabras del archivo
} else {
    loadWordsByDifficulty(); // Cargar palabras de la base de datos
}

// Función para cargar palabras según la dificultad desde la base de datos
function loadWordsByDifficulty() {
    fetch(`get_words.php?difficulty=${difficulty}`)
        .then(response => response.json())
        .then(data => {
            words = data;
            startGame();
        })
        .catch(error => console.error('Error al cargar las palabras:', error));
}

// Función para cargar la máxima puntuación desde el servidor
function loadMaxScore() {
    fetch('get_max_score.php')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
            } else {
                maxScore = data.maxima_puntuacion;
                maxScorePlayer = data.nombre;
                localStorage.setItem('maxScore', maxScore);
                localStorage.setItem('maxScorePlayer', maxScorePlayer);
                updateMaxScoreDisplay();
            }
        })
        .catch(error => console.error('Error al cargar la máxima puntuación:', error));
}

// Función para actualizar la visualización de la máxima puntuación
function updateMaxScoreDisplay() {
    maxScoreElement.textContent = `Máxima Puntuación: ${maxScore}  Jugador: ${maxScorePlayer}`;
}

// Función para iniciar el juego
function startGame() {
    score = 0;
    wordSpeed = 2;
    wordInterval = 2000;
    fallingWords = [];

    scoreElement.textContent = `Puntuación: ${score}`;
    updateMaxScoreDisplay();
    gameOverElement.classList.add('hidden');
    input.value = '';
    input.focus();

    interval = setInterval(dropWords, wordInterval);
    input.addEventListener('input', checkInput);
}

// Función para soltar palabras
function dropWords() {
    const word = words[Math.floor(Math.random() * words.length)];
    const wordElement = document.createElement('div');
    wordElement.classList.add('word');
    wordElement.textContent = word;
    wordElement.style.left = Math.random() * (gameContainer.offsetWidth - 250) + 'px';//estaba en 100
    wordElement.style.top = '0px';
    gameContainer.appendChild(wordElement);

    fallingWords.push({ element: wordElement, speed: wordSpeed });
}

// Función para mover palabras
function moveWords() {
    fallingWords.forEach((wordObj, index) => {
        let top = parseFloat(wordObj.element.style.top);
        if (top < gameContainer.offsetHeight - 50) {
            top += wordObj.speed;
            wordObj.element.style.top = top + 'px';
        } else {
            wordObj.element.remove();
            fallingWords.splice(index, 1); // Elimina la palabra de la lista
            gameOver();
        }
    });
}

// Función para verificar la entrada del usuario
function checkInput() {
    const enteredText = input.value.trim().toUpperCase();
    fallingWords.forEach((wordObj, index) => {
        if (wordObj.element.textContent.toUpperCase() === enteredText.toUpperCase()) {
            score++;
            scoreElement.textContent = `Puntuación: ${score}`;
            wordObj.element.remove();
            fallingWords.splice(index, 1); // Elimina la palabra de la lista
            input.value = '';

            // Incrementar dificultad cada 5 puntos
            if (score % 5 === 0) {
                wordSpeed += 0.5;
                wordInterval = Math.max(1000, wordInterval - 100);
                clearInterval(interval);
                interval = setInterval(dropWords, wordInterval);
            }
        }
    });
}

// Función para terminar el juego
function gameOver() {
    clearInterval(interval);
    input.removeEventListener('input', checkInput);
    fallingWords.forEach(wordObj => wordObj.element.remove()); // Elimina todas las palabras
    fallingWords = []; // Resetea la lista de palabras

    // Verificar si se ha alcanzado una nueva máxima puntuación
    if (score > maxScore) {
        maxScore = score;
        maxScorePlayer = username;
        localStorage.setItem('maxScore', maxScore);
        localStorage.setItem('maxScorePlayer', maxScorePlayer);
        updateMaxScoreDisplay();
    }

    // Enviar la puntuación al servidor
    fetch('guardar_puntuacion.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `nombre=${encodeURIComponent(username)}&puntuacion=${encodeURIComponent(score)}`
    }).then(response => {
        if (response.ok) {
            console.log('Puntuación guardada exitosamente');
        } else {
            console.error('Error al guardar la puntuación');
        }
    });

    gameOverElement.classList.remove('hidden');
    finalScoreElement.textContent = `Puntuación Final: ${score}\n Máxima Puntuación: ${maxScore}  Jugador: ${maxScorePlayer}`;
}

// Evento para reiniciar el juego
restartButton.addEventListener('click', function() {
    // Redirige a la página de inicio para ingresar el nombre
    window.location.href = 'index.html';
});

// Intervalo para mover palabras
setInterval(moveWords, 50);

// Iniciar el juego y cargar la máxima puntuación
loadMaxScore();
