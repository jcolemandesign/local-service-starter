import {
  analyzeSiteExport,
  exportClientSite,
  SiteExportValidationError,
} from "@/utils/site-export";
import { setPageExportApproval } from "@/utils/site-export-state";
import { readStagedPages } from "@/utils/staged-pages";
import { sanitizeClientSlug } from "@/utils/strategy-workspace";

export const runtime = "nodejs";

type SiteExportRequest = {
  action?: "approve" | "dry-run" | "export" | "unapprove";
  clientSlug?: string;
  pageId?: string;
};

export async function POST(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Site export is disabled in production.", 403);
  }

  let body: SiteExportRequest;

  try {
    body = (await request.json()) as SiteExportRequest;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const clientSlug = sanitizeClientSlug(body.clientSlug ?? "");

  if (!clientSlug) {
    return jsonError("Missing client slug.", 400);
  }

  try {
    if (body.action === "approve" || body.action === "unapprove") {
      const pageId = sanitizePageId(body.pageId);
      const pages = await readStagedPages();
      const pageExists = pages.some(
        (page) =>
          page.pageId === pageId &&
          page.snapshot.clientSlug === clientSlug,
      );

      if (!pageId || !pageExists) {
        throw new Error("Staged page not found for this client.");
      }

      const state = await setPageExportApproval({
        approved: body.action === "approve",
        clientSlug,
        pageId,
      });

      return Response.json({ ok: true, state });
    }

    if (body.action === "dry-run") {
      const analysis = await analyzeSiteExport(clientSlug);
      return Response.json({ analysis, ok: true });
    }

    if (body.action === "export") {
      const result = await exportClientSite(clientSlug);
      return Response.json({ ok: true, result });
    }

    return jsonError("Unknown site export action.", 400);
  } catch (error) {
    if (error instanceof SiteExportValidationError) {
      return Response.json(
        { analysis: error.analysis, error: error.message, ok: false },
        { status: 400 },
      );
    }

    return jsonError(
      error instanceof Error ? error.message : "Site export failed.",
      400,
    );
  }
}

function sanitizePageId(value: unknown) {
  return typeof value === "string"
    ? value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";
}

function jsonError(error: string, status: number) {
  return Response.json({ error, ok: false }, { status });
}
