<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$category = trim($_POST['category'] ?? '');
$price = $_POST['price'] ?? 0;
$stock = $_POST['stock'] ?? 0;
$description = trim($_POST['description'] ?? '');

if (empty($name) || empty($category) || $price <= 0 || $stock < 0) {
    echo json_encode(['success' => false, 'message' => 'Semua field harus diisi dengan benar']);
    exit;
}

try {
    $sql = "INSERT INTO products (name, category, price, stock, description) 
            VALUES (:name, :category, :price, :stock, :description)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':stock', $stock);
    $stmt->bindParam(':description', $description);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Produk berhasil ditambahkan',
            'id' => $conn->lastInsertId()
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal menambahkan produk']);
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>