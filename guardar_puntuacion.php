
<?php
$servername = "localhost";
$username = "root"; // Cambia esto si tienes un usuario diferente
$password = ""; // Deja esto en blanco si no tienes contraseña en MySQL
$dbname = "juego_tipeo";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Recibir datos desde la solicitud
$nombre = $_POST['nombre'];
$puntuacion = $_POST['puntuacion'];

// Verificar si el usuario ya existe
$sql = "SELECT maxima_puntuacion FROM usuarios WHERE upper(trim(nombre))=upper(trim('$nombre'))";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Actualizar la puntuación si es mayor que la existente
    $row = $result->fetch_assoc();
    if ($puntuacion > $row['maxima_puntuacion']) {
        $sql = "UPDATE usuarios SET maxima_puntuacion='$puntuacion' WHERE upper(trim(nombre))=upper(trim('$nombre'))";
        $conn->query($sql);
    }
} else {
    // Insertar un nuevo registro si el usuario no existe
    $sql = "INSERT INTO usuarios (nombre, maxima_puntuacion) VALUES ('$nombre', '$puntuacion')";
    $conn->query($sql);
}

$conn->close();
?>
