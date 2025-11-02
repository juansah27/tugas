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
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Tidak ada data ditemukan</td></tr>';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNjY3ZWVhIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNzY0YmEyIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjgwIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+';
    
    data.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${book.cover}" alt="${book.namaBarang}" class="book-cover" loading="lazy" onerror="this.src='${fallbackImage}'"></td>
            <td>${book.kodeLokasi}</td>
            <td>${book.kodeBarang}</td>
            <td>${book.namaBarang}</td>
            <td>${book.jenisBarang}</td>
            <td>${book.edisi}</td>
            <td><strong>${book.stok}</strong></td>
        `;
        fragment.appendChild(row);
    });
    
    // Single DOM operation
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}

