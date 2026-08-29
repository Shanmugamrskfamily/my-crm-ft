// src/store/slices/taskSlice.js
import { createSlice, nanoid } from "@reduxjs/toolkit";
import { initialTasks } from "../../mock/initialData";
import { sanitizeInput } from "../../utils/security";

const initialState = {
  items: initialTasks,
  statusFilter: "ALL",
  priorityFilter: "ALL",
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: {
      reducer: (state, action) => {
        state.items.unshift(action.payload);
      },
      prepare: (taskData) => {
        const sanitized = sanitizeInput(taskData);
        return {
          payload: {
            ...sanitized,
            id: `task-${nanoid(6)}`,
            status: sanitized.status || "Todo",
            priority: sanitized.priority || "Medium",
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    updateTask: (state, action) => {
      const sanitized = sanitizeInput(action.payload);
      const index = state.items.findIndex((t) => t.id === sanitized.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...sanitized };
      }
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    changeTaskStatus: (state, action) => {
      const { id, status } = action.payload;
      const task = state.items.find((t) => t.id === id);
      if (task) {
        task.status = status;
      }
    },
    setTaskStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setTaskPriorityFilter: (state, action) => {
      state.priorityFilter = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  changeTaskStatus,
  setTaskStatusFilter,
  setTaskPriorityFilter,
} = taskSlice.actions;

export default taskSlice.reducer;