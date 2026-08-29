// src/store/slices/customerSlice.js
import { createSlice, nanoid } from "@reduxjs/toolkit";
import { initialCustomers } from "../../mock/initialData";
import { sanitizeInput } from "../../utils/security";

const initialState = {
  items: initialCustomers,
  selectedCustomerIds: [],
  searchTerm: "",
  statusFilter: "ALL",
  sortBy: "createdDate",
  sortOrder: "desc", // 'asc' | 'desc'
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    addCustomer: {
      reducer: (state, action) => {
        state.items.unshift(action.payload);
      },
      prepare: (customerData) => {
        const sanitized = sanitizeInput(customerData);
        return {
          payload: {
            ...sanitized,
            id: `cust-${nanoid(6)}`,
            createdDate: new Date().toISOString(),
            notes: [],
            activities: [
              {
                id: `act-${nanoid(6)}`,
                type: "Created",
                description: `Customer account created.`,
                timestamp: new Date().toISOString(),
              },
            ],
          },
        };
      },
    },
    updateCustomer: (state, action) => {
      const sanitized = sanitizeInput(action.payload);
      const index = state.items.findIndex((c) => c.id === sanitized.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...sanitized,
          activities: [
            {
              id: `act-${nanoid(6)}`,
              type: "Updated",
              description: `Customer details updated.`,
              timestamp: new Date().toISOString(),
            },
            ...(state.items[index].activities || []),
          ],
        };
      }
    },
    deleteCustomer: (state, action) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
      state.selectedCustomerIds = state.selectedCustomerIds.filter(
        (id) => id !== action.payload
      );
    },
    bulkDeleteCustomers: (state) => {
      state.items = state.items.filter(
        (c) => !state.selectedCustomerIds.includes(c.id)
      );
      state.selectedCustomerIds = [];
    },
    toggleSelectCustomer: (state, action) => {
      const id = action.payload;
      if (state.selectedCustomerIds.includes(id)) {
        state.selectedCustomerIds = state.selectedCustomerIds.filter(
          (item) => item !== id
        );
      } else {
        state.selectedCustomerIds.push(id);
      }
    },
    selectAllCustomers: (state, action) => {
      state.selectedCustomerIds = action.payload; // array of IDs
    },
    clearCustomerSelection: (state) => {
      state.selectedCustomerIds = [];
    },
    addCustomerNote: {
      reducer: (state, action) => {
        const { customerId, note } = action.payload;
        const customer = state.items.find((c) => c.id === customerId);
        if (customer) {
          if (!customer.notes) customer.notes = [];
          customer.notes.unshift(note);
        }
      },
      prepare: ({ customerId, author, content }) => {
        return {
          payload: {
            customerId,
            note: {
              id: `note-${nanoid(6)}`,
              author: sanitizeInput(author),
              content: sanitizeInput(content),
              createdAt: new Date().toISOString(),
            },
          },
        };
      },
    },
    addCustomerActivity: {
      reducer: (state, action) => {
        const { customerId, activity } = action.payload;
        const customer = state.items.find((c) => c.id === customerId);
        if (customer) {
          if (!customer.activities) customer.activities = [];
          customer.activities.unshift(activity);
        }
      },
      prepare: ({ customerId, type, description }) => {
        return {
          payload: {
            customerId,
            activity: {
              id: `act-${nanoid(6)}`,
              type: sanitizeInput(type),
              description: sanitizeInput(description),
              timestamp: new Date().toISOString(),
            },
          },
        };
      },
    },
    setCustomerSearch: (state, action) => {
      state.searchTerm = sanitizeInput(action.payload);
    },
    setCustomerStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setCustomerSorting: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
  },
});

export const {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  bulkDeleteCustomers,
  toggleSelectCustomer,
  selectAllCustomers,
  clearCustomerSelection,
  addCustomerNote,
  addCustomerActivity,
  setCustomerSearch,
  setCustomerStatusFilter,
  setCustomerSorting,
} = customerSlice.actions;

export default customerSlice.reducer;