import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type ContentFieldKind = "copy" | "image" | "link";

type PromotionField = {
  id: string;
  kind: ContentFieldKind;
  path: string;
  value: string;
};

type PromotionRequest = {
  fields: PromotionField[];
  pageHref: string;
  pageId: string;
  pageLabel: string;
};

type StagedPage = PromotionRequest & {
  fieldCounts: Record<ContentFieldKind, number>;
  promotedAt: string;
  sourceStage: "content-editor";
  status: "staged";
};

type StagedPagesFile = {
  pages: StagedPage[];
};

const stagedPagesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "staged-pages.json",
);
const pageIdPattern = /^[a-z0-9-]+$/;
const allowedKinds = new Set<ContentFieldKind>(["copy", "image", "link"]);

export async function POST(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Content promotion is disabled in production.", 403);
  }

  let body: PromotionRequest;

  try {
    body = (await request.json()) as PromotionRequest;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const stagedPage = normalizePromotion(body);
    const stagedPages = await readStagedPages();
    const nextPages = [
      stagedPage,
      ...stagedPages.pages.filter((page) => page.pageId !== stagedPage.pageId),
    ];
    const nextFile: StagedPagesFile = { pages: nextPages };

    await mkdir(path.dirname(stagedPagesPath), { recursive: true });
    await writeFile(stagedPagesPath, `${JSON.stringify(nextFile, null, 2)}\n`);

    return Response.json({ ok: true, page: stagedPage, pages: nextPages });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Content promotion failed.",
      400,
    );
  }
}

async function readStagedPages(): Promise<StagedPagesFile> {
  try {
    const contents = await readFile(stagedPagesPath, "utf8");
    const parsed = JSON.parse(contents) as Partial<StagedPagesFile>;

    return {
      pages: Array.isArray(parsed.pages) ? parsed.pages as StagedPage[] : [],
    };
  } catch {
    return { pages: [] };
  }
}

function normalizePromotion(body: PromotionRequest): StagedPage {
  if (!pageIdPattern.test(body.pageId)) {
    throw new Error("Invalid page id.");
  }

  if (!body.pageHref.startsWith("/created-pages/")) {
    throw new Error("Only Created Pages can be staged from the Content Editor.");
  }

  if (typeof body.pageLabel !== "string" || body.pageLabel.trim().length === 0) {
    throw new Error("Missing page label.");
  }

  if (!Array.isArray(body.fields) || body.fields.length === 0) {
    throw new Error("Missing promoted fields.");
  }

  const fields = body.fields.map((field) => normalizeField(field));

  return {
    fields,
    fieldCounts: fields.reduce(
      (counts, field) => ({
        ...counts,
        [field.kind]: counts[field.kind] + 1,
      }),
      { copy: 0, image: 0, link: 0 },
    ),
    pageHref: body.pageHref,
    pageId: body.pageId,
    pageLabel: body.pageLabel.trim(),
    promotedAt: new Date().toISOString(),
    sourceStage: "content-editor",
    status: "staged",
  };
}

function normalizeField(field: PromotionField): PromotionField {
  if (typeof field.id !== "string" || field.id.trim().length === 0) {
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
