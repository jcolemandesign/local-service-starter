import { describe, expect, it } from "vitest";

import {
  buildStrategyTemplateStagedPage,
  mergePreservingIncompatibleSections,
  type StagedPageField,
  type StagedPageTemplate,
} from "@/utils/staged-pages";
import { getStrategyCopyForPage } from "@/utils/strategy-site-map";
import { getTemplateCopySectionStatuses } from "@/utils/template-copy-contract";
import type { StrategySnapshot } from "@/utils/strategy-snapshots";
import type { StrategyWorkspaceFields } from "@/utils/strategy-workspace";

function emptyWorkspaceFields(
  overrides: Partial<StrategyWorkspaceFields> = {},
): StrategyWorkspaceFields {
  return {
    aboutCopy: "",
    contactCopy: "",
    contentPlan: "",
    copywritingAuthority: "",
    copywritingEnergy: "",
    copywritingHumor: "",
    copywritingPersonalityId: "",
    copywritingPersonalityPresence: "",
    copywritingPolish: "",
    copywritingUrgency: "",
    copywritingWarmth: "",
    generalNotes: "",
    homepageCopy: "",
    servicesCopy: "",
    strategyBrief: "",
    supplementalResearch: "",
    thankYouCopy: "",
    ...overrides,
  };
}

function twoSectionTemplate(): StagedPageTemplate {
  return {
    id: "tmpl-1",
    name: "Test Template",
    pageType: "Unmatched Test Page Type",
    sections: [
      {
        component: "WidgetOne",
        instruction: "",
        mode: "custom",
        name: "Widget One",
      },
      {
        component: "WidgetOne",
        instruction: "",
        mode: "custom",
        name: "Widget Two",
      },
    ],
    sourceOptionName: "Test Option",
    sourceRecipeName: "Test Recipe",
  };
}

// Section 1's heading slug ("01-widget-one") matches the template's section 1
// identity, so it verifies as "current". Section 2's heading slug
// ("02-widget-two-wrong") does not match the template's section 2 identity
// ("widget-two"), so it verifies as "stale" - simulating a component/name
// change at that position since this copy was written.
const strategyCopy = [
  "# Bulk Paste Copy",
  "",
  "### 01-widget-one",
  "eyebrow: Test Eyebrow One",
  "heading: Test Heading One",
  "body: Test body one.",
  "items: Item One - Description",
  "",
  "### 02-widget-two-wrong",
  "eyebrow: Test Eyebrow Two",
  "heading: Test Heading Two",
  "body: Test body two.",
  "items: Item Two - Description",
].join("\n");

function testSnapshot(): StrategySnapshot {
  return {
    clientSlug: "test-client",
    createdAt: "2026-01-01T00:00:00.000Z",
    fields: emptyWorkspaceFields({ contentPlan: strategyCopy }),
    id: "snapshot-1",
    navigation: [],
    pages: [],
    version: 1,
  };
}

describe("buildStrategyTemplateStagedPage - section-scoped apply", () => {
  it("seeds the compatible section's fields and leaves the incompatible section's fields blank", () => {
    const page = buildStrategyTemplateStagedPage({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: testSnapshot(),
      template: twoSectionTemplate(),
    });

    const findField = (path: string) =>
      page.fields.find((field) => field.path === path)?.value;

    expect(findField("01-widget-one.eyebrow")).toBe("Test Eyebrow One");
    expect(findField("01-widget-one.heading")).toBe("Test Heading One");

    // Section 2 is stale (identity mismatch), so it must not be seeded with
    // copy that may belong to a different component at that position.
    expect(findField("02-widget-two.eyebrow")).toBe("");
    expect(findField("02-widget-two.heading")).toBe("");
  });
});

describe("mergePreservingIncompatibleSections", () => {
  const template = twoSectionTemplate();
  const sectionStatuses = getTemplateCopySectionStatuses(
    strategyCopy,
    template,
  );

  it("keeps the freshly seeded value for a current section but restores the previous value for a stale section", () => {
    const page = buildStrategyTemplateStagedPage({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: testSnapshot(),
      template,
    });
    const previousFields: StagedPageField[] = page.fields.map((field) => {
      if (field.path === "01-widget-one.eyebrow") {
        return { ...field, value: "Old Eyebrow One (should be overwritten)" };
      }

      if (field.path === "02-widget-two.eyebrow") {
        return { ...field, value: "Old Eyebrow Two (should survive)" };
      }

      return field;
    });

    const merged = mergePreservingIncompatibleSections(
      page.fields,
      previousFields,
      sectionStatuses,
    );
    const findValue = (path: string) =>
      merged.find((field) => field.path === path)?.value;

    expect(findValue("01-widget-one.eyebrow")).toBe("Test Eyebrow One");
    expect(findValue("02-widget-two.eyebrow")).toBe(
      "Old Eyebrow Two (should survive)",
    );
  });

  it("is a no-op when there is no previous page", () => {
    const page = buildStrategyTemplateStagedPage({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: testSnapshot(),
      template,
    });

    expect(
      mergePreservingIncompatibleSections(page.fields, undefined, sectionStatuses),
    ).toBe(page.fields);
  });

  it("is a no-op when every section is current", () => {
    const page = buildStrategyTemplateStagedPage({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: testSnapshot(),
      template,
    });
    const allCurrentStatuses = sectionStatuses.map((sectionStatus) => ({
      ...sectionStatus,
      status: "current" as const,
    }));

    expect(
      mergePreservingIncompatibleSections(
        page.fields,
        page.fields,
        allCurrentStatuses,
      ),
    ).toBe(page.fields);
  });

  it("falls back to the freshly built (blank) value when no previous field exists at that path", () => {
    const page = buildStrategyTemplateStagedPage({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: testSnapshot(),
      template,
    });
    const previousFieldsWithoutSectionTwo = page.fields.filter(
      (field) => !field.path.startsWith("02-widget-two."),
    );

    const merged = mergePreservingIncompatibleSections(
      page.fields,
      previousFieldsWithoutSectionTwo,
      sectionStatuses,
    );

    expect(
      merged.find((field) => field.path === "02-widget-two.eyebrow")?.value,
    ).toBe("");
  });
});

describe("refresh copy source", () => {
  // buildStagedPageCandidate computes the section statuses that gate the merge,
  // and buildStrategyTemplateStagedPage computes the statuses that gate seeding.
  // If those two read copy from different places, the merge can restore previous
  // values over everything seeding just wrote - a refresh that reports success
  // and changes nothing.
  //
  // This fixture is that exact case: the copy lives in contentPlan, and the page
  // slug has no matching strategy slot, so there is no `pageCopy.test-page`
  // field at all.
  const snapshot = testSnapshot();
  const template = twoSectionTemplate();

  it("resolves page copy through the strategy fallback chain, not a direct pageCopy lookup", () => {
    const directLookup = snapshot.fields["pageCopy.test-page"] ?? "";
    const resolved = getStrategyCopyForPage(
      snapshot.fields,
      "test-page",
      template.pageType,
    );

    // The direct lookup finds nothing; the resolver falls back to contentPlan.
    // Gating the merge on the empty one is what caused the silent no-op.
    expect(directLookup).toBe("");
    expect(resolved).toBe(strategyCopy);
  });

  it("gives the merge the same section statuses that seeding used", () => {
    const resolved = getStrategyCopyForPage(
      snapshot.fields,
      "test-page",
      template.pageType,
    );
    const mergeStatuses = getTemplateCopySectionStatuses(resolved, template);
    const seedingStatuses = getTemplateCopySectionStatuses(
      strategyCopy,
      template,
    );

    expect(mergeStatuses).toEqual(seedingStatuses);

    // Section 1 must be "current" so the merge is allowed to overwrite it.
    // Under the old direct lookup every section came back non-current, so the
    // merge restored the previous values over the freshly seeded ones.
    expect(mergeStatuses.find((s) => s.ordinal === "01")?.status).toBe(
      "current",
    );
  });
});

describe("parser agreement", () => {
  // Two independent parsers read the same bulk-paste format:
  // parseMarkdownCopyValues (seeding, in staged-pages) and
  // getBatchCopyFieldsBySectionOrdinal (validation, in template-copy-contract).
  // They differ in heading regex, key normalisation, and JSON support. Those
  // differences are currently latent for generated contracts, but if they ever
  // drift apart, copy can validate as "current" and then fail to seed - a paste
  // that reports success and writes nothing.
  //
  // Rather than assert on the private parsers, pin the property that matters
  // through the public pipeline: whatever validation certifies as current must
  // actually be seeded.
  const template = twoSectionTemplate();

  it("seeds every field of a section that validation certifies as current", () => {
    const statuses = getTemplateCopySectionStatuses(strategyCopy, template);
    const currentOrdinals = statuses
      .filter((s) => s.status === "current")
      .map((s) => s.ordinal);

    expect(currentOrdinals).toContain("01");

    const page = buildStrategyTemplateStagedPage({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: testSnapshot(),
      template,
    });

    for (const ordinal of currentOrdinals) {
      const sectionFields = page.fields.filter(
        (field) => field.kind === "copy" && field.path.startsWith(`${ordinal}-`),
      );

      expect(sectionFields.length).toBeGreaterThan(0);

      // If validation says this section's copy is current, the seeding parser
      // must have found values for it. An all-blank certified section means
      // the two parsers disagreed about the same text.
      expect(
        sectionFields.some((field) => field.value.trim().length > 0),
      ).toBe(true);
    }
  });

  it("does not certify a section whose copy the seeding parser cannot read", () => {
    // JSON is accepted by the seeding parser but not by the validation parser.
    // Validation must therefore certify nothing, so the section-scoped gate
    // blocks seeding rather than half-applying it.
    const jsonCopy = JSON.stringify({
      "01-widget-one": { eyebrow: "From JSON", heading: "From JSON" },
    });
    const statuses = getTemplateCopySectionStatuses(jsonCopy, template);

    expect(statuses.every((s) => s.status !== "current")).toBe(true);
  });
});
