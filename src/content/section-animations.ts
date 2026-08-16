/**
 * THE ANIMATION LIBRARY: UNIT ROLES x MOTION SUITES.
 *
 * A section marks which of its elements are revealable units and what kind of
 * unit each one is - a heading, a card, a bled media panel. It never says how
 * any of them move. The frame's `data-pagebuilder-animation` attribute names a
 * SUITE, and the suite answers how every role arrives. Same split as the colour
 * recipes: the section declares what a thing IS, the system declares how it
 * LOOKS.
 *
 * WHY ROLES RATHER THAN MORE ENUM VALUES. The obvious move is to widen the
 * animation enum - `reveal | slide-left | wipe | scale-in`. That is the trap
 * `pulse` already documents: a value that only makes sense on some sections
 * needs a membership set per value, which is 10 values x 97 sections of
 * hand-maintained lists, and "which sections may use the wipe" is a per-section
 * motion decision wearing a registry's clothes. A suite answers every role, so
 * every suite is safe on every marked section and no membership set is needed.
 *
 * WHAT THIS FILE IS AUTHORITATIVE OVER, AND WHAT IT IS NOT. It owns the ids,
 * the labels, the option list and the DOCUMENTED role mapping. It does not own
 * the movement - that lives in `globals.css`, because a role's effect is a
 * selector and a keyframe. So the `roles` record below is a description of what
 * the stylesheet does, and the two can drift: this file can claim `media:
 * "fade only"` while the stylesheet rises. `animation-css-agreement.test.ts`
 * narrows that gap - it requires every offered suite to have both halves of the
 * CSS contract - but it cannot read a keyframe and tell you it looks like a
 * fade. THAT GAP IS ACCEPTED DELIBERATELY rather than closed by generating the
 * CSS from here; if it ever bites, generation is the fix, not a bigger test.
 *
 * See `reference code/animation-library-plan.txt` for the full design, and
 * `docs/animation-axis-handoff.md` for the entrance axis this builds on.
 */

/**
 * What kind of unit a marked element is. A closed set, enforced by
 * `animation-marker-ownership.test.ts` - a typo'd `reveal-role-heading2` fails
 * the test rather than silently landing on the default.
 *
 * Six, and `accent` is the least certain of them. The vocabulary is only
 * properly tested by a suite that treats roles DIFFERENTLY, so it is deliberate
 * that a differentiating suite is prototyped before the library is backfilled -
 * classifying 86 marker sites against an untested taxonomy is how you get one
 * you have to redo.
 */
export const sectionAnimationRoles = [
  /** A section heading, eyebrow, or header block. */
  "heading",
  /** Prose, body copy, a paragraph split. THE DEFAULT - see the CSS fallback. */
  "content",
  /** An independent card in a grid or list. Normally the staggered one. */
  "card",
  /** An image, a bled panel, a video frame. */
  "media",
  /** A stat, a badge, a small emphatic figure. */
  "accent",
  /** A composite unit that reveals as one block rather than as its parts. */
  "frame",
] as const;

export type SectionAnimationRole = (typeof sectionAnimationRoles)[number];

/**
 * The role a marked element gets when it does not name one.
 *
 * Declared here AND as a CSS fallback, because the two protect different
 * things: the fallback keeps hand-written pages and already-exported sites
 * working, and this constant is what the gallery and the tests read. Inside the
 * section library the fallback is not allowed to be load-bearing - every marker
 * there carries an explicit role once the backfill lands.
 */
export const defaultSectionAnimationRole: SectionAnimationRole = "content";

/** The class that marks an element as a given kind of unit. */
export function sectionAnimationRoleClass(role: SectionAnimationRole) {
  return `reveal-role-${role}`;
}

type SectionAnimationSuiteDefinition = {
  /**
   * The PERSISTED id. Named for its motion.
   *
   * `reveal` is the one grandfathered exception - it is named for the axis
   * rather than for the movement, and it stays that way. Persisted values are
   * opaque ids and this project does not rename them (`add-section/SKILL.md`,
   * `builder-workflow.md` §3), for the reason `renamedSectionColorRecipes`
   * writes out: the id is in page templates, staged pages, saved builder
   * options and exported sites, and the dev server rewrites several of those on
   * its own schedule. An alias cannot race anything; a migration can.
   */
  id: string;
  /** What the editor sees. Ids are machine vocabulary, labels are editorial. */
  label: string;
  /**
   * Whether the builder offers this suite yet.
   *
   * `prototype` means: real CSS, real gallery specimen, NOT in the option list.
   * The two lists diverge for one session-specific reason and it is worth
   * writing down, because "just offer it" is the tempting shortcut.
   *
   * A suite is only as expressive as the roles the library has been marked up
   * with, and the backfill has not happened yet. Until it does, almost every
   * marked element in the library is an unroled `content` unit - so a suite
   * that differentiates would look IDENTICAL to Rise on nearly every section an
   * editor could pick it for. That is precisely the "control that appears to
   * work and paints nothing" failure the membership sets exist to prevent,
   * arriving by a different door.
   *
   * It is also what the prototype is FOR: a suite that treats roles the same
   * cannot tell you whether the roles are right. So the suite has to exist and
   * be watchable before the backfill, and must not be selectable until after
   * it. Promotion is one word here.
   */
  status: "offered" | "prototype";
  /** One line, shown in the builder control and the style-guide gallery. */
  description: string;
  /** What content the suite suits, for the gallery. */
  guidance: string;
  /**
   * An intent for every role, exhaustively.
   *
   * Required for all six even where the suite treats them identically, because
   * this is the documentation and the gallery's per-role caption. It does NOT
   * mean six CSS selectors: the stylesheet needs a default rule per suite, plus
   * a role selector only for the roles named in `differentiatedRoles`.
   */
  roles: Record<SectionAnimationRole, string>;
  /**
   * The roles this suite moves DIFFERENTLY from its own default rule - i.e.
   * exactly the roles that must carry a gated `.reveal-role-*` selector.
   *
   * Stated rather than inferred from the prose above, because prose is not a
   * differentiator: "rise + fade" and "rise + fade, as one block" describe the
   * same motion in different words, and a test that diffed them would demand a
   * selector for a role that needs none. This is an author's claim about the
   * stylesheet, and `animation-css-agreement.test.ts` checks it BOTH WAYS - a
   * named role with no rule, and a rule for a role not named here. The second
   * direction is the one that catches a suite quietly growing a behaviour its
   * description does not mention.
   */
  differentiatedRoles: readonly SectionAnimationRole[];
};

/**
 * The offered suites.
 *
 * `as const satisfies` rather than a plain annotation is load-bearing: a bare
 * `SectionAnimationSuiteDefinition[]` collapses `id` to `string` and
 * `SectionAnimationSuiteId` with it, which would take the compile-time
 * guarantee the axis currently has and quietly replace it with `string`.
 */
export const sectionAnimationSuites = [
  {
    id: "reveal",
    label: "Rise",
    status: "offered",
    description: "Units rise a short distance and fade in as they arrive.",
    guidance:
      "The default entrance. Suits everything, which is also why it cannot tell you whether the role vocabulary is right.",
    roles: {
      heading: "rise + fade",
      content: "rise + fade, as one block",
      card: "rise + fade, staggered by --reveal-index",
      media:
        "fade only, no rise - a bled panel that travels opens a band of bare ground beneath it",
      accent: "rise + fade",
      frame: "rise + fade, as a single unit",
    },
    /**
     * One, which is exactly why Rise cannot validate the role vocabulary on its
     * own - it treats five of the six identically. A suite that differentiates
     * is what tells you whether six is the right number.
     */
    differentiatedRoles: ["media"],
  },
  {
    id: "editorial",
    label: "Editorial",
    /**
     * PROTOTYPE. Its job is to answer three questions about the vocabulary
     * before 86 marker sites are classified against it - see the report in
     * `docs/animation-axis-handoff.md` §8.
     */
    status: "prototype",
    description:
      "The heading wipes in behind a moving edge; cards rise, accents scale up, media fades.",
    guidance:
      "For sections led by a headline. The first suite that treats roles differently, which is what makes it the test of whether the roles are right.",
    roles: {
      heading:
        "clip wipe, left to right, no travel - A WIPE, NOT TYPING; see §5.2 of the plan",
      content: "rise + fade, as one block",
      card: "rise + fade, staggered by --reveal-index",
      media: "fade only, no rise - same reason as Rise",
      accent: "scale up from 94% while rising and fading",
      frame: "rise + fade, as a single unit",
    },
    /**
     * Three, and the two ABSENTEES are the finding.
     *
     * `card` and `frame` are not here because neither needed a rule: the
     * difference between "a list that staggers" and "one block that does not"
     * is `--reveal-index`, which the SECTION sets per element. A suite has no
     * way to express it and no need to.
     */
    differentiatedRoles: ["heading", "media", "accent"],
  },
] as const satisfies readonly SectionAnimationSuiteDefinition[];

export type SectionAnimationSuiteId =
  (typeof sectionAnimationSuites)[number]["id"];

/**
 * The section's entrance animation.
 *
 * Moved here from `section-color-recipes.ts`, where it only ever sat by
 * accident of history - it is not a colour recipe and never was. That module
 * re-exports it so existing imports keep resolving.
 *
 * `none` is the resolved default, which is the one place this axis differs from
 * every other: elsewhere an unset value inherits a sensible visual, and here it
 * has to mean off. Animation is opt-in per section, and that guarantee is why a
 * project-level default suite has to be opted into by an explicit `site` value
 * rather than by applying a default to blank sections.
 */
export type SectionAnimation = "none" | SectionAnimationSuiteId;

const suiteIds = new Set<string>(
  sectionAnimationSuites.map((suite) => suite.id),
);

export function isSectionAnimationSuite(
  value: string | undefined,
): value is SectionAnimationSuiteId {
  return value !== undefined && suiteIds.has(value);
}

export function sectionAnimationSuite(id: string) {
  return sectionAnimationSuites.find((suite) => suite.id === id);
}

/**
 * STORAGE NORMALISATION IS NOT RENDER RESOLUTION, and these are two functions
 * for that reason.
 *
 * This one preserves `undefined` - meaning "inherit whatever the template
 * saved" - accepts `none` and any registered suite id, and drops anything else.
 * `resolveSectionAnimation` turns missing or unknown into `none` instead.
 *
 * One function doing both is wrong the moment inheritance exists, because
 * "unknown" and "inherit" need opposite treatment: unknown must collapse to
 * off, and inherit must stay blank so the layer below still gets its say.
 */
export function parseStoredSectionAnimation(
  value: unknown,
): SectionAnimation | undefined {
  if (typeof value !== "string" || value === "") {
    return undefined;
  }

  return value === "none" || isSectionAnimationSuite(value)
    ? (value as SectionAnimation)
    : undefined;
}

/**
 * The animation a section actually plays.
 *
 * `none` when unset, unlike every other resolver in `section-style-options.ts`.
 * Anything unrecognised also lands on `none`, so a template saved with a suite
 * that has since been removed renders a still section rather than an attribute
 * no stylesheet matches.
 */
export function resolveSectionAnimation(
  animation: string | undefined,
): SectionAnimation {
  return isSectionAnimationSuite(animation) ? animation : "none";
}

/** Suites an editor can actually choose. Prototypes are watchable in the style
 *  guide and deliberately absent here - see `status`. */
export const offeredSectionAnimationSuites = sectionAnimationSuites.filter(
  (suite) => suite.status === "offered",
);

/**
 * The builder's option list, derived rather than hand-written.
 *
 * Hand-listing it is how the option list and the registry drift apart, and the
 * drift is invisible from either file. `""` is "inherit the template", which is
 * what every style override means by blank.
 */
export const sectionAnimationOptions = [
  { label: "Use template default", value: "" },
  { label: "None", value: "none" },
  ...offeredSectionAnimationSuites.map((suite) => ({
    label: suite.label,
    value: suite.id,
  })),
] as const satisfies ReadonlyArray<{ label: string; value: string }>;
