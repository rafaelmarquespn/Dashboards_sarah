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

    // Verificar erros do cURL
    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        curl_close($ch);
        return json_encode(['status' => 'error', 'message' => "Erro cURL: $error_msg"]);
    }

    curl_close($ch);
    return $response;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    // Sanitizando e validando os inputs
    $room = isset($_POST['room']) ? htmlspecialchars(trim($_POST['room'])) : '';
    $newSetpoint = isset($_POST['setpoint']) ? trim($_POST['setpoint']) : '';

    if (!empty($room) && is_numeric($newSetpoint)) {
        // Dados para enviar
        $data = [
            'room' => $room,
            'newSetpoint' => (float)$newSetpoint // Garantir que seja número float
        ];

        $url = 'http://192.168.30.248:8000/post_cc'; // URL do endpoint
        
        $response = postData($url, $data); // Envia os dados via cURL
        $decodedResponse = json_decode($response, true); // Decodifica o JSON retornado

        // Verifica se a resposta foi decodificada corretamente
        if ($decodedResponse) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Setpoint enviado com sucesso.',
                'response' => $decodedResponse
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Erro ao decodificar a resposta do servidor.',
                'raw_response' => $response // Para depuração
            ]);
        }
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Dados inválidos. Certifique-se de que o setpoint seja numérico.'
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Método não suportado. Use POST.'
    ]);
}
?>
