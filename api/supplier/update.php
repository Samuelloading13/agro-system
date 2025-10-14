<?php
require_once '../../config.php';

$id = $_POST['id'] ?? 0;
$name = trim($_POST['name'] ?? '');

if (empty($id) || empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap.']);
    exit;
}

try {
    $sql = "UPDATE suppliers SET name = ?, contact_person = ?, phone = ?, address = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $name,
        $_POST['contact_person'] ?? null,
        $_POST['phone'] ?? null,
        $_POST['address'] ?? null,
        $id
    ]);
    echo json_encode(['success' => $stmt->rowCount() > 0]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>