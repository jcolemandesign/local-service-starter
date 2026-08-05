import { describe, expect, it } from "vitest";

import {
  groupSectionsIntoBands,
  withBandRecipe,
  type BandableSection,
} from "@/utils/section-bands";

function section(component: string, joinAbove?: string): BandableSection {
  return { component, joinAbove };
}

const content = "ContentMainIdeaGridSectionV3";
const hero = "HeroCompactSectionV3";
const nav = "NavPrimarySectionV2";

/** Shape assertions read better as component names than as objects. */
function shape(sections: readonly BandableSection[]) {
  return groupSectionsIntoBands(sections).map((band) => ({
    isBand: band.isBand,
    components: band.sections.map((entry) => entry.component),
    startIndex: band.startIndex,
  }));
}

describe("groupSectionsIntoBands", () => {
  it("returns nothing for an empty list", () => {
    expect(groupSectionsIntoBands([])).toEqual([]);
  });

  /**
   * The regression that matters most. Every page saved before bands existed
   * carries no `joinAbove` at all, and each of those sections has to come back
   * as its own run with `isBand` false so no wrapper is emitted around it.
   */
  it("gives every section its own run when nothing joins", () => {
    expect(shape([section(hero), section(content), section(content)])).toEqual([
      { isBand: false, components: [hero], startIndex: 0 },
      { isBand: false, components: [content], startIndex: 1 },
      { isBand: false, components: [content], startIndex: 2 },
    ]);
  });

  it("collects a run of consecutive joiners into one band", () => {
    expect(
      shape([
        section(hero),
        section(content, "join"),
        section(content, "join"),
        section(content),
      ]),
    ).toEqual([
      { isBand: true, components: [hero, content, content], startIndex: 0 },
      { isBand: false, components: [content], startIndex: 3 },
    ]);
  });

  it("starts a new band where a joiner follows a non-joiner", () => {
    expect(
      shape([
        section(content),
        section(content, "join"),
        section(content),
        section(content, "join"),
      ]),
    ).toEqual([
      { isBand: true, components: [content, content], startIndex: 0 },
      { isBand: true, components: [content, content], startIndex: 2 },
    ]);
  });

  /**
   * The first section has nothing above it. `joinAbove` on it is not an error -
   * a reorder can easily produce it - so it starts its own run instead.
   */
  it("ignores joinAbove on the first section", () => {
    expect(shape([section(content, "join"), section(content)])).toEqual([
      { isBand: false, components: [content], startIndex: 0 },
      { isBand: false, components: [content], startIndex: 1 },
    ]);
  });

  it("never lets navigation join a band", () => {
    expect(shape([section(content), section(nav, "join")])).toEqual([
      { isBand: false, components: [content], startIndex: 0 },
      { isBand: false, components: [nav], startIndex: 1 },
    ]);
  });

  /** A nav cannot open a band either, so the section under it starts its own. */
  it("does not let a section join a band opened by navigation", () => {
    expect(
      shape([section(nav), section(hero, "join"), section(content, "join")]),
    ).toEqual([
      { isBand: false, components: [nav], startIndex: 0 },
      { isBand: true, components: [hero, content], startIndex: 1 },
    ]);
  });

  it("breaks a run where navigation interrupts it", () => {
    expect(
      shape([
        section(content),
        section(content, "join"),
        section(nav, "join"),
        section(content, "join"),
      ]),
    ).toEqual([
      { isBand: true, components: [content, content], startIndex: 0 },
      { isBand: false, components: [nav], startIndex: 2 },
      { isBand: false, components: [content], startIndex: 3 },
    ]);
  });

  it("treats any value other than join as its own background", () => {
    expect(
      shape([section(content), section(content, "separate"), section(content, "")]),
    ).toEqual([
      { isBand: false, components: [content], startIndex: 0 },
      { isBand: false, components: [content], startIndex: 1 },
      { isBand: false, components: [content], startIndex: 2 },
    ]);
  });

  it("preserves the original section objects", () => {
    const first = section(hero);
    const second = section(content, "join");
    const [band] = groupSectionsIntoBands([first, second]);

    expect(band.sections[0]).toBe(first);
    expect(band.sections[1]).toBe(second);
  });
});

/**
 * A band member's own recipe never paints - the band owns the ground - but the
 * component is also handed a recipe as a prop and picks its text and card
 * colours from it. Before this existed the two disagreed, and setting a recipe
 * on a joined section restyled its contents against a ground nothing painted.
 */
describe("withBandRecipe", () => {
  it("gives every member the recipe of the section that opens the band", () => {
    const [band] = groupSectionsIntoBands([
      { colorRecipe: "ink", component: hero },
      { colorRecipe: "accent", component: content, joinAbove: "join" },
      { component: content, joinAbove: "join" },
    ]);

    expect(withBandRecipe(band).map((entry) => entry.colorRecipe)).toEqual([
      "ink",
      "ink",
      "ink",
    ]);
  });

  it("leaves a lone section's own recipe alone", () => {
    const [band] = groupSectionsIntoBands([
      { colorRecipe: "accent", component: content },
    ]);

    expect(withBandRecipe(band).map((entry) => entry.colorRecipe)).toEqual([
      "accent",
    ]);
  });

  /** The opening section is the band's, so it is handed back untouched. */
  it("does not copy the section that opens the band", () => {
    const first = section(hero);
    const [band] = groupSectionsIntoBands([first, section(content, "join")]);

    expect(withBandRecipe(band)[0]).toBe(first);
  });
});
