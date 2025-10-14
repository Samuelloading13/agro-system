<?php
require_once '../../config.php';

$id = $_GET['id'] ?? null;

try {
    if ($id) {
        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch());
    } else {
         $sql = "SELECT p.*, c.name as category_name, s.name as supplier_name
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                LEFT JOIN suppliers s ON p.supplier_id = s.id
                ORDER BY p.created_at DESC";
        $stmt = $conn->query($sql);
        echo json_encode($stmt->fetchAll());
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>