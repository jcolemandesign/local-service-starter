import {
  type ColorPalette,
  type ColorRecipeId,
  cardTextSource,
  colorRecipeIds,
  isRecipeAvailable,
  recipeInputs,
  resolveRef,
} from "@/content/color-recipe-inputs";
import {
  contrastBars,
  contrastRatio,
  ladderLevels,
  resolveLadder,
  resolveTint,
} from "@/utils/color-scales";

/**
 * The contrast gate.
 *
 * A pure function, deliberately: it is called from the token-save route *and*
 * from the live style-guide surface, so a warning appears while someone is
 * dragging a colour picker rather than only after they commit - which is
 * exactly when they are experimenting and least likely to check.
 *
 * It reports rather than blocks. The palette is user-authored, a business's
 * brand colour is whatever it is, and a known miss can be a deliberate trade
 * (the highlight recipe's Muted eyebrow sits about 2% under AA and is accepted
 * on purpose). A hard block would make the system unusable for real brands.
 *
 * SCOPE. Card findings describe sections that establish a card colour context.
 * In phase 1 that is the sections hooked through the cardStyle plumbing, not
 * every section that paints a card surface - see `coveredCardSections` below.
 * A gate that silently validates a model most of the codebase does not
 * implement is worse than no gate, because it manufactures confidence in the
 * exact numbers someone would otherwise go and check.
 */

export type GateRole =
  | "text-strong"
  | "text-body"
  | "text-muted"
  | "text-meta"
  | "eyebrow"
  | "cta-fill"
  | "cta-label"
  | "card-surface";

export type GateSurface = "ground" | "card";

export type GateFinding = {
  recipe: ColorRecipeId;
  role: GateRole;
  surface: GateSurface;
  /** The colour that was resolved, so a failure can be inspected directly. */
  color: string;
  /** What it was measured against. */
  against: string;
  ratio: number;
  bar: number;
  pass: boolean;
  /** How much headroom above the bar. Negative is the size of the miss.
   *  Reported even on a pass so a palette that only just clears is visible -
   *  the tint constants in particular are tuned to one palette's worst ground
   *  and a business authoring a darker one needs to see the margin shrink. */
  margin: number;
};

export type GateReport = {
  findings: GateFinding[];
  failures: GateFinding[];
  /** Recipes measured. Excludes any hidden because their defining swatch is
   *  unset - those still render via the swatch fallback, but offering
   *  contrast figures for a recipe nobody can select is noise. */
  measured: ColorRecipeId[];
  hidden: ColorRecipeId[];
  /** Stated so a reader cannot mistake the card figures for global truth. */
  coveredCardSections: number;
  totalCardSections: number;
};

/**
 * Sections whose cards establish their own colour context.
 *
 * Coverage is now by SELECTOR, not by a hand-applied class: any element
 * painting a card token inside a solid-fill section grounds its own subtree.
 * That replaced an approach where each section had to opt in, which had
 * reached 41 of these and would have made every card override half-work on the
 * sections it missed.
 *
 * The remainder paint a card by some other means, so a rule keyed on the card
 * tokens cannot see them. That is a smaller and more static set than the
 * opt-in gap was, but it is not zero, which is why the gate still states its
 * scope rather than claiming the card figures are global.
 *
 * These are counts, not a registry: `color-card-coverage.test.ts` derives the
 * real number and fails if this stops matching it. A stale figure here is
 * worse than none, because the report would overstate its own reach.
 */
export const CARD_CONTEXT_COVERAGE = {
  covered: 130,
  total: 148,
} as const;

const ladderRoles: { role: GateRole; level: keyof typeof ladderLevels; bar: number }[] = [
  { role: "text-strong", level: "strong", bar: contrastBars.text },
  { role: "text-body", level: "body", bar: contrastBars.text },
  { role: "text-muted", level: "muted", bar: contrastBars.text },
  { role: "text-meta", level: "quiet", bar: contrastBars.large },
];

function finding(
  recipe: ColorRecipeId,
  role: GateRole,
  surface: GateSurface,
  color: string,
  against: string,
  bar: number,
): GateFinding {
  const ratio = contrastRatio(color, against);

  return {
    recipe,
    role,
    surface,
    color,
    against,
    ratio,
    bar,
    pass: ratio >= bar,
    margin: ratio - bar,
  };
}

export function gateColorSystem(palette: ColorPalette): GateReport {
  const findings: GateFinding[] = [];
  const measured: ColorRecipeId[] = [];
  const hidden: ColorRecipeId[] = [];

  for (const id of colorRecipeIds) {
    if (!isRecipeAvailable(palette, id)) {
      hidden.push(id);
      continue;
    }

    measured.push(id);

    const inputs = recipeInputs[id];
    const ground = resolveRef(palette, inputs.ground, palette.page);
    const card = resolveRef(palette, inputs.card, ground);
    const textSource = resolveRef(palette, inputs.text, ground);
    const ctaLabel = resolveRef(palette, inputs.ctaLabel, ground);
    const chromatic = resolveRef(palette, inputs.chromatic, ground);

    // Text hierarchy on the section ground.
    for (const { role, level, bar } of ladderRoles) {
      findings.push(
        finding(id, role, "ground", resolveLadder(textSource, ground, level), ground, bar),
      );
    }

    // The same hierarchy on the card, which is its own ground for the
    // sections that carry a card context.
    const cardText = cardTextSource(palette, card);
    for (const { role, level, bar } of ladderRoles) {
      findings.push(
        finding(id, role, "card", resolveLadder(cardText, card, level), card, bar),
      );
    }

    // Does the card read as a card at all?
    findings.push(finding(id, "card-surface", "ground", card, ground, contrastBars.card));

    // The chromatic roles. Which treatment applies is a function of the
    // ground, not a per-recipe preference.
    const ctaFill =
      inputs.tintMode === "tinted"
        ? resolveTint(chromatic, textSource, "fill")
        : inputs.tintMode === "textSource"
          ? textSource
          : chromatic;

    const eyebrow =
      inputs.tintMode === "tinted"
        ? resolveTint(chromatic, textSource, "text")
        : inputs.tintMode === "textSource"
          ? textSource
          : chromatic;

    // A button's own edge against the field it sits on - WCAG 1.4.11 rather
    // than the text bar, because the fill is a boundary and not copy.
    findings.push(finding(id, "cta-fill", "ground", ctaFill, ground, contrastBars.large));
    findings.push(finding(id, "cta-label", "ground", ctaLabel, ctaFill, contrastBars.text));
    // The eyebrow is readable copy, so it takes the text bar.
    findings.push(finding(id, "eyebrow", "ground", eyebrow, ground, contrastBars.text));
  }

  return {
    findings,
    failures: findings.filter((f) => !f.pass),
    measured,
    hidden,
    coveredCardSections: CARD_CONTEXT_COVERAGE.covered,
    totalCardSections: CARD_CONTEXT_COVERAGE.total,
  };
}

/** One-line summaries for the style guide UI. */
export function formatGateFinding(f: GateFinding): string {
  return `${f.recipe} · ${f.role} on ${f.surface}: ${f.ratio.toFixed(2)} against a ${f.bar} bar (${f.color} on ${f.against})`;
}

/** Unused palette keys are not an error, but an unset accent changes what the
 *  pickers offer, so the caller needs to be able to say so. */
export function paletteNotes(palette: ColorPalette): string[] {
  const notes: string[] = [];

  if (!palette.accent) {
    notes.push(
      "accent is unset — the Accent recipe is hidden and accent CTA fills resolve to brand.",
    );
  }

  return notes;
}
