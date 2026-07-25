import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  SectionCardFill,
  SectionColorRecipe,
} from "@/content/section-color-recipes";
import { sectionLibraryV3Content } from "@/content/section-library-v3";
import { readStrategyPageSlots } from "@/utils/client-page-slots";
import { getSectionId, getSectionIdRenames } from "@/utils/section-id";
import {
  baseStrategyPageSlots,
  getPathFromSlugForPageType,
  getStrategyCopyForPage,
  slugify,
  type StrategyNavigationItem,
  type StrategyPageDefinition,
} from "@/utils/strategy-site-map";
import type { StrategySnapshot } from "@/utils/strategy-snapshots";
import {
  getTemplateCopyContractStatus,
  getTemplateCopyFieldsForSection,
  getTemplateCopySectionStatuses,
  type TemplateCopySectionStatus,
} from "@/utils/template-copy-contract";

export type ContentFieldKind = "copy" | "image" | "link" | "meta";

export type StagedPageField = {
  id: string;
  kind: ContentFieldKind;
  path: string;
  value: string;
};

export type StagedPageTemplateSection = {
  cardFill?: SectionCardFill;
  colorRecipe?: SectionColorRecipe;
  component: string;
  instruction: string;
  mode: string;
  name: string;
  originalComponent?: string;
  originalIndex?: number;
  reduceBottomPadding?: boolean;
  reduceTopPadding?: boolean;
  ratio?: string;
  /** Stable rename anchor - see `SlottedSection` in @/utils/section-id. */
  slotId?: string;
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
  template?: {
    id: string;
    name: string;
    pageType: string;
    sectionCount: number;
    sections?: StagedPageTemplateSection[];
  };
};

export function getStagedPageKey(page: Pick<StagedPage, "pageId" | "snapshot">) {
  return `${page.snapshot.clientSlug}:${page.pageId}`;
}

type StagedPagesFile = {
  pages?: StagedPage[];
};

const projectsPath = path.join(process.cwd(), "src", "content", "projects");

/**
 * Staged pages are stored per client, alongside that client's strategy
 * snapshots and export state, rather than in one global file.
 *
 * The single file was rewritten whole on every field save (~640 lines per
 * page), so one keystroke-save produced an unreviewable diff spanning every
 * client, and two clients could collide on a shared dedupe key. Partitioning
 * keeps the diffable/revertable property that makes JSON persistence workable
 * here while removing the scaling wall.
 */
function getClientStagedPagesPath(clientSlug: string) {
  return path.join(projectsPath, clientSlug, "staged-pages.json");
}

/**
 * Every consumer reaches straight for `page.snapshot.clientSlug`,
 * `page.fields`, and `page.pageId`, so a record missing any of them crashes the
 * surface reading it rather than failing where the bad data was written. These
 * files are also hand-editable and hand-edited.
 *
 * Skip malformed records loudly instead of trusting the `as` cast. Dropping a
 * page is visible (it disappears from the list); a thrown error would take down
 * every staged-page surface because of one bad record.
 */
function isValidStagedPage(value: unknown): value is StagedPage {
  if (!value || typeof value !== "object") return false;

  const page = value as Partial<StagedPage>;

  return (
    typeof page.pageId === "string" &&
    page.pageId.length > 0 &&
    Array.isArray(page.fields) &&
    typeof page.snapshot === "object" &&
    page.snapshot !== null &&
    typeof page.snapshot.clientSlug === "string" &&
    page.snapshot.clientSlug.length > 0
  );
}

async function readClientStagedPages(clientSlug: string) {
  let contents: string;

  try {
    contents = await readFile(getClientStagedPagesPath(clientSlug), "utf8");
  } catch {
    return [];
  }

  let parsed: StagedPagesFile;

  try {
    parsed = JSON.parse(contents) as StagedPagesFile;
  } catch (error) {
    console.warn(
      `[staged-pages] ${clientSlug}/staged-pages.json is not valid JSON and was skipped:`,
      error instanceof Error ? error.message : error,
    );
    return [];
  }

  if (!Array.isArray(parsed.pages)) return [];

  const valid: StagedPage[] = [];

  parsed.pages.forEach((page, index) => {
    if (isValidStagedPage(page)) {
      valid.push(page);
      return;
    }

    console.warn(
      `[staged-pages] ${clientSlug}/staged-pages.json: skipped malformed page at index ${index} (needs pageId, fields[], and snapshot.clientSlug).`,
    );
  });

  return valid;
}

export async function listStagedPageClientSlugs() {
  try {
    const entries = await readdir(projectsPath, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}

export async function readStagedPages() {
  const clientSlugs = await listStagedPageClientSlugs();
  const perClient = await Promise.all(
    clientSlugs.map((clientSlug) => readClientStagedPages(clientSlug)),
  );

  return perClient.flat();
}

/**
 * Writes only the affected client's file. `pages` is the full cross-client set;
 * everything belonging to another client is left untouched on disk.
 */
async function writeClientStagedPages(clientSlug: string, pages: StagedPage[]) {
  const clientPages = pages.filter(
    (page) => page.snapshot?.clientSlug === clientSlug,
  );
  const target = getClientStagedPagesPath(clientSlug);

  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(
    target,
    `${JSON.stringify({ pages: clientPages }, null, 2)}\n`,
  );
}

export async function writeStagedPage(page: StagedPage) {
  const pages = await readStagedPages();
  const pageKey = getStagedPageKey(page);
  const nextPages = [
    page,
    ...pages.filter((currentPage) => getStagedPageKey(currentPage) !== pageKey),
  ];

  await writeClientStagedPages(page.snapshot.clientSlug, nextPages);

  return nextPages;
}

export async function removeStagedPage(clientSlug: string, pageId: string) {
  const pages = await readStagedPages();
  const nextPages = pages.filter(
    (page) =>
      page.pageId !== pageId || page.snapshot.clientSlug !== clientSlug,
  );

  if (nextPages.length === pages.length) {
    throw new Error("Staged page not found.");
  }

  await writeClientStagedPages(clientSlug, nextPages);

  return nextPages;
}

export async function updateStagedPageFields(
  clientSlug: string,
  pageId: string,
  fields: StagedPageField[],
) {
  const pages = await readStagedPages();
  const page = pages.find(
    (currentPage) =>
      currentPage.pageId === pageId &&
      currentPage.snapshot.clientSlug === clientSlug,
  );

  if (!page) {
    throw new Error("Staged page not found.");
  }

  const currentFields = reconcileTemplateCopyFields(page, page.fields);
  const fieldsById = new Map(fields.map((field) => [field.id, field]));
  const nextFields = currentFields.map((field) => {
    const nextField = fieldsById.get(field.id);

    return nextField
      ? stagedField({
          id: field.id,
          kind: field.kind,
          path: field.path,
          value: sanitizeStagedFieldValue(field, nextField.value),
        })
      : field;
  });
  const nextPage: StagedPage = {
    ...page,
    fieldCounts: countFields(nextFields),
    fields: nextFields,
  };
  const nextPages = [
    nextPage,
    ...pages.filter(
      (currentPage) => getStagedPageKey(currentPage) !== getStagedPageKey(page),
    ),
  ];

  await writeClientStagedPages(clientSlug, nextPages);

  return {
    page: nextPage,
    pages: nextPages,
  };
}

export async function syncStagedPagesFromStrategySnapshot(
  snapshot: StrategySnapshot,
) {
  const pages = await readStagedPages();
  const pageSlots = await readStrategyPageSlots(snapshot.clientSlug);
  let syncedCount = 0;
  const syncedPageIds: string[] = [];
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
      pageSlots,
    );
    const previousStrategyCopy =
      page.fields.find((field) => field.path === "strategy.pageCopy")?.value ??
      "";

    if (!strategyCopy.trim()) {
      return page;
    }

    const contractStatus = getTemplateCopyContractStatus(
      strategyCopy,
      page.template.sections?.length
        ? {
            ...page.template,
            sections: page.template.sections,
          }
        : undefined,
    );

    if (contractStatus !== "current") {
      return page;
    }

    syncedCount += 1;
    syncedPageIds.push(page.pageId);

    const reconciledFields = reconcileTemplateCopyFields(page, page.fields);
    const nextFields = seedFieldsFromStrategyCopy(
      reconciledFields.map((field) => {
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
    } satisfies StagedPage;
  });

  if (syncedCount > 0) {
    await writeClientStagedPages(snapshot.clientSlug, nextPages);
  }

  return {
    pages: nextPages,
    syncedCount,
    syncedPageIds,
  };
}

function reconcileTemplateCopyFields(
  page: StagedPage,
  fields: StagedPageField[],
) {
  const sections = page.template?.sections;

  if (!sections?.length) {
    return fields;
  }

  const assetFieldsByPath = new Map<string, TemplateAssetField>(
    sections.flatMap((section, index) => {
      const sectionId = getSectionId(section, index);

      return getTemplateAssetFieldsForSection(section).map((field) => [
        `${sectionId}.${field.name}`,
        field,
      ] as const);
    }),
  );
  const nextFields = fields.map((field) => {
    const assetField = assetFieldsByPath.get(field.path);

    if (!assetField) {
      return field;
    }

    return stagedField({
      ...field,
      kind: assetField.kind,
      value:
        field.kind === "copy" || !field.value.trim()
          ? assetField.value
          : field.value,
    });
  });
  const existingPaths = new Set(nextFields.map((field) => field.path));

  sections.forEach((section, index) => {
    const sectionId = getSectionId(section, index);
    const missingFields = [
      ...getTemplateCopyFieldsForSection(section).map((field) => ({
        kind: "copy" as const,
        name: field.name,
        value: "",
      })),
      ...getTemplateAssetFieldsForSection(section),
    ]
      .filter((field) => !existingPaths.has(`${sectionId}.${field.name}`))
      .map((field) =>
        stagedField({
          id: `${page.pageId}.${sectionId}.${field.name}`,
          kind: field.kind,
          path: `${sectionId}.${field.name}`,
          value: field.value,
        }),
      );

    if (missingFields.length === 0) {
      return;
    }

    const sectionFieldIndexes = nextFields
      .map((field, fieldIndex) =>
        field.path.startsWith(`${sectionId}.`) ? fieldIndex : -1,
      )
      .filter((fieldIndex) => fieldIndex >= 0);
    const insertionIndex =
      sectionFieldIndexes.length > 0
        ? Math.max(...sectionFieldIndexes) + 1
        : nextFields.length;

    nextFields.splice(insertionIndex, 0, ...missingFields);
    missingFields.forEach((field) => existingPaths.add(field.path));
  });

  return nextFields;
}

export function buildStrategyTemplateStagedPage({
  applyBatchCopy = true,
  pageLabel,
  pageSlots = baseStrategyPageSlots,
  pageSlug,
  snapshot,
  template,
}: {
  applyBatchCopy?: boolean;
  pageLabel: string;
  /** The client's sitemap. Defaults to the shared skeleton. */
  pageSlots?: readonly StrategyPageDefinition[];
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
    pageSlots,
  );
  const templateFields = [
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
      const sectionId = getSectionId(section, index);
      const sectionFields = getTemplateCopyFieldsForSection(section);
      const assetFields = getTemplateAssetFieldsForSection(section);

      return [
        stagedField({
          id: `${pageId}.${sectionId}.contentDirection`,
          kind: "meta",
          path: `${sectionId}.contentDirection`,
          value: section.instruction,
        }),
        ...sectionFields.map((field) =>
          stagedField({
            id: `${pageId}.${sectionId}.${field.name}`,
            kind: "copy",
            path: `${sectionId}.${field.name}`,
            value: "",
          }),
        ),
        ...assetFields.map((field) =>
          stagedField({
            id: `${pageId}.${sectionId}.${field.name}`,
            kind: field.kind,
            path: `${sectionId}.${field.name}`,
            value: field.value,
          }),
        ),
      ];
    }),
  ];
  // Only seed fields belonging to sections whose pasted copy is verified as
  // "current" for this template. A section that is stale/unverified/empty is
  // left blank here rather than seeded with copy that may belong to a
  // different component - the same-position partial-restaging and
  // section-scoped application described in the staged-copy workflow handoff.
  const sectionStatuses = getTemplateCopySectionStatuses(
    strategyCopy,
    template,
  );
  const currentSectionOrdinals = new Set(
    sectionStatuses
      .filter((sectionStatus) => sectionStatus.status === "current")
      .map((sectionStatus) => sectionStatus.ordinal),
  );
  const fields = applyBatchCopy
    ? seedFieldsFromStrategyCopy(templateFields, strategyCopy, {
        allowedSectionOrdinals: currentSectionOrdinals,
      })
    : templateFields;

  return {
    fields,
    fieldCounts: countFields(fields),
    navigation: snapshot.navigation,
    pageHref: getPathFromSlugForPageType(pageId, template.pageType),
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
    template: {
      id: template.id,
      name: template.name,
      pageType: template.pageType,
      sectionCount: template.sections.length,
      sections: template.sections,
    },
  } satisfies StagedPage;
}

/**
 * Builds the same candidate page the "stage" action writes, without writing
 * it: build the page with batch copy applied, merge in any previously staged
 * values for sections whose freshly-built copy isn't current. Safe to call
 * from a preview action since `readStagedPages()` is a read.
 */
export async function buildStagedPageCandidate({
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
  const pageSlots = await readStrategyPageSlots(snapshot.clientSlug);
  const page = buildStrategyTemplateStagedPage({
    pageLabel,
    pageSlots,
    pageSlug,
    snapshot,
    template,
  });
  const stagedPages = await readStagedPages();
  const previousPage = stagedPages.find(
    (existingPage) =>
      getStagedPageKey(existingPage) ===
      getStagedPageKey({ pageId: page.pageId, snapshot: page.snapshot }),
  );
  // Must resolve copy exactly the way buildStrategyTemplateStagedPage does.
  // These statuses decide which sections the merge is allowed to overwrite,
  // and that seeding used the same statuses to decide what to write. Reading
  // `pageCopy.<slug>` directly instead diverges in two real cases: a page with
  // no matching strategy slot (explicit is empty, but getStrategyCopyForPage
  // falls back to contentPlan/strategyBrief), and a fuzzy slot match where the
  // slot id differs from the page slug (the explicit key points at a field
  // that does not exist). In both, every section looks non-current, the merge
  // restores all previous values over the freshly seeded ones, and the user
  // gets a success message for a refresh that changed nothing.
  const strategyCopy = getStrategyCopyForPage(
    snapshot.fields,
    page.pageId,
    template.pageType,
    pageSlots,
  );
  const sectionStatuses = getTemplateCopySectionStatuses(
    strategyCopy,
    template,
  );
  // Follow renamed/reordered slots to their new section ids before merging,
  // since the merge matches by path and would otherwise silently preserve
  // nothing for those sections.
  const previousFields = previousPage
    ? remapFieldPathsForRenamedSections(
        previousPage.fields,
        getSectionIdRenames(
          previousPage.template?.sections ?? [],
          template.sections,
        ),
        page.pageId,
      )
    : undefined;
  const mergedFields = mergePreservingIncompatibleSections(
    page.fields,
    previousFields,
    sectionStatuses,
  );
  const finalPage: StagedPage = {
    ...page,
    fieldCounts: countFields(mergedFields),
    fields: mergedFields,
  };

  return { finalPage, sectionStatuses, snapshot };
}

/**
 * Rewrites a previously staged page's field paths onto the section ids the
 * incoming template uses, for every slot whose derived id changed.
 *
 * This runs before the path-keyed merge below. Without it, a renamed or
 * reordered section presents the merge with nothing to match: the old fields
 * are not carried forward and not deleted either, they are simply never read
 * again while the section renders demo content. That is what happened to
 * section 07 of the About page (recovered in d109015).
 *
 * Field `id` is regenerated alongside `path` so the two stay consistent - they
 * are both derived from the section id at build time.
 */
export function remapFieldPathsForRenamedSections(
  fields: StagedPageField[],
  renames: Map<string, string>,
  pageId: string,
) {
  if (renames.size === 0) {
    return fields;
  }

  return fields.map((field) => {
    const [sectionId, ...rest] = field.path.split(".");
    const nextSectionId = sectionId ? renames.get(sectionId) : undefined;

    if (!nextSectionId || rest.length === 0) {
      return field;
    }

    const nextPath = [nextSectionId, ...rest].join(".");

    return stagedField({
      ...field,
      id: `${pageId}.${nextPath}`,
      path: nextPath,
    });
  });
}

/**
 * Restores a previously staged page's field values for any section whose
 * freshly-built copy is not verified as "current" (stale/unverified/empty),
 * so a same-position restage only overwrites the sections that actually have
 * good new copy instead of blanking sections that were fine before. Matching
 * is by field path, so callers must remap renamed sections first - see
 * `remapFieldPathsForRenamedSections`.
 */
export function mergePreservingIncompatibleSections(
  nextFields: StagedPageField[],
  previousFields: StagedPageField[] | undefined,
  sectionStatuses: TemplateCopySectionStatus[],
) {
  if (!previousFields?.length) {
    return nextFields;
  }

  const nonCurrentOrdinals = new Set(
    sectionStatuses
      .filter((sectionStatus) => sectionStatus.status !== "current")
      .map((sectionStatus) => sectionStatus.ordinal),
  );

  if (nonCurrentOrdinals.size === 0) {
    return nextFields;
  }

  const previousFieldsByPath = new Map(
    previousFields.map((field) => [field.path, field]),
  );

  return nextFields.map((field) => {
    const ordinal = getSectionIdFromPath(field.path).match(/^(\d+)-/)?.[1];

    if (!ordinal || !nonCurrentOrdinals.has(ordinal)) {
      return field;
    }

    return previousFieldsByPath.get(field.path) ?? field;
  });
}

export function countFields(fields: StagedPageField[]) {
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

type TemplateAssetField = {
  kind: "image" | "meta";
  name: string;
  value: string;
};

export function getTemplateAssetFieldsForSection(
  section: StagedPageTemplateSection,
): TemplateAssetField[] {
  const component = section.component.toLowerCase();

  if (component.includes("projectcasestudygallery")) {
    return sectionLibraryV3Content.projectCaseStudyGallery.slides.flatMap(
      (slide, index) => [
        {
          kind: "meta" as const,
          name: `slides.${index + 1}.imageAlt`,
          value: slide.imageAlt,
        },
        {
          kind: "image" as const,
          name: `slides.${index + 1}.imageSrc`,
          value: slide.imageSrc,
        },
      ],
    );
  }

  if (component.includes("contentstickycardstream")) {
    return [
      {
        kind: "meta",
        name: "imageAlt",
        value: sectionLibraryV3Content.contentStickyCardStream.imageAlt,
      },
      {
        kind: "image",
        name: "imageSrc",
        value: sectionLibraryV3Content.contentStickyCardStream.imageSrc,
      },
    ];
  }

  if (component.includes("contentnarrativefeaturerail")) {
    return [
      {
        kind: "meta",
        name: "imageAlt",
        value: sectionLibraryV3Content.contentNarrativeFeatureRail.imageAlt,
      },
      {
        kind: "image",
        name: "imageSrc",
        value: sectionLibraryV3Content.contentNarrativeFeatureRail.imageSrc,
      },
    ];
  }

  if (component.includes("contentsplitfixedimage")) {
    return [
      {
        kind: "meta",
        name: "imageRatio",
        value: "",
      },
      {
        kind: "meta",
        name: "imageAlt",
        value: sectionLibraryV3Content.contentSplitFixedImage.imageAlt,
      },
      {
        kind: "image",
        name: "imageSrc",
        value: sectionLibraryV3Content.contentSplitFixedImage.imageSrc,
      },
    ];
  }

  if (
    component.includes("herosplitfullheight") ||
    component.includes("herosplitfixedimage") ||
    component.includes("herocontenttopimagebottom")
  ) {
    return [
      ...(component.includes("herosplitfixedimage")
        ? [
            {
              kind: "meta" as const,
              name: "imageRatio",
              value: "",
            },
          ]
        : []),
      {
        kind: "meta",
        name: "imageAlt",
        value: sectionLibraryV3Content.heroSplitFullHeight.imageAlt,
      },
      {
        kind: "image",
        name: "imageSrc",
        value: sectionLibraryV3Content.heroSplitFullHeight.imageSrc,
      },
    ];
  }

  if (component.includes("herocompactservice")) {
    return [
      {
        kind: "meta",
        name: "imageAlt",
        value: sectionLibraryV3Content.heroCompactService.imageAlt,
      },
      {
        kind: "image",
        name: "imageSrc",
        value: sectionLibraryV3Content.heroCompactService.imageSrc,
      },
    ];
  }

  if (component.includes("heroservices")) {
    return [
      {
        kind: "meta",
        name: "imageAlt",
        value: sectionLibraryV3Content.heroServices.imageAlt,
      },
      {
        kind: "image",
        name: "imageSrc",
        value: sectionLibraryV3Content.heroServices.imageSrc,
      },
    ];
  }

  if (component.includes("servicesbentocards")) {
    return imageCollectionFields(
      "items",
      sectionLibraryV3Content.servicesBento.items,
    );
  }

  if (component.includes("fourcardlinkgrid")) {
    return imageCollectionFields(
      "items",
      sectionLibraryV3Content.fourCardLinkGrid.items,
    );
  }

  if (component.includes("threecardlinkgrid")) {
    return imageCollectionFields(
      "items",
      sectionLibraryV3Content.threeCardLinkGrid.items,
    );
  }

  if (component.includes("servicesthreecardsright")) {
    return imageCollectionFields(
      "priorityServices",
      sectionLibraryV3Content.servicesThreeCardsRight.priorityServices,
    );
  }

  if (component.includes("photogallerycarousel")) {
    return sectionLibraryV3Content.contentPhotoGalleryCarousel.images.flatMap(
      (image, index) => [
        {
          kind: "meta" as const,
          name: `images.${index + 1}.alt`,
          value: image.alt,
        },
        {
          // Rendered under each photo, so it is client-facing copy. The mapper
          // already read it; nothing declared it, so every gallery shipped the
          // demo caption.
          kind: "meta" as const,
          name: `images.${index + 1}.caption`,
          value: image.caption,
        },
        {
          kind: "image" as const,
          name: `images.${index + 1}.src`,
          value: image.src,
        },
      ],
    );
  }

  if (component.includes("imagestrip")) {
    return sectionLibraryV3Content.imageStrip.images.flatMap((image, index) => [
      {
        kind: "meta" as const,
        name: `images.${index + 1}.alt`,
        value: image.alt,
      },
      {
        kind: "image" as const,
        name: `images.${index + 1}.src`,
        value: image.src,
      },
    ]);
  }

  return [];
}

/**
 * Alt text is declared alongside the image, the same way `slides.*` and
 * `images.*` already do it. Without it the mapper still rendered an alt, but no
 * spec asked anyone to write one - so every card shipped the demo library's alt
 * text ("Service image placeholder") to real clients.
 */
function imageCollectionFields(
  collectionName: string,
  items: ReadonlyArray<{ imageAlt?: string; imageSrc: string }>,
): TemplateAssetField[] {
  return items.flatMap((item, index) => [
    {
      kind: "meta" as const,
      name: `${collectionName}.${index + 1}.imageAlt`,
      value: item.imageAlt ?? "",
    },
    {
      kind: "image" as const,
      name: `${collectionName}.${index + 1}.imageSrc`,
      value: item.imageSrc,
    },
  ]);
}

function sanitizeStagedFieldValue(field: StagedPageField, value: string) {
  if (shouldStripHumanReviewSections(field.path, value)) {
    return stripHumanReviewSections(value);
  }

  return value;
}

function shouldStripHumanReviewSections(fieldPath: string, value: string) {
  const normalizedPath = fieldPath.toLowerCase();

  return (
    hasHumanReviewSection(value) &&
    !normalizedPath.startsWith("strategy.") &&
    (normalizedPath.endsWith(".legalline") ||
      normalizedPath.endsWith(".copyright"))
  );
}

function seedFieldsFromStrategyCopy(
  fields: StagedPageField[],
  strategyCopy: string,
  options: {
    allowedSectionOrdinals?: Set<string>;
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
      (!options.overwriteExistingCopy && field.value.trim().length > 0) ||
      !isSectionOrdinalAllowed(field.path, options.allowedSectionOrdinals)
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
      field.value.trim() !== previousValue &&
      !hasHumanReviewSection(field.value)
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
      const normalizedSection = normalizeBulkPasteKey(currentSection);
      const normalizedRawKey = normalizeBulkPasteKey(rawKey);
      const fieldKey =
        currentSection &&
        !normalizedRawKey.startsWith(`${normalizedSection}.`)
          ? `${currentSection}.${rawKey}`
          : rawKey;

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

function hasHumanReviewSection(text: string) {
  return text.split(/\r?\n/).some(isHumanReviewHeading);
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
    ...getBulkPasteSectionAliases(sectionId).map(
      (sectionAlias) => `${sectionAlias}.${fieldName}`,
    ),
    field.id,
  ].map(normalizeBulkPasteKey);
  const exactMatch = candidates.find((candidate) => keyedValues.has(candidate));

  if (exactMatch) {
    return exactMatch;
  }

  const sectionOrdinal = sectionId.match(/^(\d+)-/)?.[1];

  if (!sectionOrdinal) {
    return undefined;
  }

  const compatibleFieldNames = getCompatibleBulkPasteFieldNames(fieldName);

  for (const compatibleFieldName of compatibleFieldNames) {
    const normalizedSuffix = `.${normalizeBulkPasteKey(compatibleFieldName)}`;
    const ordinalMatch = Array.from(keyedValues.keys()).find(
      (key) =>
        key.startsWith(`${sectionOrdinal}-`) && key.endsWith(normalizedSuffix),
    );

    if (ordinalMatch) {
      return ordinalMatch;
    }
  }

  return undefined;
}

function getCompatibleBulkPasteFieldNames(fieldName: string) {
  const normalizedFieldName = normalizeBulkPasteKey(fieldName);
  const aliases: Record<string, string[]> = {
    body: ["intro", "description", "paragraphs"],
    decisionitems: ["items", "supportingitems", "steps", "notes"],
    details: ["supportingitems", "items", "notes", "decisionitems"],
    faqs: ["items", "serviceitems", "supportingitems"],
    helpertext: ["secondaryaction", "sectionaction"],
    intro: ["body", "description", "paragraphs"],
    items: [
      "supportingitems",
      "decisionitems",
      "serviceitems",
      "steps",
      "notes",
      "faqs",
      "proofpoints",
    ],
    primaryaction: ["sectionaction"],
    proofpoints: ["items", "supportingitems", "notes"],
    sectionaction: ["primaryaction", "secondaryaction"],
    steps: ["supportingitems", "items", "decisionitems", "notes"],
    supportingitems: [
      "items",
      "notes",
      "decisionitems",
      "steps",
      "serviceitems",
      "proofpoints",
    ],
  };

  return [normalizedFieldName, ...(aliases[normalizedFieldName] ?? [])];
}

function getSectionIdFromPath(fieldPath: string) {
  return fieldPath.split(".")[0] || "strategy";
}

function isSectionOrdinalAllowed(
  fieldPath: string,
  allowedSectionOrdinals: Set<string> | undefined,
) {
  if (!allowedSectionOrdinals) {
    return true;
  }

  const ordinal = getSectionIdFromPath(fieldPath).match(/^(\d+)-/)?.[1];

  return ordinal ? allowedSectionOrdinals.has(ordinal) : false;
}

function getBulkPasteSectionAliases(sectionId: string) {
  const aliases = new Set<string>();

  if (sectionId.includes("stacked-feature-cards")) {
    aliases.add(sectionId.replace("stacked-feature-cards", "asymmetric-feature-cards"));
  }

  if (sectionId.includes("asymmetric-feature-cards")) {
    aliases.add(sectionId.replace("asymmetric-feature-cards", "stacked-feature-cards"));
  }

  return Array.from(aliases);
}

function normalizeBulkPasteKey(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`"'[\]]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[:]+$/g, "");
}
