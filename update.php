<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$id = $_POST['id'] ?? 0;
$name = trim($_POST['name'] ?? '');
$category = trim($_POST['category'] ?? '');
$price = $_POST['price'] ?? 0;
$stock = $_POST['stock'] ?? 0;
$description = trim($_POST['description'] ?? '');

if (empty($id) || empty($name) || empty($category) || $price <= 0 || $stock < 0) {
    echo json_encode(['success' => false, 'message' => 'Semua field harus diisi dengan benar']);
    exit;
}

try {
    $sql = "UPDATE products 
            SET name = :name, 
                category = :category, 
                price = :price, 
                stock = :stock, 
                description = :description 
            WHERE id = :id";
    
    $stmt = $conn->prepare($sql);
    
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':category', $category);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':stock', $stock);
    $stmt->bindParam(':description', $description);
    
    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Produk berhasil diupdate']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Tidak ada perubahan data']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal mengupdate produk']);
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>