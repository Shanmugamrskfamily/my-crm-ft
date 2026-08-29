// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import customerReducer from "./slices/customerSlice";
import leadReducer from "./slices/leadSlice";
import taskReducer from "./slices/taskSlice";
import uiReducer from "./slices/uiSlice";
import { loadState, saveState } from "./storage";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    leads: leadReducer,
    tasks: taskReducer,
    ui: uiReducer,
  },
  preloadedState,
});

// Subscribe to store updates to persist in localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export default store;