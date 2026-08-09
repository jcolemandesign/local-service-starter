import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  coldStartTokens,
  tokensFromLookup,
} from "@/content/color-palette-source";
import {
  parsePromotedTokens,
  readPromotedPalette,
} from "@/utils/promoted-palette";

const globalsCss = readFileSync(
  path.join(process.cwd(), "src", "app", "globals.css"),
  "utf8",
);

describe("cold-start defaults still match the stylesheet", () => {
  /**
   * `coldStartTokens` is a hand copy of the `@theme inline` fallbacks, because
   * those are written inline inside `var()` calls and there is nothing to
   * import. A copy that drifts is worse than no copy: a fresh clone would
   * render one palette while the stylesheet declared another, and every test
   * would stay green.
   */
  const fallbacks: [keyof typeof coldStartTokens, string][] = [
    ["bgPage", "--live-bg-page"],
    ["serviceSurface", "--live-service-surface"],
    ["surfaceRaised", "--live-surface-raised"],
    ["serviceInk", "--live-service-ink"],
    ["bgDark", "--live-bg-dark"],
    ["serviceAccent", "--live-service-accent"],
    ["accent", "--live-accent"],
  ];

  for (const [key, token] of fallbacks) {
    it(`${key} matches the ${token} fallback`, () => {
      // The first `var(--token, #hex)` in the file is the @theme inline row.
      const match = globalsCss.match(
        new RegExp(`var\\(\\s*${token}\\s*,\\s*(#[0-9a-f]{6})`, "i"),
      );

      expect(match, `no inline fallback found for ${token}`).not.toBeNull();
      expect(coldStartTokens[key]).toBe(match?.[1].toLowerCase());
    });
  }
});

describe("parsing the promoted block", () => {
  it("reads the palette the stylesheet is actually painting from", () => {
    const tokens = parsePromotedTokens(globalsCss);

    // Whatever is promoted right now, the parse has to agree with the file
    // rather than with the cold-start copy - otherwise the reader is a
    // constant wearing a parser's clothes.
    const promoted = globalsCss
      .slice(globalsCss.indexOf("/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */"))
      .match(/--live-bg-page:\s*(#[0-9a-f]{6})/i);

    if (promoted) expect(tokens.bgPage).toBe(promoted[1].toLowerCase());
  });

  it("falls back to cold start when there is no promoted block", () => {
    // A fresh clone of the starter has none, and every section still renders.
    expect(parsePromotedTokens(":root { --live-bg-page: #123456; }")).toEqual(
      coldStartTokens,
    );
  });

  it("keeps the two optional swatches undefined when unset", () => {
    /**
     * The load-bearing case. `darkSurface` unset means "derive it from dark",
     * and `ctaAccent` unset is what hides the Accent recipe. Defaulting either
     * to a colour turns an authoring choice into a value, and the symptom is a
     * recipe appearing in the picker that the palette never authorised.
     */
    const tokens = parsePromotedTokens(
      [
        "/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */",
        ":root { --live-bg-page: #111111; }",
        "/* END PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */",
      ].join("\n"),
    );

    expect(tokens.bgPage).toBe("#111111");
    expect(tokens.bgDarkSurface).toBeUndefined();
    expect(tokens.ctaAccent).toBeUndefined();
  });

  it("treats a non-hex value as unset rather than passing it on", () => {
    /**
     * Several promoted rows are `oklch(from ...)` or `color-mix()`
     * expressions. The scales work on RGB triples and cannot consume those, so
     * an unparseable value has to fall back here rather than fail somewhere
     * further from its cause.
     */
    const tokens = parsePromotedTokens(
      [
        "/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */",
        ":root {",
        "  --live-bg-page: oklch(from var(--x) calc(l - 0.3) c h);",
        "  --live-bg-dark-surface: color-mix(in oklab, #fff 12%, #000);",
        "}",
        "/* END PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */",
      ].join("\n"),
    );

    expect(tokens.bgPage).toBe(coldStartTokens.bgPage);
    expect(tokens.bgDarkSurface).toBeUndefined();
  });
});

describe("the two readers cannot drift", () => {
  /**
   * There are two ways into the palette and they cannot share a reader: the
   * server parses `globals.css` off disk, the builder reads the live custom
   * properties out of the DOM. If they disagree about which property feeds a
   * swatch, the same section renders one card polarity in the preview and
   * another on the page - the hardest class of bug this system can produce,
   * because both halves look right in isolation.
   *
   * `tokensFromLookup` is the shared half. This asserts the file parser
   * actually routes through it rather than having grown its own copy of the
   * mapping.
   */
  it("agrees with a lookup-based reader on the same declarations", () => {
    const declarations = {
      "--live-bg-page": "#111111",
      "--live-service-surface": "#222222",
      "--live-surface-raised": "#333333",
      "--live-service-ink": "#444444",
      "--live-bg-dark": "#555555",
      "--live-service-accent": "#666666",
      "--live-accent": "#777777",
      "--live-bg-dark-surface": "#888888",
    };

    const fromCss = parsePromotedTokens(
      [
        "/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */",
        ":root {",
        ...Object.entries(declarations).map(
          ([name, value]) => `  ${name}: ${value};`,
        ),
        "}",
        "/* END PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */",
      ].join("\n"),
    );

    const fromLookup = tokensFromLookup(
      (cssVariable) =>
        declarations[cssVariable as keyof typeof declarations] ?? undefined,
    );

    expect(fromCss).toEqual(fromLookup);
  });

  it("keeps the filesystem reader out of client bundles", () => {
    /**
     * `promoted-palette.ts` imports `node:fs`. Anything a `"use client"`
     * module can REACH is bundled for the browser, and Turbopack fails the
     * whole build with "the chunking context does not support external
     * modules" - a message several layers away from the import that caused it.
     *
     * This has to walk the graph, not just check direct imports, because the
     * time it actually happened the chain was three deep:
     * `StrategyWorkspaceSection` (client) -> `StagedPageCanvas` ->
     * `PageTemplatePreview` -> here. A direct-import check would have passed
     * and the build would still have failed.
     *
     * The rule the walk enforces: client surfaces take the palette as a prop,
     * or read it through `use-promoted-palette`.
     */
    const walk = (directory: string, found: string[] = []) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const full = path.join(directory, entry.name);

        if (entry.isDirectory()) walk(full, found);
        else if (/\.tsx?$/.test(entry.name)) found.push(full);
      }

      return found;
    };

    const sources = new Map<string, string>(
      walk("src").map((file) => [
        file.replaceAll("\\", "/"),
        readFileSync(file, "utf8"),
      ]),
    );

    /** `@/x/y` -> the file it resolves to, trying each real extension. */
    const resolve = (specifier: string) => {
      const base = specifier.replace(/^@\//, "src/");

      return [".ts", ".tsx", "/index.ts", "/index.tsx"]
        .map((suffix) => `${base}${suffix}`)
        .find((candidate) => sources.has(candidate));
    };

    /**
     * `import type` is skipped: it is erased before bundling, so it cannot
     * pull `node:fs` anywhere. Without this the walk reports
     * `SiteExportControls`, which imports only a type off `site-export` and is
     * perfectly fine - a false positive that would train someone to ignore
     * this test.
     */
    const importsOf = (file: string) =>
      [
        ...(sources.get(file) ?? "").matchAll(
          /^import\s+(type\s+)?[^;]*?from\s+["'](@\/[^"']+)["']/gm,
        ),
      ].flatMap(([, typeOnly, specifier]) =>
        typeOnly ? [] : (resolve(specifier) ?? []),
      );

    const target = "src/utils/promoted-palette.ts";
    const offenders: string[] = [];

    for (const [entry, source] of sources) {
      if (!/^\s*["']use client["']/.test(source)) continue;

      const seen = new Set<string>();
      const queue = [entry];
      let chain: string | undefined;

      while (queue.length > 0 && !chain) {
        const current = queue.shift() as string;

        if (seen.has(current)) continue;
        seen.add(current);

        for (const next of importsOf(current)) {
          if (next === target) chain = `${entry} -> ... -> ${target}`;
          queue.push(next);
        }
      }

      if (chain) offenders.push(chain);
    }

    expect(offenders).toEqual([]);
  });
});

describe("reading the palette", () => {
  it("returns a complete palette with a derived dark surface", () => {
    const palette = readPromotedPalette();

    expect(palette.page).toMatch(/^#[0-9a-f]{6}$/);
    expect(palette.darkSurface).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("is stable across calls", () => {
    expect(readPromotedPalette()).toEqual(readPromotedPalette());
  });
});
