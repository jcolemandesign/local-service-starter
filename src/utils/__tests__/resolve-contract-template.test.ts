import { describe, expect, it } from "vitest";

import { resolveContractTemplate } from "@/utils/resolve-contract-template";
import type { TemplateCopyContractTemplate } from "@/utils/template-copy-contract";

function makeTemplate(id: string): TemplateCopyContractTemplate {
  return { id, name: id, pageType: "Home", sections: [] };
}

describe("resolveContractTemplate", () => {
  it("prefers the staged template snapshot when the page has been staged", () => {
    const staged = makeTemplate("staged-snapshot");
    const live = [makeTemplate("staged-snapshot"), makeTemplate("live-edited")];

    // Even though a live template with a matching id exists, the staged
    // snapshot must win - it represents what was actually staged, and the
    // live template may have been edited since.
    expect(resolveContractTemplate(staged, live, "staged-snapshot")).toBe(
      staged,
    );
  });

  it("falls back to the live template lookup when the page has not been staged", () => {
    const live = [makeTemplate("live-only")];

    expect(
      resolveContractTemplate(undefined, live, "live-only"),
    ).toBe(live[0]);
  });

  it("returns undefined when neither a staged template nor a matching live template exists", () => {
    expect(resolveContractTemplate(undefined, [], "missing")).toBeUndefined();
  });
});
