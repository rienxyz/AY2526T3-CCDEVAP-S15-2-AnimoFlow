import "./queuetracker-style.css";

export default function QueueTracker() {
  return (
    <>
      {/* Main Container */}
      <div className="building-overview" id="buildingOverview">
        {/* Gokongwei Hall */}
        <div className="building-card" data-building="Gokongwei Hall">
          <div className="building-name">Gokongwei Hall</div>

          <div className="building-status" id="status-gokongwei">
            <span className="status-dot status-unknown"></span>
            <span className="status-text">No reports</span>
          </div>

          <div className="building-elevators">
            <span className="elevator-count">
              <i className="bi bi-elevator"></i> 0 active
            </span>
          </div>
        </div>

        {/* Henry Sy Hall */}
        <div className="building-card" data-building="Henry Sy Hall">
          <div className="building-name">Henry Sy Hall</div>

          <div className="building-status" id="status-henrysy">
            <span className="status-dot status-unknown"></span>
            <span className="status-text">No reports</span>
          </div>

          <div className="building-elevators">
            <span className="elevator-count">
              <i className="bi bi-elevator"></i> 0 active
            </span>
          </div>
        </div>

        {/* Velasco Hall */}
        <div className="building-card" data-building="Velasco Hall">
          <div className="building-name">Velasco Hall</div>

          <div className="building-status" id="status-velasco">
            <span className="status-dot status-unknown"></span>
            <span className="status-text">No reports</span>
          </div>

          <div className="building-elevators">
            <span className="elevator-count">
              <i className="bi bi-elevator"></i> 0 active
            </span>
          </div>
        </div>

        {/* St. Joseph Hall */}
        <div className="building-card" data-building="St. Joseph Hall">
          <div className="building-name">St. Joseph Hall</div>

          <div className="building-status" id="status-stjoseph">
            <span className="status-dot status-unknown"></span>
            <span className="status-text">No reports</span>
          </div>

          <div className="building-elevators">
            <span className="elevator-count">
              <i className="bi bi-elevator"></i> 0 active
            </span>
          </div>
        </div>

        {/* St. Miguel Hall */}
        <div className="building-card" data-building="St. Miguel Hall">
          <div className="building-name">St. Miguel Hall</div>

          <div className="building-status" id="status-stmiguel">
            <span className="status-dot status-unknown"></span>
            <span className="status-text">No reports</span>
          </div>

          <div className="building-elevators">
            <span className="elevator-count">
              <i className="bi bi-elevator"></i> 0 active
            </span>
          </div>
        </div>

        {/* Enrique Razon Hall */}
        <div className="building-card" data-building="Enrique Razon Hall">
          <div className="building-name">Enrique Razon Hall</div>

          <div className="building-status" id="status-enriquerazon">
            <span className="status-dot status-unknown"></span>
            <span className="status-text">No reports</span>
          </div>

          <div className="building-elevators">
            <span className="elevator-count">
              <i className="bi bi-elevator"></i> 0 active
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Queue List */}
      <div className="row">
        <div className="col-12">
          <div className="card-custom">
            <div className="card-header-custom d-flex justify-content-between align-items-center">
              <span>
                <i className="bi bi-list-ul me-2"></i>
                All Active Queues
              </span>

              <div>
                <button className="btn-refresh me-2" id="refreshTrackerBtn">
                  <i className="bi bi-arrow-repeat"></i> Refresh
                </button>

                <button className="btn-filter" id="filterBtn">
                  <i className="bi bi-funnel"></i> Filter
                </button>
              </div>
            </div>

            <div className="queue-table-container">
              <table className="queue-table" id="queueTable">
                <thead>
                  <tr>
                    <th>Building</th>
                    <th>Elevator</th>
                    <th>Queue Status</th>
                    <th>Reported</th>
                  </tr>
                </thead>

                <tbody id="queueTableBody">
                  {/* Rows inserted dynamically */}
                </tbody>
              </table>

              <div
                className="text-center p-5 text-muted"
                id="emptyQueueTable"
              >
                <i
                  className="bi bi-inbox"
                  style={{ fontSize: "2.5rem" }}
                ></i>

                <p className="mt-2">
                  No active queues. Reports will appear here when submitted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="row mt-2">
        <div className="col-12">
          <div className="card-custom">
            <div className="card-header-custom">
              <i className="bi bi-info-circle me-2"></i>
              Queue Status Legend
            </div>

            <div className="legend-container">
              <div className="legend-item">
                <span className="status-dot status-short"></span>
                <span>
                  <strong>Short</strong> · 0-5 people · &lt;2 min wait
                </span>
              </div>

              <div className="legend-item">
                <span className="status-dot status-medium"></span>
                <span>
                  <strong>Medium</strong> · 6-10 people · 2-5 min wait
                </span>
              </div>

              <div className="legend-item">
                <span className="status-dot status-long"></span>
                <span>
                  <strong>Long</strong> · 11+ people · &gt;5 min wait
                </span>
              </div>

              <div className="legend-item">
                <span className="status-dot status-unknown"></span>
                <span>
                  <strong>No Data</strong> · No recent reports
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1100 }}
      >
        <div
          id="liveToast"
          className="toast align-items-center border-0"
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body" id="toastMessage">
              Notification message
            </div>

            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
            ></button>
          </div>
        </div>
      </div>
    </>
  );
}