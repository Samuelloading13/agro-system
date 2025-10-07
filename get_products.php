<?php
header('Content-Type: application/json');
require_once 'config.php';

try {
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $sql = "SELECT * FROM products WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $products = $stmt->fetchAll();
    }
    elseif (isset($_GET['search']) && !empty($_GET['search'])) {
        $search = '%' . $_GET['search'] . '%';
        $sql = "SELECT * FROM products 
                WHERE name LIKE :search 
                OR category LIKE :search 
                OR description LIKE :search 
                ORDER BY created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':search', $search);
        $stmt->execute();
        $products = $stmt->fetchAll();
    }
    else {
        $sql = "SELECT * FROM products ORDER BY created_at DESC";
        $stmt = $conn->query($sql);
        $products = $stmt->fetchAll();
    }
    
    echo json_encode($products);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>