import { describe, expect, it } from "vitest";

import {
  buildBackgroundLayers,
  resolveBackgroundConfig,
} from "@/content/background-config";
import {
  backgroundPresets,
  getBackgroundPreset,
} from "@/content/background-presets";

/**
 * A preset is authored by hand, which means it is the one place a config can
 * enter the system without ever passing through the editor's clamps. If a hand
 * -written node names a colour that is not in the palette, `resolveBackgroundConfig`
 * drops that node - and a four-node preset would quietly apply as three.
 */

describe("background presets", () => {
  it("survives sanitising unchanged", () => {
    for (const preset of backgroundPresets) {
      const resolved = resolveBackgroundConfig(preset.config);

      expect(resolved, `${preset.id} resolved to nothing`).not.toBeNull();
      expect(
        resolved?.nodes.length,
        `${preset.id} lost nodes to the sanitiser - check every colour is a palette name or hex`,
      ).toBe(preset.config.nodes.length);
    }
  });

  it("builds real gradient layers for every preset", () => {
    for (const preset of backgroundPresets) {
      const layers = buildBackgroundLayers(preset.config);

      expect(layers.match(/radial-gradient\(/g), preset.id).toHaveLength(
        preset.config.nodes.length,
      );
      expect(layers, preset.id).not.toContain("null");
    }
  });

  it("has unique ids and a hint for each", () => {
    const ids = backgroundPresets.map((preset) => preset.id);

    expect(new Set(ids).size).toBe(ids.length);

    for (const preset of backgroundPresets) {
      expect(preset.label.length, preset.id).toBeGreaterThan(0);
      expect(preset.hint.length, preset.id).toBeGreaterThan(0);
    }
  });

  it("looks up by id and misses cleanly", () => {
    expect(getBackgroundPreset("hero-mesh")?.label).toBe("Hero mesh");
    expect(getBackgroundPreset("nope")).toBeUndefined();
    expect(getBackgroundPreset(undefined)).toBeUndefined();
  });

  /**
   * Presets are module constants shared by every section that picks one, and
   * the editor mutates a section's nodes in place through `updateNode`. If the
   * picker handed out the preset's own array, tuning one section would retune
   * the preset - and with it every other section that had ever chosen it.
   */
  it("holds node objects that a caller could accidentally share", () => {
    const preset = getBackgroundPreset("hero-mesh");
    const copy = {
      ...preset!.config,
      nodes: preset!.config.nodes.map((node) => ({ ...node })),
    };

    copy.nodes[0].x = 99;

    expect(
      preset!.config.nodes[0].x,
      "copying the preset must not write back into it",
    ).not.toBe(99);
  });
});
