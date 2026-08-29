// src/__tests__/security.test.js
import { sanitizeInput, encryptData, decryptData } from "../utils/security";

describe("Security Utilities (DOMPurify & AES-256)", () => {
  test("sanitizeInput strips malicious XSS scripts", () => {
    const maliciousInput = '<script>alert("xss")</script>Hello World';
    const sanitized = sanitizeInput(maliciousInput);
    expect(sanitized).toBe("Hello World");
    expect(sanitized).not.toContain("<script>");
  });

  test("sanitizeInput recursively strips XSS from objects", () => {
    const payload = {
      name: '<img src=x onerror="alert(1)">Priya',
      company: "Apex Corp",
    };
    const sanitized = sanitizeInput(payload);
    expect(sanitized.name).toBe("Priya");
    expect(sanitized.company).toBe("Apex Corp");
  });

  test("AES-256 encrypts and decrypts payloads accurately", () => {
    const data = { user: "admin", role: "Manager", sensitiveId: 98765 };
    const ciphertext = encryptData(data);

    expect(typeof ciphertext).toBe("string");
    expect(ciphertext).not.toContain("sensitiveId");

    const decrypted = decryptData(ciphertext);
    expect(decrypted).toEqual(data);
  });
});