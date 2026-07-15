"use client";

import { Card } from "@/components/primitives";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

type RadiusOption = readonly [name: string, value: string];

type RadiusSliderPanelProps = {
  description: string;
  eyebrow: string;
  options: readonly RadiusOption[];
  target: "button" | "surface";
  title: string;
};

function RadiusSliderPanel({
  description,
  eyebrow,
  options,
  target,
  title,
}: RadiusSliderPanelProps) {
  const { draft, updateDraft } = useStyleGuideTokens();
  const activeName =
    target === "button"
      ? draft.activeButtonRadiusName
      : draft.activeSurfaceRadiusName;
  const activeIndex = Math.max(
    0,
    options.findIndex(([name]) => name === activeName),
  );
  const activeOption = options[activeIndex] ?? options[0];

  return (
    <Card className="style-guide-control-panel p-6 shadow-none">
      <div className="fluid-type-frame">
        <p className="type-label text-service-accent">{eyebrow}</p>
        <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
          {title}
        </h3>
        <p className="type-text-sm mt-heading-body-sm text-service-muted">
          {description}
        </p>
      </div>

      <label className="mt-7 grid gap-4">
        <span className="flex items-center justify-between gap-3">
          <span className="type-caption font-semibold text-service-ink">
            Active radius
          </span>
          <span className="type-caption min-w-0 truncate text-right tabular-nums text-service-muted">
            {activeOption?.[1] ?? ""}
          </span>
        </span>
        <input
          aria-label={`${title} radius`}
          className="style-guide-control-slider w-full"
          max={options.length - 1}
          min={0}
          onChange={(event) => {
            const option = options[Number(event.target.value)];

            if (!option) return;

            if (target === "button") {
              updateDraft("activeButtonRadiusName", option[0]);
              updateDraft("activeButtonRadiusValue", option[1]);

              return;
            }

            updateDraft("activeSurfaceRadiusName", option[0]);
            updateDraft("activeSurfaceRadiusValue", option[1]);
          }}
          step={1}
          type="range"
          value={activeIndex}
        />
        <span className="type-caption text-service-muted">
          {activeOption?.[0] ?? "No radius selected"}
        </span>
      </label>
    </Card>
  );
}

export function StyleGuideRadiusControls({
  options,
}: {
  options: readonly RadiusOption[];
}) {
  return (
    <div className="grid gap-5">
      <RadiusSliderPanel
        description="Set the shared corner treatment for cards, panels, and nested surfaces."
        eyebrow="Surface corners"
        options={options}
        target="surface"
        title="Card and surface radius"
      />
      <RadiusSliderPanel
        description="Keep button corners distinct when the interface calls for a tighter action shape."
        eyebrow="Button corners"
        options={options}
        target="button"
        title="Button radius"
      />
    </div>
  );
}
