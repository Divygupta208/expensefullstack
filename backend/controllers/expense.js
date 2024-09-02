const Expense = require("../models/expense");

exports.postAddExpense = async (req, res, next) => {
  const { price, description, category } = req.body;
  console.log("Received request to add expense");
  try {
    const expense = await Expense.create({
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
  try {
    const expenses = await Expense.findAll();

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

  try {
    const result = await Expense.destroy({ where: { id } });

    if (result === 1) {
      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete expense", error: error.message });
  }
};
