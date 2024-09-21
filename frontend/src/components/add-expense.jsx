import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { easeInOut, motion } from "framer-motion";
import { expenseAction } from "../store/expense-slice";

const AddExpense = () => {
  const priceRef = useRef();
  const descriptionRef = useRef();
  const categoryRef = useRef();
  const divisionRef = useRef();
  const openAddForm = useSelector((state) => state.util.openAddForm);
  const dispatch = useDispatch();
  const token =
    useSelector((state) => state.auth.authToken) ||
    localStorage.getItem("token");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form");

    const newExpense = {
      price: parseFloat(priceRef.current.value),
      description: descriptionRef.current.value,
      category: categoryRef.current.value,
      division: divisionRef.current.value,
    };

    try {
      const response = await fetch("/api/expense/addexpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(expenseAction.addOneExpense(data.expense));
        console.log(data);
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {openAddForm && (
        <motion.div
          initial={{ x: -100, y: 100, scale: 0, opacity: 0 }}
          animate={{ opacity: 1, y: -20, x: 30, scale: 1 }}
          exit={{ x: -100, y: 100, scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: easeInOut }}
          className="absolute container mx-auto p-4 bg-neutral-400 w-[46vw] h-[70vh] bottom-12 rounded-md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                id="price"
                type="number"
                ref={priceRef}
                className="mt-1 block w-full h-9 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter price"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <input
                id="description"
                type="text"
                ref={descriptionRef}
                className="mt-1 h-9 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter description"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                ref={categoryRef}
                className="mt-1 block h-9 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="Groceries">Groceries</option>
                <option value="Transport">Transport</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Dining">Dining</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="division"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="division"
                ref={divisionRef}
                className="mt-1 block h-9 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Expense
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default AddExpense;
