import { describe, expect, it } from "vitest";

import staged from "@/content/projects/north-star-hvac/staged-pages.json";
import { getSectionId } from "@/utils/section-id";
import { getTemplateAssetFieldsForSection } from "@/utils/staged-pages";

/**
 * The export refuses a site whose images are still the section library's own.
 *
 * `validateStagedFields` only rejects an image field that is empty. A field
 * holding `/images/fpo-image.svg` is populated and well-formed, so it passed
 * validation and the section rendered its FPO placeholder - a grey gradient
 * box labelled "Texture" or "Process" - onto a live client site.
 *
 * `validatePlaceholderAssets` is not exported, so this exercises the rule it
 * implements against the real staged data rather than the function itself:
 * an image field still equal to its asset-contract default was never
 * replaced. If the rule and this reimplementation ever disagree, the export is
 * the authority - but the counts below are what make the guard worth having,
 * and they are read from real data rather than asserted from memory.
 */

type Section = { component: string; mode?: string; name?: string };

function placeholderFieldsFor(page: {
  fields?: Array<{ path: string; value: string }>;
  template?: { sections?: Section[] };
}) {
  const valueByPath = new Map(
    (page.fields ?? []).map((f) => [f.path, f.value.trim()]),
  );

  return (page.template?.sections ?? []).flatMap((section, index) => {
    const sectionId = getSectionId(section as never, index);

    return getTemplateAssetFieldsForSection(section as never)
      .filter((spec: { kind: string }) => spec.kind === "image")
      .filter((spec: { name: string; value: string }) => {
        const value = valueByPath.get(`${sectionId}.${spec.name}`);
        return value === undefined || value === spec.value.trim();
      })
      .map((spec: { name: string }) => `${sectionId}.${spec.name}`);
  });
}

describe("placeholder asset guard", () => {
  const pages = (staged as { pages?: unknown[] }).pages ?? [];

  it("finds staged pages to check", () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  /**
   * The reason the guard exists. If this ever drops to zero the site is
   * genuinely on real imagery - delete the expectation then, do not weaken it.
   */
  it("catches the placeholder imagery currently staged", () => {
    const flagged = pages.flatMap((page) => placeholderFieldsFor(page as never));

    expect(flagged.length).toBeGreaterThan(0);
  });

  it("does not flag a field whose value differs from the library default", () => {
    const page = {
      fields: [
        { path: "01-hero.imageSrc", value: "/images/client-crew-photo.jpg" },
      ],
      template: {
        sections: [
          {
            component: "HeroSplitFixedImageSectionV3",
            mode: "Hero",
            name: "Fixed ratio split image",
          },
        ],
      },
    };

    expect(placeholderFieldsFor(page)).not.toContain("01-hero.imageSrc");
  });

  /**
   * An absent field is as bad as an unchanged one: the mapper falls back to
   * library demo content, so nothing written means the placeholder renders.
   */
  it("treats a missing image field as a placeholder", () => {
    const page = {
      fields: [],
      template: {
        sections: [
          {
            component: "HeroSplitFixedImageSectionV3",
            mode: "Hero",
            name: "Fixed ratio split image",
          },
        ],
      },
    };

    expect(placeholderFieldsFor(page).length).toBeGreaterThan(0);
  });

  /**
   * ...except where the contract says empty is an answer.
   *
   * The ground image is decorative - the colour recipe already paints the
   * section - so a section set to the image treatment and left without one is
   * finished, not unfinished. While it was required, choosing "Image" in the
   * builder and not following through wedged the entire export on a field that
   * exists to be optional.
   */
  it("does not block export on an empty ground image", () => {
    const section = {
      backgroundTreatment: "image",
      component: "HeroSplitFixedImageSectionV3",
      mode: "Hero",
      name: "Fixed ratio split image",
    };

    const groundImage = getTemplateAssetFieldsForSection(
      section as never,
    ).find((spec: { name: string }) => spec.name === "backgroundImage");

    expect(groundImage, "the image treatment should declare a ground image").toBeDefined();
    expect(groundImage?.optional).toBe(true);
  });

  it("still declares no ground image when the treatment does not use one", () => {
    const section = {
      backgroundTreatment: "gradient",
      component: "HeroSplitFixedImageSectionV3",
      mode: "Hero",
      name: "Fixed ratio split image",
    };

    expect(
      getTemplateAssetFieldsForSection(section as never).some(
        (spec: { name: string }) => spec.name === "backgroundImage",
      ),
    ).toBe(false);
  });
});
