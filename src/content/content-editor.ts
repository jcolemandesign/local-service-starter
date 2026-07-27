import {
  getTemplateAssetFieldsForSection,
  readStagedPages,
} from "@/utils/staged-pages";
import { getSectionId } from "@/utils/section-id";
import {
  isAltStagedPage,
  type StagedPageVariant,
} from "@/utils/staged-page-variant";
import { getCanonicalSectionLabel } from "@/content/section-library-v3";
import {
  getSectionStyleFieldSpecs,
  styleFieldPrefix,
} from "@/content/section-style-options";
import { readStrategyPageSlots } from "@/utils/client-page-slots";
import { sortPagesBySitemap } from "@/utils/sitemap-page-order";
import { getTemplateCopyFieldsForSection } from "@/utils/template-copy-contract";

export type ContentEditorFieldKind = "copy" | "image" | "link" | "meta";

export type ContentEditorFieldFallback = {
  exact: boolean;
  source: "template-default" | "template-example";
  value: string;
};

export type ContentEditorField = {
  fallback?: ContentEditorFieldFallback;
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

type StagedEditorSection = {
  component?: string;
  instruction?: string;
  mode?: string;
  name?: string;
  ratio?: string;
  variant?: string;
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
    pageType?: string;
    sections?: StagedEditorSection[];
  };
  variant?: StagedPageVariant;
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
  const editorPages = stagedPages as unknown as StagedEditorPage[];
  const clientSlugs = Array.from(
    new Set(
      editorPages.map(
        (page) => page.snapshot?.clientSlug || "staged-client",
      ),
    ),
  );
  const pageSlotsByClient = new Map(
    await Promise.all(
      clientSlugs.map(async (clientSlug) => [
        clientSlug,
        await readStrategyPageSlots(clientSlug),
      ] as const),
    ),
  );
  const orderedPages = sortPagesBySitemap(
    editorPages,
    pageSlotsByClient,
    (page) => ({
      altIndex:
        page.variant?.role === "alt" ? page.variant.altIndex : undefined,
      basePageId:
        page.variant?.role === "alt" ? page.variant.basePageId : undefined,
      clientSlug: page.snapshot?.clientSlug || "staged-client",
      pageId: page.pageId || "staged-page",
      pageType: page.template?.pageType,
    }),
  );

  return orderedPages.map(mapStagedPageToContentEditorPage);
}

function mapStagedPageToContentEditorPage(
  page: StagedEditorPage,
): ContentEditorPage {
  const pageId = page.pageId || "staged-page";
  const clientSlug = page.snapshot?.clientSlug || "staged-client";
  const fields = [
    ...(Array.isArray(page.fields) ? page.fields : []),
    ...getMissingImageRatioFields(page),
    ...getMissingStyleFields(page),
  ];
  const fallbacksByPath = getFieldFallbacksByPath(page);
  const sectionLabelsById = getSectionLabelsById(page);
  const sectionsById = fields.reduce<Record<string, ContentEditorField[]>>(
    (sections, field) => {
      const sectionId = getSectionIdFromFieldPath(field.path);

      return {
        ...sections,
        [sectionId]: [
          ...(sections[sectionId] ?? []),
          {
            fallback: fallbacksByPath.get(field.path),
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
    // An alt carries its base page's label, so without the suffix the picker
    // shows two identical entries and there is no way to tell which one a save
    // lands on. Alts stay listed here - editing them is the point.
    label: getStagedEditorPageLabel(page, pageId),
    sections: Object.entries(sectionsById).map(([sectionId, sectionFields]) => ({
      fields: sectionFields,
      id: sectionId,
      label: sectionLabelsById.get(sectionId) ?? humanize(sectionId),
    })),
    sourceRecipe: formatStagedSource(page),
  };
}

/**
 * Section ids are derived from the frozen structural `name`, so humanizing one
 * shows whatever the section was called when the template was promoted - e.g.
 * "04 Sticky Card Stream Content". Resolve the display label from the component
 * instead, which is what every other builder surface shows.
 */
function getSectionLabelsById(page: StagedEditorPage) {
  const labels = new Map<string, string>();

  (page.template?.sections ?? []).forEach((section, index) => {
    const component = section.component?.trim() ?? "";

    if (!component) {
      return;
    }

    labels.set(
      getSectionId(section, index),
      getCanonicalSectionLabel(component, section.name?.trim() || component),
    );
  });

  return labels;
}

function getFieldFallbacksByPath(page: StagedEditorPage) {
  const fallbacks = new Map<string, ContentEditorFieldFallback>();

  (page.template?.sections ?? []).forEach((section, index) => {
    const component = section.component?.trim() ?? "";
    const mode = section.mode?.trim() ?? "";
    const name = section.name?.trim() ?? "";

    if (!component || !mode || !name) {
      return;
    }

    const normalizedSection = {
      component,
      instruction: section.instruction ?? "",
      mode,
      name,
      ratio: section.ratio,
      variant: section.variant,
    };
    const sectionId = getSectionId(normalizedSection, index);

    getTemplateCopyFieldsForSection(normalizedSection).forEach((field) => {
      const value = Array.isArray(field.example)
        ? field.example.join("\n")
        : field.example?.trim() ?? "";

      if (!value) {
        return;
      }

      fallbacks.set(`${sectionId}.${field.name}`, {
        exact: false,
        source: "template-example",
        value,
      });
    });

    getTemplateAssetFieldsForSection(normalizedSection).forEach((field) => {
      if (!field.value.trim()) {
        return;
      }

      fallbacks.set(`${sectionId}.${field.name}`, {
        exact: true,
        source: "template-default",
        value: field.value,
      });
    });
  });

  return fallbacks;
}

function getStagedEditorPageLabel(page: StagedEditorPage, pageId: string) {
  const label = page.pageLabel ?? humanize(pageId);

  if (!isAltStagedPage(page)) {
    return label;
  }

  const altIndex = page.variant?.altIndex;

  return altIndex ? `${label} (alt ${altIndex})` : `${label} (alt)`;
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

/**
 * Surfaces the per-section style overrides on pages that were staged before
 * these fields existed, so an older staged page gets the controls without
 * needing a restage. Mirrors `getMissingImageRatioFields`; both are additive
 * and seed an empty "inherit" value, so neither changes how a page renders
 * until the editor actually picks something.
 */
function getMissingStyleFields(page: StagedEditorPage): StagedEditorField[] {
  const existingPaths = new Set((page.fields ?? []).map((field) => field.path));

  return (page.template?.sections ?? []).flatMap((section, index) => {
    const sectionId = getSectionId(section, index);

    return getSectionStyleFieldSpecs(section.component ?? "")
      .map((spec) => `${sectionId}.${styleFieldPrefix}.${spec.name}`)
      .filter((path) => !existingPaths.has(path))
      .map((path) => ({
        id: `${page.pageId}.${path}`,
        kind: "meta" as const,
        path,
        value: "",
      }));
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
