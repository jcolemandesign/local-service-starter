export type FinancingPromotionalProgram = {
  apr: number;
  eligibilityNote: string;
  label: string;
  termMonths: number;
};

export type FinancingProgram = {
  aprByTerm: Record<number, number>;
  availableTerms: number[];
  defaultProjectAmount: number;
  defaultTerm: number;
  disclosure: string;
  maxProjectAmount: number;
  minProjectAmount: number;
  projectStep: number;
  promotionalPrograms?: FinancingPromotionalProgram[];
  termsAtGlance: string[];
};

/**
 * Portfolio financing terms are isolated from the visual component so a real
 * lender program can replace them without rewriting calculator markup.
 * Approved client work should replace every rate, term, eligibility note, and
 * disclosure here with lender-provided language before publishing.
 */
export const northStarFinancingProgram: FinancingProgram = {
  minProjectAmount: 3000,
  maxProjectAmount: 25000,
  projectStep: 250,
  defaultProjectAmount: 8500,
  availableTerms: [12, 36, 60, 84, 120],
  defaultTerm: 60,
  aprByTerm: {
    12: 6.99,
    36: 7.49,
    60: 7.99,
    84: 8.49,
    120: 8.99,
  },
  promotionalPrograms: [
    {
      label: "0% APR for 18 months",
      termMonths: 18,
      apr: 0,
      eligibilityNote:
        "Available on approved credit for qualifying projects.",
    },
  ],
  termsAtGlance: [
    "Qualifying repair and replacement projects",
    "$3,000 minimum project",
    "12–120 month terms",
    "0% APR for 18 months on approved credit",
    "No prepayment penalty",
  ],
  disclosure:
    "Estimate only. This is not a financing offer. Actual rates, payments, eligibility, and terms are determined by the third-party lender after application.",
};
