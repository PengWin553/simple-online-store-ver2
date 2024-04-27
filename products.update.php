<?php
include('connection.php');

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve the product ID, name, category, and quantity from the POST data
    $productId = $_POST['id'];
    $productName = $_POST['name'];
    $productCategory = $_POST['category'];
    $productQuantity = $_POST['quantity'];

    // Check if a file is uploaded
    if (isset($_FILES['picture']) && $_FILES['picture']['error'] === UPLOAD_ERR_OK) {
        // Retrieve file details
        $uploadDir = 'images/';
        $tempFilePath = $_FILES['picture']['tmp_name'];
        $fileName = uniqid() . '_' . $_FILES['picture']['name'];
        $targetFilePath = $uploadDir . $fileName;

        // Move uploaded file to the target directory
        if (move_uploaded_file($tempFilePath, $targetFilePath)) {
            // Update the product information including the picture filename
            try {
                // Prepare the UPDATE query to update the product information in the database
                $query = "UPDATE products SET name = :name, category = :category, quantity = :quantity, picture = :picture WHERE id = :id";
                $statement = $connection->prepare($query);
                // Bind parameters
                $statement->bindParam(':name', $productName);
                $statement->bindParam(':category', $productCategory);
                $statement->bindParam(':quantity', $productQuantity);
                $statement->bindParam(':picture', $fileName); // Update picture filename
                $statement->bindParam(':id', $productId);
                // Execute the query
                $statement->execute();

                // Return success response as JSON
                echo json_encode(["res" => "success"]);
            } catch (PDOException $th) {
                // Return error response as JSON
                echo json_encode(['res' => 'error', 'message' => $th->getMessage()]);
            }
        } else {
            // If failed to move the uploaded file, return an error response
            echo json_encode(['res' => 'error', 'message' => 'Failed to move uploaded file.']);
        }
    } else {
        // If no file is uploaded, update only other product information
        try {
            // Prepare the UPDATE query to update the product information in the database
            $query = "UPDATE products SET name = :name, category = :category, quantity = :quantity WHERE id = :id";
            $statement = $connection->prepare($query);
            // Bind parameters
            $statement->bindParam(':name', $productName);
            $statement->bindParam(':category', $productCategory);
            $statement->bindParam(':quantity', $productQuantity);
            $statement->bindParam(':id', $productId);
            // Execute the query
            $statement->execute();

            // Return success response as JSON
            echo json_encode(["res" => "success"]);
        } catch (PDOException $th) {
            // Return error response as JSON
            echo json_encode(['res' => 'error', 'message' => $th->getMessage()]);
        }
    }
} else {
    // If the request method is not POST, return an error response
    echo json_encode(['res' => 'error', 'message' => 'Invalid request method']);
}
?>
