/**
 * The frame attribute `SectionEntrance` drives, and a replay resets.
 *
 * Owned by the observer rather than by React, which is what makes an imperative
 * reset safe: React never renders this attribute, so it cannot clobber it on
 * the next commit, and the observer only ever sets it once per frame.
 */
export const animationStateAttribute = "data-pagebuilder-animation-state";

/**
 * Play a section frame's entrance again, where it stands.
 *
 * An entrance plays when a section ARRIVES, so nothing plays for a section
 * already on screen - which is every section you are looking at when you switch
 * the control on. This puts the frame back into the waiting state and straight
 * into the arriving one, so what plays is the same timed animation a visitor
 * gets, from the top.
 *
 * Removing the attribute is what makes it restart. A CSS animation only
 * restarts when `animation-name` changes, so re-triggering without first
 * returning to the waiting state updates an animation already at its end state
 * and does nothing visible. Reading `offsetWidth` between the two forces the
 * style flush that makes them two changes rather than one no-op.
 *
 * TAKES AN ELEMENT, NOT AN ID. It began as a closure inside `PagebuilderShell`
 * that resolved a frame by `data-pagebuilder-section-id`, which only exists on
 * the builder canvas - the style-guide gallery has frames and no section ids.
 * The element is the thing this actually needs; resolving one is the caller's
 * business.
 */
export function replaySectionAnimation(frame: HTMLElement | null | undefined) {
  if (!frame) {
    return;
  }

  frame.removeAttribute(animationStateAttribute);
  void frame.offsetWidth;
  frame.setAttribute(animationStateAttribute, "in");
}

/** Resolve a builder-canvas frame by its section id, then replay it. */
export function replaySectionAnimationById(sectionId: string) {
  replaySectionAnimation(
    document.querySelector<HTMLElement>(
      `[data-pagebuilder-section-id="${CSS.escape(sectionId)}"]`,
    ),
  );
}
