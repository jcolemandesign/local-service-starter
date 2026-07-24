import { beforeEach, describe, expect, it, vi } from "vitest";

const beginMarker = "/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";
const endMarker = "/* END PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";

function tokenBlock(value: string) {
  return `${beginMarker}\n:root { --live-service-ink: ${value}; }\n${endMarker}`;
}

// Virtual filesystem: globals.css holds the currently promoted tokens, and
// site-export.json holds the persisted approval state.
const files = {
  globals: tokenBlock("#111111"),
  state: null as string | null,
};

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn(async () => undefined),
  readFile: vi.fn(async (target: string) => {
    if (String(target).endsWith("globals.css")) return files.globals;
    if (files.state === null) throw new Error("ENOENT");
    return files.state;
  }),
  writeFile: vi.fn(async (_target: string, contents: string) => {
    files.state = contents;
  }),
}));

const { readSiteExportState, setPageExportApproval } = await import(
  "@/utils/site-export-state"
);

describe("setPageExportApproval - style token changes", () => {
  beforeEach(() => {
    files.globals = tokenBlock("#111111");
    files.state = null;
  });

  it("keeps earlier approvals when the tokens have not changed", async () => {
    await setPageExportApproval({
      approved: true,
      clientSlug: "test-client",
      pageId: "home",
    });
    const { invalidatedPageIds, state } = await setPageExportApproval({
      approved: true,
      clientSlug: "test-client",
      pageId: "about",
    });

    expect(invalidatedPageIds).toEqual([]);
    expect(state.approvedPageIds).toEqual(["about", "home"]);
  });

  it("un-approves pages that were approved under different tokens", async () => {
    await setPageExportApproval({
      approved: true,
      clientSlug: "test-client",
      pageId: "home",
    });

    // The Style Guide is promoted again with different values.
    files.globals = tokenBlock("#222222");

    const { invalidatedPageIds, state } = await setPageExportApproval({
      approved: true,
      clientSlug: "test-client",
      pageId: "about",
    });

    // An export ships one globals.css for the whole site, so "home" can no
    // longer be exported under the tokens it was approved against. Previously
    // it was silently re-frozen under the new ones.
    expect(invalidatedPageIds).toEqual(["home"]);
    expect(state.approvedPageIds).toEqual(["about"]);
    expect(state.styleTokenCss).toContain("#222222");
  });

  it("does not re-freeze tokens when removing an approval", async () => {
    await setPageExportApproval({
      approved: true,
      clientSlug: "test-client",
      pageId: "home",
    });

    files.globals = tokenBlock("#333333");

    await setPageExportApproval({
      approved: false,
      clientSlug: "test-client",
      pageId: "home",
    });

    const state = await readSiteExportState("test-client");

    expect(state.approvedPageIds).toEqual([]);
    expect(state.styleTokenCss).toContain("#111111");
  });
});
