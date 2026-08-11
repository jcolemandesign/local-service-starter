import type { CSSProperties } from "react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type ProcessStepsStaggeredItem = {
  title: string;
  body: string;
};

export type ProcessStepsStaggeredSectionV3Props = {
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  eyebrow: string;
  steps: ProcessStepsStaggeredItem[];
  title: string;
};

export function ProcessStepsStaggeredSectionV3({
  body,
  cardBorder = "on",
  cardFill = "solid",
  eyebrow,
  steps,
  title,
}: ProcessStepsStaggeredSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="section-min-none items-start"
        columns={14}
        padding="med"
      >
        <LayoutGridItem
          className="col-span-4 max-lg:col-span-3 max-md:col-span-6 max-sm:col-span-2"
          measure="copy"
        >
          <div
            className="reveal-on-scroll fluid-type-frame"
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl wrap-pretty mt-eyebrow-heading-lg text-service-ink">
              {title}
            </h2>
            <p className="type-text-lg wrap-pretty mt-heading-body-lg text-service-muted">
              {body}
            </p>
          </div>
        </LayoutGridItem>

        <LayoutGridItem className="col-span-10 col-start-5 max-lg:col-span-7 max-lg:col-start-4 max-md:col-span-6 max-md:col-start-1 max-md:mt-12 max-sm:col-span-2">
        {/* The whole rail is one unit, and this is the case where a per-card
            stagger is actively wrong. The elbows between the cards are drawn
            as border spans that meet each card's edge exactly; move one card
            18px and the rail it is joined to stays put, so the path visibly
            comes apart and re-joins for the length of the entrance. */}
        <ol
          className="reveal-on-scroll relative mx-auto grid max-w-6xl"
          style={{ "--reveal-index": 1 } as CSSProperties}
        >
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;
            const isLast = index === steps.length - 1;

            return (
              <li key={`${step.title}-${index}`}>
                <div className="grid grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)] max-md:block max-md:pl-14">
                  <article
                    className={[
                      "fluid-type-frame grid grid-cols-[auto_minmax(0,1fr)] items-start gap-6 rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface p-7 text-service-ink max-sm:grid-cols-1 max-sm:gap-4 max-sm:p-5",
                      cardFill === "none"
                        ? "!bg-transparent !shadow-none"
                        : "",
                      cardBorder === "off" ? "!border-transparent" : "",
                      isLeft ? "col-start-1" : "col-start-3",
                    ].join(" ")}
                  >
                    <span className="type-label flex min-h-11 min-w-11 justify-self-start items-center justify-center border border-service-border text-service-accent">
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
                </div>

                {!isLast ? (
                  <div
                    aria-hidden="true"
                    className="relative grid h-20 grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)] grid-rows-2 max-md:h-16 max-md:grid-cols-1"
                  >
                    {isLeft ? (
                      <>
                        <span className="col-start-1 row-start-1 h-full w-1/2 justify-self-end rounded-bl-[var(--radius-surface-token)] border-b border-l border-service-border [border-bottom-width:var(--border-surface-width-token)] [border-left-width:var(--border-surface-width-token)] max-md:hidden" />
                        <span className="col-start-2 row-start-1 h-full border-b border-service-border [border-bottom-width:var(--border-surface-width-token)] max-md:hidden" />
                        <span className="col-start-3 row-start-2 h-full w-1/2 justify-self-start rounded-tr-[var(--radius-surface-token)] border-r border-t border-service-border [border-right-width:var(--border-surface-width-token)] [border-top-width:var(--border-surface-width-token)] max-md:hidden" />
                      </>
                    ) : (
                      <>
                        <span className="col-start-3 row-start-1 h-full w-1/2 justify-self-start rounded-br-[var(--radius-surface-token)] border-b border-r border-service-border [border-bottom-width:var(--border-surface-width-token)] [border-right-width:var(--border-surface-width-token)] max-md:hidden" />
                        <span className="col-start-2 row-start-1 h-full border-b border-service-border [border-bottom-width:var(--border-surface-width-token)] max-md:hidden" />
                        <span className="col-start-1 row-start-2 h-full w-1/2 justify-self-end rounded-tl-[var(--radius-surface-token)] border-l border-t border-service-border [border-left-width:var(--border-surface-width-token)] [border-top-width:var(--border-surface-width-token)] max-md:hidden" />
                      </>
                    )}

                    <span className="absolute left-6 top-0 hidden h-1/2 w-8 rounded-tl-[var(--radius-surface-token)] border-l border-t border-service-border [border-left-width:var(--border-surface-width-token)] [border-top-width:var(--border-surface-width-token)] max-md:block" />
                    <span className="absolute bottom-0 left-6 hidden h-1/2 w-8 rounded-bl-[var(--radius-surface-token)] border-b border-l border-service-border [border-bottom-width:var(--border-surface-width-token)] [border-left-width:var(--border-surface-width-token)] max-md:block" />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
