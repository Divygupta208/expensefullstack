import { createSlice } from "@reduxjs/toolkit";

const fetchExpenses = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3001/api/expense/getexpense",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();

      console.log("Fetched data:", data);

      const dailyExpenses = categorizeExpenses(data, "daily");
      const weeklyExpenses = categorizeExpenses(data, "weekly");
      const monthlyExpenses = categorizeExpenses(data, "monthly");
      const yearlyExpenses = categorizeExpenses(data, "yearly");

      dispatch(
        expenseSlice.actions.setExpenses({
          items: data,
          dailyExpenses,
          weeklyExpenses,
          monthlyExpenses,
          yearlyExpenses,
        })
      );
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
};

const categorizeExpenses = (expenses, period) => {
  const now = new Date();
  const startOfWeek = (date) => {
    const day = date.getDay() || 7;
    if (day !== 1) {
      date.setDate(date.getDate() - (day - 1));
    }
    return date;
  };

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.createdAt);
    switch (period) {
      case "daily":
        return expenseDate.toDateString() === now.toDateString();
      case "weekly":
        return expenseDate >= startOfWeek(new Date()) && expenseDate <= now;
      case "monthly":
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      case "yearly":
        return expenseDate.getFullYear() === now.getFullYear();
      default:
        return false;
    }
  });
};

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    items: [],
    dailyExpenses: [],
    weeklyExpenses: [],
    monthlyExpenses: [],
    yearlyExpenses: [],
  },
  reducers: {
    setExpenses: (state, action) => {
      state.items = action.payload.items;
      state.dailyExpenses = action.payload.dailyExpenses;
      state.weeklyExpenses = action.payload.weeklyExpenses;
      state.monthlyExpenses = action.payload.monthlyExpenses;
      state.yearlyExpenses = action.payload.yearlyExpenses;
    },
    addOneExpense: (state, action) => {
      state.items.push(action.payload);

      const daily = categorizeExpenses([action.payload], "daily");
      const weekly = categorizeExpenses([action.payload], "weekly");
      const monthly = categorizeExpenses([action.payload], "monthly");
      const yearly = categorizeExpenses([action.payload], "yearly");

      state.dailyExpenses = [...state.dailyExpenses, ...daily];
      state.weeklyExpenses = [...state.weeklyExpenses, ...weekly];
      state.monthlyExpenses = [...state.monthlyExpenses, ...monthly];
      state.yearlyExpenses = [...state.yearlyExpenses, ...yearly];
    },
    removeExpense: (state, action) => {
      state.items = state.items.filter(
        (expense) => expense.id !== action.payload
      );

      state.dailyExpenses = categorizeExpenses(state.items, "daily");
      state.weeklyExpenses = categorizeExpenses(state.items, "weekly");
      state.monthlyExpenses = categorizeExpenses(state.items, "monthly");
      state.yearlyExpenses = categorizeExpenses(state.items, "yearly");
    },
    resetExpenses: (state) => {
      state.items = [];
      state.dailyExpenses = [];
      state.weeklyExpenses = [];
      state.monthlyExpenses = [];
      state.yearlyExpenses = [];
    },
  },
});

export const expenseAction = {
  ...expenseSlice.actions,
  fetchExpenses,
};
export default expenseSlice;
