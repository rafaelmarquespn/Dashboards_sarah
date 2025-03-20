<?php
// Conexão com o banco de dados
$host = '192.168.30.100';
$user = 'root';
$password = 'password';
$database = 'farmacia_refrigeradores';

// Mapeamento das tabelas para os novos nomes
$nome_tabelas = [
    'serial_53442' => 'Dose',
    'serial_53471' => 'CPE-1',
    'serial_53452' => 'CPE-2',
    'serial_53460' => 'CPE-3',
    'serial_53447' => 'QT',
    'serial_53445' => 'CAF-1',
    'serial_53448' => 'CAF-2',
    'serial_53462' => 'CAF-3',
];

// Cria a conexão
$conn = new mysqli($host, $user, $password, $database);

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Consulta para mostrar as tabelas
$sql = "SHOW TABLES";
$result = $conn->query($sql);

$dicio_lista = array();

// Itera pelas tabelas
if ($result->num_rows > 0) {
    while ($row = $result->fetch_array()) {
        $tabela = $row[0];

        // Verifica se as colunas 'data', 't1' e 'setpoint' existem
        $columns_sql = "SHOW COLUMNS FROM $tabela LIKE 'data'";
        $columns_result = $conn->query($columns_sql);

        if ($columns_result->num_rows > 0) {
            // Consulta para buscar data, t1 e setpoint da tabela atual
            $sql = "SELECT data, t1, setpoint FROM $tabela ORDER BY data DESC LIMIT 1";
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

// Fecha a conexão
$conn->close();
ksort($dicio_lista);
// Retorna o array como JSON
header('Content-Type: application/json');
echo json_encode($dicio_lista, JSON_PRETTY_PRINT);
?>
