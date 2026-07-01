"use client";

import { FormEvent, useId, useState } from "react";

import { Button } from "@/components/primitives/Button";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives/SevenColumnGrid";

type ServiceAreaZipLookupSectionV3Props = {
  title: string;
  prompt: string;
  inputLabel: string;
  inputPlaceholder: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  successActionLabel: string;
  successActionHref: string;
  mapLabel: string;
  columns: readonly (readonly string[])[];
};

function ServiceAreaMapPlaceholder({
  areas,
  label,
}: {
  areas: readonly string[];
  label: string;
}) {
  return (
    <div className="content-padding radius-surface relative isolate grid h-full min-h-[31rem] overflow-hidden border border-service-border bg-service-surface shadow-service max-lg:min-h-[24rem] max-md:min-h-[20rem]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -z-10 h-px bg-service-border"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 -z-10 w-px bg-service-border"
      />
      <div className="grid h-full grid-cols-3 content-between gap-4 max-md:grid-cols-2">
        {areas.map((area, index) => (
          <span
            key={area}
            className={`radius-button min-h-11 border border-service-border bg-white px-4 py-3 type-caption font-semibold text-service-ink shadow-sm ${
              index % 3 === 1 ? "self-center" : ""
            } ${index % 3 === 2 ? "self-end" : ""}`}
          >
            {area}
          </span>
        ))}
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
  inputLabel,
  inputPlaceholder,
  submitLabel,
  successTitle,
  successBody,
  successActionLabel,
  successActionHref,
  mapLabel,
  columns,
}: ServiceAreaZipLookupSectionV3Props) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const inputId = useId();
  const areas = columns.flat();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);
  }

  return (
    <section className="bg-service-surface text-service-ink">
      <SevenColumnGrid padding="med" minHeight="none" className="items-stretch">
        <SevenColumnGridItem
          className="col-span-7 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
          alignX="center"
        >
          <div className="fluid-type-frame mx-auto max-w-[var(--measure-copy-wide)] text-center">
            <h2 className="type-heading-xl [text-wrap:pretty]">{title}</h2>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <div className="content-padding radius-surface grid h-full content-between border border-service-border bg-white shadow-service">
            <div>
              <p className="type-label text-service-accent">Service area</p>
              <div className="mt-heading-body-md grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                {columns.map((column, columnIndex) => (
                  <ul key={columnIndex} className="grid gap-3">
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
                    className="radius-button min-h-12 border border-service-border bg-service-surface px-4 type-text-sm text-service-ink outline-none transition-colors placeholder:text-service-muted/70 focus:border-service-accent focus:bg-white"
                  />
                  <button
                    type="submit"
                    onClick={() => setHasSubmitted(true)}
                    className="radius-button min-h-12 cursor-pointer border border-service-accent bg-service-accent px-5 type-caption font-semibold text-white transition-colors hover:border-service-ink hover:bg-service-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                  >
                    {submitLabel}
                  </button>
                </div>
              </form>

              {hasSubmitted ? (
                <div
                  className="mt-body-actions-sm radius-surface border border-service-accent/35 bg-service-accent/10 p-4"
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
          <ServiceAreaMapPlaceholder areas={areas} label={mapLabel} />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
