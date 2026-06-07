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
import { sectionLibraryContent } from "@/content/section-library";
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
  "content-sticky-image-panel-v3": (
    <ContentStickyImagePanelSectionV3
      {...sectionLibraryContent.contentStickyImagePanel}
    />
  ),
  "content-fixed-cover-fade-v2": (
    <ContentFixedCoverFadeSectionV2
      {...sectionLibraryContent.contentFixedCoverFade}
    />
  ),
  "content-split-headline-image-v2": (
    <ContentSplitHeadlineImageSectionV2
      {...sectionLibraryContent.contentSplitHeadlineImage}
    />
  ),
  "feature-portrait-paragraph-v3": (
    <FeaturePortraitParagraphSectionV3
      {...sectionLibraryV3Content.featurePortraitParagraph}
    />
  ),
  "feature-overlap-rows-v3": (
    <FeatureOverlapRowsSectionV3
      {...sectionLibraryContent.featureOverlapRows}
    />
  ),
  "services-three-cards-right-v3": (
    <ServicesThreeCardsRightSectionV3
      {...sectionLibraryV3Content.servicesThreeCardsRight}
    />
  ),
  "process-steps-v3": (
    <ProcessStepsSectionV3 {...sectionLibraryContent.process} />
  ),
  "process-image-checklist-v3": (
    <ProcessImageChecklistSectionV3
      {...sectionLibraryContent.processImageChecklist}
    />
  ),
  "testimonials-v3": (
    <TestimonialsSectionV3 {...sectionLibraryContent.testimonials} />
  ),
  "testimonials-carousel-v3": (
    <TestimonialsCarouselSectionV3
      {...sectionLibraryContent.testimonialsCarousel}
    />
  ),
  "testimonials-masonry-v3": (
    <TestimonialsMasonrySectionV3
      {...sectionLibraryContent.testimonialsMasonry}
    />
  ),
  "faq-v3": <FAQSectionV3 {...sectionLibraryContent.faq} />,
  "faq-accordion-v3": (
    <FAQAccordionSectionV3 {...sectionLibraryContent.faqAccordion} />
  ),
  "cta-v3": <CTASectionV3 {...sectionLibraryContent.cta} />,
  "cta-fullscreen-v3": (
    <CTAFullscreenSectionV3 {...sectionLibraryContent.ctaFullscreen} />
  ),
  "cta-scroll-reveal-offer-v3": (
    <CTAScrollRevealOfferSectionV3
      {...sectionLibraryContent.ctaScrollRevealOffer}
    />
  ),
  "contact-v3": <ContactSectionV3 {...sectionLibraryContent.contact} />,
  "footer-v3": <FooterSectionV3 {...sectionLibraryContent.footer} />,
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
      <section className="bg-service-ink py-16 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-widest text-white/65">
            Internal preview
          </p>
          <h1 className="mt-4 text-fluid-heading font-semibold leading-heading">
            Section Library
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Current seven-column section templates for the local service starter.
          </p>
        </Container>
      </section>

      <SectionLibraryV3Accordions collections={collections} />
    </main>
  );
}
