const express = require("express");
const { handleReferral } = require("../controllers/pointsController");

const router = express.Router();

router.post("/referral", handleReferral);

module.exports = router;
