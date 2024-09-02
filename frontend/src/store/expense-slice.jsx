import { createSlice } from "@reduxjs/toolkit";

const fetchExpenses = () => {
  return async (dispatch) => {
    try {
      const response = await fetch("http://localhost:3000/expense/getexpense");
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
  },
});
export const expenseAction = {
  ...expenseSlice.actions,
  fetchExpenses,
};
export default expenseSlice;
