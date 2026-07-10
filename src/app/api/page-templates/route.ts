import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type PageTemplateSection = {
  component: string;
  instruction: string;
  mode: string;
  name: string;
  originalComponent: string;
  originalIndex: number;
  ratio?: string;
  variant?: string;
};

type PageTemplateRequest = {
  designStyle: {
    showSectionMarkers: boolean;
    viewportId: string;
  };
  id: string;
  name: string;
  notes?: string;
  pageType: string;
  sections: PageTemplateSection[];
  sourceOptionName: string;
  sourceRecipeId: string;
  sourceRecipeName: string;
};

type PageTemplate = PageTemplateRequest & {
  promotedAt: string;
  sectionCount: number;
};

type PageTemplatesFile = {
  templates: PageTemplate[];
};

const templatesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "page-templates.json",
);
const idPattern = /^[a-z0-9-]+$/;

export async function GET() {
  const templatesFile = await readTemplates();

  return Response.json({
    ok: true,
    templates: templatesFile.templates,
  });
}

export async function POST(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Template promotion is disabled in production.", 403);
  }

  let body: PageTemplateRequest;

  try {
    body = (await request.json()) as PageTemplateRequest;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const template = normalizeTemplate(body);
    const templatesFile = await readTemplates();
    const nextTemplates = [
      template,
      ...templatesFile.templates.filter(
        (currentTemplate) => currentTemplate.id !== template.id,
      ),
    ];

    await mkdir(path.dirname(templatesPath), { recursive: true });
    await writeFile(
      templatesPath,
      `${JSON.stringify({ templates: nextTemplates }, null, 2)}\n`,
    );

    return Response.json({
      ok: true,
      template,
      templates: nextTemplates,
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Template promotion failed.",
      400,
    );
  }
}

export async function DELETE(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Template deletion is disabled in production.", 403);
  }

  let body: { templateId?: string };

  try {
    body = (await request.json()) as { templateId?: string };
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const templateId = sanitizeSlug(body.templateId ?? "");

    if (!templateId) {
      return jsonError("Missing template id.", 400);
    }

    const templatesFile = await readTemplates();
    const nextTemplates = templatesFile.templates.filter(
      (template) => template.id !== templateId,
    );

    if (nextTemplates.length === templatesFile.templates.length) {
      return jsonError("Template not found.", 404);
    }

    await mkdir(path.dirname(templatesPath), { recursive: true });
    await writeFile(
      templatesPath,
      `${JSON.stringify({ templates: nextTemplates }, null, 2)}\n`,
    );

    return Response.json({
      ok: true,
      templateId,
      templates: nextTemplates,
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Template deletion failed.",
      400,
    );
  }
}

async function readTemplates(): Promise<PageTemplatesFile> {
  try {
    const contents = await readFile(templatesPath, "utf8");
    const parsed = JSON.parse(contents) as Partial<PageTemplatesFile>;

    return {
      templates: Array.isArray(parsed.templates)
        ? (parsed.templates as PageTemplate[])
        : [],
    };
  } catch {
    return { templates: [] };
  }
}

function normalizeTemplate(body: PageTemplateRequest): PageTemplate {
  const id = sanitizeSlug(body.id);

  if (!id || !idPattern.test(id)) {
    throw new Error("Enter a valid template slug.");
  }

  const name = normalizeRequiredString(body.name, "Enter a template name.");
  const pageType = normalizeRequiredString(body.pageType, "Enter a page type.");
  const sourceRecipeId = normalizeRequiredString(
    body.sourceRecipeId,
    "Missing source recipe id.",
  );
  const sourceRecipeName = normalizeRequiredString(
    body.sourceRecipeName,
    "Missing source recipe name.",
  );
  const sourceOptionName = normalizeRequiredString(
    body.sourceOptionName,
    "Missing source option name.",
  );

  if (!Array.isArray(body.sections) || body.sections.length === 0) {
    throw new Error("Templates need at least one included section.");
  }

  const sections = body.sections.map(normalizeSection);

  return {
    designStyle: {
      showSectionMarkers: Boolean(body.designStyle?.showSectionMarkers),
      viewportId: normalizeRequiredString(
        body.designStyle?.viewportId,
        "Missing viewport.",
      ),
    },
    id,
    name,
    notes: typeof body.notes === "string" ? body.notes.trim() : "",
    pageType,
    promotedAt: new Date().toISOString(),
    sectionCount: sections.length,
    sections,
    sourceOptionName,
    sourceRecipeId,
    sourceRecipeName,
  };
}

function normalizeSection(section: PageTemplateSection): PageTemplateSection {
  return {
    component: normalizeRequiredString(section.component, "Invalid section."),
    instruction: normalizeRequiredString(
      section.instruction,
      "Invalid section instruction.",
    ),
    mode: normalizeRequiredString(section.mode, "Invalid section mode."),
    name: normalizeRequiredString(section.name, "Invalid section name."),
    originalComponent: normalizeRequiredString(
      section.originalComponent,
      "Invalid original section component.",
    ),
    originalIndex: Number.isFinite(section.originalIndex)
      ? section.originalIndex
      : 0,
    ratio: typeof section.ratio === "string" ? section.ratio : undefined,
    variant: typeof section.variant === "string" ? section.variant : undefined,
  };
}

function normalizeRequiredString(value: unknown, message: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(message);
  }

  return value.trim();
}

function sanitizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function jsonError(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}
