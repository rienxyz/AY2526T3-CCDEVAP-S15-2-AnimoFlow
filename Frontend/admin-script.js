/**
 * AnimoFlow Admin Panel - Complete
 * Fixed: Token handling and admin verification
 */
let reportsTable = null;
let buildingChart = null;
let statusChart = null;

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

    // ===== CHECK ADMIN ACCESS - FIXED =====
    async function checkAdminAccess() {
        // Check admin token from localStorage
        const adminToken = localStorage.getItem('animoflow_admin_token');
        const adminUser = localStorage.getItem('animoflow_admin_user');
        
        // If admin token exists, verify it with the server
        if (adminToken && adminUser) {
            try {
                const response = await fetch('http://localhost:3999/api/auth/verify', {
                    headers: {
                        'Authorization': 'Bearer ' + adminToken
                    }
                });
                
                if (response.ok) {
                    return true; // Token is valid
                } else {
                    // Token is invalid, clear it
                    localStorage.removeItem('animoflow_admin_token');
                    localStorage.removeItem('animoflow_admin_user');
                }
            } catch (err) {
                console.error('Token verification failed:', err);
            }
        }
        
        // Check regular user with admin role
        const userData = localStorage.getItem('animoflow_user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.role === 'admin') {
                    // Create admin token from regular login
                    const token = btoa(user.email + ':' + Date.now());
                    localStorage.setItem('animoflow_admin_token', token);
                    localStorage.setItem('animoflow_admin_user', JSON.stringify({
                        email: user.email,
                        role: 'admin'
                    }));
                    return true;
                }
            } catch (e) {}
        }
        
        // NOT an admin - redirect
        showToast('Admin access required. Please login as admin.', 'warning');
        setTimeout(() => {
            window.location.href = 'admin-login.html';
        }, 1500);
        return false;
    }

    // Run admin check - if fails, code stops here
    // Use IIFE to handle async
    (async function initAdmin() {
        const isAdmin = await checkAdminAccess();
        if (!isAdmin) {
            return;
        }
        // Proceed with admin panel initialization
        initializeAdminPanel();
    })();

    // ===== INITIALIZE ADMIN PANEL =====
    function initializeAdminPanel() {
        // ===== TOAST =====
        const toastElement = document.getElementById('liveToast');
        let bsToast = null;
        if (toastElement) {
            bsToast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
        }

        window.showToast = function(message, type = 'info') {
            if (!bsToast || !toastElement) return;
            const toastBody = toastElement.querySelector('.toast-body');
            if (toastBody) toastBody.innerHTML = message;
            toastElement.style.background = type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#006837';
            if (type === 'warning') {
                toastElement.querySelector('.toast-body').style.color = '#1a2b1a';
            } else {
                toastElement.querySelector('.toast-body').style.color = 'white';
            }
            bsToast.show();
        };

        // ===== BACK TO DASHBOARD =====
        document.getElementById('backToDashboardBtn').addEventListener('click', function() {
            window.location.href = 'dashboard-index.html';
        });

        // ===== LOAD DATA =====
        async function loadAdminData() {
            try {
                const token = localStorage.getItem('animoflow_admin_token');
                const response = await fetch("http://localhost:3999/api/report/all", {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                const reports = await response.json();
                document.getElementById('totalReports').textContent = reports.length;
                document.getElementById('activeReports').textContent = reports.filter(r => (Date.now() - r.timestamp) <= 1800000).length;
                document.getElementById('buildingsWithReports').textContent = new Set(reports.map(r => r.building)).size;
                document.getElementById('totalUsers').textContent = new Set(reports.map(r => r.userId)).size;
                updateCharts(reports);
                updateTable(reports);
            } catch (err) {
                console.error(err);
                showToast('Failed to load data. Make sure the server is running.', 'error');
            }
        }

        // ===== CHARTS =====
        function updateCharts(reports) {
            const buildingCounts = {};
            reports.forEach(r => { buildingCounts[r.building] = (buildingCounts[r.building] || 0) + 1; });
            const sorted = Object.entries(buildingCounts).sort((a, b) => b[1] - a[1]);
            const labels = sorted.map(b => b[0]);
            const data = sorted.map(b => b[1]);

            const isDark = document.body.classList.contains('dark-mode');
            const textColor = isDark ? '#a8b8c8' : '#6c7a6c';

            const ctx1 = document.getElementById('buildingChart').getContext('2d');
            if (buildingChart) buildingChart.destroy();
            buildingChart = new Chart(ctx1, {
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
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1, color: textColor } },
                        x: { ticks: { color: textColor } }
                    }
                }
            });

            const statusCounts = { short: 0, medium: 0, long: 0 };
            reports.forEach(r => { if (statusCounts.hasOwnProperty(r.queueLength)) statusCounts[r.queueLength]++; });
            const total = statusCounts.short + statusCounts.medium + statusCounts.long;

            const ctx2 = document.getElementById('statusChart').getContext('2d');
            if (statusChart) statusChart.destroy();
            statusChart = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: total === 0 ? ['No Data'] : ['🟢 Short', '🟡 Medium', '🔴 Long'],
                    datasets: [{
                        data: total === 0 ? [1] : [statusCounts.short, statusCounts.medium, statusCounts.long],
                        backgroundColor: total === 0 ? ['#e9ecef'] : ['#28a745', '#ffc107', '#dc3545'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: textColor } }
                    }
                }
            });
        }

        function updateChartColors() {
            const isDark = document.body.classList.contains('dark-mode');
            const textColor = isDark ? '#a8b8c8' : '#6c7a6c';
            if (buildingChart) {
                buildingChart.options.scales.y.ticks.color = textColor;
                buildingChart.options.scales.x.ticks.color = textColor;
                buildingChart.update();
            }
            if (statusChart) {
                statusChart.options.plugins.legend.labels.color = textColor;
                statusChart.update();
            }
        }

        // ===== DATA TABLE =====
        function updateTable(reports) {
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '';
            const sorted = [...reports].sort((a, b) => b.timestamp - a.timestamp);
            sorted.forEach(report => {
                const statusMap = {
                    short: '<span class="queue-badge short">🟢 Short</span>',
                    medium: '<span class="queue-badge medium">🟡 Medium</span>',
                    long: '<span class="queue-badge long">🔴 Long</span>'
                };
                const shortId = report.id ? report.id.substring(0, 8) : 'N/A';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><code title="Full ID: ${report.id || 'N/A'}">${shortId}</code></td>
                    <td>${escapeHtml(report.building)}</td>
                    <td>${escapeHtml(report.elevator)}</td>
                    <td>${statusMap[report.queueLength] || report.queueLength}</td>
                    <td>${escapeHtml(report.userId || 'anonymous')}</td>
                    <td>${formatTimeAgo(report.timestamp)}</td>
                    <td><button class="btn-delete" data-id="${report.id}"><i class="bi bi-trash"></i></button></td>
                `;
                tableBody.appendChild(tr);
            });
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', function() { deleteReport(this.getAttribute('data-id')); });
            });
            if (reportsTable) reportsTable.destroy();
            reportsTable = $('#reportsTable').DataTable({
                responsive: true,
                order: [[5, 'desc']],
                pageLength: 25,
                language: {
                    search: "Search reports:",
                    lengthMenu: "Show _MENU_ reports per page",
                    info: "Showing _START_ to _END_ of _TOTAL_ reports",
                    infoEmpty: "No reports available"
                }
            });
        }

        async function deleteReport(id) {
            if (!confirm('Are you sure you want to delete this report?')) return;
            try {
                const token = localStorage.getItem('animoflow_admin_token');
                const response = await fetch(`http://localhost:3999/api/report/id/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                if (response.ok) { showToast('Report deleted!', 'success'); loadAdminData(); }
                else showToast('Failed to delete', 'error');
            } catch (err) { showToast('Error deleting', 'error'); }
        }

        async function clearAllReports() {
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
                } else showToast('Failed to clear', 'error');
            } catch (err) { showToast('Error clearing', 'error'); }
        }

        // ===== HELPERS =====
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

        // ===== EVENT LISTENERS =====
        document.getElementById('refreshTableBtn').addEventListener('click', function() {
            loadAdminData();
            showToast('Data refreshed!', 'info');
        });
        document.getElementById('clearAllBtn').addEventListener('click', clearAllReports);

        // ===== INIT =====
        loadAdminData();
        setInterval(loadAdminData, 30000);
        console.log('[AnimoFlow] Admin panel initialized');
    }

    // Watch for dark mode changes
    const observer = new MutationObserver(function() {
        updateChartColors();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});