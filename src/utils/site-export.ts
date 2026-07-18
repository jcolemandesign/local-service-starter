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
import { renderPageTemplateSection } from "@/components/sections/PageTemplatePreview";
import { readSiteExportState } from "@/utils/site-export-state";
import { readStagedPages, type StagedPage } from "@/utils/staged-pages";
import { sanitizeClientSlug } from "@/utils/strategy-workspace";

type ExportIssue = {
  code: string;
  message: string;
  pageId?: string;
  sectionId?: string;
};

type ResolvedSection = {
  component: string;
  contentKey: string;
  mode: string;
  props: Record<string, unknown>;
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
  "src/content/projects/",
  "src/content/staged-pages.json",
];

export async function analyzeSiteExport(
  requestedClientSlug: string,
): Promise<SiteExportAnalysis> {
  const result = await resolveSiteExport(requestedClientSlug);

  return toAnalysis(result);
}

export async function exportClientSite(
  requestedClientSlug: string,
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

  await mkdir(exportRoot, { recursive: true });

  if (await pathExists(outputPath)) {
    throw new Error(
      `Export destination already exists: ${outputPath}. Move it or choose a new CLIENT_EXPORT_ROOT before regenerating.`,
    );
  }

  const tempPath = await mkdtemp(
    path.join(exportRoot, `.${resolved.clientSlug}-export-`),
  );

  try {
    await writeGeneratedSite(tempPath, resolved);
    await verifyGeneratedSite(tempPath);
    await rm(path.join(tempPath, ".next"), { force: true, recursive: true });
    await rename(tempPath, outputPath);
  } catch (error) {
    await rm(tempPath, { force: true, recursive: true });
    throw error;
  }

  return {
    ...analysis,
    manifestPath: path.join(outputPath, "pageworks-export.json"),
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

  const [allPages, state, componentRegistry] = await Promise.all([
    readStagedPages(),
    readSiteExportState(clientSlug),
    buildComponentRegistry(),
  ]);
  const clientPages = allPages.filter(
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
    const renderData = getStagedPageRenderData(page, clientPages);
    const sections = resolvePageSections(
      page,
      renderData,
      clientPages,
      componentRegistry,
      issues,
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

  if (!resolvedPages.some(({ page }) => page.pageHref === "/")) {
    warnings.push("No approved homepage was found; the generated root route will be absent.");
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

function validateStagedFields(page: StagedPage, issues: ExportIssue[]) {
  for (const field of page.fields) {
    if (field.kind === "meta" || field.path.startsWith("strategy.")) {
      continue;
    }

    const value = field.value.trim();

    if (field.kind === "copy" && (!value || /\bNEEDS REVIEW\b/i.test(value))) {
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

function resolvePageSections(
  page: StagedPage,
  renderData: StagedPageRenderData,
  clientPages: StagedPage[],
  componentRegistry: Map<string, string>,
  issues: ExportIssue[],
) {
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

    const element = renderPageTemplateSection(
      section,
      index,
      renderData.fieldsBySection[section.id ?? ""] ?? [],
      publicNavigationLinks(renderData.navigationLinks, clientPages),
      publicHref(renderData.homeHref, clientPages),
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
        component: section.component,
        contentKey: `section${String(index + 1).padStart(2, "0")}`,
        mode: section.mode,
        props,
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
    await copyFile(sourcePath, destinationPath);
  }

  const sourceGlobals = await readFile(
    path.join(sourceRoot, "app", "globals.css"),
    "utf8",
  );
  const frozenGlobals = freezeStyleTokens(
    sourceGlobals,
    resolved.state.styleTokenCss,
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
  const manifest = {
    clientSlug: resolved.clientSlug,
    exportedAt: new Date().toISOString(),
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
    version: 1,
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
    buildPageFile(resolvedPage),
  );
}

function buildContentFile({ sections }: ResolvedPage) {
  const content = Object.fromEntries(
    sections.map((section) => [section.contentKey, section.props]),
  );

  return `export const content = ${JSON.stringify(content, null, 2)} as const;\n`;
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
  const sectionJsx = sections
    .map(
      (section) => `      <div
        className="pagebuilder-section-frame relative"
        data-pagebuilder-color-recipe=${JSON.stringify(
          String(section.props.colorRecipe ?? "default"),
        )}
        data-pagebuilder-section-component=${JSON.stringify(section.component)}
        data-pagebuilder-section-mode=${JSON.stringify(section.mode)}
        key=${JSON.stringify(section.sectionId)}
      >
        <${section.component} {...(content.${section.contentKey} as unknown as ComponentProps<typeof ${section.component}>)} />
      </div>`,
    )
    .join("\n");

  return `import type { Metadata } from "next";
import type { ComponentProps } from "react";
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

async function copyReferencedAssets(
  outputPath: string,
  pages: ResolvedPage[],
) {
  const assetPaths = new Set<string>();

  pages.forEach(({ sections }) =>
    sections.forEach(({ props }) => collectAssetPaths(props, assetPaths)),
  );

  for (const assetPath of assetPaths) {
    const sourcePath = path.join(
      /*turbopackIgnore: true*/ process.cwd(),
      "public",
      assetPath.slice(1),
    );

    if (!(await isFile(sourcePath))) {
      continue;
    }

    const destinationPath = path.join(outputPath, "public", assetPath.slice(1));
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
    if (
      value.startsWith("/") &&
      !value.startsWith("//") &&
      /(image|photo|logo|src|poster)/.test(key)
    ) {
      assets.add(value.split(/[?#]/)[0]);
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
