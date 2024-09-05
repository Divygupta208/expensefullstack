import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  authToken: null,
  isPremiumUser: false,
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
      localStorage.setItem("isPremium", action.payload);
    },
  },
});

export default authSlice;
