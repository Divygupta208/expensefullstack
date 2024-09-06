const express = require("express");

const router = express.Router();
const premiumController = require("../controllers/premium");

router.get("/leaderboard", premiumController.getLeaderboard);

module.exports = router;
