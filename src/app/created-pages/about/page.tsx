import type { Metadata } from "next";
import {
  ContactSectionV2,
  ContentStickyCardStreamSectionV2,
  FAQAccordionSectionV2,
  HeroCenteredFloatersSectionV2,
  NavCenterLogoSectionV2,
  ServicesScrollCardsSectionV2,
  TrustBarSection,
} from "@/components/sections";
import { createdAboutContent } from "@/content/created-pages";

export const metadata: Metadata = {
  title: "About Created Page | Pageworks",
  description:
    "A baked WIP about page created from the Pagebuilder about instruction.",
};

export default function CreatedAboutPage() {
  const content = createdAboutContent;

  return (
    <>
      <NavCenterLogoSectionV2 {...content.nav} />
      <main className="bg-white">
        <HeroCenteredFloatersSectionV2 {...content.hero} />
        <TrustBarSection {...content.trustBar} />
        <ServicesScrollCardsSectionV2 {...content.servicesScroll} />
        <ContentStickyCardStreamSectionV2 {...content.stream} />
        <FAQAccordionSectionV2 {...content.faqAccordion} />
        <ContactSectionV2 {...content.contact} />
      </main>
    </>
  );
}
