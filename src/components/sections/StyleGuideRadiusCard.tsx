"use client";

import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

type StyleGuideRadiusCardProps = {
  name: string;
  value: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function StyleGuideRadiusCard({ name, value }: StyleGuideRadiusCardProps) {
  const { draft, updateDraft } = useStyleGuideTokens();
  const isActive = draft.activeRadiusName === name;
  const radiusStyle = { borderRadius: value };

  return (
    <button
      aria-pressed={isActive}
      className={cx(
        "radius-4 grid min-h-10 w-full grid-cols-[minmax(0,1fr)_4rem_2rem] items-center gap-3 border px-3 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
        isActive
          ? "border-service-accent bg-service-accent text-white"
          : "border-service-border bg-white text-service-ink hover:border-service-accent",
      )}
      onClick={() => {
        updateDraft("activeRadiusName", name);
        updateDraft("activeRadiusValue", value);
      }}
      type="button"
    >
      <span className="type-caption min-w-0 font-semibold">{name}</span>
      <span
        className={cx(
          "type-caption text-right tabular-nums",
          isActive ? "text-white/76" : "text-service-muted",
        )}
      >
        {value}
      </span>
      <span
        className={cx(
          "size-6 shrink-0 border",
          isActive
            ? "border-white/70 bg-white/15"
            : "border-service-border bg-service-surface",
        )}
        style={radiusStyle}
      />
    </button>
  );
}
