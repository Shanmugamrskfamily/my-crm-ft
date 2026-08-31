// src/__tests__/permissions.test.js
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";
import { usePermissions } from "../hooks/usePermissions";

function makeWrapper(role) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        isAuthenticated: true,
        token: "t",
        user: { id: "u", name: "Test", email: "t@t.io", role },
      },
    },
  });
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

describe("usePermissions", () => {
  test("Admin can perform destructive actions", () => {
    const { result } = renderHook(() => usePermissions(), {
      wrapper: makeWrapper("Admin"),
    });
    expect(result.current.can("customer.delete")).toBe(true);
    expect(result.current.can("customer.bulkDelete")).toBe(true);
    expect(result.current.can("customer.export")).toBe(true);
    expect(result.current.can("task.delete")).toBe(true);
    expect(result.current.isAdmin).toBe(true);
  });

  test("Sales Representative cannot delete or bulk-delete", () => {
    const { result } = renderHook(() => usePermissions(), {
      wrapper: makeWrapper("Sales Representative"),
    });
    expect(result.current.can("customer.delete")).toBe(false);
    expect(result.current.can("customer.bulkDelete")).toBe(false);
    expect(result.current.can("customer.export")).toBe(false);
    expect(result.current.can("lead.delete")).toBe(false);
    expect(result.current.can("customer.create")).toBe(true);
    expect(result.current.can("lead.convert")).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });
});
