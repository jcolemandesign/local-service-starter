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
import { PagebuilderShell } from "@/components/sections/PagebuilderShell";
import { pagebuilderRecipes, sectionModes } from "@/content/pagebuilder";
import { sectionLibraryV3Content } from "@/content/section-library-v3";
import type { PagebuilderRecipeSection } from "@/content/pagebuilder";

const heroSplitFullHeightVariants = new Set<string>(
  sectionLibraryV3Content.heroSplitFullHeight.variants.map(
    (option) => option.variant,
  ),
);

function getHeroSplitFullHeightVariant(section: PagebuilderRecipeSection) {
  return heroSplitFullHeightVariants.has(section.variant ?? "")
    ? (section.variant as HeroSplitFullHeightVariant)
    : undefined;
}

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

function getHeroSplitFixedImageVariant(section: PagebuilderRecipeSection) {
  return heroSplitFixedImageVariants.has(section.variant ?? "")
    ? (section.variant as HeroSplitFixedImageVariant)
    : undefined;
}

function getHeroSplitFixedImageRatio(section: PagebuilderRecipeSection) {
  return heroSplitFixedImageRatios.has(section.ratio ?? "")
    ? (section.ratio as HeroSplitFixedImageRatio)
    : undefined;
}

function UnknownSection({ section }: { section: PagebuilderRecipeSection }) {
  return (
    <section className="bg-service-surface p-8 text-service-ink">
      <p className="type-label text-service-accent">Preview unavailable</p>
      <h3 className="type-heading-sm mt-3">{section.name}</h3>
      <p className="type-text-sm measure-copy mt-3 text-service-muted">
        {section.component} is listed in the recipe but has not been wired into
        the Pagebuilder renderer yet.
      </p>
    </section>
  );
}

function renderPreviewSection(section: PagebuilderRecipeSection, index: number) {
  const headingLevel = index === 1 ? 1 : 2;

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
    case "ContactSectionV3":
      return <ContactSectionV3 {...sectionLibraryV3Content.contact} />;
    case "FooterSectionV2":
      return <FooterSectionV2 {...sectionLibraryV3Content.footer} />;
    case "FooterSectionV3":
      return <FooterSectionV3 {...sectionLibraryV3Content.footer} />;
    default:
      return <UnknownSection section={section} />;
  }
}

export function PagebuilderSection() {
  const previewSections = pagebuilderRecipes.map((recipe) =>
    recipe.sectionStack.map((section, index) =>
      <div key={`${recipe.id}-${section.component}-${index}`}>
        {renderPreviewSection(section, index)}
      </div>,
    ),
  );
  function previewCatalogEntry(
    component: string,
    mode: PagebuilderRecipeSection["mode"],
    name: string,
    index: number,
  ) {
    return (
      <div key={component}>
        {renderPreviewSection(
          {
            component,
            instruction: "",
            mode,
            name,
          },
          index,
        )}
      </div>
    );
  }

  const previewCatalog = {
    NavPrimarySectionV2: (
      <div key="NavPrimarySectionV2">
        {renderPreviewSection(
          {
            component: "NavPrimarySectionV2",
            instruction: "",
            mode: "Navigation",
            name: "Primary navigation",
          },
          0,
        )}
      </div>
    ),
    NavCenterLogoSectionV2: (
      <div key="NavCenterLogoSectionV2">
        {renderPreviewSection(
          {
            component: "NavCenterLogoSectionV2",
            instruction: "",
            mode: "Navigation",
            name: "Center logo navigation",
          },
          0,
        )}
      </div>
    ),
    NavFloatingBentoSectionV2: (
      <div key="NavFloatingBentoSectionV2">
        {renderPreviewSection(
          {
            component: "NavFloatingBentoSectionV2",
            instruction: "",
            mode: "Navigation",
            name: "Floating bento navigation",
          },
          0,
        )}
      </div>
    ),
    HeroSplitFullHeightSectionV3: (
      <HeroSplitFullHeightSectionV3
        key="HeroSplitFullHeightSectionV3"
        {...sectionLibraryV3Content.heroSplitFullHeight}
        headingLevel={1}
      />
    ),
    HeroSplitFixedImageSectionV3: (
      <HeroSplitFixedImageSectionV3
        key="HeroSplitFixedImageSectionV3"
        {...sectionLibraryV3Content.heroSplitFullHeight}
        headingLevel={1}
      />
    ),
    HeroFullscreenSectionV2: (
      <div key="HeroFullscreenSectionV2">
        {renderPreviewSection(
          {
            component: "HeroFullscreenSectionV2",
            instruction: "",
            mode: "Hero",
            name: "Fullscreen image hero",
          },
          1,
        )}
      </div>
    ),
    HeroCenteredFloatersSectionV2: (
      <div key="HeroCenteredFloatersSectionV2">
        {renderPreviewSection(
          {
            component: "HeroCenteredFloatersSectionV2",
            instruction: "",
            mode: "Hero",
            name: "Centered with left right floaters",
          },
          1,
        )}
      </div>
    ),
    HeroGridMosaicSectionV2: (
      <div key="HeroGridMosaicSectionV2">
        {renderPreviewSection(
          {
            component: "HeroGridMosaicSectionV2",
            instruction: "",
            mode: "Hero",
            name: "Grid mosaic hero",
          },
          1,
        )}
      </div>
    ),
    HeroContentTopImageBottomSectionV2: (
      <div key="HeroContentTopImageBottomSectionV2">
        {renderPreviewSection(
          {
            component: "HeroContentTopImageBottomSectionV2",
            instruction: "",
            mode: "Hero",
            name: "Content top image bottom",
          },
          1,
        )}
      </div>
    ),
    TrustBarSectionV3: (
      <div key="TrustBarSectionV3">
        {renderPreviewSection(
          {
            component: "TrustBarSectionV3",
            instruction: "",
            mode: "Proof",
            name: "Trust bar",
          },
          2,
        )}
      </div>
    ),
    TrustBarFloatingBentoSectionV3: previewCatalogEntry(
      "TrustBarFloatingBentoSectionV3",
      "Proof",
      "Floating bento trust bar",
      2,
    ),
    TrustMarqueeSection: previewCatalogEntry(
      "TrustMarqueeSection",
      "Action",
      "Headline with Scrolling Banner",
      7,
    ),
    TrustMarqueeSectionV3: (
      <div key="TrustMarqueeSectionV3">
        {renderPreviewSection(
          {
            component: "TrustMarqueeSectionV3",
            instruction: "",
            mode: "Proof",
            name: "Trust marquee",
          },
          2,
        )}
      </div>
    ),
    TrustLogoGridSection: previewCatalogEntry(
      "TrustLogoGridSection",
      "Proof",
      "Legacy trust logo grid",
      2,
    ),
    TrustLogoMarqueeSectionV3: (
      <div key="TrustLogoMarqueeSectionV3">
        {renderPreviewSection(
          {
            component: "TrustLogoMarqueeSectionV3",
            instruction: "",
            mode: "Proof",
            name: "Logo marquee",
          },
          2,
        )}
      </div>
    ),
    TrustLogoGridSectionV3: (
      <div key="TrustLogoGridSectionV3">
        {renderPreviewSection(
          {
            component: "TrustLogoGridSectionV3",
            instruction: "",
            mode: "Proof",
            name: "Static trust logo grid",
          },
          2,
        )}
      </div>
    ),
    ServicesBentoCardsSectionV2: (
      <div key="ServicesBentoCardsSectionV2">
        {renderPreviewSection(
          {
            component: "ServicesBentoCardsSectionV2",
            instruction: "",
            mode: "Scan",
            name: "Services bento cards",
          },
          3,
        )}
      </div>
    ),
    ServicesHoverPanelSectionV2: (
      <div key="ServicesHoverPanelSectionV2">
        {renderPreviewSection(
          {
            component: "ServicesHoverPanelSectionV2",
            instruction: "",
            mode: "Scan",
            name: "Services hover panel",
          },
          3,
        )}
      </div>
    ),
    ServicesThreeCardsRightSectionV3: (
      <div key="ServicesThreeCardsRightSectionV3">
        {renderPreviewSection(
          {
            component: "ServicesThreeCardsRightSectionV3",
            instruction: "",
            mode: "Scan",
            name: "Services grid",
          },
          3,
        )}
      </div>
    ),
    ServicesScrollCardsSectionV2: (
      <div key="ServicesScrollCardsSectionV2">
        {renderPreviewSection(
          {
            component: "ServicesScrollCardsSectionV2",
            instruction: "",
            mode: "Scan",
            name: "Scroll service cards",
          },
          3,
        )}
      </div>
    ),
    ContentHorizontalCardCarouselSectionV2: previewCatalogEntry(
      "ContentHorizontalCardCarouselSectionV2",
      "Scan",
      "Horizontal card carousel",
      3,
    ),
    ContentRevealParagraphSectionV2: (
      <div key="ContentRevealParagraphSectionV2">
        {renderPreviewSection(
          {
            component: "ContentRevealParagraphSectionV2",
            instruction: "",
            mode: "Narrative",
            name: "Reveal paragraph",
          },
          4,
        )}
      </div>
    ),
    ContentScrollWrittenRevealSectionV2: previewCatalogEntry(
      "ContentScrollWrittenRevealSectionV2",
      "Narrative",
      "Scroll written reveal",
      4,
    ),
    ContentSplitHeadlineImageSectionV2: (
      <div key="ContentSplitHeadlineImageSectionV2">
        {renderPreviewSection(
          {
            component: "ContentSplitHeadlineImageSectionV2",
            instruction: "",
            mode: "Narrative",
            name: "Split headline image content",
          },
          4,
        )}
      </div>
    ),
    ContentSplitFixedImageSectionV3: previewCatalogEntry(
      "ContentSplitFixedImageSectionV3",
      "Narrative",
      "Split content with fixed image",
      4,
    ),
    ContentStickyCardStreamSectionV2: (
      <div key="ContentStickyCardStreamSectionV2">
        {renderPreviewSection(
          {
            component: "ContentStickyCardStreamSectionV2",
            instruction: "",
            mode: "Narrative",
            name: "Sticky card stream content",
          },
          4,
        )}
      </div>
    ),
    ContentStickyIdeasSectionV2: (
      <div key="ContentStickyIdeasSectionV2">
        {renderPreviewSection(
          {
            component: "ContentStickyIdeasSectionV2",
            instruction: "",
            mode: "Narrative",
            name: "Sticky ideas content",
          },
          4,
        )}
      </div>
    ),
    ContentAboutCompanySectionV2: (
      <div key="ContentAboutCompanySectionV2">
        {renderPreviewSection(
          {
            component: "ContentAboutCompanySectionV2",
            instruction: "",
            mode: "Narrative",
            name: "About company content",
          },
          4,
        )}
      </div>
    ),
    ContentRuleHeaderSectionV2: (
      <div key="ContentRuleHeaderSectionV2">
        {renderPreviewSection(
          {
            component: "ContentRuleHeaderSectionV2",
            instruction: "",
            mode: "Narrative",
            name: "Rule header content",
          },
          4,
        )}
      </div>
    ),
    FeaturePortraitParagraphSectionV3: previewCatalogEntry(
      "FeaturePortraitParagraphSectionV3",
      "Narrative",
      "Portrait paragraph feature",
      4,
    ),
    FeatureOverlapRowsSectionV3: previewCatalogEntry(
      "FeatureOverlapRowsSectionV3",
      "Narrative",
      "Overlap feature rows",
      4,
    ),
    FeatureAsymmetricCardsSectionV3: previewCatalogEntry(
      "FeatureAsymmetricCardsSectionV3",
      "Narrative",
      "Asymmetric feature cards",
      4,
    ),
    FAQSectionV3: (
      <div key="FAQSectionV3">
        {renderPreviewSection(
          {
            component: "FAQSectionV3",
            instruction: "",
            mode: "Decision",
            name: "FAQ",
          },
          6,
        )}
      </div>
    ),
    FAQAccordionSectionV3: (
      <div key="FAQAccordionSectionV3">
        {renderPreviewSection(
          {
            component: "FAQAccordionSectionV3",
            instruction: "",
            mode: "Decision",
            name: "FAQ accordion",
          },
          6,
        )}
      </div>
    ),
    TestimonialsSectionV3: previewCatalogEntry(
      "TestimonialsSectionV3",
      "Proof",
      "Testimonials",
      5,
    ),
    TestimonialsCarouselSectionV3: (
      <div key="TestimonialsCarouselSectionV3">
        {renderPreviewSection(
          {
            component: "TestimonialsCarouselSectionV3",
            instruction: "",
            mode: "Proof",
            name: "Customer stories",
          },
          6,
        )}
      </div>
    ),
    TestimonialsMasonrySectionV3: (
      <div key="TestimonialsMasonrySectionV3">
        {renderPreviewSection(
          {
            component: "TestimonialsMasonrySectionV3",
            instruction: "",
            mode: "Proof",
            name: "Masonry testimonials",
          },
          6,
        )}
      </div>
    ),
    ProcessStepsSectionV3: previewCatalogEntry(
      "ProcessStepsSectionV3",
      "Decision",
      "Process steps",
      6,
    ),
    ProcessImageChecklistSectionV3: (
      <div key="ProcessImageChecklistSectionV3">
        {renderPreviewSection(
          {
            component: "ProcessImageChecklistSectionV3",
            instruction: "",
            mode: "Decision",
            name: "Process image checklist",
          },
          6,
        )}
      </div>
    ),
    CTASectionV3: previewCatalogEntry("CTASectionV3", "Action", "CTA", 7),
    CTAFullscreenSectionV3: (
      <div key="CTAFullscreenSectionV3">
        {renderPreviewSection(
          {
            component: "CTAFullscreenSectionV3",
            instruction: "",
            mode: "Action",
            name: "Fullscreen conversion",
          },
          7,
        )}
      </div>
    ),
    CTAScrollRevealOfferSectionV3: (
      <div key="CTAScrollRevealOfferSectionV3">
        {renderPreviewSection(
          {
            component: "CTAScrollRevealOfferSectionV3",
            instruction: "",
            mode: "Action",
            name: "Scroll reveal offer conversion",
          },
          7,
        )}
      </div>
    ),
    ContentFixedCoverFadeSectionV2: previewCatalogEntry(
      "ContentFixedCoverFadeSectionV2",
      "Action",
      "Fixed cover fade",
      7,
    ),
    ContactSectionV3: (
      <div key="ContactSectionV3">
        {renderPreviewSection(
          {
            component: "ContactSectionV3",
            instruction: "",
            mode: "Utility",
            name: "Contact section",
          },
          7,
        )}
      </div>
    ),
    FooterSectionV3: (
      <div key="FooterSectionV3">
        {renderPreviewSection(
          {
            component: "FooterSectionV3",
            instruction: "",
            mode: "Utility",
            name: "Footer",
          },
          7,
        )}
      </div>
    ),
  };

  return (
    <PagebuilderShell
      previewCatalog={previewCatalog}
      previewSections={previewSections}
      recipes={pagebuilderRecipes}
      sectionModes={sectionModes}
    />
  );
}
