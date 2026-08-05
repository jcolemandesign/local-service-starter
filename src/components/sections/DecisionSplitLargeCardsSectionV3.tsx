import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type {
  SectionIcons,
  TableCompareAlign,
} from "@/content/section-style-options";

type SplitLargeCard = {
  actionLabel: string;
  eyebrow: string;
  paragraphs: readonly string[];
  title: string;
};

type DecisionSplitLargeCardsSectionV3Props = {
  align?: TableCompareAlign;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  /** "off" drops each card's bottom-aligned link and the space it reserved. */
  cardLinks?: "on" | "off";
  cards: readonly SplitLargeCard[];
  /** This section's take on the shared icons axis: a marker indenting every
   *  paragraph chunk. See `iconsOptions` in `section-style-options`. */
  icons?: SectionIcons;
};

/** Small enough to sit in the gutter beside a paragraph without competing with it. */
function ChunkIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mt-1.5 size-4 shrink-0 text-service-accent"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        d="M2.5 8h10M8.5 4l4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

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
  cardLinks = "on",
  cards,
  icons = "on",
}: DecisionSplitLargeCardsSectionV3Props) {
  const columns = alignClassName[align] ?? alignClassName.center;
  const tabletColumns = tabletClassName[align] ?? tabletClassName.center;

  return (
    <section className="bg-bg-page">
      {/* Stretched, so however much copy each card carries the pair still ends
          level. No floor height: with the link off there is nothing to reserve
          space for, and a minimum would show as dead space under short copy. */}
      <LayoutGrid
        className="section-min-tiny items-stretch"
        columns={14}
        padding="med"
      >
        {[0, 1].map((slot) => {
          const card = cards[slot];

          return card ? (
            <LayoutGridItem
              alignY="stretch"
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
                cardLinks={cardLinks}
                icons={icons}
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
  cardLinks,
  icons,
}: {
  card: SplitLargeCard;
  cardBorder: "on" | "off";
  cardFill: "solid" | "none";
  cardLinks: "on" | "off";
  icons: SectionIcons;
}) {
  const paragraphs = card.paragraphs.filter((paragraph) => paragraph.trim());

  return (
    <article
      className={cx(
        "fluid-type-frame radius-medium flex h-full flex-col border border-service-border bg-service-surface text-service-ink shadow-none",
        cardFill === "solid" ? "p-12 max-md:p-8" : "p-6",
        cardFill === "none" && "!bg-transparent !shadow-none",
        cardBorder === "off" && "!border-transparent",
      )}
    >
      <p className="type-label text-service-accent">{card.eyebrow}</p>
      <h3 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
        {card.title}
      </h3>

      {/* Each paragraph is a chunk, divided by a rule rather than only by
          space, so a card carrying several of them still reads as distinct
          points instead of one long column of prose. The rule goes before
          every chunk but the first, which is what keeps it between them and
          off the bottom edge. */}
      <div className="mt-heading-body-md grid gap-6">
        {paragraphs.map((paragraph, index) => (
          <div key={paragraph}>
            {index > 0 ? (
              <hr className="mb-6 border-t border-service-border" />
            ) : null}
            <div className="flex gap-3">
              {icons === "on" ? <ChunkIcon /> : null}
              <p className="type-text-lg wrap-pretty text-service-muted">
                {paragraph}
              </p>
            </div>
          </div>
        ))}
      </div>

      {cardLinks === "on" ? (
        <a
          className="type-label mt-auto inline-flex w-fit items-center border-b border-service-ink pt-8 text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
          href="#contact"
        >
          {card.actionLabel}
        </a>
      ) : null}
    </article>
  );
}
