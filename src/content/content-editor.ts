import {
  createdAboutContent,
  createdHomepage1Content,
  createdHomepage2Content,
  createdIndividualServicePageContent,
  createdServicesContent,
} from "@/content/created-pages";

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

const createdPageSources = [
  {
    id: "homepage1",
    label: "homepage1",
    href: "/created-pages/homepage1",
    content: createdHomepage1Content,
  },
  {
    id: "homepage2",
    label: "homepage2",
    href: "/created-pages/homepage2",
    content: createdHomepage2Content,
  },
  {
    id: "about",
    label: "about",
    href: "/created-pages/about",
    content: createdAboutContent,
  },
  {
    id: "services",
    label: "services",
    href: "/created-pages/services",
    content: createdServicesContent,
  },
  {
    id: "individual-service-page",
    label: "individual service page",
    href: "/created-pages/individual-service-page",
    content: createdIndividualServicePageContent,
  },
] as const;

export const contentEditorPages: ContentEditorPage[] = createdPageSources.map(
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
