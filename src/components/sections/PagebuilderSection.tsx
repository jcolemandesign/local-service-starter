"use client";

// Client, because `renderPreviewSection` is handed to `PagebuilderShell` as a
// prop and functions cannot cross the server/client boundary. This used to be a
// server component passing `previewCatalog`, a plain map of already-rendered
// ReactNode, which serialises fine - but a prebuilt element cannot carry the
// live toggle values the canvas needs. Nothing server-only is left in this file.

import { ContentAboutCompanySectionV2 } from "@/components/sections/ContentAboutCompanySectionV2";
import { ContentAboutStorySectionV3 } from "@/components/sections/ContentAboutStorySectionV3";
import { ContentNarrativeFeatureRailSectionV3 } from "@/components/sections/ContentNarrativeFeatureRailSectionV3";
import { ContentCardTwoUpSectionV3 } from "@/components/sections/ContentCardTwoUpSectionV3";
import {
  ContentThreeColumnMixedSectionV3,
  type ContentThreeColumnMixedAlign,
} from "@/components/sections/ContentThreeColumnMixedSectionV3";
import { ContentFixedCoverFadeSectionV2 } from "@/components/sections/ContentFixedCoverFadeSectionV2";
import { ContentHorizontalCardCarouselSectionV2 } from "@/components/sections/ContentHorizontalCardCarouselSectionV2";
import { ContentMainIdeaGridSectionV3 } from "@/components/sections/ContentMainIdeaGridSectionV3";
import {
  ContentPhotoGalleryCarouselSectionV3,
  ContentPhotoGalleryLargeCarouselSectionV3,
} from "@/components/sections/ContentPhotoGalleryCarouselSectionV3";
import { ProjectCaseStudyGallerySectionV3 } from "@/components/sections/ProjectCaseStudyGallerySectionV3";
import { ImageStripSectionV3 } from "@/components/sections/ImageStripSectionV3";
import { QuickPageLinksSectionV2 } from "@/components/sections/QuickPageLinksSectionV2";
import { ContactSectionV2 } from "@/components/sections/ContactSectionV2";
import { ContactSectionModalBegin } from "@/components/sections/ContactSectionModalBegin";
import { CTAFullscreenSectionV2 } from "@/components/sections/CTAFullscreenSectionV2";
import { CTAScrollRevealOfferSectionV2 } from "@/components/sections/CTAScrollRevealOfferSectionV2";
import { ContentRevealParagraphSectionV2 } from "@/components/sections/ContentRevealParagraphSectionV2";
import { ContentRuleHeaderSectionV2 } from "@/components/sections/ContentRuleHeaderSectionV2";
import { ContentScrollWrittenRevealSectionV2 } from "@/components/sections/ContentScrollWrittenRevealSectionV2";
import {
  ContentSplitFixedImageSectionV3,
  type ContentSplitFixedImageRatio,
  type ContentSplitFixedImageVariant,
} from "@/components/sections/ContentSplitFixedImageSectionV3";
import {
  ContentSplitFullImageSectionV3,
  type ContentSplitFullImageVariant,
} from "@/components/sections/ContentSplitFullImageSectionV3";
import { ContentStickyCardStreamSectionV2 } from "@/components/sections/ContentStickyCardStreamSectionV2";
import { ContentSplitHeadlineImageSectionV2 } from "@/components/sections/ContentSplitHeadlineImageSectionV2";
import { ContentStickyIdeasSectionV2 } from "@/components/sections/ContentStickyIdeasSectionV2";
import {
  ContactSectionV3,
  CTASectionV3,
  CTAFullscreenSectionV3,
  CTAMutedSectionV3,
  FooterCompactSectionV3,
  FooterHorizontalSectionV3,
  FooterSectionV3,
  FAQSectionV3,
} from "@/components/sections/FAQConversionContactFooterSectionsV3";
import {
  FeatureOverlapRowsSectionV3,
  ProcessStepsSectionV3,
  TestimonialsSectionV3,
} from "@/components/sections/FeatureProcessTestimonialsSectionsV3";
import { FeatureAsymmetricCardsSectionV3 } from "@/components/sections/FeatureAsymmetricCardsSectionV3";
import { FeatureStackedCardsSectionV3 } from "@/components/sections/FeatureStackedCardsSectionV3";
import { DecisionQuestionTableFourSectionV3 } from "@/components/sections/DecisionQuestionTableFourSectionV3";
import { DecisionQuestionTableSectionV3 } from "@/components/sections/DecisionQuestionTableSectionV3";
import { DecisionSplitDecisionSectionV3 } from "@/components/sections/DecisionSplitDecisionSectionV3";
import { DecisionSplitDecisionLargeSectionV3 } from "@/components/sections/DecisionSplitDecisionLargeSectionV3";
import { DecisionMatrixCardSectionV3 } from "@/components/sections/DecisionMatrixCardSectionV3";
import { DecisionSplitLargeCardsSectionV3 } from "@/components/sections/DecisionSplitLargeCardsSectionV3";
import { SectionHeaderSplitLinkSectionV3 } from "@/components/sections/SectionHeaderSplitLinkSectionV3";
import { ProcessStepsBranchingSectionV3 } from "@/components/sections/ProcessStepsBranchingSectionV3";
import { ProcessStepsStaggeredSectionV3 } from "@/components/sections/ProcessStepsStaggeredSectionV3";
import { ProcessStripSectionV3 } from "@/components/sections/ProcessStripSectionV3";
import { FeaturePortraitParagraphSectionV3 } from "@/components/sections/FeaturePortraitParagraphSectionV3";
import { CTAScrollRevealOfferSectionV3 } from "@/components/sections/CTAScrollRevealOfferSectionV3";
import { FAQAccordionSectionV3 } from "@/components/sections/FAQAccordionSectionV3";
import { FAQAccordionSidebarSectionV3 } from "@/components/sections/FAQAccordionSidebarSectionV3";
import { HeroCenteredFloatersSectionV2 } from "@/components/sections/HeroCenteredFloatersSectionV2";
import {
  HeroCompactSectionV3,
  type HeroCompactAlign,
  type HeroCompactHeadingSize,
} from "@/components/sections/HeroCompactSectionV3";
import { HeroServicesSectionV3 } from "@/components/sections/HeroServicesSectionV3";
import { HeroCompactServiceSectionV3 } from "@/components/sections/HeroCompactServiceSectionV3";
import { SectionHeaderCompactSectionV3 } from "@/components/sections/SectionHeaderCompactSectionV3";
import {
  SectionHeaderLargeSectionV3,
  type LargeSectionHeaderSize,
} from "@/components/sections/SectionHeaderLargeSectionV3";
import { HeroContentTopImageBottomSectionV2 } from "@/components/sections/HeroContentTopImageBottomSectionV2";
import {
  HeroSplitFixedImageSectionV3,
  type HeroSplitFixedImageRatio,
  type HeroSplitFixedImageVariant,
} from "@/components/sections/HeroSplitFixedImageSectionV3";
import {
  HeroSplitBentoSectionV3,
  type HeroSplitBentoVariant,
} from "@/components/sections/HeroSplitBentoSectionV3";
import { HeroFullscreenSectionV2 } from "@/components/sections/HeroFullscreenSectionV2";
import {
  HeroSplitFullHeightSectionV3,
  type HeroSplitFullHeightVariant,
} from "@/components/sections/HeroSplitFullHeightSectionV3";
import { HeroServiceAreaZipLookupSectionV3 } from "@/components/sections/HeroServiceAreaZipLookupSectionV3";
import { FooterSectionV2 } from "@/components/sections/FooterSectionV2";
import { FooterLinkPanelSectionV3 } from "@/components/sections/FooterLinkPanelSectionV3";
import { FourCardLinkGridSectionV3 } from "@/components/sections/FourCardLinkGridSectionV3";
import { ServiceCalloutRevealGridSectionV3 } from "@/components/sections/ServiceCalloutRevealGridSectionV3";
import { ServiceCalloutSplitPanelSectionV3 } from "@/components/sections/ServiceCalloutSplitPanelSectionV3";
import { CTAImageSectionV3 } from "@/components/sections/CTAImageSectionV3";
import { CTASmallBandImageSectionV3 } from "@/components/sections/CTASmallBandImageSectionV3";
import { CTAServiceTriageSectionV3 } from "@/components/sections/CTAServiceTriageSectionV3";
import { FeaturedOfferSectionV3 } from "@/components/sections/FeaturedOfferSectionV3";
import { AdditionalOffersSectionV3 } from "@/components/sections/AdditionalOffersSectionV3";
import { HorizontalCardLinkGridSectionV3 } from "@/components/sections/HorizontalCardLinkGridSectionV3";
import { HorizontalCardLinkGridTwoUpSectionV3 } from "@/components/sections/HorizontalCardLinkGridTwoUpSectionV3";
import { OfferTermsSectionV3 } from "@/components/sections/OfferTermsSectionV3";
import { ThreeCardLinkGridSectionV3 } from "@/components/sections/ThreeCardLinkGridSectionV3";
import { ServiceNeedsPriorityGridSectionV3 } from "@/components/sections/ServiceNeedsPriorityGridSectionV3";
import {
  NavCenterLogoSectionV2,
  NavPrimarySectionV2,
} from "@/components/sections/NavPrimarySectionV2";
import { NavFloatingBentoSectionV2 } from "@/components/sections/NavFloatingBentoSectionV2";
import { ProcessImageChecklistSectionV2 } from "@/components/sections/ProcessImageChecklistSectionV2";
import { ProcessImageChecklistSectionV3 } from "@/components/sections/ProcessImageChecklistSectionV3";
import {
  ServicesBentoCardsSectionV2,
  type ServicesBentoCardsVariant,
} from "@/components/sections/ServicesBentoCardsSectionV2";
import { ServicesHoverPanelSectionV2 } from "@/components/sections/ServicesHoverPanelSectionV2";
import { ServicesScrollCardsSectionV2 } from "@/components/sections/ServicesScrollCardsSectionV2";
import { InfoStripSectionV3 } from "@/components/sections/InfoStripSectionV3";
import { ContactStripBentoSectionV3 } from "@/components/sections/ContactStripBentoSectionV3";
import { ContactStripSmallSectionV3 } from "@/components/sections/ContactStripSmallSectionV3";
import { FinancingCalculatorSectionV3 } from "@/components/sections/FinancingCalculatorSectionV3";
import { withSectionToggles } from "@/components/sections/section-toggle-props";
import { ServiceAreaZipLookupSectionV3 } from "@/components/sections/ServiceAreaZipLookupSectionV3";
import { ThankYouConfirmationSectionV3 } from "@/components/sections/ThankYouConfirmationSectionV3";
import { ServicesThreeCardsRightSectionV3 } from "@/components/sections/ServicesThreeCardsRightSectionV3";
import { TestimonialsCarouselSectionV3 } from "@/components/sections/TestimonialsCarouselSectionV3";
import { TestimonialsCarouselCondensedSectionV3 } from "@/components/sections/TestimonialsCarouselCondensedSectionV3";
import { TestimonialsMasonrySectionV2 } from "@/components/sections/TestimonialsMasonrySectionV2";
import { TestimonialsMasonrySectionV3 } from "@/components/sections/TestimonialsMasonrySectionV3";
import { TrustMarqueeSection } from "@/components/sections/TrustMarqueeSection";
import {
  TrustBarFloatingBentoSectionV3,
  TrustBarSectionV3,
  TrustLogoGridSectionV3,
  TrustLogoMarqueeSectionV3,
  TrustMarqueeSectionV3,
} from "@/components/sections/TrustSectionsV3";
import { PagebuilderShell } from "@/components/sections/PagebuilderShell";
import { pagebuilderRecipes, sectionModes } from "@/content/pagebuilder";
import {
  getCanonicalSectionLabel,
  sectionLibraryV3Content,
} from "@/content/section-library-v3";
// The variant sets below this import predate the shared vocabulary and still
// declare their values locally. New axes come from the shared list instead -
// see the header of `section-style-options.ts` for why.
import {
  calloutRevealGridVariantValues,
  calloutSplitPanelVariantValues,
  cardLinkGridAlignValues,
  resolveHeadlineWrap,
  resolveSectionIcons,
  splitBentoVariantValues,
  tableCompareAlignValues,
  type CalloutRevealGridVariant,
  type CalloutSplitPanelVariant,
  type CardLinkGridAlign,
  type TableCompareAlign,
} from "@/content/section-style-options";
import type { PagebuilderRecipeSection } from "@/content/pagebuilder";

const heroSplitFullHeightVariants = new Set<string>(
  sectionLibraryV3Content.heroSplitFullHeight.variants.map(
    (option) => option.variant,
  ),
);

function getHeroSplitFullHeightVariant(section: PagebuilderRecipeSection) {
  return heroSplitFullHeightVariants.has(section.variant ?? "")
    ? (section.variant as HeroSplitFullHeightVariant)
    : undefined;
}

const heroSplitFixedImageVariants = new Set<string>([
  "text-3-image-4-right",
  "text-4-image-3-right",
  "image-3-left-text-4",
  "image-4-left-text-3",
]);

const heroSplitFixedImageRatios = new Set<string>([
  "3-2",
  "2-3",
  "4-3",
  "3-4",
  "5-4",
  "4-5",
]);

const heroCompactAlignments = new Set<string>(["left", "center", "right"]);
const servicesBentoVariants = new Set<string>([
  "default",
  "split-header",
  "offset-header",
]);

function getHeroSplitFixedImageVariant(section: PagebuilderRecipeSection) {
  return heroSplitFixedImageVariants.has(section.variant ?? "")
    ? (section.variant as HeroSplitFixedImageVariant)
    : undefined;
}

function getHeroSplitFixedImageRatio(section: PagebuilderRecipeSection) {
  return heroSplitFixedImageRatios.has(section.ratio ?? "")
    ? (section.ratio as HeroSplitFixedImageRatio)
    : undefined;
}

function getHeroSplitBentoVariant(section: PagebuilderRecipeSection) {
  return splitBentoVariantValues.has(section.variant ?? "")
    ? (section.variant as HeroSplitBentoVariant)
    : undefined;
}

function getContentSplitFixedImageVariant(section: PagebuilderRecipeSection) {
  const baseVariant = (section.variant ?? "").replace(/-size-(up|down)$/, "");

  return heroSplitFixedImageVariants.has(baseVariant)
    ? (baseVariant as ContentSplitFixedImageVariant)
    : undefined;
}

function getContentSplitFixedImageHeadingSizeStep(
  section: PagebuilderRecipeSection,
): -1 | 0 | 1 {
  if (section.variant?.endsWith("-size-up")) {
    return 1;
  }

  if (section.variant?.endsWith("-size-down")) {
    return -1;
  }

  return 0;
}

function getContentSplitFixedImageRatio(section: PagebuilderRecipeSection) {
  return heroSplitFixedImageRatios.has(section.ratio ?? "")
    ? (section.ratio as ContentSplitFixedImageRatio)
    : undefined;
}

function getHeroCompactAlign(section: PagebuilderRecipeSection) {
  const [align] = (section.variant ?? "").split("-");

  return heroCompactAlignments.has(align)
    ? (align as HeroCompactAlign)
    : sectionLibraryV3Content.heroCompact.align;
}

function getContentThreeColumnMixedAlign(section: PagebuilderRecipeSection) {
  return heroCompactAlignments.has(section.variant ?? "")
    ? (section.variant as ContentThreeColumnMixedAlign)
    : sectionLibraryV3Content.contentThreeColumnMixed.align;
}

function getHeroCompactServiceAlign(section: PagebuilderRecipeSection) {
  return heroCompactAlignments.has(section.variant ?? "")
    ? (section.variant as HeroCompactAlign)
    : sectionLibraryV3Content.heroCompactService.align;
}

function getCompactHeaderHeadingSize(
  section: PagebuilderRecipeSection,
): HeroCompactHeadingSize {
  if (section.variant?.endsWith("heading-lg")) {
    return "heading-lg";
  }

  if (section.variant?.endsWith("heading-xl")) {
    return "heading-xl";
  }

  // See PagebuilderShell: the largest size cannot rely on the fallback,
  // because section header content defaults to heading-xl.
  if (section.variant?.endsWith("display-lg")) {
    return "display-lg";
  }

  return section.component === "HeroCompactSectionV3"
    ? sectionLibraryV3Content.heroCompact.headingSize
    : sectionLibraryV3Content.sectionHeaderCompact.headingSize;
}

function getLargeSectionHeaderAlign(section: PagebuilderRecipeSection) {
  const [align] = (section.variant ?? "").split("-");

  return heroCompactAlignments.has(align)
    ? (align as HeroCompactAlign)
    : sectionLibraryV3Content.sectionHeaderLarge.align;
}

// The variant is `{align}-{size}`, so the size is its suffix.
const largeSectionHeaderSizes: readonly LargeSectionHeaderSize[] = [
  "eyebrow",
  "heading-sm",
  "heading-md",
  "heading-lg",
  "heading-xl",
  "display-lg",
  "display-xl",
];

function getLargeSectionHeaderSize(
  section: PagebuilderRecipeSection,
): LargeSectionHeaderSize {
  return (
    largeSectionHeaderSizes.find((size) => section.variant?.endsWith(size)) ??
    "display-xl"
  );
}

function getServicesBentoVariant(section: PagebuilderRecipeSection) {
  return servicesBentoVariants.has(section.variant ?? "")
    ? (section.variant as ServicesBentoCardsVariant)
    : undefined;
}

function getCalloutSplitPanelVariant(section: PagebuilderRecipeSection) {
  return calloutSplitPanelVariantValues.has(section.variant ?? "")
    ? (section.variant as CalloutSplitPanelVariant)
    : undefined;
}

function getCalloutRevealGridVariant(section: PagebuilderRecipeSection) {
  return calloutRevealGridVariantValues.has(section.variant ?? "")
    ? (section.variant as CalloutRevealGridVariant)
    : undefined;
}

// Shares the hero full-height section's four arrangements, so it reuses that
// value set rather than declaring a parallel one.
function getContentSplitFullImageVariant(section: PagebuilderRecipeSection) {
  return heroSplitFullHeightVariants.has(section.variant ?? "")
    ? (section.variant as ContentSplitFullImageVariant)
    : undefined;
}

function getCardLinkGridAlign(section: PagebuilderRecipeSection) {
  return cardLinkGridAlignValues.has(section.align ?? "")
    ? (section.align as CardLinkGridAlign)
    : undefined;
}

function getTableCompareAlign(section: PagebuilderRecipeSection) {
  return tableCompareAlignValues.has(section.align ?? "")
    ? (section.align as TableCompareAlign)
    : undefined;
}

function UnknownSection({ section }: { section: PagebuilderRecipeSection }) {
  return (
    <section className="bg-service-surface p-8 text-service-ink">
      <p className="type-label text-service-accent">Preview unavailable</p>
      <h3 className="type-heading-sm mt-3">
        {getCanonicalSectionLabel(section.component, section.name)}
      </h3>
      <p className="type-text-sm measure-copy mt-3 text-service-muted">
        {section.component} is listed in the recipe but has not been wired into
        the Pagebuilder renderer yet.
      </p>
    </section>
  );
}

/**
 * Render a section from library demo content, with its toggles applied.
 *
 * The toggles are cloned on here rather than passed by each `case`, so a section
 * gets them from its membership sets alone. Applying them at the element the
 * switch returns is what makes that work: the builder canvas used to clone them
 * onto a `previewCatalog` entry, which is a wrapper `<div>`, so the props landed
 * on a DOM node and the section never saw them.
 */
export function renderPreviewSection(
  section: PagebuilderRecipeSection,
  index: number,
) {
  return withSectionToggles(renderSectionElement(section, index), section);
}

function renderSectionElement(
  section: PagebuilderRecipeSection,
  index: number,
) {
  const headingLevel = index === 1 ? 1 : 2;

  switch (section.component) {
    case "NavPrimarySectionV2":
      return <NavPrimarySectionV2 {...sectionLibraryV3Content.navPrimary} />;
    case "NavCenterLogoSectionV2":
      return <NavCenterLogoSectionV2 {...sectionLibraryV3Content.navPrimary} />;
    case "NavFloatingBentoSectionV2":
      return <NavFloatingBentoSectionV2 {...sectionLibraryV3Content.navPrimary} />;
    case "HeroSplitFullHeightSectionV3":
      return (
        <HeroSplitFullHeightSectionV3
          {...sectionLibraryV3Content.heroSplitFullHeight}
          headingLevel={headingLevel}
          variant={getHeroSplitFullHeightVariant(section)}
        />
      );
    case "HeroServiceAreaZipLookupSectionV3":
      return (
        <HeroServiceAreaZipLookupSectionV3
          {...sectionLibraryV3Content.heroServiceAreaZipLookup}
          colorRecipe={section.colorRecipe}
          headingLevel={headingLevel}
          variant={getHeroSplitFullHeightVariant(section)}
        />
      );
    case "HeroSplitFixedImageSectionV3":
      return (
        <HeroSplitFixedImageSectionV3
          {...sectionLibraryV3Content.heroSplitFullHeight}
          headingLevel={headingLevel}
          ratio={getHeroSplitFixedImageRatio(section)}
          variant={getHeroSplitFixedImageVariant(section)}
        />
      );
    case "HeroSplitBentoSectionV3":
      return (
        <HeroSplitBentoSectionV3
          {...sectionLibraryV3Content.heroSplitFullHeight}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          headingLevel={headingLevel}
          variant={getHeroSplitBentoVariant(section)}
        />
      );
    case "HeroFullscreenSectionV2":
      return (
        <HeroFullscreenSectionV2
          {...sectionLibraryV3Content.heroFullscreen}
          headingLevel={headingLevel}
        />
      );
    case "HeroCenteredFloatersSectionV2":
      return (
        <HeroCenteredFloatersSectionV2
          {...sectionLibraryV3Content.hero}
          headingLevel={headingLevel}
        />
      );
    case "HeroContentTopImageBottomSectionV2":
      return (
        <HeroContentTopImageBottomSectionV2
          {...sectionLibraryV3Content.hero}
          headingLevel={headingLevel}
        />
      );
    case "HeroCompactSectionV3":
      return (
        <HeroCompactSectionV3
          {...sectionLibraryV3Content.heroCompact}
          align={getHeroCompactAlign(section)}
          headingLevel={headingLevel}
          headingSize={getCompactHeaderHeadingSize(section)}
        />
      );
    case "HeroServicesSectionV3":
      return (
        <HeroServicesSectionV3
          {...sectionLibraryV3Content.heroServices}
          headingLevel={headingLevel}
        />
      );
    case "HeroCompactServiceSectionV3":
      return (
        <HeroCompactServiceSectionV3
          {...sectionLibraryV3Content.heroCompactService}
          align={getHeroCompactServiceAlign(section)}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          headingLevel={headingLevel}
        />
      );
    case "SectionHeaderCompactSectionV3":
      return (
        <SectionHeaderCompactSectionV3
          {...sectionLibraryV3Content.sectionHeaderCompact}
          align={getHeroCompactAlign(section)}
          headingLevel={2}
          headingSize={getCompactHeaderHeadingSize(section)}
        />
      );
    case "SectionHeaderLargeSectionV3":
      return (
        <SectionHeaderLargeSectionV3
          {...sectionLibraryV3Content.sectionHeaderLarge}
          align={getLargeSectionHeaderAlign(section)}
          headingLevel={2}
          headlineWrap={resolveHeadlineWrap(section.headlineWrap)}
          size={getLargeSectionHeaderSize(section)}
        />
      );
    case "TrustBarSectionV3":
      return <TrustBarSectionV3 {...sectionLibraryV3Content.trustBar} />;
    case "TrustBarFloatingBentoSectionV3":
      return (
        <TrustBarFloatingBentoSectionV3
          {...sectionLibraryV3Content.trustBar}
        />
      );
    case "TrustMarqueeSection":
      return <TrustMarqueeSection {...sectionLibraryV3Content.trustMarquee} />;
    case "TrustMarqueeSectionV3":
      return <TrustMarqueeSectionV3 {...sectionLibraryV3Content.trustMarquee} />;
    case "TrustLogoMarqueeSectionV3":
      return (
        <TrustLogoMarqueeSectionV3
          {...sectionLibraryV3Content.trustLogoMarquee}
        />
      );
    case "TrustLogoGridSectionV3":
      return (
        <TrustLogoGridSectionV3
          {...sectionLibraryV3Content.trustLogoMarquee}
        />
      );
    case "ServicesBentoCardsSectionV2":
      return (
        <ServicesBentoCardsSectionV2
          {...sectionLibraryV3Content.servicesBento}
          variant={getServicesBentoVariant(section)}
        />
      );
    case "FourCardLinkGridSectionV3":
      return (
        <FourCardLinkGridSectionV3
          {...sectionLibraryV3Content.fourCardLinkGrid}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          showImages={section.variant !== "text-only"}
        />
      );
    case "ServiceCalloutRevealGridSectionV3":
      return (
        <ServiceCalloutRevealGridSectionV3
          {...sectionLibraryV3Content.serviceCalloutRevealGrid}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          variant={getCalloutRevealGridVariant(section)}
        />
      );
    case "ServiceCalloutSplitPanelSectionV3":
      return (
        <ServiceCalloutSplitPanelSectionV3
          {...sectionLibraryV3Content.serviceCalloutSplitPanel}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          variant={getCalloutSplitPanelVariant(section)}
        />
      );
    case "ThreeCardLinkGridSectionV3":
      return (
        <ThreeCardLinkGridSectionV3
          {...sectionLibraryV3Content.threeCardLinkGrid}
          align={getCardLinkGridAlign(section)}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          showImages={section.variant !== "text-only"}
        />
      );
    case "HorizontalCardLinkGridSectionV3":
      return (
        <HorizontalCardLinkGridSectionV3
          {...sectionLibraryV3Content.horizontalCardLinkGrid}
          align={getCardLinkGridAlign(section)}
        />
      );
    case "HorizontalCardLinkGridTwoUpSectionV3":
      return (
        <HorizontalCardLinkGridTwoUpSectionV3
          {...sectionLibraryV3Content.horizontalCardLinkGridTwoUp}
          align={getTableCompareAlign(section)}
        />
      );
    case "OfferTermsSectionV3":
      return (
        <OfferTermsSectionV3
          {...sectionLibraryV3Content.offerTerms}
        />
      );
    case "ServiceNeedsPriorityGridSectionV3":
      return (
        <ServiceNeedsPriorityGridSectionV3
          {...sectionLibraryV3Content.serviceNeedsPriorityGrid}
          align={section.variant?.startsWith("left") ? "left" : "right"}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          compactPriorityCard={Boolean(section.variant?.includes("compact"))}
        />
      );
    case "ServicesHoverPanelSectionV2":
      return (
        <ServicesHoverPanelSectionV2
          {...sectionLibraryV3Content.servicesHoverPanel}
        />
      );
    case "ServicesThreeCardsRightSectionV3":
      return (
        <ServicesThreeCardsRightSectionV3
          {...sectionLibraryV3Content.servicesThreeCardsRight}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
        />
      );
    case "ServicesScrollCardsSectionV2":
      return (
        <ServicesScrollCardsSectionV2
          {...sectionLibraryV3Content.servicesScrollCards}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
        />
      );
    case "ContentHorizontalCardCarouselSectionV2":
      return (
        <ContentHorizontalCardCarouselSectionV2
          {...sectionLibraryV3Content.contentHorizontalCardCarousel}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
        />
      );
    case "ContentPhotoGalleryCarouselSectionV3":
      return (
        <ContentPhotoGalleryCarouselSectionV3
          {...sectionLibraryV3Content.contentPhotoGalleryCarousel}
        />
      );
    case "ContentPhotoGalleryLargeCarouselSectionV3":
      return (
        <ContentPhotoGalleryLargeCarouselSectionV3
          {...sectionLibraryV3Content.contentPhotoGalleryCarousel}
        />
      );
    case "ProjectCaseStudyGallerySectionV3":
      return (
        <ProjectCaseStudyGallerySectionV3
          {...sectionLibraryV3Content.projectCaseStudyGallery}
        />
      );
    case "ImageStripSectionV3":
      return <ImageStripSectionV3 {...sectionLibraryV3Content.imageStrip} />;
    case "QuickPageLinksSectionV2":
      return (
        <QuickPageLinksSectionV2
          {...sectionLibraryV3Content.quickPageLinks}
        />
      );
    case "ContentRevealParagraphSectionV2":
      return (
        <ContentRevealParagraphSectionV2
          {...sectionLibraryV3Content.contentRevealParagraph}
        />
      );
    case "ContentScrollWrittenRevealSectionV2":
      return (
        <ContentScrollWrittenRevealSectionV2
          {...sectionLibraryV3Content.contentScrollWrittenReveal}
        />
      );
    case "ContentSplitHeadlineImageSectionV2":
      return (
        <ContentSplitHeadlineImageSectionV2
          {...sectionLibraryV3Content.contentSplitHeadlineImage}
        />
      );
    case "ContentSplitFixedImageSectionV3":
      return (
        <ContentSplitFixedImageSectionV3
          {...sectionLibraryV3Content.contentSplitFixedImage}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          headingLevel={headingLevel}
          headingSizeStep={getContentSplitFixedImageHeadingSizeStep(section)}
          ratio={getContentSplitFixedImageRatio(section)}
          variant={getContentSplitFixedImageVariant(section)}
        />
      );
    case "ContentSplitFullImageSectionV3":
      return (
        // No headingLevel: the surrounding renderer promotes a first section to
        // h1, and this one is narrative - it is never the page's headline. It
        // holds its h2 default wherever it lands.
        <ContentSplitFullImageSectionV3
          {...sectionLibraryV3Content.contentSplitFullImage}
          colorRecipe={section.colorRecipe}
          variant={getContentSplitFullImageVariant(section)}
        />
      );
    case "ContentMainIdeaGridSectionV3":
      return (
        <ContentMainIdeaGridSectionV3
          {...sectionLibraryV3Content.contentMainIdeaGrid}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
        />
      );
    case "ContentStickyCardStreamSectionV2":
      return (
        <ContentStickyCardStreamSectionV2
          {...sectionLibraryV3Content.contentStickyCardStream}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          showImage={section.variant === "with-images"}
        />
      );
    case "ContentStickyIdeasSectionV2":
      return (
        <ContentStickyIdeasSectionV2
          {...sectionLibraryV3Content.contentStickyIdeas}
        />
      );
    case "ContentAboutCompanySectionV2":
      return (
        <ContentAboutCompanySectionV2
          {...sectionLibraryV3Content.contentAboutCompany}
        />
      );
    case "ContentAboutStorySectionV3":
      return (
        <ContentAboutStorySectionV3
          {...sectionLibraryV3Content.contentAboutStory}
        />
      );
    case "ContentNarrativeFeatureRailSectionV3":
      return (
        <ContentNarrativeFeatureRailSectionV3
          {...sectionLibraryV3Content.contentNarrativeFeatureRail}
          align={section.variant?.startsWith("left") ? "left" : "right"}
          showImage={!section.variant?.includes("text-only")}
        />
      );
    case "ContentCardTwoUpSectionV3":
      return (
        <ContentCardTwoUpSectionV3
          {...sectionLibraryV3Content.contentCardTwoUp}
          align={
            section.variant === "center" || section.variant === "right"
              ? section.variant
              : "left"
          }
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
        />
      );
    case "ContentThreeColumnMixedSectionV3":
      return (
        <ContentThreeColumnMixedSectionV3
          {...sectionLibraryV3Content.contentThreeColumnMixed}
          align={getContentThreeColumnMixedAlign(section)}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
        />
      );
    case "ContentRuleHeaderSectionV2":
      return (
        <ContentRuleHeaderSectionV2
          {...sectionLibraryV3Content.contentRuleHeader}
        />
      );
    case "FeaturePortraitParagraphSectionV3":
      return (
        <FeaturePortraitParagraphSectionV3
          {...sectionLibraryV3Content.featurePortraitParagraph}
        />
      );
    case "FeatureOverlapRowsSectionV3":
      return (
        <FeatureOverlapRowsSectionV3
          {...sectionLibraryV3Content.featureOverlapRows}
        />
      );
    case "FeatureAsymmetricCardsSectionV3":
      return (
        <FeatureAsymmetricCardsSectionV3
          {...sectionLibraryV3Content.featureAsymmetricCards}
          align={section.variant === "right" ? "right" : "left"}
        />
      );
    case "FeatureStackedCardsSectionV3":
      return (
        <FeatureStackedCardsSectionV3
          {...sectionLibraryV3Content.featureStackedCards}
        />
      );
    case "DecisionSplitDecisionSectionV3":
      return (
        <DecisionSplitDecisionSectionV3
          {...sectionLibraryV3Content.decisionSplitDecision}
        />
      );
    case "DecisionMatrixCardSectionV3":
      return (
        <DecisionMatrixCardSectionV3
          {...sectionLibraryV3Content.decisionMatrixCard}
          align={getTableCompareAlign(section)}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
        />
      );
    case "DecisionSplitLargeCardsSectionV3":
      return (
        <DecisionSplitLargeCardsSectionV3
          {...sectionLibraryV3Content.decisionSplitLargeCards}
          align={getTableCompareAlign(section)}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          cardLinks={section.cardLinks === "off" ? "off" : "on"}
          icons={resolveSectionIcons(section.icons)}
        />
      );
    case "SectionHeaderSplitLinkSectionV3":
      return (
        <SectionHeaderSplitLinkSectionV3
          {...sectionLibraryV3Content.sectionHeaderSplitLink}
          headingLevel={headingLevel}
        />
      );
    case "DecisionSplitDecisionLargeSectionV3":
      return (
        <DecisionSplitDecisionLargeSectionV3
          {...sectionLibraryV3Content.decisionSplitDecisionLarge}
        />
      );
    case "DecisionQuestionTableSectionV3":
      return (
        <DecisionQuestionTableSectionV3
          {...sectionLibraryV3Content.decisionQuestionTable}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
        />
      );
    case "DecisionQuestionTableFourSectionV3":
      return (
        <DecisionQuestionTableFourSectionV3
          {...sectionLibraryV3Content.decisionQuestionTableFour}
          align={getTableCompareAlign(section)}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
        />
      );
    case "FAQSectionV3":
      return <FAQSectionV3 {...sectionLibraryV3Content.faq} />;
    case "FAQAccordionSectionV3":
      return <FAQAccordionSectionV3 {...sectionLibraryV3Content.faqAccordion} />;
    case "FAQAccordionSidebarSectionV3":
      return (
        <FAQAccordionSidebarSectionV3
          {...sectionLibraryV3Content.faqAccordionSidebar}
          align={section.variant === "left" ? "left" : "right"}
        />
      );
    case "TestimonialsSectionV3":
      return <TestimonialsSectionV3 {...sectionLibraryV3Content.testimonials} />;
    case "TestimonialsCarouselSectionV3":
      return (
        <TestimonialsCarouselSectionV3
          items={sectionLibraryV3Content.testimonialsCarousel.items}
        />
      );
    case "TestimonialsCarouselCondensedSectionV3":
      return (
        <TestimonialsCarouselCondensedSectionV3
          {...sectionLibraryV3Content.testimonialsCarousel}
        />
      );
    case "TestimonialsMasonrySectionV2":
      return (
        <TestimonialsMasonrySectionV2
          {...sectionLibraryV3Content.testimonialsMasonry}
        />
      );
    case "TestimonialsMasonrySectionV3":
      return (
        <TestimonialsMasonrySectionV3
          {...sectionLibraryV3Content.testimonialsMasonry}
        />
      );
    case "ProcessImageChecklistSectionV2":
      return (
        <ProcessImageChecklistSectionV2
          {...sectionLibraryV3Content.processImageChecklist}
        />
      );
    case "ProcessImageChecklistSectionV3":
      return (
        <ProcessImageChecklistSectionV3
          {...sectionLibraryV3Content.processImageChecklist}
        />
      );
    case "ProcessStepsSectionV3":
      return <ProcessStepsSectionV3 {...sectionLibraryV3Content.process} />;
    case "ProcessStripSectionV3":
      return <ProcessStripSectionV3 {...sectionLibraryV3Content.processStrip} />;
    case "ProcessStepsStaggeredSectionV3":
      return (
        <ProcessStepsStaggeredSectionV3
          {...sectionLibraryV3Content.processStepsStaggered}
        />
      );
    case "ProcessStepsBranchingSectionV3":
      return (
        <ProcessStepsBranchingSectionV3
          {...sectionLibraryV3Content.processStepsBranching}
          align={section.align === "center" ? "center" : "left"}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
        />
      );
    case "CTASectionV3":
      return <CTASectionV3 {...sectionLibraryV3Content.cta} />;
    case "CTAImageSectionV3":
      return (
        <CTAImageSectionV3
          {...sectionLibraryV3Content.ctaImage}
          align={section.variant === "right" ? "right" : "left"}
        />
      );
    case "CTASmallBandImageSectionV3":
      return (
        <CTASmallBandImageSectionV3
          {...sectionLibraryV3Content.ctaSmallBandImage}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          colorRecipe={section.colorRecipe}
        />
      );
    case "CTAServiceTriageSectionV3":
      return (
        <CTAServiceTriageSectionV3
          {...sectionLibraryV3Content.ctaServiceTriage}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          colorRecipe={section.colorRecipe}
          icons={resolveSectionIcons(section.icons)}
        />
      );
    case "FeaturedOfferSectionV3":
      return (
        <FeaturedOfferSectionV3
          {...sectionLibraryV3Content.featuredOffer}
          align={section.variant === "right" ? "right" : "left"}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          icons={resolveSectionIcons(section.icons)}
        />
      );
    case "AdditionalOffersSectionV3":
      return (
        <AdditionalOffersSectionV3
          {...sectionLibraryV3Content.additionalOffers}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          icons={resolveSectionIcons(section.icons)}
        />
      );
    case "CTAMutedSectionV3":
      return <CTAMutedSectionV3 {...sectionLibraryV3Content.ctaMuted} />;
    case "CTAFullscreenSectionV2":
      return <CTAFullscreenSectionV2 {...sectionLibraryV3Content.ctaFullscreen} />;
    case "CTAFullscreenSectionV3":
      return <CTAFullscreenSectionV3 {...sectionLibraryV3Content.ctaFullscreen} />;
    case "CTAScrollRevealOfferSectionV2":
      return (
        <CTAScrollRevealOfferSectionV2
          {...sectionLibraryV3Content.ctaScrollRevealOffer}
        />
      );
    case "CTAScrollRevealOfferSectionV3":
      return (
        <CTAScrollRevealOfferSectionV3
          {...sectionLibraryV3Content.ctaScrollRevealOffer}
        />
      );
    case "ContentFixedCoverFadeSectionV2":
      return (
        <ContentFixedCoverFadeSectionV2
          {...sectionLibraryV3Content.contentFixedCoverFade}
        />
      );
    case "ContactSectionV2":
      return <ContactSectionV2 {...sectionLibraryV3Content.contact} />;
    case "InfoStripSectionV3":
      return <InfoStripSectionV3 {...sectionLibraryV3Content.infoStrip} />;
    case "ContactStripSmallSectionV3":
      return (
        <ContactStripSmallSectionV3
          {...sectionLibraryV3Content.contactStripSmall}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          colorRecipe={section.colorRecipe}
          icons={resolveSectionIcons(section.icons)}
        />
      );
    case "ContactStripBentoSectionV3":
      return (
        <ContactStripBentoSectionV3
          {...sectionLibraryV3Content.contactStripBento}
          cardBorder={section.cardBorder}
          cardFill={section.cardFill}
          colorRecipe={section.colorRecipe}
          icons={resolveSectionIcons(section.icons)}
        />
      );
    case "FinancingCalculatorSectionV3":
      return (
        <FinancingCalculatorSectionV3
          {...sectionLibraryV3Content.financingCalculator}
        />
      );
    case "ServiceAreaZipLookupSectionV3":
      return (
        <ServiceAreaZipLookupSectionV3
          {...sectionLibraryV3Content.serviceAreaZipLookup}
        />
      );
    case "ContactSectionV3":
      return <ContactSectionV3 {...sectionLibraryV3Content.contact} />;
    case "ThankYouConfirmationSectionV3":
      return (
        <ThankYouConfirmationSectionV3
          {...sectionLibraryV3Content.thankYouConfirmation}
          headingLevel={2}
        />
      );
    case "ContactSectionModalBegin":
      return (
        <ContactSectionModalBegin
          {...sectionLibraryV3Content.contactModalBegin}
        />
      );
    case "FooterSectionV2":
      return <FooterSectionV2 {...sectionLibraryV3Content.footer} />;
    case "FooterSectionV3":
      return <FooterSectionV3 {...sectionLibraryV3Content.footer} />;
    case "FooterHorizontalSectionV3":
      return <FooterHorizontalSectionV3 {...sectionLibraryV3Content.footer} />;
    case "FooterCompactSectionV3":
      return <FooterCompactSectionV3 {...sectionLibraryV3Content.footer} />;
    case "FooterLinkPanelSectionV3":
      return <FooterLinkPanelSectionV3 {...sectionLibraryV3Content.footer} />;
    default:
      return <UnknownSection section={section} />;
  }
}

export function PagebuilderSection() {

  return (
    <PagebuilderShell
      recipes={pagebuilderRecipes}
      renderLibrarySection={renderPreviewSection}
      sectionModes={sectionModes}
    />
  );
}
