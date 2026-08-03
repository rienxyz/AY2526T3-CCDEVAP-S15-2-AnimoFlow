const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");

// ===== AUTHENTICATION MIDDLEWARE =====
const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: "No token provided", 
                code: "NO_TOKEN" 
            });
        }

        const token = authHeader.replace('Bearer ', '');
        
        // For development: Accept any token that starts with admin
        // In production, validate properly
        if (!token || token.length < 10) {
            return res.status(401).json({ 
                error: "Invalid token format", 
                code: "INVALID_TOKEN" 
            });
        }

        // Try to decode the token
        try {
            const decoded = Buffer.from(token, 'base64').toString('utf-8');
            const parts = decoded.split(':');
            if (parts.length >= 1 && parts[0].includes('@dlsu.edu.ph')) {
                // Token seems valid
                req.adminEmail = parts[0];
                return next();
            }
        } catch (e) {
            // Token might be a simple token from admin login
            // Check if we have a valid admin session
            const adminUser = require('../models/UserModel');
            // If token exists in our validTokens map
            const validTokens = authController.validTokens || new Map();
            if (validTokens.has(token)) {
                const tokenData = validTokens.get(token);
                if (tokenData.expires > Date.now()) {
                    req.adminEmail = tokenData.email;
                    return next();
                } else {
                    validTokens.delete(token);
                    return res.status(401).json({ 
                        error: "Token expired", 
                        code: "TOKEN_EXPIRED" 
                    });
                }
            }
        }

        return res.status(401).json({ 
            error: "Invalid token", 
            code: "INVALID_TOKEN" 
        });
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(500).json({ 
            error: "Authentication error", 
            code: "AUTH_ERROR" 
        });
    }
};

// ===== APPLY AUTHENTICATION TO ALL ADMIN ROUTES =====
router.use(authenticateAdmin);

// ===== ROUTES =====
router.delete("/reports/all", adminController.deleteAllReports);
router.get("/analytics", adminController.getAnalytics);
router.get("/users", adminController.getAllUsers);
router.put("/users/role", adminController.updateUserRole);

module.exports = router;