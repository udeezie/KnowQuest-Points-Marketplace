const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
  try {
    const leaders = await User.find({}).sort({ points: -1 }).limit(20);
    res.json(leaders);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
