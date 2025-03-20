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
$servername = '192.168.30.100';
$username = 'root';
$password = 'password';
$nome = $_GET['area'] ?? "HEMATOLOGIA";
$dbname="indrefri";
$id_equipamento=1;
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
$query="SELECT e_idEquipamento from equipamento WHERE m_idModelo=3 and e_nome='$nome'";

$result = $conn->query($query);
while ($row = $result->fetch_assoc()) {
    $id_equipamento = $row['e_idEquipamento'];
}
$dataInicial=$_GET['startDate'] ?? null;
$dataFinal=$_GET['endDate']?? null;
$converte="status";
// Verifica se startDate e endDate estão vazios
if (empty($dataInicial) && empty($dataFinal)) {
    // Consulta SQL para recuperar os últimos 200 registros da tabela
    //$table = $conn->real_escape_string($_GET['area']);
    $table=$converte; 
    //$query = "SELECT * FROM `$table` WHERE e_idEquipamento =$id_equipamento and MINUTE(s_time) % '$intervalo' = 0 AND s_time BETWEEN '2023-02-07 00:00:00' AND '2023-02-07 23:00:00' order by s_idstatus desc";

    $query = "SELECT * FROM `$table` WHERE MINUTE(s_time) % '$intervalo' = 0 and e_idEquipamento =$id_equipamento ORDER BY s_idstatus DESC LIMIT 200";
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
    $query = "SELECT * FROM `$table` WHERE e_idEquipamento =$id_equipamento and MINUTE(s_time) % '$intervalo' = 0 AND s_time BETWEEN '$startDate' AND '$endDate' order by s_idstatus desc";
}

// Executa a consulta
$result = $conn->query($query);

// Prepara os dados para o gráfico
$data = array();
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}
$evInicio=$data[count($data)-1]["s_time"];
$evFim=$data[0]["s_time"];
//echo $evInicio."<br>" ;
//echo $evFim."<br>" ;
//$queryEv="select s_idstatus,s_t1,s_t2,s_time,s_alarmealta,s_alarmebaixa,s_setpoint,s_volt,O.ev_idEvento,E.ev_descricaoEvento,O.o_status from status S inner join (select ev_idEvento,o_status,o_time,e_idEquipamento from ocorrencia) O on  date_format(O.o_time,'%Y-%m-%d-%H:%i:00')=date_format(S.s_time,'%Y-%m-%d-%H:%i:00') and O.e_idEquipamento=S.e_idEquipamento inner join (select ev_idEvento,ev_descricaoEvento from evento) E on O.ev_idEvento=E.ev_idEvento where (S.s_time between '$evInicio' and '$evFim') and (O.o_time between '$evInicio' and '$evFim') and O.e_idEquipamento=$id_equipamento";
//echo $queryEv;
$queryEv="SELECT o_status,o_time,ev_idEvento FROM indrefri.ocorrencia where e_idEquipamento =$id_equipamento and o_time between '$evInicio' and '$evFim' order by o_idOcorrencia desc";
$resultEv=$conn->query($queryEv);
while($row = $resultEv->fetch_assoc()){
    #$dataEv[]=$row;
    $dataIniEv=new DateTime($row['o_time']);
    $dataIniEv->add(new DateInterval('PT1M'));
    $dataIniEv=$dataIniEv->format('Y-m-d H:i:s');
    $dataFimEv=new DateTime($row['o_time']);
    $dataFimEv->sub(new DateInterval('PT1M'));
    $dataFimEv=$dataFimEv->format('Y-m-d H:i:s');
    $queryEvento= "SELECT s_time,s_t1,s_t2 FROM `$table` WHERE e_idEquipamento =$id_equipamento  AND s_time BETWEEN '$dataFimEv' AND '$dataIniEv' order by s_idstatus desc";
    //echo $queryEvento."<br>";
    $valores=$conn->query($queryEvento);
    while($linha=$valores->fetch_assoc()){
    if(!is_null($linha)){
        //print_r($linha);
        $row['ev_idEvento']=listaEventos($row['ev_idEvento']);
        //$row['o_status']=stauts($row['o_status']);
        $dataEv[]=array_merge($row,$linha);
    }
    }

}
#print_r($dataEv);
//$data=array_merge($data,$dataEv);
//susort($data, 'compararPorSStatus');

// Retorna os dados como resposta JSON
#echo $queryEv;
$datas=array("dados"=>$data,"eventos"=>$dataEv);
echo json_encode($datas);

// Fecha a conexão com o banco de dados
$conn->close();
?>
