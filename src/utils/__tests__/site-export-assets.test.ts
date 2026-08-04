import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import staged from "@/content/projects/north-star-hvac/staged-pages.json";

/**
 * Asset values are URL paths, so a filename with a space arrives as
 * `/images/bg-image-sample%201.jpg` while the file on disk is
 * `bg-image-sample 1.jpg`.
 *
 * The export resolved the raw string, found nothing, and skipped the copy in
 * silence. The first real export therefore reported no issues and shipped a
 * page whose two images both 404ed. Absence is an error now, and lookup
 * decodes first.
 *
 * The rules are reimplemented here rather than imported - they are internal to
 * site-export - so this pins the behaviour against the real staged data and
 * the real public folder.
 */

function decodeAssetPath(assetPath: string) {
  const relative = assetPath.slice(1);

  try {
    return decodeURIComponent(relative);
  } catch {
    return relative;
  }
}

function looksLikeAsset(value: string) {
  const clean = value.split(/[?#]/)[0];

  return (
    clean.startsWith("/") &&
    !clean.startsWith("//") &&
    /\.[a-z0-9]{2,5}$/i.test(clean)
  );
}

describe("exported asset resolution", () => {
  it("decodes a percent-encoded filename to the file on disk", () => {
    expect(decodeAssetPath("/images/bg-image-sample%201.jpg")).toBe(
      "images/bg-image-sample 1.jpg",
    );
  });

  it("falls back to the raw path when encoding is malformed", () => {
    // A lone % is not valid encoding; decodeURIComponent throws on it.
    expect(decodeAssetPath("/images/100%.png")).toBe("images/100%.png");
  });

  /**
   * `logoHref` on the nav is "/" and matches the asset key pattern. Once a
   * missing asset became an error rather than a silent skip, a route reported
   * as a missing file and blocked the export.
   */
  it("does not treat a route as an asset", () => {
    expect(looksLikeAsset("/")).toBe(false);
    expect(looksLikeAsset("/financing")).toBe(false);
    expect(looksLikeAsset("/images/photo.jpg")).toBe(true);
  });

  it("resolves every image referenced by the staged pages", () => {
    const publicDir = path.join(process.cwd(), "public");
    const missing: string[] = [];

    for (const page of (staged as { pages?: Array<{ fields?: Array<{ kind: string; value: string }> }> }).pages ?? []) {
      for (const field of page.fields ?? []) {
        if (field.kind !== "image") continue;

        const value = field.value.trim();
        if (!value || !looksLikeAsset(value)) continue;

        if (!existsSync(path.join(publicDir, decodeAssetPath(value)))) {
          missing.push(value);
        }
      }
    }

    expect(missing).toEqual([]);
  });
});
