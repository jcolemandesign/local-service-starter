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

        {cards.slice(0, 3).map((card, index) => (
          <SevenColumnGridItem
            alignY="stretch"
            className={[
              "content-padding radius-medium card-min-short col-span-2 row-start-2 border border-service-border bg-service-surface shadow-service max-md:col-span-7 max-md:col-start-1 max-md:row-auto",
              index === 0 ? "col-start-2" : undefined,
              index === 1 ? "col-start-4" : undefined,
              index === 2 ? "col-start-6" : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
            key={card.title}
            measure="copyWide"
          >
            <article className="flex h-full flex-col justify-between gap-8">
              <h3 className="type-heading-sm text-service-ink">
                {card.title}
              </h3>
              <p className="type-text-sm wrap-pretty text-service-muted">
                {card.body}
              </p>
            </article>
          </SevenColumnGridItem>
        ))}
      </SevenColumnGrid>
    </section>
  );
}
