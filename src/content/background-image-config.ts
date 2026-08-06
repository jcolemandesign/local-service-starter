/**
 * How a ground image is fitted into its box, and which part of it survives.
 *
 * `globals.css` painted every ground image `cover` from `center`, with no way
 * to say "keep the left third" or "show the whole thing". Both halves are now
 * custom properties whose fallbacks are those exact literals, the same way
 * `--section-background-layers` was introduced: a section that sets neither
 * touches no property and is provably unchanged.
 *
 * Both values ride the ordinary style-override registry rather than a config
 * blob of their own, which is what lets the content editor set them per page
 * beside the image itself. Fit is an enumerated axis and needed nothing new;
 * focal point is a continuous pair, which is why `SectionStyleFieldSpec` grew
 * `validate` - see `section-style-options.ts`.
 *
 * Values are clamped and mapped rather than escaped, following
 * `resolveBackgroundImage`: these land in a stylesheet that React never parses
 * and therefore never escapes, so anything unrecognised is dropped instead of
 * being passed through.
 */

/**
 * The `background-size` each fit mode paints.
 *
 * Keys are the stored ids and never change; the CSS is free to. `fill` is the
 * behaviour every existing ground image already has, so it is what an unset
 * value resolves to and no saved page moves.
 */
export const backgroundImageFits = {
  fill: "cover",
  fit: "contain",
  stretch: "100% 100%",
} as const;

export type BackgroundImageFit = keyof typeof backgroundImageFits;

/**
 * Fit modes in which the focal point does something.
 *
 * `stretch` sizes the image to exactly the box, so there is no overflow to
 * slide and `background-position` has no effect at all. Offering the widget
 * there would be a control that silently does nothing - the same failure the
 * per-component membership sets exist to prevent - so the editor hides it.
 */
export function fitUsesFocalPoint(fit: string | undefined) {
  return resolveBackgroundImageFitId(fit) !== "stretch";
}

export function resolveBackgroundImageFitId(
  fit: string | undefined,
): BackgroundImageFit {
  return fit && fit in backgroundImageFits ? (fit as BackgroundImageFit) : "fill";
}

/** The CSS `background-size` for a stored id, defaulting to today's `cover`. */
export function resolveBackgroundImageFit(fit: string | undefined) {
  return backgroundImageFits[resolveBackgroundImageFitId(fit)];
}

export type BackgroundImageFocus = {
  /** Horizontal focal point, as a percentage of the painted box. */
  x: number;
  /** Vertical focal point, as a percentage of the painted box. */
  y: number;
};

export const defaultBackgroundImageFocus: BackgroundImageFocus = {
  x: 50,
  y: 50,
};

/**
 * A focal point as it is stored: two integer percentages separated by a space.
 *
 * Deliberately the same shape as the CSS value it becomes, so the stored string
 * is readable in a staged page's JSON and in the content editor's raw field. A
 * pair of numbers in one string rather than two fields because the override
 * mechanism stores one string per axis, and splitting it into `focusX`/`focusY`
 * would put two half-controls in the editor that only mean anything together.
 */
const focusValue = /^(\d{1,3}) (\d{1,3})$/;

export function isBackgroundImageFocusValue(value: string) {
  return parseBackgroundImageFocus(value) !== null;
}

export function parseBackgroundImageFocus(
  value: string | undefined,
): BackgroundImageFocus | null {
  const match = focusValue.exec(value?.trim() ?? "");

  if (!match) {
    return null;
  }

  const x = Number(match[1]);
  const y = Number(match[2]);

  // Rejected rather than clamped. A value outside the box is not a near-miss
  // to be rescued - it is a hand-edit or a stale write, and falling back to
  // the stylesheet's centre is more predictable than silently moving it to an
  // edge nobody chose.
  return x <= 100 && y <= 100 ? { x, y } : null;
}

export function formatBackgroundImageFocus(focus: BackgroundImageFocus) {
  return `${Math.round(focus.x)} ${Math.round(focus.y)}`;
}

/**
 * The inline custom properties a fit and focal point paint through.
 *
 * Each is emitted only when it differs from the stylesheet's own fallback, so
 * an untouched section still sets no properties at all and the "provably
 * unchanged" claim above survives contact with this function.
 */
export function buildBackgroundImageStyle(
  fit: string | undefined,
  focus: string | undefined,
): Record<string, string> {
  const style: Record<string, string> = {};
  const fitId = resolveBackgroundImageFitId(fit);

  if (fitId !== "fill") {
    style["--section-background-image-fit"] = backgroundImageFits[fitId];
  }

  const parsed = fitUsesFocalPoint(fitId)
    ? parseBackgroundImageFocus(focus)
    : null;

  if (parsed && (parsed.x !== 50 || parsed.y !== 50)) {
    style["--section-background-image-position"] = `${parsed.x}% ${parsed.y}%`;
  }

  return style;
}
