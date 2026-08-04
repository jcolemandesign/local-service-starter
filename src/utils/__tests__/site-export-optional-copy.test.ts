import { describe, expect, it } from "vitest";

import { getSectionId } from "@/utils/section-id";
import { isUnresolvedCopy } from "@/utils/site-export";
import { readStagedPages } from "@/utils/staged-pages";
import { getTemplateCopyFieldsForSection } from "@/utils/template-copy-contract";

/**
 * The export gate used to demand every declared copy field, including the ones
 * the contract explicitly tells the copywriter to omit.
 *
 * The two are written by the same specs. `optional: true` becomes "OPTIONAL.
 * Omit when the card does not need it" in the prompt, and
 * `getTemplateCopySectionStatuses` filters on `!field.optional` when deciding
 * whether a section's copy is complete - but staging seeds every declared
 * field, so an omitted one arrives at the gate as an empty string and the gate
 * only knew its name.
 *
 * Found by approving the North Star home page for export: the two decision
 * cards on `05-split-large-cards` each carry three paragraph chunks out of a
 * possible four, exactly as the spec permits, and the export refused the page
 * with "Resolve copy field ...cards.1.paragraphs.4" - a field that is meant to
 * stay blank.
 */
describe("export gate and optional copy fields", () => {
  it("does not demand a field the contract allows to be omitted", () => {
    expect(isUnresolvedCopy("", { optional: true })).toBe(false);
    expect(isUnresolvedCopy("   ", { optional: true })).toBe(false);
  });

  it("still demands a required field", () => {
    expect(isUnresolvedCopy("")).toBe(true);
    expect(isUnresolvedCopy("   ")).toBe(true);
    expect(isUnresolvedCopy("", { optional: false })).toBe(true);
  });

  /**
   * Omitting a field and reporting that its source material is missing are
   * different answers. Only the first is the contract working as written.
   */
  it("blocks on NEEDS REVIEW even in an optional field", () => {
    expect(
      isUnresolvedCopy("NEEDS REVIEW: no approved quote.", { optional: true }),
    ).toBe(true);
    expect(isUnresolvedCopy("needs review: missing.", { optional: true })).toBe(
      true,
    );
  });

  it("passes ordinary copy", () => {
    expect(isUnresolvedCopy("Stabilize the current system.")).toBe(false);
  });

  /**
   * Ground truth for the rule: read the real specs behind the real staged
   * sections and confirm optional fields exist there at all. Asserted against
   * the specs rather than against staged values, which are client copy and
   * change whenever someone writes a paragraph.
   */
  it("finds optional fields in the specs the staged sections actually use", async () => {
    const pages = await readStagedPages();
    const optionalPaths = new Set<string>();

    for (const page of pages) {
      (page.template?.sections ?? []).forEach((section, index) => {
        const sectionId = getSectionId(section, index);

        for (const field of getTemplateCopyFieldsForSection(section)) {
          if (field.optional) {
            optionalPaths.add(`${sectionId}.${field.name}`);
          }
        }
      });
    }

    expect(optionalPaths.size).toBeGreaterThan(0);

    for (const fieldPath of optionalPaths) {
      expect({
        fieldPath,
        unresolved: isUnresolvedCopy("", { optional: true }),
      }).toEqual({ fieldPath, unresolved: false });
    }
  });
});
