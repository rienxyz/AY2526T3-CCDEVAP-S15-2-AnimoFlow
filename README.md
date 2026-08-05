# AnimoFlow - DLSU Elevator Queue Management System

## 📖 Overview

AnimoFlow is a real-time crowd-sourced elevator queue management system designed for the De La Salle University (DLSU) community. It allows students, faculty, and staff to report elevator queue lengths, view building information, and navigate the campus efficiently.

**Phase 3 Update:** Complete file structure reorganization, enhanced user and admin dashboards with toggleable charts, line graphs with filters, full CRUD operations for admins, sticky navigation, dark mode, and password management features.

---

##  Features

###  Authentication
- DLSU email login (`@dlsu.edu.ph`)
- Guest view-only mode
- Admin panel with full CRUD operations
- Session persistence across pages
- Forgot password (reset to default)
- Change password functionality

###  User Dashboard
- **Toggleable Charts:** Reports by Building (Bar/Pie) and Queue Status Distribution (Pie/Doughnut)
- **Line Graph with Filters:** Report trends filterable by Building, Elevator, and Date Range
- **Recent Activity Feed:** Shows latest 5 reports with timestamps
- **Dark Mode Support:** Toggle dark/light theme across all pages

###  Admin Dashboard
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

###  Buildings CRUD (Admin)
- View all buildings with DataTables
- Add new buildings (code, name, floors, elevators, description)
- Edit existing buildings
- Delete buildings

###  Reports (User)
- Submit elevator queue reports (Short/Medium/Long)
- Dynamic elevator dropdown based on building selection
- View recent reports from the last 30 minutes
- Guest users can view reports but cannot submit

###  Queue Tracker
- Live status of all 10 campus buildings
- Color-coded traffic indicators (🟢 Light / 🟡 Moderate / 🔴 Heavy)
- Filter by building or queue status
- Click on any building card to filter reports

###  Find Your Room
- Search by room code (e.g., LS305) or building name
- Get walking directions from any campus gate
- Visual route guidance with images

###  Buildings Directory
- Complete building directory with descriptions
- Building images and floor information
- Elevator count and availability

### Campus Map
- Interactive map with building markers
- Click markers for detailed building information
- Hover for building names

###  User Profile
- User statistics (total reports, active reports)
- Quick stats (buildings reported, elevators used, active days)
- Recent activity history
- Charts: Your Reports by Building and Your Queue Status
- Contribution summary with status breakdown
- Change password functionality
- Dark Mode and Auto-Refresh preferences

###  Dark Mode
- Toggle dark/light theme across all pages
- Preference saved in local storage

###  Sticky Navigation
- Fixed navigation bar on all pages
- User email display in navbar
- Logout button in navbar

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript, Bootstrap 5 |
| **Backend** | Node.js, Express.js (MVC Architecture) |
| **Database** | MongoDB |
| **Charts** | Chart.js |
| **Tables** | DataTables.net |
| **Icons** | Bootstrap Icons |
| **Web Server** | Apache (Proxy) |

---

##  Project Structure

```
animoflow/
├── Frontend/
│   ├── index.html
│   ├── login.html
│   ├── login.js
│   ├── login.css
│   ├── admin-login.html
│   ├── admin-login.js
│   ├── admin-login.css
│   ├── forgot-password.html
│   ├── forgot-password.js
│   │
│   ├── user/
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
│   ├── admin/
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
│   └── public/
│       ├── css/
│       │   └── dark-mode.css
│       └── images/
│
├── Backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── seed-directions.js
│   │
│   └── src/
│       ├── config/
│       │   └── database.js
│       ├── models/
│       │   ├── ReportModel.js
│       │   ├── UserModel.js
│       │   └── DirectionModel.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── reportController.js
│       │   ├── directionController.js
│       │   └── adminController.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── reportRoutes.js
│       │   ├── directionRoutes.js
│       │   └── adminRoutes.js
│       └── utils/
│           └── helpers.js
│
├── README.md
└── CHANGES.md
```

---

##  Installation & Setup

### Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | v16 or higher |
| **npm** | v8 or higher |
| **MongoDB** | v6.0 or higher |
| **Apache** | 2.4 or higher |

### Step 1: Clone the Repository

```bash
git clone -b animoflow-phase3 https://github.com/rienxyz/AY2526T3-CCDEVAP-S15-2-AnimoFlow.git
cd AY2526T3-CCDEVAP-S15-2-AnimoFlow
```

### Step 2: Install Backend Dependencies

```bash
cd Backend
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `Backend` folder:

```env
PORT=443
MONGODB_URI=mongodb://localhost:27017/Main
DB_NAME=Main
NODE_ENV=production
```

### Step 4: Start MongoDB

```bash
# Start MongoDB service
systemctl start mongod
systemctl enable mongod
```

### Step 5: Seed the Database (First Time Only)

```bash
node seed-directions.js
```

### Step 6: Start the Backend

```bash
pm2 start npm --name "animoflow-backend" -- start
pm2 save
```

### Step 7: Configure Apache (Frontend)

```bash
# Copy frontend files
cp -r Frontend/* /var/www/html/

# Configure Apache virtual host
cat > /etc/apache2/sites-available/animoflow.conf << 'EOF'
<VirtualHost *:80>
    ServerName _default_
    DocumentRoot /var/www/html
    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    ProxyPreserveHost On
    ProxyPass /api http://localhost:443/api
    ProxyPassReverse /api http://localhost:443/api
</VirtualHost>
EOF

# Enable site
a2enmod proxy proxy_http
a2ensite animoflow.conf
systemctl restart apache2
```

### Step 8: Access the Application

| Page | URL |
|------|-----|
| **Login** | `http://localhost` or `http://10.2.14.36` |
| **Admin Login** | `http://localhost/admin-login.html` |
| **User Dashboard** | `http://localhost/user/dashboard.html` |
| **Admin Dashboard** | `http://localhost/admin/dashboard.html` |

---

##  Default Accounts

### Admin Account

| Field | Value |
|-------|-------|
| **Email** | `admin@dlsu.edu.ph` |
| **Password** | `admin123` |

### Guest Access

- Check **"Continue as guest (view only)"** on the login page

### Test Users (after running data generator)

| Field | Value |
|-------|-------|
| **Email** | `juan.santos@dlsu.edu.ph` |
| **Password** | `test123456` |

---

##  Access from Anywhere

### SSH Tunnel

```bash
ssh -p 60436 -L 80:localhost:80 testuser@ccscloud.dlsu.edu.ph
# Then open: http://localhost
```

---

##  API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/admin/login` | Admin login |
| GET | `/api/auth/verify` | Verify admin token |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/change-password` | Change password |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/report` | Get recent reports |
| GET | `/api/report/all` | Get all reports (admin) |
| POST | `/api/report` | Create a new report |
| DELETE | `/api/report/id/:id` | Delete report by ID |

---

##  Troubleshooting

### Backend Not Running

```bash
pm2 restart animoflow-backend
pm2 save
```

### MongoDB Not Running

```bash
systemctl start mongod
systemctl enable mongod
```

### Apache Not Running

```bash
systemctl restart apache2
```

### Login Error "Server error"

```bash
# Check backend logs
pm2 logs animoflow-backend --lines 20

# Check if backend is running
pm2 list
```

### Forgot Password Not Working

```bash
# Check if reset-password route exists
grep "reset-password" Backend/src/routes/authRoutes.js
```

---

##  Contributors

- Fernandez, Rimmuel James
- Casihan, Sofron Dominic
- Siriban, Joshua Gabriel
- Turato, Airnest Zan

---

**Documentation Version:** Phase 3  
**Date:** August 2026
