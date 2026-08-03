# AnimoFlow - DLSU Elevator Queue Management System

##  Overview

AnimoFlow is a real-time crowd-sourced elevator queue management system designed for the De La Salle University (DLSU) community. It allows students, faculty, and staff to report elevator queue lengths, view building information, and navigate the campus efficiently.

**Phase 3 Update:** Complete file structure reorganization, enhanced user and admin dashboards with toggleable charts, line graphs with filters, full CRUD operations for admins, sticky navigation, and improved dark mode support across all pages.

---

##  Features

###  Authentication
- DLSU email login (`@dlsu.edu.ph`)
- Guest view-only mode
- Admin panel with full CRUD operations
- Session persistence across pages

### 📊 User Dashboard
- **Toggleable Charts:** Reports by Building (Bar/Pie) and Queue Status Distribution (Pie/Doughnut)
- **Line Graph with Filters:** Report trends filterable by Building, Elevator, and Date Range (Today/Week/Month/All Time)
- **Recent Activity Feed:** Shows latest 5 reports with timestamps
- **Dark Mode Support:** Toggle dark/light theme across all pages

### 🏢 Admin Dashboard
- **Statistics Cards:** Total Reports, Active Reports, Buildings Active, Total Users
- **Toggleable Charts:** Reports by Building (Bar/Pie) and Queue Status Distribution (Pie/Doughnut)
- **Line Graph with Filters:** Report trends with Building, Elevator, and Date Range filters
- **Quick Actions:** One-click access to CRUD operations

###  Reports CRUD (Admin)
- View all reports with DataTables (search, sort, pagination)
- Edit reports (building, elevator, queue status)
- Delete individual reports
- Clear all reports (bulk delete)
- Filter by building, status, and user

###  Users CRUD (Admin)
- View all registered users
- User statistics (Total Users, Admins, Regular Users)
- Edit user roles (User/Admin)
- DataTables for easy management

###  Buildings CRUD (Admin)
- View all buildings with DataTables
- Add new buildings (code, name, floors, elevators, description)
- Edit existing buildings
- Delete buildings
- Default building data pre-loaded

###  Reports
- Submit elevator queue reports (Short/Medium/Long)
- Dynamic elevator dropdown based on building selection
- View recent reports from the last 30 minutes
- Guest users can view reports but cannot submit
- Auto-refresh every 30 seconds

###  Queue Tracker
- Live status of all 10 campus buildings
- Color-coded traffic indicators (🟢 Light / 🟡 Moderate / 🔴 Heavy)
- Filter by building or queue status
- Click on any building card to filter reports
- Auto-refresh every 30 seconds

###  Find Your Room
- Search by room code (e.g., LS305) or building name
- Get walking directions from any campus gate
- Visual route guidance with images

###  Buildings Directory
- Complete building directory with descriptions
- Building images and floor information
- Elevator count and availability

###  Campus Map
- Interactive map with building markers
- Click markers for detailed building information
- Hover for building names
- Improved readability in dark mode

###  User Profile
- User statistics (total reports, active reports)
- Quick stats (buildings reported, elevators used, active days)
- Recent activity history
- Charts: Your Reports by Building (Bar) and Your Queue Status (Doughnut)
- Contribution summary with status breakdown
- Preferences: Dark Mode toggle, Auto-Refresh toggle
- Logout button

###  Dark Mode
- Toggle dark/light theme across all pages
- Preference saved in local storage
- Consistent dark mode support for all elements including charts

###  Sticky Navigation
- Fixed navigation bar on all pages
- User email display in navbar
- Logout button in navbar
- Admin panel link appears for admin users

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript, Bootstrap 5 |
| **Backend** | Node.js, Express.js (MVC Architecture) |
| **Database** | MongoDB (Docker Container) |
| **Charts** | Chart.js |
| **Tables** | DataTables.net |
| **Icons** | Bootstrap Icons |
| **Container** | Docker / Docker Compose |

---

## 📁 Project Structure

```
animoflow/
├── Frontend/
│   ├── index.html                      # Redirect to login
│   ├── login.html                      # User login
│   ├── login.js                        # Login logic
│   ├── login.css                       # Login styles
│   ├── admin-login.html                # Admin login
│   ├── admin-login.js                  # Admin login logic
│   ├── admin-login.css                 # Admin login styles
│   │
│   ├── user/                           # User pages
│   │   ├── dashboard.html
│   │   ├── dashboard.js
│   │   ├── dashboard.css
│   │   ├── reports.html
│   │   ├── reports.js
│   │   ├── reports.css
│   │   ├── queuetracker.html
│   │   ├── queuetracker.js
│   │   ├── queuetracker.css
│   │   ├── find-room.html
│   │   ├── find-room.js
│   │   ├── find-room.css
│   │   ├── buildings.html
│   │   ├── buildings.js
│   │   ├── buildings.css
│   │   ├── map.html
│   │   ├── map.js
│   │   ├── map.css
│   │   ├── profile.html
│   │   ├── profile.js
│   │   └── profile.css
│   │
│   ├── admin/                          # Admin pages
│   │   ├── dashboard.html
│   │   ├── dashboard.js
│   │   ├── dashboard.css
│   │   ├── reports.html
│   │   ├── reports.js
│   │   ├── users.html
│   │   ├── users.js
│   │   ├── buildings.html
│   │   ├── buildings.js
│   │   └── shared.css
│   │
│   ├── public/                         # Public assets
│   │   ├── css/
│   │   │   └── dark-mode.css
│   │   └── images/
│   │       ├── buildings/
│   │       │   ├── Ands.jpg
│   │       │   ├── ER.jpg
│   │       │   ├── Gokongwei.jpg
│   │       │   ├── LaSalle.jpg
│   │       │   ├── Migs.jpg
│   │       │   ├── Sy.jpg
│   │       │   ├── Vels.jpg
│   │       │   ├── Yuch.jpg
│   │       │   ├── Connon.jpg
│   │       │   ├── Jos.jpg
│   │       │   ├── BM.jpg
│   │       │   └── strc.jpg
│   │       ├── map/
│   │       │   └── taft.png
│   │       └── directions/
│   │           └── gate*.png
│   │
│   └── shared/                         # Shared utilities
│       ├── css/
│       │   └── utilities.css
│       └── js/
│           ├── auth.js
│           ├── api.js
│           └── utils.js
│
├── Backend/
│   ├── server.js                       # Entry point
│   ├── package.json                    # Dependencies
│   ├── .env                            # Environment variables
│   ├── docker-compose.yml              # MongoDB container
│   ├── seed-directions.js              # Direction data seeder
│   │
│   └── src/
│       ├── config/
│       │   └── database.js             # MongoDB connection
│       ├── models/
│       │   ├── ReportModel.js          # Report schema/operations
│       │   ├── UserModel.js            # User schema/operations
│       │   └── DirectionModel.js       # Direction schema/operations
│       ├── controllers/
│       │   ├── authController.js       # Auth logic
│       │   ├── reportController.js     # Report logic
│       │   ├── directionController.js  # Direction logic
│       │   └── adminController.js      # Admin logic
│       ├── routes/
│       │   ├── authRoutes.js           # Auth endpoints
│       │   ├── reportRoutes.js         # Report endpoints
│       │   ├── directionRoutes.js      # Direction endpoints
│       │   └── adminRoutes.js          # Admin endpoints
│       └── utils/
│           └── helpers.js              # Utility functions
│
├── docker-compose.yml
└── README.md
```

---

##  Installation & Setup

### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Docker Desktop** | Latest (for MongoDB) |
| **Node.js** | v16 or higher |
| **npm** | v8 or higher |

### Step 1: Clone the Repository

```bash
git clone https://github.com/rienxyz/AY2526T3-CCDEVAP-S15-2-AnimoFlow.git
cd AY2526T3-CCDEVAP-S15-2-AnimoFlow
```

### Step 2: Start MongoDB with Docker

```bash
# Navigate to Backend folder
cd Backend

# Start MongoDB container in detached mode
docker-compose up -d

# Verify MongoDB is running
docker ps
```

### Step 3: Install Backend Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the `Backend` folder:

```env
PORT=60136
MONGODB_URI=mongodb://localhost:27017/Main
DB_NAME=Main
NODE_ENV=production
```

### Step 5: Seed Direction Data (One Time Only)

```bash
node seed-directions.js
```

### Step 6: Start the Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

### Step 7: Access the Application

| Page | URL |
|------|-----|
| **Login** | `http://localhost:60136/login.html` |
| **User Dashboard** | `http://localhost:60136/user/dashboard.html` |
| **Admin Login** | `http://localhost:60136/admin-login.html` |
| **Admin Dashboard** | `http://localhost:60136/admin/dashboard.html` |

---

##  Default Accounts

### Admin Account

| Field | Value |
|-------|-------|
| **Email** | `admin@dlsu.edu.ph` |
| **Password** | `admin123` |

### Guest Access

- Check **"Continue as guest (view only)"** on the login page

---

## 🌐 CCS Cloud Deployment

### Server Access

```bash
# SSH into the server
ssh -p 60436 root@10.2.14.36
# Password: lBm0PPk15Lfo

# SSH Tunnel for browser access (from anywhere)
ssh -p 60436 -L 60136:localhost:60136 testuser@ccscloud.dlsu.edu.ph
# Then open: http://localhost:60136
```

### Deployment Commands

```bash
# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Start Backend
cd ~/AY2526T3-CCDEVAP-S15-2-AnimoFlow/Backend
pm2 start npm --name "animoflow-backend" -- start
pm2 save

# Check Status
pm2 list
curl http://localhost:60136/api/report
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/admin/login` | Admin login |
| GET | `/api/auth/verify` | Verify admin token |
| POST | `/api/auth/logout` | Logout |

### Reports (`/api/report`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/report` | Get reports from last 30 min |
| GET | `/api/report/all` | Get all reports (admin) |
| GET | `/api/report/user/:userId` | Get reports by user |
| GET | `/api/report/building/:building` | Get reports by building |
| GET | `/api/report/status/:queueLength` | Get reports by status |
| POST | `/api/report` | Create a new report |
| DELETE | `/api/report/id/:id` | Delete report by ID |
| DELETE | `/api/report/building/:building` | Delete reports by building |
| DELETE | `/api/report/status/:queueLength` | Delete reports by status |
| DELETE | `/api/report/user/:userId` | Delete reports by user |

### Directions (`/api/direction`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/direction?building=&gate=` | Get direction image |
| GET | `/api/direction/all` | Get all directions |
| POST | `/api/direction` | Create/update direction |

### Admin (`/api/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| DELETE | `/api/admin/reports/all` | Delete all reports |
| GET | `/api/admin/analytics` | Get analytics summary |
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/role` | Update user role |

---

## 🏛️ Building Elevator Information

| Building | Elevators | Names |
|----------|-----------|-------|
| **St. La Salle Hall** | 4 | LS-East-1, LS-East-2, LS-West-1, LS-West-2 |
| **Henry Sy Hall** | 5 | H-Ground-A, H-Ground-B, H-Ground-C, H-6th-A, H-6th-B |
| **Yuchengco Hall** | 3 | Y-A, Y-B, Y-C |
| **St. Joseph Hall** | 1 | SJ-1 |
| **Velasco Hall** | 1 | V-1 |
| **St. Miguel Hall** | 1 | M-1 |
| **Gokongwei Hall** | 0 | No elevators |
| **STRC** | 1 | STRC-1 |
| **Razon Sports Center** | 3 | R-A, R-B, R-C |
| **Andrew Gonzalez Hall** | 5 | A-Public-1, A-Public-2, A-Public-3, A-Public-4, A-Staff |

---

##  Test Data Generator

To populate charts with test data, run this in your browser console (F12):

```javascript
(async function generateTestData() {
    const API_URL = 'http://localhost:60136/api/report';
    const buildings = ['St. La Salle Hall','Henry Sy Hall','Yuchengco Hall','St. Joseph Hall','Velasco Hall','St. Miguel Hall','Gokongwei Hall','STRC','Razon Sports Center','Andrew Gonzalez Hall'];
    const elevators = {
        'St. La Salle Hall': ['LS-East-1','LS-East-2','LS-West-1','LS-West-2'],
        'Henry Sy Hall': ['H-Ground-A','H-Ground-B','H-Ground-C','H-6th-A','H-6th-B'],
        'Yuchengco Hall': ['Y-A','Y-B','Y-C'],
        'St. Joseph Hall': ['SJ-1'],
        'Velasco Hall': ['V-1'],
        'St. Miguel Hall': ['M-1'],
        'Gokongwei Hall': [],
        'STRC': ['STRC-1'],
        'Razon Sports Center': ['R-A','R-B','R-C'],
        'Andrew Gonzalez Hall': ['A-Public-1','A-Public-2','A-Public-3','A-Public-4','A-Staff']
    };
    const users = ['student1@dlsu.edu.ph','student2@dlsu.edu.ph','student3@dlsu.edu.ph','faculty1@dlsu.edu.ph','faculty2@dlsu.edu.ph','staff1@dlsu.edu.ph'];
    const statuses = ['short','medium','long'];

    function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function randomDate(daysBack) { return Date.now() - (Math.random() * daysBack * 86400000); }

    let success = 0;
    for (let i = 0; i < 50; i++) {
        const building = randomChoice(buildings);
        const elevList = elevators[building] || [];
        if (elevList.length === 0) continue;
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    building: building,
                    elevator: randomChoice(elevList),
                    queueLength: randomChoice(statuses),
                    userId: randomChoice(users),
                    timestamp: randomDate(7)
                })
            });
            if (response.ok) success++;
        } catch(e) {}
    }
    console.log(`✅ Generated ${success} test reports! Refresh your dashboard.`);
})();
```

---

##  Troubleshooting

### MongoDB Connection Refused

```bash
systemctl start mongod
systemctl enable mongod
```

### Backend Not Running

```bash
pm2 start animoflow-backend
pm2 save
```

### Port Already in Use

```bash
# Check what's using port 60136
netstat -tlnp | grep 60136

# Kill the process
kill -9 [PID]
```

### Cannot Find Module

```bash
cd ~/AY2526T3-CCDEVAP-S15-2-AnimoFlow/Backend
rm -rf node_modules
npm install
```

### Login Error "Server error"

```bash
# Make sure frontend points to correct port
cd ~/AY2526T3-CCDEVAP-S15-2-AnimoFlow/Frontend
sed -i 's/localhost:3999/localhost:60136/g' *.js
sed -i 's/localhost:3999/localhost:60136/g' user/*.js
sed -i 's/localhost:3999/localhost:60136/g' admin/*.js
```

---

##  Phase 3 Changes Summary

### File Structure
- Reorganized into role-based structure (`user/`, `admin/`)
- Renamed all files for consistency
- Moved login pages to root
- Created `public/` for shared assets
- Created `shared/` for utility files

### User Dashboard
- Removed redundant stats cards (moved to Profile)
- Added toggleable charts (Bar/Pie, Pie/Doughnut)
- Added line graph with filters (Building, Elevator, Date Range)

### User Profile
- Added quick stats (Buildings, Elevators, Active Days)
- Added charts (Your Reports by Building, Your Queue Status)
- Added contribution summary with status breakdown
- Removed email notifications toggle

### Admin Panel
- Added full CRUD operations (Reports, Users, Buildings)
- Added toggleable charts
- Added line graph with filters
- Added quick action cards

### UI/UX
- Added sticky navbar on all pages
- Fixed dark mode on all pages
- Improved campus map readability
- Consistent navbar across all pages

### Known Limitations
- Passwords stored in plain text in the database
- No persistent session management implemented
- No password hashing implemented
- Basic form validation only

---

##  Contributors

- Fernandez, Rimmuel James
- Casihan, Sofron Dominic
- Siriban, Joshua Gabriel
- Turato, Airnest Zan

---

**Documentation Version:** Phase 3  
**Date:** August 2026
