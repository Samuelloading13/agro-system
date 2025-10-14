<?php
require_once '../../config.php';

$name = trim($_POST['name'] ?? '');
if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Nama pemasok tidak boleh kosong.']);
    exit;
}

try {
    $sql = "INSERT INTO suppliers (name, contact_person, phone, address) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $name,
        $_POST['contact_person'] ?? null,
        $_POST['phone'] ?? null,
        $_POST['address'] ?? null
    ]);
    echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>