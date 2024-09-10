import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { expenseAction } from "../store/expense-slice";

const UserReports = () => {
  const isPremiumUser = true;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(expenseAction.fetchExpenses());
  }, [dispatch]);

  const expenses = useSelector((state) => state.expense.items);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [weekFilter, setWeekFilter] = useState("all");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [yearlyData, setYearlyData] = useState([]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const calculateYearlyData = (expenses, year) => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expense: 0,
      savings: 0,
    }));

    expenses.forEach((expense) => {
      const expDate = new Date(expense.createdAt);
      if (expDate.getFullYear() === year) {
        const month = expDate.getMonth();
        if (expense.division === "expense") {
          monthlyData[month].expense += expense.price;
        } else if (expense.division === "income") {
          monthlyData[month].income += expense.price;
        }
      }
    });

    monthlyData.forEach((data) => {
      data.savings = data.income - data.expense;
    });

    setYearlyData(monthlyData);
  };

  const getWeekStartDate = (year, month, week) => {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const startDay = 1 + (week - 1) * 7 - firstDayOfWeek;
    return new Date(year, month - 1, startDay);
  };

  const getWeekEndDate = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    return endDate;
  };

  const filterExpenses = (expenses, year, month, week) => {
    return expenses.filter((exp) => {
      const expDate = new Date(exp.createdAt);
      const isSameYear = expDate.getFullYear() === year;
      const isSameMonth = expDate.getMonth() + 1 === month;

      if (week === "all") {
        // Filter by year and month only
        return isSameYear && isSameMonth;
      } else {
        // Filter by week
        const weekStartDate = getWeekStartDate(year, month, week);
        const weekEndDate = getWeekEndDate(weekStartDate);
        return (
          isSameYear &&
          isSameMonth &&
          expDate >= weekStartDate &&
          expDate <= weekEndDate
        );
      }
    });
  };

  const calculateTotals = (filteredExpenses) => {
    let expensesSum = 0;
    let incomeSum = 0;
    filteredExpenses.forEach((expense) => {
      if (expense.division === "expense") {
        expensesSum += expense.price;
      } else if (expense.division === "income") {
        incomeSum += expense.price;
      }
    });
    setTotalExpenses(expensesSum);
    setTotalIncome(incomeSum);
  };

  useEffect(() => {
    const filtered = filterExpenses(
      expenses,
      yearFilter,
      monthFilter,
      weekFilter
    );
    setFilteredExpenses(filtered);
    calculateTotals(filtered);
    calculateYearlyData(expenses, yearFilter);
  }, [yearFilter, monthFilter, weekFilter, expenses]);

  const handleDownloadReport = () => {
    console.log("Download report");
  };

  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const weekOptions = ["all", ...Array.from({ length: 5 }, (_, i) => i + 1)]; // Added "all" option

  return (
    <motion.div
      className="report-container p-6 bg-white mt-20 rounded-lg shadow-lg overflow-scroll h-[90vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="filter-row flex justify-between items-center mb-6 space-x-4"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="filters flex items-center">
          <label className="mr-2 font-semibold">Year:</label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(Number(e.target.value))}
            className="border p-2 rounded-md shadow-sm"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="filters flex items-center">
          <label className="mr-2 font-semibold">Month:</label>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(Number(e.target.value))}
            className="border p-2 rounded-md shadow-sm"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="filters flex items-center">
          <label className="mr-2 font-semibold">Week:</label>
          <select
            value={weekFilter}
            onChange={(e) => setWeekFilter(e.target.value)}
            className="border p-2 rounded-md shadow-sm"
          >
            {weekOptions.map((week) => (
              <option key={week} value={week}>
                {week === "all" ? "All Weeks" : `Week ${week}`}
              </option>
            ))}
          </select>
        </div>

        {isPremiumUser && (
          <motion.button
            onClick={handleDownloadReport}
            className="bg-stone-700 text-white p-2 rounded-md shadow-md hover:bg-stone-400"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Download Report
          </motion.button>
        )}
      </motion.div>

      <motion.div
        className="report-details shadow-2xl bg-gray-200 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg font-bold mb-4 text-center rounded-2xl">
          Detailed Reports
        </h2>
        <table className="min-w-full bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <thead className="bg-slate-600 text-white">
            <tr>
              <th className="py-2 px-4 border-b">S.No</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Income</th>
              <th className="py-2 px-4 border-b">Expense</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense, index) => (
              <tr
                key={index}
                className={
                  expense.division === "income"
                    ? "border-b bg-green-200 hover:bg-green-400"
                    : "border-b bg-rose-200 hover:bg-red-500"
                }
              >
                <td className="py-2 px-4 text-center">{index + 1}</td>
                <td className="py-2 px-4 text-center">
                  {new Date(expense.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 text-center">{expense.category}</td>
                <td className="py-2 px-4 text-center">{expense.description}</td>
                <td className="py-2 px-4 text-center">
                  {expense.division === "income"
                    ? `$${expense.price.toFixed(2)}`
                    : ""}
                </td>
                <td className="py-2 px-4">
                  {expense.division === "expense"
                    ? `$${expense.price.toFixed(2)}`
                    : ""}
                </td>
              </tr>
            ))}
            {/* Summary Row */}
            <tr className="bg-gray-200 font-bold">
              <td colSpan="3" className="py-2 px-4">
                Total Expenses
              </td>
              <td className="py-2 px-4 text-center"></td>
              <td></td>
              <td className="py-2 px-4 text-center">
                -${totalExpenses.toFixed(2)}
              </td>
            </tr>
            <tr className="bg-gray-200 font-bold">
              <td colSpan="3" className="py-2 px-4">
                Total Income
              </td>
              <td className="py-2 px-4 text-center"></td>
              <td className="py-2 px-4 text-center">
                +${totalIncome.toFixed(2)}
              </td>
              <td></td>
            </tr>
            <tr className="bg-gray-400 font-bold">
              <td colSpan="3" className="py-2 px-4">
                Net Savings
              </td>
              <td className="py-2 px-4 text-center"></td>
              <td className="py-2 px-4 text-center"></td>
              <td className="py-2 px-4 text-center">
                {totalIncome.toFixed(2) - totalExpenses.toFixed(2)}$
              </td>
            </tr>
          </tbody>
        </table>
      </motion.div>
      <motion.div
        className="yearly-data mt-10 shadow-2xl rounded-xl bg-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-lg font-bold mt-4 mb-2 text-center">
          Annual Report
        </h2>
        <table className="min-w-full bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <thead className="bg-slate-600 text-white">
            <tr>
              <th className="py-2 px-4 border-b">Month</th>
              <th className="py-2 px-4 border-b">Income</th>
              <th className="py-2 px-4 border-b">Expense</th>
              <th className="py-2 px-4 border-b">Savings</th>
            </tr>
          </thead>
          <tbody>
            {yearlyData.map((data, index) => (
              <tr
                key={index}
                className={
                  data.savings >= 0
                    ? "border-b bg-white hover:bg-green-400"
                    : "border-b bg-rose-200 hover:bg-red-500"
                }
              >
                <td className="py-2 px-4 text-center">
                  {monthNames[data.month - 1]}
                </td>
                <td className="py-2 px-4 text-center">
                  ${data.income.toFixed(2)}
                </td>
                <td className="py-2 px-4 text-center">
                  ${data.expense.toFixed(2)}
                </td>
                <td className="py-2 px-4 text-center">
                  ${data.savings.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default UserReports;
