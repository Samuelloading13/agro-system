<?php
require_once '../../config.php';

$image_url = !empty($_POST['image_url']) ? trim($_POST['image_url']) : 'https://via.placeholder.com/300x200.png?text=No+Image';
$supplier_id = !empty($_POST['supplier_id']) ? $_POST['supplier_id'] : null;

try {
    $sql = "UPDATE products SET name=?, category_id=?, supplier_id=?, price=?, stock=?, description=?, image_url=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $_POST['name'],
        $_POST['category_id'],
        $supplier_id,
        $_POST['price'],
        $_POST['stock'],
        $_POST['description'],
        $image_url,
        $_POST['id']
    ]);
    echo json_encode(['success' => $stmt->rowCount() > 0]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>