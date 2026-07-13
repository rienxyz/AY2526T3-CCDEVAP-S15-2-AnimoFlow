/**
 * AnimoFlow Queue Tracker Page - Partial/Progress Version
 * Displays real-time elevator queue status across all DLSU buildings
 * TODO for completion: Backend API integration, WebSocket for real-time updates
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== DOM Elements ==========
    const queueTableBody = document.getElementById('queueTableBody');
    const emptyQueueTable = document.getElementById('emptyQueueTable');
    const refreshBtn = document.getElementById('refreshTrackerBtn');
    const filterBtn = document.getElementById('filterBtn');
    const buildingCards = document.querySelectorAll('.building-card');
    
    // Toast
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
        
        toastElement.classList.remove('bg-success', 'bg-danger', 'bg-primary');
        if (type === 'success') {
            toastElement.style.background = '#006837';
        } else if (type === 'error') {
            toastElement.style.background = '#dc3545';
        } else {
            toastElement.style.background = '#006837';
        }
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
    
    // ========== Get Queue Status ==========
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
            
            // Group by elevator to show latest only
            const latestReportsMap = new Map();
            activeReports.forEach(report => {
                const key = `${report.building}|${report.elevator}`;
                if (!latestReportsMap.has(key) || report.timestamp > latestReportsMap.get(key).timestamp) {
                    latestReportsMap.set(key, report);
                }
            });
            
            const latestReports = Array.from(latestReportsMap.values());
            // Sort by timestamp descending (newest first)
            latestReports.sort((a, b) => b.timestamp - a.timestamp);
            
            // Update building overview cards
            updateBuildingCards(latestReports);
            
            // Update queue table
            updateQueueTable(latestReports);
        } catch(err) {
            console.error(err);
        }
    }
    
    // ========== Update Building Cards ==========
    function updateBuildingCards(reports) {
        // Group reports by building
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
            
            // Find the worst queue status for this building (highest severity)
            // Order: long > medium > short
            let worstStatus = 'unknown';
            let worstLabel = 'No reports';
            let elevatorCount = reportsForBuilding.length;
            
            if (reportsForBuilding.length > 0) {
                // Check if any long reports exist
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
            
            // Update status
            const statusDiv = card.querySelector('.building-status');
            if (statusDiv) {
                const dot = statusDiv.querySelector('.status-dot');
                const text = statusDiv.querySelector('.status-text');
                
                // Remove all status classes
                dot.classList.remove('status-short', 'status-medium', 'status-long', 'status-unknown');
                dot.classList.add(`status-${worstStatus}`);
                
                if (worstStatus === 'unknown') {
                    text.textContent = 'No reports';
                } else {
                    text.textContent = `${worstLabel} traffic`;
                }
            }
            
            // Update elevator count
            const countSpan = card.querySelector('.elevator-count');
            if (countSpan) {
                countSpan.innerHTML = `<i class="bi bi-elevator"></i> ${elevatorCount} active`;
            }
        });
    }
    
    // ========== Update Queue Table ==========
    function updateQueueTable(reports) {
        // Clear existing rows
        queueTableBody.innerHTML = '';
        
        if (reports.length === 0) {
            // Show empty state
            emptyQueueTable.style.display = 'block';
            return;
        }
        
        // Hide empty state
        emptyQueueTable.style.display = 'none';
        
        // Build table rows
        reports.forEach(report => {
            const status = getQueueStatus(report.queueLength);
            const tr = document.createElement('tr');
            
            // For responsive design - add data-label attributes
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
    
    // ========== Refresh ==========
    function refreshQueueData() {
        loadQueueData();
        showToast('Queue data refreshed!', 'info');
    }
    
    // ========== Filter Dropdown Toggle ==========
    function toggleFilter() {
        let filterDropdown = document.getElementById('filterDropdown');
        
        if (!filterDropdown) {
            // Create filter dropdown if it doesn't exist
            filterDropdown = document.createElement('div');
            filterDropdown.id = 'filterDropdown';
            filterDropdown.className = 'filter-dropdown';
            
            const cardHeader = document.querySelector('.card-header-custom');
            const tableContainer = document.querySelector('.queue-table-container');
            
            if (cardHeader && tableContainer) {
                cardHeader.parentNode.insertBefore(filterDropdown, tableContainer);
                
                filterDropdown.innerHTML = `
                    <div class="filter-group">
                        <label style="font-size:0.85rem; font-weight:500; color:#006837;">Filter by:</label>
                        <select id="filterBuilding">
                            <option value="all">All Buildings</option>
                            <option value="Gokongwei Hall">Gokongwei Hall</option>
                            <option value="Henry Sy Hall">Henry Sy Hall</option>
                            <option value="Velasco Hall">Velasco Hall</option>
                            <option value="St. Joseph Hall">St. Joseph Hall</option>
                            <option value="St. Miguel Hall">Brother Kenneth Hall</option>
                            <option value="Enrique Razon">Enrique Razon</option>
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
                
                // Add event listeners for filter
                document.getElementById('applyFilterBtn').addEventListener('click', applyFilter);
                document.getElementById('clearFilterBtn').addEventListener('click', clearFilter);
            }
        }
        
        // Toggle visibility
        filterDropdown.classList.toggle('show');
    }
    
    // ========== Apply Filter ==========
    async function applyFilter() {
        try {
            const buildingFilter = document.getElementById('filterBuilding').value;
            const statusFilter = document.getElementById('filterStatus').value;

            const response = await fetch("http://localhost:3999/api/report");
            let filtered = await response.json();
            
            // Apply building filter
            if (buildingFilter !== 'all') {
                filtered = filtered.filter(r => r.building === buildingFilter);
            }
            
            // Apply status filter
            if (statusFilter !== 'all') {
                filtered = filtered.filter(r => r.queueLength === statusFilter);
            }
            
            // Group by elevator to show latest only
            const latestReportsMap = new Map();
            filtered.forEach(report => {
                const key = `${report.building}|${report.elevator}`;
                if (!latestReportsMap.has(key) || report.timestamp > latestReportsMap.get(key).timestamp) {
                    latestReportsMap.set(key, report);
                }
            });
            
            const latestReports = Array.from(latestReportsMap.values());
            latestReports.sort((a, b) => b.timestamp - a.timestamp);
            
            // Update building cards (showing filtered data)
            updateBuildingCards(latestReports);
            
            // Update table
            updateQueueTable(latestReports);
            
            // Close filter dropdown
            const dropdown = document.getElementById('filterDropdown');
            if (dropdown) dropdown.classList.remove('show');
            
            showToast('Filter applied!', 'info');
        } catch(err) {
            console.error(err);
        }
    }
    
    // ========== Clear Filter ==========
    function clearFilter() {
        // Reset filter dropdowns
        const buildingFilter = document.getElementById('filterBuilding');
        const statusFilter = document.getElementById('filterStatus');
        if (buildingFilter) buildingFilter.value = 'all';
        if (statusFilter) statusFilter.value = 'all';
        
        // Reload full data
        loadQueueData();
        
        // Close filter dropdown
        const dropdown = document.getElementById('filterDropdown');
        if (dropdown) dropdown.classList.remove('show');
        
        showToast('Filters cleared', 'info');
    }
    
    // ========== Building Card Click - Filter by Building ==========
    function handleBuildingCardClick(event) {
        const card = event.currentTarget;
        const buildingName = card.getAttribute('data-building');
        
        // Toggle filter dropdown visibility
        let filterDropdown = document.getElementById('filterDropdown');
        if (!filterDropdown) {
            toggleFilter();
            filterDropdown = document.getElementById('filterDropdown');
        }
        
        if (filterDropdown) {
            const buildingSelect = document.getElementById('filterBuilding');
            if (buildingSelect) {
                buildingSelect.value = buildingName;
                // Auto-apply filter
                setTimeout(() => {
                    applyFilter();
                }, 100);
            }
        }
    }
    
    // ========== Auto-Refresh ==========
    let autoRefreshInterval = null;
    
    function startAutoRefresh() {
        const autoPref = localStorage.getItem('animoflow_auto_refresh');
        if (autoPref === 'true' || autoPref === null) {
            if (autoRefreshInterval) clearInterval(autoRefreshInterval);
            autoRefreshInterval = setInterval(() => {
                loadQueueData();
            }, 30000); // Refresh every 30 seconds
        }
    }
    
    function stopAutoRefresh() {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
        }
    }
    
    // Listen for auto-refresh preference changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'animoflow_auto_refresh') {
            if (e.newValue === 'true') {
                startAutoRefresh();
            } else {
                stopAutoRefresh();
            }
        }
    });
    
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
    
    // ========== Initial Load ==========
    loadQueueData();
    startAutoRefresh();
    
    console.log('[AnimoFlow] Queue Tracker page initialized - Partial/Progress Version');
    console.log('[TODO] WebSocket real-time updates, backend API integration, historical data');
});