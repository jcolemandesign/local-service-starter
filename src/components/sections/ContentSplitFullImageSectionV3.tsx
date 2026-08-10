import type { CSSProperties } from "react";
import Image from "next/image";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import type { SectionColorRecipe } from "@/content/section-color-recipes";
import type { FullImageSplitVariant } from "@/content/section-style-options";

/**
 * The narrative twin of `HeroSplitFullHeightSectionV3`: same full-bleed cropped
 * image against a copy column, sized for the flow of a page rather than the top
 * of one.
 *
 * It is a separate section rather than a prop on the hero because the two
 * differ in the things a section is defined by. The hero asks copy for one
 * punchy line and two mandatory CTAs; this asks for paragraphs with the CTAs
 * optional, because most uses of this layout mid-page are pure explanation.
 * The hero opens with an h1 and stands a full viewport tall; this opens with an
 * h2 and takes its height from its content. Folding those into one component
 * would mean a hero carrying a mode it must never use, and - because the copy
 * contract keys off the component name - a mid-page section being handed the
 * hero brief.
 *
 * Relationship to `ContentSplitFixedImageSectionV3`: identical copy shape and
 * arrangement vocabulary, different image treatment. That one frames the image
 * at a chosen aspect ratio inside the grid; this one crops it and runs it off
 * the viewport edge.
 */

export type ContentSplitFullImageVariant = FullImageSplitVariant;

export type ContentSplitFullImageHeadingSizeStep = -1 | 0 | 1;

type ContentSplitFullImageSectionV3Props = {
  bullets?: readonly string[];
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  headingLevel?: 2 | 3;
  headingSizeStep?: ContentSplitFullImageHeadingSizeStep;
  imageAlt: string;
  imageSrc: string;
  paragraphs: readonly string[];
  primaryAction?: string;
  secondaryAction?: string;
  secondaryActionHref?: string;
  stats?: readonly string[];
  title: string;
  variant?: ContentSplitFullImageVariant;
};

type FullImageVariantConfig = {
  fadeClassName?: string;
  fadeGradientClassName?: string;
  imageBleedClassName: string;
  imageClassName: string;
  textClassName: string;
};

// Fourteen columns with one empty column between the slots, matching the split
// families: 6 | gutter | 7. The image bleeds past the grid frame on whichever
// side it sits, so its panel also picks the direction of that bleed.
const bleedRight = "left-auto right-[calc(var(--site-grid-inset-inline)*-1)]";
const bleedLeft = "left-[calc(var(--site-grid-inset-inline)*-1)] right-auto";

const stackedColumns =
  "max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2";

const variantConfig: Record<
  ContentSplitFullImageVariant,
  FullImageVariantConfig
> = {
  "text-3-image-4-right": {
    textClassName: `col-span-6 col-start-1 max-lg:col-span-4 max-lg:col-start-1 ${stackedColumns}`,
    imageClassName: `col-span-7 col-start-8 max-lg:col-span-5 max-lg:col-start-6 ${stackedColumns}`,
    imageBleedClassName: bleedRight,
  },
  "text-4-image-3-right": {
    textClassName: `col-span-7 col-start-1 max-lg:col-span-5 max-lg:col-start-1 ${stackedColumns}`,
    imageClassName: `col-span-6 col-start-9 max-lg:col-span-4 max-lg:col-start-7 ${stackedColumns}`,
    imageBleedClassName: bleedRight,
  },
  "image-3-left-text-4": {
    textClassName: `col-span-7 col-start-8 max-lg:col-span-5 max-lg:col-start-6 ${stackedColumns}`,
    imageClassName: `col-span-6 col-start-1 max-lg:col-span-4 max-lg:col-start-1 ${stackedColumns}`,
    imageBleedClassName: bleedLeft,
  },
  "image-4-left-text-3": {
    textClassName: `col-span-6 col-start-9 max-lg:col-span-4 max-lg:col-start-7 ${stackedColumns}`,
    imageClassName: `col-span-7 col-start-1 max-lg:col-span-5 max-lg:col-start-1 ${stackedColumns}`,
    imageBleedClassName: bleedLeft,
  },
  "text-7-image-9-overlap-right": {
    textClassName: `relative z-10 col-span-9 col-start-1 max-lg:col-span-6 max-lg:col-start-1 ${stackedColumns}`,
    imageClassName: `z-0 col-span-9 col-start-6 max-lg:col-span-6 max-lg:col-start-5 ${stackedColumns}`,
    imageBleedClassName: bleedRight,
    fadeClassName: "col-span-4 col-start-6 max-lg:col-span-2 max-lg:col-start-5",
    fadeGradientClassName: "full-image-split-fade-right",
  },
  "image-9-overlap-left-text-7": {
    textClassName: `relative z-10 col-span-9 col-start-6 max-lg:col-span-6 max-lg:col-start-5 ${stackedColumns}`,
    imageClassName: `z-0 col-span-9 col-start-1 max-lg:col-span-6 max-lg:col-start-1 ${stackedColumns}`,
    imageBleedClassName: bleedLeft,
    fadeClassName: "col-span-4 col-start-6 max-lg:col-span-2 max-lg:col-start-5",
    fadeGradientClassName: "full-image-split-fade-left",
  },
};

// Ordered small -> large. The default is picked from how wide the text column
// is for the active variant, then nudged by headingSizeStep. Tops out below the
// hero's display scale on purpose - this is a section inside a page, not the
// opening statement of one.
const headingSizeScale = [
  "type-heading-sm",
  "type-heading-md",
  "type-heading-lg",
  "type-heading-xl",
  "type-display-lg",
] as const;

function getDefaultHeadingSizeIndex(variant: ContentSplitFullImageVariant) {
  const hasWideTextColumn =
    variant === "text-4-image-3-right" ||
    variant === "image-4-left-text-3" ||
    variant === "text-7-image-9-overlap-right" ||
    variant === "image-9-overlap-left-text-7";

  return hasWideTextColumn ? 3 : 2;
}

const colorRecipeClassName = {
  action: "",
  body: "text-service-muted",
  eyebrow: "text-service-accent",
  ink: "text-service-ink",
  secondaryAction: "",
  section: "bg-bg-page",
  stat: "border-service-border",
};

// Reaches past the grid frame's inline inset so the crop runs to the page edge.
const bleedPanelStyle: CSSProperties = {
  width: "calc(100% + var(--site-grid-inset-inline))",
};

/**
 * The grid carries no vertical padding; the copy column carries it instead.
 *
 * That is what lets the crop run the full height of the section. Pulling the
 * image back out through the grid's padding with a negative margin does not
 * work: the margin also shrinks what the item contributes to row sizing, so the
 * row and the section disagree about how tall they are and the spacing doubles
 * up at the bottom. With no padding on the grid there is nothing to escape -
 * the image simply stretches to the row, and the row is the section.
 *
 * `section-space-med` rather than a `py-` utility so pagebuilder's reduced
 * padding still reaches it: those overrides match `.section-space-med` by
 * class name.
 */
const gridBlockPaddingReset = "!py-0";
const copyBlockPadding = "section-space-med";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function CroppedImagePanel({
  bleedClassName,
  imageAlt,
  imageSrc,
}: {
  bleedClassName: string;
  imageAlt: string;
  imageSrc: string;
}) {
  return (
    <div className="relative h-full min-h-[var(--media-min-medium)] w-full">
      <div
        className={cx(
          "absolute inset-y-0 overflow-hidden bg-service-surface max-md:relative max-md:inset-auto max-md:h-full max-md:min-h-[var(--media-min-medium)] max-md:!w-full",
          bleedClassName,
        )}
        style={bleedPanelStyle}
      >
        <Image
          alt={imageAlt}
          className="object-cover"
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 60vw, 52vw"
          src={imageSrc}
        />
      </div>
    </div>
  );
}

export function ContentSplitFullImageSectionV3({
  bullets,
  eyebrow,
  headingLevel = 2,
  headingSizeStep = 0,
  imageAlt,
  imageSrc,
  paragraphs,
  primaryAction,
  secondaryAction,
  secondaryActionHref = "#services",
  stats = [],
  title,
  variant = "text-3-image-4-right",
}: ContentSplitFullImageSectionV3Props) {
  const config =
    variantConfig[variant] ?? variantConfig["text-3-image-4-right"];
  const HeadingTag = `h${headingLevel}` as const;
  const colors = colorRecipeClassName;
  const headingSizeIndex = Math.min(
    headingSizeScale.length - 1,
    Math.max(0, getDefaultHeadingSizeIndex(variant) + headingSizeStep),
  );
  const headingSizeClassName = headingSizeScale[headingSizeIndex];
  const hasBullets = Boolean(bullets && bullets.length > 0);
  const hasCta = Boolean(primaryAction || secondaryAction);

  return (
    <section className={cx("relative", colors.section)}>
      {/* No section floor, matching ContentSplitFixedImageSectionV3. The height
          comes from the copy or the image panel's own --media-min-medium floor,
          whichever is taller - which is what keeps this reading as a beat in
          the page rather than a hero. */}
      <LayoutGrid
        className={cx("section-min-none items-stretch", gridBlockPaddingReset)}
        columns={14}
        padding="none"
      >
        <LayoutGridItem
          alignX="left"
          alignY="middle"
          className={cx("row-start-1", colors.ink, config.textClassName)}
        >
          <div className={cx("fluid-type-frame w-full", copyBlockPadding)}>
            <p className={cx("type-label", colors.eyebrow)}>{eyebrow}</p>
            <HeadingTag
              className={cx(
                headingSizeClassName,
                "wrap-pretty mt-eyebrow-display",
                colors.ink,
              )}
            >
              {title}
            </HeadingTag>

            <div className="mt-display-body grid gap-4">
              {paragraphs.map((paragraph, index) => (
                <p
                  className={cx(
                    index === 0 ? "type-text-lg" : "type-text-md",
                    "wrap-pretty",
                    colors.body,
                  )}
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {hasBullets ? (
              <ul className="mt-heading-body-md grid gap-3">
                {bullets?.map((bullet) => (
                  <li
                    className={cx(
                      "type-text-sm flex items-start gap-3",
                      colors.ink,
                    )}
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
            ) : null}

            {stats.length > 0 ? (
              <ul className="mt-body-actions-md grid inline-gap-sml">
                {stats.map((item) => (
                  <li
                    className={cx(
                      "type-text-sm wrap-pretty border-l pl-4",
                      colors.ink,
                      colors.stat,
                    )}
                    key={item}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {hasCta ? (
              <div className="mt-body-actions-md flex flex-wrap inline-gap-med">
                {primaryAction ? (
                  <RequestServiceButton className={colors.action}>
                    {primaryAction}
                  </RequestServiceButton>
                ) : null}
                {secondaryAction ? (
                  <Button
                    className={colors.secondaryAction}
                    href={secondaryActionHref}
                    variant="secondary"
                  >
                    {secondaryAction}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignX="stretch"
          alignY="stretch"
          className={cx(
            "relative row-start-1 h-full min-h-0 overflow-visible max-md:h-auto",
            config.imageClassName,
          )}
        >
          <CroppedImagePanel
            bleedClassName={config.imageBleedClassName}
            imageAlt={imageAlt}
            imageSrc={imageSrc}
          />
        </LayoutGridItem>

        {config.fadeClassName ? (
          <LayoutGridItem
            alignY="stretch"
            className={cx(
              "pointer-events-none relative z-[1] row-start-1 max-md:hidden",
              config.fadeClassName,
            )}
          >
            <span
              aria-hidden="true"
              className={cx("absolute inset-0", config.fadeGradientClassName)}
            />
          </LayoutGridItem>
        ) : null}
      </LayoutGrid>
    </section>
  );
}
