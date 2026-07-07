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

export async function removeStagedPage(pageId: string) {
  const pages = await readStagedPages();
  const nextPages = pages.filter((page) => page.pageId !== pageId);

  if (nextPages.length === pages.length) {
    throw new Error("Staged page not found.");
  }

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

export async function syncStagedPagesFromStrategySnapshot(
  snapshot: StrategySnapshot,
) {
  const pages = await readStagedPages();
  let syncedCount = 0;
  const nextPages = pages.map((page) => {
    if (
      page.snapshot.clientSlug !== snapshot.clientSlug ||
      page.sourceStage !== "strategy-template" ||
      !page.template
    ) {
      return page;
    }

    const strategyCopy = getStrategyCopyForPage(
      snapshot.fields,
      page.pageId,
      page.template.pageType,
    );
    const previousStrategyCopy =
      page.fields.find((field) => field.path === "strategy.pageCopy")?.value ??
      "";

    if (!strategyCopy.trim()) {
      return page;
    }

    syncedCount += 1;

    const nextFields = seedFieldsFromStrategyCopy(
      page.fields.map((field) => {
        if (field.path === "strategy.pageCopy") {
          return stagedField({
            ...field,
            value: strategyCopy,
          });
        }

        if (field.path === "strategy.contentPlan") {
          return stagedField({
            ...field,
            value: snapshot.fields.contentPlan,
          });
        }

        if (field.path === "strategy.strategyBrief") {
          return stagedField({
            ...field,
            value: snapshot.fields.strategyBrief,
          });
        }

        return field;
      }),
      strategyCopy,
      { overwriteExistingCopy: true, previousStrategyCopy },
    );

    return {
      ...page,
      fieldCounts: countFields(nextFields),
      fields: nextFields,
      navigation: snapshot.navigation,
      snapshot: {
        clientSlug: snapshot.clientSlug,
        createdAt: snapshot.createdAt,
        id: snapshot.id,
        version: snapshot.version,
      },
      status: "staged",
    } satisfies StagedPage;
  });

  if (syncedCount > 0) {
    await mkdir(path.dirname(stagedPagesPath), { recursive: true });
    await writeFile(
      stagedPagesPath,
      `${JSON.stringify({ pages: nextPages }, null, 2)}\n`,
    );
  }

  return {
    pages: nextPages,
    syncedCount,
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
  const fields = seedFieldsFromStrategyCopy(
    [
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
    ],
    strategyCopy,
  );

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

function seedFieldsFromStrategyCopy(
  fields: StagedPageField[],
  strategyCopy: string,
  options: {
    overwriteExistingCopy?: boolean;
    previousStrategyCopy?: string;
  } = {},
) {
  const keyedValues = parseKeyedCopyValues(strategyCopy);
  const previousKeyedValues = options.previousStrategyCopy
    ? parseKeyedCopyValues(options.previousStrategyCopy)
    : new Map<string, string>();

  if (keyedValues.size === 0) {
    return fields;
  }

  return fields.map((field) => {
    if (
      field.kind !== "copy" ||
      field.path.startsWith("strategy.") ||
      (!options.overwriteExistingCopy && field.value.trim().length > 0)
    ) {
      return field;
    }

    const key = getBulkPasteMatchKey(field, keyedValues);
    const value = key ? keyedValues.get(key) : "";
    const previousValue = key ? previousKeyedValues.get(key) : "";

    if (
      options.overwriteExistingCopy &&
      previousValue &&
      field.value.trim() &&
      field.value.trim() !== previousValue
    ) {
      return field;
    }

    return value
      ? stagedField({
          ...field,
          value,
        })
      : field;
  });
}

function parseKeyedCopyValues(text: string) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return new Map<string, string>();
  }

  const jsonValues = parseJsonCopyValues(trimmedText);

  if (jsonValues.size > 0) {
    return jsonValues;
  }

  return parseMarkdownCopyValues(extractBulkPasteCopy(trimmedText));
}

function parseJsonCopyValues(text: string) {
  const values = new Map<string, string>();

  try {
    flattenCopyValue(JSON.parse(text), [], values);
  } catch {
    return values;
  }

  return values;
}

function flattenCopyValue(
  value: unknown,
  path: string[],
  values: Map<string, string>,
) {
  if (typeof value === "string") {
    values.set(normalizeBulkPasteKey(path.join(".")), value.trim());
    return;
  }

  if (Array.isArray(value)) {
    values.set(
      normalizeBulkPasteKey(path.join(".")),
      value
        .map((item) =>
          typeof item === "string" ? item : JSON.stringify(item, null, 2),
        )
        .join("\n"),
    );
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([key, child]) => {
      flattenCopyValue(child, [...path, key], values);
    });
  }
}

function parseMarkdownCopyValues(text: string) {
  const values = new Map<string, string>();
  const lines = text.split(/\r?\n/);
  let currentSection = "";
  let currentKey = "";
  let currentValueLines: string[] = [];

  function commitCurrentValue() {
    if (!currentKey) {
      return;
    }

    const value = currentValueLines.join("\n").trim();

    if (value) {
      values.set(normalizeBulkPasteKey(currentKey), value);
    }

    currentKey = "";
    currentValueLines = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const headingMatch = line.match(/^#{2,4}\s+(.+)$/);

    if (headingMatch) {
      commitCurrentValue();
      currentSection = headingMatch[1].trim().split(/\s+/)[0] ?? "";
      continue;
    }

    const keyedMatch = line.match(
      /^\s*(?:[-*]\s*)?`?([A-Za-z0-9_.-]+)`?\s*:\s*(.*)$/,
    );

    if (keyedMatch) {
      commitCurrentValue();
      const rawKey = keyedMatch[1].trim();
      const fieldKey = rawKey.includes(".")
        ? rawKey
        : [currentSection, rawKey].filter(Boolean).join(".");

      currentKey = fieldKey;
      currentValueLines = [keyedMatch[2] ?? ""];
      continue;
    }

    if (currentKey) {
      currentValueLines.push(line);
    }
  }

  commitCurrentValue();

  return values;
}

export function extractBulkPasteCopy(text: string) {
  const lines = text.split(/\r?\n/);
  const bulkStartIndex = lines.findIndex((line) =>
    /^#{1,3}\s+Bulk Paste Copy\s*$/i.test(line.trim()),
  );

  if (bulkStartIndex < 0) {
    return stripHumanReviewSections(text);
  }

  const afterBulkStart = lines.slice(bulkStartIndex + 1);
  const nextReviewSectionIndex = afterBulkStart.findIndex(isHumanReviewHeading);
  const bulkLines =
    nextReviewSectionIndex >= 0
      ? afterBulkStart.slice(0, nextReviewSectionIndex)
      : afterBulkStart;

  return bulkLines.join("\n").trim();
}

function stripHumanReviewSections(text: string) {
  const lines = text.split(/\r?\n/);
  const reviewStartIndex = lines.findIndex(isHumanReviewHeading);

  return (reviewStartIndex >= 0 ? lines.slice(0, reviewStartIndex) : lines)
    .join("\n")
    .trim();
}

function isHumanReviewHeading(line: string) {
  return /^(?:#{1,3}\s+|\d+\.\s+)?(?:Copy Notes|Copy QA)\s*$/i.test(
    line.trim(),
  );
}

function getBulkPasteMatchKey(
  field: StagedPageField,
  keyedValues: Map<string, string>,
) {
  const sectionId = getSectionIdFromPath(field.path);
  const fieldName = field.path.split(".").at(-1) ?? field.path;
  const candidates = [
    field.path,
    `${sectionId}.${fieldName}`,
    field.id,
  ].map(normalizeBulkPasteKey);

  return candidates.find((candidate) => keyedValues.has(candidate));
}

function getSectionIdFromPath(fieldPath: string) {
  return fieldPath.split(".")[0] || "strategy";
}

function normalizeBulkPasteKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`"'[\]]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[:]+$/g, "");
}
