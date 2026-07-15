"use client";

import { Card } from "@/components/primitives";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

const borderWidthOptions = [
  { label: "None", name: "border-none", value: "0px" },
  { label: "Fine", name: "border-fine", value: "1px" },
  { label: "Default", name: "border-default", value: "2px" },
  { label: "Bold", name: "border-bold", value: "3px" },
] as const;

function SliderControl({
  label,
  max,
  min,
  onChange,
  step,
  value,
  valueLabel,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
  valueLabel: string;
}) {
  const zeroPosition =
    min < 0 && max > 0 ? ((0 - min) / (max - min)) * 100 : null;

  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between gap-3">
        <span className="type-caption font-semibold text-service-ink">
          {label}
        </span>
        <span className="type-caption font-semibold tabular-nums text-service-muted">
          {valueLabel}
        </span>
      </span>
      <span className="relative grid py-1">
        {zeroPosition !== null ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 z-10 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-service-muted/55"
            style={{ left: `${zeroPosition}%` }}
          />
        ) : null}
        <input
          className="style-guide-control-slider relative z-20 w-full"
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

export function StyleGuideSurfaceControls() {
  const { draft, updateDraft } = useStyleGuideTokens();
  const activeBorderIndex = Math.max(
    0,
    borderWidthOptions.findIndex(
      (option) => option.name === draft.activeBorderWidthName,
    ),
  );
  const activeBorderOption =
    borderWidthOptions[activeBorderIndex] ?? borderWidthOptions[0];

  return (
    <div className="grid gap-5">
      <Card className="style-guide-control-panel p-6 shadow-none">
        <div className="fluid-type-frame">
          <p className="type-label text-service-accent">Border controls</p>
          <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
            Line color and weight
          </h3>
          <p className="type-text-sm mt-heading-body-sm text-service-muted">
            Tune the shared service border color and the active border width
            used by these surface previews.
          </p>
        </div>

        <label className="mt-7 grid gap-3">
          <span className="type-caption font-semibold text-service-ink">
            Border color
          </span>
          <span className="style-guide-control-field radius-button flex min-h-11 items-center gap-3 border px-3">
            <input
              aria-label="Border color"
              className="size-7 cursor-pointer border-0 bg-transparent p-0"
              onChange={(event) =>
                updateDraft("serviceBorder", event.target.value)
              }
              type="color"
              value={draft.serviceBorder}
            />
            <code className="type-caption font-semibold text-service-muted">
              {draft.serviceBorder}
            </code>
          </span>
        </label>

        <label className="mt-7 grid gap-4">
          <span className="flex items-center justify-between gap-3">
            <span className="type-caption font-semibold text-service-ink">
              Border weight
            </span>
            <span className="type-caption min-w-0 truncate text-service-muted">
              {activeBorderOption?.label ?? draft.activeBorderWidthName}
            </span>
          </span>
          <input
            className="style-guide-control-slider w-full"
            max={borderWidthOptions.length - 1}
            min={0}
            onChange={(event) => {
              const option = borderWidthOptions[Number(event.target.value)];

              if (!option) return;

              updateDraft("activeBorderWidthName", option.name);
              updateDraft("activeBorderWidthValue", option.value);
            }}
            step={1}
            type="range"
            value={activeBorderIndex}
          />
        </label>
      </Card>

      <Card className="style-guide-control-panel p-6 shadow-none">
        <div className="fluid-type-frame">
          <p className="type-label text-service-accent">Shadow controls</p>
          <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
            Elevation recipe
          </h3>
          <p className="type-text-sm mt-heading-body-sm text-service-muted">
            Adjust the shared service shadow color, x offset, y offset, blur,
            and opacity.
          </p>
        </div>

        <div className="mt-7 grid gap-7">
          <label className="grid gap-2">
            <span className="type-caption font-semibold text-service-ink">
              Shadow color
            </span>
            <span className="style-guide-control-field radius-button flex min-h-11 items-center gap-3 border px-3">
              <input
                aria-label="Shadow color"
                className="size-7 cursor-pointer border-0 bg-transparent p-0"
                onChange={(event) =>
                  updateDraft("shadowColor", event.target.value)
                }
                type="color"
                value={draft.shadowColor}
              />
              <code className="type-caption font-semibold text-service-muted">
                {draft.shadowColor}
              </code>
            </span>
          </label>
          <SliderControl
            label="X offset"
            max={40}
            min={-40}
            onChange={(value) => updateDraft("shadowX", value)}
            step={1}
            value={draft.shadowX}
            valueLabel={`${draft.shadowX}px`}
          />
          <SliderControl
            label="Y offset"
            max={40}
            min={-40}
            onChange={(value) => updateDraft("shadowY", value)}
            step={1}
            value={draft.shadowY}
            valueLabel={`${draft.shadowY}px`}
          />
          <SliderControl
            label="Blur"
            max={90}
            min={0}
            onChange={(value) => updateDraft("shadowBlur", value)}
            step={1}
            value={draft.shadowBlur}
            valueLabel={`${draft.shadowBlur}px`}
          />
          <SliderControl
            label="Opacity"
            max={0.24}
            min={0}
            onChange={(value) => updateDraft("shadowAlpha", value)}
            step={0.01}
            value={draft.shadowAlpha}
            valueLabel={draft.shadowAlpha.toFixed(2)}
          />
        </div>
      </Card>
    </div>
  );
}
