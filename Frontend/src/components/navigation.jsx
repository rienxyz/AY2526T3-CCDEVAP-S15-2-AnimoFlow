import './nav-styles.css';

export function NavigationHeader() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <div className="logo-icon-small">
            <i className="bi bi-bar-chart-steps"></i>
          </div>
          AnimoFlow
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link active" href="#">
                <i className="bi bi-file-text me-1"></i> Reports
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bi bi-search me-1"></i> Search
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link logout-btn" href="#">
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}