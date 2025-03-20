<?php
// Conexão com o banco de dados
$host = '192.168.30.100';
$user = 'root';
$password = 'password';
$database = 'skids';

// Parâmetros recebidos via GET
$dataInicial = $_GET['startDate'] ?? null;
$dataFinal = $_GET['endDate'] ?? null;
$intervalo = isset($_GET['intervalo']) ? (int)$_GET['intervalo'] : 60;

// Cria a conexão
$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

if (!empty($dataInicial) && !empty($dataFinal)) {
    // Se os filtros de data foram fornecidos, usa-os para extrair dados agrupados pelo intervalo
    $startDate = "$dataInicial 00:00:00";
    $endDate = "$dataFinal 23:59:59";
    
    // Query para bomba_de_calor1 com agrupamento por intervalo (em segundos)
    $sql_bomba1 = "SELECT 
        DATE_FORMAT(MIN(data), '%d/%m/%Y %H:%i:%s') AS data,
        Ambiente,
        Compressor_1,
        Compressor_2,
        Entrada,
        Liga_Desliga,
        Saida,
        SetPoint_Entrada,
        SetPoint_Saida,
        Sistema_1,
        Sistema_2,
        Status_geral,
        Status_on_off,
        Tanque
    FROM bomba_de_calor1
    WHERE data BETWEEN '$startDate' AND '$endDate'
    GROUP BY FLOOR(UNIX_TIMESTAMP(data)/$intervalo)
    ORDER BY data DESC;";
    
    // Query para bomba_de_calor2 com agrupamento por intervalo
    $sql_bomba2 = "SELECT 
        DATE_FORMAT(MIN(data), '%d/%m/%Y %H:%i:%s') AS data,
        Ambiente,
        Compressor_1,
        Compressor_2,
        Entrada,
        Liga_Desliga,
        Saida,
        SetPoint_Entrada,
        SetPoint_Saida,
        Sistema_1,
        Sistema_2,
        Status_geral,
        Status_on_off,
        Tanque
    FROM bomba_de_calor2
    WHERE data BETWEEN '$startDate' AND '$endDate'
    GROUP BY FLOOR(UNIX_TIMESTAMP(data)/$intervalo)
    ORDER BY data DESC;";
} else {
    // Se os filtros não forem informados, retorna os últimos 100 registros de cada tabela
    $sql_bomba1 = "SELECT 
        DATE_FORMAT(data, '%d/%m/%Y %H:%i:%s') AS data,
        Ambiente,
        Compressor_1,
        Compressor_2,
        Entrada,
        Liga_Desliga,
        Saida,
        SetPoint_Entrada,
        SetPoint_Saida,
        Sistema_1,
        Sistema_2,
        Status_geral,
        Status_on_off,
        Tanque
    FROM bomba_de_calor1
    ORDER BY data DESC
    LIMIT 100;";
    
    $sql_bomba2 = "SELECT 
        DATE_FORMAT(data, '%d/%m/%Y %H:%i:%s') AS data,
        Ambiente,
        Compressor_1,
        Compressor_2,
        Entrada,
        Liga_Desliga,
        Saida,
        SetPoint_Entrada,
        SetPoint_Saida,
        Sistema_1,
        Sistema_2,
        Status_geral,
        Status_on_off,
        Tanque
    FROM bomba_de_calor2
    ORDER BY data DESC
    LIMIT 100;";
}

// Função para executar a consulta e retornar os dados
function getData($conn, $sql) {
    $result = $conn->query($sql);
    $dados = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $dados[] = $row;
        }
    }
    return $dados;
}

$data_bomba1 = getData($conn, $sql_bomba1);
$data_bomba2 = getData($conn, $sql_bomba2);

$conn->close();

$response = [
    "bomba_de_calor1" => $data_bomba1,
    "bomba_de_calor2" => $data_bomba2
];

header('Content-Type: application/json');
echo json_encode($response, JSON_PRETTY_PRINT);
?>
