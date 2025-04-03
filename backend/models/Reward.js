const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  pointsRequired: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "Travel",
      "Electronics",
      "Fashion",
      "Food & Dining",
      "Entertainment",
      "Health & Wellness",
      "Education",
      "Charity",
      "Gaming",
      "Luxury",
      "Hobbies",
      "Home & Kitchen",
      "Outdoors",
      "Music",
      "Tech",
      "Sports",
      "Photography",
      "Art",
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Reward", RewardSchema);
