import Image from "next/image";
import {
  Button,
  LayoutGrid,
  LayoutGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

export type HeroSplitFixedImageVariant =
  | "text-3-image-4-right"
  | "text-4-image-3-right"
  | "image-3-left-text-4"
  | "image-4-left-text-3";

export type HeroSplitFixedImageRatio =
  | "3-2"
  | "2-3"
  | "4-3"
  | "3-4"
  | "5-4"
  | "4-5";

type HeroSplitFixedImageSectionV3Props = {
  body: string;
  cardBorder?: "on" | "off";
  /** Defaults to "none" - this section renders no card until fill is turned on. */
  cardFill?: "solid" | "none";
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  headingLevel?: 1 | 2;
  imageAlt: string;
  imageSrc: string;
  primaryAction: string;
  ratio?: HeroSplitFixedImageRatio;
  secondaryAction: string;
  secondaryActionHref?: string;
  stats: readonly string[];
  title: string;
  variant?: HeroSplitFixedImageVariant;
};

const colorRecipeClassName: Record<
  SectionColorRecipe,
  {
    action: string;
    body: string;
    eyebrow: string;
    ink: string;
    secondaryAction: string;
    section: string;
  }
> = {
  default: {
    action: "",
    body: "text-service-muted",
    eyebrow: "text-service-accent",
    ink: "text-service-ink",
    secondaryAction: "",
    section: "bg-bg-page",
  },
  muted: {
    action: "",
    body: "text-service-muted",
    eyebrow: "text-service-accent",
    ink: "text-service-ink",
    secondaryAction: "",
    section: "bg-service-surface",
  },
  dark: {
    action: "!border-white !bg-white !text-bg-dark hover:!bg-service-surface",
    body: "text-white/70",
    eyebrow: "text-white",
    ink: "text-white",
    // Ghost/outline treatment: the default secondary style is a light pill
    // (bg-bg-page), which would clash with a dark section - drop the fill
    // so it reads as a lighter-weight, secondary action against the dark bg.
    secondaryAction:
      "!border-white/40 !bg-transparent !text-white hover:!border-white hover:!bg-white/10 hover:!text-white",
    section: "bg-bg-dark",
  },
  accent: {
    // RequestServiceButton's/Button's own defaults are bg-service-accent and
    // bg-bg-page respectively - both get re-tinted to this recipe's own
    // accent background by the pagebuilder-section-frame wrapper, so without
    // this override both CTAs are invisible against the section.
    action: "!border-white !bg-white !text-bg-dark hover:!bg-white/85",
    body: "text-[var(--live-accent-muted-text)]",
    eyebrow: "text-[var(--live-accent-ink)]",
    ink: "text-[var(--live-accent-ink)]",
    secondaryAction:
      "!border-[color-mix(in_oklab,var(--live-accent-ink)_40%,transparent)] !bg-transparent !text-[var(--live-accent-ink)] hover:!border-[color:var(--live-accent-ink)] hover:!bg-white/10 hover:!text-[var(--live-accent-ink)]",
    section: "bg-service-accent",
  },
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
  HeroSplitFixedImageVariant,
  FixedImageVariantConfig
> = {
  "text-3-image-4-right": {
    textClassName:
      "col-span-6 col-start-1 max-lg:col-span-4 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
    imageClassName:
      "col-span-7 col-start-8 max-lg:col-span-5 max-lg:col-start-6 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
  },
  "text-4-image-3-right": {
    textClassName:
      "col-span-7 col-start-1 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
    imageClassName:
      "col-span-6 col-start-9 max-lg:col-span-4 max-lg:col-start-7 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
  },
  "image-3-left-text-4": {
    textClassName:
      "col-span-7 col-start-8 max-lg:col-span-5 max-lg:col-start-6 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
    imageClassName:
      "col-span-6 col-start-1 max-lg:col-span-4 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
  },
  "image-4-left-text-3": {
    textClassName:
      "col-span-6 col-start-9 max-lg:col-span-4 max-lg:col-start-7 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
    imageClassName:
      "col-span-7 col-start-1 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
  },
};

const ratioClassNames: Record<HeroSplitFixedImageRatio, string> = {
  "3-2": "aspect-[3/2]",
  "2-3": "aspect-[2/3]",
  "4-3": "aspect-[4/3]",
  "3-4": "aspect-[3/4]",
  "5-4": "aspect-[5/4]",
  "4-5": "aspect-[4/5]",
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FixedRatioImage({
  alt,
  ratio,
  src,
}: {
  alt: string;
  ratio: HeroSplitFixedImageRatio;
  src: string;
}) {
  return (
    <div className="grid w-full place-items-center">
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
          priority
          sizes="(max-width: 1024px) 100vw, 52vw"
          src={src}
        />
      </div>
    </div>
  );
}

export function HeroSplitFixedImageSectionV3({
  body,
  cardBorder = "on",
  cardFill = "none",
  colorRecipe = "default",
  eyebrow,
  headingLevel = 1,
  imageAlt,
  imageSrc,
  primaryAction,
  ratio = "3-2",
  secondaryAction,
  secondaryActionHref = "#services",
  stats,
  title,
  variant = "text-3-image-4-right",
}: HeroSplitFixedImageSectionV3Props) {
  const config =
    variantConfig[variant] ?? variantConfig["text-3-image-4-right"];
  const colors = colorRecipeClassName[colorRecipe];
  const HeadingTag = `h${headingLevel}` as const;
  // Padding and radius belong to the card, not the grid item - with no card
  // they would just inset the copy for no visible reason. Stretching the item
  // makes the card fill the row, which is as tall as the copy or the image -
  // whichever wins.
  const isFilled = cardFill === "solid";

  return (
    <section className={colors.section}>
      <LayoutGrid className="section-min-none items-center" columns={14}>
        <LayoutGridItem
          alignX="left"
          alignY={isFilled ? "stretch" : "middle"}
          className={cx(
            "row-start-1 max-md:row-auto",
            colors.ink,
            config.textClassName,
          )}
        >
          <div
            className={cx(
              "fluid-type-frame w-full",
              isFilled
                ? "radius-medium flex h-full flex-col justify-center bg-service-surface p-14 shadow-service max-md:p-10"
                : undefined,
              isFilled && cardBorder === "on"
                ? "border border-service-border"
                : undefined,
            )}
          >
            <p className={cx("type-label", colors.eyebrow)}>{eyebrow}</p>
            <HeadingTag
              className={cx(
                "type-display-lg mt-eyebrow-display",
                colors.ink,
              )}
            >
              {title}
            </HeadingTag>
            <p className={cx("type-text-xl wrap-pretty mt-display-body", colors.body)}>
              {body}
            </p>
            <div className="mt-body-actions-md flex flex-wrap inline-gap-med">
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
            <ul className="mt-body-actions-lg grid grid-cols-3 card-grid-gap-med max-md:mt-body-actions-md max-md:grid-cols-1">
              {stats.map((stat) => (
                <li
                  className={cx(
                    "type-text-sm border-l border-service-border pl-4 font-semibold max-md:border-l-0 max-md:border-t max-md:pl-0 max-md:pt-3",
                    colors.ink,
                  )}
                  key={stat}
                >
                  {stat}
                </li>
              ))}
            </ul>
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignX="center"
          alignY="middle"
          className={cx(
            "row-start-1 max-md:row-auto",
            config.imageClassName,
          )}
        >
          <FixedRatioImage alt={imageAlt} ratio={ratio} src={imageSrc} />
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
