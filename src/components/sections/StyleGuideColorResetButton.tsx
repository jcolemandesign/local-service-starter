"use client";

import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

const normalColors = {
  accent: "#c45a2c",
  bgDark: "#10141b",
  bgPage: "#fbfaf6",
  serviceBorder: "#dfe7e1",
  serviceInk: "#17211d",
  serviceMuted: "#5f6f68",
  surfaceRaised: "#fafcf9",
  serviceSurface: "#f4f7f3",
} as const;

const inverseColors = {
  accent: "#f09a68",
  bgDark: "#fbfaf6",
  bgPage: "#10141b",
  serviceBorder: "#314039",
  serviceInk: "#fbfaf6",
  serviceMuted: "#b6c5bd",
  surfaceRaised: "#26312c",
  serviceSurface: "#17211d",
} as const;

export function StyleGuideColorResetButton() {
  const { updateDrafts } = useStyleGuideTokens();

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <button
        className="min-h-11 rounded-md border border-service-border bg-bg-surface px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
        onClick={() => updateDrafts(normalColors)}
        type="button"
      >
        Default Light
      </button>
      <button
        className="min-h-11 rounded-md border border-service-ink bg-service-ink px-4 text-sm font-semibold text-service-surface transition-colors hover:border-service-accent hover:bg-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
        onClick={() => updateDrafts(inverseColors)}
        type="button"
      >
        Alt Inverse
      </button>
    </div>
  );
}
