import { cloneElement, isValidElement, type ReactNode } from "react";

import { resolveSectionColorRecipe } from "@/content/section-color-recipes";
import {
  cardLinkComponents,
  cardLinkGridAlignComponents,
  cardLinkGridAlignValues,
  cardStyleComponents,
  backgroundFillComponents,
  headlineWrapComponents,
  iconComponents,
  resolveCardFill,
  resolveCardBorder,
  resolveBackgroundFill,
  resolveHeadlineWrap,
  resolveSectionIcons,
  tableCompareAlignComponents,
  tableCompareAlignValues,
} from "@/content/section-style-options";

/**
 * The toggle values a section record can carry. Deliberately structural rather
 * than tied to `WorkingSection` or `PagebuilderRecipeSection`, so the builder
 * shell, the gallery, and the staged preview can all pass their own shape.
 */
export type SectionToggleSource = {
  align?: string;
  backgroundFill?: string;
  cardBorder?: string;
  cardFill?: string;
  cardLinks?: string;
  colorRecipe?: string;
  component: string;
  headlineWrap?: string;
  icons?: string;
};

/**
 * The toggle props a component actually accepts, resolved from a section record.
 *
 * Keyed off the same membership sets that decide whether the builder offers the
 * control, so a section can never be offered a control whose value is then
 * dropped on the way to the component - the two answers come from one source.
 *
 * Values go through the shared resolvers rather than being passed raw:
 * `resolveCardFill` applies the opt-in default (a section that renders no card
 * by default must read "none", not "solid", or `globals.css` applies the wrong
 * recipe rules to it).
 */
export function getSectionToggleProps(section: SectionToggleSource) {
  const props: Record<string, string> = {};

  // Offered on every section (`getSectionStyleFieldSpecs` always includes it),
  // so it is passed unconditionally. Sections that do not accept the prop
  // ignore it - these are components with named props, not DOM nodes.
  props.colorRecipe =
    resolveSectionColorRecipe(section.colorRecipe) ?? "default";

  if (backgroundFillComponents.has(section.component)) {
    props.backgroundFill = resolveBackgroundFill(section.backgroundFill);
  }

  if (cardStyleComponents.has(section.component)) {
    props.cardFill = resolveCardFill(section.component, section.cardFill);
    props.cardBorder = resolveCardBorder(section.component, section.cardBorder);
  }

  if (iconComponents.has(section.component)) {
    props.icons = resolveSectionIcons(section.icons);
  }

  if (cardLinkComponents.has(section.component)) {
    props.cardLinks = section.cardLinks === "off" ? "off" : "on";
  }

  if (headlineWrapComponents.has(section.component)) {
    props.headlineWrap = resolveHeadlineWrap(section.headlineWrap);
  }

  // Alignment is the one axis with no safe default to force: each section's own
  // default differs, and the two axes accept different value sets. Set it only
  // when the record holds a value valid for that section's axis, so an unset
  // align leaves the component's own default in place.
  const alignValues = cardLinkGridAlignComponents.has(section.component)
    ? cardLinkGridAlignValues
    : tableCompareAlignComponents.has(section.component)
      ? tableCompareAlignValues
      : undefined;

  if (alignValues?.has(section.align ?? "")) {
    props.align = section.align as string;
  }

  return props;
}

/**
 * Apply a section's toggles to an already-built element.
 *
 * The builder canvas renders most sections through a prebuilt `previewCatalog`
 * entry, which is created once from a synthetic section carrying no toggle
 * values. Cloning the toggle props onto it at render time is what makes the
 * controls live for every section rather than only for the ones with a
 * hand-written branch in the render chain - which is how a new section shipped
 * with three controls that rendered and did nothing.
 *
 * Only the toggle axes are overridden. Anything else a branch decided for
 * itself - variant, alignment, heading level, colour recipe - is left alone.
 */
export function withSectionToggles(
  element: ReactNode,
  section: SectionToggleSource,
): ReactNode {
  const props = getSectionToggleProps(section);

  if (!isValidElement(element) || Object.keys(props).length === 0) {
    return element;
  }

  return cloneElement(element, props);
}
