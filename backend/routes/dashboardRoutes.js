const express = require("express");
const {
  getUserDashboard,
  getUserStreaks,
  getUserBadges,
  getRecentActivity,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Dashboard routes
router.get("/", authMiddleware, getUserDashboard);
router.get("/streaks", authMiddleware, getUserStreaks);
router.get("/badges", authMiddleware, getUserBadges);
router.get("/activity", authMiddleware, getRecentActivity);

module.exports = router;
