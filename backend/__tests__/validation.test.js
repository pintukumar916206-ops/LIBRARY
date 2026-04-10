import {
  validateEmail,
  validatePassword,
  validateStringLength,
  validateNumber,
  sanitizeInput,
} from "../utils/validation.js";
describe("Validation Utilities - 15+ Tests", () => {
  test("Email - Valid", () => {
    expect(validateEmail("t@e.com")).toBe(true);
  });
  test("Email - Missing @", () => {
    expect(validateEmail("te.com")).toBe(false);
  });
  test("Email - Missing Domain", () => {
    expect(validateEmail("t@")).toBe(false);
  });
  test("Password - Valid", () => {
    expect(validatePassword("123456")).toBe(true);
  });
  test("Password - Short", () => {
    expect(validatePassword("123")).toBe(false);
  });
  test("Password - Long", () => {
    expect(validatePassword("a".repeat(129))).toBe(false);
  });
  test("StringLength - Valid", () => {
    expect(validateStringLength("T", 1, 5)).toBe(true);
  });
  test("StringLength - TooShort", () => {
    expect(validateStringLength("", 1, 5)).toBe(false);
  });
  test("StringLength - TooLong", () => {
    expect(validateStringLength("123456", 1, 5)).toBe(false);
  });
  test("Number - Valid", () => {
    expect(validateNumber(10, 0, 100)).toBe(true);
  });
  test("Number - Float", () => {
    expect(validateNumber(10.5, 0, 100)).toBe(true);
  });
  test("Number - Negative", () => {
    expect(validateNumber(-1, 0, 100)).toBe(false);
  });
  test("Number - TooHigh", () => {
    expect(validateNumber(101, 0, 100)).toBe(false);
  });
  test("Sanitize - HTML", () => {
    expect(sanitizeInput("<div>T</div>")).toBe("divT/div");
  });
  test("Sanitize - Trim", () => {
    expect(sanitizeInput(" T ")).toBe("T");
  });
});
