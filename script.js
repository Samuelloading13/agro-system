// HAPUS SEMUA KODE LAMA DI script.js DAN GANTI DENGAN INI

document.addEventListener('DOMContentLoaded', function() {
    // Muat semua data yang diperlukan saat halaman pertama kali dibuka
    loadProducts();
    loadCategoriesIntoSelect();
    loadSuppliersIntoSelect();

    // Tambahkan event listener ke form
    document.getElementById('productForm').addEventListener('submit', e => { e.preventDefault(); addProduct(); });
    document.getElementById('editForm').addEventListener('submit', e => { e.preventDefault(); updateProduct(); });
});

// Fungsi untuk menangani fetch dan mengubahnya menjadi JSON
async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch API Error:', url, error);
        alert(`Terjadi kesalahan saat berkomunikasi dengan server: ${error.message}`);
        return null;
    }
}

async function postAPI(url, formData) {
    try {
        const response = await fetch(url, { method: 'POST', body: formData });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Post API Error:', url, error);
        alert(`Gagal mengirim data: ${error.message}`);
        return null;
    }
}

async function loadProducts() {
    // Alamat API yang benar
    const data = await fetchAPI('api/product/read.php');
    const container = document.getElementById('productsContainer');
    
    if (!data) {
        container.innerHTML = '<p style="color: red;">Gagal memuat data produk. Cek console (F12) untuk detail error.</p>';
        return;
    }
    
    const placeholder = 'https://via.placeholder.com/300x200.png?text=No+Image';
    if (data.length === 0) {
        container.innerHTML = '<p>Belum ada produk yang ditambahkan.</p>';
        return;
    }

    container.innerHTML = data.map(p => `
        <div class="product-card">
            <img src="${escapeHtml(p.image_url) || placeholder}" alt="${escapeHtml(p.name)}" onerror="this.src='${placeholder}'">
            <div class="product-card-content">
                <h3>${escapeHtml(p.name)}</h3>
                <p class="price">Rp ${new Intl.NumberFormat('id-ID').format(p.price)}</p>
                <p class="stock">Stok: ${p.stock} | Kategori: ${escapeHtml(p.category_name) || 'N/A'}</p>
                <div class="product-actions">
                    <button class="btn btn-warning" onclick="openEditModal(${p.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${p.id}, '${escapeHtml(p.name)}')">Hapus</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function openEditModal(id) {
    // Alamat API yang benar
    const product = await fetchAPI(`api/product/read.php?id=${id}`);
    if (product) {
        document.getElementById('edit_id').value = product.id;
        document.getElementById('edit_name').value = product.name;
        document.getElementById('edit_category').value = product.category_id;
        document.getElementById('edit_supplier').value = product.supplier_id;
        document.getElementById('edit_price').value = product.price;
        document.getElementById('edit_stock').value = product.stock;
        document.getElementById('edit_image_url').value = product.image_url;
        document.getElementById('edit_description').value = product.description;
        document.getElementById('editModal').style.display = 'block';
    }
}

async function loadCategoriesIntoSelect() {
    const data = await fetchAPI('api/category/read.php');
    if (data) {
        const selects = [document.getElementById('category'), document.getElementById('edit_category')];
        selects.forEach(select => {
            if(select) {
                select.innerHTML = '<option value="">Pilih Kategori</option>';
                data.forEach(cat => {
                    select.innerHTML += `<option value="${cat.id}">${escapeHtml(cat.name)}</option>`;
                });
            }
        });
    }
}

async function loadSuppliersIntoSelect() {
    const data = await fetchAPI('api/supplier/read.php');
    if (data) {
        const selects = [document.getElementById('supplier'), document.getElementById('edit_supplier')];
        selects.forEach(select => {
            if(select) {
                select.innerHTML = '<option value="">Pilih Pemasok (Opsional)</option>';
                data.forEach(sup => {
                    select.innerHTML += `<option value="${sup.id}">${escapeHtml(sup.name)}</option>`;
                });
            }
        });
    }
}

async function addProduct() {
    const form = document.getElementById('productForm');
    const result = await postAPI('api/product/create.php', new FormData(form));
    if (result && result.success) {
        form.reset();
        loadProducts();
    }
}

async function updateProduct() {
    const form = document.getElementById('editForm');
    const result = await postAPI('api/product/update.php', new FormData(form));
    if (result && result.success) {
        closeModal();
        loadProducts();
    }
}

async function deleteProduct(id, name) {
    if (confirm(`Yakin ingin menghapus produk "${name}"?`)) {
        const formData = new FormData();
        formData.append('id', id);
        const result = await postAPI('api/product/delete.php', formData);
        if (result && result.success) {
            loadProducts();
        }
    }
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function escapeHtml(text) { 
    if (text === null || typeof text === 'undefined') return '';
    const map = {
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]); 
}