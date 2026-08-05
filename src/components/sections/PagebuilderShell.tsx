"use client";

import type { CSSProperties, DragEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  ContentSplitFullImageSectionV3,
  type ContentSplitFullImageVariant,
} from "@/components/sections/ContentSplitFullImageSectionV3";
import {
  ContentSplitFixedImageSectionV3,
  type ContentSplitFixedImageHeadingSizeStep,
  type ContentSplitFixedImageRatio,
  type ContentSplitFixedImageVariant,
} from "@/components/sections/ContentSplitFixedImageSectionV3";
import {
  HeroSplitFixedImageSectionV3,
  type HeroSplitFixedImageRatio,
  type HeroSplitFixedImageVariant,
} from "@/components/sections/HeroSplitFixedImageSectionV3";
import {
  HeroSplitBentoSectionV3,
  type HeroSplitBentoVariant,
} from "@/components/sections/HeroSplitBentoSectionV3";
import {
  HeroSplitFullHeightSectionV3,
  type HeroSplitFullHeightVariant,
} from "@/components/sections/HeroSplitFullHeightSectionV3";
import {
  HeroServiceAreaZipLookupSectionV3,
  type HeroServiceAreaZipLookupVariant,
} from "@/components/sections/HeroServiceAreaZipLookupSectionV3";
import {
  HeroCompactSectionV3,
  type HeroCompactAlign,
  type HeroCompactHeadingSize,
} from "@/components/sections/HeroCompactSectionV3";
import { HeroServicesSectionV3 } from "@/components/sections/HeroServicesSectionV3";
import { ServicesThreeCardsRightSectionV3 } from "@/components/sections/ServicesThreeCardsRightSectionV3";
import { ServicesScrollCardsSectionV2 } from "@/components/sections/ServicesScrollCardsSectionV2";
import { ContentHorizontalCardCarouselSectionV2 } from "@/components/sections/ContentHorizontalCardCarouselSectionV2";
import { DecisionSplitLargeCardsSectionV3 } from "@/components/sections/DecisionSplitLargeCardsSectionV3";
import { DecisionSplitDecisionSectionV3 } from "@/components/sections/DecisionSplitDecisionSectionV3";
import {
  ProcessStepsBranchingSectionV3,
  type ProcessStepsBranchingAlign,
} from "@/components/sections/ProcessStepsBranchingSectionV3";
import { ProcessStepsStaggeredSectionV3 } from "@/components/sections/ProcessStepsStaggeredSectionV3";
import { HeroCompactServiceSectionV3 } from "@/components/sections/HeroCompactServiceSectionV3";
import { SectionHeaderCompactSectionV3 } from "@/components/sections/SectionHeaderCompactSectionV3";
import { SectionHeaderSplitLinkSectionV3 } from "@/components/sections/SectionHeaderSplitLinkSectionV3";
import {
  SectionHeaderLargeSectionV3,
  type LargeSectionHeaderSize,
} from "@/components/sections/SectionHeaderLargeSectionV3";
import {
  ServicesBentoCardsSectionV2,
  type ServicesBentoCardsVariant,
} from "@/components/sections/ServicesBentoCardsSectionV2";
import { DecisionMatrixCardSectionV3 } from "@/components/sections/DecisionMatrixCardSectionV3";
import { DecisionQuestionTableFourSectionV3 } from "@/components/sections/DecisionQuestionTableFourSectionV3";
import { DecisionQuestionTableSectionV3 } from "@/components/sections/DecisionQuestionTableSectionV3";
import { FourCardLinkGridSectionV3 } from "@/components/sections/FourCardLinkGridSectionV3";
import { ThreeCardLinkGridSectionV3 } from "@/components/sections/ThreeCardLinkGridSectionV3";
import { ServiceCalloutRevealGridSectionV3 } from "@/components/sections/ServiceCalloutRevealGridSectionV3";
import { ServiceCalloutSplitPanelSectionV3 } from "@/components/sections/ServiceCalloutSplitPanelSectionV3";
import {
  CTAImageSectionV3,
  type CTAImageAlign,
} from "@/components/sections/CTAImageSectionV3";
import {
  FeaturedOfferSectionV3,
  type FeaturedOfferAlign,
} from "@/components/sections/FeaturedOfferSectionV3";
import { ServiceNeedsPriorityGridSectionV3 } from "@/components/sections/ServiceNeedsPriorityGridSectionV3";
import type { ServiceNeedsPriorityGridAlign } from "@/components/sections/ServiceNeedsPriorityGridSectionV3";
import { ContentSplitHeadlineImageSectionV2 } from "@/components/sections/ContentSplitHeadlineImageSectionV2";
import {
  ContentMainIdeaGridSectionV3,
  type ContentMainIdeaGridAlign,
} from "@/components/sections/ContentMainIdeaGridSectionV3";
import {
  ContentNarrativeFeatureRailSectionV3,
  type ContentNarrativeFeatureRailAlign,
} from "@/components/sections/ContentNarrativeFeatureRailSectionV3";
import {
  ContentCardTwoUpSectionV3,
  type ContentCardTwoUpAlign,
} from "@/components/sections/ContentCardTwoUpSectionV3";
import {
  ContentThreeColumnMixedSectionV3,
  type ContentThreeColumnMixedAlign,
} from "@/components/sections/ContentThreeColumnMixedSectionV3";
import {
  FAQAccordionSidebarSectionV3,
  type FAQAccordionSidebarAlign,
} from "@/components/sections/FAQAccordionSidebarSectionV3";
import {
  ProjectCaseStudyGallerySectionV3,
  type ProjectCaseStudyGalleryAlign,
} from "@/components/sections/ProjectCaseStudyGallerySectionV3";
import {
  DecisionSplitDecisionLargeSectionV3,
  type DecisionSplitDecisionLargeAlign,
} from "@/components/sections/DecisionSplitDecisionLargeSectionV3";
import { ContentStickyCardStreamSectionV2 } from "@/components/sections/ContentStickyCardStreamSectionV2";
import { ContentFixedCoverFadeSectionV2 } from "@/components/sections/ContentFixedCoverFadeSectionV2";
import {
  CTASectionV3,
  CTAMutedSectionV3,
  FAQSectionV3,
} from "@/components/sections/FAQConversionContactFooterSectionsV3";
import { DownArrowIcon } from "@/components/primitives";
import type { PagebuilderRecipe, SectionMode } from "@/content/pagebuilder";
import {
  resolveSectionColorRecipe,
  sectionColorRecipes,
  type SectionCardBorder,
  type SectionCardFill,
  type SectionBackgroundFill,
  type SectionColorRecipe,
} from "@/content/section-color-recipes";
import {
  getCanonicalSectionLabel,
  sectionLibraryV3Content,
} from "@/content/section-library-v3";
import {
  calloutRevealGridVariantOptions,
  calloutRevealGridVariantValues,
  calloutSplitPanelVariantOptions,
  calloutSplitPanelVariantValues,
  cardFillOptInComponents,
  resolveBackgroundFill,
  resolveCardBorder,
  resolveCardFill,
  headlineWrapOptions,
  iconsOptions,
  resolveHeadlineWrap,
  resolveSectionIcons,
  sectionSupportsHeadlineWrap,
  sectionSupportsIcons,
  cardLinkGridAlignOptions,
  cardLinkGridAlignValues,
  sectionSupportsCardLinkGridAlign,
  sectionSupportsCardLinks,
  sectionSupportsCardStyle,
  sectionSupportsBackgroundFill,
  sectionSupportsJoinAbove,
  sectionSupportsBackgroundTreatment,
  sectionSupportsSectionSpacing,
  resolveBackgroundTreatment,
  styleFieldOptions,
  treatmentUsesGroundImage,
  sectionSupportsTableCompareAlign,
  servicesBentoVariantOptions,
  servicesBentoVariantValues,
  tableCompareAlignOptions,
  tableCompareAlignValues,
  splitBentoVariantOptions,
  splitBentoVariantValues,
  splitImageVariantValues,
  splitImageRatioOptions as fixedRatioSplitRatioOptions,
  splitImageVariantOptions as fixedRatioSplitVariantOptions,
  splitImageVariantOptions as splitContentImageVariantOptions,
  type CalloutRevealGridVariant,
  type CalloutSplitPanelVariant,
  type CardLinkGridAlign,
  type SectionHeadlineWrap,
  type SectionIcons,
  type ServicesBentoVariant,
  type TableCompareAlign,
  type SplitBentoVariant,
  type SplitImageRatio,
  type SplitImageVariant,
} from "@/content/section-style-options";
import { groupSectionsIntoBands, withBandRecipe } from "@/utils/section-bands";

type PagebuilderShellProps = {
  recipes: PagebuilderRecipe[];
  /**
   * Renders a section from library demo content with its toggles applied.
   *
   * Passed in rather than imported because `PagebuilderSection` renders this
   * component, so importing back from it would be a cycle.
   *
   * This replaced a prebuilt `previewCatalog` map of one element per component.
   * That map was a second place every section had to be registered, and being
   * prebuilt from a synthetic section it could not carry live toggle values -
   * each entry was also wrapped in a <div>, so props cloned onto one landed on a
   * DOM node rather than the section.
   */
  renderLibrarySection: (
    section: PagebuilderRecipe["sectionStack"][number],
    index: number,
  ) => ReactNode;
  sectionModes: SectionMode[];
};

type WorkingSection = PagebuilderRecipe["sectionStack"][number] & {
  id: string;
  included: boolean;
  originalComponent: string;
  originalIndex: number;
  reduceTopPadding?: boolean;
  reduceBottomPadding?: boolean;
  /**
   * Present only on sections that came from a saved template, so editing a
   * template here and re-promoting it keeps its rename anchors. Sections built
   * fresh from a recipe have none until promotion assigns one. Swapping the
   * component keeps the anchor - it is the same slot in the page.
   */
  slotId?: string;
};

type DragDropPosition = "before" | "after" | null;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type PreviewVariableStyle = CSSProperties & Record<`--${string}`, string>;

const normalSpacingClassName = "pagebuilder-density-normal";
const splitContentImageComponent = "HeroSplitFullHeightSectionV3";
const fixedRatioSplitComponent = "HeroSplitFixedImageSectionV3";
const splitBentoComponent = "HeroSplitBentoSectionV3";
const contentFixedRatioSplitComponent = "ContentSplitFixedImageSectionV3";
const contentFullImageSplitComponent = "ContentSplitFullImageSectionV3";
const heroServiceAreaZipLookupComponent =
  "HeroServiceAreaZipLookupSectionV3";

/**
 * The hero and its narrative twin offer the same four arrangements and share
 * one option list, so everything that reads or writes that axis keys off this
 * rather than either component name. Only the render branch cares which is
 * which - the sections differ in copy shape and height, not in layout choice.
 */
const fullImageSplitComponents = new Set<string>([
  splitContentImageComponent,
  contentFullImageSplitComponent,
  heroServiceAreaZipLookupComponent,
]);
const heroCompactComponent = "HeroCompactSectionV3";
const heroServicesComponent = "HeroServicesSectionV3";
const heroCompactServiceComponent = "HeroCompactServiceSectionV3";
const sectionHeaderCompactComponent = "SectionHeaderCompactSectionV3";
const sectionHeaderLargeComponent = "SectionHeaderLargeSectionV3";
const servicesBentoComponent = "ServicesBentoCardsSectionV2";
const fourCardLinkGridComponent = "FourCardLinkGridSectionV3";
const threeCardLinkGridComponent = "ThreeCardLinkGridSectionV3";
const serviceNeedsPriorityGridComponent = "ServiceNeedsPriorityGridSectionV3";
const serviceCalloutRevealGridComponent = "ServiceCalloutRevealGridSectionV3";
const serviceCalloutSplitPanelComponent = "ServiceCalloutSplitPanelSectionV3";
const featureAsymmetricCardsComponent = "FeatureAsymmetricCardsSectionV3";
const contentSplitHeadlineImageComponent = "ContentSplitHeadlineImageSectionV2";
const contentMainIdeaGridComponent = "ContentMainIdeaGridSectionV3";
const contentNarrativeFeatureRailComponent =
  "ContentNarrativeFeatureRailSectionV3";
const contentCardTwoUpComponent = "ContentCardTwoUpSectionV3";
const contentThreeColumnMixedComponent = "ContentThreeColumnMixedSectionV3";
const faqAccordionSidebarComponent = "FAQAccordionSidebarSectionV3";
const projectCaseStudyGalleryComponent = "ProjectCaseStudyGallerySectionV3";
const contentStickyCardStreamComponent = "ContentStickyCardStreamSectionV2";
const faqComponent = "FAQSectionV3";
const contentHorizontalCardCarouselComponent =
  "ContentHorizontalCardCarouselSectionV2";
const decisionSplitLargeCardsComponent = "DecisionSplitLargeCardsSectionV3";
const decisionSplitDecisionComponent = "DecisionSplitDecisionSectionV3";
const decisionQuestionTableComponent = "DecisionQuestionTableSectionV3";
const decisionMatrixCardComponent = "DecisionMatrixCardSectionV3";
const decisionQuestionTableFourComponent =
  "DecisionQuestionTableFourSectionV3";
const sectionHeaderSplitLinkComponent = "SectionHeaderSplitLinkSectionV3";
const processStepsBranchingComponent = "ProcessStepsBranchingSectionV3";
const processStepsStaggeredComponent = "ProcessStepsStaggeredSectionV3";
const servicesScrollCardsComponent = "ServicesScrollCardsSectionV2";
const servicesThreeCardsRightComponent = "ServicesThreeCardsRightSectionV3";
const ctaSectionComponent = "CTASectionV3";
const ctaMutedSectionComponent = "CTAMutedSectionV3";
const ctaImageSectionComponent = "CTAImageSectionV3";
const featuredOfferSectionComponent = "FeaturedOfferSectionV3";
const contentFixedCoverFadeComponent = "ContentFixedCoverFadeSectionV2";
const decisionSplitDecisionLargeComponent = "DecisionSplitDecisionLargeSectionV3";
const fourCardLinkGridVariantOptions = [
  { label: "Images", value: "with-images" },
  { label: "No images", value: "text-only" },
] as const;
type FourCardLinkGridVariant =
  (typeof fourCardLinkGridVariantOptions)[number]["value"];
type ThreeCardLinkGridVariant = FourCardLinkGridVariant;
type SplitContentImageVariant = SplitImageVariant;

type FixedRatioSplitVariant = SplitImageVariant;

type FixedRatioSplitRatio = SplitImageRatio;

const heroCompactAlignOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
] as const;
const cardLinksOptions = [
  { label: "Links on", value: "on" },
  { label: "Static", value: "off" },
] as const;
const ctaImageAlignOptions = [
  { label: "Copy left", value: "left" },
  { label: "Copy right", value: "right" },
] as const;
const featuredOfferAlignOptions = [
  { label: "Image left", value: "left" },
  { label: "Image right", value: "right" },
] as const;
const mainIdeaGridAlignOptions = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
] as const;
const processStepsBranchingAlignOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
] as const;
const projectCaseStudyGalleryAlignOptions = [
  { label: "Image left", value: "left" },
  { label: "Image right", value: "right" },
] as const;
const serviceNeedsPriorityGridAlignOptions = [
  { label: "Large card left", value: "left" },
  { label: "Large card right", value: "right" },
] as const;
const serviceNeedsPriorityGridSizeOptions = [
  { label: "Standard", value: "standard" },
  { label: "Compact", value: "compact" },
] as const;
const featureAsymmetricCardsAlignOptions = [
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
] as const;
type FeatureAsymmetricCardsAlign =
  (typeof featureAsymmetricCardsAlignOptions)[number]["value"];

const heroCompactAlignments = new Set<string>(
  heroCompactAlignOptions.map((option) => option.value),
);

const largeSectionHeaderSizeOptions = [
  { label: "display-xl", value: "display-xl" },
  { label: "display-lg", value: "display-lg" },
  { label: "heading-xl", value: "heading-xl" },
  { label: "heading-lg", value: "heading-lg" },
  { label: "heading-md", value: "heading-md" },
  { label: "heading-sm", value: "heading-sm" },
  { label: "eyebrow", value: "eyebrow" },
] as const;

const compactHeaderHeadingSizeOptions = [
  { label: "Heading LG", value: "heading-lg", iconSize: 17 },
  { label: "Heading XL", value: "heading-xl", iconSize: 23 },
  { label: "Display LG", value: "display-lg", iconSize: 29 },
] as const;

function HeadingScaleIcon({ iconSize }: { iconSize: number }) {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-10 overflow-visible"
      viewBox="0 0 32 32"
    >
      <text
        dominantBaseline="central"
        fill="currentColor"
        fillOpacity="0.38"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize={iconSize}
        fontWeight="900"
        paintOrder="stroke fill"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.1"
        textAnchor="middle"
        x="16"
        y="16"
      >
        X
      </text>
    </svg>
  );
}

type ServicesBentoVariantOption = ServicesBentoVariant;

function readPagebuilderPreviewVariables(): PreviewVariableStyle {
  if (typeof window === "undefined") {
    return {};
  }

  const computedStyle = window.getComputedStyle(document.documentElement);
  const previewVariables: PreviewVariableStyle = {};
  const variablePrefixes = [
    "--border-",
    "--card-",
    "--color-",
    "--container-",
    "--inline-",
    "--layout-",
    "--live-",
    "--radius-",
    "--section-",
    "--semantic-",
    "--shadow-",
    "--site-",
    "--type-",
  ];

  for (const propertyName of computedStyle) {
    if (
      variablePrefixes.some((prefix) => propertyName.startsWith(prefix))
    ) {
      previewVariables[propertyName as `--${string}`] = computedStyle
        .getPropertyValue(propertyName)
        .trim();
    }
  }

  return previewVariables;
}

function isPreviewNavigationSection(section: WorkingSection) {
  return section.mode === "Navigation";
}

function isPreviewHeroSection(section: WorkingSection | undefined) {
  return section?.mode === "Hero";
}

const viewportOptions = [
  {
    id: "main",
    label: "Main",
    contentClassName: "max-w-full",
    frameClassName: "h-full w-full max-w-[90rem]",
    screenClassName: "h-full flex-1",
    sizeLabel: "1440px site canvas",
    brief:
      "Review the template in the 1440px main container with preserved page scrolling.",
  },
] as const;

function getPreviewResponsiveClassName(
  viewportId: (typeof viewportOptions)[number]["id"],
) {
  void viewportId;
  return "";
}

type DesignStyleSettings = {
  showSectionMarkers: boolean;
  viewportId: (typeof viewportOptions)[number]["id"];
};

type PageLayoutSlot = {
  designStyle: DesignStyleSettings;
  name: string;
  stack: WorkingSection[];
};

type TemplatePromotionResponse =
  | {
      ok: true;
      template: {
        id: string;
        name: string;
        sectionCount: number;
      };
      templates: SavedPageTemplate[];
    }
  | { ok: false; error: string };

type SavedPageTemplate = {
  sections: Array<{
    component: string;
    mode: string;
  }>;
};

type SavedPageTemplatesResponse =
  | {
      ok: true;
      templates: SavedPageTemplate[];
    }
  | { ok: false; error: string };

function isTemplateContentSection(section: SavedPageTemplate["sections"][number]) {
  return (
    section.mode !== "Navigation" &&
    section.mode !== "Footer" &&
    !section.component.startsWith("Footer")
  );
}

type SavedPagebuilderOption = {
  designStyle: DesignStyleSettings;
  optionIndex: number;
  optionName: string;
  recipeId: string;
  recipeName: string;
  savedAt: string;
  sectionCount: number;
  sections: WorkingSection[];
};

type SavePagebuilderOptionRequest = {
  designStyle: DesignStyleSettings;
  optionIndex: number;
  optionName: string;
  recipeId: string;
  recipeName: string;
  sections: ReturnType<typeof serializeWorkingSection>[];
};

type SavedPagebuilderOptionsResponse =
  | {
      ok: true;
      options: SavedPagebuilderOption[];
    }
  | { ok: false; error: string };

type SavedPagebuilderOptionResponse =
  | {
      ok: true;
      option: SavedPagebuilderOption;
    }
  | { ok: false; error: string };

function buildOptionSaveRequest(
  recipe: PagebuilderRecipe,
  slot: PageLayoutSlot,
  optionIndex: number,
): SavePagebuilderOptionRequest {
  return {
    designStyle: slot.designStyle,
    optionIndex,
    optionName: slot.name,
    recipeId: recipe.id,
    recipeName: recipe.name,
    sections: slot.stack.map(serializeWorkingSection),
  };
}

function getOptionSignatureKey(payload: SavePagebuilderOptionRequest) {
  return `${payload.recipeId}:${payload.optionIndex}`;
}

function getOptionSignature(payload: SavePagebuilderOptionRequest) {
  return JSON.stringify(payload);
}

type PageInstructionInput = {
  designLabel: string;
  excludedSections: WorkingSection[];
  includedSections: WorkingSection[];
  recipe: PagebuilderRecipe;
  selectedViewport: (typeof viewportOptions)[number];
};

function isSplitContentImageSection(section: WorkingSection) {
  return section.component === splitContentImageComponent;
}

function isContentFullImageSplitSection(section: WorkingSection) {
  return section.component === contentFullImageSplitComponent;
}

function isHeroServiceAreaZipLookupSection(section: WorkingSection) {
  return section.component === heroServiceAreaZipLookupComponent;
}

function usesFullImageSplitVariants(section: WorkingSection) {
  return fullImageSplitComponents.has(section.component);
}

function isFixedRatioSplitSection(section: WorkingSection) {
  return section.component === fixedRatioSplitComponent;
}

function isContentFixedRatioSplitSection(section: WorkingSection) {
  return section.component === contentFixedRatioSplitComponent;
}

function isAnyFixedRatioSplitSection(section: WorkingSection) {
  return (
    isFixedRatioSplitSection(section) || isContentFixedRatioSplitSection(section)
  );
}

function isSplitBentoSection(section: WorkingSection) {
  return section.component === splitBentoComponent;
}

function getContentSplitFixedImageVariant(section: WorkingSection) {
  return section.variant?.replace(/-size-(up|down)$/, "") as
    | ContentSplitFixedImageVariant
    | undefined;
}

function getContentSplitFixedImageHeadingSizeStep(
  section: WorkingSection,
): ContentSplitFixedImageHeadingSizeStep {
  if (section.variant?.endsWith("-size-up")) {
    return 1;
  }

  if (section.variant?.endsWith("-size-down")) {
    return -1;
  }

  return 0;
}

function isHeroCompactSection(section: PagebuilderRecipe["sectionStack"][number]) {
  return section.component === heroCompactComponent;
}

function isCompactHeaderAlignmentSection(
  section: PagebuilderRecipe["sectionStack"][number],
) {
  return (
    section.component === heroCompactComponent ||
    section.component === sectionHeaderCompactComponent
  );
}

function isHeroCompactServiceSection(
  section: PagebuilderRecipe["sectionStack"][number],
) {
  return section.component === heroCompactServiceComponent;
}

function isLargeSectionHeaderSection(
  section: PagebuilderRecipe["sectionStack"][number],
) {
  return section.component === sectionHeaderLargeComponent;
}

function isServicesBentoSection(section: PagebuilderRecipe["sectionStack"][number]) {
  return section.component === servicesBentoComponent;
}

function isFourCardLinkGridSection(
  section: PagebuilderRecipe["sectionStack"][number],
) {
  return section.component === fourCardLinkGridComponent;
}

function isThreeCardLinkGridSection(
  section: PagebuilderRecipe["sectionStack"][number],
) {
  return section.component === threeCardLinkGridComponent;
}

function isServiceNeedsPriorityGridSection(
  section: PagebuilderRecipe["sectionStack"][number],
) {
  return section.component === serviceNeedsPriorityGridComponent;
}

function isServiceCalloutRevealGridSection(
  section: PagebuilderRecipe["sectionStack"][number],
) {
  return section.component === serviceCalloutRevealGridComponent;
}

function isServiceCalloutSplitPanelSection(
  section: PagebuilderRecipe["sectionStack"][number],
) {
  return section.component === serviceCalloutSplitPanelComponent;
}

function isCardLinkGridSection(section: PagebuilderRecipe["sectionStack"][number]) {
  return (
    isFourCardLinkGridSection(section) ||
    isThreeCardLinkGridSection(section)
  );
}

function isDecisionSplitDecisionLargeSection(
  section: PagebuilderRecipe["sectionStack"][number],
) {
  return section.component === decisionSplitDecisionLargeComponent;
}

function getSectionColorRecipe(section: WorkingSection): SectionColorRecipe {
  return resolveSectionColorRecipe(section.colorRecipe) ?? "default";
}

function getSectionCardFill(section: WorkingSection): SectionCardFill {
  if (section.cardFill === "none" || section.cardFill === "solid") {
    return section.cardFill;
  }

  return cardFillOptInComponents.has(section.component) ? "none" : "solid";
}

function getSectionBackgroundFill(
  section: WorkingSection,
): SectionBackgroundFill {
  return resolveBackgroundFill(section.backgroundFill);
}

function sectionSupportsCardFill(
  section: PagebuilderRecipe["sectionStack"][number],
) {
  return sectionSupportsCardStyle(section.component);
}

function getSectionCardBorder(section: WorkingSection): SectionCardBorder {
  return resolveCardBorder(section.component, section.cardBorder);
}

function getProcessStepsBranchingAlign(
  section: WorkingSection,
): ProcessStepsBranchingAlign {
  return section.align === "center" ? "center" : "left";
}

function getDecisionSplitDecisionLargeAlign(
  section: WorkingSection,
): DecisionSplitDecisionLargeAlign {
  return heroCompactAlignments.has(section.variant ?? "")
    ? (section.variant as DecisionSplitDecisionLargeAlign)
    : "center";
}

function getCardLinks(section: WorkingSection): "on" | "off" {
  return section.cardLinks === "off" ? "off" : "on";
}

function getSectionIcons(section: WorkingSection) {
  return resolveSectionIcons(section.icons);
}

function getSectionHeadlineWrap(section: WorkingSection) {
  return resolveHeadlineWrap(section.headlineWrap);
}

function getCTAImageAlign(section: WorkingSection): CTAImageAlign {
  return section.variant === "right" ? "right" : "left";
}

function getFeaturedOfferAlign(section: WorkingSection): FeaturedOfferAlign {
  return section.variant === "right" ? "right" : "left";
}

function getMainIdeaGridAlign(
  section: WorkingSection,
): ContentMainIdeaGridAlign {
  return section.variant === "right" ? "right" : "left";
}

function getNarrativeFeatureRailAlign(
  section: WorkingSection,
): ContentNarrativeFeatureRailAlign {
  return section.variant?.startsWith("left") ? "left" : "right";
}

function getNarrativeFeatureRailShowImage(section: WorkingSection) {
  return !section.variant?.includes("text-only");
}

function getContentCardTwoUpAlign(
  section: WorkingSection,
): ContentCardTwoUpAlign {
  return section.variant === "center" || section.variant === "right"
    ? section.variant
    : "left";
}

function getFAQAccordionSidebarAlign(
  section: WorkingSection,
): FAQAccordionSidebarAlign {
  return section.variant === "left" ? "left" : "right";
}

function getProjectCaseStudyGalleryAlign(
  section: WorkingSection,
): ProjectCaseStudyGalleryAlign {
  return section.variant === "right" ? "right" : "left";
}

function getServiceNeedsPriorityGridAlign(
  section: WorkingSection,
): ServiceNeedsPriorityGridAlign {
  return section.variant?.startsWith("left") ? "left" : "right";
}

function getFeatureAsymmetricCardsAlign(
  section: WorkingSection,
): FeatureAsymmetricCardsAlign {
  return section.variant === "right" ? "right" : "left";
}

function getServiceNeedsPriorityGridCompactPriorityCard(
  section: WorkingSection,
) {
  return Boolean(section.variant?.includes("compact"));
}

function getSplitContentImageVariantLabel(variant: string | undefined) {
  return splitContentImageVariantOptions.find(
    (option) => option.value === variant,
  )?.label;
}

function getFixedRatioSplitVariantLabel(variant: string | undefined) {
  return fixedRatioSplitVariantOptions.find(
    (option) => option.value === variant,
  )?.label;
}

function getSplitBentoVariantLabel(variant: string | undefined) {
  return splitBentoVariantOptions.find((option) => option.value === variant)
    ?.label;
}

function getFixedRatioSplitRatioLabel(ratio: string | undefined) {
  return fixedRatioSplitRatioOptions.find((option) => option.value === ratio)
    ?.label;
}

function getServicesBentoVariantLabel(variant: string | undefined) {
  return servicesBentoVariantOptions.find((option) => option.value === variant)
    ?.label;
}

function getCalloutSplitPanelVariantLabel(variant: string | undefined) {
  return calloutSplitPanelVariantOptions.find(
    (option) => option.value === variant,
  )?.label;
}

function getCalloutRevealGridVariantLabel(variant: string | undefined) {
  return calloutRevealGridVariantOptions.find(
    (option) => option.value === variant,
  )?.label;
}

function getHeroCompactAlign(section: WorkingSection) {
  const [align] = (section.variant ?? "").split("-");

  return heroCompactAlignments.has(align)
    ? (align as HeroCompactAlign)
    : sectionLibraryV3Content.heroCompact.align;
}

function isContentThreeColumnMixedSection(
  section: PagebuilderRecipe["sectionStack"][number],
) {
  return section.component === contentThreeColumnMixedComponent;
}

function getContentThreeColumnMixedAlign(section: WorkingSection) {
  return heroCompactAlignments.has(section.variant ?? "")
    ? (section.variant as ContentThreeColumnMixedAlign)
    : sectionLibraryV3Content.contentThreeColumnMixed.align;
}

function getHeroCompactServiceAlign(section: WorkingSection) {
  return heroCompactAlignments.has(section.variant ?? "")
    ? (section.variant as HeroCompactAlign)
    : sectionLibraryV3Content.heroCompactService.align;
}

function getCompactHeaderHeadingSize(
  section: WorkingSection,
): HeroCompactHeadingSize {
  if (section.variant?.endsWith("heading-lg")) {
    return "heading-lg";
  }

  if (section.variant?.endsWith("heading-xl")) {
    return "heading-xl";
  }

  // The largest size needs its own branch rather than riding the fallback.
  // Compact hero defaults to display-lg, so selecting it there looked like it
  // worked; section header content defaults to heading-xl, so the same click
  // resolved back to the middle size and the control appeared dead.
  if (section.variant?.endsWith("display-lg")) {
    return "display-lg";
  }

  return isHeroCompactSection(section)
    ? sectionLibraryV3Content.heroCompact.headingSize
    : sectionLibraryV3Content.sectionHeaderCompact.headingSize;
}

function getLargeSectionHeaderAlign(section: WorkingSection) {
  const [align] = (section.variant ?? "").split("-");

  return heroCompactAlignments.has(align)
    ? (align as HeroCompactAlign)
    : sectionLibraryV3Content.sectionHeaderLarge.align;
}

// Matched on the suffix because the variant is `{align}-{size}`. Every size is
// listed rather than only the non-default ones, so adding one is a single edit
// here and not a silent fall-through to the default.
function getLargeSectionHeaderSize(
  section: WorkingSection,
): LargeSectionHeaderSize {
  const size = largeSectionHeaderSizeOptions.find((option) =>
    section.variant?.endsWith(option.value),
  )?.value;

  return size ?? sectionLibraryV3Content.sectionHeaderLarge.size;
}

function getServicesBentoVariant(section: WorkingSection) {
  return servicesBentoVariantValues.has(section.variant ?? "")
    ? (section.variant as ServicesBentoCardsVariant)
    : servicesBentoVariantOptions[0].value;
}

function getCalloutSplitPanelVariant(section: WorkingSection) {
  return calloutSplitPanelVariantValues.has(section.variant ?? "")
    ? (section.variant as CalloutSplitPanelVariant)
    : calloutSplitPanelVariantOptions[0].value;
}

function getCalloutRevealGridVariant(section: WorkingSection) {
  return calloutRevealGridVariantValues.has(section.variant ?? "")
    ? (section.variant as CalloutRevealGridVariant)
    : calloutRevealGridVariantOptions[0].value;
}

// Centre is the arrangement this section shipped with, so an unset align has to
// resolve to it rather than to the first option by position.
function getCardLinkGridAlign(section: WorkingSection): CardLinkGridAlign {
  return cardLinkGridAlignValues.has(section.align ?? "")
    ? (section.align as CardLinkGridAlign)
    : "center";
}

function getCardLinkGridAlignLabel(align: string | undefined) {
  return cardLinkGridAlignOptions.find((option) => option.value === align)
    ?.label;
}

function getTableCompareAlign(section: WorkingSection): TableCompareAlign {
  return tableCompareAlignValues.has(section.align ?? "")
    ? (section.align as TableCompareAlign)
    : "center";
}

function getTableCompareAlignLabel(align: string | undefined) {
  return tableCompareAlignOptions.find((option) => option.value === align)
    ?.label;
}

function getFourCardLinkGridVariant(
  section: WorkingSection,
): FourCardLinkGridVariant {
  return section.variant === "text-only" ? "text-only" : "with-images";
}

function getCardLinkGridVariant(
  section: WorkingSection,
): ThreeCardLinkGridVariant {
  return section.variant === "text-only" ? "text-only" : "with-images";
}

function getStickyCardStreamShowImage(section: WorkingSection) {
  return section.variant === "with-images";
}

function createInitialDesignStyle(): DesignStyleSettings {
  return {
    showSectionMarkers: false,
    viewportId: "main",
  };
}

function createInitialWorkingStack(
  recipe: PagebuilderRecipe,
  slotIndex: number,
) {
  return recipe.sectionStack.map((section, index) => ({
    ...section,
    id: `${recipe.id}-slot-${slotIndex + 1}-${section.component}-${index}`,
    included: false,
    originalComponent: section.component,
    originalIndex: index,
    reduceTopPadding: false,
    reduceBottomPadding: false,
    colorRecipe: section.colorRecipe ?? "default",
    backgroundFill: section.backgroundFill ?? "solid",
    cardFill: resolveCardFill(section.component, section.cardFill),
    ratio:
      section.component === fixedRatioSplitComponent ||
      section.component === contentFixedRatioSplitComponent
        ? section.ratio ?? fixedRatioSplitRatioOptions[0].value
        : section.ratio,
    variant:
      fullImageSplitComponents.has(section.component)
        ? section.variant ?? splitContentImageVariantOptions[0].value
        : section.component === fixedRatioSplitComponent
          ? section.variant ?? fixedRatioSplitVariantOptions[0].value
          : section.component === contentFixedRatioSplitComponent
            ? section.variant ?? fixedRatioSplitVariantOptions[0].value
            : section.component === splitBentoComponent
            ? section.variant ?? splitBentoVariantOptions[0].value
            : isCompactHeaderAlignmentSection(section)
              ? section.variant ?? sectionLibraryV3Content.heroCompact.align
              : isHeroCompactServiceSection(section)
                ? section.variant ??
                  sectionLibraryV3Content.heroCompactService.align
              : isContentThreeColumnMixedSection(section)
                ? section.variant ??
                  sectionLibraryV3Content.contentThreeColumnMixed.align
              : isLargeSectionHeaderSection(section)
                ? section.variant ?? "center-display-xl"
              : isServicesBentoSection(section)
                ? section.variant ?? servicesBentoVariantOptions[0].value
              : isServiceCalloutSplitPanelSection(section)
                ? section.variant ?? calloutSplitPanelVariantOptions[0].value
              : isServiceCalloutRevealGridSection(section)
                ? section.variant ?? calloutRevealGridVariantOptions[0].value
              : isFourCardLinkGridSection(section)
                ? section.variant ?? fourCardLinkGridVariantOptions[0].value
                : isThreeCardLinkGridSection(section)
                  ? section.variant ?? fourCardLinkGridVariantOptions[0].value
                : section.variant,
  }));
}

function createInitialLayoutSlots(recipe: PagebuilderRecipe) {
  return Array.from({ length: 1 }, (_, index) => ({
    designStyle: createInitialDesignStyle(),
    name: "Page Layout",
    stack: createInitialWorkingStack(recipe, index),
  }));
}

function serializeWorkingSection(section: WorkingSection) {
  return {
    reduceBottomPadding: section.reduceBottomPadding ?? false,
    reduceTopPadding: section.reduceTopPadding ?? false,
    component: section.component,
    id: section.id,
    included: section.included,
    instruction: section.instruction,
    mode: section.mode,
    name: section.name,
    originalComponent: section.originalComponent,
    originalIndex: section.originalIndex,
    align: section.align,
    cardLinks: section.cardLinks,
    icons: section.icons,
    headlineWrap: section.headlineWrap,
    ratio: section.ratio,
    slotId: section.slotId,
    variant: section.variant,
    colorRecipe: getSectionColorRecipe(section),
    backgroundFill: getSectionBackgroundFill(section),
    cardBorder: getSectionCardBorder(section),
    cardFill: getSectionCardFill(section),
  };
}

function getSectionSwapOption(component: string) {
  return sectionSwapOptions.find((option) => option.component === component);
}

function normalizeSectionMetadata(section: WorkingSection): WorkingSection {
  const swapOption = getSectionSwapOption(section.component);

  if (!swapOption) {
    return section;
  }

  return {
    ...section,
    instruction: swapOption.instruction,
    mode: swapOption.mode,
    name: swapOption.name,
  };
}

function createUniqueSectionId(baseId: string, usedSectionIds: Set<string>) {
  if (!usedSectionIds.has(baseId)) {
    usedSectionIds.add(baseId);
    return baseId;
  }

  let suffix = 2;
  let nextId = `${baseId}-duplicate-${suffix}`;

  while (usedSectionIds.has(nextId)) {
    suffix += 1;
    nextId = `${baseId}-duplicate-${suffix}`;
  }

  usedSectionIds.add(nextId);
  return nextId;
}

function dedupeWorkingStackIds(stack: WorkingSection[]) {
  const usedSectionIds = new Set<string>();

  return stack.map((section, index) => {
    const baseId = section.id || `${section.component}-${index}`;
    const nextId = createUniqueSectionId(baseId, usedSectionIds);

    return nextId === section.id ? section : { ...section, id: nextId };
  });
}

/**
 * Keeps a section's saved variant across a swap when the incoming component
 * shares the outgoing one's option list, and falls back to that list's first
 * entry when it does not.
 */
function keepVariantForFamily(
  variant: string | undefined,
  family: ReadonlySet<string>,
  fallback: string,
) {
  return variant && family.has(variant) ? variant : fallback;
}

function updateSectionFromSwapOption(
  section: WorkingSection,
  nextOption: (typeof sectionSwapOptions)[number],
): WorkingSection {
  return {
    ...section,
    component: nextOption.component,
    instruction: nextOption.instruction,
    mode: nextOption.mode,
    name: nextOption.name,
    ratio:
      nextOption.component === fixedRatioSplitComponent ||
      nextOption.component === contentFixedRatioSplitComponent
        ? section.ratio ?? fixedRatioSplitRatioOptions[0].value
        : undefined,
    variant:
      fullImageSplitComponents.has(nextOption.component)
        ? section.variant ?? splitContentImageVariantOptions[0].value
        : nextOption.component === fixedRatioSplitComponent ||
            nextOption.component === contentFixedRatioSplitComponent
          ? // Carrying the old value forward only holds while both sides speak
            // the same vocabulary. Swapping in from the bento would bring an
            // "image-left" the fixed-ratio family does not recognise, which
            // renders at the component default with no control lit up.
            keepVariantForFamily(
              section.variant,
              splitImageVariantValues,
              fixedRatioSplitVariantOptions[0].value,
            )
          : nextOption.component === splitBentoComponent
            ? keepVariantForFamily(
                section.variant,
                splitBentoVariantValues,
                splitBentoVariantOptions[0].value,
              )
            : nextOption.component === heroCompactComponent ||
                nextOption.component === sectionHeaderCompactComponent
              ? sectionLibraryV3Content.heroCompact.align
              : nextOption.component === sectionHeaderLargeComponent
                ? "center-display-xl"
              : nextOption.component === servicesBentoComponent
                ? servicesBentoVariantOptions[0].value
              : nextOption.component === serviceCalloutSplitPanelComponent
                ? calloutSplitPanelVariantOptions[0].value
              : nextOption.component === serviceCalloutRevealGridComponent
                ? calloutRevealGridVariantOptions[0].value
              : nextOption.component === fourCardLinkGridComponent
                ? fourCardLinkGridVariantOptions[0].value
              : undefined,
  };
}

function copySharedNavigationSection(
  section: WorkingSection,
  sharedNavigation: WorkingSection,
): WorkingSection {
  return {
    ...section,
    component: sharedNavigation.component,
    included: sharedNavigation.included,
    instruction: sharedNavigation.instruction,
    mode: sharedNavigation.mode,
    name: sharedNavigation.name,
    align: sharedNavigation.align,
    backgroundFill: sharedNavigation.backgroundFill,
    cardBorder: sharedNavigation.cardBorder,
    cardFill: sharedNavigation.cardFill,
    colorRecipe: sharedNavigation.colorRecipe,
    ratio: sharedNavigation.ratio,
    variant: sharedNavigation.variant,
  };
}

function findSharedNavigationSource(layoutSlots: PageLayoutSlot[][]) {
  const navigationSections = layoutSlots.flatMap((recipeSlots) =>
    recipeSlots.flatMap((slot) =>
      slot.stack.filter((section) => section.mode === "Navigation"),
    ),
  );

  return (
    navigationSections.find((section) => section.included) ??
    navigationSections[0]
  );
}

function applySharedNavigationToLayoutSlots(layoutSlots: PageLayoutSlot[][]) {
  const sharedNavigation = findSharedNavigationSource(layoutSlots);

  if (!sharedNavigation) {
    return layoutSlots;
  }

  return layoutSlots.map((recipeSlots) =>
    recipeSlots.map((slot) => ({
      ...slot,
      stack: slot.stack.map((section) =>
        section.mode === "Navigation"
          ? copySharedNavigationSection(section, sharedNavigation)
          : section,
      ),
    })),
  );
}

function applySavedOptionsToLayoutSlots(
  currentSlots: PageLayoutSlot[][],
  recipes: PagebuilderRecipe[],
  savedOptions: SavedPagebuilderOption[],
) {
  return applySharedNavigationToLayoutSlots(
    currentSlots.map((recipeSlots, recipeIndex) =>
      recipeSlots.map((slot, slotIndex) => {
        const recipe = recipes[recipeIndex];
        const savedOption = savedOptions.find(
          (option) =>
            option.recipeId === recipe?.id &&
            option.optionIndex === slotIndex,
        );

        if (!savedOption) {
          return slot;
        }

        return {
          ...slot,
          designStyle: {
            showSectionMarkers: Boolean(
              savedOption.designStyle.showSectionMarkers,
            ),
            viewportId: "main" as const,
          },
          stack: dedupeWorkingStackIds(
            savedOption.sections.map((section, index) => {
              const normalizedSection = normalizeSectionMetadata(section);

              return {
                ...normalizedSection,
                id:
                  section.id ||
                  `${savedOption.recipeId}-saved-${slotIndex}-${index}`,
                included: Boolean(section.included),
                originalComponent:
                  section.originalComponent || normalizedSection.component,
                originalIndex: Number.isFinite(section.originalIndex)
                  ? section.originalIndex
                  : index,
              };
            }),
          ),
        };
      }),
    ),
  );
}

function slugifyTemplateName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type SectionLayoutGrid = 7 | 14;

type SectionSwapOption = {
  component: string;
  instruction: string;
  layoutGrid?: SectionLayoutGrid;
  mode: string;
  name: string;
};

function getSectionDisplayLabel(
  section: Pick<SectionSwapOption, "component" | "name">,
) {
  return getCanonicalSectionLabel(section.component, section.name);
}

const sectionSwapOptions: readonly SectionSwapOption[] = [
  {
    component: "NavPrimarySectionV2",
    instruction:
      "Use the standard nav when the template needs the clearest service, area, phone, and booking paths.",
    mode: "Navigation",
    name: "Primary navigation",
  },
  {
    component: "NavCenterLogoSectionV2",
    instruction:
      "Use the centered logo nav when the page needs a simple brand anchor with service links and direct contact access.",
    mode: "Navigation",
    name: "Center logo navigation",
  },
  {
    component: "NavFloatingBentoSectionV2",
    instruction:
      "Use the floating nav when the hero needs a polished first-viewport frame.",
    mode: "Navigation",
    name: "Floating bento navigation",
  },
  {
    component: "HeroSplitFullHeightSectionV3",
    instruction:
      "Use h1, one primary booking CTA, one services CTA, and three compact trust stats beside a full-bleed image column.",
    mode: "Hero",
    name: "Split content and full image",
  },
  {
    component: "HeroServiceAreaZipLookupSectionV3",
    instruction:
      "Use a split hero when visitors should confirm ZIP-code coverage before starting a service request.",
    mode: "Hero",
    name: "Service area ZIP lookup",
  },
  {
    component: "HeroSplitFixedImageSectionV3",
    instruction:
      "Use a split hero with a bounded fixed-ratio image frame instead of a full-screen image.",
    mode: "Hero",
    name: "Fixed-ratio split image",
  },
  {
    component: "HeroSplitBentoSectionV3",
    instruction:
      "Use a two-slot bento tray: copy in the narrower slot and a cropped image tile beside it, both filling the full height of the section.",
    layoutGrid: 14,
    mode: "Hero",
    name: "Fixed-ratio split bento",
  },
  {
    component: "HeroFullscreenSectionV2",
    instruction:
      "Use a strong image, calm h1, review proof, and one visible request path.",
    mode: "Hero",
    name: "Fullscreen image hero",
  },
  {
    component: "HeroCenteredFloatersSectionV2",
    instruction:
      "Use the centered message while floaters carry proof, service cues, or conversion nudges.",
    mode: "Hero",
    name: "Centered with left right floaters",
  },
  {
    component: "HeroContentTopImageBottomSectionV2",
    instruction:
      "Lead with direct copy first, then use the image below to keep the page useful and quick to understand.",
    mode: "Hero",
    name: "Content top image bottom",
  },
  {
    component: "HeroCompactSectionV3",
    instruction:
      "Use a compact page title, eyebrow, and short descriptor when the page needs a clear header without media or proof blocks.",
    mode: "Hero",
    name: "Compact page hero",
  },
  {
    component: "HeroServicesSectionV3",
    instruction:
      "Combine a services page introduction with one full-height image and up to seven compact priority-service links layered over the image.",
    mode: "Hero",
    name: "Services hero",
  },
  {
    component: "HeroCompactServiceSectionV3",
    instruction:
      "Use a compact intro (eyebrow, h1, short body) for the service this page covers, a fixed-ratio service photo frame, and a boxed primary/secondary CTA on the shared 14-column grid.",
    layoutGrid: 14,
    mode: "Hero",
    name: "Compact service hero",
  },
  {
    component: "SectionHeaderSplitLinkSectionV3",
    instruction:
      "Introduce the block below with a headline on one side and a short description over a single text link on the other.",
    mode: "Section Header",
    name: "Split link header",
  },
  {
    component: "SectionHeaderCompactSectionV3",
    instruction:
      "Use a no-min-height compact header to introduce a section before card grids, FAQs, decisions, or utility blocks.",
    mode: "Section Header",
    name: "Compact section header",
  },
  {
    component: "SectionHeaderLargeSectionV3",
    instruction:
      "Use a large title-only section header when the next content module needs a stronger visual reset.",
    mode: "Section Header",
    name: "Large section header",
  },
  {
    component: "FourCardLinkGridSectionV3",
    instruction:
      "Show four linked cards on the shared 14-column grid. Each card spans three columns, leaving the first and last columns open; images may be toggled off for a shorter text-only layout.",
    layoutGrid: 14,
    mode: "Scan",
    name: "Card Links 4 Up",
  },
  {
    component: "ThreeCardLinkGridSectionV3",
    instruction:
      "Show three linked cards on the shared 14-column grid. Each card spans four columns, leaving the first and last columns open; images may be toggled off for a shorter text-only layout.",
    layoutGrid: 14,
    mode: "Scan",
    name: "Card Links 3 Up",
  },
  {
    component: "HorizontalCardLinkGridSectionV3",
    instruction:
      "Show three linked service cards on the shared 14-column grid. Each four-column card pairs a compact copy panel with an adjacent service image.",
    layoutGrid: 14,
    mode: "Scan",
    name: "Horizontal Card Links 3 Up",
  },
  {
    component: "HorizontalCardLinkGridTwoUpSectionV3",
    instruction:
      "Show two linked service cards on the shared 14-column grid. Each six-column card pairs a compact copy panel with an adjacent service image.",
    layoutGrid: 14,
    mode: "Scan",
    name: "Horizontal Card Links 2 Up",
  },
  {
    component: "ServiceNeedsPriorityGridSectionV3",
    instruction:
      "Show three compact service-need cards and one wider priority card on the 14-column grid. The cards are text-only and carry no imagery.",
    layoutGrid: 14,
    mode: "Scan",
    name: "Service needs priority grid",
  },
  {
    component: "ServiceCalloutRevealGridSectionV3",
    instruction:
      "Show four problem-first callout cards in a 2x2 block on the 14-column grid. Clicking a card reveals a panel over the whole block with that card's detail and its own CTA. Card copy is left-aligned and runs the full card width; the cards carry no imagery.",
    layoutGrid: 14,
    mode: "Decision",
    name: "Callout cards with reveal panel",
  },
  {
    component: "ServiceCalloutSplitPanelSectionV3",
    instruction:
      "Show four problem-first callout cards three columns wide, stacked 2x2 across the left six columns, beside a standing panel in columns 8-14. The panel opens on a general statement about identifying the problem, then swaps to the selected card's detail and its own CTA. The cards carry no imagery.",
    layoutGrid: 14,
    mode: "Decision",
    name: "Callout cards with side panel",
  },
  {
    component: "ServicesBentoCardsSectionV2",
    instruction:
      "Use 6-9 bento-style service cards for a fuller service scan. The fixed layout rhythm is big small small, small small big, then big small small.",
    mode: "Scan",
    name: "Services bento cards",
  },
  {
    component: "ServicesHoverPanelSectionV2",
    instruction:
      "Use a hover panel when a compact service list should reveal more detail and visual emphasis.",
    mode: "Scan",
    name: "Services hover panel",
  },
  {
    component: "ServicesThreeCardsRightSectionV3",
    instruction:
      "Show 3-5 priority services the business wants listed first before the full all-services section.",
    mode: "Scan",
    name: "Priority service cards",
  },
  {
    component: "ServicesScrollCardsSectionV2",
    instruction:
      "Use a service rail when there are more service paths than a small grid can handle gracefully.",
    mode: "Scan",
    name: "Scroll service cards",
  },
  {
    component: "ContentHorizontalCardCarouselSectionV2",
    instruction:
      "Use a horizontal card carousel when scan content needs a compact browseable sequence.",
    mode: "Scan",
    name: "Services card carousel",
  },
  {
    component: "QuickPageLinksSectionV2",
    instruction:
      "Offer a small set of useful page paths for visitors who need more context before contacting.",
    mode: "Scan",
    name: "Quick page links",
  },
  {
    component: "ContentRevealParagraphSectionV2",
    instruction:
      "Use a large editorial interstitial thought. A hard return creates a separate animated paragraph; do not treat it as standard body or card copy.",
    mode: "Narrative",
    name: "Reveal paragraph",
  },
  {
    component: "ContentScrollWrittenRevealSectionV2",
    instruction:
      "Use written reveal copy when a narrative point should build in short, readable beats.",
    mode: "Narrative",
    name: "Scroll written reveal",
  },
  {
    component: "ContentSplitHeadlineImageSectionV2",
    instruction:
      "Translate regular content into an image-led editorial texture with one large positioning line.",
    mode: "Narrative",
    name: "Split headline image content",
  },
  {
    component: "ContentSplitFixedImageSectionV3",
    instruction:
      "Use a content-height split layout when the section needs fixed-ratio imagery without hero-scale height.",
    mode: "Narrative",
    name: "Split content with fixed image",
  },
  {
    component: "ContentSplitFullImageSectionV3",
    instruction:
      "Use a content-height split layout when the section needs one large cropped image running off the page edge without hero-scale height.",
    mode: "Narrative",
    name: "Split content with full image",
  },
  {
    component: "ContentStickyCardStreamSectionV2",
    instruction:
      "Keep a promise fixed while supporting details move through response, diagnosis, options, and follow-up.",
    mode: "Narrative",
    name: "Sticky card stream content",
  },
  {
    component: "ContentStickyIdeasSectionV2",
    instruction:
      "Use natural longform paragraphs with short sticky bullets and a context-specific side-list label. Do not use generic Important ideas copy.",
    mode: "Narrative",
    name: "Sticky ideas content",
  },
  {
    component: "ContentAboutCompanySectionV2",
    instruction:
      "Use for regular about content with enough visual structure to feel useful instead of generic.",
    mode: "Narrative",
    name: "About company content",
  },
  {
    component: "ContentAboutStorySectionV3",
    instruction:
      "Use an extended about narrative with natural paragraphs, a pullquote, and scannable notes. Do not force the story into card-length copy.",
    mode: "Narrative",
    name: "Editorial 3 column",
  },
  {
    component: "ContentNarrativeFeatureRailSectionV3",
    instruction:
      "Use an eight-column longform narrative with three fixed rail slots. Item order is fixed: 1. Seasonal offer, 2. Financing or payment options, 3. Ongoing care or maintenance plan. Each title and description must match the fixed eyebrow and CTA for its slot; do not reorder these concepts.",
    layoutGrid: 14,
    mode: "Narrative",
    name: "Longform with feature rail",
  },
  {
    component: "ContentCardTwoUpSectionV3",
    instruction:
      "Show two editorial-scale cards per row on the shared 14-column grid, each spanning six columns. Provide exactly 2 or 4 cards (2 = one row, 4 = two rows). Each card is a header plus either two short paragraphs or one short paragraph and a short bullet list.",
    layoutGrid: 14,
    mode: "Narrative",
    name: "Card content 2 up",
  },
  {
    component: "ContentThreeColumnMixedSectionV3",
    instruction:
      "Three rails on the shared 14-column grid: a five-column image rail with two photos, a six-column rail holding a longform block (heading, lead paragraph, two body paragraphs, a six-item two-column bullet list, and a closing lead) with a medium primary CTA card beneath it, and a three-column rail of exactly 3 small secondary CTA link cards.",
    layoutGrid: 14,
    mode: "Narrative",
    name: "3 col mixed content",
  },
  {
    component: "ContentRuleHeaderSectionV2",
    instruction:
      "Use as lightweight editorial texture to introduce a practical idea without adding a heavy section.",
    mode: "Narrative",
    name: "Rule header content",
  },
  {
    component: "ContentMainIdeaGridSectionV3",
    instruction:
      "Use one dominant narrative idea with four concise supporting points on a 14-column grid. Keep the lead idea interpretive and the supporting cards evidence-based.",
    layoutGrid: 14,
    mode: "Narrative",
    name: "Main idea support grid",
  },
  {
    component: "ContentPhotoGalleryCarouselSectionV3",
    instruction:
      "Use a mixed-size horizontal photo gallery when people, projects, or proof images should carry the visual story.",
    mode: "Images",
    name: "Photo gallery carousel",
  },
  {
    component: "ContentPhotoGalleryLargeCarouselSectionV3",
    instruction:
      "Use a larger mixed-size photo gallery when the images should become a stronger editorial moment.",
    mode: "Images",
    name: "Large photo gallery carousel",
  },
  {
    component: "ProjectCaseStudyGallerySectionV3",
    instruction:
      "Use a focused project gallery when one image and concise project details should work together as a mini case study.",
    mode: "Images",
    name: "Project case study gallery",
  },
  {
    component: "ImageStripSectionV3",
    instruction:
      "Use a simple image strip with one large image and two supporting images on the seven-column grid.",
    mode: "Images",
    name: "Image strip",
  },
  {
    component: "FeaturePortraitParagraphSectionV3",
    instruction:
      "Use an editorial portrait and focused paragraph when a section needs human context or point-of-view.",
    mode: "Narrative",
    name: "Portrait paragraph feature",
  },
  {
    component: "FeatureOverlapRowsSectionV3",
    instruction:
      "Use overlapping feature rows when multiple narrative points need visual momentum without becoming service cards.",
    mode: "Narrative",
    name: "Overlap feature rows",
  },
  {
    component: "FeatureAsymmetricCardsSectionV3",
    instruction:
      "Use an intro and exactly four supporting items in the four-card feature cluster when a why-choose-us section needs scannable proof points.",
    mode: "Narrative",
    name: "Cards features 4 up split",
  },
  {
    component: "FeatureStackedCardsSectionV3",
    instruction:
      "Use stacked feature cards when a why-choose-us section needs larger icon-led proof points with the same copy formula as asymmetric cards.",
    mode: "Narrative",
    name: "Stacked feature cards",
  },
  {
    component: "TrustBarSectionV3",
    instruction:
      "Validate the promise immediately with rating, volume, team, and locality claims.",
    mode: "Proof",
    name: "Trust bar",
  },
  {
    component: "TrustBarFloatingBentoSectionV3",
    instruction:
      "Use floating trust proof when compact stats should feel more dimensional than a straight bar.",
    mode: "Proof",
    name: "Floating bento trust bar",
  },
  {
    component: "TrustMarqueeSection",
    instruction:
      "Use a headline with a scrolling banner when proof points should move beside a stronger editorial claim.",
    mode: "Action",
    name: "Headline with Scrolling Banner",
  },
  {
    component: "TrustMarqueeSectionV3",
    instruction:
      "Use short repeated claims when there are many small proof points.",
    mode: "Proof",
    name: "Trust marquee",
  },
  {
    component: "TrustLogoMarqueeSectionV3",
    instruction:
      "Use scrolling logo proof for affiliations, certifications, training, manufacturer badges, or partner networks.",
    mode: "Proof",
    name: "Logo marquee",
  },
  {
    component: "TrustLogoGridSectionV3",
    instruction:
      "Use static logos or associations when motion would distract from reading.",
    mode: "Proof",
    name: "Static trust logo grid",
  },
  {
    component: "TestimonialsSectionV3",
    instruction:
      "Use the current testimonial section when proof needs a polished structured presentation.",
    mode: "Proof",
    name: "Testimonials",
  },
  {
    component: "TestimonialsCarouselSectionV3",
    instruction:
      "Use longer customer stories only if they contain useful service detail.",
    mode: "Proof",
    name: "Customer stories",
  },
  {
    component: "TestimonialsCarouselCondensedSectionV3",
    instruction:
      "Use condensed customer stories when the page needs three testimonial cards visible at once without introductory copy.",
    mode: "Proof",
    name: "Customer stories condensed",
  },
  {
    component: "TestimonialsMasonrySectionV3",
    instruction:
      "Use varied quote lengths to create a fuller body of evidence.",
    mode: "Proof",
    name: "Masonry testimonials",
  },
  {
    component: "DecisionSplitDecisionSectionV3",
    instruction:
      "Use a compact two-card comparison when a homeowner needs help deciding whether repair or replacement makes more sense after inspection.",
    mode: "Decision",
    name: "Split decision",
  },
  {
    component: "DecisionSplitLargeCardsSectionV3",
    instruction:
      "Use two large decision cards side by side. Add a section header above it when the block needs a headline.",
    mode: "Decision",
    name: "Split large cards",
  },
  {
    component: "DecisionSplitDecisionLargeSectionV3",
    instruction:
      "Use two detailed decision cards on a 14-column grid. Each card should contain a focused header, two concise paragraphs, a short evidence list, and a bottom-aligned next-step link.",
    layoutGrid: 14,
    mode: "Decision",
    name: "Split decision large",
  },
  {
    component: "DecisionQuestionTableFourSectionV3",
    instruction:
      "Use a four-question table on a 14-column grid when the questions carry the section on their own. There is no heading or lead copy here - write only the four column questions and their answers, and lead into it from the section above.",
    layoutGrid: 14,
    mode: "Decision",
    name: "Table compare 4 col",
  },
  {
    component: "DecisionMatrixCardSectionV3",
    instruction:
      "Use a 2x2 matrix card on a 14-column grid when the page needs a short review/checklist summary. Left alignment uses five columns of header copy, one blank column, and an eight-column matrix. Center places the header above the eight-column matrix. Right places the matrix first, then a blank column, then the header.",
    layoutGrid: 14,
    mode: "Decision",
    name: "Matrix card",
  },
  {
    component: "OfferTermsSectionV3",
    instruction:
      "Clarify an offer's eligibility and restrictions, explain the four-step request process, and close with a concise availability assurance and request action.",
    layoutGrid: 14,
    mode: "Decision",
    name: "Offer terms",
  },
  {
    component: "DecisionQuestionTableSectionV3",
    instruction:
      "Use a three-question table on a 14-column grid when the visitor should recognize their own situation before booking. Each column is one question with three short, mutually exclusive answers a homeowner could pick without diagnosing anything.",
    layoutGrid: 14,
    mode: "Decision",
    name: "Table compare 3 col",
  },
  {
    component: "ProcessStepsSectionV3",
    instruction:
      "Use current process steps when the page needs a clearer, more styled decision sequence.",
    mode: "Decision",
    name: "Process steps",
  },
  {
    component: "ProcessStripSectionV3",
    instruction:
      "Summarize a short three- or four-step customer process in one compact horizontal strip. Keep every step concrete, sequential, and brief enough to scan without a section header.",
    layoutGrid: 14,
    mode: "Decision",
    name: "Process strip",
  },
  {
    component: "ProcessStepsStaggeredSectionV3",
    instruction:
      "Use a four-column descriptive introduction beside five concise process steps in a connected flow, alternating left and right from top to bottom.",
    layoutGrid: 14,
    mode: "Decision",
    name: "Process steps staggered",
  },
  {
    component: "ProcessStepsBranchingSectionV3",
    instruction:
      "Use three connected process steps that split into two alternative outcome cards. The left layout uses a four-column heading sidebar; the centered layout removes the heading and centers the flow.",
    layoutGrid: 14,
    mode: "Decision",
    name: "Process steps branching",
  },
  {
    component: "InfoStripSectionV3",
    instruction:
      "State one safety or eligibility condition and what the reader should do about it. Use when a single instruction has to be read before anything else on the page.",
    layoutGrid: 14,
    mode: "Utility",
    name: "Info strip",
  },
  {
    component: "ContactStripSmallSectionV3",
    instruction:
      "Present phone, email, office hours, after-hours guidance, and the physical location as a single row of five equal tiles. Use when the contact details belong on one compact band rather than a stacked composition. Keep every value short - each tile is about a fifth of the row.",
    layoutGrid: 14,
    mode: "Utility",
    name: "Contact strip small",
  },
  {
    component: "ContactStripBentoSectionV3",
    instruction:
      "Present the primary phone number, lower-emphasis email address, office hours, after-hours guidance, and physical location in a centered five-card bento contact strip. Keep every item concise, practical, and directly usable.",
    layoutGrid: 14,
    mode: "Utility",
    name: "Contact strip bento",
  },
  {
    component: "FinancingCalculatorSectionV3",
    instruction:
      "Provide an informational HVAC financing estimator with synchronized project-cost controls, standard and clearly separate promotional terms, immediate amortized payment estimates, lender disclosure, and quote-request handoff context. Never present the estimate as approval or a financing offer.",
    layoutGrid: 14,
    mode: "Utility",
    name: "Financing calculator",
  },
  {
    component: "FAQSectionV3",
    instruction:
      "Include only the questions that affect whether someone contacts you.",
    mode: "Utility",
    name: "FAQ",
  },
  {
    component: "FAQAccordionSectionV3",
    instruction:
      "Handle objections with expandable answers and no vague copy.",
    mode: "Utility",
    name: "FAQ accordion",
  },
  {
    component: "FAQAccordionSidebarSectionV3",
    instruction:
      "Handle objections with expandable answers beside a sidebar panel (header, subhead, one CTA) on the shared seven-column grid. Use when the FAQ section should also carry a direct contact path.",
    mode: "Utility",
    name: "FAQ accordion sidebar",
  },
  {
    component: "ProcessImageChecklistSectionV3",
    instruction:
      "Turn process uncertainty into clear expectations before contact.",
    mode: "Decision",
    name: "Process image checklist",
  },
  {
    component: "CTASectionV3",
    instruction:
      "Use the current conversion band when the page needs a polished direct next step.",
    mode: "Action",
    name: "CTA",
  },
  {
    component: "CTAImageSectionV3",
    instruction:
      "Pair a two-action conversion block with a full-height cropped image on the 14-column grid. Copy takes six columns with both actions directly beneath the supporting text; the unradiused image fills the opposing half and bleeds to the section edge regardless of section spacing. The alignment toggle swaps which side the copy sits on.",
    layoutGrid: 14,
    mode: "Action",
    name: "CTA with image",
  },
  {
    component: "CTASmallBandImageSectionV3",
    instruction:
      "Use a compact conversion band on the 14-column grid: six columns of short headline and support copy, four columns for one primary action, and four columns for a tightly cropped contextual image. Let content and compact padding set the band height, keep the image full-bleed against the top, bottom, and right edges, and simplify into additional rows on smaller screens.",
    layoutGrid: 14,
    mode: "Action",
    name: "CTA small band with image",
  },
  {
    component: "CTAServiceTriageSectionV3",
    instruction:
      "Route visitors into three clear next steps: begin the service-request modal from a six-column card, call directly for an urgent issue from the center card, or reach the existing-customer contact path from the final card. Keep all three paths concise and operationally distinct.",
    layoutGrid: 14,
    mode: "Action",
    name: "Service Request Catch-all",
  },
  {
    component: "FeaturedOfferSectionV3",
    instruction:
      "Feature one time-sensitive offer in a shared surface: a tall promotional image with a callout banner, full-width offer heading and details, then an included-services list beside the conversion panel. The alignment toggle moves the image to either side.",
    layoutGrid: 14,
    mode: "Action",
    name: "Featured offer",
  },
  {
    component: "AdditionalOffersSectionV3",
    instruction:
      "Follow a primary promotion with secondary offer cards shown two at a time. Each card uses one icon column, a larger offer-detail column, and a right-side conversion column; additional pairs advance together through the slider.",
    layoutGrid: 14,
    mode: "Action",
    name: "Additional offers",
  },
  {
    component: "CTAMutedSectionV3",
    instruction:
      "Use a quieter service-card CTA when the page needs a softer next step between content sections.",
    mode: "Action",
    name: "Muted CTA",
  },
  {
    component: "CTAFullscreenSectionV3",
    instruction:
      "Use the strongest conversion treatment for a memorable final booking moment.",
    mode: "Action",
    name: "Fullscreen conversion",
  },
  {
    component: "CTAScrollRevealOfferSectionV3",
    instruction:
      "Use a discovered offer or next-step reveal to transition from trust into action.",
    mode: "Action",
    name: "Scroll reveal offer conversion",
  },
  {
    component: "ContentFixedCoverFadeSectionV2",
    instruction:
      "Use a fixed-cover fade as an immersive, image-led closing conversion. Write backgroundTitle and backgroundBody for the full-screen closing message, then foregroundEyebrow, foregroundTitle, foregroundBody, and contactDetails for the request path. Do not leave backgroundTitle or backgroundBody blank.",
    mode: "Action",
    name: "Fixed cover fade",
  },
  {
    component: "ServiceAreaZipLookupSectionV3",
    instruction:
      "Use when visitors need to confirm service coverage before starting a request.",
    mode: "Utility",
    name: "Service area zip lookup",
  },
  {
    component: "ContactSectionV3",
    instruction:
      "Close with phone, email, hours, and a simple form or request path.",
    mode: "Action",
    name: "Contact section",
  },
  {
    component: "ContactSectionModalBegin",
    instruction:
      "Begin the request flow in-page with system and service choices, then carry those answers into step two of the request modal.",
    mode: "Action",
    name: "Contact section modal begin",
  },
  {
    component: "ThankYouConfirmationSectionV3",
    instruction:
      "Confirm that a request was received, explain the follow-up sequence, and provide clear home and services exit paths.",
    mode: "Utility",
    name: "Thank you confirmation",
  },
  {
    component: "FooterSectionV3",
    instruction:
      "End with service links, areas, contact details, and legal links.",
    mode: "Utility",
    name: "Footer",
  },
  {
    component: "FooterHorizontalSectionV3",
    instruction:
      "End with a horizontal footer where link groups sit inline and wrap beside their headings.",
    mode: "Utility",
    name: "Horizontal footer",
  },
  {
    component: "FooterCompactSectionV3",
    instruction:
      "End with top-level navigation links, a rule, contact info, social links, and legal links in a compact footer.",
    mode: "Utility",
    name: "Condensed footer",
  },
  {
    component: "FooterLinkPanelSectionV3",
    instruction:
      "End with a large link-panel footer that groups service areas, services, contact paths, social links, and a back-to-top action.",
    mode: "Utility",
    name: "Link panel footer",
  },
] as const;

/**
 * The layout glyph a section shows in the add panel. Pattern only - the text
 * beside it is the canonical library label, same as every other surface. These
 * used to carry their own shorter `label`, which is where the two vocabularies
 * came from: the add panel read the signifier, the sections panel read the
 * library. The short names won and moved into the library, so there is nothing
 * left here to disagree with it.
 */
type InnerOptionSignifier = {
  pattern: "align" | "full" | "fixed";
};

const innerOptionSignifiers: Partial<
  Record<SectionSwapOption["component"], InnerOptionSignifier>
> = {
  HeroSplitFullHeightSectionV3: { pattern: "full" },
  HeroServiceAreaZipLookupSectionV3: { pattern: "full" },
  HeroSplitFixedImageSectionV3: { pattern: "fixed" },
  HeroSplitBentoSectionV3: { pattern: "full" },
  ContentSplitFixedImageSectionV3: { pattern: "fixed" },
  ContentSplitFullImageSectionV3: { pattern: "full" },
  HeroCompactSectionV3: { pattern: "align" },
  SectionHeaderCompactSectionV3: { pattern: "align" },
  SectionHeaderLargeSectionV3: { pattern: "align" },
};

function getInnerOptionSignifier(component: string) {
  return innerOptionSignifiers[component];
}

function sortSectionSwapOptions(options: readonly SectionSwapOption[]) {
  return [...options].sort((first, second) => {
    const firstGroup = getInnerOptionSignifier(first.component) ? 0 : 1;
    const secondGroup = getInnerOptionSignifier(second.component) ? 0 : 1;

    return (
      firstGroup - secondGroup ||
      getSectionDisplayLabel(first).localeCompare(
        getSectionDisplayLabel(second),
      )
    );
  });
}

function getSectionLayoutGrid(component: string): SectionLayoutGrid {
  return (
    sectionSwapOptions.find((option) => option.component === component)
      ?.layoutGrid ?? 7
  );
}

function SectionLayoutGridBadge({
  component,
  tone,
}: {
  component: string;
  tone: "dark" | "light";
}) {
  if (getSectionLayoutGrid(component) !== 14) {
    return null;
  }

  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center rounded-[var(--chrome-radius-control)] border px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase leading-none tracking-[0.06em]",
        tone === "dark"
          ? "token-chrome-badge"
          : "border-service-border bg-service-surface text-service-muted",
      )}
      title="Uses the shared 14-column fine grid"
    >
      14 col
    </span>
  );
}

/** Names the glyph for the icon-only case, where no label sits beside it. */
const innerOptionPatternLabels: Record<InnerOptionSignifier["pattern"], string> =
  {
    align: "Aligned content layout",
    fixed: "Fixed-ratio image layout",
    full: "Full image layout",
  };

/**
 * Omit `label` where the section name is already on screen next to the pill -
 * the glyph still carries the layout distinction without echoing the name.
 */
function InnerLayoutPill({
  label,
  signifier,
  tone,
}: {
  label?: string;
  signifier: InnerOptionSignifier;
  tone: "dark" | "light";
}) {
  const icon =
    signifier.pattern === "align" ? (
      <span
        aria-hidden="true"
        className="grid h-3.5 w-5 grid-cols-3 items-end gap-0.5 rounded-[2px] border border-current/40 px-0.5 py-0.5"
      >
        <span className="h-1.5 bg-current/35" />
        <span className="h-2.5 bg-current" />
        <span className="h-1.5 bg-current/35" />
      </span>
    ) : (
      <span
        aria-hidden="true"
        className="grid h-3.5 w-5 grid-cols-2 overflow-hidden rounded-[2px] border border-current/40"
      >
        <span className="bg-current/25" />
        <span
          className={cx(
            "bg-current",
            signifier.pattern === "fixed" && "m-0.5 rounded-[1px]",
          )}
        />
      </span>
    );

  return (
    <span
      aria-label={label ? undefined : innerOptionPatternLabels[signifier.pattern]}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-[var(--chrome-radius-control)] border px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em]",
        tone === "dark"
          ? "token-chrome-badge"
          : "border-service-border bg-service-surface text-service-muted",
      )}
      role={label ? undefined : "img"}
      title={label ? undefined : innerOptionPatternLabels[signifier.pattern]}
    >
      {icon}
      {label}
    </span>
  );
}

function buildPageInstruction({
  designLabel,
  excludedSections,
  includedSections,
  recipe,
  selectedViewport,
}: PageInstructionInput) {
  return [
    `Pageworks Page Instruction`,
    ``,
    `Pipeline stage: Pagebuilder`,
    `Target page type: ${designLabel}`,
    `Source recipe id: ${recipe.id}`,
    `Page intent: ${recipe.positioning}`,
    `Viewport/design reference: ${selectedViewport.label} (${selectedViewport.sizeLabel})`,
    ``,
    `Style rules:`,
    ...recipe.styleRules.map((rule) => `- ${rule}`),
    `- Use the shared LayoutGrid / LayoutGridItem system with the registered 7- or 14-column layout. Existing SevenColumnGrid sections remain valid through the compatibility wrapper.`,
    `- Use common regular/medium section spacing through section-space-med or LayoutGrid padding="med", unless a real hero/footer pattern requires its established spacing.`,
    `- Use the existing project typography, radius, surface, and color tokens.`,
    ``,
    `Included section order:`,
    ...includedSections.map(
      (section, index) =>
        `${index + 1}. ${section.component}
   Name: ${section.name}
   Mode: ${section.mode}
   Layout grid: ${getSectionLayoutGrid(section.component)} columns
   ${
     usesFullImageSplitVariants(section)
       ? `Variant: ${
           getSplitContentImageVariantLabel(section.variant) ??
           splitContentImageVariantOptions[0].label
         } (${section.variant ?? splitContentImageVariantOptions[0].value})`
       : isAnyFixedRatioSplitSection(section)
         ? `Variant: ${
             getFixedRatioSplitVariantLabel(section.variant) ??
             fixedRatioSplitVariantOptions[0].label
           } (${section.variant ?? fixedRatioSplitVariantOptions[0].value})
   Image ratio: ${
     getFixedRatioSplitRatioLabel(section.ratio) ??
     fixedRatioSplitRatioOptions[0].label
   } (${section.ratio ?? fixedRatioSplitRatioOptions[0].value})`
       : isSplitBentoSection(section)
         ? `Variant: ${
             getSplitBentoVariantLabel(section.variant) ??
             splitBentoVariantOptions[0].label
           } (${section.variant ?? splitBentoVariantOptions[0].value})`
       : isServicesBentoSection(section)
         ? `Variant: ${
             getServicesBentoVariantLabel(section.variant) ??
             servicesBentoVariantOptions[0].label
           } (${section.variant ?? servicesBentoVariantOptions[0].value})`
       : isServiceCalloutSplitPanelSection(section)
         ? `Variant: ${
             getCalloutSplitPanelVariantLabel(section.variant) ??
             calloutSplitPanelVariantOptions[0].label
           } (${section.variant ?? calloutSplitPanelVariantOptions[0].value})`
       : isServiceCalloutRevealGridSection(section)
         ? `Variant: ${
             getCalloutRevealGridVariantLabel(section.variant) ??
             calloutRevealGridVariantOptions[0].label
           } (${section.variant ?? calloutRevealGridVariantOptions[0].value})`
      : isFourCardLinkGridSection(section)
         ? `Variant: ${
             getFourCardLinkGridVariant(section) === "with-images"
               ? "Images"
               : "No images"
           } (${getFourCardLinkGridVariant(section)})`
       : isThreeCardLinkGridSection(section)
         ? `Variant: ${
             getCardLinkGridVariant(section) === "with-images"
               ? "Images"
               : "No images"
           } (${getCardLinkGridVariant(section)})
   Row alignment: ${
     getCardLinkGridAlignLabel(getCardLinkGridAlign(section)) ?? "Center"
   } (${getCardLinkGridAlign(section)})`
       : sectionSupportsTableCompareAlign(section.component)
        ? `Alignment: ${
             getTableCompareAlignLabel(getTableCompareAlign(section)) ?? "Center"
           } (${getTableCompareAlign(section)})`
      : section.component === contentStickyCardStreamComponent
        ? `Content image: ${
            getStickyCardStreamShowImage(section) ? "shown" : "hidden"
          } (${section.variant ?? "text-only"})`
       : "Variant: default"
   }
       Instruction: ${section.instruction}
   Spacing: ${[
     section.reduceTopPadding ? "reduce top padding" : null,
     section.reduceBottomPadding ? "reduce bottom padding" : null,
   ]
     .filter(Boolean)
     .join(", ") || "default section padding"}
   Origin: ${
     section.originalComponent !== section.component
       ? `swapped from ${section.originalComponent}`
       : section.originalIndex === index
         ? "original recipe section"
         : "reordered original recipe section"
   }`,
    ),
    ``,
    `Excluded sections: ${
      excludedSections.length > 0
        ? excludedSections
            .map((section) => `${section.component} (${section.name})`)
            .join(", ")
        : "none"
    }`,
    ``,
    `Bake-in implementation rules:`,
    `- Create a concrete page from this instruction; do not make the page depend on Pagebuilder runtime state.`,
    `- Use existing section components from src/components/sections/.`,
    `- Compose imported sections in the target page; do not paste large raw section markup into app/**/page.tsx.`,
    `- Keep reusable/business-specific copy in src/content/.`,
    `- Use shared primitives, design tokens, type utilities, spacing utilities, and color variables before adding anything new.`,
    `- Preserve desktop-first Tailwind with max-* responsive variants.`,
    `- Do not add new dependencies, redesign unrelated sections, rewrite form/Supabase logic, or add Google Fonts link tags.`,
    `- If a section needs new copy, create concise local-service business copy that matches the section mode and instruction.`,
    ``,
    `Expected output:`,
    `- Clean page route under src/app/ generated from the completed template builder.`,
    `- Page content stored or exported from src/content/.`,
    `- No extra builder/editor controls on the baked page.`,
  ].join("\n");
}

type PagebuilderPreviewWindowProps = {
  activePageLabel: string;
  children: ReactNode;
  contentClassName: string;
  frameClassName: string;
  previewStyle: CSSProperties;
  responsiveClassName: string;
  screenClassName: string;
  showSectionMarkers: boolean;
  sizeLabel: string;
  spacingClassName: string;
};

function PaddingPrismIcon({
  active,
  edge,
}: {
  active: boolean;
  edge: "top" | "bottom";
}) {
  return (
    <span
      aria-hidden="true"
      className="relative block h-7 w-11 rounded-sm border border-current/70"
    >
      <span
        className={cx(
          "absolute left-0 right-0 h-[16.666%] transition-colors",
          edge === "top" ? "top-0" : "bottom-0",
          active ? "bg-white" : "bg-current/35",
        )}
      />
    </span>
  );
}

function CardImageIcon({ hidden }: { hidden?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect height="14" rx="1.5" stroke="currentColor" strokeWidth="1.75" width="18" x="3" y="5" />
      <circle cx="8" cy="10" fill="currentColor" r="1.4" />
      <path d="m5 17 4.25-4.25L12 15.5l2.25-2.25L19 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
      {hidden ? <path d="M4 4 20 20" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /> : null}
    </svg>
  );
}

function FixedCoverFadeFormIcon({ modal }: { modal: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect height="16" rx="1.5" stroke="currentColor" strokeWidth="1.75" width="14" x="3" y="4" />
      <path d="M6.5 8h7M6.5 11.5h7M6.5 15h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
      {modal ? (
        <path d="M16 14h5v5h-5zM18.5 15.5v2M17.5 16.5h2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      ) : null}
    </svg>
  );
}

function CardBorderIcon({ bordered }: { bordered: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeOpacity={bordered ? 1 : 0.25}
        strokeWidth={bordered ? "2.25" : "1.25"}
        width="18"
        x="3"
        y="5"
      />
    </svg>
  );
}

/**
 * A plain check and cross rather than a drawing of a link: the axis is on/off,
 * and the two glyphs read as a pair at 24px where a chain link and a broken
 * chain link do not.
 */
function CardLinksIcon({ linked }: { linked: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d={
          linked
            ? "m5 12.5 4.5 4.5L19 7.5"
            : "M6.75 6.75 17.25 17.25M17.25 6.75 6.75 17.25"
        }
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

/** The marker glyph itself, struck through for the off state. */
function SectionIconsIcon({ shown }: { shown: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 12h7M11.5 8.5 15 12l-3.5 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
      <path
        d="M18 7v10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeOpacity="0.3"
        strokeWidth="1.75"
      />
      {shown ? null : (
        <path
          d="M4 20 20 4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}

function CardFillIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect
        fill={filled ? "currentColor" : "none"}
        fillOpacity={filled ? 0.35 : 0}
        height="14"
        rx="1.5"
        stroke="currentColor"
        strokeDasharray={filled ? undefined : "3 2.5"}
        strokeWidth="1.75"
        width="18"
        x="3"
        y="5"
      />
    </svg>
  );
}

function PagebuilderPreviewWindow({
  activePageLabel,
  children,
  contentClassName,
  frameClassName,
  previewStyle,
  responsiveClassName,
  screenClassName,
  showSectionMarkers,
  sizeLabel,
  spacingClassName,
}: PagebuilderPreviewWindowProps) {
  return (
    <div
      className={cx(
        "mx-auto flex max-h-full min-h-0 flex-col overflow-hidden rounded border border-service-border bg-bg-page transition-all duration-300",
        frameClassName,
      )}
    >
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-service-border bg-service-surface px-3">
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full bg-service-border"
        />
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full bg-service-border"
        />
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full bg-service-accent"
        />
        <div className="ml-2 flex min-w-0 flex-1 items-center rounded-full border border-service-border bg-bg-page px-3 py-1">
          <span className="type-caption truncate font-semibold text-service-muted">
            {sizeLabel} / {activePageLabel}
          </span>
        </div>
      </div>

      <div
        className={cx(
          "min-h-0 overflow-auto bg-bg-page [container-type:size]",
          screenClassName,
        )}
      >
        <div
          className={cx(
            "min-h-full w-full bg-bg-page",
            spacingClassName,
            responsiveClassName,
            !showSectionMarkers && "pagebuilder-hide-markers",
          )}
          style={{
            ...previewStyle,
            "--section-viewport-height": "100cqh",
            "--section-min-screen": "var(--section-viewport-height)",
          } as PreviewVariableStyle}
        >
          <div
            className={cx(
              "fluid-type-frame mx-auto min-h-full w-full bg-bg-page",
              contentClassName,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function subscribeToHydration() {
  return () => {};
}

export function PagebuilderShell({
  recipes,
  renderLibrarySection,
  sectionModes,
}: PagebuilderShellProps) {
  const [activeRecipeId, setActiveRecipeId] = useState(recipes[0]?.id ?? "");
  const [layoutSlots, setLayoutSlots] = useState<PageLayoutSlot[][]>(() =>
    recipes.map((recipe) => createInitialLayoutSlots(recipe)),
  );
  const [activeLayoutSlotIndexes] = useState<number[]>(() =>
    recipes.map(() => 0),
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [openSidebarPanel, setOpenSidebarPanel] = useState<
    "page-layouts" | "sections" | "add-section" | null
  >(null);
  const isSidebarStateHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [openAddSectionModeId, setOpenAddSectionModeId] = useState<string | null>(
    null,
  );
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(
    null,
  );
  const [dragDropPosition, setDragDropPosition] =
    useState<DragDropPosition>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRenderedPreviewOpen, setIsRenderedPreviewOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isPromotingTemplate, setIsPromotingTemplate] = useState(false);
  const [isSavingOption, setIsSavingOption] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateSlug, setTemplateSlug] = useState("");
  const [templateNotes, setTemplateNotes] = useState("");
  const [optionSaveStatus, setOptionSaveStatus] = useState("");
  const [optionSaveError, setOptionSaveError] = useState("");
  const [templateStatus, setTemplateStatus] = useState("");
  const [templateError, setTemplateError] = useState("");
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const [previewVariableStyle, setPreviewVariableStyle] =
    useState<PreviewVariableStyle>({});
  const [savedPageTemplates, setSavedPageTemplates] = useState<
    SavedPageTemplate[]
  >([]);
  const [savedOptionsLoaded, setSavedOptionsLoaded] = useState(false);
  const [recentlyAddedSection, setRecentlyAddedSection] = useState<string | null>(
    null,
  );
  const addedSectionIdCounterRef = useRef(0);
  const addedSectionFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autosaveSignaturesRef = useRef(new Map<string, string>());

  const activeRecipeIndex = Math.max(
    recipes.findIndex((recipe) => recipe.id === activeRecipeId),
    0,
  );
  const activeRecipe = recipes[activeRecipeIndex] ?? recipes[0];
  const activeLayoutSlotIndex =
    activeLayoutSlotIndexes[activeRecipeIndex] ?? 0;
  const activeLayoutSlots = layoutSlots[activeRecipeIndex] ?? [];
  const activeLayoutSlot =
    activeLayoutSlots[activeLayoutSlotIndex] ?? activeLayoutSlots[0];
  const activePageLabel = activeRecipe?.name ?? `Page ${activeRecipeIndex + 1}`;
  const activeDesignStyle = useMemo(
    () => activeLayoutSlot?.designStyle ?? createInitialDesignStyle(),
    [activeLayoutSlot?.designStyle],
  );
  const activeStack = useMemo(
    () => activeLayoutSlot?.stack ?? [],
    [activeLayoutSlot?.stack],
  );
  const sectionTemplateUsageCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const template of savedPageTemplates) {
      for (const section of template.sections) {
        if (isTemplateContentSection(section)) {
          counts.set(
            section.component,
            (counts.get(section.component) ?? 0) + 1,
          );
        }
      }
    }

    return counts;
  }, [savedPageTemplates]);
  const activeSlotLabel = activeLayoutSlot?.name ?? "Page Layout";
  const selectedSection =
    activeStack.find((section) => section.id === selectedSectionId) ?? null;
  const selectedViewport =
    viewportOptions.find((option) => option.id === activeDesignStyle.viewportId) ??
    viewportOptions[0];
  const includedSections = activeStack.filter((section) => section.included);
  const excludedSections = activeStack.filter((section) => !section.included);
  const pageInstruction = buildPageInstruction({
    designLabel: activePageLabel,
    excludedSections,
    includedSections,
    recipe: activeRecipe,
    selectedViewport,
  });
  const allLayoutInstructions = recipes
    .map((recipe, index) => {
      const slotIndex = activeLayoutSlotIndexes[index] ?? 0;
      const slot = layoutSlots[index]?.[slotIndex] ?? layoutSlots[index]?.[0];
      const stack = slot?.stack ?? [];
      const settings = slot?.designStyle ?? createInitialDesignStyle();
      const viewport =
        viewportOptions.find((option) => option.id === settings?.viewportId) ??
        viewportOptions[0];

      return buildPageInstruction({
        designLabel: recipe.name,
        excludedSections: stack.filter((section) => !section.included),
        includedSections: stack.filter((section) => section.included),
        recipe,
        selectedViewport: viewport,
      });
    })
    .join("\n\n---\n\n");

  useEffect(() => {
    function syncPreviewVariables() {
      setPreviewVariableStyle(readPagebuilderPreviewVariables());
    }

    syncPreviewVariables();
    window.addEventListener("focus", syncPreviewVariables);

    return () => {
      window.removeEventListener("focus", syncPreviewVariables);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedOptions() {
      try {
        const response = await fetch("/api/pagebuilder-options");
        const result =
          (await response.json()) as SavedPagebuilderOptionsResponse;

        if (!isMounted || !response.ok || !result.ok) {
          if (isMounted) {
            setSavedOptionsLoaded(true);
          }
          return;
        }

        setLayoutSlots((currentSlots) =>
          applySavedOptionsToLayoutSlots(
            currentSlots,
            recipes,
            result.options,
          ),
        );
        setSavedOptionsLoaded(true);
      } catch {
        if (isMounted) {
          setOptionSaveError("Saved options could not be loaded.");
          setSavedOptionsLoaded(true);
        }
      }
    }

    void loadSavedOptions();

    return () => {
      isMounted = false;
    };
  }, [recipes]);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedPageTemplates() {
      try {
        const response = await fetch("/api/page-templates");
        const result = (await response.json()) as SavedPageTemplatesResponse;

        if (isMounted && response.ok && result.ok) {
          setSavedPageTemplates(result.templates);
        }
      } catch {
        // Leave counts at zero when the local template registry is unavailable.
      }
    }

    void loadSavedPageTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!savedOptionsLoaded || !activeRecipe.id) {
      return;
    }

    const payload = buildOptionSaveRequest(
      activeRecipe,
      activeLayoutSlot,
      activeLayoutSlotIndex,
    );
    const signatureKey = getOptionSignatureKey(payload);
    const signature = getOptionSignature(payload);
    const previousSignature = autosaveSignaturesRef.current.get(signatureKey);

    if (!previousSignature) {
      autosaveSignaturesRef.current.set(signatureKey, signature);
      return;
    }

    if (previousSignature === signature) {
      return;
    }

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(async () => {
      try {
        await postPagebuilderOption(payload);
        rememberOptionSaveSignature(payload);
      } catch {
        setOptionSaveError("Pagebuilder autosave failed.");
      }
    }, 800);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [
    activeDesignStyle,
    activeLayoutSlot,
    activeLayoutSlotIndex,
    activeRecipe,
    activeRecipe.id,
    activeRecipe.name,
    activeSlotLabel,
    activeStack,
    savedOptionsLoaded,
  ]);

  function updateActiveStack(updater: (stack: WorkingSection[]) => WorkingSection[]) {
    setLayoutSlots((currentSlots) =>
      currentSlots.map((recipeSlots, recipeIndex) =>
        recipeIndex === activeRecipeIndex
          ? recipeSlots.map((slot, slotIndex) =>
              slotIndex === activeLayoutSlotIndex
                ? {
                    ...slot,
                    stack: dedupeWorkingStackIds(updater(slot.stack)),
                  }
                : slot,
            )
          : recipeSlots,
      ),
    );
  }

  function selectRecipe(recipeId: string) {
    setActiveRecipeId(recipeId);
    setSelectedSectionId(null);
    setOptionSaveStatus("");
    setOptionSaveError("");
  }

  function clearDragState() {
    setDraggedSectionId(null);
    setDragOverSectionId(null);
    setDragDropPosition(null);
  }

  function moveSection(sectionId: string, direction: -1 | 1) {
    updateActiveStack((stack) => {
      const currentIndex = stack.findIndex(
        (section) => section.id === sectionId,
      );
      const nextIndex = currentIndex + direction;

      if (
        currentIndex < 0 ||
        nextIndex < 0 ||
        nextIndex >= stack.length
      ) {
        return stack;
      }

      const nextStack = [...stack];
      const [item] = nextStack.splice(currentIndex, 1);
      nextStack.splice(nextIndex, 0, item);
      return nextStack;
    });
  }

  function reorderSection(
    draggedId: string,
    targetId: string,
    position: "before" | "after",
  ) {
    if (!draggedId || draggedId === targetId) {
      clearDragState();
      return;
    }

    updateActiveStack((stack) => {
      const nextStack = [...stack];
      const draggedIndex = nextStack.findIndex(
        (section) => section.id === draggedId,
      );

      if (draggedIndex < 0) {
        return stack;
      }

      const [item] = nextStack.splice(draggedIndex, 1);
      const targetStackIndex = nextStack.findIndex(
        (section) => section.id === targetId,
      );

      if (targetStackIndex < 0) {
        return stack;
      }

      nextStack.splice(
        position === "before" ? targetStackIndex : targetStackIndex + 1,
        0,
        item,
      );

      return nextStack;
    });
    clearDragState();
  }

  function getDragDropPosition(
    event: DragEvent<HTMLElement>,
  ): DragDropPosition {
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerRatio = (event.clientY - bounds.top) / bounds.height;
    return pointerRatio <= 0.5 ? "before" : "after";
  }

  function startDraggingSection(
    event: DragEvent<HTMLElement>,
    sectionId: string,
  ) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", sectionId);
    setDraggedSectionId(sectionId);
    setDragOverSectionId(null);
    setDragDropPosition(null);
  }

  function updateSectionPadding(
    sectionId: string,
    edge: "top" | "bottom",
    reduce: boolean,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId
          ? edge === "top"
            ? { ...section, reduceTopPadding: reduce }
            : { ...section, reduceBottomPadding: reduce }
          : section,
      ),
    );
  }

  function updateSectionColorRecipe(
    sectionId: string,
    colorRecipe: SectionColorRecipe,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId ? { ...section, colorRecipe } : section,
      ),
    );
  }

  function updateSectionJoinAbove(sectionId: string, joinAbove: string) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId ? { ...section, joinAbove } : section,
      ),
    );
  }

  function updateSectionBackgroundTreatment(
    sectionId: string,
    backgroundTreatment: string,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId ? { ...section, backgroundTreatment } : section,
      ),
    );
  }

  function updateSectionCardBorder(
    sectionId: string,
    cardBorder: SectionCardBorder,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId ? { ...section, cardBorder } : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateSectionCardFill(sectionId: string, cardFill: SectionCardFill) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId ? { ...section, cardFill } : section,
      ),
    );
  }

  function updateSectionBackgroundFill(
    sectionId: string,
    backgroundFill: SectionBackgroundFill,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId ? { ...section, backgroundFill } : section,
      ),
    );
  }

  function updateProcessStepsBranchingAlign(
    sectionId: string,
    align: ProcessStepsBranchingAlign,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId &&
        section.component === processStepsBranchingComponent
          ? { ...section, align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateDecisionSplitDecisionLargeAlign(
    sectionId: string,
    align: DecisionSplitDecisionLargeAlign,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isDecisionSplitDecisionLargeSection(section)
          ? { ...section, variant: align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateSectionIcons(sectionId: string, icons: SectionIcons) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && sectionSupportsIcons(section.component)
          ? { ...section, icons }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateSectionHeadlineWrap(
    sectionId: string,
    headlineWrap: SectionHeadlineWrap,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId &&
        sectionSupportsHeadlineWrap(section.component)
          ? { ...section, headlineWrap }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateCardLinks(sectionId: string, cardLinks: "on" | "off") {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && sectionSupportsCardLinks(section.component)
          ? { ...section, cardLinks }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateCTAImageAlign(sectionId: string, align: CTAImageAlign) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId &&
        section.component === ctaImageSectionComponent
          ? { ...section, variant: align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateFeaturedOfferAlign(
    sectionId: string,
    align: FeaturedOfferAlign,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId &&
        section.component === featuredOfferSectionComponent
          ? { ...section, variant: align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateMainIdeaGridAlign(
    sectionId: string,
    align: ContentMainIdeaGridAlign,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && section.component === contentMainIdeaGridComponent
          ? { ...section, variant: align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateFeatureAsymmetricCardsAlign(
    sectionId: string,
    align: FeatureAsymmetricCardsAlign,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId &&
        section.component === featureAsymmetricCardsComponent
          ? { ...section, variant: align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateNarrativeFeatureRail(
    sectionId: string,
    nextValue: Partial<{
      align: ContentNarrativeFeatureRailAlign;
      showImage: boolean;
    }>,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) => {
        if (
          section.id !== sectionId ||
          section.component !== contentNarrativeFeatureRailComponent
        ) {
          return section;
        }

        const align = nextValue.align ?? getNarrativeFeatureRailAlign(section);
        const showImage =
          nextValue.showImage ?? getNarrativeFeatureRailShowImage(section);

        return {
          ...section,
          variant: `${align}${showImage ? "" : "-text-only"}`,
        };
      }),
    );
    setSelectedSectionId(sectionId);
  }

  function updateContentCardTwoUpAlign(
    sectionId: string,
    align: ContentCardTwoUpAlign,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && section.component === contentCardTwoUpComponent
          ? { ...section, variant: align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateFAQAccordionSidebarAlign(
    sectionId: string,
    align: FAQAccordionSidebarAlign,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && section.component === faqAccordionSidebarComponent
          ? { ...section, variant: align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateProjectCaseStudyGalleryAlign(
    sectionId: string,
    align: ProjectCaseStudyGalleryAlign,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && section.component === projectCaseStudyGalleryComponent
          ? { ...section, variant: align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateServiceNeedsPriorityGrid(
    sectionId: string,
    nextValue: Partial<{
      align: ServiceNeedsPriorityGridAlign;
      compactPriorityCard: boolean;
    }>,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) => {
        if (section.id !== sectionId || !isServiceNeedsPriorityGridSection(section)) {
          return section;
        }

        const align = nextValue.align ?? getServiceNeedsPriorityGridAlign(section);
        const compactPriorityCard =
          nextValue.compactPriorityCard ??
          getServiceNeedsPriorityGridCompactPriorityCard(section);

        return {
          ...section,
          variant: `${align}${compactPriorityCard ? "-compact" : ""}`,
        };
      }),
    );
    setSelectedSectionId(sectionId);
  }

  function updateStickyCardStreamImage(sectionId: string, showImage: boolean) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId &&
        section.component === contentStickyCardStreamComponent
          ? { ...section, variant: showImage ? "with-images" : "text-only" }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function deleteSection(sectionId: string) {
    updateActiveStack((stack) =>
      stack.filter((section) => section.id !== sectionId),
    );

    if (sectionId === selectedSectionId) {
      setSelectedSectionId(null);
    }
  }

  // Clearing drops every included section at once and there is no undo, so
  // both entry points open the confirm rather than firing directly.
  function requestClearBuildingSpace() {
    setIsClearConfirmOpen(true);
  }

  function confirmClearBuildingSpace() {
    setIsClearConfirmOpen(false);
    clearActiveBuildingSpace();
  }

  function clearActiveBuildingSpace() {
    updateActiveStack((stack) =>
      stack.map((section) => ({
        ...section,
        included: false,
      })),
    );
    setDraggedSectionId(null);
    setDragOverSectionId(null);
    setSelectedSectionId(null);
    setOptionSaveError("");
    setOptionSaveStatus("Page template cleared.");
  }

  function swapSection(sectionId: string, component: string) {
    const nextOption = sectionSwapOptions.find(
      (option) => option.component === component,
    );
    const currentSection = activeStack.find((section) => section.id === sectionId);

    if (!currentSection || !nextOption || nextOption.mode !== currentSection.mode) {
      return;
    }

    if (currentSection.mode === "Navigation") {
      const nextLayoutSlots = layoutSlots.map((recipeSlots) =>
        recipeSlots.map((slot) => ({
          ...slot,
          stack: slot.stack.map((section) =>
            section.mode === "Navigation"
              ? {
                  ...updateSectionFromSwapOption(section, nextOption),
                  included: currentSection.included,
                }
              : section,
          ),
        })),
      );

      setLayoutSlots(nextLayoutSlots);
      void saveSharedNavigationOptions(nextLayoutSlots);
      setSelectedSectionId(sectionId);
      return;
    }

    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId
          ? updateSectionFromSwapOption(section, nextOption)
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateSplitContentImageVariant(
    sectionId: string,
    variant: SplitContentImageVariant,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && usesFullImageSplitVariants(section)
          ? {
              ...section,
              variant,
            }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateFixedRatioSplitVariant(
    sectionId: string,
    variant: FixedRatioSplitVariant,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) => {
        if (section.id !== sectionId || !isAnyFixedRatioSplitSection(section)) {
          return section;
        }

        // Preserve ContentSplitFixedImageSectionV3's heading-size suffix (if
        // any) across a layout change instead of silently resetting it.
        const sizeSuffix = section.variant?.match(/-size-(up|down)$/)?.[0] ?? "";

        return { ...section, variant: `${variant}${sizeSuffix}` };
      }),
    );
    setSelectedSectionId(sectionId);
  }

  function updateContentSplitFixedImageHeadingSizeStep(
    sectionId: string,
    step: ContentSplitFixedImageHeadingSizeStep,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) => {
        if (
          section.id !== sectionId ||
          section.component !== contentFixedRatioSplitComponent
        ) {
          return section;
        }

        const baseVariant =
          getContentSplitFixedImageVariant(section) ??
          fixedRatioSplitVariantOptions[0].value;
        const suffix =
          step === 1 ? "-size-up" : step === -1 ? "-size-down" : "";

        return { ...section, variant: `${baseVariant}${suffix}` };
      }),
    );
    setSelectedSectionId(sectionId);
  }

  function updateHeroCompactAlign(
    sectionId: string,
    align: HeroCompactAlign,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) => {
        if (
          section.id !== sectionId ||
          !isCompactHeaderAlignmentSection(section)
        ) {
          return section;
        }

        return {
          ...section,
          variant: `${align}-${getCompactHeaderHeadingSize(section)}`,
        };
      }),
    );
    setSelectedSectionId(sectionId);
  }

  function updateContentThreeColumnMixedAlign(
    sectionId: string,
    align: ContentThreeColumnMixedAlign,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isContentThreeColumnMixedSection(section)
          ? { ...section, variant: align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateHeroCompactServiceAlign(
    sectionId: string,
    align: HeroCompactAlign,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isHeroCompactServiceSection(section)
          ? { ...section, variant: align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateCompactHeaderHeadingSize(
    sectionId: string,
    headingSize: HeroCompactHeadingSize,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isCompactHeaderAlignmentSection(section)
          ? {
              ...section,
              variant: `${getHeroCompactAlign(section)}-${headingSize}`,
            }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateLargeSectionHeader(
    sectionId: string,
    nextValue: Partial<{
      align: HeroCompactAlign;
      size: LargeSectionHeaderSize;
    }>,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) => {
        if (section.id !== sectionId || !isLargeSectionHeaderSection(section)) {
          return section;
        }

        const align = nextValue.align ?? getLargeSectionHeaderAlign(section);
        const size = nextValue.size ?? getLargeSectionHeaderSize(section);

        return { ...section, variant: `${align}-${size}` };
      }),
    );
    setSelectedSectionId(sectionId);
  }

  function updateServicesBentoVariant(
    sectionId: string,
    variant: ServicesBentoVariantOption,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isServicesBentoSection(section)
          ? {
              ...section,
              variant,
            }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateCalloutSplitPanelVariant(
    sectionId: string,
    variant: CalloutSplitPanelVariant,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isServiceCalloutSplitPanelSection(section)
          ? { ...section, variant }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateCardLinkGridAlign(sectionId: string, align: CardLinkGridAlign) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId &&
        sectionSupportsCardLinkGridAlign(section.component)
          ? { ...section, align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateTableCompareAlign(sectionId: string, align: TableCompareAlign) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId &&
        sectionSupportsTableCompareAlign(section.component)
          ? { ...section, align }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateCalloutRevealGridVariant(
    sectionId: string,
    variant: CalloutRevealGridVariant,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isServiceCalloutRevealGridSection(section)
          ? { ...section, variant }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateCardLinkGridVariant(
    sectionId: string,
    variant: ThreeCardLinkGridVariant,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isCardLinkGridSection(section)
          ? { ...section, variant }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateFixedCoverFadeFormMode(
    sectionId: string,
    formMode: "modal-prefill" | "regular",
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId &&
        section.component === contentFixedCoverFadeComponent
          ? { ...section, variant: formMode === "regular" ? undefined : formMode }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateSplitBentoVariant(
    sectionId: string,
    variant: SplitBentoVariant,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isSplitBentoSection(section)
          ? { ...section, variant }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateFixedRatioSplitRatio(
    sectionId: string,
    ratio: FixedRatioSplitRatio,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isAnyFixedRatioSplitSection(section)
          ? {
              ...section,
              ratio,
            }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function addSection(component: string) {
    const nextOption = sectionSwapOptions.find(
      (option) => option.component === component,
    );

    if (!nextOption) {
      return;
    }

    addedSectionIdCounterRef.current += 1;
    const nextSectionId = createUniqueSectionId(
      `${activeRecipe.id}-${nextOption.component}-added-${addedSectionIdCounterRef.current}`,
      new Set(activeStack.map((section) => section.id)),
    );

    const nextSection: WorkingSection = {
      component: nextOption.component,
      id: nextSectionId,
      included: true,
      instruction: nextOption.instruction,
      mode: nextOption.mode,
      name: nextOption.name,
      originalComponent: nextOption.component,
      originalIndex: -1,
      ratio:
        nextOption.component === fixedRatioSplitComponent ||
        nextOption.component === contentFixedRatioSplitComponent
          ? fixedRatioSplitRatioOptions[0].value
          : undefined,
      variant:
        fullImageSplitComponents.has(nextOption.component)
          ? splitContentImageVariantOptions[0].value
          : nextOption.component === fixedRatioSplitComponent
            ? fixedRatioSplitVariantOptions[0].value
            : nextOption.component === splitBentoComponent
              ? splitBentoVariantOptions[0].value
            : nextOption.component === contentFixedRatioSplitComponent
              ? fixedRatioSplitVariantOptions[0].value
              : nextOption.component === heroCompactComponent ||
                  nextOption.component === sectionHeaderCompactComponent
                ? sectionLibraryV3Content.heroCompact.align
                : nextOption.component === sectionHeaderLargeComponent
                  ? "center-display-xl"
                : nextOption.component === servicesBentoComponent
                  ? servicesBentoVariantOptions[0].value
                : nextOption.component === serviceCalloutSplitPanelComponent
                  ? calloutSplitPanelVariantOptions[0].value
                : nextOption.component === serviceCalloutRevealGridComponent
                  ? calloutRevealGridVariantOptions[0].value
                : nextOption.component === fourCardLinkGridComponent
                  ? fourCardLinkGridVariantOptions[0].value
                  : nextOption.component === threeCardLinkGridComponent ||
                      nextOption.component === serviceNeedsPriorityGridComponent
                    ? fourCardLinkGridVariantOptions[0].value
                : undefined,
    };

    updateActiveStack((stack) => {
      const selectedIndex = selectedSection
        ? stack.findIndex((section) => section.id === selectedSection.id)
        : -1;
      const insertIndex = selectedIndex >= 0 ? selectedIndex + 1 : stack.length;
      const nextStack = [...stack];

      nextStack.splice(insertIndex, 0, nextSection);
      return nextStack;
    });
    setSelectedSectionId(nextSection.id);
    setRecentlyAddedSection(component);

    if (addedSectionFeedbackTimeoutRef.current) {
      clearTimeout(addedSectionFeedbackTimeoutRef.current);
    }

    addedSectionFeedbackTimeoutRef.current = setTimeout(() => {
      setRecentlyAddedSection(null);
      addedSectionFeedbackTimeoutRef.current = null;
    }, 1800);
  }

  async function copyPageInstruction() {
    await navigator.clipboard.writeText(pageInstruction);
  }

  async function copyAllLayoutInstructions() {
    await navigator.clipboard.writeText(allLayoutInstructions);
  }

  function buildActiveOptionSaveRequest(): SavePagebuilderOptionRequest {
    return buildOptionSaveRequest(
      activeRecipe,
      activeLayoutSlot,
      activeLayoutSlotIndex,
    );
  }

  async function postPagebuilderOption(
    payload: SavePagebuilderOptionRequest,
  ) {
    const response = await fetch("/api/pagebuilder-options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as SavedPagebuilderOptionResponse;

    if (!response.ok || !result.ok) {
      throw new Error(
        result.ok ? "Pagebuilder layout save failed." : result.error,
      );
    }

    return result.option;
  }

  function rememberOptionSaveSignature(payload: SavePagebuilderOptionRequest) {
    autosaveSignaturesRef.current.set(
      getOptionSignatureKey(payload),
      getOptionSignature(payload),
    );
  }

  async function saveSharedNavigationOptions(nextSlots: PageLayoutSlot[][]) {
    if (!savedOptionsLoaded) {
      return;
    }

    const payloads = recipes.flatMap((recipe, recipeIndex) => {
      const slotIndex = activeLayoutSlotIndexes[recipeIndex] ?? 0;
      const slot = nextSlots[recipeIndex]?.[slotIndex] ?? nextSlots[recipeIndex]?.[0];

      return slot ? [buildOptionSaveRequest(recipe, slot, slotIndex)] : [];
    });

    if (payloads.length === 0) {
      return;
    }

    setOptionSaveError("");
    setOptionSaveStatus("Saving shared navigation...");

    try {
      await Promise.all(payloads.map((payload) => postPagebuilderOption(payload)));
      payloads.forEach(rememberOptionSaveSignature);
      setOptionSaveStatus(
        `Navigation applied to ${payloads.length} page layouts.`,
      );
    } catch (error) {
      setOptionSaveError(
        error instanceof Error
          ? error.message
          : "Shared navigation save failed.",
      );
    }
  }

  async function saveActiveOption() {
    setIsSavingOption(true);
    setOptionSaveError("");
    setOptionSaveStatus("");

    try {
      const payload = buildActiveOptionSaveRequest();
      const option = await postPagebuilderOption(payload);
      rememberOptionSaveSignature(payload);

      setOptionSaveStatus(
        `Saved ${activePageLabel} layout with ${option.sectionCount} included sections.`,
      );
    } catch (error) {
      setOptionSaveError(
        error instanceof Error ? error.message : "Pagebuilder layout save failed.",
      );
    } finally {
      setIsSavingOption(false);
    }
  }

  function openTemplateModal() {
    const defaultName = `${activePageLabel} Template`;

    setTemplateName(defaultName);
    setTemplateSlug(slugifyTemplateName(defaultName));
    setTemplateNotes("");
    setTemplateStatus("");
    setTemplateError("");
    setIsTemplateModalOpen(true);
  }

  function closeTemplateModal() {
    if (isPromotingTemplate) {
      return;
    }

    setIsTemplateModalOpen(false);
    setTemplateError("");
  }

  async function promoteActiveOptionToTemplate() {
    if (includedSections.length === 0) {
      setTemplateError("Templates need at least one included section.");
      return;
    }

    setIsPromotingTemplate(true);
    setTemplateError("");
    setTemplateStatus("");

    try {
      const response = await fetch("/api/page-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designStyle: activeDesignStyle,
          id: templateSlug,
          name: templateName,
          notes: templateNotes,
          pageType: activeRecipe.name,
          sections: includedSections.map((section) => ({
            component: section.component,
            instruction: section.instruction,
            mode: section.mode,
            name: section.name,
            originalComponent: section.originalComponent,
            originalIndex: section.originalIndex,
            reduceBottomPadding: section.reduceBottomPadding ?? false,
            reduceTopPadding: section.reduceTopPadding ?? false,
            colorRecipe: getSectionColorRecipe(section),
            backgroundFill: getSectionBackgroundFill(section),
            cardFill: getSectionCardFill(section),
            cardBorder: getSectionCardBorder(section),
            align: section.align,
            ratio: section.ratio,
            slotId: section.slotId,
            variant: section.variant,
          })),
          sourceOptionName: activeSlotLabel,
          sourceRecipeId: activeRecipe.id,
          sourceRecipeName: activeRecipe.name,
        }),
      });
      const result = (await response.json()) as TemplatePromotionResponse;

      if (!response.ok || !result.ok) {
        setTemplateError(result.ok ? "Template promotion failed." : result.error);
        return;
      }

      setTemplateStatus(
        `Promoted ${result.template.name} with ${result.template.sectionCount} sections.`,
      );
      setSavedPageTemplates(result.templates);
      setIsTemplateModalOpen(false);
    } catch {
      setTemplateError("Template promotion failed.");
    } finally {
      setIsPromotingTemplate(false);
    }
  }

  function refreshPreviewStyles() {
    setPreviewVariableStyle(readPagebuilderPreviewVariables());
    setPreviewRefreshKey((currentKey) => currentKey + 1);
  }

  function renderPreviewWindow() {
    function renderSectionFrame(
      section: WorkingSection,
      options: {
        className?: string;
        /** Member of a background band - the band paints, this frame does not.
         *  See `TemplateSectionFrame` in `PageTemplatePreview` for why the
         *  recipe has to go inert rather than stay set. */
        inBand?: boolean;
        isOverlay?: boolean;
      } = {},
    ) {
      const isSelected = section.id === selectedSectionId;
      const sectionIndex = includedSections.findIndex(
        (includedSection) => includedSection.id === section.id,
      );
      const headingLevel = sectionIndex === 1 ? 1 : 2;
      const renderedSectionPreview = isHeroServiceAreaZipLookupSection(section) ? (
          <HeroServiceAreaZipLookupSectionV3
            {...sectionLibraryV3Content.heroServiceAreaZipLookup}
            colorRecipe={getSectionColorRecipe(section)}
            headingLevel={headingLevel}
            variant={
              (section.variant ??
                splitContentImageVariantOptions[0]
                  .value) as HeroServiceAreaZipLookupVariant
            }
          />
        ) : isSplitContentImageSection(section) ? (
          <HeroSplitFullHeightSectionV3
            {...sectionLibraryV3Content.heroSplitFullHeight}
            colorRecipe={getSectionColorRecipe(section)}
            headingLevel={headingLevel}
            variant={
              (section.variant ??
                splitContentImageVariantOptions[0]
                  .value) as HeroSplitFullHeightVariant
            }
          />
        ) : isContentFullImageSplitSection(section) ? (
          <ContentSplitFullImageSectionV3
            {...sectionLibraryV3Content.contentSplitFullImage}
            colorRecipe={getSectionColorRecipe(section)}
            variant={
              (section.variant ??
                splitContentImageVariantOptions[0]
                  .value) as ContentSplitFullImageVariant
            }
          />
        ) : isFixedRatioSplitSection(section) ? (
          <HeroSplitFixedImageSectionV3
            {...sectionLibraryV3Content.heroSplitFullHeight}
            colorRecipe={getSectionColorRecipe(section)}
            headingLevel={headingLevel}
            ratio={
              (section.ratio ??
                fixedRatioSplitRatioOptions[0].value) as HeroSplitFixedImageRatio
            }
            variant={
              (section.variant ??
                fixedRatioSplitVariantOptions[0]
                  .value) as HeroSplitFixedImageVariant
            }
          />
        ) : isSplitBentoSection(section) ? (
          <HeroSplitBentoSectionV3
            {...sectionLibraryV3Content.heroSplitFullHeight}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            colorRecipe={getSectionColorRecipe(section)}
            headingLevel={headingLevel}
            variant={
              (section.variant ??
                splitBentoVariantOptions[0].value) as HeroSplitBentoVariant
            }
          />
        ) : isContentFixedRatioSplitSection(section) ? (
          <ContentSplitFixedImageSectionV3
            {...sectionLibraryV3Content.contentSplitFixedImage}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            colorRecipe={getSectionColorRecipe(section)}
            headingLevel={headingLevel}
            headingSizeStep={getContentSplitFixedImageHeadingSizeStep(section)}
            ratio={
              (section.ratio ??
                fixedRatioSplitRatioOptions[0]
                  .value) as ContentSplitFixedImageRatio
            }
            variant={
              (getContentSplitFixedImageVariant(section) ??
                fixedRatioSplitVariantOptions[0]
                  .value) as ContentSplitFixedImageVariant
            }
          />
        ) : isHeroCompactSection(section) ? (
          <HeroCompactSectionV3
            {...sectionLibraryV3Content.heroCompact}
            align={getHeroCompactAlign(section)}
            colorRecipe={getSectionColorRecipe(section)}
            headingSize={getCompactHeaderHeadingSize(section)}
            headingLevel={headingLevel}
          />
        ) : section.component === heroServicesComponent ? (
          <HeroServicesSectionV3
            {...sectionLibraryV3Content.heroServices}
            headingLevel={headingLevel}
          />
        ) : section.component === heroCompactServiceComponent ? (
          <HeroCompactServiceSectionV3
            {...sectionLibraryV3Content.heroCompactService}
            align={getHeroCompactServiceAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            headingLevel={headingLevel}
          />
        ) : section.component === sectionHeaderCompactComponent ? (
          <SectionHeaderCompactSectionV3
            {...sectionLibraryV3Content.sectionHeaderCompact}
            align={getHeroCompactAlign(section)}
            headingSize={getCompactHeaderHeadingSize(section)}
            headingLevel={2}
          />
        ) : section.component === sectionHeaderLargeComponent ? (
          <SectionHeaderLargeSectionV3
            {...sectionLibraryV3Content.sectionHeaderLarge}
            align={getLargeSectionHeaderAlign(section)}
            headingLevel={2}
            headlineWrap={getSectionHeadlineWrap(section)}
            size={getLargeSectionHeaderSize(section)}
          />
        ) : section.component === contentSplitHeadlineImageComponent ? (
          <ContentSplitHeadlineImageSectionV2
            {...sectionLibraryV3Content.contentSplitHeadlineImage}
            colorRecipe={getSectionColorRecipe(section)}
          />
        ) : section.component === contentMainIdeaGridComponent ? (
          <ContentMainIdeaGridSectionV3
            {...sectionLibraryV3Content.contentMainIdeaGrid}
            align={getMainIdeaGridAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            colorRecipe={getSectionColorRecipe(section)}
          />
        ) : section.component === contentNarrativeFeatureRailComponent ? (
          <ContentNarrativeFeatureRailSectionV3
            {...sectionLibraryV3Content.contentNarrativeFeatureRail}
            align={getNarrativeFeatureRailAlign(section)}
            showImage={getNarrativeFeatureRailShowImage(section)}
          />
        ) : section.component === contentCardTwoUpComponent ? (
          <ContentCardTwoUpSectionV3
            {...sectionLibraryV3Content.contentCardTwoUp}
            align={getContentCardTwoUpAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
          />
        ) : section.component === contentThreeColumnMixedComponent ? (
          <ContentThreeColumnMixedSectionV3
            {...sectionLibraryV3Content.contentThreeColumnMixed}
            align={getContentThreeColumnMixedAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
          />
        ) : section.component === faqAccordionSidebarComponent ? (
          <FAQAccordionSidebarSectionV3
            {...sectionLibraryV3Content.faqAccordionSidebar}
            align={getFAQAccordionSidebarAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
          />
        ) : section.component === ctaSectionComponent ? (
          <CTASectionV3
            {...sectionLibraryV3Content.cta}
            colorRecipe={getSectionColorRecipe(section)}
          />
        ) : section.component === ctaImageSectionComponent ? (
          <CTAImageSectionV3
            {...sectionLibraryV3Content.ctaImage}
            align={getCTAImageAlign(section)}
            colorRecipe={getSectionColorRecipe(section)}
          />
        ) : section.component === featuredOfferSectionComponent ? (
          <FeaturedOfferSectionV3
            {...sectionLibraryV3Content.featuredOffer}
            align={getFeaturedOfferAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            icons={getSectionIcons(section)}
          />
        ) : section.component === ctaMutedSectionComponent ? (
          <CTAMutedSectionV3
            {...sectionLibraryV3Content.ctaMuted}
            colorRecipe={getSectionColorRecipe(section)}
          />
        ) : section.component === contentFixedCoverFadeComponent ? (
          <ContentFixedCoverFadeSectionV2
            {...sectionLibraryV3Content.contentFixedCoverFade}
            formMode={
              section.variant === "modal-prefill" ? "modal-prefill" : "regular"
            }
          />
        ) : section.component === faqComponent ? (
          <FAQSectionV3
            {...sectionLibraryV3Content.faq}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            colorRecipe={getSectionColorRecipe(section)}
          />
        ) : section.component === projectCaseStudyGalleryComponent ? (
          <ProjectCaseStudyGallerySectionV3
            {...sectionLibraryV3Content.projectCaseStudyGallery}
            align={getProjectCaseStudyGalleryAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            colorRecipe={getSectionColorRecipe(section)}
          />
        ) : isDecisionSplitDecisionLargeSection(section) ? (
          <DecisionSplitDecisionLargeSectionV3
            {...sectionLibraryV3Content.decisionSplitDecisionLarge}
            align={getDecisionSplitDecisionLargeAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            cardLinks={getCardLinks(section)}
          />
        ) : section.component === contentStickyCardStreamComponent ? (
          <ContentStickyCardStreamSectionV2
            {...sectionLibraryV3Content.contentStickyCardStream}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            colorRecipe={getSectionColorRecipe(section)}
            showImage={getStickyCardStreamShowImage(section)}
          />
        ) : isFourCardLinkGridSection(section) ? (
          <FourCardLinkGridSectionV3
            {...sectionLibraryV3Content.fourCardLinkGrid}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            cardLinks={getCardLinks(section)}
            showImages={getFourCardLinkGridVariant(section) === "with-images"}
          />
        ) : isThreeCardLinkGridSection(section) ? (
          <ThreeCardLinkGridSectionV3
            {...sectionLibraryV3Content.threeCardLinkGrid}
            align={getCardLinkGridAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            cardLinks={getCardLinks(section)}
            showImages={getCardLinkGridVariant(section) === "with-images"}
          />
        ) : section.component === decisionQuestionTableComponent ? (
          <DecisionQuestionTableSectionV3
            {...sectionLibraryV3Content.decisionQuestionTable}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
          />
        ) : section.component === decisionMatrixCardComponent ? (
          <DecisionMatrixCardSectionV3
            {...sectionLibraryV3Content.decisionMatrixCard}
            align={getTableCompareAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
          />
        ) : // Named outright rather than "whatever else reads the align axis":
        // that axis is shared by sections this branch does not render, so a
        // capability test here would preview the wrong component.
        section.component === decisionQuestionTableFourComponent ? (
          <DecisionQuestionTableFourSectionV3
            {...sectionLibraryV3Content.decisionQuestionTableFour}
            align={getTableCompareAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
          />
        ) : isServiceCalloutRevealGridSection(section) ? (
          <ServiceCalloutRevealGridSectionV3
            {...sectionLibraryV3Content.serviceCalloutRevealGrid}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            variant={getCalloutRevealGridVariant(section)}
          />
        ) : isServiceCalloutSplitPanelSection(section) ? (
          <ServiceCalloutSplitPanelSectionV3
            {...sectionLibraryV3Content.serviceCalloutSplitPanel}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            variant={getCalloutSplitPanelVariant(section)}
          />
        ) : isServiceNeedsPriorityGridSection(section) ? (
          <ServiceNeedsPriorityGridSectionV3
            {...sectionLibraryV3Content.serviceNeedsPriorityGrid}
            align={getServiceNeedsPriorityGridAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            compactPriorityCard={getServiceNeedsPriorityGridCompactPriorityCard(
              section,
            )}
            cardLinks={getCardLinks(section)}
          />
        ) : isServicesBentoSection(section) ? (
          <ServicesBentoCardsSectionV2
            {...sectionLibraryV3Content.servicesBento}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            colorRecipe={getSectionColorRecipe(section)}
            variant={getServicesBentoVariant(section)}
          />
        ) : section.component === servicesThreeCardsRightComponent ? (
          <ServicesThreeCardsRightSectionV3
            {...sectionLibraryV3Content.servicesThreeCardsRight}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
          />
        ) : section.component === servicesScrollCardsComponent ? (
          <ServicesScrollCardsSectionV2
            {...sectionLibraryV3Content.servicesScrollCards}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
          />
        ) : section.component === contentHorizontalCardCarouselComponent ? (
          <ContentHorizontalCardCarouselSectionV2
            {...sectionLibraryV3Content.contentHorizontalCardCarousel}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
          />
        ) : section.component === decisionSplitLargeCardsComponent ? (
          <DecisionSplitLargeCardsSectionV3
            {...sectionLibraryV3Content.decisionSplitLargeCards}
            align={getTableCompareAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            cardLinks={getCardLinks(section)}
            icons={getSectionIcons(section)}
          />
        ) : section.component === sectionHeaderSplitLinkComponent ? (
          <SectionHeaderSplitLinkSectionV3
            {...sectionLibraryV3Content.sectionHeaderSplitLink}
          />
        ) : section.component === decisionSplitDecisionComponent ? (
          <DecisionSplitDecisionSectionV3
            {...sectionLibraryV3Content.decisionSplitDecision}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
            cardLinks={getCardLinks(section)}
          />
        ) : section.component === processStepsStaggeredComponent ? (
          <ProcessStepsStaggeredSectionV3
            {...sectionLibraryV3Content.processStepsStaggered}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
          />
        ) : section.component === processStepsBranchingComponent ? (
          <ProcessStepsBranchingSectionV3
            {...sectionLibraryV3Content.processStepsBranching}
            align={getProcessStepsBranchingAlign(section)}
            cardBorder={getSectionCardBorder(section)}
            cardFill={getSectionCardFill(section)}
          />
        ) : (
          // Everything without a hand-written branch above renders through the
          // shared library renderer, given the *live* section so its toggles
          // apply. The branches above remain only for axes the toggle helper
          // does not cover - variant, heading level, colour recipe.
          renderLibrarySection(section, sectionIndex)
        );

      return (
        <div
          className={cx(
            "pagebuilder-section-frame pagebuilder-paint-surface group/pagebuilder-section cursor-pointer outline outline-0 outline-offset-0 transition-shadow",
            options.isOverlay ? "absolute" : "relative",
            options.isOverlay && "pointer-events-none",
            options.className,
            isSelected &&
              "z-10 shadow-[0_0_0_3px_var(--color-service-accent)]",
          )}
          data-pagebuilder-section-id={section.id}
          data-pagebuilder-section-component={section.component}
          data-pagebuilder-section-mode={section.mode}
          data-pagebuilder-background-fill={
            options.inBand ? "none" : getSectionBackgroundFill(section)
          }
          data-pagebuilder-card-border={getSectionCardBorder(section)}
          data-pagebuilder-card-fill={getSectionCardFill(section)}
          data-pagebuilder-card-style={
            sectionSupportsCardStyle(section.component) ? "true" : "false"
          }
          data-pagebuilder-background-treatment={
            options.inBand
              ? "none"
              : resolveBackgroundTreatment(section.backgroundTreatment)
          }
          data-pagebuilder-color-recipe={
            options.inBand ? "inherit" : getSectionColorRecipe(section)
          }
          data-pagebuilder-padding-top={
            section.reduceTopPadding && sectionSupportsSectionSpacing(section.component)
              ? "none"
              : "default"
          }
          data-pagebuilder-padding-bottom={
            section.reduceBottomPadding &&
            sectionSupportsSectionSpacing(section.component)
              ? "none"
              : "default"
          }
          key={section.id}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setSelectedSectionId(section.id);
          }}
        >
          {renderedSectionPreview}
          <button
            aria-label={`Delete ${getSectionDisplayLabel(section)}`}
            className="absolute right-2 top-2 z-20 grid size-8 place-items-center rounded-md border border-service-border bg-white text-red-600 opacity-0 shadow-service transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              deleteSection(section.id);
            }}
            type="button"
          >
            <TrashIcon />
          </button>
        </div>
      );
    }

    return (
      <PagebuilderPreviewWindow
        activePageLabel={activePageLabel}
        contentClassName={selectedViewport.contentClassName}
        frameClassName={selectedViewport.frameClassName}
        key={`${activeRecipe.id}-${activeLayoutSlotIndex}-${selectedViewport.id}-${previewRefreshKey}`}
        previewStyle={previewVariableStyle}
        responsiveClassName={getPreviewResponsiveClassName(selectedViewport.id)}
        screenClassName={selectedViewport.screenClassName}
        showSectionMarkers={activeDesignStyle.showSectionMarkers}
        sizeLabel={selectedViewport.sizeLabel}
        spacingClassName={normalSpacingClassName}
      >
        {groupSectionsIntoBands(includedSections).map((band, bandIndex, allBands) => {
          const [first] = band.sections;
          const nextBand = allBands[bandIndex + 1];
          const previousBand = allBands[bandIndex - 1];
          const isNavigationBand = (
            candidate: (typeof allBands)[number] | undefined,
          ) =>
            Boolean(
              candidate &&
                candidate.sections.length === 1 &&
                isPreviewNavigationSection(candidate.sections[0]),
            );

          // A run of one is the common case and renders as a bare frame, so a
          // page using no bands emits the same DOM it did before bands existed.
          const renderBand = () =>
            band.isBand ? (
              <div
                className="pagebuilder-section-band pagebuilder-paint-surface"
                data-pagebuilder-background-treatment={resolveBackgroundTreatment(
                  first.backgroundTreatment,
                )}
                data-pagebuilder-color-recipe={getSectionColorRecipe(first)}
                key={`band-${first.id}`}
              >
                {withBandRecipe(band).map((section) =>
                  renderSectionFrame(section, { inBand: true }),
                )}
              </div>
            ) : (
              renderSectionFrame(first)
            );

          // Navigation never joins a band, so a nav run is always one section.
          // That is what lets this wrapper hold the nav beside a whole run
          // without two wrappers competing for the same element.
          if (isNavigationBand(band) && nextBand && isPreviewHeroSection(nextBand.sections[0])) {
            return (
              <div
                // The nav is positioned absolutely against this wrapper, so the
                // wrapper's top padding is the band it sits in. Reserving
                // --section-space-sml here reserved 4rem for a taller nav,
                // which is why it overhung the hero.
                className="pagebuilder-nav-hero-pair relative pt-[var(--nav-height)]"
                key={`${first.id}-pair`}
              >
                {renderSectionFrame(first, {
                  className: "inset-x-0 top-0 z-20",
                  isOverlay: true,
                })}
                {nextBand.isBand ? (
                  <div
                    className="pagebuilder-section-band pagebuilder-paint-surface"
                    data-pagebuilder-background-treatment={resolveBackgroundTreatment(
                      nextBand.sections[0].backgroundTreatment,
                    )}
                    data-pagebuilder-color-recipe={getSectionColorRecipe(
                      nextBand.sections[0],
                    )}
                  >
                    {withBandRecipe(nextBand).map((section) =>
                      renderSectionFrame(section, { inBand: true }),
                    )}
                  </div>
                ) : (
                  renderSectionFrame(nextBand.sections[0])
                )}
              </div>
            );
          }

          if (isNavigationBand(previousBand) && isPreviewHeroSection(first)) {
            return null;
          }

          if (isNavigationBand(band) && nextBand) {
            return renderSectionFrame(first, {
              className: "mb-[var(--section-space-sml)]",
            });
          }

          return renderBand();
        })}
      </PagebuilderPreviewWindow>
    );
  }

  return (
    <section className="token-chrome h-svh overflow-hidden max-lg:h-auto max-lg:min-h-svh max-lg:overflow-visible">
      <div className="h-full w-full px-4 py-4 max-md:px-3">
        <div className="grid h-full min-h-0 grid-cols-[22rem_minmax(0,1fr)] items-stretch gap-5 max-lg:h-auto max-lg:grid-cols-1">
          <aside className="grid h-full min-h-0 content-start gap-4 overflow-y-auto overscroll-contain pb-10 pr-1 max-lg:h-auto max-lg:overflow-visible max-lg:pb-0 max-lg:pr-0">
            <div className="token-chrome-panel order-1 rounded-[var(--chrome-radius-panel)] border p-4">
              <h1 className="text-3xl font-semibold leading-none tracking-normal">
                Page Builder
              </h1>
              <p className="token-chrome-muted wrap-pretty mt-3 text-sm font-semibold leading-6">
                Choose, swap, reorder, and preview page sections while the
                implementation brief updates with the live stack.
              </p>
            </div>

            <details
              className="token-chrome-panel group/page-layouts order-2 rounded-[var(--chrome-radius-panel)] border p-5"
              onToggle={(event) => {
                const isOpen = event.currentTarget.open;

                setOpenSidebarPanel((currentPanel) =>
                  isOpen
                    ? "page-layouts"
                    : currentPanel === "page-layouts"
                      ? null
                      : currentPanel,
                );
              }}
              open={
                isSidebarStateHydrated
                  ? openSidebarPanel === "page-layouts"
                  : undefined
              }
              suppressHydrationWarning
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:hidden">
                <span className="text-2xl font-semibold leading-tight">
                  Page Layouts
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="token-chrome-muted type-caption font-semibold">
                    <span className="group-open/page-layouts:hidden">Closed</span>
                    <span className="hidden group-open/page-layouts:inline">Open</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="token-chrome-badge flex size-8 shrink-0 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-transform group-open/page-layouts:rotate-180"
                  >
                    <DownArrowIcon className="size-4" />
                  </span>
                </span>
              </summary>
              <div className="mt-4 grid gap-3" role="list">
                {recipes.map((recipe) => {
                  const isActive = recipe.id === activeRecipe.id;

                  return (
                    <div className="grid gap-2" key={recipe.id}>
                      <button
                        aria-current={isActive ? "page" : undefined}
                        className={cx(
                          "min-h-11 rounded-[var(--chrome-radius-control)] border px-3 text-left type-text-sm font-semibold transition-colors",
                          isActive
                            ? "token-chrome-card-active"
                            : "token-chrome-card",
                        )}
                        onClick={() => selectRecipe(recipe.id)}
                        type="button"
                      >
                        <span>{recipe.name}</span>
                      </button>

                      {isActive ? (
                        <div className="grid gap-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="token-chrome-primary min-h-9 rounded-[var(--chrome-radius-control)] border px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={isSavingOption}
                              onClick={() => void saveActiveOption()}
                              type="button"
                            >
                              {isSavingOption ? "Saving..." : "Save Layout"}
                            </button>
                            <button
                              className="token-chrome-control min-h-9 rounded-[var(--chrome-radius-control)] border px-2.5 text-xs font-semibold transition-colors"
                              onClick={openTemplateModal}
                              type="button"
                            >
                              Promote Layout
                            </button>
                            <button
                              aria-label="Clear page template"
                              className="token-chrome-control inline-flex min-h-9 w-9 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                              disabled={includedSections.length === 0}
                              onClick={requestClearBuildingSpace}
                              title="Clear page template"
                              type="button"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                          {optionSaveStatus || optionSaveError ? (
                            <p
                              className={cx(
                                "type-caption rounded-[var(--chrome-radius-control)] border px-3 py-2",
                                optionSaveError
                                  ? "border-red-300/60 bg-red-950/30 text-red-100"
                                  : "token-chrome-badge",
                              )}
                            >
                              {optionSaveError || optionSaveStatus}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </details>

            <details
              className="token-chrome-panel-strong group/sections order-3 rounded-[var(--chrome-radius-panel)] border p-5"
              onToggle={(event) => {
                const isOpen = event.currentTarget.open;

                setOpenSidebarPanel((currentPanel) =>
                  isOpen
                    ? "sections"
                    : currentPanel === "sections"
                      ? null
                      : currentPanel,
                );
              }}
              open={
                isSidebarStateHydrated
                  ? openSidebarPanel === "sections"
                  : undefined
              }
              suppressHydrationWarning
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:hidden">
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-5 w-px bg-[var(--chrome-border-strong)]"
                  />
                  <span className="text-2xl font-semibold leading-tight">
                    Sections
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="token-chrome-muted type-caption font-semibold">
                    <span className="group-open/sections:hidden">Closed</span>
                    <span className="hidden group-open/sections:inline">Open</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="token-chrome-badge flex size-8 shrink-0 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-transform group-open/sections:rotate-180"
                  >
                    <DownArrowIcon className="size-4" />
                  </span>
                </span>
              </summary>
              <div className="mt-4 grid gap-2">
                {includedSections.map((section, index) => {
                  const isActive = section.id === selectedSectionId;
                  const innerOptionSignifier = getInnerOptionSignifier(
                    section.component,
                  );
                  const sectionSwapOptionsForMode = sortSectionSwapOptions(
                    sectionSwapOptions.filter(
                      (option) => option.mode === section.mode,
                    ),
                  );

                  return (
                    <div
                      className={cx(
                        "relative overflow-hidden rounded-[var(--chrome-radius-control)] border transition-colors",
                        isActive
                          ? "token-chrome-card-active"
                          : "token-chrome-card",
                        section.id === draggedSectionId && "opacity-35",
                        section.id === dragOverSectionId &&
                          dragDropPosition !== null &&
                          "border-[var(--chrome-border-strong)]",
                      )}
                      key={section.id}
                      onDragOver={(event) => {
                        event.preventDefault();
                        if (!draggedSectionId || draggedSectionId === section.id) {
                          return;
                        }
                        event.dataTransfer.dropEffect = "move";
                        const nextPosition = getDragDropPosition(event);

                        setDragOverSectionId(section.id);
                        setDragDropPosition(nextPosition);
                      }}
                      onDragLeave={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                          clearDragState();
                        }
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        const dropPosition = getDragDropPosition(event);
                        const droppedSectionId =
                          event.dataTransfer.getData("text/plain") ||
                          draggedSectionId;

                        if (droppedSectionId && dropPosition) {
                          reorderSection(
                            droppedSectionId,
                            section.id,
                            dropPosition,
                          );
                        } else {
                          clearDragState();
                        }
                      }}
                    >
                      {section.id === dragOverSectionId && dragDropPosition ? (
                        <span
                          aria-hidden="true"
                          className={cx(
                            "pointer-events-none absolute left-0 right-0 z-20 h-1 rounded-[var(--chrome-radius-control)] bg-[var(--chrome-accent)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--chrome-accent)_20%,transparent)]",
                            dragDropPosition === "before"
                              ? "top-0"
                              : "bottom-0",
                          )}
                        >
                          <span className="pointer-events-none absolute left-1/2 top-1 z-30 -translate-x-1/2 whitespace-nowrap rounded-[var(--chrome-radius-control)] bg-[var(--chrome-accent)] px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-normal text-white shadow-sm">
                            Move {dragDropPosition}
                          </span>
                        </span>
                      ) : null}
                      <div className="flex min-h-12 items-stretch">
                        <button
                          aria-label={`Drag ${getSectionDisplayLabel(section)} section`}
                          className="flex w-14 shrink-0 cursor-grab items-center justify-center border-r border-current/10 text-[0.65rem] font-semibold uppercase tracking-normal text-current/65 transition-colors hover:bg-[var(--chrome-hover)] active:cursor-grabbing"
                          draggable
                          onDragEnd={() => {
                            clearDragState();
                          }}
                          onDragStart={(event) => {
                            startDraggingSection(event, section.id);
                          }}
                          title="Drag to reorder"
                          type="button"
                        >
                          Drag
                        </button>
                        <button
                          aria-expanded={isActive}
                          className={cx(
                            "flex min-h-12 min-w-0 flex-1 items-start justify-between gap-3 px-3 py-2 text-left transition-colors",
                            !isActive &&
                              "hover:bg-[var(--chrome-hover)]",
                          )}
                          onClick={() =>
                            setSelectedSectionId(isActive ? null : section.id)
                          }
                          type="button"
                        >
                          <span className="min-w-0">
                            <span className="type-caption block font-semibold text-current/70">
                              {index + 1}. {section.mode}
                            </span>
                            <span className="mt-1 block truncate text-sm font-semibold">
                              {getSectionDisplayLabel(section)}
                            </span>
                          </span>
                          <span className="mt-1 flex shrink-0 items-center gap-1.5">
                            <SectionLayoutGridBadge
                              component={section.component}
                              tone="dark"
                            />
                            <span
                              aria-hidden="true"
                              className={cx(
                                "flex size-7 shrink-0 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-transform",
                                isActive
                                  ? "rotate-180 border-[var(--chrome-border-strong)] text-[var(--chrome-accent)]"
                                  : "token-chrome-badge",
                              )}
                            >
                              <DownArrowIcon className="size-3.5" />
                            </span>
                          </span>
                        </button>
                      </div>

                      {isActive ? (
                        <div className="grid gap-4 border-t border-current/10 p-3">
                          <div className="token-chrome-control rounded-[var(--chrome-radius-control)] border p-3">
                            <p className="text-sm font-semibold text-current">
                              {getSectionDisplayLabel(section)}
                            </p>
                            <p className="type-caption mt-1 text-current/60">
                              {section.component}
                            </p>
                            <span className="token-chrome-badge mt-3 inline-flex rounded-[var(--chrome-radius-control)] border px-3 py-1 text-xs font-semibold">
                              {section.mode}
                            </span>
                            {section.component !== section.originalComponent && (
                              <span className="token-chrome-badge ml-2 mt-3 inline-flex rounded-[var(--chrome-radius-control)] border px-3 py-1 text-xs font-semibold">
                                swapped
                              </span>
                            )}
                            {innerOptionSignifier ? (
                              <span className="ml-2 mt-3 inline-flex">
                                <InnerLayoutPill
                                  signifier={innerOptionSignifier}
                                  tone="dark"
                                />
                              </span>
                            ) : null}
                          </div>

                          <label className="grid gap-2">
                            <span className="type-caption font-semibold text-current">
                              Alternate
                            </span>
                            <select
                              className="token-chrome-select min-h-11 rounded-[var(--chrome-radius-control)] border px-3 text-sm font-semibold outline-none"
                              onChange={(event) =>
                                swapSection(section.id, event.target.value)
                              }
                              value={section.component}
                            >
                              {sectionSwapOptionsForMode.map((option) => (
                                <option
                                  key={option.component}
                                  value={option.component}
                                >
                                  {getSectionDisplayLabel(option)}
                                </option>
                              ))}
                            </select>
                            <span className="type-caption text-current/60">
                              Swaps to another section with the same function.
                            </span>
                          </label>

                          {/* Hidden on a joined section. The band paints the
                              ground for its whole run, so a recipe chosen here
                              could never take effect - and an offered control
                              that does nothing is worse than an absent one. */}
                          <fieldset
                            className={cx(
                              "grid gap-2",
                              section.joinAbove === "join" && "hidden",
                            )}
                          >
                            <legend className="type-caption font-semibold text-current">
                              Color recipe
                            </legend>
                            <div className="grid grid-cols-5 gap-2 max-md:grid-cols-2">
                              {sectionColorRecipes.map((recipe) => {
                                const isActive =
                                  getSectionColorRecipe(section) === recipe.id;

                                return (
                                  <button
                                    aria-pressed={isActive}
                                    className={cx(
                                      "min-h-10 rounded-[var(--chrome-radius-control)] border px-2 text-center text-xs font-semibold transition-colors",
                                      isActive
                                        ? "token-chrome-card-active"
                                        : "token-chrome-card",
                                    )}
                                    key={recipe.id}
                                    onClick={() =>
                                      updateSectionColorRecipe(
                                        section.id,
                                        recipe.id,
                                      )
                                    }
                                    type="button"
                                  >
                                    {recipe.label}
                                  </button>
                                );
                              })}
                            </div>
                          </fieldset>

                          {/* Offered on everything but navigation, which cannot
                              join a band - see `navigationComponents`. Hidden on
                              the first section too, since it has nothing above
                              it to join. */}
                          {sectionSupportsJoinAbove(section.component) &&
                          includedSections[0]?.id !== section.id ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Background band
                              </legend>
                              <div className="grid grid-cols-2 gap-2">
                                {styleFieldOptions.joinAbove
                                  .filter((option) => option.value !== "")
                                  .map((option) => {
                                    const optionIsActive =
                                      (section.joinAbove === "join") ===
                                      (option.value === "join");

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-10 rounded-[var(--chrome-radius-control)] border px-2 text-center text-xs font-semibold transition-colors",
                                          optionIsActive
                                            ? "token-chrome-card-active"
                                            : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateSectionJoinAbove(
                                            section.id,
                                            option.value,
                                          )
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  })}
                              </div>
                              <span className="type-caption text-current/70">
                                Joining shares the background of the section
                                above, so an image or gradient can span both.
                              </span>
                            </fieldset>
                          ) : null}

                          {/* On a joined section this control is hidden: the
                              run's first section owns the band's texture, and
                              two stacked layers would double the wash. */}
                          {sectionSupportsBackgroundTreatment(
                            section.component,
                          ) && section.joinAbove !== "join" ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Background texture
                              </legend>
                              <div className="grid grid-cols-3 gap-2 max-md:grid-cols-2">
                                {styleFieldOptions.backgroundTreatment
                                  .filter((option) => option.value !== "")
                                  .map((option) => {
                                    const optionIsActive =
                                      resolveBackgroundTreatment(
                                        section.backgroundTreatment,
                                      ) === option.value;

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-10 rounded-[var(--chrome-radius-control)] border px-2 text-center text-xs font-semibold transition-colors",
                                          optionIsActive
                                            ? "token-chrome-card-active"
                                            : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateSectionBackgroundTreatment(
                                            section.id,
                                            option.value,
                                          )
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  })}
                              </div>
                              {treatmentUsesGroundImage(
                                resolveBackgroundTreatment(
                                  section.backgroundTreatment,
                                ),
                              ) ? (
                                <span className="type-caption text-current/70">
                                  The image itself is set per page, alongside
                                  the section&rsquo;s other assets — the canvas
                                  shows the ground until then.
                                </span>
                              ) : null}
                            </fieldset>
                          ) : null}

                          {section.component ===
                          processStepsBranchingComponent ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Header alignment
                              </legend>
                              <div className="grid grid-cols-2 gap-2">
                                {processStepsBranchingAlignOptions.map(
                                  (option) => {
                                    const optionIsActive =
                                      getProcessStepsBranchingAlign(section) ===
                                      option.value;

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                          optionIsActive
                                            ? "token-chrome-card-active"
                                            : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateProcessStepsBranchingAlign(
                                            section.id,
                                            option.value,
                                          )
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  },
                                )}
                              </div>
                            </fieldset>
                          ) : null}

                          {sectionSupportsBackgroundFill(section.component) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Background
                              </legend>
                              <div className="flex items-center gap-2">
                                {(["solid", "none"] as const).map(
                                  (backgroundFill) => {
                                    const isActive =
                                      getSectionBackgroundFill(section) ===
                                      backgroundFill;
                                    const label =
                                      backgroundFill === "solid"
                                        ? "Background on"
                                        : "Transparent";

                                    return (
                                      <button
                                        aria-pressed={isActive}
                                        className={cx(
                                          "token-chrome-control flex size-14 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors",
                                          isActive && "token-chrome-card-active",
                                        )}
                                        key={backgroundFill}
                                        onClick={() =>
                                          updateSectionBackgroundFill(
                                            section.id,
                                            backgroundFill,
                                          )
                                        }
                                        title={label}
                                        type="button"
                                      >
                                        <CardFillIcon
                                          filled={backgroundFill === "solid"}
                                        />
                                        <span className="sr-only">{label}</span>
                                      </button>
                                    );
                                  },
                                )}
                              </div>
                            </fieldset>
                          ) : null}

                          {sectionSupportsCardFill(section) ? (
                          <div className="grid grid-cols-2 items-start gap-4">
                          <fieldset className="grid gap-2">
                            <legend className="type-caption font-semibold text-current">
                              Card fill
                            </legend>
                            <div className="flex items-center gap-2">
                              {(["solid", "none"] as const).map((cardFill) => {
                                const isActive =
                                  getSectionCardFill(section) === cardFill;
                                const label =
                                  cardFill === "solid" ? "Filled" : "Transparent";

                                return (
                                  <button
                                    aria-pressed={isActive}
                                    className={cx(
                                      "token-chrome-control flex size-14 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors",
                                      isActive && "token-chrome-card-active",
                                    )}
                                    key={cardFill}
                                    onClick={() =>
                                      updateSectionCardFill(section.id, cardFill)
                                    }
                                    title={label}
                                    type="button"
                                  >
                                    <CardFillIcon filled={cardFill === "solid"} />
                                    <span className="sr-only">{label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </fieldset>

                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Card border
                              </legend>
                              <div className="flex items-center gap-2">
                                {(["on", "off"] as const).map((cardBorder) => {
                                  const isActive =
                                    getSectionCardBorder(section) === cardBorder;
                                  const label =
                                    cardBorder === "on"
                                      ? "Border on"
                                      : "Border off";

                                  return (
                                    <button
                                      aria-pressed={isActive}
                                      className={cx(
                                        "token-chrome-control flex size-14 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors",
                                        isActive && "token-chrome-card-active",
                                      )}
                                      key={cardBorder}
                                      onClick={() =>
                                        updateSectionCardBorder(
                                          section.id,
                                          cardBorder,
                                        )
                                      }
                                      title={label}
                                      type="button"
                                    >
                                      <CardBorderIcon
                                        bordered={cardBorder === "on"}
                                      />
                                      <span className="sr-only">{label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          </div>
                          ) : null}

                          <div className="grid grid-cols-2 items-start gap-4">
                          {sectionSupportsSectionSpacing(section.component) ? (
                          <fieldset className="grid gap-2">
                            <legend className="type-caption font-semibold text-current">
                              Section spacing
                            </legend>
                            <div className="flex items-center gap-2">
                              <button
                                aria-pressed={section.reduceTopPadding ?? false}
                                className={cx(
                                  "token-chrome-control flex size-14 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors",
                                  (section.reduceTopPadding ?? false) &&
                                    "token-chrome-card-active",
                                )}
                                onClick={() =>
                                  updateSectionPadding(
                                    section.id,
                                    "top",
                                    !(section.reduceTopPadding ?? false),
                                  )
                                }
                                title="Toggle top padding"
                                type="button"
                              >
                                <PaddingPrismIcon
                                  active={section.reduceTopPadding ?? false}
                                  edge="top"
                                />
                                <span className="sr-only">
                                  Toggle top padding
                                </span>
                              </button>
                              <button
                                aria-pressed={section.reduceBottomPadding ?? false}
                                className={cx(
                                  "token-chrome-control flex size-14 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors",
                                  (section.reduceBottomPadding ?? false) &&
                                    "token-chrome-card-active",
                                )}
                                onClick={() =>
                                  updateSectionPadding(
                                    section.id,
                                    "bottom",
                                    !(section.reduceBottomPadding ?? false),
                                  )
                                }
                                title="Toggle bottom padding"
                                type="button"
                              >
                                <PaddingPrismIcon
                                  active={section.reduceBottomPadding ?? false}
                                  edge="bottom"
                                />
                                <span className="sr-only">
                                  Toggle bottom padding
                                </span>
                              </button>
                            </div>
                          </fieldset>
                          ) : null}

                          {isCardLinkGridSection(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Card images
                              </legend>
                              <div className="flex items-center gap-2">
                                {fourCardLinkGridVariantOptions.map((option) => {
                                  const optionIsActive =
                                    getCardLinkGridVariant(section) === option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "token-chrome-control flex size-14 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors",
                                        optionIsActive && "token-chrome-card-active",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateCardLinkGridVariant(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      title={
                                        option.value === "with-images"
                                          ? "Show card images"
                                          : "Hide card images"
                                      }
                                      type="button"
                                    >
                                      <CardImageIcon
                                        hidden={option.value === "text-only"}
                                      />
                                      <span className="sr-only">
                                        {option.value === "with-images"
                                          ? "Show card images"
                                          : "Hide card images"}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}
                          {section.component === contentStickyCardStreamComponent ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Content image
                              </legend>
                              <div className="flex items-center gap-2">
                                {fourCardLinkGridVariantOptions.map((option) => {
                                  const showImage = option.value === "with-images";
                                  const optionIsActive =
                                    getStickyCardStreamShowImage(section) === showImage;
                                  const label = showImage
                                    ? "Show content image"
                                    : "Hide content image";

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "token-chrome-control flex size-14 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors",
                                        optionIsActive && "token-chrome-card-active",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateStickyCardStreamImage(section.id, showImage)
                                      }
                                      title={label}
                                      type="button"
                                    >
                                      <CardImageIcon hidden={!showImage} />
                                      <span className="sr-only">{label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}
                          {section.component === contentFixedCoverFadeComponent ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Request form
                              </legend>
                              <div className="grid grid-cols-2 gap-2">
                                {[
                                  {
                                    label: "Embedded form",
                                    mode: "regular" as const,
                                  },
                                  {
                                    label: "Prefill modal",
                                    mode: "modal-prefill" as const,
                                  },
                                ].map((option) => {
                                  const optionIsActive =
                                    (section.variant === "modal-prefill"
                                      ? "modal-prefill"
                                      : "regular") === option.mode;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "token-chrome-control flex size-14 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors",
                                        optionIsActive && "token-chrome-card-active",
                                      )}
                                      key={option.mode}
                                      onClick={() =>
                                        updateFixedCoverFadeFormMode(
                                          section.id,
                                          option.mode,
                                        )
                                      }
                                      title={option.label}
                                      type="button"
                                    >
                                      <FixedCoverFadeFormIcon
                                        modal={option.mode === "modal-prefill"}
                                      />
                                      <span className="sr-only">{option.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}
                          </div>

                          {usesFullImageSplitVariants(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Split Version
                              </legend>
                              <div className="grid grid-cols-2 gap-2">
                                {splitContentImageVariantOptions.map((option) => {
                                  const optionIsActive =
                                    (section.variant ??
                                      splitContentImageVariantOptions[0]
                                        .value) === option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-left text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateSplitContentImageVariant(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {isCompactHeaderAlignmentSection(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Heading Size
                              </legend>
                              <div className="grid grid-cols-3 gap-2">
                                {compactHeaderHeadingSizeOptions.map((option) => {
                                  const optionIsActive =
                                    getCompactHeaderHeadingSize(section) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-label={option.label}
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "flex min-h-11 items-center justify-center rounded-[var(--chrome-radius-control)] border px-2 transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateCompactHeaderHeadingSize(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      title={option.label}
                                      type="button"
                                    >
                                      <HeadingScaleIcon
                                        iconSize={option.iconSize}
                                      />
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {isCompactHeaderAlignmentSection(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Alignment
                              </legend>
                              <div className="grid grid-cols-3 gap-2">
                                {heroCompactAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getHeroCompactAlign(section) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateHeroCompactAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {isHeroCompactServiceSection(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Alignment
                              </legend>
                              <div className="grid grid-cols-3 gap-2">
                                {heroCompactAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getHeroCompactServiceAlign(section) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateHeroCompactServiceAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {isContentThreeColumnMixedSection(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Alignment
                              </legend>
                              <div className="grid grid-cols-3 gap-2">
                                {heroCompactAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getContentThreeColumnMixedAlign(section) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateContentThreeColumnMixedAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {isLargeSectionHeaderSection(section) ? (
                            <div className="grid gap-4">
                              <fieldset className="grid gap-2">
                                <legend className="type-caption font-semibold text-current">
                                  Type class
                                </legend>
                                <div className="grid grid-cols-2 gap-2">
                                  {largeSectionHeaderSizeOptions.map((option) => {
                                    const optionIsActive =
                                      getLargeSectionHeaderSize(section) ===
                                      option.value;

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                          optionIsActive
                                            ? "token-chrome-card-active"
                                            : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateLargeSectionHeader(section.id, {
                                            size: option.value,
                                          })
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </fieldset>

                              <fieldset className="grid gap-2">
                                <legend className="type-caption font-semibold text-current">
                                  Alignment
                                </legend>
                                <div className="grid grid-cols-3 gap-2">
                                  {heroCompactAlignOptions.map((option) => {
                                    const optionIsActive =
                                      getLargeSectionHeaderAlign(section) ===
                                      option.value;

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                          optionIsActive
                                            ? "token-chrome-card-active"
                                            : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateLargeSectionHeader(section.id, {
                                            align: option.value,
                                          })
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </fieldset>
                            </div>
                          ) : null}

                          {sectionSupportsHeadlineWrap(section.component) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Headline Wrap
                              </legend>
                              <div className="grid grid-cols-3 gap-2">
                                {headlineWrapOptions.map((option) => {
                                  const optionIsActive =
                                    getSectionHeadlineWrap(section) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateSectionHeadlineWrap(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {isDecisionSplitDecisionLargeSection(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Alignment
                              </legend>
                              <div className="grid grid-cols-3 gap-2">
                                {heroCompactAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getDecisionSplitDecisionLargeAlign(section) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateDecisionSplitDecisionLargeAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {/* Two icon-button toggles of the same shape, paired
                              so they sit side by side instead of stacking a
                              near-empty row each. Either can be absent - the
                              column simply goes unused. */}
                          <div className="grid grid-cols-2 items-start gap-4">
                          {sectionSupportsIcons(section.component) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                UX Icons
                              </legend>
                              <div className="flex items-center gap-2">
                                {iconsOptions.map((option) => {
                                  const optionIsActive =
                                    getSectionIcons(section) === option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "token-chrome-control flex size-14 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors",
                                        optionIsActive &&
                                          "token-chrome-card-active",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateSectionIcons(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      title={option.label}
                                      type="button"
                                    >
                                      <SectionIconsIcon
                                        shown={option.value === "on"}
                                      />
                                      <span className="sr-only">
                                        {option.label}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {sectionSupportsCardLinks(section.component) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Card links
                              </legend>
                              <div className="flex items-center gap-2">
                                {cardLinksOptions.map((option) => {
                                  const optionIsActive =
                                    getCardLinks(section) === option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "token-chrome-control flex size-14 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-colors",
                                        optionIsActive &&
                                          "token-chrome-card-active",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateCardLinks(section.id, option.value)
                                      }
                                      title={option.label}
                                      type="button"
                                    >
                                      <CardLinksIcon
                                        linked={option.value === "on"}
                                      />
                                      <span className="sr-only">
                                        {option.label}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}
                          </div>

                          {section.component === ctaImageSectionComponent ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Alignment
                              </legend>
                              <div className="grid grid-cols-2 gap-2">
                                {ctaImageAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getCTAImageAlign(section) === option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateCTAImageAlign(section.id, option.value)
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {section.component === featuredOfferSectionComponent ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Alignment
                              </legend>
                              <div className="grid grid-cols-2 gap-2">
                                {featuredOfferAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getFeaturedOfferAlign(section) === option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateFeaturedOfferAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {section.component === contentMainIdeaGridComponent ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Alignment
                              </legend>
                              <div className="grid grid-cols-2 gap-2">
                                {mainIdeaGridAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getMainIdeaGridAlign(section) === option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateMainIdeaGridAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {section.component === featureAsymmetricCardsComponent ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Card position
                              </legend>
                              <div className="grid grid-cols-2 gap-2">
                                {featureAsymmetricCardsAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getFeatureAsymmetricCardsAlign(section) === option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateFeatureAsymmetricCardsAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {section.component ===
                          contentNarrativeFeatureRailComponent ? (
                            <div className="grid gap-4">
                              <fieldset className="grid gap-2">
                                <legend className="type-caption font-semibold text-current">
                                  Sidebar position
                                </legend>
                                <div className="grid grid-cols-2 gap-2">
                                  {mainIdeaGridAlignOptions.map((option) => {
                                    const optionIsActive =
                                      getNarrativeFeatureRailAlign(section) ===
                                      option.value;

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                          optionIsActive
                                            ? "token-chrome-card-active"
                                            : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateNarrativeFeatureRail(section.id, {
                                            align: option.value,
                                          })
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </fieldset>
                              <fieldset className="grid gap-2">
                                <legend className="type-caption font-semibold text-current">
                                  Rail image
                                </legend>
                                <div className="flex items-center gap-2">
                                  {fourCardLinkGridVariantOptions.map((option) => {
                                    const optionIsActive =
                                      getNarrativeFeatureRailShowImage(section) ===
                                      (option.value === "with-images");

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                          optionIsActive ? "token-chrome-card-active" : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateNarrativeFeatureRail(section.id, {
                                            showImage: option.value === "with-images",
                                          })
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </fieldset>
                            </div>
                          ) : null}

                          {section.component === contentCardTwoUpComponent ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Card alignment
                              </legend>
                              <div className="grid grid-cols-3 gap-2">
                                {heroCompactAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getContentCardTwoUpAlign(section) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateContentCardTwoUpAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {section.component === faqAccordionSidebarComponent ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Sidebar position
                              </legend>
                              <div className="grid grid-cols-2 gap-2">
                                {mainIdeaGridAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getFAQAccordionSidebarAlign(section) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateFAQAccordionSidebarAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {section.component === projectCaseStudyGalleryComponent ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Image Position
                              </legend>
                              <div className="grid grid-cols-2 gap-2">
                                {projectCaseStudyGalleryAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getProjectCaseStudyGalleryAlign(section) === option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateProjectCaseStudyGalleryAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {isServiceNeedsPriorityGridSection(section) ? (
                            <div className="grid gap-4">
                              <fieldset className="grid gap-2">
                                <legend className="type-caption font-semibold text-current">
                                  Priority card position
                                </legend>
                                <div className="grid grid-cols-2 gap-2">
                                  {serviceNeedsPriorityGridAlignOptions.map((option) => {
                                    const optionIsActive =
                                      getServiceNeedsPriorityGridAlign(section) === option.value;

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                          optionIsActive ? "token-chrome-card-active" : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateServiceNeedsPriorityGrid(section.id, {
                                            align: option.value,
                                          })
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </fieldset>
                              <fieldset className="grid gap-2">
                                <legend className="type-caption font-semibold text-current">
                                  Priority card sizing
                                </legend>
                                <div className="grid grid-cols-2 gap-2">
                                  {serviceNeedsPriorityGridSizeOptions.map((option) => {
                                    const optionIsActive =
                                      getServiceNeedsPriorityGridCompactPriorityCard(
                                        section,
                                      ) === (option.value === "compact");

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                          optionIsActive ? "token-chrome-card-active" : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateServiceNeedsPriorityGrid(section.id, {
                                            compactPriorityCard: option.value === "compact",
                                          })
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </fieldset>
                            </div>
                          ) : null}

                          {isServicesBentoSection(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Header Layout
                              </legend>
                              <div className="grid grid-cols-3 gap-2 max-md:grid-cols-1">
                                {servicesBentoVariantOptions.map((option) => {
                                  const optionIsActive =
                                    getServicesBentoVariant(section) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateServicesBentoVariant(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {isServiceCalloutSplitPanelSection(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Card Layout
                              </legend>
                              <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
                                {calloutSplitPanelVariantOptions.map(
                                  (option) => {
                                    const optionIsActive =
                                      getCalloutSplitPanelVariant(section) ===
                                      option.value;

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                          optionIsActive
                                            ? "token-chrome-card-active"
                                            : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateCalloutSplitPanelVariant(
                                            section.id,
                                            option.value,
                                          )
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  },
                                )}
                              </div>
                            </fieldset>
                          ) : null}

                          {sectionSupportsCardLinkGridAlign(
                            section.component,
                          ) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Row Alignment
                              </legend>
                              <div className="grid grid-cols-4 gap-2 max-md:grid-cols-2">
                                {cardLinkGridAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getCardLinkGridAlign(section) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateCardLinkGridAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {sectionSupportsTableCompareAlign(
                            section.component,
                          ) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Alignment
                              </legend>
                              <div className="grid grid-cols-3 gap-2">
                                {tableCompareAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getTableCompareAlign(section) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateTableCompareAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {isServiceCalloutRevealGridSection(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Card Layout
                              </legend>
                              <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
                                {calloutRevealGridVariantOptions.map(
                                  (option) => {
                                    const optionIsActive =
                                      getCalloutRevealGridVariant(section) ===
                                      option.value;

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                          optionIsActive
                                            ? "token-chrome-card-active"
                                            : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateCalloutRevealGridVariant(
                                            section.id,
                                            option.value,
                                          )
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  },
                                )}
                              </div>
                            </fieldset>
                          ) : null}

                          {isSplitBentoSection(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Bento Layout
                              </legend>
                              <div className="grid grid-cols-2 gap-2">
                                {splitBentoVariantOptions.map((option) => {
                                  const optionIsActive =
                                    (section.variant ??
                                      splitBentoVariantOptions[0].value) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "token-chrome-card-active"
                                          : "token-chrome-card",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateSplitBentoVariant(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </fieldset>
                          ) : null}

                          {isAnyFixedRatioSplitSection(section) ? (
                            <div className="grid gap-4">
                              <fieldset className="grid gap-2">
                                <legend className="type-caption font-semibold text-current">
                                  Fixed-ratio Layout
                                </legend>
                                <div className="grid gap-2">
                                  {fixedRatioSplitVariantOptions.map((option) => {
                                    const optionIsActive =
                                      ((section.variant?.replace(
                                        /-size-(up|down)$/,
                                        "",
                                      ) as FixedRatioSplitVariant | undefined) ??
                                        fixedRatioSplitVariantOptions[0]
                                          .value) === option.value;

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-left text-xs font-semibold transition-colors",
                                          optionIsActive
                                            ? "token-chrome-card-active"
                                            : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateFixedRatioSplitVariant(
                                            section.id,
                                            option.value,
                                          )
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </fieldset>

                              {isContentFixedRatioSplitSection(section) ? (
                                <fieldset className="grid gap-2">
                                  <legend className="type-caption font-semibold text-current">
                                    Heading Size
                                  </legend>
                                  <div className="grid grid-cols-3 gap-2">
                                    {(
                                      [
                                        { label: "Smaller", value: -1 },
                                        { label: "Default", value: 0 },
                                        { label: "Larger", value: 1 },
                                      ] as const
                                    ).map((option) => {
                                      const optionIsActive =
                                        getContentSplitFixedImageHeadingSizeStep(
                                          section,
                                        ) === option.value;

                                      return (
                                        <button
                                          aria-pressed={optionIsActive}
                                          className={cx(
                                            "min-h-10 rounded-[var(--chrome-radius-control)] border px-2 text-center text-xs font-semibold transition-colors",
                                            optionIsActive
                                              ? "token-chrome-card-active"
                                              : "token-chrome-card",
                                          )}
                                          key={option.value}
                                          onClick={() =>
                                            updateContentSplitFixedImageHeadingSizeStep(
                                              section.id,
                                              option.value,
                                            )
                                          }
                                          type="button"
                                        >
                                          {option.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </fieldset>
                              ) : null}

                              <fieldset className="grid gap-2">
                                <legend className="type-caption font-semibold text-current">
                                  Image Ratio
                                </legend>
                                <div className="grid grid-cols-3 gap-2">
                                  {fixedRatioSplitRatioOptions.map((option) => {
                                    const optionIsActive =
                                      (section.ratio ??
                                        fixedRatioSplitRatioOptions[0].value) ===
                                      option.value;

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "min-h-9 rounded-[var(--chrome-radius-control)] border px-2 text-center text-xs font-semibold transition-colors",
                                          optionIsActive
                                            ? "token-chrome-card-active"
                                            : "token-chrome-card",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateFixedRatioSplitRatio(
                                            section.id,
                                            option.value,
                                          )
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </fieldset>
                            </div>
                          ) : null}

                          <button
                            className="token-chrome-control token-chrome-control-danger min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-sm font-semibold transition-colors"
                            onClick={() => deleteSection(section.id)}
                            type="button"
                          >
                            Delete Section
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </details>

            <details
              className="token-chrome-panel group/add-section order-4 rounded-[var(--chrome-radius-panel)] border p-5"
              onToggle={(event) => {
                const isOpen = event.currentTarget.open;

                if (!isOpen) {
                  setOpenAddSectionModeId(null);
                }

                setOpenSidebarPanel((currentPanel) =>
                  isOpen
                    ? "add-section"
                    : currentPanel === "add-section"
                      ? null
                      : currentPanel,
                );
              }}
              open={
                isSidebarStateHydrated
                  ? openSidebarPanel === "add-section"
                  : undefined
              }
              suppressHydrationWarning
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <h2 className="text-2xl font-semibold leading-tight">
                  Add Section
                </h2>
                <span
                  aria-hidden="true"
                  className="token-chrome-badge flex size-8 shrink-0 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-transform group-open/add-section:rotate-180"
                >
                  <DownArrowIcon className="size-4" />
                </span>
              </summary>
              <div className="mt-4 grid gap-4">
                {sectionModes.map((mode) => {
                  const options = sortSectionSwapOptions(
                    sectionSwapOptions.filter(
                      (option) => option.mode === mode.name,
                    ),
                  );

                  if (options.length === 0) {
                    return null;
                  }

                  return (
                    <details
                      className="token-chrome-card group/mode rounded-[var(--chrome-radius-control)] border"
                      key={mode.id}
                      onToggle={(event) => {
                        const isOpen = event.currentTarget.open;

                        setOpenAddSectionModeId((currentModeId) =>
                          isOpen
                            ? mode.id
                            : currentModeId === mode.id
                              ? null
                              : currentModeId,
                        );
                      }}
                      open={
                        isSidebarStateHydrated
                          ? openAddSectionModeId === mode.id
                          : undefined
                      }
                      suppressHydrationWarning
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-left">
                        <span className="min-w-0">
                          <span className="type-caption block font-semibold">
                            {mode.name}
                          </span>
                          <span className="token-chrome-muted type-caption mt-0.5 block">
                            {options.length} section options
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="token-chrome-badge flex size-7 shrink-0 items-center justify-center rounded-[var(--chrome-radius-control)] border transition-transform group-open/mode:rotate-180"
                        >
                          <DownArrowIcon className="size-3.5" />
                        </span>
                      </summary>
                      <div className="grid gap-1.5 border-t border-[var(--chrome-border-soft)] p-2">
                        {options.map((option) => {
                          const templateUsageCount =
                            sectionTemplateUsageCounts.get(option.component) ?? 0;
                          const innerOptionSignifier =
                            getInnerOptionSignifier(option.component);
                          const isRecentlyAdded =
                            recentlyAddedSection === option.component;

                          return (
                            <button
                              aria-label={`${getSectionDisplayLabel(option)}${isRecentlyAdded ? " added" : ""}`}
                              className={cx(
                                "token-chrome-control grid min-h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--chrome-radius-control)] border px-3 py-2 text-left text-sm font-semibold transition-colors",
                                isRecentlyAdded &&
                                  "border-service-accent bg-service-accent text-white",
                              )}
                              key={option.component}
                              onClick={() => addSection(option.component)}
                              type="button"
                            >
                              <span className="min-w-0">
                                {!innerOptionSignifier ? (
                                  <span className="block">
                                    {getSectionDisplayLabel(option)}
                                  </span>
                                ) : null}
                                {innerOptionSignifier ? (
                                  <InnerLayoutPill
                                    label={getSectionDisplayLabel(option)}
                                    signifier={innerOptionSignifier}
                                    tone="dark"
                                  />
                                ) : null}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <SectionLayoutGridBadge
                                  component={option.component}
                                  tone="dark"
                                />
                                {isRecentlyAdded ? (
                                  <span className="text-xs font-semibold">Added</span>
                                ) : null}
                                {templateUsageCount > 0 ? (
                                  <span className="token-chrome-badge flex size-5 shrink-0 items-center justify-center rounded-[var(--chrome-radius-control)] border text-[0.625rem] font-semibold leading-none">
                                    {templateUsageCount}
                                  </span>
                                ) : null}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}
              </div>
              <p className="token-chrome-muted type-caption mt-3">
                Adds after the selected section, or at the bottom.
              </p>
            </details>

            <div className="token-chrome-panel order-5 rounded-[var(--chrome-radius-panel)] border p-5">
              <h2 className="text-2xl font-semibold leading-tight">
                Preview Controls
              </h2>
              <div className="mt-4 grid gap-4">
                <div className="grid gap-2">
                  <span className="type-caption font-semibold">
                    Preview Canvas
                  </span>
                  <div className="token-chrome-control rounded-[var(--chrome-radius-control)] border px-3 py-3">
                    <p className="text-sm font-semibold">
                      {selectedViewport.label}
                    </p>
                    <p className="token-chrome-muted type-caption mt-1">
                      {selectedViewport.sizeLabel}
                    </p>
                  </div>
                  <span className="token-chrome-muted type-caption">
                    All pagebuilder previews use this fixed canvas for
                    agreement and consistency.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="token-chrome-primary min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-sm font-semibold transition-colors"
                    onClick={() => setIsPreviewOpen(true)}
                    type="button"
                  >
                    Focus
                  </button>
                  <button
                    className="token-chrome-control min-h-10 rounded-[var(--chrome-radius-control)] border px-3 text-sm font-semibold transition-colors"
                    onClick={refreshPreviewStyles}
                    type="button"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div className="token-chrome-frame grid h-full min-h-0 overflow-hidden rounded-[var(--chrome-radius-control)] border p-2 max-lg:h-[78svh]">
            <div className="grid h-full min-h-0 place-items-stretch overflow-hidden">
              {renderPreviewWindow()}
            </div>

            <div className="hidden">
            <div className="radius-medium border border-service-border bg-bg-page p-1.5 shadow-service">
              <div
                aria-label="Pagebuilder design tabs"
                className="grid grid-cols-5 gap-1.5 max-xl:grid-cols-3 max-md:grid-cols-1"
                role="tablist"
              >
                {recipes.map((recipe) => {
                  const isActive = recipe.id === activeRecipe.id;

                  return (
                    <button
                      aria-controls={`recipe-${recipe.id}`}
                      aria-selected={isActive}
                      className={cx(
                        "radius-4 min-h-9 px-2.5 text-left text-xs font-semibold transition-colors",
                        isActive
                          ? "bg-bg-dark text-text-inverse"
                          : "border border-service-border bg-service-surface text-service-ink hover:border-service-accent hover:text-service-accent",
                      )}
                      id={`tab-${recipe.id}`}
                      key={recipe.id}
                      onClick={() => selectRecipe(recipe.id)}
                      role="tab"
                      type="button"
                    >
                      {recipe.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              aria-labelledby={`tab-${activeRecipe.id}`}
              className="grid content-start gap-4"
              id={`recipe-${activeRecipe.id}`}
              role="tabpanel"
            >
              <div className="grid w-full content-start gap-4">
                <section className="radius-medium border border-service-border bg-bg-page p-4 shadow-service">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="type-label text-service-accent">
                        Pagebuilder Design
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-service-ink">
                        {activePageLabel}
                      </h2>
                      <p className="type-caption wrap-pretty mt-1 text-service-muted">
                        {activeRecipe.positioning}
                      </p>
                    </div>
                    <button
                      className="radius-4 min-h-11 shrink-0 border border-bg-dark bg-bg-dark px-4 text-sm font-semibold text-text-inverse transition-colors hover:border-service-accent hover:bg-service-accent"
                      onClick={() => setIsPreviewOpen(true)}
                      type="button"
                    >
                      Focus Preview
                    </button>
                    <button
                      className="radius-4 min-h-11 shrink-0 border border-service-border bg-bg-page px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent"
                      onClick={refreshPreviewStyles}
                      type="button"
                    >
                      Refresh Styles
                    </button>
                    <button
                      className="radius-4 min-h-11 shrink-0 border border-bg-dark bg-bg-dark px-4 text-sm font-semibold text-text-inverse transition-colors hover:border-service-accent hover:bg-service-accent disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isSavingOption}
                      onClick={() => void saveActiveOption()}
                      type="button"
                    >
                      {isSavingOption ? "Saving..." : "Save Layout"}
                    </button>
                    <button
                      className="radius-4 min-h-11 shrink-0 border border-service-border bg-bg-page px-3 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent"
                      onClick={openTemplateModal}
                      type="button"
                    >
                      Promote Layout to Template
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[
                      `Layout: ${activeSlotLabel}`,
                      `Viewport: ${selectedViewport.label}`,
                      `Sections: ${includedSections.length}`,
                      "Normal spacing",
                    ].map((rule) => (
                      <span
                        className="rounded-full border border-service-border bg-service-surface px-2.5 py-1 text-xs font-semibold text-service-muted"
                        key={rule}
                      >
                        {rule}
                      </span>
                    ))}
                  </div>
                  {templateStatus ? (
                    <p className="type-caption mt-3 rounded-sm border border-service-border bg-service-surface px-3 py-2 text-service-muted">
                      {templateStatus}
                    </p>
                  ) : null}
                  {optionSaveStatus || optionSaveError ? (
                    <p
                      className={cx(
                        "type-caption mt-3 rounded-sm border px-3 py-2",
                        optionSaveError
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-service-border bg-service-surface text-service-muted",
                      )}
                    >
                      {optionSaveError || optionSaveStatus}
                    </p>
                  ) : null}
                </section>

                <section
                  aria-labelledby="pagebuilder-rendered-preview-button"
                  className="radius-medium overflow-hidden border border-service-border bg-bg-page shadow-service"
                >
                  <button
                    aria-controls="pagebuilder-rendered-preview-panel"
                    aria-expanded={isRenderedPreviewOpen}
                    className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-service-surface/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-service-accent"
                    id="pagebuilder-rendered-preview-button"
                    onClick={() =>
                      setIsRenderedPreviewOpen(
                        (currentIsOpen) => !currentIsOpen,
                      )
                    }
                    type="button"
                  >
                    <span className="min-w-0">
                      <span className="type-label block text-service-accent">
                        Rendered Preview
                      </span>
                      <span className="type-heading-sm mt-2 block text-service-ink">
                        {activePageLabel} page body
                      </span>
                    </span>
                    <span className="flex flex-wrap justify-end gap-2">
                      {[
                        selectedViewport.label,
                        "Normal spacing",
                        "Section builder",
                      ].map((label) => (
                        <span
                          className="rounded-full border border-service-border bg-service-surface px-3 py-1 text-xs font-semibold text-service-muted"
                          key={label}
                        >
                          {label}
                        </span>
                      ))}
                      <span
                        aria-hidden="true"
                        className={`flex size-8 items-center justify-center rounded-sm border border-service-border text-service-accent transition-transform ${
                          isRenderedPreviewOpen ? "rotate-180" : ""
                        }`}
                      >
                        <DownArrowIcon className="size-4" />
                      </span>
                    </span>
                  </button>

                  {isRenderedPreviewOpen ? (
                    <div
                      aria-labelledby="pagebuilder-rendered-preview-button"
                      className="border-t border-service-border p-5"
                      id="pagebuilder-rendered-preview-panel"
                      role="region"
                    >
                      <div className="rounded border border-service-border bg-service-surface p-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-service-ink">
                            {selectedViewport.sizeLabel}
                          </p>
                          <p className="type-caption mt-1 text-service-muted">
                            Click rendered sections to select them, then swap,
                            reorder, or toggle them from the controls.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 h-[72svh] min-h-[36rem] overflow-hidden rounded border border-service-border bg-service-surface p-3 max-md:h-[68svh] max-md:min-h-[28rem] max-sm:min-h-[24rem]">
                        <div className="grid h-full min-h-0 place-items-center overflow-hidden">
                          {renderPreviewWindow()}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </section>

                <details className="radius-medium border border-service-border bg-bg-page p-5 shadow-service">
                  <summary className="cursor-pointer text-sm font-semibold text-service-ink">
                    Section Stack
                  </summary>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded border border-service-border bg-service-surface p-3">
                    <div className="min-w-0">
                      <p className="type-caption font-semibold text-service-ink">
                        Building Space
                      </p>
                      <p className="type-caption mt-1 text-service-muted">
                        {includedSections.length} sections currently included.
                      </p>
                    </div>
                    <button
                      aria-label="Clear all sections from the building space"
                      className="radius-4 inline-flex min-h-10 items-center gap-2 border border-service-border bg-bg-page px-3 text-xs font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={includedSections.length === 0}
                      onClick={requestClearBuildingSpace}
                      title="Clear building space"
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-6 items-center justify-center rounded-sm border border-current text-sm leading-none"
                      >
                        X
                      </span>
                      <span>Clear</span>
                    </button>
                  </div>
                  <div className="mt-5 grid gap-2 rounded border border-service-border bg-service-surface p-3">
                    <div className="grid gap-3">
                      <p className="type-caption font-semibold text-service-ink">
                        Add Section Template
                      </p>
                      {sectionModes.map((mode) => {
                        const options = sortSectionSwapOptions(
                          sectionSwapOptions.filter(
                            (option) => option.mode === mode.name,
                          ),
                        );

                        if (options.length === 0) {
                          return null;
                        }

                        return (
                          <details
                            className="group/template-mode rounded border border-service-border bg-bg-page"
                            key={mode.id}
                          >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-left">
                              <span className="min-w-0">
                                <span className="type-caption block font-semibold text-service-ink">
                                  {mode.name}
                                </span>
                                <span className="type-caption mt-0.5 block text-service-muted">
                                  {options.length} section options
                                </span>
                              </span>
                              <span
                                aria-hidden="true"
                                className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-service-border text-service-accent transition-transform group-open/template-mode:rotate-180"
                              >
                                <DownArrowIcon className="size-3.5" />
                              </span>
                            </summary>
                            <div className="grid grid-cols-2 gap-2 border-t border-service-border p-2 max-md:grid-cols-1">
                              {options.map((option) => {
                                const innerOptionSignifier =
                                  getInnerOptionSignifier(option.component);
                                const isRecentlyAdded =
                                  recentlyAddedSection === option.component;

                                return (
                                  <button
                                    aria-label={`${getSectionDisplayLabel(option)}${isRecentlyAdded ? " added" : ""}`}
                                    className={cx(
                                      "radius-4 grid min-h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-service-border bg-bg-page px-3 py-2 text-left text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent",
                                      isRecentlyAdded &&
                                        "border-service-accent bg-service-accent text-white hover:border-service-accent hover:bg-service-accent hover:text-white",
                                    )}
                                    key={option.component}
                                    onClick={() => addSection(option.component)}
                                    type="button"
                                  >
                                    <span className="min-w-0">
                                      {!innerOptionSignifier ? (
                                        <span className="block">
                                          {getSectionDisplayLabel(option)}
                                        </span>
                                      ) : null}
                                      {innerOptionSignifier ? (
                                        <InnerLayoutPill
                                          label={getSectionDisplayLabel(option)}
                                          signifier={innerOptionSignifier}
                                          tone="light"
                                        />
                                      ) : null}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <SectionLayoutGridBadge
                                        component={option.component}
                                        tone="light"
                                      />
                                      {isRecentlyAdded ? (
                                        <span className="text-xs font-semibold">Added</span>
                                      ) : null}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </details>
                        );
                      })}
                      <span className="type-caption text-service-muted">
                        Adds after the selected section, or at the bottom if
                        nothing is selected.
                      </span>
                    </div>
                  </div>
                  <ol className="mt-5 grid gap-3">
                    {activeStack.map((section, index) => (
                      <li
                        className={cx(
                          "relative grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-4 rounded border border-service-border bg-service-surface p-4 transition-shadow max-md:grid-cols-[2.5rem_minmax(0,1fr)]",
                          section.id === selectedSectionId &&
                            "shadow-[0_0_0_2px_var(--color-service-accent)]",
                          section.id === draggedSectionId && "opacity-35",
                          section.id === dragOverSectionId &&
                            dragDropPosition !== null &&
                            "border-service-accent",
                          !section.included && "opacity-50",
                        )}
                        onDragOver={(event) => {
                          event.preventDefault();
                          if (!draggedSectionId || draggedSectionId === section.id) {
                            return;
                          }
                          event.dataTransfer.dropEffect = "move";
                          const nextPosition = getDragDropPosition(event);

                          setDragOverSectionId(section.id);
                          setDragDropPosition(nextPosition);
                        }}
                        onDragLeave={(event) => {
                          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                            clearDragState();
                          }
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          const dropPosition = getDragDropPosition(event);
                          const droppedSectionId =
                            event.dataTransfer.getData("text/plain") ||
                            draggedSectionId;

                          if (droppedSectionId && dropPosition) {
                            reorderSection(
                              droppedSectionId,
                              section.id,
                              dropPosition,
                            );
                          } else {
                            clearDragState();
                          }
                        }}
                        key={section.id}
                      >
                        {section.id === dragOverSectionId && dragDropPosition ? (
                          <span
                            aria-hidden="true"
                            className={cx(
                              "pointer-events-none absolute left-0 right-0 z-20 h-1 rounded-full bg-service-accent shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-service-accent)_20%,transparent)]",
                              dragDropPosition === "before"
                                ? "top-0"
                                : "bottom-0",
                            )}
                          >
                            <span className="pointer-events-none absolute left-1/2 top-1 z-30 -translate-x-1/2 whitespace-nowrap rounded bg-service-accent px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-normal text-white shadow-sm">
                              Move {dragDropPosition}
                            </span>
                          </span>
                        ) : null}
                        <button
                          aria-label={`Drag ${getSectionDisplayLabel(section)} section`}
                          className="flex size-10 cursor-grab items-center justify-center rounded bg-bg-page text-sm font-semibold text-service-accent transition-colors hover:bg-service-accent hover:text-white active:cursor-grabbing"
                          draggable
                          onDragEnd={clearDragState}
                          onDragStart={(event) =>
                            startDraggingSection(event, section.id)
                          }
                          title="Drag to reorder"
                          type="button"
                        >
                          {index + 1}
                        </button>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h4 className="type-heading-sm text-service-ink">
                                {getSectionDisplayLabel(section)}
                              </h4>
                              <p className="type-caption mt-1 text-service-muted">
                                {section.component}
                              </p>
                            </div>
                            <span className="rounded-full border border-service-border bg-bg-page px-3 py-1 text-xs font-semibold text-service-muted">
                              {section.included
                                ? section.mode
                                : `${section.mode} / excluded`}
                            </span>
                          </div>
                          <p className="type-text-sm wrap-pretty mt-3 text-service-muted">
                            {section.instruction}
                          </p>
                        </div>
                        <div className="grid content-start gap-2 max-md:col-span-2 max-md:grid-cols-4">
                          <button
                            className="radius-4 min-h-9 border border-service-border bg-bg-page px-3 text-xs font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-40"
                            disabled={index === 0}
                            onClick={() => {
                              setSelectedSectionId(section.id);
                              moveSection(section.id, -1);
                            }}
                            type="button"
                          >
                            Up
                          </button>
                          <button
                            className="radius-4 min-h-9 border border-service-border bg-bg-page px-3 text-xs font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-40"
                            disabled={index === activeStack.length - 1}
                            onClick={() => {
                              setSelectedSectionId(section.id);
                              moveSection(section.id, 1);
                            }}
                            type="button"
                          >
                            Down
                          </button>
                          <button
                            className="radius-4 min-h-9 border border-service-border bg-bg-page px-3 text-xs font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent"
                            onClick={() => setSelectedSectionId(section.id)}
                            type="button"
                          >
                            Select
                          </button>
                          <button
                            className="token-chrome-control token-chrome-control-danger min-h-9 rounded-[var(--chrome-radius-control)] border px-3 text-xs font-semibold transition-colors"
                            onClick={() => deleteSection(section.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ol>
                </details>

                <details className="radius-medium border border-service-border bg-bg-page p-5 shadow-service">
                  <summary className="cursor-pointer text-sm font-semibold text-service-ink">
                    Page Instruction
                  </summary>
                  <div className="mt-4 grid grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.45fr)] gap-4 max-lg:grid-cols-1">
                    <div className="grid gap-3">
                      <textarea
                        className="min-h-[34rem] resize-y rounded border border-service-border bg-service-surface p-4 font-mono text-xs leading-6 text-service-ink outline-none focus:border-service-accent"
                        readOnly
                        value={pageInstruction}
                      />
                      <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                        <button
                          className="radius-4 min-h-11 border border-bg-dark bg-bg-dark px-4 text-sm font-semibold text-text-inverse transition-colors hover:border-service-accent hover:bg-service-accent"
                          onClick={copyPageInstruction}
                          type="button"
                        >
                          Copy Page Instruction
                        </button>
                        <button
                          className="radius-4 min-h-11 border border-service-border bg-bg-page px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent"
                          onClick={copyAllLayoutInstructions}
                          type="button"
                        >
                          Copy All Page Instructions
                        </button>
                      </div>
                    </div>
                    <div className="rounded border border-service-border bg-service-surface p-4">
                      <p className="type-caption font-semibold text-service-ink">
                        Use {activePageLabel}
                      </p>
                      <p className="type-caption mt-2 text-service-muted">
                        {activeRecipe.positioning}
                      </p>
                      <div className="mt-3 grid gap-2 rounded border border-service-border bg-bg-page p-3">
                        <p className="type-caption text-service-muted">
                          Sections:{" "}
                          <span className="font-semibold text-service-ink">
                            {includedSections.length}
                          </span>
                        </p>
                        <p className="type-caption text-service-muted">
                          Spacing:{" "}
                          <span className="font-semibold text-service-ink">
                            Normal
                          </span>
                        </p>
                        <p className="type-caption text-service-muted">
                          Preview width:{" "}
                          <span className="font-semibold text-service-ink">
                            {selectedViewport.label}
                          </span>
                        </p>
                      </div>
                      <div className="mt-3 grid gap-2 rounded border border-service-border bg-bg-page p-3">
                        {[
                          "Use the existing project typography and color tokens.",
                          "Keep section spacing on the normal shared density.",
                          selectedViewport.brief,
                        ].map((brief) => (
                          <p
                            className="type-caption text-service-muted"
                            key={brief}
                          >
                            {brief}
                          </p>
                        ))}
                      </div>
                      <ol className="mt-3 grid gap-2">
                        {includedSections.map((section, index) => (
                          <li
                            className="type-caption rounded border border-service-border bg-bg-page p-3 text-service-muted"
                            key={`${section.id}-brief`}
                          >
                            <span className="font-semibold text-service-ink">
                              {index + 1}. {section.component}
                            </span>
                            <br />
                            {section.mode}: {section.instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </details>

                <details className="radius-medium border border-service-border bg-bg-page p-5 shadow-service">
                  <summary className="cursor-pointer text-sm font-semibold text-service-ink">
                    Semantic Modes
                  </summary>
                  <div className="mt-4 grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
                    {sectionModes.map((mode) => (
                      <div
                        className="rounded border border-service-border bg-service-surface p-3"
                        key={mode.id}
                      >
                        <h3 className="text-sm font-semibold text-service-ink">
                          {mode.name}
                        </h3>
                        <p className="type-caption mt-2 text-service-muted">
                          {mode.intent}
                        </p>
                        <ul className="mt-3 grid gap-2">
                          {mode.rules.map((rule) => (
                            <li
                              className="type-caption text-service-muted"
                              key={rule}
                            >
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      {isClearConfirmOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-bg-dark/40 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsClearConfirmOpen(false);
            }
          }}
        >
          <div
            aria-labelledby="pagebuilder-clear-confirm-title"
            aria-modal="true"
            className="w-full max-w-md rounded-md border border-service-border bg-bg-page p-6 text-service-ink shadow-service"
            role="dialog"
          >
            <p className="type-label text-service-accent">Clear page template</p>
            <h3
              className="type-heading-sm mt-3 text-service-ink"
              id="pagebuilder-clear-confirm-title"
            >
              Remove all sections from {activePageLabel}?
            </h3>
            <p className="type-text-sm mt-3 text-service-muted">
              This drops all {includedSections.length}{" "}
              {includedSections.length === 1 ? "section" : "sections"} out of the
              building space in one step. Section swaps, variants, and layout
              settings go with them, and there is no undo.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                autoFocus
                className="inline-flex min-h-10 items-center justify-center rounded-sm border border-service-border px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                onClick={() => setIsClearConfirmOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-sm bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                onClick={confirmClearBuildingSpace}
                type="button"
              >
                Clear sections
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {isTemplateModalOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-bg-dark/40 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeTemplateModal();
            }
          }}
        >
          <div
            aria-labelledby="pagebuilder-template-promotion-title"
            aria-modal="true"
            className="w-full max-w-lg rounded-md border border-service-border bg-bg-page p-6 text-service-ink shadow-service"
            role="dialog"
          >
            <p className="type-label text-service-accent">
              Promote layout to template
            </p>
            <h3
              className="type-heading-sm mt-3 text-service-ink"
              id="pagebuilder-template-promotion-title"
            >
              Save {activePageLabel}
            </h3>
            <p className="type-text-sm mt-3 text-service-muted">
              This saves the active page layout as a reusable page template with its
              current included section order, swaps, variants, and layout
              settings.
            </p>
            <label className="type-caption mt-6 block font-semibold text-service-ink">
              Template name
              <input
                className="mt-2 block min-h-11 w-full rounded-sm border border-service-border px-3 text-sm font-normal text-service-ink outline-none focus:border-service-accent"
                value={templateName}
                onChange={(event) => {
                  const nextName = event.target.value;
                  setTemplateName(nextName);
                  setTemplateSlug(slugifyTemplateName(nextName));
                }}
              />
            </label>
            <label className="type-caption mt-4 block font-semibold text-service-ink">
              Template slug
              <input
                className="mt-2 block min-h-11 w-full rounded-sm border border-service-border px-3 text-sm font-normal text-service-ink outline-none focus:border-service-accent"
                value={templateSlug}
                onChange={(event) =>
                  setTemplateSlug(slugifyTemplateName(event.target.value))
                }
              />
            </label>
            <label className="type-caption mt-4 block font-semibold text-service-ink">
              Notes
              <textarea
                className="mt-2 block min-h-24 w-full resize-y rounded-sm border border-service-border px-3 py-2 text-sm font-normal text-service-ink outline-none focus:border-service-accent"
                placeholder="Best use case, business type, or page intent."
                value={templateNotes}
                onChange={(event) => setTemplateNotes(event.target.value)}
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
                {includedSections.length} sections
              </span>
              <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
                {activeRecipe.name}
              </span>
              <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
                {activeSlotLabel}
              </span>
            </div>
            {templateError ? (
              <p className="type-caption mt-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-red-700">
                {templateError}
              </p>
            ) : null}
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-sm border border-service-border px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isPromotingTemplate}
                onClick={closeTemplateModal}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-sm bg-service-accent px-4 text-sm font-semibold text-text-inverse transition-colors hover:bg-bg-dark disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isPromotingTemplate}
                onClick={() => void promoteActiveOptionToTemplate()}
                type="button"
              >
                {isPromotingTemplate
                  ? "Promoting..."
                  : "Promote Layout to Template"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {isPreviewOpen && (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 grid bg-bg-dark/82 p-4 backdrop-blur-sm max-md:p-3"
          role="dialog"
        >
          <button
            aria-label="Close preview"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsPreviewOpen(false)}
            type="button"
          />
          <div className="relative z-10 grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3">
            <div className="token-chrome-panel flex flex-wrap items-center justify-between gap-3 rounded-[var(--chrome-radius-control)] border px-3 py-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--chrome-text)]">
                  {activePageLabel}
                </p>
                <p className="type-caption truncate text-[var(--chrome-muted)]">
                  {selectedViewport.sizeLabel} preview
                </p>
              </div>
              <div className="token-chrome-control rounded-[var(--chrome-radius-control)] border px-3 py-2">
                <p className="text-xs font-semibold text-[var(--chrome-text)]">
                  {selectedViewport.label}
                </p>
              </div>
              <button
                className="token-chrome-control min-h-10 shrink-0 rounded-[var(--chrome-radius-control)] border px-3 text-xs font-semibold transition-colors"
                onClick={refreshPreviewStyles}
                type="button"
              >
                Refresh Styles
              </button>
              <button
                aria-label="Close preview"
                className="token-chrome-control flex size-10 shrink-0 items-center justify-center rounded-[var(--chrome-radius-control)] border text-xl font-semibold leading-none transition-colors"
                onClick={() => setIsPreviewOpen(false)}
                type="button"
              >
                x
              </button>
            </div>
            <div className="grid min-h-0 place-items-center overflow-hidden">
              {renderPreviewWindow()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}
