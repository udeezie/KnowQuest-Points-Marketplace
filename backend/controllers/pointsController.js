const mongoose = require("mongoose");
const User = require("../models/User");
const { checkAndAwardBadges } = require("../utils/badges");

const handleReferral = async (req, res) => {
  try {
    const { referrerId, referredUserId } = req.body;

    if (!referrerId || !referredUserId || referrerId === referredUserId) {
      return res.status(400).json({ error: "Invalid referral details." });
    }

    const referrer = await User.findById(referrerId);
    if (!referrer) {
      return res.status(404).json({ error: "Referrer not found." });
    }

    const alreadyReferred = referrer.referrals.some(
      (log) => log.referredUserId.toString() === referredUserId
    );

    if (alreadyReferred) {
      return res.status(400).json({ error: "Referral already exists." });
    }

    const referralCount = referrer.referrals.length + 1;
    const points = calculateReferralPoints(referralCount);
    referrer.points += points;

    updatePointsStreak(referrer, points);
    updateActivityStreak(referrer, "Referral");

    referrer.referrals.push({
      referredUserId: mongoose.Types.ObjectId(referredUserId),
      pointsAwarded: points,
      date: new Date(),
    });

    referrer.pointHistory.push({
      type: "Referral",
      category: `New User Signup (Tier ${points})`,
      pointsAwarded: points,
      date: new Date(),
    });

    const newBadges = checkAndAwardBadges(referrer); // handles reward + history

    await referrer.save();

    res.status(200).json({
      message: `Referral successful. ${points} points awarded.`,
      totalPoints: referrer.points,
      pointsStreak: referrer.pointsStreak.currentStreak,
      activityStreak: referrer.activityStreak.currentStreak,
      newBadgesEarned: newBadges,
      pointHistory: referrer.pointHistory,
    });
  } catch (error) {
    console.error("Error processing referral:", error);
    res.status(500).json({ error: "Error processing referral." });
  }
};

function calculateReferralPoints(referralCount) {
  if (referralCount >= 25) return 1250;
  if (referralCount >= 10) return 500;
  return 50;
}

const pointsStreakBonuses = [
  { days: 30, bonus: 300 },
  { days: 14, bonus: 120 },
  { days: 7, bonus: 50 },
  { days: 3, bonus: 20 },
];

function updatePointsStreak(user, pointsAwarded) {
  if (!pointsAwarded || pointsAwarded <= 0) return;

  const today = new Date();
  const lastUpdated = new Date(user.pointsStreak.lastUpdated);
  const dayDiff = Math.floor((today - lastUpdated) / (1000 * 3600 * 24));

  if (dayDiff === 1) {
    user.pointsStreak.currentStreak += 1;
    const bonus = calculateStreakBonus(user.pointsStreak.currentStreak);
    if (bonus > 0) {
      user.points += bonus;
      user.pointHistory.push({
        type: "Streak Bonus",
        category: "Points Streak",
        pointsAwarded: bonus,
        date: today,
      });
    }
  } else if (dayDiff >= 2) {
    user.pointsStreak.currentStreak = 1;
  }

  user.pointsStreak.lastUpdated = today;
}

function calculateStreakBonus(streakDays) {
  const milestone = pointsStreakBonuses.find((m) => m.days === streakDays);
  return milestone ? milestone.bonus : 0;
}

const activityStreakMilestones = [
  { days: 100, points: 500, badge: "Centurion" },
  { days: 30, points: 200, badge: "Monthly Hero" },
  { days: 7, points: 50, badge: "Weekly Star" },
];

function updateActivityStreak(user, activityDescription) {
  if (!activityDescription) return;

  const today = new Date();
  const last = new Date(user.activityStreak.lastUpdated);
  const diff = Math.floor((today - last) / (1000 * 3600 * 24));

  if (diff === 1) {
    user.activityStreak.currentStreak += 1;
    const milestone = activityStreakMilestones.find(
      (m) => m.days === user.activityStreak.currentStreak
    );
    if (milestone) {
      user.points += milestone.points;
      user.pointHistory.push({
        type: "Activity Bonus",
        category: milestone.badge,
        pointsAwarded: milestone.points,
        date: today,
      });
      if (!user.badges.includes(milestone.badge)) {
        user.badges.push(milestone.badge);
      }
    }
  } else if (diff >= 2) {
    user.activityStreak.currentStreak = 1;
  }

  user.activityStreak.lastUpdated = today;
}

module.exports = { handleReferral };
