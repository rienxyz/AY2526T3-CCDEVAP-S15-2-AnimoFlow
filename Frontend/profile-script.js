/**
 * AnimoFlow Profile Page - Compact Version
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== DARK MODE TOGGLE =====
    const darkModeToggle = document.getElementById('darkModeToggle');
    const globalDarkModeToggle = document.getElementById('globalDarkModeToggle');

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('animoflow_darkmode', isDark ? 'dark' : 'light');
        if (darkModeToggle) darkModeToggle.checked = isDark;
        if (globalDarkModeToggle) globalDarkModeToggle.textContent = isDark ? '☀️' : '🌙';
    }

    const savedTheme = localStorage.getItem('animoflow_darkmode');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = true;
        if (globalDarkModeToggle) globalDarkModeToggle.textContent = '☀️';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
    if (globalDarkModeToggle) {
        globalDarkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // ========== DOM Elements ==========
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileRole = document.getElementById('profileRole');
    const totalReportsEl = document.getElementById('totalReports');
    const activeReportsEl = document.getElementById('activeReports');
    const memberSinceEl = document.getElementById('memberSince');
    const activityList = document.getElementById('activityList');
    const refreshBtn = document.getElementById('refreshActivityBtn');
    const emailToggle = document.getElementById('emailToggle');
    const autoRefreshToggle = document.getElementById('autoRefreshToggle');
    
    const backBtn = document.getElementById('backToDashboardBtn');
    const goToReportsBtn = document.getElementById('goToReportsBtn');
    const goToFindRoomBtn = document.getElementById('goToFindRoomBtn');
    const goToQueueBtn = document.getElementById('goToQueueBtn');
    
    const toastElement = document.getElementById('liveToast');
    let bsToast = null;
    
    if (toastElement) {
        bsToast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
    }
    
    // ========== Navigation ==========
    function navigateTo(page) {
        const pageMap = {
            'dashboard': 'dashboard-index.html',
            'reports': 'reports.html',
            'queue': 'queuetracker.html',
            'findroom': 'find-your-room.html',
            'buildings': 'buildings-index.html'
        };
        const url = pageMap[page];
        if (url) window.location.href = url;
    }
    
    function showToast(message, type = 'info') {
        if (!bsToast || !toastElement) return;
        const toastBody = toastElement.querySelector('.toast-body');
        if (toastBody) toastBody.innerHTML = message;
        toastElement.style.background = type === 'error' ? '#dc3545' : '#006837';
        bsToast.show();
    }
    
    function formatTimeAgo(timestamp) {
        const minutes = Math.floor((Date.now() - timestamp) / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes === 1) return '1m ago';
        if (minutes < 60) return minutes + 'm ago';
        const hours = Math.floor(minutes / 60);
        if (hours === 1) return '1h ago';
        return hours + 'h ago';
    }
    
    function formatDate(timestamp) {
        if (!timestamp) return '--';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '--';
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
    
    // ========== Load User Profile ==========
    function loadUserProfile() {
        let userData = localStorage.getItem('animoflow_user');
        let user = null;
        if (userData) {
            try { user = JSON.parse(userData); } catch (e) { user = null; }
        }
        if (user && user.email && user.email !== 'guest_user') {
            const nameParts = user.email.split('@')[0].split('.');
            const formattedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
            profileName.textContent = formattedName || 'Animo User';
            profileEmail.textContent = user.email;
            profileRole.textContent = user.role === 'admin' ? 'Admin' : 'Student';
            let joinDate = localStorage.getItem('animoflow_join_date');
            if (!joinDate) {
                joinDate = Date.now().toString();
                localStorage.setItem('animoflow_join_date', joinDate);
            }
            memberSinceEl.textContent = formatDate(parseInt(joinDate));
        } else {
            profileName.textContent = 'Guest User';
            profileEmail.textContent = 'guest@animoflow.local';
            profileRole.textContent = 'Guest';
            memberSinceEl.textContent = '--';
        }
        updateReportStats();
    }
    
    function updateReportStats() {
        const reports = JSON.parse(localStorage.getItem('animoflow_reports') || '[]');
        const THIRTY_MINUTES = 30 * 60 * 1000;
        const now = Date.now();
        let userData = localStorage.getItem('animoflow_user');
        let userEmail = null;
        if (userData) {
            try { const user = JSON.parse(userData); userEmail = user.email; } catch (e) {}
        }
        let userReports = [];
        if (userEmail && userEmail !== 'guest_user') {
            userReports = reports.filter(r => r.userId === userEmail);
        } else {
            userReports = reports;
        }
        totalReportsEl.textContent = userReports.length;
        activeReportsEl.textContent = userReports.filter(r => (now - r.timestamp) <= THIRTY_MINUTES).length;
    }
    
    function loadActivity() {
        const reports = JSON.parse(localStorage.getItem('animoflow_reports') || '[]');
        const sortedReports = reports.sort((a, b) => b.timestamp - a.timestamp);
        if (sortedReports.length === 0) {
            activityList.innerHTML = `
                <div class="empty-activity">
                    <i class="bi bi-inbox"></i>
                    <p>No recent activity</p>
                    <span>Submit a report to get started</span>
                </div>
            `;
            return;
        }
        const recentActivities = sortedReports.slice(0, 8);
        let html = '';
        recentActivities.forEach(report => {
            let queueText = '', emoji = '';
            switch(report.queueLength) {
                case 'short': queueText = 'Short'; emoji = '🟢'; break;
                case 'medium': queueText = 'Medium'; emoji = '🟡'; break;
                case 'long': queueText = 'Long'; emoji = '🔴'; break;
                default: queueText = report.queueLength; emoji = '⚪';
            }
            html += `
                <div class="activity-item">
                    <div class="activity-icon"><i class="bi bi-elevator"></i></div>
                    <div class="activity-content">
                        <div class="activity-title">${emoji} ${queueText} · ${report.building}</div>
                        <div class="activity-desc">${report.elevator}</div>
                    </div>
                    <div class="activity-time">${formatTimeAgo(report.timestamp)}</div>
                </div>
            `;
        });
        activityList.innerHTML = html;
    }
    
    function refreshActivity() {
        loadActivity();
        updateReportStats();
        showToast('Activity refreshed!', 'info');
    }
    
    // ========== Event Listeners ==========
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'dashboard-index.html';
        });
    }
    if (goToReportsBtn) goToReportsBtn.addEventListener('click', function() { navigateTo('reports'); });
    if (goToFindRoomBtn) goToFindRoomBtn.addEventListener('click', function() { navigateTo('findroom'); });
    if (goToQueueBtn) goToQueueBtn.addEventListener('click', function() { navigateTo('queue'); });
    if (refreshBtn) refreshBtn.addEventListener('click', refreshActivity);
    
    if (emailToggle) {
        emailToggle.addEventListener('change', function() {
            localStorage.setItem('animoflow_email_notifications', this.checked);
            showToast(this.checked ? 'Email notifications enabled' : 'Email notifications disabled', 'info');
        });
    }
    if (autoRefreshToggle) {
        autoRefreshToggle.addEventListener('change', function() {
            localStorage.setItem('animoflow_auto_refresh', this.checked);
            showToast(this.checked ? 'Auto-refresh enabled' : 'Auto-refresh disabled', 'info');
        });
    }
    
    function loadPreferences() {
        const emailPref = localStorage.getItem('animoflow_email_notifications');
        if (emailPref !== null) emailToggle.checked = emailPref === 'true';
        const autoPref = localStorage.getItem('animoflow_auto_refresh');
        if (autoPref !== null) autoRefreshToggle.checked = autoPref === 'true';
    }
    
    function startAutoRefresh() {
        const autoPref = localStorage.getItem('animoflow_auto_refresh');
        if (autoPref === 'true' || autoPref === null) {
            setInterval(() => { loadActivity(); updateReportStats(); }, 30000);
        }
    }
    
    // ========== Initial Load ==========
    loadPreferences();
    loadUserProfile();
    loadActivity();
    startAutoRefresh();
    console.log('[AnimoFlow] Profile page initialized');
});