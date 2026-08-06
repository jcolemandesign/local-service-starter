import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { sectionToggleFieldNames } from "@/content/section-style-options";

/**
 * Every field the builder sends must survive the save route.
 *
 * `serializeWorkingSection` (PagebuilderShell) builds the payload and
 * `normalizeSection` (the API route) rebuilds it field by field before it is
 * written to `pagebuilder-options.json`. Because the route constructs a fresh
 * object rather than spreading its input, anything it does not explicitly name
 * is dropped - silently, with no type error, because the client's extra keys
 * are structurally assignable to the saved type.
 *
 * That is not hypothetical. `backgroundTreatment` and `joinAbove` were absent
 * from both sides, and `cardLinks`, `icons` and `headlineWrap` were declared in
 * the saved type but never returned by `normalizeSection`. All five died on
 * save: the canvas repainted from React state, then reverted on reload.
 * `pagebuilder-options.json` contained no occurrence of any of them.
 *
 * Both functions are module-private, so this reads the source the same way
 * `card-style-registry-parity.test.ts` and `pagebuilder-catalog-parity.test.ts`
 * read their hand-kept registries.
 */

const shellPath = path.join(
  process.cwd(),
  "src",
  "components",
  "sections",
  "PagebuilderShell.tsx",
);

const routePath = path.join(
  process.cwd(),
  "src",
  "app",
  "api",
  "pagebuilder-options",
  "route.ts",
);

/**
 * The keys of the object literal a function returns.
 *
 * Both targets have the same shape - `return {` at one indent, keys at the
 * next, closing `};` back at the first - so the block is bounded by that
 * closing brace and top-level keys are the ones at exactly that indent. Nested
 * values (ternaries, `?? false`) span lines but never introduce a key at the
 * outer indent, so they cannot be mistaken for one.
 *
 * Shorthand counts: `normalizeSection` hoists `component` into a local first
 * and returns it bare, so matching only `key:` would report it as dropped.
 *
 * A `...pickSectionToggleFields(section)` spread counts as every name in
 * `sectionToggleFieldNames`, which is what it actually copies. Resolving it
 * against the real exported list rather than a second copy here keeps this
 * honest: shrink that list and these assertions fail, which is the point.
 */
function returnedObjectKeys(source: string, functionName: string) {
  const start = source.indexOf(`function ${functionName}(`);
  expect(start, `${functionName} not found`).toBeGreaterThan(-1);

  const returnStart = source.indexOf("return {", start);
  expect(returnStart, `${functionName} has no returned object`).toBeGreaterThan(
    -1,
  );

  const body = source.slice(returnStart);
  const end = body.indexOf("\n  };");
  expect(end, `${functionName}'s returned object is not closed`).toBeGreaterThan(
    -1,
  );

  const returned = body.slice(0, end);
  const keys = new Set(
    [...returned.matchAll(/^ {4}(\w+)\s*[,:]/gm)].map((match) => match[1]),
  );

  if (returned.includes("...pickSectionToggleFields(")) {
    for (const name of sectionToggleFieldNames) {
      keys.add(name);
    }
  }

  return keys;
}

describe("pagebuilder option save round-trip", () => {
  const serialized = returnedObjectKeys(
    readFileSync(shellPath, "utf8"),
    "serializeWorkingSection",
  );
  const normalized = returnedObjectKeys(
    readFileSync(routePath, "utf8"),
    "normalizeSection",
  );

  it("finds both sides of the round-trip", () => {
    expect(serialized.size).toBeGreaterThan(10);
    expect(normalized.size).toBeGreaterThan(10);
  });

  it("keeps every field the builder sends", () => {
    const dropped = [...serialized]
      .filter((field) => !normalized.has(field))
      .sort();

    expect(
      dropped,
      "the builder sends these but normalizeSection never returns them, so they are silently lost on save",
    ).toEqual([]);
  });

  /**
   * Pinned by name as well as by the subset check above, because the subset
   * check only holds the two functions to each other: deleting a field from
   * *both* sides would keep them in agreement while still losing the control.
   */
  it("persists every paint and layout axis the builder can edit", () => {
    for (const axis of [
      "align",
      "backgroundFill",
      // Both halves of the ground-image framing. Pinned by name for the reason
      // above: the subset check passes trivially while the builder sends
      // neither, which is exactly how a control saves nothing and reverts on
      // the next load.
      "backgroundImageFit",
      "backgroundImageFocus",
      "backgroundTreatment",
      "cardBorder",
      "cardFill",
      "cardLinks",
      "colorRecipe",
      "headlineWrap",
      "icons",
      "joinAbove",
      "ratio",
      "reduceBottomPadding",
      "reduceTopPadding",
      "variant",
    ]) {
      expect(serialized.has(axis), `${axis} is never sent by the builder`).toBe(
        true,
      );
      expect(normalized.has(axis), `${axis} is dropped by the save route`).toBe(
        true,
      );
    }
  });
});
