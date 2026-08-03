const express = require("express");
const router = express.Router();
const directionController = require("../controllers/directionController");

router.get("/", directionController.getDirection);
router.get("/all", directionController.getAllDirections);
router.post("/", directionController.upsertDirection);

module.exports = router;