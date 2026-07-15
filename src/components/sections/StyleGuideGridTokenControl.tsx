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
      kind: "card-gap" | "content-spacing" | "gap" | "inline-gap" | "layout-gap";
      options: readonly SiteGridValueOption[];
    };

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
          : props.kind === "gap"
            ? "Grid Gutter"
            : props.kind === "card-gap"
              ? "Card Gap"
              : props.kind === "inline-gap"
                ? "Inline Gap"
                : "Nested Layout Gap";
  const activeName =
    props.kind === "body-spacing"
      ? activeBodySpacingOption?.name ?? draft.activeSiteGridFrameName
      : props.kind === "section-spacing"
        ? activeSectionSpacingOption?.name ?? draft.activeSectionSpaceName
        : props.kind === "content-spacing"
          ? activeContentSpacingOption?.name ?? draft.activeContentFrameName
          : props.kind === "gap"
            ? draft.activeSiteGridGapName
            : props.kind === "card-gap"
              ? draft.activeCardGapName
              : props.kind === "inline-gap"
                ? draft.activeInlineGapName
                : draft.activeLayoutGapName;
  const activeIndex = Math.max(
    0,
    props.options.findIndex((option) => option.name === activeName),
  );
  const activeOption = props.options[activeIndex] ?? props.options[0];

  function applyOption(index: number) {
    if (props.kind === "body-spacing") {
      const option = props.options[index];

      if (!option) return;

      updateDraft("activeSiteGridFrameName", option.name);
      updateDraft("activeSiteGridFrameBlock", option.block);
      updateDraft("activeSiteGridFrameInline", option.inline);
      return;
    }

    if (props.kind === "section-spacing") {
      const option = props.options[index];

      if (!option) return;

      updateDraft("activeSectionSpaceName", option.name);
      updateDraft("activeSectionSpaceVsml", option.vsml);
      updateDraft("activeSectionSpaceSml", option.sml);
      updateDraft("activeSectionSpaceMed", option.med);
      updateDraft("activeSectionSpaceLrg", option.lrg);
      updateDraft("activeSectionSpaceVsmlTablet", option.vsmlTablet);
      updateDraft("activeSectionSpaceSmlTablet", option.smlTablet);
      updateDraft("activeSectionSpaceMedTablet", option.medTablet);
      updateDraft("activeSectionSpaceLrgTablet", option.lrgTablet);
      updateDraft("activeSectionSpaceVsmlMobile", option.vsmlMobile);
      updateDraft("activeSectionSpaceSmlMobile", option.smlMobile);
      updateDraft("activeSectionSpaceMedMobile", option.medMobile);
      updateDraft("activeSectionSpaceLrgMobile", option.lrgMobile);
      return;
    }

    const option = props.options[index];

    if (!option) return;

    if (props.kind === "content-spacing") {
      updateDraft("activeContentFrameName", option.name);
      updateDraft("activeContentFrameValue", option.value);
      return;
    }

    if (props.kind === "gap") {
      updateDraft("activeSiteGridGapName", option.name);
      updateDraft("activeSiteGridGapValue", option.value);
      return;
    }

    if (props.kind === "card-gap") {
      updateDraft("activeCardGapName", option.name);
      updateDraft("activeCardGapValue", option.value);
      return;
    }

    if (props.kind === "inline-gap") {
      updateDraft("activeInlineGapName", option.name);
      updateDraft("activeInlineGapValue", option.value);
      return;
    }

    updateDraft("activeLayoutGapName", option.name);
    updateDraft("activeLayoutGapValue", option.value);
  }

  return (
    <Card className="style-guide-control-panel h-full p-6 shadow-none">
      <div className="flex items-center justify-between gap-4">
        <p className="type-label text-service-accent">
          {controlLabel}
        </p>
        <span className="type-caption font-semibold text-service-muted">
          {activeOption ? shortSpacingLabel(activeOption.label) : activeName}
        </span>
      </div>

      <input
        className="style-guide-control-slider mt-6 w-full"
        max={props.options.length - 1}
        min={0}
        onChange={(event) => applyOption(Number(event.target.value))}
        step={1}
        type="range"
        value={activeIndex}
      />
    </Card>
  );
}
