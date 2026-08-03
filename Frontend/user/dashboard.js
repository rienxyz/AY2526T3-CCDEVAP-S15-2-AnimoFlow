/**
 * AnimoFlow - User Dashboard
 * 
 * Description: Main landing page for regular users. Displays interactive charts 
 *              (Reports by Building, Queue Status Distribution, Report Trends) 
 *              and recent activity feed. Includes toggleable chart views, 
 *              filtering, and dark mode support.
 * 
 * Features:
 *   - Toggleable charts (Bar/Pie, Pie/Doughnut)
 *   - Trend line graph with filters (Building, Elevator, Date Range)
 *   - Recent activity feed
 *   - Dark mode support
 *   - Admin detection (shows Admin Panel link for admins)
 * 
 * Dependencies: Chart.js, Bootstrap 5, Bootstrap Icons
 * API: GET /api/report, GET /api/report/user/:userId
 * Author: AnimoFlow Team
 * Date: August 2026
 */

let dashBuildingChart = null;
let dashStatusChart = null;
let userTrendChart = null;
let allReportsForTrend = [];

let buildingChartView = 'pie';
let statusChartView = 'pie';
let trendFilter = { building: 'all', elevator: 'all', dateRange: 'week' };

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
        updateAllChartColors();
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

    // ===== CHECK ADMIN ACCESS - FIXED =====
    function isUserAdmin() {
        // Check 1: Look for admin token first (most reliable)
        const adminToken = localStorage.getItem('animoflow_admin_token');
        const adminUser = localStorage.getItem('animoflow_admin_user');
        
        if (adminToken && adminUser) {
            try {
                const admin = JSON.parse(adminUser);
                if (admin.role === 'admin') {
                    console.log('[User Dashboard] Admin detected via admin token');
                    return true;
                }
            } catch (e) {}
        }
        
        // Check 2: Look for user data with admin role
        let userData = localStorage.getItem('animoflow_user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.role === 'admin') {
                    console.log('[User Dashboard] Admin detected via user data');
                    return true;
                }
            } catch (e) {}
        }
        
        // Check 3: Check for hardcoded admin emails
        if (userData) {
            try {
                const user = JSON.parse(userData);
                const adminEmails = ['admin@dlsu.edu.ph', 'admin.animoflow@dlsu.edu.ph'];
                if (adminEmails.includes(user.email)) {
                    console.log('[User Dashboard] Admin detected via hardcoded email');
                    return true;
                }
            } catch (e) {}
        }
        
        console.log('[User Dashboard] Not admin, showing guest view');
        return false;
    }

    function getUserEmail() {
        // Check admin user first
        const adminUser = localStorage.getItem('animoflow_admin_user');
        if (adminUser) {
            try {
                const admin = JSON.parse(adminUser);
                return admin.email;
            } catch (e) {}
        }
        
        let userData = localStorage.getItem('animoflow_user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.email && user.email !== 'guest_user') {
                    return user.email;
                }
            } catch (e) {}
        }
        
        return null;
    }

    function loadUserInfo() {
        const isAdmin = isUserAdmin();
        const userEmail = getUserEmail();
        
        // Update sidebar user info
        const nameEl = document.getElementById('sidebarUserName');
        const emailEl = document.getElementById('sidebarUserEmail');
        
        if (nameEl && emailEl) {
            if (userEmail) {
                const nameParts = userEmail.split('@')[0].split('.');
                const formattedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
                nameEl.textContent = formattedName || 'Animo User';
                emailEl.textContent = userEmail;
            } else {
                nameEl.textContent = 'Guest User';
                emailEl.textContent = 'guest@animoflow.local';
            }
        }
        
        // Show/hide admin link in sidebar
        const adminNavLink = document.getElementById('adminNavLink');
        if (adminNavLink) {
            adminNavLink.style.display = isAdmin ? 'block' : 'none';
        }
        
        // Also update navbar user email
        const navEmail = document.getElementById('navUserEmail');
        if (navEmail) {
            navEmail.textContent = userEmail ? userEmail.split('@')[0] : 'Guest';
        }
    }

    // ===== NAVBAR LOGOUT =====
    const navLogoutBtn = document.getElementById('navLogoutBtn');
    if (navLogoutBtn) {
        navLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('animoflow_user');
            localStorage.removeItem('animoflow_admin_token');
            localStorage.removeItem('animoflow_admin_user');
            window.location.href = '../login.html';
        });
    }

    // ===== SIDEBAR LOGOUT =====
    const sidebarLogout = document.getElementById('sidebarLogout');
    if (sidebarLogout) {
        sidebarLogout.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('animoflow_user');
            localStorage.removeItem('animoflow_admin_token');
            localStorage.removeItem('animoflow_admin_user');
            window.location.href = '../login.html';
        });
    }

    // ===== UPDATE ALL CHART COLORS =====
    function updateAllChartColors() {
        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#a8b8c8' : '#6c7a6c';
        
        if (dashBuildingChart) {
            const options = dashBuildingChart.options;
            if (options) {
                if (options.scales && options.scales.y) {
                    options.scales.y.ticks.color = textColor;
                }
                if (options.scales && options.scales.x) {
                    options.scales.x.ticks.color = textColor;
                }
                dashBuildingChart.update();
            }
        }
        if (dashStatusChart) {
            const options = dashStatusChart.options;
            if (options && options.plugins && options.plugins.legend) {
                options.plugins.legend.labels.color = textColor;
                dashStatusChart.update();
            }
        }
        if (userTrendChart) {
            const options = userTrendChart.options;
            if (options) {
                if (options.scales && options.scales.y) {
                    options.scales.y.ticks.color = textColor;
                }
                if (options.scales && options.scales.x) {
                    options.scales.x.ticks.color = textColor;
                }
                if (options.plugins && options.plugins.legend) {
                    options.plugins.legend.labels.color = textColor;
                }
                userTrendChart.update();
            }
        }
    }

    // ===== UPDATE BUILDING CHART =====
    function updateBuildingChart(reports) {
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

        const ctx = document.getElementById('dashboardBuildingChart');
        if (!ctx) return;

        if (dashBuildingChart) dashBuildingChart.destroy();

        if (buildingChartView === 'bar') {
            dashBuildingChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Reports',
                        data: data,
                        backgroundColor: bgColor,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1, color: textColor } },
                        x: { ticks: { color: textColor } }
                    }
                }
            });
        } else {
            const colors = ['#006837', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#007bff'];
            dashBuildingChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors.slice(0, labels.length)
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } }
                    }
                }
            });
        }
    }

    // ===== UPDATE STATUS CHART =====
    function updateStatusChart(reports) {
        const statusCounts = { short: 0, medium: 0, long: 0 };
        reports.forEach(r => {
            if (statusCounts.hasOwnProperty(r.queueLength)) {
                statusCounts[r.queueLength]++;
            }
        });
        const total = statusCounts.short + statusCounts.medium + statusCounts.long;

        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#a8b8c8' : '#6c7a6c';

        const ctx = document.getElementById('dashboardStatusChart');
        if (!ctx) return;

        if (dashStatusChart) dashStatusChart.destroy();

        const chartType = statusChartView === 'doughnut' ? 'doughnut' : 'pie';
        
        if (total === 0) {
            dashStatusChart = new Chart(ctx, {
                type: chartType,
                data: {
                    labels: ['No Data'],
                    datasets: [{ data: [1], backgroundColor: ['#e9ecef'], borderWidth: 0 }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } }
                    }
                }
            });
        } else {
            dashStatusChart = new Chart(ctx, {
                type: chartType,
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
                        legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } }
                    }
                }
            });
        }
    }

    // ===== UPDATE TREND CHART =====
    function updateTrendChart(reports) {
        allReportsForTrend = reports;
        
        let filtered = [...reports];
        
        if (trendFilter.building !== 'all') {
            filtered = filtered.filter(r => r.building === trendFilter.building);
        }
        if (trendFilter.elevator !== 'all') {
            filtered = filtered.filter(r => r.elevator === trendFilter.elevator);
        }
        
        const now = Date.now();
        const dayMs = 86400000;
        let cutoff = 0;
        
        switch(trendFilter.dateRange) {
            case 'today': cutoff = now - dayMs; break;
            case 'week': cutoff = now - (7 * dayMs); break;
            case 'month': cutoff = now - (30 * dayMs); break;
            case 'all': cutoff = 0; break;
            default: cutoff = now - (7 * dayMs);
        }
        
        if (cutoff > 0) {
            filtered = filtered.filter(r => r.timestamp >= cutoff);
        }

        const dateMap = new Map();
        filtered.forEach(r => {
            const date = new Date(r.timestamp);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!dateMap.has(dateStr)) {
                dateMap.set(dateStr, 0);
            }
            dateMap.set(dateStr, dateMap.get(dateStr) + 1);
        });

        const sortedDates = Array.from(dateMap.entries()).sort((a, b) => {
            const d1 = new Date(a[0]);
            const d2 = new Date(b[0]);
            return d1 - d2;
        });

        const labels = sortedDates.map(d => d[0]);
        const data = sortedDates.map(d => d[1]);

        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#a8b8c8' : '#6c7a6c';
        const lineColor = isDark ? '#64b5f6' : '#006837';
        const fillColor = isDark ? 'rgba(100,181,246,0.1)' : 'rgba(0,104,55,0.1)';

        const ctx = document.getElementById('userTrendChart');
        if (!ctx) return;

        if (userTrendChart) userTrendChart.destroy();

        if (labels.length === 0) {
            userTrendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['No Data'],
                    datasets: [{
                        label: 'Reports',
                        data: [0],
                        borderColor: '#e9ecef',
                        backgroundColor: '#e9ecef'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        } else {
            userTrendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Reports Submitted',
                        data: data,
                        borderColor: lineColor,
                        backgroundColor: fillColor,
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: lineColor,
                        pointBorderColor: isDark ? '#1a1a2e' : '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { 
                            labels: { color: textColor, font: { size: 11 } }
                        }
                    },
                    scales: {
                        y: { 
                            beginAtZero: true, 
                            ticks: { stepSize: 1, color: textColor },
                            grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
                        },
                        x: { 
                            ticks: { color: textColor, maxRotation: 45, font: { size: 9 } },
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    }

    // ===== POPULATE TREND FILTERS =====
    function populateTrendFilters(reports) {
        const buildingSelect = document.getElementById('userTrendBuildingFilter');
        const buildings = new Set(reports.map(r => r.building));
        buildingSelect.innerHTML = '<option value="all">All Buildings</option>';
        Array.from(buildings).sort().forEach(b => {
            buildingSelect.innerHTML += `<option value="${b}">${b}</option>`;
        });

        const elevatorSelect = document.getElementById('userTrendElevatorFilter');
        const elevators = new Set(reports.map(r => r.elevator));
        elevatorSelect.innerHTML = '<option value="all">All Elevators</option>';
        Array.from(elevators).sort().forEach(e => {
            elevatorSelect.innerHTML += `<option value="${e}">${e}</option>`;
        });
    }

    // ===== CHART TOGGLE EVENT LISTENERS =====
    document.querySelectorAll('.btn-chart-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            const chart = this.dataset.chart;
            const view = this.dataset.view;
            
            document.querySelectorAll(`.btn-chart-toggle[data-chart="${chart}"]`).forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            if (chart === 'userBuilding') {
                buildingChartView = view;
                const reports = allReportsForTrend.length > 0 ? allReportsForTrend : [];
                updateBuildingChart(reports);
            } else if (chart === 'userStatus') {
                statusChartView = view;
                const reports = allReportsForTrend.length > 0 ? allReportsForTrend : [];
                updateStatusChart(reports);
            }
        });
    });

    // ===== TREND FILTER EVENT LISTENERS =====
    document.getElementById('applyUserTrendFilter').addEventListener('click', function() {
        trendFilter.building = document.getElementById('userTrendBuildingFilter').value;
        trendFilter.elevator = document.getElementById('userTrendElevatorFilter').value;
        trendFilter.dateRange = document.getElementById('userTrendDateFilter').value;
        updateTrendChart(allReportsForTrend);
        showToast('Trend chart updated!', 'info');
    });

    document.getElementById('clearUserTrendFilter').addEventListener('click', function() {
        document.getElementById('userTrendBuildingFilter').value = 'all';
        document.getElementById('userTrendElevatorFilter').value = 'all';
        document.getElementById('userTrendDateFilter').value = 'week';
        trendFilter = { building: 'all', elevator: 'all', dateRange: 'week' };
        updateTrendChart(allReportsForTrend);
        showToast('Filters reset!', 'info');
    });

    // ===== DASHBOARD DATA =====
    async function updateDashboard() {
        try {
            const response = await fetch("http://localhost:60136/api/report");
            const activeReports = await response.json();
            
            allReportsForTrend = activeReports;

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

            updateBuildingChart(activeReports);
            updateStatusChart(activeReports);
            updateTrendChart(activeReports);
            populateTrendFilters(activeReports);

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

    // ===== WATCH FOR DARK MODE CHANGES =====
    const observer = new MutationObserver(function() {
        updateAllChartColors();
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
            if (userTrendChart) userTrendChart.resize();
        }, 250);
    });

    console.log('[AnimoFlow] User Dashboard ready');

});