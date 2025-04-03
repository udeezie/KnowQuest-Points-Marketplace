const mongoose = require("mongoose");

const ReferralLogSchema = new mongoose.Schema({
  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  pointsAwarded: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const PointHistorySchema = new mongoose.Schema({
  type: { type: String, required: true },
  category: { type: String, required: true },
  pointsAwarded: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  referralCode: { type: String, unique: true, required: true },
  referrals: { type: [ReferralLogSchema], default: [] },
  pointsStreak: {
    currentStreak: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  activityStreak: {
    currentStreak: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  badges: { type: [String], default: [] },
  pointHistory: { type: [PointHistorySchema], default: [] }, // Add point history
});

module.exports = mongoose.model("User", UserSchema);
