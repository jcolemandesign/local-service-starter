import type { CSSProperties } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type FeatureStackedCard = {
  body: string;
  /** Ordinal marker on the icon placeholder. Derived from position when unset. */
  iconLabel?: string;
  title: string;
};

type FeatureStackedCardsSectionV3Props = {
  actionLabel: string;
  body: string;
  cards: readonly FeatureStackedCard[];
  eyebrow: string;
  title: string;
};

function FeatureIconPlaceholder({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} icon placeholder`}
      className="relative flex size-32 shrink-0 items-center justify-center rounded-full border border-service-ink text-service-ink max-lg:size-28 max-md:size-24"
    >
      <span className="type-label text-service-ink">{label}</span>
      <span
        aria-hidden="true"
        className="absolute inset-x-7 top-1/2 border-t border-service-ink max-lg:inset-x-6 max-md:inset-x-5"
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-7 left-1/2 border-l border-service-ink max-lg:inset-y-6 max-md:inset-y-5"
      />
    </div>
  );
}

export function FeatureStackedCardsSectionV3({
  actionLabel,
  body,
  cards,
  eyebrow,
  title,
}: FeatureStackedCardsSectionV3Props) {
  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-none items-start" padding="med">
        <SevenColumnGridItem
          className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
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

        <SevenColumnGridItem className="col-span-4 col-start-4 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1">
          <div className="grid gap-[var(--site-grid-gap)]">
            {cards.slice(0, 4).map((card, cardIndex) => (
              <article
                className="reveal-on-scroll reveal-role-card fluid-type-frame flex min-h-44 items-start gap-7 border-t border-service-border py-7 text-service-ink first:border-t-0 first:pt-0 max-md:gap-5 max-sm:min-h-0 max-sm:flex-col"
                key={card.title}
                style={{ "--reveal-index": cardIndex } as CSSProperties}
              >
                <FeatureIconPlaceholder
                  label={card.iconLabel ?? String(cardIndex + 1).padStart(2, "0")}
                />
                <div className="max-w-2xl">
                  <h3 className="type-heading-md text-service-ink">
                    {card.title}
                  </h3>
                  <p className="type-text-md wrap-pretty mt-heading-body-sm text-service-muted">
                    {card.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
