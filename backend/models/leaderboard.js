const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  badges: {
    type: [String],
    default: [],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
