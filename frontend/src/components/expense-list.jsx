import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin4Fill } from "react-icons/ri";
import expenseSlice, { expenseAction } from "../store/expense-slice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExpenseList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(expenseAction.fetchExpenses());
  }, [dispatch]);

  const expenses = useSelector((state) => state.expense.items);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/expense/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        toast.success(data.message);
        dispatch(expenseAction.removeExpense(id));
      } else {
        console.error("Failed to delete expense");
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  return (
    <motion.div
      className=" w-full max-h-[70vh] ml-8 mt-5 md:w-1/3 lg:w-1/2 bg-gradient-to-r from-black via-slate-800 to-black p-6 rounded-lg shadow-[0px_15px_30px_rgba(0,0,0,0.3)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-extrabold text-white mb-6">Expense List</h2>
      <ul className="space-y-6">
        {expenses.map((expense) => (
          <motion.li
            key={expense.id}
            className="p-1 bg-white rounded-sm shadow-lg transform transition-transform"
            whileHover={{
              scale: 1.02,
              boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-md font-semibold text-gray-800">
                  {expense.description}
                </p>
                <p className="text-xs text-gray-500">{expense.createdAt}</p>
              </div>
              <p className="text-md font-bold text-gray-800">
                ${parseFloat(expense.price).toFixed(2) || "0.00"}
              </p>
              <Link
                to={``}
                className="text-red-500 hover:underline"
                onClick={() => handleDelete(expense.id)}
              >
                <RiDeleteBin4Fill className="hover:scale-125" />
              </Link>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ExpenseList;
