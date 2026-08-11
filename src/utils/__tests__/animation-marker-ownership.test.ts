import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { sectionLibraryV3Registry } from "@/content/section-library-v3";
import {
  animationComponents,
  animationExcludedComponents,
} from "@/content/section-style-options";

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

/**
 * Source with its comments removed, because these scans read markup as text.
 *
 * Every marker in this library carries a comment saying what it is, and those
 * comments name the class - so a section explaining why it marks one unit and
 * not two counted as marking two. The same trap `color-css-agreement` avoids by
 * stripping comments before reading rules.
 *
 * Block comments cover JSX's `{/* … *\/}` as well. Line comments are only
 * stripped where `//` opens the line, so a `https://` inside a string is left
 * alone - truncating one would silently change what these scans see.
 */
function withoutComments(source: string) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^[^\S\n]*\/\/.*$/gm, "");
}

const sources = new Map(
  readdirSync(sectionsDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => [
      file,
      withoutComments(readFileSync(path.join(sectionsDir, file), "utf8")),
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
 * Empty, and worth keeping that way. It held one entry - the split-decision
 * section marked `pulse-on-scroll`, a rule that is gated but has never been an
 * offered value, so that section was the one piece of marked-up animation in
 * the library that no editor could reach. It marks the ordinary entrance now
 * and is registered like everything else.
 *
 * The list stays because the arrangement it records can recur: `pulse` is
 * still a scoped, dormant rule in `globals.css` waiting on a style-guide
 * suite, and anything marked for it before it is offered belongs here with its
 * reason rather than silently failing the coverage check above.
 */
const dormantMarkers = new Map<string, string>();

/**
 * The two files that own a section frame rather than being sections.
 *
 * They live in the sections folder this scan walks, but the animation attribute
 * is theirs by design - one is the builder canvas, the other the staged/export
 * frame. Everything else in here is a section, and a section setting the
 * attribute itself would make the toggle advisory.
 */
const frameOwners = new Set(["PagebuilderShell.tsx", "PageTemplatePreview.tsx"]);

/**
 * Sections whose card element is defined in another file.
 *
 * The scans here are per file and do not follow imports, which is a deliberate
 * limit - resolving a card component across files is the kind of static
 * analysis that misreports. Where a section genuinely renders a card someone
 * else declares, the file holding the marker is named, and the check below
 * still verifies a marker exists there. So this records where to look rather
 * than waving the section through.
 */
/**
 * Sections whose reveal is one unit rather than a list, so it carries no index.
 *
 * The stagger check below counts markers against `--reveal-index`, on the
 * assumption that a marked element is one of several. A section header is not:
 * its eyebrow, headline and body are a single block of copy, and staggering the
 * three lines reads as fussy rather than as arrival. Named here so "no index"
 * is a decision rather than an omission.
 */
const singleUnitReveals = new Map<string, string>([
  [
    "SectionHeaderCompactSectionV3.tsx",
    "eyebrow, headline and body are one block of copy",
  ],
  ["SectionHeaderLargeSectionV3.tsx", "the section is a single headline"],
]);

const sharedMarkerSources = new Map<string, string>([
  [
    "HorizontalCardLinkGridTwoUpSectionV3",
    // Renders `HorizontalCardLink`, which the 3-up grid declares and marks.
    "HorizontalCardLinkGridSectionV3.tsx",
  ],
]);

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
      const shared = sharedMarkerSources.get(component);

      if (shared) {
        const source = sources.get(shared);

        expect(
          source,
          `${component} is recorded as taking its marker from ${shared}, which does not exist`,
        ).toBeDefined();
        expect(
          revealMarker.test(source ?? ""),
          `${component} is recorded as taking its marker from ${shared}, but that file marks nothing`,
        ).toBe(true);
        continue;
      }

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
   * The builder replays an entrance by restarting it where it stands.
   *
   * An entrance plays when a section arrives, so clicking the toggle can never
   * show its effect on a section already on screen. The builder answers that by
   * putting the frame back into the waiting state and straight into the
   * arriving one, which restarts the same timed animation a visitor gets.
   *
   * Two earlier attempts are pinned out of existence here. A parallel
   * clock-based rule behind `data-pagebuilder-animation-replay` could not
   * restart, because a CSS animation only restarts when `animation-name`
   * changes and swapping the timeline kept the name. Scrolling the canvas back
   * through the section did restart it, but read as a harsh jump.
   */
  it("replays an entrance by resetting the frame's state", () => {
    const builder = sources.get("PagebuilderShell.tsx") ?? "";

    expect(
      builder.includes("animationStateAttribute"),
      "the builder no longer resets the frame's animation state, so the Play button cannot restart anything",
    ).toBe(true);

    for (const [file, source] of sources) {
      expect(
        source.includes("data-pagebuilder-animation-replay"),
        `${file} still carries the clock-based replay attribute - that rule is gone from globals.css, so the attribute now selects nothing`,
      ).toBe(false);
    }
  });

  /**
   * The observer is the only thing that sets the arriving state, and a section
   * must never set it for itself.
   *
   * Same rule as the animation attribute, for the same reason: a section that
   * could put itself into the arriving state would animate regardless of its
   * toggle, and "off by default" would be false for whichever sections had
   * opted themselves in.
   */
  it("never lets a section set its own animation state", () => {
    for (const [file, source] of sources) {
      if (frameOwners.has(file)) {
        continue;
      }

      expect(
        source.includes("data-pagebuilder-animation-state"),
        `${file} sets the animation state itself - that belongs to SectionEntrance, not to a section`,
      ).toBe(false);
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
      if (frameOwners.has(file) || singleUnitReveals.has(file)) {
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

  /**
   * Every section in the library has an answer, and "unmarked" is no longer one.
   *
   * The exclusion set was written while the rollout was partial, when it had to
   * carry the distinction between "must not animate" and "nobody has got to it
   * yet". The rollout is finished, so the second meaning is gone - and this is
   * what stops it coming back. A new section now has to say which it is, in the
   * same breath as being registered, rather than joining a silent middle
   * category that nobody can tell apart from an oversight.
   *
   * Registry-driven on purpose: `sectionLibraryV3Registry` is what pagebuilder
   * offers, so a section can only reach an editor through it.
   */
  it("gives every registered section an answer, offered or excluded", () => {
    const unaccounted = sectionLibraryV3Registry
      .map((entry) => entry.component)
      .filter(
        (component) =>
          !animationComponents.has(component) &&
          !animationExcludedComponents.has(component),
      )
      .sort();

    expect(
      unaccounted,
      "these are neither offered the entrance nor recorded as never animating, so nobody can tell whether that is a decision or an omission - mark the section and add it to animationComponents, or record why it must stay still in animationExcludedComponents",
    ).toEqual([]);
  });

  /**
   * The other direction: both sets name sections that exist.
   *
   * A renamed or deleted component leaves a stale entry that reads as coverage
   * and provides none, and the scans above are per file - they cannot see a
   * registry entry pointing at nothing.
   */
  it("names only registered sections in either set", () => {
    const registered = new Set<string>(
      sectionLibraryV3Registry.map((entry) => entry.component),
    );
    const unknown = [
      ...animationComponents,
      ...animationExcludedComponents.keys(),
    ]
      .filter((component) => !registered.has(component))
      .sort();

    expect(
      unknown,
      "these are named by the animation sets but are not in the section library, so the entry is stale - a rename or a deletion left it behind",
    ).toEqual([]);
  });

  it("never both offers and excludes the same section", () => {
    const both = [...animationExcludedComponents.keys()]
      .filter((component) => animationComponents.has(component))
      .sort();

    expect(
      both,
      "these are recorded as never animating and also offered the control - one of the two is wrong",
    ).toEqual([]);
  });

  it("keeps no marker class in an excluded section", () => {
    // The exclusions are the reason a section is unmarked, so a marker appearing
    // in one means someone swept it without reading why it was left out. The
    // marker would be inert - the control is not offered - which is precisely
    // what makes it worth catching here rather than in review.
    const marked: string[] = [];

    for (const [component, reason] of animationExcludedComponents) {
      const file = fileFor(component);

      expect(
        file,
        `animationExcludedComponents names ${component}, which has no export`,
      ).toBeDefined();

      if (!file) {
        continue;
      }

      const source = sources.get(file) ?? "";

      // A multi-section file may legitimately hold a marked section beside an
      // excluded one, so this only fires when nothing in the file is offered
      // the control - which is the case where the marker can only be the
      // excluded section's.
      const exports = [...source.matchAll(/export function (\w+)/g)].map(
        (match) => match[1],
      );

      if (
        revealMarker.test(source) &&
        !exports.some((name) => animationComponents.has(name))
      ) {
        marked.push(`${component} (${file}) — excluded because ${reason}`);
      }
    }

    expect(
      marked.sort(),
      "these are excluded from the animation axis but carry a marker class, which can only be inert",
    ).toEqual([]);
  });

  it("keeps the single-unit list honest", () => {
    // Two ways an entry rots: the file stops marking anything, or it grows a
    // stagger index and is no longer a single unit.
    const stale: string[] = [];

    for (const [file, reason] of singleUnitReveals) {
      const source = sources.get(file);

      expect(source, `singleUnitReveals names ${file}, which does not exist`)
        .toBeDefined();

      if (!source) {
        continue;
      }

      if (!revealMarker.test(source) || source.includes('"--reveal-index"')) {
        stale.push(`${file} — listed as: ${reason}`);
      }
    }

    expect(
      stale.sort(),
      "these are recorded as single-unit reveals but no longer look like one - either the marker went away or it gained a stagger index",
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
