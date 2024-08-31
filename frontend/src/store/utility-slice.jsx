import { createSlice } from "@reduxjs/toolkit";

const utilSlice = createSlice({
  name: "util",
  initialState: {
    openHomeNav: false,
    openAddForm: false,
  },
  reducers: {
    setOpenHomeNav: (state, action) => {
      state.openHomeNav = action.payload;
    },
    setOpenAddForm: (state, action) => {
      state.openAddForm = action.payload;
    },
  },
});

export default utilSlice;
