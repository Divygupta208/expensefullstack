import React from "react";
import { Link, Outlet } from "react-router-dom";
import ExpenseList from "./expense-list";
import { IoIosAddCircleOutline } from "react-icons/io";
import Charts from "./charts";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { utilAction } from "../store/store";
import AddExpense from "./add-expense";

const Homepage = () => {
  const dispatch = useDispatch();
  const openAddForm = useSelector((state) => state.util.openAddForm);
  const showAddForm = () => {
    dispatch(utilAction.setOpenAddForm(!openAddForm));
  };

  return (
    <div className="bg-white relative">
      <div className="flex flex-col md:flex-row">
        <ExpenseList />
        <Charts />
      </div>
      <Outlet />
      <motion.div
        onClick={showAddForm}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, y: -5 }}
        className=" w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer absolute bottom-7 left-4 z-50"
      >
        <Link to={""}>
          <IoIosAddCircleOutline className="w-10 h-10" />
        </Link>
      </motion.div>
      <AddExpense />
    </div>
  );
};

export default Homepage;
