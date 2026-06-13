import type { Metadata } from "next";
import { Container } from "@/components/primitives";
import {
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
  HeroSplitFullHeightSectionV3,
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
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";

export const metadata: Metadata = {
  title: "Section Library",
  description:
    "Current internal section library for seven-column layout system sections.",
};

const sectionElements = {
  "content-sticky-image-panel-v3": (
    <ContentStickyImagePanelSectionV3
      {...sectionLibraryV3Content.contentStickyImagePanel}
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
    <StyleGuidePreviewSurface>
      <main className="bg-bg-page">
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
    </StyleGuidePreviewSurface>
  );
}
