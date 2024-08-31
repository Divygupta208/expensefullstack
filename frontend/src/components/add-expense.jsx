import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const AddExpense = () => {
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const openAddForm = useSelector((state) => state.util.openAddForm);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newExpense = {
      price,
      description,
      category,
    };

    console.log("New Expense Added:", newExpense);

    setPrice("");
    setDescription("");
    setCategory("Groceries");
  };

  return (
    <div>
      {openAddForm && (
        <motion.div
          initial={{ x: -100, y: 100, scale: 0, opacity: 0 }}
          animate={{ opacity: 1, y: -20, x: 30, scale: 1 }}
          exit={{ x: -100, y: 100, scale: 0, opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="absolute container mx-auto p-4 bg-gray-300 w-[52vw] h-[71vh] bottom-8 rounded-md"
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
