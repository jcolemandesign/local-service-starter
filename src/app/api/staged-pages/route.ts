import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  buildStrategyTemplateStagedPage,
  writeStagedPage,
  type StagedPageTemplate,
} from "@/utils/staged-pages";
import { readLatestStrategySnapshot } from "@/utils/strategy-snapshots";

export const runtime = "nodejs";

type StagePageRequest = {
  clientSlug?: string;
  pageLabel?: string;
  pageSlug?: string;
  templateId?: string;
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

    const page = buildStrategyTemplateStagedPage({
      pageLabel: body.pageLabel ?? template.name,
      pageSlug: body.pageSlug ?? template.id,
      snapshot,
      template,
    });
    const pages = await writeStagedPage(page);

    return Response.json({ ok: true, page, pages, snapshot });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Page staging failed.",
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

function jsonError(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}
