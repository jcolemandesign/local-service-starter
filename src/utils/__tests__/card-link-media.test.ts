import { describe, expect, it } from "vitest";

import { resolveCardLinkMedia } from "@/content/section-style-options";
import { getTemplateAssetFieldsForSection } from "@/utils/staged-pages";

function cardGridSection(overrides: Record<string, unknown> = {}) {
  return {
    component: "ThreeCardLinkGridSectionV3",
    instruction: "Show three linked cards.",
    mode: "Scan",
    name: "Card Links 3 Up",
    ...overrides,
  };
}

describe("card-link media", () => {
  it("keeps legacy image variants backward compatible", () => {
    expect(resolveCardLinkMedia(undefined, "with-images")).toBe("photo");
    expect(resolveCardLinkMedia(undefined, "text-only")).toBe("none");
  });

  it("prefers the new explicit media treatment", () => {
    expect(resolveCardLinkMedia("icon", "text-only")).toBe("icon");
    expect(resolveCardLinkMedia("photo", "text-only")).toBe("photo");
  });

  it("keeps the same card asset fields for every treatment", () => {
    const fieldNames = ["photo", "icon", "none"].map((cardMedia) =>
      getTemplateAssetFieldsForSection(
        cardGridSection({ cardMedia }) as never,
      ).map((field) => field.name),
    );

    expect(fieldNames[1]).toEqual(fieldNames[0]);
    expect(fieldNames[2]).toEqual(fieldNames[0]);
  });

  it("does not block export on hidden media placeholders", () => {
    const imageFields = getTemplateAssetFieldsForSection(
      cardGridSection({ cardMedia: "none" }) as never,
    ).filter((field) => field.kind === "image");

    expect(imageFields.length).toBe(3);
    expect(imageFields.every((field) => field.optional)).toBe(true);
  });
});
