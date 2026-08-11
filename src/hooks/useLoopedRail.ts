"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A horizontal rail that never reaches an end.
 *
 * The item list is repeated end to end and the scroll position is wrapped back
 * into the middle copy whenever it leaves one, so a drag never hits a wall and
 * the arrows never dead-end. Drag, flick momentum, arrow stepping, press-and-
 * hold acceleration and keyboard stepping all live here because they share one
 * thing that makes them subtle:
 *
 * EVERY MOVEMENT IS A DELTA, NEVER AN ABSOLUTE TARGET.
 *
 * That is the whole reason this is a hook rather than a pattern to copy. The
 * wrap teleports `scrollLeft`, so any code that remembers a position and aims
 * at it later is aiming at a baseline the next wrap has already moved. Both
 * carousels had made exactly that mistake in exactly the same two places -
 * `scrollTo({ left: card.offsetLeft })` for the arrows and
 * `scrollLeft = start - dragOffset` for the drag - and the symptom is a visible
 * snap back rather than an error, which is why it survived review twice.
 *
 * The consumer owns everything visual: item widths, gaps, captions, arrows, and
 * how the repeated copies are hidden from assistive tech. This owns only the
 * scroll position.
 *
 * Usage: spread `scrollerHandlers` on the scrolling element and give it
 * `scrollerRef`; put `railRef` on the flex list inside it; spread `itemProps`
 * on every item, INCLUDING the repeated copies - `measure` finds the loop
 * period by comparing the first item to the first item of the second copy, so
 * a rail that only tags its originals reports no period and never loops.
 */

export type LoopedRailDirection = "previous" | "next";

type DragState = {
  active: boolean;
  lastTime: number;
  lastX: number;
  pointerId: number;
  velocity: number;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Where a scroll position belongs once it has left the middle copy.
 *
 * Pure, exported and tested, because it is the only real arithmetic in here and
 * getting it wrong is invisible until someone flicks hard: the result must
 * always land in `[loop, 2 * loop)`, the middle copy, so there is a full copy of
 * the rail either side to scroll into.
 *
 * The double modulo is what handles a flick that crosses SEVERAL copies in one
 * frame. A single `offset - loop` subtraction only ever undoes one crossing, so
 * a fast drag would outrun it and hit the built edge of the repeated list.
 * `% loop` twice is also how a negative offset is brought back positive -
 * JavaScript's `%` keeps the sign of its left operand.
 */
export function wrapScrollLeft(scrollLeft: number, loop: number) {
  const offset = scrollLeft - loop;

  if (offset >= 0 && offset < loop) {
    return scrollLeft;
  }

  return loop + (((offset % loop) + loop) % loop);
}

export function useLoopedRail({ itemCount }: { itemCount: number }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLUListElement | null>(null);
  /** Distance from one copy of the list to the next - the wrap period. */
  const loopWidth = useRef(0);
  const startPlaced = useRef(false);
  const hoverFrame = useRef<number | null>(null);
  const hoverTimeout = useRef<number | null>(null);
  const momentumFrame = useRef<number | null>(null);
  const tweenFrame = useRef<number | null>(null);
  const dragState = useRef<DragState>({
    active: false,
    lastTime: 0,
    lastX: 0,
    pointerId: -1,
    velocity: 0,
  });
  const [copies, setCopies] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [isCoasting, setIsCoasting] = useState(false);

  const cancelAnimations = useCallback(() => {
    if (momentumFrame.current !== null) {
      window.cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = null;
    }

    if (tweenFrame.current !== null) {
      window.cancelAnimationFrame(tweenFrame.current);
      tweenFrame.current = null;
    }

    setIsCoasting(false);
  }, []);

  const stopHoverScroll = useCallback(() => {
    if (hoverTimeout.current !== null) {
      window.clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    if (hoverFrame.current !== null) {
      window.cancelAnimationFrame(hoverFrame.current);
      hoverFrame.current = null;
    }
  }, []);

  /** Pulls the scroll position back into the middle copy. */
  const wrap = useCallback(() => {
    const scroller = scrollerRef.current;
    const loop = loopWidth.current;

    if (!scroller || loop <= 0) {
      return;
    }

    const target = wrapScrollLeft(scroller.scrollLeft, loop);

    // Guarded because this runs from `onScroll`: assigning the value it already
    // holds is a no-op to the reader but still a write, and a write during a
    // scroll event is the kind of thing that interrupts native inertia.
    if (target !== scroller.scrollLeft) {
      scroller.scrollLeft = target;
    }
  }, []);

  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    const rail = railRef.current;

    if (!scroller || !rail || itemCount === 0) {
      return;
    }

    const items = rail.querySelectorAll<HTMLElement>("[data-looped-rail-item]");
    const first = items[0];
    const secondCopy = items[itemCount];

    if (!first || !secondCopy) {
      return;
    }

    const loop = secondCopy.offsetLeft - first.offsetLeft;

    if (loop <= 0) {
      return;
    }

    loopWidth.current = loop;

    // Enough copies that the viewport is still filled at the far edge of the
    // wrap window. Too few and the rail runs out of items before the wrap
    // fires, leaving a gap at the end of a fast drag.
    const needed = Math.max(
      3,
      Math.ceil((scroller.clientWidth * 2) / loop) + 2,
    );

    setCopies((current) => (current === needed ? current : needed));

    if (!startPlaced.current) {
      scroller.scrollLeft = loop;
      startPlaced.current = true;
    }
  }, [itemCount]);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(scroller);

    return () => {
      resizeObserver.disconnect();
    };
  }, [copies, measure]);

  useEffect(() => {
    return () => {
      stopHoverScroll();
      cancelAnimations();
    };
  }, [cancelAnimations, stopHoverScroll]);

  /**
   * Moves by a relative distance over a few frames. Relative is the whole
   * point: `wrap` may teleport the scroll position mid-flight, and a tween
   * chasing a remembered absolute target would fight it.
   */
  const nudge = useCallback(
    (delta: number) => {
      const scroller = scrollerRef.current;

      if (!scroller) {
        return;
      }

      cancelAnimations();

      if (prefersReducedMotion()) {
        scroller.scrollLeft += delta;
        wrap();
        return;
      }

      let remaining = delta;

      const step = () => {
        const current = scrollerRef.current;

        if (!current) {
          tweenFrame.current = null;
          return;
        }

        if (Math.abs(remaining) < 0.5) {
          tweenFrame.current = null;
          return;
        }

        const move = remaining * 0.22;

        current.scrollLeft += move;
        remaining -= move;
        wrap();
        tweenFrame.current = window.requestAnimationFrame(step);
      };

      tweenFrame.current = window.requestAnimationFrame(step);
    },
    [cancelAnimations, wrap],
  );

  /**
   * One item's travel, by average pitch. Items differ in width in both rails,
   * so an average keeps the arrow moving a consistent distance instead of
   * lurching on a wide one and barely moving on a portrait.
   */
  const step = useCallback(
    (direction: LoopedRailDirection) => {
      const loop = loopWidth.current;
      const scroller = scrollerRef.current;
      const stride =
        itemCount > 0 && loop > 0
          ? loop / itemCount
          : (scroller?.clientWidth ?? 0) / 3;

      nudge(direction === "next" ? stride : -stride);
    },
    [itemCount, nudge],
  );

  /**
   * Press and hold an arrow and the rail accelerates. A finite rail would stop
   * itself when `scrollLeft` stopped changing; there is no end here, so this
   * runs until the pointer leaves.
   */
  const startHoverScroll = useCallback(
    (direction: LoopedRailDirection) => {
      const scroller = scrollerRef.current;

      if (!scroller) {
        return;
      }

      stopHoverScroll();
      cancelAnimations();

      hoverTimeout.current = window.setTimeout(() => {
        let velocity = 0;
        const directionMultiplier = direction === "next" ? 1 : -1;

        const tick = () => {
          const current = scrollerRef.current;

          if (!current) {
            hoverFrame.current = null;
            return;
          }

          velocity = Math.min(9, velocity + 0.38);
          current.scrollLeft += directionMultiplier * velocity;
          wrap();

          hoverFrame.current = window.requestAnimationFrame(tick);
        };

        hoverTimeout.current = null;
        hoverFrame.current = window.requestAnimationFrame(tick);
      }, 110);
    },
    [cancelAnimations, stopHoverScroll, wrap],
  );

  const coastScroll = useCallback(
    (initialVelocity: number) => {
      let velocity = Math.max(-0.72, Math.min(0.72, initialVelocity));

      if (Math.abs(velocity) < 0.08) {
        setIsCoasting(false);
        return;
      }

      setIsCoasting(true);

      const tick = () => {
        const scroller = scrollerRef.current;

        if (!scroller) {
          momentumFrame.current = null;
          setIsCoasting(false);
          return;
        }

        velocity *= 0.9;
        scroller.scrollLeft -= velocity * 16;
        wrap();

        if (Math.abs(velocity) < 0.035) {
          momentumFrame.current = null;
          setIsCoasting(false);
          return;
        }

        momentumFrame.current = window.requestAnimationFrame(tick);
      };

      momentumFrame.current = window.requestAnimationFrame(tick);
    },
    [wrap],
  );

  // Touch is handled here rather than left to native overflow scrolling so a
  // swipe gets the same momentum and the same wrap as a mouse drag - native
  // inertia would keep coasting toward a position the wrap has already moved.
  // The consumer keeps `touch-action: pan-y` on the scroller, so a vertical
  // gesture still scrolls the page.
  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      const scroller = scrollerRef.current;

      if (!scroller) {
        return;
      }

      cancelAnimations();
      stopHoverScroll();

      if (event.pointerType === "mouse") {
        event.preventDefault();
      }

      dragState.current = {
        active: true,
        lastTime: window.performance.now(),
        lastX: event.clientX,
        pointerId: event.pointerId,
        velocity: 0,
      };

      scroller.setPointerCapture(event.pointerId);
      setIsDragging(true);
    },
    [cancelAnimations, stopHoverScroll],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const scroller = scrollerRef.current;
      const currentDrag = dragState.current;

      if (!scroller || !currentDrag.active) {
        return;
      }

      const eventTime = window.performance.now();
      const elapsedTime = Math.max(16, eventTime - currentDrag.lastTime);
      const deltaX = event.clientX - currentDrag.lastX;

      currentDrag.lastTime = eventTime;
      currentDrag.lastX = event.clientX;
      currentDrag.velocity = (deltaX / elapsedTime) * 0.95;
      // Incremental, not `start - offset`: the wrap moves the baseline out from
      // under an absolute calculation every time the rail loops.
      scroller.scrollLeft -= deltaX * 1.08;
      wrap();
    },
    [wrap],
  );

  const finishDrag = useCallback(() => {
    const scroller = scrollerRef.current;

    if (!scroller || !dragState.current.active) {
      return;
    }

    if (scroller.hasPointerCapture(dragState.current.pointerId)) {
      scroller.releasePointerCapture(dragState.current.pointerId);
    }

    dragState.current.active = false;
    setIsDragging(false);
    coastScroll(dragState.current.velocity);
  }, [coastScroll]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step("next");
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step("previous");
      }
    },
    [step],
  );

  return {
    /** How many times to repeat the item list. */
    copies,
    isCoasting,
    isDragging,
    /** True while the rail is moving under the reader's own gesture. */
    isFreeScrolling: isDragging || isCoasting,
    /** Spread onto every rail item, repeated copies included. */
    itemProps: { "data-looped-rail-item": true } as const,
    railRef,
    scrollerRef,
    /** Spread onto the scrolling element. */
    scrollerHandlers: {
      onKeyDown: handleKeyDown,
      onLostPointerCapture: finishDrag,
      onPointerCancel: finishDrag,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishDrag,
      onScroll: wrap,
    },
    /** Press-and-hold acceleration. Optional - wire it to an arrow's pointer
     *  enter/leave, or leave it unused. */
    startHoverScroll,
    /** Move by one item's average pitch. */
    step,
    stopHoverScroll,
  };
}
