<?php
function listaEventos($string) {
    $acentos = array(
        1=>'Alarme de Temperatura Alta',2=>'Alarme de Temperatura Baixa',3=>'Alarme de Falta de Energia',
        4=>'Alarme de Falha de Sensor',5=>'Alarme de Porta Aberta',6=>'Alarme de Bateria Fraca',7=>'Alarme de Filtro Sujo',
        8=>'Refrigeracao', 9=>'Luz Interna',10=>'Degelo',11=>'Ventilacao',12=>'Porta Aberta',13=>'Teste de Envio de Emails'
    );

    return strtr($string, $acentos);
}
function stauts($string) {
    $acentos = array(
        'I'=>'Inicio','F'=>'Fim'
    );

    return strtr($string, $acentos);
}
function compararPorSStatus($a, $b) {
    return strcmp($a['s_time'], $b['s_time']);
}
$servername = 'localhost';
$username = 'root';
$password = 'password';
$nome = $_GET['area'] ?? "serial_49000";
$dbname="farmacia_refrigeradores";
$id_equipamento=1;
$dataInicial=$_GET['startDate'] ?? null;
$dataFinal=$_GET['endDate']?? null;
try{
    $intervalo=$_GET['intervalo'] ?? 60;
}catch(Exception $e){
        echo $e->getMessage();
        $intervalo=1;
}
// Cria a conexão com o banco de dados MySQL
$conn = new mysqli($servername, $username, $password, "$dbname");
$conn->set_charset("utf8");

// Verifica se houve erro na conexão
if ($conn->connect_error) {
    die('Falha na conexão com o banco de dados: ' . $conn->connect_error);
}
$converte=$nome;
// Verifica se startDate e endDate estão vazios
if (empty($dataInicial) && empty($dataFinal)) {
    // Consulta SQL para recuperar os últimos 200 registros da tabela
    //$table = $conn->real_escape_string($_GET['area']);
    $table=$converte; 
    //$query = "SELECT * FROM `$table` WHERE e_idEquipamento =$id_equipamento and MINUTE(s_time) % '$intervalo' = 0 AND s_time BETWEEN '2023-02-07 00:00:00' AND '2023-02-07 23:00:00' order by s_idstatus desc";

    $query = "SELECT * FROM `$table` WHERE MINUTE(data) % '$intervalo' = 0  ORDER BY id DESC LIMIT 200";
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
    $query = "SELECT * FROM `$table` WHERE MINUTE(data) % '$intervalo' = 0 AND data BETWEEN '$startDate' AND '$endDate' order by id desc";
}

// Executa a consulta
$result = $conn->query($query);

// Prepara os dados para o gráfico
$data = array();
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

#print_r($dataEv);
//$data=array_merge($data,$dataEv);
//susort($data, 'compararPorSStatus');

// Retorna os dados como resposta JSON
#echo $queryEv;
header('Content-Type: application/json');
$datas = array("dados" => $data);
echo json_encode($datas);

// Fecha a conexão com o banco de dados
$conn->close();
?>
