// src/__tests__/leadConversion.test.js
import { configureStore } from "@reduxjs/toolkit";
import customerReducer, { addCustomer } from "../store/slices/customerSlice";
import leadReducer, { addLead, changeLeadStatus } from "../store/slices/leadSlice";

/**
 * Integration test: converting a lead to a customer should
 *   1. flip the lead's status to "Converted", and
 *   2. create a new Customer with matching contact details.
 */
describe("Lead -> Customer conversion", () => {
  test("promotes a lead into an active customer account", () => {
    const store = configureStore({
      reducer: {
        customers: customerReducer,
        leads: leadReducer,
      },
      preloadedState: {
        customers: {
          items: [],
          selectedCustomerIds: [],
          searchTerm: "",
          statusFilter: "ALL",
          sortBy: "createdDate",
          sortOrder: "desc",
        },
        leads: {
          items: [],
          searchTerm: "",
          statusFilter: "ALL",
          sortBy: "createdDate",
          sortOrder: "desc",
        },
      },
    });

    store.dispatch(
      addLead({
        name: "Aditya Rao",
        company: "Nova Systems",
        email: "aditya@nova.io",
        phone: "+91 90000 12345",
        location: "Hyderabad",
        status: "Qualified",
        assignedEmployee: "Priya Sharma",
        source: "Referral",
      }),
    );

    const lead = store.getState().leads.items[0];
    expect(lead).toBeDefined();

    // Same UI flow as LeadsPage.executeLeadConversion
    store.dispatch(changeLeadStatus({ id: lead.id, status: "Converted" }));
    store.dispatch(
      addCustomer({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        location: lead.location,
        status: "Active",
        assignedEmployee: lead.assignedEmployee,
      }),
    );

    const state = store.getState();
    expect(state.leads.items[0].status).toBe("Converted");
    expect(state.customers.items).toHaveLength(1);
    const customer = state.customers.items[0];
    expect(customer.name).toBe("Aditya Rao");
    expect(customer.company).toBe("Nova Systems");
    expect(customer.status).toBe("Active");
  });
});
