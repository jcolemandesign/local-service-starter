"use client";

import { useState, type ComponentProps } from "react";
import { Container } from "@/components/primitives";
import {
  FeaturedOfferSectionV3,
  type FeaturedOfferAlign,
} from "@/components/sections/FeaturedOfferSectionV3";

type FeaturedOfferSectionLibraryDemoProps = Omit<
  ComponentProps<typeof FeaturedOfferSectionV3>,
  "align"
>;

const alignmentOptions = [
  { label: "Image left", value: "left" },
  { label: "Image right", value: "right" },
] as const satisfies readonly {
  label: string;
  value: FeaturedOfferAlign;
}[];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function FeaturedOfferSectionLibraryDemo(
  props: FeaturedOfferSectionLibraryDemoProps,
) {
  const [align, setAlign] = useState<FeaturedOfferAlign>("left");

  return (
    <div>
      <div className="library-surface border-b border-service-border">
        <Container className="grid gap-2 py-5">
          <fieldset className="grid gap-2">
            <legend className="type-caption font-semibold uppercase tracking-widest text-service-muted">
              Alignment
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {alignmentOptions.map((option) => {
                const isActive = align === option.value;

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
                    onClick={() => setAlign(option.value)}
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

      <FeaturedOfferSectionV3 {...props} align={align} />
    </div>
  );
}
