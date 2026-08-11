import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { animationComponents } from "@/content/section-style-options";

/**
 * A section does not decide whether it animates.
 *
 * It marks which of its elements are revealable units; the frame's
 * `data-pagebuilder-animation` attribute decides whether any of them move. This
 * is the same split the colour recipes use, and it is here for the same reason:
 * the five sections below carried `reveal-on-scroll` unconditionally, from
 * before the axis existed, and there was no way to turn any of them off.
 *
 * The failure this prevents is silent in both directions:
 *
 *   - a section marks up a revealable unit and is NOT offered the control, so
 *     the markup is dead and no editor can ever switch it on
 *   - a section is offered the control and marks up nothing, so the control
 *     renders and does nothing - the exact failure the membership sets in
 *     `section-style-options.ts` exist to prevent, and the one that shipped on
 *     51 of 93 sections before `getSectionToggleProps` read those sets
 *
 * So this pins the registry against the markup both ways round.
 */

const sectionsDir = path.join(process.cwd(), "src", "components", "sections");

const sources = new Map(
  readdirSync(sectionsDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => [
      file,
      readFileSync(path.join(sectionsDir, file), "utf8"),
    ]),
);

/**
 * The marker for the one offered value. `pulse-on-scroll` is deliberately not
 * here: it is gated by the same attribute but is not an option value, so a
 * section carrying only a pulse marker cannot be switched on and must not be
 * offered a control - see `dormantMarkers`.
 */
const revealMarker = /\breveal-on-scroll\b/;

/**
 * Sections marked up for a value the builder does not offer yet.
 *
 * Listed rather than silently skipped, with the reason, so the arrangement is
 * stated: the rule is scoped and dormant, not broken. When `pulse` becomes an
 * option value this section joins `animationComponents` and drops out of here,
 * and the staleness check below is what forces that.
 */
const dormantMarkers = new Map<string, string>([
  [
    "DecisionSplitDecisionSectionV3.tsx",
    "marks a pulse unit, and pulse is gated but not an offered value yet",
  ],
]);

/**
 * The two files that own a section frame rather than being sections.
 *
 * They live in the sections folder this scan walks, but the animation attribute
 * is theirs by design - one is the builder canvas, the other the staged/export
 * frame. Everything else in here is a section, and a section setting the
 * attribute itself would make the toggle advisory.
 */
const frameOwners = new Set(["PagebuilderShell.tsx", "PageTemplatePreview.tsx"]);

function fileFor(component: string) {
  for (const [file, source] of sources) {
    if (source.includes(`export function ${component}`)) {
      return file;
    }
  }

  // Multi-section files are how this codebase stores several exports together,
  // so a missing file means the registry names something that does not exist.
  return undefined;
}

describe("animation marker ownership", () => {
  it("offers the control on every section that marks a revealable unit", () => {
    const unreachable: string[] = [];

    for (const [file, source] of sources) {
      if (!revealMarker.test(source)) {
        continue;
      }

      // A file can hold several sections; the markup is reachable if any export
      // in it is registered. Per-export attribution is what
      // `card-surface-coverage` needed and it is deliberately not repeated here:
      // the marker classes are hand-placed, so a file carrying one is a file
      // someone intended to animate.
      const exports = [...source.matchAll(/export function (\w+)/g)].map(
        (match) => match[1],
      );

      if (!exports.some((name) => animationComponents.has(name))) {
        unreachable.push(file);
      }
    }

    expect(
      unreachable.sort(),
      "these carry a reveal/pulse marker class but no section in them is in animationComponents, so the markup is dead - add the section to the set, or remove the class",
    ).toEqual([]);
  });

  it("marks a revealable unit in every section offered the control", () => {
    const empty: string[] = [];

    for (const component of animationComponents) {
      const file = fileFor(component);

      expect(file, `animationComponents names ${component}, which has no export`)
        .toBeDefined();

      if (file && !revealMarker.test(sources.get(file) ?? "")) {
        empty.push(component);
      }
    }

    expect(
      empty.sort(),
      "these are offered the animation control but mark up nothing for it to animate, so the control renders and does nothing",
    ).toEqual([]);
  });

  /**
   * The point of the whole axis. A marker class must not carry its own
   * enabling: if a section could switch itself on, the toggle would be
   * advisory, and "off by default" would be false for whichever sections had
   * opted themselves in - which is precisely the state this replaced.
   */
  it("never lets a section set the animation attribute itself", () => {
    for (const [file, source] of sources) {
      if (frameOwners.has(file)) {
        continue;
      }

      expect(
        source.includes("data-pagebuilder-animation"),
        `${file} sets the animation attribute itself - that belongs to the section frame, not to a section`,
      ).toBe(false);
    }
  });

  it("keeps both frame owners setting the attribute", () => {
    // The other half of the exclusion above. If a frame stopped emitting the
    // attribute, every section in that render path would silently fall back to
    // no animation, and the test above would still pass.
    for (const file of frameOwners) {
      expect(
        sources.get(file),
        `${file} is listed as a frame owner but does not exist`,
      ).toBeDefined();
      expect(
        sources.get(file)?.includes("data-pagebuilder-animation"),
        `${file} owns a section frame but no longer sets the animation attribute, so its render path cannot animate at all`,
      ).toBe(true);
    }
  });

  /**
   * A marked unit in a list has to carry its index, or the whole list animates
   * as one block.
   *
   * `--reveal-index` shifts each child's slice of its own entry range, because a
   * scroll-driven timeline has no clock and `animation-delay` does nothing on
   * one. Miss it and the reveal still works - it just fires for every card
   * simultaneously, which reads as a slightly janky single fade rather than as a
   * bug, so nothing would ever report it.
   *
   * Counted per file rather than per element: extracting the enclosing JSX tag
   * from source text is the kind of parsing that generates false positives, and
   * the count catches the case that matters - a marker added without an index
   * beside it. A section whose reveal is genuinely a single unit rather than a
   * list would fail this and belongs in `singleUnitReveals` with its reason.
   */
  it("pairs every marker with a stagger index", () => {
    const unstaggered: string[] = [];

    for (const [file, source] of sources) {
      if (frameOwners.has(file)) {
        continue;
      }

      const markers = (
        source.match(/\b(?:reveal|pulse)-on-scroll\b/g) ?? []
      ).length;

      if (markers === 0) {
        continue;
      }

      const indices = (source.match(/"--reveal-index"/g) ?? []).length;

      if (indices < markers) {
        unstaggered.push(`${file} — ${markers} marker(s), ${indices} index/indices`);
      }
    }

    expect(
      unstaggered.sort(),
      "these mark more revealable units than they set --reveal-index on, so a list animates as one block - set the index on the same element as the marker, or record a genuinely single-unit reveal in singleUnitReveals",
    ).toEqual([]);
  });

  it("keeps the dormant-marker list honest", () => {
    const stale: string[] = [];

    for (const [file, reason] of dormantMarkers) {
      const source = sources.get(file);

      expect(source, `dormantMarkers names ${file}, which does not exist`)
        .toBeDefined();

      // Either it gained a reveal marker (so it should be registered and drop
      // out of here), or it lost its pulse marker (so the entry is pointless).
      if (
        source &&
        (revealMarker.test(source) || !/\bpulse-on-scroll\b/.test(source))
      ) {
        stale.push(`${file} — ${reason}`);
      }
    }

    expect(
      stale.sort(),
      "these no longer match the reason they were listed under - a dormant marker either became reachable or went away",
    ).toEqual([]);
  });
});
