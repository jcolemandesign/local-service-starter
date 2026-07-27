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

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function CalloutCardAffordance({
  isActive = false,
}: {
  isActive?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm-token)] border text-lg leading-none transition-colors duration-200 ease-out",
        isActive
          ? "border-service-accent bg-service-accent text-white"
          : "border-service-border bg-bg-page text-service-accent group-hover/callout:border-service-accent group-hover/callout:bg-service-accent group-hover/callout:text-white group-focus-visible/callout:border-service-accent group-focus-visible/callout:bg-service-accent group-focus-visible/callout:text-white",
      )}
    >
      &rarr;
    </span>
  );
}
