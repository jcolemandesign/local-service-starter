import type { Metadata } from "next";
import { Container } from "@/components/primitives";
import {
  ContentAboutCompanySectionV2,
  ContentAboutStorySectionV3,
  ContentFixedCoverFadeSectionV2,
  ContentHorizontalCardCarouselSectionV2,
  ContentMainIdeaGridSectionV3,
  ContentPhotoGalleryCarouselSectionV3,
  ContentPhotoGalleryLargeCarouselSectionV3,
  ProjectCaseStudyGallerySectionV3,
  ContentRevealParagraphSectionV2,
  ContentRuleHeaderSectionV2,
  ContentScrollWrittenRevealSectionV2,
  ContentStickyCardStreamSectionV2,
  ContentStickyIdeasSectionV2,
  ContentSplitHeadlineImageSectionV2,
  ImageStripSectionV3,
  ContactSectionModalBegin,
  ContactSectionV3,
  CTAFullscreenSectionV3,
  CTAMutedSectionV3,
  CTASectionV3,
  CTAScrollRevealOfferSectionV3,
  DecisionSplitDecisionSectionV3,
  DecisionSplitDecisionLargeSectionV3,
  DecisionSplitLargeCardsSectionV3,
  FAQAccordionSectionV3,
  FAQSectionV3,
  FeatureAsymmetricCardsSectionV3,
  FeatureStackedCardsSectionV3,
  FeatureOverlapRowsSectionV3,
  FeaturePortraitParagraphSectionV3,
  FooterCompactSectionV3,
  FooterHorizontalSectionV3,
  FooterLinkPanelSectionV3,
  FooterSectionV3,
  FourCardLinkGridSectionV3,
  ThreeCardLinkGridSectionV3,
  ServiceNeedsPriorityGridSectionV3,
  HeroCenteredFloatersSectionV2,
  HeroCompactSectionV3,
  HeroServicesSectionV3,
  HeroContentTopImageBottomSectionV2,
  HeroFullscreenSectionV2,
  NavCenterLogoSectionV2,
  NavFloatingBentoSectionV2,
  NavPrimarySectionV2,
  ProcessImageChecklistSectionV3,
  ProcessStepsSectionV3,
  QuickPageLinksSectionV2,
  ServicesBentoCardsSectionV2,
  ServicesHoverPanelSectionV2,
  ServicesScrollCardsSectionV2,
  SectionHeaderCompactSectionV3,
  SectionHeaderLargeSectionV3,
  SectionLibraryV3Accordions,
  ServiceAreaZipLookupSectionV3,
  ServicesThreeCardsRightSectionV3,
  TestimonialsCarouselCondensedSectionV3,
  TestimonialsCarouselSectionV3,
  TestimonialsMasonrySectionV3,
  TestimonialsSectionV3,
  ThankYouConfirmationSectionV3,
  TrustBarBentoAboutSectionV3,
  TrustBarFloatingBentoSectionV3,
  TrustBarSectionV3,
  TrustLogoGridSectionV3,
  TrustLogoMarqueeSectionV3,
  TrustMarqueeSection,
  TrustMarqueeSectionV3,
} from "@/components/sections";
import { HeroSplitFixedImageSectionLibraryDemo } from "@/components/sections/HeroSplitFixedImageSectionLibraryDemo";
import { HeroSplitFullImageSectionLibraryDemo } from "@/components/sections/HeroSplitFullImageSectionLibraryDemo";
import { ContentSplitFixedImageSectionLibraryDemo } from "@/components/sections/ContentSplitFixedImageSectionLibraryDemo";
import {
  sectionLibraryV3Collections,
  sectionLibraryV3Content,
} from "@/content/section-library-v3";
import { StyleGuideCloseAllButton } from "@/components/sections/StyleGuideCloseAllButton";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";

export const metadata: Metadata = {
  title: "Section Library",
  description:
    "Current internal section library for seven-column layout system sections.",
};

const sectionElements = {
  "nav-primary-v2": (
    <NavPrimarySectionV2 {...sectionLibraryV3Content.navPrimary} />
  ),
  "nav-center-logo-v2": (
    <NavCenterLogoSectionV2 {...sectionLibraryV3Content.navPrimary} />
  ),
  "nav-floating-bento-v2": (
    <NavFloatingBentoSectionV2 {...sectionLibraryV3Content.navPrimary} />
  ),
  "hero-fullscreen-v2": (
    <HeroFullscreenSectionV2
      {...sectionLibraryV3Content.heroFullscreen}
      headingLevel={2}
    />
  ),
  "hero-centered-floaters-v2": (
    <HeroCenteredFloatersSectionV2
      {...sectionLibraryV3Content.hero}
      headingLevel={2}
    />
  ),
  "hero-content-top-image-bottom-v2": (
    <HeroContentTopImageBottomSectionV2
      {...sectionLibraryV3Content.hero}
      headingLevel={2}
    />
  ),
  "hero-split-full-height-v3": (
    <HeroSplitFullImageSectionLibraryDemo
      {...sectionLibraryV3Content.heroSplitFullHeight}
      headingLevel={2}
    />
  ),
  "hero-split-fixed-image-v3": (
    <HeroSplitFixedImageSectionLibraryDemo
      {...sectionLibraryV3Content.heroSplitFullHeight}
      headingLevel={2}
    />
  ),
  "hero-compact-v3": (
    <HeroCompactSectionV3
      {...sectionLibraryV3Content.heroCompact}
      headingLevel={2}
    />
  ),
  "hero-services-v3": (
    <HeroServicesSectionV3
      {...sectionLibraryV3Content.heroServices}
      headingLevel={2}
    />
  ),
  "section-header-compact-v3": (
    <SectionHeaderCompactSectionV3
      {...sectionLibraryV3Content.sectionHeaderCompact}
      headingLevel={2}
    />
  ),
  "section-header-large-v3": (
    <SectionHeaderLargeSectionV3
      {...sectionLibraryV3Content.sectionHeaderLarge}
      headingLevel={2}
    />
  ),
  "content-reveal-paragraph-v2": (
    <ContentRevealParagraphSectionV2
      {...sectionLibraryV3Content.contentRevealParagraph}
    />
  ),
  "content-scroll-written-reveal-v2": (
    <ContentScrollWrittenRevealSectionV2
      {...sectionLibraryV3Content.contentScrollWrittenReveal}
    />
  ),
  "content-sticky-card-stream-v2": (
    <ContentStickyCardStreamSectionV2
      {...sectionLibraryV3Content.contentStickyCardStream}
    />
  ),
  "content-sticky-ideas-v2": (
    <ContentStickyIdeasSectionV2
      {...sectionLibraryV3Content.contentStickyIdeas}
    />
  ),
  "content-main-idea-grid-v3": (
    <ContentMainIdeaGridSectionV3
      {...sectionLibraryV3Content.contentMainIdeaGrid}
    />
  ),
  "content-about-company-v2": (
    <ContentAboutCompanySectionV2
      {...sectionLibraryV3Content.contentAboutCompany}
    />
  ),
  "content-about-story-v3": (
    <ContentAboutStorySectionV3
      {...sectionLibraryV3Content.contentAboutStory}
    />
  ),
  "content-split-headline-image-v2": (
    <ContentSplitHeadlineImageSectionV2
      {...sectionLibraryV3Content.contentSplitHeadlineImage}
    />
  ),
  "content-split-fixed-image-v3": (
    <ContentSplitFixedImageSectionLibraryDemo
      {...sectionLibraryV3Content.heroSplitFullHeight}
      headingLevel={2}
    />
  ),
  "content-rule-header-v2": (
    <ContentRuleHeaderSectionV2
      {...sectionLibraryV3Content.contentRuleHeader}
    />
  ),
  "content-horizontal-card-carousel-v2": (
    <ContentHorizontalCardCarouselSectionV2
      {...sectionLibraryV3Content.contentHorizontalCardCarousel}
    />
  ),
  "content-photo-gallery-carousel-v3": (
    <ContentPhotoGalleryCarouselSectionV3
      {...sectionLibraryV3Content.contentPhotoGalleryCarousel}
    />
  ),
  "content-photo-gallery-large-carousel-v3": (
    <ContentPhotoGalleryLargeCarouselSectionV3
      {...sectionLibraryV3Content.contentPhotoGalleryCarousel}
    />
  ),
  "project-case-study-gallery-v3": (
    <ProjectCaseStudyGallerySectionV3
      {...sectionLibraryV3Content.projectCaseStudyGallery}
    />
  ),
  "image-strip-v3": (
    <ImageStripSectionV3 {...sectionLibraryV3Content.imageStrip} />
  ),
  "content-fixed-cover-fade-v2": (
    <ContentFixedCoverFadeSectionV2
      {...sectionLibraryV3Content.contentFixedCoverFade}
    />
  ),
  "feature-portrait-paragraph-v3": (
    <FeaturePortraitParagraphSectionV3
      {...sectionLibraryV3Content.featurePortraitParagraph}
    />
  ),
  "feature-overlap-rows-v3": (
    <FeatureOverlapRowsSectionV3
      {...sectionLibraryV3Content.featureOverlapRows}
    />
  ),
  "feature-asymmetric-cards-v3": (
    <FeatureAsymmetricCardsSectionV3
      {...sectionLibraryV3Content.featureAsymmetricCards}
    />
  ),
  "feature-stacked-cards-v3": (
    <FeatureStackedCardsSectionV3
      {...sectionLibraryV3Content.featureStackedCards}
    />
  ),
  "decision-split-decision-v3": (
    <DecisionSplitDecisionSectionV3
      {...sectionLibraryV3Content.decisionSplitDecision}
    />
  ),
  "decision-split-large-cards-v3": (
    <DecisionSplitLargeCardsSectionV3
      {...sectionLibraryV3Content.decisionSplitLargeCards}
    />
  ),
  "decision-split-decision-large-v3": (
    <DecisionSplitDecisionLargeSectionV3
      {...sectionLibraryV3Content.decisionSplitDecisionLarge}
    />
  ),
  "services-three-cards-right-v3": (
    <ServicesThreeCardsRightSectionV3
      {...sectionLibraryV3Content.servicesThreeCardsRight}
    />
  ),
  "services-bento-cards-v2": (
    <ServicesBentoCardsSectionV2 {...sectionLibraryV3Content.servicesBento} />
  ),
  "four-card-link-grid-v3": (
    <FourCardLinkGridSectionV3
      {...sectionLibraryV3Content.fourCardLinkGrid}
    />
  ),
  "three-card-link-grid-v3": (
    <ThreeCardLinkGridSectionV3
      {...sectionLibraryV3Content.threeCardLinkGrid}
    />
  ),
  "service-needs-priority-grid-v3": (
    <ServiceNeedsPriorityGridSectionV3
      {...sectionLibraryV3Content.serviceNeedsPriorityGrid}
    />
  ),
  "services-hover-panel-v2": (
    <ServicesHoverPanelSectionV2
      {...sectionLibraryV3Content.servicesHoverPanel}
    />
  ),
  "services-scroll-cards-v2": (
    <ServicesScrollCardsSectionV2
      {...sectionLibraryV3Content.servicesScrollCards}
    />
  ),
  "process-steps-v3": (
    <ProcessStepsSectionV3 {...sectionLibraryV3Content.process} />
  ),
  "process-image-checklist-v3": (
    <ProcessImageChecklistSectionV3
      {...sectionLibraryV3Content.processImageChecklist}
    />
  ),
  "testimonials-v3": (
    <TestimonialsSectionV3 {...sectionLibraryV3Content.testimonials} />
  ),
  "testimonials-carousel-v3": (
    <TestimonialsCarouselSectionV3
      {...sectionLibraryV3Content.testimonialsCarousel}
    />
  ),
  "testimonials-carousel-condensed-v3": (
    <TestimonialsCarouselCondensedSectionV3
      {...sectionLibraryV3Content.testimonialsCarousel}
    />
  ),
  "testimonials-masonry-v3": (
    <TestimonialsMasonrySectionV3
      {...sectionLibraryV3Content.testimonialsMasonry}
    />
  ),
  "faq-v3": <FAQSectionV3 {...sectionLibraryV3Content.faq} />,
  "faq-accordion-v3": (
    <FAQAccordionSectionV3 {...sectionLibraryV3Content.faqAccordion} />
  ),
  "cta-v3": <CTASectionV3 {...sectionLibraryV3Content.cta} />,
  "cta-muted-v3": <CTAMutedSectionV3 {...sectionLibraryV3Content.cta} />,
  "cta-fullscreen-v3": (
    <CTAFullscreenSectionV3 {...sectionLibraryV3Content.ctaFullscreen} />
  ),
  "cta-scroll-reveal-offer-v3": (
    <CTAScrollRevealOfferSectionV3
      {...sectionLibraryV3Content.ctaScrollRevealOffer}
    />
  ),
  "service-area-zip-lookup-v3": (
    <ServiceAreaZipLookupSectionV3
      {...sectionLibraryV3Content.serviceAreaZipLookup}
    />
  ),
  "contact-v3": <ContactSectionV3 {...sectionLibraryV3Content.contact} />,
  "contact-modal-begin-v3": (
    <ContactSectionModalBegin
      {...sectionLibraryV3Content.contactModalBegin}
    />
  ),
  "thank-you-confirmation-v3": (
    <ThankYouConfirmationSectionV3
      {...sectionLibraryV3Content.thankYouConfirmation}
      headingLevel={2}
    />
  ),
  "footer-v3": <FooterSectionV3 {...sectionLibraryV3Content.footer} />,
  "footer-horizontal-v3": (
    <FooterHorizontalSectionV3 {...sectionLibraryV3Content.footer} />
  ),
  "quick-page-links-v2": (
    <QuickPageLinksSectionV2 {...sectionLibraryV3Content.quickPageLinks} />
  ),
  "footer-compact-v3": (
    <FooterCompactSectionV3 {...sectionLibraryV3Content.footer} />
  ),
  "footer-link-panel-v3": (
    <FooterLinkPanelSectionV3 {...sectionLibraryV3Content.footer} />
  ),
  "trust-bar-v3": (
    <TrustBarSectionV3 {...sectionLibraryV3Content.trustBar} />
  ),
  "trust-bar-floating-bento-v3": (
    <TrustBarFloatingBentoSectionV3
      {...sectionLibraryV3Content.trustBar}
    />
  ),
  "trust-bar-bento-about-v3": (
    <TrustBarBentoAboutSectionV3
      {...sectionLibraryV3Content.trustBar}
    />
  ),
  "trust-marquee-v3": (
    <TrustMarqueeSectionV3 {...sectionLibraryV3Content.trustMarquee} />
  ),
  "trust-marquee-legacy": (
    <TrustMarqueeSection {...sectionLibraryV3Content.trustMarquee} />
  ),
  "trust-logo-marquee-v3": (
    <TrustLogoMarqueeSectionV3
      {...sectionLibraryV3Content.trustLogoMarquee}
    />
  ),
  "trust-logo-grid-v3": (
    <TrustLogoGridSectionV3
      {...sectionLibraryV3Content.trustLogoMarquee}
    />
  ),
} as const;

const collections = sectionLibraryV3Collections.map((collection) => ({
  ...collection,
  items: [...collection.items]
    .sort((first, second) => first.label.localeCompare(second.label))
    .map((item) => ({
      label: item.label,
      element: sectionElements[item.component as keyof typeof sectionElements],
    })),
}));

const sectionTemplateCount = sectionLibraryV3Collections.reduce(
  (total, collection) => total + collection.items.length,
  0,
);

export default function SectionsV3Page() {
  return (
    <StyleGuidePreviewSurface>
      <main className="token-chrome min-h-svh">
        <section
          className="section-space-sml border-b border-[var(--chrome-border-soft)] bg-[var(--chrome-bg)]"
        >
          <Container className="grid gap-4">
            <p className="token-chrome-muted type-label">Internal Library</p>
            <h1 className="type-display-lg">Section Library</h1>
            <p className="token-chrome-muted type-text-xl measure-copy wrap-pretty">
              {sectionTemplateCount} reusable section templates grouped by
              pagebuilder mode.
            </p>
          </Container>
        </section>

        <SectionLibraryV3Accordions collections={collections} />
        <StyleGuideCloseAllButton />
      </main>
    </StyleGuidePreviewSurface>
  );
}
