import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ContentEditorPage } from "@/content/content-editor";

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

type PageTemplate = {
  designStyle: {
    showSectionMarkers: boolean;
    viewportId: string;
  };
  id: string;
  name: string;
  notes?: string;
  pageType: string;
  promotedAt: string;
  sectionCount: number;
  sections: PageTemplateSection[];
  sourceOptionName: string;
  sourceRecipeId: string;
  sourceRecipeName: string;
};

type PageTemplatesFile = {
  templates?: PageTemplate[];
};

type ContentEditorPagesFile = {
  pages?: ContentEditorPage[];
};

type CreateContentEditorPageRequest = {
  pageLabel: string;
  pageSlug: string;
  templateId: string;
};

const pageTemplatesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "page-templates.json",
);
const contentEditorPagesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "content-editor-pages.json",
);
const slugPattern = /^[a-z0-9-]+$/;

export async function POST(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Content Editor page creation is disabled in production.", 403);
  }

  let body: CreateContentEditorPageRequest;

  try {
    body = (await request.json()) as CreateContentEditorPageRequest;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const template = await findTemplate(body.templateId);
    const page = buildContentEditorPage({
      pageLabel: body.pageLabel,
      pageSlug: body.pageSlug,
      template,
    });
    const currentPages = await readContentEditorPages();
    const nextPages = [
      page,
      ...currentPages.pages.filter((currentPage) => currentPage.id !== page.id),
    ];

    await mkdir(path.dirname(contentEditorPagesPath), { recursive: true });
    await writeFile(
      contentEditorPagesPath,
      `${JSON.stringify({ pages: nextPages }, null, 2)}\n`,
    );

    return Response.json({ ok: true, page, pages: nextPages });
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Content Editor page creation failed.",
      400,
    );
  }
}

async function findTemplate(templateId: string) {
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

async function readContentEditorPages(): Promise<{
  pages: ContentEditorPage[];
}> {
  try {
    const contents = await readFile(contentEditorPagesPath, "utf8");
    const parsed = JSON.parse(contents) as ContentEditorPagesFile;

    return {
      pages: Array.isArray(parsed.pages) ? parsed.pages : [],
    };
  } catch {
    return { pages: [] };
  }
}

function buildContentEditorPage({
  pageLabel,
  pageSlug,
  template,
}: {
  pageLabel: string;
  pageSlug: string;
  template: PageTemplate;
}): ContentEditorPage {
  const id = sanitizeSlug(pageSlug);
  const label = normalizeRequiredString(pageLabel, "Enter a page label.");

  if (!id || !slugPattern.test(id)) {
    throw new Error("Enter a valid page slug.");
  }

  return {
    href: `/${id}`,
    id,
    label,
    sections: template.sections.map((section, index) =>
      buildContentEditorSection({ pageId: id, section, index }),
    ),
    sourceRecipe: `${template.sourceRecipeName} / ${template.sourceOptionName}`,
  };
}

function buildContentEditorSection({
  index,
  pageId,
  section,
}: {
  index: number;
  pageId: string;
  section: PageTemplateSection;
}) {
  const sectionId = `${String(index + 1).padStart(2, "0")}-${sanitizeSlug(
    section.name || section.component,
  )}`;
  const baseId = `${pageId}.${sectionId}`;
  const fields = [
    contentField({
      id: `${baseId}.sectionName`,
      label: "Section name",
      path: `${sectionId}.sectionName`,
      value: section.name,
    }),
    contentField({
      id: `${baseId}.component`,
      label: "Component",
      path: `${sectionId}.component`,
      value: section.component,
    }),
    contentField({
      id: `${baseId}.mode`,
      label: "Mode",
      path: `${sectionId}.mode`,
      value: section.mode,
    }),
    contentField({
      id: `${baseId}.instruction`,
      label: "Section instruction",
      path: `${sectionId}.instruction`,
      value: section.instruction,
    }),
    contentField({
      id: `${baseId}.copyDirection`,
      label: "Copy direction",
      path: `${sectionId}.copyDirection`,
      value: "",
    }),
    contentField({
      id: `${baseId}.imageNotes`,
      kind: "image",
      label: "Image notes",
      path: `${sectionId}.imageNotes`,
      value: "",
    }),
    contentField({
      id: `${baseId}.ctaNotes`,
      kind: "link",
      label: "CTA / link notes",
      path: `${sectionId}.ctaNotes`,
      value: "",
    }),
  ];

  if (section.variant) {
    fields.push(
      contentField({
        id: `${baseId}.variant`,
        label: "Variant",
        path: `${sectionId}.variant`,
        value: section.variant,
      }),
    );
  }

  if (section.ratio) {
    fields.push(
      contentField({
        id: `${baseId}.ratio`,
        label: "Ratio",
        path: `${sectionId}.ratio`,
        value: section.ratio,
      }),
    );
  }

  return {
    fields,
    id: sectionId,
    label: section.name,
  };
}

function contentField({
  id,
  kind = "copy",
  label,
  path: fieldPath,
  value,
}: {
  id: string;
  kind?: "copy" | "image" | "link";
  label: string;
  path: string;
  value: string;
}) {
  return {
    id,
    kind,
    label,
    path: fieldPath,
    value,
  };
}

function normalizeRequiredString(value: unknown, message: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(message);
  }

  return value.trim();
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
