import type { Metadata } from "next";
import { Container } from "@/components/primitives";
import {
  ContentAboutCompanySectionV2,
  ContentFixedCoverFadeSectionV2,
  ContentHorizontalCardCarouselSectionV2,
  ContentRevealParagraphSectionV2,
  ContentRuleHeaderSectionV2,
  ContentScrollWrittenRevealSectionV2,
  ContentStickyCardStreamSectionV2,
  ContentStickyIdeasSectionV2,
  ContentSplitHeadlineImageSectionV2,
  ContactSectionV3,
  CTAFullscreenSectionV3,
  CTASectionV3,
  CTAScrollRevealOfferSectionV3,
  DecisionSplitDecisionSectionV3,
  DecisionSplitLargeCardsSectionV3,
  FAQAccordionSectionV3,
  FAQSectionV3,
  FeatureAsymmetricCardsSectionV3,
  FeatureOverlapRowsSectionV3,
  FeaturePortraitParagraphSectionV3,
  FooterCompactSectionV3,
  FooterHorizontalSectionV3,
  FooterLinkPanelSectionV3,
  FooterSectionV3,
  HeroCenteredFloatersSectionV2,
  HeroContentTopImageBottomSectionV2,
  HeroFullscreenSectionV2,
  HeroGridMosaicSectionV2,
  NavCenterLogoSectionV2,
  NavFloatingBentoSectionV2,
  NavPrimarySectionV2,
  ProcessImageChecklistSectionV3,
  ProcessStepsSectionV3,
  QuickPageLinksSectionV2,
  ServicesBentoCardsSectionV2,
  ServicesHoverPanelSectionV2,
  ServicesScrollCardsSectionV2,
  SectionLibraryV3Accordions,
  ServiceAreaZipLookupSectionV3,
  ServicesThreeCardsRightSectionV3,
  TestimonialsCarouselCondensedSectionV3,
  TestimonialsCarouselSectionV3,
  TestimonialsMasonrySectionV3,
  TestimonialsSectionV3,
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
  "hero-grid-mosaic-v2": (
    <HeroGridMosaicSectionV2
      {...sectionLibraryV3Content.heroGridMosaic}
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
  "content-about-company-v2": (
    <ContentAboutCompanySectionV2
      {...sectionLibraryV3Content.contentAboutCompany}
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
  "services-three-cards-right-v3": (
    <ServicesThreeCardsRightSectionV3
      {...sectionLibraryV3Content.servicesThreeCardsRight}
    />
  ),
  "services-bento-cards-v2": (
    <ServicesBentoCardsSectionV2 {...sectionLibraryV3Content.servicesBento} />
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
  items: collection.items.map((item) => ({
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
      <main className="library-surface">
        <section className="section-space-sml bg-service-ink text-white">
          <Container>
            <h1 className="type-display-lg">
              Section Library
            </h1>
            <p className="type-text-xl measure-copy wrap-pretty mt-display-body text-white/75">
              {sectionTemplateCount} reusable section templates.
            </p>
          </Container>
        </section>

        <SectionLibraryV3Accordions collections={collections} />
        <StyleGuideCloseAllButton />
      </main>
    </StyleGuidePreviewSurface>
  );
}
