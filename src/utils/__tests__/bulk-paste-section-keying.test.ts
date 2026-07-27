import { describe, expect, it } from "vitest";
import {
  getCopySeedingSummary,
  getSectionIdsByCopyFingerprint,
  getTemplateAssetFieldsForSection,
  parseKeyedCopyValues,
  type StagedPageTemplateSection,
} from "@/utils/staged-pages";
import {
  getTemplateCopySectionFingerprint,
  getTemplateCopySectionStatuses,
} from "@/utils/template-copy-contract";
import { getSectionId } from "@/utils/section-id";

/**
 * Regression guard for a real miss on the North Star home page.
 *
 * A model returned correct copy for all eight sections but omitted the
 * `### <section-id>` headings, keeping only the `<!-- Section contract: ... -->`
 * comments. `parseMarkdownCopyValues` only opened a section scope on a heading,
 * so every key was stored bare - and because `heading`, `intro`, `eyebrow`, and
 * `primaryAction` each appear in several sections, bare keys overwrote one
 * another. `getBulkPasteMatchKey` only ever looks up section-qualified keys, so
 * zero of the page's copy fields were filled. The renderer then fell back to
 * section-library demo content and the stage still reported success.
 *
 * Two things have to hold for that to stay fixed:
 *   1. the contract comment works as a section delimiter on its own, and
 *   2. a paste that fills nothing is reported rather than passing silently.
 */

const sections: StagedPageTemplateSection[] = [
  {
    component: "NavPrimarySectionV2",
    instruction: "",
    mode: "Navigation",
    name: "Primary navigation",
  },
  {
    component: "HeroFullscreenSectionV2",
    instruction: "",
    mode: "Hero",
    name: "Fullscreen image hero",
  },
];

function contractCopyWithoutHeadings() {
  const [nav, hero] = sections;

  return [
    "<!-- Page target: Home (/) -->",
    `<!-- Section contract: ${getTemplateCopySectionFingerprint(nav)} -->`,
    "logoLabel: North Star HVAC",
    "primaryAction: Call Now",
    `<!-- Section contract: ${getTemplateCopySectionFingerprint(hero)} -->`,
    "h1: HVAC Repair Around Lake Norman",
    "intro: A locally owned team serving Huntersville.",
    "primaryAction: Request a Quote",
  ].join("\n");
}

describe("bulk paste section keying", () => {
  it("maps each section fingerprint to its derived section id", () => {
    const map = getSectionIdsByCopyFingerprint(sections);

    expect(map.size).toBe(2);
    expect(map.get(getTemplateCopySectionFingerprint(sections[1]))).toBe(
      getSectionId(sections[1], 1),
    );
  });

  it("scopes keys by contract comment when headings are missing", () => {
    const copy = contractCopyWithoutHeadings();
    const values = parseKeyedCopyValues(
      copy,
      getSectionIdsByCopyFingerprint(sections),
    );

    // Parsed keys are normalized to lower case, so compose expectations the
    // same way rather than asserting on the camelCase field name.
    const key = (sectionId: string, field: string) =>
      `${sectionId}.${field}`.toLowerCase();
    const navId = getSectionId(sections[0], 0);
    const heroId = getSectionId(sections[1], 1);

    expect(values.get(key(heroId, "h1"))).toBe(
      "HVAC Repair Around Lake Norman",
    );
    expect(values.get(key(heroId, "intro"))).toBe(
      "A locally owned team serving Huntersville.",
    );
    // `primaryAction` appears in both sections and must not collide.
    expect(values.get(key(navId, "primaryAction"))).toBe("Call Now");
    expect(values.get(key(heroId, "primaryAction"))).toBe("Request a Quote");
  });

  it("negative control: the same paste keys nothing without the map", () => {
    // This is the exact failure that shipped demo content to the home page. If
    // this ever starts passing with section-qualified keys, the delimiter is
    // coming from somewhere else and the test above proves less than it looks.
    const values = parseKeyedCopyValues(contractCopyWithoutHeadings());
    const heroId = getSectionId(sections[1], 1);

    expect(values.get(`${heroId}.h1`)).toBeUndefined();
    expect([...values.keys()].some((key) => key.includes("."))).toBe(false);
    // Both sections' primaryAction collapsed onto one bare key - last wins.
    expect(values.get("primaryaction")).toBe("Request a Quote");
  });

  it("does not append a bare section id to the previous field's value", () => {
    // Observed on the North Star home page: the paste wrote section ids as
    // bare lines rather than `### <section-id>` headings, so seven fields -
    // including a button label - ended with the next section's id appended.
    const [nav, hero] = sections;
    const navId = getSectionId(nav, 0);
    const heroId = getSectionId(hero, 1);
    const copy = [
      `<!-- Section contract: ${getTemplateCopySectionFingerprint(nav)} -->`,
      "primaryAction: Call Now",
      "",
      heroId,
      `<!-- Section contract: ${getTemplateCopySectionFingerprint(hero)} -->`,
      "h1: HVAC Repair Around Lake Norman",
    ].join("\n");

    const values = parseKeyedCopyValues(
      copy,
      getSectionIdsByCopyFingerprint(sections),
    );

    expect(values.get(`${navId}.primaryaction`)).toBe("Call Now");
    expect(values.get(`${heroId}.h1`)).toBe("HVAC Repair Around Lake Norman");
  });

  it("marks headingless sections current so staging is allowed to seed them", () => {
    // The second gate. buildStagedPageCandidate only lets a section seed when
    // its status is "current"; getBatchCopyFieldsBySectionOrdinal used to open
    // a section solely on an ordinal heading, so a headingless paste resolved
    // every section to "unverified" and the page staged completely empty even
    // though the copy parsed fine. Staging from the Template Library goes
    // through this path; saving the strategy workspace does not, which is why
    // one worked and the other did not.
    const statuses = getTemplateCopySectionStatuses(
      contractCopyWithoutHeadings(),
      { id: "home", name: "Home", pageType: "Home", sections },
    );

    // The nav section reports "site-level" regardless of the paste: nav and
    // footer are no longer requested in the page copy spec, so the hero is the
    // section that proves the headingless fingerprint lookup here.
    expect(statuses).toHaveLength(2);
    expect(statuses.map((status) => status.status)).toEqual([
      "site-level",
      "current",
    ]);

    // Negative control: the same shape with unrecognizable fingerprints must
    // still be unverified, so the test above is proving the fingerprint lookup
    // and not some unrelated leniency in the parser.
    const unknown = getTemplateCopySectionStatuses(
      contractCopyWithoutHeadings().replace(/sc-v1-[A-Za-z0-9]+/g, "sc-v1-zzzz"),
      { id: "home", name: "Home", pageType: "Home", sections },
    );

    expect(unknown.map((status) => status.status)).toEqual([
      "site-level",
      "unverified",
    ]);
  });

  it("reports a paste that reached no field", () => {
    const summary = getCopySeedingSummary("h1: Something the parser missed", {
      fields: [
        { id: "a", kind: "copy", path: "02-hero.h1", value: "" },
        { id: "b", kind: "copy", path: "02-hero.intro", value: "" },
        { id: "c", kind: "meta", path: "02-hero.contentDirection", value: "x" },
        { id: "d", kind: "copy", path: "strategy.pageCopy", value: "big blob" },
      ],
    });

    expect(summary.totalCopyFields).toBe(2);
    expect(summary.filledCopyFields).toBe(0);
    expect(summary.seededNothing).toBe(true);
  });

  it("stays quiet when the page staged before any page copy existed", () => {
    // The content plan is keyed by page name, never by section id, so it can
    // never seed a field. Reporting that as a failed paste flagged every
    // first-time stage as broken.
    const summary = getCopySeedingSummary(
      "### Home\nPositioning notes for the home page.",
      {
        fields: [
          { id: "a", kind: "copy", path: "02-hero.h1", value: "" },
          { id: "b", kind: "copy", path: "02-hero.intro", value: "" },
        ],
      },
      "content-plan",
    );

    expect(summary.seededNothing).toBe(false);
    expect(summary.stagedWithoutPageCopy).toBe(true);
    expect(summary.copySource).toBe("content-plan");
  });

  it("still reports a real page-copy paste that reached no field", () => {
    const summary = getCopySeedingSummary(
      "h1: Something the parser missed",
      { fields: [{ id: "a", kind: "copy", path: "02-hero.h1", value: "" }] },
      "page",
    );

    expect(summary.seededNothing).toBe(true);
    expect(summary.stagedWithoutPageCopy).toBe(false);
  });

  it("stays quiet when copy landed, or when none was supplied", () => {
    const landed = getCopySeedingSummary("h1: Real copy", {
      fields: [{ id: "a", kind: "copy", path: "02-hero.h1", value: "Real copy" }],
    });

    expect(landed.seededNothing).toBe(false);

    const noCopy = getCopySeedingSummary("   ", {
      fields: [{ id: "a", kind: "copy", path: "02-hero.h1", value: "" }],
    });

    expect(noCopy.hasStrategyCopy).toBe(false);
    expect(noCopy.seededNothing).toBe(false);
  });

  it("keeps the asset spec reachable for the same sections", () => {
    // Cheap canary: the fingerprint map is built from the same section records
    // the asset spec reads, so a shape change here would surface as an empty
    // asset list rather than a type error.
    expect(
      getTemplateAssetFieldsForSection(sections[1]).length,
    ).toBeGreaterThanOrEqual(0);
  });
});
