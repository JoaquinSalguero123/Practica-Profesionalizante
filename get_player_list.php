<?php
// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "juego_tipeo";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta para obtener la lista de jugadores
$sql = "SELECT nombre, maxima_puntuacion FROM usuarios ORDER BY maxima_puntuacion DESC";
$result = $conn->query($sql);

$players = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $players[] = $row;
    }
}

// Devolver los jugadores como JSON
header('Content-Type: application/json');
echo json_encode($players);

$conn->close();
?>

