<!DOCTYPE html>
<html>
<head>
    <title>MySQL Connection and Query</title>
</head>
<body>
    <h1>MySQL Connection and Query Test</h1>
    <?php
    $servername = "192.168.30.100";
    $username = "root";
    $password = "password";
    $database = "fancoil";
    $port = 3306;

    // Create connection
    $conn = new mysqli($servername, $username, $password, $database, $port);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Perform the query
    $query = "SELECT * FROM rm2";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        // Output data of each row
        while ($row = $result->fetch_assoc()) {
            
            echo "local : ".$row["Area_atendida"]." Temperatura: " . $row["temperatura"]." Umidade: " . $row["umidade"]  . "<br>";
            echo "<br>";
        }
    } else {
        echo "0 results";
    }

    // Close the connection
    $conn->close();
    ?>
</body>
</html>
