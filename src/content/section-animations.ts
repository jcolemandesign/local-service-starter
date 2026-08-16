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
  /**
   * The unit whose purpose is the action - a CTA panel, a conversion block, the
   * card that holds the button.
   *
   * THE SEVENTH ROLE, AND THE VOCABULARY DID NOT GROW LIGHTLY. The Phase 5
   * write-up concluded six was right, and it was - for the suites that existed
   * then. This one arrived with a suite that is ABOUT the action, and no
   * existing role could carry it: `accent` is visual emphasis (a stat, a
   * badge), `card` is one of several, `frame` is a composite. "The thing the
   * reader is meant to do" is a different fact about the markup, and it is the
   * fact an entire class of attention suites will key on.
   *
   * IT GOES ON THE UNIT, NOT ON THE BUTTON. Every CTA section in this library
   * already marks a block that CONTAINS its button - a copy column, a
   * conversion card - so marking the button too would nest a revealable unit
   * inside a revealable unit, and two opacity fades multiply into a muddy one.
   * The action unit is the panel that carries the action.
   */
  "action",
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
  /**
   * The unit role this suite is ABOUT, if it is about one.
   *
   * Offered only on sections that mark that role. Omitted means "offered
   * wherever the entrance is offered", which is what a suite with no signature
   * role - like Rise - should be.
   *
   * This is derived availability, not a membership set: the suite names a role,
   * the sections name their roles, and the intersection is computed. Adding a
   * suite adds no list, and marking up a section adds it to every suite that
   * cares, with no edit to either file.
   */
  requiresRole?: SectionAnimationRole;
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
    /** No signature role - Rise is the entrance every section can have, so it
     *  is offered wherever the axis is. Stated rather than omitted so both
     *  suites carry the field and neither reads as an oversight. */
    requiresRole: undefined,
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
      action: "rise + fade - Rise makes no special case of the action",
    },
    /**
     * One, which is exactly why Rise cannot validate the role vocabulary on its
     * own - it treats five of the six identically. A suite that differentiates
     * is what tells you whether six is the right number.
     */
    differentiatedRoles: ["media"],
  },
  {
    /**
     * RENAMED FROM `editorial`, and this is the one moment that was free.
     *
     * Persisted ids are never renamed here - `reveal` is still `reveal` for
     * exactly that reason. This one could be renamed because it had never been
     * offered: it shipped as a `prototype`, filtered out of the option list, so
     * no template, staged page, saved builder option or exported site can
     * contain the string `editorial`. There was nothing to migrate and nothing
     * to alias.
     *
     * That window is now closed. The moment this suite is selectable, the id is
     * frozen like every other.
     *
     * The new id is also the better one: it names the motion rather than a
     * mood, which is the rule every suite after `reveal` follows.
     */
    id: "wipe",
    label: "Wipe",
    status: "offered",
    description:
      "Text is revealed behind an edge travelling left to right. Nothing else moves — it fades in place.",
    guidance:
      "For sections led by a headline — the wipe is the whole point, so it is offered where a heading is marked as one.",
    /**
     * OFFERED ONLY WHERE IT DOES SOMETHING, and this is the one place the
     * "every suite is safe everywhere" claim needs qualifying.
     *
     * It is still true that a suite has an ANSWER for every role, so nothing
     * breaks if this runs on a section with no heading marked. But it would be
     * indistinguishable from Rise there, and an editor picking "Wipe" and
     * watching a rise is a control that appears to work and paints nothing.
     *
     * NOT A MEMBERSHIP SET PER VALUE - the thing this architecture exists to
     * avoid. `requiresRole` is derived: a suite names the role it is about, and
     * availability falls out of which sections mark that role. Nobody maintains
     * a list per suite, and a section that gains a heading role in the backfill
     * gains this suite with no edit here.
     */
    requiresRole: "heading",
    roles: {
      heading:
        "clip wipe, left to right, no travel - A WIPE, NOT TYPING; see §5.2 of the plan",
      content: "clip wipe, left to right - text is text, whatever size it is",
      card: "fade in place, staggered by --reveal-index",
      media: "fade in place",
      accent: "scale up from 94% while fading - a scale is not a travel",
      frame: "fade in place, as a single unit",
      action: "fade in place - the wipe is about the text, not the action",
    },
    /**
     * Three, and the ABSENTEES are the finding.
     *
     * `media` left the list when the suite stopped travelling: "fade without
     * rising" was a special case only while everything else rose, and now it
     * IS the default. A suite with one idea needs fewer exceptions than a suite
     * with two, which is the argument for having one.
     *
     * `card` and `frame` were never here. The difference between "a list that
     * staggers" and "one block that does not" is `--reveal-index`, which the
     * SECTION sets per element - a suite has no way to express it and no need
     * to.
     */
    differentiatedRoles: ["heading", "content", "accent"],
  },
  {
    /**
     * REBUILT, NOT PROMOTED, and the distinction matters.
     *
     * A `pulse` rule has sat dormant in `globals.css` since before the axis was
     * timed, and the handoff calls promoting it "one entry in the option list".
     * It is not, for a reason that has nothing to do with bookkeeping: that rule
     * was SCROLL-SCRUBBED - `animation-timeline: view()`, progress tied to
     * scroll position - which is the exact mechanism this axis was redesigned
     * away from. A trackpad flick put the whole range behind the reader in
     * ~150ms and the blip never registered. Shipping it as written would have
     * shipped the known-bad version of itself.
     *
     * So the intent survives and the mechanism does not: same idea, on a clock,
     * inside the timed-suite contract like every other suite.
     */
    id: "pulse",
    label: "Pulse",
    status: "offered",
    description:
      "Everything fades in place, then the action block gives one soft beat once it has landed.",
    guidance:
      "For sections whose job is a decision — a CTA panel, a conversion block. Nothing else moves, because the beat only reads as “look here” while it is the only thing moving.",
    /**
     * The action is the whole point, so it is also the gate. On a section with
     * no action unit this would be Rise with extra steps.
     */
    requiresRole: "action",
    /**
     * Every role fades at the same moment - this is the one suite with no
     * stagger. A stagger is a sequence, and a sequence is something to watch;
     * the beat needs that attention to itself.
     */
    roles: {
      heading: "fades in with everything else",
      content: "fades in with everything else",
      card: "fades in with everything else - no stagger in this suite",
      media: "fades in with everything else",
      accent: "fades in with everything else",
      frame: "fades in with everything else",
      action:
        "fades in with everything else, then one scale beat once it has landed - ONE beat, not a loop",
    },
    /**
     * One, and deliberately one. A suite that emphasised several roles would
     * emphasise nothing: the beat reads as "look here" only while it is the
     * only thing moving after the section has settled.
     */
    differentiatedRoles: ["action"],
  },
  {
    id: "lateral",
    label: "Lateral",
    status: "offered",
    description:
      "The image slides in from off-screen; everything else fades quietly in place.",
    guidance:
      "For sections with a strong left/right composition. One element carries the movement and the rest simply appear — a slide only reads as emphasis while it is the only one.",
    /**
     * NO SIGNATURE ROLE, and that is the answer to the obvious wrinkle.
     *
     * The temptation is `requiresRole: "media"`, since sliding a panel in from
     * off-screen is the reason to reach for this. Do not: the gate is computed
     * per COMPONENT, and whether a section has an image is often a per-INSTANCE
     * toggle. A media gate would offer Lateral on a section whose image is
     * currently switched off, which is the failure the gate exists to prevent,
     * and would keep offering it after someone switched the image off - a
     * control that silently stops meaning anything.
     *
     * So the suite is built not to need one. Cards, panels and frames all
     * travel, so a section with its image off still slides its remaining units;
     * a section with no media at all is still a coherent Lateral. The media
     * rule simply has nothing to match, which costs nothing. A suite that works
     * whether or not an optional element is present needs no gate, and that is
     * a better answer than teaching the gate about instance state.
     */
    requiresRole: undefined,
    /**
     * No stagger anywhere in this suite. Everything fades in together and one
     * element travels, so there is exactly one thing to watch - a staggered row
     * would pull the eye along itself while the lead is trying to be the
     * moving element.
     */
    roles: {
      heading: "fades in with everything else",
      content: "fades in with everything else",
      card: "fades in with everything else - no stagger in this suite",
      media:
        "THE SLIDE - in from off-screen, 100% of its own width, so it starts one panel outside its own box",
      accent: "fades in with everything else",
      frame: "fades in with everything else",
      action: "fades in with everything else",
    },
    /**
     * ONE, and the count is the design.
     *
     * The first version slid the cards and the panels too, which made the
     * section a page that moves rather than a page with one thing moving. A
     * slide only says "look at this" while it is the only slide on the screen,
     * so everything that is not the lead fades in place and the media panel
     * carries the motion by itself.
     *
     * Direction is not in this list because it is not a role. Which side a
     * panel enters from is a fact about the section's layout - often per
     * variant - so the section declares it with `reveal-from-end` and the suite
     * reads it. Default is the inline start.
     */
    differentiatedRoles: ["media"],
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
 * Which sections mark which unit roles.
 *
 * The registry side of the role markup. It exists because a suite's
 * availability is derived from the roles a section marks, and nothing at
 * RUNTIME can read a `className` out of a section's source - the tests scan
 * files, the builder cannot.
 *
 * So this is the one hand-maintained fact in the role system, and it is pinned
 * from both directions by `animation-marker-ownership.test.ts`: a component
 * listed here must carry that role class, and a file carrying the class must
 * have its section listed. A stale entry fails rather than quietly offering a
 * suite that does nothing.
 *
 * ONLY THE ROLES A SUITE ASKS ABOUT NEED TO BE HERE. `heading` is populated
 * because Wipe is about headings; the other five have no suite gated on them,
 * so listing them would be bookkeeping nobody reads. Phase 6's backfill fills
 * this in as it goes.
 */
export const sectionAnimationRoleComponents: Partial<
  Record<SectionAnimationRole, readonly string[]>
> = {
  heading: [
    "SectionHeaderCompactSectionV3",
    "SectionHeaderLargeSectionV3",
    "SectionHeaderSplitLinkSectionV3",
    "CTASectionV3",
    "CTAFullscreenSectionV3",
    "ProcessStepsStaggeredSectionV3",
    "ProcessStepsBranchingSectionV3",
    /**
     * Its eyebrow and its statement are two marked units on the same index -
     * one header split across two grid cells because the layout puts them
     * side by side. Both carry the heading role, so the wipe crosses them
     * together rather than racing two edges down the page.
     */
    "ContentAboutCompanySectionV2",
    "ContentAboutStorySectionV3",
    "DecisionMatrixCardSectionV3",
    "DecisionQuestionTableSectionV3",
    "DecisionSplitDecisionSectionV3",
    "ContactSectionModalBegin",
    "ServiceAreaZipLookupSectionV3",
    "QuickPageLinksSectionV2",
    "ContactSectionV3",
  ],
  /**
   * The CTA sections with ONE action unit.
   *
   * `CTAServiceTriageSectionV3` is deliberately absent: its actions live on
   * several triage cards, so there is no single thing for a beat to point at,
   * and pulsing all of them at once points at nothing. Its cards stay `card`,
   * and it simply is not offered Pulse - which is the gate doing its job rather
   * than an omission.
   */
  action: [
    "CTAImageSectionV3",
    "CTASectionV3",
    "CTAMutedSectionV3",
    "CTAFullscreenSectionV3",
    "CTASmallBandImageSectionV3",
    /** Not a CTA section, but one of its three columns is the CTA column, and
     *  that column is the unit a beat should point at. */
    "ContentThreeColumnMixedSectionV3",
    /** The offer band is one bordered unit whose reason for existing is its
     *  offer and its button. */
    "FeaturedOfferSectionV3",
    /** The request panel is the section; the strip beside it is context. */
    "ContactSectionModalBegin",
    "ServiceAreaZipLookupSectionV3",
    "ContactSectionV3",
  ],
};

/** Whether a section marks a given kind of unit. */
export function sectionMarksRole(
  component: string,
  role: SectionAnimationRole,
) {
  return sectionAnimationRoleComponents[role]?.includes(component) ?? false;
}

/** The suites worth offering on one section: those with no signature role, plus
 *  those whose signature role this section actually marks. */
export function sectionAnimationSuitesFor(component: string) {
  return offeredSectionAnimationSuites.filter(
    (suite) =>
      !suite.requiresRole || sectionMarksRole(component, suite.requiresRole),
  );
}

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

/**
 * The option list for one section.
 *
 * Same list, minus the suites whose signature role this section does not mark.
 * Every screen that offers the control must use this rather than the full list
 * above, or it offers a suite that would do nothing there.
 */
export function sectionAnimationOptionsFor(
  component: string,
): ReadonlyArray<{ label: string; value: string }> {
  return [
    { label: "Use template default", value: "" },
    { label: "None", value: "none" },
    ...sectionAnimationSuitesFor(component).map((suite) => ({
      label: suite.label,
      value: suite.id,
    })),
  ];
}
