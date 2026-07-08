import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ServicesThreeCardsRightSectionV3Props = {
  cards: ReadonlyArray<{
    body: string;
    title: string;
  }>;
  eyebrow: string;
  title: string;
};

export function ServicesThreeCardsRightSectionV3({
  cards,
  eyebrow,
  title,
}: ServicesThreeCardsRightSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-short">
        <SevenColumnGridItem
          alignX="left"
          alignY="top"
          className="col-span-3 row-start-1 max-md:col-span-7"
        >
          <p className="type-label text-service-accent">{eyebrow}</p>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="left"
          alignY="top"
          className="col-span-4 col-start-4 row-start-1 max-md:col-span-7 max-md:col-start-1 max-md:row-start-2"
          measure="copyWide"
        >
          <h3 className="type-heading-lg text-service-ink">{title}</h3>
        </SevenColumnGridItem>

        <div
          aria-hidden="true"
          className="col-span-1 col-start-1 row-start-2 max-md:hidden"
        />

        <SevenColumnGridItem className="col-span-6 col-start-2 row-start-2 max-md:col-span-7 max-md:col-start-1 max-md:row-auto">
          <div className="grid grid-cols-3 gap-[var(--inline-gap-active)] max-lg:grid-cols-2 max-md:grid-cols-1">
            {cards.map((card) => (
              <article
                className="content-padding radius-medium card-min-short flex h-full flex-col justify-between border border-service-border bg-service-surface shadow-service layout-gap-lrg"
                key={card.title}
              >
                <h3 className="type-heading-sm text-service-ink">
                  {card.title}
                </h3>
                <p className="type-text-sm wrap-pretty text-service-muted">
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
