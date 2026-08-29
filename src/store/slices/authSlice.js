// src/store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { sanitizeInput } from "../../utils/security";

const initialState = {
  user: null, // { email, name, role }
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const sanitized = sanitizeInput(action.payload);
      state.user = sanitized.user;
      state.token = sanitized.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;