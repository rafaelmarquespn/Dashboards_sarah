<?php
function fetchData() {
    // $url = 'http://192.168.30.248:8000/get_bomba';
    $url = 'localhost:8000/get_bomba';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

header('Content-Type: application/json');
echo fetchData();
?>
