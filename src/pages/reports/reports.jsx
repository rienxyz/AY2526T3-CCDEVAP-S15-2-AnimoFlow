import "./reports-style.css";

export default function Reports() {
  return (
    <>
      <div className="main-container">
        {/* Page Header */}
        <div className="page-header">
          <h1>
            <i className="bi bi-file-text me-2"></i>
            Elevator Queue Reports
          </h1>
          <p>
            Report elevator queue lengths in near real-time. Your input helps
            the DLSU community plan their routes efficiently.
          </p>
        </div>

        <div className="row">
          {/* LEFT COLUMN */}
          <div className="col-lg-5">
            <div className="card-custom">
              <div className="card-header-custom">
                <i className="bi bi-plus-circle me-2"></i>
                Submit New Report
              </div>

              <div className="report-form-container">
                <form id="reportForm">
                  {/* Building */}
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-building me-1"></i>
                      Building
                    </label>

                    <select
                      className="form-select"
                      id="buildingSelect"
                      required
                    >
                      <option value="">Select Building</option>
                      <option value="Gokongwei Hall">Gokongwei Hall</option>
                      <option value="Henry Sy Hall">Henry Sy Hall</option>
                      <option value="Velasco Hall">Velasco Hall</option>
                      <option value="St. Joseph Hall">St. Joseph Hall</option>
                      <option value="St. Miguel Hall">St. Miguel Hall</option>
                      <option value="Enrique Razon">Enrique Razon</option>
                    </select>
                  </div>

                  {/* Elevator */}
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-elevator me-1"></i>
                      Elevator Name/Number
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="elevatorName"
                      placeholder="e.g., Elevator A, North Elevator, E1"
                      required
                    />
                  </div>

                  {/* Queue Length */}
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-people-fill me-1"></i>
                      Queue Length
                    </label>

                    <div className="queue-buttons">
                      <div
                        className="queue-option"
                        data-queue="short"
                      >
                        <div className="queue-label">🟢 Short</div>
                        <div className="queue-desc">
                          0-5 people · &lt;2 min wait
                        </div>
                      </div>

                      <div
                        className="queue-option"
                        data-queue="medium"
                      >
                        <div className="queue-label">🟡 Medium</div>
                        <div className="queue-desc">
                          6-10 people · 2-5 min wait
                        </div>
                      </div>

                      <div
                        className="queue-option"
                        data-queue="long"
                      >
                        <div className="queue-label">🔴 Long</div>
                        <div className="queue-desc">
                          11+ people · &gt;5 min wait
                        </div>
                      </div>
                    </div>

                    <input
                      type="hidden"
                      id="queueLength"
                      value=""
                    />

                    <div
                      id="queueError"
                      className="invalid-feedback d-none"
                    >
                      Please select a queue length
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-submit w-100"
                    id="submitBtn"
                  >
                    <i className="bi bi-send me-2"></i>
                    Submit Report
                  </button>
                </form>
              </div>
            </div>

            {/* Info Card */}
            <div className="card-custom">
              <div className="card-header-custom">
                <i className="bi bi-info-circle me-2"></i>
                How It Works
              </div>

              <div className="p-3">
                <p className="small text-muted mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Reports are visible for 30 minutes
                </p>

                <p className="small text-muted mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Latest report for each elevator is shown
                </p>

                <p className="small text-muted mb-0">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Admins can remove inaccurate reports
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-lg-7">
            <div className="card-custom">
              <div className="card-header-custom d-flex justify-content-between align-items-center">
                <span>
                  <i className="bi bi-clock-history me-2"></i>
                  Recent Reports (Last 30 mins)
                </span>

                <button
                  className="btn-refresh"
                  id="refreshBtn"
                  type="button"
                >
                  <i className="bi bi-arrow-repeat"></i> Refresh
                </button>
              </div>

              <div
                className="reports-list-container"
                id="reportsList"
              >
                <div
                  className="text-center p-5 text-muted"
                  id="emptyState"
                >
                  <i
                    className="bi bi-inbox"
                    style={{ fontSize: "3rem" }}
                  ></i>

                  <p className="mt-2">
                    No recent reports. Be the first to submit!
                  </p>
                </div>
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
            <div
              className="toast-body"
              id="toastMessage"
            >
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