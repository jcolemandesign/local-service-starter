import type { Metadata } from "next";
import {
  CTAScrollRevealOfferSectionV2,
  FAQAccordionSectionV2,
  FooterSectionV2,
  HeroImageTopContentBottomSectionV2,
  NavFloatingBentoSectionV2,
  ProcessImageChecklistSectionV2,
  ServicesHoverPanelSectionV2,
  TestimonialsMasonrySectionV2,
} from "@/components/sections";
import { samplePlumbingContent } from "@/content/sample-plumbing";

export const metadata: Metadata = {
  title: "Clearline Plumbing Sample Page",
  description:
    "A sample local plumbing service page assembled from reusable specialized sections.",
};

export default function SamplePlumbingPage() {
  return (
    <>
      <NavFloatingBentoSectionV2 {...samplePlumbingContent.nav} fixed />
      <main className="bg-white">
        <HeroImageTopContentBottomSectionV2
          {...samplePlumbingContent.hero}
          marqueeItems={samplePlumbingContent.trustMarquee.items}
          marqueeLabel={samplePlumbingContent.trustMarquee.label}
        />
        <div id="services">
          <ServicesHoverPanelSectionV2
            {...samplePlumbingContent.servicesHoverPanel}
          />
        </div>
        <ProcessImageChecklistSectionV2
          {...samplePlumbingContent.processImageChecklist}
        />
        <div id="reviews">
          <TestimonialsMasonrySectionV2
            {...samplePlumbingContent.testimonialsMasonry}
          />
        </div>
        <FAQAccordionSectionV2 {...samplePlumbingContent.faqAccordion} />
        <CTAScrollRevealOfferSectionV2
          {...samplePlumbingContent.ctaScrollRevealOffer}
        />
      </main>
      <FooterSectionV2 {...samplePlumbingContent.footer} />
    </>
  );
}
