const express = require("express");
const router = express.Router();
const leaderController = require("../controllers/leaderController");

// GET /api/leaderboard
router.get("/", leaderController.getLeaderboard);

module.exports = router;
