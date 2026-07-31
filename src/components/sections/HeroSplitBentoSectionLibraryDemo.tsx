"use client";

import { useState, type ComponentProps } from "react";
import { Container } from "@/components/primitives";
import {
  HeroSplitBentoSectionV3,
  type HeroSplitBentoVariant,
} from "@/components/sections/HeroSplitBentoSectionV3";
import { splitBentoVariantOptions } from "@/content/section-style-options";

type HeroSplitBentoSectionLibraryDemoProps = Omit<
  ComponentProps<typeof HeroSplitBentoSectionV3>,
  "variant"
>;

const layoutOptions = splitBentoVariantOptions satisfies readonly {
  label: string;
  value: HeroSplitBentoVariant;
}[];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function HeroSplitBentoSectionLibraryDemo(
  props: HeroSplitBentoSectionLibraryDemoProps,
) {
  const [variant, setVariant] = useState<HeroSplitBentoVariant>(
    layoutOptions[0].value,
  );

  return (
    <div>
      <div className="library-surface border-b border-service-border">
        <Container className="grid gap-4 py-5">
          <fieldset className="grid gap-2">
            <legend className="text-[0.6875rem] font-semibold uppercase tracking-widest text-service-muted">
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

      <HeroSplitBentoSectionV3 {...props} variant={variant} />
    </div>
  );
}
