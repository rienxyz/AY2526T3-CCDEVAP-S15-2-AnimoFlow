/**
 * AnimoFlow - Authentication Controller
 * 
 * Description: Handles all authentication-related operations including
 *              login, registration, password management, and admin verification.
 * 
 * Features:
 *   - User registration with DLSU email validation
 *   - User login with role-based redirection
 *   - Admin login with token generation
 *   - Admin token verification
 *   - Password reset (forgot password)
 *   - Password change (authenticated users)
 *   - Logout functionality
 * 
 * Author: AnimoFlow Team
 * Date: August 2026
 */

const UserModel = require("../models/UserModel");
const crypto = require("crypto");

// Admin credentials (hardcoded as per limitation)
const ADMIN_CREDENTIALS = [
    { email: 'admin@dlsu.edu.ph', password: 'admin123' },
    { email: 'admin.animoflow@dlsu.edu.ph', password: 'admin123' }
];

// Export validTokens so adminRoutes can access it
const validTokens = new Map();
exports.validTokens = validTokens;

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        if (!email.toLowerCase().includes('@dlsu.edu.ph')) {
            return res.status(400).json({ error: "Must use a valid @dlsu.edu.ph email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }

        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "User already exists. Please login." });
        }

        const user = await UserModel.create({ email, password, role: 'user' });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { email: user.email, role: user.role }
        });

    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "Server error during registration" });
    }
};

/**
 * User login - Regular and admin users
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        let user = await UserModel.findByEmail(email);

        if (!user) {
            // Auto-register user for first-time login
            user = await UserModel.create({ 
                email, 
                password, 
                role: 'user' 
            });
            
            return res.json({
                success: true,
                token: crypto.randomUUID(),
                user: {
                    email: user.email,
                    role: user.role || 'user'
                }
            });
        }

        // Check password (plain text comparison)
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.json({
            success: true,
            token: crypto.randomUUID(),
            user: {
                email: user.email,
                role: user.role || 'user'
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error during login" });
    }
};

/**
 * Admin login - Generates admin token
 * POST /api/auth/admin/login
 */
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        // Check in users collection first
        const user = await UserModel.findByEmail(email);
        
        if (user && user.role === 'admin' && user.password === password) {
            const token = Buffer.from(email + ':' + Date.now()).toString('base64');
            validTokens.set(token, {
                email: user.email,
                expires: Date.now() + 3600000 // 1 hour
            });
            return res.json({
                success: true,
                token: token,
                user: { email: user.email, role: 'admin' }
            });
        }

        // Fallback to hardcoded admin list
        const admin = ADMIN_CREDENTIALS.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );

        if (!admin) {
            return res.status(401).json({ error: "Invalid admin credentials" });
        }

        const token = Buffer.from(email + ':' + Date.now()).toString('base64');
        validTokens.set(token, {
            email: admin.email,
            expires: Date.now() + 3600000 // 1 hour
        });

        res.json({
            success: true,
            token: token,
            user: { email: admin.email, role: 'admin' }
        });

    } catch (err) {
        console.error("Admin login error:", err);
        res.status(500).json({ error: "Server error during admin login" });
    }
};

/**
 * Verify admin token
 * GET /api/auth/verify
 */
exports.verifyAdmin = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ valid: false, error: "No token provided" });
        }

        const token = authHeader.replace('Bearer ', '');
        const tokenData = validTokens.get(token);
        
        if (!tokenData) {
            return res.status(401).json({ valid: false, error: "Invalid token" });
        }

        if (tokenData.expires < Date.now()) {
            validTokens.delete(token);
            return res.status(401).json({ valid: false, error: "Token expired" });
        }

        res.json({ 
            valid: true, 
            email: tokenData.email,
            role: 'admin'
        });

    } catch (err) {
        console.error("Verify error:", err);
        res.status(500).json({ error: err.message, valid: false });
    }
};

/**
 * Logout - Invalidate token
 * POST /api/auth/logout
 */
exports.logout = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            validTokens.delete(token);
        }
        res.json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Reset Password - Forgot password (resets to default)
 * POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Find the user
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found with this email" });
        }

        // Reset to default password
        const newPassword = 'reset123456';

        // Update the password
        const db = require('../config/database').getDB();
        await db.collection('users').updateOne(
            { email: email },
            { $set: { password: newPassword } }
        );

        res.json({
            success: true,
            message: "Password reset successfully",
            newPassword: newPassword
        });

    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ error: "Server error. Please try again." });
    }
};

/**
 * Change Password - Authenticated users can update their password
 * POST /api/auth/change-password
 */
exports.changePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        if (!email || !currentPassword || !newPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "New password must be at least 8 characters" });
        }

        // Find the user
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify current password
        if (user.password !== currentPassword) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        // Update password
        const db = require('../config/database').getDB();
        await db.collection('users').updateOne(
            { email: email },
            { $set: { password: newPassword } }
        );

        res.json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (err) {
        console.error("Change password error:", err);
        res.status(500).json({ error: "Server error. Please try again." });
    }
};

// Clean up expired tokens every hour
setInterval(() => {
    const now = Date.now();
    for (const [token, data] of validTokens.entries()) {
        if (data.expires < now) {
            validTokens.delete(token);
        }
    }
}, 3600000);