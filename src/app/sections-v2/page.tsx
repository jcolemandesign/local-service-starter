import type { Metadata } from "next";
import { Container } from "@/components/primitives";
import {
  ContentAboutCompanySectionV2,
  ContactSectionV2,
  CTAFullscreenSectionV2,
  CTASectionV2,
  ContentPositioningSplitSectionV2,
  ContentRevealParagraphSectionV2,
  ContentSplitHeadlineImageSectionV2,
  ContentStickyIdeasSectionV2,
  FeatureOverlapRowsSectionV2,
  FeatureSplitSectionV2,
  FAQAccordionSectionV2,
  FAQSectionV2,
  HeroFullscreenSectionV2,
  HeroGridMosaicSectionV2,
  HeroLogoStatementSectionV2,
  HeroSectionV2,
  FooterSectionV2,
  NavCenterLogoSectionV2,
  NavFloatingBentoSectionV2,
  NavPrimarySectionV2,
  ProcessStepsSectionV2,
  SectionLibraryV2Accordions,
  ServicesBentoCardsSectionV2,
  ServicesGridSectionV2,
  ServicesHoverPanelSectionV2,
  ServicesScrollCardsSectionV2,
  TestimonialsCarouselSectionV2,
  TestimonialsMasonrySectionV2,
  TestimonialsSectionV2,
  TrustBarSection,
  TrustLogoMarqueeSection,
  TrustMarqueeSection,
} from "@/components/sections";
import { sectionLibraryContent } from "@/content/section-library";
import { sectionLibraryV2Collections } from "@/content/section-library-v2";

export const metadata: Metadata = {
  title: "Section Library V2",
  description:
    "Internal empty accordion shell for adapting reusable local service sections.",
};

const sectionElements = {
  "hero-section-v2": (
    <HeroSectionV2 {...sectionLibraryContent.hero} headingLevel={2} />
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
  "hero-logo-statement-v2": (
    <HeroLogoStatementSectionV2
      {...sectionLibraryContent.heroLogoStatement}
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
  "content-reveal-v2": (
    <ContentRevealParagraphSectionV2
      {...sectionLibraryContent.contentRevealParagraph}
    />
  ),
  "content-sticky-ideas-v2": (
    <ContentStickyIdeasSectionV2
      {...sectionLibraryContent.contentStickyIdeas}
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

export default function SectionsV2Page() {
  return (
    <main className="bg-white">
      <section className="bg-service-ink py-16 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-widest text-white/65">
            Internal preview
          </p>
          <h1 className="mt-4 text-fluid-heading font-semibold leading-heading">
            Section Library V2
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
