// src/__tests__/reduxSlices.test.js
import customerReducer, {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  bulkDeleteCustomers,
  setCustomerSearch,
  setCustomerStatusFilter,
  addCustomerNote,
} from "../store/slices/customerSlice";
import leadReducer, {
  addLead,
  changeLeadStatus,
  deleteLead,
} from "../store/slices/leadSlice";
import taskReducer, {
  addTask,
  updateTask,
  changeTaskStatus,
  deleteTask,
} from "../store/slices/taskSlice";
import authReducer, { loginSuccess, logout } from "../store/slices/authSlice";
import notificationReducer, {
  pushNotification,
  dismissNotification,
} from "../store/slices/notificationSlice";

const emptyCustomerState = {
  items: [],
  selectedCustomerIds: [],
  searchTerm: "",
  statusFilter: "ALL",
  sortBy: "createdDate",
  sortOrder: "desc",
};

describe("authSlice", () => {
  test("handles loginSuccess and logout", () => {
    const initial = { user: null, token: null, isAuthenticated: false };
    const payload = {
      user: { id: "1", name: "Priya", email: "admin@crm.io", role: "Admin" },
      token: "jwt_test",
    };
    const afterLogin = authReducer(initial, loginSuccess(payload));
    expect(afterLogin.isAuthenticated).toBe(true);
    expect(afterLogin.user.name).toBe("Priya");
    expect(afterLogin.token).toBe("jwt_test");

    const afterLogout = authReducer(afterLogin, logout());
    expect(afterLogout).toEqual(initial);
  });
});

describe("customerSlice", () => {
  const sample = {
    name: "Acme Corp",
    email: "contact@acme.com",
    phone: "+91 99999 11111",
    company: "Acme Industries",
    location: "Bengaluru",
    status: "Active",
    assignedEmployee: "Priya Sharma",
  };

  test("adds a customer with id, createdDate, notes and activities", () => {
    const state = customerReducer(emptyCustomerState, addCustomer(sample));
    expect(state.items).toHaveLength(1);
    const added = state.items[0];
    expect(added.name).toBe("Acme Corp");
    expect(added.id).toMatch(/^cust-/);
    expect(added.createdDate).toBeDefined();
    expect(added.notes).toEqual([]);
    expect(added.activities).toHaveLength(1);
    expect(added.activities[0].type).toBe("Created");
  });

  test("edits an existing customer and records an Updated activity", () => {
    const added = customerReducer(emptyCustomerState, addCustomer(sample));
    const id = added.items[0].id;
    const edited = customerReducer(added, updateCustomer({ id, company: "Acme Global" }));
    expect(edited.items[0].company).toBe("Acme Global");
    expect(edited.items[0].activities[0].type).toBe("Updated");
  });

  test("deletes a single customer", () => {
    const added = customerReducer(emptyCustomerState, addCustomer(sample));
    const id = added.items[0].id;
    const deleted = customerReducer(added, deleteCustomer(id));
    expect(deleted.items).toHaveLength(0);
  });

  test("bulk deletes selected customers and clears selection", () => {
    const initial = {
      ...emptyCustomerState,
      items: [
        { id: "cust-1", name: "A" },
        { id: "cust-2", name: "B" },
        { id: "cust-3", name: "C" },
      ],
      selectedCustomerIds: ["cust-1", "cust-3"],
    };
    const state = customerReducer(initial, bulkDeleteCustomers());
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe("cust-2");
    expect(state.selectedCustomerIds).toEqual([]);
  });

  test("search term updates and sanitizes input", () => {
    const state = customerReducer(
      emptyCustomerState,
      setCustomerSearch("<script>alert(1)</script>acme"),
    );
    expect(state.searchTerm).toBe("acme");
  });

  test("status filter updates", () => {
    const state = customerReducer(emptyCustomerState, setCustomerStatusFilter("Active"));
    expect(state.statusFilter).toBe("Active");
  });

  test("addCustomerNote appends a sanitized note", () => {
    const added = customerReducer(emptyCustomerState, addCustomer(sample));
    const id = added.items[0].id;
    const withNote = customerReducer(
      added,
      addCustomerNote({
        customerId: id,
        author: "<b>Priya</b>",
        content: "Great <script>xss</script>meeting",
      }),
    );
    expect(withNote.items[0].notes).toHaveLength(1);
    expect(withNote.items[0].notes[0].author).toBe("Priya");
    expect(withNote.items[0].notes[0].content).toBe("Great meeting");
  });
});

describe("leadSlice - conversion flow", () => {
  test("changes lead status to Converted", () => {
    const initial = { items: [{ id: "lead-1", name: "Prospect", status: "New" }] };
    const state = leadReducer(
      initial,
      changeLeadStatus({ id: "lead-1", status: "Converted" }),
    );
    expect(state.items[0].status).toBe("Converted");
  });

  test("adds and deletes a lead", () => {
    const added = leadReducer(
      { items: [] },
      addLead({
        name: "Ravi",
        company: "R Corp",
        email: "r@r.com",
        phone: "+91 90000 00000",
        location: "Chennai",
      }),
    );
    expect(added.items).toHaveLength(1);
    const id = added.items[0].id;
    const removed = leadReducer(added, deleteLead(id));
    expect(removed.items).toHaveLength(0);
  });
});

describe("taskSlice - status update flow", () => {
  test("creates and updates a task status", () => {
    const state = taskReducer(
      { items: [] },
      addTask({
        title: "Schedule demo",
        assignedTo: "Priya",
        priority: "High",
        status: "Todo",
      }),
    );
    expect(state.items).toHaveLength(1);
    const id = state.items[0].id;

    const inProgress = taskReducer(
      state,
      changeTaskStatus({ id, status: "In Progress" }),
    );
    expect(inProgress.items[0].status).toBe("In Progress");

    const completed = taskReducer(
      inProgress,
      changeTaskStatus({ id, status: "Completed" }),
    );
    expect(completed.items[0].status).toBe("Completed");
  });

  test("updateTask merges fields", () => {
    const state = taskReducer(
      { items: [] },
      addTask({ title: "Call client", priority: "Low", status: "Todo" }),
    );
    const id = state.items[0].id;
    const updated = taskReducer(
      state,
      updateTask({ id, priority: "High", assignedTo: "Vikram" }),
    );
    expect(updated.items[0].priority).toBe("High");
    expect(updated.items[0].assignedTo).toBe("Vikram");
    expect(updated.items[0].title).toBe("Call client");
  });

  test("deleteTask removes the entry", () => {
    const state = taskReducer(
      { items: [] },
      addTask({ title: "One-off", priority: "Low", status: "Todo" }),
    );
    const id = state.items[0].id;
    const removed = taskReducer(state, deleteTask(id));
    expect(removed.items).toHaveLength(0);
  });
});

describe("notificationSlice", () => {
  test("push then dismiss removes the notification", () => {
    const pushed = notificationReducer(
      undefined,
      pushNotification({ message: "Saved", type: "success" }),
    );
    expect(pushed.queue).toHaveLength(1);
    const id = pushed.queue[0].id;
    const dismissed = notificationReducer(pushed, dismissNotification(id));
    expect(dismissed.queue).toHaveLength(0);
  });
});
