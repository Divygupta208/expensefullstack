import { createSlice } from "@reduxjs/toolkit";

const fetchExpenses = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/expense/getexpense", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();

      dispatch(expenseSlice.actions.setExpenses(data));
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
};

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    items: [],
  },
  reducers: {
    setExpenses: (state, action) => {
      state.items = action.payload;
    },
    addOneExpense: (state, action) => {
      state.items.push(action.payload);
    },
    removeExpense: (state, action) => {
      state.items = state.items.filter(
        (expense) => expense.id !== action.payload
      );
    },
    resetExpenses: (state) => {
      state.items = [];
    },
  },
});
export const expenseAction = {
  ...expenseSlice.actions,
  fetchExpenses,
};
export default expenseSlice;
