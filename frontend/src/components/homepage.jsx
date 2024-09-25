import React, { useEffect, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import ExpenseList from "./expense-list";
import { IoIosAddCircleOutline } from "react-icons/io";
import Charts from "./charts";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { utilAction } from "../store/store";
import AddExpense from "./add-expense";
import LocomotiveScroll from "locomotive-scroll";
import { expenseAction } from "../store/expense-slice";
import "locomotive-scroll/dist/locomotive-scroll.css"; // Locomotive Scroll CSS

const Homepage = () => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const userIsPremium = useSelector((state) => state.auth.isPremiumUser);
  useEffect(() => {
    dispatch(expenseAction.fetchExpenses());
  }, [dispatch]);

  const expenses = useSelector((state) => state.expense.items);

  const openAddForm = useSelector((state) => state.util.openAddForm);
  const showAddForm = (e) => {
    e.preventDefault();
    dispatch(utilAction.setOpenAddForm(!openAddForm));
  };
  useEffect(() => {
    dispatch(expenseAction.fetchExpenses());
  }, [dispatch]);

  return (
    <div
      ref={scrollRef}
      className="bg-white top-20 relative overflow-scroll h-[100vh]"
    >
      <div className="flex md:flex-row flex-col">
        <div className="w-full">
          <ExpenseList overallexpenses={expenses} showAddForm={showAddForm} />
        </div>
        <div className="w-full">
          <Charts overallexpenses={expenses} filter="weekly" />
        </div>
      </div>
      <Outlet />
      <AddExpense />
    </div>
  );
};

export default Homepage;
