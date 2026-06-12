export type ContentEditorFieldKind = "copy" | "image" | "link";

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

const contentPageSources: Array<{
  content: ContentRecord;
  href: string;
  id: string;
  label: string;
}> = [];

export const contentEditorPages: ContentEditorPage[] = contentPageSources.map(
  (page) => {
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
        typeof source?.sourceRecipe === "string" ? source.sourceRecipe : "unknown",
    };
  },
);

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
