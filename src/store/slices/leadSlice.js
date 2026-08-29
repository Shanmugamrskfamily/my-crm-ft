// src/store/slices/leadSlice.js
import { createSlice, nanoid } from "@reduxjs/toolkit";
import { initialLeads } from "../../mock/initialData";
import { sanitizeInput } from "../../utils/security";

const initialState = {
  items: initialLeads,
  searchTerm: "",
  statusFilter: "ALL",
  sortBy: "createdDate",
  sortOrder: "desc",
};

const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    addLead: {
      reducer: (state, action) => {
        state.items.unshift(action.payload);
      },
      prepare: (leadData) => {
        const sanitized = sanitizeInput(leadData);
        return {
          payload: {
            ...sanitized,
            id: `lead-${nanoid(6)}`,
            status: sanitized.status || "New",
            createdDate: new Date().toISOString(),
          },
        };
      },
    },
    updateLead: (state, action) => {
      const sanitized = sanitizeInput(action.payload);
      const index = state.items.findIndex((l) => l.id === sanitized.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...sanitized };
      }
    },
    deleteLead: (state, action) => {
      state.items = state.items.filter((l) => l.id !== action.payload);
    },
    changeLeadStatus: (state, action) => {
      const { id, status } = action.payload;
      const lead = state.items.find((l) => l.id === id);
      if (lead) {
        lead.status = status;
      }
    },
    setLeadSearch: (state, action) => {
      state.searchTerm = sanitizeInput(action.payload);
    },
    setLeadStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setLeadSorting: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
  },
});

export const {
  addLead,
  updateLead,
  deleteLead,
  changeLeadStatus,
  setLeadSearch,
  setLeadStatusFilter,
  setLeadSorting,
} = leadSlice.actions;

export default leadSlice.reducer;