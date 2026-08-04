import type { CSSProperties } from "react";
import Image from "next/image";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

type StreamCard = {
  eyebrow: string;
  title: string;
  body: string;
};

type ContentStickyCardStreamSectionV2Props = {
  eyebrow: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  title: string;
  body: string;
  cards: StreamCard[];
  colorRecipe?: SectionColorRecipe;
  imageAlt: string;
  imageHeight: number;
  imageSrc: string;
  imageWidth: number;
  showImage?: boolean;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentStickyCardStreamSectionV2({
  eyebrow,
  cardBorder = "on",
  cardFill = "solid",
  title,
  body,
  cards,
  colorRecipe = "default",
  imageAlt,
  imageHeight,
  imageSrc,
  imageWidth,
  showImage = false,
}: ContentStickyCardStreamSectionV2Props) {
  const transparentCards = cardFill === "none";
  // Section/card backgrounds and ink/muted text below use the generic
  // service-ink/bg-page tokens, which the pagebuilder-section-frame wrapper
  // already re-tints correctly for dark/accent recipes. text-service-accent
  // is the one token that stays a constant brand color regardless of recipe,
  // so it needs an explicit swap here or the eyebrow becomes invisible
  // against an accent-colored background.
  const colors =
    colorRecipe === "muted"
      ? {
          // surface-raised, not bg-bg-page: the muted frame remaps
          // --live-bg-page onto the service surface, so a page-colored card
          // renders as the same flat field as the section behind it.
          card: "bg-surface-raised",
          cardEyebrow: "text-service-accent",
          cardMuted: "text-service-muted",
          cardText: "text-service-ink",
          eyebrow: "text-service-accent",
          section: "bg-service-surface",
        }
      : {
          card:
            colorRecipe === "accent" ? "bg-bg-dark" : "bg-service-surface",
          cardEyebrow:
            colorRecipe === "accent" ? "text-white" : "text-service-accent",
          cardMuted:
            colorRecipe === "accent" ? "text-white/70" : "text-service-muted",
          cardText:
            colorRecipe === "accent" ? "text-white" : "text-service-ink",
          eyebrow:
            colorRecipe === "accent"
              ? "text-[var(--live-accent-ink)]"
              : "text-service-accent",
          section: "bg-bg-page",
        };

  return (
    <section className={colors.section}>
      <SevenColumnGrid className="section-min-active items-start">
        <SevenColumnGridItem
          className="col-span-3 max-lg:col-span-7"
          alignY="top"
        >
          <div className="sticky top-[var(--site-grid-inset-block)] max-lg:static">
            <div className="fluid-type-frame">
              <p className={cx("type-label", colors.eyebrow)}>{eyebrow}</p>
              <h2 className="type-display-lg mt-eyebrow-display text-service-ink">
                {title}
              </h2>
              <p className="type-text-xl measure-lead wrap-pretty mt-display-body text-service-muted">
                {body}
              </p>
            </div>
            {showImage ? (
              <div className="radius-medium mt-body-actions-lg w-full max-w-full overflow-hidden border border-service-border bg-service-surface shadow-service">
                <Image
                  alt={imageAlt}
                  className="h-auto w-full object-contain"
                  height={imageHeight}
                  sizes="(max-width: 1024px) 100vw, 43vw"
                  src={imageSrc}
                  width={imageWidth}
                />
              </div>
            ) : null}
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1"
          alignY="top"
        >
          <div className="grid card-grid-gap-xlrg">
            {cards.map((card, index) => (
              <article
                className={cx(
                  "reveal-on-scroll",
                  "fluid-type-frame",
                  "radius-medium",
                  "border border-service-border p-8 shadow-service max-md:p-6",
                  transparentCards ? "!bg-transparent !shadow-none" : colors.card,
                  cardBorder === "off" ? "!border-transparent" : undefined,
                )}
                key={card.title}
                style={{ "--reveal-index": index } as CSSProperties}
              >
                <div className="flex items-start justify-between gap-6">
                  <p className={cx("type-label", colors.cardEyebrow)}>
                    {card.eyebrow}
                  </p>
                  <span className={cx("type-caption shrink-0", colors.cardMuted)}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                {transparentCards ? (
                  <div className="mt-3 border-t border-service-border" />
                ) : null}
                <h3 className={cx("type-heading-lg mt-eyebrow-heading-md", colors.cardText)}>
                  {card.title}
                </h3>
                <p className={cx("type-text-md measure-copy wrap-pretty mt-heading-body-md", colors.cardMuted)}>
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
