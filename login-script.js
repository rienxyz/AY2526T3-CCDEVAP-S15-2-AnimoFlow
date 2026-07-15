/**
 * AnimoFlow Login Page - External JavaScript
 * Handles DLSU email validation, guest access, toast notifications
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
        return email.trim().toLowerCase().includes('@dlsu.edu.ph');
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
    
    function handleLoginSuccess(email, isGuest = false) {
        const userType = isGuest ? 'Guest' : 'DLSU Student/Faculty';
        const userIdentifier = isGuest ? 'guest_user' : email;
        
        localStorage.setItem('animoflow_user', JSON.stringify({
            email: userIdentifier,
            role: isGuest ? 'guest' : 'user',
            loginTime: new Date().toISOString()
        }));
        
        showToast(`Welcome, ${userType}! Redirecting to dashboard...`, 'success');
        
        setTimeout(() => {
            // FIXED: Redirect to dashboard-index.html instead of dashboard.html
            window.location.href = 'dashboard-index.html';
        }, 1000);
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
                handleLoginSuccess('guest@animoflow.local', true);
                if (loginBtn) {
                    loginBtn.classList.remove('loading');
                    loginBtn.disabled = false;
                }
            }, 300);
            return;
        }
        
        const email = emailInput ? emailInput.value : '';
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
        
        setTimeout(() => {
            handleLoginSuccess(email, false);
            if (loginBtn) {
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
            }
        }, 800);
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
            }
            if (passwordInput) passwordInput.classList.remove('is-invalid');
            if (emailErrorDiv) emailErrorDiv.classList.add('d-none');
            if (passwordErrorDiv) passwordErrorDiv.classList.add('d-none');
        } else {
            if (emailInput) emailInput.placeholder = "juandelacruz@dlsu.edu.ph";
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
    
    console.log('[AnimoFlow] Login page initialized');
});