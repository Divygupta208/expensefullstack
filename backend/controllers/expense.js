const Expense = require("../models/expense");

exports.postAddExpense = async (req, res, next) => {
  const { price, description, category } = req.body;

  try {
    const user = req.user;

    const expense = await user.createExpense({
      price,
      description,
      category,
    });

    return res.status(201).json({
      message: "Expense added successfully",
      expense: {
        ...expense.toJSON(),
        createdAt: expense.createdAt.toISOString().split("T")[0],
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to add expense",
      error: error.message,
    });
  }
};

exports.getExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.findAll({
      where: { userId },
    });

    const formattedExpenses = expenses.map((expense) => {
      return {
        ...expense.toJSON(),
        createdAt: expense.createdAt.toISOString().split("T")[0],
      };
    });

    return res.status(200).json(formattedExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({ message: "Failed to fetch expenses." });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await Expense.destroy({ where: { id, userId } });

    if (result === 1) {
      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ message: "Expense not found or not authorized" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete expense", error: error.message });
  }
};
