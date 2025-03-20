<?php
header('Content-Type: text/html; charset=iso-8859-15');
// MySQL server credentials
$server = '192.168.30.100';
$username = 'root';
$password = 'password';
$database = 'indrefri';

// Create a new MySQLi instance
$mysqli = new mysqli($server, $username, $password, $database);

// Check connection
if ($mysqli->connect_error) {
    die('Connection failed: ' . $mysqli->connect_error);
}

// Fetch the values for the dropdown from the database
$query = "SELECT e_nome FROM equipamento where m_idModelo = 3";
$result = $mysqli->query($query);

// Create an empty array to store the options
$options = array();

// Loop through the query results to populate the options array
while ($row = $result->fetch_assoc()) {
    //$converte = str_replace(' ', '_', $row['Area_atendida']);
    //$converte=str_replace('.', '_',$converte);
    //$converte=utf8_encode($converte);
    //$converte=removerAcentuacao($converte);
    //$converte=strtolower($converte);
    //$area = $converte;
    $area = $row['e_nome'];
    $options[] = $area;
}

// Close the database connection
$mysqli->close();
asort($options);
// Generate the HTML options
$htmlOptions = '';
foreach ($options as $option) {
    $htmlOptions .= "<option value='$option'>$option</option>";
}

// Output the HTML options
echo $htmlOptions;
?>
