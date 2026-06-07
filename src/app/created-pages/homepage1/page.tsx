import type { Metadata } from "next";
import {
  ContactSectionV2,
  ContentPositioningSplitSectionV2,
  FAQSectionV2,
  HeroBentoSectionV2,
  NavPrimarySectionV2,
  ServicesGridSectionV2,
  TrustBarSection,
} from "@/components/sections";
import { createdHomepage1Content } from "@/content/created-pages";

export const metadata: Metadata = {
  title: "homepage1 Created Page | Pageworks",
  description:
    "A baked WIP homepage created from the Pagebuilder homepage1 instruction.",
};

export default function CreatedHomepage1Page() {
  const content = createdHomepage1Content;

  return (
    <>
      <NavPrimarySectionV2 {...content.nav} />
      <main className="bg-white">
        <HeroBentoSectionV2 {...content.hero} />
        <TrustBarSection {...content.trustBar} />
        <ServicesGridSectionV2 {...content.services} />
        <ContentPositioningSplitSectionV2 {...content.positioning} />
        <FAQSectionV2 {...content.faq} />
        <ContactSectionV2 {...content.contact} />
      </main>
    </>
  );
}
