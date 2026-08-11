import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { CARD_CONTEXT_COVERAGE } from "@/utils/color-gate";

/**
 * How much of the site actually establishes a card colour context.
 *
 * The gate reports this number so nobody reads the card contrast figures as
 * global truth. A hardcoded count would go stale the first time a section was
 * added, and a stale count is worse than none - the report would overstate its
 * own scope, which is the specific way a gate stops being trustworthy.
 *
 * So this counts the real thing and fails when the constant drifts from it.
 */

const sectionsDir = path.join(
  process.cwd(),
  "src",
  "components",
  "sections",
);

const sectionFiles = readdirSync(sectionsDir).filter((f) => f.endsWith(".tsx"));

const sources = new Map(
  sectionFiles.map((file) => [
    file,
    readFileSync(path.join(sectionsDir, file), "utf8"),
  ]),
);

/**
 * Sections whose cards the context selector reaches.
 *
 * Matches what the CSS actually keys on - an element painting one of the card
 * tokens - plus the Card primitive, which paints `bg-bg-surface` and so is
 * covered by the same rule. Sections carrying the class explicitly are counted
 * too; the class remains a valid opt-in for a card painted some other way.
 *
 * `bg-bg-page` is deliberately not in this list, mirroring the CSS: it
 * resolves to the ground, so an element carrying it is ground-coloured and is
 * not a card.
 *
 * THE `(?!\/)` IS THE WHOLE POINT OF THE LOOKAHEAD. An opacity modifier makes a
 * DIFFERENT class - Tailwind emits `.bg-bg-surface\/92`, which
 * `.bg-bg-surface` does not match - so a softened fill is invisible to the
 * token-keyed rule. Without the lookahead this counter read `bg-bg-surface/92`
 * as covered and inflated the figure with exactly the sections the selector
 * cannot reach, which is the one way this count could lie while looking right.
 */
const cardTokenPattern =
  /\b(bg-bg-surface|bg-service-surface|bg-surface-raised)\b(?!\/)|recipe-card-context|<Card/;

const covered = sectionFiles.filter((file) =>
  cardTokenPattern.test(sources.get(file) ?? ""),
);

describe("card context coverage", () => {
  it("matches the figure the gate reports", () => {
    expect(
      covered.length,
      `The gate claims ${CARD_CONTEXT_COVERAGE.covered} sections establish a card colour context, but ${covered.length} do. Update CARD_CONTEXT_COVERAGE — the gate's report states this number, and overstating it makes the card contrast figures read as more general than they are.`,
    ).toBe(CARD_CONTEXT_COVERAGE.covered);
  });

  it("is honest that coverage is partial", () => {
    // If this ever fails because coverage reached the total, the gate should
    // stop qualifying its card figures at all - and this test should be
    // replaced by one asserting full coverage.
    expect(CARD_CONTEXT_COVERAGE.covered).toBeLessThan(
      CARD_CONTEXT_COVERAGE.total,
    );
  });
});

describe("the class is applied to a card, not a section", () => {
  /**
   * The context re-points the colour ground to `--recipe-card`. Putting it on
   * an element that is not a card - a section wrapper, a form input - would
   * resolve the whole subtree against a surface it does not paint, which is
   * exactly the failure a blind `bg-bg-surface` sweep would have caused.
   */
  it("never lands on a top-level section element", () => {
    for (const [file, source] of sources) {
      const onSection = source.match(
        /<section[^>]*className=\{?["'`][^"'`]*recipe-card-context/,
      );

      expect(onSection, `${file} puts the card context on a <section>`).toBe(
        null,
      );
    }
  });
});

/**
 * The other half of coverage: a card whose FILL the selector cannot key on.
 *
 * The count above asks how many sections establish a card context. It cannot
 * ask whether the ones that do not are cards, and that is where this system
 * went wrong quietly: a rounded, filled box painted `bg-bg-page` looks like a
 * card in the cold-start palette, because page (#fbfaf6) happens to sit a
 * shade off surface (#f4f7f3). Under a recipe `--live-bg-page` IS
 * `--recipe-ground`, so the card resolves to precisely the colour of the
 * section behind it and its text resolves against the wrong ground. Nothing
 * failed - the fill toggle was wired, the registry agreed there was a card,
 * and the default palette hid it.
 *
 * So this scans for the three fills a card can carry that the token-keyed rule
 * provably cannot reach, and requires the explicit opt-in where one is
 * deliberate.
 */
const libraryComponents = (() => {
  const source = readFileSync(
    path.join(process.cwd(), "src", "content", "section-library-v3.ts"),
    "utf8",
  );
  const map = source.slice(
    source.indexOf("sectionLibraryV3ComponentBySlug = {"),
  );

  return new Set([...map.matchAll(/"[^"]+":\s*"(\w+)"/g)].map((m) => m[1]));
})();

/** Files holding at least one section a recipe can paint. */
const libraryFiles = [...sources]
  .filter(([, source]) =>
    [...source.matchAll(/export function (\w+)/g)].some((m) =>
      libraryComponents.has(m[1]),
    ),
  )
  .map(([file]) => file);

/** A card-sized radius. Buttons and pills use `radius-button`/`rounded-full`
 *  and are controls, not cards, so they are out of scope by construction. */
const cardRadius =
  /\b(radius-medium|radius-large|radius-surface|rounded-\[var\(--radius-surface-token\)\]|rounded-surface)\b/;

/**
 * Fills a rounded box must not carry.
 *
 *   - `bg-bg-page` is the ground token. A card is never its own ground.
 *   - an opacity-modified card token is a different class, so the rule misses
 *     it. Keep the softening and add `recipe-card-context` if it is load-bearing.
 *   - `bg-white` is a literal. It moves with no palette and no recipe.
 */
const unreachableFill =
  /\bbg-bg-page\b|\bbg-(?:service-surface|bg-surface|surface-raised)\/\d+|\bbg-white\b(?!\/)/;

const classString = /["'`]([^"'`\n]{4,400})["'`]/g;

describe("a card's fill is reachable by the card context", () => {
  it("never paints a rounded box with a fill the selector cannot key on", () => {
    const offenders: string[] = [];

    for (const file of libraryFiles) {
      const source = sources.get(file) ?? "";

      for (const [index, line] of source.split("\n").entries()) {
        for (const match of line.matchAll(classString)) {
          const classes = match[1];

          if (!cardRadius.test(classes) || !unreachableFill.test(classes)) {
            continue;
          }

          // The documented escape hatch, for a card painted some way the token
          // rule cannot see - a backdrop blur over a photograph, say.
          if (classes.includes("recipe-card-context")) {
            continue;
          }

          offenders.push(`${file}:${index + 1}`);
        }
      }
    }

    expect(
      offenders.sort(),
      "these paint a card-sized rounded box with a fill the card context cannot reach - use an unmodified card token (bg-surface-raised is the elevated one, for a card that has to read above a surface ground), or keep the fill and add recipe-card-context",
    ).toEqual([]);
  });
});

/**
 * Ink is a TEXT token. It is not a dark surface.
 *
 * The recipe table sets `--live-service-ink: var(--text-strong)`, so inside a
 * recipe `bg-service-ink` is the headline colour - and `--recipe-text` is white
 * on the ink, dark, darkSurface, brand and accent recipes. Every inverted panel
 * painted this way therefore turned WHITE under exactly the recipes it was
 * meant for, taking its own `text-white` copy with it. Scrims over photographs
 * were worse than invisible: the darkening layer lightened instead.
 *
 * `--live-bg-dark` and `--live-bg-dark-surface` are the dark surfaces, and the
 * recipe table deliberately does not remap either - a panel that must stay dark
 * regardless of the recipe painting around it needs a colour that does not move.
 *
 * A MARK IS NOT A FILL. `bg-service-ink` on a hairline rule or a decorative dot
 * is right, and resolving it to the headline colour is what you want there: the
 * mark tracks the text it belongs to. So this checks fills with content or
 * area - anything the copy inside has to survive - and the two known marks are
 * named below.
 */
const inkAsFill = /\bbg-service-ink\b(?!\/)/;

/** Marks, not surfaces: these want to track the headline colour. */
const inkMarks = new Map<string, string>([
  [
    "ContentRuleHeaderSectionV2.tsx",
    "the scroll rule is a hairline mark, and tracking the headline colour keeps it visible on every ground",
  ],
  [
    "ServiceAreaZipLookupSectionV3.tsx",
    "an aria-hidden decorative dot on the FPO map card, holding no copy",
  ],
]);

describe("ink is never used as a surface fill", () => {
  it("paints dark panels with a dark surface token, not the ink text token", () => {
    const offenders: string[] = [];

    for (const file of libraryFiles) {
      if (inkMarks.has(file)) {
        continue;
      }

      const source = sources.get(file) ?? "";

      for (const [index, line] of source.split("\n").entries()) {
        // Comments in these files name the token to explain why it is wrong.
        if (/^\s*(\/\/|\*|\{\/\*)/.test(line)) {
          continue;
        }

        if (inkAsFill.test(line)) {
          offenders.push(`${file}:${index + 1}`);
        }
      }
    }

    expect(
      offenders.sort(),
      "these use bg-service-ink as a fill - inside a recipe that resolves to the headline colour, which is white on every dark recipe. Use bg-bg-dark (or bg-bg-dark-surface), which no recipe remaps. If the element is a hairline or a decorative mark rather than a surface, add it to inkMarks with the reason",
    ).toEqual([]);
  });

  it("keeps the mark list honest", () => {
    const stale = [...inkMarks.keys()].filter(
      (file) => !inkAsFill.test(sources.get(file) ?? ""),
    );

    expect(
      stale.sort(),
      "these are listed as ink marks but no longer paint bg-service-ink - drop them from inkMarks",
    ).toEqual([]);
  });
});
