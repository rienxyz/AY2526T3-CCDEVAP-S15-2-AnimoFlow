const ReportModel = require("../models/ReportModel");

exports.getAllReports = async (req, res) => {
    try {
        const reports = await ReportModel.findRecent(30);
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllReportsNoFilter = async (req, res) => {
    try {
        const reports = await ReportModel.findAll();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReportsByUser = async (req, res) => {
    try {
        const reports = await ReportModel.findByUser(req.params.userId);
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReportsByBuilding = async (req, res) => {
    try {
        const reports = await ReportModel.findByBuilding(req.params.building);
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReportsByStatus = async (req, res) => {
    try {
        const reports = await ReportModel.findByStatus(req.params.queueLength);
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createReport = async (req, res) => {
    try {
        const report = req.body;

        // Guest check
        if (report.userId === 'guest_user' || 
            report.userId === 'guest' || 
            report.userId === 'guest@animoflow.local') {
            return res.status(403).json({ 
                error: "Guest users cannot submit reports. Please login with your DLSU email." 
            });
        }

        // Validate fields
        if (
            typeof report.building !== "string" ||
            typeof report.elevator !== "string" ||
            typeof report.queueLength !== "string" ||
            typeof report.userId !== "string" ||
            report.building.trim() === "" ||
            report.elevator.trim() === "" ||
            report.userId.trim() === "" ||
            !["short", "medium", "long"].includes(report.queueLength)
        ) {
            return res.status(400).json({
                error: "Invalid report format."
            });
        }

        const result = await ReportModel.create(report);
        res.status(201).json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteReportById = async (req, res) => {
    try {
        const result = await ReportModel.deleteById(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteReportsByBuilding = async (req, res) => {
    try {
        const result = await ReportModel.deleteByBuilding(req.params.building);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteReportsByStatus = async (req, res) => {
    try {
        const result = await ReportModel.deleteByStatus(req.params.queueLength);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteReportsByUser = async (req, res) => {
    try {
        const result = await ReportModel.deleteByUser(req.params.userId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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