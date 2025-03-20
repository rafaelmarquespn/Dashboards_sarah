<?php
$servername = '192.168.30.100';
$username = 'root';
$password = 'password';
$dbname = $_GET['dbname'];
try{
    $intervalo=$_GET['intervalo'] ?? 60;
}catch(Exception $e){
        echo $e->getMessage();
        $intervalo=1;
}
// Cria a conexão com o banco de dados MySQL
$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8");

// Verifica se houve erro na conexão
if ($conn->connect_error) {
    die('Falha na conexão com o banco de dados: ' . $conn->connect_error);
}
$dataInicial=$_GET['startDate'];
$dataFinal=$_GET['endDate'];
$converte=str_replace(' ', '_',$conn->real_escape_string($_GET['area']));
$converte=str_replace('.', '_',$converte);
$converte=strtolower($converte);
// Verifica se startDate e endDate estão vazios
if (empty($dataInicial) && empty($dataFinal)) {
    // Consulta SQL para recuperar os últimos 200 registros da tabela
    //$table = $conn->real_escape_string($_GET['area']);
    $table=$converte;
    $query = "SELECT * FROM `$table` WHERE MINUTE(data) % '$intervalo' = 0 and temperatura <> 0 and data >= now() - interval 2 day ORDER BY id DESC";
} else {
    // Consulta SQL para recuperar os registros no intervalo de datas especificado
    //$table = $conn->real_escape_string($_GET['area']);
    $table=$converte;
    //$startDate = $conn->real_escape_string($_GET['startDate']);
    //$endDate = $conn->real_escape_string($_GET['endDate']);
    $startDate ="$dataInicial 00:00:00";
    $endDate="$dataFinal 23:59:59";
    //$query = "SELECT * FROM `$table` where data BETWEEN '$startDate' AND '$endDate' group by date_format(data,'%d-%m-%-Y:%H:%i:00') ORDER BY id desc";
    //$query = "SELECT * FROM `$table` WHERE data BETWEEN '$startDate' AND '$endDate' ORDER BY id desc";
    $query = "SELECT * FROM `$table` WHERE MINUTE(data) % '$intervalo' = 0 AND data BETWEEN '$startDate' AND '$endDate' and temperatura <> 0 order by id desc";
}

// Executa a consulta
$result = $conn->query($query);

// Prepara os dados para o gráfico
$data = array();
while ($row = $result->fetch_assoc()) {
    $dataFormatada = DateTime::createFromFormat('Y-m-d H:i:s', $row['data']);
    if ($dataFormatada) {
        $row['data'] = $dataFormatada->format('d/m/Y H:i:s');
    }
    $data[] = $row;
}

// Retorna os dados como resposta JSON
echo json_encode($data);

// Fecha a conexão com o banco de dados
$conn->close();
?>
