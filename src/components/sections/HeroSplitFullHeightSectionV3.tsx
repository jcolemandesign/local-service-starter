import type { CSSProperties } from "react";
import Image from "next/image";
import {
  Button,
  LayoutGrid,
  LayoutGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import type { SectionColorRecipe } from "@/content/section-color-recipes";
import type { FullImageSplitVariant } from "@/content/section-style-options";

export type HeroSplitFullHeightVariant = FullImageSplitVariant;

type HeroSplitFullHeightSectionV3Props = {
  body: string;
  eyebrow: string;
  headingLevel?: 1 | 2;
  imageAlt: string;
  imageSrc: string;
  primaryAction: string;
  secondaryAction: string;
  secondaryActionHref?: string;
  stats?: readonly string[];
  title: string;
  variant?: HeroSplitFullHeightVariant;
  colorRecipe?: SectionColorRecipe;
};

type HeroVariantConfig = {
  /**
   * Ramp that dissolves the photo into the section behind it, on the overlap
   * variants where the copy sits over the image.
   *
   * Carried by the image rather than by a ground-coloured panel laid on top of
   * it. A panel has to match the section's ground exactly, which it can only do
   * while that ground is one flat colour - a background texture puts a seam
   * back down the photo. See the mask classes in `globals.css`.
   */
  imageMaskClassName?: string;
  imageClassName: string;
  imagePanelClassName: string;
  imageSlotLabel: string;
  textClassName: string;
};

// Fourteen columns with one empty column between the two slots, so the split is
// 6 | gutter | 7 rather than two panels sharing only the grid gap. The variant
// keys still read 3/4 because they are persisted in project page data - they
// are opaque ids for "narrow text right image" etc., not column counts.
const variantConfig: Record<HeroSplitFullHeightVariant, HeroVariantConfig> = {
  "text-3-image-4-right": {
    textClassName: "col-span-6 col-start-1",
    imageClassName: "col-span-7 col-start-8",
    imagePanelClassName:
      "left-auto right-[calc(var(--site-grid-inset-inline)*-1)]",
    imageSlotLabel: "Image area: columns 8-14",
  },
  "text-4-image-3-right": {
    textClassName: "col-span-7 col-start-1",
    imageClassName: "col-span-6 col-start-9",
    imagePanelClassName:
      "left-auto right-[calc(var(--site-grid-inset-inline)*-1)]",
    imageSlotLabel: "Image area: columns 9-14",
  },
  "image-3-left-text-4": {
    textClassName: "col-span-7 col-start-8",
    imageClassName: "col-span-6 col-start-1",
    imagePanelClassName:
      "left-[calc(var(--site-grid-inset-inline)*-1)] right-auto",
    imageSlotLabel: "Image area: columns 1-6",
  },
  "image-4-left-text-3": {
    textClassName: "col-span-6 col-start-9",
    imageClassName: "col-span-7 col-start-1",
    imagePanelClassName:
      "left-[calc(var(--site-grid-inset-inline)*-1)] right-auto",
    imageSlotLabel: "Image area: columns 1-7",
  },
  "text-7-image-9-overlap-right": {
    textClassName: "relative z-10 col-span-8 col-start-1",
    imageClassName: "z-0 col-span-9 col-start-6",
    imagePanelClassName:
      "left-auto right-[calc(var(--site-grid-inset-inline)*-1)]",
    imageSlotLabel: "Image area: columns 6-14; overlaps columns 6-8",
    imageMaskClassName: "full-image-split-image-mask-right",
  },
  "image-9-overlap-left-text-7": {
    textClassName: "relative z-10 col-span-8 col-start-7",
    imageClassName: "z-0 col-span-9 col-start-1",
    imagePanelClassName:
      "left-[calc(var(--site-grid-inset-inline)*-1)] right-auto",
    imageSlotLabel: "Image area: columns 1-9; overlaps columns 7-9",
    imageMaskClassName: "full-image-split-image-mask-left",
  },
};

const fullBleedImagePanelStyle: CSSProperties = {
  width: "calc(100% + var(--site-grid-inset-inline))",
};

function SampleImagePanel({
  className,
  imageAlt,
  imageSrc,
  slotLabel,
}: {
  className?: string;
  imageAlt: string;
  imageSrc: string;
  slotLabel: string;
}) {
  return (
    <div
      className={cx(
        "absolute bottom-[calc(0px_-_var(--site-grid-inset-block))] top-[calc(0px_-_var(--site-grid-inset-block))] overflow-hidden bg-service-surface max-md:relative max-md:inset-auto max-md:h-full max-md:min-h-[var(--media-min-medium)] max-md:!w-full",
        className,
      )}
      style={fullBleedImagePanelStyle}
    >
      <Image
        alt={imageAlt}
        className="object-cover"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 58vw"
        src={imageSrc}
      />
      <div className="absolute inset-x-0 bottom-0 px-4 py-2">
        <p className="truncate text-xs font-semibold uppercase text-white drop-shadow">
          {slotLabel}
        </p>
      </div>
    </div>
  );
}

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function HeroSplitFullHeightSectionV3({
  body,
  eyebrow,
  headingLevel = 1,
  imageAlt,
  imageSrc,
  primaryAction,
  secondaryAction,
  secondaryActionHref = "#services",
  stats = [],
  title,
  variant = "text-3-image-4-right",
}: HeroSplitFullHeightSectionV3Props) {
  const config = variantConfig[variant] ?? variantConfig["text-3-image-4-right"];
  const HeadingTag = `h${headingLevel}` as const;
  const isTextFourImageThree =
    variant === "text-4-image-3-right" ||
    variant === "text-7-image-9-overlap-right" ||
    variant === "image-9-overlap-left-text-7";
  const colors = {
    action: "",
    body: "text-service-muted",
    eyebrow: "text-service-accent",
    ink: "text-service-ink",
    secondaryAction: "",
    section: "bg-bg-page",
    stat: "border-service-border",
  };

  return (
    <section className={colors.section}>
      <LayoutGrid
        className="section-min-sliver h-[calc(var(--section-min-screen)-var(--section-sliver-gap))] grid-rows-[minmax(0,1fr)] max-lg:grid-rows-none max-md:h-auto"
        columns={14}
      >
        <LayoutGridItem
          alignX="left"
          alignY="middle"
          className={cx(
            "content-padding-y radius-medium row-start-1 h-full min-h-0 max-lg:col-span-10 max-lg:col-start-1 max-lg:row-auto max-md:col-span-6 max-sm:col-span-2",
            colors.ink,
            config.textClassName,
          )}
        >
          <div className="fluid-type-frame w-full">
            <p className={cx("type-label", colors.eyebrow)}>{eyebrow}</p>
            <HeadingTag
              className={cx(
                "mt-eyebrow-display",
                colors.ink,
                // One step down the scale from display-xl/display-lg. The wider
                // text column still takes the larger of the two, so the
                // relationship between the variants is unchanged.
                isTextFourImageThree ? "type-display-lg" : "type-heading-xl",
              )}
            >
              {title}
            </HeadingTag>
            <p
              className={cx(
                "type-text-lg measure-lead wrap-pretty mt-body-actions-md",
                colors.body,
              )}
            >
              {body}
            </p>
            <div
              className="mt-body-actions-md flex flex-wrap inline-gap-med"
            >
              <RequestServiceButton className={colors.action}>
                {primaryAction}
              </RequestServiceButton>
              <Button
                className={colors.secondaryAction}
                href={secondaryActionHref}
                variant="secondary"
              >
                {secondaryAction}
              </Button>
            </div>
            {stats.length > 0 ? (
              <ul
                className={cx(
                  "mt-body-actions-lg flex flex-wrap items-start justify-start inline-gap-lrg max-md:mt-body-actions-md",
                )}
              >
                {stats.map((stat) => (
                  <li
                    className={cx(
                      "type-text-sm font-semibold",
                      colors.ink,
                      isTextFourImageThree
                        ? "border-l-2 border-service-accent/40 py-2 pl-5 max-md:border-l-0 max-md:border-t max-md:pt-3 max-md:pl-0"
                        : cx("border-l pl-4 max-md:border-l-0 max-md:border-t max-md:pl-0 max-md:pt-3", colors.stat),
                    )}
                    key={stat}
                  >
                    <span className="relative">{stat}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignX="stretch"
          alignY="stretch"
          className={cx(
            "relative row-start-1 h-full min-h-0 overflow-visible max-lg:media-min-medium max-lg:col-span-10 max-lg:col-start-1 max-lg:row-auto max-md:col-span-6 max-md:h-auto max-sm:col-span-2",
            config.imageClassName,
          )}
        >
          <SampleImagePanel
            className={cx(config.imagePanelClassName, config.imageMaskClassName)}
            imageAlt={imageAlt}
            imageSrc={imageSrc}
            slotLabel={config.imageSlotLabel}
          />
        </LayoutGridItem>

        {/* No fade panel. The ramp rides the image itself now - see
            `imageMaskClassName` - so the section's own ground shows through
            underneath, texture and all, instead of being impersonated by a
            slab of flat colour that only matched while the ground was plain. */}
      </LayoutGrid>
    </section>
  );
}
