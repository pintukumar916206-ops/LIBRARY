import { calculateFine } from "../utils/fineCalculator.js";

describe("Fine Calculator", () => {
  test("should return 0 if book returned on time", () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    expect(calculateFine(futureDate)).toBe(0);
  });

  test("should calculate fine for 1 hour late", () => {
    const dueDateOneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const fine = calculateFine(dueDateOneHourAgo);
    expect(fine).toBe(0.1);
  });

  test("should calculate fine for 24 hours late", () => {
    const dueDateOneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const fine = calculateFine(dueDateOneDayAgo);
    expect(fine).toBeCloseTo(2.4, 1);
  });

  test("should calculate fine for 7 days late", () => {
    const dueDateSevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const fine = calculateFine(dueDateSevenDaysAgo);
    expect(fine).toBeCloseTo(16.8, 1);
  });

  test("should calculate fine for 30 minutes late", () => {
    const dueDateHalfHourAgo = new Date(Date.now() - 30 * 60 * 1000);
    const fine = calculateFine(dueDateHalfHourAgo);
    expect(fine).toBeGreaterThanOrEqual(0.05);
  });

  test("should handle exact due date (0 fine)", () => {
    const today = new Date();
    expect(calculateFine(today)).toBe(0);
  });

  test("should return positive fine for past due date", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(calculateFine(yesterday)).toBeGreaterThan(0);
  });
});
