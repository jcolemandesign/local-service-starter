import type { Metadata } from "next";
import {
  CTAFullscreenSection,
  ContentAboutCompanySection,
  ContentRevealParagraphSection,
  FAQSection,
  FooterSection,
  HeroFullscreenSection,
  NavFloatingBentoSection,
  ServicesScrollCardsSection,
  TestimonialsCarouselSection,
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
      <NavFloatingBentoSection {...sectionLibraryContent.navPrimary} fixed />
      <main className="bg-white">
        <HeroFullscreenSection {...sectionLibraryContent.heroFullscreen} />
        <ContentRevealParagraphSection
          {...sectionLibraryContent.contentRevealParagraph}
        />
        <ServicesScrollCardsSection
          {...sectionLibraryContent.servicesScrollCards}
        />
        <ContentAboutCompanySection
          {...sectionLibraryContent.contentAboutCompany}
        />
        <TestimonialsCarouselSection
          {...sectionLibraryContent.testimonialsCarousel}
        />
        <FAQSection {...sectionLibraryContent.faq} />
        <CTAFullscreenSection {...sectionLibraryContent.ctaFullscreen} />
      </main>
      <FooterSection {...sectionLibraryContent.footer} />
    </>
  );
}
