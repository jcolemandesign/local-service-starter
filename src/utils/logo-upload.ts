import { createHash } from "node:crypto";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import type { SiteIdentityLogoSlot } from "@/content/site-identity";

/**
 * Storing an uploaded logo under `public/`.
 *
 * This is the first thing in the project that writes bytes it did not author,
 * so the validation here is the whole security boundary rather than a
 * formality. Everything else that touches `logoSrc` assumes the file is what
 * it claims to be.
 *
 * WHY THE FILENAME IS CONTENT-HASHED. Replacing a logo at a fixed path serves
 * the old mark from the browser cache and from `next/image`'s cache, which
 * reads as the upload having silently failed - the one failure mode an upload
 * button must not have. A new hash is a new URL, so a replacement is visible
 * immediately. The previous file is deleted on replace, so hashing does not
 * turn into a pile of dead logos.
 */

/**
 * What may be uploaded.
 *
 * SVG is on the list because it is the format a logo actually arrives in, and
 * it is the reason `SiteIdentity.logoSrc` documents that logos render through
 * `next/image` and are never inlined: an inlined SVG executes any script it
 * carries, and these files end up on client sites. Rendering as an image does
 * not execute it. That mitigation is what makes SVG acceptable here - if a
 * consumer ever inlines one, this allowlist has to be revisited with it.
 */
const allowedTypes = new Map<string, string>([
  ["image/svg+xml", "svg"],
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);

/** Generous for a logo and small enough that a mis-picked photo is caught
 *  here rather than committed into the repo. */
export const MAX_LOGO_BYTES = 2 * 1024 * 1024;

/**
 * ONE DIRECTORY, THREE SLOTS, AND THE SWEEP BELOW IS WHY THIS TABLE EXISTS.
 *
 * Every client's marks live in the same folder, and replacing one deletes the
 * files it supersedes. With a single `logo-` prefix for all three, uploading an
 * icon would have swept away the wordmark and the footer mark on its way in -
 * silently, since the identity record would still point at paths whose files
 * had just been removed.
 *
 * The primary keeps the bare `logo-` prefix so marks uploaded before the slots
 * existed are still recognised as its own and still get cleaned up.
 */
const slotPrefixes: Record<SiteIdentityLogoSlot, string> = {
  footer: "logo-footer-",
  icon: "logo-icon-",
  primary: "logo-",
};

export type LogoUploadResult =
  | { ok: true; logoSrc: string }
  | { ok: false; error: string };

/** Public directory a client's uploaded assets live in. Kept out of the
 *  hand-authored `public/images` tree so an upload can never overwrite a
 *  designed asset, and so the whole folder is disposable per client. */
function clientAssetDir(clientSlug: string) {
  return path.join(process.cwd(), "public", "clients", clientSlug);
}

export function isAllowedLogoType(type: string) {
  return allowedTypes.has(type);
}

export function logoExtensionFor(type: string) {
  return allowedTypes.get(type);
}

function hasPrefix(bytes: Uint8Array, prefix: number[]) {
  return prefix.every((byte, index) => bytes[index] === byte);
}

/** MIME types come from the browser and can be spoofed, so verify the small
 * signature each supported format carries before writing it under `public/`. */
export function hasValidLogoBytes(type: string, bytes: ArrayBuffer) {
  const view = new Uint8Array(bytes);

  switch (type) {
    case "image/png":
      return hasPrefix(view, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/jpeg":
      return hasPrefix(view, [0xff, 0xd8, 0xff]);
    case "image/webp":
      return (
        hasPrefix(view, [0x52, 0x49, 0x46, 0x46]) &&
        String.fromCharCode(...view.slice(8, 12)) === "WEBP"
      );
    case "image/svg+xml": {
      const source = new TextDecoder().decode(view).replace(/^\uFEFF/, "").trimStart();
      return /^(?:<\?xml[^>]*>\s*)?<svg\b/i.test(source);
    }
    default:
      return false;
  }
}

/**
 * Write the upload and return the path to store in `logoSrc`.
 *
 * The old logo is removed AFTER the new one is written, not before: if the
 * write fails the client keeps the mark it had, where deleting first would
 * leave a failed upload with no logo at all.
 */
export async function storeClientLogo({
  bytes,
  clientSlug,
  slot = "primary",
  type,
}: {
  bytes: ArrayBuffer;
  clientSlug: string;
  slot?: SiteIdentityLogoSlot;
  type: string;
}): Promise<LogoUploadResult> {
  const extension = logoExtensionFor(type);

  if (!extension) {
    return {
      error: `Unsupported file type ${type || "(none)"}. Use SVG, PNG, JPEG or WebP.`,
      ok: false,
    };
  }

  if (bytes.byteLength === 0) {
    return { error: "That file is empty.", ok: false };
  }

  if (bytes.byteLength > MAX_LOGO_BYTES) {
    return {
      error: `That file is ${(bytes.byteLength / 1024 / 1024).toFixed(1)}MB. The limit is ${MAX_LOGO_BYTES / 1024 / 1024}MB.`,
      ok: false,
    };
  }

  if (!hasValidLogoBytes(type, bytes)) {
    return {
      error: "The file contents do not match the selected image type.",
      ok: false,
    };
  }

  const buffer = Buffer.from(bytes);
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 12);
  const fileName = `${slotPrefixes[slot]}${hash}.${extension}`;
  const directory = clientAssetDir(clientSlug);

  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, fileName), buffer);

  await removeSupersededLogos(clientSlug, slot, fileName);

  return { logoSrc: `/clients/${clientSlug}/${fileName}`, ok: true };
}

/**
 * Clear out the logo this one replaces.
 *
 * Sweeps the client's own directory rather than deleting the path the identity
 * file happens to point at, because that only knows about the logo currently
 * recorded - an upload whose identity write then failed would otherwise leave
 * a file nothing references and nothing ever removes.
 *
 * Scoped to this client's folder, to THIS SLOT'S prefix, and to the extensions
 * on the allowlist. It can only delete files it wrote for the slot being
 * replaced.
 *
 * Matched on a full-filename pattern rather than `startsWith`, because the
 * primary's prefix is a prefix of the other two: `logo-` starts `logo-icon-abc.svg`
 * as surely as it starts its own files, and a prefix test would have made
 * replacing the wordmark delete the icon and the footer mark with it.
 */
function supersededPattern(slot: SiteIdentityLogoSlot) {
  return new RegExp(
    `^${slotPrefixes[slot]}[0-9a-f]{12}\\.(?:${[...allowedTypes.values()].join("|")})$`,
  );
}

async function removeSupersededLogos(
  clientSlug: string,
  slot: SiteIdentityLogoSlot,
  keepFileName: string,
) {
  const directory = clientAssetDir(clientSlug);
  const pattern = supersededPattern(slot);

  try {
    const entries = await readdir(directory);

    await Promise.all(
      entries
        .filter((entry) => entry !== keepFileName && pattern.test(entry))
        .map((entry) => rm(path.join(directory, entry), { force: true })),
    );
  } catch {
    // A missing directory means nothing to clean up. Never fatal: the new
    // logo is already written, and throwing here would report a successful
    // upload as a failure.
  }
}
