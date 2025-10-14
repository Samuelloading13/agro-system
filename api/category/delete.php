<?php
require_once '../../config.php';

$id = $_POST['id'] ?? 0;

if (empty($id)) {
    echo json_encode(['success' => false, 'message' => 'ID tidak valid.']);
    exit;
}

try {
    $sql = "DELETE FROM categories WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    // Menangani error jika kategori masih terhubung dengan produk
    if ($e->errorInfo[1] == 1451) {
        echo json_encode(['success' => false, 'message' => 'Gagal menghapus: Kategori ini masih digunakan oleh produk.']);
    } else {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>