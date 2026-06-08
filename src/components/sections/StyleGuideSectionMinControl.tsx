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
    return (
      <div className="grid gap-2">
        {tokens.map((token) => {
          const isActive = draft.activeSectionMinName === token.name;

          return (
            <button
              className={cx(
                "radius-medium flex min-h-12 items-center justify-between gap-3 border bg-white px-4 text-left transition-colors hover:border-service-accent hover:bg-service-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
                isActive
                  ? "border-service-accent ring-2 ring-service-accent/55"
                  : "border-service-border",
              )}
              key={token.name}
              onClick={() => {
                updateDraft("activeSectionMinName", token.name);
                updateDraft("activeSectionMinValue", token.value);
              }}
              type="button"
            >
              <span className="type-caption font-semibold text-service-ink">
                {token.name}
              </span>
              <span className="type-caption text-service-muted">
                {token.value}
              </span>
            </button>
          );
        })}
      </div>
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
                    <span className="type-caption absolute left-3 top-2 bg-white/80 px-2 py-1 font-semibold text-service-ink">
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
              <span className="type-caption absolute left-3 top-2 bg-white/80 px-2 py-1 font-semibold text-service-muted">
                0
              </span>
            </div>
          </div>
        </div>
      </Card>
  );
}
