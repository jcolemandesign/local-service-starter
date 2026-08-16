import type { CSSProperties } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type FeatureAsymmetricCard = {
  body: string;
  /** Ordinal marker on the icon placeholder. Derived from position when unset. */
  iconLabel?: string;
  title: string;
};

type FeatureAsymmetricCardsSectionV3Props = {
  actionLabel: string;
  align?: FeatureAsymmetricCardsAlign;
  body: string;
  cards: readonly FeatureAsymmetricCard[];
  eyebrow: string;
  title: string;
};

export type FeatureAsymmetricCardsAlign = "left" | "right";

function FeatureIconPlaceholder({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} icon placeholder`}
      className="relative flex size-24 items-center justify-center rounded-full border border-service-ink text-service-ink"
    >
      <span className="type-label text-service-ink">{label}</span>
      <span
        aria-hidden="true"
        className="absolute inset-x-5 top-1/2 border-t border-service-ink"
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-5 left-1/2 border-l border-service-ink"
      />
    </div>
  );
}

export function FeatureAsymmetricCardsSectionV3({
  actionLabel,
  align = "left",
  body,
  cards,
  eyebrow,
  title,
}: FeatureAsymmetricCardsSectionV3Props) {
  const cardsOnLeft = align === "right";
  const displayCards = cards.slice(0, 4);
  /**
   * Parity picks the arrangement.
   *
   * The two-up grid only resolves on an even count - an odd one leaves a single
   * card alone in the last row beside a gap, which reads as a layout that broke
   * rather than a set that happens to be three. So an odd count changes
   * arrangement instead: one card per row, icon beside the copy rather than
   * above it, which has no parity to satisfy at any length.
   *
   * Measured on what is rendered, not on what was supplied, because the cap
   * above decides the last row: five cards draw four and stay a grid.
   */
  const isStacked = displayCards.length % 2 === 1;

  return (
    // The neutral page token, not the surface token. The colour recipe paints
    // the section frame and force-overrides `> section` on muted, but leaves the
    // section's own background alone on default - so a section painted with the
    // surface token has no default state and reads as muted at every recipe.
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none items-start" padding="med">
        {/* Each column names exactly one `col-start`, chosen by the ternary,
            rather than a base start with an override appended after it.
            Appending emitted both on the cards column, and two utilities of
            equal specificity are settled by their order in the generated
            stylesheet, not by their order in the class attribute - Tailwind
            emits `col-start-1` before `col-start-4`, so the base won and the
            cards never moved. The text moved, the cards did not, and the two
            overlapped in columns 5-7. */}
        <SevenColumnGridItem
          className={`col-span-3 row-start-1 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1 ${
            cardsOnLeft ? "col-start-5" : "col-start-1"
          }`}
          measure="copyWide"
        >
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-display-lg mt-eyebrow-display text-service-ink">
              {title}
            </h2>
            <p className="type-text-xl wrap-pretty mt-heading-body-lg text-service-ink">
              {body}
            </p>
            <div className="mt-body-actions-lg">
              <a
                className="type-label inline-flex min-h-12 items-center border-b border-service-ink text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                href="#contact"
              >
                {actionLabel}
              </a>
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className={`col-span-4 row-start-1 max-lg:col-span-5 max-lg:col-start-1 max-lg:row-start-auto max-md:col-span-3 max-sm:col-span-1 ${
            cardsOnLeft ? "col-start-1" : "col-start-4"
          }`}
        >
          {/* Both arrangements below carry a card section's indent, so these
              line up with the cards in the section above or below them - the
              split decision is the usual neighbour.

              These cards draw no surface, so without it the icon started hard
              on the column edge while a real card's content sat 20px in. The
              value is that padding plus the border, because a bordered card
              insets its content by both and matching only the padding left
              these two pixels adrift. Token, not a literal 22px, so it tracks
              the border width if that is ever retuned. */}
          {isStacked ? (
            <div className="grid gap-y-[var(--site-grid-gap)]">
              {displayCards.map((card, cardIndex) => (
                <article
                  className="reveal-on-scroll reveal-role-card fluid-type-frame grid grid-cols-[auto_minmax(0,1fr)] items-start gap-[var(--site-grid-gap)] px-[calc(1.25rem+var(--border-surface-width-token))] text-service-ink max-sm:grid-cols-1"
                  key={card.title}
                  style={{ "--reveal-index": cardIndex } as CSSProperties}
                >
                  <FeatureIconPlaceholder
                    label={
                      card.iconLabel ?? String(cardIndex + 1).padStart(2, "0")
                    }
                  />
                  <div>
                    <h3 className="type-heading-sm text-service-ink">
                      {card.title}
                    </h3>
                    <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                      {card.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
          <div className="grid gap-x-[var(--site-grid-gap)] gap-y-3">
            {[
              displayCards.slice(0, 2),
              displayCards.slice(2, 4),
            ].map((row, rowIndex) => (
              <div
                className="grid grid-cols-2 items-start gap-[var(--site-grid-gap)] max-md:grid-cols-1"
                key={`feature-asymmetric-row-${rowIndex}`}
              >
                {row.map((card, columnIndex) => {
                  const cardIndex = rowIndex * 2 + columnIndex;

                  return (
                    <article
                      className="reveal-on-scroll reveal-role-card fluid-type-frame min-h-60 px-[calc(1.25rem+var(--border-surface-width-token))] pb-0 pt-5 text-service-ink max-md:min-h-0"
                      key={card.title}
                      style={{ "--reveal-index": cardIndex } as CSSProperties}
                    >
                      <FeatureIconPlaceholder
                        label={
                          card.iconLabel ?? String(cardIndex + 1).padStart(2, "0")
                        }
                      />
                      <h3 className="type-heading-sm mt-body-actions-md text-service-ink">
                        {card.title}
                      </h3>
                      <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                        {card.body}
                      </p>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
          )}
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
