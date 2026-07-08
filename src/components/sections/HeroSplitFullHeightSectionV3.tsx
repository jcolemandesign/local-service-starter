import type { CSSProperties } from "react";
import Image from "next/image";
import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

export type HeroSplitFullHeightVariant =
  | "text-3-image-4-right"
  | "text-4-image-3-right"
  | "image-3-left-text-4"
  | "image-4-left-text-3";

type HeroSplitFullHeightSectionV3Props = {
  body: string;
  eyebrow: string;
  headingLevel?: 1 | 2;
  imageAlt: string;
  imageSrc: string;
  primaryAction: string;
  secondaryAction: string;
  stats: readonly string[];
  title: string;
  variant?: HeroSplitFullHeightVariant;
};

type HeroVariantConfig = {
  imageClassName: string;
  imagePanelClassName: string;
  imageSlotLabel: string;
  textClassName: string;
};

const variantConfig: Record<HeroSplitFullHeightVariant, HeroVariantConfig> = {
  "text-3-image-4-right": {
    textClassName: "col-span-3 col-start-1",
    imageClassName: "col-span-4 col-start-4",
    imagePanelClassName:
      "left-auto right-[calc(var(--site-grid-inset-inline)*-1)]",
    imageSlotLabel: "Image area: columns 4-7",
  },
  "text-4-image-3-right": {
    textClassName: "col-span-4 col-start-1",
    imageClassName: "col-span-3 col-start-5",
    imagePanelClassName:
      "left-auto right-[calc(var(--site-grid-inset-inline)*-1)]",
    imageSlotLabel: "Image area: columns 5-7",
  },
  "image-3-left-text-4": {
    textClassName: "col-span-4 col-start-4",
    imageClassName: "col-span-3 col-start-1",
    imagePanelClassName:
      "left-[calc(var(--site-grid-inset-inline)*-1)] right-auto",
    imageSlotLabel: "Image area: columns 1-3",
  },
  "image-4-left-text-3": {
    textClassName: "col-span-3 col-start-5",
    imageClassName: "col-span-4 col-start-1",
    imagePanelClassName:
      "left-[calc(var(--site-grid-inset-inline)*-1)] right-auto",
    imageSlotLabel: "Image area: columns 1-4",
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
  stats,
  title,
  variant = "text-3-image-4-right",
}: HeroSplitFullHeightSectionV3Props) {
  const config = variantConfig[variant];
  const HeadingTag = `h${headingLevel}` as const;
  const isTextFourImageThree = variant === "text-4-image-3-right";

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-screen h-[var(--section-min-screen)] grid-rows-[minmax(0,1fr)] max-lg:grid-rows-none max-md:h-auto">
        <SevenColumnGridItem
          alignX="left"
          alignY="middle"
          className={cx(
            "content-padding-y radius-medium row-start-1 h-full min-h-0 text-service-ink max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto",
            config.textClassName,
          )}
        >
          <div className="fluid-type-frame w-full">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <HeadingTag
              className={cx(
                "mt-eyebrow-display text-service-ink",
                isTextFourImageThree ? "type-display-xl" : "type-display-lg",
              )}
            >
              {title}
            </HeadingTag>
            <p
              className={cx(
                "type-text-xl wrap-pretty mt-display-body text-service-muted",
              )}
            >
              {body}
            </p>
            <div
              className="mt-body-actions-md flex flex-wrap inline-gap-med"
            >
              <RequestServiceButton>
                {primaryAction}
              </RequestServiceButton>
              <Button href="#services" variant="secondary">
                {secondaryAction}
              </Button>
            </div>
            <ul
              className={cx(
                "mt-body-actions-lg grid grid-cols-3 card-grid-gap-med max-md:mt-body-actions-md max-md:grid-cols-1",
              )}
            >
              {stats.map((stat) => (
                <li
                  className={cx(
                    "type-text-sm font-semibold text-service-ink",
                    isTextFourImageThree
                      ? "relative overflow-hidden rounded-full border border-white/70 bg-white/78 px-5 py-3 shadow-service backdrop-blur-sm before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-white/90"
                      : "border-l border-service-border pl-4 max-md:border-l-0 max-md:border-t max-md:pl-0 max-md:pt-3",
                  )}
                  key={stat}
                >
                  <span className="relative">{stat}</span>
                </li>
              ))}
            </ul>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="stretch"
          alignY="stretch"
          className={cx(
            "relative row-start-1 h-full min-h-0 overflow-visible max-lg:media-min-medium max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto max-md:h-auto",
            config.imageClassName,
          )}
        >
          <SampleImagePanel
            className={config.imagePanelClassName}
            imageAlt={imageAlt}
            imageSrc={imageSrc}
            slotLabel={config.imageSlotLabel}
          />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
