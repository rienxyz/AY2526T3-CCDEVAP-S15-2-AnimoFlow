/**
 * AnimoFlow Reports Page - Partial/Progress Version
 * Core functionality: Submit reports, view recent reports, localStorage persistence
 * TODO for completion: Backend API integration, user session, admin features
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== DOM Elements ==========
    const reportForm = document.getElementById('reportForm');
    const buildingSelect = document.getElementById('buildingSelect');
    const elevatorNameInput = document.getElementById('elevatorName');
    const queueOptions = document.querySelectorAll('.queue-option');
    const queueLengthHidden = document.getElementById('queueLength');
    const submitBtn = document.getElementById('submitBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const reportsList = document.getElementById('reportsList');
    const emptyState = document.getElementById('emptyState');
    const queueError = document.getElementById('queueError');
    
    // Toast element
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
        return `${minutes} minutes ago`;
    }
    
    // ========== Queue Selection ==========
    queueOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all
            queueOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked
            this.classList.add('selected');
            // Set hidden value
            const queueValue = this.getAttribute('data-queue');
            queueLengthHidden.value = queueValue;
            // Clear error if exists
            queueError.classList.add('d-none');
        });
    });
    
    // ========== Load Reports from localStorage ==========
    async function loadReports() {
        try {
            const response = await fetch("http://localhost:3999/api/report");

            if (!response.ok) {
                throw new Error("Failed to fetch reports");
            }

            const reports = await response.json();
            const latestReportsMap = new Map();

            reports.forEach(report => {
                const key = `${report.building}|${report.elevator}`;

                if (
                    !latestReportsMap.has(key) ||
                    report.timestamp > latestReportsMap.get(key).timestamp
                ) {
                    latestReportsMap.set(key, report);
                }
            });

            const latestReports = Array.from(latestReportsMap.values());

            latestReports.sort((a, b) => b.timestamp - a.timestamp);

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
                    short: {
                        class: "short",
                        text: "🟢 Short"
                    },
                    medium: {
                        class: "medium",
                        text: "🟡 Medium"
                    },
                    long: {
                        class: "long",
                        text: "🔴 Long"
                    }
                };

                const badge = badges[report.queueLength] ?? {
                    class: "",
                    text: report.queueLength
                };

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
                            <span class="queue-badge ${badge.class}">
                                ${badge.text}
                            </span>
                        </div>
                    </div>
                `;
            });

            reportsList.innerHTML = html;

        } catch (err) {
            reportsList.innerHTML = `
                <div class="text-center p-5 text-danger">
                    Failed to load reports.
                </div>
            `;
        }
    }
    
    // Simple escape to prevent XSS
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // ========== Submit New Report ==========
    function submitReport(event) {
        event.preventDefault();
        
        // Validate building
        const building = buildingSelect.value;
        if (!building) {
            showToast('Please select a building', 'error');
            return;
        }
        
        // Validate elevator name
        const elevator = elevatorNameInput.value.trim();
        if (!elevator) {
            showToast('Please enter an elevator name/number', 'error');
            return;
        }
        
        // Validate queue length
        const queueLength = queueLengthHidden.value;
        if (!queueLength) {
            queueError.classList.remove('d-none');
            showToast('Please select a queue length', 'error');
            return;
        }
        
        // Create report object
        const newReport = {
            id: Date.now(),
            building: building,
            elevator: elevator,
            queueLength: queueLength,
            timestamp: Date.now(),
            userId: 'current_user' // TODO: Replace with actual logged-in user
        };
        
        // Save to MongoDB via API
        async function submitReport() {
            try {
                const response = await fetch("http://localhost:3999/api/report", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newReport)
                });

                const result = await response.json();
                console.log(result);
            } catch (err) {
                console.error(err);
            }
        }

        submitReport();
        
        // Show success message
        showToast('Report submitted! Thank you for helping the DLSU community.', 'success');
        
        // Reset form
        buildingSelect.value = '';
        elevatorNameInput.value = '';
        queueLengthHidden.value = '';
        queueOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Refresh the reports list
        loadReports();
    }
    
    // ========== Refresh Reports ==========
    function refreshReports() {
        loadReports();
        showToast('Reports refreshed!', 'info');
    }
    
    // ========== Event Listeners ==========
    if (reportForm) {
        reportForm.addEventListener('submit', submitReport);
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshReports);
    }
    
    // ========== Initial Load ==========
    loadReports();
    
    // Auto-refresh every 30 seconds (optional, good for demo)
    setInterval(loadReports, 30000);
    
    console.log('[AnimoFlow] Reports page initialized - Partial/Progress Version');
    console.log('[TODO] Backend API integration, user session, admin delete functionality');
});