import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { neutralizeBuilderVocabulary } from "@/utils/site-export";

/**
 * Every exported section is wrapped in a frame carrying
 * `pagebuilder-section-frame` and seven `data-pagebuilder-*` attributes, and
 * the stylesheet selects on all seven. Shipped unchanged, the word
 * "pagebuilder" lands in a client's DOM eight times per section, naming the
 * tool that generated the site.
 *
 * None of the attributes can be dropped - they are load-bearing, and `--live-*`
 * is remapped through them per colour recipe - so the export renames instead.
 * The rename only holds if it is applied identically to the emitted page
 * source and to the copied stylesheet; a mismatch silently unstyles every
 * section, which is why the pairing is asserted here rather than eyeballed.
 */
describe("exported builder vocabulary", () => {
  it("renames the frame class and its data attributes", () => {
    const source = [
      '<div className="pagebuilder-section-frame relative"',
      '  data-pagebuilder-card-fill="solid"',
      '  data-pagebuilder-color-recipe="muted"',
      '  data-pagebuilder-section-component="HeroFullscreenSectionV2">',
    ].join("\n");

    expect(neutralizeBuilderVocabulary(source)).toBe(
      [
        '<div className="site-section-frame relative"',
        '  data-section-card-fill="solid"',
        '  data-section-color-recipe="muted"',
        '  data-section-component="HeroFullscreenSectionV2">',
      ].join("\n"),
    );
  });

  /**
   * `data-pagebuilder-section-component` collapses to `data-section-component`,
   * not `data-section-section-component`. The stutter would give the rename
   * away as readily as the original name gave away the builder.
   */
  it("collapses the section- infix instead of stuttering", () => {
    expect(
      neutralizeBuilderVocabulary("--pagebuilder-section-gap-before: 0;"),
    ).toBe("--section-gap-before: 0;");
    expect(
      neutralizeBuilderVocabulary('data-pagebuilder-section-mode="Hero"'),
    ).toBe('data-section-mode="Hero"');
  });

  it("leaves no builder token behind in any form", () => {
    const source = [
      ".pagebuilder-section-frame[data-pagebuilder-color-recipe='muted']",
      ".pagebuilder-density-normal",
      ".pagebuilder-responsive-lg",
      ".pagebuilder-section-marker",
      ".pagebuilder-hide-markers",
      ".pagebuilder-nav-hero-pair",
      "--pagebuilder-section-gap-before",
    ].join("\n");

    expect(neutralizeBuilderVocabulary(source)).not.toContain("pagebuilder");
  });

  /**
   * The real stylesheet is the input that matters: a vocabulary added to
   * globals.css and not covered by the rename would ship as-is.
   */
  it("clears every builder token out of the real stylesheet", () => {
    const css = readFileSync(
      path.join(process.cwd(), "src", "app", "globals.css"),
      "utf8",
    );

    expect(css).toContain("pagebuilder");
    expect(neutralizeBuilderVocabulary(css)).not.toContain("pagebuilder");
  });

  it("is idempotent, so a re-export cannot double-rename", () => {
    const once = neutralizeBuilderVocabulary(
      '.pagebuilder-section-frame[data-pagebuilder-card-fill="none"]',
    );

    expect(neutralizeBuilderVocabulary(once)).toBe(once);
  });

  /**
   * Prose keeps reading correctly. "Set on the template in pagebuilder" refers
   * to the tool, not to a selector, and rewriting it would leave a comment
   * ending in a dangling prefix.
   */
  it("leaves bare prose mentions alone", () => {
    const comment = "// Set on the template in pagebuilder, not inferred.";

    expect(neutralizeBuilderVocabulary(comment)).toBe(comment);
  });
});
