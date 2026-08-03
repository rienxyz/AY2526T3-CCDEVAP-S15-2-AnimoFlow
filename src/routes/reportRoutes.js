const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// GET routes (specific before generic)
router.get("/all", reportController.getAllReportsNoFilter);
router.get("/user/:userId", reportController.getReportsByUser);
router.get("/building/:building", reportController.getReportsByBuilding);
router.get("/status/:queueLength", reportController.getReportsByStatus);
router.get("/", reportController.getAllReports);

// POST route
router.post("/", reportController.createReport);

// DELETE routes
router.delete("/id/:id", reportController.deleteReportById);
router.delete("/building/:building", reportController.deleteReportsByBuilding);
router.delete("/status/:queueLength", reportController.deleteReportsByStatus);
router.delete("/user/:userId", reportController.deleteReportsByUser);

module.exports = router;