"use client";

import { useState, type ComponentProps } from "react";
import { Container } from "@/components/primitives";
import {
  cardLinkGridAlignOptions,
  type CardLinkGridAlign,
} from "@/content/section-style-options";
import { ThreeCardLinkGridSectionV3 } from "@/components/sections/ThreeCardLinkGridSectionV3";

type ThreeCardLinkGridSectionLibraryDemoProps = Omit<
  ComponentProps<typeof ThreeCardLinkGridSectionV3>,
  "align"
>;

const alignOptions = cardLinkGridAlignOptions satisfies readonly {
  label: string;
  value: CardLinkGridAlign;
}[];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ThreeCardLinkGridSectionLibraryDemo(
  props: ThreeCardLinkGridSectionLibraryDemoProps,
) {
  const [align, setAlign] = useState<CardLinkGridAlign>("center");

  return (
    <div>
      <div className="library-surface border-b border-service-border">
        <Container className="grid gap-2 py-5">
          <fieldset className="grid gap-2">
            <legend className="text-[0.6875rem] font-semibold uppercase tracking-widest text-service-muted">
              Row Alignment
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {alignOptions.map((option) => {
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

      <ThreeCardLinkGridSectionV3 {...props} align={align} />
    </div>
  );
}
