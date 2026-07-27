import { describe, expect, it } from "vitest";

import { renderPageTemplateSection } from "@/components/sections/PageTemplatePreview";
import { sectionLibraryV3Content } from "@/content/section-library-v3";

/**
 * The heading-size control writes `${align}-${size}` into `section.variant`,
 * and each surface maps that string back to a size. When a size has no branch
 * of its own it falls through to the section-library default, which is not an
 * error and not visible in the builder - the button just appears to do nothing.
 *
 * That is exactly how `display-lg` broke on section header content: compact
 * hero defaults to `display-lg` so the largest button looked fine there, while
 * section header content defaults to `heading-xl` and silently ignored it.
 *
 * Asserting every option round-trips through the real render path keeps a new
 * size, or a new section reusing this control, from landing dead the same way.
 */

type RenderedProps = { headingSize?: string };

function headingSizeFor(component: string, variant: string) {
  const element = renderPageTemplateSection(
    { component, colorRecipe: undefined, mode: "Section Header", name: component, variant } as never,
    1,
    [],
    [],
    "/",
  );

  return (element as { props: RenderedProps }).props.headingSize;
}

const compactHeaderSizes = ["heading-lg", "heading-xl", "display-lg"] as const;

describe("compact heading-size control", () => {
  for (const component of [
    "SectionHeaderCompactSectionV3",
    "HeroCompactSectionV3",
  ]) {
    for (const size of compactHeaderSizes) {
      it(`${component} honors ${size}`, () => {
        expect(headingSizeFor(component, `center-${size}`)).toBe(size);
      });
    }

    it(`${component} falls back to its library default when no size is set`, () => {
      const expected =
        component === "HeroCompactSectionV3"
          ? sectionLibraryV3Content.heroCompact.headingSize
          : sectionLibraryV3Content.sectionHeaderCompact.headingSize;

      expect(headingSizeFor(component, "center")).toBe(expected);
    });
  }
});
