import type { Metadata } from "next";
import { Container } from "@/components/primitives";
import {
  ContentAboutCompanySectionV2,
  ContentFixedCoverFadeSectionV2,
  ContentHorizontalCardCarouselSectionV2,
  ContentPositioningSplitSectionV2,
  ContentRevealParagraphSectionV2,
  ContentRuleHeaderSectionV2,
  ContentScrollWrittenRevealSectionV2,
  ContentStickyCardStreamSectionV2,
  ContentStickyIdeasSectionV2,
  ContentSplitHeadlineImageSectionV2,
  ContactSectionV3,
  CTASectionV2,
  CTAFullscreenSectionV3,
  CTASectionV3,
  CTAScrollRevealOfferSectionV3,
  FAQAccordionSectionV2,
  FAQAccordionSectionV3,
  FAQSectionV2,
  FAQSectionV3,
  FeatureOverlapRowsSectionV3,
  FeaturePortraitParagraphSectionV3,
  FooterSectionV3,
  HeroCenteredFloatersSectionV2,
  HeroContentTopImageBottomSectionV2,
  HeroFullscreenSectionV2,
  HeroGridMosaicSectionV2,
  HeroSplitFullHeightSectionV3,
  NavCenterLogoSectionV2,
  NavFloatingBentoSectionV2,
  NavPrimarySectionV2,
  ProcessImageChecklistSectionV3,
  ProcessStepsSectionV2,
  ProcessStepsSectionV3,
  ServicesBentoCardsSectionV2,
  ServicesGridSectionV2,
  ServicesHoverPanelSectionV2,
  ServicesScrollCardsSectionV2,
  SectionLibraryV3Accordions,
  ServicesThreeCardsRightSectionV3,
  TestimonialsCarouselSectionV2,
  TestimonialsCarouselSectionV3,
  TestimonialsMasonrySectionV3,
  TestimonialsSectionV2,
  TestimonialsSectionV3,
  TrustBarFloatingBentoSectionV3,
  TrustBarSectionV3,
  TrustLogoGridSection,
  TrustLogoGridSectionV3,
  TrustMarqueeSection,
  TrustMarqueeSectionV3,
} from "@/components/sections";
import { HeroSplitFixedImageSectionLibraryDemo } from "@/components/sections/HeroSplitFixedImageSectionLibraryDemo";
import type { HeroSplitFullHeightVariant } from "@/components/sections/HeroSplitFullHeightSectionV3";
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
  "hero-split-fixed-image-v3": (
    <HeroSplitFixedImageSectionLibraryDemo
      {...sectionLibraryV3Content.heroSplitFullHeight}
      headingLevel={2}
    />
  ),
  "content-positioning-split-v2": (
    <ContentPositioningSplitSectionV2
      {...sectionLibraryV3Content.contentPositioningSplit}
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
  "services-three-cards-right-v3": (
    <ServicesThreeCardsRightSectionV3
      {...sectionLibraryV3Content.servicesThreeCardsRight}
    />
  ),
  "services-grid-v2": (
    <ServicesGridSectionV2 {...sectionLibraryV3Content.services} />
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
  "process-steps-v2": (
    <ProcessStepsSectionV2 {...sectionLibraryV3Content.process} />
  ),
  "process-steps-v3": (
    <ProcessStepsSectionV3 {...sectionLibraryV3Content.process} />
  ),
  "process-image-checklist-v3": (
    <ProcessImageChecklistSectionV3
      {...sectionLibraryV3Content.processImageChecklist}
    />
  ),
  "testimonials-v2": (
    <TestimonialsSectionV2 {...sectionLibraryV3Content.testimonials} />
  ),
  "testimonials-v3": (
    <TestimonialsSectionV3 {...sectionLibraryV3Content.testimonials} />
  ),
  "testimonials-carousel-v2": (
    <TestimonialsCarouselSectionV2
      {...sectionLibraryV3Content.testimonialsCarousel}
    />
  ),
  "testimonials-carousel-v3": (
    <TestimonialsCarouselSectionV3
      {...sectionLibraryV3Content.testimonialsCarousel}
    />
  ),
  "testimonials-masonry-v3": (
    <TestimonialsMasonrySectionV3
      {...sectionLibraryV3Content.testimonialsMasonry}
    />
  ),
  "faq-v2": <FAQSectionV2 {...sectionLibraryV3Content.faq} />,
  "faq-v3": <FAQSectionV3 {...sectionLibraryV3Content.faq} />,
  "faq-accordion-v2": (
    <FAQAccordionSectionV2 {...sectionLibraryV3Content.faqAccordion} />
  ),
  "faq-accordion-v3": (
    <FAQAccordionSectionV3 {...sectionLibraryV3Content.faqAccordion} />
  ),
  "cta-v2": <CTASectionV2 {...sectionLibraryV3Content.cta} />,
  "cta-v3": <CTASectionV3 {...sectionLibraryV3Content.cta} />,
  "cta-fullscreen-v3": (
    <CTAFullscreenSectionV3 {...sectionLibraryV3Content.ctaFullscreen} />
  ),
  "cta-scroll-reveal-offer-v3": (
    <CTAScrollRevealOfferSectionV3
      {...sectionLibraryV3Content.ctaScrollRevealOffer}
    />
  ),
  "contact-v3": <ContactSectionV3 {...sectionLibraryV3Content.contact} />,
  "footer-v3": <FooterSectionV3 {...sectionLibraryV3Content.footer} />,
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
  "trust-logo-grid-legacy": (
    <TrustLogoGridSection {...sectionLibraryV3Content.trustLogoMarquee} />
  ),
  "trust-logo-grid-v3": (
    <TrustLogoGridSectionV3
      {...sectionLibraryV3Content.trustLogoMarquee}
    />
  ),
} as const;

const heroSplitVariants = sectionLibraryV3Content.heroSplitFullHeight.variants.map(
  ({ label, variant }) => ({
    label,
    element: (
      <HeroSplitFullHeightSectionV3
        {...sectionLibraryV3Content.heroSplitFullHeight}
        variant={variant as HeroSplitFullHeightVariant}
      />
    ),
  }),
);

const collections = sectionLibraryV3Collections.map((collection) => ({
  ...collection,
  items: collection.items.map((item) => ({
    label: item.label,
    variants:
      item.component === "hero-split-full-height-v3"
        ? heroSplitVariants
        : undefined,
    element:
      item.component !== "hero-split-full-height-v3"
        ? sectionElements[item.component as keyof typeof sectionElements]
        : undefined,
  })),
}));

export default function SectionsV3Page() {
  return (
    <StyleGuidePreviewSurface>
      <main className="library-surface">
        <section className="section-space-sml bg-service-ink text-white">
          <Container>
            <p className="type-label text-white/65">
              Internal preview
            </p>
            <h1 className="type-display-lg mt-eyebrow-display">
              Section Library
            </h1>
            <p className="type-text-xl measure-copy wrap-pretty mt-display-body text-white/75">
              Current seven-column section templates for the local service starter.
            </p>
          </Container>
        </section>

        <SectionLibraryV3Accordions collections={collections} />
        <StyleGuideCloseAllButton />
      </main>
    </StyleGuidePreviewSurface>
  );
}
