"use client";

import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

type StyleGuideRadiusCardProps = {
  target: "button" | "surface";
  name: string;
  value: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function StyleGuideRadiusCard({
  target,
  name,
  value,
}: StyleGuideRadiusCardProps) {
  const { draft, updateDraft } = useStyleGuideTokens();
  const isActive =
    target === "button"
      ? draft.activeButtonRadiusName === name
      : draft.activeSurfaceRadiusName === name;
  const radiusStyle = { borderRadius: value };

  return (
    <button
      aria-pressed={isActive}
      className={cx(
        "radius-4 grid min-h-10 w-full grid-cols-[minmax(0,1fr)_4rem_2rem] items-center gap-3 border px-3 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
        // Chrome tokens rather than the client palette - see StyleGuideGapCard.
        isActive ? "token-chrome-card-active" : "token-chrome-control",
      )}
      onClick={() => {
        if (target === "button") {
          updateDraft("activeButtonRadiusName", name);
          updateDraft("activeButtonRadiusValue", value);

          return;
        }

        updateDraft("activeSurfaceRadiusName", name);
        updateDraft("activeSurfaceRadiusValue", value);
      }}
      type="button"
    >
      <span className="type-caption min-w-0 font-semibold">{name}</span>
      <span
        className={cx(
          "type-caption text-right tabular-nums",
          isActive ? undefined : "token-chrome-muted",
        )}
      >
        {value}
      </span>
      <span
        className={cx(
          "size-6 shrink-0 border",
          isActive
            ? "border-[var(--chrome-border-strong)] bg-[var(--chrome-accent)]/25"
            : "border-[var(--chrome-border)] bg-[var(--chrome-soft)]",
        )}
        style={radiusStyle}
      />
    </button>
  );
}
