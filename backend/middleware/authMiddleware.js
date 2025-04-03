const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader)
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format." });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      points: user.points,
    }; 

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expired. Please log in again." });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(400)
        .json({ error: "Invalid token. Authentication failed." });
    } else {
      console.error("Unexpected auth error:", error);
      return res.status(500).json({ error: "Server error." });
    }
  }
};

module.exports = authMiddleware;
