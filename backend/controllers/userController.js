const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { checkAndAwardBadges } = require("../utils/badges");

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, referralCode } = req.body;

    if (!name || !email || !password || password !== confirmPassword) {
      return res.status(400).json({ error: "Invalid input data." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      referralCode: generateReferralCode(),
      points: 0,
      pointsStreak: { currentStreak: 0, lastUpdated: new Date() },
      activityStreak: { currentStreak: 0, lastUpdated: new Date() },
      badges: [],
      referrals: [],
    });

    await newUser.save();

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        const referralCount = referrer.referrals.length + 1;

        let points = 10;
        if (referralCount >= 50) points = 100;
        else if (referralCount >= 20) points = 50;
        else if (referralCount >= 5) points = 25;

        referrer.points += points;
        updatePointsStreak(referrer);

        referrer.referrals.push({
          referredUserId: newUser._id,
          pointsAwarded: points,
          date: new Date(),
        });

        referrer.pointHistory.push({
          type: "Referral",
          category: `New User Signup (Tier ${points})`,
          pointsAwarded: points,
          date: new Date(),
        });

        const newBadges = checkAndAwardBadges(referrer);

        await referrer.save();
      }
    }

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser._id,
        name: newUser.name,
        referralCode: newUser.referralCode,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password." });
    }

    updatePointsStreak(user);

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    await user.save();

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        referralCode: user.referralCode,
        pointsStreak: user.pointsStreak.currentStreak,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Server error." });
  }
};

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function updatePointsStreak(user) {
  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const last = new Date(user.pointsStreak.lastUpdated);
  const lastMidnight = new Date(
    last.getFullYear(),
    last.getMonth(),
    last.getDate()
  );

  const dayDifference = Math.floor(
    (todayMidnight - lastMidnight) / (1000 * 3600 * 24)
  );

  if (dayDifference === 1) {
    user.pointsStreak.currentStreak += 1;
    const streakBonus = user.pointsStreak.currentStreak * 10;
    user.points += streakBonus;
    user.pointHistory.push({
      type: "Streak Bonus",
      category: "Points Streak",
      pointsAwarded: streakBonus,
      date: new Date(),
    });
  } else if (dayDifference > 1) {
    user.pointsStreak.currentStreak = 1;
  }

  user.pointsStreak.lastUpdated = todayMidnight;
}

module.exports = {
  registerUser,
  loginUser,
};
