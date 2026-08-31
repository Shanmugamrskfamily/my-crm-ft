// src/__tests__/loginForm.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { App as AntdApp } from "antd";
import authReducer from "../store/slices/authSlice";
import LoginForm from "../components/modules/auth/LoginForm";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

jest.mock("@ant-design/icons", () => {
  const stub = () => null;
  return new Proxy(
    {},
    {
      get: () => stub,
    },
  );
});

function renderLogin() {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: { isAuthenticated: false, user: null, token: null },
    },
  });
  return render(
    <Provider store={store}>
      <AntdApp>
        <LoginForm />
      </AntdApp>
    </Provider>,
  );
}

describe("LoginForm (Formik + Yup)", () => {
  test("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test("rejects an invalid email format", async () => {
    const user = userEvent.setup();
    renderLogin();
    await user.type(screen.getByPlaceholderText(/admin@crm.io/i), "not-an-email");
    await user.type(screen.getByPlaceholderText(/enter your password/i), "Password@123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });
  });
});
