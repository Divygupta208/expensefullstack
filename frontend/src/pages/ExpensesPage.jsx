import React from "react";

import MonthlyExpenses from "../components/monthly-expenses";
import YearlyExpenses from "../components/yearly-expenses";
import { useLocation } from "react-router-dom";
import WeeklyExpenses from "../components/weekly-expenses";

const ExpensesPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const filter = query.get("filter");

  if (filter === "weekly") {
    return <WeeklyExpenses />;
  } else if (filter === "monthly") {
    return <MonthlyExpenses />;
  } else if (filter === "yearly") {
    return <YearlyExpenses />;
  } else {
    return <div className="text-6xl text-center">OOPS! Page not found :( </div>;
  }
};

export default ExpensesPage;
