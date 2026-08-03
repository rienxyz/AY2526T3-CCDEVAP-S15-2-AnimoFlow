/**
 * AnimoFlow - Queue Tracker Page
 * 
 * Description: Real-time overview of elevator queue status across all 
 *              10 campus buildings. Displays building cards with traffic 
 *              indicators and a detailed queue table.
 * 
 * Features:
 *   - Building cards with status indicators (🟢 Light, 🟡 Moderate, 🔴 Heavy)
 *   - Queue table with timestamps
 *   - Filter by building or queue status
 *   - Click building card to filter
 *   - Auto-refresh every 30 seconds
 * 
 * Buildings: All 10 DLSU campus buildings
 * API: GET /api/report
 * Author: AnimoFlow Team
 * Date: August 2026
 */

// ===== ALL BUILDINGS LIST =====
const ALL_BUILDINGS = [
    "St. La Salle Hall",
    "Henry Sy Hall",
    "Yuchengco Hall",
    "St. Joseph Hall",
    "Velasco Hall",
    "St. Miguel Hall",
    "Gokongwei Hall",
    "STRC",
    "Razon Sports Center",
    "Andrew Gonzalez Hall"
];

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
    }

    const savedTheme = localStorage.getItem('animoflow_darkmode');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
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
            window.location.href = 'login-index.html';
        });
    }

    updateNavUserEmail();
    
    // ========== DOM Elements ==========
    const queueTableBody = document.getElementById('queueTableBody');
    const emptyQueueTable = document.getElementById('emptyQueueTable');
    const refreshBtn = document.getElementById('refreshTrackerBtn');
    const filterBtn = document.getElementById('filterBtn');
    const buildingCards = document.querySelectorAll('.building-card');
    const backBtn = document.getElementById('backToDashboardBtn');
    
    // ===== BACK TO DASHBOARD =====
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'dashboard-index.html';
        });
    }
    
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
    
    function getQueueStatus(queueLength) {
        switch(queueLength) {
            case 'short': return { label: 'Short', class: 'short', emoji: '🟢' };
            case 'medium': return { label: 'Medium', class: 'medium', emoji: '🟡' };
            case 'long': return { label: 'Long', class: 'long', emoji: '🔴' };
            default: return { label: 'Unknown', class: 'unknown', emoji: '⚪' };
        }
    }
    
    // ========== Load Queue Data ==========
    async function loadQueueData() {
        try {
            const response = await fetch("http://localhost:3999/api/report");
            const activeReports = await response.json();
            
            const latestReportsMap = new Map();
            activeReports.forEach(report => {
                const key = `${report.building}|${report.elevator}`;
                if (!latestReportsMap.has(key) || report.timestamp > latestReportsMap.get(key).timestamp) {
                    latestReportsMap.set(key, report);
                }
            });
            
            const latestReports = Array.from(latestReportsMap.values());
            latestReports.sort((a, b) => b.timestamp - a.timestamp);
            
            updateBuildingCards(latestReports);
            updateQueueTable(latestReports);
        } catch(err) {
            console.error(err);
        }
    }
    
    // ========== Update Building Cards ==========
    function updateBuildingCards(reports) {
        const buildingMap = new Map();
        reports.forEach(report => {
            if (!buildingMap.has(report.building)) {
                buildingMap.set(report.building, []);
            }
            buildingMap.get(report.building).push(report);
        });
        
        buildingCards.forEach(card => {
            const buildingName = card.getAttribute('data-building');
            const reportsForBuilding = buildingMap.get(buildingName) || [];
            
            let worstStatus = 'unknown';
            let worstLabel = 'No reports';
            let elevatorCount = reportsForBuilding.length;
            
            if (reportsForBuilding.length > 0) {
                const hasLong = reportsForBuilding.some(r => r.queueLength === 'long');
                const hasMedium = reportsForBuilding.some(r => r.queueLength === 'medium');
                const hasShort = reportsForBuilding.some(r => r.queueLength === 'short');
                
                if (hasLong) {
                    worstStatus = 'long';
                    worstLabel = 'Heavy';
                } else if (hasMedium) {
                    worstStatus = 'medium';
                    worstLabel = 'Moderate';
                } else if (hasShort) {
                    worstStatus = 'short';
                    worstLabel = 'Light';
                }
            }
            
            const statusDiv = card.querySelector('.building-status');
            if (statusDiv) {
                const dot = statusDiv.querySelector('.status-dot');
                const text = statusDiv.querySelector('.status-text');
                
                dot.classList.remove('status-short', 'status-medium', 'status-long', 'status-unknown');
                dot.classList.add(`status-${worstStatus}`);
                
                if (worstStatus === 'unknown') {
                    text.textContent = 'No reports';
                } else {
                    text.textContent = `${worstLabel} traffic`;
                }
            }
            
            const countSpan = card.querySelector('.elevator-count');
            if (countSpan) {
                countSpan.innerHTML = `<i class="bi bi-elevator"></i> ${elevatorCount} active`;
            }
        });
    }
    
    // ========== Update Queue Table ==========
    function updateQueueTable(reports) {
        queueTableBody.innerHTML = '';
        
        if (reports.length === 0) {
            emptyQueueTable.style.display = 'block';
            return;
        }
        
        emptyQueueTable.style.display = 'none';
        
        reports.forEach(report => {
            const status = getQueueStatus(report.queueLength);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td data-label="Building">${escapeHtml(report.building)}</td>
                <td data-label="Elevator">${escapeHtml(report.elevator)}</td>
                <td data-label="Queue Status">
                    <span class="queue-badge ${status.class}">${status.emoji} ${status.label}</span>
                </td>
                <td data-label="Reported">${formatTimeAgo(report.timestamp)}</td>
            `;
            queueTableBody.appendChild(tr);
        });
    }
    
    function refreshQueueData() {
        loadQueueData();
        showToast('Queue data refreshed!', 'info');
    }
    
    // ========== Filter ==========
    function toggleFilter() {
        let filterDropdown = document.getElementById('filterDropdown');
        if (!filterDropdown) {
            filterDropdown = document.createElement('div');
            filterDropdown.id = 'filterDropdown';
            filterDropdown.className = 'filter-dropdown';
            const cardHeader = document.querySelector('.card-header-custom');
            const tableContainer = document.querySelector('.queue-table-container');
            if (cardHeader && tableContainer) {
                cardHeader.parentNode.insertBefore(filterDropdown, tableContainer);
                
                let buildingOptions = '<option value="all">All Buildings</option>';
                ALL_BUILDINGS.forEach(building => {
                    buildingOptions += `<option value="${building}">${building}</option>`;
                });
                
                filterDropdown.innerHTML = `
                    <div class="filter-group">
                        <label style="font-size:0.85rem; font-weight:500; color:#006837;">Filter by:</label>
                        <select id="filterBuilding">
                            ${buildingOptions}
                        </select>
                        <select id="filterStatus">
                            <option value="all">All Status</option>
                            <option value="short">Short</option>
                            <option value="medium">Medium</option>
                            <option value="long">Long</option>
                        </select>
                        <button class="btn-apply-filter" id="applyFilterBtn">Apply</button>
                        <button class="btn-clear-filter" id="clearFilterBtn">Clear</button>
                    </div>
                `;
                document.getElementById('applyFilterBtn').addEventListener('click', applyFilter);
                document.getElementById('clearFilterBtn').addEventListener('click', clearFilter);
            }
        }
        filterDropdown.classList.toggle('show');
    }
    
    async function applyFilter() {
        try {
            const buildingFilter = document.getElementById('filterBuilding').value;
            const statusFilter = document.getElementById('filterStatus').value;

            const response = await fetch("http://localhost:3999/api/report");
            let filtered = await response.json();
            
            if (buildingFilter !== 'all') {
                filtered = filtered.filter(r => r.building === buildingFilter);
            }
            if (statusFilter !== 'all') {
                filtered = filtered.filter(r => r.queueLength === statusFilter);
            }
            
            const latestReportsMap = new Map();
            filtered.forEach(report => {
                const key = `${report.building}|${report.elevator}`;
                if (!latestReportsMap.has(key) || report.timestamp > latestReportsMap.get(key).timestamp) {
                    latestReportsMap.set(key, report);
                }
            });
            
            const latestReports = Array.from(latestReportsMap.values());
            latestReports.sort((a, b) => b.timestamp - a.timestamp);
            
            updateBuildingCards(latestReports);
            updateQueueTable(latestReports);
            
            const dropdown = document.getElementById('filterDropdown');
            if (dropdown) dropdown.classList.remove('show');
            showToast('Filter applied!', 'info');
        } catch(err) {
            console.error(err);
        }
    }
    
    function clearFilter() {
        const buildingFilter = document.getElementById('filterBuilding');
        const statusFilter = document.getElementById('filterStatus');
        if (buildingFilter) buildingFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'all';
        loadQueueData();
        const dropdown = document.getElementById('filterDropdown');
        if (dropdown) dropdown.classList.remove('show');
        showToast('Filters cleared', 'info');
    }
    
    function handleBuildingCardClick(event) {
        const card = event.currentTarget;
        const buildingName = card.getAttribute('data-building');
        let filterDropdown = document.getElementById('filterDropdown');
        if (!filterDropdown) {
            toggleFilter();
            filterDropdown = document.getElementById('filterDropdown');
        }
        if (filterDropdown) {
            const buildingSelect = document.getElementById('filterBuilding');
            if (buildingSelect) {
                buildingSelect.value = buildingName;
                setTimeout(() => {
                    applyFilter();
                }, 100);
            }
        }
    }
    
    // ========== Event Listeners ==========
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshQueueData);
    }
    if (filterBtn) {
        filterBtn.addEventListener('click', toggleFilter);
    }
    
    buildingCards.forEach(card => {
        card.addEventListener('click', handleBuildingCardClick);
    });
    
    // ========== Auto-Refresh ==========
    let autoRefreshInterval = null;
    function startAutoRefresh() {
        const autoPref = localStorage.getItem('animoflow_auto_refresh');
        if (autoPref === 'true' || autoPref === null) {
            if (autoRefreshInterval) clearInterval(autoRefreshInterval);
            autoRefreshInterval = setInterval(() => {
                loadQueueData();
            }, 30000);
        }
    }
    startAutoRefresh();
    
    // ========== Initial Load ==========
    loadQueueData();
    console.log('[AnimoFlow] Queue Tracker page initialized with all 10 buildings');
});