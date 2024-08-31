import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") ? true : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: { initialAuthState },
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export default authSlice;
