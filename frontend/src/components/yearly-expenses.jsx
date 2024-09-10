import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import ExpenseList from "./expense-list";
import { IoIosAddCircleOutline } from "react-icons/io";
import Charts from "./charts";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { utilAction } from "../store/store";
import AddExpense from "./add-expense";
import { expenseAction } from "../store/expense-slice";

const YearlyExpenses = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(expenseAction.fetchExpenses());
  }, [dispatch]);

  const yearlyExpenses = useSelector((state) => state.expense.yearlyExpenses);
  const overallExpenses = useSelector((state) => state.expense.items);

  const openAddForm = useSelector((state) => state.util.openAddForm);
  const showAddForm = () => {
    dispatch(utilAction.setOpenAddForm(!openAddForm));
  };

  return (
    <div className="bg-white relative">
      <div className="flex flex-col md:flex-row">
        <ExpenseList
          overallexpenses={yearlyExpenses}
          showAddForm={showAddForm}
        />
        <Charts overallexpenses={overallExpenses} filter="yearly" />
      </div>
      <Outlet />

      <AddExpense />
    </div>
  );
};

export default YearlyExpenses;
