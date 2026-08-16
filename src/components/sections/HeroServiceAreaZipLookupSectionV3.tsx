"use client";

import type { CSSProperties, FormEvent } from "react";
import { useId, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/primitives/Button";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives/LayoutGrid";
import type { SectionColorRecipe } from "@/content/section-color-recipes";
import type { FullImageSplitVariant } from "@/content/section-style-options";

export type HeroServiceAreaZipLookupVariant = FullImageSplitVariant;

type HeroServiceAreaZipLookupSectionV3Props = {
  body: string;
  /** Matches `ServiceAreaZipLookupSectionV3`, which offers the same two on the
   *  same result panel - the hero variant simply never wired them up. */
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  headingLevel?: 1 | 2;
  imageAlt: string;
  imageSrc: string;
  inputLabel: string;
  inputPlaceholder: string;
  serviceAreas: readonly string[];
  serviceAreasLabel: string;
  serviceAreaText: string;
  submitLabel: string;
  successActionHref: string;
  successActionLabel: string;
  successBody: string;
  successTitle: string;
  title: string;
  variant?: HeroServiceAreaZipLookupVariant;
};

type HeroVariantConfig = {
  /**
   * Ramp that dissolves the photo into the section behind it, on the overlap
   * variants where the copy sits over the image. Carried by the image rather
   * than by a ground-coloured panel over it - a panel only disappears while the
   * section's ground is one flat colour, and a background texture puts a seam
   * straight back down the photo. See the mask classes in `globals.css`.
   */
  imageMaskClassName?: string;
  imageClassName: string;
  imagePanelClassName: string;
  textClassName: string;
};

const variantConfig: Record<
  HeroServiceAreaZipLookupVariant,
  HeroVariantConfig
> = {
  "text-3-image-4-right": {
    textClassName: "col-span-6 col-start-1",
    imageClassName: "col-span-7 col-start-8",
    imagePanelClassName:
      "left-auto right-[calc(var(--site-grid-inset-inline)*-1)]",
  },
  "text-4-image-3-right": {
    textClassName: "col-span-7 col-start-1",
    imageClassName: "col-span-6 col-start-9",
    imagePanelClassName:
      "left-auto right-[calc(var(--site-grid-inset-inline)*-1)]",
  },
  "image-3-left-text-4": {
    textClassName: "col-span-7 col-start-8",
    imageClassName: "col-span-6 col-start-1",
    imagePanelClassName:
      "left-[calc(var(--site-grid-inset-inline)*-1)] right-auto",
  },
  "image-4-left-text-3": {
    textClassName: "col-span-6 col-start-9",
    imageClassName: "col-span-7 col-start-1",
    imagePanelClassName:
      "left-[calc(var(--site-grid-inset-inline)*-1)] right-auto",
  },
  "text-7-image-9-overlap-right": {
    textClassName: "relative z-10 col-span-8 col-start-1",
    imageClassName: "z-0 col-span-9 col-start-6",
    imagePanelClassName:
      "left-auto right-[calc(var(--site-grid-inset-inline)*-1)]",
    imageMaskClassName: "full-image-split-image-mask-right",
  },
  "image-9-overlap-left-text-7": {
    textClassName: "relative z-10 col-span-8 col-start-7",
    imageClassName: "z-0 col-span-9 col-start-1",
    imagePanelClassName:
      "left-[calc(var(--site-grid-inset-inline)*-1)] right-auto",
    imageMaskClassName: "full-image-split-image-mask-left",
  },
};

const fullBleedImagePanelStyle: CSSProperties = {
  width: "calc(100% + var(--site-grid-inset-inline))",
};

const colorRecipeClassName = {
  body: "text-service-muted",
  eyebrow: "text-service-accent",
  ink: "text-service-ink",
  marker: "bg-service-accent",
  section: "bg-bg-page",
  serviceArea: "text-service-muted",
  submit:
    "border-cta-primary bg-cta-primary text-cta-primary-ink hover:border-cta-primary-hover hover:bg-cta-primary-hover",
  success: "border-service-accent/35 bg-service-accent/10",
  successAction: "",
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function MapPinIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 21s6-5.35 6-11a6 6 0 1 0-12 0c0 5.65 6 11 6 11Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
      <path
        d="M4 10h11M11 6l4 4-4 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      className="grid size-6 shrink-0 place-items-center rounded-full bg-service-accent text-white"
    >
      <svg className="size-3.5" fill="none" viewBox="0 0 16 16">
        <path
          d="m3.5 8.25 2.75 2.75 6.25-6.25"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
}

export function HeroServiceAreaZipLookupSectionV3({
  body,
  cardBorder = "on",
  cardFill = "solid",
  eyebrow,
  headingLevel = 1,
  imageAlt,
  imageSrc,
  inputLabel,
  inputPlaceholder,
  serviceAreas,
  serviceAreasLabel,
  serviceAreaText,
  submitLabel,
  successActionHref,
  successActionLabel,
  successBody,
  successTitle,
  title,
  variant = "text-3-image-4-right",
}: HeroServiceAreaZipLookupSectionV3Props) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const inputId = useId();
  const config = variantConfig[variant] ?? variantConfig["text-3-image-4-right"];
  const colors = colorRecipeClassName;
  const HeadingTag = `h${headingLevel}` as const;
  const hasWideTextColumn =
    variant === "text-4-image-3-right" ||
    variant === "image-3-left-text-4" ||
    variant === "text-7-image-9-overlap-right" ||
    variant === "image-9-overlap-left-text-7";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
  }

  return (
    <section className={cx("relative", colors.section)}>
      <LayoutGrid
        className="section-min-sliver h-[calc(var(--section-min-screen)-var(--section-sliver-gap))] grid-rows-[minmax(0,1fr)] max-lg:grid-rows-none max-md:h-auto"
        columns={14}
      >
        <LayoutGridItem
          alignX="left"
          alignY="middle"
          className={cx(
            "content-padding-y row-start-1 h-full min-h-0 max-lg:col-span-10 max-lg:col-start-1 max-lg:row-auto max-md:col-span-6 max-sm:col-span-2",
            colors.ink,
            config.textClassName,
          )}
        >
          <div className="fluid-type-frame w-full">
            <p className={cx("type-label flex items-center gap-2", colors.eyebrow)}>
              <MapPinIcon className="size-4" />
              <span>{eyebrow}</span>
            </p>
            <HeadingTag
              className={cx(
                "mt-eyebrow-display wrap-pretty",
                hasWideTextColumn ? "type-display-xl" : "type-display-lg",
              )}
            >
              {title}
            </HeadingTag>
            <p className={cx("type-text-lg wrap-pretty mt-display-body", colors.body)}>
              {body}
            </p>

            <form
              className="mt-body-actions-md grid max-w-[var(--measure-copy-wide)] gap-3"
              onSubmit={handleSubmit}
            >
              <label className="sr-only" htmlFor={inputId}>
                {inputLabel}
              </label>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 max-sm:grid-cols-1">
                <div className="relative min-w-0">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-service-muted"
                  >
                    <MapPinIcon className="size-5" />
                  </span>
                  <input
                    autoComplete="postal-code"
                    className="radius-button min-h-12 w-full border border-service-border bg-surface-raised pl-12 pr-4 type-text-sm text-service-ink outline-none transition-colors placeholder:text-service-muted/70 focus:border-service-accent"
                    id={inputId}
                    inputMode="numeric"
                    name="zip-code"
                    placeholder={inputPlaceholder}
                  />
                </div>
                <button
                  className={cx(
                    "radius-button inline-flex min-h-12 cursor-pointer items-center justify-between gap-4 border px-5 type-caption font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current",
                    colors.submit,
                  )}
                  type="submit"
                >
                  <span>{submitLabel}</span>
                  <ArrowRightIcon />
                </button>
              </div>
            </form>

            {hasSubmitted ? (
              <div
                aria-live="polite"
                className={cx(
                  "radius-medium mt-body-actions-sm border p-4",
                  colors.success,
                  cardFill === "none" && "!bg-transparent !shadow-none",
                  cardBorder === "off" && "!border-transparent",
                )}
                role="status"
              >
                <p className="type-heading-sm">{successTitle}</p>
                <p className={cx("mt-heading-body-xs type-text-sm", colors.body)}>
                  {successBody}
                </p>
                <Button
                  className={cx(
                    "mt-body-actions-sm w-fit",
                    colors.successAction,
                  )}
                  href={successActionHref}
                >
                  {successActionLabel}
                </Button>
              </div>
            ) : null}

            <div className="mt-body-actions-md">
              <p className="type-heading-sm">{serviceAreasLabel}</p>
              <ul className="mt-heading-body-sm flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <li
                    className="radius-button inline-flex min-h-10 items-center gap-2 border border-service-border bg-surface-raised px-3 type-text-sm font-semibold text-service-ink"
                    key={area}
                  >
                    <MapPinIcon className="size-4 text-service-accent" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p
              className={cx(
                "mt-body-actions-lg flex max-w-[var(--measure-copy-wide)] items-start gap-3 type-text-sm font-semibold",
                colors.serviceArea,
              )}
            >
              <CheckIcon />
              <span>{serviceAreaText}</span>
            </p>
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignX="stretch"
          alignY="stretch"
          className={cx(
            "relative row-start-1 h-full min-h-0 overflow-visible max-lg:media-min-medium max-lg:col-span-10 max-lg:col-start-1 max-lg:row-auto max-md:col-span-6 max-md:h-auto max-sm:col-span-2",
            config.imageClassName,
          )}
        >
          <div
            className={cx(
              "absolute bottom-[calc(0px_-_var(--site-grid-inset-block))] top-[calc(0px_-_var(--site-grid-inset-block))] overflow-hidden bg-service-surface max-md:relative max-md:inset-auto max-md:h-full max-md:min-h-[var(--media-min-medium)] max-md:!w-full",
              config.imagePanelClassName,
              config.imageMaskClassName,
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
          </div>
        </LayoutGridItem>

        {/* No fade panel - the ramp rides the image itself now, so the
            section's own ground shows through underneath, texture and all. */}
      </LayoutGrid>
    </section>
  );
}
