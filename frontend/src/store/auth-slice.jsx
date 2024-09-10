import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decodedToken.exp < currentTime; // Check if token is expired
  } catch (error) {
    return true; // Consider the token expired if decoding fails
  }
};

const token = localStorage.getItem("token");

const initialAuthState = {
  authToken: token || null,
  userData:
    localStorage.getItem("userData") && !isTokenExpired(token)
      ? JSON.parse(localStorage.getItem("userData"))
      : { name: "ABC", email: "ABC@placeholder.com" },
  isLoggedIn: token && !isTokenExpired(token),
  isPremiumUser:
    token && !isTokenExpired(token) ? jwtDecode(token).isPremium : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setToken: (state, action) => {
      state.authToken = action.payload;
      state.isLoggedIn = !isTokenExpired(action.payload);
      state.isPremiumUser = state.isLoggedIn
        ? jwtDecode(action.payload).isPremium
        : false;
      localStorage.setItem("token", action.payload);
    },
    setIsPremium: (state, action) => {
      state.isPremiumUser = action.payload;
    },
    setUserData: (state, action) => {
      if (
        state.isLoggedIn &&
        state.authToken &&
        !isTokenExpired(state.authToken)
      ) {
        state.userData = action.payload;
        localStorage.setItem("userData", JSON.stringify(action.payload));
      } else {
        state.userData = null;
        localStorage.removeItem("userData");
      }
    },
    logout: (state) => {
      state.authToken = null;
      state.isLoggedIn = false;
      state.isPremiumUser = false;
      state.userData = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    },
  },
});

export default authSlice;
