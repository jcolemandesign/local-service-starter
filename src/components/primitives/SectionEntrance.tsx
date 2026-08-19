"use client";

import { useEffect } from "react";

import {
  resolveScrollRoot,
  scrollRootBox,
} from "@/utils/scroll-root";

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
 * One observer per SCROLLER rather than a client boundary per section - which
 * on an ordinary page means one for the document, since the only scroller is
 * the window. Sections stay server components; this is the only JavaScript the
 * axis costs, and it renders nothing.
 */

/** Every section frame, whatever its animation value - the frames that are not
 *  `reveal` simply never match a rule. */
const frameSelector = "[data-pagebuilder-animation]";
const stateAttribute = "data-pagebuilder-animation-state";
const readyAttribute = "data-pagebuilder-animation-ready";

/**
 * A SCROLLER STANDING IN FOR THE VIEWPORT, marked by whatever owns it.
 *
 * A page scrolls in the window, so the window is the right root and nothing
 * needs marking - which is why this started with no concept of a root at all.
 * The builder does not: its canvas is an `overflow-auto` box inside a window
 * that never scrolls, so with the viewport as root the trigger line was a line
 * across the BROWSER at 82% of its height, cutting the canvas wherever it
 * happened to fall. Close enough to look right, and wrong in the way that
 * matters - the inset you tuned in the builder was not the inset the page got.
 *
 * So a scroller declares itself and the frames inside it are observed against
 * it. One observer per distinct root, resolved with `closest` at the moment a
 * frame is settled or observed, because `root` belongs to the observer and a
 * document can hold both kinds at once: the builder canvas and, on the same
 * screen, anything outside it that still scrolls with the window.
 *
 * The marker and the lookup live in `@/utils/scroll-root` rather than here,
 * because this is no longer the only thing that needs them: two sections that
 * hand-roll their own scroll motion were measuring against the browser window
 * inside the canvas, which is the same bug one layer down.
 */

/**
 * The custom property that authors the trigger threshold.
 *
 * Named here rather than imported from `motion-tokens` on purpose. This
 * component is the one piece of JavaScript the animation axis puts on every
 * page, including pages that ship no other client code, and importing the
 * registry to read one string would pull the whole control catalogue - labels,
 * hints, easing presets, ranges - into that bundle. The agreement test closes
 * the loop instead: it looks for this literal in this file, so the token and
 * its reader cannot drift apart silently.
 */
export const triggerInsetToken = "--anim-trigger-inset";

/**
 * How far up the viewport a section comes before its entrance starts, as a
 * fraction of viewport height subtracted from the observer root's bottom edge.
 *
 * THE SHIPPED DEFAULT AND THE FALLBACK, no longer the setting itself. The live
 * value is `--anim-trigger-inset`, authored in the Style Guide's shared rhythm
 * group and promoted into `globals.css` like every other motion token. This
 * stays because the token can be illegible - a stylesheet that has not arrived,
 * a promoted block that omitted it - and a threshold is not a thing to guess at
 * 0. It must equal what the stylesheet declares; the agreement test pins that
 * through the control's `defaultValue`.
 */
export const triggerInset = 0.18;

/**
 * The authored threshold, or the shipped one if nothing legible is declared.
 *
 * Resolved ONCE for the effect and shared by every observer it builds.
 * `rootMargin` belongs to the observer rather than to a target, so a per-frame
 * answer would need an observer for each distinct value - and there is only ever
 * one value, because this is deliberately a shared control rather than a
 * per-suite one. Roots multiply the observers; the inset does not.
 *
 * The clamp is not the registry's range restated. The registry decides what can
 * be AUTHORED; this only refuses a value that would break the observer - a
 * negative inset, or one so large the trigger line sits above the top edge and
 * nothing ever fires.
 */
function resolveTriggerInset(root: Element) {
  const declared = getComputedStyle(root)
    .getPropertyValue(triggerInsetToken)
    .trim();

  if (!declared.endsWith("%")) {
    return triggerInset;
  }

  const parsed = Number.parseFloat(declared);

  if (!Number.isFinite(parsed)) {
    return triggerInset;
  }

  return Math.min(0.9, Math.max(0, parsed / 100));
}

export function SectionEntrance() {
  useEffect(() => {
    const root = document.documentElement;
    const inset = resolveTriggerInset(root);
    const observed = new WeakSet<Element>();
    /** Keyed by root, `null` being the viewport. Built on demand: most
     *  documents only ever need the one. */
    const observers = new Map<Element | null, IntersectionObserver>();

    function observerFor(scroller: Element | null) {
      const existing = observers.get(scroller);

      if (existing) {
        return existing;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) {
              continue;
            }

            entry.target.setAttribute(stateAttribute, "in");
            // Once only. An entrance that replayed every time a section came
            // back past the line would animate on the way UP as well, which
            // reads as the page redrawing itself rather than as content
            // arriving.
            observer.unobserve(entry.target);
          }
        },
        {
          // A percentage in `rootMargin` resolves against the ROOT's height,
          // so this is the same inset whichever root it is handed - which is
          // the whole point of passing one.
          root: scroller,
          rootMargin: `0px 0px -${Math.round(inset * 100)}% 0px`,
        },
      );

      observers.set(scroller, observer);

      return observer;
    }

    /**
     * Where the trigger line sits right now, in client coordinates.
     *
     * One formula for both roots - `scrollRootBox` writes the viewport in the
     * same shape as an element, so there is no second expression here to keep
     * in step with the first.
     */
    function triggerLine(scroller: Element | null) {
      const box = scrollRootBox(scroller);

      return box.bottom - box.height * inset;
    }

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

      const scroller = resolveScrollRoot(frame);

      if (frame.getBoundingClientRect().top < triggerLine(scroller)) {
        frame.setAttribute(stateAttribute, "settled");
        return;
      }

      observerFor(scroller).observe(frame);
    }

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

      for (const observer of observers.values()) {
        observer.disconnect();
      }

      root.removeAttribute(readyAttribute);
    };
  }, []);

  return null;
}
