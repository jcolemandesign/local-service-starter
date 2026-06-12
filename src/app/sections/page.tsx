import type { Metadata } from "next";
import { Container } from "@/components/primitives";
import {
  ContentFixedCoverFadeSectionV2,
  ContentHorizontalCardCarouselSectionV2,
  ContentRevealParagraphSectionV2,
  ContentRuleHeaderSectionV2,
  ContentScrollWrittenRevealSectionV2,
  ContentSplitHeadlineImageSectionV2,
  ContentStickyCardStreamSectionV2,
  ContentStickyIdeasSectionV2,
  ContentStickyImagePanelSectionV3,
  ContactSectionV3,
  CTAFullscreenSectionV3,
  CTASectionV3,
  CTAScrollRevealOfferSectionV3,
  FAQAccordionSectionV3,
  FAQSectionV3,
  FeatureOverlapRowsSectionV3,
  FeaturePortraitParagraphSectionV3,
  FooterSectionV3,
  HeroCenteredFloatersSectionV2,
  HeroContentTopImageBottomSectionV2,
  HeroFullscreenSectionV2,
  HeroGridMosaicSectionV2,
  HeroImageTopContentBottomSectionV2,
  HeroSplitFullHeightSectionV3,
  HeroStackedHeaderImageSectionV2,
  ProcessImageChecklistSectionV3,
  ProcessStepsSectionV3,
  SectionLibraryV3Accordions,
  ServicesThreeCardsRightSectionV3,
  TestimonialsCarouselSectionV3,
  TestimonialsMasonrySectionV3,
  TestimonialsSectionV3,
  TrustBarFloatingBentoSectionV3,
  TrustBarSectionV3,
  TrustLogoGridSectionV3,
  TrustLogoMarqueeSectionV3,
  TrustMarqueeSectionV3,
} from "@/components/sections";
import type { HeroSplitFullHeightVariant } from "@/components/sections/HeroSplitFullHeightSectionV3";
import {
  sectionLibraryV3Collections,
  sectionLibraryV3Content,
} from "@/content/section-library-v3";

export const metadata: Metadata = {
  title: "Section Library",
  description:
    "Current internal section library for seven-column layout system sections.",
};

const sectionElements = {
  "hero-centered-floaters-v2": (
    <HeroCenteredFloatersSectionV2
      {...sectionLibraryV3Content.hero}
      headingLevel={2}
    />
  ),
  "hero-fullscreen-v2": (
    <HeroFullscreenSectionV2
      {...sectionLibraryV3Content.heroFullscreen}
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
  "hero-image-top-content-bottom-v2": (
    <HeroImageTopContentBottomSectionV2
      {...sectionLibraryV3Content.hero}
      headingLevel={2}
    />
  ),
  "hero-stacked-header-image-v2": (
    <HeroStackedHeaderImageSectionV2
      {...sectionLibraryV3Content.hero}
      headingLevel={2}
      title="Reliable Home Services Delivered"
    />
  ),
  "content-rule-header-v2": (
    <ContentRuleHeaderSectionV2
      {...sectionLibraryV3Content.contentRuleHeader}
    />
  ),
  "content-reveal-v2": (
    <ContentRevealParagraphSectionV2
      {...sectionLibraryV3Content.contentRevealParagraph}
    />
  ),
  "content-scroll-written-reveal-v2": (
    <ContentScrollWrittenRevealSectionV2
      {...sectionLibraryV3Content.contentScrollWrittenReveal}
    />
  ),
  "content-sticky-ideas-v2": (
    <ContentStickyIdeasSectionV2
      {...sectionLibraryV3Content.contentStickyIdeas}
    />
  ),
  "content-sticky-card-stream-v2": (
    <ContentStickyCardStreamSectionV2
      {...sectionLibraryV3Content.contentStickyCardStream}
    />
  ),
  "content-horizontal-card-carousel-v2": (
    <ContentHorizontalCardCarouselSectionV2
      {...sectionLibraryV3Content.contentHorizontalCardCarousel}
    />
  ),
  "content-sticky-image-panel-v3": (
    <ContentStickyImagePanelSectionV3
      {...sectionLibraryV3Content.contentStickyImagePanel}
    />
  ),
  "content-fixed-cover-fade-v2": (
    <ContentFixedCoverFadeSectionV2
      {...sectionLibraryV3Content.contentFixedCoverFade}
    />
  ),
  "content-split-headline-image-v2": (
    <ContentSplitHeadlineImageSectionV2
      {...sectionLibraryV3Content.contentSplitHeadlineImage}
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
    <main className="bg-white">
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
    </main>
  );
}
