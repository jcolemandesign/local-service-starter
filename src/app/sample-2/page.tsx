import type { Metadata } from "next";
import {
  CTAFullscreenSectionV2,
  ContentAboutCompanySectionV2,
  ContentRevealParagraphSectionV2,
  FAQSectionV2,
  FooterSectionV2,
  HeroFullscreenSectionV2,
  HeroGridMosaicSectionV2,
  NavFloatingBentoSectionV2,
  NavPrimarySectionV2,
  ServicesScrollCardsSectionV2,
  TestimonialsCarouselSectionV2,
} from "@/components/sections";
import { sectionLibraryContent } from "@/content/section-library";

export const metadata: Metadata = {
  title: "Sample Local Service Page Two",
  description:
    "A second sample page assembled from reusable local service website sections.",
};

export default function SampleTwoPage() {
  return (
    <>
      <NavFloatingBentoSectionV2 {...sectionLibraryContent.navPrimary} fixed />
      <main className="bg-white">
        <div>
          <HeroFullscreenSectionV2 {...sectionLibraryContent.heroFullscreen} />
          <ContentRevealParagraphSectionV2
            {...sectionLibraryContent.contentRevealParagraph}
            sectionSpace="lrg"
          />
          <ServicesScrollCardsSectionV2
            {...sectionLibraryContent.servicesScrollCards}
          />
          <ContentAboutCompanySectionV2
            {...sectionLibraryContent.contentAboutCompany}
            sectionSpace="lrg"
          />
          <TestimonialsCarouselSectionV2
            {...sectionLibraryContent.testimonialsCarousel}
          />
          <FAQSectionV2 {...sectionLibraryContent.faq} />
          <CTAFullscreenSectionV2 {...sectionLibraryContent.ctaFullscreen} />
        </div>

        <section
          aria-label="Template page break"
          className="section-space-lrg bg-white"
        >
          <div className="container-site">
            <div className="border-t border-dashed border-service-border" />
          </div>
        </section>

        <section className="section-space-med bg-service-surface">
          <NavPrimarySectionV2 {...sectionLibraryContent.navPrimary} />
          <HeroGridMosaicSectionV2
            {...sectionLibraryContent.heroGridMosaic}
            headingLevel={2}
          />
        </section>
      </main>
      <FooterSectionV2 {...sectionLibraryContent.footer} />
    </>
  );
}
