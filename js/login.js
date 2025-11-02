// Login functionality - Optimized DOM with Validation
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const lupaPasswordBtn = document.getElementById('lupaPasswordBtn');
    const daftarBtn = document.getElementById('daftarBtn');
    const lupaPasswordModal = document.getElementById('lupaPasswordModal');
    const daftarModal = document.getElementById('daftarModal');
    const closeBtns = document.querySelectorAll('.close');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const lupaPasswordForm = document.getElementById('lupaPasswordForm');
    const daftarForm = document.getElementById('daftarForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginBtnLoader = document.getElementById('loginBtnLoader');
    const loginAlert = document.getElementById('loginAlert');

    // Open modals
    if (lupaPasswordBtn) {
        lupaPasswordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(lupaPasswordModal);
        });
    }

    if (daftarBtn) {
        daftarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(daftarModal);
        });
    }

    // Close modals with event delegation
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            closeModal(document.getElementById(modalId));
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === lupaPasswordModal) closeModal(lupaPasswordModal);
        if (e.target === daftarModal) closeModal(daftarModal);
    });

    // Login form with cached elements and validation
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearFieldError('email');
            clearFieldError('password');
            hideAlert();
            
            // Validate inputs
            let isValid = true;
            
            if (!emailInput.value.trim()) {
                showFieldError('email', 'Email tidak boleh kosong');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showFieldError('email', 'Format email tidak valid');
                isValid = false;
            }
            
            if (!passwordInput.value.trim()) {
                showFieldError('password', 'Password tidak boleh kosong');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Check data availability
            if (typeof dataPengguna === 'undefined') {
                showToast('error', 'Error', 'Data pengguna tidak ditemukan');
                return;
            }
            
            // Show loading
            setButtonLoading(true);
            
            // Simulate async operation
            setTimeout(() => {
                const user = dataPengguna.find(u => 
                    u.email === emailInput.value && 
                    u.password === passwordInput.value
                );
                
                setButtonLoading(false);
                
                if (user) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    showToast('success', 'Berhasil', 'Login berhasil! Mengalihkan...');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    showFieldError('email', 'Email atau password salah');
                    showFieldError('password', '');
                }
            }, 500);
        });
    }

    // Real-time email validation
    emailInput.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
            showFieldError('email', 'Format email tidak valid');
        } else {
            clearFieldError('email');
        }
    });

    // Forgot password form with validation
    if (lupaPasswordForm) {
        lupaPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearFieldError('emailReset');
            
            const emailReset = document.getElementById('emailReset').value.trim();
            
            if (!emailReset) {
                showFieldError('emailReset', 'Email tidak boleh kosong');
                return;
            }
            
            if (!isValidEmail(emailReset)) {
                showFieldError('emailReset', 'Format email tidak valid');
                return;
            }
            
            showToast('success', 'Berhasil', 'Link reset password telah dikirim ke email Anda!');
            setTimeout(() => {
                closeModal(lupaPasswordModal);
                document.getElementById('emailReset').value = '';
            }, 1500);
        });
    }

    // Register form with validation
    if (daftarForm) {
        daftarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear all errors
            const fields = ['namaDaftar', 'emailDaftar', 'passwordDaftar', 'roleDaftar'];
            fields.forEach(field => clearFieldError(field));
            
            let isValid = true;
            const namaDaftar = document.getElementById('namaDaftar').value.trim();
            const emailDaftar = document.getElementById('emailDaftar').value.trim();
            const passwordDaftar = document.getElementById('passwordDaftar').value;
            const roleDaftar = document.getElementById('roleDaftar').value;
            
            // Validate nama
            if (!namaDaftar) {
                showFieldError('namaDaftar', 'Nama tidak boleh kosong');
                isValid = false;
            } else if (namaDaftar.length < 3) {
                showFieldError('namaDaftar', 'Nama minimal 3 karakter');
                isValid = false;
            }
            
            // Validate email
            if (!emailDaftar) {
                showFieldError('emailDaftar', 'Email tidak boleh kosong');
                isValid = false;
            } else if (!isValidEmail(emailDaftar)) {
                showFieldError('emailDaftar', 'Format email tidak valid');
                isValid = false;
            } else if (!emailDaftar.endsWith('@ut.ac.id')) {
                showFieldError('emailDaftar', 'Email harus menggunakan domain @ut.ac.id');
                isValid = false;
            }
            
            // Validate password
            if (!passwordDaftar) {
                showFieldError('passwordDaftar', 'Password tidak boleh kosong');
                isValid = false;
            } else if (passwordDaftar.length < 6) {
                showFieldError('passwordDaftar', 'Password minimal 6 karakter');
                isValid = false;
            }
            
            // Validate role
            if (!roleDaftar) {
                showFieldError('roleDaftar', 'Role harus dipilih');
                isValid = false;
            }
            
            if (!isValid) return;
            
            showToast('success', 'Berhasil', 'Pendaftaran berhasil! Silakan login.');
            setTimeout(() => {
                closeModal(daftarModal);
                daftarForm.reset();
            }, 1500);
        });
    }
});

// Helper functions
function openModal(modal) {
    modal.style.display = 'block';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
    }
    
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.remove('error');
        field.classList.add('success');
    }
    
    if (errorEl) {
        errorEl.textContent = '';
    }
}

function hideAlert() {
    const alert = document.getElementById('loginAlert');
    if (alert) alert.style.display = 'none';
}

function setButtonLoading(loading) {
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginBtnLoader = document.getElementById('loginBtnLoader');
    
    if (!loginBtn) return;
    
    if (loading) {
        loginBtn.disabled = true;
        if (loginBtnText) loginBtnText.style.display = 'none';
        if (loginBtnLoader) loginBtnLoader.style.display = 'inline-block';
    } else {
        loginBtn.disabled = false;
        if (loginBtnText) loginBtnText.style.display = 'inline';
        if (loginBtnLoader) loginBtnLoader.style.display = 'none';
    }
}

// Toast notification system
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
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
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

