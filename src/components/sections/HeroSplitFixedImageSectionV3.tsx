import Image from "next/image";
import type { CSSProperties } from "react";
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
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  headingLevel?: 1 | 2;
  imageAlt: string;
  imageSrc: string;
  primaryAction: string;
  ratio?: HeroSplitFixedImageRatio;
  secondaryAction: string;
  secondaryActionHref?: string;
  stats?: readonly string[];
  title: string;
  variant?: HeroSplitFixedImageVariant;
};

const colorRecipeClassName = {
  action: "",
  body: "text-service-muted",
  eyebrow: "text-service-accent",
  ink: "text-service-ink",
  secondaryAction: "",
  section: "bg-bg-page",
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

// Each ratio twice: once as the aspect class the frame renders with, once as a
// plain number for `.hero-media-cap`, which needs to multiply by it to turn a
// height budget into the width bound that produces it.
const ratioConfig: Record<
  HeroSplitFixedImageRatio,
  { aspectClassName: string; value: number }
> = {
  "3-2": { aspectClassName: "aspect-[3/2]", value: 3 / 2 },
  "2-3": { aspectClassName: "aspect-[2/3]", value: 2 / 3 },
  "4-3": { aspectClassName: "aspect-[4/3]", value: 4 / 3 },
  "3-4": { aspectClassName: "aspect-[3/4]", value: 3 / 4 },
  "5-4": { aspectClassName: "aspect-[5/4]", value: 5 / 4 },
  "4-5": { aspectClassName: "aspect-[4/5]", value: 4 / 5 },
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
  const config = ratioConfig[ratio] ?? ratioConfig["3-2"];

  return (
    <div className="grid w-full place-items-center">
      <div
        className={cx(
          "hero-media-cap radius-medium relative w-full overflow-hidden bg-service-surface shadow-service",
          config.aspectClassName,
        )}
        style={{ "--hero-media-ratio": config.value } as CSSProperties}
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
  eyebrow,
  headingLevel = 1,
  imageAlt,
  imageSrc,
  primaryAction,
  ratio = "3-2",
  secondaryAction,
  secondaryActionHref = "#services",
  stats = [],
  title,
  variant = "text-3-image-4-right",
}: HeroSplitFixedImageSectionV3Props) {
  const config =
    variantConfig[variant] ?? variantConfig["text-3-image-4-right"];
  const colors = colorRecipeClassName;
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className={colors.section}>
      {/* A screen minus a sliver, so the next section peeks above the fold.
          `content-center` keeps the row itself content-sized and centres it in
          that taller box - without it the single auto row would stretch to the
          floor and drag the copy column's alignment with it. The card
          treatment lives on the bento twin; this one is copy on the section
          background beside a framed image. */}
      <LayoutGrid
        className="content-center items-center"
        columns={14}
        minHeight="sliver"
      >
        <LayoutGridItem
          alignX="left"
          alignY="middle"
          className={cx(
            "row-start-1 max-md:row-auto",
            colors.ink,
            config.textClassName,
          )}
        >
          <div className="fluid-type-frame w-full">
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
            {stats.length > 0 ? (
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
            ) : null}
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
