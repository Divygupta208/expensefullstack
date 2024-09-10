const Expense = require("../models/expense");
const sequelize = require("../util/database");

exports.postAddExpense = async (req, res, next) => {
  const { price, description, category, division } = req.body;

  const t = await sequelize.transaction();

  try {
    const user = req.user;

    const expense = await user.createExpense(
      {
        price,
        description,
        category,
        division,
      },
      { transaction: t }
    );

    user.totalExpense = (user.totalExpense || 0) + price;
    await user.save({ transaction: t });

    await t.commit();

    return res.status(201).json({
      message: "Expense added successfully",
      expense: {
        ...expense.toJSON(),
      },
    });
  } catch (error) {
    await t.rollback();

    console.error("Failed to add expense:", error);
    return res.status(500).json({
      message: "Failed to add expense",
      error: error.message,
    });
  }
};

const formatDateToLocalYYYYMMDD = (dateString) => {
  const date = new Date(dateString);

  // Get the local date parts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

exports.getExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.findAll({
      where: { userId: userId },
    });

    const formattedExpenses = expenses.map((expense) => {
      return {
        ...expense.toJSON(),
        createdAt: formatDateToLocalYYYYMMDD(expense.createdAt),
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
  const t = await sequelize.transaction();

  try {
    const result = await Expense.destroy(
      { where: { id, userId } },
      { transaction: t }
    );

    if (result === 1) {
      await t.commit();
      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      await t.rollback();
      res.status(404).json({ message: "Expense not found or not authorized" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete expense", error: error.message });
  }
};
