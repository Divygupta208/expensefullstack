import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  authToken: null,
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
  },
});

export default authSlice;
