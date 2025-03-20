<?php
header('Content-Type: text/html; charset=utf-8');
$servername = '192.168.30.100';
$username = 'root';
$password = 'password';
$dbname = 'fancoil'; // substitua pelo nome real do seu banco de dados
// Cria a conexão com o banco de dados MySQL
$conn = new mysqli($servername, $username, $password, $dbname);
$table = "setpoint";
// Verifica se houve erro na conexão
if ($conn->connect_error) {
    die('Falha na conexão com o banco de dados: ' . $conn->connect_error);
}

// Consulta SQL para recuperar dados da tabela
$query = "SELECT * from .$table ";

// Executa a consulta
$result = $conn->query($query);

// Prepara os dados para o gráfico
$data = array();
while ($row = $result->fetch_assoc()) {
    $area = str_replace(' ', '_', $row['Area_atendida']);
    //$area = $row['Area_atendida'];
    echo "<option value='$area'>$area</option>";
}

// Retorna os dados como resposta JSON


// Fecha a conexão com o banco de dados
$conn->close();
?>
