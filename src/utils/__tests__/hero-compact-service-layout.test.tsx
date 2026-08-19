import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { HeroCompactServiceSectionV3 } from "@/components/sections/HeroCompactServiceSectionV3";
import { sectionLibraryV3Content } from "@/content/section-library-v3";
import {
  heroCompactServiceLayoutOptions,
  resolveHeroCompactServiceLayout,
} from "@/content/section-style-options";

function collectClassNames(node: ReactNode, found: string[] = []): string[] {
  Children.forEach(node as ReactElement, (child) => {
    if (!isValidElement(child)) return;

    const props = child.props as { children?: ReactNode; className?: unknown };

    if (typeof props.className === "string") found.push(props.className);
    if (props.children) collectClassNames(props.children, found);
  });

  return found;
}

function renderLayout(align: "none" | "center" | "right") {
  return HeroCompactServiceSectionV3({
    ...sectionLibraryV3Content.heroCompactService,
    align,
  }) as ReactElement;
}

describe("compact service hero layouts", () => {
  it("replaces left with the none layout and migrates saved left values", () => {
    expect(heroCompactServiceLayoutOptions.map((option) => option.value)).toEqual([
      "none",
      "center",
      "right",
    ]);
    expect(resolveHeroCompactServiceLayout("left")).toBe("none");
    expect(resolveHeroCompactServiceLayout(undefined)).toBe("right");
    expect(resolveHeroCompactServiceLayout("unexpected")).toBe("right");
  });

  it("uses the wider no-image composition only for none", () => {
    const noneClasses = collectClassNames(renderLayout("none"));
    const rightClasses = collectClassNames(renderLayout("right"));

    expect(noneClasses.some((classes) => classes.includes("col-span-8 col-start-1"))).toBe(true);
    expect(noneClasses.some((classes) => classes.includes("col-span-5 col-start-10"))).toBe(true);
    expect(noneClasses.some((classes) => classes.includes("type-display-lg"))).toBe(true);
    expect(noneClasses.some((classes) => classes.includes("aspect-[4/3]"))).toBe(false);

    expect(rightClasses.some((classes) => classes.includes("col-span-4 col-start-11"))).toBe(true);
    expect(rightClasses.some((classes) => classes.includes("type-heading-xl"))).toBe(true);
    expect(rightClasses.some((classes) => classes.includes("aspect-[4/3]"))).toBe(true);
  });
});
