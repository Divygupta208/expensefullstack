import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import { expenseAction } from "../store/expense-slice";

const ExpenseList = ({ overallexpenses, showAddForm }) => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const savedRowsPerPage = localStorage.getItem("rowsPerPage");
    if (savedRowsPerPage) {
      setRowsPerPage(Number(savedRowsPerPage));
    }
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/expense/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        toast.success(data.message);
        dispatch(expenseAction.removeExpense(id));
      } else {
        console.error("Failed to delete expense");
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const handleRowsPerPageChange = (e) => {
    const newRowsPerPage = Number(e.target.value);
    setRowsPerPage(newRowsPerPage);
    localStorage.setItem("rowsPerPage", newRowsPerPage);
  };

  const indexOfLastExpense = currentPage * rowsPerPage;
  const indexOfFirstExpense = indexOfLastExpense - rowsPerPage;
  const currentExpenses = overallexpenses.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );

  const totalPages = Math.ceil(overallexpenses.length / rowsPerPage);

  return (
    <motion.div
      className="relative h-[70vh] md:h-[80vh] ml-0 md:ml-8 w-[100vw] md:w-[45vw] overflow-hidden md:bg-gray-100 bg-white p-6 rounded-lg  shadow-none md:shadow-[0px_15px_30px_rgba(0,0,0,0.3)] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-[#000000] mb-6 bg-[#6524d753] rounded-md p-2">
        Expenditure
      </h2>

      {/* Expenses List */}
      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-6">
          {currentExpenses.map((expense) => (
            <motion.li
              key={expense.id}
              className="p-1 bg-[#a8a8a868] rounded-lg shadow-lg transform transition-transform"
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex justify-between items-center">
                <span>
                  {expense.division === "income" ? (
                    <FaArrowAltCircleDown className="text-green-500" />
                  ) : (
                    <FaArrowAltCircleUp className="text-red-600" />
                  )}
                </span>
                <div>
                  <p className="text-md font-semibold text-gray-800">
                    {expense.description}
                  </p>
                  <p className="text-xs text-gray-500">{expense.createdAt}</p>
                </div>
                <p className="text-md font-bold text-gray-800">
                  ${parseFloat(expense.price).toFixed(2) || "0.00"}
                </p>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(expense.id)}
                >
                  <RiDeleteBin4Fill className="hover:scale-125" />
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center ml-10 md:ml-40">
          <label className="mr-2">Rows:</label>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border p-2 rounded-full shadow-sm"
          >
            {[5, 10, 15, 20].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 bg-blue-500 text-white rounded-full shadow-md mr-2 text-lg"
          >
            ⇦
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-1 text-lg bg-blue-500 text-white rounded-full shadow-md ml-2"
          >
            ⇨
          </button>
        </div>
      </div>
      <motion.div
        onClick={showAddForm}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, y: -5 }}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer absolute bottom-5  left-2 z-30"
      >
        <button>
          <IoIosAddCircleOutline className="w-10 h-10" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ExpenseList;
