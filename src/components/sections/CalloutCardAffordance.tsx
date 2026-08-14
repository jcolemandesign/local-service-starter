/**
 * Deliberately not a primitive, and deliberately not exported from
 * `sections/index.ts` or `primitives/index.ts`.
 *
 * This marks one narrow case: a card that is itself a control driving in-page
 * state. Only the two callout sections do that - every other card in the
 * library is static content or a link wrapper, and link cards already carry the
 * right cue for their behavior (a "Learn more" text link, which reads as
 * navigation). Promoting this into the shared vocabulary would turn a
 * behavioral signal into a decorative default on every card on the site, at
 * which point it stops telling anyone anything.
 *
 * If a third section ever needs it, check that its cards are genuinely controls
 * before reaching for this - and only then consider extracting it properly.
 *
 * Expects an ancestor with the `group/callout` class.
 */

/**
 * Which cue the box draws.
 *
 * `arrow` for a card that opens something - the reveal grid, whose cards are
 * one-way and never sit in an "on" state. `check` for a card that toggles, and
 * therefore has a state worth showing: the split panel's tiles, which carry
 * `aria-pressed` and stay selected. A check on a card that cannot be unchecked
 * would promise a state that does not exist.
 */
type CalloutCardMarker = "arrow" | "check";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * The tick.
 *
 * Drawn rather than typed: the system checkmark glyph sits on the text
 * baseline, carries the font's own weight, and cannot be centred in a box
 * reliably across the faces this project ships. This one is optically centred,
 * has round caps that match the button family, and scales with the box.
 */
function CheckMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path d="m5 12.5 4.6 4.5L19 7.5" />
    </svg>
  );
}

export function CalloutCardAffordance({
  isActive = false,
  marker = "arrow",
}: {
  isActive?: boolean;
  marker?: CalloutCardMarker;
}) {
  /**
   * The CTA pair, not the accent.
   *
   * `bg-service-accent` with a white glyph reads fine on the neutral recipes and
   * disappears on the chromatic ones: on a brand or highlight ground the accent
   * role resolves to the recipe's text source, so the fill went light and took
   * the white glyph with it - a filled box with nothing in it. `cta-primary` and
   * `cta-primary-ink` are defined as a pair by every recipe, which is the whole
   * reason the buttons read them, so the glyph keeps its contrast on all eight.
   *
   * Only the arrow variant fills now; see the check variant below for why it
   * stays outlined.
   */
  const filledClassName = "border-transparent bg-cta-primary text-cta-primary-ink";

  if (marker === "check") {
    return (
      <span
        aria-hidden="true"
        className={cx(
          "grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm-token)] border transition-colors duration-200 ease-out",
          /**
           * Checked is an outlined box with a tick in it, not a solid block.
           *
           * A filled CTA square is the loudest thing on the card and competes
           * with the panel it is meant to be pointing at - the tick alone
           * already says "this one". Ink on the card's own surface is also the
           * pairing the card's text uses, so it stays legible on all eight
           * recipes without borrowing the CTA pair, which is what the arrow
           * variant still needs for its filled hover.
           */
          isActive
            ? "border-service-accent bg-transparent text-service-ink"
            : "border-service-border bg-surface-raised shadow-service group-hover/callout:border-service-accent group-focus-visible/callout:border-service-accent",
        )}
      >
        {/* Present but blank until checked, so the box keeps one size and the
            tick arrives into it. A hint of it on hover says the box is the
            thing you are about to turn on. */}
        <span
          className={cx(
            "transition duration-200 ease-out",
            isActive
              ? "scale-100 opacity-100"
              : "scale-75 opacity-0 group-hover/callout:scale-90 group-hover/callout:opacity-40 group-focus-visible/callout:scale-90 group-focus-visible/callout:opacity-40",
          )}
        >
          <CheckMark />
        </span>
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cx(
        "grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm-token)] border text-lg leading-none transition-colors duration-200 ease-out",
        isActive
          ? filledClassName
          : cx(
              "border-service-border bg-surface-raised text-service-accent shadow-service",
              "group-hover/callout:border-transparent group-hover/callout:bg-cta-primary group-hover/callout:text-cta-primary-ink",
              "group-focus-visible/callout:border-transparent group-focus-visible/callout:bg-cta-primary group-focus-visible/callout:text-cta-primary-ink",
            ),
      )}
    >
      &rarr;
    </span>
  );
}
