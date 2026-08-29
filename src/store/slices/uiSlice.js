// src/store/slices/uiSlice.js
import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sanitizeInput } from "../../utils/security";

const initialState = {
  toasts: [], // [{ id, type: 'success' | 'error' | 'info', message, duration }]
  theme: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addToast: {
      reducer: (state, action) => {
        state.toasts.push(action.payload);
      },
      prepare: ({ message, type = "info", duration = 3500 }) => {
        const id = nanoid();
        return {
          payload: {
            id,
            type,
            message: sanitizeInput(message),
            duration,
          },
        };
      },
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { addToast, removeToast, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;