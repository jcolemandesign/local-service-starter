import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { SectionHeadingSize } from "@/content/section-style-options";

export type NarrativeFeatureRailCard = {
  actionHref?: string;
  actionLabel?: string;
  body: string;
  eyebrow: string;
  title: string;
};

export type ContentNarrativeFeatureRailAlign = "left" | "right";

const headingSizeClassName: Record<SectionHeadingSize, string> = {
  "heading-lg": "type-heading-lg",
  "heading-xl": "type-heading-xl",
  "display-lg": "type-display-lg",
};

export type ContentNarrativeFeatureRailSectionV3Props = {
  align?: ContentNarrativeFeatureRailAlign;
  bullets: readonly string[];
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  cards: readonly NarrativeFeatureRailCard[];
  eyebrow: string;
  imageAlt: string;
  imageSrc: string;
  headingSize?: SectionHeadingSize;
  intro: string;
  paragraphs: readonly string[];
  showImage?: boolean;
  textLinkHref: string;
  textLinkLabel: string;
  title: string;
};

export function ContentNarrativeFeatureRailSectionV3({
  align = "right",
  bullets,
  cardBorder = "on",
  cardFill = "solid",
  cards,
  eyebrow,
  imageAlt,
  imageSrc,
  headingSize = "display-lg",
  intro,
  paragraphs,
  showImage = true,
  textLinkHref,
  textLinkLabel,
  title,
}: ContentNarrativeFeatureRailSectionV3Props) {
  const contentPosition =
    align === "right" ? "col-start-1" : "col-start-8 max-lg:col-start-5";
  const contentSpan = align === "right" ? "col-span-8" : "col-span-7";
  const railPosition =
    align === "right" ? "col-start-9 max-lg:col-start-7" : "col-start-1";
  /**
   * Only the rail is revealable, and it staggers down its own column.
   *
   * The prose beside it is `sticky`: its box travels with the scroller instead
   * of through it, so a view timeline on it does not describe an arrival at
   * all - the same reason the split-header column in the services bento is left
   * unmarked. It is also the thing a reader is reading while the rail scrolls
   * past, which is exactly what should not be moving.
   *
   * The offset keeps the top card at index 0 when the image is turned off,
   * rather than opening the sequence on a gap.
   */
  const railRevealOffset = showImage ? 1 : 0;
  const hasUnframedRail = cardFill === "none" && cardBorder === "off";

  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="items-start"
        columns={14}
        minHeight="none"
        padding="lrg"
      >
        <LayoutGridItem
          alignY="stretch"
          className={`${contentSpan} ${contentPosition} row-start-1 max-lg:col-span-6 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2`}
        >
          <article className="fluid-type-frame sticky top-[var(--site-grid-inset-block)] self-start pr-8 max-lg:pr-2 max-md:static max-md:pr-0">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2
              className={`${headingSizeClassName[headingSize]} wrap-pretty mt-eyebrow-display text-service-ink`}
            >
              {title}
            </h2>
            <p className="type-text-xl measure-lead wrap-pretty mt-display-body text-service-muted">
              {intro}
            </p>

            <div className="measure-longform mt-14 grid gap-6 max-md:mt-10">
              {paragraphs.map((paragraph, index) => (
                <p
                  className={
                    index === 0
                      ? "type-text-lg wrap-pretty text-service-ink"
                      : "type-text-md wrap-pretty text-service-muted"
                  }
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="measure-copy-wide mt-10 grid gap-3">
              {bullets.map((bullet) => (
                <li
                  className="type-text-sm flex items-start gap-3 text-service-ink"
                  key={bullet}
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-service-accent"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <a
              className="type-text-sm mt-8 inline-block font-semibold text-service-ink underline decoration-service-accent decoration-2 underline-offset-4 transition-colors hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
              href={textLinkHref}
            >
              {textLinkLabel}
            </a>
          </article>
        </LayoutGridItem>

        <LayoutGridItem
          className={`col-span-6 ${railPosition} row-start-1 max-lg:col-span-4 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-md:mt-12 max-sm:col-span-2`}
        >
          <aside className="grid card-grid-gap-med">
            {showImage ? (
              <div
                className="reveal-on-scroll relative aspect-[4/3] overflow-hidden rounded-[var(--radius-surface-token)] bg-service-border"
                style={{ "--reveal-index": 0 } as CSSProperties}
              >
                <Image
                  alt={imageAlt}
                  className="object-cover"
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 40vw, 43vw"
                  src={imageSrc}
                />
              </div>
            ) : null}

            <div className={hasUnframedRail ? "grid" : "contents"}>
              {cards.slice(0, 3).map((card, index) => (
                <Fragment key={`${card.eyebrow}-${card.title}`}>
                  {hasUnframedRail && index > 0 ? (
                    <div aria-hidden="true" className="border-t border-service-border" />
                  ) : null}
                  <article
                    className={[
                      // Marks this card as a revealable unit. Inert unless the
                      // section's animation toggle is on - see `section-reveal` in
                      // globals.css.
                      "reveal-on-scroll",
                      "fluid-type-frame radius-medium border border-service-border bg-service-surface p-6 shadow-service",
                      cardFill === "none" && "!bg-transparent !shadow-none",
                      cardBorder === "off" && "!border-transparent",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={
                      {
                        "--reveal-index": index + railRevealOffset,
                      } as CSSProperties
                    }
                  >
                    <p className="type-label text-service-accent">{card.eyebrow}</p>
                    <h3 className="type-heading-md wrap-pretty mt-eyebrow-heading-md text-service-ink">
                      {card.title}
                    </h3>
                    <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                      {card.body}
                    </p>
                    {card.actionLabel && card.actionHref ? (
                      <Button
                        className="mt-body-actions-sm"
                        href={card.actionHref}
                        treatment="text-lift"
                      >
                        {card.actionLabel}
                      </Button>
                    ) : null}
                  </article>
                </Fragment>
              ))}
            </div>
          </aside>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
