/**
 * Shared vocabulary for the style toggles that pagebuilder sets, the staged
 * preview renders, and the style guide tunes.
 *
 * These lists used to be declared separately in `PagebuilderShell`,
 * `ContentEditorSection`, `PageTemplatePreview`, `StyleGuideControlBoard`, and
 * `StyleGuideSurfaceControls`. Duplicated option lists drift silently: a value
 * accepted by one screen and unknown to another falls back to a default with no
 * error, which is the same failure mode `AGENTS.md` warns about for copy
 * fields. One list per axis, imported everywhere.
 */

/** Text/image split orientation. Shared by the auto-height and fixed-ratio
 *  split families, which offer the same four arrangements. */
export const splitImageVariantOptions = [
  { label: "Text 3 / Image 4", value: "text-3-image-4-right" },
  { label: "Text 4 / Image 3", value: "text-4-image-3-right" },
  { label: "Image 3 / Text 4", value: "image-3-left-text-4" },
  { label: "Image 4 / Text 3", value: "image-4-left-text-3" },
] as const;

export type SplitImageVariant =
  (typeof splitImageVariantOptions)[number]["value"];

export const splitImageVariantValues = new Set<string>(
  splitImageVariantOptions.map((option) => option.value),
);

/** Image frame for the fixed-ratio split families. */
export const splitImageRatioOptions = [
  { label: "3:2", value: "3-2" },
  { label: "2:3", value: "2-3" },
  { label: "4:3", value: "4-3" },
  { label: "3:4", value: "3-4" },
  { label: "5:4", value: "5-4" },
  { label: "4:5", value: "4-5" },
] as const;

export type SplitImageRatio =
  (typeof splitImageRatioOptions)[number]["value"];

export const splitImageRatioValues = new Set<string>(
  splitImageRatioOptions.map((option) => option.value),
);

/**
 * Content-editor form of the ratio list. The empty value is the "inherit"
 * signal: a staged page stores `""` to mean "use whatever ratio the template
 * saved", so pagebuilder stays the source of truth and an override reads as an
 * override. See `getHeroSplitFixedImageRatio` in `PageTemplatePreview`.
 */
export const splitImageRatioFieldOptions = [
  { label: "Use template default", value: "" },
  ...splitImageRatioOptions,
] as const;

export const servicesBentoVariantOptions = [
  { label: "Centered", value: "default" },
  { label: "Split Header", value: "split-header" },
  { label: "Offset Header", value: "offset-header" },
] as const;

export type ServicesBentoVariant =
  (typeof servicesBentoVariantOptions)[number]["value"];

export const servicesBentoVariantValues = new Set<string>(
  servicesBentoVariantOptions.map((option) => option.value),
);

/**
 * Sections that read `cardFill` / `cardBorder`. Everything else ignores both,
 * so the staged editor offers no control rather than rendering a toggle that
 * silently does nothing. Derived from the section components that declare the
 * props - keep in sync when a section starts or stops accepting them.
 */
export const cardStyleComponents = new Set<string>([
  "ContentCardTwoUpSectionV3",
  "ContentHorizontalCardCarouselSectionV2",
  "ContentSplitFixedImageSectionV3",
  "ContentStickyCardStreamSectionV2",
  "ContentThreeColumnMixedSectionV3",
  "DecisionSplitLargeCardsSectionV3",
  "FAQSectionV3",
  "FourCardLinkGridSectionV3",
  "HeroCompactServiceSectionV3",
  "HeroSplitFixedImageSectionV3",
  "ProjectCaseStudyGallerySectionV3",
  "ServiceNeedsPriorityGridSectionV3",
  "ServicesBentoCardsSectionV2",
  "ServicesScrollCardsSectionV2",
  "ServicesThreeCardsRightSectionV3",
  "ThreeCardLinkGridSectionV3",
]);

/**
 * These sections render no card by default - the fill is opt-in, so an unset
 * value means "none" here rather than the usual "solid". Without this, every
 * saved instance would suddenly gain a card panel behind its copy.
 */
export const cardFillOptInComponents = new Set<string>([
  "HeroSplitFixedImageSectionV3",
  "ContentSplitFixedImageSectionV3",
]);

export function sectionSupportsCardStyle(component: string) {
  return cardStyleComponents.has(component);
}

/**
 * The fill a section actually renders when nothing is set, matching the
 * defaults the section components declare. The section frame needs this
 * because `globals.css` keys off `data-pagebuilder-card-fill`: reporting
 * "solid" on an opt-in section that renders unfilled applies the wrong recipe
 * rules to it.
 */
export function resolveCardFill(
  component: string,
  cardFill: string | undefined,
) {
  if (cardFill === "none" || cardFill === "solid") {
    return cardFill;
  }

  return cardFillOptInComponents.has(component) ? "none" : "solid";
}

/**
 * Per-section style overrides available on a staged page.
 *
 * These are the copy-neutral axes: changing one repaints a section but never
 * changes which fields it renders, so a staged override can never invalidate
 * approved copy. Variant/alignment axes are deliberately excluded - `variant`
 * is a single overloaded string encoding orientation, heading size, and image
 * mode together, so exposing it would drag the copy-affecting modes along.
 *
 * The `style.` path prefix keeps these out of the copy/asset namespace and
 * gives the content editor a cheap filter. An empty value always means
 * "inherit whatever pagebuilder saved on the template", so the template stays
 * the source of truth and an override reads as an override.
 */
export const styleFieldPrefix = "style";

export const styleFieldOptions = {
  cardBorder: [
    { label: "Use template default", value: "" },
    { label: "Border on", value: "on" },
    { label: "Border off", value: "off" },
  ],
  cardFill: [
    { label: "Use template default", value: "" },
    { label: "Filled", value: "solid" },
    { label: "Transparent", value: "none" },
  ],
  colorRecipe: [
    { label: "Use template default", value: "" },
    { label: "Default", value: "default" },
    { label: "Muted", value: "muted" },
    { label: "Dark", value: "dark" },
    { label: "Accent", value: "accent" },
  ],
} as const satisfies Record<string, ReadonlyArray<{ label: string; value: string }>>;

export type SectionStyleFieldName = keyof typeof styleFieldOptions;

export type SectionStyleFieldSpec = {
  label: string;
  name: SectionStyleFieldName;
  options: ReadonlyArray<{ label: string; value: string }>;
};

const colorRecipeStyleField: SectionStyleFieldSpec = {
  label: "Color recipe",
  name: "colorRecipe",
  options: styleFieldOptions.colorRecipe,
};

const cardStyleFields: SectionStyleFieldSpec[] = [
  { label: "Card fill", name: "cardFill", options: styleFieldOptions.cardFill },
  {
    label: "Card border",
    name: "cardBorder",
    options: styleFieldOptions.cardBorder,
  },
];

/** The style overrides a given section component offers. */
export function getSectionStyleFieldSpecs(
  component: string,
): SectionStyleFieldSpec[] {
  return sectionSupportsCardStyle(component)
    ? [colorRecipeStyleField, ...cardStyleFields]
    : [colorRecipeStyleField];
}

export function isStyleFieldPath(path: string) {
  return path.split(".")[1] === styleFieldPrefix;
}

/**
 * Global border weight.
 *
 * There is deliberately no zero-width option. `--border-surface-width-token`
 * overrides `.border` itself with `!important` (see `globals.css`), so a `0px`
 * setting strips every border on the site - nav dividers, inputs, builder
 * chrome - from a control that reads as a card-styling choice. Turning borders
 * off is a per-section decision and belongs to `SectionCardBorder`, which
 * pagebuilder and staged-page overrides set per section.
 *
 * Order matters: `StyleGuideSurfaceControls` renders this as a range input
 * indexed into this array, so entries must stay sorted thinnest to thickest.
 */
export const borderWidthOptions = [
  { label: "Fine", name: "border-fine", value: "1px" },
  { label: "Default", name: "border-default", value: "2px" },
  { label: "Bold", name: "border-bold", value: "3px" },
  { label: "Thick", name: "border-thick", value: "4px" },
] as const;

export const defaultBorderWidthOption = borderWidthOptions[1];

/**
 * Style guides saved while `border-none` was still offered keep a `0px` width,
 * which would render borderless with no active slider stop to explain why.
 * Coerce those reads to the thinnest real weight. The API validator still
 * accepts `0px` so existing saved documents stay loadable rather than erroring.
 */
export function resolveBorderWidthOption(name: unknown, value: unknown) {
  const match = borderWidthOptions.find(
    (option) => option.name === name || option.value === value,
  );

  return match ?? defaultBorderWidthOption;
}
