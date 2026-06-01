import type { Metadata } from "next";
import { Container } from "@/components/primitives";
import {
  ButtonStylesSectionV2,
  ContentAboutCompanySectionV2,
  ContentFixedCoverFadeSectionV2,
  ContentFourColumnScrollSectionV2,
  ContentHorizontalCardCarouselSectionV2,
  ContactSectionV2,
  CTAFullscreenSectionV2,
  CTAScrollRevealOfferSectionV2,
  CTASectionV2,
  ContentPositioningSplitSectionV2,
  ContentRevealParagraphSectionV2,
  ContentRuleHeaderSectionV2,
  ContentScrollWrittenRevealSectionV2,
  ContentStickyCardStreamSectionV2,
  ContentStickyImagePanelSectionV2,
  ContentSplitHeadlineImageSectionV2,
  ContentStickyIdeasSectionV2,
  FeatureOverlapRowsSectionV2,
  FeatureSplitSectionV2,
  FAQAccordionSectionV2,
  FAQSectionV2,
  HeroBentoSectionV2,
  HeroCenteredFloatersSectionV2,
  HeroContentTopImageBottomSectionV2,
  HeroFullscreenSectionV2,
  HeroGridMosaicSectionV2,
  HeroImageTopContentBottomSectionV2,
  HeroNotchedNavSectionV2,
  HeroSectionV2,
  HeroStackedHeaderImageSectionV2,
  FooterSectionV2,
  NavCenterLogoSectionV2,
  NavFloatingBentoSectionV2,
  NavPrimarySectionV2,
  ProcessImageChecklistSectionV2,
  ProcessStepsSectionV2,
  SectionLibraryV2Accordions,
  ServicesBentoCardsSectionV2,
  ServicesGridSectionV2,
  ServicesHoverPanelSectionV2,
  ServicesScrollCardsSectionV2,
  TestimonialsCarouselSectionV2,
  TestimonialsMasonrySectionV2,
  TestimonialsSectionV2,
  TrustBarFloatingBentoSectionV2,
  TrustBarSection,
  TrustLogoMarqueeSection,
  TrustMarqueeSection,
} from "@/components/sections";
import { sectionLibraryContent } from "@/content/section-library";
import { sectionLibraryV2Collections } from "@/content/section-library-v2";

export const metadata: Metadata = {
  title: "Section Library",
  description:
    "Internal empty accordion shell for adapting reusable local service sections.",
};

const sectionElements = {
  "hero-bento-v2": (
    <HeroBentoSectionV2 {...sectionLibraryContent.hero} headingLevel={2} />
  ),
  "hero-section-v2": (
    <HeroSectionV2 {...sectionLibraryContent.hero} headingLevel={2} />
  ),
  "hero-centered-floaters-v2": (
    <HeroCenteredFloatersSectionV2
      {...sectionLibraryContent.hero}
      headingLevel={2}
    />
  ),
  "hero-fullscreen-v2": (
    <HeroFullscreenSectionV2
      {...sectionLibraryContent.heroFullscreen}
      headingLevel={2}
    />
  ),
  "hero-grid-mosaic-v2": (
    <HeroGridMosaicSectionV2
      {...sectionLibraryContent.heroGridMosaic}
      headingLevel={2}
    />
  ),
  "hero-content-top-image-bottom-v2": (
    <HeroContentTopImageBottomSectionV2
      {...sectionLibraryContent.hero}
      headingLevel={2}
    />
  ),
  "hero-image-top-content-bottom-v2": (
    <HeroImageTopContentBottomSectionV2
      {...sectionLibraryContent.hero}
      headingLevel={2}
    />
  ),
  "hero-stacked-header-image-v2": (
    <HeroStackedHeaderImageSectionV2
      {...sectionLibraryContent.hero}
      headingLevel={2}
      title="Reliable Home Services Delivered"
    />
  ),
  "hero-notched-nav-v2": (
    <HeroNotchedNavSectionV2
      {...sectionLibraryContent.heroFullscreen}
      {...sectionLibraryContent.navPrimary}
      headingLevel={2}
    />
  ),
  "nav-primary-v2": <NavPrimarySectionV2 {...sectionLibraryContent.navPrimary} />,
  "nav-center-logo-v2": (
    <NavCenterLogoSectionV2 {...sectionLibraryContent.navPrimary} />
  ),
  "nav-floating-bento-v2": (
    <NavFloatingBentoSectionV2 {...sectionLibraryContent.navPrimary} />
  ),
  "button-expanding-arrow-v2": <ButtonStylesSectionV2 />,
  "content-rule-header-v2": (
    <ContentRuleHeaderSectionV2
      {...sectionLibraryContent.contentRuleHeader}
    />
  ),
  "content-reveal-v2": (
    <ContentRevealParagraphSectionV2
      {...sectionLibraryContent.contentRevealParagraph}
    />
  ),
  "content-scroll-written-reveal-v2": (
    <ContentScrollWrittenRevealSectionV2
      {...sectionLibraryContent.contentScrollWrittenReveal}
    />
  ),
  "content-sticky-ideas-v2": (
    <ContentStickyIdeasSectionV2
      {...sectionLibraryContent.contentStickyIdeas}
    />
  ),
  "content-sticky-card-stream-v2": (
    <ContentStickyCardStreamSectionV2
      {...sectionLibraryContent.contentStickyCardStream}
    />
  ),
  "content-horizontal-card-carousel-v2": (
    <ContentHorizontalCardCarouselSectionV2
      {...sectionLibraryContent.contentHorizontalCardCarousel}
    />
  ),
  "content-four-column-scroll-v2": (
    <ContentFourColumnScrollSectionV2
      {...sectionLibraryContent.contentFourColumnScroll}
    />
  ),
  "content-sticky-image-panel-v2": (
    <ContentStickyImagePanelSectionV2
      {...sectionLibraryContent.contentStickyImagePanel}
    />
  ),
  "content-fixed-cover-fade-v2": (
    <ContentFixedCoverFadeSectionV2
      {...sectionLibraryContent.contentFixedCoverFade}
    />
  ),
  "content-positioning-split-v2": (
    <ContentPositioningSplitSectionV2
      {...sectionLibraryContent.contentPositioningSplit}
    />
  ),
  "content-about-company-v2": (
    <ContentAboutCompanySectionV2
      {...sectionLibraryContent.contentAboutCompany}
    />
  ),
  "content-split-headline-image-v2": (
    <ContentSplitHeadlineImageSectionV2
      {...sectionLibraryContent.contentSplitHeadlineImage}
    />
  ),
  "trust-bar-v2": <TrustBarSection {...sectionLibraryContent.trustBar} />,
  "trust-bar-floating-bento-v2": (
    <TrustBarFloatingBentoSectionV2 {...sectionLibraryContent.trustBar} />
  ),
  "trust-marquee-v2": (
    <TrustMarqueeSection {...sectionLibraryContent.trustMarquee} />
  ),
  "trust-logo-marquee-v2": (
    <TrustLogoMarqueeSection {...sectionLibraryContent.trustLogoMarquee} />
  ),
  "services-grid-v2": <ServicesGridSectionV2 {...sectionLibraryContent.services} />,
  "services-bento-v2": (
    <ServicesBentoCardsSectionV2 {...sectionLibraryContent.servicesBento} />
  ),
  "services-hover-panel-v2": (
    <ServicesHoverPanelSectionV2
      {...sectionLibraryContent.servicesHoverPanel}
    />
  ),
  "services-scroll-cards-v2": (
    <ServicesScrollCardsSectionV2
      {...sectionLibraryContent.servicesScrollCards}
    />
  ),
  "feature-split-v2": (
    <FeatureSplitSectionV2 {...sectionLibraryContent.featureSplit} />
  ),
  "feature-overlap-rows-v2": (
    <FeatureOverlapRowsSectionV2
      {...sectionLibraryContent.featureOverlapRows}
    />
  ),
  "process-steps-v2": (
    <ProcessStepsSectionV2 {...sectionLibraryContent.process} />
  ),
  "process-image-checklist-v2": (
    <ProcessImageChecklistSectionV2
      {...sectionLibraryContent.processImageChecklist}
    />
  ),
  "testimonials-v2": (
    <TestimonialsSectionV2 {...sectionLibraryContent.testimonials} />
  ),
  "testimonials-carousel-v2": (
    <TestimonialsCarouselSectionV2
      {...sectionLibraryContent.testimonialsCarousel}
    />
  ),
  "testimonials-masonry-v2": (
    <TestimonialsMasonrySectionV2
      {...sectionLibraryContent.testimonialsMasonry}
    />
  ),
  "faq-v2": <FAQSectionV2 {...sectionLibraryContent.faq} />,
  "faq-accordion-v2": (
    <FAQAccordionSectionV2 {...sectionLibraryContent.faqAccordion} />
  ),
  "cta-v2": <CTASectionV2 {...sectionLibraryContent.cta} />,
  "cta-fullscreen-v2": (
    <CTAFullscreenSectionV2 {...sectionLibraryContent.ctaFullscreen} />
  ),
  "cta-scroll-reveal-offer-v2": (
    <CTAScrollRevealOfferSectionV2
      {...sectionLibraryContent.ctaScrollRevealOffer}
    />
  ),
  "contact-v2": <ContactSectionV2 {...sectionLibraryContent.contact} />,
  "footer-v2": <FooterSectionV2 {...sectionLibraryContent.footer} />,
} as const;

const collections = sectionLibraryV2Collections.map((collection) => ({
  ...collection,
  items: collection.items.map((item) => ({
    label: item.label,
    element:
      "component" in item
        ? sectionElements[item.component as keyof typeof sectionElements]
        : undefined,
  })),
}));

export default function SectionsPage() {
  return (
    <main className="bg-white">
      <section className="bg-service-ink py-16 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-widest text-white/65">
            Internal preview
          </p>
          <h1 className="mt-4 text-fluid-heading font-semibold leading-heading">
            Section Library
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Empty accordion shell for adapting each existing layout to the new
            responsive type and measure logic.
          </p>
        </Container>
      </section>

      <SectionLibraryV2Accordions collections={collections} />
    </main>
  );
}
