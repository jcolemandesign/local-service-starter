/**
 * Colors that are defined by their relationship to another color rather than by
 * a value of their own.
 *
 * A line color and a fill color have opposite requirements: a border wants to be
 * perceptible against its surface, a muted fill wants to stay subordinate to it.
 * They used to share one draft field, which forced those two requirements to be
 * equal — and the border is what lost. Deriving both from the surface keeps the
 * single picker while letting the two move in opposite directions.
 *
 * These are emitted as CSS text, not resolved in JS, so they recompute wherever
 * `--live-service-surface` is redefined — the live-edit wrapper, the promoted
 * `:root`, and any section recipe that remaps the surface for its subtree. A
 * value resolved once at `:root` would freeze against the root surface and
 * ignore live edits.
 */
export const derivedColorValues = {
  /**
   * Perceptible boundary — lands near 3:1 against its own surface, the WCAG
   * 1.4.11 floor for a meaningful edge.
   *
   * The offset is 0.30, not the ~0.14 that reads as "clearly darker" by eye.
   * WCAG contrast is non-linear in lightness, so a constant offset does not buy
   * a constant ratio: measured across light surfaces (L 0.70-0.97), -0.14 gives
   * only 1.55-1.73:1, while -0.27 to -0.33 is what reaches 3:1. 0.30 sits in
   * that band for the whole range.
   *
   * This is one-directional and therefore only correct on light grounds: below
   * roughly L 0.45 no downward step can reach 3:1 and the derivation would have
   * to invert. Dark grounds do not hit that case today because the dark and
   * accent recipes set `--live-service-border` explicitly for their subtree.
   */
  serviceBorder: "oklch(from var(--live-service-surface) calc(l - 0.30) c h)",
  /** Subordinate fill: barely separated from the surface it sits on. */
  bgMuted: "oklch(from var(--live-service-surface) calc(l - 0.03) c h)",
} as const;
