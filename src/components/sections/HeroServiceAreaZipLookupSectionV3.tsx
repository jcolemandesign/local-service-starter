"use client";

import type { CSSProperties, FormEvent } from "react";
import { useId, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/primitives/Button";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives/LayoutGrid";
import type { SectionColorRecipe } from "@/content/section-color-recipes";
import type { SplitImageVariant } from "@/content/section-style-options";

export type HeroServiceAreaZipLookupVariant = SplitImageVariant;

type HeroServiceAreaZipLookupSectionV3Props = {
  body: string;
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  headingLevel?: 1 | 2;
  imageAlt: string;
  imageSrc: string;
  inputLabel: string;
  inputPlaceholder: string;
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
};

const fullBleedImagePanelStyle: CSSProperties = {
  width: "calc(100% + var(--site-grid-inset-inline))",
};

const colorRecipeClassName: Record<
  SectionColorRecipe,
  {
    body: string;
    eyebrow: string;
    ink: string;
    marker: string;
    section: string;
    serviceArea: string;
    submit: string;
    success: string;
    successAction: string;
  }
> = {
  default: {
    body: "text-service-muted",
    eyebrow: "text-service-accent",
    ink: "text-service-ink",
    marker: "bg-service-accent",
    section: "bg-bg-page",
    serviceArea: "text-service-muted",
    submit:
      "border-service-accent bg-service-accent text-white hover:border-service-ink hover:bg-service-ink",
    success: "border-service-accent/35 bg-service-accent/10",
    successAction: "",
  },
  muted: {
    body: "text-service-muted",
    eyebrow: "text-service-accent",
    ink: "text-service-ink",
    marker: "bg-service-accent",
    section: "bg-service-surface",
    serviceArea: "text-service-muted",
    submit:
      "border-service-accent bg-service-accent text-white hover:border-service-ink hover:bg-service-ink",
    success: "border-service-accent/35 bg-service-accent/10",
    successAction: "",
  },
  dark: {
    body: "text-white/70",
    eyebrow: "text-white",
    ink: "text-white",
    marker: "bg-white",
    section: "bg-bg-dark",
    serviceArea: "text-white/70",
    submit: "border-white bg-white text-bg-dark hover:bg-service-surface",
    success: "border-white/35 bg-white/10",
    successAction:
      "!border-white !bg-white !text-bg-dark hover:!bg-service-surface",
  },
  accent: {
    body: "text-[var(--live-accent-muted-text)]",
    eyebrow: "text-[var(--live-accent-ink)]",
    ink: "text-[var(--live-accent-ink)]",
    marker: "bg-[var(--live-accent-ink)]",
    section: "bg-service-accent",
    serviceArea: "text-[var(--live-accent-muted-text)]",
    submit: "border-white bg-white text-bg-dark hover:bg-white/85",
    success: "border-white/40 bg-white/10",
    successAction: "!border-white !bg-white !text-bg-dark hover:!bg-white/85",
  },
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function HeroServiceAreaZipLookupSectionV3({
  body,
  colorRecipe = "default",
  eyebrow,
  headingLevel = 1,
  imageAlt,
  imageSrc,
  inputLabel,
  inputPlaceholder,
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
  const colors = colorRecipeClassName[colorRecipe];
  const HeadingTag = `h${headingLevel}` as const;
  const hasWideTextColumn =
    variant === "text-4-image-3-right" || variant === "image-3-left-text-4";

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
            <p className={cx("type-label", colors.eyebrow)}>{eyebrow}</p>
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
                <input
                  autoComplete="postal-code"
                  className="radius-button min-h-12 border border-service-border bg-white px-4 type-text-sm text-service-ink outline-none transition-colors placeholder:text-service-muted/70 focus:border-service-accent"
                  id={inputId}
                  inputMode="numeric"
                  name="zip-code"
                  placeholder={inputPlaceholder}
                />
                <button
                  className={cx(
                    "radius-button min-h-12 cursor-pointer border px-5 type-caption font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current",
                    colors.submit,
                  )}
                  type="submit"
                >
                  {submitLabel}
                </button>
              </div>
            </form>

            {hasSubmitted ? (
              <div
                aria-live="polite"
                className={cx(
                  "radius-medium mt-body-actions-sm border p-4",
                  colors.success,
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

            <p
              className={cx(
                "mt-body-actions-lg flex max-w-[var(--measure-copy-wide)] items-start gap-3 type-text-sm font-semibold",
                colors.serviceArea,
              )}
            >
              <span
                aria-hidden="true"
                className={cx(
                  "mt-[0.55em] size-2 shrink-0 rounded-full",
                  colors.marker,
                )}
              />
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
      </LayoutGrid>
    </section>
  );
}
