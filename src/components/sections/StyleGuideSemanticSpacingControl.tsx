"use client";

import { Card } from "@/components/primitives";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

const minScale = 0.5;
const maxScale = 1.5;
const defaultScale = 1;

export function StyleGuideSemanticSpacingControl() {
  const { draft, updateDraft } = useStyleGuideTokens();

  return (
    <Card className="style-guide-control-panel p-6 shadow-none">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 max-sm:grid-cols-1">
        <div className="fluid-type-frame min-w-0">
          <p className="type-label text-service-accent">Spacing controls</p>
          <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
            Semantic rhythm
          </h3>
          <p className="type-text-sm mt-heading-body-sm text-service-muted">
            Tighten or loosen content relationships proportionally across
            eyebrow, heading, body, action, and paragraph spacing.
          </p>
        </div>
        <span className="type-caption justify-self-end rounded-sm border border-service-border bg-service-surface px-3 py-2 font-semibold tabular-nums text-service-ink max-sm:justify-self-start">
          {draft.activeSemanticSpacingScale.toFixed(2)}x
        </span>
      </div>

      <label className="mt-7 grid gap-4">
        <span className="flex items-center justify-between gap-3">
          <span className="type-caption font-semibold text-service-muted">
            Rhythm scale
          </span>
          <span className="type-caption font-semibold text-service-ink">
            {minScale}x - {maxScale}x
          </span>
        </span>
        <input
          className="style-guide-control-slider w-full"
          max={maxScale}
          min={minScale}
          onChange={(event) =>
            updateDraft("activeSemanticSpacingScale", Number(event.target.value))
          }
          step={0.05}
          type="range"
          value={draft.activeSemanticSpacingScale}
        />
      </label>

      <button
        className="style-guide-control-button mt-5 min-h-11 rounded-md border px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
        onClick={() => updateDraft("activeSemanticSpacingScale", defaultScale)}
        type="button"
      >
        Reset Rhythm
      </button>
    </Card>
  );
}
