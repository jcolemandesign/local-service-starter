"use client";

import {
  type CardSurfaceState,
  type ColorOverrideIntensity,
  type ColorOverrideSwatch,
  borderIntensityOptions,
  cardIntensityOptions,
  resolveBorderIntensity,
  resolveOverrideColor,
  resolveOverrideIntensity,
  resolveOverrideSwatch,
} from "@/content/color-overrides";
import type {
  ColorPalette,
  ColorRecipeId,
} from "@/content/color-recipe-inputs";
import { paletteSwatchOptions } from "@/content/section-style-options";
import { formatGateFinding, gateSectionOverrides } from "@/utils/color-gate";

/**
 * The section-level card and border colour pickers.
 *
 * Lives beside the card fill and border toggles it extends, and in its own
 * file rather than inline in `PagebuilderShell` - that file is ~7,500 lines
 * and two scripted edits on it have already gone wrong.
 *
 * WHAT THE SWATCHES SHOW. Each button is painted with the colour it would
 * actually produce on THIS section - the swatch mixed toward this recipe's
 * ground at the currently chosen intensity - rather than with the raw palette
 * entry. The whole point of the intensity axis is that an override is
 * contextual: `dark · wash` is a tint of whatever the section sits on, so a
 * picker showing nine flat palette colours would be showing something the
 * editor cannot get.
 *
 * ONE OVERRIDE PAINTS EVERY CARD IN THE SECTION. A section rendering a feature
 * tile beside three small ones gets one card colour for all four. That is the
 * brief's section-level decision, and the labels say "Cards" rather than "Card"
 * so the control does not imply a precision it does not have.
 */

type OverrideField =
  | "cardSwatch"
  | "cardIntensity"
  | "borderSwatch"
  | "borderIntensity";

type OverrideValues = {
  cardSwatch?: string;
  cardIntensity?: string;
  borderSwatch?: string;
  borderIntensity?: string;
};

type Props = {
  onChange: (field: OverrideField, value: string) => void;
  palette: ColorPalette;
  recipe: ColorRecipeId;
  section: OverrideValues;
  surface: CardSurfaceState;
};

const cardIntensityLabels: Record<string, string> = {
  strong: "Solid",
  body: "Softened",
  faint: "Wash",
};

const borderIntensityLabels: Record<string, string> = {
  faint: "Faint",
  quiet: "Defined",
};

const controlClassName =
  "token-chrome-control flex size-10 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors";

function SwatchGrid({
  disabledReason,
  intensity,
  onSelect,
  palette,
  recipe,
  selected,
}: {
  disabledReason?: string;
  intensity: ColorOverrideIntensity;
  onSelect: (value: string) => void;
  palette: ColorPalette;
  recipe: ColorRecipeId;
  selected: string | undefined;
}) {
  /**
   * A swatch the palette has not authored is not offered.
   *
   * Only `accent` is optional - it is the CTA derivative, needed only when the
   * brand colour itself lacks contrast as a button - and when it is unset it
   * falls back to brand. Offering it anyway would put two buttons in this grid
   * that paint the same colour, which reads as the control being broken.
   */
  const available = paletteSwatchOptions.filter(
    (option) => option.value !== "accent" || Boolean(palette.accent),
  );

  return (
    <div className="grid grid-cols-5 gap-2">
      <button
        aria-pressed={!selected}
        className={`${controlClassName} ${!selected ? "token-chrome-card-active" : ""}`}
        onClick={() => onSelect("")}
        title="Use the recipe's own card colour"
        type="button"
      >
        {/* A diagonal through an empty cell: the absence of an override, drawn
            rather than labelled, so it reads as one of the swatches. */}
        <svg aria-hidden="true" className="size-5" viewBox="0 0 20 20">
          <rect
            fill="none"
            height="18"
            stroke="currentColor"
            strokeWidth="1.5"
            width="18"
            x="1"
            y="1"
          />
          <line
            stroke="currentColor"
            strokeWidth="1.5"
            x1="2"
            x2="18"
            y1="18"
            y2="2"
          />
        </svg>
        <span className="sr-only">Use the recipe default</span>
      </button>

      {available.map((option) => {
        const swatch = option.value as ColorOverrideSwatch;
        const isActive = selected === option.value;

        return (
          <button
            aria-pressed={isActive}
            className={`${controlClassName} ${isActive ? "token-chrome-card-active" : ""}`}
            disabled={Boolean(disabledReason)}
            key={option.value}
            onClick={() => onSelect(option.value)}
            title={disabledReason ?? option.label}
            type="button"
          >
            <span
              className="size-5 rounded-[var(--radius-tiny-token)] border border-service-border"
              style={{
                backgroundColor: resolveOverrideColor(
                  palette,
                  recipe,
                  swatch,
                  intensity,
                ),
              }}
            />
            <span className="sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function IntensityRow({
  labels,
  onSelect,
  options,
  selected,
}: {
  labels: Record<string, string>;
  onSelect: (value: string) => void;
  options: readonly ColorOverrideIntensity[];
  selected: ColorOverrideIntensity;
}) {
  return (
    <div className="flex items-center gap-2">
      {options.map((option) => (
        <button
          aria-pressed={selected === option}
          className={`type-caption rounded-[var(--chrome-radius-control)] border px-3 py-1.5 transition-colors token-chrome-control ${
            selected === option ? "token-chrome-card-active" : ""
          }`}
          key={option}
          onClick={() => onSelect(option)}
          type="button"
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}

export function SectionColorOverrideControls({
  onChange,
  palette,
  recipe,
  section,
  surface,
}: Props) {
  const cardSwatch = resolveOverrideSwatch(section.cardSwatch);
  const borderSwatch = resolveOverrideSwatch(section.borderSwatch);
  const cardIntensity = resolveOverrideIntensity(section.cardIntensity);
  const borderIntensity = resolveBorderIntensity(section);

  /**
   * Warnings, not blocks. The palette is authored per business and a brand
   * colour is whatever it is - and an override making a card the same colour
   * as its ground is occasionally a deliberate borderless panel. The gate says
   * so; the picker still offers it.
   *
   * Border weight is on the same footing now. It used to be the exception -
   * Faint was locked out whenever the fill was off - and since most sections
   * here are unfilled, that read as Faint simply not existing. The bar it was
   * defending is real but the lock did not deliver it: forcing Quiet clears
   * 3:1 for two of the eight swatches and misses for the rest. So it reports
   * like everything else, as a `card-border` finding.
   */
  const failures = gateSectionOverrides(
    palette,
    recipe,
    section,
    surface,
  ).filter((finding) => !finding.pass);

  return (
    <div className="grid gap-4">
      <fieldset className="grid gap-2">
        <legend className="type-caption font-semibold text-current">
          Card colour
        </legend>
        <SwatchGrid
          intensity={cardIntensity}
          onSelect={(value) => onChange("cardSwatch", value)}
          palette={palette}
          recipe={recipe}
          selected={cardSwatch}
        />
      </fieldset>

      {cardSwatch ? (
        <fieldset className="grid gap-2">
          <legend className="type-caption font-semibold text-current">
            Card intensity
          </legend>
          <IntensityRow
            labels={cardIntensityLabels}
            onSelect={(value) => onChange("cardIntensity", value)}
            options={cardIntensityOptions}
            selected={cardIntensity}
          />
        </fieldset>
      ) : null}

      <fieldset className="grid gap-2">
        <legend className="type-caption font-semibold text-current">
          Border colour
        </legend>
        <SwatchGrid
          intensity={borderIntensity}
          onSelect={(value) => onChange("borderSwatch", value)}
          palette={palette}
          recipe={recipe}
          selected={borderSwatch}
        />
      </fieldset>

      {borderSwatch ? (
        <fieldset className="grid gap-2">
          <legend className="type-caption font-semibold text-current">
            Border weight
          </legend>
          <IntensityRow
            labels={borderIntensityLabels}
            onSelect={(value) => onChange("borderIntensity", value)}
            options={borderIntensityOptions}
            selected={borderIntensity}
          />
        </fieldset>
      ) : null}

      {failures.length > 0 ? (
        <ul className="grid gap-1">
          {failures.map((finding) => (
            <li
              className="type-caption text-service-muted"
              key={`${finding.role}-${finding.surface}`}
            >
              {formatGateFinding(finding)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
