import { requireBuilderApiAccess } from "@/utils/builder-access";
import { sanitizeClientSlug } from "@/utils/strategy-workspace";
import { readSiteIdentity, writeSiteIdentity } from "@/utils/site-identity";

export const runtime = "nodejs";

type SiteIdentityRequest = {
  businessName?: unknown;
  clientSlug?: unknown;
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
    const identity = await writeSiteIdentity(clientSlug, {
      businessName: body.businessName,
      logoSrc: body.logoSrc,
    });

    // Echo the sanitised record back: `logoSrc` is dropped unless it is a
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
