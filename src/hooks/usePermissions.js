// src/hooks/usePermissions.js
"use client";

import { useSelector } from "react-redux";

/**
 * Role-based permission matrix.
 * Admin: full access.
 * Sales Representative: can create/edit customers, leads, tasks, notes, and
 *   convert leads, but cannot bulk-delete, export CSV, or delete records.
 */
const PERMISSIONS = {
  Admin: new Set([
    "customer.create",
    "customer.edit",
    "customer.delete",
    "customer.bulkDelete",
    "customer.export",
    "customer.addNote",
    "lead.create",
    "lead.edit",
    "lead.delete",
    "lead.convert",
    "lead.changeStatus",
    "task.create",
    "task.edit",
    "task.delete",
    "task.changeStatus",
  ]),
  "Sales Representative": new Set([
    "customer.create",
    "customer.edit",
    "customer.addNote",
    "lead.create",
    "lead.edit",
    "lead.convert",
    "lead.changeStatus",
    "task.create",
    "task.edit",
    "task.changeStatus",
  ]),
};

export function usePermissions() {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role || "Sales Representative";
  const allowed = PERMISSIONS[role] || new Set();

  const can = (action) => allowed.has(action);
  const cannot = (action) => !allowed.has(action);
  const isAdmin = role === "Admin";

  return { role, user, can, cannot, isAdmin };
}
