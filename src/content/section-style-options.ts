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

import { isBackgroundImageFocusValue } from "@/content/background-image-config";
import {
  borderIntensityOptions,
  cardIntensityOptions,
} from "@/content/color-overrides";
import type { WrapMode } from "@/content/type-palettes";
import {
  type SectionAnimation,
  type SectionBackgroundFill,
  type SectionCardBorder,
  type SectionCardBorderTone,
  type SectionCardFill,
  sectionColorRecipes,
} from "@/content/section-color-recipes";

/** Text/image split orientation. Shared by the auto-height and fixed-ratio
 *  split families, which offer the same four arrangements.
 *
 *  These render on a 14-column grid with one empty column between the slots,
 *  so the labels read 6/7 while the values still read 3/4 - the values are
 *  persisted in project page data and are opaque ids, not column counts.
 *  Renaming them would require migrating every saved page. */
export const splitImageVariantOptions = [
  { label: "Text 6 / Img 7", value: "text-3-image-4-right" },
  { label: "Text 7 / Img 6", value: "text-4-image-3-right" },
  { label: "Img 6 / Text 7", value: "image-3-left-text-4" },
  { label: "Img 7 / Text 6", value: "image-4-left-text-3" },
] as const;

export type SplitImageVariant =
  (typeof splitImageVariantOptions)[number]["value"];

export const splitImageVariantValues = new Set<string>(
  splitImageVariantOptions.map((option) => option.value),
);

/** Full-image splits can also let the two panels share two grid columns.
 * Kept out of the base split list because framed fixed-image layouts do not
 * implement the overlap treatment. */
export const fullImageSplitVariantOptions = [
  ...splitImageVariantOptions,
  {
    label: "Text 9 / Img 9",
    value: "text-7-image-9-overlap-right",
  },
  {
    label: "Img 9 / Text 9",
    value: "image-9-overlap-left-text-7",
  },
] as const;

export type FullImageSplitVariant =
  (typeof fullImageSplitVariantOptions)[number]["value"];

export const fullImageSplitVariantValues = new Set<string>(
  fullImageSplitVariantOptions.map((option) => option.value),
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
  { label: "Split", value: "split-header" },
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
  "CTAMutedSectionV3",
  "CTAScrollRevealOfferSectionV3",
  "CTASectionV3",
  "CTASmallBandImageSectionV3",
  "CTAServiceTriageSectionV3",
  "ContactSectionModalBegin",
  "ContactSectionV3",
  "ContactStripBentoSectionV3",
  "ContactStripSmallSectionV3",
  "ContentAboutCompanySectionV2",
  "ContentCardTwoUpSectionV3",
  "ContentFixedCoverFadeSectionV2",
  "ContentHorizontalCardCarouselSectionV2",
  "ContentMainIdeaGridSectionV3",
  "ContentNarrativeFeatureRailSectionV3",
  "ContentPhotoGalleryBandCarouselSectionV3",
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
  "FeatureOverlapRowsSectionV3",
  "FeaturedOfferSectionV3",
  "FinancingCalculatorSectionV3",
  "FourCardLinkGridSectionV3",
  "HeroCompactServiceSectionV3",
  "HeroServiceAreaZipLookupSectionV3",
  "HeroServicesSectionV3",
  "HeroSplitBentoSectionV3",
  "HorizontalCardLinkGridSectionV3",
  "HorizontalCardLinkGridTwoUpSectionV3",
  "InfoStripSectionV3",
  "NavCenterLogoSectionV2",
  "NavFloatingBentoSectionV2",
  "NavPrimarySectionV2",
  "OfferTermsSectionV3",
  "ProcessImageChecklistSectionV3",
  "ProcessStepsBranchingSectionV3",
  "ProcessStripSectionV3",
  "ProcessStepsStaggeredSectionV3",
  "ProjectCaseStudyGallerySectionV3",
  "QuickPageLinksSectionV2",
  "ServiceCalloutRevealGridSectionV3",
  "ServiceCalloutSplitPanelSectionV3",
  "ServiceNeedsPriorityGridSectionV3",
  "ServiceAreaZipLookupSectionV3",
  "ServicesBentoCardsSectionV2",
  "ServicesHoverPanelSectionV2",
  "ServicesScrollCardsSectionV2",
  "ServicesThreeCardsRightSectionV3",
  "ThankYouConfirmationSectionV3",
  "ThreeCardLinkGridSectionV3",
  "TestimonialsCarouselCondensedSectionV3",
  "TestimonialsCarouselSectionV3",
  "TestimonialsMasonrySectionV3",
  "TestimonialsSectionV3",
  "TrustBarFloatingBentoSectionV3",
  "TrustLogoGridSectionV3",
  "TrustLogoMarqueeSectionV3",
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
  "SectionHeaderSplitLinkSectionV3",
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
  "ContentAboutCompanySectionV2",
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

/**
 * Which border-color formula an outlined card draws with. Offered on every
 * section that offers `cardBorder` at all - the tone is inert until the
 * border is on, but there is no case where a section takes one and not the
 * other, so one membership set covers both. See `SectionCardBorderTone` for
 * why this cannot be baked into the recipe tables instead.
 */
export const borderToneOptions = [
  { label: "Dark border", value: "dark" },
  { label: "Light border", value: "light" },
] as const satisfies ReadonlyArray<{ label: string; value: SectionCardBorderTone }>;

export const borderToneValues = new Set<string>(
  borderToneOptions.map((option) => option.value),
);

export function sectionSupportsBorderTone(component: string) {
  return cardStyleComponents.has(component);
}

/** Defaults dark: the formula every recipe row already assumed before this
 *  toggle existed, so an unset value renders exactly as it did before. */
export function resolveBorderTone(
  borderTone: string | undefined,
): SectionCardBorderTone {
  return borderTone === "light" ? "light" : "dark";
}

/**
 * Every per-section setting that has to survive the trip from the builder to
 * the exported site.
 *
 * A section's settings are copied by hand at three hops - the promote-to-
 * template request, the template route's normaliser, and the staged page's
 * preview mapping - and each hop is an allowlist. Adding an axis to the
 * builder without adding it to all three drops it silently: the control works
 * in pagebuilder, the value saves to the working stack, and then promotion
 * quietly discards it. That is how band membership and ground textures were
 * lost between a staged page and its template.
 *
 * So the names live here once and the three hops read them. Deliberately not
 * split by the copy-affecting vs copy-neutral rule in `docs/builder-workflow.md`
 * §3 - that distinction decides what invalidates approved copy, and it does not
 * apply here, because every one of these has to arrive intact either way.
 */
export const sectionToggleFieldNames = [
  "align",
  "animation",
  "backgroundConfig",
  "backgroundFill",
  "backgroundImageFit",
  "backgroundImageFocus",
  "backgroundTreatment",
  "borderIntensity",
  "borderSwatch",
  "borderTone",
  "cardBorder",
  "cardFill",
  /**
   * The four colour override fields. They travel as a set: a swatch with no
   * intensity is meaningful (it takes that kind's default) but an intensity
   * with no swatch is inert, so dropping either half at a hop turns an
   * override into either the wrong colour or nothing at all.
   */
  "cardIntensity",
  "cardSwatch",
  "cardLinks",
  "colorRecipe",
  "headlineWrap",
  "icons",
  "joinAbove",
  "ratio",
  "variant",
] as const;

export type SectionToggleFieldName = (typeof sectionToggleFieldNames)[number];

/**
 * The settings a section is actually carrying, ready to spread onto the next
 * shape it travels as.
 *
 * Unset fields are left out rather than written as `undefined`, so spreading
 * the result over a section cannot blank a value the target already holds, and
 * a promoted template gains no keys for axes the section never used.
 */
export function pickSectionToggleFields<T extends object>(
  section: T,
): Pick<T, Extract<keyof T, SectionToggleFieldName>> {
  const picked = {} as Record<string, unknown>;

  for (const name of sectionToggleFieldNames) {
    const value = (section as Record<string, unknown>)[name];

    if (value !== undefined) {
      picked[name] = value;
    }
  }

  return picked as Pick<T, Extract<keyof T, SectionToggleFieldName>>;
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

/**
 * Sections that mark up revealable units, and can therefore be animated.
 *
 * Membership means the section has at least one element carrying a marker class
 * (`reveal-on-scroll`), so switching the axis on actually does something. This
 * is the same rule every other membership set in this file follows: a control
 * that renders and silently does nothing is worse than no control, which is the
 * failure 51 of 93 sections shipped with before `getSectionToggleProps` read
 * these sets.
 *
 * The first four are the sections that already carried the marker class
 * unconditionally, from before the axis existed. The rest of the library is
 * added as it is marked up, family by family.
 *
 * `animation-marker-ownership.test.ts` pins this against the markup in both
 * directions, so a section cannot carry a marker class without being offered
 * the control, and cannot be listed here without carrying one.
 */
export const animationComponents = new Set<string>([
  "ContentStickyCardStreamSectionV2",
  "FeatureAsymmetricCardsSectionV3",
  "FeatureStackedCardsSectionV3",
  "ProcessImageChecklistSectionV3",
  /**
   * The card-grid family, from the library's Scan collection. These are the
   * "cards rise and fade in" case the axis was asked for, and they are the
   * tightest family to do first: five sections, one repeated card each, and
   * three of them already share their card element - both horizontal grids
   * render `HorizontalCardLink`, so marking it covers the 3-up and the 2-up at
   * once.
   *
   * The rest of the Scan collection is deliberately not here yet. The carousels
   * and the hover/scroll panels animate internally with Motion already, and an
   * outer entrance on top of that needs a decision per section rather than a
   * blanket sweep.
   */
  "FourCardLinkGridSectionV3",
  "HorizontalCardLinkGridSectionV3",
  "HorizontalCardLinkGridTwoUpSectionV3",
  "ServiceNeedsPriorityGridSectionV3",
  "ThreeCardLinkGridSectionV3",
  /**
   * The section headers, which fade rather than rise as a list. Two of the three
   * are one block of copy and reveal as a single unit; the split header has a
   * headline beside an aside, so it takes a real two-step stagger. Highest
   * value per edit in the library - these appear on nearly every page.
   */
  "SectionHeaderCompactSectionV3",
  "SectionHeaderLargeSectionV3",
  "SectionHeaderSplitLinkSectionV3",
  /**
   * Narrative, first pass: the ones whose units are unambiguous.
   *
   * Two shapes appear here and both matter. The two grids stagger their cards,
   * the lead card of the main-idea grid included, because it is the same card
   * family as the four beside it. The two splits reveal as two units in reading
   * order - prose then aside, portrait then paragraph - and deliberately do NOT
   * stagger the paragraphs inside, because a stack of body copy arriving line by
   * line reads as a loading state rather than as a composition.
   *
   * The rest of the family is still to do: the bento about-company, the
   * three-column mixed, the narrative feature rail, and the two large image
   * splits. Each is a multi-part composition where which elements count as units
   * is a design call, not a mechanical one, so they are better done with the
   * section on screen than in a sweep.
   */
  "ContentAboutStorySectionV3",
  "ContentCardTwoUpSectionV3",
  "ContentMainIdeaGridSectionV3",
  "FeaturePortraitParagraphSectionV3",
]);

/**
 * Sections that will never be offered the entrance animation, and why.
 *
 * Membership in `animationComponents` is opt-in, so an excluded section needs no
 * code to stay unanimated - this set exists to say WHICH. Without it, an
 * unmarked section is ambiguous between "nobody has got to it yet" and "this
 * must not animate", and the rollout is a marker sweep across ~60 sections. At
 * nine marked that ambiguity is harmless; at sixty nobody can tell the two
 * apart, including the person doing the sweep.
 *
 * `animation-marker-ownership.test.ts` asserts the two sets never overlap and
 * that nothing in here carries a marker class, so an exclusion cannot be
 * quietly contradicted later.
 *
 * Four reasons, and they are different reasons:
 */
export const animationExcludedComponents = new Map<string, string>([
  /**
   * A hero is the first section on essentially every page, so it has already
   * passed its entry range by the time anything is painted. MEASURED: an
   * element in view at load holds at the end state - opacity 1, no movement -
   * even with a stagger index. The control would render and do nothing, which
   * is exactly what `viewportHeightComponents` exists to prevent for section
   * spacing.
   */
  ...(
    [
      "HeroCenteredFloatersSectionV2",
      "HeroCompactSectionV3",
      "HeroCompactServiceSectionV3",
      "HeroContentTopImageBottomSectionV2",
      "HeroFullscreenSectionV2",
      "HeroServiceAreaZipLookupSectionV3",
      "HeroServicesSectionV3",
      "HeroSplitBentoSectionV3",
      "HeroSplitFixedImageSectionV3",
      "HeroSplitFullHeightSectionV3",
    ] as const
  ).map(
    (component) =>
      [component, "above the fold at load, so a scroll entrance is inert"] as const,
  ),
  /**
   * Navigation spends most of its life `fixed` or `absolute`, out of flow. A
   * view timeline on an out-of-flow element does not describe the reader's
   * progress past it, and nav is chrome rather than content arriving. Excluded
   * for the same reason it cannot join a background band.
   */
  ...(
    [
      "NavCenterLogoSectionV2",
      "NavFloatingBentoSectionV2",
      "NavPrimarySectionV2",
    ] as const
  ).map(
    (component) => [component, "out-of-flow site chrome, not arriving content"] as const,
  ),
  /**
   * A marquee is already in continuous motion and that motion is the section.
   * It must keep running whatever the entrance axis says, so it is never gated
   * - see `trust-marquee` in `globals.css`, which is independent of the reveal.
   */
  ...(
    [
      "TrustLogoMarqueeSectionV3",
      "TrustMarqueeSection",
      "TrustMarqueeSectionV3",
    ] as const
  ).map(
    (component) => [component, "continuously moving; its motion always runs"] as const,
  ),
  /**
   * These own their own motion through `motion/react` - carousels, accordions,
   * scroll-written reveals, hover panels. Layering a second entrance on top
   * would have two systems animating one element, and the internal one is the
   * section's actual behaviour rather than decoration. An accordion must open
   * and a carousel must move regardless of this axis, so neither is gated by it.
   */
  ...(
    [
      "AdditionalOffersSectionV3",
      "CTAScrollRevealOfferSectionV3",
      "ContentRevealParagraphSectionV2",
      "ContentRuleHeaderSectionV2",
      "ContentScrollWrittenRevealSectionV2",
      "FAQAccordionSectionV3",
      "FAQAccordionSidebarSectionV3",
      "FeatureOverlapRowsSectionV3",
      "ProcessStepsSectionV3",
      "ProjectCaseStudyGallerySectionV3",
      "ServiceCalloutRevealGridSectionV3",
      "ServiceCalloutSplitPanelSectionV3",
      "ServicesHoverPanelSectionV2",
      "ServicesScrollCardsSectionV2",
      "TestimonialsCarouselCondensedSectionV3",
      "TestimonialsCarouselSectionV3",
      "TestimonialsMasonrySectionV3",
      "TestimonialsSectionV3",
    ] as const
  ).map(
    (component) => [component, "owns its own motion through motion/react"] as const,
  ),
  /**
   * The same reason, reached without Motion.
   *
   * MEMBERSHIP HERE IS BY BEHAVIOUR, NOT BY IMPORT, and these two are why that
   * distinction is worth writing down: the first pass at this set was built by
   * grepping for `motion/react`, which finds neither of them. The ideas panel
   * drives its own `translate3d` from a scroll listener, so a reveal would
   * animate `translate` while the panel animated `transform` - both apply, both
   * move it, and they would fight. The card carousel is a drag rail on
   * `requestAnimationFrame`, the same shape as the photo carousels above.
   *
   * If a section animates itself on scroll by any means, it belongs here.
   */
  ...(
    [
      "ContentHorizontalCardCarouselSectionV2",
      "ContentStickyIdeasSectionV2",
    ] as const
  ).map(
    (component) =>
      [component, "hand-rolls its own scroll motion without Motion"] as const,
  ),
]);

export function sectionSupportsAnimation(component: string) {
  return animationComponents.has(component);
}

/** Declared after `styleFieldOptions` would put this inside its own TDZ, so the
 *  accepted set is written out rather than derived. `animation-css-agreement`
 *  pins it against the option list and against `globals.css`. */
const animationValues = new Set<SectionAnimation>(["none", "reveal"]);

/**
 * The animation a section actually plays when nothing is set.
 *
 * `none`, unlike every other resolver here. See `styleFieldOptions.animation`.
 * Anything unrecognised also lands on `none`, so a template saved with a value
 * that has since been removed renders a still section rather than an attribute
 * no stylesheet matches.
 */
export function resolveSectionAnimation(
  animation: string | undefined,
): SectionAnimation {
  return animation && animationValues.has(animation as SectionAnimation)
    ? (animation as SectionAnimation)
    : "none";
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

/**
 * The nine palette swatches, in the order the style guide authors them:
 * the three light grounds, the two dark ones, then the three chromatics.
 *
 * Shared by the card and border overrides, which offer the same colours - what
 * differs between them is the intensity range, not the palette.
 *
 * The values are the palette's own keys, so they match the `--palette-*`
 * custom properties and `PaletteKey` without a translation step. `darkSurface`
 * keeps its camelCase for that reason: it is a stored key, and the one thing
 * this system does not do is rename stored keys.
 *
 * THE LABELS ARE THE STYLE GUIDE'S NAMES, NOT THE PALETTE'S. Three vocabularies
 * are live at once - see the table in `color-palette-adapter.ts` - and the two
 * chromatics are where they collide: palette `brand` is the swatch the style
 * guide authors as "Accent", and palette `accent` is the one it authors as
 * "CTA Accent". Labelling them by their palette keys meant picking "Accent"
 * here painted a different colour from the "Accent" swatch the editor had just
 * set, and only when a CTA accent was authored - so the two agreed right up
 * until they mattered. The editor sees one name per colour; storage keeps its
 * keys.
 */
export const paletteSwatchOptions = [
  { label: "Page", value: "page" },
  { label: "Surface", value: "surface" },
  { label: "Raised", value: "raised" },
  { label: "Ink", value: "ink" },
  { label: "Dark", value: "dark" },
  { label: "Dark Surface", value: "darkSurface" },
  { label: "Accent", value: "brand" },
  { label: "CTA Accent", value: "accent" },
  { label: "Highlight", value: "highlight" },
] as const satisfies ReadonlyArray<{ label: string; value: string }>;

/**
 * What the intensities are called in the panel.
 *
 * The stored values stay ladder names - `strong`, `body`, `faint`, `quiet` -
 * so the percentages remain the ladder's and `color-css-agreement.test.ts`
 * keeps checking them. Only the labels speak the editor's language: a card is
 * solid, softened, or a wash of its ground; a border is faint or defined.
 */
const cardIntensityLabels: Record<string, string> = {
  strong: "Solid",
  body: "Softened",
  faint: "Wash",
};

const borderIntensityLabels: Record<string, string> = {
  faint: "Faint",
  quiet: "Defined",
};

export const styleFieldOptions = {
  /**
   * The section's entrance animation.
   *
   * OFF BY DEFAULT, WHICH IS WHY THIS AXIS NEEDS `resolveSectionAnimation`.
   * Every other axis here treats an unset value as "inherit a sensible
   * visual"; motion is not sensible-by-default, so unset resolves to `none`.
   * The precedent is `cardFillOptInComponents` / `resolveCardFill` above, which
   * exists for the same reason - a saved section must not gain a visual it was
   * never given.
   *
   * Deliberately short. Per-section expressiveness comes from WHICH elements a
   * section marks as revealable, not from a longer enum here: a section marks
   * its cards and its heading, and the one value decides whether any of it
   * moves. A longer list is what the future style-guide animation suites are
   * for, and those re-point the tokens rather than adding values.
   *
   * Copy-neutral. The contract fingerprint hashes component, the derived field
   * specs, instruction, mode, name, ratio and variant - none of which this is -
   * so switching it moves no fingerprint and flips no approved page to `stale`.
   * That is also why it must never be folded into `variant`.
   */
  animation: [
    { label: "Use template default", value: "" },
    { label: "None", value: "none" },
    { label: "Reveal", value: "reveal" },
  ],
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
   * one treatment reads correctly on all five recipes. `drift` and `ambient`
   * both move: `drift` animates the same image `gradient` paints, so reduced
   * motion degrades to that rather than to nothing, and `ambient` freezes its
   * sprites mid-flight for the same reason.
   *
   * `ambient` is the one treatment that is not a stylesheet rule - it renders
   * markup, through `BackgroundTreatmentOverlay`. It is deliberately a value
   * beside `drift` rather than a replacement for it: repurposing `drift` would
   * have silently repainted every section and preset already tuned to it, which
   * is the same thing preset copying and promotion exist to prevent.
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
    { label: "Ambient", value: "ambient" },
    { label: "Image", value: "image" },
    { label: "Parallax", value: "image-parallax" },
  ],
  /**
   * How a ground image is fitted into its box.
   *
   * `fill` is what every ground image has always done, so it is what an unset
   * value resolves to and no saved page moves. See `background-image-config.ts`
   * for the `background-size` each id paints.
   *
   * Offered alongside `backgroundTreatment` rather than gated on it, because
   * the treatment is itself overridable per page - a section set to Gradient on
   * the template can be switched to Image here, and a fit that only appeared
   * afterwards would need a second save to become reachable.
   */
  backgroundImageFit: [
    { label: "Use template default", value: "" },
    { label: "Fill", value: "fill" },
    { label: "Fit", value: "fit" },
    { label: "Stretch", value: "stretch" },
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
  /**
   * The card and border swatch overrides.
   *
   * `""` means "the recipe decides", which is the case almost every section is
   * in and the one that has to cost nothing - it emits no attribute at all, so
   * the recipe's own `--recipe-card` stands untouched.
   *
   * The labels are the palette's names rather than descriptions of colour,
   * because the palette is re-authored per business and "Dark" is a role that
   * survives that where "Navy" would not.
   */
  cardSwatch: [
    { label: "Use recipe default", value: "" },
    ...paletteSwatchOptions,
  ],
  borderSwatch: [
    { label: "Use recipe default", value: "" },
    ...paletteSwatchOptions,
  ],
  /**
   * Three intensities, not the ladder's five. Muted and Quiet put a card
   * between its ground and its swatch, where neither white nor ink text clears
   * AA - Quiet fails a third of the time across the nine swatches - so they
   * are not offered. See `cardIntensityValues` in `color-overrides.ts`.
   */
  cardIntensity: [
    { label: "Use recipe default", value: "" },
    ...cardIntensityOptions.map((value) => ({
      label: cardIntensityLabels[value],
      value,
    })),
  ],
  /** Two, and not for a contrast reason: a border holds no text, but Strong,
   *  Body and Muted are not tellable apart on a two-pixel line. */
  borderIntensity: [
    { label: "Use recipe default", value: "" },
    ...borderIntensityOptions.map((value) => ({
      label: borderIntensityLabels[value],
      value,
    })),
  ],
  /**
   * Derived from `sectionColorRecipes` rather than written out again.
   *
   * This list was a hand copy and it had gone stale in both directions: it
   * offered five of the eight recipes, so a staged page could not be moved to
   * Dark Surface, Brand or Highlight at all, and it offered `default`, which
   * has been an alias for `page` since the recipes were named for their
   * grounds. Both failures are silent - an absent option is simply not there
   * to miss, and a retired id resolves through the alias and looks fine.
   *
   * The duplication is exactly what the header of this file warns about, so
   * the fix is to stop duplicating rather than to correct the copy.
   */
  colorRecipe: [
    { label: "Use template default", value: "" },
    ...sectionColorRecipes.map(({ id, label }) => ({ label, value: id })),
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
/**
 * Treatments that paint from a node config.
 *
 * Grain draws a fixed rule grid, the image treatments paint a photograph, and
 * `ambient` draws strokes rather than washes, so none of them read the gradient
 * layers - offering node tuning there would be a control that silently does
 * nothing, the same failure the per-component membership sets above exist to
 * prevent.
 */
const backgroundConfigTreatments = new Set<string>(["gradient", "drift"]);

export function treatmentUsesBackgroundConfig(
  backgroundTreatment: string | undefined,
) {
  return backgroundConfigTreatments.has(
    resolveBackgroundTreatment(backgroundTreatment),
  );
}

/**
 * Treatments that paint by rendering markup instead of by a stylesheet rule.
 *
 * Every other treatment travels as a data attribute alone, which is why the
 * builder, the preview, staged pages and the exporter all get it for free. One
 * that needs a DOM child has to be dropped in at each frame and band, and the
 * exporter has to emit it into generated JSX and pull the component into the
 * copied file set. This predicate is what those call sites agree on, so adding
 * the next such treatment is one entry here rather than six string comparisons
 * that can fall out of step.
 */
const overlayTreatments = new Set<string>(["ambient"]);

export function treatmentRendersOverlay(backgroundTreatment: string | undefined) {
  return overlayTreatments.has(resolveBackgroundTreatment(backgroundTreatment));
}

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

/**
 * Style axes whose value is continuous rather than one of a fixed list.
 *
 * Kept beside `styleFieldOptions` rather than in it: every entry there is a
 * list the content editor renders as a toggle row, and a percentage pair has no
 * such list. Declared here, the name is still a real `SectionStyleFieldName`,
 * so it rides the same override path, the same staged-page seeding and the same
 * `style.` prefix as every enumerated axis.
 */
export const continuousStyleFieldNames = ["backgroundImageFocus"] as const;

export type SectionStyleFieldName =
  | keyof typeof styleFieldOptions
  | (typeof continuousStyleFieldNames)[number];

/**
 * One overridable style axis.
 *
 * Two shapes, and exactly one of them per spec. `options` is the original and
 * still the common case - a fixed list, rendered as a toggle row and validated
 * by membership. `validate` is for an axis whose values cannot be enumerated,
 * such as a focal point: same storage, same resolution path, but the stored
 * string is checked by a predicate instead of looked up in a list.
 *
 * The alternative was a second override path for continuous values, which is
 * the duplication this registry exists to prevent - four consumers read it, and
 * a parallel path would have to be remembered in all four.
 */
type SectionStyleFieldSpecBase = {
  label: string;
  name: SectionStyleFieldName;
};

export type SectionStyleFieldSpec = SectionStyleFieldSpecBase &
  (
    | {
        options: ReadonlyArray<{ label: string; value: string }>;
        validate?: never;
      }
    | { options?: never; validate: (value: string) => boolean }
  );

/**
 * Whether a stored override is a value this axis actually accepts.
 *
 * The one place the two spec shapes are reconciled, so no consumer has to know
 * which kind it is holding.
 */
export function isValidStyleFieldValue(
  spec: SectionStyleFieldSpec,
  value: string,
) {
  return spec.validate
    ? spec.validate(value)
    : spec.options.some((option) => option.value === value);
}

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

const animationStyleField: SectionStyleFieldSpec = {
  label: "Entrance animation",
  name: "animation",
  options: styleFieldOptions.animation,
};

/**
 * The two ground-image axes, offered together with the treatment above.
 *
 * The focal point is the continuous one: `isBackgroundImageFocusValue` accepts
 * `"<x> <y>"` in 0-100 and rejects everything else, so a stale or hand-edited
 * value falls back to the stylesheet's `center` rather than painting a position
 * nobody chose.
 */
const backgroundImageStyleFields: SectionStyleFieldSpec[] = [
  {
    label: "Image fit",
    name: "backgroundImageFit",
    options: styleFieldOptions.backgroundImageFit,
  },
  {
    label: "Image focal point",
    name: "backgroundImageFocus",
    validate: isBackgroundImageFocusValue,
  },
];

/**
 * The card surface controls, in the order an editor reaches for them.
 *
 * Fill and border decide whether there is a card at all; the four override
 * fields decide what colour it is. They sit together because the overrides
 * extend these two rather than forming a separate axis - and because two of
 * the system's rules are about the pair. An unfilled card's border is the only
 * thing separating it from the ground, so its intensity floors at Defined; and
 * a card close enough to its ground to depend on that border is reported by
 * the gate when the border is switched off.
 */
const cardStyleFields: SectionStyleFieldSpec[] = [
  { label: "Card fill", name: "cardFill", options: styleFieldOptions.cardFill },
  {
    label: "Card border",
    name: "cardBorder",
    options: styleFieldOptions.cardBorder,
  },
  {
    label: "Card colour",
    name: "cardSwatch",
    options: styleFieldOptions.cardSwatch,
  },
  {
    label: "Card intensity",
    name: "cardIntensity",
    options: styleFieldOptions.cardIntensity,
  },
  {
    label: "Border colour",
    name: "borderSwatch",
    options: styleFieldOptions.borderSwatch,
  },
  {
    label: "Border weight",
    name: "borderIntensity",
    options: styleFieldOptions.borderIntensity,
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
      ? [backgroundTreatmentStyleField, ...backgroundImageStyleFields]
      : []),
    ...(sectionSupportsBackgroundFill(component)
      ? [backgroundFillStyleField]
      : []),
    ...(sectionSupportsCardStyle(component) ? cardStyleFields : []),
    ...(sectionSupportsAnimation(component) ? [animationStyleField] : []),
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
