import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ServicesThreeCardsRightSectionV3Props = {
  cards: ReadonlyArray<{
    body: string;
    size?: "large" | "medium" | "small";
    title: string;
  }>;
  eyebrow: string;
  title: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ServicesThreeCardsRightSectionV3({
  cards,
  eyebrow,
  title,
}: ServicesThreeCardsRightSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-short [--site-grid-row-gap:var(--inline-gap-active)]">
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

        {cards.map((card, index) => {
          const isLarge = card.size === "large" || (!card.size && index === 2);

          return (
            <article
              className={cx(
                "content-padding radius-medium row-start-2 flex h-full flex-col justify-between border border-service-border bg-service-surface shadow-service layout-gap-lrg max-md:row-auto",
                isLarge
                  ? "card-min-medium col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                  : "card-min-short col-span-2 max-md:col-span-3 max-sm:col-span-1",
                index === 0 && "col-start-1 max-lg:col-span-2",
                index === 1 && "col-start-3 max-lg:col-span-3 max-lg:col-start-3 max-md:col-start-1",
                index === 2 && "col-start-5 max-lg:col-start-1 max-lg:row-start-3 max-md:col-start-1",
              )}
              key={card.title}
            >
              <h3 className="type-heading-sm text-service-ink">
                {card.title}
              </h3>
              <p className="type-text-sm wrap-pretty text-service-muted">
                {card.body}
              </p>
            </article>
          );
        })}
      </SevenColumnGrid>
    </section>
  );
}
