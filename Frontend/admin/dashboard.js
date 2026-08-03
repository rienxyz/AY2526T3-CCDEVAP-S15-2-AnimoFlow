/**
 * AnimoFlow - Admin Dashboard
 * 
 * Description: Admin overview page with statistics, charts, and quick
 *              access to CRUD operations. Admins can view reports
 *              analytics and manage the system.
 * 
 * Features:
 *   - Statistics cards (Total Reports, Active, Buildings, Users)
 *   - Toggleable charts (Bar/Pie, Pie/Doughnut)
 *   - Trend line graph with filters (Building, Elevator, Date Range)
 *   - Quick action cards to CRUD pages
 *   - Clear All Reports functionality
 *   - Dark mode support
 * 
 * Admin Access: Requires valid admin token
 * API: GET /api/report/all, GET /api/admin/users, DELETE /api/admin/reports/all
 * Author: AnimoFlow Team
 * Date: August 2026
 */

let buildingChart = null;
let statusChart = null;
let trendChart = null;
let allReports = [];
let allUsers = [];

document.addEventListener('DOMContentLoaded', function() {

    // ===== DARK MODE TOGGLE =====
    const darkModeToggle = document.getElementById('darkModeToggle');

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('animoflow_darkmode', isDark ? 'dark' : 'light');
        if (darkModeToggle) darkModeToggle.textContent = isDark ? '☀️' : '🌙';
        updateChartColors();
    }

    const savedTheme = localStorage.getItem('animoflow_darkmode');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }
    if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);

    // ===== CHECK ADMIN ACCESS =====
    function checkAdminAccess() {
        const adminToken = localStorage.getItem('animoflow_admin_token');
        const adminUser = localStorage.getItem('animoflow_admin_user');
        
        if (adminToken && adminUser) {
            try {
                const user = JSON.parse(adminUser);
                if (user.role === 'admin') {
                    document.getElementById('adminUserEmail').textContent = user.email || 'admin@dlsu.edu.ph';
                    return true;
                }
            } catch (e) {
                console.error('Error parsing admin user:', e);
            }
        }
        
        const userData = localStorage.getItem('animoflow_user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.role === 'admin') {
                    if (!adminToken) {
                        const token = btoa(user.email + ':' + Date.now());
                        localStorage.setItem('animoflow_admin_token', token);
                        localStorage.setItem('animoflow_admin_user', JSON.stringify({
                            email: user.email,
                            role: 'admin'
                        }));
                    }
                    document.getElementById('adminUserEmail').textContent = user.email;
                    return true;
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
        
        showToast('Admin access required. Redirecting to login...', 'warning');
        setTimeout(() => {
            window.location.href = '../admin-login.html';
        }, 1500);
        return false;
    }

    // ===== TOAST =====
    const toastElement = document.getElementById('liveToast');
    let bsToast = null;
    
    if (!toastElement) {
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1100';
        container.innerHTML = `
            <div id="liveToast" class="toast align-items-center border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body" id="toastMessage">Notification</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        document.body.appendChild(container);
    }
    
    const toastEl = document.getElementById('liveToast');
    if (toastEl) {
        bsToast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 });
    }

    window.showToast = function(message, type = 'info') {
        if (!bsToast || !toastEl) return;
        const toastBody = toastEl.querySelector('.toast-body');
        if (toastBody) toastBody.innerHTML = message;
        toastEl.style.background = type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#006837';
        if (type === 'warning') {
            toastEl.querySelector('.toast-body').style.color = '#1a2b1a';
        } else {
            toastEl.querySelector('.toast-body').style.color = 'white';
        }
        bsToast.show();
    };

    // ===== NAVIGATION =====
    document.getElementById('backToMainBtn').addEventListener('click', function() {
        // GO TO USER DASHBOARD
        window.location.href = '../user/dashboard.html';
    });

    document.getElementById('adminLogoutBtn').addEventListener('click', function() {
        localStorage.removeItem('animoflow_admin_token');
        localStorage.removeItem('animoflow_admin_user');
        localStorage.removeItem('animoflow_user');
        showToast('Logged out', 'info');
        setTimeout(() => { window.location.href = '../admin-login.html'; }, 500);
    });

    // ===== LOAD DATA =====
    async function loadAdminData() {
        try {
            const token = localStorage.getItem('animoflow_admin_token');
            if (!token) {
                showToast('No admin token found. Please login again.', 'warning');
                setTimeout(() => { window.location.href = '../admin-login.html'; }, 1500);
                return;
            }
            
            const reportsResponse = await fetch("http://localhost:3999/api/report/all", {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            
            if (!reportsResponse.ok) {
                if (reportsResponse.status === 401) {
                    showToast('Session expired. Please login again.', 'warning');
                    setTimeout(() => { window.location.href = '../admin-login.html'; }, 1500);
                    return;
                }
                throw new Error('Failed to fetch reports');
            }
            
            allReports = await reportsResponse.json();
            
            const usersResponse = await fetch("http://localhost:3999/api/admin/users", {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            
            if (usersResponse.ok) {
                allUsers = await usersResponse.json();
            }
            
            document.getElementById('totalReports').textContent = allReports.length;
            document.getElementById('activeReports').textContent = allReports.filter(r => (Date.now() - r.timestamp) <= 1800000).length;
            document.getElementById('buildingsWithReports').textContent = new Set(allReports.map(r => r.building)).size;
            document.getElementById('totalUsers').textContent = allUsers.length || new Set(allReports.map(r => r.userId)).size;
            
            updateBuildingChart(allReports);
            updateStatusChart(allReports);
            updateTrendChart(allReports);
            populateFilters(allReports);
            
        } catch (err) {
            console.error('Failed to load data:', err);
            showToast('Failed to load data. Make sure the server is running.', 'error');
        }
    }

    // ===== BUILDING CHART =====
    let buildingChartView = 'pie';

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

        const ctx = document.getElementById('buildingChart');
        if (!ctx) return;

        if (buildingChart) buildingChart.destroy();

        if (buildingChartView === 'bar') {
            buildingChart = new Chart(ctx, {
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
            buildingChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: ['#006837', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#007bff']
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

    // ===== STATUS CHART =====
    let statusChartView = 'pie';

    function updateStatusChart(reports) {
        const statusCounts = { short: 0, medium: 0, long: 0 };
        reports.forEach(r => {
            if (statusCounts.hasOwnProperty(r.queueLength)) statusCounts[r.queueLength]++;
        });
        const total = statusCounts.short + statusCounts.medium + statusCounts.long;

        const isDark = document.body.classList.contains('dark-mode');
        const textColor = isDark ? '#a8b8c8' : '#6c7a6c';

        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        if (statusChart) statusChart.destroy();

        const chartType = statusChartView === 'doughnut' ? 'doughnut' : 'pie';
        
        if (total === 0) {
            statusChart = new Chart(ctx, {
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
            statusChart = new Chart(ctx, {
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

    // ===== TREND CHART =====
    let trendFilter = { building: 'all', elevator: 'all', dateRange: 'week' };

    function updateTrendChart(reports) {
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

        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        if (trendChart) trendChart.destroy();

        if (labels.length === 0) {
            trendChart = new Chart(ctx, {
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
            trendChart = new Chart(ctx, {
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

    // ===== POPULATE FILTERS =====
    function populateFilters(reports) {
        const buildingSelect = document.getElementById('trendBuildingFilter');
        const buildings = new Set(reports.map(r => r.building));
        buildingSelect.innerHTML = '<option value="all">All Buildings</option>';
        Array.from(buildings).sort().forEach(b => {
            buildingSelect.innerHTML += `<option value="${b}">${b}</option>`;
        });

        const elevatorSelect = document.getElementById('trendElevatorFilter');
        const elevators = new Set(reports.map(r => r.elevator));
        elevatorSelect.innerHTML = '<option value="all">All Elevators</option>';
        Array.from(elevators).sort().forEach(e => {
            elevatorSelect.innerHTML += `<option value="${e}">${e}</option>`;
        });
    }

    // ===== CHART TOGGLES =====
    document.querySelectorAll('.btn-chart-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            const chart = this.dataset.chart;
            const view = this.dataset.view;
            
            document.querySelectorAll(`.btn-chart-toggle[data-chart="${chart}"]`).forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            if (chart === 'building') {
                buildingChartView = view;
                updateBuildingChart(allReports);
            } else if (chart === 'status') {
                statusChartView = view;
                updateStatusChart(allReports);
            }
        });
    });

    // ===== TREND FILTERS =====
    document.getElementById('applyTrendFilter').addEventListener('click', function() {
        trendFilter.building = document.getElementById('trendBuildingFilter').value;
        trendFilter.elevator = document.getElementById('trendElevatorFilter').value;
        trendFilter.dateRange = document.getElementById('trendDateFilter').value;
        updateTrendChart(allReports);
        showToast('Trend chart updated!', 'info');
    });

    document.getElementById('clearTrendFilter').addEventListener('click', function() {
        document.getElementById('trendBuildingFilter').value = 'all';
        document.getElementById('trendElevatorFilter').value = 'all';
        document.getElementById('trendDateFilter').value = 'week';
        trendFilter = { building: 'all', elevator: 'all', dateRange: 'week' };
        updateTrendChart(allReports);
        showToast('Filters reset!', 'info');
    });

    // ===== CLEAR ALL REPORTS =====
    window.clearAllReports = async function() {
        if (!confirm('⚠️ Delete ALL reports? This cannot be undone.')) return;
        if (!confirm('Really? All reports will be permanently deleted.')) return;
        
        try {
            const token = localStorage.getItem('animoflow_admin_token');
            const response = await fetch('http://localhost:3999/api/admin/reports/all', {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (response.ok) {
                const data = await response.json();
                showToast(`✅ ${data.message}`, 'success');
                loadAdminData();
            } else {
                showToast('Failed to clear', 'error');
            }
        } catch (err) {
            showToast('Error clearing', 'error');
        }
    };

    // ===== UPDATE CHART COLORS =====
    function updateChartColors() {
        if (allReports.length > 0) {
            updateBuildingChart(allReports);
            updateStatusChart(allReports);
            updateTrendChart(allReports);
        }
    }

    // ===== INIT =====
    const isAdmin = checkAdminAccess();
    if (!isAdmin) {
        return;
    }
    
    console.log('[AnimoFlow] Admin authenticated successfully');
    loadAdminData();
    setInterval(loadAdminData, 30000);
    console.log('[AnimoFlow] Admin Dashboard initialized');

});