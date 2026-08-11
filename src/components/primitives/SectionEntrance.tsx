"use client";

import { useEffect } from "react";

/**
 * Starts each section's entrance when the section arrives, and lets it play on
 * a clock.
 *
 * This replaced a pure-CSS scroll-driven reveal, and the reason is worth
 * stating because the CSS version was not broken - it was scrubbed. A
 * scroll-driven animation's progress IS the scroll position, so the entrance
 * lasts exactly as long as the reader takes to scroll past it: a trackpad flick
 * put 260px of range behind them in about 150ms, and the motion was over before
 * it registered. Stretching the range to fix that pushes the start back to the
 * moment the section's first pixel appears, which is too early to watch. You
 * cannot have "starts late" and "lasts long" inside one screen of travel.
 *
 * So the scroll position is used as a TRIGGER and nothing more. This observer
 * sets `data-pagebuilder-animation-state="in"` on a section frame once, when
 * the frame has come far enough up the viewport to be worth looking at, and
 * `globals.css` answers with an ordinary timed animation. Same duration whether
 * the reader creeps or flicks.
 *
 * Scroll-SCRUBBED motion is still wanted for a few sections, and is still in
 * `globals.css` - gated on `[data-pagebuilder-animation="scrub"]`, dormant
 * until the builder offers that value. This is the default, not the only
 * option.
 *
 * One observer for the whole document rather than a client boundary per
 * section. Sections stay server components; this is the only JavaScript the
 * axis costs, and it renders nothing.
 */

/** Every section frame, whatever its animation value - the frames that are not
 *  `reveal` simply never match a rule. */
const frameSelector = "[data-pagebuilder-animation]";
const stateAttribute = "data-pagebuilder-animation-state";
const readyAttribute = "data-pagebuilder-animation-ready";

/**
 * How far up the viewport a section comes before its entrance starts.
 *
 * As a fraction of the viewport height, subtracted from the observer root's
 * bottom edge. At 0 a section would trigger the instant its first pixel
 * crossed the bottom, which is the "starts too early to see" this exists to
 * avoid; too high and the section is well into the middle of the screen,
 * already read, before anything moves.
 */
const triggerInset = 0.18;

export function SectionEntrance() {
  useEffect(() => {
    const root = document.documentElement;
    const observed = new WeakSet<Element>();

    /**
     * A frame that is already past the trigger line gets `settled` instead of
     * being observed - it is on screen at load, so it has no arrival to play.
     *
     * This is what stops the entrance flashing. The hiding rule in the
     * stylesheet only engages once `readyAttribute` is set, and everything
     * visible is settled BEFORE that happens, so nothing that a reader can
     * already see is ever hidden and re-shown. Without the ordering, a section
     * in the first screenful would paint, blank, and fade back in.
     */
    function settleOrObserve(frame: Element) {
      if (observed.has(frame) || frame.hasAttribute(stateAttribute)) {
        return;
      }

      observed.add(frame);

      if (
        frame.getBoundingClientRect().top <
        window.innerHeight * (1 - triggerInset)
      ) {
        frame.setAttribute(stateAttribute, "settled");
        return;
      }

      observer.observe(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          entry.target.setAttribute(stateAttribute, "in");
          // Once only. An entrance that replayed every time a section came back
          // past the line would animate on the way UP as well, which reads as
          // the page redrawing itself rather than as content arriving.
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: `0px 0px -${Math.round(triggerInset * 100)}% 0px` },
    );

    for (const frame of document.querySelectorAll(frameSelector)) {
      settleOrObserve(frame);
    }

    root.setAttribute(readyAttribute, "true");

    /*
     * Sections appear after mount in the builder, where the whole point of the
     * screen is adding and reordering them. Without this they would render
     * hidden - the stylesheet's waiting state - and never be observed, which is
     * the one failure mode of the ready flag that is worse than no animation.
     */
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) {
            continue;
          }

          if (node.matches(frameSelector)) {
            settleOrObserve(node);
          }

          for (const frame of node.querySelectorAll(frameSelector)) {
            settleOrObserve(frame);
          }
        }
      }
    });

    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      root.removeAttribute(readyAttribute);
    };
  }, []);

  return null;
}
