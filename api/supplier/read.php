<?php
require_once '../../config.php';

$id = $_GET['id'] ?? null;

try {
    if ($id) {
        // Mengambil satu data pemasok berdasarkan ID
        $stmt = $conn->prepare("SELECT * FROM suppliers WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
    } else {
        // Mengambil semua data pemasok
        $stmt = $conn->query("SELECT * FROM suppliers ORDER BY name ASC");
        echo json_encode($stmt->fetchAll());
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>