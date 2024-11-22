// Función para cargar la lista de jugadores
function loadPlayerList() {
    fetch('get_player_list.php')
        .then(response => response.json())
        .then(data => {
            const playerList = document.getElementById('player-list');
            playerList.innerHTML = ''; // Limpiar la lista
            data.forEach(player => {
                const listItem = document.createElement('li');
                listItem.textContent = `${player.nombre}: ${player.maxima_puntuacion}`;
                playerList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error al cargar la lista de jugadores:', error));
}

// Función para eliminar todos los jugadores
function deleteAllPlayers() {
    const authCode = document.getElementById('auth-code').value;

    if (!authCode) {
        alert("Debes ingresar un código de autorización para eliminar todos los jugadores.");
        return;
    }

    if (confirm("¿Estás seguro de que quieres eliminar a todos los jugadores?")) {
        fetch('delete_all_players.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `auth_code=${encodeURIComponent(authCode)}`
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Mostrar el resultado al usuario
            loadPlayerList(); // Recargar la lista de jugadores
        })
        .catch(error => console.error('Error al eliminar todos los jugadores:', error));
    }
}

// Cargar la lista de jugadores al cargar la página
loadPlayerList();
