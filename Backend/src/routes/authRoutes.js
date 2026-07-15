const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/admin/login", authController.adminLogin);
router.get("/verify", authController.verifyAdmin);
router.post("/logout", authController.logout);

module.exports = router;