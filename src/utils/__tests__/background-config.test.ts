import { describe, expect, it } from "vitest";

import {
  buildBackgroundConfigStyle,
  buildBackgroundLayers,
  defaultBackgroundConfig,
  maxBackgroundNodes,
  resolveBackgroundConfig,
  resolveBackgroundNodeColor,
} from "@/content/background-config";

/**
 * A background config is interpolated straight into a CSS gradient, and CSS is
 * the one place React's escaping does not reach - it never parses the value, it
 * hands the string to the browser. `resolveBackgroundImage` already established
 * the answer for this codebase: allowlist and drop, never escape and pass
 * through. These pin the same guarantee for the gradient model.
 *
 * The clamping half matters for a different reason: the editor writes these
 * numbers, but so does anything that hand-edits the JSON, and a NaN or an
 * Infinity reaching `radial-gradient()` invalidates the whole declaration - the
 * section loses its background entirely rather than degrading.
 */

describe("resolveBackgroundNodeColor", () => {
  it("resolves palette names to their token", () => {
    expect(resolveBackgroundNodeColor("accent")).toBe(
      "var(--color-service-accent)",
    );
    expect(resolveBackgroundNodeColor("ink")).toBe("var(--color-service-ink)");
  });

  it("accepts every hex form a colour input can produce", () => {
    for (const hex of ["#abc", "#abcd", "#a1b2c3", "#a1b2c3ff", "#ABCDEF"]) {
      expect(resolveBackgroundNodeColor(hex), hex).toBe(hex);
    }
  });

  it("rejects anything that could carry CSS of its own", () => {
    for (const attack of [
      "red; background: url(//evil)",
      "url(//evil)",
      "var(--anything)",
      "rgb(1,2,3)",
      "#12345",
      "#xyz",
      "",
      "   ",
      null,
      undefined,
      42,
      {},
    ]) {
      expect(resolveBackgroundNodeColor(attack), String(attack)).toBeNull();
    }
  });
});

describe("resolveBackgroundConfig", () => {
  it("returns null for anything unusable, so the stylesheet keeps its default", () => {
    for (const value of [null, undefined, {}, [], "gradient", 7]) {
      expect(resolveBackgroundConfig(value), String(value)).toBeNull();
    }
  });

  it("drops a config whose every node is malformed rather than half-painting it", () => {
    expect(
      resolveBackgroundConfig({ nodes: [{ color: "url(//evil)" }] }),
    ).toBeNull();
  });

  it("keeps the valid nodes when only some are malformed", () => {
    const resolved = resolveBackgroundConfig({
      nodes: [{ color: "accent", x: 10, y: 20 }, { color: "not-a-colour" }],
    });

    expect(resolved?.nodes).toHaveLength(1);
    expect(resolved?.nodes[0].color).toBe("accent");
  });

  it("clamps positions, radius and falloff into range", () => {
    const resolved = resolveBackgroundConfig({
      nodes: [{ color: "accent", x: -50, y: 999, size: 10000, fade: -1 }],
      strength: 500,
    });

    expect(resolved?.nodes[0]).toMatchObject({ x: 0, y: 100, size: 200, fade: 5 });
    expect(resolved?.strength).toBe(100);
  });

  it("substitutes a usable number for NaN and Infinity", () => {
    const resolved = resolveBackgroundConfig({
      nodes: [
        { color: "accent", x: Number.NaN, y: Number.POSITIVE_INFINITY, size: Number.NaN },
      ],
    });

    for (const value of Object.values(resolved?.nodes[0] ?? {})) {
      if (typeof value === "number") {
        expect(Number.isFinite(value)).toBe(true);
      }
    }
  });

  it("caps the node count", () => {
    const resolved = resolveBackgroundConfig({
      nodes: Array.from({ length: 40 }, () => ({ color: "accent" })),
    });

    expect(resolved?.nodes).toHaveLength(maxBackgroundNodes);
  });

  it("falls back to a normal blend when the mode is not one of ours", () => {
    const resolved = resolveBackgroundConfig({
      nodes: [{ color: "accent" }],
      blend: "expression(alert(1))",
    });

    expect(resolved?.blend).toBe("normal");
  });
});

describe("buildBackgroundLayers", () => {
  it("emits one gradient per node", () => {
    const layers = buildBackgroundLayers(defaultBackgroundConfig);

    expect(layers.match(/radial-gradient\(/g)).toHaveLength(2);
  });

  it("reproduces the positions the stylesheet has always drawn", () => {
    const layers = buildBackgroundLayers(defaultBackgroundConfig);

    expect(layers).toContain("at 12% 0%");
    expect(layers).toContain("at 88% 100%");
    expect(layers).toContain("var(--color-service-accent)");
  });
});

describe("buildBackgroundConfigStyle", () => {
  it("converts strength to an opacity fraction", () => {
    const style = buildBackgroundConfigStyle({
      ...defaultBackgroundConfig,
      strength: 40,
    });

    expect(style["--section-background-strength"]).toBe("0.4");
  });

  /**
   * A config must always state its own animation rather than falling through to
   * drift's default, so that turning motion off actually stops it.
   */
  it("always states an animation, including when motion is off", () => {
    expect(
      buildBackgroundConfigStyle({ ...defaultBackgroundConfig, animate: false })[
        "--section-background-animation-name"
      ],
    ).toBe("none");

    expect(
      buildBackgroundConfigStyle({ ...defaultBackgroundConfig, animate: true })[
        "--section-background-animation-name"
      ],
    ).toBe("section-background-float");
  });

  it("turns speed into a duration, faster to the right", () => {
    const slow = buildBackgroundConfigStyle({
      ...defaultBackgroundConfig,
      animate: true,
      speed: 50,
    })["--section-background-animation-duration"];
    const fast = buildBackgroundConfigStyle({
      ...defaultBackgroundConfig,
      animate: true,
      speed: 200,
    })["--section-background-animation-duration"];

    expect(slow).toBe("40.0s");
    expect(fast).toBe("10.0s");
  });

  /**
   * The shorthand form of this - `animation: var(--x)` - produced no motion at
   * all: a shorthand whose whole value is one variable is opaque at build time
   * and can be dropped by a pipeline that re-serialises shorthands. Pinning the
   * longhand property names keeps that from being reintroduced by a tidy-up.
   */
  it("emits animation longhands, never the shorthand", () => {
    const style = buildBackgroundConfigStyle({
      ...defaultBackgroundConfig,
      animate: true,
    });

    expect(style).toHaveProperty("--section-background-animation-name");
    expect(style).toHaveProperty("--section-background-animation-duration");
    expect(style).not.toHaveProperty("--section-background-animation");
  });

  /**
   * Speed 0 would divide into an infinite duration, which freezes the layer
   * mid-cycle rather than simply moving it slowly - a "slowest" setting that
   * silently means "off".
   */
  it("never produces a non-finite duration", () => {
    for (const speed of [0, -10, Number.NaN, Number.POSITIVE_INFINITY]) {
      const resolved = resolveBackgroundConfig({
        nodes: [{ color: "accent" }],
        animate: true,
        speed,
      });

      expect(resolved?.speed).toBeGreaterThan(0);

      const duration = buildBackgroundConfigStyle(resolved!)[
        "--section-background-animation-duration"
      ];

      expect(duration).not.toContain("Infinity");
      expect(Number.parseFloat(duration)).toBeGreaterThan(0);
      expect(Number.isFinite(Number.parseFloat(duration))).toBe(true);
    }
  });

  it("pins the paint area so node radii are not scaled twice", () => {
    expect(
      buildBackgroundConfigStyle(defaultBackgroundConfig)[
        "--section-background-size"
      ],
    ).toBe("100% 100%");
  });
});
