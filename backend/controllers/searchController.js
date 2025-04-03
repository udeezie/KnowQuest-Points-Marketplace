const Reward = require("../models/Reward");

const searchRewards = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const rewards = await Reward.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).sort({ pointsRequired: 1 });

    const userPoints = 500;

    const updatedRewards = rewards.map((reward) => ({
      ...reward.toObject(),
      isRedeemable: userPoints >= reward.pointsRequired,
    }));

    return res.status(200).json(updatedRewards);
  } catch (error) {
    console.error("Error searching rewards:", error.message);
    return res.status(500).json({ message: "Server error during search" });
  }
};

module.exports = { searchRewards };
