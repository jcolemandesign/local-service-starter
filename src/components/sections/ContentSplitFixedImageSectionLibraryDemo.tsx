"use client";

import { useState, type ComponentProps } from "react";
import { Container } from "@/components/primitives";
import {
  ContentSplitFixedImageSectionV3,
  type ContentSplitFixedImageRatio,
  type ContentSplitFixedImageVariant,
} from "@/components/sections/ContentSplitFixedImageSectionV3";

type ContentSplitFixedImageSectionLibraryDemoProps = Omit<
  ComponentProps<typeof ContentSplitFixedImageSectionV3>,
  "ratio" | "variant"
>;

const layoutOptions = [
  {
    label: "Text 3 / Image 4",
    value: "text-3-image-4-right",
  },
  {
    label: "Text 4 / Image 3",
    value: "text-4-image-3-right",
  },
  {
    label: "Image 3 / Text 4",
    value: "image-3-left-text-4",
  },
  {
    label: "Image 4 / Text 3",
    value: "image-4-left-text-3",
  },
] as const satisfies readonly {
  label: string;
  value: ContentSplitFixedImageVariant;
}[];

const ratioOptions = [
  { label: "3:2", value: "3-2" },
  { label: "2:3", value: "2-3" },
  { label: "4:3", value: "4-3" },
  { label: "3:4", value: "3-4" },
  { label: "5:4", value: "5-4" },
  { label: "4:5", value: "4-5" },
] as const satisfies readonly {
  label: string;
  value: ContentSplitFixedImageRatio;
}[];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentSplitFixedImageSectionLibraryDemo(
  props: ContentSplitFixedImageSectionLibraryDemoProps,
) {
  const [variant, setVariant] = useState<ContentSplitFixedImageVariant>(
    layoutOptions[0].value,
  );
  const [ratio, setRatio] = useState<ContentSplitFixedImageRatio>(
    ratioOptions[0].value,
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

          <fieldset className="grid gap-2">
            <legend className="text-[0.6875rem] font-semibold uppercase tracking-widest text-service-muted">
              Image Ratio
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {ratioOptions.map((option) => {
                const isActive = ratio === option.value;

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
                    onClick={() => setRatio(option.value)}
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

      <ContentSplitFixedImageSectionV3
        {...props}
        ratio={ratio}
        variant={variant}
      />
    </div>
  );
}
