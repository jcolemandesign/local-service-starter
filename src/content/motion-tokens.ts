/**
 * THE MOTION TOKENS, GROUPED BY WHAT AUTHORS THEM.
 *
 * Every number the animation library moves on is a CSS custom property in
 * `globals.css`, and every one of them is authored here - which is what makes
 * motion a real Style Guide axis rather than a hand edit to a stylesheet.
 *
 * THE RULE THIS FILE EXISTS TO ENFORCE. No animation may exist whose live
 * behaviour cannot be authored and promoted through the Style Guide. Every
 * suite in `section-animations.ts` declares which group or groups author it
 * (`controlGroups`, a required field), and a suite whose motion model cannot
 * reasonably use an existing group must bring its own group and its own tokens
 * with it. `motion-token-agreement.test.ts` checks that in both directions: a
 * token declared in the stylesheet with no control here, and a control here
 * whose token the stylesheet never reads, both fail.
 *
 * WHY THIS IS DATA RATHER THAN CONTROLS. The draft's starting values, the live
 * preview's inline custom properties, the promoted CSS block, the validators
 * and the Style Guide's own panels are all derived from the array below. Written
 * out by hand in five places instead, they drift while all five look right -
 * the same reasoning that already made `styleFieldOptions.animation` a
 * projection of the suite registry rather than a literal list. When an axis
 * grows structure, the list stops being the source of truth and becomes a view
 * of it.
 *
 * WHAT THIS FILE IS NOT AUTHORITATIVE OVER. It owns the token names, the
 * groups, the shipped defaults and the ranges. It does not own the movement -
 * that is a selector and a keyframe, and it lives in `globals.css`. The same
 * accepted gap `section-animations.ts` documents applies here: this file can
 * say a token is Pulse's while the stylesheet reads it somewhere else. The
 * agreement test narrows that to the part that is checkable.
 */

/**
 * How a control is edited, and how its value is validated.
 *
 * The stored value is always the COMPLETE CSS VALUE - `"620ms"`, not `620` -
 * because it is written straight into a stylesheet and into an inline style.
 * Carrying the unit separately means two places can disagree about what a bare
 * number meant, and the one that gets it wrong emits a valid-looking
 * declaration that paints nothing.
 */
export type MotionTokenKind = "ms" | "px" | "percent" | "ratio" | "easing";

export type MotionEasingPreset = {
  label: string;
  value: string;
};

export type MotionTokenControl = {
  /** The CSS custom property this control authors. The only key anything uses. */
  token: `--anim-${string}`;
  label: string;
  /** One line, shown under the control. Says what the number does, not what it is. */
  hint: string;
  kind: MotionTokenKind;
  /**
   * The shipped value, which must equal what `globals.css` declares.
   *
   * Pinned rather than read at runtime. The gallery used to read its defaults
   * out of `getComputedStyle`, on the correct instinct that restating a default
   * is how a "Reset" quietly stops matching the stylesheet - but that only
   * works in a browser, and the promoted block would win over the authored one
   * anyway, so "default" would have meant "whatever was last promoted". The
   * test reads the AUTHORED block and compares, which gets the same guarantee
   * without needing a DOM.
   *
   * `""` is legal and means inherit - see `inheritsFrom`.
   */
  defaultValue: string;
  /** Numeric kinds only. Bounds are enforced by the validator, not just the input. */
  min?: number;
  max?: number;
  step?: number;
  /** Easing kind only. An allowlist, which is also what keeps the value safe. */
  presets?: readonly MotionEasingPreset[];
  /**
   * This token falls back to another one when unset, so `""` is a real authored
   * value meaning "keep time with that".
   *
   * The promoted block OMITS the declaration entirely in that case rather than
   * emitting it empty. An empty custom property makes every `var()` reading it
   * invalid at computed-value time instead of taking its fallback, so an empty
   * emission would not inherit - it would break the rule that reads it. Same
   * reason `--live-cta-accent` is omitted rather than blanked.
   *
   * The stylesheet has to hold up its half: the rule must read
   * `var(<token>, var(<inheritsFrom>))`. The agreement test checks that.
   */
  inheritsFrom?: `--anim-${string}`;
};

export type MotionControlGroupId =
  | "rhythm"
  | "wipe"
  | "pulse"
  | "lateral"
  | "focus";

export type MotionControlGroup = {
  id: MotionControlGroupId;
  label: string;
  description: string;
  controls: readonly MotionTokenControl[];
};

/**
 * The shared out-curve and its neighbours.
 *
 * An allowlist rather than a free bezier field, for two reasons. The value is
 * written into a stylesheet, so an unconstrained string is an injection
 * surface. And the question these answer is "is the default the right curve?",
 * which four named answers put better than a four-number field does.
 */
const travelEasingPresets = [
  { label: "Decisive (default)", value: "cubic-bezier(0.22, 1, 0.36, 1)" },
  { label: "Soft", value: "cubic-bezier(0.33, 1, 0.68, 1)" },
  { label: "Sharp", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
  { label: "Linear", value: "linear" },
] as const;

/**
 * Focus's curves, and they are a different list on purpose.
 *
 * A suite earns its own curve when it drives something that is not a travel.
 * Rise, Wipe, Pulse and Lateral all move translate, clip or scale, where
 * front-loading is right - the unit arrives, then settles. Focus drives a blur,
 * where front-loading throws the duration away: the shared curve puts ~85% of
 * the progress in the first third, so a 620ms entrance is perceptually about a
 * third of that and the rest is a tail nobody can see.
 *
 * "Symmetric" is the next lever if "Even" still reads short - it spreads
 * progress the most evenly, at the risk of a slow start. The shared curve is
 * offered too, so the choice to differ stays visible as a choice.
 */
const focusEasingPresets = [
  { label: "Even (default)", value: "cubic-bezier(0.4, 0, 0.2, 1)" },
  { label: "Symmetric", value: "cubic-bezier(0.33, 0, 0.67, 1)" },
  { label: "Decisive (shared curve)", value: "cubic-bezier(0.22, 1, 0.36, 1)" },
  { label: "Linear", value: "linear" },
] as const;

/**
 * The groups.
 *
 * `as const satisfies` rather than a plain annotation, and it is load-bearing
 * for the same reason it is on `sectionAnimationSuites`: a bare
 * `MotionControlGroup[]` collapses `token` to `string`, and takes
 * `MotionTokenName` with it.
 */
export const motionControlGroups = [
  {
    id: "rhythm",
    label: "Shared rhythm",
    description:
      "One answer for every suite. Duration, stagger, distance and easing are the rhythm of the library — what differs between suites is the shape of the arrival, not its tempo.",
    controls: [
      {
        token: "--anim-reveal-duration",
        label: "Duration",
        hint: "How long one unit takes to arrive.",
        kind: "ms",
        defaultValue: "620ms",
        min: 120,
        max: 1600,
        step: 20,
      },
      {
        token: "--anim-reveal-delay-step",
        label: "Stagger",
        hint: "Added per reveal index, so a row of cards arrives in reading order.",
        kind: "ms",
        defaultValue: "90ms",
        min: 0,
        max: 400,
        step: 10,
      },
      {
        token: "--anim-reveal-distance",
        label: "Distance",
        hint: "How far a rising unit travels. Distance is what makes a short movement register.",
        kind: "px",
        defaultValue: "28px",
        min: 0,
        max: 120,
        step: 2,
      },
      {
        token: "--anim-reveal-easing",
        label: "Easing",
        hint: "The shared travel curve. Front-loaded, so a unit reads as arriving and settling rather than drifting.",
        kind: "easing",
        defaultValue: "cubic-bezier(0.22, 1, 0.36, 1)",
        presets: travelEasingPresets,
      },
    ],
  },
  {
    id: "wipe",
    label: "Wipe",
    description:
      "The edge crossing the headline. Wipe reuses the shared rhythm and owns only what has no equivalent in Rise.",
    controls: [
      {
        token: "--anim-wipe-duration",
        label: "Wipe duration",
        hint: "Unset, the edge keeps time with the shared rhythm. Give the wipe its own length only if it needs to be read along more of its travel than a fade does.",
        kind: "ms",
        defaultValue: "",
        min: 120,
        max: 1600,
        step: 20,
        inheritsFrom: "--anim-reveal-duration",
      },
      {
        token: "--anim-accent-scale-from",
        label: "Accent scale from",
        hint: "Where an accent unit starts before scaling up. A scale is not a travel, so it gets its own number rather than the shared distance.",
        kind: "ratio",
        defaultValue: "0.94",
        min: 0.8,
        max: 1,
        step: 0.01,
      },
    ],
  },
  {
    id: "pulse",
    label: "Pulse",
    description:
      "The beat the action block gives once everything has landed. One beat, never a loop — a looping CTA never stops asking.",
    controls: [
      {
        token: "--anim-pulse-scale",
        label: "Beat scale",
        hint: "How far the action block grows. Larger than this and a wide card reads as the layout twitching.",
        kind: "ratio",
        defaultValue: "1.03",
        min: 1,
        max: 1.15,
        step: 0.005,
      },
      {
        token: "--anim-pulse-duration",
        label: "Beat duration",
        hint: "How long the beat takes. Slower than this and it reads as a breath rather than a tap.",
        kind: "ms",
        defaultValue: "620ms",
        min: 120,
        max: 1600,
        step: 20,
      },
      {
        token: "--anim-pulse-delay",
        label: "Beat delay",
        hint: "The pause after the section lands before the beat starts. Added to the shared duration, not counted from zero.",
        kind: "ms",
        defaultValue: "180ms",
        min: 0,
        max: 600,
        step: 20,
      },
    ],
  },
  {
    id: "lateral",
    label: "Lateral",
    description:
      "The panel arriving from its own edge. Two travels in two different units, because they answer two different questions.",
    controls: [
      {
        token: "--anim-lateral-distance",
        label: "Unit travel",
        hint: "How far an ordinary unit slides. Ships at zero: the suite's idea is that one panel travels and everything else fades in place.",
        kind: "px",
        defaultValue: "0px",
        min: 0,
        max: 120,
        step: 2,
      },
      {
        token: "--anim-lateral-media-distance",
        label: "Media travel",
        hint: "How far a media panel slides, as a share of its own width. A percentage is the only unit that means “my own edge” whatever size I am.",
        kind: "percent",
        defaultValue: "100%",
        min: 0,
        max: 100,
        step: 5,
      },
    ],
  },
  {
    id: "focus",
    label: "Focus",
    description:
      "The blur resolving. Focus is the one suite that drives something other than a travel, which is why it owns a curve — and may own a tempo — of its own.",
    controls: [
      {
        token: "--anim-focus-easing",
        label: "Blur easing",
        hint: "Focus's own curve. The shared easing control does not touch this, and must not: every other suite would give the same answer and this one would be wrong.",
        kind: "easing",
        defaultValue: "cubic-bezier(0.4, 0, 0.2, 1)",
        presets: focusEasingPresets,
      },
      {
        token: "--anim-focus-blur",
        label: "Blur amount",
        hint: "How far out of focus a unit starts. Much more and the first frames are an unreadable grey block, which is worse than not animating.",
        kind: "px",
        defaultValue: "10px",
        min: 0,
        max: 32,
        step: 1,
      },
      {
        token: "--anim-focus-duration",
        label: "Blur duration",
        hint: "Unset, the blur keeps time with the shared rhythm. Give it its own length only if the blur still reads short after the curve is right.",
        kind: "ms",
        defaultValue: "",
        min: 120,
        max: 1600,
        step: 20,
        inheritsFrom: "--anim-reveal-duration",
      },
    ],
  },
] as const satisfies readonly MotionControlGroup[];

export type MotionTokenName =
  (typeof motionControlGroups)[number]["controls"][number]["token"];

/** Every control, flattened. The draft is keyed by `control.token`.
 *
 *  Widened to `MotionTokenControl[]` inside the callback rather than at the
 *  annotation: `as const` makes each group's `controls` a tuple of distinct
 *  literal types, and `flatMap` tries to unify them into one element type
 *  instead of a union. The widening is where the literal types stop being
 *  useful, not a loosening of them - `MotionTokenName` above is still derived
 *  from the const tuple. */
export const motionTokenControls: readonly MotionTokenControl[] =
  motionControlGroups.flatMap(
    (group) => [...group.controls] as MotionTokenControl[],
  );

const controlsByToken = new Map(
  motionTokenControls.map((control) => [control.token as string, control]),
);

export function motionTokenControl(token: string) {
  return controlsByToken.get(token);
}

/** The shipped values, and the draft's starting point. */
export const defaultMotionTokens: Record<string, string> = Object.fromEntries(
  motionTokenControls.map((control) => [control.token, control.defaultValue]),
);

/**
 * Custom properties in the order the groups declare them.
 *
 * ONE implementation, shared by the live preview's inline style and the
 * promoted CSS block. Those two already exist as hand-written near-copies for
 * colour, radii and type, they already diverge, and nothing asserts they match.
 * Motion does not add a third copy of that problem.
 *
 * A token whose value is empty is OMITTED, not emitted blank - see
 * `inheritsFrom`.
 */
export function motionTokenDeclarations(
  tokens: Record<string, string> | undefined,
): Array<[string, string]> {
  const resolved = tokens ?? {};

  return motionTokenControls.flatMap((control) => {
    const value = resolved[control.token] ?? control.defaultValue;

    if (!value) {
      return [];
    }

    return [[control.token as string, value] as [string, string]];
  });
}

const numericPattern: Record<Exclude<MotionTokenKind, "easing">, RegExp> = {
  ms: /^(\d{1,5})ms$/,
  px: /^(\d{1,4})px$/,
  percent: /^(\d{1,3})%$/,
  ratio: /^(\d(?:\.\d{1,3})?)$/,
};

const unitFor: Record<Exclude<MotionTokenKind, "easing">, string> = {
  ms: "ms",
  px: "px",
  percent: "%",
  ratio: "",
};

/** The number inside a stored value, for driving a range input. */
export function motionTokenNumber(control: MotionTokenControl, value: string) {
  if (control.kind === "easing") {
    return 0;
  }

  const match = numericPattern[control.kind].exec(value);

  return match ? Number(match[1]) : Number.NaN;
}

/** The stored value for a number off a range input. */
export function motionTokenValue(control: MotionTokenControl, value: number) {
  if (control.kind === "easing") {
    return control.defaultValue;
  }

  const clamped = Math.min(
    control.max ?? value,
    Math.max(control.min ?? value, value),
  );
  // Trailing zeros off the ratio kind: `1.030` and `1.03` are the same
  // declaration, and only one of them matches the shipped default, so a draft
  // carrying the other reports as changed forever.
  const rounded = Number(clamped.toFixed(3));

  return `${rounded}${unitFor[control.kind]}`;
}

/**
 * The value a control starts at when inheritance is switched off.
 *
 * Whatever it would have inherited, so turning the toggle off changes nothing
 * you can see until you move the slider. A control that jumps the moment you
 * enable it reads as having done something you did not ask for.
 */
export function motionTokenInheritedValue(control: MotionTokenControl) {
  if (!control.inheritsFrom) {
    return control.defaultValue;
  }

  return motionTokenControl(control.inheritsFrom)?.defaultValue ?? "";
}

/**
 * Validate a posted token map.
 *
 * Unknown names are dropped and bad values fall back to the shipped default
 * rather than throwing, because the alternative is a whole promotion failing on
 * one stale key from an old saved slot. A malformed value is a value nobody can
 * see; a refused promotion is every other token not landing either.
 *
 * The value goes into a stylesheet, so the grammars are exact and easings are
 * an allowlist. There is no shape of input here that can close a declaration
 * and open another one.
 */
export function normalizeMotionTokens(value: unknown): Record<string, string> {
  const posted =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const normalized: Record<string, string> = {};

  for (const control of motionTokenControls) {
    normalized[control.token] = normalizeMotionToken(
      control,
      posted[control.token],
    );
  }

  return normalized;
}

function normalizeMotionToken(control: MotionTokenControl, value: unknown) {
  if (typeof value !== "string") {
    return control.defaultValue;
  }

  const trimmed = value.trim();

  // Empty is only meaningful where the stylesheet has a fallback to inherit
  // from. Anywhere else it would emit nothing and leave the rule reading a
  // token that does not exist.
  if (trimmed === "") {
    return control.inheritsFrom ? "" : control.defaultValue;
  }

  if (control.kind === "easing") {
    const allowed = control.presets?.some(
      (preset) => preset.value === trimmed,
    );

    return allowed ? trimmed : control.defaultValue;
  }

  const match = numericPattern[control.kind].exec(trimmed);

  if (!match) {
    return control.defaultValue;
  }

  return motionTokenValue(control, Number(match[1]));
}
