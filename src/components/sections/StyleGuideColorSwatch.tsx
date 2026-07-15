"use client";

import { Card } from "@/components/primitives";
import {
  type StyleGuideTokenDraft,
  useStyleGuideTokens,
} from "@/components/sections/StyleGuideLiveSurface";

type StyleGuideColorSwatchProps = {
  color: {
    accent: string;
    border: string;
    controlKey?: keyof Pick<
      StyleGuideTokenDraft,
      | "accent"
      | "bgDark"
      | "bgPage"
      | "serviceAccent"
      | "serviceBorder"
      | "serviceInk"
      | "serviceMuted"
      | "surfaceRaised"
      | "serviceSurface"
    >;
    name: string;
    surface: string;
    text: string;
    usage: string;
    value: string;
  };
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function StyleGuideColorSwatch({ color }: StyleGuideColorSwatchProps) {
  const { draft, updateDraft } = useStyleGuideTokens();
  const value = color.controlKey ? draft[color.controlKey] : color.value;

  return (
    <Card className="overflow-hidden shadow-none">
      <div className="grid min-h-40 grid-cols-[8.5rem_minmax(0,1fr)] max-sm:grid-cols-1">
        <div className={cx(color.surface, color.text, "grid content-between p-4")}>
        <div
          className={cx(
            color.border,
              "h-12 rounded-sm border bg-surface-raised/8",
          )}
        />
        <p className="type-label opacity-75">{color.name}</p>
        <p className="type-caption mt-3 opacity-80">{value}</p>
      </div>
        <div className="grid content-between gap-4 p-4">
          <div>
            <p className="type-text-sm font-semibold text-service-ink">
              {color.usage}
            </p>
            <p className="type-caption mt-2 text-service-muted">
              {color.surface} / {color.text}
            </p>
          </div>
          {color.controlKey ? (
            <label className="flex min-h-11 items-center gap-3 rounded-sm border border-service-border bg-service-surface px-3">
              <input
                aria-label={`${color.name} color`}
                className="size-7 shrink-0 cursor-pointer border-0 bg-transparent p-0"
                onChange={(event) =>
                  updateDraft(color.controlKey!, event.target.value)
                }
                type="color"
                value={value}
              />
              <span className="type-caption truncate font-semibold text-service-muted">
                {value}
              </span>
            </label>
          ) : (
            <p className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-2 text-service-muted">
              Reference token
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
