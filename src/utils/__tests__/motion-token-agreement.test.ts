import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildStyleVariables,
  defaultStyleGuideTokenDraft,
} from "@/components/sections/StyleGuideLiveSurface";
import {
  type MotionControlGroup,
  defaultMotionTokens,
  motionControlGroups,
  motionTokenControls,
  motionTokenDeclarations,
  normalizeMotionTokens,
} from "@/content/motion-tokens";
import { sectionAnimationSuites } from "@/content/section-animations";

/**
 * MOTION IS A REAL STYLE GUIDE AXIS, AND THIS IS WHAT KEEPS IT ONE.
 *
 * The axis shipped with rhythm controls that were React state on the gallery's
 * own element: they cascaded to the specimens inside and stopped there, saved
 * nothing, reached no page, and reset on reload. Promoting was a hand edit to
 * `globals.css`, and the gap between "I changed the easing" and "the page still
 * shows the default" cost two round trips before anyone found the cause.
 *
 * So the rule is now: no animation may exist whose live behaviour cannot be
 * authored and promoted through the Style Guide. That is a claim about three
 * files at once - the registry, the stylesheet and the two emitters - and none
 * of them can see the others. This test is where they are made to agree.
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
 * Load-bearing, and the subtlest thing in this file. The promoted block is
 * spliced in at the END of `globals.css`, so it wins over the authored `:root`
 * on every token it names. Read naively, "the shipped default" would mean
 * "whatever was last promoted on this machine" - the defaults assertion below
 * would pass against any value at all, and `Reset` would drift from the
 * stylesheet exactly the way the deleted `getComputedStyle` reader could have.
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
const authoredRules = authoredCss.replace(/\/\*[\s\S]*?\*\//g, "");

/** Every `--anim-*` custom property the authored stylesheet DECLARES. */
const declaredTokens = new Set(
  [...authoredRules.matchAll(/(--anim-[\w-]+)\s*:/g)].map((match) => match[1]),
);

/** Every `--anim-*` custom property the authored stylesheet READS. */
const referencedTokens = new Set(
  [...authoredRules.matchAll(/var\((--anim-[\w-]+)/g)].map((match) => match[1]),
);

const registeredTokens = new Set(
  motionTokenControls.map((control) => control.token as string),
);

/**
 * Tokens that are COMPOSED inside a rule rather than authored at `:root`.
 *
 * Each is calculated from tokens that ARE authorable, so exposing a control for
 * it would offer a value that the next repaint overwrites. Listed by name and
 * asserted to be exactly this set, so the list cannot quietly become a place to
 * hide a value nobody can reach.
 */
const derivedTokens = new Map([
  [
    "--anim-beat-delay",
    "composed from the shared duration plus the pulse delay, so the beat starts after the section lands rather than at a time of its own",
  ],
  [
    "--anim-lateral-size",
    "assigned per role - zero by default, the media distance for a media panel - so it is the role rule's output, not an input",
  ],
  [
    "--anim-lateral-sign",
    "the direction, flipped by the section's own `reveal-from-end` hint; a Style Guide control would fight the section that set it",
  ],
  [
    "--anim-lateral-travel",
    "the product of size and sign, which is the whole reason those two are separate",
  ],
]);

describe("motion token agreement", () => {
  /**
   * The registry's defaults ARE the stylesheet's defaults.
   *
   * The gallery used to read these out of `getComputedStyle`, on the correct
   * instinct that restating a default is how a "Reset" quietly stops matching
   * the stylesheet. That only worked in a browser, and it read the promoted
   * block rather than the authored one. Comparing against the authored source
   * gets the same guarantee with none of that.
   */
  it("ships the same defaults the stylesheet declares", () => {
    for (const control of motionTokenControls) {
      if (control.inheritsFrom) {
        continue;
      }

      const declaration = new RegExp(
        `${control.token}\\s*:\\s*([^;]+);`,
      ).exec(authoredRules);

      expect(
        declaration,
        `${control.token} is offered as a control but the authored :root never declares it`,
      ).not.toBeNull();
      expect(
        declaration?.[1].trim(),
        `${control.token}'s shipped default differs from the stylesheet, so "Reset" would move the value instead of restoring it`,
      ).toBe(control.defaultValue);
    }
  });

  /**
   * A token that inherits is NOT declared, and that is the whole mechanism.
   *
   * Unset has to mean "keep time with the shared rhythm", which only works if
   * the rule reads `var(<token>, var(<inherited>))` and nothing declares the
   * token at `:root`. Declare it and the fallback becomes unreachable; emit it
   * empty and every `var()` reading it turns invalid at computed-value time,
   * which is worse than either.
   */
  it("leaves an inheriting token undeclared and gives it a fallback", () => {
    for (const control of motionTokenControls) {
      if (!control.inheritsFrom) {
        continue;
      }

      expect(
        control.defaultValue,
        `${control.token} inherits, so its shipped default must be empty - a value here would silently decouple it from ${control.inheritsFrom}`,
      ).toBe("");
      expect(
        declaredTokens,
        `${control.token} is declared at :root, which makes its fallback to ${control.inheritsFrom} unreachable`,
      ).not.toContain(control.token as string);
      expect(
        authoredRules.replace(/\s+/g, " "),
        `${control.token} is read without a fallback to ${control.inheritsFrom}, so leaving it unset resolves to nothing rather than to the shared value`,
      ).toContain(`var(${control.token}, var(${control.inheritsFrom}))`);
    }
  });

  /**
   * THE ASSERTION THE WHOLE REWRITE IS FOR.
   *
   * Every number the stylesheet animates on is authorable. A token declared
   * with no control is a behaviour that can only be changed by editing CSS,
   * which is the state this axis was in; a control whose token nothing reads is
   * the failure this project names everywhere else - one that appears to work
   * and paints nothing. `--anim-lateral-distance` was the second kind for the
   * whole life of the Lateral suite, and no test caught it because the token
   * list was written by hand.
   */
  it("gives every animation token a control, and every control a token", () => {
    // Both halves of this pass trivially if the parse found nothing - a changed
    // comment style or a renamed marker would turn the whole assertion into a
    // comparison of two empty arrays, and it would go on passing. The counts are
    // deliberately loose: they are a smoke alarm, not a second registry.
    expect(
      declaredTokens.size,
      "no --anim-* declarations were parsed out of globals.css at all, so this test is asserting nothing",
    ).toBeGreaterThan(8);
    expect(
      referencedTokens.size,
      "no --anim-* references were parsed out of globals.css at all, so this test is asserting nothing",
    ).toBeGreaterThan(8);

    const unauthorable = [...declaredTokens].filter(
      (token) => !registeredTokens.has(token) && !derivedTokens.has(token),
    );

    expect(
      unauthorable.sort(),
      "these tokens are declared in globals.css but no Style Guide control authors them, so their behaviour can only be changed by hand-editing the stylesheet",
    ).toEqual([]);

    const unread = motionTokenControls
      .map((control) => control.token as string)
      .filter((token) => !referencedTokens.has(token));

    expect(
      unread.sort(),
      "these tokens have a Style Guide control but the stylesheet never reads them, so authoring and promoting one would change nothing on any page",
    ).toEqual([]);
  });

  /**
   * The derived list is real exceptions only.
   *
   * Both directions, so it cannot go stale in either: an entry for a token that
   * no longer exists, and - the one that matters - a token quietly added to the
   * list to get past the assertion above.
   */
  it("keeps the derived-token list honest", () => {
    for (const [token] of derivedTokens) {
      expect(
        referencedTokens,
        `${token} is listed as derived but the stylesheet never reads it - the entry is stale`,
      ).toContain(token);
      expect(
        registeredTokens,
        `${token} is listed as derived AND registered as a control; it can only be one`,
      ).not.toContain(token);
    }
  });

  /**
   * Every suite names a group, every named group exists, and every group is
   * claimed.
   *
   * The third direction is the one that catches a group left behind by a
   * retired suite - controls that still render, still promote, and move nothing.
   */
  it("ties every suite to a control group", () => {
    const groupIds = new Set(motionControlGroups.map((group) => group.id));
    const claimed = new Set<string>();

    for (const suite of sectionAnimationSuites) {
      expect(
        suite.controlGroups.length,
        `suite "${suite.id}" (${suite.label}) names no control group, so nothing in the Style Guide authors it`,
      ).toBeGreaterThan(0);

      for (const groupId of suite.controlGroups) {
        expect(
          groupIds,
          `suite "${suite.id}" names control group "${groupId}", which does not exist in motion-tokens.ts`,
        ).toContain(groupId);
        claimed.add(groupId);
      }
    }

    const orphans = [...groupIds].filter((groupId) => !claimed.has(groupId));

    expect(
      orphans.sort(),
      "these control groups are offered in the Style Guide but no suite consumes them, so they author tokens nothing can be made to use",
    ).toEqual([]);
  });

  /**
   * Focus's curve is Focus's alone.
   *
   * The gallery's old single easing picker set BOTH easing tokens at once,
   * because it was the only control and the blur was the one arrival whose curve
   * was in question. With a real Focus group that workaround is wrong: a shared
   * control that overwrote Focus's curve would make the distinction the suite
   * exists to express unauthorable.
   */
  it("keeps the shared easing out of the focus group", () => {
    const rhythm = motionControlGroups.find((group) => group.id === "rhythm");
    const focus = motionControlGroups.find((group) => group.id === "focus");

    // Compared as strings. The `as const` registry makes each group's token
    // union so narrow that TypeScript proves this comparison can never hold and
    // rejects it - which is the invariant being enforced a second time, at
    // compile time. The runtime check stays because the type only holds while
    // both groups are literal tuples.
    const authors = (group: MotionControlGroup | undefined, token: string) =>
      group?.controls.some((control) => (control.token as string) === token);

    expect(
      authors(rhythm, "--anim-focus-easing"),
      "the shared rhythm group authors Focus's curve, so setting the shared easing would overwrite the one curve that is deliberately different",
    ).toBe(false);
    expect(
      authors(focus, "--anim-focus-easing"),
      "nothing authors --anim-focus-easing, so the blur's curve can only be changed by editing the stylesheet",
    ).toBe(true);
  });

  /**
   * THE TWO EMITTERS AGREE.
   *
   * `buildStyleVariables` paints the live preview and `buildOverrideBlock`
   * writes the promoted block, and they are hand-written near-copies for colour,
   * radii and type - they already diverge on how a zero shadow is expressed, and
   * nothing asserts they match. Motion routes both through
   * `motionTokenDeclarations`, and this pins that: what you judged in the
   * gallery is what lands in the stylesheet.
   */
  it("emits the same motion declarations to the preview and the promoted block", () => {
    const draft = {
      ...defaultStyleGuideTokenDraft,
      motionTokens: {
        ...defaultMotionTokens,
        "--anim-reveal-duration": "1400ms",
        "--anim-focus-blur": "24px",
      },
    };
    const preview = buildStyleVariables(draft);
    const promoted = motionTokenDeclarations(draft.motionTokens);

    for (const [token, value] of promoted) {
      expect(
        preview[token as `--${string}`],
        `${token} is promoted as "${value}" but the live preview paints something else, so the gallery is not showing what you would ship`,
      ).toBe(value);
    }

    const previewMotionTokens = Object.keys(preview).filter((key) =>
      key.startsWith("--anim-"),
    );

    expect(
      previewMotionTokens.sort(),
      "the preview and the promoted block disagree about which motion tokens exist",
    ).toEqual(promoted.map(([token]) => token).sort());
  });

  /**
   * An inheriting token is omitted from both outputs, never emitted empty.
   *
   * An empty custom property does not fall back - it makes every `var()` reading
   * it invalid at computed-value time, so an empty emission would break the rule
   * rather than let it inherit. `--live-cta-accent` is omitted for exactly this
   * reason, and it is asserted rather than trusted because the failure looks
   * like the animation simply not running.
   */
  it("omits an inheriting token rather than emitting it empty", () => {
    const inheriting = motionTokenControls.find(
      (control) => control.inheritsFrom,
    );

    expect(
      inheriting,
      "no control inherits any more - if that is deliberate, this test and the stylesheet fallback should go together",
    ).toBeDefined();

    const token = inheriting?.token as string;
    const unset = motionTokenDeclarations({
      ...defaultMotionTokens,
      [token]: "",
    });

    expect(
      unset.map(([name]) => name),
      `${token} is emitted while unset, so it would resolve to an empty value instead of inheriting`,
    ).not.toContain(token);

    const authored = motionTokenDeclarations({
      ...defaultMotionTokens,
      [token]: "900ms",
    });

    expect(
      authored,
      `${token} is dropped even when authored, so its control cannot do anything`,
    ).toContainEqual([token, "900ms"]);
  });

  describe("validation", () => {
    /**
     * The value is written into a stylesheet, so the grammars are exact.
     *
     * There is no input here that can close a declaration and open another one:
     * numeric kinds are matched whole against a unit-bearing pattern, and easings
     * are an allowlist rather than free-form CSS.
     */
    it("refuses a value that could close its own declaration", () => {
      const normalized = normalizeMotionTokens({
        "--anim-reveal-duration": "620ms; --anim-reveal-distance: 9999px",
        "--anim-reveal-easing": "linear; } :root { --color-bg-page: red",
      });

      expect(normalized["--anim-reveal-duration"]).toBe("620ms");
      expect(normalized["--anim-reveal-easing"]).toBe(
        "cubic-bezier(0.22, 1, 0.36, 1)",
      );
    });

    it("clamps a number outside the control's range", () => {
      const normalized = normalizeMotionTokens({
        "--anim-reveal-duration": "99999ms",
        "--anim-reveal-distance": "0px",
      });

      expect(normalized["--anim-reveal-duration"]).toBe("1600ms");
      expect(normalized["--anim-reveal-distance"]).toBe("0px");
    });

    it("accepts only easings the control offers", () => {
      const normalized = normalizeMotionTokens({
        "--anim-focus-easing": "cubic-bezier(0.33, 0, 0.67, 1)",
        "--anim-reveal-easing": "cubic-bezier(0.9, 0.1, 0.1, 0.9)",
      });

      expect(normalized["--anim-focus-easing"]).toBe(
        "cubic-bezier(0.33, 0, 0.67, 1)",
      );
      expect(
        normalized["--anim-reveal-easing"],
        "an easing outside the preset list was accepted, which makes the value free-form CSS in a file this writes to disk",
      ).toBe("cubic-bezier(0.22, 1, 0.36, 1)");
    });

    /**
     * A style guide saved before motion joined the axis must keep promoting.
     *
     * Every slot in `style-guide-slots.json` predates this, and an approved page
     * records the token set it was approved under - a missing key that promoted
     * as nothing would take the shared rhythm off the exported site entirely.
     */
    it("fills a draft that predates motion with the shipped rhythm", () => {
      expect(normalizeMotionTokens(undefined)).toEqual(defaultMotionTokens);
      expect(normalizeMotionTokens({ activeCardGapValue: "1rem" })).toEqual(
        defaultMotionTokens,
      );
    });

    it("drops a token the registry no longer offers", () => {
      const normalized = normalizeMotionTokens({
        "--anim-scrub-entry-start": "24%",
        "--anim-reveal-duration": "400ms",
      });

      expect(normalized["--anim-scrub-entry-start"]).toBeUndefined();
      expect(normalized["--anim-reveal-duration"]).toBe("400ms");
    });
  });
});
