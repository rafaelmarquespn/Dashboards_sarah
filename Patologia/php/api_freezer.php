<?php
function listaEventos($string) {
    $acentos = array(
        1 => 'Alarme de Temperatura Alta', 2 => 'Alarme de Temperatura Baixa', 3 => 'Alarme de Falta de Energia',
        4 => 'Alarme de Falha de Sensor', 5 => 'Alarme de Porta Aberta', 6 => 'Alarme de Bateria Fraca', 7 => 'Alarme de Filtro Sujo',
        8 => 'Refrigeração', 9 => 'Luz Interna', 10 => 'Degelo', 11 => 'Ventilação', 12 => 'Porta Aberta', 13 => 'Teste de Envio de Emails'
    );

    return strtr($string, $acentos);
}

function status($string) {
    $acentos = array(
        'I' => 'Início', 'F' => 'Fim'
    );

    return strtr($string, $acentos);
}

function compararPorSStatus($a, $b) {
    return strcmp($a['s_time'], $b['s_time']);
}

$servername = '192.168.30.100';
$username = 'root';
$password = 'password';
$nome = $_GET['area'] ?? "escravo15";

$dbname = "indrefri";
$id_equipamento = 1;
$dataInicial = $_GET['startDate'] ?? null;
$dataFinal = $_GET['endDate'] ?? null;

try {
    $intervalo = $_GET['intervalo'] ?? 60;
} catch(Exception $e) {
    echo $e->getMessage();
    $intervalo = 1;
}

// Cria a conexão com o banco de dados MySQL
$conn = new mysqli($servername, $username, $password, "$dbname");
$conn->set_charset("utf8");

// Verifica se houve erro na conexão
if ($conn->connect_error) {
    die('Falha na conexão com o banco de dados: ' . $conn->connect_error);
}

$converte = $nome;

// Verifica se startDate e endDate estão vazios
if (empty($dataInicial) && empty($dataFinal)) {
    $table = $converte;
    $query = "
        SELECT s_time as data,s_t1 as t1  
        FROM `$table` 
        WHERE MINUTE(s_time) % '$intervalo' = 0
        ORDER BY s_idstatus DESC limit 100
    ";
}
 else {
    $table = $converte;
    $startDate = "$dataInicial 00:00:00";
    $endDate = "$dataFinal 23:59:59";
    $query = "SELECT s_time as data,s_t1 as t1  FROM `$table` WHERE MINUTE(s_time) % '$intervalo' = 0 AND s_time BETWEEN '$startDate' AND '$endDate' ORDER BY s_idstatus DESC";
}

// Executa a consulta
$result = $conn->query($query);
// Prepara os dados para o gráfico
$data = array();
while ($row = $result->fetch_assoc()) {
    // Formata a data de yyyy-mm-dd hh:mm:ss para dd/mm/yyyy
    $dataFormatada = DateTime::createFromFormat('Y-m-d H:i:s', $row['data']);
    if ($dataFormatada) {
        $row['data'] = $dataFormatada->format('d/m/Y H:i:s');
    }
    $data[] = $row;
}

// Retorna os dados como resposta JSON
header('Content-Type: application/json');
$datas = array("dados" => $data);
echo json_encode($datas);

// Fecha a conexão com o banco de dados
$conn->close();
?>
