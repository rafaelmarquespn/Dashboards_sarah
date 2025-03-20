<?php
// Database connection
$host = '192.168.30.100'; // Update with your DB host
$dbname = 'sistema_bombas_rms'; // Update with your DB name
$username = 'root'; // Update with your DB username
$password = 'password'; // Update with your DB password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query to fetch the last 300 records ordered by timestamp
    $query = $pdo->prepare("SELECT data, saturacao_filtro1, saturacao_filtro2, frequencia_bomba1, frequencia_bomba2 
                            FROM historico 
                            ORDER BY data DESC 
                            LIMIT 300");
    $query->execute();

    // Fetch data and format it
    $data = $query->fetchAll(PDO::FETCH_ASSOC);

    // Reverse the order to show oldest first
    $formattedData = array_reverse(array_map(function($item) {
        return [
            'time' => date('H:i:s', strtotime($item['data'])),
            'saturacao_filtro1' => $item['saturacao_filtro1'],
            'saturacao_filtro2' => $item['saturacao_filtro2'],
            'frequencia_bomba1' => $item['frequencia_bomba1'],
            'frequencia_bomba2' => $item['frequencia_bomba2']
        ];
    }, $data));

    echo json_encode($formattedData);

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
