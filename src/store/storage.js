// src/store/storage.js
import { encryptData, decryptData } from "../utils/security";

const STORAGE_KEY = "CRM_STATE_V1";

export const loadState = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return undefined;
    const decrypted = decryptData(serializedState);
    return decrypted || undefined;
  } catch (err) {
    console.error("Could not load state from localStorage:", err);
    return undefined;
  }
};

export const saveState = (state) => {
  if (typeof window === "undefined") return;
  try {
    // Only persist essential state branches
    const stateToPersist = {
      auth: state.auth,
      customers: state.customers,
      leads: state.leads,
      tasks: state.tasks,
    };
    const encrypted = encryptData(stateToPersist);
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (err) {
    console.error("Could not save state to localStorage:", err);
  }
};