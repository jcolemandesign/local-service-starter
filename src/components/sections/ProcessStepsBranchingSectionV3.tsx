import { LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type ProcessStepsBranchingItem = {
  body: string;
  title: string;
};

export type ProcessStepsBranchingAlign = "left" | "center";

export type ProcessStepsBranchingSectionV3Props = {
  align?: ProcessStepsBranchingAlign;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  outcomes: readonly ProcessStepsBranchingItem[];
  steps: readonly ProcessStepsBranchingItem[];
  title: string;
};

function cardClassName(
  cardBorder: "on" | "off",
  cardFill: "solid" | "none",
) {
  return [
    "fluid-type-frame rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface text-service-ink shadow-service",
    cardFill === "none" ? "!bg-transparent !shadow-none" : "",
    cardBorder === "off" ? "!border-transparent" : "",
  ].join(" ");
}

export function ProcessStepsBranchingSectionV3({
  align = "left",
  cardBorder = "on",
  cardFill = "solid",
  outcomes,
  steps,
  title,
}: ProcessStepsBranchingSectionV3Props) {
  const centered = align === "center";

  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="section-min-none items-start"
        columns={14}
        padding="med"
      >
        {!centered ? (
          <LayoutGridItem
            className="col-span-4 max-lg:col-span-3 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2"
            measure="copy"
          >
            <h2 className="type-heading-lg wrap-pretty text-service-ink">
              {title}
            </h2>
          </LayoutGridItem>
        ) : null}

        <LayoutGridItem
          className={[
            centered
              ? "col-span-8 col-start-4"
              : "col-span-8 col-start-6",
            centered
              ? "max-lg:col-span-6 max-lg:col-start-3"
              : "max-lg:col-span-6 max-lg:col-start-5",
            centered
              ? "max-md:col-span-6 max-md:col-start-1"
              : "max-md:col-span-6 max-md:col-start-1 max-md:mt-12",
            "max-sm:col-span-2",
          ].join(" ")}
        >
          <div className="mx-auto max-w-4xl">
            <ol>
              {steps.map((step, index) => (
                <li key={`${step.title}-${index}`}>
                  <article
                    className={`${cardClassName(
                      cardBorder,
                      cardFill,
                    )} grid grid-cols-[auto_minmax(0,1fr)] items-start gap-6 p-7 max-sm:grid-cols-1 max-sm:gap-4 max-sm:p-5`}
                  >
                    <span className="type-label flex h-11 w-11 items-center justify-center border border-service-border text-service-accent max-sm:justify-self-start">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="type-heading-sm uppercase text-service-ink">
                        {step.title}
                      </h3>
                      <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
                        {step.body}
                      </p>
                    </div>
                  </article>

                  {index < steps.length - 1 ? (
                    <div
                      aria-hidden="true"
                      className="flex h-12 justify-center"
                    >
                      <span className="h-full border-l border-service-border [border-left-width:var(--border-surface-width-token)]" />
                    </div>
                  ) : null}
                </li>
              ))}
            </ol>

            <div
              aria-hidden="true"
              className="relative mx-auto h-20 max-sm:h-16"
            >
              <span className="absolute left-1/2 top-0 h-1/2 border-l border-service-border [border-left-width:var(--border-surface-width-token)] max-sm:h-1/2" />
              <span className="absolute left-1/4 top-1/2 h-1/2 w-1/4 rounded-tl-[var(--radius-surface-token)] border-l border-t border-service-border [border-left-width:var(--border-surface-width-token)] [border-top-width:var(--border-surface-width-token)] max-sm:hidden" />
              <span className="absolute right-1/4 top-1/2 h-1/2 w-1/4 rounded-tr-[var(--radius-surface-token)] border-r border-t border-service-border [border-right-width:var(--border-surface-width-token)] [border-top-width:var(--border-surface-width-token)] max-sm:hidden" />
              <span className="absolute left-5 top-1/2 hidden h-1/2 w-[calc(50%-1.25rem)] rounded-tl-[var(--radius-surface-token)] border-l border-t border-service-border [border-left-width:var(--border-surface-width-token)] [border-top-width:var(--border-surface-width-token)] max-sm:block" />
            </div>

            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute bottom-1/4 left-5 top-0 hidden border-l border-service-border [border-left-width:var(--border-surface-width-token)] max-sm:block"
              />
              <ul className="relative grid auto-rows-fr grid-cols-2 gap-6 max-sm:grid-cols-1 max-sm:pl-10">
                {outcomes.map((outcome) => (
                  <li className="relative flex" key={outcome.title}>
                    <span
                      aria-hidden="true"
                      className="absolute -left-5 top-1/2 hidden w-5 border-t border-service-border [border-top-width:var(--border-surface-width-token)] max-sm:block"
                    />
                    <article
                      className={`${cardClassName(
                        cardBorder,
                        cardFill,
                      )} w-full p-7 max-sm:p-5`}
                    >
                      <h3 className="type-heading-sm uppercase text-service-ink">
                        {outcome.title}
                      </h3>
                      <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
                        {outcome.body}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
