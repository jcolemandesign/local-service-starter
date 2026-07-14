import Image from "next/image";
import { SevenColumnGrid } from "@/components/primitives";

type ServicesThreeCardsRightSectionV3Props = {
  cards: ReadonlyArray<{
    body: string;
    imageAlt?: string;
    imageSrc?: string;
    size?: "large" | "medium" | "small";
    title: string;
  }>;
  eyebrow?: string;
  title?: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ServicesThreeCardsRightSectionV3({
  cards,
}: ServicesThreeCardsRightSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <SevenColumnGrid
        className="[--site-grid-row-gap:var(--inline-gap-active)]"
        minHeight="none"
      >
        {cards.map((card, index) => {
          const isLarge = card.size === "large";

          return (
            <article
              className={cx(
                "content-padding radius-medium flex flex-col self-start border border-service-border bg-service-surface shadow-service max-md:row-auto",
                isLarge
                  ? "card-min-medium col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                  : "card-min-short col-span-2 max-md:col-span-3 max-sm:col-span-1",
                index === 0 && "max-lg:col-span-2",
                index === 1 && "max-lg:col-span-3",
              )}
              key={card.title}
            >
              {card.imageSrc ? (
                <div className="radius-medium relative mb-6 aspect-[4/3] overflow-hidden bg-service-border">
                  <Image
                    alt={card.imageAlt ?? ""}
                    className="object-cover"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                    src={card.imageSrc}
                  />
                </div>
              ) : null}
              <h3 className="type-heading-sm text-service-ink">
                {card.title}
              </h3>
              <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                {card.body}
              </p>
            </article>
          );
        })}
      </SevenColumnGrid>
    </section>
  );
}
