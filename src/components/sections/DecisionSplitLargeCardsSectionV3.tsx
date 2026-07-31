import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { TableCompareAlign } from "@/content/section-style-options";

type SplitLargeCard = {
  body: string;
  eyebrow: string;
  title: string;
};

type DecisionSplitLargeCardsSectionV3Props = {
  align?: TableCompareAlign;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  cards: readonly SplitLargeCard[];
};

/**
 * Two adjacent cards of six columns each, leaving two spare columns for the
 * alignment axis to place:
 *
 *   left     1-12   two spare columns trailing
 *   center   2-13   one spare column either side
 *   right    3-14   two spare columns leading
 *
 * Fourteen columns rather than the seven this section used to run on, because
 * centring is what needs them: two cards of 3/7 fill six of seven columns, and
 * a single spare column cannot be split either side of them. Doubling the grid
 * keeps each card exactly the width it always was - 6/14 is 3/7 - and buys the
 * even split. This is the same geometry the comparison tables use, which is why
 * it shares their `align` axis rather than declaring its own.
 */
const alignClassName: Record<TableCompareAlign, [string, string]> = {
  left: ["col-start-1", "col-start-7"],
  center: ["col-start-2", "col-start-8"],
  right: ["col-start-3", "col-start-9"],
};

/**
 * Tablet keeps the three positions on ten columns - four-wide cards, adjacent,
 * with two spare to place - so the alignment still reads before the layout
 * stacks at `max-md`.
 */
const tabletClassName: Record<TableCompareAlign, [string, string]> = {
  left: ["max-lg:col-start-1", "max-lg:col-start-5"],
  center: ["max-lg:col-start-2", "max-lg:col-start-6"],
  right: ["max-lg:col-start-3", "max-lg:col-start-7"],
};

const cardSpanClassName =
  "col-span-6 max-lg:col-span-4 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2 max-sm:col-start-1";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function DecisionSplitLargeCardsSectionV3({
  align = "center",
  cardBorder = "on",
  cardFill = "solid",
  cards,
}: DecisionSplitLargeCardsSectionV3Props) {
  const columns = alignClassName[align] ?? alignClassName.center;
  const tabletColumns = tabletClassName[align] ?? tabletClassName.center;

  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="section-min-tiny items-start"
        columns={14}
        padding="med"
      >
        {[0, 1].map((slot) => {
          const card = cards[slot];

          return card ? (
            <LayoutGridItem
              className={cx(
                cardSpanClassName,
                columns[slot],
                tabletColumns[slot],
              )}
              key={card.title || slot}
              measure="none"
            >
              <SplitLargeCard
                card={card}
                cardBorder={cardBorder}
                cardFill={cardFill}
              />
            </LayoutGridItem>
          ) : null;
        })}
      </LayoutGrid>
    </section>
  );
}

function SplitLargeCard({
  card,
  cardBorder,
  cardFill,
}: {
  card: SplitLargeCard;
  cardBorder: "on" | "off";
  cardFill: "solid" | "none";
}) {
  return (
    <article
      className={cx(
        "fluid-type-frame radius-medium min-h-64 border border-service-border bg-service-surface p-6 text-service-ink shadow-none max-md:min-h-0",
        cardFill === "none" && "!bg-transparent !shadow-none",
        cardBorder === "off" && "!border-transparent",
      )}
    >
      <p className="type-label text-service-accent">{card.eyebrow}</p>
      <h3 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
        {card.title}
      </h3>
      <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
        {card.body}
      </p>
    </article>
  );
}
