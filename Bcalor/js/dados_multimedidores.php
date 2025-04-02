<?php
// Configurações de conexão com o banco de dados
$host = '192.168.30.100';
$dbname = 'multimedidores';
$username = 'root';
$password = 'password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Parâmetros recebidos via GET
    $startDate = isset($_GET['startDate']) ? $_GET['startDate'] : null;
    $endDate = isset($_GET['endDate']) ? $_GET['endDate'] : null;
    $intervalo = isset($_GET['intervalo']) ? (int)$_GET['intervalo'] : 60; // em segundos

    if (!empty($startDate) && !empty($endDate)) {
        $startDateTime = "$startDate 00:00:00";
        $endDateTime   = "$endDate 23:59:59";

        // Query corrigida para usar E3TimeStamp e agrupar por intervalo
        $sql_bomba1 = "SELECT 
                           MIN(E3TimeStamp) AS E3TimeStamp,
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
                       FROM qdn_701_bcalor1
                       WHERE E3TimeStamp BETWEEN :startDate AND :endDate
                       GROUP BY FLOOR(UNIX_TIMESTAMP(E3TimeStamp)/$intervalo)
                       ORDER BY E3TimeStamp ASC";

        $sql_bomba2 = "SELECT 
                           MIN(E3TimeStamp) AS E3TimeStamp,
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
                       FROM qdn_701_bcalor2
                       WHERE E3TimeStamp BETWEEN :startDate AND :endDate
                       GROUP BY FLOOR(UNIX_TIMESTAMP(E3TimeStamp)/$intervalo)
                       ORDER BY E3TimeStamp ASC";

        $stmt1 = $pdo->prepare($sql_bomba1);
        $stmt1->bindParam(':startDate', $startDateTime);
        $stmt1->bindParam(':endDate', $endDateTime);
        $stmt1->execute();

        $stmt2 = $pdo->prepare($sql_bomba2);
        $stmt2->bindParam(':startDate', $startDateTime);
        $stmt2->bindParam(':endDate', $endDateTime);
        $stmt2->execute();

        $data_bomba1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);
        $data_bomba2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    } else {
        // Se não houver filtros, retorna os últimos 300 registros
        $sql_bomba1 = "SELECT 
                           E3TimeStamp,
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
                       FROM qdn_701_bcalor1
                       ORDER BY E3TimeStamp DESC
                       LIMIT 300";

        $sql_bomba2 = "SELECT 
                           E3TimeStamp,
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
                       FROM qdn_701_bcalor1
                       ORDER BY E3TimeStamp DESC
                       LIMIT 300";

        $stmt1 = $pdo->prepare($sql_bomba1);
        $stmt1->execute();
        $data_bomba1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);

        $stmt2 = $pdo->prepare($sql_bomba2);
        $stmt2->execute();
        $data_bomba2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);

        // Inverte a ordem para exibir do mais antigo para o mais recente
        $data_bomba1 = array_reverse($data_bomba1);
        $data_bomba2 = array_reverse($data_bomba2);
    }

    // Formatação dos dados para JSON, extraindo o horário do timestamp
    $formattedData_bomba1 = array_map(function($item) {
        return [
            'time'              => date('H:i:s', strtotime($item['E3TimeStamp'])),
            'Ambiente'          => $item['Ambiente'],
            'Compressor_1'      => $item['Compressor_1'],
            'Compressor_2'      => $item['Compressor_2'],
            'Entrada'           => $item['Entrada'],
            'Liga_Desliga'      => $item['Liga_Desliga'],
            'Saida'             => $item['Saida'],
            'SetPoint_Entrada'  => $item['SetPoint_Entrada'],
            'SetPoint_Saida'    => $item['SetPoint_Saida'],
            'Sistema_1'         => $item['Sistema_1'],
            'Sistema_2'         => $item['Sistema_2'],
            'Status_geral'      => $item['Status_geral'],
            'Status_on_off'     => $item['Status_on_off'],
            'Tanque'            => $item['Tanque']
        ];
    }, $data_bomba1);

    $formattedData_bomba2 = array_map(function($item) {
        return [
            'time'              => date('H:i:s', strtotime($item['E3TimeStamp'])),
            'Ambiente'          => $item['Ambiente'],
            'Compressor_1'      => $item['Compressor_1'],
            'Compressor_2'      => $item['Compressor_2'],
            'Entrada'           => $item['Entrada'],
            'Liga_Desliga'      => $item['Liga_Desliga'],
            'Saida'             => $item['Saida'],
            'SetPoint_Entrada'  => $item['SetPoint_Entrada'],
            'SetPoint_Saida'    => $item['SetPoint_Saida'],
            'Sistema_1'         => $item['Sistema_1'],
            'Sistema_2'         => $item['Sistema_2'],
            'Status_geral'      => $item['Status_geral'],
            'Status_on_off'     => $item['Status_on_off'],
            'Tanque'            => $item['Tanque']
        ];
    }, $data_bomba2);

    $response = [
        'bomba_de_calor1' => $formattedData_bomba1,
        'bomba_de_calor2' => $formattedData_bomba2
    ];

    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
