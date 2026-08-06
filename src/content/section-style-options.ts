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

import type { WrapMode } from "@/content/type-palettes";
import type {
  SectionBackgroundFill,
  SectionCardBorder,
  SectionCardFill,
} from "@/content/section-color-recipes";

/** Text/image split orientation. Shared by the auto-height and fixed-ratio
 *  split families, which offer the same four arrangements.
 *
 *  These render on a 14-column grid with one empty column between the slots,
 *  so the labels read 6/7 while the values still read 3/4 - the values are
 *  persisted in project page data and are opaque ids, not column counts.
 *  Renaming them would require migrating every saved page. */
export const splitImageVariantOptions = [
  { label: "Text 6 / Image 7", value: "text-3-image-4-right" },
  { label: "Text 7 / Image 6", value: "text-4-image-3-right" },
  { label: "Image 6 / Text 7", value: "image-3-left-text-4" },
  { label: "Image 7 / Text 6", value: "image-4-left-text-3" },
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
 * Handedness for the bento tray split.
 *
 * Two options rather than the four above because the tray's weighting is not a
 * choice: the slots are always 6 and 8 adjacent columns, so the only
 * arrangement left is which side the image tile lands on.
 */
export const splitBentoVariantOptions = [
  { label: "Image right", value: "image-right" },
  { label: "Image left", value: "image-left" },
] as const;

export type SplitBentoVariant =
  (typeof splitBentoVariantOptions)[number]["value"];

export const splitBentoVariantValues = new Set<string>(
  splitBentoVariantOptions.map((option) => option.value),
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

/**
 * Card arrangement for the callout section that keeps its detail panel beside
 * the cards.
 *
 * "default" is the existing two-up grid: a fixed 2x2, capped at four cards,
 * panel held still beside it. "stacked" runs the cards one-up down a single
 * column, takes any number of them, and makes the panel sticky so it stays in
 * view as the taller stack scrolls past.
 */
export const calloutSplitPanelVariantOptions = [
  { label: "Two-up grid", value: "default" },
  { label: "Stacked rows", value: "stacked" },
] as const;

export type CalloutSplitPanelVariant =
  (typeof calloutSplitPanelVariantOptions)[number]["value"];

export const calloutSplitPanelVariantValues = new Set<string>(
  calloutSplitPanelVariantOptions.map((option) => option.value),
);

/**
 * Card arrangement for the callout section whose panel reveals over the cards.
 *
 * "default" is the existing two-across block, capped at four cards in a 2x2.
 * "three-across" runs three to a row and takes up to six, so it sits right at
 * either one full row of three or two full rows of six.
 *
 * Saved pages predate this axis and store no variant at all. Both the unset
 * value and "default" have to resolve to the same layout and the same copy
 * fields, or every approved page using this section goes stale on read.
 */
export const calloutRevealGridVariantOptions = [
  { label: "Two across", value: "default" },
  { label: "Three across", value: "three-across" },
] as const;

export type CalloutRevealGridVariant =
  (typeof calloutRevealGridVariantOptions)[number]["value"];

export const calloutRevealGridVariantValues = new Set<string>(
  calloutRevealGridVariantOptions.map((option) => option.value),
);

/**
 * Where the three-up card link row sits on the 14-column grid.
 *
 * The cards are four columns each, so twelve of the fourteen are spoken for and
 * the two spare columns are what the alignment moves:
 *
 *   left       1-4  5-8  9-12   two spare columns trailing
 *   center     2-5  6-9  10-13  one spare column either side (the default)
 *   right      3-6  7-10 11-14  two spare columns leading
 *   justified  1-4  6-9  11-14  one spare column between each card
 *
 * Deliberately its own axis rather than another value folded into `variant`.
 * `variant` already carries this section's images on/off mode and is hashed
 * into the copy-contract fingerprint, so compounding the two would make a
 * purely visual nudge report every approved page's copy as stale. This sits
 * with `cardFill` and `cardBorder` instead - copy-neutral, outside the
 * fingerprint.
 *
 * Four-up is not offered this axis: four cards with a column between each needs
 * 4w + 3 = 14, and there is no whole-column width that satisfies it.
 */
export const cardLinkGridAlignOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
  // Abbreviated so four buttons fit one row of the builder's control grid. The
  // value stays spelled out - it is persisted on saved sections.
  { label: "Just.", value: "justified" },
] as const;

export type CardLinkGridAlign =
  (typeof cardLinkGridAlignOptions)[number]["value"];

export const cardLinkGridAlignValues = new Set<string>(
  cardLinkGridAlignOptions.map((option) => option.value),
);

/** Sections that read the `align` axis, so the builder only offers it there. */
export const cardLinkGridAlignComponents = new Set<string>([
  "HorizontalCardLinkGridSectionV3",
  "ThreeCardLinkGridSectionV3",
]);

export function sectionSupportsCardLinkGridAlign(component: string) {
  return cardLinkGridAlignComponents.has(component);
}

/**
 * Where the four-column compare table sits on the 14-column grid. The table is
 * one twelve-column block, so unlike `cardLinkGridAlignOptions` there is nothing
 * between the cells to redistribute - the two spare columns simply move:
 *
 *   left     1-12   two spare columns trailing
 *   center   2-13   one spare column either side (the default)
 *   right    3-14   two spare columns leading
 *
 * No "justified" value: that axis spreads spare columns *between* cards, and
 * this section has no gaps between its cells to spread into.
 *
 * Shares the copy-neutral `align` field with the card-link axis rather than
 * `variant`, so nudging the table does not report approved copy as stale.
 */
export const tableCompareAlignOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
] as const;

export type TableCompareAlign =
  (typeof tableCompareAlignOptions)[number]["value"];

export const tableCompareAlignValues = new Set<string>(
  tableCompareAlignOptions.map((option) => option.value),
);

/**
 * Sections that read the table-compare `align` axis.
 *
 * Named for the comparison tables it was built for, but the axis is really
 * "where do the spare columns go", and any section whose cells fill twelve of
 * fourteen columns has the same three positions available. The split-large-cards
 * section is one: two cards of six columns leave the same two spare.
 */
export const tableCompareAlignComponents = new Set<string>([
  "DecisionMatrixCardSectionV3",
  "DecisionQuestionTableFourSectionV3",
  "DecisionSplitLargeCardsSectionV3",
  "HorizontalCardLinkGridTwoUpSectionV3",
]);

export function sectionSupportsTableCompareAlign(component: string) {
  return tableCompareAlignComponents.has(component);
}

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
  "AdditionalOffersSectionV3",
  "CTASmallBandImageSectionV3",
  "CTAServiceTriageSectionV3",
  "ContactStripBentoSectionV3",
  "ContactStripSmallSectionV3",
  "ContentCardTwoUpSectionV3",
  "ContentHorizontalCardCarouselSectionV2",
  "ContentMainIdeaGridSectionV3",
  "ContentSplitFixedImageSectionV3",
  "ContentStickyCardStreamSectionV2",
  "ContentStickyIdeasSectionV2",
  "ContentThreeColumnMixedSectionV3",
  "DecisionMatrixCardSectionV3",
  "DecisionQuestionTableFourSectionV3",
  "DecisionQuestionTableSectionV3",
  "DecisionSplitDecisionLargeSectionV3",
  "DecisionSplitDecisionSectionV3",
  "DecisionSplitLargeCardsSectionV3",
  "FAQSectionV3",
  "FAQAccordionSidebarSectionV3",
  "FeaturedOfferSectionV3",
  "FinancingCalculatorSectionV3",
  "FourCardLinkGridSectionV3",
  "HeroCompactServiceSectionV3",
  "HeroSplitBentoSectionV3",
  "HorizontalCardLinkGridSectionV3",
  "HorizontalCardLinkGridTwoUpSectionV3",
  "InfoStripSectionV3",
  "NavCenterLogoSectionV2",
  "NavPrimarySectionV2",
  "OfferTermsSectionV3",
  "ProcessStepsBranchingSectionV3",
  "ProcessStripSectionV3",
  "ProcessStepsStaggeredSectionV3",
  "ProjectCaseStudyGallerySectionV3",
  "ServiceCalloutRevealGridSectionV3",
  "ServiceCalloutSplitPanelSectionV3",
  "ServiceNeedsPriorityGridSectionV3",
  "ServicesBentoCardsSectionV2",
  "ServicesScrollCardsSectionV2",
  "ServicesThreeCardsRightSectionV3",
  "ThreeCardLinkGridSectionV3",
  "TrustBarFloatingBentoSectionV3",
]);

/**
 * Sections whose ordinary card links can be switched off in pagebuilder,
 * turning the cards into static content.
 *
 * Deliberately not one of the `styleFieldOptions` above: those are copy-neutral
 * axes that a staged page may override, because repainting a section can never
 * invalidate approved copy. This one changes which fields the section asks for
 * - destinations and the shared link label come and go with it - so it is a
 * template-level decision, stored beside `variant` and `ratio`, and flipping it
 * moves the contract fingerprint.
 *
 * Scoped to ordinary link cards. CTA sections are excluded because their
 * buttons are the conversion action, and the callout sections are excluded
 * because their cards are controls rather than navigation.
 *
 * The two split-decision sections are the edge of that rule: their links are
 * text links reading "talk through a repair", so they sit closer to navigation
 * than to a CTA button, and a comparison block is often wanted as plain
 * explanation with the conversion left to a later section.
 */
export const cardLinkComponents = new Set<string>([
  "ContentThreeColumnMixedSectionV3",
  "DecisionSplitDecisionLargeSectionV3",
  "DecisionSplitDecisionSectionV3",
  "DecisionSplitLargeCardsSectionV3",
  "FourCardLinkGridSectionV3",
  "HorizontalCardLinkGridSectionV3",
  "HorizontalCardLinkGridTwoUpSectionV3",
  "ServiceNeedsPriorityGridSectionV3",
  "ThreeCardLinkGridSectionV3",
]);

export function sectionSupportsCardLinks(component: string) {
  return cardLinkComponents.has(component);
}

/**
 * Whether a section draws its small marker icons.
 *
 * One shared on/off axis, but deliberately no shared icon: what the marker is
 * and where it goes is a layout decision each section makes for itself - split
 * large cards indents every paragraph chunk with one, another section might
 * mark list rows or headings. The axis says whether, the section says how.
 *
 * Copy-neutral, so it sits with `cardFill`, `cardBorder` and `align` rather
 * than on `variant`: a marker cannot change what the page agent is asked to
 * write, and `variant` is hashed into the copy-contract fingerprint.
 */
export const iconsOptions = [
  { label: "Icons on", value: "on" },
  { label: "Icons off", value: "off" },
] as const;

export type SectionIcons = (typeof iconsOptions)[number]["value"];

export const iconsValues = new Set<string>(
  iconsOptions.map((option) => option.value),
);

export const iconComponents = new Set<string>([
  "AdditionalOffersSectionV3",
  "CTAServiceTriageSectionV3",
  "ContactStripBentoSectionV3",
  "ContactStripSmallSectionV3",
  "DecisionSplitLargeCardsSectionV3",
  "FeaturedOfferSectionV3",
  "FinancingCalculatorSectionV3",
  "HorizontalCardLinkGridSectionV3",
  "HorizontalCardLinkGridTwoUpSectionV3",
  "InfoStripSectionV3",
  "OfferTermsSectionV3",
  "ProcessStripSectionV3",
]);

export function sectionSupportsIcons(component: string) {
  return iconComponents.has(component);
}

/** Icons default on, so a section that offers them shows them unless told not to. */
export function resolveSectionIcons(icons: string | undefined): SectionIcons {
  return icons === "off" ? "off" : "on";
}

/**
 * How a section's headline breaks across lines.
 *
 * The style guide already sets a wrap mode per type scale; this is the
 * per-section override for sections whose headline is the whole composition,
 * where the difference between an evenly balanced block and a merely widow-free
 * one is the layout decision rather than a typographic default. Same three
 * values as `WrapMode` so both screens speak one vocabulary.
 *
 * Copy-neutral, so it sits with `cardFill`, `align`, and `icons` rather than on
 * `variant`: where a headline breaks cannot change what the page agent is asked
 * to write, and `variant` is hashed into the copy-contract fingerprint.
 */
export const headlineWrapOptions = [
  { label: "Balanced", value: "balance" },
  { label: "Pretty", value: "pretty" },
  { label: "Default", value: "wrap" },
] as const satisfies ReadonlyArray<{ label: string; value: WrapMode }>;

export type SectionHeadlineWrap = WrapMode;

export const headlineWrapValues = new Set<string>(
  headlineWrapOptions.map((option) => option.value),
);

export const headlineWrapComponents = new Set<string>([
  "SectionHeaderLargeSectionV3",
]);

export function sectionSupportsHeadlineWrap(component: string) {
  return headlineWrapComponents.has(component);
}

/**
 * Every heading scale ships `text-wrap: balance`, so an unset value resolves to
 * balance and saved sections keep rendering exactly as they did before the axis
 * existed.
 */
export function resolveHeadlineWrap(
  wrap: string | undefined,
): SectionHeadlineWrap {
  return headlineWrapValues.has(wrap ?? "")
    ? (wrap as SectionHeadlineWrap)
    : "balance";
}

/**
 * These sections render no card by default - the fill is opt-in, so an unset
 * value means "none" here rather than the usual "solid". Without this, every
 * saved instance would suddenly gain a card panel behind its copy.
 */
export const cardFillOptInComponents = new Set<string>([
  "ContentSplitFixedImageSectionV3",
  "NavCenterLogoSectionV2",
  "NavPrimarySectionV2",
]);

/** Sections whose grouped surfaces are borderless until explicitly outlined. */
export const cardBorderOptInComponents = new Set<string>([
  "NavCenterLogoSectionV2",
  "NavPrimarySectionV2",
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
): SectionCardFill {
  if (cardFill === "none" || cardFill === "solid") {
    return cardFill;
  }

  return cardFillOptInComponents.has(component) ? "none" : "solid";
}

export function resolveCardBorder(
  component: string,
  cardBorder: string | undefined,
): SectionCardBorder {
  if (cardBorder === "on" || cardBorder === "off") {
    return cardBorder;
  }

  return cardBorderOptInComponents.has(component) ? "off" : "on";
}

/** Navigation is the first family where section paint and grouped-card paint
 *  are independently useful, so it alone offers this axis for now. */
export const backgroundFillComponents = new Set<string>([
  "NavCenterLogoSectionV2",
  "NavPrimarySectionV2",
]);

/**
 * Navigation sections, which cannot join a background band.
 *
 * A nav frame is positioned `fixed` or `absolute` in the overlay and fixed-nav
 * modes, so it is out of flow and a band wrapped around it would measure the
 * wrong height. The nav/hero pair already wraps it for the same reason, and two
 * wrappers competing for one element is the case worth not having. Excluding
 * nav keeps bands to a single level of nesting.
 */
export const navigationComponents = new Set<string>([
  "NavCenterLogoSection",
  "NavCenterLogoSectionV2",
  "NavFloatingBentoSection",
  "NavFloatingBentoSectionV2",
  "NavPrimarySection",
  "NavPrimarySectionV2",
]);

export function sectionSupportsJoinAbove(component: string) {
  return !navigationComponents.has(component);
}

export function resolveJoinAbove(joinAbove: string | undefined) {
  return joinAbove === "join";
}

/**
 * Navigation is excluded for the same reason it cannot join a band: it is site
 * chrome that spends most of its life out of flow, and a texture on it would
 * travel over the sections it floats above. Everything else may carry one -
 * a treatment on a single section is the same feature as one on a band, which
 * is why the CSS keys on the attribute rather than on either box.
 */
export function sectionSupportsBackgroundTreatment(component: string) {
  return !navigationComponents.has(component);
}

export function sectionSupportsBackgroundFill(component: string) {
  return backgroundFillComponents.has(component);
}

export function resolveBackgroundFill(
  backgroundFill: string | undefined,
): SectionBackgroundFill {
  return backgroundFill === "none" ? "none" : "solid";
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
  backgroundFill: [
    { label: "Use template default", value: "" },
    { label: "Background on", value: "solid" },
    { label: "Transparent", value: "none" },
  ],
  /**
   * Whether this section shares the section above's background.
   *
   * Consecutive sections set to `join` render inside one band element, which
   * becomes the paint surface for the whole run - see `groupSectionsIntoBands`
   * in `@/utils/section-bands`. Copy-neutral: it changes which box paints the
   * ground, never which fields the section renders.
   *
   * Stored as a string rather than a boolean. `reduceTopPadding` and
   * `reduceBottomPadding` are booleans for historical reasons and are the
   * documented trap in this file; every other axis here is a string, and a
   * string needs no special case in `resolveSectionStyleOverrides`.
   */
  joinAbove: [
    { label: "Use template default", value: "" },
    { label: "Own background", value: "separate" },
    { label: "Join above", value: "join" },
  ],
  /**
   * Texture laid over the ground, on top of whatever the colour recipe paints.
   *
   * Every value is drawn from the live tokens rather than from fixed colours, so
   * one treatment reads correctly on all five recipes. `drift` is the only one
   * that moves, and it animates the same image `gradient` paints, so reduced
   * motion degrades to that rather than to nothing.
   *
   * Copy-neutral: it changes what the ground looks like, never which fields a
   * section renders.
   */
  backgroundTreatment: [
    { label: "Use template default", value: "" },
    { label: "None", value: "none" },
    { label: "Gradient", value: "gradient" },
    { label: "Grain", value: "grain" },
    { label: "Drift", value: "drift" },
    { label: "Image", value: "image" },
    { label: "Parallax", value: "image-parallax" },
  ],
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
    { label: "Surface", value: "surface" },
    { label: "Dark", value: "dark" },
    { label: "Accent", value: "accent" },
    { label: "Ink", value: "ink" },
  ],
  reduceTopPadding: [
    { label: "Use template default", value: "" },
    { label: "Default spacing", value: "default" },
    { label: "Reduced", value: "reduced" },
  ],
  reduceBottomPadding: [
    { label: "Use template default", value: "" },
    { label: "Default spacing", value: "default" },
    { label: "Reduced", value: "reduced" },
  ],
} as const satisfies Record<string, ReadonlyArray<{ label: string; value: string }>>;

/**
 * Style fields the section record stores as booleans rather than strings.
 *
 * The option values have to stay strings so `""` can mean "inherit the
 * template", but spreading `"default"` onto `reduceTopPadding` would be truthy
 * and silently reduce the padding it was meant to restore. Resolvers convert
 * these two back to booleans instead of spreading them raw.
 */
export const booleanStyleFields = new Set<SectionStyleFieldName>([
  "reduceBottomPadding",
  "reduceTopPadding",
]);

/** Declared after `styleFieldOptions` so it is not read inside its own TDZ. */
const backgroundTreatmentValues = new Set<string>(
  styleFieldOptions.backgroundTreatment
    .map((option) => option.value)
    .filter(Boolean),
);

/**
 * Falls back to `none` for anything unrecognised, so a template saved with a
 * treatment that has since been removed renders an untextured ground rather
 * than an attribute no stylesheet matches.
 */
export function resolveBackgroundTreatment(
  backgroundTreatment: string | undefined,
) {
  return backgroundTreatment &&
    backgroundTreatmentValues.has(backgroundTreatment)
    ? backgroundTreatment
    : "none";
}

/**
 * A background image path, safe to interpolate into a CSS `url()`.
 *
 * The value arrives from a staged page's asset field, which is hand-edited
 * content rather than a fixed constant, and it is placed into a stylesheet
 * rather than into markup. React escapes what it puts in the DOM, but it does
 * not parse CSS, so a value carrying a quote, a paren, a backslash, or a
 * semicolon could close the `url()` early and append declarations of its own.
 *
 * Allowlisted rather than escaped: an image reference here is a site-relative
 * path or an http(s) URL, and anything that is not one of those is far more
 * likely to be a mistake than an image nobody thought of. Anything rejected
 * renders as no image, never as unquoted CSS.
 */
/**
 * Treatments that need a ground image supplied.
 *
 * `image` and `image-parallax` are the same picture pinned differently, so they
 * share one asset field rather than each asking for their own - switching
 * between them keeps the image an editor already chose.
 */
const groundImageTreatments = new Set(["image", "image-parallax"]);

export function treatmentUsesGroundImage(treatment: string | undefined) {
  return groundImageTreatments.has(treatment ?? "");
}

const safeImageReference = /^(?:\/|https?:\/\/)[\w\-./%?=&,:+~@]*$/;

export function resolveBackgroundImage(backgroundImage: string | undefined) {
  const trimmed = backgroundImage?.trim() ?? "";

  return safeImageReference.test(trimmed) ? trimmed : "";
}

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

const backgroundFillStyleField: SectionStyleFieldSpec = {
  label: "Background",
  name: "backgroundFill",
  options: styleFieldOptions.backgroundFill,
};

const joinAboveStyleField: SectionStyleFieldSpec = {
  label: "Background band",
  name: "joinAbove",
  options: styleFieldOptions.joinAbove,
};

const backgroundTreatmentStyleField: SectionStyleFieldSpec = {
  label: "Background texture",
  name: "backgroundTreatment",
  options: styleFieldOptions.backgroundTreatment,
};

const cardStyleFields: SectionStyleFieldSpec[] = [
  { label: "Card fill", name: "cardFill", options: styleFieldOptions.cardFill },
  {
    label: "Card border",
    name: "cardBorder",
    options: styleFieldOptions.cardBorder,
  },
];

/**
 * Section spacing moves the frame's padding and nothing else, so it can never
 * change which fields a section renders or invalidate approved copy. Every
 * content-height section offers it - see `viewportHeightComponents` for the
 * ones that do not.
 */
const spacingStyleFields: SectionStyleFieldSpec[] = [
  {
    label: "Top spacing",
    name: "reduceTopPadding",
    options: styleFieldOptions.reduceTopPadding,
  },
  {
    label: "Bottom spacing",
    name: "reduceBottomPadding",
    options: styleFieldOptions.reduceBottomPadding,
  },
];

/**
 * Sections whose height is the viewport rather than their content - a full or
 * near-full screen, a scroll-length story, or a sticky panel.
 *
 * These do not offer section spacing. Trimming the padding cannot shorten one
 * of them, because the min-height immediately takes the space back; all it does
 * is push the content nearer the edges. A control labelled "section spacing"
 * that never changes the section's spacing on the page reads as broken, so it
 * is not offered rather than left to confuse.
 *
 * Membership is a fact about the component's own layout: it belongs here if the
 * section pins a viewport-derived min-height (`section-min-screen`,
 * `-sliver`, `-story`, `-sticky`). Content-height sections - the compact heroes,
 * section headers, and every ordinary content block - keep the control, because
 * on those the padding really is the section's height.
 */
export const viewportHeightComponents = new Set<string>([
  "ContentFixedCoverFadeSectionV2",
  "ContentHorizontalCardCarouselSectionV2",
  "ContentScrollWrittenRevealSectionV2",
  "ContentStickyImagePanelSectionV2",
  "ContentStickyImagePanelSectionV3",
  "HeroCenteredFloatersSectionV2",
  "HeroContentTopImageBottomSectionV2",
  "HeroFullscreenSectionV2",
  "HeroImageTopContentBottomSectionV2",
  "HeroSectionV2",
  "HeroServicesSectionV3",
  "HeroSplitBentoSectionV3",
  "HeroSplitFixedImageSectionV3",
  "HeroSplitFullHeightSectionV3",
  "HeroServiceAreaZipLookupSectionV3",
  "HeroStackedHeaderImageSectionV2",
]);

export function sectionSupportsSectionSpacing(component: string) {
  return !viewportHeightComponents.has(component);
}

/** The style overrides a given section component offers. */
export function getSectionStyleFieldSpecs(
  component: string,
): SectionStyleFieldSpec[] {
  return [
    colorRecipeStyleField,
    ...(sectionSupportsJoinAbove(component) ? [joinAboveStyleField] : []),
    ...(sectionSupportsBackgroundTreatment(component)
      ? [backgroundTreatmentStyleField]
      : []),
    ...(sectionSupportsBackgroundFill(component)
      ? [backgroundFillStyleField]
      : []),
    ...(sectionSupportsCardStyle(component) ? cardStyleFields : []),
    ...(sectionSupportsSectionSpacing(component) ? spacingStyleFields : []),
  ];
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
