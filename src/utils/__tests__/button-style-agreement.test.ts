import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  buttonSlotSelectors,
  buttonStyleCss,
  buttonStyleDeclarationsForSlot,
  buttonStyleSlots,
  buttonStyleTokenNames,
  buttonStyles,
  buttonStylesForSlot,
  defaultButtonStyleSelection,
  normalizeButtonStyleSelection,
} from "@/content/button-styles";

/**
 * A BUTTON STYLE IS A STYLE GUIDE ASSIGNMENT, AND THIS IS WHAT KEEPS IT ONE.
 *
 * The same claim the motion agreement test defends, one axis over: no button
 * behaviour may exist that the Style Guide cannot author and promote. It is a
 * claim about three files that cannot see each other - the registry in
 * `button-styles.ts`, the anatomy in `globals.css`, and the two emitters - so
 * this is where they are made to agree.
 *
 * The failure this prevents is quiet in both directions. A token in the registry
 * that no rule reads is a dial connected to nothing: the picker moves, the
 * promotion lands, the page does not change. A token the anatomy reads that the
 * registry does not declare is worse - it resolves to nothing on every style, so
 * one dimension of every button silently falls back to the initial value.
 */

const beginMarker = "/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";
const endMarker = "/* END PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";

const rawCss = readFileSync(
  path.join(process.cwd(), "src", "app", "globals.css"),
  "utf8",
).replace(/\r\n?/g, "\n");

/**
 * The stylesheet WITHOUT whatever is currently promoted.
 *
 * Load-bearing for the same reason it is in the motion test: the promoted block
 * is spliced in at the end of the file, so it wins over the authored `:root` on
 * every token it names. Read naively, "the shipped default" would mean
 * "whatever was last promoted on this machine", and the defaults assertion below
 * would pass against any assignment at all.
 */
function withoutPromotedBlock(css: string) {
  const beginIndex = css.indexOf(beginMarker);
  const endIndex = css.indexOf(endMarker);

  if (beginIndex < 0 || endIndex < beginIndex) {
    return css;
  }

  return `${css.slice(0, beginIndex)}${css.slice(endIndex + endMarker.length)}`;
}

const authoredCss = withoutPromotedBlock(rawCss);
// Comments are source to a regex scan, and this file's anatomy note names half
// the token vocabulary in prose. `color-css-agreement` and
// `animation-marker-ownership` both learned this the same way.
const authoredRules = authoredCss.replace(/\/\*[\s\S]*?\*\//g, "");

/** The whole vocabulary. One flat set of names now: the three slots are three
 *  RULES declaring the same tokens, not three prefixed namespaces. */
const anatomyTokens = buttonStyleTokenNames.map((token) => `--btn-${token}`);

/**
 * The colour roles a style may name, declared by the anatomy on `.button-cta`.
 *
 * A separate layer from the vocabulary above, and it exists for one reason: they
 * are the only place a `--live-cta-*` lookup may happen, and it has to happen on
 * the button. See `noThemeTokensInStyleValues` below for what these replaced.
 */
const ctaRoleTokens = [
  "--btn-cta-fill",
  "--btn-cta-fill-hover",
  "--btn-cta-label",
  "--btn-cta-edge",
  "--btn-cta-edge-ink",
];

/** Every `--btn-*` custom property the authored stylesheet DECLARES. */
const declaredTokens = new Set(
  [...authoredRules.matchAll(/(--btn-[\w-]+)\s*:/g)].map((match) => match[1]),
);

/** Every `--btn-*` custom property the authored stylesheet READS. */
const referencedTokens = new Set(
  [...authoredRules.matchAll(/var\((--btn-[\w-]+)/g)].map((match) => match[1]),
);

describe("button style agreement", () => {
  /**
   * The registry's vocabulary against what the anatomy actually reads.
   *
   * This is the assertion that makes a style expressive rather than decorative:
   * a token here is a dimension a style may differ on, and it only counts if a
   * rule consumes it.
   */
  it("has an anatomy rule reading every token the registry declares", () => {
    const unread = anatomyTokens.filter(
      (token) => !referencedTokens.has(token),
    );

    expect(
      unread,
      "these are in `buttonStyleTokenNames` but no rule in globals.css reads them, so every style can set them and no button will change - either give the anatomy a rule that reads the token, or drop it from the vocabulary",
    ).toEqual([]);
  });

  /**
   * The other direction, and the more dangerous one.
   *
   * A plain `--btn-*` the anatomy reads but the registry never emits resolves to
   * nothing on every style at once. There is no fallback and no error: the
   * declaration goes invalid at computed-value time and that dimension of every
   * button on the site reverts to its initial value.
   */
  it("declares every plain token the anatomy reads", () => {
    const vocabulary = new Set<string>([...anatomyTokens, ...ctaRoleTokens]);
    const unknown = [...referencedTokens]
      .filter((token) => !vocabulary.has(token))
      .sort();

    expect(
      unknown,
      "globals.css reads these `--btn-*` tokens but no style declares them, so they resolve to nothing on every button - add them to `buttonStyleTokenNames` with a value on every style, or stop reading them",
    ).toEqual([]);
  });

  /**
   * NO STYLE MAY NAME A `--color-*` TOKEN. THIS IS THE ASSERTION THAT WOULD
   * HAVE CAUGHT THE BUG, AND IT IS WORTH READING BEFORE WRITING A STYLE.
   *
   * `--color-cta-primary` and its neighbours live in Tailwind's `@theme inline`
   * block, which emits them as `:root` custom properties. A custom property
   * substitutes its `var()`s where it is DECLARED, so `--color-cta-primary`
   * resolves `--live-cta-primary` at the root - outside every colour recipe -
   * and computes to the brand accent for the whole document. Tailwind's own
   * utilities are fine because `inline` means it substitutes the VALUE into the
   * generated utility, so `bg-cta-primary` expands to the full chain and
   * resolves at the element. Hand-written CSS reading the token does not get
   * that, and there is no way to tell the two apart by reading them.
   *
   * Measured, after this shipped: with a brand recipe on the frame,
   * `--live-cta-primary` is `#fff` at the button while `--color-cta-primary` is
   * `#007cbd` both at the button and at the root. Every button on the site was
   * the same blue on every ground, and nothing errored.
   *
   * So a style names one of the five `--btn-cta-*` roles, which `.button-cta`
   * declares from the `--live-*` chain on the button itself.
   */
  it("names no @theme token in any style value", () => {
    const offenders = buttonStyles.flatMap((style) =>
      buttonStyleTokenNames
        .filter((token) => style.tokens[token].includes("var(--color-"))
        .map((token) => `${style.id}.${token}`),
    );

    expect(
      offenders,
      "these read a `--color-*` theme token, which is frozen at :root and cannot see the section's colour recipe - use one of the `--btn-cta-*` roles instead",
    ).toEqual([]);
  });

  /** The five roles exist, and are declared on the button rather than at the
   *  root, which is the whole point of them. */
  it("declares the cta roles on the button", () => {
    const anatomyRule = [...authoredRules.matchAll(/([^{}]*)\{([^{}]*)\}/g)].find(
      ([, selector]) => selector.trim() === ".button-cta",
    );

    expect(anatomyRule, "globals.css has no `.button-cta` rule").toBeDefined();

    for (const role of ctaRoleTokens) {
      expect(
        anatomyRule?.[2].includes(`${role}:`),
        `${role} must be declared on .button-cta so its --live-* lookup happens inside the recipe's subtree`,
      ).toBe(true);
    }
  });

  /**
   * NO SLOT MAY BE DECLARED AT `:root`, AND THIS IS THE ASSERTION THAT SHIPPED
   * BROKEN WITHOUT.
   *
   * A custom property substitutes its `var()`s at the element where it is
   * declared. Declared at `:root`, `--btn-surface: var(--color-cta-primary)`
   * resolves there - outside every colour recipe - and every button on the site
   * inherits that one already-resolved colour. The primary came out the same
   * blue on a red ground and a navy one, nothing errored, and the two
   * light-ground recipes looked perfect throughout because their answer happens
   * to equal the root fallback.
   *
   * A test cannot see a colour. It can see that the declaration is not somewhere
   * it can never be scoped from, which is the whole of the mistake.
   */
  it("declares no slot token at :root", () => {
    const rootBodies = [...authoredRules.matchAll(/([^{}]*)\{([^{}]*)\}/g)]
      .filter(([, selector]) => selector.trim().split(",").some((part) => part.trim() === ":root"))
      .map(([, , body]) => body);

    for (const body of rootBodies) {
      const declared = [...body.matchAll(/(--btn-[\w-]+)\s*:/g)].map(
        (match) => match[1],
      );

      expect(
        declared,
        "a button token declared at :root resolves its colours outside every recipe and freezes every button on the site to one ground's answer - declare it on the buttons instead",
      ).toEqual([]);
    }
  });

  /**
   * Each slot declares the WHOLE vocabulary, on its own selector.
   *
   * A slot rule that misses one token leaves that dimension resolving to
   * whatever the previous rule left, so the miss shows up as one property of one
   * role behaving unlike the other two - the kind of bug that gets blamed on the
   * style rather than on the wiring.
   */
  it.each(buttonStyleSlots)("declares every token for the %s slot", (slot) => {
    const selector = buttonSlotSelectors[slot][0];
    const rule = [...authoredRules.matchAll(/([^{}]*)\{([^{}]*)\}/g)].find(
      ([, ruleSelector]) =>
        ruleSelector
          .trim()
          .split(",")
          .some((part) => part.trim() === selector),
    );

    expect(rule, `globals.css has no rule for ${selector}`).toBeDefined();

    const missing = buttonStyleTokenNames.filter(
      (token) => !rule?.[2].includes(`--btn-${token}:`),
    );

    expect(
      missing,
      `the ${slot} rule in globals.css does not declare these, so that dimension falls through to whichever rule declared it last`,
    ).toEqual([]);
  });

  /**
   * The special is delivered by the frame attribute and by nothing else.
   *
   * This is the axis's whole ownership claim in one assertion. If the special
   * assignment were ever declared outside that gate - on a component class, on a
   * section, on a mode - a section would be choosing a button style, which is
   * the thing the Style Guide exists to prevent.
   */
  it("gates the special slot on the frame attribute", () => {
    expect(
      authoredRules,
      "the special slot must be delivered by the section frame's attribute",
    ).toContain('[data-pagebuilder-special-cta="on"]');

    for (const selector of buttonSlotSelectors.special) {
      expect(
        selector.includes('[data-pagebuilder-special-cta="on"]') ||
          selector === ".button-cta-special",
        `"${selector}" carries the special assignment without being gated on the frame attribute`,
      ).toBe(true);
    }
  });

  /**
   * The shipped assignment matches what the stylesheet authors, rule for rule.
   *
   * Pinned rather than read back at runtime: `getComputedStyle` only works in a
   * browser, and the promoted block would win over the authored one anyway - so
   * "default" would silently come to mean "whatever was last promoted".
   */
  it.each(buttonStyleSlots)("authors the shipped %s style", (slot) => {
    for (const [name, value] of buttonStyleDeclarationsForSlot(
      slot,
      defaultButtonStyleSelection,
    )) {
      expect(
        declaredTokens.has(name),
        `${name} is emitted by the default assignment but never authored in globals.css`,
      ).toBe(true);

      expect(
        authoredRules,
        `the authored value for ${name} does not match the shipped ${slot} style - Reset would move the site off what the stylesheet ships`,
      ).toContain(`${name}: ${value};`);
    }
  });

  /**
   * One emitter, shared by the live preview and the promoted block.
   *
   * Colour, radii and type each carry a hand-written near-copy in both places,
   * those copies have already diverged, and nothing asserts they match. Motion
   * refused to add a third; this refuses to add a fourth.
   *
   * The scoped form is the preview's, and the assertion that matters about it is
   * that scoping changes the SELECTORS and nothing else - a preview that quietly
   * emitted different values would be a Style Guide showing you something the
   * promotion will not produce.
   */
  it("previews exactly what it promotes", () => {
    const promoted = buttonStyleCss(defaultButtonStyleSelection);
    const previewed = buttonStyleCss(defaultButtonStyleSelection, {
      scope: ".style-guide-button-surface",
    });

    expect(previewed.replace(/\.style-guide-button-surface /g, "")).toBe(
      promoted,
    );
  });

  /**
   * Every style answers every token.
   *
   * `satisfies` already makes an omission a compile error; this is the runtime
   * half, and it also catches an empty string - which is not an omission to the
   * compiler and IS one to CSS. An empty custom property makes every `var()`
   * reading it invalid at computed-value time rather than taking a fallback.
   */
  it("gives every style a complete, non-empty token set", () => {
    for (const style of buttonStyles) {
      for (const token of buttonStyleTokenNames) {
        expect(
          style.tokens[token],
          `${style.id} leaves ${token} empty, which poisons the rule that reads it rather than inheriting anything`,
        ).toBeTruthy();
      }
    }
  });

  /** Ids are persisted, so two styles may never share one. */
  it("keeps style ids unique", () => {
    const ids = buttonStyles.map((style) => style.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  /** Every slot has something to offer, or its picker renders empty. */
  it.each(buttonStyleSlots)("offers at least one style for %s", (slot) => {
    expect(buttonStylesForSlot(slot).length).toBeGreaterThan(0);
  });

  /**
   * The normaliser refuses an id in the wrong slot.
   *
   * Not defensive padding: it is the only thing between a hand-edited saved slot
   * and a complete, valid, entirely wrong set of tokens. An outline assigned to
   * the primary slot emits nothing malformed - it just makes every primary
   * button on the site an outline, with no picker able to show you why.
   */
  it("refuses a style assigned to a slot it does not declare", () => {
    const secondaryOnly = buttonStyles.find(
      (style) =>
        style.slots.length === 1 && style.slots[0] === "secondary",
    );

    expect(secondaryOnly).toBeDefined();
    expect(
      normalizeButtonStyleSelection({ primary: secondaryOnly?.id }).primary,
    ).toBe(defaultButtonStyleSelection.primary);
  });

  /** An unknown or retired id falls back rather than throwing, so one stale key
   *  from an old saved slot cannot stop every other token from promoting. */
  it("falls back for an unknown id", () => {
    expect(normalizeButtonStyleSelection({ special: "no-such-style" })).toEqual(
      defaultButtonStyleSelection,
    );
    expect(normalizeButtonStyleSelection(undefined)).toEqual(
      defaultButtonStyleSelection,
    );
  });
});
