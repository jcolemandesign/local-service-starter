import Image from "next/image";
import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
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

const variantConfig: Record<
  HeroSplitFixedImageVariant,
  FixedImageVariantConfig
> = {
  "text-3-image-4-right": {
    textClassName:
      "col-span-3 col-start-1 max-lg:col-span-2 max-lg:col-start-1 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
    imageClassName:
      "col-span-4 col-start-4 max-lg:col-span-3 max-lg:col-start-3 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
  },
  "text-4-image-3-right": {
    textClassName:
      "col-span-4 col-start-1 max-lg:col-span-3 max-lg:col-start-1 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
    imageClassName:
      "col-span-3 col-start-5 max-lg:col-span-2 max-lg:col-start-4 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
  },
  "image-3-left-text-4": {
    textClassName:
      "col-span-4 col-start-4 max-lg:col-span-3 max-lg:col-start-3 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
    imageClassName:
      "col-span-3 col-start-1 max-lg:col-span-2 max-lg:col-start-1 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
  },
  "image-4-left-text-3": {
    textClassName:
      "col-span-3 col-start-5 max-lg:col-span-2 max-lg:col-start-4 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
    imageClassName:
      "col-span-4 col-start-1 max-lg:col-span-3 max-lg:col-start-1 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
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
          "relative w-full overflow-hidden bg-service-surface shadow-service",
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

  return (
    <section className={colors.section}>
      <SevenColumnGrid className="section-min-none items-center">
        <SevenColumnGridItem
          alignX="left"
          alignY="middle"
          className={cx(
            "content-padding radius-medium row-start-1 max-md:row-auto",
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
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="center"
          alignY="middle"
          className={cx(
            "row-start-1 max-md:row-auto",
            config.imageClassName,
          )}
        >
          <FixedRatioImage alt={imageAlt} ratio={ratio} src={imageSrc} />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
