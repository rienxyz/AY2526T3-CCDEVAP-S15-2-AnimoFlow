/**
 * AnimoFlow Login Page - With Backend Authentication
 */
document.addEventListener('DOMContentLoaded', function() {
    
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('dlsuEmail');
    const passwordInput = document.getElementById('password');
    const guestCheckbox = document.getElementById('guestDemo');
    const loginBtn = document.getElementById('loginBtn');
    const emailErrorDiv = document.getElementById('emailError');
    const passwordErrorDiv = document.getElementById('passwordError');
    const forgotLink = document.getElementById('forgotLink');
    
    // ===== DARK MODE TOGGLE =====
    const darkModeToggle = document.getElementById('darkModeToggle');

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('animoflow_darkmode', isDark ? 'dark' : 'light');
        if (darkModeToggle) {
            darkModeToggle.textContent = isDark ? '☀️' : '🌙';
        }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('animoflow_darkmode');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    const toastElement = document.getElementById('liveToast');
    let bsToast = null;
    
    if (toastElement) {
        bsToast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
    }
    
    function showToast(message, type = 'info') {
        if (!bsToast || !toastElement) return;
        const toastBody = toastElement.querySelector('.toast-body');
        if (toastBody) toastBody.innerHTML = message;
        toastElement.classList.remove('bg-success', 'bg-danger', 'bg-primary');
        if (type === 'success') toastElement.style.background = '#006837';
        else if (type === 'error') toastElement.style.background = '#dc3545';
        else toastElement.style.background = '#006837';
        bsToast.show();
    }
    
    function validateDLSUEmail(email) {
        if (!email) return false;
        const trimmed = email.trim().toLowerCase();
        return trimmed.includes('@dlsu.edu.ph');
    }
    
    function validatePassword(password) {
        return password && password.length >= 8;
    }
    
    function clearErrors() {
        if (emailInput) emailInput.classList.remove('is-invalid');
        if (passwordInput) passwordInput.classList.remove('is-invalid');
        if (emailErrorDiv) emailErrorDiv.classList.add('d-none');
        if (passwordErrorDiv) passwordErrorDiv.classList.add('d-none');
    }
    
    async function handleLoginSuccess(email, password, isGuest = false) {
        if (isGuest) {
            localStorage.setItem('animoflow_user', JSON.stringify({
                email: 'guest_user',
                role: 'guest',
                loginTime: new Date().toISOString()
            }));
            showToast('Welcome, Guest! Redirecting to dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'user/dashboard.html';
            }, 1000);
            return;
        }

        try {
            const response = await fetch('http://localhost:3999/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.error || 'Login failed', 'error');
                if (loginBtn) {
                    loginBtn.classList.remove('loading');
                    loginBtn.disabled = false;
                }
                return;
            }

            if (data.success) {
                localStorage.setItem('animoflow_user', JSON.stringify({
                    email: data.user.email,
                    role: data.user.role || 'user',
                    loginTime: new Date().toISOString()
                }));

                if (data.user.role === 'admin') {
                    const adminToken = btoa(data.user.email + ':' + Date.now());
                    localStorage.setItem('animoflow_admin_token', adminToken);
                    localStorage.setItem('animoflow_admin_user', JSON.stringify({
                        email: data.user.email,
                        role: 'admin'
                    }));
                    showToast('Welcome, Admin! Redirecting to admin panel...', 'success');
                    setTimeout(() => {
                        window.location.href = 'admin/dashboard.html';
                    }, 1000);
                } else {
                    showToast('Welcome! Redirecting to dashboard...', 'success');
                    setTimeout(() => {
                        window.location.href = 'user/dashboard.html';
                    }, 1000);
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            showToast('Server error. Please try again.', 'error');
            if (loginBtn) {
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
            }
        }
    }
    
    function handleLogin(event) {
        event.preventDefault();
        clearErrors();
        
        const isGuestMode = guestCheckbox ? guestCheckbox.checked : false;
        
        if (isGuestMode) {
            if (loginBtn) {
                loginBtn.classList.add('loading');
                loginBtn.disabled = true;
            }
            setTimeout(() => {
                handleLoginSuccess(null, null, true);
                if (loginBtn) {
                    loginBtn.classList.remove('loading');
                    loginBtn.disabled = false;
                }
            }, 300);
            return;
        }
        
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';
        let isValid = true;
        
        if (!validateDLSUEmail(email)) {
            if (emailInput) emailInput.classList.add('is-invalid');
            if (emailErrorDiv) emailErrorDiv.classList.remove('d-none');
            isValid = false;
        }
        
        if (!validatePassword(password)) {
            if (passwordInput) passwordInput.classList.add('is-invalid');
            if (passwordErrorDiv) passwordErrorDiv.classList.remove('d-none');
            isValid = false;
        }
        
        if (!isValid) {
            showToast('Please fix the validation errors before signing in.', 'error');
            return;
        }
        
        if (loginBtn) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
        }
        
        handleLoginSuccess(email, password, false);
    }
    
    function onEmailInput() {
        if (!emailInput) return;
        const email = emailInput.value;
        if (email && !validateDLSUEmail(email)) {
            emailInput.classList.add('is-invalid');
            if (emailErrorDiv) emailErrorDiv.classList.remove('d-none');
        } else if (email && validateDLSUEmail(email)) {
            emailInput.classList.remove('is-invalid');
            if (emailErrorDiv) emailErrorDiv.classList.add('d-none');
        } else if (!email) {
            emailInput.classList.remove('is-invalid');
            if (emailErrorDiv) emailErrorDiv.classList.add('d-none');
        }
    }
    
    function onPasswordInput() {
        if (!passwordInput) return;
        const password = passwordInput.value;
        if (password && !validatePassword(password)) {
            passwordInput.classList.add('is-invalid');
            if (passwordErrorDiv) passwordErrorDiv.classList.remove('d-none');
        } else if (password && validatePassword(password)) {
            passwordInput.classList.remove('is-invalid');
            if (passwordErrorDiv) passwordErrorDiv.classList.add('d-none');
        } else if (!password) {
            passwordInput.classList.remove('is-invalid');
            if (passwordErrorDiv) passwordErrorDiv.classList.add('d-none');
        }
    }
    
    function onGuestToggle() {
        if (!guestCheckbox) return;
        const isGuest = guestCheckbox.checked;
        if (isGuest) {
            if (emailInput) {
                emailInput.classList.remove('is-invalid');
                emailInput.placeholder = "guest@dlsu.edu.ph (optional)";
                emailInput.disabled = true;
            }
            if (passwordInput) {
                passwordInput.classList.remove('is-invalid');
                passwordInput.disabled = true;
                passwordInput.placeholder = "Not required for guest";
            }
            if (emailErrorDiv) emailErrorDiv.classList.add('d-none');
            if (passwordErrorDiv) passwordErrorDiv.classList.add('d-none');
        } else {
            if (emailInput) {
                emailInput.placeholder = "juandelacruz@dlsu.edu.ph";
                emailInput.disabled = false;
            }
            if (passwordInput) {
                passwordInput.disabled = false;
                passwordInput.placeholder = "Minimum 8 characters";
            }
        }
    }
    
    function handleForgotPassword(event) {
        event.preventDefault();
        showToast('Password reset: Please contact DLSU IT Services or use "Continue as guest" for view-only access.', 'info');
    }
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (emailInput) {
        emailInput.addEventListener('input', onEmailInput);
        emailInput.addEventListener('blur', onEmailInput);
    }
    if (passwordInput) {
        passwordInput.addEventListener('input', onPasswordInput);
        passwordInput.addEventListener('blur', onPasswordInput);
    }
    if (guestCheckbox) guestCheckbox.addEventListener('change', onGuestToggle);
    if (forgotLink) forgotLink.addEventListener('click', handleForgotPassword);
    
    console.log('[AnimoFlow] Login page initialized with backend authentication');
});