import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * A SCRIM IS A SHADE, NOT AN INK.
 *
 * This is the third time the same bug has been fixed, which is why it now has a
 * test instead of another comment. The shape never varies: a gradient over a
 * photograph, built from `service-ink` because ink is the darkest thing in the
 * vocabulary and on the default recipe it looks right.
 *
 * `service-ink` is the RECIPE'S headline colour. On the chromatic and dark
 * recipes it resolves to a near-white, so the gradient inverts - and the type
 * over a scrim is hardcoded `text-white`, because making white type legible on
 * a photograph is the only reason a scrim exists. White on white. Every
 * occurrence in the library was this, eight of them, including one four lines
 * below a comment recording the identical fix on the well behind the same
 * photograph.
 *
 * Where there is no type over it the failure is quieter and still real: a
 * vignette built from ink lightens the edge instead of darkening it on a
 * light-ink recipe, so it turns inside out.
 *
 * THE RULE IS ABSOLUTE BECAUSE THE EXCEPTION DOES NOT EXIST. A gradient stop is
 * a background, and `service-ink` is a text colour - a section reaching for it
 * as a background has confused "the dark one" with "the one text is". If a
 * scrim ever genuinely needs to follow the recipe it needs a token meaning "the
 * dark side of this ground", and adding one is the fix rather than an exception
 * here.
 */

const sectionsDir = path.join(process.cwd(), "src", "components", "sections");

/**
 * `from-`, `via-` and `to-` are the gradient stops; nothing else turns a colour
 * into a background by accident.
 *
 * Deliberately not a global regex. `test` on one carries `lastIndex` between
 * calls, so a file would pass because the file before it matched - which is the
 * shape of bug that makes a guard read as working while guarding nothing.
 */
const scrimStop = /\b(?:from|via|to)-service-ink\b/;

const sources = readdirSync(sectionsDir)
  .filter((file) => file.endsWith(".tsx"))
  .map(
    (file) =>
      [file, readFileSync(path.join(sectionsDir, file), "utf8")] as const,
  );

describe("scrims are an absolute dark", () => {
  it("builds no gradient stop from the recipe ink", () => {
    // A read that found nothing would pass trivially, and the file would go on
    // looking like a guard while guarding nothing.
    expect(
      sources.length,
      "no section sources were read at all, so this test is asserting nothing",
    ).toBeGreaterThan(50);

    const offenders = sources
      .filter(([, source]) => scrimStop.test(source))
      .map(([file]) => file);

    expect(
      offenders.sort(),
      "these build a gradient stop from `service-ink`, which is the recipe's headline colour - on every chromatic and dark recipe it resolves near-white and the scrim inverts under the white type it exists to make legible. Use `bg-dark`, which is an absolute.",
    ).toEqual([]);
  });
});
