/*
 * AnimoFlow Dashboard - Full Version with Charts
 * Direct page navigation (no iframes)
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
        updateChartColors();
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

    // ===== CHART REFERENCES =====
    let dashBuildingChart = null;
    let dashStatusChart = null;

    // ===== SIDEBAR NAVIGATION =====
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggleBtn = document.getElementById('sidebarToggle');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const adminNavLink = document.getElementById('adminNavLink');

    // ===== LOAD USER INFO (with admin check) =====
    function loadUserInfo() {
        let userData = localStorage.getItem('animoflow_user');
        let user = null;
        
        if (userData) {
            try { user = JSON.parse(userData); } catch (e) {}
        }
        
        // If user is guest or null, check if admin token exists
        if (!user || user.email === 'guest_user' || user.role === 'guest') {
            const adminToken = localStorage.getItem('animoflow_admin_token');
            const adminUser = localStorage.getItem('animoflow_admin_user');
            if (adminToken && adminUser) {
                try {
                    const admin = JSON.parse(adminUser);
                    if (admin.role === 'admin') {
                        user = {
                            email: admin.email,
                            role: 'admin',
                            loginTime: Date.now()
                        };
                        localStorage.setItem('animoflow_user', JSON.stringify(user));
                    }
                } catch (e) {}
            }
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
        
        checkAdminAccess(user);
    }

    // ===== CHECK ADMIN ACCESS - STRICT =====
    function checkAdminAccess(user) {
        if (!adminNavLink) return;
        
        // ONLY show if user has explicit admin role
        if (user && user.role === 'admin') {
            adminNavLink.style.display = 'block';
            return;
        }
        
        // Check admin token - only if role is admin
        const adminToken = localStorage.getItem('animoflow_admin_token');
        const adminUser = localStorage.getItem('animoflow_admin_user');
        if (adminToken && adminUser) {
            try {
                const admin = JSON.parse(adminUser);
                if (admin.role === 'admin') {
                    adminNavLink.style.display = 'block';
                    return;
                }
            } catch (e) {}
        }
        
        // Only show for specific admin emails (hardcoded fallback)
        if (user && user.email) {
            const adminEmails = ['admin@dlsu.edu.ph', 'admin.animoflow@dlsu.edu.ph'];
            if (adminEmails.includes(user.email)) {
                adminNavLink.style.display = 'block';
                return;
            }
        }
        
        adminNavLink.style.display = 'none';
    }

    // ===== LOGOUT =====
    document.getElementById('sidebarLogout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('animoflow_user');
        localStorage.removeItem('animoflow_admin_token');
        localStorage.removeItem('animoflow_admin_user');
        showToast('Logged out successfully!', 'info');
        setTimeout(() => {
            window.location.href = 'login-index.html';
        }, 500);
    });

    // ===== TOGGLE SIDEBAR =====
    function toggleSidebar() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // ===== SET ACTIVE NAV LINK =====
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard-index.html';
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    setActiveNavLink();

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    });

    // ===== UPDATE CHART COLORS =====
    function updateChartColors() {
        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#a8b8c8' : '#6c7a6c';
        
        if (dashStatusChart) {
            const options = dashStatusChart.options;
            if (options && options.plugins && options.plugins.legend) {
                options.plugins.legend.labels.color = textColor;
                dashStatusChart.update();
            }
        }
    }

    // ===== UPDATE DASHBOARD CHARTS =====
    function updateDashboardCharts(reports) {
        const buildingCounts = {};
        reports.forEach(r => {
            buildingCounts[r.building] = (buildingCounts[r.building] || 0) + 1;
        });
        const sorted = Object.entries(buildingCounts).sort((a, b) => b[1] - a[1]);
        const labels = sorted.map(b => b[0]);
        const data = sorted.map(b => b[1]);

        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#a8b8c8' : '#6c7a6c';

        const ctx1 = document.getElementById('dashboardBuildingChart');
        if (ctx1) {
            if (dashBuildingChart) dashBuildingChart.destroy();
            dashBuildingChart = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: labels.length > 0 ? labels : ['No Data'],
                    datasets: [{
                        label: 'Reports',
                        data: data.length > 0 ? data : [0],
                        backgroundColor: '#006837',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    scales: { 
                        y: { beginAtZero: true, ticks: { stepSize: 1, color: textColor } },
                        x: { ticks: { color: textColor } }
                    }
                }
            });
        }

        const statusCounts = { short: 0, medium: 0, long: 0 };
        reports.forEach(r => {
            if (statusCounts.hasOwnProperty(r.queueLength)) {
                statusCounts[r.queueLength]++;
            }
        });

        const totalStatus = statusCounts.short + statusCounts.medium + statusCounts.long;

        const ctx2 = document.getElementById('dashboardStatusChart');
        if (ctx2) {
            if (dashStatusChart) dashStatusChart.destroy();
            
            if (totalStatus === 0) {
                dashStatusChart = new Chart(ctx2, {
                    type: 'doughnut',
                    data: {
                        labels: ['No Data'],
                        datasets: [{ data: [1], backgroundColor: ['#e9ecef'], borderWidth: 0 }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { position: 'bottom', labels: { color: textColor } }
                        }
                    }
                });
            } else {
                dashStatusChart = new Chart(ctx2, {
                    type: 'doughnut',
                    data: {
                        labels: ['🟢 Short', '🟡 Medium', '🔴 Long'],
                        datasets: [{
                            data: [statusCounts.short, statusCounts.medium, statusCounts.long],
                            backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { position: 'bottom', labels: { color: textColor } }
                        }
                    }
                });
            }
        }
    }

    // ===== DASHBOARD DATA =====
    async function updateDashboard() {
        try {
            const response = await fetch("http://localhost:3999/api/report");
            const activeReports = await response.json();

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
                try {
                    const response2 = await fetch("http://localhost:3999/api/report/user/" + encodeURIComponent(userEmail));
                    userReports = await response2.json();
                } catch (e) {
                    userReports = [];
                }
            } else {
                const localReports = JSON.parse(localStorage.getItem('animoflow_reports') || '[]');
                userReports = localReports;
            }

            const yourReportsEl = document.getElementById('dashYourReports');
            if (yourReportsEl) yourReportsEl.textContent = userReports.length;

            const sorted = activeReports.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
            const activityList = document.getElementById('dashActivityList');

            if (activityList) {
                if (sorted.length === 0) {
                    activityList.innerHTML = `
                        <div class="text-center text-muted py-4">
                            <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                            <p class="mt-2">No recent activity. Submit a report to get started!</p>
                        </div>
                    `;
                } else {
                    let html = '';
                    sorted.forEach(r => {
                        const mins = Math.floor((Date.now() - r.timestamp) / 60000);
                        const timeAgo = mins < 1 ? 'Just now' : mins + 'm ago';
                        let emoji = r.queueLength === 'short' ? '🟢' : r.queueLength === 'medium' ? '🟡' : '🔴';
                        html += `
                            <div class="d-flex align-items-center py-2 border-bottom">
                                <span class="me-2">${emoji}</span>
                                <div class="flex-grow-1">
                                    <strong>${escapeHtml(r.building)}</strong> · ${escapeHtml(r.elevator)}
                                    <span class="badge bg-light text-dark ms-2">${escapeHtml(r.queueLength)}</span>
                                </div>
                                <small class="text-muted">${timeAgo}</small>
                            </div>
                        `;
                    });
                    activityList.innerHTML = html;
                }
            }

            updateDashboardCharts(activeReports);

        } catch(err) {
            console.error('Dashboard update error:', err);
        }
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

    // Watch for dark mode changes
    const observer = new MutationObserver(function() {
        updateChartColors();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // ===== INITIAL LOAD =====
    loadUserInfo();
    updateDashboard();
    setInterval(updateDashboard, 30000);

    window.addEventListener('storage', function(e) {
        if (e.key === 'animoflow_reports' || e.key === 'animoflow_user') {
            updateDashboard();
            loadUserInfo();
        }
    });

    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (dashBuildingChart) dashBuildingChart.resize();
            if (dashStatusChart) dashStatusChart.resize();
        }, 250);
    });

    console.log('[AnimoFlow] Dashboard ready with direct page navigation');
});