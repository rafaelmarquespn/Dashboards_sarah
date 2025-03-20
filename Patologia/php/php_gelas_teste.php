<?php
// Conexão com o banco de dados
$host = '192.168.30.100';
$user = 'root';
$password = 'password';
$database = 'indrefri';
$nome_tabelas = [
    'serial_53449' => 'Hematologia_II',
    'serial_53450' => 'Reserva',
    'serial_65282' => 'Microbiologia_III',
    'serial_65277' => 'Microbiologia_IV',
    'serial_65274' => 'Amostras_Processadas',
    'serial_65276' => 'Imuno_II',
    'serial_65275' => 'Imuno_I',
    'serial_53443' => 'Bioquimica',
    'serial_965281' => 'Transfusional_Congelador',
    'serial_65281' => 'Transfusional_Refrigerador',
    'serial_165279' => 'Transfusional_II_Superior',
    'serial_652801' => 'Coprologia_Inferior',
    'serial_65280' => 'Coprologia_Superior',
    'serial_53478' => 'Citogenetica',
    'serial_65279' => 'Transfusional_II_Inferior',
    'serial_53441' => 'Patologia_098367',
    'serial_53446' => 'Microbiologia_32',
    'serial_53453' => '',
    'serial_53454' => 'Patologia__098368',
    'serial_53455' => 'Microbiologia_30',
    'serial_53458' => 'Microbiologia_31',
    'serial_53461' => '',
    'serial_53464' => 'Patologia_098369',
    'serial_53465' => 'Citogenetica_61006',
    'serial_53474' => 'Patologia_098364',
    'serial_53476' => '',
    'serial_53481' => '',

];

// Mapeamento das tabelas para os novos nomes


// Cria a conexão
$conn = new mysqli($host, $user, $password, $database);

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Consulta para mostrar as tabelas
$sql = "select * from equipamento";
$result = $conn->query($sql);
$dicio_lista = array();

// Itera pelas tabelas
if ($result->num_rows > 0) {
    while ($row = $result->fetch_array()) {
        $tabela = "escravo$row[4]";        
        $nome_chave=str_replace(' ', '_', $row[3]);
       //$nome_chave = iconv('UTF-8', 'ASCII//TRANSLIT', $nome_chave);
       $nome_chave = preg_replace('/[^a-zA-Z0-9_]/', '', str_replace(' ', '_', $row[3]));
        #print_r($tabela);
        // Verifica se as colunas 'data', 't1' e 'setpoint' existem
        $columns_sql = "SHOW COLUMNS FROM $tabela LIKE 's_time'";
        $columns_result = $conn->query($columns_sql);
        //print_r($columns_result);
        if ($columns_result->num_rows > 0) {
            // Consulta para buscar data, t1 e setpoint da tabela atual
            $sql = "SELECT s_time as data, s_t1 as t1, s_setpoint as setpoint,s_alarmealta as alta,s_alarmebaixa as baixa FROM $tabela ORDER BY s_time DESC LIMIT 1";
            $sub_result = $conn->query($sql);

            if ($sub_result->num_rows > 0) {
                $valores = $sub_result->fetch_assoc();
                // Verifica se a tabela está no mapeamento e substitui o nome da chave
                //$nome_chave = array_key_exists($tabela, $nome_tabelas) ? $nome_tabelas[$tabela] : $tabela;
                
                $dicio_lista[$nome_chave] = array_values($valores); // Adiciona os valores ao dicionário com a chave alterada
            }
        }
    }
}
// Fecha a conexão
$conn->close();
$conn = new mysqli($host, $user, $password, "refrigeradores_patologia");

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

$sql = "show tables";
$result = $conn->query($sql);
//$dicio_lista = array();

// Itera pelas tabelas
if ($result->num_rows > 0) {
    while ($row = $result->fetch_array()) {
        $tabela = $row[0]; 
        //$nome_chave='teste';       
        
        // Verifica se as colunas 'data', 't1' e 'setpoint' existem
        $columns_sql = "SHOW COLUMNS FROM $tabela LIKE 'data'";
        $columns_result = $conn->query($columns_sql);
        //print_r($columns_result);
        if ($columns_result->num_rows > 0) {
            // Consulta para buscar data, t1 e setpoint da tabela atual
            $sql = "SELECT data, t1, setpoint, alarme_alta as alta, alarme_baixa as baixa FROM $tabela ORDER BY data DESC LIMIT 1";
    
            $sub_result = $conn->query($sql);
            if ($sub_result->num_rows > 0) {
                $valores = $sub_result->fetch_assoc();
                // Verifica se a tabela está no mapeamento e substitui o nome da chave
                $nome_chave = array_key_exists($tabela, $nome_tabelas) ? $nome_tabelas[$tabela] : $tabela;
                
                $dicio_lista[$nome_chave] = array_values($valores); // Adiciona os valores ao dicionário com a chave alterada
            }
        }
    }
}
//print_r($dicio_lista);
$conn->close();
ksort($dicio_lista);
// uasort($dicio_lista, function($a, $b) {
//     return strtotime($b[0]) - strtotime($a[0]);
// });
// Retorna o array como JSON
header('Content-Type: application/json');
echo json_encode($dicio_lista, JSON_PRETTY_PRINT);
?>
