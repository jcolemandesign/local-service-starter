import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  buildStrategyTemplateStagedPage,
  writeStagedPage,
  type StagedPageTemplate,
  type StagedPageTemplateSection,
} from "@/utils/staged-pages";
import { readLatestStrategySnapshot } from "@/utils/strategy-snapshots";
import { semanticSectionOptions } from "@/content/semantic-section-options";

export const runtime = "nodejs";

type StagePageRequest = {
  clientSlug?: string;
  pageLabel?: string;
  pageSlug?: string;
  pageType?: string;
  sections?: StagedPageTemplateSection[];
  templateId?: string;
  templateName?: string;
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
    const template = await resolveTemplate(body);
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

async function resolveTemplate(body: StagePageRequest) {
  if (Array.isArray(body.sections) && body.sections.length > 0) {
    return buildSemanticTemplate(body);
  }

  return findTemplate(body.templateId);
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

function buildSemanticTemplate(body: StagePageRequest): StagedPageTemplate {
  const pageType = sanitizeSlug(body.pageType) || sanitizeSlug(body.pageSlug);
  const templateName = sanitizeText(body.templateName) || "Layout Preview";
  const allowedComponents = new Set(
    semanticSectionOptions.map((option) => option.component),
  );
  const sections = (body.sections ?? [])
    .filter((section) => allowedComponents.has(section.component))
    .map((section) => ({
      component: section.component,
      body: sanitizeText(section.body),
      instruction: sanitizeText(section.instruction),
      mode: sanitizeText(section.mode),
      name: sanitizeText(section.name),
      originalComponent: section.originalComponent,
      originalIndex: section.originalIndex,
      ratio: section.ratio,
      sourceRole: sanitizeText(section.sourceRole),
      summary: sanitizeText(section.summary),
      variant: section.variant,
    }))
    .filter((section) => section.mode && section.name);

  if (!pageType) {
    throw new Error("Missing page type.");
  }

  if (sections.length === 0) {
    throw new Error("Choose at least one semantic section.");
  }

  return {
    id: `semantic-${pageType}`,
    name: templateName,
    pageType,
    sections,
    sourceOptionName: "Layout Preview",
    sourceRecipeName: "Strategy snapshot",
  };
}

function sanitizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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
