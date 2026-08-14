import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { FeatureAsymmetricCardsSectionV3 } from "@/components/sections/FeatureAsymmetricCardsSectionV3";
import { sectionLibraryV3Content } from "@/content/section-library-v3";

function collectGridSlots(node: ReactNode, found: string[] = []): string[] {
  Children.forEach(node as ReactElement, (child) => {
    if (!isValidElement(child)) return;

    const props = child.props as { className?: unknown; children?: ReactNode };
    if (
      typeof props.className === "string" &&
      /\bcol-start-\d/.test(props.className)
    ) {
      found.push(props.className);
    }
    if (props.children) collectGridSlots(props.children, found);
  });

  return found;
}

describe("Feature Cards Icons card position", () => {
  it.each([
    { align: "left" as const, copyStart: "col-start-1", cardsStart: "col-start-4" },
    { align: "right" as const, copyStart: "col-start-5", cardsStart: "col-start-1" },
  ])("maps the $align toggle to its layout", ({ align, copyStart, cardsStart }) => {
    const section = FeatureAsymmetricCardsSectionV3({
      ...sectionLibraryV3Content.featureAsymmetricCards,
      align,
    }) as ReactElement;
    const [copySlot, cardsSlot] = collectGridSlots(section);

    expect(copySlot).toContain(copyStart);
    expect(cardsSlot).toContain(cardsStart);
    expect(copySlot).toContain("row-start-1");
    expect(cardsSlot).toContain("row-start-1");
  });
});
