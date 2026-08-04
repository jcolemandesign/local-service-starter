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
  const cardsFirst = align === "right";
  const displayCards = cards.slice(0, 4);

  return (
    // The neutral page token, not the surface token. The colour recipe paints
    // the section frame and force-overrides `> section` on muted, but leaves the
    // section's own background alone on default - so a section painted with the
    // surface token has no default state and reads as muted at every recipe.
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none items-start" padding="med">
        <SevenColumnGridItem
          className={`col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1 ${
            cardsFirst ? "col-start-5 max-lg:col-start-1" : ""
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
          className={`col-span-4 col-start-4 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1 ${
            cardsFirst ? "col-start-1" : ""
          }`}
        >
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
                      className="reveal-on-scroll fluid-type-frame min-h-60 pb-0 pt-5 text-service-ink max-md:min-h-0"
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
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
