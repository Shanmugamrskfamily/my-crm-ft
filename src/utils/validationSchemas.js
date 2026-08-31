// src/utils/validationSchemas.js
import * as Yup from "yup";

const phoneRegex = /^[+\d][\d\s\-()]{6,20}$/;

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const customerSchema = Yup.object({
  name: Yup.string().trim().required("Full name is required").min(2, "Name is too short"),
  email: Yup.string().trim().required("Email is required").email("Invalid email address"),
  phone: Yup.string()
    .trim()
    .required("Phone number is required")
    .matches(phoneRegex, "Enter a valid phone number"),
  company: Yup.string().trim().required("Company name is required"),
  location: Yup.string().trim().required("Location is required"),
  status: Yup.string()
    .oneOf(["Active", "Inactive", "Lead"], "Invalid status")
    .required("Status is required"),
  assignedEmployee: Yup.string().required("Please assign an employee"),
});

export const leadSchema = Yup.object({
  name: Yup.string().trim().required("Lead name is required").min(2, "Name is too short"),
  company: Yup.string().trim().required("Company name is required"),
  email: Yup.string().trim().required("Email is required").email("Invalid email address"),
  phone: Yup.string()
    .trim()
    .required("Phone number is required")
    .matches(phoneRegex, "Enter a valid phone number"),
  location: Yup.string().trim().required("Location is required"),
  status: Yup.string()
    .oneOf(["New", "Contacted", "Follow-up", "Qualified", "Converted", "Lost"])
    .required(),
  source: Yup.string().required("Lead source is required"),
  assignedEmployee: Yup.string().required("Please assign an employee"),
});

export const taskSchema = Yup.object({
  title: Yup.string().trim().required("Task title is required").min(3, "Title is too short"),
  description: Yup.string().max(500, "Description must be under 500 characters"),
  assignedTo: Yup.string().required("Please assign the task"),
  dueDate: Yup.mixed().required("Due date is required"),
  priority: Yup.string().oneOf(["Low", "Medium", "High"]).required(),
  status: Yup.string().oneOf(["Todo", "In Progress", "Completed"]).required(),
  customerId: Yup.string().nullable(),
  leadId: Yup.string().nullable(),
});

export const noteSchema = Yup.object({
  content: Yup.string()
    .trim()
    .required("Note content is required")
    .min(3, "Note is too short")
    .max(1000, "Note must be under 1000 characters"),
});
