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

import type { MotionControlGroupId } from "@/content/motion-tokens";

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
  /**
   * A TEXT BLOCK WORTH SPLITTING INTO ITS VISUAL LINES.
   *
   * THE EIGHTH ROLE, AND IT NAMES THE BLOCK, NOT THE LINE. Both halves of that
   * are load-bearing. A role has to sit on the element carrying
   * `reveal-on-scroll`, so a role per line would either nest a revealable unit
   * inside one or replace the block as the unit - and replacing it would cost
   * the section every suite gated on `heading`. More decisively, THE LINES DO
   * NOT EXIST YET: they are a fact about the width the browser laid the text out
   * at, and nothing server-rendered can name them.
   *
   * So the block declares itself splittable and a suite that cares finds the
   * lines after layout - see `TextWipeLines`, which is the only JavaScript on
   * this axis besides the observer itself. Reaching inside a unit is not new:
   * `settle` already reaches into a media unit for its picture. What is new is
   * that the thing being reached for has to be made first.
   *
   * NOT SOLVED BY AUTHORING THE BREAKS, and it was tried. If the lines are
   * written as elements the copy's breaks stop belonging to the measure: a
   * statement authored as four fragments came out as five ragged display lines
   * with `text-wrap: balance` splitting the long one down the middle. The
   * typography has to stay flowing responsive text, which means the split is a
   * runtime job or it is nothing.
   *
   * IT ARRIVED WITH THE SUITE THAT IS ABOUT IT, exactly as `action` did. No
   * existing role could carry it - `heading` and `content` only say the block is
   * text, and a suite gated on either would be offered on sixteen sections that
   * want one edge across the whole block.
   */
  "lines",
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
  /**
   * The Style Guide control groups this suite's live behaviour is authored
   * through. Required, and required to be non-empty.
   *
   * NO ANIMATION MAY EXIST WHOSE BEHAVIOUR CANNOT BE AUTHORED. A suite that
   * reuses the shared rhythm names only `rhythm`; a suite that owns numbers of
   * its own names its own group too, and that group has to exist in
   * `motion-tokens.ts` with a control for every token the suite's rules read.
   * If a new suite's motion model cannot reasonably use an existing group,
   * adding the suite means adding its tokens and its controls in the same
   * change - not shipping a suite that can only be tuned by editing a
   * stylesheet.
   *
   * This is a required field rather than an optional one so that omitting it is
   * a compile error rather than something noticed a session later, which is how
   * the axis got a style guide that promoted nothing in the first place.
   *
   * Checked both ways by `motion-token-agreement.test.ts`: a named group that
   * does not exist, and a registered group no suite claims.
   */
  controlGroups: readonly MotionControlGroupId[];
  /**
   * What starts this suite.
   *
   * `scroll` is the axis as designed: the observer sets a state when the frame
   * crosses the trigger line, and the CSS answers it. `load` is for sections
   * that are on screen before any of that can happen - those rules read no
   * animation state at all and run from first paint on the server-rendered
   * attribute.
   *
   * THE TWO ARE MUTUALLY EXCLUSIVE PER SECTION, not per suite. A scroll suite on
   * an above-the-fold section never plays, and a load suite on a below-fold one
   * has finished before the reader arrives - so `sectionAnimationSuitesFor`
   * offers one set or the other by asking where the section is used, and no
   * suite needs a veto list.
   *
   * That replaced one. The first load suite was gated by striking it from every
   * scroll-triggered section by name, which worked only because it happened to
   * carry `requiresRole: "media"` and there were ten of them. The next load
   * suite had no signature role at all, so the same approach wanted ~57 entries
   * - which is the point at which a list stops being an exception and becomes
   * the mechanism, badly.
   */
  trigger: "scroll" | "load";
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
      lines: "not addressed - a marked block arrives as one, lines and all",
    },
    /**
     * One, which is exactly why Rise cannot validate the role vocabulary on its
     * own - it treats five of the six identically. A suite that differentiates
     * is what tells you whether six is the right number.
     */
    differentiatedRoles: ["media"],
    /** Rise has a module of its own now. The distance is the reason: it is the
     *  only vertical travel in the library, so it was never shared - it merely
     *  lived in the shared group and was read by one suite. */
    trigger: "scroll",
    controlGroups: ["rhythm", "reveal"],
  },
  {
    /**
     * THE QUIET ONE. Rise without the travel.
     *
     * WHY THIS IS NOT "RISE WITH DISTANCE 0". The distance is a shared token, so
     * turning it down answers for all 57 sections at once. A section that wants
     * stillness while the library keeps its travel cannot say so on Rise, and
     * the only vocabulary left would be a section overriding a token inline -
     * which `animation-marker-ownership.test.ts` forbids, and rightly: that is a
     * section deciding how it moves.
     *
     * A suite is the unit of "how this section arrives", so the answer is a
     * suite. It costs one CSS rule pair and no tokens.
     */
    id: "fade",
    label: "Fade",
    status: "offered",
    /** No signature role. A fade suits every kind of unit equally, which is the
     *  same reason Rise carries no gate - and, unlike Rise, is also true of its
     *  every role rather than five of seven. */
    requiresRole: undefined,
    description:
      "Units fade up in place, staggered by reading order. Nothing moves.",
    guidance:
      "The quiet entrance. For a band under something already moving, a page that has spent its one big arrival, or anywhere a travel would read as fussy.",
    roles: {
      heading: "fade in place",
      content: "fade in place, as one block",
      card: "fade in place, staggered by --reveal-index",
      media: "fade in place - the same answer as everything else here",
      accent: "fade in place",
      frame: "fade in place, as a single unit",
      action: "fade in place - Fade makes no special case of the action",
      lines: "not addressed - a marked block arrives as one, lines and all",
    },
    /**
     * NONE, and that is the finding rather than an oversight.
     *
     * Rise differentiates `media` because a bled panel that travels opens a band
     * of bare ground beneath it - a defect of the movement, not of the panel.
     * Remove the movement and the defect goes with it, so the exception
     * dissolves and every role gets one answer. Wipe recorded the same thing
     * when it stopped travelling.
     *
     * A suite with one idea needs no exceptions, which is the argument for
     * having one.
     */
    differentiatedRoles: [],
    /** The shared spine plus its own tempo and stagger. It owns no shape, so
     *  those two are the whole of it. */
    trigger: "scroll",
    controlGroups: ["rhythm", "fade"],
  },
  {
    /**
     * THE SECOND OPINION ON `media`, and that is half of why it exists.
     *
     * Rise and Lateral both answer that role, and until now they agreed on the
     * important half: a bled panel does not travel. One behaviour described by
     * two suites is a single data point wearing a vocabulary's clothes -
     * `media` could just as well have been spelled "the thing that must not
     * move", and nothing in the library could tell the difference.
     *
     * Settle moves it, in the one way that does not open a band of bare ground
     * beneath the crop: the image scales inside its own frame rather than
     * travelling out of it. So the role now has suites that treat it
     * differently rather than suites that agree by default, which is what tells
     * us whether `media` is carrying a real distinction.
     */
    id: "settle",
    label: "Settle",
    status: "offered",
    description:
      "The image eases down into its frame from 1.06 while it fades. Everything else rises.",
    guidance:
      "For image-led sections — a full-bleed feature photograph, an image CTA. The settle is the whole point, so it is offered where a media panel is marked.",
    /**
     * Offered only where a media panel is marked, for the same reason Wipe gates
     * on a heading: without one this is Rise exactly, and an editor picking
     * "Settle" and watching a plain rise is a control that appears to work and
     * paints nothing.
     */
    requiresRole: "media",
    roles: {
      heading: "rise + fade",
      content: "rise + fade, as one block",
      card: "rise + fade, staggered by --reveal-index",
      media: "THE SETTLE - scales from 1.06 to 1 while fading, no travel",
      accent: "rise + fade",
      frame: "rise + fade, as a single unit",
      action: "rise + fade - Settle makes no special case of the action",
      lines: "not addressed - a marked block arrives as one, lines and all",
    },
    /**
     * One, and it is the opposite one from Rise's.
     *
     * Rise names `media` to take movement AWAY from it - the panel is the thing
     * that must not travel. Settle names the same role to give it a movement of
     * its own. Same role, opposite exceptions, which is the clearest evidence
     * available that the role is about what a unit IS rather than about what it
     * must not do.
     */
    differentiatedRoles: ["media"],
    /** The shared spine, plus the scale and travel that are its own. */
    trigger: "scroll",
    controlGroups: ["rhythm", "settle"],
  },
  {
    /**
     * SETTLE, PLAYED BY THE PAGE RATHER THAN BY THE SCROLL.
     *
     * Same gesture as `settle`, different trigger, and the trigger is the only
     * reason it is a second entry rather than an option on the first. A hero is
     * above the fold at load, so there is no arrival to trigger - which is why
     * every hero is excluded from this axis. This suite's CSS carries no
     * animation-state selector at all: it is gated on the attribute the frame
     * renders server-side, so it plays from first paint with no JavaScript in
     * the path.
     *
     * IT CANNOT BE A STATE OF `settle`. The observer sets `settled` on
     * above-the-fold frames, but it does so on mount - after first paint - so an
     * animation hung off that state blanks something already on screen and fades
     * it back in. And `settle`'s own rules cannot simply drop their state gate,
     * because they would then fire at load on the ten below-fold sections that
     * use them, which is exactly the scroll trigger those sections exist for.
     *
     * PROTOTYPE SCOPE: one hero. The offering is a veto list rather than a
     * derived gate, and that is the honest shape for now - "above the fold"
     * is a property of where a section is used rather than of what it marks, so
     * there is nothing to derive from. If more heroes take this, the gate should
     * become the inverse of `animationExcludedComponents`' above-fold reason
     * rather than a longer list.
     */
    id: "settle-load",
    label: "Settle",
    status: "offered",
    description:
      "The image eases down into its frame as the page paints. Everything else fades in place.",
    guidance:
      "For a hero, where there is no scroll arrival to wait for. The only suite that plays without the observer.",
    requiresRole: "media",
    roles: {
      heading: "fade in place",
      content: "fade in place, as one block",
      card: "fade in place, staggered by --reveal-index",
      media: "THE SETTLE - scales from 1.06 to 1 while the panel holds still",
      accent: "fade in place",
      frame: "fade in place, as a single unit",
      action: "fade in place",
      lines: "not addressed - a marked block arrives as one, lines and all",
    },
    differentiatedRoles: ["media"],
    trigger: "load",
    /** Shares Settle's tokens outright. Two triggers, one gesture - giving the
     *  load version its own scale and tempo would let a hero drift away from
     *  the suite it is meant to be the same as. */
    controlGroups: ["rhythm", "settle"],
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
      lines: "not addressed - one edge crosses the whole block. Text wipe is the suite that crosses them one at a time",
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
    /** The shared rhythm for stagger and easing, plus its own two numbers: the
     *  length of the wipe itself, and where an accent starts before scaling up.
     *  Neither has an equivalent in Rise, which is the test for whether a suite
     *  has earned a group. */
    trigger: "scroll",
    controlGroups: ["rhythm", "wipe"],
  },
  {
    /**
     * WIPE, ONE LINE AT A TIME.
     *
     * The same edge and the same keyframe as its sibling - it reuses
     * `section-wipe` outright, so the two cannot drift apart in shape. What
     * differs is what the edge crosses: Wipe takes the block as one unit and
     * makes a single pass, and this takes the lines inside it and makes a pass
     * each, staggered by the shared step.
     *
     * WHY IT IS A SUITE RATHER THAN A WIPE WITH A STAGGER. The stagger is
     * already a token, and turning it up on Wipe would do nothing - Wipe's unit
     * IS the block, so there is one index and nothing to stagger against. The
     * difference is which elements the edge is applied to, and that is a suite's
     * job to decide. Same argument Fade made against being "Rise with distance
     * zero".
     *
     * GATED ON `line`, WHICH IS THE POINT. Offered on the sections that mark
     * their lines and nowhere else, so it cannot be chosen where it would be
     * indistinguishable from Wipe. Today that is one section; the gate is what
     * makes it more without an edit here.
     */
    id: "text-wipe",
    label: "Text wipe",
    status: "offered",
    description:
      "The statement is revealed line by line, each behind its own edge travelling left to right.",
    guidance:
      "For a section that IS its sentence - a statement set large across a few authored lines, with nothing else competing.",
    requiresRole: "lines",
    roles: {
      heading:
        "holds still - it is the container, and every ramp on screen belongs to a line",
      content: "fades in place, as one block",
      card: "fade in place, staggered by --reveal-index",
      media: "fade in place",
      accent: "scale up from 94% while fading, as under Wipe",
      frame: "fade in place, as a single unit",
      action: "fade in place - the wipe is about the text, not the action",
      lines:
        "THE WIPE - one edge per line, left to right, staggered by --reveal-index",
    },
    /**
     * Three, and the middle one is the interesting one.
     *
     * `lines` carries the wipe. `accent` is inherited from Wipe unchanged, because
     * a stat beside a statement is the same problem in both suites and giving
     * the two different answers would be a difference nobody asked for.
     *
     * `heading` IS DIFFERENTIATED IN ORDER TO DO NOTHING. The block holding the
     * lines takes an explicit stop rather than the suite's default fade: left on
     * the fade it would ramp the container's opacity while each line ran its
     * own, and two animations multiplied on the same pixels means the first line
     * finishes its wipe at seventy percent and keeps brightening afterwards.
     * Nothing should compete with the edge, and a parent fade is something
     * competing with the edge.
     */
    differentiatedRoles: ["accent", "heading", "lines"],
    /** Wipe's curve, Wipe's step, and ONE number of its own. The duration is
     *  where the two suites genuinely part: Wipe times a single edge across a
     *  block, this times an edge across one line several times over, and the
     *  length that reads as decisive on a headline is a flicker on a line.
     *  Everything else stays in Wipe's group, because a suite earns a control by
     *  owning a number with no equivalent elsewhere. */
    trigger: "scroll",
    controlGroups: ["rhythm", "wipe", "text-wipe"],
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
      lines: "not addressed - a marked block arrives as one, lines and all",
    },
    /**
     * One, and deliberately one. A suite that emphasised several roles would
     * emphasise nothing: the beat reads as "look here" only while it is the
     * only thing moving after the section has settled.
     */
    differentiatedRoles: ["action"],
    /** The shared rhythm for the fade every unit gets, plus the beat's own
     *  three numbers. The beat is not an entrance and cannot borrow an
     *  entrance's tempo: it starts after the section has landed, and its delay
     *  is measured from there. */
    trigger: "scroll",
    controlGroups: ["rhythm", "pulse"],
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
     * GATED ON `media`, AND THIS REVERSES AN EARLIER DECISION - the reasoning
     * is kept because the argument it lost to is worth having written down.
     *
     * This suite originally declared no signature role, on the grounds that
     * whether a section has an image is often a per-INSTANCE toggle: gate on
     * `media` and Lateral would be offered on a section whose image is
     * currently switched off, or keep being offered after someone switched it
     * off - a control that silently stops meaning anything.
     *
     * That argument was answered by looking at what the alternative actually
     * cost. TWO THINGS WERE WRONG WITH IT:
     *
     * 1. The gate reads the SOURCE, not the instance. A section that can show
     *    an image carries `reveal-role-media` in its markup unconditionally, so
     *    a component-level gate still offers Lateral there. The only case the
     *    old argument describes is an instance with its image switched off, and
     *    that one degrades to a fade - which is a graceful ending, not a
     *    failure.
     * 2. Ungated, Lateral was offered on all 57 animated sections and differed
     *    from a plain fade on the 10 that mark media. On the other 47 it was
     *    precisely the "control that appears to work and paints nothing"
     *    failure - reported from a section header, where a slide is not merely
     *    absent but impossible. Preventing a fade on one instance is not worth
     *    a dead control on 47 sections.
     *
     * The general lesson: a gate protecting against an INSTANCE-level absence
     * is the wrong tool, but that is an argument for accepting the instance
     * case, not for removing the gate.
     */
    requiresRole: "media",
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
      lines: "not addressed - a marked block arrives as one, lines and all",
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
    /** The shared rhythm for duration and easing - a slide is a travel like any
     *  other - plus its own two distances, which are in two different units and
     *  so could never have been the shared one. */
    trigger: "scroll",
    controlGroups: ["rhythm", "lateral"],
  },
  {
    id: "focus",
    label: "Focus",
    status: "offered",
    description:
      "The heading resolves out of a blur as it fades in. Everything else fades quietly in place.",
    guidance:
      "For sections led by a statement rather than by a picture. It is the quietest suite here - nothing moves at all, so it suits dense sections where a travel would read as the layout shifting.",
    /**
     * THE SAME GATE AS WIPE, AND THE SAME ARGUMENT.
     *
     * The blur lands on `heading` and `accent`, and nothing in the library
     * marks an accent yet - so on a section with no heading this would be a
     * plain staggered fade, which is a control that appears to work and paints
     * nothing. The gate is derived from the roles a section marks, so a section
     * that gains a heading role gains this suite with no edit here.
     *
     * That it competes with Wipe for the same sections is intended rather than
     * unfortunate: they are two answers to "how does a headline arrive", and an
     * editor picking between them is the axis working.
     */
    requiresRole: "heading",
    roles: {
      heading: "THE BLUR - resolves from 10px as it fades, no travel",
      content:
        "fades in place - small type under a 10px blur is a grey smear resolving into text, which reads as a page failing to load",
      card: "fades in place, staggered by --reveal-index",
      media:
        "fades in place - blurring a large raster is the one case where the compositor genuinely struggles, and the cost scales with the area",
      accent:
        "resolves from the same blur - a large figure has the strokes for it",
      frame: "fades in place, as a single unit",
      action:
        "fades in place - the focus is about the statement, not the action",
      lines: "not addressed - a marked block arrives as one, lines and all",
    },
    /**
     * Two, and `media` is the notable absentee twice over.
     *
     * It is not here because the suite does not travel, so "fade without
     * rising" is simply the default - the same reason it left Wipe's list. And
     * it is not here as a blur either, which is the one performance judgement
     * this suite makes: everything else it touches is type.
     */
    differentiatedRoles: ["heading", "accent"],
    /** THE SUITE THAT PROVES WHY GROUPS ARE PER-SUITE AND NOT PER-SUITE-ID.
     *
     *  Focus's plain fades ride the shared rhythm and keep time with Rise, so
     *  it names `rhythm`. Its blur does not: it is the one arrival in the
     *  library that is not a travel, so front-loading throws the duration away
     *  and the shared curve is actively wrong for it. That is what earns a
     *  group - a genuinely different motion model, not a preference for a
     *  different number. The shared easing control must never write
     *  `--anim-focus-easing`. */
    trigger: "scroll",
    controlGroups: ["rhythm", "focus"],
  },
  {
    /** Rise, played by the page. */
    id: "reveal-load",
    label: "Rise",
    status: "offered",
    description:
      "Units rise a short distance and fade in as the page paints.",
    guidance:
      "The default hero entrance. Suits a hero whose copy and image should arrive together.",
    requiresRole: undefined,
    roles: {
      heading: "rise + fade",
      content: "rise + fade, as one block",
      card: "rise + fade, staggered by --reveal-index",
      media: "fade only, no rise - a bled panel that travels opens a band of bare ground beneath it",
      accent: "rise + fade",
      frame: "rise + fade, as a single unit",
      action: "rise + fade",
      lines: "not addressed - a marked block arrives as one, lines and all",
    },
    differentiatedRoles: ["media"],
    trigger: "load",
    controlGroups: ["rhythm", "reveal"],
  },
  {
    /** Fade, played by the page. */
    id: "fade-load",
    label: "Fade",
    status: "offered",
    description:
      "Units fade up in place as the page paints. Nothing moves.",
    guidance:
      "The quiet hero entrance. For a hero carrying a large photograph, where a travel competes with the picture.",
    requiresRole: undefined,
    roles: {
      heading: "fade in place",
      content: "fade in place, as one block",
      card: "fade in place, staggered by --reveal-index",
      media: "fade in place - the same answer as everything else here",
      accent: "fade in place",
      frame: "fade in place, as a single unit",
      action: "fade in place",
      lines: "not addressed - a marked block arrives as one, lines and all",
    },
    differentiatedRoles: [],
    trigger: "load",
    controlGroups: ["rhythm", "fade"],
  },
  {
    /** Wipe, played by the page. Same rules as `wipe` with the animation-state gate removed - see `settle-load` for why a load entrance cannot be a state of its scroll twin. */
    id: "wipe-load",
    label: "Wipe",
    status: "offered",
    description:
      "The headline is revealed behind an edge as the page paints. Everything else fades in place.",
    guidance:
      "For a hero led by its words. The wipe is the arrival, so nothing else competes with it.",
    requiresRole: undefined,
    roles: {
      heading: "clip wipe, left to right, no travel",
      content: "clip wipe, left to right",
      card: "fade in place",
      media: "fade in place",
      accent: "scale up from 94% while fading",
      frame: "fade in place, as a single unit",
      action: "fade in place",
      lines: "not addressed - a marked block arrives as one, lines and all",
    },
    differentiatedRoles: ["heading", "content", "accent"],
    trigger: "load",
    controlGroups: ["rhythm", "wipe"],
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
    /** The load-entrance heroes. Each one's intro text is a heading unit, so
     *  `wipe-load` has an edge to reveal - see `loadEntranceComponents`. */
    "HeroSplitFullHeightSectionV3",
    /** Eyebrow and headline are one unit on one index here, stacked in a single
     *  cell - so the wipe crosses the pair rather than racing two edges. */
    "HeroContentTopImageBottomSectionV2",
    /** The copy-only hero, and the library's plainest `wipe-load` case: it has
     *  a heading, a paragraph and two buttons, so nothing competes with the
     *  edge crossing the headline. */
    "HeroCompactSectionV3",
    /** The five framed-image heroes. Every one splits its copy the same way -
     *  eyebrow and headline as the heading unit, everything below it as one
     *  content unit - so the wipe has an edge and the rest fades behind it. */
    "HeroCompactServiceSectionV3",
    "HeroServiceAreaZipLookupSectionV3",
    "HeroServicesSectionV3",
    "HeroSplitBentoSectionV3",
    "HeroSplitFixedImageSectionV3",
    /** The two load-entrance sections with no media. The fullscreen hero's
     *  picture belongs to the ground-image axis rather than to an element, and
     *  the confirmation page has no picture at all - so both mark a heading and
     *  neither is offered Settle. */
    "HeroFullscreenSectionV2",
    "ThankYouConfirmationSectionV3",
    /** Marked on its centre column only - its floaters own their own motion. */
    "HeroCenteredFloatersSectionV2",
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
    /** Its statement is one heading unit - a `<p>` at heading scale, which is
     *  what this role is about. Wipe is the nearest thing the library has to the
     *  clip reveal this section used to run for itself. */
    "ContentRevealParagraphSectionV2",
    "DecisionMatrixCardSectionV3",
    "DecisionQuestionTableSectionV3",
    "DecisionSplitDecisionSectionV3",
    "ContactSectionModalBegin",
    "ServiceAreaZipLookupSectionV3",
    "QuickPageLinksSectionV2",
    "ContactSectionV3",
  ],
  /**
   * The sections with a media unit - what Lateral slides.
   *
   * Populated when Lateral gained its gate. Everything here already marked
   * `reveal-role-media`; the list is the registry catching up with markup that
   * was written during the backfill, which is why it needed no section edits.
   *
   * REMEMBER WHAT THIS LIST IS FOR. It is not "sections with an image" - it is
   * sections that mark an image AS A REVEALABLE UNIT. A section can show a
   * picture inside a card and belong nowhere near here, because the card is the
   * unit and the picture is part of it.
   */
  /**
   * The sections with a text block worth splitting into lines - what Text wipe
   * crosses one at a time.
   *
   * One so far, and the list is the gate: a section that marks a statement
   * block gains the suite with no edit here.
   */
  lines: ["ContentRevealParagraphSectionV2"],
  media: [
    "ContentAboutCompanySectionV2",
    "ContentNarrativeFeatureRailSectionV3",
    "ContentSplitFixedImageSectionV3",
    "ContentSplitFullImageSectionV3",
    "ContentStickyCardStreamSectionV2",
    "ContentThreeColumnMixedSectionV3",
    "CTAImageSectionV3",
    "FeaturePortraitParagraphSectionV3",
    /** The load-entrance heroes. Each panel clips and holds a next/image, which
     *  is what `settle-load` scales.
     *
     *  THE TEST IS NOT "HAS AN IMAGE". It is a picture that FILLS a box that
     *  CLIPS, because the suite scales the image and lets the frame crop it. A
     *  box the picture sizes - `h-auto object-contain` - would lose 3% off each
     *  edge of the artwork instead of settling into a crop. An aspect-ratio
     *  frame is still a frame; both of these cover-fill and clip. */
    "HeroSplitFullHeightSectionV3",
    "HeroContentTopImageBottomSectionV2",
    /** The five framed-image heroes. Bled panels, aspect-ratio frames and a
     *  ratio-chosen one - all of them clip a cover-filling picture, which is
     *  the whole of what settle needs. */
    "HeroCompactServiceSectionV3",
    "HeroServiceAreaZipLookupSectionV3",
    "HeroServicesSectionV3",
    "HeroSplitBentoSectionV3",
    "HeroSplitFixedImageSectionV3",
    "ImageStripSectionV3",
    /** The logo grid, not the file it shares with four other trust sections -
     *  the marker is on its panel and the other four have none. */
    "TrustLogoGridSectionV3",
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

/**
 * THE VETO. Sections struck from a suite by name, whatever the role gate says.
 *
 * WHY A LIST EXISTS AT ALL, IN A FILE THAT ARGUES AGAINST LISTS. The header of
 * this file rejects a membership set PER VALUE - a hand-maintained allow-list
 * for every suite, which is 5 x 97 today, grows with each suite, and makes a
 * new section silently unanimated until someone adds it to all of them. That
 * argument is about ALLOW-lists, and it still stands: the role gate is what
 * decides availability, and it needs no upkeep.
 *
 * This is the opposite shape. It holds only EXCEPTIONS, so the common case
 * costs nothing and a new section inherits the gate's answer with no edit. Same
 * shape and same reasoning as `animationExcludedComponents`, which does the job
 * one level up for the axis as a whole.
 *
 * WHAT BELONGS HERE. Exactly one thing the role gate cannot say: "this section
 * marks the role, and the suite is still wrong here." A media panel that is a
 * small inline thumbnail rather than a bled panel would qualify - it marks
 * `media`, and sliding it in from off-screen would look like a bug rather than
 * an entrance.
 *
 * WHAT DOES NOT. "This section has no media" - that is the gate's job, and
 * writing it here would be maintaining by hand a fact already derived. If an
 * entry would be redundant with the gate, `animation-marker-ownership` fails on
 * it rather than letting the two drift into disagreeing.
 *
 * EMPTY IS A REAL STATE. Nothing has needed striking yet. The lists are the
 * control surface, deliberately unused until a section earns a place on one.
 */
/**
 * Sections that animate on LOAD rather than on scroll.
 *
 * One list, and it answers both directions of the question. A section here is
 * offered the load suites and none of the scroll ones; a section not here gets
 * the reverse. Nothing is struck by name.
 *
 * IT IS A LIST BECAUSE THERE IS NOTHING TO DERIVE FROM. Every other gate on this
 * axis computes from what a section MARKS - the intersection of a suite's
 * `requiresRole` and the roles in `sectionAnimationRoleComponents`. "Above the
 * fold" is not a property of markup at all; it is a property of where a section
 * is used, which is why `animationExcludedComponents` already spells the heroes
 * out by hand for the same reason.
 *
 * It replaced a veto list that would not have scaled. The first load suite was
 * gated by striking it from every scroll-triggered section by name, which was
 * survivable only because it carried `requiresRole: "media"` and there were ten
 * of them. The next load suites have no signature role, so the same approach
 * wanted ~57 entries each - the point where an exception list has quietly become
 * the mechanism.
 */
export const loadEntranceComponents = new Set<string>([
  "HeroSplitFullHeightSectionV3",
  "HeroContentTopImageBottomSectionV2",
  "HeroCompactSectionV3",
  "HeroCompactServiceSectionV3",
  "HeroServiceAreaZipLookupSectionV3",
  "HeroServicesSectionV3",
  "HeroSplitBentoSectionV3",
  "HeroSplitFixedImageSectionV3",
  "HeroFullscreenSectionV2",
  "HeroCenteredFloatersSectionV2",
  /** Not a hero, and above the fold for the hero's reason: it is the whole of
   *  `/thank-you`. */
  "ThankYouConfirmationSectionV3",
]);

/** Whether a section's entrance is played by the page rather than the scroll. */
export function sectionUsesLoadEntrance(component: string) {
  return loadEntranceComponents.has(component);
}

/**
 * The per-suite veto, for exceptions the derived gates cannot express.
 *
 * Empty again, and worth keeping empty. It briefly held fourteen entries doing
 * the load-versus-scroll split by hand; that is `loadEntranceComponents` now.
 */
export const suiteExcludedComponents: Partial<
  Record<SectionAnimationSuiteId, readonly string[]>
> = {};

/** Whether a suite has been struck from one section by name. */
export function suiteExcludesSection(
  suite: SectionAnimationSuiteId,
  component: string,
) {
  return suiteExcludedComponents[suite]?.includes(component) ?? false;
}

/**
 * The suites worth offering on one section.
 *
 * Three filters, in order of how much upkeep they cost: the suite is offered at
 * all, its signature role is marked here (derived, no upkeep), and it has not
 * been struck from this section by name (hand-maintained, exceptions only).
 */
export function sectionAnimationSuitesFor(component: string) {
  // A section gets load suites or scroll suites, never a mix. The wrong set is
  // not merely unhelpful: a scroll suite on an above-the-fold section never
  // plays at all, and a load suite below the fold has finished before the reader
  // reaches it. Either way the control appears to work and paints nothing.
  const wantsLoadEntrance = sectionUsesLoadEntrance(component);

  return offeredSectionAnimationSuites.filter(
    (suite) =>
      (suite.trigger === "load") === wantsLoadEntrance &&
      (!suite.requiresRole || sectionMarksRole(component, suite.requiresRole)) &&
      !suiteExcludesSection(suite.id, component),
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
