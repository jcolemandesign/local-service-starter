import { describe, expect, it } from "vitest";

import { sectionLibraryV3Content } from "@/content/section-library-v3";
import pageTemplates from "@/content/page-templates.json";
import { renderPageTemplateSection } from "@/components/sections/PageTemplatePreview";
import { getTemplateCopyFieldsForSection } from "@/utils/template-copy-contract";
import {
  getTemplateAssetFieldsForSection,
  type StagedPageField,
} from "@/utils/staged-pages";

/**
 * Guards the failure mode that export validation structurally cannot catch.
 *
 * Every `xxxProps()` mapper in PageTemplatePreview spreads its section-library
 * demo content as a fallback base. If a field name the mapper reads is missing
 * from `getTemplateCopyFieldsForSection`, that field is never requested from the
 * LLM, never written to `page.fields`, and the renderer silently falls back to
 * demo copy - which then ships to a client site. `validateStagedFields` only
 * inspects fields that already exist in `page.fields`, so a field that was never
 * specced cannot be flagged there.
 *
 * This test drives the same path the export engine does: build the fields the
 * contract says a section should have, fill each with a unique sentinel, render
 * the section, and read the resolved props back off the element. Any prop that
 * still equals a demo-content string means the mapper is reading a field the
 * contract never declared.
 */

const SENTINEL = "__SPECCED__";

// Fields that are intentionally not copy fields. Hrefs and action targets are
// resolved from site navigation and passed explicitly in the render switch, so
// they legitimately fall back to library defaults.
const NON_COPY_PROPS = new Set([
  "primaryActionHref",
  "secondaryActionHref",
  "sectionAction",
  "action",
  "href",
]);

/**
 * Live sections that currently render demo content for at least one prop the
 * copy/asset specs do not declare. These are pre-existing gaps, recorded here
 * so the suite stays green while still blocking NEW drift.
 *
 * This is asserted in both directions on purpose: if you close a gap, this test
 * fails until you remove the component from this set. That keeps the list from
 * silently rotting into a permanent allowlist.
 *
 * To close one: find the field name the mapper reads in PageTemplatePreview,
 * add it to the matching branch of getTemplateCopyFieldsForSection (or
 * getTemplateAssetFieldsForSection for images/alt text), then delete the entry.
 * Expect affected sections to flip to "stale" - the contract fingerprint changes.
 */
const KNOWN_GAPS = new Set([
  "ContentNarrativeFeatureRailSectionV3",
  "ContentPhotoGalleryCarouselSectionV3",
  "ContentStickyCardStreamSectionV2",
  "FourCardLinkGridSectionV3",
  "HeroFullscreenSectionV2",
  "QuickPageLinksSectionV2",
  "ServiceAreaZipLookupSectionV3",
  "ServiceNeedsPriorityGridSectionV3",
  "ServicesThreeCardsRightSectionV3",
  "TrustLogoGridSectionV3",
  "TrustLogoMarqueeSectionV3",
]);

function collectDemoStrings(value: unknown, out: Set<string>) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    // Ignore short tokens and routes - they collide with legitimate values and
    // are not the client-facing prose this test is protecting against.
    if (trimmed.length >= 25 && !trimmed.startsWith("/")) out.add(trimmed);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectDemoStrings(item, out));
    return;
  }
  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectDemoStrings(item, out));
  }
}

function collectPropStrings(
  value: unknown,
  path: string,
  out: Array<{ path: string; value: string }>,
) {
  if (typeof value === "string") {
    out.push({ path, value: value.trim() });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => collectPropStrings(item, `${path}[${i}]`, out));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([k, v]) =>
      collectPropStrings(v, path ? `${path}.${k}` : k, out),
    );
  }
}

// Every demo string in the library, so a mapper falling back to *any* section's
// demo content is caught - not just its own.
const allDemoStrings = new Set<string>();
collectDemoStrings(sectionLibraryV3Content, allDemoStrings);

type TemplateSection = { component: string; mode?: string; name?: string };

const liveSections = new Map<string, TemplateSection>();
for (const template of (pageTemplates as { templates?: Array<{ sections?: TemplateSection[] }> })
  .templates ?? []) {
  for (const section of template.sections ?? []) {
    if (section?.component) liveSections.set(section.component, section);
  }
}

describe("section demo-content leak guard", () => {
  it("finds live template sections to check", () => {
    expect(liveSections.size).toBeGreaterThan(0);
  });

  for (const [component, section] of liveSections) {
    it(`${component} does not fall back to demo content for specced fields`, () => {
      const contractSection = {
        component,
        mode: section.mode ?? "",
        name: section.name ?? "",
      };
      // Fill every field the contract declares - copy AND asset - with a
      // unique sentinel. Anything still showing demo content after that is a
      // field the mapper reads but no spec declares.
      const specced = [
        ...getTemplateCopyFieldsForSection(contractSection).map((f) => ({
          kind: "copy" as const,
          name: f.name,
        })),
        ...getTemplateAssetFieldsForSection(
          contractSection as never,
        ).map((f) => ({ kind: f.kind, name: f.name })),
      ];

      const fields: StagedPageField[] = specced.map((field, i) => ({
        id: `test.01-section.${field.name}`,
        kind: field.kind,
        path: `01-section.${field.name}`,
        value: `${SENTINEL}${i}-${field.name}`,
      })) as StagedPageField[];

      const element = renderPageTemplateSection(
        { component, colorRecipe: undefined, mode: section.mode, name: section.name } as never,
        1,
        fields,
        [],
        "/",
      );

      expect(element).toBeTruthy();

      const props: Array<{ path: string; value: string }> = [];
      collectPropStrings((element as { props: unknown }).props, "", props);

      const leaked = props.filter(
        (p) =>
          allDemoStrings.has(p.value) &&
          !NON_COPY_PROPS.has(p.path.split(".").pop() ?? "") &&
          !p.path.split(/[.[]/).some((seg) => NON_COPY_PROPS.has(seg)),
      );

      const report = leaked.map(
        (l) => `${l.path} = ${JSON.stringify(l.value.slice(0, 60))}`,
      );

      if (KNOWN_GAPS.has(component)) {
        // Recorded gap: still expected to leak. If this fires, the gap was
        // closed - remove the component from KNOWN_GAPS.
        expect(
          report,
          `${component} no longer leaks demo content - remove it from KNOWN_GAPS`,
        ).not.toEqual([]);
        return;
      }

      expect(report).toEqual([]);
    });
  }
});
