import { beforeEach, describe, expect, it, vi } from "vitest";

import type { StagedPage, StagedPageField } from "@/utils/staged-pages";

// Same virtual filesystem approach as staged-pages-per-client-storage: keyed on
// the repo-relative suffix so seeds and writes line up.
const files = new Map<string, string>();

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn(async () => undefined),
  readdir: vi.fn(async () => [
    { isDirectory: () => true, name: "north-star-hvac" },
  ]),
  readFile: vi.fn(async (target: string) => {
    const contents = files.get(toKey(String(target)));

    if (contents === undefined) throw new Error("ENOENT");

    return contents;
  }),
  writeFile: vi.fn(async (target: string, contents: string) => {
    files.set(toKey(String(target)), contents);
  }),
}));

function toKey(target: string) {
  const normalized = target.split("\\").join("/");
  const marker = "src/content/projects/";
  const index = normalized.indexOf(marker);

  return index >= 0 ? normalized.slice(index) : normalized;
}

const clientSlug = "north-star-hvac";
const pagesPath = `src/content/projects/${clientSlug}/staged-pages.json`;

function seed(pages: StagedPage[]) {
  files.set(pagesPath, JSON.stringify({ pages }));
}

function written(): StagedPage[] {
  const value = files.get(pagesPath);

  return value ? (JSON.parse(value) as { pages: StagedPage[] }).pages : [];
}

function find(pageId: string) {
  return written().find((page) => page.pageId === pageId);
}

function makeField(pageId: string, path: string, value: string): StagedPageField {
  return { id: `${pageId}.${path}`, kind: "copy", path, value };
}

function makePage(pageId: string, headline: string): StagedPage {
  return {
    fieldCounts: { copy: 1, image: 0, link: 0, meta: 0 },
    fields: [makeField(pageId, "hero.headline", headline)],
    navigation: [],
    pageHref: "/services/heat-pump-service",
    pageId,
    pageLabel: "Heat Pump Service",
    previewHref: `/dev/staged-pages/${pageId}`,
    promotedAt: "2026-01-01T00:00:00.000Z",
    snapshot: {
      clientSlug,
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "snap-1",
      version: 1,
    },
    sourceStage: "strategy-template",
  };
}

const {
  archiveStagedPageAsAlt,
  getActiveStagedPages,
  getAltStagedPages,
  promoteStagedPageAlt,
  readStagedPages,
  replaceStagedPage,
  removeStagedPage,
} = await import("@/utils/staged-pages");
const { writeFile } = await import("node:fs/promises");

describe("replacing a staged page", () => {
  beforeEach(() => {
    files.clear();
    vi.mocked(writeFile).mockClear();
    seed([makePage("heat-pump-service", "Version A")]);
  });

  it("writes the replacement and archived alt in one file operation", async () => {
    const replacement = makePage("heat-pump-service", "Version B");
    const { archivedAlt } = await replaceStagedPage(replacement, true);

    expect(vi.mocked(writeFile)).toHaveBeenCalledTimes(1);
    expect(archivedAlt?.pageId).toBe("heat-pump-service-alt1");
    expect(find("heat-pump-service")?.fields[0]?.value).toBe("Version B");
    expect(find("heat-pump-service-alt1")?.fields[0]?.value).toBe("Version A");
  });
});

describe("archiving a staged page as an alt", () => {
  beforeEach(() => {
    files.clear();
    seed([makePage("heat-pump-service", "Live headline")]);
  });

  it("moves the live page to alt1 and frees the base slug", async () => {
    const alt = await archiveStagedPageAsAlt(clientSlug, "heat-pump-service");

    expect(alt?.pageId).toBe("heat-pump-service-alt1");
    expect(alt?.previewHref).toBe("/dev/staged-pages/heat-pump-service-alt1");
    expect(alt?.variant).toMatchObject({
      altIndex: 1,
      basePageId: "heat-pump-service",
      role: "alt",
    });
    expect(find("heat-pump-service")).toBeUndefined();
  });

  it("rekeys field ids so the content editor still addresses them", async () => {
    await archiveStagedPageAsAlt(clientSlug, "heat-pump-service");

    // Every field id is `${pageId}.${path}` by construction. If the ids kept
    // the old page id, a field save against the alt would match nothing.
    expect(find("heat-pump-service-alt1")?.fields).toEqual([
      {
        id: "heat-pump-service-alt1.hero.headline",
        kind: "copy",
        path: "hero.headline",
        value: "Live headline",
      },
    ]);
  });

  it("keeps the public href, since the alt is a candidate for that address", async () => {
    const alt = await archiveStagedPageAsAlt(clientSlug, "heat-pump-service");

    expect(alt?.pageHref).toBe("/services/heat-pump-service");
  });

  it("takes the next free slot rather than renumbering existing alts", async () => {
    await archiveStagedPageAsAlt(clientSlug, "heat-pump-service");
    seed([...written(), makePage("heat-pump-service", "Second live headline")]);

    const alt = await archiveStagedPageAsAlt(clientSlug, "heat-pump-service");

    // alt1 must keep its address - a URL open in another tab for comparison
    // cannot be allowed to start pointing at different content.
    expect(alt?.pageId).toBe("heat-pump-service-alt2");
    expect(find("heat-pump-service-alt1")?.fields[0]?.value).toBe(
      "Live headline",
    );
  });

  it("reuses a freed slot", async () => {
    await archiveStagedPageAsAlt(clientSlug, "heat-pump-service");
    seed([...written(), makePage("heat-pump-service", "Second")]);
    await archiveStagedPageAsAlt(clientSlug, "heat-pump-service");
    await removeStagedPage(clientSlug, "heat-pump-service-alt1");
    seed([...written(), makePage("heat-pump-service", "Third")]);

    expect((await archiveStagedPageAsAlt(clientSlug, "heat-pump-service"))?.pageId).toBe(
      "heat-pump-service-alt1",
    );
  });

  it("skips a slot whose address a real page already occupies", async () => {
    // Nothing stops a page from being slugged "heat-pump-service-alt1" on its
    // own. Handing that address to an alt would put two records on one page id.
    seed([
      ...written(),
      makePage("heat-pump-service-alt1", "A page that just has that name"),
    ]);

    const alt = await archiveStagedPageAsAlt(clientSlug, "heat-pump-service");

    expect(alt?.pageId).toBe("heat-pump-service-alt2");
    expect(find("heat-pump-service-alt1")?.fields[0]?.value).toBe(
      "A page that just has that name",
    );
  });

  it("does nothing when the slug holds no page yet", async () => {
    expect(await archiveStagedPageAsAlt(clientSlug, "about")).toBeUndefined();
  });

  it("never archives an alt as an alt of itself", async () => {
    await archiveStagedPageAsAlt(clientSlug, "heat-pump-service");

    // Only the live page at the base slug is archivable; the alt already sits
    // in a slot and must not be re-parked into a second one.
    expect(
      await archiveStagedPageAsAlt(clientSlug, "heat-pump-service-alt1"),
    ).toBeUndefined();
  });
});

describe("promoting an alt", () => {
  beforeEach(async () => {
    files.clear();
    seed([makePage("heat-pump-service", "Version A")]);
    await archiveStagedPageAsAlt(clientSlug, "heat-pump-service");
    seed([...written(), makePage("heat-pump-service", "Version B")]);
  });

  it("swaps the alt with the live page, leaving both addresses valid", async () => {
    const { demoted, promoted } = await promoteStagedPageAlt(
      clientSlug,
      "heat-pump-service-alt1",
    );

    expect(promoted.pageId).toBe("heat-pump-service");
    expect(promoted.fields[0]?.value).toBe("Version A");
    expect(promoted.variant?.role).toBe("active");
    expect(demoted?.pageId).toBe("heat-pump-service-alt1");
    expect(demoted?.fields[0]?.value).toBe("Version B");

    // Both slugs still resolve; only their contents traded places.
    expect(find("heat-pump-service")?.fields[0]?.value).toBe("Version A");
    expect(find("heat-pump-service-alt1")?.fields[0]?.value).toBe("Version B");
  });

  it("rekeys field ids on both sides of the swap", async () => {
    await promoteStagedPageAlt(clientSlug, "heat-pump-service-alt1");

    expect(find("heat-pump-service")?.fields[0]?.id).toBe(
      "heat-pump-service.hero.headline",
    );
    expect(find("heat-pump-service-alt1")?.fields[0]?.id).toBe(
      "heat-pump-service-alt1.hero.headline",
    );
  });

  it("round-trips back to the starting arrangement", async () => {
    await promoteStagedPageAlt(clientSlug, "heat-pump-service-alt1");
    await promoteStagedPageAlt(clientSlug, "heat-pump-service-alt1");

    expect(find("heat-pump-service")?.fields[0]?.value).toBe("Version B");
    expect(find("heat-pump-service-alt1")?.fields[0]?.value).toBe("Version A");
  });

  it("rejects promoting a page that is not an alt", async () => {
    await expect(
      promoteStagedPageAlt(clientSlug, "heat-pump-service"),
    ).rejects.toThrow("Alternate staged page not found.");
  });
});

describe("alt visibility and removal", () => {
  beforeEach(async () => {
    files.clear();
    seed([makePage("heat-pump-service", "Version A")]);
    await archiveStagedPageAsAlt(clientSlug, "heat-pump-service");
    seed([...written(), makePage("heat-pump-service", "Version B")]);
  });

  it("separates live pages from their alts", async () => {
    const pages = await readStagedPages();
    const active = getActiveStagedPages(pages);

    expect(active.map((page) => page.pageId)).toEqual(["heat-pump-service"]);
    expect(
      getAltStagedPages(pages, active[0]).map((page) => page.pageId),
    ).toEqual(["heat-pump-service-alt1"]);
  });

  it("removes a page's alts along with it", async () => {
    await removeStagedPage(clientSlug, "heat-pump-service");

    expect(written()).toEqual([]);
  });

  it("removing an alt leaves the live page alone", async () => {
    await removeStagedPage(clientSlug, "heat-pump-service-alt1");

    expect(written().map((page) => page.pageId)).toEqual(["heat-pump-service"]);
  });
});
