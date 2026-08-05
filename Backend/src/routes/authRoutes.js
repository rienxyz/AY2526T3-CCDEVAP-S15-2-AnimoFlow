const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ===== PUBLIC ROUTES =====
// User registration
router.post("/register", authController.register);

// User login
router.post("/login", authController.login);

// Admin login
router.post("/admin/login", authController.adminLogin);

// Verify admin token
router.get("/verify", authController.verifyAdmin);

// Logout
router.post("/logout", authController.logout);

// ===== PASSWORD MANAGEMENT =====
// Forgot password - reset to default
router.post("/reset-password", authController.resetPassword);

// Change password - authenticated users
router.post("/change-password", authController.changePassword);

module.exports = router;