// src/components/common/Can.jsx
"use client";

import { usePermissions } from "../../hooks/usePermissions";

/**
 * Renders children only if the current user has permission for `action`.
 * Optional `fallback` renders when the user is not permitted.
 */
export default function Can({ action, fallback = null, children }) {
  const { can } = usePermissions();
  if (!can(action)) return fallback;
  return children;
}
