import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type SavedPagebuilderSection = {
  component: string;
  id: string;
  included: boolean;
  instruction: string;
  mode: string;
  name: string;
  originalComponent: string;
  originalIndex: number;
  ratio?: string;
  variant?: string;
  colorRecipe?: string;
  cardFill?: string;
};

type SavedPagebuilderOptionRequest = {
  designStyle: {
    showSectionMarkers: boolean;
    viewportId: string;
  };
  optionIndex: number;
  optionName: string;
  recipeId: string;
  recipeName: string;
  sections: SavedPagebuilderSection[];
};

type SavedPagebuilderOption = SavedPagebuilderOptionRequest & {
  savedAt: string;
  sectionCount: number;
};

type SavedPagebuilderOptionsFile = {
  options: SavedPagebuilderOption[];
};

const optionsPath = path.join(
  process.cwd(),
  "src",
  "content",
  "pagebuilder-options.json",
);

export async function GET() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Pagebuilder option saves are disabled in production.", 403);
  }

  const optionsFile = await readOptions();

  return Response.json({
    ok: true,
    options: optionsFile.options,
  });
}

export async function POST(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Pagebuilder option saves are disabled in production.", 403);
  }

  let body: SavedPagebuilderOptionRequest;

  try {
    body = (await request.json()) as SavedPagebuilderOptionRequest;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const option = normalizeOption(body);
    const optionsFile = await readOptions();
    const nextOptions = [
      option,
      ...optionsFile.options.filter(
        (currentOption) =>
          currentOption.recipeId !== option.recipeId ||
          currentOption.optionIndex !== option.optionIndex,
      ),
    ];

    await mkdir(path.dirname(optionsPath), { recursive: true });
    await writeFile(
      optionsPath,
      `${JSON.stringify({ options: nextOptions }, null, 2)}\n`,
    );

    return Response.json({
      ok: true,
      option,
      options: nextOptions,
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Pagebuilder option save failed.",
      400,
    );
  }
}

async function readOptions(): Promise<SavedPagebuilderOptionsFile> {
  try {
    const contents = await readFile(optionsPath, "utf8");
    const parsed = JSON.parse(contents) as Partial<SavedPagebuilderOptionsFile>;

    return {
      options: Array.isArray(parsed.options)
        ? (parsed.options as SavedPagebuilderOption[])
        : [],
    };
  } catch {
    return { options: [] };
  }
}

function normalizeOption(
  body: SavedPagebuilderOptionRequest,
): SavedPagebuilderOption {
  const recipeId = normalizeRequiredString(body.recipeId, "Missing recipe id.");
  const recipeName = normalizeRequiredString(
    body.recipeName,
    "Missing recipe name.",
  );
  const optionName = normalizeRequiredString(
    body.optionName,
    "Missing option name.",
  );
  const optionIndex = Number.isFinite(body.optionIndex) ? body.optionIndex : 0;

  if (!Array.isArray(body.sections)) {
    throw new Error("Missing option sections.");
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
    optionIndex,
    optionName,
    recipeId,
    recipeName,
    savedAt: new Date().toISOString(),
    sectionCount: sections.filter((section) => section.included).length,
    sections,
  };
}

function normalizeSection(
  section: SavedPagebuilderSection,
): SavedPagebuilderSection {
  const component = normalizeRequiredString(section.component, "Invalid section.");

  return {
    component,
    id: normalizeRequiredString(section.id, "Invalid section id."),
    included: Boolean(section.included),
    instruction: normalizeRequiredString(
      section.instruction,
      "Invalid section instruction.",
    ),
    mode: normalizeRequiredString(section.mode, "Invalid section mode."),
    name: normalizeRequiredString(section.name, "Invalid section name."),
    originalComponent:
      typeof section.originalComponent === "string" &&
      section.originalComponent.trim().length > 0
        ? section.originalComponent.trim()
        : component,
    originalIndex: Number.isFinite(section.originalIndex)
      ? section.originalIndex
      : 0,
    ratio: typeof section.ratio === "string" ? section.ratio : undefined,
    variant: typeof section.variant === "string" ? section.variant : undefined,
    colorRecipe:
      typeof section.colorRecipe === "string" ? section.colorRecipe : undefined,
    cardFill: typeof section.cardFill === "string" ? section.cardFill : undefined,
  };
}

function normalizeRequiredString(value: unknown, message: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(message);
  }

  return value.trim();
}

function jsonError(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}
