import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import utilSlice from "./utility-slice";
import expenseSlice from "./expense-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    util: utilSlice.reducer,
    expense: expenseSlice.reducer,
  },
});

export const authAction = authSlice.actions;
export const utilAction = utilSlice.actions;
export default store;
