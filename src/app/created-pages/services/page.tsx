import type { Metadata } from "next";
import {
  CTAScrollRevealOfferSectionV2,
  ContentAboutCompanySectionV2,
  ContentRevealParagraphSectionV2,
  ContentStickyIdeasSectionV2,
  HeroGridMosaicSectionV2,
  NavPrimarySectionV2,
  TestimonialsMasonrySectionV2,
  TrustLogoGridSection,
} from "@/components/sections";
import { createdServicesContent } from "@/content/created-pages";

export const metadata: Metadata = {
  title: "Services Created Page | Pageworks",
  description:
    "A baked WIP services page created from the Pagebuilder services instruction.",
};

export default function CreatedServicesPage() {
  const content = createdServicesContent;

  return (
    <>
      <NavPrimarySectionV2 {...content.nav} />
      <main className="bg-white">
        <HeroGridMosaicSectionV2 {...content.hero} />
        <ContentRevealParagraphSectionV2 {...content.reveal} />
        <ContentStickyIdeasSectionV2 {...content.ideas} />
        <ContentAboutCompanySectionV2 {...content.aboutCompany} />
        <TrustLogoGridSection {...content.trustLogos} />
        <TestimonialsMasonrySectionV2 {...content.testimonials} />
        <CTAScrollRevealOfferSectionV2 {...content.offer} />
      </main>
    </>
  );
}
