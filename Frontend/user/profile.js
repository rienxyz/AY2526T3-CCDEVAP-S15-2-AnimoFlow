/**
 * AnimoFlow - User Profile Page
 * 
 * Description: Manage user account and view contributions. Displays
 *              user statistics, recent activity, contribution charts,
 *              and preferences.
 * 
 * Features:
 *   - Profile information (name, email, role)
 *   - User statistics (total reports, active reports, joined date)
 *   - Quick stats (buildings reported, elevators used, active days)
 *   - Recent activity list
 *   - Charts (Reports by Building, Queue Status)
 *   - Contribution summary (last 5 reports + status breakdown)
 *   - Preferences (Dark Mode, Auto-Refresh)
 *   - Logout button
 * 
 * Charts: Bar chart, Doughnut chart
 * API: GET /api/report, GET /api/report/user/:userId
 * Author: AnimoFlow Team
 * Date: August 2026
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
        updateChartColors();
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

    // ===== NAVBAR FUNCTIONALITY =====
    function updateNavUserEmail() {
        const emailEl = document.getElementById('navUserEmail');
        if (!emailEl) return;
        
        let userData = localStorage.getItem('animoflow_user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.email && user.email !== 'guest_user') {
                    emailEl.textContent = user.email.split('@')[0];
                    return;
                }
            } catch (e) {}
        }
        
        const adminUser = localStorage.getItem('animoflow_admin_user');
        if (adminUser) {
            try {
                const admin = JSON.parse(adminUser);
                emailEl.textContent = admin.email.split('@')[0];
                return;
            } catch (e) {}
        }
        
        emailEl.textContent = 'Guest';
    }

    const navLogoutBtn = document.getElementById('navLogoutBtn');
    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('animoflow_user');
            localStorage.removeItem('animoflow_admin_token');
            localStorage.removeItem('animoflow_admin_user');
            window.location.href = 'login.html';
        });
    }

    updateNavUserEmail();

    // ===== CHART REFERENCES =====
    let profileBuildingChart = null;
    let profileStatusChart = null;
    let userReportsData = [];

    // ========== DOM Elements ==========
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileRole = document.getElementById('profileRole');
    const totalReportsEl = document.getElementById('totalReports');
    const activeReportsEl = document.getElementById('activeReports');
    const memberSinceEl = document.getElementById('memberSince');
    const activityList = document.getElementById('activityList');
    const refreshBtn = document.getElementById('refreshActivityBtn');
    const autoRefreshToggle = document.getElementById('autoRefreshToggle');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Quick stats
    const buildingsReportedEl = document.getElementById('buildingsReported');
    const elevatorsUsedEl = document.getElementById('elevatorsUsed');
    const activeDaysEl = document.getElementById('activeDays');
    const contributionBody = document.getElementById('contributionBody');
    
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

    // ========== Helper Functions ==========
    function showToast(message, type = 'info') {
        if (!bsToast || !toastElement) return;
        const toastBody = toastElement.querySelector('.toast-body');
        if (toastBody) toastBody.innerHTML = message;
        toastElement.style.background = type === 'error' ? '#dc3545' : '#006837';
        bsToast.show();
    }
    
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

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function getStatusEmoji(status) {
        switch(status) {
            case 'short': return '🟢';
            case 'medium': return '🟡';
            case 'long': return '🔴';
            default: return '⚪';
        }
    }

    function getStatusLabel(status) {
        switch(status) {
            case 'short': return 'Short';
            case 'medium': return 'Medium';
            case 'long': return 'Long';
            default: return status;
        }
    }

    // ========== Update Chart Colors ==========
    function updateChartColors() {
        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#a8b8c8' : '#6c7a6c';
        
        if (profileBuildingChart) {
            const options = profileBuildingChart.options;
            if (options && options.scales) {
                if (options.scales.y) options.scales.y.ticks.color = textColor;
                if (options.scales.x) options.scales.x.ticks.color = textColor;
            }
            if (options && options.plugins && options.plugins.legend) {
                options.plugins.legend.labels.color = textColor;
            }
            profileBuildingChart.update();
        }
        
        if (profileStatusChart) {
            const options = profileStatusChart.options;
            if (options && options.plugins && options.plugins.legend) {
                options.plugins.legend.labels.color = textColor;
            }
            profileStatusChart.update();
        }
    }

    // ========== Load User Profile ==========
    function loadUserProfile() {
        let userData = localStorage.getItem('animoflow_user');
        let user = null;
        if (userData) {
            try { user = JSON.parse(userData); } catch (e) { user = null; }
        }
        
        if (!user || user.email === 'guest_user') {
            const adminUser = localStorage.getItem('animoflow_admin_user');
            if (adminUser) {
                try {
                    const admin = JSON.parse(adminUser);
                    if (admin.role === 'admin') {
                        user = { email: admin.email, role: 'admin' };
                    }
                } catch (e) {}
            }
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

    // ========== Update Report Stats ==========
    function updateReportStats() {
        fetchAllReports();
    }

    // ========== Fetch All Reports ==========
    async function fetchAllReports() {
        try {
            const response = await fetch("http://localhost:3999/api/report");
            if (!response.ok) throw new Error("Failed to fetch reports");
            const reports = await response.json();
            
            let userData = localStorage.getItem('animoflow_user');
            let userEmail = null;
            if (userData) {
                try { const user = JSON.parse(userData); userEmail = user.email; } catch (e) {}
            }
            
            if (!userEmail || userEmail === 'guest_user') {
                const adminUser = localStorage.getItem('animoflow_admin_user');
                if (adminUser) {
                    try { const admin = JSON.parse(adminUser); userEmail = admin.email; } catch (e) {}
                }
            }
            
            let userReports = [];
            if (userEmail && userEmail !== 'guest_user') {
                userReports = reports.filter(r => r.userId === userEmail);
            } else {
                const localReports = JSON.parse(localStorage.getItem('animoflow_reports') || '[]');
                userReports = localReports;
            }
            
            userReportsData = userReports;
            
            const THIRTY_MINUTES = 30 * 60 * 1000;
            const now = Date.now();
            
            totalReportsEl.textContent = userReports.length;
            activeReportsEl.textContent = userReports.filter(r => (now - r.timestamp) <= THIRTY_MINUTES).length;
            
            const buildings = new Set(userReports.map(r => r.building));
            buildingsReportedEl.textContent = buildings.size;
            
            const elevators = new Set(userReports.map(r => r.elevator));
            elevatorsUsedEl.textContent = elevators.size;
            
            if (userReports.length > 0) {
                const dates = userReports.map(r => new Date(r.timestamp).toDateString());
                const uniqueDates = new Set(dates);
                activeDaysEl.textContent = uniqueDates.size;
            } else {
                activeDaysEl.textContent = '0';
            }
            
            updateProfileCharts(userReports);
            updateContributionSummary(userReports);
            
        } catch (err) {
            console.error('Error fetching reports:', err);
            const localReports = JSON.parse(localStorage.getItem('animoflow_reports') || '[]');
            userReportsData = localReports;
            updateReportStatsLocal(localReports);
        }
    }

    function updateReportStatsLocal(reports) {
        const THIRTY_MINUTES = 30 * 60 * 1000;
        const now = Date.now();
        
        totalReportsEl.textContent = reports.length;
        activeReportsEl.textContent = reports.filter(r => (now - r.timestamp) <= THIRTY_MINUTES).length;
        
        const buildings = new Set(reports.map(r => r.building));
        buildingsReportedEl.textContent = buildings.size;
        
        const elevators = new Set(reports.map(r => r.elevator));
        elevatorsUsedEl.textContent = elevators.size;
        
        if (reports.length > 0) {
            const dates = reports.map(r => new Date(r.timestamp).toDateString());
            const uniqueDates = new Set(dates);
            activeDaysEl.textContent = uniqueDates.size;
        } else {
            activeDaysEl.textContent = '0';
        }
        
        updateProfileCharts(reports);
        updateContributionSummary(reports);
    }

    // ========== Update Profile Charts ==========
    function updateProfileCharts(reports) {
        const buildingCounts = {};
        reports.forEach(r => {
            buildingCounts[r.building] = (buildingCounts[r.building] || 0) + 1;
        });
        const sorted = Object.entries(buildingCounts).sort((a, b) => b[1] - a[1]);
        const labels = sorted.length > 0 ? sorted.map(b => b[0]) : ['No Data'];
        const data = sorted.length > 0 ? sorted.map(b => b[1]) : [1];

        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#a8b8c8' : '#6c7a6c';
        const bgColor = isDark ? '#1a4a7a' : '#006837';

        const ctx1 = document.getElementById('profileBuildingChart');
        if (ctx1) {
            if (profileBuildingChart) profileBuildingChart.destroy();
            
            profileBuildingChart = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Reports',
                        data: data,
                        backgroundColor: bgColor,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1, color: textColor, font: { size: 9 } } },
                        x: { ticks: { color: textColor, font: { size: 8 } } }
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
        const total = statusCounts.short + statusCounts.medium + statusCounts.long;

        const ctx2 = document.getElementById('profileStatusChart');
        if (ctx2) {
            if (profileStatusChart) profileStatusChart.destroy();
            
            if (total === 0) {
                profileStatusChart = new Chart(ctx2, {
                    type: 'doughnut',
                    data: {
                        labels: ['No Data'],
                        datasets: [{ data: [1], backgroundColor: ['#e9ecef'], borderWidth: 0 }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom', labels: { color: textColor, font: { size: 9 } } }
                        }
                    }
                });
            } else {
                profileStatusChart = new Chart(ctx2, {
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
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom', labels: { color: textColor, font: { size: 9 } } }
                        }
                    }
                });
            }
        }
    }

    // ========== Update Contribution Summary ==========
    function updateContributionSummary(reports) {
        if (reports.length === 0) {
            contributionBody.innerHTML = `
                <div class="text-center text-muted py-3">
                    <i class="bi bi-inbox" style="font-size:1.5rem;"></i>
                    <p class="mt-1 mb-0">No contributions yet. Submit your first report!</p>
                </div>
            `;
            return;
        }

        const sorted = [...reports].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
        
        let html = '<div class="contribution-items">';
        sorted.forEach(r => {
            const emoji = getStatusEmoji(r.queueLength);
            const label = getStatusLabel(r.queueLength);
            html += `
                <div class="contribution-item">
                    <span class="contribution-emoji">${emoji}</span>
                    <span class="contribution-building">${escapeHtml(r.building)}</span>
                    <span class="contribution-elevator">${escapeHtml(r.elevator)}</span>
                    <span class="contribution-status ${r.queueLength}">${label}</span>
                    <span class="contribution-time">${formatTimeAgo(r.timestamp)}</span>
                </div>
            `;
        });
        html += '</div>';
        
        const statusCounts = { short: 0, medium: 0, long: 0 };
        reports.forEach(r => {
            if (statusCounts.hasOwnProperty(r.queueLength)) statusCounts[r.queueLength]++;
        });
        
        html += `
            <div class="contribution-footer">
                <span>🟢 ${statusCounts.short} Short</span>
                <span>🟡 ${statusCounts.medium} Medium</span>
                <span>🔴 ${statusCounts.long} Long</span>
                <span>📊 ${reports.length} Total</span>
            </div>
        `;
        
        contributionBody.innerHTML = html;
    }

    // ========== Load Activity ==========
    function loadActivity() {
        const reports = userReportsData;
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
        
        const recentActivities = sortedReports.slice(0, 10);
        let html = '';
        recentActivities.forEach(report => {
            const emoji = getStatusEmoji(report.queueLength);
            const label = getStatusLabel(report.queueLength);
            html += `
                <div class="activity-item">
                    <div class="activity-icon"><i class="bi bi-elevator"></i></div>
                    <div class="activity-content">
                        <div class="activity-title">${emoji} ${label} · ${escapeHtml(report.building)}</div>
                        <div class="activity-desc">${escapeHtml(report.elevator)}</div>
                    </div>
                    <div class="activity-time">${formatTimeAgo(report.timestamp)}</div>
                </div>
            `;
        });
        activityList.innerHTML = html;
    }

    // ========== Refresh All Data ==========
    function refreshAllData() {
        loadUserProfile();
        fetchAllReports();
        loadActivity();
        showToast('Data refreshed!', 'info');
    }

    // ========== Event Listeners ==========
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
    
    if (goToReportsBtn) goToReportsBtn.addEventListener('click', function() { navigateTo('reports'); });
    if (goToFindRoomBtn) goToFindRoomBtn.addEventListener('click', function() { navigateTo('findroom'); });
    if (goToQueueBtn) goToQueueBtn.addEventListener('click', function() { navigateTo('queue'); });
    
    if (refreshBtn) refreshBtn.addEventListener('click', refreshAllData);

    if (autoRefreshToggle) {
        autoRefreshToggle.addEventListener('change', function() {
            localStorage.setItem('animoflow_auto_refresh', this.checked);
            showToast(this.checked ? 'Auto-refresh enabled' : 'Auto-refresh disabled', 'info');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('animoflow_user');
            localStorage.removeItem('animoflow_admin_token');
            localStorage.removeItem('animoflow_admin_user');
            showToast('Logged out successfully!', 'info');
            setTimeout(() => { window.location.href = 'login-index.html'; }, 500);
        });
    }

    // ========== Load Preferences ==========
    function loadPreferences() {
        const autoPref = localStorage.getItem('animoflow_auto_refresh');
        if (autoPref !== null) autoRefreshToggle.checked = autoPref === 'true';
    }

    // ========== Start Auto-Refresh ==========
    function startAutoRefresh() {
        const autoPref = localStorage.getItem('animoflow_auto_refresh');
        if (autoPref === 'true' || autoPref === null) {
            setInterval(() => {
                fetchAllReports();
                loadActivity();
            }, 30000);
        }
    }

    // ===== WATCH FOR DARK MODE CHANGES =====
    const observer = new MutationObserver(function() {
        updateChartColors();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // ========== Initial Load ==========
    loadPreferences();
    loadUserProfile();
    fetchAllReports();
    loadActivity();
    startAutoRefresh();
    
    console.log('[AnimoFlow] Profile page enhanced (Phase 3)');
});