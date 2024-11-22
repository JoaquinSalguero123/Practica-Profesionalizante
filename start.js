document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar la máxima puntuación y el nombre del jugador desde el servidor
    function loadMaxScore() {
        fetch('get_max_score.php')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    const maxScore = data.maxima_puntuacion || 0;
                    const maxScorePlayer = data.nombre || 'Nadie';

                    // Actualizar el almacenamiento local
                    localStorage.setItem('maxScore', maxScore);
                    localStorage.setItem('maxScorePlayer', maxScorePlayer);

                    // Actualizar la visualización
                    document.getElementById('max-score-start').textContent = `Máxima Puntuación: ${maxScore}`;
                    document.getElementById('max-score-payer').textContent = `Jugador: ${maxScorePlayer}`;
                }
            })
            .catch(error => console.error('Error al cargar la máxima puntuación:', error));
    }

    // Cargar y mostrar la máxima puntuación y el nombre del jugador al cargar la página
    loadMaxScore();

    // Evento para iniciar el juego
    document.getElementById('start-game').addEventListener('click', function() {
        const username = document.getElementById('username').value.trim();
        if (username) {
            localStorage.setItem('username', username);
            window.location.href = 'game.html';
        } else {
            alert('Por favor, ingresa tu nombre.');
        }
    });
});


