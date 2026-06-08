import Image from "next/image";
import {
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
    <div className="relative h-full min-h-0 w-full overflow-hidden border-2 border-service-accent bg-service-accent/10">
      <Image
        alt={imageAlt}
        className="object-cover"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 58vw"
        src={imageSrc}
      />
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.28),rgb(23_33_29_/_0.04))]" />
      <div className="absolute inset-0 bg-service-accent/10 mix-blend-multiply" />
      <div className="absolute left-5 top-5 max-w-[calc(100%-2.5rem)] bg-white/90 px-4 py-3 shadow-service backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-service-accent">
          Image slot
        </p>
        <p className="mt-1 text-sm font-semibold text-service-ink">
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
    <section className="bg-white">
      <SevenColumnGrid className="section-min-screen grid-rows-[minmax(0,1fr)] max-lg:grid-rows-none">
        <SevenColumnGridItem
          alignX="left"
          alignY="middle"
          className={cx(
            "row-start-1 h-full min-h-0 bg-service-surface p-8 text-service-ink max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto max-md:p-6",
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
              <a
                className="inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap bg-service-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-service-ink"
                href="#contact"
              >
                {primaryAction}
              </a>
              <a
                className="inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap border border-service-border bg-white px-6 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                href="#services"
              >
                {secondaryAction}
              </a>
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
            "row-start-1 h-full min-h-0 overflow-hidden max-lg:media-min-medium max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto",
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
