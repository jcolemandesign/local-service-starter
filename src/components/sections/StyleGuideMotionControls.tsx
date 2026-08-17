"use client";

import { Card } from "@/components/primitives";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";
import {
  type MotionTokenControl,
  motionControlGroups,
  motionTokenInheritedValue,
  motionTokenNumber,
  motionTokenValue,
} from "@/content/motion-tokens";

/**
 * The motion half of the Style Guide.
 *
 * WHAT CHANGED, AND WHY IT MATTERS. These used to be React state on the motion
 * gallery's own wrapping div - inline custom properties that cascaded to the
 * specimens inside and stopped there. They saved nothing, reached no page, and
 * reset on reload, so "promoting" a rhythm meant hand-editing a token in
 * `globals.css`. That cost two round trips: change the easing, look at a real
 * section, see the default, conclude the control was broken.
 *
 * They now write the same Style Guide draft that colour, type, radii and
 * spacing write, and promote through the same button into the same block in
 * `globals.css`. Everything downstream - the gallery, pagebuilder, staged pages,
 * real pages, the export - reads that block through ordinary cascade.
 *
 * DERIVED FROM `motionControlGroups`, never hand-listed, for the same reason the
 * gallery is derived from the suite registry: a token added to a group appears
 * here with no edit to this file, and no control can exist for a token the
 * stylesheet does not read.
 */

function readoutFor(control: MotionTokenControl, value: string) {
  if (control.kind === "easing") {
    const preset = control.presets?.find((option) => option.value === value);

    return preset?.label ?? value;
  }

  if (control.inheritsFrom && !value) {
    return `Shared — ${motionTokenInheritedValue(control)}`;
  }

  return value;
}

function MotionControlField({ control }: { control: MotionTokenControl }) {
  const { draft, updateDraft } = useStyleGuideTokens();
  const value = draft.motionTokens[control.token] ?? control.defaultValue;

  function setToken(next: string) {
    updateDraft("motionTokens", {
      ...draft.motionTokens,
      [control.token]: next,
    });
  }

  const isInheriting = Boolean(control.inheritsFrom) && !value;
  // While inheriting there is no authored number to show the slider, so it sits
  // at whatever it would inherit. Switching the toggle off then changes nothing
  // you can see until the slider moves, which is the honest behaviour - a
  // control that jumps the moment you enable it reads as having done something
  // you did not ask for.
  const sliderValue = motionTokenNumber(
    control,
    isInheriting ? motionTokenInheritedValue(control) : value,
  );

  return (
    <label className="grid content-start gap-2">
      <span className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="type-caption font-semibold text-service-ink">
          {control.label}
        </span>
        <span className="type-caption min-w-0 truncate text-right tabular-nums text-service-muted">
          {readoutFor(control, value)}
        </span>
      </span>

      {control.kind === "easing" ? (
        <select
          className="style-guide-control-field min-h-10 w-full rounded-[var(--chrome-radius-control)] border px-2 text-xs"
          onChange={(event) => setToken(event.target.value)}
          value={value}
        >
          {control.presets?.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="style-guide-control-slider w-full"
          disabled={isInheriting}
          max={control.max}
          min={control.min}
          onChange={(event) =>
            setToken(motionTokenValue(control, Number(event.target.value)))
          }
          step={control.step}
          type="range"
          value={Number.isNaN(sliderValue) ? (control.min ?? 0) : sliderValue}
        />
      )}

      {control.inheritsFrom ? (
        <span className="flex items-center gap-2">
          <input
            checked={isInheriting}
            className="size-4"
            onChange={(event) =>
              setToken(
                event.target.checked ? "" : motionTokenInheritedValue(control),
              )
            }
            type="checkbox"
          />
          <span className="type-caption text-service-muted">
            Match shared rhythm
          </span>
        </span>
      ) : null}

      <span className="type-caption text-service-muted">{control.hint}</span>
    </label>
  );
}

export function StyleGuideMotionControls() {
  return (
    <div className="grid gap-5">
      {motionControlGroups.map((group) => (
        <Card className="style-guide-control-panel p-6 shadow-none" key={group.id}>
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">Motion</p>
            <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
              {group.label}
            </h3>
            <p className="type-text-sm mt-heading-body-sm text-service-muted">
              {group.description}
            </p>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {group.controls.map((control) => (
              <MotionControlField control={control} key={control.token} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
