import type { Metadata } from "next";
import {
  CTASection,
  FAQAccordionSection,
  FeatureSplitSection,
  FooterSection,
  HeroBentoSection,
  NavPrimarySection,
  ProcessStepsSection,
  ServicesGridSection,
  TestimonialsMasonrySection,
  TrustBarSection,
} from "@/components/sections";
import { sectionLibraryContent } from "@/content/section-library";

export const metadata: Metadata = {
  title: "Sample Local Service Page",
  description:
    "A conversion-focused sample page assembled from reusable local service website sections.",
};

export default function SamplePage() {
  return (
    <>
      <NavPrimarySection {...sectionLibraryContent.navPrimary} />
      <main className="bg-white">
        <HeroBentoSection {...sectionLibraryContent.hero} />
        <TrustBarSection {...sectionLibraryContent.trustBar} />
        <ServicesGridSection {...sectionLibraryContent.services} />
        <FeatureSplitSection {...sectionLibraryContent.featureSplit} />
        <ProcessStepsSection {...sectionLibraryContent.process} />
        <TestimonialsMasonrySection
          {...sectionLibraryContent.testimonialsMasonry}
        />
        <FAQAccordionSection {...sectionLibraryContent.faqAccordion} />
        <CTASection {...sectionLibraryContent.cta} />
      </main>
      <FooterSection {...sectionLibraryContent.footer} />
    </>
  );
}
