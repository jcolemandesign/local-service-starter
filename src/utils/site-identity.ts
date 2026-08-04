import { mkdir, readFile, writeFile } from "node:fs/promises";
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
