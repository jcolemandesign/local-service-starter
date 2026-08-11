import Image from "next/image";
import type { CSSProperties } from "react";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

export type CTASmallBandImageSectionV3Props = {
  action: string;
  actionHref?: string;
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  colorRecipe?: SectionColorRecipe;
  imageAlt?: string;
  imageSrc?: string;
  title: string;
};

const recipeClasses = {
  action:
    "!border-service-accent !bg-service-accent !text-white hover:!border-bg-dark hover:!bg-bg-dark",
  band: "bg-service-surface shadow-service",
  body: "text-service-muted",
  border: "border-service-border",
  fade: "from-service-surface",
  heading: "text-service-ink",
  section: "bg-bg-page",
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CTASmallBandImageSectionV3({
  action,
  actionHref = "#contact",
  body,
  cardBorder = "on",
  cardFill = "solid",
  imageAlt,
  imageSrc,
  title,
}: CTASmallBandImageSectionV3Props) {
  const colors = recipeClasses;
  const isFilled = cardFill === "solid";

  return (
    <section className={colors.section}>
      <LayoutGrid columns={14} minHeight="none" padding="med">
        <LayoutGridItem className="col-span-14 max-lg:col-span-10 max-md:col-span-6 max-sm:col-span-2">
          <article
            className={cx(
              // One unit. The band is a single bordered box holding copy, an
              // action and a cropped photo flush to its own edge; staggering
              // those three would take the band apart as it arrives.
              "reveal-on-scroll",
              "radius-medium grid grid-cols-14 overflow-hidden border max-lg:grid-cols-10 max-md:grid-cols-6 max-sm:grid-cols-2",
              colors.band,
              colors.border,
              "recipe-card-context",
              cardFill === "none" && "!bg-transparent !shadow-none",
              cardBorder === "off" && "!border-transparent",
            )}
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <div className="col-span-6 flex min-w-0 flex-col justify-center px-8 py-6 max-lg:col-span-5 max-lg:px-6 max-md:col-span-6 max-md:px-5 max-md:py-5 max-sm:col-span-2">
              <h2
                className={cx(
                  "type-heading-sm truncate max-md:whitespace-normal",
                  isFilled ? colors.heading : "text-service-ink",
                )}
              >
                {title}
              </h2>
              <p
                className={cx(
                  "type-text-xs mt-1 max-w-none truncate max-md:whitespace-normal",
                  isFilled ? colors.body : "text-service-muted",
                )}
              >
                {body}
              </p>
            </div>

            <div className="col-span-4 flex items-center justify-center px-6 py-6 max-lg:col-span-3 max-lg:px-4 max-md:col-span-3 max-md:justify-start max-md:px-5 max-md:py-5 max-sm:col-span-2 max-sm:pt-0">
              <Button
                className={cx(
                  "w-full max-w-80 justify-between gap-5",
                  isFilled
                    ? colors.action
                    : "!border-service-accent !bg-service-accent !text-white",
                )}
                href={actionHref}
                variant="secondary"
              >
                <span>{action}</span>
                <span aria-hidden="true" className="text-xl leading-none">
                  →
                </span>
              </Button>
            </div>

            <div className="relative col-span-4 overflow-hidden bg-bg-muted max-lg:col-span-2 max-md:col-span-3 max-md:min-h-24 max-sm:col-span-2 max-sm:min-h-32">
              {imageSrc ? (
                <Image
                  alt={imageAlt ?? ""}
                  className="object-cover object-[35%_50%]"
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, 29vw"
                  src={imageSrc}
                />
              ) : null}
              {isFilled ? (
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute inset-y-0 left-0 w-16 bg-gradient-to-r to-transparent max-lg:w-8",
                    colors.fade,
                  )}
                />
              ) : null}
            </div>
          </article>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
