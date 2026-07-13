import Image from "next/image";
import { SevenColumnGrid, SevenColumnGridItem } from "@/components/primitives";

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
  eyebrow,
  headingLevel = 2,
  imageAlt,
  imageSrc,
  ratio = "3-2",
  title,
  variant = "text-3-image-4-right",
}: ContentSplitFixedImageSectionV3Props) {
  const config =
    variantConfig[variant] ?? variantConfig["text-3-image-4-right"];
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none items-center" padding="med">
        <SevenColumnGridItem
          alignX="left"
          alignY="middle"
          className={cx("content-padding text-service-ink", config.textClassName)}
        >
          <div className="fluid-type-frame w-full">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <HeadingTag className="type-heading-lg mt-eyebrow-display text-service-ink">
              {title}
            </HeadingTag>
            <p className="type-text-lg wrap-pretty mt-display-body text-service-muted">
              {body}
            </p>
            <div className="mt-body-actions-md grid gap-3">
              <p className="type-label text-service-accent">
                What this supports
              </p>
              <p className="type-text-md wrap-pretty text-service-muted">
                Pair this section with a project photo, crew detail, or process
                image, then use the copy to explain how the work is planned,
                protected, and followed through.
              </p>
              <p className="type-text-sm wrap-pretty text-service-ink">
                Best for capability notes, local context, and service standards
                that need more room than a card but should still feel easy to
                scan.
              </p>
            </div>
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
