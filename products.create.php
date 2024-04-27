<?php 
include ('connection.php');

if(isset($_FILES['picture']) && $_FILES['picture']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'images/';
    $tempFilePath = $_FILES['picture']['tmp_name'];
    $fileName = uniqid() . '_' . $_FILES['picture']['name'];
    $targetFilePath = $uploadDir . $fileName;
    if(move_uploaded_file($tempFilePath, $targetFilePath)) {

        $text_input = $_POST['text-input'];

        try {
            $query = "INSERT INTO posts_table (image_input, text_input) VALUES (:image_input, :text_input)";
            $statement = $connection->prepare($query);
            $statement->bindParam(':image_input', $fileName); // Bind the image filename parameter
            $statement->bindParam(':text_input', $text_input); // Bind the text input parameter
            $statement->execute();

            echo json_encode(["res" => "success"]);
        } catch (PDOException $th) {
            echo json_encode(['res' => 'error', 'message' => $th->getMessage()]);
        }
    } else {
        echo json_encode(['res' => 'error', 'message' => 'Failed to move uploaded file.']);
    }
} else {
    echo json_encode(['res' => 'error', 'message' => 'Failed to upload file.']);
}
?>

