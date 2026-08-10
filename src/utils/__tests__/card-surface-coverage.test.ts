import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { sectionLibraryV3Registry } from "@/content/section-library-v3";
import { cardStyleComponents } from "@/content/section-style-options";

/**
 * The other direction of the card-control registry.
 *
 * `card-style-registry-parity` pins the set against the components that *read*
 * `cardFill`/`cardBorder`, which catches a section wired to the props but never
 * offered them. It cannot catch the case that actually shipped: a section that
 * draws a card and never took the props at all. Quick page links had bordered,
 * filled link cards and no way to change either, and nothing was wrong enough
 * to fail - the registry, the props and the render paths all agreed there was
 * no card there.
 *
 * So this scans the markup instead. Any library section drawing a rounded box
 * that is also filled or outlined has to offer the pair, or be named below with
 * the reason it does not.
 */

const sectionsDir = path.join(process.cwd(), "src", "components", "sections");
const files = readdirSync(sectionsDir).filter((file) => file.endsWith(".tsx"));

/**
 * Surfaces that are not cards, and why.
 *
 * Each of these draws something the scan cannot tell apart from a card. The
 * distinction is what the box is for: a card holds content and can be flattened
 * into the ground behind it, and these cannot.
 */
const notCardSurfaces = new Map<string, string>([
  [
    "ContentPhotoGalleryCarouselSectionV3",
    "the round previous/next buttons are controls, not a card",
  ],
  [
    "ContentPhotoGalleryLargeCarouselSectionV3",
    "same carousel controls as the standard gallery",
  ],
  [
    "FAQAccordionSectionV3",
    "the outlined box is the expand/collapse chevron chip",
  ],
  [
    "HeroSplitFixedImageSectionV3",
    "the framed box is the image well - its fill is the photograph",
  ],
  [
    "ImageStripSectionV3",
    "image tiles on a matching ground; a fill toggle would paint nothing",
  ],
  [
    "TrustBarSectionV3",
    "shares a file with the bento trust bar, whose cards are its own",
  ],
]);

/** A rounded box that is also filled or outlined, in either order. */
const cardSurface =
  /(?:radius-medium|radius-large|radius-surface|rounded-\[var\(--radius-surface-token\)\])[^"`]*?(?:border border-service-border|bg-service-surface|bg-bg-page|bg-bg-surface)|(?:border border-service-border)[^"`]*?(?:bg-service-surface|bg-bg-page|bg-bg-surface)/;

type Chunk = { body: string; file: string };

const chunks = new Map<string, Chunk>();
const functionsByFile = new Map<string, string[]>();

for (const file of files) {
  const source = readFileSync(path.join(sectionsDir, file), "utf8");
  const names: string[] = [];

  for (const chunk of source.split(/\n(?=(?:export )?(?:async )?function )/)) {
    const name = chunk.match(/^(?:export )?(?:async )?function (\w+)/)?.[1];

    if (name) {
      chunks.set(`${file}::${name}`, { body: chunk, file });
      names.push(name);
    }
  }

  functionsByFile.set(file, names);
}

/**
 * A component's own body plus every local helper it reaches.
 *
 * Attributing a whole file to each of its exports is what made this unusable
 * first time round - the eight-section conversion bundle then reads as eight
 * card sections. Following the calls instead keeps a shared helper such as
 * `LogoPlaceholder` attributed to both sections that render it and to neither
 * of the ones that do not.
 */
function reachableSource(file: string, entry: string) {
  const seen = new Set<string>();
  const queue = [entry];
  let combined = "";

  while (queue.length > 0) {
    const name = queue.shift() as string;

    if (seen.has(name)) {
      continue;
    }

    seen.add(name);

    const chunk = chunks.get(`${file}::${name}`);

    if (!chunk) {
      continue;
    }

    combined += chunk.body;

    for (const candidate of functionsByFile.get(file) ?? []) {
      if (
        !seen.has(candidate) &&
        new RegExp(`<${candidate}[\\s/>]|\\b${candidate}\\(`).test(chunk.body)
      ) {
        queue.push(candidate);
      }
    }
  }

  return combined;
}

function fileFor(component: string) {
  return files.find((file) =>
    readFileSync(path.join(sectionsDir, file), "utf8").includes(
      `export function ${component}`,
    ),
  );
}

describe("card surface coverage", () => {
  it("offers the card controls on every section that draws a card", () => {
    const missing: string[] = [];

    for (const entry of sectionLibraryV3Registry) {
      if (
        cardStyleComponents.has(entry.component) ||
        notCardSurfaces.has(entry.component)
      ) {
        continue;
      }

      const file = fileFor(entry.component);

      if (!file) {
        continue;
      }

      if (cardSurface.test(reachableSource(file, entry.component))) {
        missing.push(entry.component);
      }
    }

    expect(
      missing.sort(),
      "these sections draw a card surface with no fill/border control - add them to cardStyleComponents and wire the props, or record why the surface is not a card in notCardSurfaces",
    ).toEqual([]);
  });

  it("keeps the exception list honest", () => {
    const stale = [...notCardSurfaces.keys()]
      .filter((component) => cardStyleComponents.has(component))
      .sort();

    expect(
      stale,
      "these are listed as not-a-card but now offer the card controls - drop them from notCardSurfaces",
    ).toEqual([]);
  });
});
