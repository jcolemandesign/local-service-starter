import Image from "next/image";
import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

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
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none items-center">
        <SevenColumnGridItem
          alignX="left"
          alignY="middle"
          className={cx(
            "content-padding radius-medium row-start-1 text-service-ink max-md:row-auto",
            config.textClassName,
          )}
        >
          <div className="fluid-type-frame w-full">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <HeadingTag className="type-display-lg mt-eyebrow-display text-service-ink">
              {title}
            </HeadingTag>
            <p className="type-text-xl wrap-pretty mt-display-body text-service-muted">
              {body}
            </p>
            <div className="mt-body-actions-md flex flex-wrap inline-gap-med">
              <RequestServiceButton>{primaryAction}</RequestServiceButton>
              <Button href={secondaryActionHref} variant="secondary">
                {secondaryAction}
              </Button>
            </div>
            <ul className="mt-body-actions-lg grid grid-cols-3 card-grid-gap-med max-md:mt-body-actions-md max-md:grid-cols-1">
              {stats.map((stat) => (
                <li
                  className="type-text-sm border-l border-service-border pl-4 font-semibold text-service-ink max-md:border-l-0 max-md:border-t max-md:pl-0 max-md:pt-3"
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
