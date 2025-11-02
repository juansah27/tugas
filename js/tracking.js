// Tracking functionality - Optimized DOM
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
    
    // Optimized search on Enter key
    searchInputEl.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchTracking();
        }
    });
});

// Reusable logout handler
function handleLogout(e) {
    e.preventDefault();
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Optimized search tracking function
function searchTracking() {
    const searchInput = document.getElementById('searchInput');
    const nomorDO = searchInput.value.trim();
    const trackingResult = document.getElementById('trackingResult');
    
    // Check if dataTracking is available
    if (typeof dataTracking === 'undefined') {
        trackingResult.innerHTML = '<div class="message error">Error: Data tracking tidak ditemukan</div>';
        return;
    }
    
    if (!nomorDO) {
        trackingResult.innerHTML = '<div class="message error">Masukkan nomor DO terlebih dahulu</div>';
        return;
    }
    
    // Search for tracking data
    const trackingData = dataTracking[nomorDO];
    
    if (!trackingData) {
        trackingResult.innerHTML = '<div class="message error">Nomor DO tidak ditemukan</div>';
        return;
    }
    
    // Display tracking information
    displayTrackingResult(trackingData);
}

// Optimized result display with template
function displayTrackingResult(data) {
    const trackingResult = document.getElementById('trackingResult');
    const statusLower = data.status.toLowerCase();
    const statusClass = statusLower.includes('selesai') ? 'selesai' 
        : statusLower.includes('dalam perjalanan') ? 'proses' 
        : 'dikirim';
    
    // Build timeline HTML more efficiently
    const timelineHTML = (data.perjalanan && data.perjalanan.length > 0) 
        ? '<div class="tracking-timeline"><h4>Riwayat Pengiriman</h4>' +
          data.perjalanan.map(item => `
            <div class="timeline-item">
                <div class="timeline-time">${item.waktu}</div>
                <div class="timeline-desc">${item.keterangan}</div>
            </div>
          `).join('') + '</div>'
        : '';
    
    trackingResult.innerHTML = `
        <div class="tracking-info">
            <h3>Informasi Pengiriman</h3>
            <div class="info-row">
                <span class="info-label">Nomor DO:</span>
                <span class="info-value">${data.nomorDO}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Nama:</span>
                <span class="info-value">${data.nama}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value"><span class="status-badge ${statusClass}">${data.status}</span></span>
            </div>
            <div class="info-row">
                <span class="info-label">Ekspedisi:</span>
                <span class="info-value">${data.ekspedisi}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Tanggal Kirim:</span>
                <span class="info-value">${data.tanggalKirim}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Paket:</span>
                <span class="info-value">${data.paket}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Total:</span>
                <span class="info-value">${data.total}</span>
            </div>
        </div>
        ${timelineHTML}
    `;
}

