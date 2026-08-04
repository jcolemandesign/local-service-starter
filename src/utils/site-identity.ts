import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  emptySiteIdentity,
  sanitizeSiteIdentity,
  type SiteIdentity,
} from "@/content/site-identity";

/**
 * Server-side reader for the per-client site identity. The type and the empty
 * value live in `@/content/site-identity` because this module imports
 * `node:fs` and the render chain reaches a client component.
 *
 * Mirrors the `page-slots.json` arrangement: one small JSON file per client
 * under `src/content/projects/<clientSlug>/`, read at render rather than baked
 * into each staged page - baking it in is what made the business name a
 * fifteen-page edit in the first place.
 */
export function getSiteIdentityPath(clientSlug: string) {
  return path.join(
    process.cwd(),
    "src",
    "content",
    "projects",
    clientSlug,
    "site-identity.json",
  );
}

export function getSiteIdentityOutputPath(clientSlug: string) {
  return `src/content/projects/${clientSlug}/site-identity.json`;
}

/**
 * Missing or unreadable file resolves to empty rather than throwing, so a client
 * with no identity set keeps the previous behaviour exactly and falls through to
 * the section-library default.
 */
export async function readSiteIdentity(
  clientSlug: string,
): Promise<SiteIdentity> {
  if (!clientSlug) {
    return emptySiteIdentity;
  }

  try {
    return sanitizeSiteIdentity(
      JSON.parse(await readFile(getSiteIdentityPath(clientSlug), "utf8")),
    );
  } catch {
    return emptySiteIdentity;
  }
}

/**
 * Whether a sanitised `logoSrc` actually resolves to a file under `public/`.
 *
 * Shape alone is not enough. A mistyped or half-pasted path still starts with
 * `/` and saves cleanly, then renders nothing - and the exporter skips assets it
 * cannot find, so the broken path reaches the client's site as an empty image
 * rather than an error. Checking at save is the only point where someone is
 * around to read the message.
 */
export async function logoFileExists(logoSrc: string) {
  if (!logoSrc) {
    return true;
  }

  try {
    const target = path.join(
      process.cwd(),
      "public",
      ...logoSrc.replace(/^\//, "").split("/"),
    );

    return (await stat(target)).isFile();
  } catch {
    return false;
  }
}

/**
 * Sanitises before writing, so a bad `logoSrc` is rejected at the point it is
 * saved rather than silently ignored later at render.
 */
export async function writeSiteIdentity(
  clientSlug: string,
  identity: unknown,
): Promise<SiteIdentity> {
  if (!clientSlug) {
    throw new Error("Missing client slug.");
  }

  const next = sanitizeSiteIdentity(identity);
  const filePath = getSiteIdentityPath(clientSlug);

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");

  return next;
}
