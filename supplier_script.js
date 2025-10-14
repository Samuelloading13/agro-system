document.addEventListener('DOMContentLoaded', function() {
    loadSuppliers();
    document.getElementById('supplierForm').addEventListener('submit', e => { e.preventDefault(); addSupplier(); });
    document.getElementById('editForm').addEventListener('submit', e => { e.preventDefault(); updateSupplier(); });
});

function loadSuppliers() {
    fetch('api/supplier/read.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('suppliersContainer');
             if (!data || data.length === 0) {
                container.innerHTML = '<p>Belum ada pemasok.</p>';
                return;
            }
            container.innerHTML = `
                <table class="data-table">
                    <thead><tr><th>Nama Pemasok</th><th>Kontak Person</th><th>Telepon</th><th width="150px">Aksi</th></tr></thead>
                    <tbody>
                        ${data.map(s => `
                            <tr>
                                <td>${escapeHtml(s.name)}</td>
                                <td>${escapeHtml(s.contact_person)}</td>
                                <td>${escapeHtml(s.phone)}</td>
                                <td class="actions">
                                    <button class="btn btn-warning" onclick="openEditModal(${s.id})">Edit</button>
                                    <button class="btn btn-danger" onclick="deleteSupplier(${s.id}, '${escapeHtml(s.name)}')">Hapus</button>
                                </td>
                            </tr>`).join('')}
                    </tbody>
                </table>`;
        });
}

function addSupplier() {
    const formData = new FormData(document.getElementById('supplierForm'));
    fetch('api/supplier/create.php', { method: 'POST', body: formData })
        .then(res => res.json()).then(data => {
            if (data.success) {
                document.getElementById('supplierForm').reset();
                loadSuppliers();
            }
        });
}

function openEditModal(id) {
     fetch(`api/supplier/read.php?id=${id}`) // Assuming the API can fetch a single supplier
        .then(res => res.json())
        .then(supplier => {
            if (supplier) {
                document.getElementById('edit_id').value = supplier.id;
                document.getElementById('edit_name').value = supplier.name;
                document.getElementById('edit_contact_person').value = supplier.contact_person;
                document.getElementById('edit_phone').value = supplier.phone;
                document.getElementById('edit_address').value = supplier.address;
                document.getElementById('editModal').style.display = 'block';
            }
        });
}

function updateSupplier() {
    const formData = new FormData(document.getElementById('editForm'));
    fetch('api/supplier/update.php', { method: 'POST', body: formData })
        .then(res => res.json()).then(data => {
            if (data.success) {
                closeModal();
                loadSuppliers();
            }
        });
}

function deleteSupplier(id, name) {
    if (confirm(`Yakin ingin menghapus pemasok "${name}"?`)) {
        fetch('api/supplier/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'id=' + id
        }).then(res => res.json()).then(data => {
            if (data.success) {
                loadSuppliers();
            } else {
                alert(data.message);
            }
        });
    }
}

function closeModal() { document.getElementById('editModal').style.display = 'none'; }
function escapeHtml(text) { return text ? text.toString().replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[m]) : ''; }