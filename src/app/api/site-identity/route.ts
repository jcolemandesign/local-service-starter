import { requireBuilderApiAccess } from "@/utils/builder-access";
import { sanitizeClientSlug } from "@/utils/strategy-workspace";
import { sanitizeSiteIdentity } from "@/content/site-identity";
import {
  logoFileExists,
  readSiteIdentity,
  writeSiteIdentity,
} from "@/utils/site-identity";

export const runtime = "nodejs";

type SiteIdentityRequest = {
  businessName?: unknown;
  clientSlug?: unknown;
  footerLogoSrc?: unknown;
  logoIconSrc?: unknown;
  logoSrc?: unknown;
};

function isDevDisabled() {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  );
}

function jsonError(error: string, status: number) {
  return Response.json({ error, ok: false }, { status });
}

export async function GET(request: Request) {
  const unauthorized = await requireBuilderApiAccess();

  if (unauthorized) {
    return unauthorized;
  }

  if (isDevDisabled()) {
    return jsonError("Site identity is disabled in production.", 403);
  }

  const clientSlug = sanitizeClientSlug(
    new URL(request.url).searchParams.get("client") ?? "",
  );

  if (!clientSlug) {
    return jsonError("Missing client slug.", 400);
  }

  return Response.json({
    identity: await readSiteIdentity(clientSlug),
    ok: true,
  });
}

export async function PUT(request: Request) {
  const unauthorized = await requireBuilderApiAccess();

  if (unauthorized) {
    return unauthorized;
  }

  if (isDevDisabled()) {
    return jsonError("Site identity is disabled in production.", 403);
  }

  let body: SiteIdentityRequest;

  try {
    body = (await request.json()) as SiteIdentityRequest;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const clientSlug = sanitizeClientSlug(body.clientSlug);

  if (!clientSlug) {
    return jsonError("Missing client slug.", 400);
  }

  try {
    const requested = sanitizeSiteIdentity({
      businessName: body.businessName,
      footerLogoSrc: body.footerLogoSrc,
      logoIconSrc: body.logoIconSrc,
      logoSrc: body.logoSrc,
    });

    // Reject a path that resolves to nothing before it is stored. It would save
    // cleanly, render as an empty logo, and be skipped by the exporter - a
    // broken mark on the client's site with no error anywhere.
    //
    // Every slot is checked, and the label is the one the editor puts on the
    // field: three paths in one form means "no file at that path" has to say
    // WHICH path, or the message sends someone to look at the wrong one.
    const checks = [
      ["Primary logo", requested.logoSrc] as const,
      ["Logo icon", requested.logoIconSrc] as const,
      ["Footer logo", requested.footerLogoSrc] as const,
    ];

    for (const [label, value] of checks) {
      if (value && !(await logoFileExists(value))) {
        return Response.json({
          error: `${label}: no file at public${value}. Check the path.`,
          ok: false,
        }, { status: 400 });
      }
    }

    const identity = await writeSiteIdentity(clientSlug, requested);

    // Echo the sanitised record back: a path is dropped unless it is a
    // same-origin path, so the editor can show what was actually stored rather
    // than what was typed.
    return Response.json({ identity, ok: true });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Could not save site identity.",
      500,
    );
  }
}
