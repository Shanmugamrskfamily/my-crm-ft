// src/__tests__/reduxSlices.test.js
import customerReducer, {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  bulkDeleteCustomers,
  toggleSelectCustomer,
} from "../store/slices/customerSlice";
import leadReducer, {
  addLead,
  changeLeadStatus,
  deleteLead,
} from "../store/slices/leadSlice";
import taskReducer, {
  addTask,
  changeTaskStatus,
  deleteTask,
} from "../store/slices/taskSlice";
import authReducer, {
  loginSuccess,
  logout,
} from "../store/slices/authSlice";

describe("Redux Reducers & Logic Verification", () => {
  // Auth Tests
  test("authSlice: handles loginSuccess and logout correctly", () => {
    const initialState = { user: null, token: null, isAuthenticated: false };
    const mockPayload = {
      user: { id: "1", name: "Rajaram", email: "admin@crm.io", role: "Admin" },
      token: "jwt_mock_token",
    };

    const loggedInState = authReducer(initialState, loginSuccess(mockPayload));
    expect(loggedInState.isAuthenticated).toBe(true);
    expect(loggedInState.user.name).toBe("Rajaram");

    const loggedOutState = authReducer(loggedInState, logout());
    expect(loggedOutState.isAuthenticated).toBe(false);
    expect(loggedOutState.user).toBeNull();
  });

  // Customer Tests
  test("customerSlice: handles adding, updating, and deleting a customer", () => {
    const initialState = { items: [], selectedCustomerIds: [] };
    const newCustomer = {
      name: "Acme Corp",
      email: "contact@acme.com",
      phone: "+91 99999 11111",
      company: "Acme Industries",
      location: "Bengaluru",
      status: "Active",
      assignedEmployee: "Priya Sharma",
    };

    // Add
    const stateAfterAdd = customerReducer(initialState, addCustomer(newCustomer));
    expect(stateAfterAdd.items).toHaveLength(1);
    expect(stateAfterAdd.items[0].name).toBe("Acme Corp");
    const addedId = stateAfterAdd.items[0].id;

    // Update
    const updatedCustomer = { id: addedId, company: "Acme Global Labs" };
    const stateAfterUpdate = customerReducer(stateAfterAdd, updateCustomer(updatedCustomer));
    expect(stateAfterUpdate.items[0].company).toBe("Acme Global Labs");

    // Delete
    const stateAfterDelete = customerReducer(stateAfterUpdate, deleteCustomer(addedId));
    expect(stateAfterDelete.items).toHaveLength(0);
  });

  // Bulk Selection & Delete
  test("customerSlice: handles bulk selection and bulk delete", () => {
    const initialState = {
      items: [
        { id: "cust-1", name: "Client A" },
        { id: "cust-2", name: "Client B" },
        { id: "cust-3", name: "Client C" },
      ],
      selectedCustomerIds: ["cust-1", "cust-3"],
    };

    const stateAfterBulkDelete = customerReducer(initialState, bulkDeleteCustomers());
    expect(stateAfterBulkDelete.items).toHaveLength(1);
    expect(stateAfterBulkDelete.items[0].id).toBe("cust-2");
    expect(stateAfterBulkDelete.selectedCustomerIds).toEqual([]);
  });

  // Lead Conversion
  test("leadSlice: changes lead status to Converted", () => {
    const initialState = {
      items: [{ id: "lead-1", name: "Prospect A", status: "New" }],
    };

    const stateAfterStatusChange = leadReducer(
      initialState,
      changeLeadStatus({ id: "lead-1", status: "Converted" })
    );

    expect(stateAfterStatusChange.items[0].status).toBe("Converted");
  });

  // Task Status Update
  test("taskSlice: creates and updates task status", () => {
    const initialState = { items: [] };
    const newTask = {
      title: "Schedule demo",
      assignedTo: "Priya Sharma",
      priority: "High",
      status: "Todo",
    };

    const stateWithTask = taskReducer(initialState, addTask(newTask));
    expect(stateWithTask.items).toHaveLength(1);
    const taskId = stateWithTask.items[0].id;

    const stateUpdated = taskReducer(
      stateWithTask,
      changeTaskStatus({ id: taskId, status: "Completed" })
    );
    expect(stateUpdated.items[0].status).toBe("Completed");
  });
});