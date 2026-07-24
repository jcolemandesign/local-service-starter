import { describe, expect, it } from "vitest";

import { getSectionId } from "@/utils/section-id";
import { readStagedPages } from "@/utils/staged-pages";

/**
 * Runs against the real staged-page records, not fixtures.
 *
 * Section identity is derived from ordinal + slugified display name, so
 * renaming or reordering a section changes the paths its copy is stored under.
 * The old fields do not move; they are simply never read again, and the section
 * silently renders section-library demo content instead.
 *
 * This is not hypothetical - section 07 of the About page had been in exactly
 * that state, with real approved copy stranded under
 * `07-asymmetric-feature-cards.*` after a rename to "Cards features 4 up split"
 * (recovered in d109015). Nothing in the app surfaced it.
 *
 * A persisted slotId is the structural fix. Until then, this fails loudly the
 * next time it happens.
 */
describe("staged page field paths", () => {
  it("has no fields belonging to a section that no longer exists", async () => {
    const pages = await readStagedPages();

    expect(pages.length).toBeGreaterThan(0);

    const orphans: string[] = [];

    for (const page of pages) {
      const sections = page.template?.sections ?? [];

      if (!sections.length) continue;

      const knownSectionIds = new Set(
        sections.map((section, index) => getSectionId(section, index)),
      );
      const seen = new Set<string>();

      for (const field of page.fields) {
        const prefix = field.path.split(".")[0];

        // `strategy.*` holds page-level strategy inputs, not section copy.
        if (!prefix || prefix === "strategy") continue;
        if (knownSectionIds.has(prefix) || seen.has(prefix)) continue;

        seen.add(prefix);
        orphans.push(
          `${page.snapshot.clientSlug}/${page.pageId}: "${prefix}" has no matching section (sections: ${[...knownSectionIds].join(", ")})`,
        );
      }
    }

    expect(orphans).toEqual([]);
  });
});
