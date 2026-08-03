/**
 * AnimoFlow - Admin Reports CRUD
 * 
 * Description: Admin page for managing all reports. Provides full
 *              CRUD operations with filtering and DataTables.
 * 
 * Features:
 *   - View all reports in DataTable with search/sort/pagination
 *   - Edit reports (update building, elevator, status)
 *   - Delete individual reports
 *   - Clear all reports (bulk delete)
 *   - Filter by building, status, and user
 *   - Dark mode support
 * 
 * Admin Access: Requires valid admin token
 * API: GET /api/report/all, DELETE /api/report/id/:id, POST /api/report
 * Author: AnimoFlow Team
 * Date: August 2026
 */

let reportsTable = null;
let allReportsData = [];

document.addEventListener('DOMContentLoaded', function() {

    // ===== DARK MODE TOGGLE =====
    const darkModeToggle = document.getElementById('darkModeToggle');

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('animoflow_darkmode', isDark ? 'dark' : 'light');
        if (darkModeToggle) darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    }

    const savedTheme = localStorage.getItem('animoflow_darkmode');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }
    if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);

    // ===== CHECK ADMIN ACCESS - FIXED =====
    function checkAdminAccess() {
        const adminToken = localStorage.getItem('animoflow_admin_token');
        const adminUser = localStorage.getItem('animoflow_admin_user');
        
        if (adminToken && adminUser) {
            try {
                const user = JSON.parse(adminUser);
                if (user.role === 'admin') {
                    return true;
                }
            } catch (e) {}
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
                            email: user.email, role: 'admin'
                        }));
                    }
                    return true;
                }
            } catch (e) {}
        }
        
        // Not authenticated
        const toastEl = document.getElementById('liveToast');
        if (toastEl) {
            const toastBody = toastEl.querySelector('.toast-body');
            if (toastBody) toastBody.innerHTML = 'Admin access required. Redirecting to login...';
            toastEl.style.background = '#ffc107';
            toastEl.querySelector('.toast-body').style.color = '#1a2b1a';
            const bsToast = new bootstrap.Toast(toastEl, { autohide: true, delay: 2000 });
            bsToast.show();
        }
        
        setTimeout(() => {
            window.location.href = '../admin-login.html';
        }, 2000);
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
    async function loadReportsData() {
        try {
            const token = localStorage.getItem('animoflow_admin_token');
            if (!token) {
                showToast('No admin token found. Please login again.', 'warning');
                setTimeout(() => { window.location.href = '../admin-login.html'; }, 1500);
                return;
            }
            
            const response = await fetch("http://localhost:60136/api/report/all", {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    showToast('Session expired. Please login again.', 'warning');
                    setTimeout(() => { window.location.href = '../admin-login.html'; }, 1500);
                    return;
                }
                throw new Error('Failed to fetch reports');
            }
            
            allReportsData = await response.json();
            populateFilters(allReportsData);
            updateTable(allReportsData);
        } catch (err) {
            console.error('Failed to load reports:', err);
            showToast('Failed to load reports', 'error');
        }
    }

    // ===== POPULATE FILTERS =====
    function populateFilters(reports) {
        const buildingSelect = document.getElementById('filterBuilding');
        const buildings = new Set(reports.map(r => r.building));
        buildingSelect.innerHTML = '<option value="all">All Buildings</option>';
        Array.from(buildings).sort().forEach(b => {
            buildingSelect.innerHTML += `<option value="${b}">${b}</option>`;
        });

        const userSelect = document.getElementById('filterUser');
        const users = new Set(reports.map(r => r.userId));
        userSelect.innerHTML = '<option value="all">All Users</option>';
        Array.from(users).sort().forEach(u => {
            if (u) userSelect.innerHTML += `<option value="${u}">${u}</option>`;
        });
    }

    // ===== UPDATE TABLE =====
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
                <td>
                    <button class="btn-action edit-btn" data-id="${report.id}" title="Edit"><i class="bi bi-pencil"></i></button>
                    <button class="btn-action delete-btn" data-id="${report.id}" title="Delete"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() { openEditModal(this.dataset.id); });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() { deleteReport(this.dataset.id); });
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
            },
            columnDefs: [{ orderable: false, targets: [6] }]
        });
    }

    // ===== FORMAT HELPERS =====
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

    // ===== DELETE REPORT =====
    async function deleteReport(id) {
        if (!confirm('Are you sure you want to delete this report?')) return;
        
        try {
            const token = localStorage.getItem('animoflow_admin_token');
            const response = await fetch(`http://localhost:60136/api/report/id/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            
            if (response.ok) {
                showToast('✅ Report deleted!', 'success');
                loadReportsData();
            } else {
                showToast('Failed to delete report', 'error');
            }
        } catch (err) {
            showToast('Error deleting report', 'error');
        }
    }

    // ===== EDIT REPORT =====
    let editModal = null;

    function openEditModal(id) {
        const report = allReportsData.find(r => r.id === id);
        if (!report) {
            showToast('Report not found', 'error');
            return;
        }

        document.getElementById('editReportId').value = id;
        document.getElementById('editBuilding').value = report.building;
        document.getElementById('editElevator').value = report.elevator;
        document.getElementById('editStatus').value = report.queueLength;

        if (!editModal) {
            editModal = new bootstrap.Modal(document.getElementById('editReportModal'));
        }
        editModal.show();
    }

    document.getElementById('saveEditBtn').addEventListener('click', async function() {
        const id = document.getElementById('editReportId').value;
        const building = document.getElementById('editBuilding').value;
        const elevator = document.getElementById('editElevator').value.trim();
        const queueLength = document.getElementById('editStatus').value;

        if (!elevator) {
            showToast('Please enter an elevator name', 'warning');
            return;
        }

        try {
            const token = localStorage.getItem('animoflow_admin_token');
            
            const deleteRes = await fetch(`http://localhost:60136/api/report/id/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            
            if (!deleteRes.ok) {
                showToast('Failed to update report', 'error');
                return;
            }

            const oldReport = allReportsData.find(r => r.id === id);
            
            const newReport = {
                building: building,
                elevator: elevator,
                queueLength: queueLength,
                userId: oldReport ? oldReport.userId : 'admin'
            };

            const createRes = await fetch('http://localhost:60136/api/report', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(newReport)
            });

            if (createRes.ok) {
                showToast('✅ Report updated successfully!', 'success');
                editModal.hide();
                loadReportsData();
            } else {
                showToast('Failed to create updated report', 'error');
            }
        } catch (err) {
            showToast('Error updating report', 'error');
        }
    });

    // ===== CLEAR ALL REPORTS =====
    document.getElementById('clearAllBtn').addEventListener('click', async function() {
        if (!confirm('⚠️ Delete ALL reports? This cannot be undone.')) return;
        if (!confirm('Really? All reports will be permanently deleted.')) return;
        
        try {
            const token = localStorage.getItem('animoflow_admin_token');
            const response = await fetch('http://localhost:60136/api/admin/reports/all', {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + token }
            });
            
            if (response.ok) {
                const data = await response.json();
                showToast(`✅ ${data.message}`, 'success');
                loadReportsData();
            } else {
                showToast('Failed to clear reports', 'error');
            }
        } catch (err) {
            showToast('Error clearing reports', 'error');
        }
    });

    // ===== REFRESH =====
    document.getElementById('refreshBtn').addEventListener('click', function() {
        loadReportsData();
        showToast('Reports refreshed!', 'info');
    });

    // ===== FILTERS =====
    document.getElementById('applyFilterBtn').addEventListener('click', function() {
        const building = document.getElementById('filterBuilding').value;
        const status = document.getElementById('filterStatus').value;
        const user = document.getElementById('filterUser').value;

        let filtered = [...allReportsData];

        if (building !== 'all') {
            filtered = filtered.filter(r => r.building === building);
        }
        if (status !== 'all') {
            filtered = filtered.filter(r => r.queueLength === status);
        }
        if (user !== 'all') {
            filtered = filtered.filter(r => r.userId === user);
        }

        updateTable(filtered);
        showToast(`Showing ${filtered.length} reports`, 'info');
    });

    // ===== INIT =====
    const isAdmin = checkAdminAccess();
    if (!isAdmin) {
        return;
    }
    
    console.log('[AnimoFlow] Admin Reports CRUD initialized');
    loadReportsData();
    setInterval(loadReportsData, 30000);

});