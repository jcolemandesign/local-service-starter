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
  imageAlt,
  imageHeight,
  imageSrc,
  imageWidth,
  showImage = false,
}: ContentStickyCardStreamSectionV2Props) {
  const transparentCards = cardFill === "none";
  const colors = {
    card: "bg-service-surface",
    cardEyebrow: "text-service-accent",
    cardMuted: "text-service-muted",
    cardText: "text-service-ink",
    eyebrow: "text-service-accent",
    section: "bg-bg-page",
  };

  return (
    <section className={colors.section}>
      <SevenColumnGrid className="section-min-active items-start">
        {/* `stretch`, not the default `top`: the grid's `items-start` leaves
            every item at content height, and a sticky element inside a box its
            own height has nowhere to travel - it is sticky and never moves.
            Stretching this column to the card stream's height supplies the
            distance, and `h-fit` keeps the child from stretching with it and
            giving that distance straight back. */}
        <SevenColumnGridItem
          className="col-span-3 max-lg:col-span-7"
          alignY="stretch"
        >
          <div className="sticky top-[var(--site-grid-inset-block)] h-fit max-lg:static">
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
              /* A media unit, and an OPTIONAL one - which is the whole reason
                 no suite is gated on `media`. This panel exists only while
                 `showImage` is on, and that is a per-page toggle rather than a
                 fact about the component, so a suite that needed it would be
                 offered on this section and then quietly stop meaning anything
                 the moment someone switched the image off. Lateral slides it in
                 from the section's leading edge when it is here, and has one
                 less thing to move when it is not.

                 No edge hint: this column is the leading one, so the inline
                 start - the default - is already the edge it sits against. */
              <div
                className="reveal-on-scroll reveal-role-media radius-medium mt-body-actions-lg w-full max-w-full overflow-hidden border border-service-border bg-service-surface shadow-service"
                style={{ "--reveal-index": 0 } as CSSProperties}
              >
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
