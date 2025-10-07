<?php
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$id = $_POST['id'] ?? 0;

if (empty($id) || !is_numeric($id)) {
    echo json_encode(['success' => false, 'message' => 'ID produk tidak valid']);
    exit;
}

try {
    $sql = "DELETE FROM products WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id);
    
    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Produk berhasil dihapus']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Produk tidak ditemukan']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal menghapus produk']);
    }
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>