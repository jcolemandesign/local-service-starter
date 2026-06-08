"use client";

import { Card } from "@/components/primitives";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

type SiteGridFrameOption = {
  block: string;
  inline: string;
  label: string;
  name: string;
};

type SiteGridGapOption = {
  label: string;
  name: string;
  value: string;
};

type StyleGuideGridTokenControlProps =
  | {
      kind: "frame";
      options: readonly SiteGridFrameOption[];
    }
  | {
      kind: "gap";
      options: readonly SiteGridGapOption[];
    };

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function StyleGuideGridTokenControl(
  props: StyleGuideGridTokenControlProps,
) {
  const { draft, updateDraft } = useStyleGuideTokens();

  return (
    <Card className="h-full p-5 shadow-none">
      <div className="flex items-center justify-between gap-3">
        <p className="type-label text-service-accent">
          {props.kind === "frame" ? "site-grid-frame" : "site-grid-gap"}
        </p>
        <span className="type-caption font-semibold text-service-muted">
          {props.kind === "frame"
            ? draft.activeSiteGridFrameName
            : draft.activeSiteGridGapName}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {props.kind === "frame"
          ? props.options.map((option) => {
              const isActive = draft.activeSiteGridFrameName === option.name;

              return (
                <button
                  aria-pressed={isActive}
                  className={cx(
                    "type-caption radius-4 border px-3 py-2 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
                    isActive
                      ? "border-service-accent bg-service-accent text-white"
                      : "border-service-border bg-white text-service-ink hover:border-service-accent",
                  )}
                  key={option.name}
                  onClick={() => {
                    updateDraft("activeSiteGridFrameName", option.name);
                    updateDraft("activeSiteGridFrameBlock", option.block);
                    updateDraft("activeSiteGridFrameInline", option.inline);
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })
          : props.options.map((option) => {
              const isActive = draft.activeSiteGridGapName === option.name;

              return (
                <button
                  aria-pressed={isActive}
                  className={cx(
                    "type-caption radius-4 border px-3 py-2 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
                    isActive
                      ? "border-service-accent bg-service-accent text-white"
                      : "border-service-border bg-white text-service-ink hover:border-service-accent",
                  )}
                  key={option.name}
                  onClick={() => {
                    updateDraft("activeSiteGridGapName", option.name);
                    updateDraft("activeSiteGridGapValue", option.value);
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
      </div>
    </Card>
  );
}
