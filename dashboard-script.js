/**
 * AnimoFlow Dashboard -
 */
document.addEventListener('DOMContentLoaded', function() {

    // ===== SIMPLE DARK MODE =====
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
        toastElement.style.background = type === 'error' ? '#dc3545' : '#006837';
        bsToast.show();
    }

    // ===== SIDEBAR NAVIGATION =====
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggleBtn = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const pageSections = document.querySelectorAll('.page-section');

    // Load user info
    function loadUserInfo() {
        let userData = localStorage.getItem('animoflow_user');
        let user = null;
        if (userData) {
            try { user = JSON.parse(userData); } catch (e) {}
        }
        const nameEl = document.getElementById('sidebarUserName');
        const emailEl = document.getElementById('sidebarUserEmail');
        if (user && user.email && user.email !== 'guest_user') {
            const nameParts = user.email.split('@')[0].split('.');
            const formattedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
            nameEl.textContent = formattedName || 'Animo User';
            emailEl.textContent = user.email;
        } else {
            nameEl.textContent = 'Guest User';
            emailEl.textContent = 'guest@animoflow.local';
        }
    }
    loadUserInfo();

    // Logout 
    document.getElementById('sidebarLogout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('animoflow_user');
        showToast('Logged out successfully!', 'info');
        setTimeout(() => {
            window.location.href = 'login-index.html';
        }, 500);
    });

    // Toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            pageSections.forEach(section => section.classList.remove('active'));
            const target = document.getElementById('page-' + page);
            if (target) target.classList.add('active');

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }

            loadPageContent(page);
        });
    });

    // ===== LOAD PAGE CONTENT =====
    const loadedPages = {};

    function loadPageContent(page) {
        if (loadedPages[page]) return;

        const pageFiles = {
            'reports': 'reports.html',
            'queue': 'queuetracker.html',
            'findroom': 'find-your-room.html',
            'buildings': 'buildings-index.html',
            'profile': 'profile.html'
        };

        const containerMap = {
            'reports': 'reportsContent',
            'queue': 'queueContent',
            'findroom': 'findroomContent',
            'buildings': 'buildingsContent',
            'profile': 'profileContent'
        };

        const file = pageFiles[page];
        const containerId = containerMap[page];
        const container = document.getElementById(containerId);

        if (!container || !file) return;

        container.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted mt-3">Loading ${page}...</p>
            </div>
            <iframe src="${file}" 
                    style="width:100%; min-height:600px; border:1px solid #e8ede6; border-radius:12px; background:white;">
            </iframe>
        `;

        loadedPages[page] = true;
    }

    // ===== DASHBOARD DATA =====
    function updateDashboard() {
        const reports = JSON.parse(localStorage.getItem('animoflow_reports') || '[]');
        const THIRTY_MINUTES = 30 * 60 * 1000;
        const now = Date.now();
        const activeReports = reports.filter(r => (now - r.timestamp) <= THIRTY_MINUTES);

        const activeReportsEl = document.getElementById('dashActiveReports');
        if (activeReportsEl) activeReportsEl.textContent = activeReports.length;

        const longQueues = activeReports.filter(r => r.queueLength === 'long');
        const buildingsWithLong = new Set(longQueues.map(r => r.building));
        const heavyTrafficEl = document.getElementById('dashHeavyTraffic');
        if (heavyTrafficEl) heavyTrafficEl.textContent = buildingsWithLong.size;

        let userData = localStorage.getItem('animoflow_user');
        let userEmail = null;
        if (userData) {
            try {
                const user = JSON.parse(userData);
                userEmail = user.email;
            } catch (e) {}
        }
        let userReports = [];
        if (userEmail && userEmail !== 'guest_user') {
            userReports = reports.filter(r => r.userId === userEmail);
        } else {
            userReports = reports;
        }
        const yourReportsEl = document.getElementById('dashYourReports');
        if (yourReportsEl) yourReportsEl.textContent = userReports.length;

        const recent = activeReports.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
        const activityList = document.getElementById('dashActivityList');

        if (activityList) {
            if (recent.length === 0) {
                activityList.innerHTML = `
                    <div class="text-center text-muted py-4">
                        <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                        <p class="mt-2">No recent activity. Submit a report to get started!</p>
                    </div>
                `;
            } else {
                let html = '';
                recent.forEach(r => {
                    const mins = Math.floor((now - r.timestamp) / 60000);
                    const timeAgo = mins < 1 ? 'Just now' : mins + 'm ago';
                    let emoji = r.queueLength === 'short' ? '🟢' : r.queueLength === 'medium' ? '🟡' : '🔴';
                    html += `
                        <div class="d-flex align-items-center py-2 border-bottom">
                            <span class="me-2">${emoji}</span>
                            <div class="flex-grow-1">
                                <strong>${r.building}</strong> · ${r.elevator}
                                <span class="badge bg-light text-dark ms-2">${r.queueLength}</span>
                            </div>
                            <small class="text-muted">${timeAgo}</small>
                        </div>
                    `;
                });
                activityList.innerHTML = html;
            }
        }
    }

    // ===== INITIAL DASHBOARD LOAD =====
    updateDashboard();
    setInterval(updateDashboard, 30000);

    // ===== STORAGE LISTENER =====
    window.addEventListener('storage', function(e) {
        if (e.key === 'animoflow_reports' || e.key === 'animoflow_user') {
            updateDashboard();
            loadUserInfo();
        }
    });

    // ===== PRELOAD REPORTS PAGE =====
    setTimeout(function() {
        if (!loadedPages['reports']) {
            loadPageContent('reports');
        }
    }, 500);

    console.log('[AnimoFlow] Dashboard ready');
});