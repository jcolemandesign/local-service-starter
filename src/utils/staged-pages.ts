import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  getPathFromSlug,
  getStrategyCopyForPage,
  slugify,
  type StrategyNavigationItem,
} from "@/utils/strategy-site-map";
import type { StrategySnapshot } from "@/utils/strategy-snapshots";
import { getTemplateCopyFieldsForSection } from "@/utils/template-copy-contract";

export type ContentFieldKind = "copy" | "image" | "link" | "meta";

export type StagedPageField = {
  id: string;
  kind: ContentFieldKind;
  path: string;
  value: string;
};

export type StagedPageTemplateSection = {
  component: string;
  instruction: string;
  mode: string;
  name: string;
  originalComponent?: string;
  originalIndex?: number;
  ratio?: string;
  variant?: string;
};

export type StagedPageTemplate = {
  id: string;
  name: string;
  pageType: string;
  sections: StagedPageTemplateSection[];
  sourceOptionName: string;
  sourceRecipeName: string;
};

export type StagedPage = {
  fieldCounts: Record<ContentFieldKind, number>;
  fields: StagedPageField[];
  navigation: StrategyNavigationItem[];
  pageHref: string;
  pageId: string;
  pageLabel: string;
  previewHref: string;
  promotedAt: string;
  snapshot: {
    clientSlug: string;
    createdAt: string;
    id: string;
    version: number;
  };
  sourceStage: "content-editor" | "strategy-template";
  status: "staged" | "ready";
  template?: {
    id: string;
    name: string;
    pageType: string;
    sectionCount: number;
    sections?: StagedPageTemplateSection[];
  };
};

type StagedPagesFile = {
  pages?: StagedPage[];
};

const stagedPagesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "staged-pages.json",
);

export async function readStagedPages() {
  try {
    const contents = await readFile(stagedPagesPath, "utf8");
    const parsed = JSON.parse(contents) as StagedPagesFile;

    return Array.isArray(parsed.pages) ? parsed.pages : [];
  } catch {
    return [];
  }
}

export async function writeStagedPage(page: StagedPage) {
  const pages = await readStagedPages();
  const nextPages = [
    page,
    ...pages.filter((currentPage) => currentPage.pageId !== page.pageId),
  ];

  await mkdir(path.dirname(stagedPagesPath), { recursive: true });
  await writeFile(
    stagedPagesPath,
    `${JSON.stringify({ pages: nextPages }, null, 2)}\n`,
  );

  return nextPages;
}

export async function updateStagedPageFields(
  pageId: string,
  fields: StagedPageField[],
) {
  const pages = await readStagedPages();
  const page = pages.find((currentPage) => currentPage.pageId === pageId);

  if (!page) {
    throw new Error("Staged page not found.");
  }

  const fieldsById = new Map(fields.map((field) => [field.id, field]));
  const nextFields = page.fields.map((field) => {
    const nextField = fieldsById.get(field.id);

    return nextField
      ? stagedField({
          id: field.id,
          kind: field.kind,
          path: field.path,
          value: nextField.value,
        })
      : field;
  });
  const nextPage: StagedPage = {
    ...page,
    fieldCounts: countFields(nextFields),
    fields: nextFields,
    status: "staged",
  };
  const nextPages = [
    nextPage,
    ...pages.filter((currentPage) => currentPage.pageId !== pageId),
  ];

  await mkdir(path.dirname(stagedPagesPath), { recursive: true });
  await writeFile(
    stagedPagesPath,
    `${JSON.stringify({ pages: nextPages }, null, 2)}\n`,
  );

  return {
    page: nextPage,
    pages: nextPages,
  };
}

export function buildStrategyTemplateStagedPage({
  pageLabel,
  pageSlug,
  snapshot,
  template,
}: {
  pageLabel: string;
  pageSlug: string;
  snapshot: StrategySnapshot;
  template: StagedPageTemplate;
}) {
  const pageId = slugify(pageSlug);
  const label = pageLabel.trim();

  if (!pageId) {
    throw new Error("Enter a valid page slug.");
  }

  if (!label) {
    throw new Error("Enter a page label.");
  }

  const strategyCopy = getStrategyCopyForPage(
    snapshot.fields,
    pageId,
    template.pageType,
  );
  const fields = [
    stagedField({
      id: `${pageId}.strategy.pageCopy`,
      kind: "copy",
      path: "strategy.pageCopy",
      value: strategyCopy,
    }),
    stagedField({
      id: `${pageId}.strategy.contentPlan`,
      kind: "meta",
      path: "strategy.contentPlan",
      value: snapshot.fields.contentPlan,
    }),
    stagedField({
      id: `${pageId}.strategy.strategyBrief`,
      kind: "meta",
      path: "strategy.strategyBrief",
      value: snapshot.fields.strategyBrief,
    }),
    ...template.sections.flatMap((section, index) => {
      const sectionId = `${String(index + 1).padStart(2, "0")}-${slugify(
        section.name || section.component,
      )}`;
      const templateFields = getTemplateCopyFieldsForSection(section);

      return [
        stagedField({
          id: `${pageId}.${sectionId}.contentDirection`,
          kind: "meta",
          path: `${sectionId}.contentDirection`,
          value: section.instruction,
        }),
        ...templateFields.map((field) =>
          stagedField({
            id: `${pageId}.${sectionId}.${field.name}`,
            kind: "copy",
            path: `${sectionId}.${field.name}`,
            value: "",
          }),
        ),
      ];
    }),
  ];

  return {
    fields,
    fieldCounts: countFields(fields),
    navigation: snapshot.navigation,
    pageHref: getPathFromSlug(pageId),
    pageId,
    pageLabel: label,
    previewHref: `/dev/staged-pages/${pageId}`,
    promotedAt: new Date().toISOString(),
    snapshot: {
      clientSlug: snapshot.clientSlug,
      createdAt: snapshot.createdAt,
      id: snapshot.id,
      version: snapshot.version,
    },
    sourceStage: "strategy-template",
    status: "staged",
    template: {
      id: template.id,
      name: template.name,
      pageType: template.pageType,
      sectionCount: template.sections.length,
      sections: template.sections,
    },
  } satisfies StagedPage;
}

function countFields(fields: StagedPageField[]) {
  return fields.reduce<Record<ContentFieldKind, number>>(
    (counts, field) => ({
      ...counts,
      [field.kind]: counts[field.kind] + 1,
    }),
    { copy: 0, image: 0, link: 0, meta: 0 },
  );
}

function stagedField(field: StagedPageField) {
  return field;
}
