import type { CSSProperties } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type SplitDecisionCard = {
  /** The card's own text link. Each path gets its own next step, because the
   *  two paths are different next steps - that is the whole comparison. */
  actionLabel: string;
  body: string;
  eyebrow: string;
  title: string;
};

type DecisionSplitDecisionSectionV3Props = {
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  /**
   * ON THE CARDS, which is what the axis is called and what its other members
   * do. This section used to answer the toggle with a SINGLE link under the
   * left-column explanation and leave the two comparison cards bare - so a
   * control named "card links" put a link everywhere except on a card, and the
   * two sections it shares a family with both put one inside each card.
   */
  cardLinks?: "on" | "off";
  cards: readonly SplitDecisionCard[];
  eyebrow: string;
  title: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function DecisionSplitDecisionSectionV3({
  body,
  cardBorder = "on",
  cardFill = "solid",
  cardLinks = "on",
  cards,
  eyebrow,
  title,
}: DecisionSplitDecisionSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-tiny items-start" padding="sml">
        <SevenColumnGridItem
          className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
          measure="copyWide"
        >
          <div
            className="reveal-on-scroll reveal-role-heading fluid-type-frame"
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
              {title}
            </h2>
            <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
              {body}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-4 col-start-4 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1">
          <div className="grid grid-cols-2 items-stretch gap-[var(--site-grid-gap)] max-md:grid-cols-1">
            {cards.slice(0, 2).map((card, index) => (
              <article
                className={cx(
                  // Was `pulse-on-scroll`, which is a gated rule with no
                  // offered value behind it - so this section was the one
                  // marked-up member of its family that could not be animated
                  // at all. The pulse rule and its tokens stay in globals.css
                  // as the dormant path a future animation suite can promote;
                  // what this card marks is the entrance the builder can
                  // actually switch on.
                  "reveal-on-scroll reveal-role-card",
                  "fluid-type-frame radius-medium flex min-h-56 flex-col border border-service-border bg-service-surface p-5 text-service-ink shadow-none max-md:min-h-0",
                  "recipe-card-context",
                  cardFill === "none" && "!bg-transparent !shadow-none",
                  cardBorder === "off" && "!border-transparent",
                )}
                key={card.title}
                style={{ "--reveal-index": index + 1 } as CSSProperties}
              >
                <p className="type-text-sm font-semibold text-service-accent">
                  {card.eyebrow}
                </p>
                <h3 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                  {card.title}
                </h3>
                <p className="type-text-md wrap-pretty mt-heading-body-sm text-service-muted">
                  {card.body}
                </p>
                {cardLinks === "on" ? (
                  /* `mt-auto` against the column, so the two links sit level
                     whatever the copy above them does - the pair reads as a
                     comparison, and two links at different heights reads as
                     one card having more to say. Same placement both siblings
                     in this family use. */
                  <a
                    className={cx(
                      "type-label mt-auto inline-flex min-h-12 w-fit items-center border-b pt-6 text-service-ink transition-colors hover:text-service-accent",
                      cardBorder === "off"
                        ? "!border-transparent hover:!border-transparent"
                        : "border-service-ink hover:border-service-accent",
                    )}
                    href="#contact"
                  >
                    {card.actionLabel}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
