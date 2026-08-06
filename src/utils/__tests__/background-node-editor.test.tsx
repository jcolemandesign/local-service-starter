import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BackgroundNodeEditor } from "@/components/sections/BackgroundNodeEditor";
import { defaultBackgroundConfig } from "@/content/background-config";
import { treatmentUsesBackgroundConfig } from "@/content/section-style-options";

/**
 * The editor's preview is the feature's only claim to accuracy: a node is
 * placed by eye against it, so a preview that paints differently from the real
 * section makes every placement wrong. It is held honest by building from
 * `buildBackgroundConfigStyle`, the same function the canvas and the export
 * call - these assertions pin that it still does.
 */

describe("BackgroundNodeEditor", () => {
  it("paints the preview through the shared layer builder", () => {
    const html = renderToStaticMarkup(
      <BackgroundNodeEditor config={null} onChange={() => {}} />,
    );

    expect(html).toContain("--section-background-layers");
    expect(html).toContain("radial-gradient");
  });

  it("starts an untuned section from the stylesheet's own washes", () => {
    const html = renderToStaticMarkup(
      <BackgroundNodeEditor config={null} onChange={() => {}} />,
    );

    // The two default nodes, at the positions globals.css has always drawn.
    expect(html).toContain("left:12%");
    expect(html).toContain("left:88%");
  });

  it("renders one draggable dot per node", () => {
    const html = renderToStaticMarkup(
      <BackgroundNodeEditor
        config={{
          ...defaultBackgroundConfig,
          nodes: [
            ...defaultBackgroundConfig.nodes,
            { color: "ink", x: 40, y: 60, size: 80, fade: 50, opacity: 100 },
          ],
        }}
        onChange={() => {}}
      />,
    );

    expect(html.match(/aria-label="Background node/g)).toHaveLength(3);
  });

  it("cannot remove the last node", () => {
    // An empty node list resolves to null, which would silently revert the
    // section to the stylesheet default rather than showing what was edited.
    const html = renderToStaticMarkup(
      <BackgroundNodeEditor
        config={{
          ...defaultBackgroundConfig,
          nodes: [{ color: "accent", x: 50, y: 50, size: 90, fade: 55, opacity: 100 }],
        }}
        onChange={() => {}}
      />,
    );

    expect(html).toMatch(/Remove<\/button>/);
    expect(html).toContain("disabled");
  });
});

describe("treatmentUsesBackgroundConfig", () => {
  it("offers node tuning only where the gradient layers are read", () => {
    for (const treatment of ["gradient", "drift"]) {
      expect(treatmentUsesBackgroundConfig(treatment), treatment).toBe(true);
    }

    // Grain draws a fixed rule grid; the image treatments paint a photograph.
    for (const treatment of ["none", "grain", "image", "image-parallax", ""]) {
      expect(treatmentUsesBackgroundConfig(treatment), treatment).toBe(false);
    }
  });
});
