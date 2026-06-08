"use client";

import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

type StyleGuideGapKind = "card" | "inline" | "layout";

type StyleGuideGapCardProps = {
  kind: StyleGuideGapKind;
  name: string;
  value: string;
};

const gapDraftKeys = {
  card: {
    name: "activeCardGapName",
    value: "activeCardGapValue",
  },
  inline: {
    name: "activeInlineGapName",
    value: "activeInlineGapValue",
  },
  layout: {
    name: "activeLayoutGapName",
    value: "activeLayoutGapValue",
  },
} as const;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function StyleGuideGapCard({ kind, name, value }: StyleGuideGapCardProps) {
  const { draft, updateDraft } = useStyleGuideTokens();
  const keys = gapDraftKeys[kind];
  const isActive = draft[keys.name] === name;

  return (
    <button
      aria-pressed={isActive}
      className={cx(
        "radius-4 flex min-h-12 w-full items-center justify-between gap-3 border px-3 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
        isActive
          ? "border-service-accent bg-service-accent text-white"
          : "border-service-border bg-white text-service-ink hover:border-service-accent",
      )}
      onClick={() => {
        updateDraft(keys.name, name);
        updateDraft(keys.value, value);
      }}
      type="button"
    >
      <span className="type-caption font-semibold">{name}</span>
      <span className={cx("type-caption", isActive ? "text-white/76" : "text-service-muted")}>
        {value}
      </span>
    </button>
  );
}
