import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "react-tippy/dist/tippy.css";
import { Tooltip as Tippy } from "react-tippy";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend,
} from "recharts";
import { FaInfoCircle } from "react-icons/fa";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
// Helper function to calculate the start date of the selected week
const getWeekStartDate = (weeksAgo) => {
  const now = new Date();
  const todayDayOfWeek = now.getDay();
  const diff = todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1; // Adjust if today is Sunday
  const startOfCurrentWeek = new Date(now.setDate(now.getDate() - diff));
  startOfCurrentWeek.setHours(0, 0, 0, 0); // Set to the start of the day

  // Adjust for previous weeks based on weeksAgo (e.g., -1 for last week)
  startOfCurrentWeek.setDate(
    startOfCurrentWeek.getDate() - 7 * Math.abs(weeksAgo)
  );

  return startOfCurrentWeek;
};

const processCategoryData = (expenses) => {
  const categories = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(expense.price);
    return acc;
  }, {});

  return Object.keys(categories).map((category) => ({
    name: category,
    value: categories[category],
  }));
};

const processMonthlyData = (expenses) => {
  const monthlyExpenses = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  expenses.forEach((expense) => {
    const date = new Date(expense.createdAt);
    const month = date.toLocaleString("default", { month: "short" });
    monthlyExpenses[month] += parseFloat(expense.price);
  });

  return Object.keys(monthlyExpenses).map((month) => ({
    name: month,
    expenses: monthlyExpenses[month],
  }));
};

const processWeeklyData = (expenses, selectedWeekStart) => {
  console.log("expenses", expenses);

  const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Create the weekDaysWithDates array with zeroed expenses
  const weekDaysWithDates = orderedDays.map((day, index) => {
    const currentDate = new Date(selectedWeekStart);
    currentDate.setDate(selectedWeekStart.getDate() + index);
    return {
      name: `${day} (${currentDate.getDate()})`,
      date: currentDate,
      expenses: 0,
    };
  });

  // Accumulate expenses for each day
  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.createdAt);
    expenseDate.setHours(0, 0, 0, 0); // Strip time for accurate comparison

    // Find the corresponding day in the week and add the expense
    weekDaysWithDates.forEach((dayData) => {
      const dayDate = new Date(dayData.date);
      dayDate.setHours(0, 0, 0, 0); // Strip time for accurate comparison

      if (
        expenseDate.getFullYear() === dayDate.getFullYear() &&
        expenseDate.getMonth() === dayDate.getMonth() &&
        expenseDate.getDate() === dayDate.getDate()
      ) {
        dayData.expenses += parseFloat(expense.price);
      }
    });
  });

  console.log("Week Days Data:", weekDaysWithDates);
  return weekDaysWithDates;
};

const processYearlyData = (expenses) => {
  const yearlyExpenses = {};

  expenses.forEach((expense) => {
    const year = new Date(expense.createdAt).getFullYear();
    if (!yearlyExpenses[year]) yearlyExpenses[year] = 0;
    yearlyExpenses[year] += parseFloat(expense.price);
  });

  return Object.keys(yearlyExpenses).map((year) => ({
    name: year,
    expenses: yearlyExpenses[year],
  }));
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Charts = ({ overallexpenses, filter }) => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const isPremiumUser = useSelector((state) => state.auth.isPremiumUser);

  const handleWeekChange = (e) => {
    setSelectedWeek(Number(e.target.value));
  };

  const categoryData = processCategoryData(overallexpenses);

  let chartData;
  if (filter === "weekly") {
    const selectedWeekStart = getWeekStartDate(selectedWeek);
    chartData = processWeeklyData(overallexpenses, selectedWeekStart);
  } else if (filter === "monthly") {
    chartData = processMonthlyData(overallexpenses);
  } else if (filter === "yearly") {
    chartData = processYearlyData(overallexpenses);
  }

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#d88484"];
  const getRandomColor = (index) => {
    return colors[index % colors.length]; // Cycle through the colors array based on the index
  };

  return (
    <div className="">
      <div className="bg-white p-4 rounded-lg shadow-none md:shadow-2xl w-[100vw] md:w-[40vw] h-[100vh] md:h-[80vh]">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Expenses by Category
        </h2>

        <ResponsiveContainer width="80%" height={200} className="ml-20 p-5">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              outerRadius={70}
              fill="#8884d8"
              label
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Expenses Though Days
        </h2>
        <div className="flex">
          {!isPremiumUser && (
            <Tippy
              animation="scale"
              title="This is a premium feature ⭐⭐"
              position="top"
              trigger="mouseenter"
              inertia={true}
              theme="light"
            >
              <FaInfoCircle
                style={{ cursor: "pointer" }}
                className="text-red-600"
              />
            </Tippy>
          )}
          <select
            className="mb-4 p-2 border border-gray-300 rounded-xl"
            value={selectedWeek}
            onChange={handleWeekChange}
            disabled={!isPremiumUser}
          >
            <option value={0}>Current Week</option>
            <option value={1}>Last Week</option>
            <option value={2}>2 Weeks Ago</option>
            <option value={3}>3 Weeks Ago</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="expenses">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRandomColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
