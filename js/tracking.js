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

// Optimized search tracking function with loading state
function searchTracking() {
    const searchInput = document.getElementById('searchInput');
    const nomorDO = searchInput.value.trim();
    const trackingResult = document.getElementById('trackingResult');
    const searchBtn = document.getElementById('searchBtn');
    const searchBtnText = document.getElementById('searchBtnText');
    const searchBtnLoader = document.getElementById('searchBtnLoader');
    
    // Check if dataTracking is available
    if (typeof dataTracking === 'undefined') {
        trackingResult.innerHTML = '<div class="message error">⚠️ Error: Data tracking tidak ditemukan</div>';
        return;
    }
    
    if (!nomorDO) {
        trackingResult.innerHTML = '<div class="message error">⚠️ Masukkan nomor DO terlebih dahulu</div>';
        return;
    }
    
    // Show loading state
    searchBtn.disabled = true;
    searchBtnText.style.display = 'none';
    searchBtnLoader.style.display = 'inline-block';
    trackingResult.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Mencari data tracking...</p></div>';
    
    // Simulate async search (in real app, this would be API call)
    setTimeout(() => {
        // Search for tracking data
        const trackingData = dataTracking[nomorDO];
        
        // Reset button state
        searchBtn.disabled = false;
        searchBtnText.style.display = 'inline';
        searchBtnLoader.style.display = 'none';
        
        if (!trackingData) {
            trackingResult.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">❌</div>
                    <h3>Nomor DO Tidak Ditemukan</h3>
                    <p>Nomor DO <strong>${nomorDO}</strong> tidak ditemukan dalam sistem.</p>
                    <p class="error-hint">Pastikan nomor DO yang Anda masukkan sudah benar.</p>
                </div>
            `;
            return;
        }
        
        // Display tracking information
        displayTrackingResult(trackingData);
    }, 500);
}

// Optimized result display with modern template
function displayTrackingResult(data) {
    const trackingResult = document.getElementById('trackingResult');
    const statusLower = data.status.toLowerCase();
    const statusClass = statusLower.includes('selesai') ? 'selesai' 
        : statusLower.includes('dalam perjalanan') ? 'proses' 
        : 'dikirim';
    
    const statusIcon = statusLower.includes('selesai') ? '✓' 
        : statusLower.includes('dalam perjalanan') ? '🚚' 
        : '📦';
    
    // Calculate progress percentage
    const totalSteps = data.perjalanan ? data.perjalanan.length : 0;
    const progressPercentage = statusLower.includes('selesai') ? 100 
        : totalSteps > 0 ? Math.min((totalSteps / 6) * 100, 90) : 0;
    
    // Build timeline HTML more efficiently with enhanced design
    const timelineHTML = (data.perjalanan && data.perjalanan.length > 0) 
        ? `
        <div class="tracking-timeline-modern">
            <div class="timeline-header">
                <h4>📍 Riwayat Pengiriman</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <div class="progress-text">${Math.round(progressPercentage)}% Selesai</div>
            </div>
            <div class="timeline-container">
                ${data.perjalanan.map((item, index) => {
                    const isLast = index === data.perjalanan.length - 1;
                    const isFirst = index === 0;
                    return `
                    <div class="timeline-item-modern ${isLast ? 'completed' : ''} ${isFirst ? 'current' : ''}">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <div class="timeline-time-modern">${formatDateTime(item.waktu)}</div>
                            <div class="timeline-desc-modern">${item.keterangan}</div>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        `
        : '';
    
    trackingResult.innerHTML = `
        <div class="tracking-card-modern">
            <div class="tracking-header-modern">
                <div class="tracking-status-large">
                    <div class="status-icon-large ${statusClass}">${statusIcon}</div>
                    <div class="status-text-large">
                        <h3>${data.status}</h3>
                        <p>Nomor DO: <strong>${data.nomorDO}</strong></p>
                    </div>
                </div>
            </div>
            
            <div class="tracking-info-grid">
                <div class="info-card">
                    <div class="info-icon">👤</div>
                    <div class="info-content">
                        <div class="info-label-modern">Penerima</div>
                        <div class="info-value-modern">${data.nama}</div>
                    </div>
                </div>
                
                <div class="info-card">
                    <div class="info-icon">🚚</div>
                    <div class="info-content">
                        <div class="info-label-modern">Ekspedisi</div>
                        <div class="info-value-modern">${data.ekspedisi}</div>
                    </div>
                </div>
                
                <div class="info-card">
                    <div class="info-icon">📅</div>
                    <div class="info-content">
                        <div class="info-label-modern">Tanggal Kirim</div>
                        <div class="info-value-modern">${formatDate(data.tanggalKirim)}</div>
                    </div>
                </div>
                
                <div class="info-card">
                    <div class="info-icon">📦</div>
                    <div class="info-content">
                        <div class="info-label-modern">Kode Paket</div>
                        <div class="info-value-modern">${data.paket}</div>
                    </div>
                </div>
                
                <div class="info-card total-card">
                    <div class="info-icon">💰</div>
                    <div class="info-content">
                        <div class="info-label-modern">Total Biaya</div>
                        <div class="info-value-modern total-amount">${data.total}</div>
                    </div>
                </div>
            </div>
            
            ${timelineHTML}
        </div>
    `;
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

// Helper function to format date and time
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    const options = { 
        weekday: 'short',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
}

