import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { sectionLibraryV3Content } from "@/content/section-library-v3";
import pageTemplates from "@/content/page-templates.json";
import { renderPageTemplateSection } from "@/components/sections/PageTemplatePreview";
import {
  getTemplateCopyFieldsForSection,
  isSiteChromeSection,
} from "@/utils/template-copy-contract";
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

/**
 * Props that are legitimately library-owned, so matching demo content in them
 * is not a leak.
 *
 * This replaced a 25-character floor on what counted as demo content. The floor
 * was a proxy for "long enough to be prose", and it silently exempted every
 * short string: eyebrows, stat values, button labels, and - the case that
 * exposed it - five of the financing calculator's six result labels, while the
 * sixth was one character over and failed. Short strings are exactly where
 * client-specific facts live, so the rule is now structural rather than
 * length-based.
 */

// Link targets, resolved from site navigation and passed explicitly by the
// render switch rather than written as copy.
const LINK_PROPS = new Set([
  "primaryActionHref",
  "secondaryActionHref",
  "sectionAction",
  "action",
  "href",
  "customerActionHref",
  "successActionHref",
]);

// Layout and enum tokens. These are design configuration the section library
// legitimately owns - a card is "large", a split is "text-3-image-4-right" -
// and no copy field should ever supply them.
const CONFIG_PROPS = new Set([
  "align",
  "cardBorder",
  "cardFill",
  "cardSize",
  "colorRecipe",
  "contentAlignX",
  "contentAlignY",
  "headingSize",
  "headlineWrap",
  "icons",
  "objectPosition",
  "position",
  "ratio",
  "requestType",
  "size",
  "systemType",
  "variant",
  // The builder's own ratio picker metadata, stored on the library entry.
  "variants",
]);

function isIgnoredPropPath(propPath: string) {
  return propPath
    .split(/[.[]/)
    .map((segment) => segment.replace(/\]$/, ""))
    .some((segment) => LINK_PROPS.has(segment) || CONFIG_PROPS.has(segment));
}

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
/**
 * Repopulated on 2026-08-04, when the 25-character floor was replaced by the
 * structural rule above. The list had been swept to empty twice, but both
 * sweeps were measured with the floor in place - so "empty" only ever meant no
 * section leaked a string of 25 characters or more.
 *
 * Removing the floor surfaced 24 sections. None of these are new regressions;
 * they are pre-existing leaks the guard was never able to see. They fall into
 * three groups, listed separately because they do not have the same fix:
 */
const KNOWN_GAPS = new Set<string>([
  // 1. Client-specific facts - closed 2026-08-04. These were the serious ones:
  //    not generic filler but wrong information about a real business. The
  //    contact section published "(555) 014-2250" and
  //    "hello@examplelocal.com", the ZIP lookup advertised coverage of
  //    Huntersville and Cornelius, and the fullscreen hero claimed a 4.9
  //    rating and 2,400+ completed visits. All three now come from sourced
  //    copy fields that say NEEDS REVIEW rather than carrying an example over.

  // 2. Unspecced eyebrows - closed 2026-08-04 for the seven whose branch simply
  //    had no eyebrow field. The remaining three leak a PER-CARD eyebrow rather
  //    than the section's own, which their branch does declare; those need
  //    indexed sub-fields like the card carousel, so they sit in group 3 below.
  //    The four per-card cases were closed on 2026-08-04 with indexed
  //    sub-fields, following the card carousel.

  // 3. Labels needing a chrome-or-copy decision - closed 2026-08-04. Image and
  //    icon placeholder labels, and the callout's close-button aria-label, are
  //    chrome and default in their components. Action labels, the split
  //    headline's second line, and the financing promotional term are copy and
  //    are now declared fields.
]);

function collectDemoStrings(value: unknown, out: Set<string>) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    // Routes and anchors only - no length floor. Everything else is compared
    // structurally, by which prop it landed in.
    if (trimmed && !trimmed.startsWith("/") && !trimmed.startsWith("#")) {
      out.add(trimmed);
    }
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

  // Nav and footer resolve their business name, phone, link lists and service
  // areas from siteIdentity, which this guard deliberately does not supply.
  // Their fallback to library values is an artifact of that, not a copy leak -
  // and isSiteChromeSection is the same test the copy prompt uses to skip them.
  if (isSiteChromeSection(entry)) return;

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
        (p) => allDemoStrings.has(p.value) && !isIgnoredPropPath(p.path),
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
