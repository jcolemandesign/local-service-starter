import { describe, expect, it } from "vitest";

import { getStagedPageRenderData } from "@/components/sections/StagedPageCanvas";
import { groupSectionsIntoBands } from "@/utils/section-bands";
import type { StagedPage } from "@/utils/staged-pages";

/**
 * A banded template has to still be banded by the time it is exported.
 *
 * `section-toggle-transport.test.ts` pins that each hop reads the shared field
 * list, but that is a statement about the source rather than about what comes
 * out the other end. This drives the real staged-page mapping and the real
 * band grouping instead, so it fails on any future change that separates a run
 * - a rewritten mapping, a renamed field, a grouping rule that stops reading
 * `joinAbove` - regardless of how the code is arranged.
 *
 * Worth its own file because the symptom is so easy to misread: the sections
 * all render, in the right order, with the right copy. Only the shared ground
 * is missing, which looks like a CSS problem and is really a dropped field.
 */

function bandedPage(): StagedPage {
  const section = (name: string, extra: Record<string, unknown> = {}) => ({
    component: "TestimonialsSectionV3",
    instruction: "",
    mode: "Proof",
    name,
    ...extra,
  });

  return {
    fields: [],
    navigation: [],
    pageHref: "/",
    pageId: "home",
    pageLabel: "Home",
    snapshot: { clientSlug: "test-client" },
    sourceStage: "strategy-template",
    template: {
      id: "banded",
      name: "Banded",
      pageType: "Home",
      sectionCount: 4,
      sections: [
        // The run's first section owns the ground and its texture.
        section("Band owner", {
          backgroundTreatment: "gradient",
          colorRecipe: "dark",
        }),
        section("Joined one", { joinAbove: "join" }),
        section("Joined two", { joinAbove: "join" }),
        // Starts its own run again, so the band has a definite end.
        section("Separate", { joinAbove: "separate" }),
      ],
    },
  } as unknown as StagedPage;
}

describe("banded template through staging to export", () => {
  const { sections } = getStagedPageRenderData(bandedPage(), []);

  it("keeps band membership on the staged sections", () => {
    expect(sections.map((section) => section.joinAbove)).toEqual([
      undefined,
      "join",
      "join",
      "separate",
    ]);
  });

  it("keeps the ground texture the run is painted with", () => {
    expect(sections[0].backgroundTreatment).toBe("gradient");
    expect(sections[0].colorRecipe).toBe("dark");
  });

  it("groups the run into a single painted band", () => {
    const bands = groupSectionsIntoBands(sections);
    const runs = bands.filter((band) => band.isBand);

    expect(
      runs,
      "the three joined sections should render inside one band wrapper",
    ).toHaveLength(1);
    expect(runs[0].sections.map((section) => section.name)).toEqual([
      "Band owner",
      "Joined one",
      "Joined two",
    ]);
  });

  it("leaves the section after the run outside it", () => {
    const bands = groupSectionsIntoBands(sections);
    const last = bands[bands.length - 1];

    expect(last.isBand).toBe(false);
    expect(last.sections.map((section) => section.name)).toEqual(["Separate"]);
  });
});
