/**
 * THE ELEMENT STANDING IN FOR THE VIEWPORT.
 *
 * A page scrolls in the window, so the window is the reference for anything
 * that reads scroll position, and nothing needs marking. The builder does not:
 * its canvas is an `overflow-auto` box inside a window that never scrolls. Two
 * things break there, and they break independently, which is why they are worth
 * naming separately:
 *
 *   1. SCROLL EVENTS FROM AN ELEMENT DO NOT REACH THE WINDOW. Only the document
 *      scroller's do. A `window` scroll listener in the canvas fires once at
 *      mount and never again, so the effect computes one value for wherever the
 *      section happened to sit and freezes there. It looks like a broken
 *      calculation and it is a missing event.
 *   2. `innerHeight` AND `getBoundingClientRect` ARE THE WRONG FRAME. Even with
 *      the event, progress measured against the browser viewport describes a
 *      scroll the reader is not doing.
 *
 * This started as `data-pagebuilder-animation-root`, named for the axis that
 * needed it first. The name is neutral now because the second and third callers
 * are not on that axis at all - they are sections that hand-roll their own
 * scroll motion, and are excluded from the axis for exactly that reason.
 *
 * OPT-IN, NOT "NEAREST SCROLLABLE ANCESTOR". Sniffing `overflow` would make
 * every incidental scroll box in a layout a reference frame, and the failure
 * would be silent: an effect measuring against a box nobody meant. A marked
 * root is a decision someone made.
 */
export const scrollRootAttribute = "data-pagebuilder-scroll-root";

export const scrollRootSelector = `[${scrollRootAttribute}]`;

/**
 * The scroller an element should measure against, or `null` for the viewport.
 *
 * `null` is a real answer rather than a failure - it is what every real page
 * returns, and callers are expected to fall back to `window` on it.
 */
export function resolveScrollRoot(element: Element | null | undefined) {
  return element?.closest(scrollRootSelector) ?? null;
}

/**
 * The visible box to measure progress against: the scroller's, or the
 * viewport's written in the same shape.
 *
 * One formula for both cases rather than a branch at every call site. The
 * viewport is the element case with its box filled in - top 0, height
 * `innerHeight` - which is also why a caller can stop caring which it got.
 */
export function scrollRootBox(root: Element | null) {
  if (!root) {
    return { bottom: window.innerHeight, height: window.innerHeight, top: 0 };
  }

  const box = root.getBoundingClientRect();

  return { bottom: box.bottom, height: box.height, top: box.top };
}
