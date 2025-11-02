// Stok functionality - Optimized DOM with debounce
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const searchInputEl = document.getElementById('searchInput');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Load logout functionality
    logoutBtn.addEventListener('click', handleLogout);
    
    // Check if dataBahanAjar is available
    if (typeof dataBahanAjar === 'undefined') {
        console.error('Data bahan ajar tidak ditemukan');
        return;
    }
    
    // Display all books
    displayStokTable(dataBahanAjar);
    
    // Optimized search with debounce
    let debounceTimer;
    searchInputEl.addEventListener('input', function(e) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredData = dataBahanAjar.filter(book => {
                return book.namaBarang.toLowerCase().includes(searchTerm) ||
                       book.kodeBarang.toLowerCase().includes(searchTerm) ||
                       book.kodeLokasi.toLowerCase().includes(searchTerm);
            });
            displayStokTable(filteredData);
        }, 150);
    });
    
    // Add stok form handler
    const addStokForm = document.getElementById('addStokForm');
    if (addStokForm) {
        addStokForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            const fields = ['kodeLokasiInput', 'kodeBarangInput', 'namaBarangInput', 'jenisBarangInput', 'edisiInput', 'stokInput'];
            fields.forEach(field => clearFieldError(field));
            
            // Get form values
            const kodeLokasi = document.getElementById('kodeLokasiInput').value.trim();
            const kodeBarang = document.getElementById('kodeBarangInput').value.trim();
            const namaBarang = document.getElementById('namaBarangInput').value.trim();
            const jenisBarang = document.getElementById('jenisBarangInput').value;
            const edisi = document.getElementById('edisiInput').value.trim();
            const stok = parseInt(document.getElementById('stokInput').value);
            const cover = document.getElementById('coverInput').value.trim() || 'img/default.jpg';
            
            // Validation
            let isValid = true;
            
            if (!kodeLokasi) {
                showFieldError('kodeLokasiInput', 'Kode lokasi tidak boleh kosong');
                isValid = false;
            }
            
            if (!kodeBarang) {
                showFieldError('kodeBarangInput', 'Kode barang tidak boleh kosong');
                isValid = false;
            }
            
            if (!namaBarang) {
                showFieldError('namaBarangInput', 'Nama buku tidak boleh kosong');
                isValid = false;
            }
            
            if (!jenisBarang) {
                showFieldError('jenisBarangInput', 'Jenis barang harus dipilih');
                isValid = false;
            }
            
            if (!edisi) {
                showFieldError('edisiInput', 'Edisi tidak boleh kosong');
                isValid = false;
            }
            
            if (isNaN(stok) || stok < 0) {
                showFieldError('stokInput', 'Stok harus berupa angka positif');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Check if kodeBarang already exists
            if (dataBahanAjar.find(b => b.kodeBarang === kodeBarang && b.kodeLokasi === kodeLokasi)) {
                showFieldError('kodeBarangInput', 'Kode barang dengan lokasi ini sudah ada');
                return;
            }
            
            // Show loading
            const addBtnText = document.getElementById('addBtnText');
            const addBtnLoader = document.getElementById('addBtnLoader');
            const submitBtn = addStokForm.querySelector('button[type="submit"]');
            
            submitBtn.disabled = true;
            addBtnText.style.display = 'none';
            addBtnLoader.style.display = 'inline-block';
            
            // Add new data
            const newBook = {
                kodeLokasi: kodeLokasi,
                kodeBarang: kodeBarang,
                namaBarang: namaBarang,
                jenisBarang: jenisBarang,
                edisi: edisi,
                stok: stok,
                cover: cover
            };
            
            // Simulate async operation
            setTimeout(() => {
                dataBahanAjar.push(newBook);
                
                // Refresh table
                displayStokTable(dataBahanAjar);
                
                // Show success message
                showToast('success', 'Berhasil', 'Stok baru berhasil ditambahkan!');
                
                // Reset and close modal
                addStokForm.reset();
                closeModal('addStokModal');
                
                // Reset button
                submitBtn.disabled = false;
                addBtnText.style.display = 'inline';
                addBtnLoader.style.display = 'none';
            }, 500);
        });
    }
    
    // Close modal handlers
    const closeBtns = document.querySelectorAll('.close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(modalId);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const addStokModal = document.getElementById('addStokModal');
        if (e.target === addStokModal) {
            closeModal('addStokModal');
        }
    });
});

// Reusable logout handler
function handleLogout(e) {
    e.preventDefault();
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Optimized table rendering with DocumentFragment and fallback image
function displayStokTable(data) {
    const tbody = document.querySelector('#stokTable tbody');
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Tidak ada data ditemukan</td></tr>';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNjY3ZWVhIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNzY0YmEyIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjgwIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+';
    
    data.forEach((book) => {
        // Find original index in dataBahanAjar
        const originalIndex = dataBahanAjar.findIndex(b => 
            b.kodeBarang === book.kodeBarang && b.kodeLokasi === book.kodeLokasi
        );
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${book.cover}" alt="${book.namaBarang}" class="book-cover" loading="lazy" onerror="this.src='${fallbackImage}'"></td>
            <td>${book.kodeLokasi}</td>
            <td>${book.kodeBarang}</td>
            <td><strong>${book.namaBarang}</strong></td>
            <td>${book.jenisBarang}</td>
            <td>${book.edisi}</td>
            <td><strong class="stok-value">${book.stok}</strong></td>
            <td>
                <button class="btn-small btn-danger" onclick="deleteStok(${originalIndex})" title="Hapus">🗑️</button>
            </td>
        `;
        fragment.appendChild(row);
    });
    
    // Single DOM operation
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}

// Open add stok modal
function openAddStokModal() {
    const modal = document.getElementById('addStokModal');
    if (modal) {
        modal.style.display = 'block';
        // Reset form
        document.getElementById('addStokForm').reset();
        // Clear errors
        const errorFields = ['kodeLokasi', 'kodeBarang', 'namaBarang', 'jenisBarang', 'edisi', 'stok', 'cover'];
        errorFields.forEach(field => clearFieldError(field + 'Input'));
    }
}

// Close modal helper
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Clear field error helper
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.remove('error');
    }
    
    if (errorEl) {
        errorEl.textContent = '';
    }
}

// Show field error helper
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
    }
    
    if (errorEl) {
        errorEl.textContent = message;
    }
}

// Delete stok function
function deleteStok(index) {
    if (index < 0 || index >= dataBahanAjar.length) {
        showToast('error', 'Error', 'Data tidak ditemukan');
        return;
    }
    
    const book = dataBahanAjar[index];
    
    // Show confirmation modal
    showConfirmDialog(
        'Hapus Stok',
        `Apakah Anda yakin ingin menghapus stok "${book.namaBarang}"?`,
        function() {
            // User confirmed
            dataBahanAjar.splice(index, 1);
            displayStokTable(dataBahanAjar);
            showToast('success', 'Berhasil', `Stok "${book.namaBarang}" berhasil dihapus!`);
        }
    );
}

// Show toast function (ensured to be available)
if (typeof showToast === 'undefined') {
    function showToast(type, title, message) {
        const container = document.getElementById('toastContainer');
        if (!container) {
            console.log(`${title}: ${message}`);
            return;
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ',
            warning: '⚠'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || ''}</span>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <span class="toast-close" onclick="this.parentElement.remove()">×</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }
}

// Show confirmation dialog
function showConfirmDialog(title, message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.maxWidth = '450px';
    
    modalContent.innerHTML = `
        <h2>${title}</h2>
        <p style="margin: 20px 0; color: var(--text-secondary);">${message}</p>
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button class="btn-primary btn-cancel" style="background: var(--text-secondary);">
                Batal
            </button>
            <button class="btn-primary btn-confirm" style="background: var(--error-color);">
                Hapus
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Button handlers
    const confirmBtn = modalContent.querySelector('.btn-confirm');
    const cancelBtn = modalContent.querySelector('.btn-cancel');
    
    confirmBtn.addEventListener('click', function() {
        onConfirm();
        modal.remove();
    });
    
    cancelBtn.addEventListener('click', function() {
        modal.remove();
    });
}

