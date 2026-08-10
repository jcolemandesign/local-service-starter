import Image from "next/image";

import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type {
  SectionCardBorder,
  SectionCardFill,
  SectionColorRecipe,
} from "@/content/section-color-recipes";

type ServiceBentoItem = {
  title: string;
  body: string;
  cardSize?: string;
  imageLabel: string;
  imageSrc?: string;
};

export type ServicesBentoCardsVariant =
  | "default"
  | "split-header";

type ServicesBentoCardsSectionV2Props = {
  /**
   * Header copy, read by the split-header variant alone. Optional because the
   * default variant is cards only - its copy spec asks for none of these, so
   * the render path passes none, and a required prop would only be satisfied
   * with demo content nothing requested and nothing draws.
   */
  eyebrow?: string;
  title?: string;
  body?: string;
  items: ServiceBentoItem[];
  variant?: ServicesBentoCardsVariant;
  colorRecipe?: SectionColorRecipe;
  cardBorder?: SectionCardBorder;
  cardFill?: SectionCardFill;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getShortTitle(title: string, maxWords = 5) {
  const sanitizedTitle = title.trim().replace(/\.$/, "");
  const words = sanitizedTitle.split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return sanitizedTitle;
  }

  return words.slice(0, maxWords).join(" ");
}

const colorRecipeClasses = {
  body: "text-service-muted",
  card: "bg-service-surface",
  cardText: "text-service-ink",
  cardMuted: "text-service-muted",
  eyebrow: "text-service-accent",
  heading: "text-service-ink",
  section: "bg-bg-page",
} as const;

function ServiceImage({
  isRounded = false,
  isWide = false,
  label,
  src,
}: {
  /** Rounds all four corners rather than the two the card's overflow clips.
   *  With no card surface the image is a standalone element, so square bottom
   *  corners read as a card that failed to render rather than as a choice. */
  isRounded?: boolean;
  isWide?: boolean;
  label: string;
  src?: string;
}) {
  const frameClassName = cx(
    "relative overflow-hidden bg-service-border",
    isWide ? "aspect-[3/2] max-lg:aspect-[5/4]" : "aspect-[5/4]",
    isRounded ? "radius-medium" : undefined,
  );

  if (src) {
    return (
      <div className={frameClassName}>
        <Image
          alt={label}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 34vw"
          src={src}
        />
      </div>
    );
  }

  return (
    <div className={frameClassName} aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.26),rgb(23_33_29_/_0.05)),linear-gradient(45deg,rgb(255_255_255_/_0.22)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

const bentoCardSpanPattern = [
  "col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
];

const splitHeaderCardSpanPattern = [
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
  "col-span-2 max-md:col-span-3 max-sm:col-span-1",
];

export function ServicesBentoCardsSectionV2({
  eyebrow = "",
  title = "",
  body = "",
  items,
  variant = "default",
  cardBorder = "on",
  cardFill = "solid",
}: ServicesBentoCardsSectionV2Props) {
  const isSplitHeader = variant === "split-header";
  const cardSpanPattern = isSplitHeader
    ? splitHeaderCardSpanPattern
    : bentoCardSpanPattern;
  const displayItems = isSplitHeader ? items : items.slice(0, 9);
  const splitHeaderSupportItems = displayItems.slice(0, 4).map((item) => item.title);
  const splitHeaderBody = [
    body,
    displayItems
      .slice(0, 2)
      .map((item) => item.body)
      .join(" "),
  ]
    .filter(Boolean)
    .join(" ");
  const colors = colorRecipeClasses;
  const transparentCards = cardFill === "none";
  /**
   * Whether the card is drawing anything the text has to sit inside.
   *
   * Fill or border - either one makes the card a container, and the text needs
   * room off its edge. With neither, there is no edge to inset from: the copy
   * is sitting directly on the section ground beside a full-bleed image, so
   * horizontal padding only pushes it out of alignment with that image.
   */
  const hasCardSurface = cardFill === "solid" || cardBorder === "on";
  const cardTextPadding = hasCardSurface
    ? "px-9 pb-9 pt-9 max-lg:px-7 max-lg:pb-7 max-lg:pt-7"
    : "px-0 pb-7 pt-7 max-lg:pb-5 max-lg:pt-5";
  // A transparent card puts its text straight onto the section ground, so it
  // takes the section's text tokens rather than the card's.
  const transparentCardText = "text-service-ink";
  const transparentCardMuted = "text-service-muted";

  return (
    <section id="services-bento" className={colors.section}>
      <SevenColumnGrid className="items-start" minHeight="none" padding="med">
        {isSplitHeader ? (
          /* `stretch` is what makes the sticky header below actually stick.
             The grid's `items-start` leaves every item at content height, and a
             sticky element inside a box its own height has nothing to travel
             through - it renders as sticky and never moves. Stretching this one
             column to the cards' row height gives it the distance; `h-fit` on
             the child stops it stretching along with the column and losing the
             travel again. Same pairing as the sticky media in
             `ProcessImageChecklistSectionV3`. */
          <SevenColumnGridItem
            alignX="left"
            alignY="stretch"
            className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
            measure="copyWide"
          >
            <div className="fluid-type-frame sticky top-[var(--site-grid-inset-block)] h-fit text-left max-lg:static">
              <p className={cx("type-label", colors.eyebrow)}>
                {eyebrow}
              </p>
              <h2
                className={cx(
                  "type-display-lg",
                  "mt-eyebrow-heading-lg",
                  colors.heading,
                )}
              >
                {getShortTitle(title)}
              </h2>
              <p
                className={cx(
                  "type-text-lg",
                  "measure-copy",
                  "wrap-pretty",
                  "mt-heading-body-md",
                  colors.body,
                )}
              >
                {splitHeaderBody}
              </p>
              <ul className="mt-body-actions-lg grid gap-2">
                {splitHeaderSupportItems.map((item) => (
                  <li
                    className={cx("type-text-sm flex items-center gap-2 font-semibold", colors.heading)}
                    key={item}
                  >
                    <span
                      aria-hidden="true"
                      className="size-2 shrink-0 rounded-full bg-service-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </SevenColumnGridItem>
        ) : null}

        <SevenColumnGridItem
          className={cx(
            isSplitHeader
              ? "col-span-4 col-start-4 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1"
              : "col-span-7 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
          )}
        >
          <div
            className={cx(
              "grid card-grid-gap-med max-md:grid-cols-3 max-sm:grid-cols-1",
              isSplitHeader
                ? "grid-cols-4 items-stretch"
                : "grid-cols-7 items-center max-lg:grid-cols-5",
            )}
          >
            {displayItems.map((item, index) => (
              <article
                className={cx(
                  "fluid-type-frame",
                  "radius-medium",
                  "group/service-card relative flex cursor-pointer flex-col overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.015]",
                  transparentCards ? "bg-transparent shadow-none" : `${colors.card} shadow-service`,
                  // The media is flush to the card edge and `overflow-hidden`
                  // clips to the padding box, so a transparent border would
                  // still hold it inside a ring of card fill. Drop the border
                  // box entirely instead. `border-0` alone cannot do this --
                  // the global `.border` width rule is `!important`.
                  cardBorder === "off" ? "!border-0" : "border border-service-border",
                  isSplitHeader ? "h-full" : undefined,
                  cardSpanPattern[index % cardSpanPattern.length],
                )}
                key={item.title}
              >
                <ServiceImage
                  isRounded={!hasCardSurface}
                  isWide={
                    !isSplitHeader &&
                    cardSpanPattern[index % cardSpanPattern.length].startsWith(
                      "col-span-3",
                    )
                  }
                  label={item.imageLabel}
                  src={item.imageSrc}
                />
                <div
                  className={cx(
                    "radius-medium",
                    "absolute right-3 top-3 flex size-12 items-center justify-center border border-service-border bg-surface-raised text-xl font-semibold leading-none text-service-ink shadow-service transition-colors group-hover/service-card:bg-service-accent group-hover/service-card:text-white",
                  )}
                >
                  <span aria-hidden="true">-&gt;</span>
                </div>
                <div
                  className={cx(
                    "flex flex-1 flex-col justify-between",
                    cardTextPadding,
                  )}
                >
                  <div>
                    <h3
                      className={cx(
                        "type-heading-sm",
                        transparentCards ? transparentCardText : colors.cardText,
                      )}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={cx(
                        "type-text-sm",
                        "measure-copy",
                        "wrap-pretty",
                        "mt-4",
                        transparentCards ? transparentCardMuted : colors.cardMuted,
                      )}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
