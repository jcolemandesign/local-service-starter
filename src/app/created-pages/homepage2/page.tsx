import type { Metadata } from "next";
import {
  CTAFullscreenSectionV2,
  ContentRevealParagraphSectionV2,
  ContentSplitHeadlineImageSectionV2,
  HeroFullscreenSectionV2,
  NavFloatingBentoSectionV2,
  ProcessImageChecklistSectionV2,
  ServicesScrollCardsSectionV2,
  TestimonialsCarouselSectionV2,
} from "@/components/sections";
import { createdHomepage2Content } from "@/content/created-pages";

export const metadata: Metadata = {
  title: "homepage2 Created Page | Pageworks",
  description:
    "A baked WIP premium homepage created from the Pagebuilder homepage2 instruction.",
};

export default function CreatedHomepage2Page() {
  const content = createdHomepage2Content;

  return (
    <>
      <NavFloatingBentoSectionV2 {...content.nav} fixed />
      <main className="bg-white">
        <HeroFullscreenSectionV2 {...content.hero} />
        <ContentRevealParagraphSectionV2 {...content.reveal} />
        <ContentSplitHeadlineImageSectionV2 {...content.split} />
        <ServicesScrollCardsSectionV2 {...content.servicesScroll} />
        <TestimonialsCarouselSectionV2 {...content.testimonials} />
        <ProcessImageChecklistSectionV2 {...content.process} />
        <CTAFullscreenSectionV2 {...content.cta} />
      </main>
    </>
  );
}
