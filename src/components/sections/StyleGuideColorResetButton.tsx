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

export function StyleGuideColorResetButton() {
  const { updateDraft } = useStyleGuideTokens();

  return (
    <button
      className="min-h-11 rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
      onClick={() => {
        Object.entries(normalColors).forEach(([key, value]) => {
          updateDraft(key as keyof typeof normalColors, value);
        });
      }}
      type="button"
    >
      Reset Colors To Normal
    </button>
  );
}
