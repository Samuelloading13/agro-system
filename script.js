document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addProduct();
    });
    
    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateProduct();
    });
    
    document.getElementById('searchInput').addEventListener('input', function(e) {
        searchProducts(e.target.value);
    });
    
    window.onclick = function(event) {
        const modal = document.getElementById('editModal');
        if (event.target == modal) {
            closeModal();
        }
    };
});

function loadProducts() {
    fetch('get_products.php')
        .then(response => response.json())
        .then(data => {
            displayProducts(data);
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Gagal memuat data produk', 'error');
        });
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #6b7280;">
                <h3>📦 Belum ada produk</h3>
                <p>Tambahkan produk pertama Anda!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-header">
                <h3>${escapeHtml(product.name)}</h3>
                <span class="category-badge">${escapeHtml(product.category)}</span>
            </div>
            <div class="product-info">
                <p class="price">Rp ${formatNumber(product.price)}</p>
                <p><span class="stock">Stok: ${product.stock}</span></p>
                <p style="margin-top: 10px;">${escapeHtml(product.description || 'Tidak ada deskripsi')}</p>
                <p style="font-size: 0.85em; color: #9ca3af; margin-top: 10px;">
                    📅 ${formatDate(product.created_at)}
                </p>
            </div>
            <div class="product-actions">
                <button class="btn btn-warning" onclick="openEditModal(${product.id})">
                    ✏️ Edit
                </button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id}, '${escapeHtml(product.name)}')">
                    🗑️ Hapus
                </button>
            </div>
        </div>
    `).join('');
}

function addProduct() {
    const formData = new FormData(document.getElementById('productForm'));
    
    fetch('create.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('✅ Produk berhasil ditambahkan!', 'success');
            document.getElementById('productForm').reset();
            loadProducts();
        } else {
            showNotification('❌ ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('❌ Terjadi kesalahan', 'error');
    });
}

function openEditModal(id) {
    fetch('get_products.php?id=' + id)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const product = data[0];
                document.getElementById('edit_id').value = product.id;
                document.getElementById('edit_name').value = product.name;
                document.getElementById('edit_category').value = product.category;
                document.getElementById('edit_price').value = product.price;
                document.getElementById('edit_stock').value = product.stock;
                document.getElementById('edit_description').value = product.description || '';
                
                document.getElementById('editModal').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('❌ Gagal memuat data produk', 'error');
        });
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function updateProduct() {
    const formData = new FormData(document.getElementById('editForm'));
    
    fetch('update.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('✅ Produk berhasil diupdate!', 'success');
            closeModal();
            loadProducts();
        } else {
            showNotification('❌ ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('❌ Terjadi kesalahan', 'error');
    });
}

function deleteProduct(id, name) {
    if (confirm(`Yakin ingin menghapus produk "${name}"?`)) {
        fetch('delete.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'id=' + id
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('✅ Produk berhasil dihapus!', 'success');
                loadProducts();
            } else {
                showNotification('❌ ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('❌ Terjadi kesalahan', 'error');
        });
    }
}

function searchProducts(query) {
    fetch('get_products.php?search=' + encodeURIComponent(query))
        .then(response => response.json())
        .then(data => {
            displayProducts(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function formatNumber(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);