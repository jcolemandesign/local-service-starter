"use client";

import { Card } from "@/components/primitives";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

const borderWidthOptions = [
  { label: "None", name: "border-none", value: "0px" },
  { label: "Fine", name: "border-fine", value: "0.5px" },
  { label: "Default", name: "border-default", value: "1px" },
  { label: "Heavy", name: "border-heavy", value: "2px" },
] as const;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
          className="relative z-20 w-full accent-service-accent"
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

  return (
    <div className="grid gap-5">
      <Card className="p-5 shadow-none">
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

        <label className="mt-5 grid gap-2">
          <span className="type-caption font-semibold text-service-ink">
            Border color
          </span>
          <span className="radius-button flex min-h-11 items-center gap-3 border border-service-border bg-service-surface px-3">
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

        <div className="mt-5 grid grid-cols-4 gap-2 max-md:grid-cols-2">
          {borderWidthOptions.map((option) => {
            const isActive = draft.activeBorderWidthName === option.name;

            return (
              <button
                aria-pressed={isActive}
                className={cx(
                  "radius-button min-h-10 border px-3 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
                  isActive
                    ? "border-service-accent bg-service-accent text-white"
                    : "border-service-border bg-white text-service-ink hover:border-service-accent hover:text-service-accent",
                )}
                key={option.name}
                onClick={() => {
                  updateDraft("activeBorderWidthName", option.name);
                  updateDraft("activeBorderWidthValue", option.value);
                }}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-5 shadow-none">
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

        <div className="mt-5 grid gap-5">
          <label className="grid gap-2">
            <span className="type-caption font-semibold text-service-ink">
              Shadow color
            </span>
            <span className="radius-button flex min-h-11 items-center gap-3 border border-service-border bg-service-surface px-3">
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
