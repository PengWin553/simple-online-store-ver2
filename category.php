<?php
include('connection.php');

try {
    $query = "SELECT * FROM categories";
    $statement = $connection->prepare($query);
    $statement->execute();
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);

    $response = [
        "res" => "success",
        "category" => $result
    ];

    header('Content-Type: application/json');
    echo json_encode($response);
} catch (PDOException $e) {
    $errorResponse = [
        "res" => "error",
        "message" => $e->getMessage()
    ];
    echo json_encode($errorResponse);
}
?>
