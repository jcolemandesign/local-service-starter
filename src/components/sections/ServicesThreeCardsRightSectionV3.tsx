import { SevenColumnGrid, SevenColumnGridItem } from "@/components/primitives";

type ServicePriorityCard = {
    body: string;
    href?: string;
    imageAlt?: string;
    imageSrc?: string;
    size?: "large" | "medium" | "small";
    title: string;
};

type ServicesThreeCardsRightSectionV3Props = {
  cards?: ReadonlyArray<ServicePriorityCard>;
  eyebrow?: string;
  priorityServices?: ReadonlyArray<ServicePriorityCard>;
  title?: string;
};

function ServiceCardIcon({ index }: { index: number }) {
  const variant = index % 3;

  return (
    <svg
      aria-hidden="true"
      className="size-7 text-service-accent"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      {variant === 0 ? (
        <>
          <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z" />
          <path d="M12 9v7" />
        </>
      ) : null}
      {variant === 1 ? (
        <>
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3" />
        </>
      ) : null}
      {variant === 2 ? (
        <>
          <path d="M12 3.5 19 6v5.1c0 4.4-2.7 7.3-7 9.4-4.3-2.1-7-5-7-9.4V6l7-2.5Z" />
          <path d="m8.8 12 2.1 2.1 4.4-4.4" />
        </>
      ) : null}
    </svg>
  );
}

export function ServicesThreeCardsRightSectionV3({
  cards,
  priorityServices,
}: ServicesThreeCardsRightSectionV3Props) {
  const displayCards = priorityServices ?? cards ?? [];

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid
        className="services-three-cards-grid"
        minHeight="none"
      >
        <SevenColumnGridItem className="col-span-7">
          <div className="services-three-cards-list">
            {displayCards.map((card, index) => {
              const href =
                card.href ??
                `/services/${card.title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "")}`;

              return (
                <a
                  className="services-three-card radius-medium relative flex min-h-28 items-center justify-center border border-service-border bg-service-surface text-center text-service-ink shadow-service transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent hover:shadow-[0_18px_48px_rgb(20_27_24_/_0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                  href={href}
                  key={card.title}
                >
                  <span className="pointer-events-none absolute right-4 top-4">
                    <ServiceCardIcon index={index} />
                  </span>
                  <div className="fluid-type-frame w-full p-[clamp(1.25rem,1.8vw,1.75rem)] max-md:p-6 max-sm:p-5">
                    <h3 className="type-heading-sm text-service-ink">
                      {card.title}
                    </h3>
                  </div>
                </a>
              );
            })}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
