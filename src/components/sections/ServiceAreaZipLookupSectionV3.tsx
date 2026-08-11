"use client";

import type { CSSProperties } from "react";
import { FormEvent, useId, useState } from "react";

import { Button } from "@/components/primitives/Button";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives/SevenColumnGrid";
import type {
  SectionCardBorder,
  SectionCardFill,
} from "@/content/section-color-recipes";

/**
 * The form furniture - field label, placeholder, submit, map caption - defaults
 * here rather than living in the section library. It is the same call made for
 * the financing calculator's result labels: these read identically for every
 * business, and holding them in the library made them demo content the mapper
 * spread onto client pages with no field to author them.
 *
 * successTitle and successActionLabel are deliberately NOT in this group. They
 * sit beside successBody, which is already a copy field, and they say something
 * about the business rather than about the form.
 */
type ServiceAreaZipLookupSectionV3Props = {
  title: string;
  prompt: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  submitLabel?: string;
  successTitle: string;
  successBody: string;
  successActionLabel: string;
  successActionHref: string;
  mapLabel?: string;
  columns: readonly (readonly string[])[];
  cardBorder?: SectionCardBorder;
  cardFill?: SectionCardFill;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ServiceAreaMapPlaceholder({
  cardBorder,
  cardFill,
  label,
  revealIndex,
}: {
  cardBorder: SectionCardBorder;
  cardFill: SectionCardFill;
  label: string;
  revealIndex: number;
}) {
  return (
    <div
      className={cx(
        // The whole panel is the unit. Its rules and its FPO badge are
        // absolutely positioned against this box, so anything smaller would
        // animate the map out from under its own furniture.
        "reveal-on-scroll",
        "content-padding radius-medium relative isolate grid h-full min-h-[31rem] overflow-hidden max-lg:min-h-[24rem] max-md:min-h-[20rem]",
        cardFill === "none" ? "bg-transparent shadow-none" : "bg-service-surface shadow-service",
        cardBorder === "off" ? "!border-0" : "border border-service-border",
      )}
      style={{ "--reveal-index": revealIndex } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -z-10 h-px bg-service-border"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 -z-10 w-px bg-service-border"
      />
      <div className="grid h-full place-items-center">
        <span className="radius-button border border-service-border bg-bg-page/80 px-5 py-3 type-caption font-semibold text-service-muted shadow-sm">
          FPO map
        </span>
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 border-t border-service-border pt-4">
        <span className="type-label text-service-accent">{label}</span>
        <span
          aria-hidden="true"
          className="radius-button size-10 shrink-0 border border-service-ink bg-service-ink"
        />
      </div>
    </div>
  );
}

export function ServiceAreaZipLookupSectionV3({
  title,
  prompt,
  inputLabel = "ZIP code lookup",
  inputPlaceholder = "Enter ZIP code",
  submitLabel = "Check",
  successTitle,
  successBody,
  successActionLabel,
  successActionHref,
  mapLabel = "Local coverage map",
  columns,
  cardBorder = "on",
  cardFill = "solid",
}: ServiceAreaZipLookupSectionV3Props) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const inputId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
  }

  return (
    <section className="bg-bg-page text-service-ink">
      <SevenColumnGrid padding="med" minHeight="none" className="items-stretch">
        <SevenColumnGridItem
          className="col-span-7 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
          alignX="center"
        >
          <div
            className="reveal-on-scroll fluid-type-frame mx-auto max-w-[var(--measure-copy-wide)] text-center"
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <h2 className="type-heading-xl [text-wrap:pretty]">{title}</h2>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <div
            className={cx(
              "reveal-on-scroll",
              "content-padding radius-medium grid h-full content-between",
              cardFill === "none" ? "bg-transparent shadow-none" : "bg-service-surface shadow-service",
              cardBorder === "off" ? "!border-0" : "border border-service-border",
            )}
            style={{ "--reveal-index": 1 } as CSSProperties}
          >
            <div>
              <p className="type-label text-service-accent">Service area</p>
              <div className="mt-heading-body-md grid grid-cols-2 items-start gap-x-6 gap-y-3 max-sm:grid-cols-1">
                {columns.map((column, columnIndex) => (
                  <ul key={columnIndex} className="grid content-start gap-3">
                    {column.map((area) => (
                      <li
                        key={area}
                        className="flex items-center gap-3 type-text-sm font-semibold text-service-ink"
                      >
                        <span
                          aria-hidden="true"
                          className="size-2 shrink-0 rounded-full bg-service-accent"
                        />
                        {area}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            <div className="mt-body-actions-lg">
              <p className="type-heading-sm">{prompt}</p>
              <form
                className="mt-heading-body-sm grid gap-3"
                onSubmit={handleSubmit}
              >
                <label className="sr-only" htmlFor={inputId}>
                  {inputLabel}
                </label>
                <div className="grid grid-cols-[1fr_auto] gap-3 max-sm:grid-cols-1">
                  <input
                    id={inputId}
                    name="zip-code"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder={inputPlaceholder}
                    className="radius-button min-h-12 border border-service-border bg-surface-raised px-4 type-text-sm text-service-ink outline-none transition-colors placeholder:text-service-muted/70 focus:border-service-accent"
                  />
                  <button
                    type="submit"
                    onClick={() => setHasSubmitted(true)}
                    className="radius-button min-h-12 cursor-pointer border border-service-accent bg-service-accent px-5 type-caption font-semibold text-white transition-colors hover:border-bg-dark hover:bg-bg-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                  >
                    {submitLabel}
                  </button>
                </div>
              </form>

              {hasSubmitted ? (
                <div
                  className="mt-body-actions-sm radius-medium border border-service-accent/35 bg-service-accent/10 p-4"
                  role="status"
                  aria-live="polite"
                >
                  <p className="type-heading-sm">{successTitle}</p>
                  <p className="mt-heading-body-xs type-text-sm text-service-muted">
                    {successBody}
                  </p>
                  <Button
                    href={successActionHref}
                    className="mt-body-actions-sm w-fit"
                  >
                    {successActionLabel}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-4 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <ServiceAreaMapPlaceholder
            cardBorder={cardBorder}
            cardFill={cardFill}
            label={mapLabel}
            revealIndex={2}
          />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
