"use client";

import { useState, type ComponentProps } from "react";

import { Container } from "@/components/primitives";
import {
  HeroServiceAreaZipLookupSectionV3,
  type HeroServiceAreaZipLookupVariant,
} from "@/components/sections/HeroServiceAreaZipLookupSectionV3";
import { fullImageSplitVariantOptions } from "@/content/section-style-options";

type HeroServiceAreaZipLookupSectionLibraryDemoProps = Omit<
  ComponentProps<typeof HeroServiceAreaZipLookupSectionV3>,
  "variant"
>;

const layoutOptions = fullImageSplitVariantOptions satisfies readonly {
  label: string;
  value: HeroServiceAreaZipLookupVariant;
}[];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function HeroServiceAreaZipLookupSectionLibraryDemo(
  props: HeroServiceAreaZipLookupSectionLibraryDemoProps,
) {
  const [variant, setVariant] = useState<HeroServiceAreaZipLookupVariant>(
    layoutOptions[0].value,
  );

  return (
    <div>
      <div className="library-surface border-b border-service-border">
        <Container className="grid gap-2 py-5">
          <fieldset className="grid gap-2">
            <legend className="type-caption font-semibold uppercase tracking-widest text-service-muted">
              Layout
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {layoutOptions.map((option) => {
                const isActive = variant === option.value;

                return (
                  <button
                    aria-pressed={isActive}
                    className={cx(
                      "min-h-7 border px-2.5 text-xs font-semibold transition-colors",
                      isActive
                        ? "border-service-accent bg-service-accent text-white"
                        : "library-surface border-service-border text-service-ink hover:border-service-accent hover:bg-bg-page hover:text-service-accent",
                    )}
                    key={option.value}
                    onClick={() => setVariant(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </Container>
      </div>

      <HeroServiceAreaZipLookupSectionV3 {...props} variant={variant} />
    </div>
  );
}
