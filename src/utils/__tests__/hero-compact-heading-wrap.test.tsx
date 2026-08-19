import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { HeroCompactSectionV3 } from "@/components/sections/HeroCompactSectionV3";
import { sectionLibraryV3Content } from "@/content/section-library-v3";

function collectClassNames(node: ReactNode, found: string[] = []): string[] {
  Children.forEach(node as ReactElement, (child) => {
    if (!isValidElement(child)) return;

    const props = child.props as { children?: ReactNode; className?: unknown };

    if (typeof props.className === "string") found.push(props.className);
    if (props.children) collectClassNames(props.children, found);
  });

  return found;
}

function renderHero(
  align: "left" | "center" | "right",
  headingSize: "heading-lg" | "heading-xl" | "display-lg",
) {
  return HeroCompactSectionV3({
    ...sectionLibraryV3Content.heroCompact,
    align,
    headingSize,
  }) as ReactElement;
}

describe("compact hero headline width", () => {
  it("widens the centered display headline without widening its type frame", () => {
    const classes = collectClassNames(renderHero("center", "display-lg"));

    expect(
      classes.some((className) => className.includes("col-span-5 col-start-2")),
    ).toBe(true);
    expect(
      classes.some((className) =>
        className.includes("hero-compact-wide-headline"),
      ),
    ).toBe(true);
  });

  it("keeps the wide treatment off smaller and side-aligned headings", () => {
    const centeredClasses = collectClassNames(renderHero("center", "heading-xl"));
    const leftClasses = collectClassNames(renderHero("left", "display-lg"));

    expect(
      centeredClasses.some((className) =>
        className.includes("col-span-5 col-start-2"),
      ),
    ).toBe(true);
    expect(
      leftClasses.some((className) => className.includes("col-span-4 col-start-1")),
    ).toBe(true);
    expect(
      [...centeredClasses, ...leftClasses].some((className) =>
        className.includes("hero-compact-wide-headline"),
      ),
    ).toBe(false);
  });
});
