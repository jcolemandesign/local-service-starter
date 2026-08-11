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

/**
 * The block a marker opens, matched by braces rather than by a line pattern.
 *
 * These rules nest three deep - `@supports` inside `@media` inside nothing -
 * and every line-based way of slicing them either stops at the first inner `}`
 * or runs to the end of the file. Returns "" when the marker is absent so the
 * assertion that wanted the block is what fails, with its own message.
 */
function blockAt(source: string, marker: string) {
  const start = source.indexOf(marker);

  if (start < 0) {
    return "";
  }

  let depth = 0;

  for (let index = start; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
    } else if (source[index] === "}") {
      depth -= 1;

      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  return "";
}

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
   * creeps back into the keyframes, the duration or the stagger, a suite
   * silently cannot move it.
   */
  it("drives the reveal from custom properties, not literals", () => {
    for (const token of [
      "--anim-reveal-distance",
      "--anim-reveal-duration",
      "--anim-reveal-delay-step",
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

  /**
   * The entrance is timed, not scrubbed, and that is the whole point of the
   * second design.
   *
   * A scroll-driven animation's progress IS the scroll position, so it lasts
   * exactly as long as the reader takes to scroll past - a flick put the whole
   * range behind them in ~150ms and the motion never registered. Stretching the
   * range to fix that means starting it earlier, and the earliest point is the
   * instant the section's first pixel appears. The two cannot both be had.
   */
  it("plays the entrance on a clock, not on the scroller", () => {
    const arriving = blockAt(
      css,
      '[data-pagebuilder-animation="reveal"][data-pagebuilder-animation-state="in"]',
    );

    expect(
      arriving,
      "no rule answers the arriving state, so the observer would set an attribute nothing reads",
    ).not.toBe("");
    expect(
      arriving,
      "the entrance has no duration, so it is being scrubbed rather than timed",
    ).toContain("var(--anim-reveal-duration)");
    expect(
      arriving,
      "the entrance does not stagger by delay - with a clock available, a range offset would be the scrubbed idea in the wrong place",
    ).toContain("animation-delay");
    expect(
      arriving,
      "the entrance is still attached to a scroll timeline",
    ).not.toContain("animation-timeline");
  });

  /**
   * Content is visible unless something is running that can reveal it again.
   *
   * The hiding rule is the one piece of this that can leave a page permanently
   * blank, so it is scoped to a flag the observer sets at runtime. No script,
   * no hiding - which covers a failed bundle, a crawler, and reduced motion.
   */
  it("hides a waiting unit only once the observer is running", () => {
    const waiting = blockAt(
      css,
      "[data-pagebuilder-animation-ready]\n    [data-pagebuilder-animation=\"reveal\"]",
    );

    expect(
      waiting,
      "the waiting rule is not scoped to the observer's ready flag, so a page whose JavaScript never arrives renders its sections permanently invisible",
    ).not.toBe("");
    expect(waiting).toContain("opacity: 0");
    // The three states are one selector each, distinguished by presence: no
    // state means waiting, `in` means arriving, `settled` means it was already
    // on screen. `:not()` is what keeps the other two out without a
    // counter-rule fighting on specificity.
    expect(
      waiting,
      "the waiting rule does not exclude frames that already have a state, so an arriving or settled section stays hidden and fights its own animation",
    ).toContain(":not([data-pagebuilder-animation-state])");
  });

  /**
   * Scrubbing is still wanted for a few sections, so it is kept whole rather
   * than deleted and rebuilt later - gated on a value the builder does not
   * offer, the same arrangement `pulse` is in.
   */
  it("keeps the scrubbed variant intact but unoffered", () => {
    expect(gated).toContain("scrub");
    expect(offered).not.toContain("scrub");

    const scrubbed = blockAt(css, '[data-pagebuilder-animation="scrub"] .reveal-on-scroll');

    expect(
      scrubbed,
      "the scrubbed rule is no longer driven by the section's own timeline",
    ).toContain("animation-timeline: --section-entrance");

    const frameRule = blockAt(css, '[data-pagebuilder-animation="scrub"] {');

    expect(
      frameRule,
      "no frame declares --section-entrance, so the name the scrubbed rule references resolves to nothing",
    ).toContain("view-timeline-name: --section-entrance");

    // Its range is capped in a length, because a percentage of `entry` is a
    // percentage of the section - the same token is ~150px of travel on a trust
    // strip and a full scrollport on a nine-card bento.
    const cap = blockAt(css, "@supports (animation-range-end:");

    expect(cap, "the scrubbed range has lost its height cap").not.toBe("");

    for (const token of [
      "--anim-scrub-entry-start",
      "--anim-scrub-entry-end",
      "--anim-scrub-stagger",
    ]) {
      expect(
        cap,
        `${token} is not re-pointed under the cap, so it still scales with the section's height`,
      ).toContain(`${token}: min(`);

      // A dropped `animation-range` falls back to `normal` - the whole `cover`
      // range - so the percentages have to stand outside the guard.
      const declarations = css
        .split(`${token}:`)
        .slice(1)
        .map((rest) => rest.slice(0, rest.indexOf(";")));
      const unguarded = declarations.filter(
        (value) => !cap.includes(`${token}:${value};`),
      );

      expect(
        unguarded,
        `${token} is only declared inside the @supports guard, so a browser that cannot parse the cap gets no range at all`,
      ).not.toEqual([]);
    }

    // Clamped, so a section flush with the end of a document is not stranded
    // part-faded with no scroll left to finish it.
    expect(scrubbed.replace(/\s+/g, "")).toContain("100%)");
  });
});
