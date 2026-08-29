// src/services/authService.js
import { mockSecureApiCall, sanitizeInput } from "../utils/security";

// Pre-defined valid mock accounts
export const MOCK_USERS = [
  {
    email: "admin@crm.io",
    password: "Password@123",
    user: {
      id: "usr-admin",
      name: "Admin User",
      email: "admin@crm.io",
      role: "Admin",
    },
  },
  {
    email: "sales.user@crm.io",
    password: "Password@123",
    user: {
      id: "usr-sales",
      name: "Sales User",
      email: "sales.user@crm.io",
      role: "Sales Representative",
    },
  },
];

export const authenticateUser = async (credentials) => {
  // 1. Sanitize incoming form values against XSS
  const sanitizedCredentials = sanitizeInput(credentials);

  // 2. Perform encrypted mock API round-trip
  await mockSecureApiCall("/api/auth/login", sanitizedCredentials);

  // 3. Verify credentials against mock accounts
  const matchedUser = MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === sanitizedCredentials.email.toLowerCase() &&
      u.password === sanitizedCredentials.password
  );

  if (!matchedUser) {
    throw new Error("Invalid email address or password.");
  }

  return {
    user: matchedUser.user,
    token: `jwt_${Date.now()}_mock_token`,
  };
};