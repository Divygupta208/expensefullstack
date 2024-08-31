import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth-slice";
import utilSlice from "./utility-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    util: utilSlice.reducer,
  },
});

export const authAction = authSlice.actions;
export const utilAction = utilSlice.actions;
export default store;
