import { describe, expect, it } from "vitest";

import { resolveBackgroundImage } from "@/content/section-style-options";
import {
  getTemplateAssetFieldsForSection,
  type StagedPageTemplateSection,
} from "@/utils/staged-pages";

function section(
  overrides: Partial<StagedPageTemplateSection> = {},
): StagedPageTemplateSection {
  return {
    component: "ContentMainIdeaGridSectionV3",
    instruction: "",
    mode: "Narrative",
    name: "Main idea grid",
    ...overrides,
  };
}

/**
 * The ground image is the one field on this path that reaches a *stylesheet*
 * rather than markup. React escapes what it renders into the DOM; it does not
 * parse CSS. A value that closes the `url()` early would have whatever follows
 * read as declarations, so the sanitiser is a boundary, not a convenience.
 */
describe("resolveBackgroundImage", () => {
  it("accepts site-relative paths and http(s) urls", () => {
    expect(resolveBackgroundImage("/images/hero.jpg")).toBe("/images/hero.jpg");
    expect(resolveBackgroundImage("/uploads/a-b_c.20%25.webp")).toBe(
      "/uploads/a-b_c.20%25.webp",
    );
    expect(resolveBackgroundImage("https://cdn.example.com/a.png?v=2")).toBe(
      "https://cdn.example.com/a.png?v=2",
    );
    expect(resolveBackgroundImage("  /images/hero.jpg  ")).toBe(
      "/images/hero.jpg",
    );
  });

  it("rejects anything that could close the url() and add declarations", () => {
    expect(resolveBackgroundImage('/a.jpg"); background: red; //')).toBe("");
    expect(resolveBackgroundImage("/a.jpg'); color: red")).toBe("");
    expect(resolveBackgroundImage("/a.jpg); position: fixed")).toBe("");
    expect(resolveBackgroundImage("/a.jpg\\22 ")).toBe("");
    expect(resolveBackgroundImage("/a.jpg\n; top: 0")).toBe("");
  });

  it("rejects schemes that are not a plain image reference", () => {
    expect(resolveBackgroundImage("javascript:alert(1)")).toBe("");
    expect(resolveBackgroundImage("data:text/html,<script>")).toBe("");
    // Relative paths are rejected too: an image reference here is resolved
    // against the site root, so a bare filename would silently not load.
    expect(resolveBackgroundImage("images/hero.jpg")).toBe("");
  });

  it("treats missing and empty values as no image", () => {
    expect(resolveBackgroundImage(undefined)).toBe("");
    expect(resolveBackgroundImage("")).toBe("");
    expect(resolveBackgroundImage("   ")).toBe("");
  });
});

describe("ground image asset field", () => {
  /**
   * Gated on the treatment. Offered unconditionally it would put an empty image
   * slot on every section of every page, for a feature most of them never use.
   */
  it("is not requested unless the section is set to carry an image", () => {
    const names = getTemplateAssetFieldsForSection(section()).map(
      (field) => field.name,
    );

    expect(names).not.toContain("backgroundImage");
  });

  it("is requested once the image treatment is chosen", () => {
    const fields = getTemplateAssetFieldsForSection(
      section({ backgroundTreatment: "image" }),
    );
    const groundImage = fields.find(
      (field) => field.name === "backgroundImage",
    );

    expect(groundImage).toBeDefined();
    expect(groundImage?.kind).toBe("image");
    // Seeded empty: there is no sensible demo photograph for an arbitrary
    // section's ground, and a placeholder would export as real content.
    expect(groundImage?.value).toBe("");
  });

  /** Parallax is the same picture pinned differently, so it shares the field -
   *  switching between the two keeps an image the editor already chose. */
  it("is requested for the parallax treatment too", () => {
    const names = getTemplateAssetFieldsForSection(
      section({ backgroundTreatment: "image-parallax" }),
    ).map((field) => field.name);

    expect(names).toContain("backgroundImage");
  });

  it("is not requested for the other treatments", () => {
    ["none", "gradient", "grain", "drift"].forEach((backgroundTreatment) => {
      const names = getTemplateAssetFieldsForSection(
        section({ backgroundTreatment }),
      ).map((field) => field.name);

      expect(names, backgroundTreatment).not.toContain("backgroundImage");
    });
  });

  /** The component's own assets must survive the wrapper that adds the ground. */
  it("keeps the fields the component itself declares", () => {
    const withImage = getTemplateAssetFieldsForSection(
      section({
        backgroundTreatment: "image",
        component: "HeroServiceAreaZipLookupSectionV3",
      }),
    ).map((field) => field.name);

    expect(withImage).toContain("imageSrc");
    expect(withImage).toContain("imageAlt");
    expect(withImage).toContain("backgroundImage");
  });
});
