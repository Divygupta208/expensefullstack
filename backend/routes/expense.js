const express = require("express");

const router = express.Router();
const expenseController = require("../controllers/expense");

router.post("/addexpense", expenseController.postAddExpense);
router.get("/getexpense", expenseController.getExpenses);
router.delete("/delete/:id", expenseController.deleteExpense);

module.exports = router;
