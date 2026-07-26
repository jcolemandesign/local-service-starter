import { describe, expect, it } from "vitest";
import { pagebuilderRecipes } from "@/content/pagebuilder";
import {
  getCanonicalSectionLabel,
  sectionLibraryV3Collections,
  sectionLibraryV3Registry,
} from "@/content/section-library-v3";
import { getSectionId } from "@/utils/section-id";
import { getTemplateCopySectionFingerprint } from "@/utils/template-copy-contract";

const libraryEntries = sectionLibraryV3Collections.flatMap((collection) =>
  collection.items.map((item) => ({
    family: collection.title,
    label: item.label,
    slug: item.component,
  })),
);

describe("canonical section labels", () => {
  it("keeps a unique component identity for every library section", () => {
    expect(sectionLibraryV3Registry).toHaveLength(75);
    expect(new Set(sectionLibraryV3Registry.map((entry) => entry.slug)).size).toBe(
      sectionLibraryV3Registry.length,
    );
    expect(
      new Set(sectionLibraryV3Registry.map((entry) => entry.component)).size,
    ).toBe(sectionLibraryV3Registry.length);
    expect(
      sectionLibraryV3Registry.map(({ family, label, slug }) => ({
        family,
        label,
        slug,
      })),
    ).toEqual(libraryEntries);
  });

  it("resolves every recipe section through the pure library registry", () => {
    const registryByComponent = new Map<
      string,
      (typeof sectionLibraryV3Registry)[number]
    >(
      sectionLibraryV3Registry.map((entry) => [entry.component, entry]),
    );

    for (const recipe of pagebuilderRecipes) {
      for (const section of recipe.sectionStack) {
        const registryEntry = registryByComponent.get(section.component);

        expect(
          registryEntry,
          `${recipe.id}: ${section.component} is missing from the section registry`,
        ).toBeDefined();
        expect(
          getCanonicalSectionLabel(section.component, section.name),
        ).toBe(registryEntry?.label);
      }
    }
  });

  it("normalizes labels without repeating the Narrative family name", () => {
    const labelBySlug = new Map<string, string>(
      sectionLibraryV3Registry.map((entry) => [entry.slug, entry.label]),
    );

    const expectedLabels = new Map([
      ["hero-fullscreen-v2", "Fullscreen image hero"],
      ["hero-split-full-height-v3", "Split content and full image hero"],
      ["four-card-link-grid-v3", "Card links 4-up"],
      ["content-about-story-v3", "Editorial 3-col"],
      ["content-card-two-up-v3", "Card content 2-up"],
      ["content-three-column-mixed-v3", "Mixed content 3-col"],
      ["feature-asymmetric-cards-v3", "Feature cards 4-up split"],
      ["trust-logo-marquee-v3", "Trust logo marquee"],
      ["process-image-checklist-v3", "Process image checklist"],
      ["trust-marquee-legacy", "CTA headline with scrolling banner"],
      ["content-fixed-cover-fade-v2", "CTA fixed cover fade"],
    ]);

    for (const [slug, expectedLabel] of expectedLabels) {
      expect(labelBySlug.get(slug)).toBe(expectedLabel);
    }

    const narrativeLabels = sectionLibraryV3Registry
      .filter((entry) => entry.family === "Narrative")
      .map((entry) => entry.label);

    expect(
      narrativeLabels.every((label) => !label.startsWith("Narrative ")),
    ).toBe(true);
  });

  it("does not mutate the structural name, section id, or fingerprint", () => {
    const section = pagebuilderRecipes
      .flatMap((recipe) => recipe.sectionStack)
      .find(
        (candidate) =>
          candidate.component === "ContentAboutCompanySectionV2",
      );

    expect(section).toBeDefined();

    if (!section) {
      return;
    }

    const serializedBefore = JSON.stringify(section);
    const sectionIdBefore = getSectionId(section, 0);
    const fingerprintBefore = getTemplateCopySectionFingerprint(section);

    expect(getCanonicalSectionLabel(section.component, section.name)).toBe(
      "About company",
    );
    expect(section.name).toBe("General editorial texture");
    expect(JSON.stringify(section)).toBe(serializedBefore);
    expect(getSectionId(section, 0)).toBe(sectionIdBefore);
    expect(getTemplateCopySectionFingerprint(section)).toBe(fingerprintBefore);
  });
});
