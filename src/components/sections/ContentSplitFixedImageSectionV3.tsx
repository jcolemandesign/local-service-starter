import Image from "next/image";
import { SevenColumnGrid, SevenColumnGridItem } from "@/components/primitives";
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

type ContentSplitFixedImageSectionV3Props = {
  body: string;
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  headingLevel?: 1 | 2;
  imageAlt: string;
  imageSrc: string;
  primaryAction?: string;
  ratio?: ContentSplitFixedImageRatio;
  secondaryAction?: string;
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

function cx(...classes: Array<string | undefined>) {
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
  body,
  colorRecipe = "default",
  eyebrow,
  headingLevel = 2,
  imageAlt,
  imageSrc,
  ratio = "3-2",
  stats = [],
  title,
  variant = "text-3-image-4-right",
}: ContentSplitFixedImageSectionV3Props) {
  const config =
    variantConfig[variant] ?? variantConfig["text-3-image-4-right"];
  const HeadingTag = `h${headingLevel}` as const;
  // Section background and ink/muted text below use the generic
  // bg-page/service-ink tokens, which the pagebuilder-section-frame wrapper
  // already re-tints correctly for dark/accent recipes. text-service-accent
  // is the one token that stays a constant brand color regardless of recipe,
  // so it needs an explicit swap here or the eyebrow becomes invisible
  // against an accent-colored background.
  const eyebrowClass =
    colorRecipe === "accent" ? "text-[var(--live-accent-ink)]" : "text-service-accent";

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none items-center" padding="med">
        <SevenColumnGridItem
          alignX="left"
          alignY="middle"
          className={cx("content-padding text-service-ink", config.textClassName)}
        >
          <div className="fluid-type-frame w-full">
            <p className={cx("type-label", eyebrowClass)}>{eyebrow}</p>
            <HeadingTag className="type-heading-lg mt-eyebrow-display text-service-ink">
              {title}
            </HeadingTag>
            <p className="type-text-lg wrap-pretty mt-display-body text-service-muted">
              {body}
            </p>
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
