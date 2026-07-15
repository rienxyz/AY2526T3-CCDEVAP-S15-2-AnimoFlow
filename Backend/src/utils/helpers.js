function formatTimeAgo(timestamp) {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function validateEmail(email) {
    return email && email.toLowerCase().includes('@dlsu.edu.ph');
}

function validatePassword(password) {
    return password && password.length >= 8;
}

function generateId() {
    return crypto.randomUUID();
}

module.exports = {
    formatTimeAgo,
    escapeHtml,
    validateEmail,
    validatePassword,
    generateId
};