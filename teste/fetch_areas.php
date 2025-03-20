<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: text/html; charset=iso-8859-15');
function removerAcentuacao($string) {
    $acentos = array(
        'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A', 'Å' => 'A',
        'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a',
        'È' => 'E', 'É' => 'E', 'Ê' => 'E', 'Ë' => 'E',
        'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e',
        'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I',
        'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i',
        'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O', 'Õ' => 'O', 'Ö' => 'O', 'Ø' => 'O',
        'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o', 'ö' => 'o', 'ø' => 'o',
        'Ù' => 'U', 'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U',
        'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ü' => 'u',
        'Ý' => 'Y',
        'ý' => 'y', 'ÿ' => 'y',
        'Ç' => 'C',
        'ç' => 'c',
        'Ñ' => 'N',
        'ñ' => 'n',
    );

    return strtr($string, $acentos);
}
// MySQL server credentials
$server = '192.168.30.100';
$username = 'root';
$password = 'password';
$database = 'fancoil';

// Create a new MySQLi instance
$mysqli = new mysqli($server, $username, $password, $database);

// Check connection
if ($mysqli->connect_error) {
    die('Connection failed: ' . $mysqli->connect_error);
}

// Fetch the values for the dropdown from the database
$query = "SELECT Area_atendida FROM setpoint";
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
    $area = $row['Area_atendida'];
    $options[] = $area;
}

// Close the database connection
$mysqli->close();
$outrosFc=array("agt","bio_analitica","biomol","auditorio_b","neurofisiologia","nobreak");
$options=array_merge($outrosFc,$options);
asort($options);
// Generate the HTML options
$htmlOptions = '';
foreach ($options as $option) {
    $htmlOptions .= "<option value='$option'>$option</option>";
}

// Output the HTML options
echo $htmlOptions;
?>
