import type { CSSProperties } from "react";
import Image from "next/image";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type { SectionMirrorAlign } from "@/content/section-style-options";

type ServicesHeroCard = {
  body?: string;
  href?: string;
  title: string;
};

type HeroServicesSectionV3Props = {
  /** Which side the copy sits on; the photograph takes the other. */
  align?: SectionMirrorAlign;
  body: string;
  /** The service cards float over the hero photograph, so their panel is what
   *  keeps them readable - they ship filled and outlined, and these strip it. */
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  /** Off turns the tiles into a static statement of the service range. */
  cardLinks?: "on" | "off";
  cards: readonly ServicesHeroCard[];
  eyebrow: string;
  headingLevel?: 1 | 2;
  imageAlt: string;
  imageSrc: string;
  title: string;
};

/**
 * The two mirrored arrangements.
 *
 * The photograph is a full-bleed panel, so mirroring is not only a column swap:
 * the panel has to bleed off whichever edge it now sits against, which is what
 * the `panel` row moves. The `max-md` stack is shared - below that breakpoint
 * the copy is always above the image.
 */
const alignClassName: Record<
  SectionMirrorAlign,
  { copy: string; image: string; panel: string }
> = {
  left: {
    copy: "col-span-3 col-start-1 max-lg:col-span-2",
    image: "col-span-4 col-start-4 max-lg:col-span-5 max-lg:col-start-3",
    panel:
      "site-grid-bleed-inline-end max-md:inset-x-[calc(0px_-_var(--site-grid-bleed))]",
  },
  right: {
    copy: "col-span-3 col-start-5 max-lg:col-span-2 max-lg:col-start-6",
    image: "col-span-4 col-start-1 max-lg:col-span-5 max-lg:col-start-1",
    panel:
      "site-grid-bleed-inline-start max-md:inset-x-[calc(0px_-_var(--site-grid-bleed))]",
  },
};

/**
 * REVEAL ORDER, COMPUTED FROM `align` RATHER THAN FROM JSX ORDER.
 *
 * The copy is written first and rendered second under `right`, where the image
 * takes the leading columns. Staggering by source order would sweep
 * right-to-left on that arrangement, which reads as a rendering fault rather
 * than as a stagger.
 *
 * THE SERVICE CARDS ARE NOT UNITS. They are absolutely positioned inside the
 * image panel, so marking them would nest a revealable unit inside a revealable
 * one - two opacity fades multiplied into a muddy one. They are part of the
 * panel and they arrive with it, which is also what they look like: pinned to
 * its bottom edge rather than laid out beside it.
 */
const revealIndex: Record<
  SectionMirrorAlign,
  { body: number; heading: number; image: number }
> = {
  left: { heading: 0, body: 1, image: 2 },
  right: { image: 0, heading: 1, body: 2 },
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
  align = "left",
  body,
  cardBorder = "on",
  cardFill = "solid",
  cardLinks = "on",
  cards,
  eyebrow,
  headingLevel = 1,
  imageAlt,
  imageSrc,
  title,
}: HeroServicesSectionV3Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const visibleCards = cards.slice(0, 7);
  const alignment = alignClassName[align] ?? alignClassName.left;
  const order = revealIndex[align] ?? revealIndex.left;
  const cardClassName = [
    // `recipe-card-context` is explicit here because the fill cannot be an
    // unmodified card token: these sit on the photograph and the 92% is what
    // lets it read through. An opacity-modified class is a different class, so
    // the token-keyed rule cannot see it - this is the escape hatch the context
    // class exists for.
    //
    // The outline is `border-service-border`, not a literal white. A fixed
    // white ignored the recipe entirely and, more to the point, ignored the
    // border swatch, tone and weight the editor sets on this section - the
    // override composes into `--live-service-border`, which only a section
    // naming the token can read.
    "recipe-card-context radius-medium flex min-h-14 items-center gap-3 border border-service-border bg-bg-surface/92 px-4 py-3 text-service-ink shadow-service backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-service-accent",
    cardFill === "none" && "!bg-transparent !shadow-none !backdrop-blur-none",
    cardBorder === "off" && "!border-transparent",
    cardLinks === "on" &&
      "transition duration-200 hover:-translate-y-0.5 hover:border-service-accent hover:text-service-accent",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="overflow-x-clip bg-bg-page">
      <SevenColumnGrid className="section-min-sliver h-[calc(var(--section-min-screen)-var(--section-sliver-gap))] grid-rows-[minmax(0,1fr)] max-md:h-auto max-md:grid-rows-none">
        <SevenColumnGridItem
          alignY="middle"
          className={cx(
            "content-padding-y row-start-1 h-full min-h-0 max-md:col-span-3 max-md:col-start-1 max-md:row-start-1 max-sm:col-span-1",
            alignment.copy,
          )}
          measure="copyWide"
        >
          <div className="fluid-type-frame">
            <div
              className="reveal-on-scroll reveal-role-heading"
              style={{ "--reveal-index": order.heading } as CSSProperties}
            >
              <p className="type-label text-service-accent">{eyebrow}</p>
              <Heading className="type-display-lg mt-eyebrow-display text-service-ink">
                {title}
              </Heading>
            </div>
            <p
              className="reveal-on-scroll reveal-role-content type-text-xl wrap-pretty mt-display-body text-service-muted"
              style={{ "--reveal-index": order.body } as CSSProperties}
            >
              {body}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignY="stretch"
          className={cx(
            "relative row-start-1 h-full min-h-0 overflow-visible max-md:media-min-medium max-md:col-span-3 max-md:col-start-1 max-md:row-start-2 max-md:min-h-[38rem] max-sm:col-span-1",
            alignment.image,
          )}
        >
          <div
            className={cx(
              "reveal-on-scroll reveal-role-media",
              "absolute bottom-[calc(0px_-_var(--site-grid-inset-block))] top-[calc(0px_-_var(--site-grid-inset-block))] overflow-hidden bg-service-surface max-md:bottom-[calc(0px_-_var(--site-grid-inset-block))] max-md:top-0 max-md:!w-auto",
              alignment.panel,
            )}
            style={{ "--reveal-index": order.image } as CSSProperties}
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
              {visibleCards.map((card, index) => {
                const content = (
                  <>
                    <ServiceHeroIcon index={index} />
                    <span className="type-caption font-semibold leading-snug">
                      {card.title}
                    </span>
                  </>
                );

                return cardLinks === "on" ? (
                  <a
                    className={cardClassName}
                    href={serviceHref(card)}
                    key={`${card.title}-${index}`}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={cardClassName} key={`${card.title}-${index}`}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
