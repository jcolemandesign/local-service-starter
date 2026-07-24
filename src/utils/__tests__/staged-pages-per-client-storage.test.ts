import { beforeEach, describe, expect, it, vi } from "vitest";

import type { StagedPage } from "@/utils/staged-pages";

// Virtual filesystem keyed by path, so the test can assert which client's file
// a write actually touched.
const files = new Map<string, string>();
const dirs = new Set<string>(["north-star-hvac", "second-client"]);

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn(async () => undefined),
  readdir: vi.fn(async () =>
    Array.from(dirs).map((name) => ({
      isDirectory: () => true,
      name,
    })),
  ),
  readFile: vi.fn(async (target: string) => {
    const contents = files.get(toKey(String(target)));

    if (contents === undefined) throw new Error("ENOENT");

    return contents;
  }),
  writeFile: vi.fn(async (target: string, contents: string) => {
    files.set(toKey(String(target)), contents);
  }),
}));

// The code under test builds absolute paths from process.cwd(); key the virtual
// filesystem on the repo-relative suffix so seeds and writes line up.
function toKey(target: string) {
  const normalized = normalize(target);
  const marker = "src/content/projects/";
  const index = normalized.indexOf(marker);

  return index >= 0 ? normalized.slice(index) : normalized;
}

function normalize(target: string) {
  return target.split("\\").join("/");
}

function pathFor(clientSlug: string) {
  return `src/content/projects/${clientSlug}/staged-pages.json`;
}

function findWritten(clientSlug: string) {
  const value = files.get(pathFor(clientSlug));

  return value ? JSON.parse(value) : null;
}

function seed(clientSlug: string, pages: StagedPage[]) {
  files.set(pathFor(clientSlug), JSON.stringify({ pages }));
}

function makePage(clientSlug: string, pageId: string): StagedPage {
  return {
    fieldCounts: { copy: 0, image: 0, link: 0, meta: 0 },
    fields: [],
    navigation: [],
    pageHref: `/${pageId}`,
    pageId,
    pageLabel: pageId,
    previewHref: `/dev/staged-pages/${pageId}`,
    promotedAt: "2026-01-01T00:00:00.000Z",
    snapshot: {
      clientSlug,
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "snap-1",
      version: 1,
    },
    sourceStage: "strategy-template",
    status: "staged",
  };
}

const { readStagedPages, removeStagedPage, writeStagedPage } = await import(
  "@/utils/staged-pages"
);

describe("per-client staged page storage", () => {
  beforeEach(() => {
    files.clear();
    seed("north-star-hvac", [makePage("north-star-hvac", "home")]);
    seed("second-client", [makePage("second-client", "home")]);
  });

  it("reads pages from every client directory", async () => {
    const pages = await readStagedPages();

    // Both clients have a page called "home". Under the old single global file
    // these shared a dedupe key; partitioning keeps them distinct.
    expect(pages).toHaveLength(2);
    expect(pages.map((p) => p.snapshot.clientSlug).sort()).toEqual([
      "north-star-hvac",
      "second-client",
    ]);
  });

  it("writes only the affected client's file", async () => {
    const before = JSON.stringify(findWritten("second-client"));

    await writeStagedPage(makePage("north-star-hvac", "about"));

    expect(
      findWritten("north-star-hvac").pages.map((p: StagedPage) => p.pageId).sort(),
    ).toEqual(["about", "home"]);

    // The other client's file must be byte-identical - a save for one client
    // must not rewrite another client's records.
    expect(JSON.stringify(findWritten("second-client"))).toBe(before);
  });

  it("does not delete another client's identically-named page", async () => {
    await removeStagedPage("north-star-hvac", "home");

    expect(findWritten("north-star-hvac").pages).toEqual([]);
    expect(
      findWritten("second-client").pages.map((p: StagedPage) => p.pageId),
    ).toEqual(["home"]);
  });
});
