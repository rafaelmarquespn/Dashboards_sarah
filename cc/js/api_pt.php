<?php
function postData($url, $data) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen(json_encode($data))
    ));
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    
    $room = $_POST['room'] ?? '';
    $newSetpoint = $_POST['newSetpoint'] ?? '';

    if (!empty($room) && is_numeric($newSetpoint)) {
        // Dados para enviar
        $data = [
            'room' => $room,
            'newSetpoint' => $newSetpoint
        ];
        $url = 'http://192.168.30.248:8000/post_cc'; // URL para onde os dados serão enviados
        
        $response = postData($url, $data);

        echo json_encode([
            'status' => 'success',
            'message' => 'SetPoint enviado com sucesso.',
            'response' => json_decode($response)
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Dados inválidos.'
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Método não suportado.'
    ]);
}
?>
