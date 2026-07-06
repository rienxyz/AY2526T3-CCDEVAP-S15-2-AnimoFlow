import "./profile-style.css";

export default function Profile({ setPage }) {
  return (
    <>
      {/* Main Container */}
      <div className="main-container">
        {/* Page Header */}
        <div className="page-header">
          <h1>
            <i className="bi bi-person me-2"></i>
            My Profile
          </h1>
          <p>
            Manage your account details and view your contribution history.
          </p>
        </div>

        <div className="row">
          {/* LEFT COLUMN: Profile Information */}
          <div className="col-lg-4">
            {/* Profile Card */}
            <div className="card-custom profile-card">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">
                  <i className="bi bi-person-fill"></i>
                </div>

                <div className="profile-name" id="profileName">
                  Juan Dela Cruz
                </div>

                <div className="profile-email" id="profileEmail">
                  juan.delacruz@dlsu.edu.ph
                </div>

                <span className="badge-role" id="profileRole">
                  Student
                </span>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <div className="stat-number" id="totalReports">
                    0
                  </div>
                  <div className="stat-label">Total Reports</div>
                </div>

                <div className="stat-item">
                  <div className="stat-number" id="activeReports">
                    0
                  </div>
                  <div className="stat-label">Active Reports</div>
                </div>

                <div className="stat-item">
                  <div className="stat-number" id="memberSince">
                    --
                  </div>
                  <div className="stat-label">Member Since</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-custom">
              <div className="card-header-custom">
                <i className="bi bi-lightning-fill me-2"></i>
                Quick Actions
              </div>

              <div className="p-3">
                <button 
                  className="btn btn-action w-100 mb-2"
                  onClick={() => setPage("Reports")}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Submit a Report
                </button>

                <button 
                  className="btn btn-action w-100 mb-2"
                  onClick={() => setPage("FindYourRoom")}
                >
                  <i className="bi bi-search me-2"></i>
                  Find a Classroom
                </button>

                <button className="btn btn-action w-100">
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Recent Activity */}
          <div className="col-lg-8">
            <div className="card-custom">
              <div className="card-header-custom d-flex justify-content-between align-items-center">
                <span>
                  <i className="bi bi-clock-history me-2"></i>
                  Recent Activity
                </span>

                <button
                  className="btn-refresh"
                  id="refreshActivityBtn"
                  type="button"
                >
                  <i className="bi bi-arrow-repeat"></i> Refresh
                </button>
              </div>

              <div className="activity-list" id="activityList">
                <div
                  className="text-center p-5 text-muted"
                  id="emptyActivity"
                >
                  <i
                    className="bi bi-inbox"
                    style={{ fontSize: "2.5rem" }}
                  ></i>

                  <p className="mt-2">
                    No recent activity yet. Start by submitting a report!
                  </p>
                </div>
              </div>
            </div>

            {/* Preferences Card */}
            <div className="card-custom">
              <div className="card-header-custom">
                <i className="bi bi-sliders2 me-2"></i>
                Preferences
              </div>

              <div className="preferences-container">
                <div className="pref-item">
                  <div>
                    <div className="pref-label">Dark Mode</div>
                    <div className="pref-desc">
                      Toggle dark/light theme
                    </div>
                  </div>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="darkModeToggle"
                    />
                  </div>
                </div>

                <div className="pref-item">
                  <div>
                    <div className="pref-label">
                      Email Notifications
                    </div>
                    <div className="pref-desc">
                      Receive updates about your reports
                    </div>
                  </div>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="emailToggle"
                      defaultChecked
                    />
                  </div>
                </div>

                <div className="pref-item">
                  <div>
                    <div className="pref-label">
                      Auto-Refresh Dashboard
                    </div>
                    <div className="pref-desc">
                      Automatically refresh report data
                    </div>
                  </div>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="autoRefreshToggle"
                      defaultChecked
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
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