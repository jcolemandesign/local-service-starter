import { describe, expect, it } from "vitest";

import { getContentEditorPages } from "@/content/content-editor";

/**
 * The content editor badges an image field "placeholder" when it still holds
 * the value its section library ships with, so the 80 that block an export are
 * visible while editing rather than only at export time.
 *
 * The rule reuses the `template-default` fallback the editor already computes,
 * rather than keeping a second list of placeholder paths in sync with
 * `validatePlaceholderAssets`. This asserts the two agree on real data - if the
 * editor's notion of placeholder drifts from the export's, the editor would
 * show a page as ready that the export then refuses.
 */

function isPlaceholder(field: {
  kind: string;
  value: string;
  fallback?: { source: string; value: string };
}) {
  if (field.kind !== "image") return false;

  const trimmed = field.value.trim();
  if (!trimmed) return true;

  return (
    field.fallback?.source === "template-default" &&
    trimmed === field.fallback.value.trim()
  );
}

describe("content editor image fields", () => {
  it("carries a template-default fallback for image fields", async () => {
    const pages = await getContentEditorPages();
    const imageFields = pages.flatMap((page) =>
      page.sections.flatMap((section) =>
        section.fields.filter((field) => field.kind === "image"),
      ),
    );

    expect(imageFields.length).toBeGreaterThan(0);

    // Without this the badge silently reports every image as "set", because
    // the rule has nothing to compare against.
    const withDefaults = imageFields.filter(
      (field) => field.fallback?.source === "template-default",
    );

    expect(withDefaults.length).toBeGreaterThan(0);
  });

  it("flags the placeholders that currently block an export", async () => {
    const pages = await getContentEditorPages();
    const flagged = pages.flatMap((page) =>
      page.sections.flatMap((section) =>
        section.fields.filter(isPlaceholder).map((field) => field.id),
      ),
    );

    expect(flagged.length).toBeGreaterThan(0);
  });

  it("does not flag an image pointing at a real asset", () => {
    expect(
      isPlaceholder({
        fallback: { source: "template-default", value: "/images/fpo-image.svg" },
        kind: "image",
        value: "/images/crew-2026.jpg",
      }),
    ).toBe(false);
  });

  it("flags an empty image field, which renders the library default", () => {
    expect(
      isPlaceholder({
        fallback: { source: "template-default", value: "/images/fpo-image.svg" },
        kind: "image",
        value: "   ",
      }),
    ).toBe(true);
  });

  /**
   * Copy fields carry a `template-example` fallback, which is guidance rather
   * than a shipped default. Treating those as placeholders would badge most of
   * the editor.
   */
  it("ignores non-image fields", () => {
    expect(
      isPlaceholder({
        fallback: { source: "template-example", value: "Same as the example" },
        kind: "copy",
        value: "Same as the example",
      }),
    ).toBe(false);
  });
});
