<?php
// Código de autorización fijo
$auth_code_correcto = "1234"; // Cambia este código por uno más seguro

// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "juego_tipeo";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener el código de autorización desde el POST
$auth_code = $_POST['auth_code'];

// Verificar el código de autorización
if ($auth_code === $auth_code_correcto) {
    // Eliminar todos los jugadores
    $sql = "DELETE FROM usuarios";

    if ($conn->query($sql) === TRUE) {
        echo "Todos los jugadores han sido eliminados exitosamente";
    } else {
        echo "Error eliminando jugadores: " . $conn->error;
    }
} else {
    echo "Código de autorización incorrecto.";
}

$conn->close();
?>
