import { readStagedPages } from "@/utils/staged-pages";
import { getSectionId } from "@/utils/section-id";

export type ContentEditorFieldKind = "copy" | "image" | "link" | "meta";

export type ContentEditorField = {
  id: string;
  kind: ContentEditorFieldKind;
  label: string;
  path: string;
  sourceId?: string;
  value: string;
};

export type ContentEditorSection = {
  id: string;
  label: string;
  fields: ContentEditorField[];
};

export type ContentEditorPage = {
  clientSlug: string;
  href: string;
  id: string;
  key: string;
  label: string;
  sections: ContentEditorSection[];
  sourceRecipe: string;
};

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
    sections?: Array<{
      component?: string;
      name?: string;
    }>;
  };
};
/**
 * Read at request time, not build time.
 *
 * This was previously a static `import ... from "./staged-pages.json"`, which
 * baked the data in at build time while /dev/staged-pages read the same records
 * at runtime - so the two surfaces could disagree about the same page, and the
 * Content Editor could show values that had already been superseded on disk.
 * Staged pages are now per-client files anyway, which a static import cannot
 * express.
 */
export async function getContentEditorPages(): Promise<ContentEditorPage[]> {
  const stagedPages = await readStagedPages();

  return (stagedPages as unknown as StagedEditorPage[]).map(
    mapStagedPageToContentEditorPage,
  );
}

function mapStagedPageToContentEditorPage(
  page: StagedEditorPage,
): ContentEditorPage {
  const pageId = page.pageId || "staged-page";
  const clientSlug = page.snapshot?.clientSlug || "staged-client";
  const fields = [
    ...(Array.isArray(page.fields) ? page.fields : []),
    ...getMissingImageRatioFields(page),
  ];
  const sectionsById = fields.reduce<Record<string, ContentEditorField[]>>(
    (sections, field) => {
      const sectionId = getSectionIdFromFieldPath(field.path);

      return {
        ...sections,
        [sectionId]: [
          ...(sections[sectionId] ?? []),
          {
            id: `${clientSlug}:${field.id}`,
            kind: field.kind,
            label: humanizePath(field.path.split(".").slice(1)),
            path: field.path,
            sourceId: field.id,
            value: field.value,
          },
        ],
      };
    },
    {},
  );

  return {
    clientSlug,
    href: page.pageHref ?? `/${pageId}`,
    id: pageId,
    key: `${clientSlug}:${pageId}`,
    label: page.pageLabel ?? humanize(pageId),
    sections: Object.entries(sectionsById).map(([sectionId, sectionFields]) => ({
      fields: sectionFields,
      id: sectionId,
      label: humanize(sectionId),
    })),
    sourceRecipe: formatStagedSource(page),
  };
}

function getMissingImageRatioFields(page: StagedEditorPage): StagedEditorField[] {
  const existingPaths = new Set((page.fields ?? []).map((field) => field.path));

  return (page.template?.sections ?? []).flatMap((section, index) => {
    const component = section.component?.toLowerCase() ?? "";

    if (
      !component.includes("herosplitfixedimage") &&
      !component.includes("contentsplitfixedimage")
    ) {
      return [];
    }

    const sectionId = getSectionId(section, index);
    const path = `${sectionId}.imageRatio`;

    return existingPaths.has(path)
      ? []
      : [
          {
            id: `${page.pageId}.${path}`,
            kind: "meta" as const,
            path,
            value: "",
          },
        ];
  });
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
