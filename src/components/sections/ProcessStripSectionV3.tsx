import type { CSSProperties } from "react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";
import type { SectionIcons } from "@/content/section-style-options";

export type ProcessStripItem = {
  body: string;
  title: string;
};

export type ProcessStripSectionV3Props = {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  colorRecipe?: SectionColorRecipe;
  icons?: SectionIcons;
  steps: ProcessStripItem[];
};

const colorRecipeClassName = {
  card: "bg-service-surface",
  cardBorder: "border-service-border",
  muted: "text-service-muted",
  section: "bg-bg-page",
  text: "text-service-ink",
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function StepIcon({ index }: { index: number }) {
  const sharedProps = {
    "aria-hidden": true,
    className: "size-9 text-service-accent",
    fill: "none",
    viewBox: "0 0 40 40",
  } as const;

  if (index === 0) {
    return (
      <svg {...sharedProps}>
        <path d="M13 10h14a3 3 0 0 1 3 3v20H10V13a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="2" />
        <path d="M16 10V7h8v3M15 18h3l1.5 2 3-4M15 25h3l1.5 2 3-4M24 19h3M24 26h3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg {...sharedProps}>
        <path d="M11 5h13l7 7v23H11V5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
        <path d="M24 5v8h7M16 20h10M16 25h10M16 30h7" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg {...sharedProps}>
        <rect height="23" rx="3" stroke="currentColor" strokeWidth="2" width="31" x="4.5" y="8.5" />
        <path d="M5 16h30M10 23h9" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        <circle cx="28" cy="26" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M28 23.5V26l1.8 1.3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg {...sharedProps}>
      <rect height="27" rx="3" stroke="currentColor" strokeWidth="2" width="30" x="5" y="8" />
      <path d="M5 16h30M13 5v7M27 5v7M12 22h3M19 22h3M26 22h3M12 28h3M19 28h3M26 28h3" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

export function ProcessStripSectionV3({
  cardBorder = "on",
  cardFill = "solid",
  icons = "on",
  steps,
}: ProcessStripSectionV3Props) {
  const visibleSteps = steps.slice(0, 4);
  const colors = colorRecipeClassName;
  const columnsClassName =
    visibleSteps.length === 3 ? "grid-cols-3" : "grid-cols-4";

  return (
    <section className={colors.section}>
      <LayoutGrid className="section-min-none" columns={14} padding="sml">
        <LayoutGridItem className="col-span-14 col-start-1 max-lg:col-span-10 max-md:col-span-6 max-sm:col-span-2">
          <ol
            className={cx(
              "grid gap-12 max-lg:grid-cols-2 max-lg:gap-8 max-md:grid-cols-1",
              columnsClassName,
            )}
          >
            {visibleSteps.map((step, index) => (
              // The marker goes on the list item, not on the card inside it.
              // The step number and the connector arrow are both absolutely
              // positioned against this box, so animating the card alone would
              // leave its own number badge behind.
              <li
                className="reveal-on-scroll reveal-role-card relative min-w-0"
                key={`${step.title}-${index}`}
                style={{ "--reveal-index": index } as CSSProperties}
              >
                <article
                  className={cx(
                    "radius-medium grid h-full grid-cols-[auto_minmax(0,1fr)] items-center gap-5 border p-6 shadow-service",
                    colors.card,
                    colors.cardBorder,
                    "recipe-card-context",
                    cardFill === "none" && "!bg-transparent !shadow-none",
                    cardBorder === "off" && "!border-transparent",
                  )}
                >
                  <span className="type-caption absolute -top-3 left-4 grid size-8 place-items-center rounded-full bg-cta-primary font-semibold text-cta-primary-ink">
                    {index + 1}
                  </span>

                  {icons === "on" ? <StepIcon index={index} /> : null}

                  <div className="min-w-0">
                    <h3 className={cx("type-text-sm font-semibold", colors.text)}>
                      {index + 1}. {step.title}
                    </h3>
                    <p className={cx("type-caption mt-1 max-w-none wrap-pretty", colors.muted)}>
                      {step.body}
                    </p>
                  </div>
                </article>

                {index < visibleSteps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-9 top-1/2 grid size-6 -translate-y-1/2 place-items-center text-service-accent max-lg:hidden"
                  >
                    <svg
                      className="size-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 12h14m-5-5 5 5-5 5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.75"
                      />
                    </svg>
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
