require('dotenv').config();
const express = require("express");
const path = require("path");
const { connectDB, getDB } = require("./src/config/database");
const crypto = require("crypto");

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const directionRoutes = require("./src/routes/directionRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3999;

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// ==================== SERVE STATIC FILES ====================
app.use(express.static(path.join(__dirname, "../Frontend")));

// ==================== API ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/direction", directionRoutes);
app.use("/api/admin", adminRoutes);

// ==================== FRONTEND ROUTES ====================
const frontendPages = [
    'login-index.html',
    'dashboard-index.html',
    'reports.html',
    'queuetracker.html',
    'find-your-room.html',
    'buildings-index.html',
    'map-index.html',
    'profile.html',
    'admin.html',
    'admin-login.html'
];

frontendPages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, "../Frontend", page));
    });
});

// ==================== START SERVER ====================
async function startServer() {
    await connectDB();
    
    app.listen(PORT, () => {
        console.log(`\n🚀 Server running on http://localhost:${PORT}`);
        console.log(`📋 Admin credentials: admin@dlsu.edu.ph / admin123`);
        console.log(`🔗 Login page: http://localhost:${PORT}/login-index.html`);
        console.log(`🔗 Admin panel: http://localhost:${PORT}/admin-login.html\n`);
    });
}

startServer();