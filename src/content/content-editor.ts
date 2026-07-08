import stagedPagesData from "./staged-pages.json";

export type ContentEditorFieldKind = "copy" | "image" | "link" | "meta";

export type ContentEditorField = {
  id: string;
  kind: ContentEditorFieldKind;
  label: string;
  path: string;
  value: string;
};

export type ContentEditorSection = {
  id: string;
  label: string;
  fields: ContentEditorField[];
};

export type ContentEditorPage = {
  href: string;
  id: string;
  label: string;
  sections: ContentEditorSection[];
  sourceRecipe: string;
};

type ContentRecord = Record<string, unknown>;
type StagedEditorField = {
  id: string;
  kind: ContentEditorFieldKind;
  path: string;
  value: string;
};
type StagedEditorPage = {
  fields?: StagedEditorField[];
  pageHref?: string;
  pageId?: string;
  pageLabel?: string;
  snapshot?: {
    clientSlug?: string;
    version?: number;
  };
  sourceStage?: string;
  template?: {
    name?: string;
  };
};
type StagedPagesFile = {
  pages?: StagedEditorPage[];
};

const stagedContentEditorPages = (stagedPagesData as StagedPagesFile).pages ?? [];
const mappedStagedContentEditorPages = stagedContentEditorPages.map(
  mapStagedPageToContentEditorPage,
);

const contentPageSources: Array<{
  content: ContentRecord;
  href: string;
  id: string;
  label: string;
}> = [];

export const contentEditorPages: ContentEditorPage[] = [
  ...mappedStagedContentEditorPages,
  ...contentPageSources.map((page) => {
    const content = page.content as ContentRecord;
    const source = content.source as ContentRecord | undefined;
    const sections = Object.entries(content)
      .filter(([sectionId]) => sectionId !== "source")
      .map(([sectionId, sectionValue]) => ({
        id: sectionId,
        label: humanize(sectionId),
        fields: collectFields({
          pageId: page.id,
          path: [],
          sectionId,
          value: sectionValue,
        }),
      }))
      .filter((section) => section.fields.length > 0);

    return {
      href: page.href,
      id: page.id,
      label: page.label,
      sections,
      sourceRecipe:
        typeof source?.sourceRecipe === "string"
          ? source.sourceRecipe
          : "unknown",
    };
  }),
];

function mapStagedPageToContentEditorPage(
  page: StagedEditorPage,
): ContentEditorPage {
  const pageId = page.pageId || "staged-page";
  const fields = Array.isArray(page.fields) ? page.fields : [];
  const sectionsById = fields.reduce<Record<string, ContentEditorField[]>>(
    (sections, field) => {
      const sectionId = getSectionIdFromFieldPath(field.path);

      return {
        ...sections,
        [sectionId]: [
          ...(sections[sectionId] ?? []),
          {
            id: field.id,
            kind: field.kind,
            label: humanizePath(field.path.split(".").slice(1)),
            path: field.path,
            value: field.value,
          },
        ],
      };
    },
    {},
  );

  return {
    href: page.pageHref ?? `/${pageId}`,
    id: pageId,
    label: page.pageLabel ?? humanize(pageId),
    sections: Object.entries(sectionsById).map(([sectionId, sectionFields]) => ({
      fields: sectionFields,
      id: sectionId,
      label: humanize(sectionId),
    })),
    sourceRecipe: formatStagedSource(page),
  };
}

function getSectionIdFromFieldPath(fieldPath: string) {
  return fieldPath.split(".")[0] || "strategy";
}

function formatStagedSource(page: StagedEditorPage) {
  if (page.sourceStage === "strategy-template") {
    const snapshotLabel = page.snapshot
      ? `${page.snapshot.clientSlug ?? "strategy"} v${page.snapshot.version ?? "?"}`
      : "strategy snapshot";
    const templateLabel = page.template?.name ?? "template";

    return `${snapshotLabel} / ${templateLabel}`;
  }

  return page.sourceStage ?? "staged page";
}

function collectFields({
  pageId,
  path,
  sectionId,
  value,
}: {
  pageId: string;
  path: Array<string | number>;
  sectionId: string;
  value: unknown;
}): ContentEditorField[] {
  if (typeof value === "string") {
    const fullPath = [sectionId, ...path];
    return [
      {
        id: `${pageId}.${fullPath.join(".")}`,
        kind: inferFieldKind(fullPath),
        label: humanizePath(path),
        path: fullPath.join("."),
        value,
      },
    ];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectFields({
        pageId,
        path: [...path, index],
        sectionId,
        value: item,
      }),
    );
  }

  if (value && typeof value === "object") {
    return Object.entries(value as ContentRecord).flatMap(([key, childValue]) =>
      collectFields({
        pageId,
        path: [...path, key],
        sectionId,
        value: childValue,
      }),
    );
  }

  return [];
}

function inferFieldKind(path: Array<string | number>): ContentEditorFieldKind {
  const normalizedPath = path.join(".").toLowerCase();

  if (
    normalizedPath.includes("alt") ||
    normalizedPath.includes("caption") ||
    normalizedPath.includes("imagelabel") ||
    normalizedPath.includes("note")
  ) {
    return "meta";
  }

  if (
    normalizedPath.includes("image") ||
    normalizedPath.includes("logo") ||
    normalizedPath.includes("photo")
  ) {
    return "image";
  }

  if (
    normalizedPath.includes("href") ||
    normalizedPath.includes("url") ||
    normalizedPath.includes("link")
  ) {
    return "link";
  }

  return "copy";
}

function humanizePath(path: Array<string | number>) {
  if (path.length === 0) {
    return "Value";
  }

  return path
    .map((part) => (typeof part === "number" ? String(part + 1) : humanize(part)))
    .join(" / ");
}

function humanize(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
