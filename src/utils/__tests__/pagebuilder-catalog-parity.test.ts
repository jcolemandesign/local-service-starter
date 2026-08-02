import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { sectionLibraryV3Registry } from "@/content/section-library-v3";
import {
  cardLinkComponents,
  cardStyleComponents,
  iconComponents,
} from "@/content/section-style-options";

/**
 * A section reaches pagebuilder through two lists, and neither is the section
 * library:
 *
 * - `sectionSwapOptions` in `PagebuilderShell` is what the builder offers
 * - `previewCatalog` in `PagebuilderSection` is what the gallery renders
 *
 * Missing from either is silent. The section still exists in the library, on
 * `/sections`, in the renderer, and in the copy contract - it simply cannot be
 * chosen, or it can be chosen and shows nothing. Lint, typecheck and every
 * other test pass either way, which is how the Info strip shipped registered
 * everywhere except where a section is actually picked.
 *
 * Both lists are read from source rather than imported: `sectionSwapOptions` is
 * module-private and `previewCatalog` is built inside a component body, so
 * neither is reachable at runtime without restructuring the components purely
 * to be testable. The card-style registry test reads source for the same
 * reason.
 */

const sectionsDir = path.join(process.cwd(), "src", "components", "sections");

/**
 * Slice a balanced bracketed block out of source.
 *
 * Scanning starts at the last character of the matched header rather than at
 * its start: `const sectionSwapOptions: readonly SectionSwapOption[] = [`
 * contains a `[]` in its type annotation, and starting from the match index
 * would balance on that empty pair and return a block with no entries in it -
 * a test that reads as passing while checking nothing.
 */
function balancedBlock(source: string, header: RegExp, open: string, close: string) {
  const match = header.exec(source);

  if (!match) {
    throw new Error(`could not find ${header} - the declaration was renamed`);
  }

  let depth = 0;
  const start = match.index + match[0].length - 1;

  for (let i = start; i < source.length; i += 1) {
    if (source[i] === open) {
      depth += 1;
    } else if (source[i] === close) {
      depth -= 1;

      if (depth === 0) {
        return source.slice(start, i + 1);
      }
    }
  }

  throw new Error(`unbalanced ${open}${close} block`);
}

function read(file: string) {
  return readFileSync(path.join(sectionsDir, file), "utf8");
}

const swapComponents = new Set(
  [
    ...balancedBlock(
      read("PagebuilderShell.tsx"),
      /const sectionSwapOptions[^=]*=\s*\[/,
      "[",
      "]",
    ).matchAll(/component:\s*"(\w+)"/g),
  ].map((match) => match[1]),
);

const previewComponents = new Set(
  [
    ...balancedBlock(
      read("PagebuilderSection.tsx"),
      /const previewCatalog\s*=\s*\{/,
      "{",
      "}",
    ).matchAll(/^ {4}(\w+):/gm),
  ].map((match) => match[1]),
);

/**
 * The two renderer switches. Being in a catalog only gets a section as far as
 * the picker: without a `case` it renders the `UnknownSection` placeholder
 * ("Preview unavailable"), which looks like a broken section rather than a
 * missing registration.
 */
const previewRendererCases = new Set(
  [...read("PagebuilderSection.tsx").matchAll(/case "(\w+)":/g)].map((m) => m[1]),
);

const templateRendererCases = new Set(
  [...read("PageTemplatePreview.tsx").matchAll(/case "(\w+)":/g)].map((m) => m[1]),
);

const registryComponents = sectionLibraryV3Registry.map((entry) => entry.component);

describe("pagebuilder catalog parity", () => {
  it("parses both catalogs", () => {
    expect(swapComponents.size).toBeGreaterThan(40);
    expect(previewComponents.size).toBeGreaterThan(40);
  });

  it("offers every library section in pagebuilder", () => {
    const missing = registryComponents
      .filter((component) => !swapComponents.has(component))
      .sort();

    expect(
      missing,
      "these sections are in the library but pagebuilder never offers them - add them to sectionSwapOptions in PagebuilderShell.tsx",
    ).toEqual([]);
  });

  it("renders a gallery preview for every library section", () => {
    const missing = registryComponents
      .filter((component) => !previewComponents.has(component))
      .sort();

    expect(
      missing,
      "these sections can be chosen but have no preview - add them to previewCatalog in PagebuilderSection.tsx",
    ).toEqual([]);
  });

  it("has a pagebuilder renderer case for every library section", () => {
    const missing = registryComponents
      .filter((component) => !previewRendererCases.has(component))
      .sort();

    expect(
      missing,
      'these sections render the "Preview unavailable" placeholder - add a case to renderPreviewSection in PagebuilderSection.tsx',
    ).toEqual([]);
  });

  it("has a template renderer case for every library section", () => {
    const missing = registryComponents
      .filter((component) => !templateRendererCases.has(component))
      .sort();

    expect(
      missing,
      'these sections render the "Preview unavailable" placeholder on staged pages - add a case to renderPageTemplateSection in PageTemplatePreview.tsx',
    ).toEqual([]);
  });

  /**
   * The builder canvas renders through a ternary chain in `PagebuilderShell`
   * whose final fallback is a `previewCatalog` element - built once, from a
   * synthetic section that carries no toggle values. A section that reads a
   * toggle but has no explicit branch in that chain therefore shows the control
   * in the panel and ignores every change made with it. Nothing else catches
   * that: the set membership is right, the component reads the prop, the
   * control renders, and it still does nothing.
   */
  it("renders every toggle-supporting section explicitly in the builder chain", () => {
    const shellJsx = new Set(
      [...read("PagebuilderShell.tsx").matchAll(/<(\w*Section\w*)\b/g)].map(
        (m) => m[1],
      ),
    );

    const inLibrary = new Set<string>(registryComponents);
    const toggleSupporting = [
      ...new Set([
        ...cardStyleComponents,
        ...iconComponents,
        ...cardLinkComponents,
      ]),
    ].filter((component) => inLibrary.has(component));

    expect(toggleSupporting.length).toBeGreaterThan(20);

    const dead = toggleSupporting
      .filter((component) => !shellJsx.has(component))
      .sort();

    expect(
      dead,
      "these sections support a pagebuilder toggle but fall through to previewCatalog, so the control renders and does nothing - give them a branch in the render chain in PagebuilderShell.tsx that passes getSectionCardFill/getSectionCardBorder/getSectionIcons",
    ).toEqual([]);
  });

  it("offers nothing pagebuilder cannot resolve through the library", () => {
    const known = new Set<string>(registryComponents);
    const unknown = [...swapComponents].filter((c) => !known.has(c)).sort();

    expect(
      unknown,
      "pagebuilder offers these but they are not in the section library - every offered section must resolve through the library registry",
    ).toEqual([]);
  });
});
