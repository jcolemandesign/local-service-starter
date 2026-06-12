"use client";

import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

const normalColors = {
  accent: "#c45a2c",
  bgDark: "#10141b",
  bgPage: "#fbfaf6",
  serviceAccent: "#1f7a5a",
  serviceBorder: "#dfe7e1",
  serviceInk: "#17211d",
  serviceMuted: "#5f6f68",
  serviceSurface: "#f4f7f3",
} as const;

const inverseColors = {
  accent: "#f09a68",
  bgDark: "#fbfaf6",
  bgPage: "#10141b",
  serviceAccent: "#68c39f",
  serviceBorder: "#314039",
  serviceInk: "#fbfaf6",
  serviceMuted: "#b6c5bd",
  serviceSurface: "#17211d",
} as const;

type ColorPreset = Record<keyof typeof normalColors, string>;

function applyColors(
  updateDraft: ReturnType<typeof useStyleGuideTokens>["updateDraft"],
  colors: ColorPreset,
) {
  Object.entries(colors).forEach(([key, value]) => {
    updateDraft(key as keyof typeof colors, value);
  });
}

export function StyleGuideColorResetButton() {
  const { updateDraft } = useStyleGuideTokens();

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <button
        className="min-h-11 rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
        onClick={() => applyColors(updateDraft, normalColors)}
        type="button"
      >
        Default Light
      </button>
      <button
        className="min-h-11 rounded-md border border-service-ink bg-service-ink px-4 text-sm font-semibold text-white transition-colors hover:border-service-accent hover:bg-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
        onClick={() => applyColors(updateDraft, inverseColors)}
        type="button"
      >
        Alt Inverse
      </button>
    </div>
  );
}
