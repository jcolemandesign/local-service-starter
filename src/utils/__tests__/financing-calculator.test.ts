import { describe, expect, it } from "vitest";

import { northStarFinancingProgram } from "@/content/financing";
import {
  calculateFinancingSelection,
  clampProjectAmount,
  validateFinancingProgram,
} from "@/utils/financing-calculator";

describe("financing calculator", () => {
  it("validates the replaceable lender configuration", () => {
    expect(validateFinancingProgram(northStarFinancingProgram)).toBe(true);
    expect(
      validateFinancingProgram({
        ...northStarFinancingProgram,
        aprByTerm: { 12: 6.99 },
      }),
    ).toBe(false);
    expect(
      validateFinancingProgram({
        ...northStarFinancingProgram,
        termsAtGlance: [],
      }),
    ).toBe(false);
  });

  it("clamps project amounts to the configured range", () => {
    expect(clampProjectAmount(1200, northStarFinancingProgram)).toBe(3000);
    expect(clampProjectAmount(50000, northStarFinancingProgram)).toBe(25000);
    expect(clampProjectAmount(8500, northStarFinancingProgram)).toBe(8500);
  });

  it("uses the amortized-loan formula for standard financing", () => {
    const result = calculateFinancingSelection({
      apr: 7.99,
      principal: 8500,
      program: "standard",
      termMonths: 60,
    });

    expect(result.monthlyPayment).toBeCloseTo(172.3, 1);
    expect(result.totalPayments).toBeCloseTo(10338.52, 1);
  });

  it("divides principal evenly for a true zero-percent program", () => {
    const result = calculateFinancingSelection({
      apr: 0,
      principal: 8500,
      program: "promotional",
      termMonths: 18,
    });

    expect(result.monthlyPayment).toBeCloseTo(472.22, 2);
    expect(result.totalPayments).toBeCloseTo(8500, 2);
  });
});
