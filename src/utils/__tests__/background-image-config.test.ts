import { describe, expect, it } from "vitest";

import {
  buildBackgroundImageStyle,
  fitUsesFocalPoint,
  formatBackgroundImageFocus,
  isBackgroundImageFocusValue,
  parseBackgroundImageFocus,
  resolveBackgroundImageFit,
} from "@/content/background-image-config";

/**
 * Both values land in a stylesheet rather than in markup, so React's escaping
 * never sees them - the sanitiser is the whole defence, exactly as it is for
 * `resolveBackgroundImage` and `resolveBackgroundConfig`. The other half of
 * what these assertions protect is quieter: a section that has never been
 * framed must emit no properties at all, or "the stylesheet default is
 * untouched" stops being true the moment this feature ships.
 */

describe("resolveBackgroundImageFit", () => {
  it("maps each stored id to its background-size", () => {
    expect(resolveBackgroundImageFit("fill")).toBe("cover");
    expect(resolveBackgroundImageFit("fit")).toBe("contain");
    expect(resolveBackgroundImageFit("stretch")).toBe("100% 100%");
  });

  it("falls back to today's cover for anything unrecognised", () => {
    // The reason no saved page moves: every ground image in existence was
    // painted `cover`, and every one of them stores no fit at all.
    expect(resolveBackgroundImageFit(undefined)).toBe("cover");
    expect(resolveBackgroundImageFit("")).toBe("cover");
    expect(resolveBackgroundImageFit("retired")).toBe("cover");
  });
});

describe("fitUsesFocalPoint", () => {
  it("is false only for stretch, where position cannot move anything", () => {
    expect(fitUsesFocalPoint("fill")).toBe(true);
    expect(fitUsesFocalPoint("fit")).toBe(true);
    expect(fitUsesFocalPoint("stretch")).toBe(false);
    expect(fitUsesFocalPoint(undefined)).toBe(true);
  });
});

describe("parseBackgroundImageFocus", () => {
  it("reads a stored pair", () => {
    expect(parseBackgroundImageFocus("62 38")).toEqual({ x: 62, y: 38 });
    expect(parseBackgroundImageFocus("  0 100  ")).toEqual({ x: 0, y: 100 });
  });

  it("rejects rather than clamps a value outside the box", () => {
    // Not a near-miss to be rescued: a value past the edge is a hand-edit or a
    // stale write, and the stylesheet's centre is more predictable than an
    // edge nobody chose.
    expect(parseBackgroundImageFocus("120 40")).toBeNull();
    expect(parseBackgroundImageFocus("40 101")).toBeNull();
  });

  it("rejects anything that is not two plain integers", () => {
    for (const value of [
      "",
      "50",
      "50 50 50",
      "50,50",
      "-10 50",
      "50.5 50",
      "50% 50%",
      // The one that matters: a value that would close the declaration and
      // append rules of its own if it were ever interpolated unchecked.
      "50 50; background-image: url(https://example.com/x.png)",
    ]) {
      expect(isBackgroundImageFocusValue(value), value).toBe(false);
    }
  });

  it("round-trips through the formatter", () => {
    const focus = { x: 62, y: 38 };

    expect(parseBackgroundImageFocus(formatBackgroundImageFocus(focus))).toEqual(
      focus,
    );
  });
});

describe("buildBackgroundImageStyle", () => {
  it("emits nothing for a section that was never framed", () => {
    expect(buildBackgroundImageStyle(undefined, undefined)).toEqual({});
    expect(buildBackgroundImageStyle("", "")).toEqual({});
  });

  it("emits nothing when the values equal the stylesheet's own defaults", () => {
    // `fill` is `cover` and `50 50` is `center`, so restating either inline
    // would be noise in every exported page that framed nothing.
    expect(buildBackgroundImageStyle("fill", "50 50")).toEqual({});
  });

  it("emits only the half that differs", () => {
    expect(buildBackgroundImageStyle("fit", "50 50")).toEqual({
      "--section-background-image-fit": "contain",
    });
    expect(buildBackgroundImageStyle("fill", "62 38")).toEqual({
      "--section-background-image-position": "62% 38%",
    });
  });

  it("drops the focal point under stretch, where it would do nothing", () => {
    expect(buildBackgroundImageStyle("stretch", "62 38")).toEqual({
      "--section-background-image-fit": "100% 100%",
    });
  });

  it("drops a malformed focal point rather than passing it through", () => {
    expect(buildBackgroundImageStyle("fill", "62 38; color: red")).toEqual({});
  });
});
