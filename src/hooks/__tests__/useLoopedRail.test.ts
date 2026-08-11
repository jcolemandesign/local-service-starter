import { describe, expect, it } from "vitest";

import { wrapScrollLeft } from "@/hooks/useLoopedRail";

/**
 * The looped rail's wrap arithmetic.
 *
 * Worth its own test because the failure mode is silent and rare: any wrap that
 * lands outside the middle copy still scrolls, still looks fine at a gentle
 * drag, and only shows itself as a snap or a bare edge when someone flicks hard
 * enough to cross more than one copy in a single frame. That is exactly the
 * input a person exercises and a reviewer does not.
 *
 * The invariant is one line: the result is always in `[loop, 2 * loop)`, so
 * there is a full copy of the rail to scroll into in either direction.
 */

const loop = 900;

describe("wrapScrollLeft", () => {
  it("leaves a position already inside the middle copy alone", () => {
    // Identity matters, not just equality - `wrap` compares the result against
    // the current value to avoid writing scrollLeft during a scroll event.
    expect(wrapScrollLeft(loop, loop)).toBe(loop);
    expect(wrapScrollLeft(loop + 1, loop)).toBe(loop + 1);
    expect(wrapScrollLeft(2 * loop - 1, loop)).toBe(2 * loop - 1);
  });

  it("wraps forward off the end of the middle copy", () => {
    expect(wrapScrollLeft(2 * loop, loop)).toBe(loop);
    expect(wrapScrollLeft(2 * loop + 40, loop)).toBe(loop + 40);
  });

  it("wraps backward off the start of the middle copy", () => {
    expect(wrapScrollLeft(loop - 1, loop)).toBe(2 * loop - 1);
    expect(wrapScrollLeft(0, loop)).toBe(loop);
  });

  /**
   * The reason for the modulo rather than a single subtraction. A hard flick
   * can move several copies between frames, and a one-copy correction would
   * leave the rail still outside the window.
   */
  it("lands correctly when a flick overshoots several copies at once", () => {
    for (const copies of [2, 3, 7, 40]) {
      expect(wrapScrollLeft(loop + copies * loop + 123, loop)).toBe(loop + 123);
      expect(wrapScrollLeft(loop - copies * loop + 123, loop)).toBe(loop + 123);
    }
  });

  /** JavaScript's `%` keeps the sign of its left operand, which is the trap the
   *  second modulo exists to close. */
  it("never returns a position below the middle copy for a negative offset", () => {
    for (const scrollLeft of [-1, -loop, -3 * loop, -12345]) {
      const result = wrapScrollLeft(scrollLeft, loop);

      expect(result).toBeGreaterThanOrEqual(loop);
      expect(result).toBeLessThan(2 * loop);
    }
  });

  it("holds the window invariant across a wide sweep", () => {
    for (let scrollLeft = -5000; scrollLeft <= 5000; scrollLeft += 7) {
      const result = wrapScrollLeft(scrollLeft, loop);

      expect(
        result >= loop && result < 2 * loop,
        `wrapScrollLeft(${scrollLeft}, ${loop}) = ${result}, outside [${loop}, ${2 * loop})`,
      ).toBe(true);
    }
  });

  it("preserves position within the copy, so the rail does not jump", () => {
    // Wrapping must be invisible: the offset inside the copy is what the reader
    // sees, and it has to survive the teleport.
    for (const scrollLeft of [-820, 30, 905, 1799, 1801, 4000]) {
      const result = wrapScrollLeft(scrollLeft, loop);

      // `Math.abs` because a backward wrap gives a negative multiple, and
      // `-0 % loop` is `-0`, which `toBe` separates from `0`.
      expect(Math.abs((result - scrollLeft) % loop)).toBe(0);
    }
  });

  it("handles a fractional loop period", () => {
    // Measured from `offsetLeft` differences, so a fractional period is real on
    // a fractional-DPR display.
    const fractional = 240.5;
    const result = wrapScrollLeft(3 * fractional, fractional);

    expect(result).toBeGreaterThanOrEqual(fractional);
    expect(result).toBeLessThan(2 * fractional);
  });
});
