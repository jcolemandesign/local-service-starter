import Image from "next/image";
import { Button, SevenColumnGrid, SevenColumnGridItem } from "@/components/primitives";
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

const variantConfig: Record<
  ContentSplitFixedImageVariant,
  FixedImageVariantConfig
> = {
  "text-3-image-4-right": {
    textClassName:
      "col-span-3 col-start-1 row-start-1 max-lg:col-span-2 max-lg:col-start-1 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
    imageClassName:
      "col-span-4 col-start-4 row-start-1 max-lg:col-span-3 max-lg:col-start-3 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
  },
  "text-4-image-3-right": {
    textClassName:
      "col-span-4 col-start-1 row-start-1 max-lg:col-span-3 max-lg:col-start-1 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
    imageClassName:
      "col-span-3 col-start-5 row-start-1 max-lg:col-span-2 max-lg:col-start-4 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
  },
  "image-3-left-text-4": {
    textClassName:
      "col-span-4 col-start-4 row-start-1 max-lg:col-span-3 max-lg:col-start-3 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
    imageClassName:
      "col-span-3 col-start-1 row-start-1 max-lg:col-span-2 max-lg:col-start-1 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
  },
  "image-4-left-text-3": {
    textClassName:
      "col-span-3 col-start-5 row-start-1 max-lg:col-span-2 max-lg:col-start-4 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
    imageClassName:
      "col-span-4 col-start-1 row-start-1 max-lg:col-span-3 max-lg:col-start-1 max-md:col-span-3 max-md:col-start-1 max-md:row-auto max-sm:col-span-1",
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
  const hasFourColumnText =
    variant === "text-4-image-3-right" || variant === "image-4-left-text-3";

  return hasFourColumnText ? 3 : 2;
}

const colorRecipeClassName: Record<
  SectionColorRecipe,
  { action: string; eyebrow: string; secondaryAction: string }
> = {
  default: { action: "", eyebrow: "text-service-accent", secondaryAction: "" },
  muted: { action: "", eyebrow: "text-service-accent", secondaryAction: "" },
  dark: {
    action: "!border-white !bg-white !text-bg-dark hover:!bg-service-surface",
    eyebrow: "text-white",
    // Ghost/outline treatment: the default secondary style is a light pill
    // (bg-bg-page), which would clash with a dark section - drop the fill so
    // it reads as a lighter-weight, secondary action against the dark bg.
    secondaryAction:
      "!border-white/40 !bg-transparent !text-white hover:!border-white hover:!bg-white/10 hover:!text-white",
  },
  accent: {
    // RequestServiceButton's own default fill is bg-service-accent - identical
    // to this recipe's section background - so without this override the
    // primary CTA is invisible against it.
    action: "!border-white !bg-white !text-bg-dark hover:!bg-white/85",
    eyebrow: "text-[var(--live-accent-ink)]",
    secondaryAction:
      "!border-[color-mix(in_oklab,var(--live-accent-ink)_40%,transparent)] !bg-transparent !text-[var(--live-accent-ink)] hover:!border-[color:var(--live-accent-ink)] hover:!bg-white/10 hover:!text-[var(--live-accent-ink)]",
  },
};

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
        "relative w-full overflow-hidden bg-service-surface shadow-service",
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
  colorRecipe = "default",
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
  const colors = colorRecipeClassName[colorRecipe];
  const headingSizeIndex = Math.min(
    headingSizeScale.length - 1,
    Math.max(0, getDefaultHeadingSizeIndex(variant) + headingSizeStep),
  );
  const headingSizeClassName = headingSizeScale[headingSizeIndex];
  const hasBullets = Boolean(bullets && bullets.length > 0);
  const hasCta = Boolean(primaryAction || secondaryAction);

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none items-center" padding="med">
        <SevenColumnGridItem
          alignX="left"
          alignY="middle"
          className={cx("content-padding text-service-ink", config.textClassName)}
        >
          <div className="fluid-type-frame w-full">
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
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="center"
          alignY="middle"
          className={config.imageClassName}
        >
          <FixedRatioImage alt={imageAlt} ratio={ratio} src={imageSrc} />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
