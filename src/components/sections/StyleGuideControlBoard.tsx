"use client";

import {
  Card,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { StyleGuideColorResetButton } from "@/components/sections/StyleGuideColorResetButton";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

type CompactChoiceOption = {
  label?: string;
  name: string;
  value?: string;
};

type SiteGridFrameOption = CompactChoiceOption & {
  block: string;
  inline: string;
};

type SectionPaddingOption = CompactChoiceOption & {
  lrg: string;
  lrgMobile: string;
  lrgTablet: string;
  med: string;
  medMobile: string;
  medTablet: string;
  sml: string;
  smlMobile: string;
  smlTablet: string;
  vsml: string;
  vsmlMobile: string;
  vsmlTablet: string;
};

type ContentFrameOption = CompactChoiceOption & {
  value: string;
};

type GapControlKind = "card" | "inline" | "layout";

type GapTokenGroup = {
  group: string;
  items: readonly (readonly string[])[];
  kind: GapControlKind;
};

type ColorControlKey =
  | "accent"
  | "bgDark"
  | "bgPage"
  | "serviceAccent"
  | "serviceBorder"
  | "serviceInk"
  | "serviceMuted"
  | "serviceSurface";

type ControlBoardColor = {
  controlKey?: ColorControlKey;
  name: string;
  value: string;
};

type StyleGuideControlBoardProps = {
  colors: readonly ControlBoardColor[];
  contentFrameOptions: readonly ContentFrameOption[];
  gapTokens: readonly GapTokenGroup[];
  radii: readonly string[][];
  sectionMinTokens: readonly ContentFrameOption[];
  sectionPaddingOptions: readonly SectionPaddingOption[];
  siteGridFrameOptions: readonly SiteGridFrameOption[];
  siteGridGapOptions: readonly ContentFrameOption[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function compactOptionLabel(option: CompactChoiceOption) {
  const label = option.label ?? option.name.split("-").at(-1) ?? option.name;
  const compactLabel = label
    .replace(" padding", "")
    .replace(" spacing", "")
    .replace(" gutter", "");

  return compactLabel.charAt(0).toUpperCase() + compactLabel.slice(1);
}

function CompactChoiceGroup<T extends CompactChoiceOption>({
  activeName,
  label,
  onSelect,
  options,
}: {
  activeName: string;
  label: string;
  onSelect: (option: T) => void;
  options: readonly T[];
}) {
  return (
    <div className="grid gap-2">
      <p className="type-caption font-semibold text-service-muted">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isActive = activeName === option.name;

          return (
            <button
              aria-pressed={isActive}
              className={cx(
                "radius-4 min-h-9 border px-2 text-xs font-semibold transition-colors",
                isActive
                  ? "border-service-accent bg-service-accent text-white"
                  : "border-service-muted/60 bg-service-surface text-service-ink hover:border-service-accent hover:bg-white hover:text-service-accent",
              )}
              key={option.name}
              onClick={() => onSelect(option)}
              type="button"
            >
              {compactOptionLabel(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompactRange({
  centerMark,
  label,
  max,
  min,
  onChange,
  step,
  value,
  valueLabel,
}: {
  centerMark?: boolean;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
  valueLabel: string;
}) {
  return (
    <label className="grid gap-1">
      <span className="flex items-center justify-between gap-3">
        <span className="type-caption font-semibold text-service-ink">
          {label}
        </span>
        <span className="type-caption text-service-muted">{valueLabel}</span>
      </span>
      <span className="relative grid pt-2">
        {centerMark ? (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-2 border-l border-service-muted/70"
          />
        ) : null}
        <input
          className="accent-service-accent"
          max={max}
          min={min}
          onChange={(event) => onChange(Number(event.target.value))}
          step={step}
          type="range"
          value={value}
        />
      </span>
    </label>
  );
}

function CompactTokenSlider<T extends CompactChoiceOption>({
  activeName,
  label,
  onSelect,
  options,
}: {
  activeName: string;
  label: string;
  onSelect: (option: T) => void;
  options: readonly T[];
}) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.name === activeName),
  );
  const activeOption = options[activeIndex] ?? options[0];

  if (!activeOption) {
    return null;
  }

  return (
    <label className="grid gap-1">
      <span className="flex items-center justify-between gap-3">
        <span className="type-caption font-semibold text-service-ink">
          {label}
        </span>
        <span className="type-caption min-w-0 truncate text-service-muted">
          {compactOptionLabel(activeOption)}
        </span>
      </span>
      <input
        className="accent-service-accent"
        max={options.length - 1}
        min={0}
        onChange={(event) => {
          const option = options[Number(event.target.value)];

          if (option) {
            onSelect(option);
          }
        }}
        step={1}
        type="range"
        value={activeIndex}
      />
    </label>
  );
}

export function StyleGuideControlBoard({
  colors,
  contentFrameOptions,
  gapTokens,
  radii,
  sectionMinTokens,
  sectionPaddingOptions,
  siteGridFrameOptions,
  siteGridGapOptions,
}: StyleGuideControlBoardProps) {
  const { draft, updateDraft } = useStyleGuideTokens();

  function colorValue(controlKey: ColorControlKey | undefined, fallback: string) {
    if (controlKey === "serviceInk") return draft.serviceInk;
    if (controlKey === "serviceMuted") return draft.serviceMuted;
    if (controlKey === "serviceAccent") return draft.serviceAccent;
    if (controlKey === "serviceBorder") return draft.serviceBorder;
    if (controlKey === "serviceSurface") return draft.serviceSurface;
    if (controlKey === "bgPage") return draft.bgPage;
    if (controlKey === "bgDark") return draft.bgDark;
    if (controlKey === "accent") return draft.accent;

    return fallback;
  }

  function updateColorToken(
    controlKey: ColorControlKey | undefined,
    value: string,
  ) {
    if (controlKey === "serviceInk") updateDraft("serviceInk", value);
    if (controlKey === "serviceMuted") updateDraft("serviceMuted", value);
    if (controlKey === "serviceAccent") updateDraft("serviceAccent", value);
    if (controlKey === "serviceBorder") updateDraft("serviceBorder", value);
    if (controlKey === "serviceSurface") updateDraft("serviceSurface", value);
    if (controlKey === "bgPage") updateDraft("bgPage", value);
    if (controlKey === "bgDark") updateDraft("bgDark", value);
    if (controlKey === "accent") updateDraft("accent", value);
  }

  const compactRadii = radii.map(([name = "", value = "0"]) => ({
    label: name
      .replace("radius-", "")
      .replace(" / radius-", " / ")
      .replace("radius-", ""),
    name,
    value,
  }));
  const borderWidthOptions = [
    { label: "None", name: "border-none", value: "0px" },
    { label: "Fine", name: "border-fine", value: "1px" },
    { label: "Default", name: "border-default", value: "2px" },
    { label: "Bold", name: "border-bold", value: "3px" },
  ];
  const inlineGapOptions =
    gapTokens
      .find((group) => group.kind === "inline")
      ?.items.map(([name = "", value = "1rem"]) => ({
        label: name.replace("inline-gap-", ""),
        name,
        value,
      })) ?? [];
  const cardGapOptions =
    gapTokens
      .find((group) => group.kind === "card")
      ?.items.map(([name = "", value = "1rem"]) => ({
        label: name.replace("card-grid-gap-", ""),
        name,
        value,
      })) ?? [];
  const layoutGapOptions =
    gapTokens
      .find((group) => group.kind === "layout")
      ?.items.map(([name = "", value = "1rem"]) => ({
        label: name.replace("layout-gap-", ""),
        name,
        value,
      })) ?? [];

  return (
    <section className="border-b border-service-border bg-service-border/35">
      <SevenColumnGrid className="section-min-none items-start" padding="sml">
        <SevenColumnGridItem className="col-span-7 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">Control board</p>
            <h2 className="type-heading-lg mt-eyebrow-heading-lg text-service-ink">
              Live token controls
            </h2>
            <p className="type-text-sm wrap-pretty mt-heading-body-md text-service-muted">
              Compact access to the page controls before the detailed sections.
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-7 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <div className="columns-3 [column-gap:var(--layout-gap-active)] max-lg:columns-2 max-md:columns-1">
            <Card className="mb-[var(--layout-gap-active)] grid break-inside-avoid gap-5 bg-service-surface p-5 shadow-none">
              <div className="fluid-type-frame">
                <p className="type-label text-service-accent">Layout</p>
                <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                  Frame and spacing
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <CompactChoiceGroup
                  activeName={draft.activeSiteGridFrameName}
                  label="Body"
                  options={siteGridFrameOptions}
                  onSelect={(option) => {
                    updateDraft("activeSiteGridFrameName", option.name);
                    updateDraft("activeSiteGridFrameBlock", option.block);
                    updateDraft("activeSiteGridFrameInline", option.inline);
                  }}
                />
                <CompactChoiceGroup
                  activeName={draft.activeSectionSpaceName}
                  label="Section"
                  options={sectionPaddingOptions}
                  onSelect={(option) => {
                    updateDraft("activeSectionSpaceName", option.name);
                    updateDraft("activeSectionSpaceVsml", option.vsml);
                    updateDraft("activeSectionSpaceVsmlMobile", option.vsmlMobile);
                    updateDraft("activeSectionSpaceVsmlTablet", option.vsmlTablet);
                    updateDraft("activeSectionSpaceSml", option.sml);
                    updateDraft("activeSectionSpaceSmlMobile", option.smlMobile);
                    updateDraft("activeSectionSpaceSmlTablet", option.smlTablet);
                    updateDraft("activeSectionSpaceMed", option.med);
                    updateDraft("activeSectionSpaceMedMobile", option.medMobile);
                    updateDraft("activeSectionSpaceMedTablet", option.medTablet);
                    updateDraft("activeSectionSpaceLrg", option.lrg);
                    updateDraft("activeSectionSpaceLrgMobile", option.lrgMobile);
                    updateDraft("activeSectionSpaceLrgTablet", option.lrgTablet);
                  }}
                />
                <CompactChoiceGroup
                  activeName={draft.activeContentFrameName}
                  label="Content"
                  options={contentFrameOptions}
                  onSelect={(option) => {
                    updateDraft("activeContentFrameName", option.name);
                    updateDraft("activeContentFrameValue", option.value);
                  }}
                />
                <CompactChoiceGroup
                  activeName={draft.activeSiteGridGapName}
                  label="Gutter"
                  options={siteGridGapOptions}
                  onSelect={(option) => {
                    updateDraft("activeSiteGridGapName", option.name);
                    updateDraft("activeSiteGridGapValue", option.value);
                  }}
                />
              </div>
            </Card>

            <Card className="mb-[var(--layout-gap-active)] grid break-inside-avoid gap-5 bg-service-surface p-5 shadow-none">
              <div className="fluid-type-frame">
                <p className="type-label text-service-accent">Rhythm</p>
                <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                  Height and relationships
                </h3>
              </div>

              <CompactTokenSlider
                activeName={draft.activeSectionMinName}
                label="Section min"
                options={sectionMinTokens}
                onSelect={(token) => {
                  updateDraft("activeSectionMinName", token.name);
                  updateDraft("activeSectionMinValue", token.value);
                }}
              />

              <CompactRange
                label="Semantic rhythm"
                max={1.5}
                min={0.5}
                onChange={(value) =>
                  updateDraft("activeSemanticSpacingScale", value)
                }
                step={0.05}
                value={draft.activeSemanticSpacingScale}
                valueLabel={`${draft.activeSemanticSpacingScale.toFixed(2)}x`}
              />
            </Card>

            <Card className="mb-[var(--layout-gap-active)] grid break-inside-avoid gap-5 bg-service-surface p-5 shadow-none">
              <div className="fluid-type-frame">
                <p className="type-label text-service-accent">Border</p>
                <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                  Line color and weight
                </h3>
              </div>

              <CompactTokenSlider
                activeName={draft.activeBorderWidthName}
                label="Weight"
                options={borderWidthOptions}
                onSelect={(option) => {
                  updateDraft("activeBorderWidthName", option.name);
                  updateDraft("activeBorderWidthValue", option.value);
                }}
              />

              <label className="grid gap-2">
                <span className="type-caption font-semibold text-service-muted">
                  Border color
                </span>
                <span className="radius-4 flex min-h-11 items-center gap-3 border border-service-muted/60 bg-service-surface px-3">
                  <input
                    aria-label="Border color"
                    className="size-7 cursor-pointer border-0 bg-transparent p-0"
                    onChange={(event) =>
                      updateDraft("serviceBorder", event.target.value)
                    }
                    type="color"
                    value={draft.serviceBorder}
                  />
                  <code className="type-caption min-w-0 truncate font-semibold text-service-muted">
                    {draft.serviceBorder}
                  </code>
                </span>
              </label>
            </Card>

            <Card className="mb-[var(--layout-gap-active)] grid break-inside-avoid gap-5 bg-service-surface p-5 shadow-none">
              <div className="fluid-type-frame">
                <p className="type-label text-service-accent">Shadow</p>
                <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                  Elevation recipe
                </h3>
              </div>

              <label className="grid gap-2">
                <span className="type-caption font-semibold text-service-muted">
                  Shadow color
                </span>
                <span className="radius-4 flex min-h-11 items-center gap-3 border border-service-muted/60 bg-service-surface px-3">
                  <input
                    aria-label="Shadow color"
                    className="size-7 cursor-pointer border-0 bg-transparent p-0"
                    onChange={(event) =>
                      updateDraft("shadowColor", event.target.value)
                    }
                    type="color"
                    value={draft.shadowColor}
                  />
                  <code className="type-caption min-w-0 truncate font-semibold text-service-muted">
                    {draft.shadowColor}
                  </code>
                </span>
              </label>

              <div className="grid gap-3">
                <CompactRange
                  centerMark
                  label="X"
                  max={40}
                  min={-40}
                  onChange={(value) => updateDraft("shadowX", value)}
                  step={1}
                  value={draft.shadowX}
                  valueLabel={`${draft.shadowX}px`}
                />
                <CompactRange
                  centerMark
                  label="Y"
                  max={40}
                  min={-40}
                  onChange={(value) => updateDraft("shadowY", value)}
                  step={1}
                  value={draft.shadowY}
                  valueLabel={`${draft.shadowY}px`}
                />
                <CompactRange
                  label="Blur"
                  max={80}
                  min={0}
                  onChange={(value) => updateDraft("shadowBlur", value)}
                  step={1}
                  value={draft.shadowBlur}
                  valueLabel={`${draft.shadowBlur}px`}
                />
                <CompactRange
                  label="Transparency"
                  max={0.24}
                  min={0}
                  onChange={(value) => updateDraft("shadowAlpha", value)}
                  step={0.01}
                  value={draft.shadowAlpha}
                  valueLabel={draft.shadowAlpha.toFixed(2)}
                />
              </div>
            </Card>

            <Card className="mb-[var(--layout-gap-active)] grid break-inside-avoid gap-5 bg-service-surface p-5 shadow-none">
              <div className="fluid-type-frame">
                <p className="type-label text-service-accent">Radii</p>
                <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                  Cards, surfaces, buttons
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                <CompactTokenSlider
                  activeName={draft.activeSurfaceRadiusName}
                  label="Cards / surfaces"
                  options={compactRadii}
                  onSelect={(option) => {
                    updateDraft("activeSurfaceRadiusName", option.name);
                    updateDraft("activeSurfaceRadiusValue", option.value);
                  }}
                />
                <CompactTokenSlider
                  activeName={draft.activeButtonRadiusName}
                  label="Buttons"
                  options={compactRadii}
                  onSelect={(option) => {
                    updateDraft("activeButtonRadiusName", option.name);
                    updateDraft("activeButtonRadiusValue", option.value);
                  }}
                />
              </div>
            </Card>

            <Card className="mb-[var(--layout-gap-active)] grid break-inside-avoid gap-5 bg-service-surface p-5 shadow-none">
              <div className="fluid-type-frame">
                <p className="type-label text-service-accent">Color</p>
                <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                  Palette chips
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <StyleGuideColorResetButton />
              </div>

              <div className="radius-4 grid gap-3 border border-accent/35 bg-accent/15 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="type-caption font-semibold text-accent">
                    Accent sample
                  </span>
                  <span className="size-7 rounded-full bg-accent" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="radius-button inline-flex min-h-9 items-center bg-accent px-3 type-caption font-semibold text-white">
                    Filled accent
                  </span>
                  <span className="radius-button inline-flex min-h-9 items-center border border-accent bg-white px-3 type-caption font-semibold text-accent">
                    Text accent
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {colors.map((color) => {
                  const value = colorValue(color.controlKey, color.value);

                  return (
                    <label
                      className="radius-4 flex min-h-12 items-center gap-2 border border-service-border bg-service-surface px-2"
                      key={color.name}
                    >
                      <input
                        aria-label={`${color.name} color`}
                        className="size-7 cursor-pointer border-0 bg-transparent p-0"
                        disabled={!color.controlKey}
                        onChange={(event) =>
                          updateColorToken(color.controlKey, event.target.value)
                        }
                        type="color"
                        value={value}
                      />
                      <span className="min-w-0">
                        <span className="type-caption block truncate font-semibold text-service-ink">
                          {color.name}
                        </span>
                        <span className="type-caption block truncate text-service-muted">
                          {value}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card>

            <Card className="mb-[var(--layout-gap-active)] grid break-inside-avoid gap-5 bg-service-surface p-5 shadow-none">
              <div className="fluid-type-frame">
                <p className="type-label text-service-accent">Secondary gaps</p>
                <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                  Inline, card list, nested layout
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
                <CompactChoiceGroup
                  activeName={draft.activeInlineGapName}
                  label="Inline"
                  options={inlineGapOptions}
                  onSelect={(option) => {
                    updateDraft("activeInlineGapName", option.name);
                    updateDraft("activeInlineGapValue", option.value);
                  }}
                />
                <CompactChoiceGroup
                  activeName={draft.activeCardGapName}
                  label="Card/list"
                  options={cardGapOptions}
                  onSelect={(option) => {
                    updateDraft("activeCardGapName", option.name);
                    updateDraft("activeCardGapValue", option.value);
                  }}
                />
                <CompactChoiceGroup
                  activeName={draft.activeLayoutGapName}
                  label="Nested layout"
                  options={layoutGapOptions}
                  onSelect={(option) => {
                    updateDraft("activeLayoutGapName", option.name);
                    updateDraft("activeLayoutGapValue", option.value);
                  }}
                />
              </div>
            </Card>

          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
