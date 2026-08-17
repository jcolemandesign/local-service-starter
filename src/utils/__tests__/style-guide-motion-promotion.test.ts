import { beforeEach, describe, expect, it, vi } from "vitest";

import { defaultStyleGuideTokenDraft } from "@/components/sections/StyleGuideLiveSurface";
import { defaultMotionTokens } from "@/content/motion-tokens";
import { neutralizeBuilderVocabulary } from "@/utils/site-export";

/**
 * PROMOTION, END TO END, FOR THE MOTION HALF.
 *
 * The other tests in this area check the pieces: that the registry and the
 * stylesheet agree, that the two emitters agree, that a slot round-trips. This
 * one drives the actual route and asserts the thing a person would check by
 * hand - a rhythm chosen in the Style Guide ends up in `globals.css`, inside the
 * markers, in a form the export will not mangle.
 *
 * It is the assertion the axis went without. The rhythm controls existed for a
 * whole cycle believing they promoted something, and nothing anywhere would have
 * failed if they never had.
 */

const beginMarker = "/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";
const endMarker = "/* END PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";

const files = { globals: "" };

vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(async () => files.globals),
  writeFile: vi.fn(async (_target: string, contents: string) => {
    files.globals = contents;
  }),
}));

// The route refuses anonymous callers and refuses to run in production. Neither
// is what this test is about, and both need a Supabase client to answer.
vi.mock("@/utils/builder-access", () => ({
  requireBuilderApiAccess: vi.fn(async () => null),
}));

const { POST } = await import("@/app/api/style-guide-tokens/route");

const baseCss = `:root {\n  --anim-duration: 620ms;\n}\n`;

async function promote(motionTokens: Record<string, string>) {
  const response = await POST(
    new Request("http://localhost/api/style-guide-tokens", {
      body: JSON.stringify({
        tokens: { ...defaultStyleGuideTokenDraft, motionTokens },
      }),
      method: "POST",
    }),
  );

  expect(response.status, await responseError(response)).toBe(200);

  return files.globals;
}

async function responseError(response: Response) {
  if (response.status === 200) {
    return "";
  }

  return `promotion failed: ${await response.clone().text()}`;
}

/** What sits between the markers - i.e. what the export freezes and ships. */
function promotedBlock(css: string) {
  const beginIndex = css.indexOf(beginMarker);
  const endIndex = css.indexOf(endMarker);

  return beginIndex < 0 || endIndex < beginIndex
    ? ""
    : css.slice(beginIndex, endIndex + endMarker.length);
}

beforeEach(() => {
  files.globals = baseCss;
});

describe("promoting motion tokens", () => {
  it("writes the authored rhythm into the marker block", async () => {
    const css = await promote({
      ...defaultMotionTokens,
      "--anim-duration": "1400ms",
      "--anim-reveal-distance": "48px",
      "--anim-focus-blur": "24px",
    });
    const block = promotedBlock(css);

    expect(block, "no marker block was written at all").not.toBe("");
    expect(block).toContain("--anim-duration: 1400ms;");
    expect(block).toContain("--anim-reveal-distance: 48px;");
    expect(block).toContain("--anim-focus-blur: 24px;");
  });

  /**
   * The block is appended AFTER the authored `:root`, which is what makes a
   * promoted value win over the shipped default. If it ever landed before,
   * promotion would appear to do nothing - the exact symptom the old gallery
   * produced for a different reason, and one nobody would think to look here for.
   */
  it("puts the promoted value after the authored default", async () => {
    const css = await promote({
      ...defaultMotionTokens,
      "--anim-duration": "1400ms",
    });

    expect(css.indexOf("--anim-duration: 620ms")).toBeLessThan(
      css.indexOf("--anim-duration: 1400ms"),
    );
  });

  it("replaces the previous block rather than stacking another one", async () => {
    await promote({
      ...defaultMotionTokens,
      "--anim-duration": "1400ms",
    });
    const css = await promote({
      ...defaultMotionTokens,
      "--anim-duration": "300ms",
    });

    expect(css.split(beginMarker)).toHaveLength(2);
    expect(css).toContain("--anim-duration: 300ms;");
    expect(css).not.toContain("--anim-duration: 1400ms;");
  });

  /**
   * An unset inheriting token is absent from the file, not present and blank.
   *
   * A blank declaration does not inherit - it makes every `var()` reading it
   * invalid at computed-value time, so the Focus blur would resolve to no
   * duration at all and the entrance would not run. The failure looks like the
   * suite being broken rather than like a promotion bug.
   */
  it("omits a token left to inherit, and writes it once authored", async () => {
    const inheriting = await promotedBlock(
      await promote({ ...defaultMotionTokens, "--anim-focus-duration": "" }),
    );

    expect(inheriting).not.toContain("--anim-focus-duration");

    const authored = promotedBlock(
      await promote({
        ...defaultMotionTokens,
        "--anim-focus-duration": "900ms",
      }),
    );

    expect(authored).toContain("--anim-focus-duration: 900ms;");
  });

  /**
   * A promotion cannot inject a second declaration.
   *
   * The route writes this straight to disk, so a value carrying a `;` or a
   * closing brace would be arbitrary CSS in the site's stylesheet. Bad values
   * snap back to the shipped default rather than failing the whole promotion -
   * one stale key from an old slot should not stop every other token landing.
   */
  it("refuses a value that would close its own declaration", async () => {
    const block = promotedBlock(
      await promote({
        ...defaultMotionTokens,
        "--anim-duration": "620ms; --anim-reveal-distance: 9999px",
      }),
    );

    // Narrowly, the smuggled declaration - `9999px` on its own also matches the
    // legitimate `--radius-round-token`, which is in this block too.
    expect(block).not.toContain("--anim-reveal-distance: 9999px");
    expect(block).toContain("--anim-duration: 620ms;");
    expect(block).toContain("--anim-reveal-distance: 28px;");
  });

  /**
   * THE EXPORT HAND-OFF.
   *
   * An export ships this block verbatim inside the client's own `globals.css`,
   * after running `neutralizeBuilderVocabulary` over the whole file to rename the
   * builder's vocabulary out of the delivered site. That rename is why the
   * colour block's `.pagebuilder-paint-surface` selector still matches
   * post-export - and it is the one transform that could silently rewrite a
   * motion token on the way out.
   *
   * `--anim-*` is not builder vocabulary, so it passes through untouched. Pinned
   * so nobody adds a rename for it, and so a widened rule cannot catch it by
   * accident.
   */
  it("survives the export's vocabulary rename unchanged", async () => {
    const block = promotedBlock(
      await promote({
        ...defaultMotionTokens,
        "--anim-duration": "1400ms",
        "--anim-lateral-media-distance": "80%",
      }),
    );
    const exported = neutralizeBuilderVocabulary(block);

    expect(exported).toContain("--anim-duration: 1400ms;");
    expect(exported).toContain("--anim-lateral-media-distance: 80%;");
  });
});
