import type { FinancingProgram } from "@/content/financing";

export type FinancingSelection = {
  apr: number;
  monthlyPayment: number;
  principal: number;
  program: "standard" | "promotional";
  termMonths: number;
  totalPayments: number;
};

export function validateFinancingProgram(program: FinancingProgram) {
  if (
    !Number.isFinite(program.minProjectAmount) ||
    !Number.isFinite(program.maxProjectAmount) ||
    program.minProjectAmount >= program.maxProjectAmount ||
    !Number.isFinite(program.projectStep) ||
    program.projectStep <= 0 ||
    program.defaultProjectAmount < program.minProjectAmount ||
    program.defaultProjectAmount > program.maxProjectAmount ||
    !Number.isInteger(program.defaultTerm) ||
    program.defaultTerm <= 0 ||
    !program.availableTerms.includes(program.defaultTerm) ||
    program.availableTerms.length === 0 ||
    !Array.isArray(program.termsAtGlance) ||
    program.termsAtGlance.length === 0 ||
    program.termsAtGlance.some((term) => !term.trim()) ||
    !program.disclosure.trim()
  ) {
    return false;
  }

  const standardTermsAreValid = program.availableTerms.every((term) => {
    const apr = program.aprByTerm[term];
    return Number.isInteger(term) && term > 0 && Number.isFinite(apr) && apr >= 0;
  });

  const promotionsAreValid = (program.promotionalPrograms ?? []).every(
    (promotion) =>
      Number.isInteger(promotion.termMonths) &&
      promotion.termMonths > 0 &&
      Number.isFinite(promotion.apr) &&
      promotion.apr >= 0 &&
      Boolean(promotion.label.trim()) &&
      Boolean(promotion.eligibilityNote.trim()),
  );

  return standardTermsAreValid && promotionsAreValid;
}

export function clampProjectAmount(
  amount: number,
  program: FinancingProgram,
) {
  if (!Number.isFinite(amount)) return program.defaultProjectAmount;
  return Math.min(
    program.maxProjectAmount,
    Math.max(program.minProjectAmount, amount),
  );
}

export function calculateFinancingSelection({
  apr,
  principal,
  program,
  termMonths,
}: {
  apr: number;
  principal: number;
  program: FinancingSelection["program"];
  termMonths: number;
}): FinancingSelection {
  const annualRate = apr / 100;
  const monthlyRate = annualRate / 12;
  const monthlyPayment =
    monthlyRate === 0
      ? principal / termMonths
      : principal *
        ((monthlyRate * (1 + monthlyRate) ** termMonths) /
          ((1 + monthlyRate) ** termMonths - 1));

  return {
    apr,
    monthlyPayment,
    principal,
    program,
    termMonths,
    totalPayments: monthlyPayment * termMonths,
  };
}
