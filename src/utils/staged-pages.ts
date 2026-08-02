import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  SectionCardBorder,
  SectionCardFill,
  SectionColorRecipe,
} from "@/content/section-color-recipes";
import { sectionLibraryV3Content } from "@/content/section-library-v3";
import {
  getSectionStyleFieldSpecs,
  styleFieldPrefix,
} from "@/content/section-style-options";
import { readStrategyPageSlots } from "@/utils/client-page-slots";
import { getSectionId, getSectionIdRenames } from "@/utils/section-id";
import {
  getAltPageId,
  getBasePageId,
  getNextAltIndex,
  isAltStagedPage,
  type StagedPageVariant,
} from "@/utils/staged-page-variant";
import {
  baseStrategyPageSlots,
  getPathFromSlugForPageType,
  getStrategyCopyForPage,
  getStrategyPageCopyField,
  resolveStrategyCopyForPage,
  slugify,
  type StrategyCopySource,
  type StrategyNavigationItem,
  type StrategyPageDefinition,
} from "@/utils/strategy-site-map";
import type { StrategySnapshot } from "@/utils/strategy-snapshots";
import {
  getTemplateCopyContractStatus,
  getTemplateCopyFieldsForSection,
  getTemplateCopySectionFingerprint,
  getTemplateCopySectionStatuses,
  type TemplateCopySectionStatus,
} from "@/utils/template-copy-contract";

// Re-exported so staged-page consumers have one import site for the record and
// the vocabulary describing it; client components import the pure module
// directly, since this one reads the filesystem.
export {
  getActiveStagedPages,
  getAltStagedPages,
  getBasePageId,
  isAltStagedPage,
  type StagedPageVariant,
} from "@/utils/staged-page-variant";

export type ContentFieldKind = "copy" | "image" | "link" | "meta";

export type StagedPageField = {
  id: string;
  kind: ContentFieldKind;
  path: string;
  value: string;
};

export type StagedPageTemplateSection = {
  /** Card row placement on the 14-column grid - see `cardLinkGridAlignOptions`. */
  align?: string;
  cardBorder?: SectionCardBorder;
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
  cardLinks?: string;
  /** Marker icons on/off - see `iconsOptions` in `section-style-options`. */
  icons?: string;
  /** Headline wrap - see `headlineWrapOptions` in `section-style-options`. */
  headlineWrap?: string;
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
  variant?: StagedPageVariant;
};

export function getStagedPageKey(page: Pick<StagedPage, "pageId" | "snapshot">) {
  return `${page.snapshot.clientSlug}:${page.pageId}`;
}

/**
 * Moves a staged page to a different `pageId`.
 *
 * Every field id is `${pageId}.${field.path}` by construction, so the ids have
 * to be rebuilt alongside the page id or the content editor writes to fields
 * that no longer exist. `pageHref` is deliberately left alone: it is the public
 * address this page is a candidate for, which is the same address whether the
 * page is currently live or parked as an alt.
 */
export function rekeyStagedPage(
  page: StagedPage,
  nextPageId: string,
  variant: StagedPageVariant,
): StagedPage {
  return {
    ...page,
    fields: page.fields.map((field) => ({
      ...field,
      id: `${nextPageId}.${field.path}`,
    })),
    pageId: nextPageId,
    previewHref: `/dev/staged-pages/${nextPageId}`,
    variant,
  };
}

/**
 * Parks the page currently live at `basePageId` in the next free alt slot,
 * leaving that slug clear for an incoming template. Returns the archived page,
 * or undefined when nothing was staged there yet.
 */
export async function archiveStagedPageAsAlt(
  clientSlug: string,
  basePageId: string,
) {
  const pages = await readStagedPages();
  const current = pages.find(
    (page) =>
      page.pageId === basePageId &&
      page.snapshot.clientSlug === clientSlug &&
      !isAltStagedPage(page),
  );

  if (!current) {
    return undefined;
  }

  const altIndex = getNextAltIndex(pages, current);
  const alt = rekeyStagedPage(current, getAltPageId(basePageId, altIndex), {
    altIndex,
    archivedAt: new Date().toISOString(),
    basePageId,
    role: "alt",
  });
  const nextPages = pages.map((page) =>
    getStagedPageKey(page) === getStagedPageKey(current) ? alt : page,
  );

  await writeClientStagedPages(clientSlug, nextPages);

  return alt;
}

/**
 * Swaps an alt with the page currently live at its base slug: the alt takes the
 * base id, the live page takes the alt slot just vacated. A swap rather than a
 * renumber means both addresses stay valid and only their contents trade, so a
 * side-by-side comparison in two tabs survives the promotion.
 */
export async function promoteStagedPageAlt(
  clientSlug: string,
  altPageId: string,
) {
  const pages = await readStagedPages();
  const alt = pages.find(
    (page) => page.pageId === altPageId && page.snapshot.clientSlug === clientSlug,
  );

  if (!alt || !isAltStagedPage(alt)) {
    throw new Error("Alternate staged page not found.");
  }

  const basePageId = getBasePageId(alt);
  const altIndex = alt.variant?.altIndex ?? 1;
  const current = pages.find(
    (page) =>
      page.pageId === basePageId &&
      page.snapshot.clientSlug === clientSlug &&
      !isAltStagedPage(page),
  );
  const promoted = rekeyStagedPage(alt, basePageId, {
    basePageId,
    role: "active",
  });
  const demoted = current
    ? rekeyStagedPage(current, getAltPageId(basePageId, altIndex), {
        altIndex,
        archivedAt: new Date().toISOString(),
        basePageId,
        role: "alt",
      })
    : undefined;
  const swapped = new Map<string, StagedPage>([
    [getStagedPageKey(alt), promoted],
  ]);

  if (current && demoted) {
    swapped.set(getStagedPageKey(current), demoted);
  }

  const nextPages = pages.map(
    (page) => swapped.get(getStagedPageKey(page)) ?? page,
  );

  await writeClientStagedPages(clientSlug, nextPages);

  return { demoted, promoted };
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

/**
 * Writes a newly staged page and, when requested, archives the page it
 * replaces in the same staged-pages write. Building the candidate still
 * happens before this function so partial-section copy can read the current
 * page, but there is no intermediate file state where the active slug is
 * empty and only its alt remains.
 */
export async function replaceStagedPage(
  page: StagedPage,
  archiveCurrent: boolean,
) {
  const pages = await readStagedPages();
  const pageKey = getStagedPageKey(page);
  const current = pages.find(
    (candidate) =>
      getStagedPageKey(candidate) === pageKey && !isAltStagedPage(candidate),
  );
  const altIndex =
    archiveCurrent && current ? getNextAltIndex(pages, current) : undefined;
  const archivedAlt =
    current && altIndex !== undefined
      ? rekeyStagedPage(
          current,
          getAltPageId(current.pageId, altIndex),
          {
            altIndex,
            archivedAt: new Date().toISOString(),
            basePageId: current.pageId,
            role: "alt",
          },
        )
      : undefined;
  const nextPages = [
    page,
    ...(archivedAlt ? [archivedAlt] : []),
    ...pages.filter((candidate) => getStagedPageKey(candidate) !== pageKey),
  ];

  await writeClientStagedPages(page.snapshot.clientSlug, nextPages);

  return { archivedAlt, pages: nextPages };
}

/**
 * Removing the live page also removes its alts. They are alternate versions of
 * that page rather than pages in their own right, so leaving them behind would
 * strand records whose base slug no longer exists and which no surface groups
 * under anything. Removing an alt only removes that alt.
 */
export async function removeStagedPage(clientSlug: string, pageId: string) {
  const pages = await readStagedPages();
  const target = pages.find(
    (page) => page.pageId === pageId && page.snapshot.clientSlug === clientSlug,
  );
  const removesAlts = target ? !isAltStagedPage(target) : false;
  const removedKeys = new Set(
    pages
      .filter(
        (page) =>
          page.snapshot.clientSlug === clientSlug &&
          (page.pageId === pageId ||
            (removesAlts &&
              isAltStagedPage(page) &&
              getBasePageId(page) === pageId)),
      )
      .map(getStagedPageKey),
  );
  const nextPages = pages.filter(
    (page) => !removedKeys.has(getStagedPageKey(page)),
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
    if (!isStrategySyncTarget(page, snapshot.clientSlug, pageSlots)) {
      return page;
    }

    const template = page.template;

    if (!template) {
      return page;
    }

    // Synchronization is intentionally strict. Initial staging may fall back
    // to contentPlan/strategyBrief when a page has no dedicated copy yet, but
    // an existing page must resolve to its exact canonical slot before an
    // automatic sync may overwrite it. This also avoids substring collisions
    // such as an archived `blog-post-alt1` resolving to the earlier `blog`
    // slot in getStrategyCopyForPage's legacy/fuzzy lookup.
    const pageSlot = pageSlots.find((slot) => slot.id === page.pageId);

    if (!pageSlot) {
      return page;
    }

    const strategyCopy =
      (
        snapshot.fields[getStrategyPageCopyField(pageSlot)] ??
        snapshot.fields[pageSlot.copyField] ??
        ""
      ).trim();
    const previousStrategyCopy =
      page.fields.find((field) => field.path === "strategy.pageCopy")?.value ??
      "";

    if (!strategyCopy.trim()) {
      return page;
    }

    const contractStatus = getTemplateCopyContractStatus(
      strategyCopy,
      template.sections?.length
        ? {
            ...template,
            sections: template.sections,
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
      {
        overwriteExistingCopy: true,
        previousStrategyCopy,
        sectionIdByFingerprint: getSectionIdsByCopyFingerprint(
          page.template?.sections ?? [],
        ),
      },
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

export function isStrategySyncTarget(
  page: StagedPage,
  clientSlug: string,
  pageSlots: readonly StrategyPageDefinition[],
) {
  return (
    page.snapshot.clientSlug === clientSlug &&
    page.sourceStage === "strategy-template" &&
    Boolean(page.template) &&
    !isAltStagedPage(page) &&
    pageSlots.some((slot) => slot.id === page.pageId)
  );
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

      return [
        ...getTemplateAssetFieldsForSection(section),
        ...getTemplateStyleFieldsForSection(section),
      ].map((field) => [`${sectionId}.${field.name}`, field] as const);
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
      ...getTemplateStyleFieldsForSection(section),
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
      const assetFields = [
        ...getTemplateAssetFieldsForSection(section),
        ...getTemplateStyleFieldsForSection(section),
      ];

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
        sectionIdByFingerprint: getSectionIdsByCopyFingerprint(
          template.sections,
        ),
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
  const { copy: strategyCopy, source: strategyCopySource } =
    resolveStrategyCopyForPage(
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

  return {
    copySeeding: getCopySeedingSummary(
      strategyCopy,
      finalPage,
      strategyCopySource,
    ),
    finalPage,
    sectionStatuses,
    snapshot,
  };
}

export type CopySeedingSummary = {
  /** Which strategy field the seeding copy was read from. */
  copySource: StrategyCopySource;
  filledCopyFields: number;
  hasStrategyCopy: boolean;
  /** True when real page copy was supplied but did not reach a single field. */
  seededNothing: boolean;
  /**
   * True when the page staged empty only because no page copy exists yet, so
   * seeding fell back to whole-site planning prose. Expected, not a fault.
   */
  stagedWithoutPageCopy: boolean;
  totalCopyFields: number;
};

/**
 * Reports whether supplied batch copy actually reached any field.
 *
 * A paste that resolves nothing used to be indistinguishable from a successful
 * one: seeding leaves every field empty, the renderer falls back to
 * section-library demo content, and the stage still reports success. The only
 * way to notice was spotting demo prose in the preview. Callers surface this so
 * a total miss is visible at stage time instead.
 *
 * `copySource` keeps that alarm off the normal path. When no page copy exists,
 * `resolveStrategyCopyForPage` falls back to the content plan or strategy
 * brief - prose keyed by page name, never by section id - which cannot seed a
 * field by construction. Treating that as a failed paste flagged every
 * first-time stage as broken and told the user to go add `###` headings to a
 * document that already had dozens of them.
 */
export function getCopySeedingSummary(
  strategyCopy: string,
  page: Pick<StagedPage, "fields">,
  copySource: StrategyCopySource = "page",
): CopySeedingSummary {
  const copyFields = page.fields.filter(
    (field) => field.kind === "copy" && !field.path.startsWith("strategy."),
  );
  const filledCopyFields = copyFields.filter(
    (field) => field.value.trim().length > 0,
  ).length;
  const hasStrategyCopy = strategyCopy.trim().length > 0;
  const seededNoField =
    hasStrategyCopy && copyFields.length > 0 && filledCopyFields === 0;

  return {
    copySource,
    filledCopyFields,
    hasStrategyCopy,
    seededNothing: seededNoField && copySource === "page",
    stagedWithoutPageCopy: seededNoField && copySource !== "page",
    totalCopyFields: copyFields.length,
  };
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

/**
 * The copy-neutral style overrides a staged page can set per section.
 *
 * Seeded empty, which means "inherit the value pagebuilder saved on the
 * template". Only the axes that cannot change which fields a section renders
 * are offered - see `getSectionStyleFieldSpecs`. Because the staged preview and
 * the site export both render through `renderPageTemplateSection`, an override
 * honored by the preview is emitted by the export with no extra wiring.
 */
export function getTemplateStyleFieldsForSection(
  section: StagedPageTemplateSection,
): TemplateAssetField[] {
  return getSectionStyleFieldSpecs(section.component).map((spec) => ({
    kind: "meta" as const,
    name: `${styleFieldPrefix}.${spec.name}`,
    value: "",
  }));
}

export function getTemplateAssetFieldsForSection(
  section: StagedPageTemplateSection,
): TemplateAssetField[] {
  const component = section.component.toLowerCase();

  if (component.includes("heroserviceareaziplookup")) {
    return [
      {
        kind: "meta",
        name: "imageAlt",
        value: sectionLibraryV3Content.heroServiceAreaZipLookup.imageAlt,
      },
      {
        kind: "image",
        name: "imageSrc",
        value: sectionLibraryV3Content.heroServiceAreaZipLookup.imageSrc,
      },
    ];
  }

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

  if (component.includes("contentthreecolumnmixed")) {
    return sectionLibraryV3Content.contentThreeColumnMixed.images.flatMap(
      (image, index) => [
        {
          kind: "meta" as const,
          name: `images.${index + 1}.imageAlt`,
          value: image.imageAlt,
        },
        {
          kind: "image" as const,
          name: `images.${index + 1}.imageSrc`,
          value: image.imageSrc,
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

  // No imageRatio here, unlike the fixed-ratio twin below: this section crops
  // its image to fill a grid column that bleeds off the page edge, so there is
  // no frame to choose a ratio for.
  if (component.includes("contentsplitfullimage")) {
    return [
      {
        kind: "meta",
        name: "imageAlt",
        value: sectionLibraryV3Content.contentSplitFullImage.imageAlt,
      },
      {
        kind: "image",
        name: "imageSrc",
        value: sectionLibraryV3Content.contentSplitFullImage.imageSrc,
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

  // `herosplitbento` joins the no-ratio group for the same reason
  // `contentsplitfullimage` above does: its tile takes the tray's height and
  // crops, so there is no frame to choose a ratio for.
  if (
    component.includes("herosplitfullheight") ||
    component.includes("herosplitfixedimage") ||
    component.includes("herosplitbento") ||
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

  if (component.includes("ctaimage")) {
    return [
      {
        kind: "meta",
        name: "imageAlt",
        value: sectionLibraryV3Content.ctaImage.imageAlt,
      },
      {
        kind: "image",
        name: "imageSrc",
        value: sectionLibraryV3Content.ctaImage.imageSrc,
      },
    ];
  }

  if (component.includes("featuredoffer")) {
    return [
      {
        kind: "meta",
        name: "imageAlt",
        value: sectionLibraryV3Content.featuredOffer.imageAlt,
      },
      {
        kind: "image",
        name: "imageSrc",
        value: sectionLibraryV3Content.featuredOffer.imageSrc,
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

  if (component.includes("horizontalcardlinkgridtwoup")) {
    return imageCollectionFields(
      "items",
      sectionLibraryV3Content.horizontalCardLinkGridTwoUp.items,
    );
  }

  if (component.includes("horizontalcardlinkgrid")) {
    return imageCollectionFields(
      "items",
      sectionLibraryV3Content.horizontalCardLinkGrid.items,
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
    sectionIdByFingerprint?: ReadonlyMap<string, string>;
  } = {},
) {
  const keyedValues = parseKeyedCopyValues(
    strategyCopy,
    options.sectionIdByFingerprint,
  );
  const previousKeyedValues = options.previousStrategyCopy
    ? parseKeyedCopyValues(
        options.previousStrategyCopy,
        options.sectionIdByFingerprint,
      )
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

export function parseKeyedCopyValues(
  text: string,
  sectionIdByFingerprint?: ReadonlyMap<string, string>,
) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return new Map<string, string>();
  }

  const jsonValues = parseJsonCopyValues(trimmedText);

  if (jsonValues.size > 0) {
    return jsonValues;
  }

  return parseMarkdownCopyValues(
    extractBulkPasteCopy(trimmedText),
    sectionIdByFingerprint,
  );
}

/**
 * Maps each section's contract fingerprint to the section id its copy keys
 * belong under, so a paste that carries the `<!-- Section contract: ... -->`
 * comments can be split into sections even without `### <section-id>` headings.
 */
export function getSectionIdsByCopyFingerprint(
  sections: readonly StagedPageTemplateSection[],
) {
  const sectionIdByFingerprint = new Map<string, string>();

  sections.forEach((section, index) => {
    sectionIdByFingerprint.set(
      getTemplateCopySectionFingerprint(section),
      getSectionId(section, index),
    );
  });

  return sectionIdByFingerprint;
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

function parseMarkdownCopyValues(
  text: string,
  sectionIdByFingerprint?: ReadonlyMap<string, string>,
) {
  const values = new Map<string, string>();
  const lines = text.split(/\r?\n/);
  const knownSectionIds = new Set(sectionIdByFingerprint?.values() ?? []);
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

    // A section-contract comment is a second, stronger section delimiter. The
    // generated contract emits one per section and models reliably copy them
    // back even when they drop the `### <section-id>` heading - and without a
    // section scope every key is stored bare, so `heading` from three
    // different sections collide and nothing matches. The fingerprint also
    // identifies a section exactly, where the heading slug is derived from an
    // editable name.
    const fingerprintMatch = line.match(
      /<!--\s*Section contract:\s*(sc-v1-[A-Za-z0-9]+)\s*-->/,
    );
    const fingerprintSectionId = fingerprintMatch
      ? sectionIdByFingerprint?.get(fingerprintMatch[1])
      : undefined;

    if (fingerprintSectionId) {
      commitCurrentValue();
      currentSection = fingerprintSectionId;
      continue;
    }

    // A bare section id on its own line - the same `02-fullscreen-image-hero`
    // a heading would carry, just without the `###`. Unhandled, it is neither
    // a heading nor a `key: value` pair, so it falls through to the
    // continuation branch below and is appended to the *previous* field's
    // value: every section's last field ends up with the next section's id
    // stuck on it, which then renders on the page.
    if (knownSectionIds.has(line.trim())) {
      commitCurrentValue();
      currentSection = line.trim();
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
