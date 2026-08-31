// src/store/slices/notificationSlice.js
import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sanitizeInput } from "../../utils/security";

const initialState = {
  queue: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    pushNotification: {
      reducer: (state, action) => {
        state.queue.push(action.payload);
      },
      prepare: ({ message, description = null, type = "info", duration = 3.5 }) => ({
        payload: {
          id: nanoid(),
          type, // 'success' | 'error' | 'info' | 'warning'
          message: sanitizeInput(String(message ?? "")),
          description: description ? sanitizeInput(String(description)) : null,
          duration,
          createdAt: Date.now(),
        },
      }),
    },
    dismissNotification: (state, action) => {
      state.queue = state.queue.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.queue = [];
    },
  },
});

export const { pushNotification, dismissNotification, clearNotifications } =
  notificationSlice.actions;

// Selectors
export const selectPendingNotifications = (state) => state.notifications.queue;

// Convenience action creators
export const notifySuccess = (message, description) =>
  pushNotification({ message, description, type: "success" });
export const notifyError = (message, description) =>
  pushNotification({ message, description, type: "error" });
export const notifyInfo = (message, description) =>
  pushNotification({ message, description, type: "info" });
export const notifyWarning = (message, description) =>
  pushNotification({ message, description, type: "warning" });

export default notificationSlice.reducer;
