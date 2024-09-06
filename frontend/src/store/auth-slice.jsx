import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialAuthState = {
  authToken: localStorage.getItem("token") || null,
  isPremiumUser: localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token")).isPremium
    : false,
  isLoggedIn: localStorage.getItem("isLoggedIn") ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: { initialAuthState },
  reducers: {
    setToken: (state, action) => {
      state.authToken = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("token", action.payload);
      localStorage.setItem("isLoggedIn", true);
    },
    setIsPremium: (state, action) => {
      state.isPremiumUser = action.payload;
    },
  },
});

export default authSlice;
