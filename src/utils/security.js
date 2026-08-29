// src/utils/security.js
import DOMPurify from "isomorphic-dompurify";
import CryptoJS from "crypto-js";

const SECRET_KEY =
  process.env.NEXT_PUBLIC_AES_SECRET_KEY || "crm_aes_256_super_secret_key_2026";

/**
 * Recursively sanitize strings, arrays, or objects against XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return DOMPurify.sanitize(input.trim());
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item));
  }

  if (input !== null && typeof input === "object") {
    const sanitizedObj = {};
    for (const [key, value] of Object.entries(input)) {
      sanitizedObj[key] = sanitizeInput(value);
    }
    return sanitizedObj;
  }

  return input;
};

/**
 * AES-256 Encrypt payload to ciphertext string
 */
export const encryptData = (data) => {
  try {
    const stringData = typeof data === "string" ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return "";
  }
};

/**
 * AES-256 Decrypt ciphertext back to object or string
 */
export const decryptData = (ciphertext) => {
  try {
    if (!ciphertext) return null;
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) return null;

    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

/**
 * Simulated AES-256 encrypted API request/response exchange
 */
export const mockSecureApiCall = async (endpoint, payload) => {
  const sanitized = payload ? sanitizeInput(payload) : undefined;
  const encryptedPayload = sanitized ? encryptData(sanitized) : undefined;

  // Artificial latency
  await new Promise((resolve) => setTimeout(resolve, 200));

  const serverReceivedPayload = encryptedPayload
    ? decryptData(encryptedPayload)
    : undefined;

  const mockResponse = {
    status: 200,
    endpoint,
    data: serverReceivedPayload,
    timestamp: new Date().toISOString(),
  };

  const encryptedResponse = encryptData(mockResponse);
  const decryptedResponse = decryptData(encryptedResponse);

  return decryptedResponse ? decryptedResponse.data : null;
};