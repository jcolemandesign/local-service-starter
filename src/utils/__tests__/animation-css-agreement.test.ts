import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { motionTokenControls } from "@/content/motion-tokens";
import {
  sectionAnimationRoles,
  sectionAnimationSuites,
} from "@/content/section-animations";
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
).replace(/\r\n?/g, "\n");

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

  /**
   * THE ASSERTION THAT MAKES THE LIBRARY SAFE TO GROW.
   *
   * Every timed suite owns both halves - a waiting rule that hides its units
   * and an arrival rule that brings them back - and it writes them itself
   * rather than inheriting a generalised one.
   *
   * A suite with a waiting rule and no arrival rule hides content INDEFINITELY:
   * the observer sets `in`, nothing answers it, and the section stays at
   * opacity 0 forever. That is why the waiting selector is not generalised
   * across every non-`none` value - a generalised hider makes a half-finished
   * suite blank the page, where a per-suite one makes it do nothing.
   *
   * `scrub` and `pulse` are deliberately outside this: one is scroll-driven
   * rather than timed and has no waiting state to own, the other animates a
   * different marker class. Neither is offered, and the two tests below pin
   * that arrangement.
   */
  it("gives every offered suite both halves of the timed contract", () => {
    for (const suite of sectionAnimationSuites) {
      const waiting = blockAt(
        css,
        `[data-pagebuilder-animation-ready]\n    [data-pagebuilder-animation="${suite.id}"]`,
      );

      expect(
        waiting,
        `suite "${suite.id}" (${suite.label}) has no waiting rule scoped to the observer's ready flag, so its units are never hidden and the entrance plays from the end state`,
      ).not.toBe("");
      expect(
        waiting,
        `suite "${suite.id}" hides units without excluding frames that already carry a state, so an arriving or settled section stays hidden and fights its own animation`,
      ).toContain(":not([data-pagebuilder-animation-state])");

      const arriving = blockAt(
        css,
        `[data-pagebuilder-animation="${suite.id}"][data-pagebuilder-animation-state="in"]`,
      );

      expect(
        arriving,
        `suite "${suite.id}" hides its units but nothing answers the arriving state, so every section using it stays blank permanently`,
      ).not.toBe("");
    }
  });

  /**
   * The registry describes the motion; the stylesheet performs it. Those are
   * two representations of one fact and they can drift - see the header comment
   * in `section-animations.ts`, which accepts that gap deliberately.
   *
   * This narrows it at the one place it is checkable: a role the registry
   * describes as differing from the suite's default has to have a selector, or
   * the description is fiction. Only `media` differs today, under Rise.
   */
  it("gives a role selector to every role the registry differentiates", () => {
    // Comments stripped: the prose above these rules names both the suite and
    // the role class, and a check a comment could satisfy would pass on a
    // stylesheet that had lost the rule the comment describes.
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");

    /** Whether a gated rule for this suite selects this role class. */
    function hasRoleRule(suiteId: string, role: string) {
      const selector = `[data-pagebuilder-animation="${suiteId}"]`;

      return rules
        .split(`.reveal-role-${role}`)
        .slice(0, -1)
        .some((before) => {
          // Back to the start of this selector list: everything since the
          // previous rule's closing brace. Selectors here wrap across lines and
          // list several role hooks at once, so a window would either clip a
          // long list or run into the rule above it.
          const start = Math.max(
            before.lastIndexOf("}"),
            before.lastIndexOf("{"),
          );

          return before.slice(start + 1).includes(selector);
        });
    }

    const missing: string[] = [];
    const undeclared: string[] = [];

    for (const suite of sectionAnimationSuites) {
      const differentiated = new Set<string>(suite.differentiatedRoles);

      for (const role of sectionAnimationRoles) {
        const declared = differentiated.has(role);
        const implemented = hasRoleRule(suite.id, role);

        if (declared && !implemented) {
          missing.push(`${suite.id}.${role} — "${suite.roles[role]}"`);
        }

        if (!declared && implemented) {
          undeclared.push(`${suite.id}.${role}`);
        }
      }
    }

    expect(
      missing.sort(),
      "the registry names these roles as moving differently from their suite's default, but no gated `.reveal-role-*` rule makes them - so the registry, the gallery caption and the builder all describe motion the stylesheet does not perform",
    ).toEqual([]);
    expect(
      undeclared.sort(),
      "the stylesheet moves these roles specially but the suite does not name them in `differentiatedRoles`, so a behaviour exists that nothing describes - the gallery caption and the builder both under-report what the suite does",
    ).toEqual([]);
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
   * A prototype suite is watchable and not selectable, and both halves matter.
   *
   * Watchable, because a suite that treats every role the same cannot tell you
   * whether the roles are right — so it has to exist and be looked at BEFORE
   * the backfill. Not selectable, because until the backfill lands almost every
   * marked element in the library is an unroled `content` unit, and a
   * differentiating suite would look identical to Rise on nearly every section
   * an editor could pick it for. That is a control that appears to work and
   * paints nothing.
   */
  it("keeps prototype suites out of the builder's option list", () => {
    for (const suite of sectionAnimationSuites) {
      if (suite.status === "offered") {
        expect(
          offered,
          `suite "${suite.id}" is marked offered but is not in the option list`,
        ).toContain(suite.id);
        continue;
      }

      expect(
        offered,
        `suite "${suite.id}" is a prototype but the builder offers it - until the role backfill lands it would look identical to Rise on nearly every section`,
      ).not.toContain(suite.id);

      // The other half: a prototype still owes the CSS contract, because it is
      // rendered for real in the gallery. Unoffered is not unimplemented.
      expect(
        gated,
        `prototype suite "${suite.id}" has no gated rule at all, so its gallery specimen would show nothing`,
      ).toContain(suite.id);
    }
  });

  /**
   * A suite that slides has to contain its own slide.
   *
   * A translated element still contributes to the scrollable overflow area, so
   * a media panel starting one width off-screen widens the document and flashes
   * a horizontal scrollbar for the length of the entrance. The page looks
   * broken, and nothing about the section explains why.
   *
   * `clip` and not `hidden`: `hidden` creates a scroll container, which traps
   * `position: sticky` inside the section and hands the frame a scrollport it
   * never asked for. Both halves are asserted because "fixed the scrollbar with
   * overflow: hidden" is the obvious wrong repair.
   */
  it("contains the slide inside the frame that chose it", () => {
    const frame = blockAt(css, '[data-pagebuilder-animation="lateral"] {');

    expect(
      frame,
      "the lateral frame does not clip, so a panel sliding in from off-screen widens the document and flashes a horizontal scrollbar",
    ).not.toBe("");
    expect(
      frame,
      "the lateral frame clips with something other than `clip` - `hidden` would make the section a scroll container and break sticky inside it",
    ).toContain("overflow-x: clip");
  });

  /**
   * The gallery is derived from the registry, so a suite added later appears in
   * the style guide with no edit to either file.
   *
   * A hand-written demo list is the failure this prevents, and it is a quiet
   * one: the suite still works, it is still offered in the builder, and the one
   * screen built for looking at motion simply does not show it. Nobody notices
   * until someone asks why the new suite "isn't in the style guide".
   */
  it("derives the style-guide gallery from the registry", () => {
    const gallery = readFileSync(
      path.join(
        process.cwd(),
        "src",
        "app",
        "dev",
        "style-guide",
        "MotionSuiteGallery.tsx",
      ),
      "utf8",
    );

    expect(
      gallery,
      "the gallery no longer maps over sectionAnimationSuites, so a suite added to the registry would not appear in the style guide",
    ).toContain("sectionAnimationSuites.map");
    expect(
      gallery,
      "the gallery no longer maps over sectionAnimationRoles, so a role added to the vocabulary would have no specimen",
    ).toContain("sectionAnimationRoles.map");

    for (const suite of sectionAnimationSuites) {
      expect(
        gallery,
        `the gallery names suite "${suite.id}" as a literal - the list is meant to be derived, and a literal is how it silently stops covering the registry`,
      ).not.toContain(`"${suite.id}"`);
    }
  });

  /**
   * Pulse is a timed suite now, and the scrubbed one it replaced is gone.
   *
   * The old rule drove a scale blip from `animation-timeline: view()`, so its
   * progress was the reader's scroll position - the mechanism this axis was
   * redesigned away from, because a flick put the whole range behind them
   * before the blip registered. It was rebuilt on a clock rather than promoted,
   * and this pins that: if a scroll timeline ever reappears under the `pulse`
   * value, the suite has quietly regained the defect it was rebuilt to lose.
   */
  it("drives pulse from a clock, not from the scroller", () => {
    expect(offered).toContain("pulse");

    const arriving = blockAt(
      css,
      '[data-pagebuilder-animation="pulse"][data-pagebuilder-animation-state="in"]',
    );

    expect(
      arriving,
      "no rule answers pulse's arriving state, so the observer would set an attribute nothing reads",
    ).not.toBe("");
    expect(
      arriving,
      "pulse is attached to a scroll timeline again - that is the scrubbed version it replaced",
    ).not.toContain("animation-timeline");

    expect(
      css,
      "the retired `.pulse-on-scroll` marker rule is back; the suite drives `.reveal-role-action` now",
    ).not.toContain(".pulse-on-scroll {");
  });

  /**
   * The beat is one beat.
   *
   * An infinitely pulsing CTA never stops asking, makes the page read as
   * unfinished, and is a real problem for anyone who finds movement
   * distracting. Nothing about `iteration-count` is obvious from the rule, so
   * it is asserted rather than trusted.
   */
  it("beats once rather than looping", () => {
    const action = blockAt(
      css,
      '[data-pagebuilder-animation="pulse"][data-pagebuilder-animation-state="in"]\n    .reveal-role-action',
    );

    expect(
      action,
      "the action role has no rule under pulse, so the suite is Rise with extra steps",
    ).not.toBe("");
    expect(
      action,
      "the attention beat loops - one beat points, a loop nags",
    ).not.toContain("infinite");
    expect(
      action,
      "the beat no longer runs the attention keyframes",
    ).toContain("section-attention-pulse");
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
   * The token layer is what makes a motion change a token swap rather than an
   * edit to every animated section. If a literal creeps back into a keyframe, a
   * duration or a stagger, the Style Guide control for it silently stops
   * working.
   *
   * WIDENED FROM THE FOUR REVEAL TOKENS TO EVERY REGISTERED CONTROL. It used to
   * name four tokens by hand, which is why it never noticed that
   * `--anim-lateral-distance` was declared and read by nothing. Derived from the
   * registry, a token that stops being read fails here the moment it happens.
   */
  it("drives every authored token from a custom property, not a literal", () => {
    for (const control of motionTokenControls) {
      expect(
        css,
        `${control.token} is offered as a Style Guide control but the stylesheet never reads it, so authoring it would paint nothing`,
      ).toContain(`var(${control.token}`);
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
    ).toContain("var(--anim-reveal-duration, var(--anim-duration))");
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
   * NOTHING ON THIS AXIS IS DRIVEN BY THE SCROLLER.
   *
   * The scrubbed variant used to sit here gated and unoffered, kept whole for a
   * rebuild. It is retired: its progress WAS the scroll position, so a trackpad
   * flick put the whole range behind the reader before the motion registered,
   * and no range tuning fixes that - "starts late" and "lasts long" cannot both
   * fit inside one screen of travel. The scrubbed pulse was retired earlier for
   * the same reason.
   *
   * It was also the one part of the axis that could not be authored in the
   * Style Guide. Its tokens were declared twice - plain percentages, then capped
   * `min()` values inside an `@supports` guard - and the promoted token block is
   * spliced in at the END of `globals.css`, so promoting the percentages would
   * have landed after the guard and silently removed the cap. Retiring it leaves
   * `motion-token-agreement.test.ts` with an invariant that has no exceptions.
   *
   * Scroll-driven motion is still supported, just not through this axis: a
   * section that wants to be driven rather than triggered owns that motion
   * itself and sits in `animationExcludedComponents`. This test pins that no
   * suite regains a scroll timeline by the back door.
   */
  it("keeps scroll-scrubbed motion off this axis", () => {
    expect(gated).not.toContain("scrub");
    expect(offered).not.toContain("scrub");

    const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");

    expect(
      rules,
      "a scroll timeline is attached to something again - progress driven by the reader's hand is the mechanism this axis was rebuilt to lose",
    ).not.toContain("animation-timeline:");
    expect(
      rules,
      "a named view timeline is declared again, which is how the scrubbed variant published the section's arrival to its units",
    ).not.toContain("view-timeline-name:");

    for (const token of [
      "--anim-scrub-entry-start",
      "--anim-scrub-entry-end",
      "--anim-scrub-stagger",
    ]) {
      expect(
        css,
        `${token} is back. It is a scroll-distance token, and it cannot be promoted safely - the @supports height cap it needs would be defeated by the promoted block, which is appended after it`,
      ).not.toContain(token);
    }
  });

  /**
   * SETTLE SCALES THE PICTURE, NOT THE PANEL.
   *
   * Scaling the marked unit was the first attempt and it is wrong in a way only
   * a real photograph shows: these panels are bled, so growing one 3% sweeps its
   * inner edge across the text column and back. That reads as the layout
   * twitching rather than as an image settling, and clipping at the section
   * level cannot help because the movement is inward.
   *
   * The picture scales inside a panel that holds still, and the panel's own
   * crop clipping cuts the overhang. If the animation ever moves back onto
   * `.reveal-role-media` itself, the suite has quietly regained the defect it
   * was rebuilt to lose.
   */
  it("settles the picture inside the panel rather than the panel", () => {
    const arriving = blockAt(
      css,
      '[data-pagebuilder-animation="settle"][data-pagebuilder-animation-state="in"]\n    .reveal-role-media :is(img, video)',
    );

    expect(
      arriving,
      "nothing runs section-settle on the picture inside a media unit, so the suite's signature does not play",
    ).not.toBe("");
    expect(arriving).toContain("section-settle");

    // The panel's own rule must NOT animate - it only zeroes the travel, which
    // turns the suite's default rise into the pure fade a bled panel wants.
    const panel = blockAt(
      css,
      '[data-pagebuilder-animation="settle"][data-pagebuilder-animation-state="in"]\n    .reveal-role-media {',
    );

    expect(
      panel,
      "the media panel itself animates again - scaling a bled panel sweeps its inner edge across the copy beside it",
    ).not.toContain("section-settle");
  });

  /**
   * The scale is opacity-free, because the panel around it is already fading.
   *
   * Two opacity animations on nested elements multiply into a muddy one - the
   * same defect the role vocabulary avoids by never nesting revealable units.
   */
  it("keeps opacity out of the settle keyframe", () => {
    const keyframe = blockAt(css, "@keyframes section-settle");

    expect(keyframe, "the section-settle keyframe is gone").not.toBe("");
    expect(
      keyframe,
      "section-settle animates opacity as well as scale, so it fades against the panel that is already fading it",
    ).not.toContain("opacity");
  });

  /**
   * THE LATERAL DEFAULT IS A TOKEN, NOT A LITERAL, and it was a literal.
   *
   * `--anim-lateral-distance: 40px` sat declared and read by nothing while the
   * rule hardcoded `0px`; the token's comment claimed ordinary units moved 40px
   * and the rule moved them none. The rule was right about the design - one
   * panel travels, everything else fades in place - so the token ships at zero
   * and the rule reads it.
   *
   * That is what makes a Style Guide control for it honest. Pointed at a
   * literal, the control would have been the exact failure this project guards
   * against everywhere else: one that appears to work and paints nothing.
   */
  it("drives lateral's default travel from its token", () => {
    const shared = blockAt(
      css,
      '[data-pagebuilder-animation="lateral"][data-pagebuilder-animation-state="in"]\n    .reveal-on-scroll',
    );

    expect(
      shared,
      "the lateral travel rule is missing, so nothing composes the suite's size and sign",
    ).not.toBe("");
    expect(
      shared,
      "lateral's default size is a literal again - a Style Guide control for --anim-lateral-distance would then author a token nothing reads",
    ).toContain("--anim-lateral-size: var(--anim-lateral-distance)");
  });
});
