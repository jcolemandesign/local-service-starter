import { readdir } from "node:fs/promises";
import path from "node:path";

/**
 * The images a staged page can actually point at.
 *
 * Image fields were plain text inputs, so replacing one meant typing a path
 * from memory - and a typo produced a broken image on a client page with
 * nothing to catch it, since the export only checks that a value is present
 * and not still the library default.
 *
 * Read from `public/images` rather than from a manifest so an asset dropped
 * into the folder is immediately offerable, which is how these arrive.
 */

const imageExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

/**
 * The FPO placeholder is deliberately included. A section can legitimately be
 * put back to it, and hiding it would make the picker disagree with the values
 * the editor actually shows.
 */
export async function getAvailableImageAssets(): Promise<string[]> {
  const imagesDir = path.join(process.cwd(), "public", "images");

  let entries: string[];

  try {
    entries = await readdir(imagesDir);
  } catch {
    // No images folder is a valid state for a fresh project; the picker simply
    // offers nothing and the manual path input still works.
    return [];
  }

  return entries
    .filter((entry) => imageExtensions.has(path.extname(entry).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((entry) => `/images/${encodeURIComponent(entry)}`);
}
