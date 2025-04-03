const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (Remove the faulty one causing the issue)
router.get("/dashboard", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Welcome to your dashboard", user: req.user });
});

module.exports = router;
