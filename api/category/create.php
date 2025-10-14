<?php
require_once '../../config.php';

// Validasi input nama tidak boleh kosong
$name = trim($_POST['name'] ?? '');
if (empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Nama kategori tidak boleh kosong.']);
    exit;
}

try {
    $sql = "INSERT INTO categories (name) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$name]);
    echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
} catch (PDOException $e) {
    // Menangani error jika nama kategori sudah ada (karena UNIQUE constraint)
    if ($e->errorInfo[1] == 1062) {
        echo json_encode(['success' => false, 'message' => 'Nama kategori sudah ada.']);
    } else {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>