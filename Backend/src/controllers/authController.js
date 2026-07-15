const UserModel = require("../models/UserModel");
const crypto = require("crypto");

// Admin credentials (hardcoded as per limitation)
const ADMIN_CREDENTIALS = [
    { email: 'admin@dlsu.edu.ph', password: 'admin123' },
    { email: 'admin.animoflow@dlsu.edu.ph', password: 'admin123' }
];

const validTokens = new Map();

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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        let user = await UserModel.findByEmail(email);

        if (!user) {
            // Auto-register user (as per limitation - no password hashing)
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
                expires: Date.now() + 3600000
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
            expires: Date.now() + 3600000
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

exports.verifyAdmin = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "No token provided" });
        }

        const token = authHeader.replace('Bearer ', '');
        const tokenData = validTokens.get(token);
        if (!tokenData) {
            return res.status(401).json({ error: "Invalid token" });
        }

        if (tokenData.expires < Date.now()) {
            validTokens.delete(token);
            return res.status(401).json({ error: "Token expired" });
        }

        res.json({ 
            valid: true, 
            email: tokenData.email,
            role: 'admin'
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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

// Clean up expired tokens
setInterval(() => {
    const now = Date.now();
    for (const [token, data] of validTokens.entries()) {
        if (data.expires < now) {
            validTokens.delete(token);
        }
    }
}, 3600000);