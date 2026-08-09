import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveBackgroundConfig } from "@/content/background-config";
import { requireBuilderApiAccess } from "@/utils/builder-access";

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
  reduceBottomPadding?: boolean;
  reduceTopPadding?: boolean;
  align?: string;
  cardLinks?: string;
  icons?: string;
  headlineWrap?: string;
  ratio?: string;
  /**
   * Carried through so a template edited in pagebuilder keeps its rename
   * anchors on re-promotion - see `SlottedSection` in @/utils/section-id.
   * Sections added here have none until they are promoted.
   */
  slotId?: string;
  variant?: string;
  colorRecipe?: string;
  backgroundFill?: string;
  /**
   * The ground texture and the band membership that decides who owns it.
   *
   * Both were missing here for as long as the controls have existed, and
   * `normalizeSection` drops anything it does not name, so every value the
   * builder wrote died on save: the canvas repainted from React state and
   * then reverted on the next load. `pagebuilder-options.json` held no
   * occurrence of either field. Kept adjacent to the other paint axes so the
   * next one added lands beside them rather than being forgotten again -
   * `pagebuilder-options-round-trip.test.ts` is the mechanical guard.
   */
  backgroundTreatment?: string;
  joinAbove?: string;
  /**
   * The tuned gradient, stored as the editor's own shape. Held as `unknown`
   * here because this route is a transport boundary, not the authority on the
   * model - `resolveBackgroundConfig` sanitises it at render time, on the same
   * "allowlist and drop" basis as every other value that reaches CSS, so a
   * hand-edited or stale JSON blob degrades to the stylesheet default rather
   * than painting something unvalidated.
   */
  backgroundConfig?: unknown;
  /**
   * Ground image sizing and focal point. Plain strings rather than a parsed
   * shape, for the reason above: this route is a transport boundary, and
   * `background-image-config` sanitises both at render time - an unrecognised
   * fit or an out-of-range focal point falls back to the stylesheet's `cover`
   * from `center` rather than painting something unvalidated.
   */
  backgroundImageFit?: string;
  backgroundImageFocus?: string;
  cardBorder?: string;
  borderTone?: string;
  cardFill?: string;
  /**
   * The card and border colour overrides. Plain strings for the same reason
   * as the fields above - this is a transport boundary, and `color-overrides`
   * resolves them at render time, where a retired swatch degrades to the
   * recipe's own card rather than being rejected here and lost.
   */
  cardSwatch?: string;
  cardIntensity?: string;
  borderSwatch?: string;
  borderIntensity?: string;
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
  const unauthorized = await requireBuilderApiAccess();

  if (unauthorized) {
    return unauthorized;
  }

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
  const unauthorized = await requireBuilderApiAccess();

  if (unauthorized) {
    return unauthorized;
  }

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
    reduceBottomPadding: Boolean(section.reduceBottomPadding),
    reduceTopPadding: Boolean(section.reduceTopPadding),
    ratio: typeof section.ratio === "string" ? section.ratio : undefined,
    slotId:
      typeof section.slotId === "string" && section.slotId.trim()
        ? section.slotId.trim()
        : undefined,
    variant: typeof section.variant === "string" ? section.variant : undefined,
    colorRecipe:
      typeof section.colorRecipe === "string" ? section.colorRecipe : undefined,
    backgroundFill:
      typeof section.backgroundFill === "string"
        ? section.backgroundFill
        : undefined,
    cardBorder:
      typeof section.cardBorder === "string" ? section.cardBorder : undefined,
    borderTone:
      typeof section.borderTone === "string" ? section.borderTone : undefined,
    cardFill: typeof section.cardFill === "string" ? section.cardFill : undefined,
    cardSwatch:
      typeof section.cardSwatch === "string" ? section.cardSwatch : undefined,
    cardIntensity:
      typeof section.cardIntensity === "string"
        ? section.cardIntensity
        : undefined,
    borderSwatch:
      typeof section.borderSwatch === "string" ? section.borderSwatch : undefined,
    borderIntensity:
      typeof section.borderIntensity === "string"
        ? section.borderIntensity
        : undefined,
    align: typeof section.align === "string" ? section.align : undefined,
    backgroundTreatment:
      typeof section.backgroundTreatment === "string"
        ? section.backgroundTreatment
        : undefined,
    joinAbove:
      typeof section.joinAbove === "string" ? section.joinAbove : undefined,
    backgroundConfig: resolveBackgroundConfig(section.backgroundConfig) ?? undefined,
    backgroundImageFit:
      typeof section.backgroundImageFit === "string"
        ? section.backgroundImageFit
        : undefined,
    backgroundImageFocus:
      typeof section.backgroundImageFocus === "string"
        ? section.backgroundImageFocus
        : undefined,
    // Declared in the saved type but never returned here, so these three were
    // dropped on save exactly like the two above - the client sent them and
    // this function quietly built an object without them.
    cardLinks:
      typeof section.cardLinks === "string" ? section.cardLinks : undefined,
    icons: typeof section.icons === "string" ? section.icons : undefined,
    headlineWrap:
      typeof section.headlineWrap === "string"
        ? section.headlineWrap
        : undefined,
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
