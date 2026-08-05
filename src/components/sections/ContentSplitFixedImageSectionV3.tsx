import Image from "next/image";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

export type ContentSplitFixedImageVariant =
  | "text-3-image-4-right"
  | "text-4-image-3-right"
  | "image-3-left-text-4"
  | "image-4-left-text-3";

export type ContentSplitFixedImageRatio =
  | "3-2"
  | "2-3"
  | "4-3"
  | "3-4"
  | "5-4"
  | "4-5";

export type ContentSplitFixedImageHeadingSizeStep = -1 | 0 | 1;

type ContentSplitFixedImageSectionV3Props = {
  bullets?: readonly string[];
  cardBorder?: "on" | "off";
  /** Defaults to "none" - this section renders no card until fill is turned on. */
  cardFill?: "solid" | "none";
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  headingLevel?: 1 | 2;
  headingSizeStep?: ContentSplitFixedImageHeadingSizeStep;
  imageAlt: string;
  imageSrc: string;
  paragraphs: readonly string[];
  primaryAction?: string;
  ratio?: ContentSplitFixedImageRatio;
  secondaryAction?: string;
  secondaryActionHref?: string;
  stats?: readonly string[];
  title: string;
  variant?: ContentSplitFixedImageVariant;
};

type FixedImageVariantConfig = {
  imageClassName: string;
  textClassName: string;
};

// Fourteen columns with one empty column between the two slots, so the split is
// 6 | gutter | 7 rather than two panels sharing only the grid gap. The variant
// keys still read 3/4 because they are persisted in project page data - they
// are opaque ids for "narrow text right image" etc., not column counts.
const variantConfig: Record<
  ContentSplitFixedImageVariant,
  FixedImageVariantConfig
> = {
  "text-3-image-4-right": {
    textClassName:
      "col-span-6 col-start-1 row-start-1 max-lg:col-span-4 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
    imageClassName:
      "col-span-7 col-start-8 row-start-1 max-lg:col-span-5 max-lg:col-start-6 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
  },
  "text-4-image-3-right": {
    textClassName:
      "col-span-7 col-start-1 row-start-1 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
    imageClassName:
      "col-span-6 col-start-9 row-start-1 max-lg:col-span-4 max-lg:col-start-7 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
  },
  "image-3-left-text-4": {
    textClassName:
      "col-span-7 col-start-8 row-start-1 max-lg:col-span-5 max-lg:col-start-6 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
    imageClassName:
      "col-span-6 col-start-1 row-start-1 max-lg:col-span-4 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
  },
  "image-4-left-text-3": {
    textClassName:
      "col-span-6 col-start-9 row-start-1 max-lg:col-span-4 max-lg:col-start-7 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
    imageClassName:
      "col-span-7 col-start-1 row-start-1 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
  },
};

const ratioClassNames: Record<ContentSplitFixedImageRatio, string> = {
  "3-2": "aspect-[3/2]",
  "2-3": "aspect-[2/3]",
  "4-3": "aspect-[4/3]",
  "3-4": "aspect-[3/4]",
  "5-4": "aspect-[5/4]",
  "4-5": "aspect-[4/5]",
};

// Ordered small -> large. The default heading size is picked from this scale
// based on how wide the text column is for the active variant; the
// headingSizeStep prop then nudges that default up or down by one step.
const headingSizeScale = [
  "type-heading-sm",
  "type-heading-md",
  "type-heading-lg",
  "type-heading-xl",
  "type-display-lg",
  "type-display-xl",
] as const;

function getDefaultHeadingSizeIndex(variant: ContentSplitFixedImageVariant) {
  const hasWideTextColumn =
    variant === "text-4-image-3-right" || variant === "image-4-left-text-3";

  return hasWideTextColumn ? 3 : 2;
}

const colorRecipeClassName = { action: "", eyebrow: "text-service-accent", secondaryAction: "" };

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FixedRatioImage({
  alt,
  ratio,
  src,
}: {
  alt: string;
  ratio: ContentSplitFixedImageRatio;
  src: string;
}) {
  return (
    <div
      className={cx(
        "radius-medium relative w-full overflow-hidden bg-service-surface shadow-service",
        ratioClassNames[ratio],
      )}
    >
      <Image
        alt={alt}
        className="object-cover"
        fill
        sizes="(max-width: 1024px) 100vw, 52vw"
        src={src}
      />
    </div>
  );
}

export function ContentSplitFixedImageSectionV3({
  bullets,
  cardBorder = "on",
  cardFill = "none",
  eyebrow,
  headingLevel = 2,
  headingSizeStep = 0,
  imageAlt,
  imageSrc,
  paragraphs,
  primaryAction,
  ratio = "3-2",
  secondaryAction,
  secondaryActionHref = "#services",
  stats = [],
  title,
  variant = "text-3-image-4-right",
}: ContentSplitFixedImageSectionV3Props) {
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
  // Stretching the item makes the filled card fill the row, which is as tall
  // as the copy or the image - whichever wins.
  const isFilled = cardFill === "solid";

  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="section-min-none items-center"
        columns={14}
        padding="med"
      >
        <LayoutGridItem
          alignX="left"
          alignY={isFilled ? "stretch" : "middle"}
          className={cx("text-service-ink", config.textClassName)}
        >
          <div
            className={cx(
              "fluid-type-frame w-full",
              isFilled &&
                "radius-medium flex h-full flex-col justify-center bg-service-surface p-14 shadow-service max-md:p-10",
              isFilled && cardBorder === "on" && "border border-service-border",
            )}
          >
            <p className={cx("type-label", colors.eyebrow)}>{eyebrow}</p>
            <HeadingTag
              className={cx(
                headingSizeClassName,
                "wrap-pretty mt-eyebrow-display text-service-ink",
              )}
            >
              {title}
            </HeadingTag>

            <div className="mt-display-body grid gap-4">
              {paragraphs.map((paragraph, index) => (
                <p
                  className={cx(
                    index === 0 ? "type-text-lg" : "type-text-md",
                    "wrap-pretty text-service-muted",
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
            ) : null}

            {stats.length > 0 ? (
              <ul className="mt-body-actions-md grid inline-gap-sml">
                {stats.map((item) => (
                  <li
                    className="type-text-sm wrap-pretty border-l border-service-border pl-4 text-service-ink"
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
          alignX="center"
          alignY="middle"
          className={config.imageClassName}
        >
          <FixedRatioImage alt={imageAlt} ratio={ratio} src={imageSrc} />
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
