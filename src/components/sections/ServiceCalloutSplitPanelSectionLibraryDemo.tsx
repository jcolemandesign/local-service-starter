"use client";

import { useState, type ComponentProps } from "react";
import { Container } from "@/components/primitives";
import {
  calloutSplitPanelVariantOptions,
  type CalloutSplitPanelVariant,
} from "@/content/section-style-options";
import { ServiceCalloutSplitPanelSectionV3 } from "@/components/sections/ServiceCalloutSplitPanelSectionV3";

type ServiceCalloutSplitPanelSectionLibraryDemoProps = Omit<
  ComponentProps<typeof ServiceCalloutSplitPanelSectionV3>,
  "variant"
>;

const layoutOptions = calloutSplitPanelVariantOptions satisfies readonly {
  label: string;
  value: CalloutSplitPanelVariant;
}[];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ServiceCalloutSplitPanelSectionLibraryDemo(
  props: ServiceCalloutSplitPanelSectionLibraryDemoProps,
) {
  const [variant, setVariant] = useState<CalloutSplitPanelVariant>(
    layoutOptions[0].value,
  );

  return (
    <div>
      <div className="library-surface border-b border-service-border">
        <Container className="grid gap-2 py-5">
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

      <ServiceCalloutSplitPanelSectionV3 {...props} variant={variant} />
    </div>
  );
}
