/**
 * AnimoFlow - Admin Users CRUD
 * 
 * Description: Admin page for managing users. Admins can view all
 *              registered users and update their roles.
 * 
 * Features:
 *   - View all users in DataTable with search/sort/pagination
 *   - User statistics (Total Users, Admins, Regular Users)
 *   - Edit user roles (User/Admin)
 *   - Dark mode support
 * 
 * Admin Access: Requires valid admin token
 * API: GET /api/admin/users, PUT /api/admin/users/role
 * Author: AnimoFlow Team
 * Date: August 2026
 */

let usersTable = null;
let allUsersData = [];

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

    // ===== CHECK ADMIN ACCESS =====
    function checkAdminAccess() {
        console.log('[Users] Checking admin access...');
        
        // Check for admin token
        const adminToken = localStorage.getItem('animoflow_admin_token');
        const adminUser = localStorage.getItem('animoflow_admin_user');
        
        if (adminToken && adminUser) {
            try {
                const user = JSON.parse(adminUser);
                if (user.role === 'admin') {
                    console.log('[Users] Admin authenticated via token');
                    const emailEl = document.getElementById('adminUserEmail');
                    if (emailEl) emailEl.textContent = user.email || 'admin@dlsu.edu.ph';
                    return true;
                }
            } catch (e) {
                console.error('[Users] Error parsing admin user:', e);
            }
        }
        
        // Check regular user with admin role
        const userData = localStorage.getItem('animoflow_user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.role === 'admin') {
                    console.log('[Users] Admin authenticated via user data');
                    if (!adminToken) {
                        const token = btoa(user.email + ':' + Date.now());
                        localStorage.setItem('animoflow_admin_token', token);
                        localStorage.setItem('animoflow_admin_user', JSON.stringify({
                            email: user.email,
                            role: 'admin'
                        }));
                    }
                    const emailEl = document.getElementById('adminUserEmail');
                    if (emailEl) emailEl.textContent = user.email;
                    return true;
                }
            } catch (e) {
                console.error('[Users] Error parsing user data:', e);
            }
        }
        
        // Not authenticated
        console.log('[Users] Not authenticated');
        showToast('Admin access required. Redirecting to login...', 'warning');
        setTimeout(function() {
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
        window.location.href = '../user/dashboard.html';
    });

    document.getElementById('adminLogoutBtn').addEventListener('click', function() {
        localStorage.removeItem('animoflow_admin_token');
        localStorage.removeItem('animoflow_admin_user');
        localStorage.removeItem('animoflow_user');
        showToast('Logged out', 'info');
        setTimeout(function() { 
            window.location.href = '../admin-login.html'; 
        }, 500);
    });

    // ===== LOAD USERS =====
    async function loadUsersData() {
        try {
            const token = localStorage.getItem('animoflow_admin_token');
            if (!token) {
                console.log('[Users] No token found');
                showToast('No admin token found. Please login again.', 'warning');
                setTimeout(function() { 
                    window.location.href = '../admin-login.html'; 
                }, 1500);
                return;
            }
            
            console.log('[Users] Fetching users with token...');
            
            const response = await fetch("http://localhost:3999/api/admin/users", {
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('[Users] Response status:', response.status);
            
            // If unauthorized, redirect to login
            if (response.status === 401) {
                const data = await response.json();
                console.log('[Users] Auth error:', data.error || 'Unauthorized');
                showToast('Session expired. Please login again.', 'warning');
                localStorage.removeItem('animoflow_admin_token');
                localStorage.removeItem('animoflow_admin_user');
                setTimeout(function() { 
                    window.location.href = '../admin-login.html'; 
                }, 1500);
                return;
            }
            
            if (!response.ok) {
                throw new Error('Failed to fetch users: ' + response.status);
            }
            
            allUsersData = await response.json();
            console.log('[Users] Loaded', allUsersData.length, 'users');
            
            const total = allUsersData.length;
            const admins = allUsersData.filter(u => u.role === 'admin').length;
            const regulars = total - admins;
            
            document.getElementById('totalUserCount').textContent = total;
            document.getElementById('adminCount').textContent = admins;
            document.getElementById('regularUserCount').textContent = regulars;
            
            updateUsersTable(allUsersData);
            
        } catch (err) {
            console.error('[Users] Failed to load users:', err);
            showToast('Failed to load users: ' + err.message, 'error');
        }
    }

    // ===== UPDATE TABLE =====
    function updateUsersTable(users) {
        const tableBody = document.getElementById('usersTableBody');
        tableBody.innerHTML = '';
        
        if (!users || users.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No users found</td></tr>`;
            if (usersTable) usersTable.destroy();
            usersTable = $('#usersTable').DataTable({
                responsive: true,
                pageLength: 25,
                language: {
                    search: "Search users:",
                    lengthMenu: "Show _MENU_ users per page",
                    info: "Showing _START_ to _END_ of _TOTAL_ users",
                    infoEmpty: "No users found"
                }
            });
            return;
        }
        
        const sorted = [...users].sort((a, b) => {
            if (a.role === 'admin') return -1;
            if (b.role === 'admin') return 1;
            return a.email.localeCompare(b.email);
        });
        
        sorted.forEach(function(user) {
            const tr = document.createElement('tr');
            const isAdmin = user.role === 'admin';
            tr.innerHTML = `
                <td>${escapeHtml(user.email)}</td>
                <td>
                    <span class="role-badge ${isAdmin ? 'admin' : 'user'}">
                        ${isAdmin ? '🔒 Admin' : '👤 User'}
                    </span>
                </td>
                <td>${user.createdAt ? formatDate(user.createdAt) : 'N/A'}</td>
                <td>
                    <button class="btn-action edit-user-btn" data-email="${escapeHtml(user.email)}" data-role="${user.role}" title="Edit Role">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        document.querySelectorAll('.edit-user-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                openUserEditModal(this.dataset.email, this.dataset.role);
            });
        });

        if (usersTable) usersTable.destroy();
        usersTable = $('#usersTable').DataTable({
            responsive: true,
            order: [[1, 'desc']],
            pageLength: 25,
            language: {
                search: "Search users:",
                lengthMenu: "Show _MENU_ users per page",
                info: "Showing _START_ to _END_ of _TOTAL_ users",
                infoEmpty: "No users found"
            },
            columnDefs: [
                { orderable: false, targets: [3] }
            ]
        });
    }

    function formatDate(timestamp) {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'N/A';
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

    // ===== EDIT USER MODAL =====
    let editUserModal = null;

    function openUserEditModal(email, currentRole) {
        console.log('[Users] Opening edit modal for:', email);
        document.getElementById('editUserEmail').value = email;
        document.getElementById('editUserEmailDisplay').value = email;
        document.getElementById('editUserRole').value = currentRole || 'user';

        if (!editUserModal) {
            editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        }
        editUserModal.show();
    }

    document.getElementById('saveUserEditBtn').addEventListener('click', async function() {
        const email = document.getElementById('editUserEmail').value;
        const role = document.getElementById('editUserRole').value;

        console.log('[Users] Updating user:', email, 'to role:', role);

        try {
            const token = localStorage.getItem('animoflow_admin_token');
            if (!token) {
                showToast('No admin token found', 'error');
                return;
            }
            
            const response = await fetch('http://localhost:3999/api/admin/users/role', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ email, role })
            });

            if (response.ok) {
                showToast('✅ User ' + email + ' updated to ' + role, 'success');
                if (editUserModal) editUserModal.hide();
                loadUsersData();
            } else {
                const data = await response.json();
                showToast(data.error || 'Failed to update user', 'error');
            }
        } catch (err) {
            console.error('[Users] Error updating user:', err);
            showToast('Error updating user', 'error');
        }
    });

    // ===== REFRESH =====
    document.getElementById('refreshBtn').addEventListener('click', function() {
        loadUsersData();
        showToast('Users refreshed!', 'info');
    });

    // ===== INIT =====
    const isAdmin = checkAdminAccess();
    if (!isAdmin) {
        console.log('[Users] Admin check failed, stopping initialization');
        return;
    }
    
    console.log('[Users] Admin authenticated, initializing...');
    loadUsersData();
    setInterval(loadUsersData, 60000);

});