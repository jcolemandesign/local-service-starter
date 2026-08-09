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
 */
const cardTokenPattern =
  /\b(bg-bg-surface|bg-service-surface|bg-surface-raised)\b|recipe-card-context|<Card/;

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
