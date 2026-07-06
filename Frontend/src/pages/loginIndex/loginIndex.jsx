import "./login-style.css";

export default function Login() {
  return (
    <>
      <div className="login-wrapper">
        <div className="main-card row g-0">
          {/* LEFT BRAND PANEL */}
          <div className="col-lg-6 brand-panel">
            <div className="logo-badge">
              <div
                className="logo-icon"
                style={{ background: "white", color: "#006837" }}
              >
                <i className="bi bi-bar-chart-steps"></i>
              </div>

              <span
                className="logo-text"
                style={{ color: "white" }}
              >
                AnimoFlow
              </span>
            </div>

            <h2>
              Navigate smarter.
              <br />
              Less waiting, <span className="highlight">more moving</span>.
            </h2>

            <div className="tagline">
              Real-time crowd-sourced elevator queues &amp; building indicators
              for the DLSU community.
            </div>

            <ul className="feature-list">
              <li>
                <i className="bi bi-elevator"></i>
                <span>Live elevator queue reports (Short/Med/Long)</span>
              </li>

              <li>
                <i className="bi bi-search"></i>
                <span>
                  Classroom search by building, floor, or room#
                </span>
              </li>

              <li>
                <i className="bi bi-people-fill"></i>
                <span>Crowd indicators: Light / Moderate / Heavy</span>
              </li>

              <li>
                <i className="bi bi-shield-lock"></i>
                <span>DLSU email login · Guest access ready</span>
              </li>
            </ul>
          </div>

          {/* RIGHT LOGIN PANEL */}
          <div className="col-lg-6 form-panel">
            <h3>Welcome back</h3>

            <div className="form-sub">
              Sign in with your DLSU email to contribute or view live updates
            </div>

            <form id="loginForm">
              <div className="input-group-custom">
                <label htmlFor="dlsuEmail">
                  DLSU Email Address
                </label>

                <input
                  type="email"
                  id="dlsuEmail"
                  className="form-control form-control-lg"
                  placeholder="juandelacruz@dlsu.edu.ph"
                  autoComplete="email"
                />

                <div
                  id="emailError"
                  className="invalid-feedback d-none"
                >
                  Email must be a valid DLSU address ending with
                  @dlsu.edu.ph
                </div>

                <small className="form-text">
                  Use your official @dlsu.edu.ph account.
                </small>
              </div>

              <div className="input-group-custom">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  type="password"
                  id="password"
                  className="form-control form-control-lg"
                  placeholder="Minimum 8 characters"
                  autoComplete="current-password"
                />

                <div
                  id="passwordError"
                  className="invalid-feedback d-none"
                >
                  Password must be at least 8 characters long.
                </div>

                <small className="form-text">
                  Min. 8 characters
                </small>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="guestDemo"
                  />

                  <label
                    className="form-check-label text-muted small"
                    htmlFor="guestDemo"
                  >
                    Continue as guest (view only)
                  </label>
                </div>

                <a href="#" id="forgotLink" className="small">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                id="loginBtn"
                className="btn btn-primary btn-lg w-100 login-btn"
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Sign in to AnimoFlow
              </button>
            </form>

            <div className="mt-4 pt-2 text-center border-top">
              <p className="small text-muted mb-1">
                First time? Use your DLSU email to register automatically.
                <br />
                <strong>@dlsu.edu.ph</strong> required for contributors.
              </p>

              <div className="mt-2">
                <span className="badge bg-light me-1">
                  <i className="bi bi-database"></i> crowd-sourced
                </span>

                <span className="badge bg-light">
                  <i className="bi bi-graph-up"></i> near real-time
                </span>
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
            aria-live="assertive"
            aria-atomic="true"
            data-bs-autohide="true"
            data-bs-delay="3000"
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
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}