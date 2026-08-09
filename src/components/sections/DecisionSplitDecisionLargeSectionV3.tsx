import { LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type DecisionSplitDecisionLargeAlign = "left" | "center" | "right";

export type DecisionSplitDecisionLargeCard = {
  actionLabel: string;
  eyebrow: string;
  paragraphs: readonly string[];
  points: readonly string[];
  title: string;
};

export type DecisionSplitDecisionLargeSectionV3Props = {
  align?: DecisionSplitDecisionLargeAlign;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  /** "off" drops each card's bottom-aligned text link, leaving the pair as
   *  static comparison panels. */
  cardLinks?: "on" | "off";
  cards: readonly DecisionSplitDecisionLargeCard[];
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const cardStartClasses: Record<
  DecisionSplitDecisionLargeAlign,
  readonly [string, string]
> = {
  left: ["col-start-1", "col-start-7"],
  center: ["col-start-2", "col-start-8"],
  right: ["col-start-3", "col-start-9"],
};

export function DecisionSplitDecisionLargeSectionV3({
  align = "center",
  cardBorder = "on",
  cardFill = "solid",
  cardLinks = "on",
  cards,
}: DecisionSplitDecisionLargeSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="section-min-none items-stretch"
        columns={14}
        padding="lrg"
      >
        {cards.slice(0, 2).map((card, index) => (
          // Stretch, not the default top alignment: without it each card sizes
          // to its own copy and the pair renders ragged. Stretched, both take
          // the taller card's height and the card's existing `mt-auto` on the
          // link parks it at the bottom while the rest stays top-aligned.
          <LayoutGridItem
            alignY="stretch"
            className={`col-span-6 ${cardStartClasses[align][index]} max-lg:col-span-5 max-lg:col-start-auto max-md:col-span-6 max-sm:col-span-2`}
            key={card.title}
          >
            <article
              className={cx(
                "fluid-type-frame flex h-full min-h-96 flex-col rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface p-8 text-service-ink shadow-service max-md:min-h-0 max-md:p-6",
                "recipe-card-context",
                cardFill === "none" && "!bg-transparent !shadow-none",
                cardBorder === "off" && "!border-transparent",
              )}
            >
              <p className="type-label text-service-accent">{card.eyebrow}</p>
              <h2 className="type-heading-xl wrap-pretty mt-eyebrow-heading-lg text-service-ink">
                {card.title}
              </h2>

              <div className="mt-heading-body-md grid gap-4">
                {card.paragraphs.slice(0, 2).map((paragraph) => (
                  <p
                    className="type-text-md wrap-pretty text-service-muted"
                    key={paragraph}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <ul className="mt-8 grid gap-3 border-t border-service-border pt-6">
                {card.points.map((point) => (
                  <li
                    className="type-text-sm flex gap-3 text-service-ink"
                    key={point}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-service-accent"
                    />
                    <span className="wrap-pretty">{point}</span>
                  </li>
                ))}
              </ul>

              {cardLinks === "on" ? (
                <a
                  className="type-label mt-auto inline-flex min-h-12 w-fit items-center border-b border-service-ink pt-8 text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                  href="#contact"
                >
                  {card.actionLabel}
                </a>
              ) : null}
            </article>
          </LayoutGridItem>
        ))}
      </LayoutGrid>
    </section>
  );
}
