const express = require("express");
const router = express.Router();
const { searchRewards } = require("../controllers/searchController");

router.get("/", searchRewards);

module.exports = router;
