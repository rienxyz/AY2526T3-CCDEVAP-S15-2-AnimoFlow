const ReportModel = require("../models/ReportModel");
const UserModel = require("../models/UserModel");

exports.deleteAllReports = async (req, res) => {
    try {
        const result = await ReportModel.deleteAll();
        res.json({ 
            success: true, 
            deletedCount: result.deletedCount,
            message: `Deleted ${result.deletedCount} reports`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const analytics = await ReportModel.getAnalytics();
        res.json(analytics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.findAll();
        // Remove passwords from response
        const safeUsers = users.map(u => {
            const { password, ...rest } = u;
            return rest;
        });
        res.json(safeUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { email, role } = req.body;
        if (!email || !role) {
            return res.status(400).json({ error: "Email and role required" });
        }
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: "Invalid role. Must be 'user' or 'admin'" });
        }
        
        const result = await UserModel.updateRole(email, role);
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json({ success: true, message: `User ${email} updated to ${role}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};