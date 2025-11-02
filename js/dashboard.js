// Dashboard functionality - Optimized DOM
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const userNameEl = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const totalPengirimanEl = document.getElementById('totalPengiriman');
    const paketSelesaiEl = document.getElementById('paketSelesai');
    const paketProsesEl = document.getElementById('paketProses');
    
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user name
    userNameEl.textContent = currentUser.nama;
    
    // Load logout functionality with event delegation
    logoutBtn.addEventListener('click', handleLogout);
    
    // Check if dataTracking is available
    if (typeof dataTracking === 'undefined') {
        console.error('Data tracking tidak ditemukan');
        return;
    }
    
    // Optimized statistics calculation
    const trackingData = Object.values(dataTracking);
    const totalPengiriman = trackingData.length;
    let paketSelesai = 0;
    let paketProses = 0;
    
    // Single loop for counting
    trackingData.forEach(t => {
        if (t.status === 'Selesai') {
            paketSelesai++;
        } else {
            paketProses++;
        }
    });
    
    // Batch DOM updates
    totalPengirimanEl.textContent = totalPengiriman;
    paketSelesaiEl.textContent = paketSelesai;
    paketProsesEl.textContent = paketProses;
    
    // Display tracking table with DocumentFragment
    displayTrackingTable(trackingData);
});

// Reusable logout handler
function handleLogout(e) {
    e.preventDefault();
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Optimized table rendering with DocumentFragment
function displayTrackingTable(data) {
    const tbody = document.querySelector('#trackingTable tbody');
    const fragment = document.createDocumentFragment();
    
    // Create all rows first
    data.forEach(tracking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tracking.nomorDO}</td>
            <td>${tracking.nama}</td>
            <td>${getStatusBadge(tracking.status)}</td>
            <td>${tracking.ekspedisi}</td>
            <td>${tracking.total}</td>
        `;
        fragment.appendChild(row);
    });
    
    // Single DOM operation
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}

// Optimized status badge function
function getStatusBadge(status) {
    const statusLower = status.toLowerCase();
    let className = 'status-badge';
    
    if (statusLower.includes('selesai')) {
        className += ' selesai';
    } else if (statusLower.includes('dalam perjalanan')) {
        className += ' proses';
    } else {
        className += ' dikirim';
    }
    
    return `<span class="${className}">${status}</span>`;
}

