<?php
require_once '../../config.php';

try {
    // Mengambil semua data kategori dan mengurutkannya berdasarkan nama
    $sql = "SELECT * FROM categories ORDER BY name ASC";
    $stmt = $conn->query($sql);
    echo json_encode($stmt->fetchAll());
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>