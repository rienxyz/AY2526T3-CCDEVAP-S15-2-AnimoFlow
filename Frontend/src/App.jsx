import { useState } from 'react'
import './App.css'

import Buildings from './pages/buildingsIndex/buildingsIndex'
import FindYourRoom from './pages/findYourRoom/findYourRoom'
import Login from './pages/loginIndex/loginIndex'
import Profile from './pages/profile/profile'
import QueueTracker from './pages/queueTracker/queueTracker'
import Reports from './pages/reports/reports'

function App() {
  const [page, setPage] = useState("Profile")

  return (
    <>
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <div class="logo-icon-small">
                    <i class="bi bi-bar-chart-steps"></i>
                </div>
                AnimoFlow
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#" >
                            <i class="bi bi-speedometer2 me-1"></i> Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" onClick={() => setPage("Reports")}>
                            <i class="bi bi-file-text me-1"></i> Reports
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="bi bi-search me-1"></i> Search
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="#" onClick={() => setPage("Profile")}>
                            <i class="bi bi-person me-1"></i> Profile
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link logout-btn" href="#">
                            <i class="bi bi-box-arrow-right me-1"></i> Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
      </nav>

      {page === "Reports" && <Reports/>}
      {page === "Profile" && <Profile setPage={setPage}/>}
      {page === "FindYourRoom" && <FindYourRoom/>}

    </>
  )
}

export default App
