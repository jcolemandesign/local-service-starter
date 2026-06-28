import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type FeatureAsymmetricCard = {
  body: string;
  iconLabel: string;
  title: string;
};

type FeatureAsymmetricCardsSectionV3Props = {
  actionLabel: string;
  body: string;
  cards: readonly FeatureAsymmetricCard[];
  eyebrow: string;
  title: string;
};

const cardPositions = [
  "col-start-1 row-start-1",
  "col-start-3 row-start-1 mt-12 max-lg:mt-0",
  "col-start-1 row-start-2 mt-10 max-lg:mt-0",
  "col-start-3 row-start-2 -mt-2 max-lg:mt-0",
];

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
  body,
  cards,
  eyebrow,
  title,
}: FeatureAsymmetricCardsSectionV3Props) {
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
          <div className="grid grid-cols-4 gap-[var(--site-grid-gap)] max-md:grid-cols-1">
            {cards.slice(0, 4).map((card, index) => (
              <article
                className={cx(
                  "fluid-type-frame col-span-2 min-h-72 py-5 text-service-ink max-md:col-span-1 max-md:col-start-1 max-md:row-auto max-md:min-h-0",
                  cardPositions[index],
                )}
                key={card.title}
              >
                <FeatureIconPlaceholder label={card.iconLabel} />
                <h3 className="type-heading-sm mt-body-actions-md text-service-ink">
                  {card.title}
                </h3>
                <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
