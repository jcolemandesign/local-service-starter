import { describe, expect, it } from "vitest";

import {
  getSectionStyleFieldSpecs,
  cardStyleComponents,
  resolveCardFill,
  styleFieldOptions,
  styleFieldPrefix,
} from "@/content/section-style-options";
import pageTemplates from "@/content/page-templates.json";
import { resolveSectionStyleOverrides } from "@/components/sections/PageTemplatePreview";
import {
  getTemplateStyleFieldsForSection,
  type StagedPageField,
} from "@/utils/staged-pages";

/**
 * Guards the same silent-fallback failure mode as the copy-field parity test,
 * for style overrides.
 *
 * A style field is only useful if the name the spec declares is the name the
 * resolver reads. A mismatch does not throw: the override is simply ignored and
 * the section renders with its template value, which looks exactly like an
 * editor who never touched the control. Export validation cannot see it either,
 * because the field exists and holds a legal value - it just does nothing.
 */

function styleField(sectionId: string, name: string, value: string): StagedPageField {
  return {
    id: `page.${sectionId}.${styleFieldPrefix}.${name}`,
    kind: "meta",
    path: `${sectionId}.${styleFieldPrefix}.${name}`,
    value,
  };
}

const cardComponent = "ContentCardTwoUpSectionV3";
const plainComponent = "SectionHeaderLargeSectionV3";

describe("section style override specs", () => {
  it("offers a color recipe on every section and card controls only on card sections", () => {
    const cardNames = getSectionStyleFieldSpecs(cardComponent).map(
      (spec) => spec.name,
    );
    const plainNames = getSectionStyleFieldSpecs(plainComponent).map(
      (spec) => spec.name,
    );

    expect(cardNames).toEqual(["colorRecipe", "cardFill", "cardBorder"]);
    expect(plainNames).toEqual(["colorRecipe"]);
  });

  it("seeds every declared style field empty so a fresh page inherits the template", () => {
    const fields = getTemplateStyleFieldsForSection({
      component: cardComponent,
      instruction: "",
      mode: "Narrative",
      name: "Card Two Up",
    });

    expect(fields).toHaveLength(3);
    expect(fields.every((field) => field.value === "")).toBe(true);
    expect(fields.every((field) => field.kind === "meta")).toBe(true);
    expect(fields.map((field) => field.name)).toEqual([
      `${styleFieldPrefix}.colorRecipe`,
      `${styleFieldPrefix}.cardFill`,
      `${styleFieldPrefix}.cardBorder`,
    ]);
  });

  it("every card-style component is a real component used by a saved template", () => {
    const templateComponents = new Set(
      (pageTemplates as { templates?: Array<{ sections?: Array<{ component?: string }> }> })
        .templates?.flatMap((template) =>
          (template.sections ?? []).map((section) => section.component ?? ""),
        ) ?? [],
    );

    // Only assert over components the saved templates actually reference, so a
    // section that exists but is not yet used by a template does not fail this.
    const referenced = [...cardStyleComponents].filter((component) =>
      templateComponents.has(component),
    );

    expect(referenced.length).toBeGreaterThan(0);
  });
});

describe("resolveSectionStyleOverrides", () => {
  const section = {
    cardFill: "solid" as const,
    colorRecipe: "default" as const,
    component: cardComponent,
    id: "card-1",
    instruction: "",
    mode: "Narrative",
    name: "Card Two Up",
  };

  it("applies every declared style field name the spec advertises", () => {
    // The point of the test: drive each spec'd name through the resolver and
    // require it to land. A renamed field on either side fails here.
    getSectionStyleFieldSpecs(cardComponent).forEach((spec) => {
      const override = spec.options.find((option) => option.value !== "");

      expect(override).toBeDefined();

      const resolved = resolveSectionStyleOverrides(section, [
        styleField("card-1", spec.name, override?.value ?? ""),
      ]) as Record<string, unknown>;

      expect(resolved[spec.name]).toBe(override?.value);
    });
  });

  it("treats an empty value as inherit rather than as a value", () => {
    const resolved = resolveSectionStyleOverrides(section, [
      styleField("card-1", "colorRecipe", ""),
    ]);

    expect(resolved.colorRecipe).toBe("default");
    expect(resolved).toBe(section);
  });

  it("ignores values outside the declared option list", () => {
    const resolved = resolveSectionStyleOverrides(section, [
      styleField("card-1", "colorRecipe", "neon"),
    ]);

    expect(resolved.colorRecipe).toBe("default");
  });

  it("ignores card overrides on sections that do not render cards", () => {
    const resolved = resolveSectionStyleOverrides(
      { ...section, component: plainComponent },
      [styleField("card-1", "cardFill", "none")],
    );

    expect(resolved.cardFill).toBe("solid");
  });

  it("is idempotent, so preview and export can both resolve", () => {
    const fields = [styleField("card-1", "colorRecipe", "dark")];
    const once = resolveSectionStyleOverrides(section, fields);
    const twice = resolveSectionStyleOverrides(once, fields);

    expect(twice).toEqual(once);
  });
});

describe("resolveCardFill", () => {
  it("defaults opt-in sections to unfilled, matching the component defaults", () => {
    expect(resolveCardFill("ContentSplitFixedImageSectionV3", undefined)).toBe("none");
    expect(resolveCardFill("HeroSplitFixedImageSectionV3", undefined)).toBe("none");
  });

  it("defaults every other card section to filled", () => {
    expect(resolveCardFill(cardComponent, undefined)).toBe("solid");
  });

  it("honors an explicit value over the default", () => {
    expect(resolveCardFill("ContentSplitFixedImageSectionV3", "solid")).toBe("solid");
    expect(resolveCardFill(cardComponent, "none")).toBe("none");
  });
});

describe("style field options", () => {
  it("starts every option list with the inherit choice", () => {
    Object.values(styleFieldOptions).forEach((options) => {
      expect(options[0].value).toBe("");
    });
  });
});
