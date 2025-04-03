const mongoose = require("mongoose");
const User = require("../models/User");

const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      message: "Dashboard data retrieved successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points || 0,
        referralCode: user.referralCode,
        pointsStreak: user.pointsStreak.currentStreak,
        activityStreak: user.activityStreak.currentStreak,
        badges: user.badges,
        pointHistory: user.pointHistory,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const getUserStreaks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({
      pointsStreak: user.pointsStreak.currentStreak,
      activityStreak: user.activityStreak.currentStreak,
      pointHistory: user.pointHistory,
    });
  } catch (error) {
    console.error("Error fetching streak data:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const getUserBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ badges: user.badges });
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ recentActivity: user.activityStreak.lastUpdated });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ message: "An error occurred." });
  }
};

module.exports = {
  getUserDashboard,
  getUserStreaks,
  getUserBadges,
  getRecentActivity,
};
