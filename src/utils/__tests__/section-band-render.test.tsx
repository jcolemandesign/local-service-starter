import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  PageTemplatePreview,
  type PageTemplatePreviewSection,
} from "@/components/sections/PageTemplatePreview";
import pageTemplates from "@/content/page-templates.json";
import { groupSectionsIntoBands } from "@/utils/section-bands";

/**
 * Bands change the shape of the rendered tree, so the guard that matters is not
 * that a band renders correctly - it is that a page which uses no bands still
 * renders exactly what it did before bands existed.
 *
 * Every template and staged page saved so far carries no `joinAbove` at all. If
 * the grouping pass ever wrapped one of those, the wrapper would become an
 * unstyled paint surface between the section and the page, and nothing would
 * throw - the page would just quietly change. These assertions are the tripwire.
 */

function countOccurrences(markup: string, needle: string) {
  return markup.split(needle).length - 1;
}

function section(
  overrides: Partial<PageTemplatePreviewSection> & { component: string },
): PageTemplatePreviewSection {
  return {
    instruction: "",
    mode: "Narrative",
    name: overrides.component,
    ...overrides,
  };
}

const bandClass = "pagebuilder-section-band";
const frameClass = "pagebuilder-section-frame";

const content = "ContentMainIdeaGridSectionV3";
const header = "SectionHeaderLargeSectionV3";

function render(sections: PageTemplatePreviewSection[]) {
  return renderToStaticMarkup(<PageTemplatePreview sections={sections} />);
}

describe("background band rendering", () => {
  it("emits no band element when nothing joins", () => {
    const markup = render([
      section({ component: header, id: "a" }),
      section({ component: content, id: "b" }),
      section({ component: content, id: "c" }),
    ]);

    expect(markup).not.toContain(bandClass);
    expect(countOccurrences(markup, frameClass)).toBe(3);
    // No member is inert, so no frame is forced transparent or set to inherit.
    expect(markup).not.toContain('data-pagebuilder-color-recipe="inherit"');
  });

  /**
   * The real corpus, not a fixture. Asserted against the grouping pass rather
   * than the rendered markup: rendering every saved template drags in the
   * request-service context that several sections need, which tests the
   * providers rather than the grouping. The pass is what decides whether a
   * wrapper appears, so it is the honest place to assert.
   */
  it("leaves every saved template band-free", () => {
    const templates = (
      pageTemplates as { templates?: Array<{ sections?: unknown[] }> }
    ).templates;

    expect(templates?.length).toBeGreaterThan(0);

    const banded = (templates ?? []).flatMap((template) =>
      groupSectionsIntoBands(
        (template.sections ?? []) as PageTemplatePreviewSection[],
      )
        .filter((band) => band.isBand)
        .map((band) => band.sections.map((entry) => entry.component)),
    );

    expect(banded).toEqual([]);
  });

  it("wraps a run of joiners in one band and makes its members inert", () => {
    const markup = render([
      section({ component: header, id: "a" }),
      section({ component: content, id: "b", joinAbove: "join" }),
      section({ component: content, id: "c", joinAbove: "join" }),
    ]);

    expect(countOccurrences(markup, bandClass)).toBe(1);
    expect(countOccurrences(markup, frameClass)).toBe(3);
    // All three sections are in the band, so all three frames go inert.
    expect(countOccurrences(markup, 'data-pagebuilder-color-recipe="inherit"')).toBe(3);
    expect(countOccurrences(markup, 'data-pagebuilder-background-fill="none"')).toBe(3);
  });

  it("gives the band the recipe of the section that opens it", () => {
    const markup = render([
      section({ component: header, id: "a", colorRecipe: "ink" }),
      section({ component: content, id: "b", joinAbove: "join" }),
    ]);
    // Matched without pinning attribute order, which is an implementation
    // detail of the renderer rather than something the band depends on.
    const bandTag = markup
      .split("<div ")
      .find((tag) => tag.includes(bandClass));

    expect(bandTag).toContain("pagebuilder-paint-surface");
    expect(bandTag).toContain('data-pagebuilder-color-recipe="ink"');
    // The recipe lands on the band and the members go inert, so the ground is
    // painted exactly once for the run.
    expect(countOccurrences(markup, 'data-pagebuilder-color-recipe="ink"')).toBe(1);
  });

  /**
   * The texture is keyed on the attribute alone, so the same value has to reach
   * a lone section and a band. These two assertions are what make "a treatment
   * chosen on one section keeps working when it is later joined into a run"
   * true rather than aspirational.
   */
  it("puts the texture on a lone section's own frame", () => {
    const markup = render([
      section({ component: header, id: "a", backgroundTreatment: "drift" }),
    ]);

    expect(markup).not.toContain(bandClass);
    expect(markup).toContain('data-pagebuilder-background-treatment="drift"');
  });

  it("moves the texture onto the band and leaves members untextured", () => {
    const markup = render([
      section({ component: header, id: "a", backgroundTreatment: "drift" }),
      section({ component: content, id: "b", joinAbove: "join" }),
    ]);

    // Once on the band; both member frames explicitly carry none, so the wash
    // is never drawn twice on top of itself.
    expect(countOccurrences(markup, 'data-pagebuilder-background-treatment="drift"')).toBe(1);
    expect(countOccurrences(markup, 'data-pagebuilder-background-treatment="none"')).toBe(2);
  });

  it("falls back to none for a treatment that is no longer offered", () => {
    const markup = render([
      section({ component: header, id: "a", backgroundTreatment: "retired" }),
    ]);

    expect(markup).toContain('data-pagebuilder-background-treatment="none"');
    expect(markup).not.toContain("retired");
  });

  /**
   * `ambient` is the only treatment that paints by rendering markup rather than
   * through a stylesheet rule, so it is the only one whose presence can be
   * asserted from the DOM at all - and the only one that can go missing on a
   * render path while its attribute still travels correctly. Both placements
   * are pinned here for the same reason the attribute ones above are.
   */
  it("renders the ambient overlay inside a lone section's frame", () => {
    const markup = render([
      section({ component: header, id: "a", backgroundTreatment: "ambient" }),
    ]);

    expect(markup).toContain('data-pagebuilder-background-treatment="ambient"');
    expect(countOccurrences(markup, 'class="ambient-drift"')).toBe(1);
  });

  it("draws the ambient overlay once per band, not once per member", () => {
    const markup = render([
      section({ component: header, id: "a", backgroundTreatment: "ambient" }),
      section({ component: content, id: "b", joinAbove: "join" }),
      section({ component: content, id: "c", joinAbove: "join" }),
    ]);

    // The band owns the run's texture and its members go inert, so three
    // frames yield exactly one set of sprites rather than three stacked ones.
    expect(countOccurrences(markup, 'class="ambient-drift"')).toBe(1);
    expect(countOccurrences(markup, 'data-pagebuilder-background-treatment="none"')).toBe(3);
  });

  it("renders no overlay for the treatments that are stylesheet rules", () => {
    const markup = render([
      section({ component: header, id: "a", backgroundTreatment: "drift" }),
      section({ component: content, id: "b", backgroundTreatment: "gradient" }),
      section({ component: content, id: "c", backgroundTreatment: "grain" }),
    ]);

    expect(markup).not.toContain("ambient-drift");
  });

  /**
   * The image is the one treatment whose value is per-page data rather than a
   * fixed rule, so it travels a different route: an asset field read at render
   * time, handed to the stylesheet as a custom property.
   */
  it("carries a lone section's ground image as a custom property", () => {
    const markup = renderToStaticMarkup(
      <PageTemplatePreview
        fieldsBySection={{
          a: [
            {
              id: "page.a.backgroundImage",
              kind: "image",
              path: "a.backgroundImage",
              value: "/images/ground.jpg",
            },
          ],
        }}
        sections={[
          section({ component: header, id: "a", backgroundTreatment: "image" }),
        ]}
      />,
    );

    expect(markup).toContain('data-pagebuilder-background-treatment="image"');
    expect(markup).toContain(
      '--section-background-image:url(&quot;/images/ground.jpg&quot;)',
    );
  });

  it("hands the run's image to the band, not to its members", () => {
    const markup = renderToStaticMarkup(
      <PageTemplatePreview
        fieldsBySection={{
          a: [
            {
              id: "page.a.backgroundImage",
              kind: "image",
              path: "a.backgroundImage",
              value: "/images/ground.jpg",
            },
          ],
        }}
        sections={[
          section({ component: header, id: "a", backgroundTreatment: "image" }),
          section({ component: content, id: "b", joinAbove: "join" }),
        ]}
      />,
    );

    expect(countOccurrences(markup, "--section-background-image")).toBe(1);
    // On the band, so it spans the run rather than restarting per section.
    const bandTag = markup.split("<div ").find((tag) => tag.includes(bandClass));

    expect(bandTag).toContain("--section-background-image");
  });

  it("drops a ground image that could break out of the css url()", () => {
    const markup = renderToStaticMarkup(
      <PageTemplatePreview
        fieldsBySection={{
          a: [
            {
              id: "page.a.backgroundImage",
              kind: "image",
              path: "a.backgroundImage",
              value: '/a.jpg"); position: fixed; inset: 0; //',
            },
          ],
        }}
        sections={[
          section({ component: header, id: "a", backgroundTreatment: "image" }),
        ]}
      />,
    );

    expect(markup).not.toContain("--section-background-image");
    expect(markup).not.toContain("position: fixed");
  });

  /**
   * The regression the builder surfaced, now guarded from the other direction.
   *
   * Sections no longer choose colours per recipe at all - they name semantic
   * classes and the recipe blocks in `globals.css` decide what those resolve
   * to. So the assertion is not "the member shows the band's colours" but "the
   * member emits no colour of its own to disagree with": one recipe on the
   * page, on the band, and no per-recipe class or accent custom property
   * baked into any member's markup.
   */
  it("lets no member emit a colour of its own", () => {
    const markup = render([
      section({ component: header, id: "a", colorRecipe: "ink" }),
      section({
        component: content,
        id: "b",
        joinAbove: "join",
        colorRecipe: "accent",
      }),
    ]);

    expect(countOccurrences(markup, 'data-pagebuilder-color-recipe="ink"')).toBe(1);
    expect(markup).not.toContain('data-pagebuilder-color-recipe="accent"');
    // The classes the old per-recipe maps used to bake in.
    expect(markup).not.toContain("--live-accent-ink");
    expect(markup).not.toContain("text-white");
    expect(markup).not.toContain("bg-bg-dark");
  });

  it("carries a parallax ground image the same way as a still one", () => {
    const markup = renderToStaticMarkup(
      <PageTemplatePreview
        fieldsBySection={{
          a: [
            {
              id: "page.a.backgroundImage",
              kind: "image",
              path: "a.backgroundImage",
              value: "/images/ground.jpg",
            },
          ],
        }}
        sections={[
          section({
            component: header,
            id: "a",
            backgroundTreatment: "image-parallax",
          }),
        ]}
      />,
    );

    expect(markup).toContain(
      'data-pagebuilder-background-treatment="image-parallax"',
    );
    expect(markup).toContain(
      '--section-background-image:url(&quot;/images/ground.jpg&quot;)',
    );
  });

  it("renders two bands when a non-joiner splits the run", () => {
    const markup = render([
      section({ component: header, id: "a" }),
      section({ component: content, id: "b", joinAbove: "join" }),
      section({ component: content, id: "c" }),
      section({ component: content, id: "d", joinAbove: "join" }),
    ]);

    expect(countOccurrences(markup, bandClass)).toBe(2);
  });
});
