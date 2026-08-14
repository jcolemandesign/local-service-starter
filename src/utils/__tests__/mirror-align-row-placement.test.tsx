import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { HeroFullscreenSectionV2 } from "@/components/sections/HeroFullscreenSectionV2";
import { HeroServicesSectionV3 } from "@/components/sections/HeroServicesSectionV3";
import { sectionLibraryV3Content } from "@/content/section-library-v3";
import {
  sectionMirrorAlignOptions,
  type SectionMirrorAlign,
} from "@/content/section-style-options";

/**
 * A mirrored section has to pin an explicit row on both of its slots.
 *
 * Grid's sparse auto-placement never moves its cursor backwards. The copy slot
 * comes first in the DOM, so the arrangement that puts it on the RIGHT places
 * it at the later columns and then asks for the earlier ones for the slot
 * beside it - which grid answers by starting a new row. The two slots stack,
 * and the mirror is simply gone.
 *
 * The failure is one-sided, which is what makes it worth a test: the `left`
 * arrangement runs its columns forwards and works whether or not a row is
 * pinned, so the section looks completely correct until someone picks the other
 * option. The fullscreen hero shipped exactly that way.
 *
 * jsdom does not do grid layout, so this cannot assert the rendered geometry.
 * It asserts the thing that causes it instead: both slots name a row, and at
 * the desktop baseline they name the SAME row. That is the property the layout
 * depends on, and it is one string comparison away from the bug.
 */

function collectClassNames(node: ReactNode, found: string[] = []): string[] {
  Children.forEach(node as ReactElement, (child) => {
    if (!isValidElement(child)) return;

    const props = child.props as { className?: unknown; children?: ReactNode };

    if (typeof props.className === "string") found.push(props.className);
    if (props.children) collectClassNames(props.children, found);
  });

  return found;
}

/** The grid slots: elements that place themselves on a column. */
function slotClassNames(element: ReactElement) {
  return collectClassNames(element).filter((className) =>
    /\bcol-start-\d/.test(className),
  );
}

function baseRowOf(className: string) {
  // The unprefixed row, ignoring every `max-*:` responsive override - those
  // deliberately restack and are not what the mirror depends on.
  return className
    .split(/\s+/)
    .find((token) => /^row-start-\d+$/.test(token));
}

/*
 * The components are called directly rather than mounted.
 *
 * Both are plain server components, and what this test reads - the grid slots'
 * className props - is present in the element tree the function returns. Going
 * through a renderer would resolve the primitives into DOM as well, which is
 * more machinery for no more information.
 */
const sections: Array<{
  name: string;
  render: (align: SectionMirrorAlign) => ReactElement;
}> = [
  {
    name: "HeroFullscreenSectionV2",
    render: (align) =>
      HeroFullscreenSectionV2({
        ...sectionLibraryV3Content.heroFullscreen,
        align,
      }) as ReactElement,
  },
  {
    name: "HeroServicesSectionV3",
    render: (align) =>
      HeroServicesSectionV3({
        ...sectionLibraryV3Content.heroServices,
        align,
      }) as ReactElement,
  },
];

describe("mirrored sections place both slots on one row", () => {
  for (const { name, render } of sections) {
    for (const { value: align } of sectionMirrorAlignOptions) {
      it(`${name} pins a desktop row on every slot when aligned ${align}`, () => {
        const slots = slotClassNames(render(align));

        expect(
          slots.length,
          "expected at least the copy slot and the slot beside it",
        ).toBeGreaterThanOrEqual(2);

        const rows = slots.map(baseRowOf);

        expect(
          rows.every(Boolean),
          `${name}/${align}: a slot places itself on a column but not on a row, so grid auto-placement decides - and on the mirrored arrangement it decides to start a new row`,
        ).toBe(true);

        expect(
          new Set(rows).size,
          `${name}/${align}: the slots name different rows, so they stack instead of sitting side by side`,
        ).toBe(1);
      });
    }
  }
});
