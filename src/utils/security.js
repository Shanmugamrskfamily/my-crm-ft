// src/utils/security.js
import CryptoJS from "crypto-js";
import DOMPurify from "dompurify";

const SECRET_KEY =
  process.env.NEXT_PUBLIC_AES_SECRET_KEY || "default_super_secret_crm_key_2026";

// 1. AES-256 Encryption
export const encryptData = (data) => {
  try {
    const jsonString = typeof data === "object" ? JSON.stringify(data) : String(data);
    return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

// 2. AES-256 Decryption
export const decryptData = (cipherText) => {
  try {
    if (!cipherText) return null;
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
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

// 3. XSS Sanitization with DOMPurify (Strips all HTML tags and scripts)
export const sanitizeInput = (input) => {
  if (!input) return input;

  const purifyInstance =
    typeof window !== "undefined" && DOMPurify.sanitize
      ? DOMPurify
      : { sanitize: (str) => String(str).replace(/<[^>]*>?/gm, "") };

  if (typeof input === "string") {
    return purifyInstance.sanitize(input.trim(), { ALLOWED_TAGS: [] });
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item));
  }

  if (typeof input === "object" && input !== null) {
    const sanitizedObj = {};
    for (const [key, value] of Object.entries(input)) {
      sanitizedObj[key] = sanitizeInput(value);
    }
    return sanitizedObj;
  }

  return input;
};

// 4. Mock Secure API Dispatcher
export const mockSecureApiCall = async (endpoint, rawPayload) => {
  const sanitized = sanitizeInput(rawPayload);
  const encryptedPayload = encryptData(sanitized);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 200,
        endpoint,
        data: decryptData(encryptedPayload),
      });
    }, 150);
  });
};