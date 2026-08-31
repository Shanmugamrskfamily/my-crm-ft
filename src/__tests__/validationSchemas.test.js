// src/__tests__/validationSchemas.test.js
import {
  loginSchema,
  customerSchema,
  leadSchema,
  taskSchema,
  noteSchema,
} from "../utils/validationSchemas";
import dayjs from "dayjs";

describe("Yup validation schemas", () => {
  test("loginSchema rejects missing email/password and short passwords", async () => {
    await expect(loginSchema.validate({ email: "", password: "" })).rejects.toThrow();
    await expect(
      loginSchema.validate({ email: "bad", password: "123" }),
    ).rejects.toThrow();
    await expect(
      loginSchema.validate({ email: "admin@crm.io", password: "Password@123" }),
    ).resolves.toBeTruthy();
  });

  test("customerSchema requires all core fields and a valid email/phone", async () => {
    await expect(customerSchema.validate({})).rejects.toThrow();
    await expect(
      customerSchema.validate({
        name: "A",
        email: "not-an-email",
        phone: "??",
        company: "Co",
        location: "Loc",
        status: "Active",
        assignedEmployee: "Priya",
      }),
    ).rejects.toThrow();

    await expect(
      customerSchema.validate({
        name: "Anita",
        email: "anita@company.com",
        phone: "+91 98000 11223",
        company: "Company",
        location: "Chennai",
        status: "Active",
        assignedEmployee: "Priya Sharma",
      }),
    ).resolves.toBeTruthy();
  });

  test("leadSchema requires a valid lead status and source", async () => {
    await expect(
      leadSchema.validate({
        name: "X",
        company: "Y",
        email: "x@y.com",
        phone: "+91 90000 00000",
        location: "Loc",
        status: "InvalidStage",
        source: "Referral",
        assignedEmployee: "Priya",
      }),
    ).rejects.toThrow();
  });

  test("taskSchema requires title, priority, status, dueDate", async () => {
    await expect(taskSchema.validate({})).rejects.toThrow();
    await expect(
      taskSchema.validate({
        title: "Call client",
        assignedTo: "Priya",
        priority: "High",
        status: "Todo",
        dueDate: dayjs("2026-09-30"),
      }),
    ).resolves.toBeTruthy();
  });

  test("noteSchema enforces minimum length", async () => {
    await expect(noteSchema.validate({ content: "" })).rejects.toThrow();
    await expect(noteSchema.validate({ content: "ok" })).rejects.toThrow();
    await expect(
      noteSchema.validate({ content: "This is a real customer note." }),
    ).resolves.toBeTruthy();
  });
});
