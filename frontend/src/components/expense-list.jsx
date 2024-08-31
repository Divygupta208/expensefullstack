import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Sample expense data
const expenses = [
  { id: 1, description: "Lunch", amount: 15.0, date: "2024-08-30" },
  { id: 2, description: "Groceries", amount: 45.5, date: "2024-08-29" },
  { id: 3, description: "Electricity Bill", amount: 60.0, date: "2024-08-28" },
  // Add more expenses as needed
];

const ExpenseList = () => {
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
            className="p-6 bg-white rounded-lg shadow-lg transform transition-transform"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {expense.description}
                </p>
                <p className="text-sm text-gray-500">{expense.date}</p>
              </div>
              <p className="text-xl font-bold text-gray-800">
                ${expense.amount.toFixed(2)}
              </p>
              <Link
                to={`/expenses/${expense.id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ExpenseList;
