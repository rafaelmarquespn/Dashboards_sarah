<?php
function fetchData() {
    $url = 'http://localhost:8000/get_refrifarm';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

header('Content-Type: application/json');
echo fetchData();
?>
