"use client";

import { useState } from "react";
import { Card } from "@/components/primitives";
import { deriveDarkSurface } from "@/content/color-palette-adapter";
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
      | "bgDarkSurface"
      | "bgPage"
      | "ctaAccent"
      | "serviceAccent"
      | "serviceBorder"
      | "serviceInk"
      | "serviceMuted"
      | "surfaceRaised"
      | "serviceSurface"
    >;
    /** Set when the token is computed from another token rather than picked. */
    derivedFrom?: string;
    label: string;
    name: string;
    surface: string;
    text: string;
    usage: string;
    value: string;
  };
};

type ColorFormat = "hex" | "hsl" | "rgb";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function colorValueForFormat(value: string, format: ColorFormat) {
  if (format === "hex") return value.toUpperCase();

  const hex = value.replace("#", "");

  if (!/^[\da-f]{6}$/i.test(hex)) return value;

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  if (format === "rgb") return `rgb(${red}, ${green}, ${blue})`;

  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
  const delta = max - min;
  const lightness = (max + min) / 2;
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  let hue = 0;

  if (delta !== 0) {
    if (max === normalizedRed) {
      hue = 60 * (((normalizedGreen - normalizedBlue) / delta) % 6);
    } else if (max === normalizedGreen) {
      hue = 60 * ((normalizedBlue - normalizedRed) / delta + 2);
    } else {
      hue = 60 * ((normalizedRed - normalizedGreen) / delta + 4);
    }
  }

  return `hsl(${Math.round((hue + 360) % 360)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%)`;
}

function ColorWheelIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="7.25" />
      <circle cx="12" cy="12" r="2.25" />
      <path d="M12 4.75v5M18.28 8.38l-4.33 2.5M18.28 15.62l-4.33-2.5M12 19.25v-5M5.72 15.62l4.33-2.5M5.72 8.38l4.33 2.5" />
    </svg>
  );
}

const optionalControlKeys = new Set(["bgDarkSurface", "ctaAccent"]);

function isOptional(
  controlKey: StyleGuideColorSwatchProps["color"]["controlKey"],
) {
  return Boolean(controlKey && optionalControlKeys.has(controlKey));
}

/** What an optional swatch resolves to while nobody has authored it. Mirrors
 *  the fallbacks in `color-palette-adapter.ts` and `buildStyleVariables`. */
function fallbackFor(
  controlKey: StyleGuideColorSwatchProps["color"]["controlKey"],
  draft: StyleGuideTokenDraft,
) {
  if (controlKey === "bgDarkSurface") return deriveDarkSurface(draft.bgDark);
  if (controlKey === "ctaAccent") return draft.serviceAccent;

  return undefined;
}

export function StyleGuideColorSwatch({ color }: StyleGuideColorSwatchProps) {
  const { draft, updateDraft } = useStyleGuideTokens();
  const [format, setFormat] = useState<ColorFormat>("hex");
  const stored = color.controlKey ? draft[color.controlKey] : color.value;
  /**
   * Two swatches are optional, so "unset" is a real state rather than a bug,
   * and it is not the same as "empty". Each falls back to something concrete -
   * the dark surface derives from Dark, the CTA accent resolves to the brand
   * colour - and the picker has to show the colour that will actually render,
   * or an editor cannot tell what leaving it unset does.
   */
  const isUnset = !stored;
  const value = stored || fallbackFor(color.controlKey, draft) || color.value;
  const formattedValue = colorValueForFormat(value, format);

  return (
    <Card className="overflow-hidden shadow-none">
      <div className="grid min-h-40 grid-cols-[8.5rem_minmax(0,1fr)] max-sm:grid-cols-1">
        <div
          className={cx(
            color.surface,
            color.text,
            "style-guide-live-swatch grid content-between p-4",
          )}
        >
          <p className="type-label opacity-75">{color.label}</p>
          <p className="type-caption mt-3 opacity-80">
            {color.derivedFrom ?? value}
            {isUnset && isOptional(color.controlKey) ? " · unset" : ""}
          </p>
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
            <div className="flex min-h-11 items-center gap-3 rounded-sm border border-service-border bg-service-surface px-3">
              <label className="flex shrink-0 cursor-pointer overflow-hidden rounded-sm border border-service-border">
                <input
                  aria-label={`Select ${color.label}`}
                  className="sr-only"
                  onChange={(event) =>
                    updateDraft(color.controlKey!, event.target.value)
                  }
                  type="color"
                  value={value}
                />
                <span className="flex min-h-7 items-center bg-surface-raised px-3 text-xs font-semibold text-service-ink">
                  Select color
                </span>
                <span className="grid size-7 place-items-center border-l border-service-border bg-service-surface text-service-muted">
                  <ColorWheelIcon />
                </span>
              </label>
              <div className="ml-auto flex min-w-0 items-center gap-2">
                <span className="flex shrink-0 overflow-hidden rounded-sm border border-service-border">
                  {(["hex", "rgb", "hsl"] as const).map((option) => (
                    <button
                      aria-pressed={format === option}
                      className={cx(
                        "type-caption min-h-7 px-2 font-semibold uppercase transition-colors",
                        format === option
                          ? "bg-service-ink text-white"
                          : "bg-surface-raised text-service-muted hover:text-service-ink",
                      )}
                      key={option}
                      onClick={() => setFormat(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </span>
                <code className="type-caption min-w-0 truncate font-semibold text-service-muted">
                  {formattedValue}
                </code>
                {/* Optional swatches need a way back to unset. A colour input
                    cannot express "no value", so without this an editor who
                    tries the CTA accent once can never un-author it, and the
                    Accent recipe stays visible for good. */}
                {isOptional(color.controlKey) && !isUnset ? (
                  <button
                    className="type-caption min-h-7 shrink-0 rounded-sm border border-service-border bg-surface-raised px-2 font-semibold text-service-muted transition-colors hover:text-service-ink"
                    onClick={() => updateDraft(color.controlKey!, "")}
                    type="button"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-2 text-service-muted">
              {color.derivedFrom
                ? `Derived from ${color.derivedFrom}`
                : "Reference token"}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
