const Expense = require("../models/expense");
const User = require("../models/user");
const { sequelize } = require("../util/database");
const { Sequelize } = require("sequelize");

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ["id", "name", "email", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};
