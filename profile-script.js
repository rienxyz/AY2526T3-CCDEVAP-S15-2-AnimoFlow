/**
 * AnimoFlow Profile Page - Updated with Navigation
 * Displays user info, activity history, and preferences
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== DOM Elements ==========
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileRole = document.getElementById('profileRole');
    const totalReportsEl = document.getElementById('totalReports');
    const activeReportsEl = document.getElementById('activeReports');
    const memberSinceEl = document.getElementById('memberSince');
    const activityList = document.getElementById('activityList');
    const emptyActivity = document.getElementById('emptyActivity');
    const refreshBtn = document.getElementById('refreshActivityBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const emailToggle = document.getElementById('emailToggle');
    const autoRefreshToggle = document.getElementById('autoRefreshToggle');
    
    // Navigation buttons
    const backBtn = document.getElementById('backToDashboardBtn');
    const goToReportsBtn = document.getElementById('goToReportsBtn');
    const goToFindRoomBtn = document.getElementById('goToFindRoomBtn');
    const goToQueueBtn = document.getElementById('goToQueueBtn');
    
    // Toast
    const toastElement = document.getElementById('liveToast');
    let bsToast = null;
    
    if (toastElement) {
        bsToast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
    }
    
    // ========== Navigation Functions ==========
    function navigateTo(page) {
        // Find the sidebar link for this page
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        let targetLink = null;
        
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === page) {
                targetLink = link;
            }
        });
        
        if (targetLink) {
            targetLink.click();
        } else {
            // Fallback: try to find by href
            const pageMap = {
                'dashboard': 'Dashboard',
                'reports': 'Reports',
                'queue': 'Queue Tracker',
                'findroom': 'Find Your Room',
                'buildings': 'Buildings'
            };
            
            navLinks.forEach(link => {
                if (link.textContent.trim() === pageMap[page]) {
                    targetLink = link;
                }
            });
            
            if (targetLink) {
                targetLink.click();
            } else {
                showToast('Navigation not available', 'error');
            }
        }
    }
    
    // ========== Helper Functions ==========
    function showToast(message, type = 'info') {
        if (!bsToast || !toastElement) return;
        const toastBody = toastElement.querySelector('.toast-body');
        if (toastBody) toastBody.innerHTML = message;
        
        toastElement.classList.remove('bg-success', 'bg-danger', 'bg-primary');
        if (type === 'success') {
            toastElement.style.background = '#006837';
        } else if (type === 'error') {
            toastElement.style.background = '#dc3545';
        } else {
            toastElement.style.background = '#006837';
        }
        bsToast.show();
    }
    
    function formatTimeAgo(timestamp) {
        const minutes = Math.floor((Date.now() - timestamp) / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes === 1) return '1 minute ago';
        return `${minutes} minutes ago`;
    }
    
    function formatDate(timestamp) {
        const date = new Date(timestamp);
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
            try {
                user = JSON.parse(userData);
            } catch (e) {
                user = null;
            }
        }
        
        if (user && user.email && user.email !== 'guest_user') {
            const nameParts = user.email.split('@')[0].split('.');
            const formattedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
            profileName.textContent = formattedName || 'Animo User';
            profileEmail.textContent = user.email;
            profileRole.textContent = 'Student';
            
            let joinDate = localStorage.getItem('animoflow_join_date');
            if (!joinDate) {
                joinDate = Date.now();
                localStorage.setItem('animoflow_join_date', joinDate);
            }
            memberSinceEl.textContent = formatDate(joinDate);
        } else {
            profileName.textContent = 'Guest User';
            profileEmail.textContent = 'guest@animoflow.local';
            profileRole.textContent = 'Guest';
            memberSinceEl.textContent = '--';
        }
        
        updateReportStats();
    }
    
    // ========== Update Report Stats ==========
    function updateReportStats() {
        const reports = JSON.parse(localStorage.getItem('animoflow_reports') || '[]');
        const THIRTY_MINUTES = 30 * 60 * 1000;
        const now = Date.now();
        
        let userData = localStorage.getItem('animoflow_user');
        let userEmail = null;
        if (userData) {
            try {
                const user = JSON.parse(userData);
                userEmail = user.email;
            } catch (e) {
                userEmail = null;
            }
        }
        
        let userReports = [];
        if (userEmail && userEmail !== 'guest_user') {
            userReports = reports.filter(r => r.userId === userEmail);
        } else {
            userReports = reports;
        }
        
        const totalReports = userReports.length;
        const activeReports = userReports.filter(r => (now - r.timestamp) <= THIRTY_MINUTES).length;
        
        totalReportsEl.textContent = totalReports;
        activeReportsEl.textContent = activeReports;
    }
    
    // ========== Load Activity ==========
    function loadActivity() {
        const reports = JSON.parse(localStorage.getItem('animoflow_reports') || '[]');
        const sortedReports = reports.sort((a, b) => b.timestamp - a.timestamp);
        
        if (sortedReports.length === 0) {
            activityList.innerHTML = `
                <div id="emptyActivity" class="text-center p-5 text-muted">
                    <i class="bi bi-inbox" style="font-size: 2.5rem;"></i>
                    <p class="mt-2">No recent activity yet. Start by submitting a report!</p>
                </div>
            `;
            return;
        }
        
        const recentActivities = sortedReports.slice(0, 10);
        
        let html = '';
        recentActivities.forEach(report => {
            let queueText = '';
            switch(report.queueLength) {
                case 'short': queueText = '🟢 Short'; break;
                case 'medium': queueText = '🟡 Medium'; break;
                case 'long': queueText = '🔴 Long'; break;
            }
            
            html += `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="bi bi-elevator"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">Reported ${queueText} queue</div>
                        <div class="activity-desc">${report.building} · ${report.elevator}</div>
                    </div>
                    <div class="activity-time">${formatTimeAgo(report.timestamp)}</div>
                </div>
            `;
        });
        
        activityList.innerHTML = html;
    }
    
    // ========== Refresh Activity ==========
    function refreshActivity() {
        loadActivity();
        updateReportStats();
        showToast('Activity refreshed!', 'info');
    }
    
    // ========== Dark Mode Toggle ==========
    function toggleDarkMode() {
        const isDark = darkModeToggle.checked;
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('animoflow_darkmode', isDark ? 'dark' : 'light');
        showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled', 'info');
    }
    
    function loadDarkModePreference() {
        const isDark = localStorage.getItem('animoflow_darkmode') === 'dark';
        darkModeToggle.checked = isDark;
        document.body.classList.toggle('dark-mode', isDark);
    }
    
    // ========== Event Listeners ==========
    
    // Navigation buttons
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            navigateTo('dashboard');
        });
    }
    
    if (goToReportsBtn) {
        goToReportsBtn.addEventListener('click', function() {
            navigateTo('reports');
        });
    }
    
    if (goToFindRoomBtn) {
        goToFindRoomBtn.addEventListener('click', function() {
            navigateTo('findroom');
        });
    }
    
    if (goToQueueBtn) {
        goToQueueBtn.addEventListener('click', function() {
            navigateTo('queue');
        });
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshActivity);
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
    
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
    
    // Load preferences from localStorage
    function loadPreferences() {
        const emailPref = localStorage.getItem('animoflow_email_notifications');
        if (emailPref !== null) {
            emailToggle.checked = emailPref === 'true';
        }
        
        const autoPref = localStorage.getItem('animoflow_auto_refresh');
        if (autoPref !== null) {
            autoRefreshToggle.checked = autoPref === 'true';
        }
    }
    
    // ========== Auto-refresh if enabled ==========
    function startAutoRefresh() {
        const autoPref = localStorage.getItem('animoflow_auto_refresh');
        if (autoPref === 'true' || autoPref === null) {
            setInterval(() => {
                loadActivity();
                updateReportStats();
            }, 30000);
        }
    }
    
    // ========== Initial Load ==========
    loadDarkModePreference();
    loadPreferences();
    loadUserProfile();
    loadActivity();
    startAutoRefresh();
    
    console.log('[AnimoFlow] Profile page initialized with navigation');
});