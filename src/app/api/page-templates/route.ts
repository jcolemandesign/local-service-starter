import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveBackgroundConfig } from "@/content/background-config";
import { sectionToggleFieldNames } from "@/content/section-style-options";
import { requireBuilderApiAccess } from "@/utils/builder-access";
import { createSlotId } from "@/utils/section-id";
import { validateTemplateStructure } from "@/utils/template-structure";

export const runtime = "nodejs";

type PageTemplateSection = {
  component: string;
  instruction: string;
  mode: string;
  name: string;
  originalComponent: string;
  originalIndex: number;
  reduceBottomPadding?: boolean;
  reduceTopPadding?: boolean;
  align?: string;
  cardLinks?: string;
  cardMedia?: string;
  icons?: string;
  headingSize?: string;
  headlineWrap?: string;
  ratio?: string;
  /** Stable rename anchor - see `SlottedSection` in @/utils/section-id. */
  slotId?: string;
  variant?: string;
  colorRecipe?: string;
  backgroundFill?: string;
  navLogoLayout?: string;
  cardFill?: string;
  cardBorder?: string;
  borderTone?: string;
  /**
   * `"join"` shares the background of the section above - see
   * `groupSectionsIntoBands`. Without this a promoted template loses every
   * band, and the exported page renders each member painting its own ground.
   */
  joinAbove?: string;
  /** Ground texture - see `backgroundTreatment` in `section-style-options`. */
  backgroundTreatment?: string;
  /** Whether this section's primary CTA is the site's special one. Absent means
   *  off - see `resolveSpecialCta`. */
  specialCta?: string;
  /**
   * Tuned gradient, held loosely because this route is a transport boundary
   * rather than the authority on the model - `resolveBackgroundConfig`
   * sanitises it at render time, so a hand-edited blob degrades to the
   * stylesheet default rather than painting something unvalidated.
   */
  backgroundConfig?: unknown;
  backgroundImageFit?: string;
  backgroundImageFocus?: string;
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
  const unauthorized = await requireBuilderApiAccess();

  if (unauthorized) {
    return unauthorized;
  }

  // POST/PUT/DELETE in this file are already dev-guarded; GET was not, so a
  // deployed builder would have served the full template library publicly.
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Template access is disabled in production.", 403);
  }

  const templatesFile = await readTemplates();

  return Response.json({
    ok: true,
    templates: templatesFile.templates,
  });
}

export async function POST(request: Request) {
  const unauthorized = await requireBuilderApiAccess();

  if (unauthorized) {
    return unauthorized;
  }

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
    const templatesFile = await readTemplates();
    const template = normalizeTemplate(
      body,
      templatesFile.templates.find(
        (currentTemplate) => currentTemplate.id === sanitizeSlug(body.id ?? ""),
      ),
    );
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
  const unauthorized = await requireBuilderApiAccess();

  if (unauthorized) {
    return unauthorized;
  }

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

export async function PATCH(request: Request) {
  const unauthorized = await requireBuilderApiAccess();

  if (unauthorized) {
    return unauthorized;
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Template editing is disabled in production.", 403);
  }

  let body: { name?: string; templateId?: string };

  try {
    body = (await request.json()) as { name?: string; templateId?: string };
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const templateId = sanitizeSlug(body.templateId ?? "");
    const name = normalizeRequiredString(body.name, "Enter a template name.");
    const templatesFile = await readTemplates();
    const template = templatesFile.templates.find(
      (currentTemplate) => currentTemplate.id === templateId,
    );

    if (!template) {
      return jsonError("Template not found.", 404);
    }

    const renamedTemplate = { ...template, name };
    const nextTemplates = templatesFile.templates.map((currentTemplate) =>
      currentTemplate.id === templateId ? renamedTemplate : currentTemplate,
    );

    await writeFile(
      templatesPath,
      `${JSON.stringify({ templates: nextTemplates }, null, 2)}\n`,
    );

    return Response.json({ ok: true, template: renamedTemplate });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Template rename failed.",
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

function normalizeTemplate(
  body: PageTemplateRequest,
  previousTemplate: PageTemplate | undefined,
): PageTemplate {
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

  const sections = assignSlotIds(
    body.sections.map(normalizeSection),
    previousTemplate?.sections,
  );
  validateTemplateStructure(sections);

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

/**
 * Every template section gets a `slotId` that survives edits to its name and
 * position, so a restage can follow copy to the section's new field paths
 * instead of stranding it (see `getSectionIdRenames`).
 *
 * Promotion overwrites a template of the same id, so re-promoting must carry
 * the existing anchors forward or the anchor is lost at exactly the moment it
 * is needed. Precedence:
 *
 * 1. a `slotId` the client sent - the pagebuilder round trip preserves it,
 *    and it is the only source that stays correct across inserts and deletes
 * 2. the previous template's anchor at the same index, but only when the stack
 *    shape is unchanged (same length, same component per index). A rename is
 *    the case worth recovering and it leaves the shape intact.
 * 3. a fresh id
 *
 * Anything that changed the stack shape without sending slotIds has no
 * trustworthy correspondence, so those slots start fresh rather than risk
 * anchoring copy onto a different section. That degrades to the old
 * path-matching behaviour, which is what the code did everywhere before.
 */
function assignSlotIds(
  sections: PageTemplateSection[],
  previousSections: PageTemplateSection[] | undefined,
) {
  const carriedSections =
    previousSections?.length === sections.length &&
    sections.every(
      (section, index) =>
        section.component === previousSections[index]?.component,
    )
      ? previousSections
      : undefined;

  // A slot anchors exactly one section. Two sections sharing one would make
  // `getSectionIdRenames` remap copy onto whichever of them it saw last, so
  // repeats are dropped here rather than written to disk.
  const usedSlotIds = new Set<string>();

  return sections.map((section, index) => {
    const carriedSlotId =
      section.slotId || carriedSections?.[index]?.slotId || "";
    const slotId =
      carriedSlotId && !usedSlotIds.has(carriedSlotId)
        ? carriedSlotId
        : createSlotId();

    usedSlotIds.add(slotId);

    return { ...section, slotId };
  });
}

function normalizeSection(section: PageTemplateSection): PageTemplateSection {
  return {
    slotId:
      typeof section.slotId === "string" && section.slotId.trim()
        ? section.slotId.trim()
        : undefined,
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
    reduceBottomPadding: Boolean(section.reduceBottomPadding),
    reduceTopPadding: Boolean(section.reduceTopPadding),
    // Every remaining axis the section carries, kept as sent.
    //
    // Previously each one was named here by hand, and three - `cardLinks`,
    // `icons`, `headlineWrap` - were declared on the type above but never
    // copied, while band membership and ground texture were not declared at
    // all. Both mistakes are silent: promotion succeeds and the template is
    // simply missing the settings. Driving the copy from the shared name list
    // means an axis added to the builder arrives here without a second edit.
    ...normalizeToggleFields(section),
  };
}

/**
 * Copies the toggle axes off a request section, dropping anything that is not
 * the type it should be.
 *
 * Same "allowlist and drop" basis the rest of this route uses: a value of the
 * wrong shape is left unset so the section falls back to its own default,
 * rather than being written through to a template that later renders it.
 */
function normalizeToggleFields(section: PageTemplateSection) {
  const normalized: Record<string, unknown> = {};

  for (const name of sectionToggleFieldNames) {
    const value = (section as Record<string, unknown>)[name];

    // The gradient is the one non-string axis, and it is sanitised rather than
    // type-checked - `resolveBackgroundConfig` returns null for anything it
    // does not recognise, which is the same "fall back to the default" answer
    // the string guard below gives.
    if (name === "backgroundConfig") {
      const config = resolveBackgroundConfig(value);

      if (config) {
        normalized[name] = config;
      }

      continue;
    }

    if (typeof value === "string") {
      normalized[name] = value;
    }
  }

  return normalized;
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
