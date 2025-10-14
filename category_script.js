document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    document.getElementById('categoryForm').addEventListener('submit', e => { e.preventDefault(); addCategory(); });
    document.getElementById('editForm').addEventListener('submit', e => { e.preventDefault(); updateCategory(); });
});

function loadCategories() {
    fetch('api/category/read.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('categoriesContainer');
            if (!data || data.length === 0) {
                container.innerHTML = '<p>Belum ada kategori.</p>';
                return;
            }
            container.innerHTML = `
                <table class="data-table">
                    <thead><tr><th>Nama Kategori</th><th width="150px">Aksi</th></tr></thead>
                    <tbody>
                        ${data.map(cat => `
                            <tr>
                                <td>${escapeHtml(cat.name)}</td>
                                <td class="actions">
                                    <button class="btn btn-warning" onclick="openEditModal(${cat.id}, '${escapeHtml(cat.name)}')">Edit</button>
                                    <button class="btn btn-danger" onclick="deleteCategory(${cat.id}, '${escapeHtml(cat.name)}')">Hapus</button>
                                </td>
                            </tr>`).join('')}
                    </tbody>
                </table>`;
        }).catch(err => console.error('Error:', err));
}

function addCategory() {
    const formData = new FormData(document.getElementById('categoryForm'));
    fetch('api/category/create.php', { method: 'POST', body: formData })
        .then(res => res.json()).then(data => {
            if (data.success) {
                document.getElementById('categoryForm').reset();
                loadCategories();
            }
        });
}

function openEditModal(id, name) {
    document.getElementById('edit_id').value = id;
    document.getElementById('edit_name').value = name;
    document.getElementById('editModal').style.display = 'block';
}

function updateCategory() {
    const formData = new FormData(document.getElementById('editForm'));
    fetch('api/category/update.php', { method: 'POST', body: formData })
        .then(res => res.json()).then(data => {
            if (data.success) {
                closeModal();
                loadCategories();
            }
        });
}

function deleteCategory(id, name) {
    if (confirm(`Yakin ingin menghapus kategori "${name}"?`)) {
        fetch('api/category/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'id=' + id
        }).then(res => res.json()).then(data => {
            if (data.success) {
                loadCategories();
            } else {
                alert(data.message);
            }
        });
    }
}

function closeModal() { document.getElementById('editModal').style.display = 'none'; }
function escapeHtml(text) { return text ? text.toString().replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[m]) : ''; }