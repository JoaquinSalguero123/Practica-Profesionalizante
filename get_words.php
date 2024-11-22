<?php
// Conectar a la base de datos
$conexion = new mysqli('localhost', 'root', '', 'juego_tipeo');

// Verificar conexión
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

// Obtener la dificultad desde el parámetro de la URL
$dificultad = $_GET['difficulty'];

// Preparar la consulta para obtener palabras según la dificultad
$sql = "SELECT palabra FROM palabras WHERE dificultad_id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param('i', $dificultad);
$stmt->execute();
$result = $stmt->get_result();

// Almacenar palabras en un arreglo
$palabras = [];
while ($row = $result->fetch_assoc()) {
    $palabras[] = $row['palabra'];
}

// Devolver las palabras en formato JSON
echo json_encode($palabras);

$stmt->close();
$conexion->close();
?>
