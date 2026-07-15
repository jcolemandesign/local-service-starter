"use client";

import { Card } from "@/components/primitives";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

type SectionMinToken = {
  colorClass: string;
  name: string;
  ratio: number;
  value: string;
};

type StyleGuideSectionMinControlProps = {
  tokens: SectionMinToken[];
  variant: "controls" | "graphic";
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function StyleGuideSectionMinControl({
  tokens,
  variant,
}: StyleGuideSectionMinControlProps) {
  const { draft, updateDraft } = useStyleGuideTokens();

  if (variant === "controls") {
    const activeIndex = Math.max(
      0,
      tokens.findIndex((token) => token.name === draft.activeSectionMinName),
    );
    const activeToken = tokens[activeIndex] ?? tokens[0];

    if (!activeToken) {
      return null;
    }

    return (
      <Card className="style-guide-control-panel p-6 shadow-none">
        <label className="grid gap-4">
          <span className="flex items-center justify-between gap-3">
            <span className="type-caption font-semibold text-service-ink">
              Section min
            </span>
            <span className="type-caption min-w-0 truncate text-service-muted">
              {activeToken.name}
            </span>
          </span>
          <input
            className="style-guide-control-slider w-full"
            max={tokens.length - 1}
            min={0}
            onChange={(event) => {
              const token = tokens[Number(event.target.value)];

              if (!token) return;

              updateDraft("activeSectionMinName", token.name);
              updateDraft("activeSectionMinValue", token.value);
            }}
            step={1}
            type="range"
            value={activeIndex}
          />
        </label>
        <p className="type-caption mt-1 text-service-muted">
          {activeToken.value}
        </p>
      </Card>
    );
  }

  return (
      <Card className="h-full p-5 shadow-none">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="type-label text-service-accent">
              Section height comparison
            </p>
            <p className="type-caption mt-2 text-service-muted">
              Overlaid minimum heights, scaled to section-min-story.
            </p>
          </div>
          <p className="type-caption font-semibold text-service-muted">
            100svh = 16:10
          </p>
        </div>

        <div className="radius-medium mt-5 aspect-[16/14] w-full overflow-hidden border border-service-border bg-service-surface p-5">
          <div className="relative h-full w-full">
            {tokens
              .filter((token) => token.ratio > 0)
              .map((token) => {
                const isActive = draft.activeSectionMinName === token.name;
                const isScreenReference = token.name === "section-min-screen";

                return (
                  <div
                    className={cx(
                      "absolute left-1/2 top-1/2 w-[92%] -translate-x-1/2 -translate-y-1/2",
                      isActive
                        ? "z-10 border border-service-accent bg-service-accent/8"
                        : cx(
                            "border-y border-service-muted/45",
                            isScreenReference && "bg-service-ink/5",
                          ),
                    )}
                    key={`height-graphic-${token.name}`}
                    style={{
                      height: `${Math.max(token.ratio * 100, 2)}%`,
                    }}
                  >
                    <span className="type-caption absolute left-3 top-2 bg-surface-raised/80 px-2 py-1 font-semibold text-service-ink">
                      {token.value}
                    </span>
                  </div>
                );
              })}
            <div
              className={cx(
                "absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-[radial-gradient(circle,_rgb(95_111_104_/_0.8)_1.4px,_transparent_1.6px)] bg-[length:8px_4px] bg-repeat-x",
                draft.activeSectionMinName === "section-min-none" &&
                  "ring-2 ring-service-accent/70",
              )}
            >
              <span className="type-caption absolute left-3 top-2 bg-surface-raised/80 px-2 py-1 font-semibold text-service-muted">
                0
              </span>
            </div>
          </div>
        </div>
      </Card>
  );
}
