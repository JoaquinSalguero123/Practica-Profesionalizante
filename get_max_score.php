<?php
$servername = "localhost";
$username = "root"; // Cambia esto si tienes un usuario diferente
$password = ""; // Cambia esto si tienes una contraseña
$dbname = "juego_tipeo"; // Nombre de la base de datos corregido

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta para obtener la máxima puntuación y el nombre del jugador
$sql = "SELECT nombre, maxima_puntuacion FROM usuarios ORDER BY maxima_puntuacion DESC LIMIT 1";
$result = $conn->query($sql);

$response = array();

if ($result) {
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $response['nombre'] = $row['nombre'];
        $response['maxima_puntuacion'] = $row['maxima_puntuacion'];
    } else {
        $response['nombre'] = 'Nadie';
        $response['maxima_puntuacion'] = 0; // Si no hay puntuaciones, devuelve 0
    }
} else {
    $response['error'] = "Error en la consulta: " . $conn->error;
}

$conn->close();

// Devolver los datos en formato JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
