import type { Metadata } from "next";
import {
  ContactSectionV3,
  ContentPositioningSplitSectionV2,
  ContentStickyIdeasSectionV2,
  ContentStickyImagePanelSectionV3,
  CTASectionV3,
  CTAScrollRevealOfferSectionV3,
  FAQSectionV3,
  FooterSectionV3,
  HeroSplitFullHeightSectionV3,
  NavPrimarySectionV2,
  ProcessImageChecklistSectionV3,
  ServicesThreeCardsRightSectionV3,
  TestimonialsCarouselSectionV3,
  TrustBarSectionV3,
  TrustMarqueeSectionV3,
} from "@/components/sections";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import { northStarHvacContent } from "@/content/north-star-hvac";

export const metadata: Metadata = {
  title: "North Star HVAC | Lake Norman HVAC Service",
  description:
    "Practical HVAC repair, replacement, heat pump service, tune-ups, and maintenance plans for Huntersville and the Lake Norman area.",
};

export default function HvacServicePreviewPage() {
  return (
    <StyleGuidePreviewSurface>
      <NavPrimarySectionV2 {...northStarHvacContent.nav} />
      <main className="bg-bg-page text-service-ink">
        <HeroSplitFullHeightSectionV3
          {...northStarHvacContent.hero}
          variant="text-4-image-3-right"
        />
        <TrustBarSectionV3
          {...northStarHvacContent.trust}
          className="bg-accent/15"
        />
        <div id="services">
          <ServicesThreeCardsRightSectionV3
            {...northStarHvacContent.services}
          />
        </div>
        <TrustMarqueeSectionV3 {...northStarHvacContent.serviceMarquee} />
        <ContentStickyImagePanelSectionV3
          {...northStarHvacContent.comfortPlan}
        />
        <ContentStickyIdeasSectionV2
          {...northStarHvacContent.repairVsReplacement}
        />
        <ProcessImageChecklistSectionV3 {...northStarHvacContent.whyChoose} />
        <ProcessImageChecklistSectionV3 {...northStarHvacContent.process} />
        <ContentPositioningSplitSectionV2
          {...northStarHvacContent.serviceArea}
          imageLabel="Lake Norman service area"
        />
        <TestimonialsCarouselSectionV3
          {...northStarHvacContent.testimonials}
        />
        <div id="faq">
          <FAQSectionV3 {...northStarHvacContent.faq} />
        </div>
        <CTAScrollRevealOfferSectionV3 {...northStarHvacContent.offer} />
        <CTASectionV3 {...northStarHvacContent.finalCta} />
        <ContactSectionV3 {...northStarHvacContent.contact} />
        <FooterSectionV3 {...northStarHvacContent.footer} />
      </main>
    </StyleGuidePreviewSurface>
  );
}
