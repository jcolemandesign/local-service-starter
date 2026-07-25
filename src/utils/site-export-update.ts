import { copyFile, mkdir, readFile, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

/**
 * Re-exporting a site that has already been exported - and usually launched.
 *
 * Kept separate from `site-export.ts` because this is pure filesystem work: it
 * has no opinion about pages or sections, and importing it does not drag in the
 * section component tree.
 */

export type ExportManifest = {
  clientSlug: string;
  files: string[];
};

export const exportManifestFile = "pageworks-export.json";

/**
 * Written on first export, then owned by the client repo. A launched site's
 * build config accumulates real changes - an added dependency, an image host, a
 * redirect - and an update must not throw those away.
 */
const scaffoldFiles = new Set([
  ".env.example",
  ".gitignore",
  "eslint.config.mjs",
  "next.config.ts",
  "package-lock.json",
  "package.json",
  "postcss.config.mjs",
  "tsconfig.json",
]);

export function isScaffoldFile(relative: string) {
  return scaffoldFiles.has(relative);
}

async function pathExists(target: string) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

/**
 * Build output only, in POSIX-style relative form. `.next` and the manifest
 * itself are excluded: the build directory is deleted before the export is
 * finalised, and the manifest is written after this runs.
 */
export async function listGeneratedFiles(outputPath: string) {
  const files: string[] = [];

  async function walk(directory: string) {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      const relative = path
        .relative(outputPath, absolute)
        .split(path.sep)
        .join("/");

      if (relative === ".next" || relative.startsWith(".next/")) {
        continue;
      }

      if (entry.isDirectory()) {
        await walk(absolute);
        continue;
      }

      if (relative !== exportManifestFile) {
        files.push(relative);
      }
    }
  }

  await walk(outputPath);

  return files.sort();
}

/**
 * Refreshes an existing export in place.
 *
 * A full directory swap would be simpler but wrong here: once a site is
 * deployed, its directory is usually a git repo with history, an installed
 * `node_modules`, real `.env` values, and whatever deployment config the host
 * needs. None of that is ours to delete.
 *
 * So the update is driven by the previous manifest's file list: anything that
 * export generated and this one no longer does is removed (a deleted page's
 * route stops being served), everything generated now is written over, and
 * every other file in the directory is left untouched.
 *
 * Build configuration is only created when missing - overwriting `package.json`
 * would drop a dependency someone added to make the deploy work.
 */
export async function updateExportedSite(
  tempPath: string,
  outputPath: string,
  previousManifest: ExportManifest | null,
) {
  const nextFiles = await listGeneratedFiles(tempPath);
  const nextFileSet = new Set(nextFiles);
  const previousFiles = previousManifest?.files ?? [];

  for (const relative of previousFiles) {
    if (nextFileSet.has(relative) || isScaffoldFile(relative)) {
      continue;
    }

    await rm(path.join(outputPath, relative), { force: true });
  }

  for (const relative of nextFiles) {
    const destination = path.join(outputPath, relative);

    if (isScaffoldFile(relative) && (await pathExists(destination))) {
      continue;
    }

    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(path.join(tempPath, relative), destination);
  }

  await removeEmptyDirectories(outputPath);
  await copyFile(
    path.join(tempPath, exportManifestFile),
    path.join(outputPath, exportManifestFile),
  );
}

export async function readExportManifest(outputPath: string) {
  let contents: string;

  try {
    contents = await readFile(path.join(outputPath, exportManifestFile), "utf8");
  } catch {
    return null;
  }

  try {
    const parsed = JSON.parse(contents) as Partial<ExportManifest> & {
      source?: unknown;
    };

    // The `source` check is the guard that stops an update from writing into a
    // directory this tool did not create.
    if (
      parsed.source !== "local-service-starter" ||
      typeof parsed.clientSlug !== "string"
    ) {
      return null;
    }

    return {
      clientSlug: parsed.clientSlug,
      // Version 1 manifests predate the file list. Without it there is no
      // record of what the last export created, so nothing is removed and the
      // update only overwrites - stale routes from that export survive until a
      // clean re-export.
      files: Array.isArray(parsed.files)
        ? parsed.files.filter(
            (file: unknown): file is string => typeof file === "string",
          )
        : [],
    } satisfies ExportManifest;
  } catch {
    return null;
  }
}

/**
 * Directories are not tracked in the manifest, so removing a page's route file
 * can leave its folder behind. An empty folder is harmless to Next but shows up
 * as noise in the client's repo.
 *
 * Returns whether `directory` itself was removed, so a parent can tell whether
 * it still has children.
 */
async function removeEmptyDirectories(directory: string): Promise<boolean> {
  const entries = await readdir(directory, { withFileTypes: true });
  let remaining = 0;

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const removed = await removeEmptyDirectories(
        path.join(directory, entry.name),
      );

      if (!removed) remaining += 1;
      continue;
    }

    remaining += 1;
  }

  if (remaining === 0) {
    await rm(directory, { force: true, recursive: true });
    return true;
  }

  return false;
}
