import { afterEach, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  exportManifestFile,
  listGeneratedFiles,
  readExportManifest,
  updateExportedSite,
} from "@/utils/site-export-update";

/**
 * Exercised against real directories rather than a mocked fs. This code exists
 * to decide which files survive a re-export, and the failure modes that matter
 * - nested route folders, path separators, empty directories left behind - are
 * exactly the ones a virtual filesystem would paper over.
 */

const tempRoots: string[] = [];

async function makeTempDir() {
  const root = await mkdtemp(path.join(tmpdir(), "pageworks-export-test-"));
  tempRoots.push(root);
  return root;
}

async function writeTree(root: string, files: Record<string, string>) {
  for (const [relative, contents] of Object.entries(files)) {
    const target = path.join(root, ...relative.split("/"));
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, contents);
  }
}

async function readIfPresent(root: string, relative: string) {
  try {
    return await readFile(path.join(root, ...relative.split("/")), "utf8");
  } catch {
    return null;
  }
}

function manifest(clientSlug: string, files: string[]) {
  return JSON.stringify({
    clientSlug,
    files,
    source: "local-service-starter",
    version: 2,
  });
}

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map((root) => rm(root, { force: true, recursive: true })),
  );
});

describe("listGeneratedFiles", () => {
  it("lists build output as sorted POSIX-relative paths", async () => {
    const root = await makeTempDir();
    await writeTree(root, {
      "src/app/page.tsx": "page",
      "src/app/about/page.tsx": "about",
      "package.json": "{}",
    });

    expect(await listGeneratedFiles(root)).toEqual([
      "package.json",
      "src/app/about/page.tsx",
      "src/app/page.tsx",
    ]);
  });

  it("excludes the build directory and the manifest itself", async () => {
    const root = await makeTempDir();
    await writeTree(root, {
      "src/app/page.tsx": "page",
      ".next/build-manifest.json": "{}",
      [exportManifestFile]: manifest("acme", []),
    });

    expect(await listGeneratedFiles(root)).toEqual(["src/app/page.tsx"]);
  });
});

describe("readExportManifest", () => {
  it("returns null for a directory this tool did not create", async () => {
    const root = await makeTempDir();
    await writeTree(root, {
      [exportManifestFile]: JSON.stringify({ clientSlug: "acme" }),
    });

    expect(await readExportManifest(root)).toBeNull();
  });

  it("returns null when there is no manifest at all", async () => {
    expect(await readExportManifest(await makeTempDir())).toBeNull();
  });

  it("treats a version 1 manifest as having no file list", async () => {
    const root = await makeTempDir();
    await writeTree(root, {
      [exportManifestFile]: JSON.stringify({
        clientSlug: "acme",
        source: "local-service-starter",
        version: 1,
      }),
    });

    expect(await readExportManifest(root)).toEqual({
      clientSlug: "acme",
      files: [],
    });
  });
});

describe("updateExportedSite", () => {
  it("overwrites generated content and removes routes the export no longer produces", async () => {
    const live = await makeTempDir();
    const next = await makeTempDir();

    await writeTree(live, {
      "src/app/page.tsx": "old home",
      "src/app/specials/page.tsx": "a page that has since been unapproved",
      [exportManifestFile]: manifest("acme", [
        "src/app/page.tsx",
        "src/app/specials/page.tsx",
      ]),
    });
    await writeTree(next, {
      "src/app/page.tsx": "new home",
      [exportManifestFile]: manifest("acme", ["src/app/page.tsx"]),
    });

    await updateExportedSite(next, live, await readExportManifest(live));

    expect(await readIfPresent(live, "src/app/page.tsx")).toBe("new home");
    expect(await readIfPresent(live, "src/app/specials/page.tsx")).toBeNull();
    // The emptied route folder should not linger in the client's repo.
    expect(await readIfPresent(live, "src/app/specials")).toBeNull();
  });

  it("leaves files it never generated alone", async () => {
    const live = await makeTempDir();
    const next = await makeTempDir();

    await writeTree(live, {
      "src/app/page.tsx": "old home",
      ".git/config": "[core]",
      ".env": "SECRET=1",
      "vercel.json": "{}",
      "node_modules/next/index.js": "module.exports = {}",
      [exportManifestFile]: manifest("acme", ["src/app/page.tsx"]),
    });
    await writeTree(next, {
      "src/app/page.tsx": "new home",
      [exportManifestFile]: manifest("acme", ["src/app/page.tsx"]),
    });

    await updateExportedSite(next, live, await readExportManifest(live));

    expect(await readIfPresent(live, ".git/config")).toBe("[core]");
    expect(await readIfPresent(live, ".env")).toBe("SECRET=1");
    expect(await readIfPresent(live, "vercel.json")).toBe("{}");
    expect(await readIfPresent(live, "node_modules/next/index.js")).toBe(
      "module.exports = {}",
    );
  });

  it("does not overwrite build config the client repo now owns", async () => {
    const live = await makeTempDir();
    const next = await makeTempDir();

    await writeTree(live, {
      "package.json": '{"dependencies":{"posthog-js":"1.0.0"}}',
      "next.config.ts": "// custom image host",
      [exportManifestFile]: manifest("acme", ["package.json", "next.config.ts"]),
    });
    await writeTree(next, {
      "package.json": '{"dependencies":{}}',
      "next.config.ts": "// default",
      "tsconfig.json": "{}",
      [exportManifestFile]: manifest("acme", [
        "package.json",
        "next.config.ts",
        "tsconfig.json",
      ]),
    });

    await updateExportedSite(next, live, await readExportManifest(live));

    expect(await readIfPresent(live, "package.json")).toBe(
      '{"dependencies":{"posthog-js":"1.0.0"}}',
    );
    expect(await readIfPresent(live, "next.config.ts")).toBe(
      "// custom image host",
    );
    // Still created when it is missing.
    expect(await readIfPresent(live, "tsconfig.json")).toBe("{}");
  });

  it("writes the new manifest so the next update knows what this one produced", async () => {
    const live = await makeTempDir();
    const next = await makeTempDir();

    await writeTree(live, {
      "src/app/page.tsx": "old",
      [exportManifestFile]: manifest("acme", ["src/app/page.tsx"]),
    });
    await writeTree(next, {
      "src/app/page.tsx": "new",
      "src/app/contact/page.tsx": "contact",
      [exportManifestFile]: manifest("acme", [
        "src/app/contact/page.tsx",
        "src/app/page.tsx",
      ]),
    });

    await updateExportedSite(next, live, await readExportManifest(live));

    expect(await readExportManifest(live)).toEqual({
      clientSlug: "acme",
      files: ["src/app/contact/page.tsx", "src/app/page.tsx"],
    });
  });

  it("only overwrites when the previous manifest has no file list", async () => {
    const live = await makeTempDir();
    const next = await makeTempDir();

    await writeTree(live, {
      "src/app/page.tsx": "old",
      "src/app/stale/page.tsx": "from a version 1 export",
      [exportManifestFile]: JSON.stringify({
        clientSlug: "acme",
        source: "local-service-starter",
        version: 1,
      }),
    });
    await writeTree(next, {
      "src/app/page.tsx": "new",
      [exportManifestFile]: manifest("acme", ["src/app/page.tsx"]),
    });

    await updateExportedSite(next, live, await readExportManifest(live));

    expect(await readIfPresent(live, "src/app/page.tsx")).toBe("new");
    // Nothing recorded what that export created, so this cannot know the file
    // is stale. It survives until a clean re-export.
    expect(await readIfPresent(live, "src/app/stale/page.tsx")).toBe(
      "from a version 1 export",
    );
  });
});
