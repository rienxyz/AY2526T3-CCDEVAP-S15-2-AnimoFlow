/**
 * AnimoFlow - Admin Buildings CRUD
 * 
 * Description: Admin page for managing campus buildings. Admins can
 *              view, add, edit, and delete buildings from the directory.
 * 
 * Features:
 *   - View all buildings in DataTable with search/sort/pagination
 *   - Add new buildings (code, name, floors, elevators, description)
 *   - Edit existing buildings
 *   - Delete buildings
 *   - Default building data pre-loaded
 *   - Dark mode support
 * 
 * Data Storage: Buildings stored in localStorage
 * Author: AnimoFlow Team
 * Date: August 2026
 */

let buildingsTable = null;
let allBuildingsData = [];

const DEFAULT_BUILDINGS = [
    { code: "LS", name: "St. La Salle Hall", floors: 4, elevators: "4 (LS-East-1, LS-East-2, LS-West-1, LS-West-2)", description: "Oldest building in campus, mainly used by SHS students." },
    { code: "HS", name: "Henry Sy Hall", floors: 14, elevators: "5 (H-Ground-A, H-Ground-B, H-Ground-C, H-6th-A, H-6th-B)", description: "Located in the middle of campus, houses the library on 10th-14th floors." },
    { code: "Y", name: "Yuchengco Hall", floors: 9, elevators: "3 (Y-A, Y-B, Y-C)", description: "Used for conferences, holds the Teresa G. Yuchengco auditorium and The Museum." },
    { code: "SJ", name: "St. Joseph Hall", floors: 6, elevators: "1 (SJ-1)", description: "Located behind Henry Sy Hall, houses the College of Sciences and SDFO." },
    { code: "V", name: "Velasco Hall", floors: 5, elevators: "1 (V-1)", description: "5-storey building housing the COE, located next to Henry Sy Hall." },
    { code: "M", name: "St. Miguel Hall", floors: 4, elevators: "1 (M-1)", description: "Houses CLA, academic offices, and COE labs. Bridge to Gokongwei Hall." },
    { code: "G", name: "Gokongwei Hall", floors: 4, elevators: "0 (No elevators)", description: "Used by CCS, has computer labs on 3rd and 4th floor. 24-hour study hall." },
    { code: "STRC", name: "STRC", floors: 4, elevators: "1 (STRC-1)", description: "Research facilities and labs for College of Sciences and Engineering." },
    { code: "ER", name: "Razon Sports Center", floors: 10, elevators: "3 (R-A, R-B, R-C)", description: "Main sports facility with pool, track, courts, weight rooms, and Gold's Gym." },
    { code: "A", name: "Andrew Gonzalez Hall", floors: 20, elevators: "5 (A-Public-1, A-Public-2, A-Public-3, A-Public-4, A-Staff)", description: "Tallest academic building in the Philippines. Houses COE, classrooms, and offices." }
];

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

    // ===== LOAD BUILDINGS =====
    function loadBuildingsData() {
        const saved = localStorage.getItem('animoflow_buildings_data');
        if (saved) {
            try {
                allBuildingsData = JSON.parse(saved);
            } catch (e) {
                allBuildingsData = [...DEFAULT_BUILDINGS];
            }
        } else {
            allBuildingsData = [...DEFAULT_BUILDINGS];
            localStorage.setItem('animoflow_buildings_data', JSON.stringify(allBuildingsData));
        }
        updateBuildingsTable(allBuildingsData);
    }

    function updateBuildingsData(data) {
        allBuildingsData = data;
        localStorage.setItem('animoflow_buildings_data', JSON.stringify(data));
        updateBuildingsTable(data);
    }

    function updateBuildingsTable(buildings) {
        const tableBody = document.getElementById('buildingsTableBody');
        tableBody.innerHTML = '';
        
        const sorted = [...buildings].sort((a, b) => a.code.localeCompare(b.code));
        
        sorted.forEach(building => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${escapeHtml(building.code)}</strong></td>
                <td>${escapeHtml(building.name)}</td>
                <td>${building.floors}</td>
                <td>${escapeHtml(building.elevators)}</td>
                <td>
                    <button class="btn-action edit-building-btn" data-code="${building.code}" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-action delete-building-btn" data-code="${building.code}" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        document.querySelectorAll('.edit-building-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                openEditBuildingModal(this.dataset.code);
            });
        });

        document.querySelectorAll('.delete-building-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteBuilding(this.dataset.code);
            });
        });

        if (buildingsTable) buildingsTable.destroy();
        buildingsTable = $('#buildingsTable').DataTable({
            responsive: true,
            order: [[0, 'asc']],
            pageLength: 25,
            language: {
                search: "Search buildings:",
                lengthMenu: "Show _MENU_ buildings per page",
                info: "Showing _START_ to _END_ of _TOTAL_ buildings",
                infoEmpty: "No buildings found"
            },
            columnDefs: [
                { orderable: false, targets: [4] }
            ]
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

    // ===== ADD BUILDING =====
    document.getElementById('saveBuildingBtn').addEventListener('click', function() {
        const code = document.getElementById('addBuildingCode').value.trim().toUpperCase();
        const name = document.getElementById('addBuildingName').value.trim();
        const floors = parseInt(document.getElementById('addBuildingFloors').value);
        const elevators = document.getElementById('addBuildingElevators').value.trim();
        const description = document.getElementById('addBuildingDesc').value.trim();

        if (!code || !name || !floors || !elevators) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }

        if (allBuildingsData.some(b => b.code === code)) {
            showToast(`Building code "${code}" already exists`, 'error');
            return;
        }

        const newBuilding = { code, name, floors, elevators, description };
        allBuildingsData.push(newBuilding);
        updateBuildingsData(allBuildingsData);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('addBuildingModal'));
        if (modal) modal.hide();
        
        document.getElementById('addBuildingForm').reset();
        showToast(`✅ Building "${name}" added successfully!`, 'success');
    });

    // ===== EDIT BUILDING =====
    let editBuildingModal = null;

    function openEditBuildingModal(code) {
        const building = allBuildingsData.find(b => b.code === code);
        if (!building) {
            showToast('Building not found', 'error');
            return;
        }

        document.getElementById('editBuildingCode').value = code;
        document.getElementById('editBuildingCodeDisplay').value = code;
        document.getElementById('editBuildingName').value = building.name;
        document.getElementById('editBuildingFloors').value = building.floors;
        document.getElementById('editBuildingElevators').value = building.elevators;
        document.getElementById('editBuildingDesc').value = building.description || '';

        if (!editBuildingModal) {
            editBuildingModal = new bootstrap.Modal(document.getElementById('editBuildingModal'));
        }
        editBuildingModal.show();
    }

    document.getElementById('saveEditBuildingBtn').addEventListener('click', function() {
        const code = document.getElementById('editBuildingCode').value;
        const name = document.getElementById('editBuildingName').value.trim();
        const floors = parseInt(document.getElementById('editBuildingFloors').value);
        const elevators = document.getElementById('editBuildingElevators').value.trim();
        const description = document.getElementById('editBuildingDesc').value.trim();

        if (!name || !floors || !elevators) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }

        const index = allBuildingsData.findIndex(b => b.code === code);
        if (index === -1) {
            showToast('Building not found', 'error');
            return;
        }

        allBuildingsData[index] = { ...allBuildingsData[index], name, floors, elevators, description };
        updateBuildingsData(allBuildingsData);
        
        if (editBuildingModal) editBuildingModal.hide();
        showToast(`✅ Building "${name}" updated successfully!`, 'success');
    });

    // ===== DELETE BUILDING =====
    function deleteBuilding(code) {
        const building = allBuildingsData.find(b => b.code === code);
        if (!building) {
            showToast('Building not found', 'error');
            return;
        }

        if (!confirm(`Are you sure you want to delete "${building.name}" (${code})?`)) return;

        allBuildingsData = allBuildingsData.filter(b => b.code !== code);
        updateBuildingsData(allBuildingsData);
        showToast(`✅ Building "${building.name}" deleted`, 'success');
    }

    // ===== REFRESH =====
    document.getElementById('refreshBtn').addEventListener('click', function() {
        loadBuildingsData();
        showToast('Buildings refreshed!', 'info');
    });

    // ===== INIT =====
    const isAdmin = checkAdminAccess();
    if (!isAdmin) {
        return;
    }
    
    console.log('[AnimoFlow] Admin Buildings CRUD initialized');
    loadBuildingsData();

});