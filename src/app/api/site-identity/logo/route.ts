import { requireBuilderApiAccess } from "@/utils/builder-access";
import { sanitizeClientSlug } from "@/utils/strategy-workspace";
import { isAllowedLogoType, storeClientLogo } from "@/utils/logo-upload";
import {
  isSiteIdentityLogoSlot,
  siteIdentityLogoFields,
} from "@/content/site-identity";
import { readSiteIdentity, writeSiteIdentity } from "@/utils/site-identity";

/**
 * Logo upload.
 *
 * Split from the `PUT /api/site-identity` that saves the record, because the
 * two do different things: that route takes JSON and stores a path someone
 * typed, this one takes a file and produces the path. Keeping them separate
 * means the JSON route's existing `logoFileExists` check still means what it
 * said - it validates a hand-entered path - rather than becoming a branch that
 * is skipped on upload.
 *
 * The business name is untouched here. An upload replaces one mark and
 * nothing else - which is what the `slot` field decides. It defaults to the
 * primary, so a caller that predates the icon and footer slots still uploads a
 * wordmark rather than being rejected for omitting a field it never sent.
 */

export const runtime = "nodejs";

function jsonError(error: string, status: number) {
  return Response.json({ error, ok: false }, { status });
}

export async function POST(request: Request) {
  const unauthorized = await requireBuilderApiAccess();

  if (unauthorized) {
    return unauthorized;
  }

  // Same gate the sibling route uses: these write into the repo, which is a
  // development-time action.
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Logo upload is disabled in production.", 403);
  }

  let form: FormData;

  try {
    form = await request.formData();
  } catch {
    return jsonError("Expected a file upload.", 400);
  }

  const clientSlug = sanitizeClientSlug(String(form.get("clientSlug") ?? ""));

  if (!clientSlug) {
    return jsonError("Missing client slug.", 400);
  }

  const file = form.get("file");

  if (!(file instanceof File)) {
    return jsonError("No file was included.", 400);
  }

  /**
   * The type is checked here as well as inside `storeClientLogo`, and that is
   * deliberate rather than redundant: this one reports the problem before the
   * bytes are read into memory, and the one inside is what makes the writer
   * safe for any future caller.
   */
  if (!isAllowedLogoType(file.type)) {
    return jsonError(
      `Unsupported file type ${file.type || "(none)"}. Use SVG, PNG, JPEG or WebP.`,
      400,
    );
  }

  const requestedSlot = form.get("slot");
  const slot = isSiteIdentityLogoSlot(requestedSlot)
    ? requestedSlot
    : requestedSlot == null || requestedSlot === ""
      ? ("primary" as const)
      : null;

  if (!slot) {
    return jsonError(
      `Unknown logo slot ${String(requestedSlot)}. Use primary, icon or footer.`,
      400,
    );
  }

  try {
    const stored = await storeClientLogo({
      bytes: await file.arrayBuffer(),
      clientSlug,
      slot,
      type: file.type,
    });

    if (!stored.ok) {
      return jsonError(stored.error, 400);
    }

    // Read-modify-write rather than writing a whole identity: the upload knows
    // about one mark and must not be able to blank a business name that was
    // edited in another tab - nor either of the two marks it is not replacing.
    const current = await readSiteIdentity(clientSlug);
    const identity = await writeSiteIdentity(clientSlug, {
      ...current,
      [siteIdentityLogoFields[slot]]: stored.logoSrc,
    });

    return Response.json({ identity, ok: true });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not save the logo.",
      500,
    );
  }
}
