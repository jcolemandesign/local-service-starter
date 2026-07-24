import { beforeEach, describe, expect, it, vi } from "vitest";

import type { StagedPageTemplate } from "@/utils/staged-pages";
import type { StrategySnapshot } from "@/utils/strategy-snapshots";
import type { StrategyWorkspaceFields } from "@/utils/strategy-workspace";

// buildStagedPageCandidate reads staged-pages.json to find the previously
// staged version of the page it is rebuilding. Mock the filesystem so the test
// controls what "previously staged" means instead of depending on repo data.
const stagedPagesFile = { pages: [] as unknown[] };

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn(async () => undefined),
  readFile: vi.fn(async () => JSON.stringify(stagedPagesFile)),
  writeFile: vi.fn(async () => undefined),
}));

const { buildStagedPageCandidate, buildStrategyTemplateStagedPage } =
  await import("@/utils/staged-pages");

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

function template(): StagedPageTemplate {
  return {
    id: "tmpl-1",
    name: "Test Template",
    // Deliberately unmatched: this page slug has no strategy slot, so there is
    // no `pageCopy.test-page` field. Copy is only reachable via the fallback
    // chain in getStrategyCopyForPage.
    pageType: "Unmatched Test Page Type",
    sections: [
      {
        component: "WidgetOne",
        instruction: "",
        mode: "custom",
        name: "Widget One",
      },
    ],
    sourceOptionName: "Test Option",
    sourceRecipeName: "Test Recipe",
  };
}

const strategyCopy = [
  "# Bulk Paste Copy",
  "",
  "### 01-widget-one",
  "eyebrow: Fresh Eyebrow",
  "heading: Fresh Heading",
  "body: Fresh body.",
  "items: Item One - Description",
].join("\n");

function snapshot(): StrategySnapshot {
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

describe("buildStagedPageCandidate", () => {
  beforeEach(() => {
    // A previously staged version of the same page, holding older values.
    const previous = buildStrategyTemplateStagedPage({
      applyBatchCopy: false,
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: snapshot(),
      template: template(),
    });

    stagedPagesFile.pages = [
      {
        ...previous,
        fields: previous.fields.map((field) =>
          field.path === "01-widget-one.eyebrow"
            ? { ...field, value: "Stale Previous Eyebrow" }
            : field,
        ),
      },
    ];
  });

  it("overwrites a section whose new copy is current, rather than restoring the previous value", async () => {
    const { finalPage, sectionStatuses } = await buildStagedPageCandidate({
      pageLabel: "Test Page",
      pageSlug: "test-page",
      snapshot: snapshot(),
      template: template(),
    });

    // The statuses gating the merge must see section 1 as current. Resolving
    // copy via a direct `pageCopy.test-page` lookup returns "" here, every
    // section reads as non-current, and the merge restores the previous value
    // over what seeding just wrote - a refresh that reports success and
    // changes nothing.
    expect(sectionStatuses.find((s) => s.ordinal === "01")?.status).toBe(
      "current",
    );

    expect(
      finalPage.fields.find((f) => f.path === "01-widget-one.eyebrow")?.value,
    ).toBe("Fresh Eyebrow");
  });
});
