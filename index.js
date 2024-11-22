document.getElementById('start-button').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const selectedDifficulty = document.getElementById('difficulty-select').value;
    const wordFile = document.getElementById('word-file').files[0]; // Obtener el archivo

    if (!username) {
        alert('Por favor ingresa tu nombre');
        return;
    }

    // Si se ha subido un archivo, se lo pasamos a game.html
    if (wordFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const wordsFromFile = e.target.result;
            startGame(username, selectedDifficulty, wordsFromFile); // Iniciar con las palabras del archivo
        };
        reader.readAsText(wordFile);
    } else {
        // Si no se ha subido archivo, se inicia con las palabras de la base de datos
        startGame(username, selectedDifficulty, null);
    }
});

function startGame(username, difficulty, wordsFromFile) {
    let url = `game.html?username=${username}&difficulty=${difficulty}`;
    
    if (wordsFromFile) {
        // Codificar las palabras y agregarlas a la URL
        url += `&words=${encodeURIComponent(wordsFromFile)}`;
    }

    window.location.href = url;
}