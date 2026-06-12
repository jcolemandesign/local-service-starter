"use client";

import { Card } from "@/components/primitives";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

type BodySpacingOption = {
  block: string;
  inline: string;
  label: string;
  name: string;
};

type SiteGridValueOption = {
  label: string;
  name: string;
  value: string;
};

type SectionSpacingOption = {
  label: string;
  lrg: string;
  lrgMobile: string;
  lrgTablet: string;
  med: string;
  medMobile: string;
  medTablet: string;
  name: string;
  sml: string;
  smlMobile: string;
  smlTablet: string;
  vsml: string;
  vsmlMobile: string;
  vsmlTablet: string;
};

type StyleGuideGridTokenControlProps =
  | {
      kind: "body-spacing";
      options: readonly BodySpacingOption[];
    }
  | {
      kind: "section-spacing";
      options: readonly SectionSpacingOption[];
    }
  | {
      kind: "content-spacing" | "gap";
      options: readonly SiteGridValueOption[];
    };

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function shortSpacingLabel(label: string) {
  return label.replace(/\s+(spacing|padding)$/i, "");
}

export function StyleGuideGridTokenControl(
  props: StyleGuideGridTokenControlProps,
) {
  const { draft, updateDraft } = useStyleGuideTokens();
  const activeBodySpacingOption =
    props.kind === "body-spacing"
      ? props.options.find(
          (option) =>
            option.name === draft.activeSiteGridFrameName ||
            (option.block === draft.activeSiteGridFrameBlock &&
              option.inline === draft.activeSiteGridFrameInline),
        )
      : null;
  const activeSectionSpacingOption =
    props.kind === "section-spacing"
      ? props.options.find(
          (option) =>
            option.name === draft.activeSectionSpaceName ||
            (option.vsml === draft.activeSectionSpaceVsml &&
              option.sml === draft.activeSectionSpaceSml &&
              option.med === draft.activeSectionSpaceMed &&
              option.lrg === draft.activeSectionSpaceLrg),
        )
      : null;
  const activeContentSpacingOption =
    props.kind === "content-spacing"
      ? props.options.find(
          (option) =>
            option.name === draft.activeContentFrameName ||
            option.value === draft.activeContentFrameValue,
        )
      : null;
  const controlLabel =
    props.kind === "body-spacing"
      ? "Body Padding"
      : props.kind === "section-spacing"
        ? "Section Padding"
        : props.kind === "content-spacing"
          ? "Content Padding"
          : "Grid Gutter";
  const activeName =
    props.kind === "body-spacing"
      ? activeBodySpacingOption?.name ?? draft.activeSiteGridFrameName
      : props.kind === "section-spacing"
        ? activeSectionSpacingOption?.name ?? draft.activeSectionSpaceName
        : props.kind === "content-spacing"
          ? activeContentSpacingOption?.name ?? draft.activeContentFrameName
          : draft.activeSiteGridGapName;

  return (
    <Card className="h-full p-5 shadow-none">
      <div className="flex items-center justify-between gap-3">
        <p className="type-label text-service-accent">
          {controlLabel}
        </p>
        <span className="type-caption font-semibold text-service-muted">
          {activeName}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 max-sm:grid-cols-1">
        {props.kind === "body-spacing"
          ? props.options.map((option) => {
              const isActive =
                activeBodySpacingOption?.name === option.name ||
                draft.activeSiteGridFrameName === option.name;

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
                  {shortSpacingLabel(option.label)}
                </button>
              );
            })
          : props.kind === "section-spacing"
            ? props.options.map((option) => {
                const isActive =
                  activeSectionSpacingOption?.name === option.name ||
                  draft.activeSectionSpaceName === option.name;

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
                      updateDraft("activeSectionSpaceName", option.name);
                      updateDraft("activeSectionSpaceVsml", option.vsml);
                      updateDraft("activeSectionSpaceSml", option.sml);
                      updateDraft("activeSectionSpaceMed", option.med);
                      updateDraft("activeSectionSpaceLrg", option.lrg);
                      updateDraft(
                        "activeSectionSpaceVsmlTablet",
                        option.vsmlTablet,
                      );
                      updateDraft(
                        "activeSectionSpaceSmlTablet",
                        option.smlTablet,
                      );
                      updateDraft(
                        "activeSectionSpaceMedTablet",
                        option.medTablet,
                      );
                      updateDraft(
                        "activeSectionSpaceLrgTablet",
                        option.lrgTablet,
                      );
                      updateDraft(
                        "activeSectionSpaceVsmlMobile",
                        option.vsmlMobile,
                      );
                      updateDraft(
                        "activeSectionSpaceSmlMobile",
                        option.smlMobile,
                      );
                      updateDraft(
                        "activeSectionSpaceMedMobile",
                        option.medMobile,
                      );
                      updateDraft(
                        "activeSectionSpaceLrgMobile",
                        option.lrgMobile,
                      );
                    }}
                    type="button"
                  >
                    {shortSpacingLabel(option.label)}
                  </button>
                );
              })
          : props.options.map((option) => {
              const isActive =
                props.kind === "content-spacing"
                  ? activeContentSpacingOption?.name === option.name ||
                    draft.activeContentFrameName === option.name
                  : draft.activeSiteGridGapName === option.name;

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
                    if (props.kind === "content-spacing") {
                      updateDraft("activeContentFrameName", option.name);
                      updateDraft("activeContentFrameValue", option.value);
                      return;
                    }

                    updateDraft("activeSiteGridGapName", option.name);
                    updateDraft("activeSiteGridGapValue", option.value);
                  }}
                  type="button"
                >
                  {props.kind === "content-spacing"
                    ? shortSpacingLabel(option.label)
                    : shortSpacingLabel(option.label)}
                </button>
              );
            })}
      </div>
    </Card>
  );
}
