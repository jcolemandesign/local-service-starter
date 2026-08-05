"use client";

import { useId, useState } from "react";

import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";
import type { FinancingProgram } from "@/content/financing";
import type { SectionIcons } from "@/content/section-style-options";
import {
  calculateFinancingSelection,
  clampProjectAmount,
  validateFinancingProgram,
} from "@/utils/financing-calculator";

/**
 * The six control and result labels are fixed UI chrome, not client copy, so
 * they default here instead of living in the section library.
 *
 * They are the calculator's own furniture - what each control adjusts and what
 * each figure is - and they read the same for every business. Holding them in
 * the library made them indistinguishable from demo copy, which is how
 * estimatedPaymentLabel showed up as a leak.
 *
 * They are deliberately not copy fields. "Estimated Monthly Payment",
 * "Estimated APR" and "Total of Payments" are careful non-promotional wording
 * on a financing estimator; the copy contract already requires lender-approved
 * language verbatim for the disclosure, and per-client rewrites of the figure
 * labels are the last thing this section wants.
 */
export type FinancingCalculatorSectionV3Props = {
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  colorRecipe?: SectionColorRecipe;
  estimatedAprLabel?: string;
  estimatedPaymentLabel?: string;
  fallbackMessage: string;
  icons?: SectionIcons;
  primaryAction: string;
  primaryActionHref: string;
  program?: FinancingProgram;
  projectCostLabel?: string;
  projectTimingDisclosure: string;
  promotionalOptionLabel?: string;
  secondaryAction: string;
  secondaryActionHref: string;
  standardFinancingLabel?: string;
  title: string;
  totalPaymentsLabel?: string;
};

const invalidProgram: FinancingProgram = {
  aprByTerm: {},
  availableTerms: [],
  defaultProjectAmount: 0,
  defaultTerm: 1,
  disclosure: "",
  maxProjectAmount: 0,
  minProjectAmount: 0,
  projectStep: 1,
  termsAtGlance: [],
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "USD",
});

const colorRecipeClassName = {
  card: "bg-service-surface",
  cardBorder: "border-service-border",
  input: "bg-bg-page border-service-border",
  muted: "text-service-muted",
  section: "bg-bg-page",
  text: "text-service-ink",
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function withFinancingContext(
  href: string,
  selection: ReturnType<typeof calculateFinancingSelection>,
) {
  const separator = href.includes("?") ? "&" : "?";
  const parameters = new URLSearchParams({
    estimatedApr: String(selection.apr),
    estimatedMonthlyPayment: String(Math.round(selection.monthlyPayment)),
    estimatedProjectCost: String(selection.principal),
    selectedFinancingTerm: String(selection.termMonths),
    selectedProgram: selection.program,
    source: "financing-calculator",
  });

  return `${href}${separator}${parameters.toString()}`;
}

export function FinancingCalculatorSectionV3({
  body,
  cardBorder = "on",
  cardFill = "solid",
  estimatedAprLabel = "Estimated APR",
  estimatedPaymentLabel = "Estimated Monthly Payment",
  fallbackMessage,
  icons = "on",
  primaryAction,
  primaryActionHref,
  program,
  projectCostLabel = "Project Cost",
  projectTimingDisclosure,
  promotionalOptionLabel = "Promotional Option",
  secondaryAction,
  secondaryActionHref,
  standardFinancingLabel = "Standard Financing",
  title,
  totalPaymentsLabel = "Total of Payments",
}: FinancingCalculatorSectionV3Props) {
  const activeProgram = program ?? invalidProgram;
  const isValid = validateFinancingProgram(activeProgram);
  const [projectAmount, setProjectAmount] = useState(
    activeProgram.defaultProjectAmount,
  );
  const [currencyInput, setCurrencyInput] = useState(
    currencyFormatter.format(activeProgram.defaultProjectAmount),
  );
  const [termMonths, setTermMonths] = useState(activeProgram.defaultTerm);
  const [promotionIndex, setPromotionIndex] = useState<number | null>(null);
  const inputId = useId();
  const disclosureId = useId();
  const colors = colorRecipeClassName;
  const cardClassName = cx(
    "content-padding radius-medium h-full border shadow-service",
    colors.card,
    colors.cardBorder,
    cardFill === "none" && "!bg-transparent !shadow-none",
    cardBorder === "off" && "!border-transparent",
  );

  function updateProjectAmount(nextAmount: number) {
    const clampedAmount = clampProjectAmount(nextAmount, activeProgram);
    setProjectAmount(clampedAmount);
    setCurrencyInput(currencyFormatter.format(clampedAmount));
  }

  if (!isValid) {
    return (
      <section className={colors.section}>
        <LayoutGrid className="section-min-none" columns={14} padding="med">
          <LayoutGridItem className="col-span-14 max-lg:col-span-10 max-md:col-span-6 max-sm:col-span-2">
            <div className={cardClassName}>
              <p className={cx("type-text-lg wrap-pretty", colors.text)}>
                {fallbackMessage}
              </p>
              <div className="mt-body-actions-md flex flex-wrap gap-3">
                <Button href={primaryActionHref}>{primaryAction}</Button>
                <Button href={secondaryActionHref} variant="secondary">
                  {secondaryAction}
                </Button>
              </div>
            </div>
          </LayoutGridItem>
        </LayoutGrid>
      </section>
    );
  }

  const promotion =
    promotionIndex === null
      ? undefined
      : activeProgram.promotionalPrograms?.[promotionIndex];
  const selectedApr = promotion?.apr ?? activeProgram.aprByTerm[termMonths];
  const selectedTerm = promotion?.termMonths ?? termMonths;
  const selection = calculateFinancingSelection({
    apr: selectedApr,
    principal: projectAmount,
    program: promotion ? "promotional" : "standard",
    termMonths: selectedTerm,
  });
  const primaryHref = withFinancingContext(primaryActionHref, selection);
  const secondaryHref = withFinancingContext(secondaryActionHref, selection);

  return (
    <section className={colors.section}>
      <LayoutGrid className="section-min-none items-stretch" columns={14} padding="med">
        <LayoutGridItem
          className="col-span-8 col-start-1 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2"
        >
          <div
            className={cardClassName}
            style={{ paddingBottom: "var(--section-space-vsml)" }}
          >
            <div className="fluid-type-frame">
              <h2 className={cx("type-heading-lg wrap-pretty", colors.text)}>
                {title}
              </h2>
              <p className={cx("type-text-md mt-heading-body-sm wrap-pretty", colors.muted)}>
                {body}
              </p>
            </div>

            <div className="mt-body-actions-lg grid card-grid-gap-lrg">
              <div>
                <div className="flex items-center justify-between gap-4 max-sm:items-start max-sm:flex-col">
                  <label
                    className={cx("type-label", colors.text)}
                    htmlFor={inputId}
                  >
                    {projectCostLabel}
                  </label>
                  <input
                    aria-describedby={`${inputId}-range`}
                    className={cx(
                      "radius-medium min-h-12 w-44 border px-4 text-right type-heading-sm outline-none transition-colors focus:border-service-accent focus-visible:ring-2 focus-visible:ring-service-accent/25 max-sm:w-full",
                      colors.input,
                      colors.text,
                    )}
                    id={inputId}
                    inputMode="numeric"
                    onBlur={() => {
                      const parsedValue = Number(currencyInput.replace(/[^0-9]/g, ""));
                      updateProjectAmount(parsedValue);
                    }}
                    onChange={(event) => {
                      const nextInput = event.target.value;
                      const parsedValue = Number(nextInput.replace(/[^0-9]/g, ""));
                      setCurrencyInput(nextInput);

                      if (
                        Number.isFinite(parsedValue) &&
                        parsedValue >= activeProgram.minProjectAmount &&
                        parsedValue <= activeProgram.maxProjectAmount
                      ) {
                        setProjectAmount(parsedValue);
                      }
                    }}
                    onFocus={(event) => event.currentTarget.select()}
                    value={currencyInput}
                  />
                </div>
                <input
                  aria-label={`${projectCostLabel} range`}
                  className="mt-body-actions-sm h-2 w-full cursor-pointer accent-service-accent"
                  id={`${inputId}-range`}
                  max={activeProgram.maxProjectAmount}
                  min={activeProgram.minProjectAmount}
                  onChange={(event) => updateProjectAmount(Number(event.target.value))}
                  step={activeProgram.projectStep}
                  type="range"
                  value={projectAmount}
                />
                <div
                  className={cx(
                    "mt-3 flex justify-between gap-4 type-caption font-semibold",
                    colors.muted,
                  )}
                >
                  <span>{currencyFormatter.format(activeProgram.minProjectAmount)}</span>
                  <span>{currencyFormatter.format(activeProgram.maxProjectAmount)}</span>
                </div>
              </div>

              <fieldset>
                <legend className={cx("type-label", colors.text)}>
                  {standardFinancingLabel}
                </legend>
                <div className="mt-heading-body-sm grid grid-cols-5 gap-3 max-sm:grid-cols-2">
                  {activeProgram.availableTerms.map((term) => {
                    const isSelected = !promotion && termMonths === term;

                    return (
                      <button
                        aria-pressed={isSelected}
                        className={cx(
                          "radius-medium min-h-20 cursor-pointer border px-3 py-3 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-service-accent",
                          isSelected
                            ? "border-service-accent bg-service-accent text-text-inverse"
                            : cx(colors.input, colors.text, "hover:border-service-accent"),
                        )}
                        key={term}
                        onClick={() => {
                          setPromotionIndex(null);
                          setTermMonths(term);
                        }}
                        type="button"
                      >
                        <span className="block type-heading-sm">{term}</span>
                        <span className="mt-1 block type-caption">Months</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                {(activeProgram.promotionalPrograms?.length ?? 0) > 0 ? (
                  <fieldset>
                    <legend className={cx("type-label", colors.text)}>
                      {promotionalOptionLabel}
                    </legend>
                    <div className="mt-heading-body-sm grid gap-3">
                      {activeProgram.promotionalPrograms?.map((option, index) => {
                        const isSelected = promotionIndex === index;

                        return (
                          <button
                            aria-pressed={isSelected}
                            className={cx(
                              "radius-medium grid cursor-pointer grid-cols-[auto_1fr] items-start gap-3 border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-service-accent",
                              isSelected
                                ? "border-service-accent bg-service-accent/10"
                                : cx(colors.input, "hover:border-service-accent"),
                            )}
                            key={`${option.label}-${option.termMonths}`}
                            onClick={() =>
                              setPromotionIndex(isSelected ? null : index)
                            }
                            type="button"
                          >
                            <span
                              aria-hidden="true"
                              className={cx(
                                "mt-1 grid size-5 place-items-center rounded-full border",
                                isSelected
                                  ? "border-service-accent bg-service-accent text-white"
                                  : colors.cardBorder,
                              )}
                            >
                              {isSelected ? "✓" : ""}
                            </span>
                            <span>
                              <span
                                className={cx(
                                  "block type-text-sm font-semibold",
                                  colors.text,
                                )}
                              >
                                {option.label}
                              </span>
                              <span
                                className={cx(
                                  "mt-1 block type-caption",
                                  colors.muted,
                                )}
                              >
                                {option.eligibilityNote}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : null}

                <p
                  className={cx(
                    (activeProgram.promotionalPrograms?.length ?? 0) > 0 &&
                      "mt-heading-body-sm",
                    "type-caption w-full max-w-none wrap-pretty",
                    colors.muted,
                  )}
                  id={disclosureId}
                  style={{ maxWidth: "none" }}
                >
                  *{activeProgram.disclosure} {projectTimingDisclosure}
                </p>
              </div>
            </div>
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignY="stretch"
          className="col-span-6 col-start-9 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2"
        >
          <div className={cx(cardClassName, "grid content-between")}>
            <div aria-atomic="true" aria-live="polite">
              <p className={cx("type-label", colors.text)}>
                {estimatedPaymentLabel}
              </p>
              <p className={cx("type-display-lg mt-heading-body-sm", colors.text)}>
                {currencyFormatter.format(Math.round(selection.monthlyPayment))}
                <span className="ml-2 type-heading-md">/mo</span>
                <sup className="ml-1 type-text-sm">
                  <a aria-label="See estimator disclosure" href={`#${disclosureId}`}>
                    *
                  </a>
                </sup>
              </p>

              <dl className="mt-body-actions-lg grid gap-4 border-t border-service-border pt-6">
                <div className="flex items-baseline justify-between gap-5">
                  <dt className={cx("type-text-sm", colors.muted)}>
                    {estimatedAprLabel}
                  </dt>
                  <dd className={cx("type-text-md font-semibold", colors.text)}>
                    {selection.apr.toFixed(2)}%
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-5">
                  <dt className={cx("type-text-sm", colors.muted)}>
                    {totalPaymentsLabel}
                  </dt>
                  <dd className={cx("type-text-md font-semibold", colors.text)}>
                    {currencyFormatter.format(Math.round(selection.totalPayments))}
                  </dd>
                </div>
              </dl>

            </div>

            <div className="mt-body-actions-lg relative">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -top-5 border-t border-service-border"
              />
              <ul className="grid gap-3">
                {activeProgram.termsAtGlance.map((term) => (
                  <li
                    className={cx(
                      "flex items-start gap-3 type-text-sm font-semibold",
                      colors.text,
                    )}
                    key={term}
                  >
                    {icons === "on" ? (
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-service-accent type-caption text-text-inverse"
                      >
                        ✓
                      </span>
                    ) : null}
                    <span>{term}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-body-actions-md grid gap-3">
                <Button className="w-full" href={primaryHref}>
                  {primaryAction}
                </Button>
                <Button className="w-full" href={secondaryHref} variant="secondary">
                  {secondaryAction}
                </Button>
              </div>
            </div>
          </div>
        </LayoutGridItem>

      </LayoutGrid>
    </section>
  );
}
