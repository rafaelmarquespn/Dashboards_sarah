<?php
// Conexão com o banco de dados
$host = '192.168.30.100';
$user = 'root';
$password = 'password';
$database = 'sistema_bombas_rms';

$dataInicial = $_GET['startDate'] ?? null;
$dataFinal = $_GET['endDate'] ?? null;
try {
    $intervalo = $_GET['intervalo'] ?? 60;
} catch(Exception $e) {
    echo $e->getMessage();
    $intervalo = 1;
}

// Verifica se startDate e endDate estão vazios
if (empty($dataInicial) && empty($dataFinal)) {
    $sql = "SELECT DATE_FORMAT(data, '%d/%m/%Y %H:%i:%s') AS data, 
    saturacao_filtro1, 
    saturacao_filtro2, 
    frequencia_bomba1, 
    frequencia_bomba2 
    FROM historico 
    ORDER BY data DESC 
    LIMIT 100 ;";
}
 else {
    $startDate = "$dataInicial 00:00:00";
    $endDate = "$dataFinal 23:59:59";
    $sql =" SELECT 
    DATE_FORMAT(data, '%d/%m/%Y %H:%i:%s') AS data, 
    saturacao_filtro1, 
    saturacao_filtro2, 
    frequencia_bomba1, 
    frequencia_bomba2 
FROM historico 
WHERE data BETWEEN '2024-12-29 00:00:00' AND '2025-01-06 23:59:59'
ORDER BY CAST(data AS DATETIME) DESC;"
;
}

// Cria a conexão
$conn = new mysqli($host, $user, $password, $database);

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Consulta para mostrar as tabelas
$result = $conn->query($sql);
$dados = []; // Armazena os resultados formatados

// Itera pelas tabelas
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $dados[]=$row;
    }
}

// Fecha a conexão
$conn->close();

// Retorna o array formatado como JSON
header('Content-Type: application/json');
echo json_encode(["dados" => $dados], JSON_PRETTY_PRINT);
?>
