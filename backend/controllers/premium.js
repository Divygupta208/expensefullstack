const Expense = require("../models/expense");
const User = require("../models/user");
const { sequelize } = require("../util/database");
const { Sequelize } = require("sequelize");

exports.getLeaderboard = async (req, res, next) => {
  try {
    // Use a raw SQL query to fetch the leaderboard
    const leaderboard = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        [Sequelize.fn("SUM", Sequelize.col("expenses.price")), "totalExpenses"], // Sum the expenses
      ],
      include: [
        {
          model: Expense, // Associate the Expense model
          attributes: [],
        },
      ],
      group: ["User.id"], // Group by user
      order: [[Sequelize.literal("totalExpenses"), "DESC"]], // Order by total expenses
    });

    // Return the leaderboard
    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};
