import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapse: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const { toggleSidebarCollapse, setSidebarCollapse } = uiSlice.actions;

export default uiSlice.reducer;
