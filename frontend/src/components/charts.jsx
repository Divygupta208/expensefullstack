import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Sample data from backend
const expenses = [
  { id: 1, description: "Lunch", amount: 15.0, date: "2024-08-30" },
  { id: 2, description: "Groceries", amount: 45.5, date: "2024-08-29" },
  { id: 3, description: "Electricity Bill", amount: 60.0, date: "2024-08-28" },
  { id: 4, description: "Lunch", amount: 70.0, date: "2024-08-28" },
  { id: 4, description: "Makeup", amount: 70.0, date: "2024-08-28" },
  // Add more expenses as needed
];

// Process data for Pie Chart
const processCategoryData = (expenses) => {
  const categories = expenses.reduce((acc, expense) => {
    const category = expense.description; // Replace with actual category if available
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {});

  return Object.keys(categories).map((category) => ({
    name: category,
    value: categories[category],
  }));
};

// Process data for Bar Chart
const processMonthlyData = (expenses) => {
  // Initialize all months with 0 expenses
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
    const date = new Date(expense.date);
    const month = date.toLocaleString("default", { month: "short" }); // Get the short month name (e.g., "Jan")
    monthlyExpenses[month] += expense.amount;
  });

  // Convert the object to an array of objects
  return Object.keys(monthlyExpenses).map((month) => ({
    name: month,
    expenses: monthlyExpenses[month],
  }));
};
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Charts = () => {
  const categoryData = processCategoryData(expenses);
  const monthlyData = processMonthlyData(expenses);

  return (
    <div className="w-full md:w-1/2 lg:w-[40vw] p-0 max-h-[80vh] ml-10">
      <div className="bg-white p-6 rounded-lg shadow-2xl mb-2 ">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          Expenses by Category
        </h2>
        <ResponsiveContainer width="80%" height={200} className="ml-20 p-5">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              outerRadius={80}
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
          Monthly Expenses
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={monthlyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="expenses" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
