<?php
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
$database = 'multimedidores';

// Create a new MySQLi instance
$mysqli = new mysqli($server, $username, $password, $database);

// Check connection
if ($mysqli->connect_error) {
    die('Connection failed: ' . $mysqli->connect_error);
}

// Fetch the values for the dropdown from the database
$query = "SELECT quadro_de_forca, id_Equipamento FROM equipamentos ORDER BY id_Equipamento ASC";
$result = $mysqli->query($query);

// Create an empty array to store the options
$options = array();

// Loop through the query results to populate the options array
while ($row = $result->fetch_assoc()) {
    $area = $row['quadro_de_forca'];
    $id = $row['id_Equipamento'];
    $options[] = array('quadro_de_forca' => $area, 'id' => $id);
}
// Close the database connection
$mysqli->close();
asort($options);
//echo json_encode($options);

// Generate the HTML options
$htmlOptions = '';
foreach ($options as $option) {
    $quadro_de_forca = $option['quadro_de_forca'];
    $id = $option['id'];
    $htmlOptions .= "<option value='$id'>$quadro_de_forca </option>";
}

// Output the HTML options
echo $htmlOptions;
?>
