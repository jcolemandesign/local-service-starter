import { execFile } from "node:child_process";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  symlink,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { isValidElement } from "react";
import {
  getStagedPageRenderData,
  type StagedPageRenderData,
} from "@/components/sections/StagedPageCanvas";
import {
  renderPageTemplateSection,
  resolveSectionStyleOverrides,
} from "@/components/sections/PageTemplatePreview";
import { resolveSectionColorRecipe } from "@/content/section-color-recipes";
import {
  buildBackgroundConfigStyle,
  resolveBackgroundConfig,
} from "@/content/background-config";
import {
  resolveBackgroundImage,
  resolveBackgroundTreatment,
  resolveCardFill,
  treatmentUsesGroundImage,
} from "@/content/section-style-options";
import {
  exportManifestFile,
  listGeneratedFiles,
  readExportManifest,
  updateExportedSite,
} from "@/utils/site-export-update";
import { readSiteExportState } from "@/utils/site-export-state";
import {
  getActiveStagedPages,
  getTemplateAssetFieldsForSection,
  readStagedPages,
  type StagedPage,
} from "@/utils/staged-pages";
import { groupSectionsIntoBands, withBandRecipe } from "@/utils/section-bands";
import { getSectionId } from "@/utils/section-id";
import {
  getTemplateCopyFieldsForSection,
  isSiteChromeSection,
} from "@/utils/template-copy-contract";
import { sanitizeClientSlug } from "@/utils/strategy-workspace";
import type { SiteIdentity } from "@/content/site-identity";
import { readSiteIdentity } from "@/utils/site-identity";

type ExportIssue = {
  code: string;
  message: string;
  pageId?: string;
  sectionId?: string;
};

type ResolvedSection = {
  cardBorder: string;
  cardFill: string;
  colorRecipe: string;
  component: string;
  contentKey: string;
  /** `"join"` shares the background of the section above - see
   *  `groupSectionsIntoBands`. */
  joinAbove: string;
  /** Ground texture - see `backgroundTreatment` in `section-style-options`. */
  backgroundTreatment: string;
  /** Sanitised ground image path, empty unless the treatment is `image`. */
  backgroundImage: string;
  /** Sanitised gradient tuning, null when the section keeps the CSS default. */
  backgroundConfig: import("@/content/background-config").BackgroundConfig | null;
  mode: string;
  props: Record<string, unknown>;
  reduceBottomPadding: boolean;
  reduceTopPadding: boolean;
  sectionId: string;
  sourcePath: string;
};

type ResolvedPage = {
  page: StagedPage;
  sections: ResolvedSection[];
};

export type SiteExportAnalysis = {
  approvedPageCount: number;
  clientSlug: string;
  componentFiles: string[];
  dependencyFiles: string[];
  issues: ExportIssue[];
  pages: Array<{
    pageHref: string;
    pageId: string;
    pageLabel: string;
    sections: string[];
  }>;
  ready: boolean;
  warnings: string[];
};

export type SiteExportResult = SiteExportAnalysis & {
  manifestPath: string;
  outputPath: string;
};

/**
 * `create` refuses to touch an existing directory. `update` refreshes a site
 * that has already been exported - and usually launched - in place.
 */
export type SiteExportMode = "create" | "update";

const execFileAsync = promisify(execFile);
const sourceRoot = path.join(process.cwd(), "src");
const sectionRoot = path.join(sourceRoot, "components", "sections");
const builderOnlyPrefixes = [
  "src/app/dev/",
  "src/app/api/",
  "src/components/sections/Pagebuilder",
  "src/components/sections/ContentEditor",
  "src/components/sections/PromptLibrary",
  "src/components/sections/StrategyWorkspace",
  "src/components/sections/StagedPage",
  "src/components/sections/StyleGuide",
  // Staged pages now live under src/content/projects/<clientSlug>/, which the
  // prefix above already covers.
  "src/content/projects/",
];

export async function analyzeSiteExport(
  requestedClientSlug: string,
): Promise<SiteExportAnalysis> {
  const result = await resolveSiteExport(requestedClientSlug);

  return toAnalysis(result);
}

export async function exportClientSite(
  requestedClientSlug: string,
  { mode = "create" }: { mode?: SiteExportMode } = {},
): Promise<SiteExportResult> {
  const resolved = await resolveSiteExport(requestedClientSlug);
  const analysis = toAnalysis(resolved);

  if (!analysis.ready) {
    throw new SiteExportValidationError(analysis);
  }

  const exportRoot = path.resolve(
    process.env.CLIENT_EXPORT_ROOT ??
      path.join(process.cwd(), "exports", "client-sites"),
  );
  const outputPath = path.join(exportRoot, resolved.clientSlug);
  const destinationExists = await pathExists(outputPath);

  await mkdir(exportRoot, { recursive: true });

  if (mode === "create" && destinationExists) {
    throw new Error(
      `Export destination already exists: ${outputPath}. Re-export with mode "update" to refresh it in place, or move it before regenerating.`,
    );
  }

  if (mode === "update" && !destinationExists) {
    throw new Error(
      `Nothing to update at ${outputPath}. Run a normal export first.`,
    );
  }

  const previousManifest =
    mode === "update" ? await readExportManifest(outputPath) : null;

  if (mode === "update" && !previousManifest) {
    throw new Error(
      `${outputPath} has no ${exportManifestFile} written by this tool, so it will not be modified. Move it aside and run a normal export.`,
    );
  }

  if (previousManifest && previousManifest.clientSlug !== resolved.clientSlug) {
    throw new Error(
      `${outputPath} was exported for "${previousManifest.clientSlug}", not "${resolved.clientSlug}". Refusing to overwrite another client's site.`,
    );
  }

  const tempPath = await mkdtemp(
    path.join(exportRoot, `.${resolved.clientSlug}-export-`),
  );

  try {
    await writeGeneratedSite(tempPath, resolved);
    await verifyGeneratedSite(tempPath);
    await rm(path.join(tempPath, ".next"), { force: true, recursive: true });

    if (mode === "update") {
      await updateExportedSite(tempPath, outputPath, previousManifest);
      await rm(tempPath, { force: true, recursive: true });
    } else {
      await rename(tempPath, outputPath);
    }
  } catch (error) {
    await rm(tempPath, { force: true, recursive: true });
    throw error;
  }

  return {
    ...analysis,
    manifestPath: path.join(outputPath, exportManifestFile),
    outputPath,
  };
}


export class SiteExportValidationError extends Error {
  analysis: SiteExportAnalysis;

  constructor(analysis: SiteExportAnalysis) {
    super("Site export validation failed.");
    this.analysis = analysis;
  }
}

async function resolveSiteExport(requestedClientSlug: string) {
  const clientSlug = sanitizeClientSlug(requestedClientSlug);

  if (!clientSlug) {
    throw new Error("Missing client slug.");
  }

  const [allPages, state, componentRegistry, siteIdentity] = await Promise.all([
    readStagedPages(),
    readSiteExportState(clientSlug),
    buildComponentRegistry(),
    // Read once for the whole export: the nav logo and footer business name are
    // client-level, so every page's chrome resolves from the same value.
    readSiteIdentity(clientSlug),
  ]);
  // Archived alts are never exportable - they are alternates of a slug the
  // site already fills. Dropping them here means a stale approval naming an
  // alt reports as a missing approved page instead of exporting two pages to
  // the same address.
  const clientPages = getActiveStagedPages(allPages).filter(
    (page) => page.snapshot.clientSlug === clientSlug,
  );
  const approvedPages = state.approvedPageIds
    .map((pageId) => clientPages.find((page) => page.pageId === pageId))
    .filter((page): page is StagedPage => Boolean(page));
  const issues: ExportIssue[] = [];
  const warnings: string[] = [];
  const resolvedPages: ResolvedPage[] = [];

  if (state.approvedPageIds.length === 0) {
    issues.push({
      code: "no-approved-pages",
      message: "Approve at least one staged page before exporting.",
    });
  }

  for (const approvedPageId of state.approvedPageIds) {
    if (!clientPages.some((page) => page.pageId === approvedPageId)) {
      issues.push({
        code: "missing-approved-page",
        message: `Approved page ${approvedPageId} no longer exists in staging.`,
        pageId: approvedPageId,
      });
    }
  }

  if (!state.styleTokenCss.trim()) {
    issues.push({
      code: "missing-style-snapshot",
      message: "Approve a page after promoting the Style Guide to freeze its tokens.",
    });
  }

  for (const page of approvedPages) {
    validateStagedFields(page, issues);
    validatePlaceholderAssets(page, issues);
    const renderData = getStagedPageRenderData(page, clientPages);
    const sections = resolvePageSections(
      page,
      renderData,
      clientPages,
      componentRegistry,
      issues,
      siteIdentity,
    );

    resolvedPages.push({ page, sections });
  }

  const componentFiles = Array.from(
    new Set(
      resolvedPages.flatMap((page) =>
        page.sections.map((section) => section.sourcePath),
      ),
    ),
  ).sort();
  const dependencyFiles = await collectDependencyClosure([
    ...componentFiles.map((file) =>
      path.join(/*turbopackIgnore: true*/ process.cwd(), file),
    ),
    path.join(sourceRoot, "components", "request-service", "index.ts"),
    path.join(sourceRoot, "app", "fonts.ts"),
  ]);

  for (const file of dependencyFiles) {
    const relativePath = toPosix(path.relative(process.cwd(), file));

    if (builderOnlyPrefixes.some((prefix) => relativePath.startsWith(prefix))) {
      issues.push({
        code: "builder-only-dependency",
        message: `Exportable component dependency crosses into builder-only code: ${relativePath}`,
      });
    }
  }

  await validateReferencedAssets(resolvedPages, issues);

  if (!resolvedPages.some(({ page }) => page.pageHref === "/")) {
    warnings.push("No approved homepage was found; the generated root route will be absent.");
  }

  const deadLinks = findDeadInternalLinks(resolvedPages);

  if (deadLinks.length > 0) {
    warnings.push(
      `${deadLinks.length} link(s) point to routes this export does not generate and will 404: ${deadLinks
        .slice(0, 8)
        .join(", ")}${deadLinks.length > 8 ? ", ..." : ""}. Approve those pages or remove the links before launch.`,
    );
  }

  const sampleFields = findSampleMarkedFields(approvedPages);

  if (sampleFields.length > 0) {
    warnings.push(
      `${sampleFields.length} field(s) still contain a [SAMPLE] marker and must be replaced before launch: ${sampleFields
        .slice(0, 8)
        .join(", ")}${sampleFields.length > 8 ? ", ..." : ""}`,
    );
  }

  return {
    clientSlug,
    componentFiles,
    dependencyFiles: dependencyFiles.map((file) =>
      toPosix(path.relative(process.cwd(), file)),
    ),
    issues: dedupeIssues(issues),
    resolvedPages,
    state,
    warnings,
  };
}

function toAnalysis(resolved: Awaited<ReturnType<typeof resolveSiteExport>>) {
  return {
    approvedPageCount: resolved.resolvedPages.length,
    clientSlug: resolved.clientSlug,
    componentFiles: resolved.componentFiles,
    dependencyFiles: resolved.dependencyFiles,
    issues: resolved.issues,
    pages: resolved.resolvedPages.map(({ page, sections }) => ({
      pageHref: page.pageHref,
      pageId: page.pageId,
      pageLabel: page.pageLabel,
      sections: sections.map((section) => section.component),
    })),
    ready: resolved.issues.length === 0,
    warnings: resolved.warnings,
  } satisfies SiteExportAnalysis;
}

/**
 * Section ids whose copy and links come from site identity rather than page
 * copy, so an empty field there is correct rather than unfinished.
 *
 * Nav and footer hold the business name, phone, primary action, footer contact
 * block and link lists. Those are set once per client and resolved at render
 * time, which is exactly why the copy prompt skips these sections - see
 * `isSiteChromeSection`. Their page-level fields are therefore empty on every
 * page by design.
 */
function getSiteChromeSectionIds(page: StagedPage) {
  return new Set(
    (page.template?.sections ?? [])
      .map((section, index) => ({ id: getSectionId(section, index), section }))
      .filter(({ section }) => isSiteChromeSection(section))
      .map(({ id }) => id),
  );
}

/**
 * Copy paths the current contract still asks for, per section.
 *
 * A field the contract no longer declares is left behind on the staged page
 * when a spec changes - moving `reviewLabel` and `reviewDetail` onto the
 * fullscreen hero stranded both on every other hero. The value stays on disk,
 * holding whatever the last copy run wrote, including NEEDS REVIEW, and blocks
 * an export over copy for a badge the section does not render.
 *
 * Skipping them is safe because an undeclared field is provably dead: the
 * demo-content leak guard renders every catalog section from its declared
 * fields alone and its KNOWN_GAPS list is empty, so no mapper reads a field the
 * contract does not declare. Nothing undeclared can reach a page.
 */
/**
 * Every copy path a section's specs declare, split by whether the contract
 * lets the field be left empty.
 *
 * Asset specs carry no optional flag, so their alt text and captions are all
 * required.
 */
function getDeclaredCopyPaths(page: StagedPage) {
  const declared = new Set<string>();
  const optional = new Set<string>();

  (page.template?.sections ?? []).forEach((section, index) => {
    const sectionId = getSectionId(section, index);

    for (const field of getTemplateCopyFieldsForSection(section)) {
      const fieldPath = `${sectionId}.${field.name}`;

      declared.add(fieldPath);

      if (field.optional) {
        optional.add(fieldPath);
      }
    }

    // Asset specs cover alt text and captions, which are stored as copy.
    for (const field of getTemplateAssetFieldsForSection(section)) {
      declared.add(`${sectionId}.${field.name}`);
    }
  });

  return { declared, optional };
}

/**
 * Whether a declared copy field still needs an answer.
 *
 * `optional: true` on a field spec is not advisory - the prompt passes it to
 * the copywriter verbatim ("OPTIONAL. Omit when the card does not need it"),
 * and `getTemplateCopySectionStatuses` already excludes optional fields when
 * deciding whether a section's copy is complete. But staging seeds every
 * declared field, optional ones included, so a field the copywriter was told
 * to omit arrives here as an empty string. Reading that as unresolved refuses
 * to export a page whose copy is exactly what the contract asked for, and the
 * message tells the user to resolve a field that is meant to stay blank.
 *
 * A NEEDS REVIEW marker still blocks either way. The copywriter reached for
 * the field and reported missing source material, which is a different answer
 * from declining to use the field at all.
 */
export function isUnresolvedCopy(value: string, { optional = false } = {}) {
  const trimmed = value.trim();

  return /\bNEEDS REVIEW\b/i.test(trimmed) || (!trimmed && !optional);
}

/**
 * Surfaces stand-in copy that is well-formed enough to pass every gate.
 *
 * `NEEDS REVIEW` blocks an export, which is correct for a field nobody has
 * answered yet - but it also makes a page unexportable, so it cannot be used
 * for copy that deliberately stands in while the pipeline is being tested. The
 * `[SAMPLE]` convention exists for that, and by design it passes validation.
 *
 * That is precisely why it needs surfacing. A `[SAMPLE]` disclosure on a
 * financing calculator is a plausible, well-formed sentence that is not true,
 * and no other check in this file looks for untrue - only for missing,
 * malformed, or left at a library default. This warns on every dry run and
 * every export without blocking either.
 */
function findSampleMarkedFields(pages: StagedPage[]) {
  return pages.flatMap((page) =>
    page.fields
      .filter(
        (field) =>
          field.kind !== "meta" &&
          !field.path.startsWith("strategy.") &&
          /\[SAMPLE\b/i.test(field.value),
      )
      .map((field) => `${page.pageId}/${field.path}`),
  );
}

function validateStagedFields(page: StagedPage, issues: ExportIssue[]) {
  // Without this the export refuses every site it is given. North Star had 192
  // empty required copy fields, and 180 of them were nav and footer fields
  // that are supposed to be empty - so the gate blocked on its own convention.
  const chromeSectionIds = getSiteChromeSectionIds(page);
  const { declared: declaredCopyPaths, optional: optionalCopyPaths } =
    getDeclaredCopyPaths(page);

  for (const field of page.fields) {
    if (field.kind === "meta" || field.path.startsWith("strategy.")) {
      continue;
    }

    // Left over from an earlier version of a spec. Scoped to copy: an orphaned
    // image or link would still be worth surfacing, but an orphaned copy field
    // cannot render, so blocking an export on its contents is blocking on data
    // nothing reads.
    if (field.kind === "copy" && !declaredCopyPaths.has(field.path)) {
      continue;
    }

    // Images are still checked on chrome sections. Only copy and links resolve
    // from site identity; an image there would be a real gap. As it happens
    // nav and footer declare no asset fields at all, so this is a guard
    // against a future one rather than a live case.
    if (
      chromeSectionIds.has(field.path.split(".")[0]) &&
      (field.kind === "copy" || field.kind === "link")
    ) {
      continue;
    }

    const value = field.value.trim();

    if (
      field.kind === "copy" &&
      isUnresolvedCopy(value, { optional: optionalCopyPaths.has(field.path) })
    ) {
      issues.push({
        code: "unresolved-copy",
        message: `Resolve copy field ${field.path}.`,
        pageId: page.pageId,
        sectionId: field.path.split(".")[0],
      });
    }

    if (field.kind === "link" && (!value || value === "#")) {
      issues.push({
        code: "unresolved-link",
        message: `Resolve link field ${field.path}.`,
        pageId: page.pageId,
        sectionId: field.path.split(".")[0],
      });
    }

    if (field.kind === "image" && !value) {
      issues.push({
        code: "unresolved-image",
        message: `Resolve image field ${field.path}.`,
        pageId: page.pageId,
        sectionId: field.path.split(".")[0],
      });
    }
  }
}

/**
 * Blocks an export whose images are still the section library's own.
 *
 * `validateStagedFields` only catches an image field that is empty. A field
 * holding `/images/fpo-image.svg` is populated and well-formed, so it passed -
 * and the section then rendered its FPO placeholder, a grey gradient box
 * labelled "Texture" or "Process", onto a live client site. That is the most
 * visible templatization tell the export can emit, and more obvious to an
 * ordinary visitor than anything in the generated source.
 *
 * A placeholder is identified by comparing against the asset contract's own
 * default rather than a list of filenames: `getTemplateAssetFieldsForSection`
 * carries the library value for each field, so a value still equal to it was
 * never replaced. A blocklist would go stale the moment a sample asset was
 * renamed; this cannot.
 *
 * A missing field counts too. The mapper falls back to library demo content
 * when a field is absent, so an unwritten image field renders exactly the same
 * placeholder as an unchanged one.
 */
function validatePlaceholderAssets(page: StagedPage, issues: ExportIssue[]) {
  const sections = page.template?.sections ?? [];
  const valueByPath = new Map(
    page.fields.map((field) => [field.path, field.value.trim()]),
  );

  sections.forEach((section, index) => {
    const sectionId = getSectionId(section, index);
    const assetFields = getTemplateAssetFieldsForSection(section);

    for (const spec of assetFields) {
      // An optional asset is allowed to stay empty - the ground image is the
      // only one so far, and a section renders complete without it.
      if (spec.kind !== "image" || spec.optional) {
        continue;
      }

      const staged = valueByPath.get(`${sectionId}.${spec.name}`);
      const isUnchanged = staged === undefined || staged === spec.value.trim();

      if (!isUnchanged) {
        continue;
      }

      issues.push({
        code: "placeholder-image",
        message: `Replace the placeholder image at ${sectionId}.${spec.name} with a real asset before exporting.`,
        pageId: page.pageId,
        sectionId,
      });
    }
  });
}

function resolvePageSections(
  page: StagedPage,
  renderData: StagedPageRenderData,
  clientPages: StagedPage[],
  componentRegistry: Map<string, string>,
  issues: ExportIssue[],
  siteIdentity: SiteIdentity,
) {
  /**
   * The ground colour each section renders against, once bands are accounted
   * for. A band member's own recipe never paints, so its component has to be
   * given the band's or it styles its text and cards for a ground that is not
   * there. Resolved up front because this loop is flat and cannot otherwise see
   * which run a section belongs to.
   */
  type SectionRecipe = ReturnType<
    typeof resolveSectionStyleOverrides
  >["colorRecipe"];
  const bandRecipeBySection = new Map<string, SectionRecipe>();

  groupSectionsIntoBands(
    renderData.sections.map((section) =>
      resolveSectionStyleOverrides(
        section,
        renderData.fieldsBySection[section.id ?? ""] ?? [],
      ),
    ),
  ).forEach((band) => {
    withBandRecipe(band).forEach((section) => {
      bandRecipeBySection.set(section.id ?? "", section.colorRecipe);
    });
  });

  return renderData.sections.flatMap((section, index) => {
    const sourcePath = componentRegistry.get(section.component);

    if (!sourcePath || section.component === "UnknownSection") {
      issues.push({
        code: "unsupported-section",
        message: `${section.component} has no exportable implementation.`,
        pageId: page.pageId,
        sectionId: section.id,
      });
      return [];
    }

    const sectionFields = renderData.fieldsBySection[section.id ?? ""] ?? [];
    // The frame below is rebuilt rather than rendered, so it has to read the
    // same style-resolved section the component props were built from - not the
    // raw template section, which is blind to staged overrides.
    const resolvedSection = {
      ...resolveSectionStyleOverrides(section, sectionFields),
      colorRecipe: bandRecipeBySection.get(section.id ?? ""),
    };
    const element = renderPageTemplateSection(
      resolvedSection,
      index,
      sectionFields,
      publicNavigationLinks(renderData.navigationLinks, clientPages),
      publicHref(renderData.homeHref, clientPages),
      siteIdentity,
    );

    if (!isValidElement(element)) {
      issues.push({
        code: "unresolved-section-props",
        message: `${section.component} did not resolve to a React element.`,
        pageId: page.pageId,
        sectionId: section.id,
      });
      return [];
    }

    let props: Record<string, unknown>;

    try {
      props = pruneOptionalPlaceholderLinks(
        normalizeSerializable(element.props),
      ) as Record<string, unknown>;
    } catch (error) {
      issues.push({
        code: "non-serializable-section-props",
        message:
          error instanceof Error
            ? `${section.component}: ${error.message}`
            : `${section.component} has non-serializable props.`,
        pageId: page.pageId,
        sectionId: section.id,
      });
      return [];
    }

    validateResolvedReferences(page, section.id ?? section.component, props, issues);

    return [
      {
        cardBorder: resolvedSection.cardBorder ?? "on",
        cardFill: resolveCardFill(section.component, resolvedSection.cardFill),
        colorRecipe:
          resolveSectionColorRecipe(resolvedSection.colorRecipe) ?? "default",
        component: section.component,
        contentKey: `section${String(index + 1).padStart(2, "0")}`,
        joinAbove: resolvedSection.joinAbove ?? "",
        backgroundTreatment: resolveBackgroundTreatment(
          resolvedSection.backgroundTreatment,
        ),
        // Read off the same staged fields the component props were built from,
        // so a ground image set on a staged page reaches the export the way any
        // other asset does.
        backgroundImage: treatmentUsesGroundImage(
          resolveBackgroundTreatment(resolvedSection.backgroundTreatment),
        )
          ? resolveBackgroundImage(
              sectionFields.find((field) =>
                field.path.endsWith(".backgroundImage"),
              )?.value,
            )
          : "",
        // Sanitised here rather than at emit time, so anything malformed in a
        // saved template degrades to the stylesheet default instead of being
        // written into the exported source.
        backgroundConfig: resolveBackgroundConfig(
          resolvedSection.backgroundConfig,
        ),
        mode: section.mode,
        props,
        reduceBottomPadding: Boolean(resolvedSection.reduceBottomPadding),
        reduceTopPadding: Boolean(resolvedSection.reduceTopPadding),
        sectionId: section.id ?? `section-${index + 1}`,
        sourcePath,
      } satisfies ResolvedSection,
    ];
  });
}

function validateResolvedReferences(
  page: StagedPage,
  sectionId: string,
  value: unknown,
  issues: ExportIssue[],
  keyPath: string[] = [],
) {
  if (typeof value === "string") {
    const key = keyPath.at(-1)?.toLowerCase() ?? "";

    if (key.includes("href") && (!value.trim() || value.trim() === "#")) {
      issues.push({
        code: "unresolved-rendered-link",
        message: `Resolve rendered link ${keyPath.join(".")}.`,
        pageId: page.pageId,
        sectionId,
      });
    }

    if (
      /(image|photo|logo|src)/.test(key) &&
      !value.trim()
    ) {
      issues.push({
        code: "unresolved-rendered-image",
        message: `Resolve rendered image ${keyPath.join(".")}.`,
        pageId: page.pageId,
        sectionId,
      });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      validateResolvedReferences(page, sectionId, item, issues, [
        ...keyPath,
        String(index),
      ]),
    );
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) =>
      validateResolvedReferences(page, sectionId, child, issues, [
        ...keyPath,
        key,
      ]),
    );
  }
}

function publicNavigationLinks(
  links: StagedPageRenderData["navigationLinks"],
  pages: StagedPage[],
) {
  return links.map((link) => ({
    ...link,
    href: publicHref(link.href, pages),
    items: link.items?.map((item) => ({
      ...item,
      href: publicHref(item.href, pages) ?? item.href,
    })),
  }));
}

function publicHref(value: string | undefined, pages: StagedPage[]) {
  if (!value) {
    return value;
  }

  const previewMatch = value.match(/^\/dev\/staged-pages\/([^?]+)/);

  if (!previewMatch) {
    return value;
  }

  return (
    pages.find((page) => page.pageId === previewMatch[1])?.pageHref ??
    `/${previewMatch[1]}`
  );
}

async function writeGeneratedSite(
  outputPath: string,
  resolved: Awaited<ReturnType<typeof resolveSiteExport>>,
) {
  await Promise.all([
    mkdir(path.join(outputPath, "src", "app"), { recursive: true }),
    mkdir(path.join(outputPath, "public"), { recursive: true }),
  ]);

  for (const dependencyPath of resolved.dependencyFiles) {
    const sourcePath = path.join(
      /*turbopackIgnore: true*/ process.cwd(),
      dependencyPath,
    );
    const destinationPath = path.join(outputPath, dependencyPath);

    await mkdir(path.dirname(destinationPath), { recursive: true });

    // Text source is rewritten rather than copied so its builder vocabulary
    // matches the renamed stylesheet. In shipped sections this only reaches
    // comments - none of them emit the attributes themselves - but a comment
    // pointing at `.pagebuilder-section-frame` in a client repo describes a
    // selector that no longer exists there.
    if (/\.(ts|tsx|js|jsx|mjs|css)$/.test(dependencyPath)) {
      const contents = await readFile(sourcePath, "utf8");

      await writeFile(destinationPath, neutralizeBuilderVocabulary(contents));
    } else {
      await copyFile(sourcePath, destinationPath);
    }
  }

  const sourceGlobals = await readFile(
    path.join(sourceRoot, "app", "globals.css"),
    "utf8",
  );
  const frozenGlobals = neutralizeBuilderVocabulary(
    freezeStyleTokens(sourceGlobals, resolved.state.styleTokenCss),
  );

  await writeFile(
    path.join(outputPath, "src", "app", "globals.css"),
    frozenGlobals,
  );
  await writeFile(
    path.join(outputPath, "src", "app", "layout.tsx"),
    buildRootLayout(resolved.clientSlug),
  );
  await writeFile(
    path.join(outputPath, "src", "app", "not-found.tsx"),
    buildNotFoundPage(),
  );
  await writeFile(
    path.join(outputPath, "src", "app", "robots.ts"),
    buildRobotsFile(),
  );
  await writeFile(
    path.join(outputPath, "src", "app", "sitemap.ts"),
    buildSitemapFile(resolved.resolvedPages.map(({ page }) => page.pageHref)),
  );

  for (const resolvedPage of resolved.resolvedPages) {
    await writeRoute(outputPath, resolvedPage);
  }

  await copyReferencedAssets(outputPath, resolved.resolvedPages);
  await copyOptionalFile("public/favicon.ico", outputPath);
  await copyProjectScaffold(outputPath, resolved.clientSlug);

  const commit = await readGitCommit();
  // Listed by walking what was actually written rather than by accumulating
  // paths as we go, so the manifest cannot drift from the real output. This is
  // what lets a re-export delete the files a previous export created and no
  // others - see `updateExportedSite`.
  const files = await listGeneratedFiles(outputPath);
  const manifest = {
    clientSlug: resolved.clientSlug,
    exportedAt: new Date().toISOString(),
    files,
    pages: resolved.resolvedPages.map(({ page, sections }) => ({
      pageHref: page.pageHref,
      pageId: page.pageId,
      snapshotId: page.snapshot.id,
      snapshotVersion: page.snapshot.version,
      templateId: page.template?.id ?? null,
      sections: sections.map((section) => section.component),
    })),
    sectionLibraryCommit: commit,
    source: "local-service-starter",
    version: 2,
  };

  await writeFile(
    path.join(outputPath, "pageworks-export.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
}


async function writeRoute(outputPath: string, resolvedPage: ResolvedPage) {
  const routePath = routeDirectory(resolvedPage.page.pageHref);
  const destination = path.join(outputPath, "src", "app", routePath);

  await mkdir(destination, { recursive: true });
  await writeFile(
    path.join(destination, "content.ts"),
    buildContentFile(resolvedPage),
  );
  await writeFile(
    path.join(destination, "page.tsx"),
    neutralizeBuilderVocabulary(buildPageFile(resolvedPage)),
  );
}

function buildContentFile({ sections }: ResolvedPage) {
  const content = Object.fromEntries(
    sections.map((section) => [section.contentKey, section.props]),
  );

  return `export const content = ${JSON.stringify(content, null, 2)} as const;\n`;
}

function buildSectionFrameJsx(
  section: ResolvedSection,
  indent: string,
  inBand: boolean,
) {
  return `${indent}<div
${indent}  className="pagebuilder-section-frame pagebuilder-paint-surface relative"
${indent}  data-pagebuilder-background-fill=${JSON.stringify(inBand ? "none" : "solid")}
${indent}  data-pagebuilder-background-treatment=${JSON.stringify(
    inBand ? "none" : resolveBackgroundTreatment(section.backgroundTreatment),
  )}
${indent}  data-pagebuilder-card-border=${JSON.stringify(section.cardBorder)}
${indent}  data-pagebuilder-card-fill=${JSON.stringify(section.cardFill)}
${indent}  data-pagebuilder-color-recipe=${JSON.stringify(
    inBand ? "inherit" : section.colorRecipe,
  )}
${indent}  data-pagebuilder-padding-bottom=${JSON.stringify(
    section.reduceBottomPadding ? "none" : "default",
  )}
${indent}  data-pagebuilder-padding-top=${JSON.stringify(
    section.reduceTopPadding ? "none" : "default",
  )}
${indent}  data-pagebuilder-section-component=${JSON.stringify(section.component)}
${indent}  data-pagebuilder-section-mode=${JSON.stringify(section.mode)}
${indent}  key=${JSON.stringify(section.sectionId)}${
    inBand ? "" : backgroundImageStyleJsx(section, `${indent}  `)
  }
${indent}>
${indent}  <${section.component} {...(content.${section.contentKey} as unknown as ComponentProps<typeof ${section.component}>)} />
${indent}</div>`;
}

/**
 * The inline custom property carrying a ground image, as a JSX `style` prop.
 *
 * Emitted only when there is an image to emit, so an ordinary section keeps the
 * attribute list it had before. `backgroundImage` is already sanitised by
 * `resolveBackgroundImage` at resolve time - it reaches a stylesheet rather than
 * markup, where React's escaping does not apply - and is serialised through
 * JSON.stringify here so the generated source is valid whatever it holds.
 */
function backgroundImageStyleJsx(section: ResolvedSection, indent: string) {
  const entries: [string, string][] = [];

  if (section.backgroundImage) {
    entries.push([
      "--section-background-image",
      `url("${section.backgroundImage}")`,
    ]);
  }

  // The tuned gradient rides the same style prop. Both are already sanitised -
  // the image by `resolveBackgroundImage`, the config by
  // `resolveBackgroundConfig` - which is what makes it safe to interpolate them
  // into CSS that React never parses and therefore never escapes.
  if (section.backgroundConfig) {
    entries.push(
      ...Object.entries(buildBackgroundConfigStyle(section.backgroundConfig)),
    );
  }

  if (entries.length === 0) {
    return "";
  }

  const properties = entries
    .map(([name, value]) => `${JSON.stringify(name)}: ${JSON.stringify(value)}`)
    .join(", ");

  return `\n${indent}style={{ ${properties} } as CSSProperties}`;
}

/**
 * The page's section markup.
 *
 * Emitted through the band grouping rather than straight off the list, so a
 * background spanning several sections survives export. A run of one produces
 * no wrapper, which is every page that uses no bands - so an export of an
 * existing page is byte-identical to what it was before bands existed.
 *
 * Exported for its test. This builds a string, so the compiler cannot see
 * inside it: a malformed wrapper here would type-check cleanly and only fail
 * later, when the generated site is built.
 */
export function buildSectionJsx(sections: ResolvedSection[]) {
  return groupSectionsIntoBands(sections)
    .map((band) => {
      const [first] = band.sections;

      if (!band.isBand) {
        return buildSectionFrameJsx(first, "      ", false);
      }

      return `      <div
        className="pagebuilder-section-band pagebuilder-paint-surface"
        data-pagebuilder-background-treatment=${JSON.stringify(
          resolveBackgroundTreatment(first.backgroundTreatment),
        )}
        data-pagebuilder-color-recipe=${JSON.stringify(first.colorRecipe)}
        key=${JSON.stringify(`band-${first.sectionId}`)}${backgroundImageStyleJsx(
          first,
          "        ",
        )}
      >
${band.sections
  .map((section) => buildSectionFrameJsx(section, "        ", true))
  .join("\n")}
      </div>`;
    })
    .join("\n");
}

function buildPageFile({ page, sections }: ResolvedPage) {
  const importsByPath = new Map<string, Set<string>>();

  sections.forEach((section) => {
    const importPath = `@/${section.sourcePath.replace(/^src\//, "").replace(/\.(?:ts|tsx)$/, "")}`;
    const names = importsByPath.get(importPath) ?? new Set<string>();
    names.add(section.component);
    importsByPath.set(importPath, names);
  });
  const imports = Array.from(importsByPath.entries())
    .map(
      ([importPath, names]) =>
        `import { ${Array.from(names).sort().join(", ")} } from ${JSON.stringify(importPath)};`,
    )
    .join("\n");
  const metadataTitle = findMetaValue(page, "title") || page.pageLabel;
  const metadataDescription =
    findMetaValue(page, "description") ||
    `${page.pageLabel} information and service details.`;
  const sectionJsx = buildSectionJsx(sections);
  // Imported only where it is used. An unused type import would fail lint in
  // the generated site, on pages that never asked for a ground image.
  const reactTypeImports = sectionJsx.includes("as CSSProperties")
    ? "ComponentProps, CSSProperties"
    : "ComponentProps";

  return `import type { Metadata } from "next";
import type { ${reactTypeImports} } from "react";
${imports}
import { content } from "./content";

export const metadata: Metadata = {
  title: ${JSON.stringify(metadataTitle)},
  description: ${JSON.stringify(metadataDescription)},
};

export default function Page() {
  return (
    <main className="page-template-preview pagebuilder-density-normal min-h-svh bg-bg-page text-service-ink">
${sectionJsx}
    </main>
  );
}
`;
}

function buildRootLayout(clientSlug: string) {
  const title = humanize(clientSlug);

  return `import type { Metadata } from "next";
import { RequestServiceProvider } from "@/components/request-service";
import { rootFontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: ${JSON.stringify(title)}, template: ${JSON.stringify(`%s | ${title}`)} },
  description: ${JSON.stringify(`${title} local service website.`)},
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={\`${"${rootFontVariables}"} h-full antialiased\`} lang="en">
      <body className="min-h-full flex flex-col">
        <RequestServiceProvider>{children}</RequestServiceProvider>
      </body>
    </html>
  );
}
`;
}

function buildNotFoundPage() {
  return `import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-bg-page px-6 text-service-ink">
      <div className="max-w-xl text-center">
        <p className="type-label text-service-accent">404</p>
        <h1 className="type-heading-xl mt-3">Page not found</h1>
        <p className="type-text-md mt-4 text-service-muted">The page may have moved or no longer exists.</p>
        <Link className="mt-6 inline-flex font-semibold text-service-accent" href="/">Return home</Link>
      </div>
    </main>
  );
}
`;
}

function buildRobotsFile() {
  return `import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { allow: "/", userAgent: "*" } };
}
`;
}

function buildSitemapFile(routes: string[]) {
  return `import type { MetadataRoute } from "next";

const routes = ${JSON.stringify(routes, null, 2)};

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return routes.map((route) => ({ url: new URL(route, siteUrl).toString() }));
}
`;
}

async function copyProjectScaffold(outputPath: string, clientSlug: string) {
  const packageJson = JSON.parse(
    await readFile(path.join(process.cwd(), "package.json"), "utf8"),
  ) as Record<string, unknown>;

  packageJson.name = clientSlug;
  packageJson.private = true;
  packageJson.scripts = {
    build: "next build",
    dev: "next dev",
    lint: "eslint",
    start: "next start",
    typecheck: "tsc --noEmit",
  };

  await Promise.all([
    writeFile(
      path.join(outputPath, "package.json"),
      `${JSON.stringify(packageJson, null, 2)}\n`,
    ),
    copyFile(
      path.join(process.cwd(), "package-lock.json"),
      path.join(outputPath, "package-lock.json"),
    ),
    copyFile(
      path.join(process.cwd(), "tsconfig.json"),
      path.join(outputPath, "tsconfig.json"),
    ),
    copyFile(
      path.join(process.cwd(), "postcss.config.mjs"),
      path.join(outputPath, "postcss.config.mjs"),
    ),
    copyFile(
      path.join(process.cwd(), "eslint.config.mjs"),
      path.join(outputPath, "eslint.config.mjs"),
    ),
    writeFile(
      path.join(outputPath, "next.config.ts"),
      'import type { NextConfig } from "next";\n\nconst nextConfig: NextConfig = {};\n\nexport default nextConfig;\n',
    ),
    writeFile(
      path.join(outputPath, ".env.example"),
      "NEXT_PUBLIC_SITE_URL=https://example.com\nNEXT_PUBLIC_SUPABASE_URL=\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=\n",
    ),
    writeFile(
      path.join(outputPath, ".gitignore"),
      "node_modules\n.next\nout\n.env*\n!.env.example\n*.tsbuildinfo\nnext-env.d.ts\n",
    ),
  ]);
}

async function verifyGeneratedSite(outputPath: string) {
  const nodeModules = path.join(process.cwd(), "node_modules");
  const verificationNodeModules = path.join(outputPath, "node_modules");
  const baseEnvironment = { ...process.env };
  delete baseEnvironment.NEXT_RSPACK;
  delete baseEnvironment.TURBOPACK;
  const environment = {
    ...baseEnvironment,
    NEXT_PUBLIC_SITE_URL: "https://example.com",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      "sb_publishable_export_build_placeholder",
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  };

  await symlink(nodeModules, verificationNodeModules, "junction");

  try {
    await runVerificationCommand(
      process.execPath,
      [path.join(nodeModules, "typescript", "bin", "tsc"), "--noEmit"],
      { cwd: outputPath, env: environment, maxBuffer: 10 * 1024 * 1024 },
    );
    await runVerificationCommand(
      process.execPath,
      [
        path.join(nodeModules, "next", "dist", "bin", "next"),
        "build",
        "--webpack",
      ],
      { cwd: outputPath, env: environment, maxBuffer: 20 * 1024 * 1024 },
    );
  } finally {
    await unlink(verificationNodeModules).catch(() => undefined);
  }
}

async function runVerificationCommand(
  command: string,
  args: string[],
  options: Parameters<typeof execFileAsync>[2],
) {
  try {
    await execFileAsync(command, args, options);
  } catch (error) {
    const details = error as Error & { stderr?: string; stdout?: string };
    const output = [details.stdout, details.stderr]
      .filter(Boolean)
      .join("\n")
      .trim();

    throw new Error(
      output
        ? `Generated-site verification failed:\n${output}`
        : details.message,
    );
  }
}

async function buildComponentRegistry() {
  const registry = new Map<string, string>();
  const files = await listFiles(sectionRoot);

  for (const file of files.filter((candidate) => /\.(?:ts|tsx)$/.test(candidate))) {
    const contents = await readFile(file, "utf8");
    const exportPattern = /export\s+(?:async\s+)?(?:function|const|class)\s+([A-Z][A-Za-z0-9_]*)/g;

    for (const match of contents.matchAll(exportPattern)) {
      registry.set(match[1], toPosix(path.relative(process.cwd(), file)));
    }
  }

  return registry;
}

async function collectDependencyClosure(entryFiles: string[]) {
  const visited = new Set<string>();
  const queue = [...entryFiles];

  while (queue.length > 0) {
    const file = queue.pop();

    if (!file || visited.has(file) || !(await pathExists(file))) {
      continue;
    }

    visited.add(file);

    if (!/\.(?:ts|tsx|js|jsx|mjs|css)$/.test(file)) {
      continue;
    }

    const contents = await readFile(file, "utf8");
    const imports = extractImports(contents);

    for (const importPath of imports) {
      const resolvedImport = await resolveLocalImport(importPath, file);

      if (resolvedImport && !visited.has(resolvedImport)) {
        queue.push(resolvedImport);
      }
    }
  }

  return Array.from(visited).sort();
}

function extractImports(contents: string) {
  const imports = new Set<string>();
  const fromPattern = /from\s+["']([^"']+)["']/g;
  const sideEffectPattern = /import\s+["']([^"']+)["']/g;

  for (const pattern of [fromPattern, sideEffectPattern]) {
    for (const match of contents.matchAll(pattern)) {
      imports.add(match[1]);
    }
  }

  return Array.from(imports);
}

async function resolveLocalImport(importPath: string, importer: string) {
  if (!importPath.startsWith("@/") && !importPath.startsWith(".")) {
    return null;
  }

  const unresolved = importPath.startsWith("@/")
    ? path.join(sourceRoot, importPath.slice(2))
    : path.resolve(path.dirname(importer), importPath);
  const candidates = [
    unresolved,
    ...[".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css"].map(
      (extension) => `${unresolved}${extension}`,
    ),
    ...[".ts", ".tsx", ".js", ".jsx"].map((extension) =>
      path.join(unresolved, `index${extension}`),
    ),
  ];

  for (const candidate of candidates) {
    if (await isFile(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Turns a referenced URL path into the file it names on disk.
 *
 * Asset values are URL paths, so a filename with a space arrives as
 * `/images/bg-image-sample%201.jpg` while the file is `bg-image-sample 1.jpg`.
 * Resolving the raw string found nothing, and the copy loop skipped it in
 * silence - which is how the first real export shipped a page whose two images
 * both 404ed while reporting no issues.
 *
 * Malformed encoding falls back to the raw value rather than throwing; a path
 * that decodes to nothing useful is reported as missing further down, which is
 * the same outcome by a clearer route.
 */
function decodeAssetPath(assetPath: string) {
  const relative = assetPath.slice(1);

  try {
    return decodeURIComponent(relative);
  } catch {
    return relative;
  }
}

function collectPageAssetPaths(pages: ResolvedPage[]) {
  const assetPaths = new Set<string>();

  pages.forEach(({ sections }) =>
    sections.forEach(({ props }) => collectAssetPaths(props, assetPaths)),
  );

  return assetPaths;
}

/**
 * Internal routes the exported pages link to but do not generate.
 *
 * Nav and footer links resolve from the client's whole sitemap, not from the
 * approved subset - `publicHref` maps a preview href to that page's public
 * href whether or not the page is being exported. So a site exported from two
 * approved pages ships a nav pointing at every other page in the sitemap, and
 * each one 404s.
 *
 * This warns rather than blocks. Approving pages a few at a time is a normal
 * way to work, and an export of one finished page is a legitimate thing to
 * want. What is not legitimate is finding out after deploying, which is the
 * only way it surfaced before.
 */
function findDeadInternalLinks(pages: ResolvedPage[]) {
  return findDeadRouteLinks(
    pages.flatMap(({ sections }) => sections.map(({ props }) => props)),
    pages.map(({ page }) => page.pageHref),
  );
}

export function findDeadRouteLinks(
  propsList: unknown[],
  generatedRoutes: string[],
) {
  const generated = new Set(generatedRoutes.map(normalizeRoute));
  const linked = new Set<string>();

  propsList.forEach((props) => collectRouteLinks(props, linked));

  return Array.from(linked)
    .filter((route) => !generated.has(route))
    .sort();
}

function collectRouteLinks(
  value: unknown,
  routes: Set<string>,
  keyPath: string[] = [],
) {
  if (typeof value === "string") {
    const key = keyPath.at(-1)?.toLowerCase() ?? "";
    const cleanValue = value.split(/[?#]/)[0];

    if (
      key.includes("href") &&
      cleanValue.startsWith("/") &&
      !cleanValue.startsWith("//") &&
      // An href naming a file is an asset link, not a route, and
      // `validateReferencedAssets` already owns those.
      !/\.[a-z0-9]{2,5}$/i.test(cleanValue)
    ) {
      routes.add(normalizeRoute(cleanValue));
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectRouteLinks(item, routes, [...keyPath, String(index)]),
    );
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) =>
      collectRouteLinks(child, routes, [...keyPath, key]),
    );
  }
}

function normalizeRoute(value: string) {
  const trimmed = value.trim().replace(/\/+$/, "");

  return trimmed || "/";
}

/**
 * A referenced asset that is not on disk ships as a broken image, so it fails
 * the export rather than warning. The check lives in the analysis so a dry run
 * catches it before anything is written.
 */
async function validateReferencedAssets(
  pages: ResolvedPage[],
  issues: ExportIssue[],
) {
  for (const assetPath of collectPageAssetPaths(pages)) {
    const sourcePath = path.join(
      /*turbopackIgnore: true*/ process.cwd(),
      "public",
      decodeAssetPath(assetPath),
    );

    if (await isFile(sourcePath)) {
      continue;
    }

    issues.push({
      code: "missing-asset",
      message: `Referenced asset is not in /public: ${assetPath}`,
    });
  }
}

async function copyReferencedAssets(
  outputPath: string,
  pages: ResolvedPage[],
) {
  for (const assetPath of collectPageAssetPaths(pages)) {
    const relative = decodeAssetPath(assetPath);
    const sourcePath = path.join(
      /*turbopackIgnore: true*/ process.cwd(),
      "public",
      relative,
    );

    if (!(await isFile(sourcePath))) {
      continue;
    }

    // Written under the decoded name, which is what a browser asks for once it
    // has decoded the URL in the markup.
    const destinationPath = path.join(outputPath, "public", relative);
    await mkdir(path.dirname(destinationPath), { recursive: true });
    await copyFile(sourcePath, destinationPath);
  }
}

function collectAssetPaths(
  value: unknown,
  assets: Set<string>,
  keyPath: string[] = [],
) {
  if (typeof value === "string") {
    const key = keyPath.at(-1)?.toLowerCase() ?? "";
    const cleanValue = value.split(/[?#]/)[0];

    if (
      cleanValue.startsWith("/") &&
      !cleanValue.startsWith("//") &&
      /(image|photo|logo|src|poster)/.test(key) &&
      // Must name a file. `logoHref` on the nav is "/" - a route, matched by
      // the key pattern but not an asset, and reported as a missing file once
      // absence became an error rather than a silent skip.
      /\.[a-z0-9]{2,5}$/i.test(cleanValue)
    ) {
      assets.add(cleanValue);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectAssetPaths(item, assets, [...keyPath, String(index)]),
    );
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) =>
      collectAssetPaths(child, assets, [...keyPath, key]),
    );
  }
}

function normalizeSerializable(value: unknown, pathParts: string[] = []): unknown {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "function" || typeof value === "symbol") {
    throw new Error(`Non-serializable value at ${pathParts.join(".") || "props"}.`);
  }

  if (Array.isArray(value)) {
    return value.map((item, index) =>
      normalizeSerializable(item, [...pathParts, String(index)]),
    );
  }

  if (value && typeof value === "object") {
    if (isValidElement(value)) {
      throw new Error(`React element found at ${pathParts.join(".") || "props"}.`);
    }

    return Object.fromEntries(
      Object.entries(value)
        .filter(([, child]) => child !== undefined)
        .map(([key, child]) => [
          key,
          normalizeSerializable(child, [...pathParts, key]),
        ]),
    );
  }

  throw new Error(`Unsupported value at ${pathParts.join(".") || "props"}.`);
}

function pruneOptionalPlaceholderLinks(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .filter(
        (item) =>
          !(
            item &&
            typeof item === "object" &&
            "href" in item &&
            item.href === "#"
          ),
      )
      .map(pruneOptionalPlaceholderLinks);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, child]) => {
          return !(
            child &&
            typeof child === "object" &&
            !Array.isArray(child) &&
            "href" in child &&
            child.href === "#"
          );
        })
        .map(([key, child]) => [key, pruneOptionalPlaceholderLinks(child)]),
    );
  }

  return value;
}

/**
 * Renames the builder's own vocabulary out of exported source.
 *
 * Every exported section is wrapped in a frame carrying
 * `pagebuilder-section-frame` plus seven `data-pagebuilder-*` attributes, and
 * the stylesheet selects on all of them. Shipped as-is, the word "pagebuilder"
 * appears eight times per section in a client's DOM, announcing the tool that
 * generated the site.
 *
 * The attributes cannot simply be dropped - all seven are load-bearing, and
 * `--live-*` is remapped through them per colour recipe - so this renames
 * rather than removes. The same transform runs over the emitted page source
 * and the copied stylesheet, which is what keeps the selectors matching.
 *
 * Order matters, longest form first. The `...-section-` variants are collapsed
 * ahead of the plain ones so the result reads `data-section-component` rather
 * than `data-section-section-component` - a stutter that would advertise a
 * mechanical rename as plainly as the original name advertised the builder.
 * The bare `pagebuilder-` rule runs last, or it would consume the prefixes of
 * the longer forms and strand their remainders.
 */
export function neutralizeBuilderVocabulary(source: string) {
  return source
    .replaceAll("data-pagebuilder-section-", "data-section-")
    .replaceAll("data-pagebuilder-", "data-section-")
    .replaceAll("--pagebuilder-section-", "--section-")
    .replaceAll("--pagebuilder-", "--section-")
    .replaceAll("pagebuilder-section-frame", "site-section-frame")
    .replaceAll("pagebuilder-", "site-");
}

function freezeStyleTokens(css: string, styleTokenCss: string) {
  const beginMarker = "/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";
  const endMarker = "/* END PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";
  const beginIndex = css.indexOf(beginMarker);
  const endIndex = css.indexOf(endMarker);

  if (beginIndex < 0 || endIndex < beginIndex) {
    return `${css.trimEnd()}\n\n${styleTokenCss.trim()}\n`;
  }

  return `${css.slice(0, beginIndex).trimEnd()}\n\n${styleTokenCss.trim()}\n${css
    .slice(endIndex + endMarker.length)
    .trimStart()}`;
}

function findMetaValue(page: StagedPage, fieldName: string) {
  return (
    page.fields.find(
      (field) =>
        field.kind === "meta" &&
        field.path.toLowerCase().endsWith(`.${fieldName.toLowerCase()}`),
    )?.value.trim() ?? ""
  );
}

function routeDirectory(pageHref: string) {
  const normalized = pageHref.split(/[?#]/)[0].replace(/^\/+|\/+$/g, "");
  return normalized || ".";
}

async function copyOptionalFile(relativePath: string, outputPath: string) {
  const sourcePath = path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    relativePath,
  );

  if (!(await isFile(sourcePath))) {
    return;
  }

  const destinationPath = path.join(outputPath, relativePath);
  await mkdir(path.dirname(destinationPath), { recursive: true });
  await copyFile(sourcePath, destinationPath);
}

async function readGitCommit() {
  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "HEAD"], {
      cwd: process.cwd(),
    });
    return stdout.trim();
  } catch {
    return "unknown";
  }
}

async function listFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );

  return nested.flat();
}

async function isFile(filePath: string) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function pathExists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function dedupeIssues(issues: ExportIssue[]) {
  const seen = new Set<string>();

  return issues.filter((issue) => {
    const key = `${issue.code}:${issue.pageId ?? ""}:${issue.sectionId ?? ""}:${issue.message}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function humanize(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toPosix(value: string) {
  return value.replaceAll("\\", "/");
}
