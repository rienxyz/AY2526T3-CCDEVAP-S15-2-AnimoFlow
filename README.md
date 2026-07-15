# AnimoFlow - DLSU Elevator Queue Management System

##  Overview
AnimoFlow is a real-time crowd-sourced elevator queue management system designed for the De La Salle University (DLSU) community. It allows students, faculty, and staff to report elevator queue lengths, view building information, and navigate the campus efficiently.

---

##  Features

###  Authentication
- DLSU email login (`@dlsu.edu.ph`)
- Guest view-only mode
- Admin panel with full CRUD operations

###  Dashboard
- Real-time reports overview with live statistics
- Chart.js visualizations (Reports by Building, Queue Status Distribution)
- Recent activity feed showing latest submissions

###  Reports
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

###  Buildings
- Complete building directory with descriptions
- Building images and floor information
- Elevator count and availability

###  Campus Map
- Interactive map with building markers
- Click markers for detailed building information
- Hover for building names

###  Profile
- User statistics (total reports, active reports)
- Recent activity history
- Dark mode toggle
- Email notification and auto-refresh preferences

###  Admin Panel
- DataTables for report management
- Delete individual reports or clear all
- Analytics charts (Reports by Building, Queue Status Distribution)
- User activity monitoring
- **Access:** `admin@dlsu.edu.ph` / `admin123`

###  Dark Mode
- Toggle dark/light theme across all pages
- Preference saved in local storage

---

##  Tech Stack

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

##  Project Structure

```
animoflow/
├── Frontend/
│   ├── admin.html                 # Admin dashboard
│   ├── admin-login.html           # Admin login page
│   ├── buildings-index.html       # Buildings directory
│   ├── dashboard-index.html       # Main dashboard
│   ├── find-your-room.html        # Room search
│   ├── login-index.html           # User login
│   ├── map-index.html             # Campus map
│   ├── profile.html               # User profile
│   ├── queuetracker.html          # Queue tracker
│   ├── reports.html               # Submit reports
│   ├── dark-mode.css              # Shared dark mode styles
│   ├── *.js                       # Page-specific JavaScript
│   ├── *.css                      # Page-specific styles
│   └── Images/
│       ├── Ands.jpg               # Andrew Gonzalez Hall
│       ├── ER.jpg                 # Razon Sports Center
│       ├── Gokongwei.jpg          # Gokongwei Hall
│       ├── LaSalle.jpg            # St. La Salle Hall
│       ├── Migs.jpg               # St. Miguel Hall
│       ├── Sy.jpg                 # Henry Sy Hall
│       ├── Vels.jpg               # Velasco Hall
│       ├── Yuch.jpg               # Yuchengco Hall
│       └── taft.png               # Campus map image
├── Backend/
│   ├── server.js                  # Entry point (MVC)
│   ├── package.json               # Dependencies
│   ├── .env                       # Environment variables
│   ├── docker-compose.yml         # MongoDB container
│   ├── seed-directions.js         # Direction data seeder
│   ├── Directions/                # Route direction images
│   │   └── gate*.png
│   └── src/
│       ├── config/
│       │   └── database.js        # MongoDB connection
│       ├── models/
│       │   ├── ReportModel.js     # Report schema/operations
│       │   ├── UserModel.js       # User schema/operations
│       │   └── DirectionModel.js  # Direction schema/operations
│       ├── controllers/
│       │   ├── authController.js      # Auth logic
│       │   ├── reportController.js    # Report logic
│       │   ├── directionController.js # Direction logic
│       │   └── adminController.js     # Admin logic
│       ├── routes/
│       │   ├── authRoutes.js          # Auth endpoints
│       │   ├── reportRoutes.js        # Report endpoints
│       │   ├── directionRoutes.js     # Direction endpoints
│       │   └── adminRoutes.js         # Admin endpoints
│       └── utils/
│           └── helpers.js             # Utility functions
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
git clone https://github.com/yourusername/animoflow.git
cd animoflow
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
PORT=3999
MONGODB_URI=mongodb://admin:password@localhost:27017/?authSource=admin
DB_NAME=Main
NODE_ENV=development
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
| **Login** | `http://localhost:3999/login-index.html` |
| **Dashboard** | `http://localhost:3999/dashboard-index.html` |
| **Admin Login** | `http://localhost:3999/admin-login.html` |

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
| GET | `/api/report/all` | Get all reports (no time filter) |
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

## 🐛 Troubleshooting

### MongoDB Connection Refused
```bash
docker-compose up -d
docker logs mongodb
```

### Port 3999 Already in Use
```bash
# Windows
netstat -ano | findstr :3999
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3999
kill -9 <PID>
```

### Cannot Find Module
```bash
rm -rf node_modules
npm install
```

---

##  Limitations (Documented for Submission)

| Limitation | Description |
|------------|-------------|
| **Password Storage** | Passwords are stored in plain text in the database. |
| **Session Management** | No persistent session management implemented yet. |
| **Password Hashing** | Not implemented yet. |
| **Form Validation** | Basic validation only. |
| **Direct URL Access** | All pages accessible via direct URL. |

---

##  Contributors

- Fernandez, Rimmuel James
- Casihan, Sofron Dominic
- Siriban, Joshua Gabriel
- Turato, Airnest Zan

---


