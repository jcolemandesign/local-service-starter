import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BackgroundImageFocusEditor } from "@/components/sections/BackgroundImageFocusEditor";
import { resolveBackgroundImageFit } from "@/content/background-image-config";

/**
 * The widget's preview is the feature's only claim to accuracy: a crop is
 * chosen by eye against it, so a preview that frames the image differently from
 * the real section makes every placement wrong. Held honest the same way
 * `BackgroundNodeEditor` is - by painting through the shared resolver rather
 * than a hand-written approximation.
 */

describe("BackgroundImageFocusEditor", () => {
  it("frames the preview through the shared fit resolver", () => {
    const html = renderToStaticMarkup(
      <BackgroundImageFocusEditor
        fit="fit"
        imageSrc="/images/ground.jpg"
        onChange={() => {}}
        value="62 38"
      />,
    );

    expect(html).toContain(`background-size:${resolveBackgroundImageFit("fit")}`);
    expect(html).toContain("background-position:62% 38%");
    expect(html).toContain('url(&quot;/images/ground.jpg&quot;)');
  });

  it("places the node where the stored value says", () => {
    const html = renderToStaticMarkup(
      <BackgroundImageFocusEditor
        fit="fill"
        imageSrc="/images/ground.jpg"
        onChange={() => {}}
        value="62 38"
      />,
    );

    expect(html).toContain("left:62%");
    expect(html).toContain("top:38%");
  });

  it("centres the node when nothing is stored", () => {
    const html = renderToStaticMarkup(
      <BackgroundImageFocusEditor fit="fill" onChange={() => {}} value="" />,
    );

    expect(html).toContain("left:50%");
    expect(html).toContain("top:50%");
  });

  /**
   * The pagebuilder mount. The image is chosen per page, so the builder usually
   * has none - the node still has to be offered, because the value it sets is a
   * section-level one.
   */
  it("shows a placeholder rather than a broken image when none is chosen", () => {
    const html = renderToStaticMarkup(
      <BackgroundImageFocusEditor fit="fill" onChange={() => {}} value="" />,
    );

    expect(html).not.toContain("background-image");
    expect(html).toContain("No image on this page yet");
    // The node is still there: framing without a picture is a real choice.
    expect(html).toContain("Image focal point");
  });

  /**
   * At `100% 100%` the image is sized to exactly the box, so there is no
   * overflow for a focal point to slide. A node offered here would move and
   * change nothing on the page - the same silent no-op the membership sets
   * elsewhere exist to prevent.
   */
  it("offers no node under stretch", () => {
    const html = renderToStaticMarkup(
      <BackgroundImageFocusEditor
        fit="stretch"
        imageSrc="/images/ground.jpg"
        onChange={() => {}}
        value="62 38"
      />,
    );

    expect(html).not.toContain("Image focal point");
    expect(html).toContain("nothing to reposition");
  });
});
