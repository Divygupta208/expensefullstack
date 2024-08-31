import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Sample expense data (in practice, this would come from an API)
const sampleExpenseData = {
  1: {
    id: 1,
    description: "Lunch",
    amount: 15.0,
    date: "2024-08-30",
    details: "Lunch at the cafe.",
  },
  2: {
    id: 2,
    description: "Groceries",
    amount: 45.5,
    date: "2024-08-29",
    details: "Weekly grocery shopping.",
  },
  3: {
    id: 3,
    description: "Electricity Bill",
    amount: 60.0,
    date: "2024-08-28",
    details: "Monthly electricity bill.",
  },
  // Add more expenses as needed
};

const SingleExpense = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);

  useEffect(() => {
    setExpense(sampleExpenseData[id]);
  }, [id]);

  if (!expense) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-black via-teal-500 to-blue-600 p-8 rounded-lg shadow-2xl transform transition-transform hover:scale-105 hover:shadow-3xl">
      <h2 className="text-3xl font-extrabold text-white mb-6">
        Expense Details
      </h2>
      <div className="mb-6">
        <p className="text-2xl font-semibold text-white">
          Description: <span className="text-white">{expense.description}</span>
        </p>
        <p className="text-xl text-gray-200">Date: {expense.date}</p>
        <p className="text-2xl font-bold text-white">
          Amount:{" "}
          <span className="text-white">${expense.amount.toFixed(2)}</span>
        </p>
      </div>
      <p className="text-lg text-gray-100">{expense.details}</p>
    </div>
  );
};

export default SingleExpense;
