<?php
// Conexão com o banco de dados
$host = '192.168.30.100';
$user = 'root';
$password = 'password';
$database = 'farmacia_refrigeradores';

// Cria a conexão
$conn = new mysqli($host, $user, $password, $database);

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Consulta para mostrar as tabelas
$sql = "SHOW TABLES";
$result = $conn->query($sql);

$dicio_lista = array();

// Itera pelas tabelas
if ($result->num_rows > 0) {
    while ($row = $result->fetch_array()) {
        $tabela = $row[0];

        // Consulta para buscar data, t1 e setpoint da tabela atual
        $sql = "SELECT data, t1, setpoint FROM $tabela ORDER BY data DESC LIMIT 1";
        $sub_result = $conn->query($sql);

        if ($sub_result->num_rows > 0) {
            $valores = $sub_result->fetch_assoc();
            $dicio_lista[$tabela] = array_values($valores); // Adiciona os valores ao dicionário
        }
    }
}

// Fecha a conexão
$conn->close();

// Retorna o array como JSON
header('Content-Type: application/json');
echo json_encode($dicio_lista, JSON_PRETTY_PRINT);
?>
