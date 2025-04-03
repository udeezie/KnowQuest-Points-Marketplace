const express = require("express");
const Reward = require("../models/Reward");

const router = express.Router();

// Get all rewards
router.get("/", async (req, res) => {
  try {
    const rewards = await Reward.find().sort({ createdAt: -1 });
    res.status(200).json(rewards);
  } catch (error) {
    console.error("Error fetching rewards:", error);
    res.status(500).json({ error: "Failed to fetch rewards" });
  }
});

// Get a single reward by ID
router.get("/:id", async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) return res.status(404).json({ error: "Reward not found" });
    res.status(200).json(reward);
  } catch (error) {
    console.error("Error fetching reward:", error);
    res.status(500).json({ error: "Failed to fetch reward" });
  }
});

// Create a new reward
router.post("/", async (req, res) => {
  try {
    const { name, description, pointsRequired, category, imageUrl } = req.body;
    if (!name || !description || !pointsRequired || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newReward = new Reward({
      name,
      description,
      pointsRequired,
      category,
      imageUrl,
    });
    await newReward.save();
    res
      .status(201)
      .json({ message: "Reward created successfully", reward: newReward });
  } catch (error) {
    console.error("Error creating reward:", error);
    res.status(500).json({ error: "Failed to create reward" });
  }
});

// Update an existing reward
router.put("/:id", async (req, res) => {
  try {
    const updatedReward = await Reward.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReward)
      return res.status(404).json({ error: "Reward not found" });
    res
      .status(200)
      .json({ message: "Reward updated successfully", reward: updatedReward });
  } catch (error) {
    console.error("Error updating reward:", error);
    res.status(500).json({ error: "Failed to update reward" });
  }
});

// Delete a reward
router.delete("/:id", async (req, res) => {
  try {
    const deletedReward = await Reward.findByIdAndDelete(req.params.id);
    if (!deletedReward)
      return res.status(404).json({ error: "Reward not found" });
    res.status(200).json({ message: "Reward deleted successfully" });
  } catch (error) {
    console.error("Error deleting reward:", error);
    res.status(500).json({ error: "Failed to delete reward" });
  }
});

module.exports = router;
