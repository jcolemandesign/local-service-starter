import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  buildStrategyTemplateStagedPage,
  removeStagedPage,
  updateStagedPageFields,
  writeStagedPage,
  type StagedPageField,
  type StagedPageTemplate,
} from "@/utils/staged-pages";
import { setPageExportApproval } from "@/utils/site-export-state";
import { readLatestStrategySnapshot } from "@/utils/strategy-snapshots";
import { getTemplateCopyContractStatus } from "@/utils/template-copy-contract";

export const runtime = "nodejs";

type StagePageRequest = {
  action?: "refresh" | "stage";
  clientSlug?: string;
  pageLabel?: string;
  pageSlug?: string;
  templateId?: string;
};

type UpdateStagedPageRequest = {
  clientSlug?: string;
  fields?: StagedPageField[];
  pageId?: string;
};

type DeleteStagedPageRequest = {
  clientSlug?: string;
  pageId?: string;
};

type PageTemplatesFile = {
  templates?: StagedPageTemplate[];
};

const pageTemplatesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "page-templates.json",
);

export async function POST(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Page staging is disabled in production.", 403);
  }

  let body: StagePageRequest;

  try {
    body = (await request.json()) as StagePageRequest;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const template = await findTemplate(body.templateId);
    const snapshot = await readLatestStrategySnapshot(body.clientSlug);

    if (!snapshot) {
      throw new Error("Save the strategy workspace before staging pages.");
    }

    const pageSlug = body.pageSlug ?? template.id;
    const explicitPageCopy =
      snapshot.fields[`pageCopy.${sanitizeSlug(pageSlug)}`] ?? "";
    const contractStatus = getTemplateCopyContractStatus(
      explicitPageCopy,
      template,
    );

    if (
      body.action === "refresh" &&
      explicitPageCopy.trim() &&
      contractStatus !== "current"
    ) {
      throw new Error(
        contractStatus === "stale"
          ? "This page's batch copy was generated from an older template contract. Copy the updated contract in Strategy, regenerate the batch copy, and save it before staging."
          : "This page's batch copy does not include a verifiable template contract. Copy the current contract in Strategy, regenerate the batch copy, and save it before staging.",
      );
    }

    const page = buildStrategyTemplateStagedPage({
      applyBatchCopy: contractStatus === "current",
      pageLabel: body.pageLabel ?? template.name,
      pageSlug,
      snapshot,
      template,
    });
    const pages = await writeStagedPage(page);
    await setPageExportApproval({
      approved: false,
      clientSlug: page.snapshot.clientSlug,
      pageId: page.pageId,
    });

    return Response.json({ ok: true, page, pages, snapshot });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Page staging failed.",
      400,
    );
  }
}

export async function PATCH(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Page staging is disabled in production.", 403);
  }

  let body: UpdateStagedPageRequest;

  try {
    body = (await request.json()) as UpdateStagedPageRequest;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const pageId = sanitizeSlug(body.pageId);
    const clientSlug = sanitizeSlug(body.clientSlug);

    if (!pageId || !clientSlug) {
      throw new Error("Missing client slug or page id.");
    }

    if (!Array.isArray(body.fields)) {
      throw new Error("Missing staged fields.");
    }

    const fields = body.fields.map(normalizeField);
    const result = await updateStagedPageFields(clientSlug, pageId, fields);
    await setPageExportApproval({
      approved: false,
      clientSlug,
      pageId,
    });

    return Response.json({ ok: true, ...result });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Page update failed.",
      400,
    );
  }
}

export async function DELETE(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Page staging is disabled in production.", 403);
  }

  let body: DeleteStagedPageRequest;

  try {
    body = (await request.json()) as DeleteStagedPageRequest;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const pageId = sanitizeSlug(body.pageId);
    const clientSlug = sanitizeSlug(body.clientSlug);

    if (!pageId || !clientSlug) {
      throw new Error("Missing client slug or page id.");
    }

    const pages = await removeStagedPage(clientSlug, pageId);
    await setPageExportApproval({
      approved: false,
      clientSlug,
      pageId,
    });

    return Response.json({ ok: true, pages });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Page removal failed.",
      400,
    );
  }
}

async function findTemplate(templateId: unknown) {
  const normalizedTemplateId = sanitizeSlug(templateId);

  if (!normalizedTemplateId) {
    throw new Error("Missing template id.");
  }

  const templates = await readPageTemplates();
  const template = templates.find(
    (currentTemplate) => currentTemplate.id === normalizedTemplateId,
  );

  if (!template) {
    throw new Error("Template not found.");
  }

  return template;
}

async function readPageTemplates() {
  try {
    const contents = await readFile(pageTemplatesPath, "utf8");
    const parsed = JSON.parse(contents) as PageTemplatesFile;

    return Array.isArray(parsed.templates) ? parsed.templates : [];
  } catch {
    return [];
  }
}

function sanitizeSlug(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeField(field: StagedPageField) {
  const allowedKinds = new Set(["copy", "image", "link", "meta"]);

  if (typeof field?.id !== "string" || field.id.trim().length === 0) {
    throw new Error("Invalid field id.");
  }

  if (!allowedKinds.has(field.kind)) {
    throw new Error("Invalid field kind.");
  }

  if (typeof field.path !== "string" || field.path.trim().length === 0) {
    throw new Error("Invalid field path.");
  }

  if (typeof field.value !== "string") {
    throw new Error("Invalid field value.");
  }

  return {
    id: field.id,
    kind: field.kind,
    path: field.path,
    value: field.value,
  };
}

function jsonError(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}
