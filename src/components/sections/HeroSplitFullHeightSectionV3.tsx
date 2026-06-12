import Image from "next/image";
import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

export type HeroSplitFullHeightVariant =
  | "text-3-image-4-right"
  | "text-4-image-3-right"
  | "image-3-left-text-4"
  | "image-4-left-text-3";

type HeroSplitFullHeightSectionV3Props = {
  body: string;
  eyebrow: string;
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
  imageSlotLabel: string;
  textClassName: string;
};

const variantConfig: Record<HeroSplitFullHeightVariant, HeroVariantConfig> = {
  "text-3-image-4-right": {
    textClassName: "col-span-3 col-start-1",
    imageClassName: "col-span-4 col-start-4",
    imageSlotLabel: "Image area: columns 4-7",
  },
  "text-4-image-3-right": {
    textClassName: "col-span-4 col-start-1",
    imageClassName: "col-span-3 col-start-5",
    imageSlotLabel: "Image area: columns 5-7",
  },
  "image-3-left-text-4": {
    textClassName: "col-span-4 col-start-4",
    imageClassName: "col-span-3 col-start-1",
    imageSlotLabel: "Image area: columns 1-3",
  },
  "image-4-left-text-3": {
    textClassName: "col-span-3 col-start-5",
    imageClassName: "col-span-4 col-start-1",
    imageSlotLabel: "Image area: columns 1-4",
  },
};

function SampleImagePanel({
  imageAlt,
  imageSrc,
  slotLabel,
}: {
  imageAlt: string;
  imageSrc: string;
  slotLabel: string;
}) {
  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-service-surface">
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
  imageAlt,
  imageSrc,
  primaryAction,
  secondaryAction,
  stats,
  title,
  variant = "text-3-image-4-right",
}: HeroSplitFullHeightSectionV3Props) {
  const config = variantConfig[variant];
  const isTextFourImageThree = variant === "text-4-image-3-right";

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-screen grid-rows-[minmax(0,1fr)] max-lg:grid-rows-none">
        <SevenColumnGridItem
          alignX="left"
          alignY="middle"
          className={cx(
            "content-padding radius-medium row-start-1 h-full min-h-0 bg-service-surface text-service-ink max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto",
            config.textClassName,
          )}
        >
          <div className="fluid-type-frame w-full">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2
              className={cx(
                "mt-eyebrow-display text-service-ink",
                isTextFourImageThree ? "type-display-xl" : "type-display-lg",
              )}
            >
              {title}
            </h2>
            <p
              className={cx(
                "type-text-xl wrap-pretty mt-display-body text-service-muted",
              )}
            >
              {body}
            </p>
            <div
              className="mt-body-actions-md flex flex-wrap gap-4"
            >
              <Button href="#contact">
                {primaryAction}
              </Button>
              <Button href="#services" variant="secondary">
                {secondaryAction}
              </Button>
            </div>
            <ul
              className={cx(
                "mt-12 grid grid-cols-3 gap-4 max-md:mt-8 max-md:grid-cols-1",
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
            "radius-medium row-start-1 h-full min-h-0 overflow-hidden max-lg:media-min-medium max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto",
            config.imageClassName,
          )}
        >
          <SampleImagePanel
            imageAlt={imageAlt}
            imageSrc={imageSrc}
            slotLabel={config.imageSlotLabel}
          />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
