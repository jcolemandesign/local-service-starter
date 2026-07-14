import Image from "next/image";
import { SevenColumnGrid } from "@/components/primitives";

type ServicesThreeCardsRightSectionV3Props = {
  cards: ReadonlyArray<{
    body: string;
    href?: string;
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
        className="services-three-cards-grid [--site-grid-row-gap:var(--inline-gap-active)]"
        minHeight="none"
      >
        {cards.map((card, index) => {
          const isLarge = card.size === "large";
          const href =
            card.href ??
            `/services/${card.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")}`;

          return (
            <a
              className={cx(
                "radius-medium group/service-link-card flex flex-col self-start overflow-hidden border border-service-border bg-service-surface text-service-ink shadow-service transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent hover:shadow-[0_18px_48px_rgb(20_27_24_/_0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent max-md:row-auto",
                isLarge
                  ? "col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                  : "col-span-2 max-md:col-span-3 max-sm:col-span-1",
                index === 0 && "max-lg:col-span-2",
                index === 1 && "max-lg:col-span-3",
              )}
              href={href}
              key={card.title}
            >
              {card.imageSrc ? (
                <div className="relative aspect-[16/10] overflow-hidden bg-service-border">
                  <Image
                    alt={card.imageAlt ?? ""}
                    className="object-cover transition-transform duration-300 ease-out group-hover/service-link-card:scale-[1.035]"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                    src={card.imageSrc}
                  />
                </div>
              ) : null}
              <div className="content-padding fluid-type-frame grid gap-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <h3 className="type-heading-sm text-service-ink">
                    {card.title}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="radius-button flex size-9 shrink-0 items-center justify-center border border-service-border bg-bg-page text-sm font-semibold text-service-accent transition-colors group-hover/service-link-card:border-service-accent group-hover/service-link-card:bg-service-accent group-hover/service-link-card:text-text-inverse"
                  >
                    -&gt;
                  </span>
                </div>
                <p className="type-text-sm wrap-pretty text-service-muted">
                  {card.body}
                </p>
              </div>
            </a>
          );
        })}
      </SevenColumnGrid>
    </section>
  );
}
