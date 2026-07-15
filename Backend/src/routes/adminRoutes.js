const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyAdmin } = require("../controllers/authController");

// All admin routes require admin verification
router.use(verifyAdmin);

router.delete("/reports/all", adminController.deleteAllReports);
router.get("/analytics", adminController.getAnalytics);
router.get("/users", adminController.getAllUsers);
router.put("/users/role", adminController.updateUserRole);

module.exports = router;