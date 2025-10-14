<?php
require_once '../../config.php';

$id = $_POST['id'] ?? 0;
$name = trim($_POST['name'] ?? '');

// Validasi input tidak boleh kosong
if (empty($id) || empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap.']);
    exit;
}

try {
    $sql = "UPDATE categories SET name = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$name, $id]);
    // rowCount() > 0 berarti ada baris yang berhasil diupdate
    echo json_encode(['success' => $stmt->rowCount() > 0]);
} catch (PDOException $e) {
    if ($e->errorInfo[1] == 1062) {
        echo json_encode(['success' => false, 'message' => 'Nama kategori tersebut sudah digunakan.']);
    } else {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>