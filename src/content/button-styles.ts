/**
 * THE BUTTON STYLE LIBRARY, AND THE TOKENS EVERY STYLE SPEAKS THROUGH.
 *
 * Three global assignments - primary, secondary and special - authored in the
 * Style Guide and promoted into `globals.css` like every other token. A section
 * never chooses a button style. It may only say whether its primary CTA is the
 * SPECIAL one, through `data-pagebuilder-special-cta` on its frame; which style
 * that is remains a site-wide decision. Same split as the motion suites and the
 * colour recipes, for the same reason: a value the system owns cannot drift
 * section by section.
 *
 * A STYLE IS STRUCTURAL, NEVER CHROMATIC. Colour is already owned by the colour
 * recipes - every recipe row resolves `--recipe-cta-fill` / `--recipe-cta-label`
 * into the `--live-cta-*` roles, and it does so per section ground. A
 * style that carried its own colours would be correct on the page recipe and
 * wrong on the five dark and chromatic ones, and it would be "sections own no
 * colour" broken one level up. So a style decides where the fill comes from, how
 * it arrives, whether the box lifts and whether there is a glyph - and it reads
 * whatever colours the recipe hands it.
 *
 * A style names one of the five `--btn-cta-*` roles and NEVER a `--color-*`
 * token. Those are frozen at `:root` by Tailwind's `@theme inline` and cannot
 * see a recipe; the roles are declared on `.button-cta`, inside the recipe's
 * subtree. This shipped wrong once - `docs/button-style-axis.md` §4 has the
 * measured account, and `button-style-agreement` now fails on any style value
 * containing `var(--color-`.
 *
 * WHY THIS IS DATA. The draft's defaults, the Style Guide's live preview, the
 * promoted CSS, the validator and the controls are all derived from the arrays
 * below. Written out by hand in five places they drift while all five look
 * right, which is the argument `motion-tokens.ts` already makes and this file
 * follows deliberately - it is the same shape one axis over.
 *
 * WHAT THIS FILE IS NOT AUTHORITATIVE OVER. It owns the token names, the styles,
 * their values and which slot each may fill. It does not own the ANATOMY - the
 * rules that read these tokens live in `globals.css`, and a token declared here
 * that no rule reads is a dial connected to nothing.
 * `button-style-agreement.test.ts` pins that in both directions.
 */

/**
 * The slots a style can be assigned to.
 *
 * `special` is deliberately its own slot rather than "any primary style". The
 * special exists to give one section's CTA more weight than the site's ordinary
 * primary, so a style that reads as the quiet default is not a candidate for it,
 * and a style with a glyph and a sweep is not what every button on the site
 * should be. A style may declare both where it genuinely works as either.
 */
export type ButtonStyleSlot = "primary" | "secondary" | "special";

export const buttonStyleSlots = [
  "primary",
  "secondary",
  "special",
] as const satisfies readonly ButtonStyleSlot[];

/**
 * The token vocabulary, in the order the promoted block emits it.
 *
 * Every style declares EVERY token. That completeness is load-bearing rather
 * than tidy: the three slots are three RULES declaring the same token names on
 * different selectors, so a style omitting a token would take whichever rule
 * declared it last - a button that is mostly the new style with one dimension
 * of another, and nothing to indicate why. The `satisfies` below makes an
 * omission a compile error, and `button-style-agreement` catches an empty
 * value, which is an omission CSS cares about and the compiler does not.
 */
export const buttonStyleTokenNames = [
  /** Trailing padding. Its own token because a glyph that fills a chip needs the
   *  box to stop where the chip starts. */
  "pad-end",
  "surface",
  "surface-hover",
  "ink",
  "ink-hover",
  "border-color",
  "border-color-hover",
  "border-width",
  /** The fill layer - the sweep. Paints above the button's own background and
   *  below its label; see the anatomy note in `globals.css`. */
  "fill",
  /** Where the fill layer sits at rest and on hover, as a `translate`. This is
   *  the cheap half of the vocabulary: a sweep is a compositor transform. */
  "fill-rest",
  "fill-hover",
  /** The same two questions as an `inset`, for gestures a translate cannot
   *  express - a chip pinned to one edge that grows to fill the box. */
  "fill-inset",
  "fill-inset-hover",
  /** The box's own hover gesture. Two properties rather than one `transform`
   *  shorthand, so a lift and a press compose instead of overwriting.
   *
   *  EVERY GESTURE TOKEN IS THE HOVER VALUE, never the resting one. The anatomy
   *  holds each one inert at rest and switches to the token under `:hover`, so a
   *  style states what happens rather than restating that nothing happens twice.
   *  `lift: "0 0"` and `press: "1"` are how a style declines the gesture. */
  "lift",
  "press",
  "shadow",
  "shadow-hover",
  /** The affordance. `none` generates no box at all, which is why an absent
   *  glyph costs no layout - see the anatomy note. */
  "glyph",
  "glyph-size",
  /**
   * The glyph's own colour, and it needs one because the glyph is the one part
   * of a button that does not necessarily sit on the button's own ground.
   *
   * Every other mark on a button - the label above all - is painted on whatever
   * `surface` and the fill layer put behind it, so `ink` answers for all of it.
   * A glyph sized to a chip is painted on the CHIP, which is a different colour
   * by definition; that is what makes it a chip. Inheriting `ink` there gives an
   * arrow in the outline ink on a solid fill, which on most recipes is the same
   * hue twice and reads as an empty square.
   *
   * `currentColor` is how a style declines it, which is every style whose glyph
   * shares the label's ground. There is no hover variant on purpose: a glyph
   * that changed colour mid-gesture would need a transition of its own, and a
   * chip that grows to the whole button hands its glyph the same colour at both
   * ends anyway.
   */
  "glyph-ink",
  "glyph-hover",
  "duration",
  "easing",
] as const;

export type ButtonStyleTokenName = (typeof buttonStyleTokenNames)[number];

export type ButtonStyleTokens = Record<ButtonStyleTokenName, string>;

export type ButtonStyle = {
  /** Persisted. Never renamed - a promoted style guide and every saved slot
   *  carry this string. */
  id: string;
  label: string;
  /** One line, shown under the style in the Style Guide. Says what it does. */
  description: string;
  slots: readonly ButtonStyleSlot[];
  tokens: ButtonStyleTokens;
};

/**
 * The inert answer for every token.
 *
 * Spread first by each style so a style states only what it changes, while the
 * emitted record stays complete. "Inert" means: no fill layer, no glyph, no
 * lift, no shadow - a plain box whose colours come from the recipe.
 *
 * `--btn-fill-rest` and `--btn-fill-hover` both resting at `0 0` with a
 * transparent fill is what "no sweep" is. There is no separate off switch,
 * because a fill that paints nothing and never moves already is one.
 */
const inertTokens: ButtonStyleTokens = {
  "pad-end": "1.5rem",
  surface: "transparent",
  "surface-hover": "transparent",
  ink: "var(--btn-cta-edge-ink)",
  "ink-hover": "var(--btn-cta-edge-ink)",
  "border-color": "transparent",
  "border-color-hover": "transparent",
  "border-width": "1px",
  fill: "transparent",
  "fill-rest": "0 0",
  "fill-hover": "0 0",
  "fill-inset": "0",
  "fill-inset-hover": "0",
  lift: "0 0",
  press: "1",
  shadow: "none",
  "shadow-hover": "none",
  glyph: "none",
  "glyph-size": "auto",
  "glyph-ink": "currentColor",
  "glyph-hover": "0 0",
  duration: "200ms",
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
};

/**
 * The library.
 *
 * Filled and lifting styles for the primary, outline and ghost ones for the
 * secondary, and the gestural ones for the special. A style may declare more
 * than one slot where it genuinely works as either - `sweep-up` does.
 *
 * NO COUNTS HERE ON PURPOSE. `buttonStylesForSlot` derives what each slot is
 * offered, and the animation axis has a table of totals in its handoff that
 * drifted in exactly this way - re-derive rather than restate.
 *
 * `as const satisfies` rather than a plain annotation, and it is load-bearing
 * the same way it is on `sectionAnimationSuites` and `motionControlGroups`: a
 * bare `ButtonStyle[]` collapses `id` to `string` and takes `ButtonStyleId`
 * with it.
 */
export const buttonStyles = [
  {
    id: "solid",
    label: "Solid",
    description:
      "The plain filled button. Darkens to the recipe's hover fill and does nothing else.",
    slots: ["primary"],
    tokens: {
      ...inertTokens,
      surface: "var(--btn-cta-fill)",
      "surface-hover": "var(--btn-cta-fill-hover)",
      ink: "var(--btn-cta-label)",
      "ink-hover": "var(--btn-cta-label)",
    },
  },
  {
    id: "solid-lift",
    label: "Solid lift",
    description:
      "The filled button, raised two pixels on hover with the shared surface shadow behind it.",
    slots: ["primary"],
    tokens: {
      ...inertTokens,
      surface: "var(--btn-cta-fill)",
      "surface-hover": "var(--btn-cta-fill-hover)",
      ink: "var(--btn-cta-label)",
      "ink-hover": "var(--btn-cta-label)",
      lift: "0 -2px",
      "shadow-hover": "var(--shadow-service)",
    },
  },
  {
    id: "solid-press",
    label: "Solid press",
    description:
      "The filled button, easing down to 97% under the cursor. Reads as a physical press rather than a highlight.",
    slots: ["primary"],
    tokens: {
      ...inertTokens,
      surface: "var(--btn-cta-fill)",
      "surface-hover": "var(--btn-cta-fill-hover)",
      ink: "var(--btn-cta-label)",
      "ink-hover": "var(--btn-cta-label)",
      press: "0.97",
    },
  },
  {
    /**
     * The one style offered to two slots, and the reason is the argument for
     * having slots at all: a sweep is calm enough to be every button on the
     * site AND emphatic enough to be the one that is not.
     */
    id: "sweep-up",
    label: "Sweep up",
    description:
      "The hover fill rises from the bottom edge rather than switching on. Calm enough for every button, emphatic enough for one.",
    slots: ["primary", "special"],
    tokens: {
      ...inertTokens,
      surface: "var(--btn-cta-fill)",
      "surface-hover": "var(--btn-cta-fill)",
      ink: "var(--btn-cta-label)",
      "ink-hover": "var(--btn-cta-label)",
      fill: "var(--btn-cta-fill-hover)",
      "fill-rest": "0 100%",
      "fill-hover": "0 0",
      duration: "320ms",
    },
  },
  {
    id: "outline",
    label: "Outline",
    description:
      "The secondary the system has always had: an edge in the recipe's CTA colour, washed faintly on hover.",
    slots: ["secondary"],
    tokens: {
      ...inertTokens,
      "border-color": "var(--btn-cta-edge)",
      "border-color-hover": "var(--btn-cta-edge)",
      "surface-hover":
        "color-mix(in srgb, var(--btn-cta-edge) 10%, transparent)",
    },
  },
  {
    id: "outline-swap",
    label: "Outline swap",
    description:
      "An edge at rest that becomes a filled button on hover. The most emphatic a secondary gets before it competes with the primary.",
    slots: ["secondary"],
    tokens: {
      ...inertTokens,
      "border-color": "var(--btn-cta-edge)",
      "border-color-hover": "var(--btn-cta-edge)",
      "surface-hover": "var(--btn-cta-edge)",
      "ink-hover": "var(--btn-cta-label)",
    },
  },
  {
    id: "outline-sweep",
    label: "Outline sweep",
    description:
      "An edge at rest, filled by a sweep rising from the bottom. The secondary companion to Sweep up.",
    slots: ["secondary"],
    tokens: {
      ...inertTokens,
      "border-color": "var(--btn-cta-edge)",
      "border-color-hover": "var(--btn-cta-edge)",
      "ink-hover": "var(--btn-cta-label)",
      fill: "var(--btn-cta-edge)",
      "fill-rest": "0 100%",
      "fill-hover": "0 0",
      duration: "320ms",
    },
  },
  {
    id: "ghost",
    label: "Ghost",
    description:
      "No edge at all until the cursor arrives. For pages where the secondary should recede rather than pair.",
    slots: ["secondary"],
    tokens: {
      ...inertTokens,
      "surface-hover":
        "color-mix(in srgb, var(--btn-cta-edge) 12%, transparent)",
    },
  },
  {
    /**
     * The chip is pinned to the trailing edge and the glyph is sized to sit
     * exactly on top of it: `glyph-size` 2.25rem against a `pad-end` of
     * 0.375rem puts the glyph's flex box over the chip's inset. Change one
     * without the other and the arrow drifts off its own square.
     *
     * IT HAS A GROUND OF ITS OWN, and it shipped without one. Transparent, in
     * the special slot, it read lighter than the ordinary primary sitting next
     * to it - which inverts the only reason the special slot exists. The tint
     * is mixed from the EDGE rather than from the fill: the fill is what the
     * chip is, so a button already wearing it would have nothing left to grow.
     *
     * AND THE ARROW IS COLOURED FOR THE CHIP, not for the button. At rest the
     * glyph is the one mark here standing on the fill instead of on the ground,
     * so it takes the fill's own label colour - which is also what every mark
     * gets once the chip has grown to the whole box, so one value covers both
     * halves of the gesture.
     */
    id: "chip-arrow",
    label: "Chip arrow",
    description:
      "A softly filled button carrying a solid square at its trailing edge, which grows to fill the whole button as the arrow steps forward.",
    slots: ["special"],
    tokens: {
      ...inertTokens,
      "pad-end": "0.375rem",
      surface: "color-mix(in srgb, var(--btn-cta-edge) 12%, transparent)",
      "surface-hover":
        "color-mix(in srgb, var(--btn-cta-edge) 12%, transparent)",
      "border-color": "var(--btn-cta-edge)",
      "border-color-hover": "var(--btn-cta-fill)",
      "ink-hover": "var(--btn-cta-label)",
      fill: "var(--btn-cta-fill)",
      "fill-inset": "0.375rem 0.375rem 0.375rem calc(100% - 2.625rem)",
      "fill-inset-hover": "0",
      glyph: "\"\\2192\"",
      "glyph-size": "2.25rem",
      "glyph-ink": "var(--btn-cta-label)",
      "glyph-hover": "3px 0",
      duration: "320ms",
    },
  },
  {
    id: "sweep-arrow",
    label: "Sweep arrow",
    description:
      "The filled button with an arrow after the label: the fill rises and the arrow steps forward together.",
    slots: ["special"],
    tokens: {
      ...inertTokens,
      surface: "var(--btn-cta-fill)",
      "surface-hover": "var(--btn-cta-fill)",
      ink: "var(--btn-cta-label)",
      "ink-hover": "var(--btn-cta-label)",
      fill: "var(--btn-cta-fill-hover)",
      "fill-rest": "0 100%",
      "fill-hover": "0 0",
      glyph: "\"\\2192\"",
      "glyph-hover": "4px 0",
      duration: "320ms",
    },
  },
  {
    id: "raised-arrow",
    label: "Raised arrow",
    description:
      "The filled button with an arrow, lifting onto the shared shadow as the arrow steps forward. The quietest of the three specials.",
    slots: ["special"],
    tokens: {
      ...inertTokens,
      surface: "var(--btn-cta-fill)",
      "surface-hover": "var(--btn-cta-fill-hover)",
      ink: "var(--btn-cta-label)",
      "ink-hover": "var(--btn-cta-label)",
      lift: "0 -3px",
      "shadow-hover": "var(--shadow-service)",
      glyph: "\"\\2192\"",
      "glyph-hover": "4px 0",
    },
  },
] as const satisfies readonly ButtonStyle[];

export type ButtonStyleId = (typeof buttonStyles)[number]["id"];

const stylesById = new Map<string, ButtonStyle>(
  buttonStyles.map((style) => [style.id, style]),
);

/**
 * The styles a slot may be assigned, in library order.
 *
 * Derived from each style's own `slots` rather than from three hand-written
 * lists, so adding a style to a slot is one edit at the style. The Style Guide's
 * three pickers are projections of this.
 */
export function buttonStylesForSlot(slot: ButtonStyleSlot) {
  return buttonStyles.filter((style) =>
    (style.slots as readonly ButtonStyleSlot[]).includes(slot),
  );
}

/**
 * The shipped assignment, and the draft's starting point.
 *
 * These must equal what the authored `:root` block in `globals.css` declares -
 * `button-style-agreement.test.ts` reads the stylesheet and compares, the same
 * way the motion defaults are pinned. Restating a default is how a "Reset"
 * quietly stops matching the stylesheet.
 *
 * Solid and Outline are chosen because they are what the two button variants
 * already looked like before this axis existed, so promoting an untouched
 * Style Guide changes nothing on any page.
 */
export const defaultButtonStyleSelection = {
  primary: "solid",
  secondary: "outline",
  special: "sweep-arrow",
} as const satisfies Record<ButtonStyleSlot, ButtonStyleId>;

export type ButtonStyleSelection = Record<ButtonStyleSlot, string>;

/**
 * WHERE A SLOT'S TOKENS ARE DECLARED, AND WHY IT IS NOT `:root`.
 *
 * This is the one thing about this axis that is easy to get wrong, was got
 * wrong, and fails in a way that looks like a colour bug rather than a scoping
 * one. **A custom property substitutes its `var()`s at the element where it is
 * DECLARED**, not where it is read. So a slot declared at `:root` as
 * `var(--btn-cta-fill)` resolves once, at the root, where no colour recipe
 * is in scope - it falls through to the brand accent, and every button on the
 * site then inherits that one already-resolved colour. The recipes set
 * `--live-cta-primary` far down the tree on the section frame, and nothing ever
 * reads it again.
 *
 * The symptom is a primary button that is the same colour on a red ground and a
 * navy one, which is exactly what shipped before this was understood. Nothing
 * errors, and the two light-ground recipes look correct throughout, because
 * their value happens to equal the root fallback.
 *
 * So the slots are declared ON THE BUTTONS. Each selector below sits inside the
 * recipe's subtree, where `--color-cta-*` has already inherited the right
 * answer, and the substitution happens there. This is also why the old
 * Tailwind-class buttons were correct: `bg-cta-primary` resolves at the element.
 *
 * The special is one rule with two selectors: the frame attribute, which is how
 * a section asks for it, and a bare class so the Style Guide can show a specimen
 * outside any frame. It is emitted LAST so it wins the tie with the primary on
 * the element that carries both.
 */
export const buttonSlotSelectors = {
  primary: [".button-cta-primary"],
  secondary: [".button-cta-secondary"],
  special: [
    '.pagebuilder-section-frame[data-pagebuilder-special-cta="on"] .button-cta-primary',
    ".button-cta-special",
  ],
} as const satisfies Record<ButtonStyleSlot, readonly string[]>;

/**
 * The declarations one slot contributes, in the vocabulary's order.
 *
 * Nothing is ever omitted, unlike the motion emitter: there is no
 * inherit-by-default token here, because a style states every dimension.
 */
export function buttonStyleDeclarationsForSlot(
  slot: ButtonStyleSlot,
  selection: ButtonStyleSelection | undefined,
): Array<[string, string]> {
  const resolved = normalizeButtonStyleSelection(selection);
  const style = stylesById.get(resolved[slot]);

  if (!style) {
    return [];
  }

  return buttonStyleTokenNames.map(
    (token) => [`--btn-${token}`, style.tokens[token]] as [string, string],
  );
}

/**
 * An assignment as CSS.
 *
 * ONE implementation, shared by the Style Guide's live preview and the promoted
 * block. Colour, radii and type each carry a hand-written near-copy of their
 * emitter in both places, those copies have already diverged, and nothing
 * asserts they match; motion refused to add a third and this refuses to add a
 * fourth.
 *
 * `scope` prefixes every selector, which is how the preview beats the promoted
 * block without depending on source order - a scoped selector is strictly more
 * specific. It is a constant at both call sites; nothing user-supplied reaches
 * this, and nothing user-supplied reaches the values either, which are the
 * registry's own.
 */
export function buttonStyleCss(
  selection: ButtonStyleSelection | undefined,
  { indent = "", scope = "" }: { indent?: string; scope?: string } = {},
) {
  return buttonStyleSlots
    .map((slot) => {
      const selectors = buttonSlotSelectors[slot]
        .map((selector) => `${indent}${scope ? `${scope} ` : ""}${selector}`)
        .join(",\n");
      const body = buttonStyleDeclarationsForSlot(slot, selection)
        .map(([name, value]) => `${indent}  ${name}: ${value};`)
        .join("\n");

      return `${selectors} {\n${body}\n${indent}}`;
    })
    .join("\n");
}

/**
 * Validate a posted or restored assignment.
 *
 * An unknown or retired id falls back to the shipped default for that slot
 * rather than throwing, for the reason the motion normaliser gives: a single
 * stale key from a slot saved before a style was renamed should not stop every
 * other token in the Style Guide from landing.
 *
 * A style assigned to a slot it does not declare is refused the same way. That
 * is not defensive padding - it is the only thing standing between the special
 * picker and an id typed into a saved slot by hand, and an id in the wrong slot
 * would emit a complete, valid, entirely wrong set of tokens.
 */
export function normalizeButtonStyleSelection(
  value: unknown,
): ButtonStyleSelection {
  const posted =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const normalized = {} as ButtonStyleSelection;

  for (const slot of buttonStyleSlots) {
    normalized[slot] = normalizeButtonStyleId(slot, posted[slot]);
  }

  return normalized;
}

export function normalizeButtonStyleId(slot: ButtonStyleSlot, value: unknown) {
  if (typeof value !== "string") {
    return defaultButtonStyleSelection[slot];
  }

  const style = stylesById.get(value.trim());

  if (!style || !(style.slots as readonly ButtonStyleSlot[]).includes(slot)) {
    return defaultButtonStyleSelection[slot];
  }

  return style.id;
}

export function buttonStyleById(id: string) {
  return stylesById.get(id);
}
