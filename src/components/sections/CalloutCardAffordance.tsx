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
 * `arrow` for a directional open cue. `check` for a selectable card whose
 * expanded or pressed state is worth showing. Both callout-card sections use
 * the checkbox treatment so their related interactions share one visual
 * language even though one reveals over the grid and one updates a side panel.
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

/**
 * Small, decorative topic cues for the callout demo cards. The six drawings
 * follow the sample content order (temperature, airflow, noise, replacement,
 * efficiency, and air quality); longer real lists repeat the sequence.
 */
export function CalloutCardTopicIcon({ index }: { index: number }) {
  const topic = index % 6;

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-5 top-5 size-10 text-cta-primary"
    >
      <svg
        className="size-full"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        {topic === 0 ? (
          <>
            <path d="M9 14.6V6a3 3 0 0 1 6 0v8.6a5 5 0 1 1-6 0Z" />
            <path d="M12 10v7" />
          </>
        ) : topic === 1 ? (
          <>
            <path d="M4 8h10.5a2.5 2.5 0 1 0-2.4-3.2" />
            <path d="M4 12h14a2 2 0 1 1-1.8 2.9" />
            <path d="M4 16h7" />
          </>
        ) : topic === 2 ? (
          <>
            <path d="M5 10v4h3l4 3V7L8 10H5Z" />
            <path d="M15 9.5a4 4 0 0 1 0 5" />
            <path d="M18 7a7 7 0 0 1 0 10" />
          </>
        ) : topic === 3 ? (
          <>
            <path d="M7 7h10v10H7z" />
            <path d="m9 4-2 3 2 3M15 20l2-3-2-3" />
          </>
        ) : topic === 4 ? (
          <>
            <path d="M5 17a8 8 0 1 1 14 0" />
            <path d="m12 13 4-4" />
            <path d="M8 17h8" />
          </>
        ) : (
          <>
            <path d="M7 15c0-5 4-8 10-8 0 6-3 10-8 10" />
            <path d="M7 19c2-4 5-7 9-9" />
          </>
        )}
      </svg>
    </span>
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
