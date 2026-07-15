import type { CSSProperties } from "react";
import Image from "next/image";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ServicesHeroCard = {
  body?: string;
  href?: string;
  title: string;
};

type HeroServicesSectionV3Props = {
  body: string;
  cards: readonly ServicesHeroCard[];
  eyebrow: string;
  headingLevel?: 1 | 2;
  imageAlt: string;
  imageSrc: string;
  title: string;
};

const fullBleedImageStyle: CSSProperties = {
  width: "calc(100% + var(--site-grid-inset-inline))",
};

function serviceHref(card: ServicesHeroCard) {
  return (
    card.href ??
    `/services/${card.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}`
  );
}

function ServiceHeroIcon({ index }: { index: number }) {
  const variant = index % 4;

  return (
    <svg
      aria-hidden="true"
      className="size-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.4"
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
      {variant === 3 ? (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l2.8 2" />
        </>
      ) : null}
    </svg>
  );
}

export function HeroServicesSectionV3({
  body,
  cards,
  eyebrow,
  headingLevel = 1,
  imageAlt,
  imageSrc,
  title,
}: HeroServicesSectionV3Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const visibleCards = cards.slice(0, 7);

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-screen h-[var(--section-min-screen)] grid-rows-[minmax(0,1fr)] max-md:h-auto max-md:grid-rows-none">
        <SevenColumnGridItem
          alignY="middle"
          className="content-padding-y col-span-3 col-start-1 row-start-1 h-full min-h-0 max-lg:col-span-2 max-md:col-span-3 max-md:row-auto max-sm:col-span-1"
          measure="copyWide"
        >
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <Heading className="type-display-lg mt-eyebrow-display text-service-ink">
              {title}
            </Heading>
            <p className="type-text-xl wrap-pretty mt-display-body text-service-muted">
              {body}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignY="stretch"
          className="relative col-span-4 col-start-4 row-start-1 h-full min-h-0 overflow-visible max-lg:col-span-5 max-lg:col-start-3 max-md:media-min-medium max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-md:min-h-[38rem] max-sm:col-span-1"
        >
          <div
            className="absolute bottom-[calc(0px_-_var(--site-grid-inset-block))] right-[calc(var(--site-grid-inset-inline)*-1)] top-[calc(0px_-_var(--site-grid-inset-block))] overflow-hidden bg-service-surface max-md:inset-x-[calc(var(--site-grid-inset-inline)*-1)] max-md:bottom-[calc(0px_-_var(--site-grid-inset-block))] max-md:top-0 max-md:!w-auto"
            style={fullBleedImageStyle}
          >
            <Image
              alt={imageAlt}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 58vw"
              src={imageSrc}
            />

            <div className="absolute inset-x-5 bottom-5 grid grid-cols-2 gap-2 max-sm:grid-cols-1">
              {visibleCards.map((card, index) => (
                <a
                  className="radius-medium flex min-h-14 items-center gap-3 border border-white/65 bg-bg-surface/92 px-4 py-3 text-service-ink shadow-service backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-service-accent hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  href={serviceHref(card)}
                  key={`${card.title}-${index}`}
                >
                  <ServiceHeroIcon index={index} />
                  <span className="type-caption font-semibold leading-snug">
                    {card.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
