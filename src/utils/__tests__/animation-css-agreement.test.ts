import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  resolveSectionAnimation,
  styleFieldOptions,
} from "@/content/section-style-options";

/**
 * The option list and the stylesheet have to agree.
 *
 * A value the builder offers with no matching rule is a control that appears to
 * work and paints nothing; a rule with no offered value is unreachable CSS that
 * looks live. Neither errors, and neither is visible from the other file - the
 * same reason `color-css-agreement.test.ts` exists for the colour recipes.
 */

const css = readFileSync(
  path.join(process.cwd(), "src", "app", "globals.css"),
  "utf8",
);

/** Values the builder can actually store, `""` (inherit) excluded. */
const offered = styleFieldOptions.animation
  .map((option) => option.value)
  .filter(Boolean);

/** Every animation value the stylesheet has a gated rule for. */
const gated = [
  ...css.matchAll(/\[data-pagebuilder-animation="([\w-]+)"\]/g),
].map((match) => match[1]);

describe("animation css agreement", () => {
  it("has a gated rule for every offered value that should paint", () => {
    // `none` is the absence of a rule, not a rule - it is what an unmatched
    // section already does, so requiring CSS for it would mean writing a rule
    // that turns off an animation nothing switched on.
    const paintable = offered.filter((value) => value !== "none");

    for (const value of paintable) {
      expect(
        gated,
        `animation "${value}" is offered in the builder but globals.css has no [data-pagebuilder-animation="${value}"] rule, so choosing it would paint nothing`,
      ).toContain(value);
    }
  });

  it("resolves every offered value to itself", () => {
    // Guards the resolver's allowlist against the option list: a value offered
    // but not in `animationValues` would be stored and then silently resolved
    // back to "none", which reads as the control not working.
    for (const value of offered) {
      expect(
        resolveSectionAnimation(value),
        `"${value}" is offered but resolveSectionAnimation does not accept it`,
      ).toBe(value);
    }
  });

  it("resolves unset and unrecognised values to none", () => {
    expect(resolveSectionAnimation(undefined)).toBe("none");
    expect(resolveSectionAnimation("")).toBe("none");
    // A template saved with a value since removed must render a still section
    // rather than an attribute no rule matches.
    expect(resolveSectionAnimation("slide-sideways")).toBe("none");
  });

  /**
   * Pulse is gated but deliberately not offered - it had a single user, and
   * these values are persisted ids, so the enum should not gain one
   * speculatively. This asserts that arrangement rather than leaving the extra
   * rule looking like a mistake: the rule is scoped and dormant, and promoting
   * it is one entry in the option list.
   */
  it("keeps pulse gated but unoffered", () => {
    expect(gated).toContain("pulse");
    expect(offered).not.toContain("pulse");
  });

  /**
   * The reveal is off unless the frame says otherwise, and that is implemented
   * by the selector rather than by section markup. An ungated marker class
   * would animate everywhere at once.
   */
  it("never leaves a marker class rule ungated", () => {
    // Comments stripped first: the prose around these rules names the attribute,
    // and a check that let a comment satisfy it would pass on an ungated rule
    // that merely sat under a well-written explanation.
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const ungated: string[] = [];

    // The selector is whatever sits between the enclosing block's brace and
    // this rule's own, which is what makes the attribute's presence checkable
    // even though the selector wraps across lines.
    for (const match of rules.matchAll(
      /([^{}]*\.(?:reveal|pulse)-on-scroll[^{}]*)\{/g,
    )) {
      const selector = match[1];

      if (!selector.includes("data-pagebuilder-animation")) {
        ungated.push(selector.trim().replace(/\s+/g, " "));
      }
    }

    expect(
      ungated,
      "these marker-class rules are not scoped to [data-pagebuilder-animation], so every marked section would animate regardless of its toggle",
    ).toEqual([]);
  });

  /**
   * The token layer is what makes the future style-guide animation suites a
   * token swap rather than an edit to every animated section. If a literal
   * creeps back into the keyframes or the range, a suite silently cannot move
   * it.
   */
  it("drives the reveal from custom properties, not literals", () => {
    for (const token of [
      "--anim-reveal-distance",
      "--anim-reveal-entry-start",
      "--anim-reveal-entry-end",
      "--anim-reveal-stagger",
      "--anim-reveal-easing",
    ]) {
      expect(css, `${token} is not declared`).toContain(`${token}:`);
      expect(
        css.split(`${token}:`).length,
        `${token} is declared but never read, so it cannot be what a suite re-points`,
      ).toBeGreaterThan(1);
      expect(css, `${token} is never referenced`).toContain(`var(${token}`);
    }
  });
});
