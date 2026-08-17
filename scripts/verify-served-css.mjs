/**
 * Does the running dev server actually serve the stylesheet we wrote?
 *
 * WHY THIS EXISTS. `globals.css` is not decoration in this project - the colour
 * recipes and all five motion suites are custom properties and gated selectors
 * living in that one file. So "the rule is not in the bundle" and "the rule is
 * wrong" produce the identical symptom: a control that appears to work and
 * paints nothing. The first is a server problem and the second is a code
 * problem, and guessing wrong costs an afternoon of rewriting correct CSS.
 *
 * It catches two different failures, which is the point of checking the SERVED
 * sheet rather than the source:
 *
 *   1. A STALE SERVER. Turbopack's dev filesystem cache can hand back an
 *      artifact that no longer matches the source, without erroring. Disabled in
 *      `next.config.ts` now, and this is the check that says whether that
 *      worked - and the one that still works if the cause turns out to be
 *      something else.
 *   2. A RULE THE COMPILER DROPPED. An unparseable value drops its declaration,
 *      and a rule emptied that way is pruned entirely. A gradient stop built
 *      with `color-mix()` did exactly that once, which is why
 *      `css-gradient-color-mix.test.ts` exists. That rule is perfect in the
 *      source and absent from the browser.
 *
 * WHAT IT CANNOT TELL YOU. It checks that a fingerprint is PRESENT, not that
 * the rule around it still says what it said. A selector whose body changed
 * passes. This is a staleness check, not a diff - the tests are what pin
 * behaviour, and `animation-css-agreement.test.ts` reads the source directly.
 *
 * Usage:
 *   npm run css:verify                      # http://localhost:3000/
 *   npm run css:verify -- http://localhost:3001/sections
 */

import { readFileSync } from "node:fs";
import path from "node:path";

const target = process.argv[2] ?? "http://localhost:3000/";
const source = readFileSync(
  path.join(process.cwd(), "src", "app", "globals.css"),
  "utf8",
).replace(/\r\n?/g, "\n");

/**
 * Quotes and whitespace normalised away on BOTH sides.
 *
 * A minifier is free to write `[data-x=y]` for `[data-x="y"]` and to collapse
 * the line breaks a wrapped selector was written with. Neither is a difference
 * worth reporting, and both would otherwise make every probe a false alarm.
 */
function normalize(css) {
  return css.replace(/["']/g, "").replace(/\s+/g, " ");
}

/**
 * A number written the way the compiler writes it.
 *
 * THE COMPILER REWRITES VALUES IT CONSIDERS EQUIVALENT, and a value check that
 * does not know that reports a mismatch on every run - which is the same as
 * having no check, only louder. Two rewrites are handled, and both were found by
 * this check failing on a stylesheet that was perfectly fresh:
 *
 *   - MILLISECONDS BECOME SECONDS where that is shorter: `620ms` is emitted as
 *     `.62s`. `90ms` is not, because `.09s` is no shorter - so the same
 *     stylesheet uses both units and only some of the tokens appeared to be
 *     missing, which is exactly the shape of a real staleness bug.
 *   - LEADING ZEROS GO: `cubic-bezier(0.22, 1, 0.36, 1)` is emitted as
 *     `cubic-bezier(.22,1,.36,1)`.
 *
 * Both sides go through this, so the comparison is between two canonical forms
 * rather than between a source and a guess about the compiler.
 */
function numeric(value) {
  return value
    .replace(/\s+/g, "")
    .replace(/([\d.]+)ms\b/g, (_, ms) => `${Number(ms) / 1000}s`)
    .replace(/(^|[^\w.])0\./g, "$1.")
    .toLowerCase();
}

/**
 * The fingerprints, and the families are chosen rather than exhaustive.
 *
 * NOT every class in the file. Tailwind legitimately tree-shakes a utility
 * nothing uses, so probing all of them would report absences that are correct
 * and train you to ignore the output - which is worse than not checking.
 *
 * These four families are the ones that are always emitted when the file
 * compiles, and they are also exactly where this project's behaviour lives.
 */
function fingerprints(source) {
  const probes = new Map();

  /**
   * COMMENTS ARE STRIPPED FIRST, and this project has learned that lesson three
   * times now - `color-css-agreement` and `animation-marker-ownership` both had
   * to add it. The prose in `globals.css` quotes selectors it is arguing
   * against: the timed-suite contract writes out the generalised waiting rule as
   * an example of what NOT to write, and the retired `.pulse-on-scroll` marker
   * is named in the note explaining its retirement. Read as source, those are
   * three fingerprints that can never be in any bundle - a permanent false
   * alarm, which is the failure mode that gets a check ignored.
   */
  const css = source.replace(/\/\*[\s\S]*?\*\//g, "");

  /** Keyframes are never tree-shaken by name here - a missing one is the file. */
  for (const [, name] of css.matchAll(/@keyframes\s+([\w-]+)/g)) {
    probes.set(`@keyframes ${name}`, "keyframes");
  }

  /**
   * Custom properties declared OUTSIDE `@theme`, only.
   *
   * Tailwind v4 emits a theme variable only if something uses it, so an unused
   * `@theme` token is legitimately absent from the bundle. A `:root` block is
   * passed through untouched, so absence there means the file did not compile.
   */
  const withoutTheme = css.replace(/@theme[^{]*\{[\s\S]*?\n\}/g, "");

  for (const [, name] of withoutTheme.matchAll(/(--[\w-]+):/g)) {
    probes.set(`${name}:`, "custom property");
  }

  /**
   * The motion tokens are checked BY VALUE, not just by presence.
   *
   * Everything else here answers "did the file compile", which is the question
   * that matters when a rule is missing. It is the wrong question during a
   * TUNING session: `--anim-reveal-duration` is present whether it says 620ms or
   * 900ms, so a stale server passes every other probe while the browser quietly
   * keeps playing the old number. That failure looks like "the value I promoted
   * made no difference", which is indistinguishable from "the value makes no
   * difference" - and one of those sends you changing a number that was already
   * right.
   *
   * ONLY `--anim-*`, AND ONLY FROM `:root`. Value comparison is only safe where
   * the compiler does not rewrite the value: these are times, lengths, plain
   * numbers and one cubic-bezier. Colour tokens are deliberately left on
   * presence-only, because `oklch()` and friends legitimately come back
   * reformatted and a check that cries wolf gets ignored.
   */
  // EVERY `:root` block, not the first. There are three in this stylesheet and
  // the motion tokens are in the second - slicing only the first found nothing
  // and reported a clean run, which is the worst possible outcome for a check.
  for (const match of css.matchAll(/^:root\s*\{/gm)) {
    const start = match.index;
    const root = css.slice(start, css.indexOf("\n}", start));

    for (const [, name, value] of root.matchAll(
      /(--anim-[\w-]+):\s*([^;]+);/g,
    )) {
      probes.set(`${name}:${numeric(value)}`, "token value");
    }
  }

  /** The axis attributes - every colour recipe and motion suite is gated on one. */
  for (const [selector] of css.matchAll(/\[data-[\w-]+="[^"]+"\]/g)) {
    probes.set(normalize(selector), "attribute selector");
  }

  /** The marker and role hooks the section library writes into its markup. */
  for (const [selector] of css.matchAll(/\.(?:reveal|pulse)-[\w-]+/g)) {
    probes.set(selector, "marker class");
  }

  return probes;
}

/**
 * Every stylesheet the page links, fetched and concatenated.
 *
 * A FAILED FETCH IS AN ERROR, NOT AN EMPTY SHEET. Treating a 404 as "" is the
 * quiet version of this whole problem: every probe would come back missing and
 * the report would confidently blame a stale server for what is actually a bad
 * URL. If a sheet cannot be read, this says so and stops.
 *
 * The href scan deliberately only accepts things that look like paths. The dev
 * server's HTML also carries the same chunk name inside a JS payload with its
 * slashes mangled, and following that produces a 404 for a stylesheet that was
 * never really linked.
 */
async function servedCss(pageUrl) {
  const page = await fetch(pageUrl);

  if (!page.ok) {
    throw new Error(`${pageUrl} responded ${page.status}`);
  }

  const html = await page.text();
  const hrefs = new Set(
    [...html.matchAll(/["'(]((?:https?:\/\/|\.?\/)[^"'()]*?\.css)/g)].map(
      (match) => match[1],
    ),
  );

  if (hrefs.size === 0) {
    throw new Error(`no stylesheet linked from ${pageUrl}`);
  }

  const sheets = await Promise.all(
    [...hrefs].map(async (href) => {
      const url = new URL(href, pageUrl);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`${url.pathname} responded ${response.status}`);
      }

      return response.text();
    }),
  );

  return { css: sheets.join("\n"), count: hrefs.size };
}

const probes = fingerprints(source);

let served;

try {
  served = await servedCss(target);
} catch (error) {
  console.error(`\n  Could not read the served CSS from ${target}`);
  console.error(`  ${error instanceof Error ? error.message : error}`);
  console.error(`\n  Is the dev server running? \`npm run dev\`\n`);
  process.exit(2);
}

/**
 * Two haystacks, because the two kinds of probe survive different mangling.
 *
 * A selector keeps its spaces and needs them (`@keyframes section-focus` is not
 * `@keyframessection-focus`); a value has to be compared with every space gone,
 * or `620ms` and ` 620ms` disagree. One normalisation cannot serve both, and
 * using the wrong one silently reports every token as missing.
 */
const haystack = normalize(served.css);
const haystackNumeric = numeric(served.css);
const missing = [...probes].filter(([probe, kind]) =>
  kind === "token value"
    ? !haystackNumeric.includes(probe)
    : !haystack.includes(probe),
);

console.log(
  `\n  ${target}\n  ${served.count} stylesheet${served.count === 1 ? "" : "s"}, ${probes.size} fingerprints from globals.css\n`,
);

if (missing.length === 0) {
  console.log(`  OK - the served CSS carries everything the source declares.\n`);
  process.exit(0);
}

console.error(`  MISSING - ${missing.length} of ${probes.size}:\n`);

for (const [probe, kind] of missing) {
  console.error(`    ${kind.padEnd(18)} ${probe}`);
}

console.error(
  `
  Two things this can be, and they need opposite responses:

    STALE SERVER - the source is right and the bundle is old.
      Restart with \`npm run dev:fresh\`, which clears .next first. A plain
      restart is not enough if the on-disk cache is what went wrong.

    DROPPED RULE - the compiler discarded it. An unparseable value drops its
      declaration and an emptied rule is pruned. Check the value, not the
      server; \`css-gradient-color-mix.test.ts\` documents one that did this.

  Restart first: it is the cheaper test, and a stale server makes everything
  else unmeasurable.
`,
);
process.exit(1);
