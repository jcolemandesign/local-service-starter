import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Gradient stops built with `color-mix()` are dropped by the CSS compiler.
 *
 * This cost a section its fade and left no trace anywhere. The obvious way to
 * ease a ramp between a ground token and transparent is
 *
 *   background-image: linear-gradient(
 *     to right,
 *     var(--color-bg-page) 0%,
 *     color-mix(in oklab, var(--color-bg-page) 74%, transparent) 46%,
 *     transparent 100%
 *   );
 *
 * and it compiles to nothing. The declaration is dropped, that leaves the rule
 * empty, the empty rule is pruned, and the class the component asks for never
 * exists - so the element renders with no background and the fade is simply
 * absent. No build error, no console warning, no failing test: the full image
 * split overlap shipped with its fade silently deleted.
 *
 * `color-mix()` is fine everywhere else, including in the custom properties the
 * colour recipes are built from - over three hundred of those survive. It is
 * specifically inside a gradient function that it does not.
 *
 * Use a mask for an eased ramp instead: paint the ground as a flat colour and
 * put the easing in `mask-image` alpha stops, which need only black and
 * transparent. See `.full-image-split-fade-right` in `globals.css`.
 */

const stylesheets = [path.join(process.cwd(), "src", "app", "globals.css")];

/** Any other stylesheet that turns up in `src/app`, so a second one added
 *  later is covered without anyone remembering to list it here. */
for (const file of readdirSync(path.join(process.cwd(), "src", "app"))) {
  const full = path.join(process.cwd(), "src", "app", file);

  if (file.endsWith(".css") && !stylesheets.includes(full)) {
    stylesheets.push(full);
  }
}

/** Gradient calls with their full parenthesised body, so a `color-mix` is
 *  attributed to the gradient it sits inside rather than to the file. */
function gradientsIn(source: string) {
  const found: Array<{ body: string; line: number }> = [];
  const opener = /(?:linear|radial|conic)-gradient\(/g;
  let match: RegExpExecArray | null;

  while ((match = opener.exec(source))) {
    let depth = 1;
    let index = opener.lastIndex;

    while (index < source.length && depth > 0) {
      if (source[index] === "(") {
        depth += 1;
      } else if (source[index] === ")") {
        depth -= 1;
      }

      index += 1;
    }

    found.push({
      body: source.slice(match.index, index),
      line: source.slice(0, match.index).split("\n").length,
    });
  }

  return found;
}

describe("gradient stops", () => {
  it("never build a stop with color-mix", () => {
    const offenders: string[] = [];

    for (const file of stylesheets) {
      const source = readFileSync(file, "utf8");

      for (const gradient of gradientsIn(source)) {
        if (gradient.body.includes("color-mix")) {
          offenders.push(
            `${path.basename(file)}:${gradient.line} ${gradient.body.replace(/\s+/g, " ").slice(0, 100)}`,
          );
        }
      }
    }

    expect(
      offenders,
      "these gradients carry a color-mix stop, which the CSS compiler drops - the declaration disappears, the rule empties, and the class stops existing. Use a mask-image alpha ramp over a flat background instead",
    ).toEqual([]);
  });
});
