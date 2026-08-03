/**
 * AnimoFlow - User Reports Page
 * 
 * Description: Allows users to submit elevator queue reports and view 
 *              recent reports from the last 30 minutes. Users can report
 *              queue lengths as Short, Medium, or Long.
 * 
 * Features:
 *   - Dynamic elevator dropdown based on building selection
 *   - Queue length selection (Short/Medium/Long)
 *   - Guest mode restrictions (view only)
 *   - Auto-refresh every 30 seconds
 *   - Toast notifications for user feedback
 * 
 * Building Data: 10 campus buildings with elevator configurations
 * API: GET /api/report, POST /api/report
 * Author: AnimoFlow Team
 * Date: August 2026
 */

const elevatorData = {
    "St. La Salle Hall": {
        elevators: ["LS-East-1", "LS-East-2", "LS-West-1", "LS-West-2"],
        hint: "2 elevators on each side (East/West)"
    },
    "Henry Sy Hall": {
        elevators: ["H-Ground-A", "H-Ground-B", "H-Ground-C", "H-6th-A", "H-6th-B"],
        hint: "3 at Ground floor, 2 at 6th floor"
    },
    "Yuchengco Hall": {
        elevators: ["Y-A", "Y-B", "Y-C"],
        hint: "3 elevators in one bay"
    },
    "St. Joseph Hall": {
        elevators: ["SJ-1"],
        hint: "1 elevator"
    },
    "Velasco Hall": {
        elevators: ["V-1"],
        hint: "1 elevator"
    },
    "St. Miguel Hall": {
        elevators: ["M-1"],
        hint: "1 elevator"
    },
    "Gokongwei Hall": {
        elevators: [],
        hint: "⚠️ No elevators available"
    },
    "STRC": {
        elevators: ["STRC-1"],
        hint: "1 elevator"
    },
    "Razon Sports Center": {
        elevators: ["R-A", "R-B", "R-C"],
        hint: "3 elevators in one bay"
    },
    "Andrew Gonzalez Hall": {
        elevators: ["A-Public-1", "A-Public-2", "A-Public-3", "A-Public-4", "A-Staff"],
        hint: "4 public elevators + 1 staff/faculty only"
    }
};

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
            window.location.href = '../login.html';
        });
    }

    updateNavUserEmail();
    
    // ========== DOM Elements ==========
    const reportForm = document.getElementById('reportForm');
    const buildingSelect = document.getElementById('buildingSelect');
    const elevatorSelect = document.getElementById('elevatorSelect');
    const elevatorHint = document.getElementById('elevatorHint');
    const queueOptions = document.querySelectorAll('.queue-option');
    const queueLengthHidden = document.getElementById('queueLength');
    const submitBtn = document.getElementById('submitBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const reportsList = document.getElementById('reportsList');
    const queueError = document.getElementById('queueError');
    const guestBanner = document.getElementById('guestBanner');
    
    const toastElement = document.getElementById('liveToast');
    let bsToast = null;
    
    if (toastElement) {
        bsToast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
    }
    
    // ========== DYNAMIC ELEVATOR DROPDOWN ==========
    function updateElevatorDropdown() {
        const selectedBuilding = buildingSelect.value;
        
        elevatorSelect.innerHTML = '';
        
        if (!selectedBuilding || !elevatorData[selectedBuilding]) {
            elevatorSelect.disabled = true;
            elevatorSelect.innerHTML = '<option value="">Select a building first</option>';
            elevatorHint.textContent = 'Select a building to see available elevators';
            return;
        }
        
        const buildingInfo = elevatorData[selectedBuilding];
        const elevators = buildingInfo.elevators;
        
        if (elevators.length === 0) {
            elevatorSelect.disabled = true;
            elevatorSelect.innerHTML = '<option value="">No elevators available</option>';
            elevatorHint.textContent = buildingInfo.hint;
            return;
        }
        
        elevatorSelect.disabled = false;
        elevatorSelect.innerHTML = '<option value="">Select an elevator</option>';
        elevators.forEach(elevator => {
            const option = document.createElement('option');
            option.value = elevator;
            option.textContent = elevator;
            elevatorSelect.appendChild(option);
        });
        
        elevatorHint.textContent = buildingInfo.hint;
    }
    
    buildingSelect.addEventListener('change', function() {
        updateElevatorDropdown();
        queueOptions.forEach(opt => opt.classList.remove('selected'));
        queueLengthHidden.value = '';
    });
    
    // ========== CHECK USER ROLE ==========
    function checkUserRole() {
        let userData = localStorage.getItem('animoflow_user');
        let isGuest = true;
        let userEmail = 'guest_user';
        
        if (userData) {
            try {
                const user = JSON.parse(userData);
                userEmail = user.email;
                isGuest = (userEmail === 'guest_user' || userEmail === 'guest' || user.role === 'guest');
            } catch (e) {
                isGuest = true;
            }
        }
        
        return { isGuest, userEmail };
    }
    
    // ========== APPLY GUEST RESTRICTIONS ==========
    function applyGuestRestrictions() {
        const { isGuest } = checkUserRole();
        
        if (isGuest) {
            if (guestBanner) guestBanner.style.display = 'block';
            if (buildingSelect) buildingSelect.disabled = true;
            if (elevatorSelect) elevatorSelect.disabled = true;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="bi bi-lock me-2"></i>Login to Submit';
                submitBtn.style.opacity = '0.6';
                submitBtn.style.cursor = 'not-allowed';
            }
            queueOptions.forEach(opt => {
                opt.style.opacity = '0.5';
                opt.style.cursor = 'not-allowed';
                opt.style.pointerEvents = 'none';
            });
            const formContainer = document.querySelector('.report-form-container');
            if (formContainer) {
                let existingMsg = formContainer.querySelector('.guest-form-message');
                if (!existingMsg) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'alert alert-warning mb-3 guest-form-message';
                    messageDiv.innerHTML = `
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        <strong>View-Only Mode:</strong> You are browsing as a guest. 
                        <a href="../login.html" class="alert-link">Login with your DLSU email</a> to submit reports.
                    `;
                    formContainer.prepend(messageDiv);
                }
            }
        } else {
            if (guestBanner) guestBanner.style.display = 'none';
            if (buildingSelect) buildingSelect.disabled = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Submit Report';
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
            queueOptions.forEach(opt => {
                opt.style.opacity = '1';
                opt.style.cursor = 'pointer';
                opt.style.pointerEvents = 'auto';
            });
            const formContainer = document.querySelector('.report-form-container');
            if (formContainer) {
                const msg = formContainer.querySelector('.guest-form-message');
                if (msg) msg.remove();
            }
            updateElevatorDropdown();
        }
    }
    
    // ========== Helper Functions ==========
    function showToast(message, type = 'info') {
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
    }
    
    function formatTimeAgo(timestamp) {
        const minutes = Math.floor((Date.now() - timestamp) / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes === 1) return '1 minute ago';
        return `${minutes} minutes ago`;
    }
    
    // ========== Queue Selection ==========
    queueOptions.forEach(option => {
        option.addEventListener('click', function() {
            const { isGuest } = checkUserRole();
            if (isGuest) {
                showToast('Please login to submit reports', 'warning');
                return;
            }
            queueOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            const queueValue = this.getAttribute('data-queue');
            queueLengthHidden.value = queueValue;
            queueError.classList.add('d-none');
        });
    });
    
    // ========== Load Reports ==========
    async function loadReports() {
        try {
            const response = await fetch("http://localhost:60136/api/report");
            if (!response.ok) throw new Error("Failed to fetch reports");
            const reports = await response.json();
            const latestReportsMap = new Map();
            reports.forEach(report => {
                const key = `${report.building}|${report.elevator}`;
                if (!latestReportsMap.has(key) || report.timestamp > latestReportsMap.get(key).timestamp) {
                    latestReportsMap.set(key, report);
                }
            });
            const latestReports = Array.from(latestReportsMap.values()).sort((a, b) => b.timestamp - a.timestamp);
            if (latestReports.length === 0) {
                reportsList.innerHTML = `
                    <div id="emptyState" class="text-center p-5 text-muted">
                        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                        <p class="mt-2">No recent reports. Be the first to submit!</p>
                    </div>
                `;
                return;
            }
            let html = "";
            latestReports.forEach(report => {
                const badges = {
                    short: { class: "short", text: "🟢 Short" },
                    medium: { class: "medium", text: "🟡 Medium" },
                    long: { class: "long", text: "🔴 Long" }
                };
                const badge = badges[report.queueLength] ?? { class: "", text: report.queueLength };
                html += `
                    <div class="report-card">
                        <div class="report-header">
                            <span class="report-building">${escapeHtml(report.building)}</span>
                            <span class="report-time">${formatTimeAgo(report.timestamp)}</span>
                        </div>
                        <div class="report-elevator">
                            <i class="bi bi-elevator"></i>${escapeHtml(report.elevator)}
                        </div>
                        <div>
                            <span class="queue-badge ${badge.class}">${badge.text}</span>
                        </div>
                    </div>
                `;
            });
            reportsList.innerHTML = html;
        } catch (err) {
            reportsList.innerHTML = `
                <div class="text-center p-5 text-danger">
                    Failed to load reports. Make sure the server is running.
                </div>
            `;
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
    
    // ========== Submit Report ==========
    function submitReport(event) {
        event.preventDefault();
        const { isGuest, userEmail } = checkUserRole();
        if (isGuest) {
            showToast('Guest users cannot submit reports. Please login with your DLSU email.', 'warning');
            return;
        }
        const building = buildingSelect.value;
        if (!building) { showToast('Please select a building', 'error'); return; }
        const elevator = elevatorSelect.value;
        if (!elevator) { showToast('Please select an elevator', 'error'); return; }
        const queueLength = queueLengthHidden.value;
        if (!queueLength) { queueError.classList.remove('d-none'); showToast('Please select a queue length', 'error'); return; }
        
        const newReport = { building, elevator, queueLength, userId: userEmail };
        
        async function submitToAPI() {
            try {
                const response = await fetch("http://localhost:60136/api/report", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newReport)
                });
                const result = await response.json();
                if (response.ok) {
                    showToast('✅ Report submitted! Thank you for helping the DLSU community.', 'success');
                    buildingSelect.value = '';
                    elevatorSelect.innerHTML = '<option value="">Select a building first</option>';
                    elevatorSelect.disabled = true;
                    elevatorHint.textContent = 'Select a building to see available elevators';
                    queueLengthHidden.value = '';
                    queueOptions.forEach(opt => opt.classList.remove('selected'));
                    loadReports();
                } else {
                    showToast('❌ ' + (result.error || 'Failed to submit report'), 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('❌ Server error. Make sure the backend is running.', 'error');
            }
        }
        submitToAPI();
    }
    
    function refreshReports() {
        loadReports();
        showToast('Reports refreshed!', 'info');
    }
    
    // ========== Event Listeners ==========
    if (reportForm) reportForm.addEventListener('submit', submitReport);
    if (refreshBtn) refreshBtn.addEventListener('click', refreshReports);
    
    // ========== Initial Load ==========
    applyGuestRestrictions();
    loadReports();
    setInterval(loadReports, 30000);
    
    window.addEventListener('storage', function(e) {
        if (e.key === 'animoflow_user') {
            applyGuestRestrictions();
            loadReports();
        }
    });
    
    console.log('[AnimoFlow] Reports page initialized with dynamic elevator dropdown');
});