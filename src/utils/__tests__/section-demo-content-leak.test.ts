import { readFileSync } from "node:fs";
import path from "node:path";
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
// Swept to empty on 2026-07-25 and held empty on 2026-08-04, when the guard was
// re-pointed from page-templates.json to the full builder catalog and six more
// leaks surfaced in sections it had never checked. Every field a mapper reads is
// now declared by the copy or asset contract, so it comes from batch copy and
// stays editable in the content editor. Anything added here again is a section
// shipping demo content to a real client - close the gap rather than record it.
const KNOWN_GAPS = new Set<string>([]);

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

/**
 * Checked sections come from two places, because neither alone is the set a
 * client can actually receive.
 *
 * `page-templates.json` is what the default templates compose today - real
 * mode and name values, but only about two thirds of the renderable sections.
 * Driving the guard from it alone left the rest unchecked, and four sections
 * were quietly leaking there: two galleries, a reveal offer, and a card
 * carousel shipping the library's own authoring notes.
 *
 * `sectionSwapOptions` is every section the builder offers, so anything a user
 * can pick is covered whether or not a template happens to use it.
 *
 * Entries are keyed by component AND mode/name, not component alone: the copy
 * contract branches on all three, so the same component reached through a
 * different mode can resolve to a different field set. Both are checked.
 */
const sectionsDir = path.join(process.cwd(), "src", "components", "sections");

function balancedBlock(source: string, header: RegExp, open: string, close: string) {
  const match = header.exec(source);

  if (!match) {
    throw new Error(`could not find ${header} - the declaration was renamed`);
  }

  let depth = 0;
  // Start at the last character of the header, not its start: the type
  // annotation contains an empty [] that would balance immediately.
  const start = match.index + match[0].length - 1;

  for (let i = start; i < source.length; i += 1) {
    if (source[i] === open) depth += 1;
    else if (source[i] === close) {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }

  throw new Error(`unbalanced ${open}${close} block`);
}

const checkedSections = new Map<string, Required<TemplateSection>>();

function addSection(section: TemplateSection) {
  if (!section.component) return;

  const entry = {
    component: section.component,
    mode: section.mode ?? "",
    name: section.name ?? "",
  };

  checkedSections.set(
    `${entry.component}|${entry.mode}|${entry.name}`,
    entry,
  );
}

for (const template of (pageTemplates as { templates?: Array<{ sections?: TemplateSection[] }> })
  .templates ?? []) {
  for (const section of template.sections ?? []) addSection(section);
}

// Read from source rather than imported: sectionSwapOptions is module-private,
// the same reason pagebuilder-catalog-parity.test.ts parses it this way.
const swapBlock = balancedBlock(
  readFileSync(path.join(sectionsDir, "PagebuilderShell.tsx"), "utf8"),
  /const sectionSwapOptions[^=]*=\s*\[/,
  "[",
  "]",
);

for (const match of swapBlock.matchAll(
  /component:\s*"(\w+)"[\s\S]*?mode:\s*"([^"]*)"[\s\S]*?name:\s*"([^"]*)"/g,
)) {
  addSection({ component: match[1], mode: match[2], name: match[3] });
}

describe("section demo-content leak guard", () => {
  it("finds live template sections to check", () => {
    expect(checkedSections.size).toBeGreaterThan(0);
  });

  /**
   * Catches the guard silently checking almost nothing if either source stops
   * parsing - a renamed declaration or a reshaped template file would
   * otherwise leave a green suite covering a handful of sections.
   */
  it("covers the whole builder catalog", () => {
    expect(checkedSections.size).toBeGreaterThan(90);
  });

  for (const [key, section] of checkedSections) {
    const { component } = section;

    it(`${key} does not fall back to demo content for specced fields`, () => {
      const contractSection = {
        component,
        mode: section.mode,
        name: section.name,
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

      // The separator matters: many list fields are specced as
      // "Title - Description" and their mappers split on " - ". A bare sentinel
      // filled only the title and left the description falling back to demo
      // content, which read as a leak when the field was in fact wired up.
      const fields: StagedPageField[] = specced.map((field, i) => ({
        id: `test.01-section.${field.name}`,
        kind: field.kind,
        path: `01-section.${field.name}`,
        value: `${SENTINEL}${i}-${field.name} - ${SENTINEL}${i}-${field.name}-detail`,
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
