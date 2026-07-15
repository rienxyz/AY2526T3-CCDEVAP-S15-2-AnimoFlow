/**
 * AnimoFlow Admin Login Page
 */
document.addEventListener('DOMContentLoaded', function() {

    // ===== DARK MODE TOGGLE =====
    const darkModeToggle = document.getElementById('darkModeToggle');

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('animoflow_darkmode', isDark ? 'dark' : 'light');
        if (darkModeToggle) darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    }

    const savedTheme = localStorage.getItem('animoflow_darkmode');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }
    if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);

    // ===== TOAST =====
    const toastElement = document.getElementById('liveToast');
    let bsToast = null;
    if (toastElement) {
        bsToast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
    }

    function showToast(message, type = 'info') {
        if (!bsToast || !toastElement) return;
        const toastBody = toastElement.querySelector('.toast-body');
        if (toastBody) toastBody.innerHTML = message;
        toastElement.style.background = type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#006837';
        if (type === 'warning') {
            toastElement.querySelector('.toast-body').style.color = '#1a2b1a';
        } else {
            toastElement.querySelector('.toast-body').style.color = 'white';
        }
        bsToast.show();
    }

    // ===== DOM Elements =====
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminEmail = document.getElementById('adminEmail');
    const adminPassword = document.getElementById('adminPassword');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const backToDashboardBtn = document.getElementById('backToDashboardBtn');

    // ===== Check existing session =====
    function checkExistingAdminSession() {
        const adminToken = localStorage.getItem('animoflow_admin_token');
        const adminUser = localStorage.getItem('animoflow_admin_user');
        if (adminToken && adminUser) {
            showToast('Already logged in as admin. Redirecting...', 'info');
            setTimeout(() => { window.location.href = 'admin.html'; }, 800);
            return true;
        }
        const userData = localStorage.getItem('animoflow_user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.role === 'admin') {
                    const token = btoa(user.email + ':' + Date.now());
                    localStorage.setItem('animoflow_admin_token', token);
                    localStorage.setItem('animoflow_admin_user', JSON.stringify({
                        email: user.email, role: 'admin'
                    }));
                    showToast('Admin session restored. Redirecting...', 'info');
                    setTimeout(() => { window.location.href = 'admin.html'; }, 800);
                    return true;
                }
            } catch (e) {}
        }
        return false;
    }

    if (checkExistingAdminSession()) return;

    // ===== Admin Login =====
    async function handleAdminLogin(event) {
        event.preventDefault();
        const email = adminEmail.value.trim();
        const password = adminPassword.value.trim();
        
        if (!email) { showToast('Please enter your admin email', 'error'); adminEmail.focus(); return; }
        if (!password) { showToast('Please enter your password', 'error'); adminPassword.focus(); return; }
        if (password.length < 8) { showToast('Password must be at least 8 characters', 'error'); adminPassword.focus(); return; }

        adminLoginBtn.disabled = true;
        adminLoginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Verifying...';

        try {
            const response = await fetch('http://localhost:3999/api/auth/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                // Store admin session
                localStorage.setItem('animoflow_admin_token', data.token);
                localStorage.setItem('animoflow_admin_user', JSON.stringify(data.user));
                
                // Also set regular user info for dashboard
                localStorage.setItem('animoflow_user', JSON.stringify({
                    email: data.user.email,
                    role: 'admin',
                    loginTime: new Date().toISOString()
                }));
                
                showToast('✅ Admin login successful!', 'success');
                setTimeout(() => { window.location.href = 'admin.html'; }, 800);
            } else {
                showToast('❌ ' + (data.error || 'Invalid admin credentials'), 'error');
                adminLoginBtn.disabled = false;
                adminLoginBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Login as Admin';
                adminPassword.value = '';
                adminPassword.focus();
            }
        } catch (err) {
            console.error('Admin login error:', err);
            showToast('❌ Server error. Make sure the backend is running.', 'error');
            adminLoginBtn.disabled = false;
            adminLoginBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Login as Admin';
        }
    }

    // ===== Event Listeners =====
    if (adminLoginForm) adminLoginForm.addEventListener('submit', handleAdminLogin);
    if (adminPassword) {
        adminPassword.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') adminLoginForm.dispatchEvent(new Event('submit'));
        });
    }
    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', function() {
            window.location.href = 'dashboard-index.html';
        });
    }

    console.log('[AnimoFlow] Admin Login page initialized');
});