import type { Metadata } from "next";
import {
  ContentRuleHeaderSectionV2,
  FAQSectionV2,
  FooterSectionV2,
  HeroContentTopImageBottomSectionV2,
  NavFloatingBentoSectionV2,
  ServicesScrollCardsSectionV2,
  TrustMarqueeSection,
} from "@/components/sections";
import { createdIndividualServicePageContent } from "@/content/created-pages";

export const metadata: Metadata = {
  title: "Individual Service Page Created Page | Pageworks",
  description:
    "A baked WIP individual service page created from the Pagebuilder service-page instruction.",
};

export default function CreatedIndividualServicePage() {
  const content = createdIndividualServicePageContent;

  return (
    <>
      <NavFloatingBentoSectionV2 {...content.nav} fixed />
      <main className="bg-white">
        <HeroContentTopImageBottomSectionV2 {...content.hero} />
        <TrustMarqueeSection {...content.trustMarquee} />
        <ServicesScrollCardsSectionV2 {...content.relatedServices} />
        <ContentRuleHeaderSectionV2 {...content.ruleHeader} />
        <FAQSectionV2 {...content.faq} />
      </main>
      <FooterSectionV2 {...content.footer} />
    </>
  );
}
