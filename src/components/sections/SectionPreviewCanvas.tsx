import { ContentAboutCompanySectionV2 } from "@/components/sections/ContentAboutCompanySectionV2";
import { ContentFixedCoverFadeSectionV2 } from "@/components/sections/ContentFixedCoverFadeSectionV2";
import { ContentHorizontalCardCarouselSectionV2 } from "@/components/sections/ContentHorizontalCardCarouselSectionV2";
import { ContactSectionV2 } from "@/components/sections/ContactSectionV2";
import { CTAFullscreenSectionV2 } from "@/components/sections/CTAFullscreenSectionV2";
import { CTAScrollRevealOfferSectionV2 } from "@/components/sections/CTAScrollRevealOfferSectionV2";
import { ContentRevealParagraphSectionV2 } from "@/components/sections/ContentRevealParagraphSectionV2";
import { ContentRuleHeaderSectionV2 } from "@/components/sections/ContentRuleHeaderSectionV2";
import { ContentScrollWrittenRevealSectionV2 } from "@/components/sections/ContentScrollWrittenRevealSectionV2";
import { ContentSplitFixedImageSectionV3 } from "@/components/sections/ContentSplitFixedImageSectionV3";
import { ContentStickyCardStreamSectionV2 } from "@/components/sections/ContentStickyCardStreamSectionV2";
import { ContentSplitHeadlineImageSectionV2 } from "@/components/sections/ContentSplitHeadlineImageSectionV2";
import { ContentStickyIdeasSectionV2 } from "@/components/sections/ContentStickyIdeasSectionV2";
import {
  ContactSectionV3,
  CTASectionV3,
  CTAFullscreenSectionV3,
  FooterSectionV3,
  FAQSectionV3,
} from "@/components/sections/FAQConversionContactFooterSectionsV3";
import {
  FeatureOverlapRowsSectionV3,
  ProcessStepsSectionV3,
  TestimonialsSectionV3,
} from "@/components/sections/FeatureProcessTestimonialsSectionsV3";
import { FeatureAsymmetricCardsSectionV3 } from "@/components/sections/FeatureAsymmetricCardsSectionV3";
import { FeaturePortraitParagraphSectionV3 } from "@/components/sections/FeaturePortraitParagraphSectionV3";
import { CTAScrollRevealOfferSectionV3 } from "@/components/sections/CTAScrollRevealOfferSectionV3";
import { FAQAccordionSectionV3 } from "@/components/sections/FAQAccordionSectionV3";
import { HeroCenteredFloatersSectionV2 } from "@/components/sections/HeroCenteredFloatersSectionV2";
import { HeroContentTopImageBottomSectionV2 } from "@/components/sections/HeroContentTopImageBottomSectionV2";
import {
  HeroSplitFixedImageSectionV3,
  type HeroSplitFixedImageRatio,
  type HeroSplitFixedImageVariant,
} from "@/components/sections/HeroSplitFixedImageSectionV3";
import { HeroFullscreenSectionV2 } from "@/components/sections/HeroFullscreenSectionV2";
import { HeroGridMosaicSectionV2 } from "@/components/sections/HeroGridMosaicSectionV2";
import {
  HeroSplitFullHeightSectionV3,
  type HeroSplitFullHeightVariant,
} from "@/components/sections/HeroSplitFullHeightSectionV3";
import { FooterSectionV2 } from "@/components/sections/FooterSectionV2";
import {
  NavCenterLogoSectionV2,
  NavPrimarySectionV2,
} from "@/components/sections/NavPrimarySectionV2";
import { NavFloatingBentoSectionV2 } from "@/components/sections/NavFloatingBentoSectionV2";
import { ProcessImageChecklistSectionV2 } from "@/components/sections/ProcessImageChecklistSectionV2";
import { ProcessImageChecklistSectionV3 } from "@/components/sections/ProcessImageChecklistSectionV3";
import { ServicesBentoCardsSectionV2 } from "@/components/sections/ServicesBentoCardsSectionV2";
import { ServicesHoverPanelSectionV2 } from "@/components/sections/ServicesHoverPanelSectionV2";
import { ServicesScrollCardsSectionV2 } from "@/components/sections/ServicesScrollCardsSectionV2";
import { ServiceAreaZipLookupSectionV3 } from "@/components/sections/ServiceAreaZipLookupSectionV3";
import { ServicesThreeCardsRightSectionV3 } from "@/components/sections/ServicesThreeCardsRightSectionV3";
import { TestimonialsCarouselSectionV3 } from "@/components/sections/TestimonialsCarouselSectionV3";
import { TestimonialsMasonrySectionV2 } from "@/components/sections/TestimonialsMasonrySectionV2";
import { TestimonialsMasonrySectionV3 } from "@/components/sections/TestimonialsMasonrySectionV3";
import { TrustLogoGridSection } from "@/components/sections/TrustLogoMarqueeSection";
import { TrustMarqueeSection } from "@/components/sections/TrustMarqueeSection";
import {
  TrustBarFloatingBentoSectionV3,
  TrustBarSectionV3,
  TrustLogoGridSectionV3,
  TrustLogoMarqueeSectionV3,
  TrustMarqueeSectionV3,
} from "@/components/sections/TrustSectionsV3";
import { sectionLibraryV3Content } from "@/content/section-library-v3";

export type PreviewCanvasSection = {
  component: string;
  mode: string;
  name: string;
  ratio?: string;
  variant?: string;
};

type SectionPreviewCanvasProps = {
  pageLabel: string;
  sections: PreviewCanvasSection[];
};

const heroSplitFullHeightVariants = new Set<string>(
  sectionLibraryV3Content.heroSplitFullHeight.variants.map(
    (option) => option.variant,
  ),
);

const heroSplitFixedImageVariants = new Set<string>([
  "text-3-image-4-right",
  "text-4-image-3-right",
  "image-3-left-text-4",
  "image-4-left-text-3",
]);

const heroSplitFixedImageRatios = new Set<string>([
  "3-2",
  "2-3",
  "4-3",
  "3-4",
  "5-4",
  "4-5",
]);

export function SectionPreviewCanvas({
  pageLabel,
  sections,
}: SectionPreviewCanvasProps) {
  return (
    <div className="overflow-hidden rounded-sm border border-service-border bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-service-border bg-service-surface px-4 py-3">
        <div>
          <p className="type-caption font-semibold text-service-accent">
            Live Pre-Stage Preview
          </p>
          <p className="type-caption text-service-muted">{pageLabel}</p>
        </div>
        <span className="type-caption rounded-sm border border-service-border bg-white px-3 py-1 text-service-muted">
          {sections.length} sections
        </span>
      </div>
      <div className="max-h-[72rem] overflow-auto bg-white">
        <div className="origin-top scale-[0.72] [width:138.888889%]">
          {sections.map((section, index) => (
            <div
              className="border-b border-service-border/70 last:border-b-0"
              key={`${section.component}-${section.name}-${index}`}
            >
              {renderPreviewSection(section, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderPreviewSection(section: PreviewCanvasSection, index: number) {
  const headingLevel = isFirstHero(section, index) ? 1 : 2;

  switch (section.component) {
    case "NavPrimarySectionV2":
      return <NavPrimarySectionV2 {...sectionLibraryV3Content.navPrimary} />;
    case "NavCenterLogoSectionV2":
      return <NavCenterLogoSectionV2 {...sectionLibraryV3Content.navPrimary} />;
    case "NavFloatingBentoSectionV2":
      return <NavFloatingBentoSectionV2 {...sectionLibraryV3Content.navPrimary} />;
    case "HeroSplitFullHeightSectionV3":
      return (
        <HeroSplitFullHeightSectionV3
          {...sectionLibraryV3Content.heroSplitFullHeight}
          headingLevel={headingLevel}
          variant={getHeroSplitFullHeightVariant(section)}
        />
      );
    case "HeroSplitFixedImageSectionV3":
      return (
        <HeroSplitFixedImageSectionV3
          {...sectionLibraryV3Content.heroSplitFullHeight}
          headingLevel={headingLevel}
          ratio={getHeroSplitFixedImageRatio(section)}
          variant={getHeroSplitFixedImageVariant(section)}
        />
      );
    case "HeroFullscreenSectionV2":
      return (
        <HeroFullscreenSectionV2
          {...sectionLibraryV3Content.heroFullscreen}
          headingLevel={headingLevel}
        />
      );
    case "HeroCenteredFloatersSectionV2":
      return (
        <HeroCenteredFloatersSectionV2
          {...sectionLibraryV3Content.hero}
          headingLevel={headingLevel}
        />
      );
    case "HeroGridMosaicSectionV2":
      return (
        <HeroGridMosaicSectionV2
          {...sectionLibraryV3Content.heroGridMosaic}
          headingLevel={headingLevel}
        />
      );
    case "HeroContentTopImageBottomSectionV2":
      return (
        <HeroContentTopImageBottomSectionV2
          {...sectionLibraryV3Content.hero}
          headingLevel={headingLevel}
        />
      );
    case "TrustBarSectionV3":
      return <TrustBarSectionV3 {...sectionLibraryV3Content.trustBar} />;
    case "TrustBarFloatingBentoSectionV3":
      return (
        <TrustBarFloatingBentoSectionV3
          {...sectionLibraryV3Content.trustBar}
        />
      );
    case "TrustMarqueeSection":
      return <TrustMarqueeSection {...sectionLibraryV3Content.trustMarquee} />;
    case "TrustMarqueeSectionV3":
      return <TrustMarqueeSectionV3 {...sectionLibraryV3Content.trustMarquee} />;
    case "TrustLogoGridSection":
      return <TrustLogoGridSection {...sectionLibraryV3Content.trustLogoMarquee} />;
    case "TrustLogoMarqueeSectionV3":
      return (
        <TrustLogoMarqueeSectionV3
          {...sectionLibraryV3Content.trustLogoMarquee}
        />
      );
    case "TrustLogoGridSectionV3":
      return (
        <TrustLogoGridSectionV3
          {...sectionLibraryV3Content.trustLogoMarquee}
        />
      );
    case "ServicesBentoCardsSectionV2":
      return (
        <ServicesBentoCardsSectionV2
          {...sectionLibraryV3Content.servicesBento}
        />
      );
    case "ServicesHoverPanelSectionV2":
      return (
        <ServicesHoverPanelSectionV2
          {...sectionLibraryV3Content.servicesHoverPanel}
        />
      );
    case "ServicesThreeCardsRightSectionV3":
      return (
        <ServicesThreeCardsRightSectionV3
          {...sectionLibraryV3Content.servicesThreeCardsRight}
        />
      );
    case "ServicesScrollCardsSectionV2":
      return (
        <ServicesScrollCardsSectionV2
          {...sectionLibraryV3Content.servicesScrollCards}
        />
      );
    case "ContentHorizontalCardCarouselSectionV2":
      return (
        <ContentHorizontalCardCarouselSectionV2
          {...sectionLibraryV3Content.contentHorizontalCardCarousel}
        />
      );
    case "ContentRevealParagraphSectionV2":
      return (
        <ContentRevealParagraphSectionV2
          {...sectionLibraryV3Content.contentRevealParagraph}
        />
      );
    case "ContentScrollWrittenRevealSectionV2":
      return (
        <ContentScrollWrittenRevealSectionV2
          {...sectionLibraryV3Content.contentScrollWrittenReveal}
        />
      );
    case "ContentSplitHeadlineImageSectionV2":
      return (
        <ContentSplitHeadlineImageSectionV2
          {...sectionLibraryV3Content.contentSplitHeadlineImage}
        />
      );
    case "ContentSplitFixedImageSectionV3":
      return (
        <ContentSplitFixedImageSectionV3
          {...sectionLibraryV3Content.heroSplitFullHeight}
          headingLevel={headingLevel}
        />
      );
    case "ContentStickyCardStreamSectionV2":
      return (
        <ContentStickyCardStreamSectionV2
          {...sectionLibraryV3Content.contentStickyCardStream}
        />
      );
    case "ContentStickyIdeasSectionV2":
      return (
        <ContentStickyIdeasSectionV2
          {...sectionLibraryV3Content.contentStickyIdeas}
        />
      );
    case "ContentAboutCompanySectionV2":
      return (
        <ContentAboutCompanySectionV2
          {...sectionLibraryV3Content.contentAboutCompany}
        />
      );
    case "ContentRuleHeaderSectionV2":
      return (
        <ContentRuleHeaderSectionV2
          {...sectionLibraryV3Content.contentRuleHeader}
        />
      );
    case "FeaturePortraitParagraphSectionV3":
      return (
        <FeaturePortraitParagraphSectionV3
          {...sectionLibraryV3Content.featurePortraitParagraph}
        />
      );
    case "FeatureOverlapRowsSectionV3":
      return (
        <FeatureOverlapRowsSectionV3
          {...sectionLibraryV3Content.featureOverlapRows}
        />
      );
    case "FeatureAsymmetricCardsSectionV3":
      return (
        <FeatureAsymmetricCardsSectionV3
          {...sectionLibraryV3Content.featureAsymmetricCards}
        />
      );
    case "FAQSectionV3":
      return <FAQSectionV3 {...sectionLibraryV3Content.faq} />;
    case "FAQAccordionSectionV3":
      return <FAQAccordionSectionV3 {...sectionLibraryV3Content.faqAccordion} />;
    case "TestimonialsSectionV3":
      return <TestimonialsSectionV3 {...sectionLibraryV3Content.testimonials} />;
    case "TestimonialsCarouselSectionV3":
      return (
        <TestimonialsCarouselSectionV3
          {...sectionLibraryV3Content.testimonialsCarousel}
        />
      );
    case "TestimonialsMasonrySectionV2":
      return (
        <TestimonialsMasonrySectionV2
          {...sectionLibraryV3Content.testimonialsMasonry}
        />
      );
    case "TestimonialsMasonrySectionV3":
      return (
        <TestimonialsMasonrySectionV3
          {...sectionLibraryV3Content.testimonialsMasonry}
        />
      );
    case "ProcessImageChecklistSectionV2":
      return (
        <ProcessImageChecklistSectionV2
          {...sectionLibraryV3Content.processImageChecklist}
        />
      );
    case "ProcessImageChecklistSectionV3":
      return (
        <ProcessImageChecklistSectionV3
          {...sectionLibraryV3Content.processImageChecklist}
        />
      );
    case "ProcessStepsSectionV3":
      return <ProcessStepsSectionV3 {...sectionLibraryV3Content.process} />;
    case "CTASectionV3":
      return <CTASectionV3 {...sectionLibraryV3Content.cta} />;
    case "CTAFullscreenSectionV2":
      return <CTAFullscreenSectionV2 {...sectionLibraryV3Content.ctaFullscreen} />;
    case "CTAFullscreenSectionV3":
      return <CTAFullscreenSectionV3 {...sectionLibraryV3Content.ctaFullscreen} />;
    case "CTAScrollRevealOfferSectionV2":
      return (
        <CTAScrollRevealOfferSectionV2
          {...sectionLibraryV3Content.ctaScrollRevealOffer}
        />
      );
    case "CTAScrollRevealOfferSectionV3":
      return (
        <CTAScrollRevealOfferSectionV3
          {...sectionLibraryV3Content.ctaScrollRevealOffer}
        />
      );
    case "ContentFixedCoverFadeSectionV2":
      return (
        <ContentFixedCoverFadeSectionV2
          {...sectionLibraryV3Content.contentFixedCoverFade}
        />
      );
    case "ContactSectionV2":
      return <ContactSectionV2 {...sectionLibraryV3Content.contact} />;
    case "ServiceAreaZipLookupSectionV3":
      return (
        <ServiceAreaZipLookupSectionV3
          {...sectionLibraryV3Content.serviceAreaZipLookup}
        />
      );
    case "ContactSectionV3":
      return <ContactSectionV3 {...sectionLibraryV3Content.contact} />;
    case "FooterSectionV2":
      return <FooterSectionV2 {...sectionLibraryV3Content.footer} />;
    case "FooterSectionV3":
      return <FooterSectionV3 {...sectionLibraryV3Content.footer} />;
    default:
      return <UnknownPreviewSection section={section} />;
  }
}

function UnknownPreviewSection({ section }: { section: PreviewCanvasSection }) {
  return (
    <section className="bg-service-surface p-8 text-service-ink">
      <p className="type-label text-service-accent">Preview unavailable</p>
      <h3 className="type-heading-sm mt-3">{section.name}</h3>
      <p className="type-text-sm measure-copy mt-3 text-service-muted">
        {section.component} is listed in the blueprint but has not been wired
        into the preview renderer yet.
      </p>
    </section>
  );
}

function isFirstHero(section: PreviewCanvasSection, index: number) {
  return section.mode === "Hero" && index <= 1;
}

function getHeroSplitFullHeightVariant(section: PreviewCanvasSection) {
  return heroSplitFullHeightVariants.has(section.variant ?? "")
    ? (section.variant as HeroSplitFullHeightVariant)
    : undefined;
}

function getHeroSplitFixedImageVariant(section: PreviewCanvasSection) {
  return heroSplitFixedImageVariants.has(section.variant ?? "")
    ? (section.variant as HeroSplitFixedImageVariant)
    : undefined;
}

function getHeroSplitFixedImageRatio(section: PreviewCanvasSection) {
  return heroSplitFixedImageRatios.has(section.ratio ?? "")
    ? (section.ratio as HeroSplitFixedImageRatio)
    : undefined;
}
