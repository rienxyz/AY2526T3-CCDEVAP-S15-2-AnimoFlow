/**
 * AnimoFlow - Forgot Password
 * Simple reset without email
 */

document.addEventListener('DOMContentLoaded', function() {

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

    const savedTheme = localStorage.getItem('animoflow_darkmode');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // ===== BACK TO LOGIN =====
    document.getElementById('backToLoginBtn').addEventListener('click', function() {
        window.location.href = 'login.html';
    });

    // ===== RESET PASSWORD =====
    const resetForm = document.getElementById('resetForm');
    const resetEmail = document.getElementById('resetEmail');
    const resetBtn = document.getElementById('resetBtn');
    const resetMessage = document.getElementById('resetMessage');

    resetForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = resetEmail.value.trim();
        if (!email) {
            showMessage('Please enter your email address.', 'danger');
            return;
        }

        resetBtn.disabled = true;
        resetBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Processing...';

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(
                    `✅ Password reset successful! Your new password is: <strong>${data.newPassword || 'reset123456'}</strong><br>
                    Please use this password to log in. You can change it later in your profile.`,
                    'success'
                );
                resetEmail.value = '';
            } else {
                showMessage('❌ ' + (data.error || 'User not found. Please check your email.'), 'danger');
            }
        } catch (err) {
            showMessage('❌ Server error. Please try again.', 'danger');
        }

        resetBtn.disabled = false;
        resetBtn.innerHTML = '<i class="bi bi-arrow-repeat me-2"></i>Reset Password';
    });

    function showMessage(message, type) {
        resetMessage.style.display = 'block';
        resetMessage.className = `alert alert-${type}`;
        resetMessage.innerHTML = message;
    }

});