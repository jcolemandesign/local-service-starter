import { ContentAboutCompanySectionV2 } from "@/components/sections/ContentAboutCompanySectionV2";
import { ContactSectionV2 } from "@/components/sections/ContactSectionV2";
import { CTAFullscreenSectionV2 } from "@/components/sections/CTAFullscreenSectionV2";
import { CTAScrollRevealOfferSectionV2 } from "@/components/sections/CTAScrollRevealOfferSectionV2";
import { ContentPositioningSplitSectionV2 } from "@/components/sections/ContentPositioningSplitSectionV2";
import { ContentRevealParagraphSectionV2 } from "@/components/sections/ContentRevealParagraphSectionV2";
import { ContentRuleHeaderSectionV2 } from "@/components/sections/ContentRuleHeaderSectionV2";
import { ContentStickyCardStreamSectionV2 } from "@/components/sections/ContentStickyCardStreamSectionV2";
import { ContentSplitHeadlineImageSectionV2 } from "@/components/sections/ContentSplitHeadlineImageSectionV2";
import { ContentStickyIdeasSectionV2 } from "@/components/sections/ContentStickyIdeasSectionV2";
import { FAQAccordionSectionV2 } from "@/components/sections/FAQAccordionSectionV2";
import { FAQSectionV2 } from "@/components/sections/FAQSectionV2";
import {
  ContactSectionV3,
  CTAFullscreenSectionV3,
  FooterSectionV3,
  FAQSectionV3,
} from "@/components/sections/FAQConversionContactFooterSectionsV3";
import { CTAScrollRevealOfferSectionV3 } from "@/components/sections/CTAScrollRevealOfferSectionV3";
import { FAQAccordionSectionV3 } from "@/components/sections/FAQAccordionSectionV3";
import { HeroBentoSectionV2 } from "@/components/sections/HeroBentoSectionV2";
import { HeroCenteredFloatersSectionV2 } from "@/components/sections/HeroCenteredFloatersSectionV2";
import { HeroContentTopImageBottomSectionV2 } from "@/components/sections/HeroContentTopImageBottomSectionV2";
import { HeroFullscreenSectionV2 } from "@/components/sections/HeroFullscreenSectionV2";
import { HeroGridMosaicSectionV2 } from "@/components/sections/HeroGridMosaicSectionV2";
import { FooterSectionV2 } from "@/components/sections/FooterSectionV2";
import {
  NavCenterLogoSectionV2,
  NavPrimarySectionV2,
} from "@/components/sections/NavPrimarySectionV2";
import { NavFloatingBentoSectionV2 } from "@/components/sections/NavFloatingBentoSectionV2";
import { ProcessImageChecklistSectionV2 } from "@/components/sections/ProcessImageChecklistSectionV2";
import { ProcessImageChecklistSectionV3 } from "@/components/sections/ProcessImageChecklistSectionV3";
import { ServicesGridSectionV2 } from "@/components/sections/ServicesGridSectionV2";
import { ServicesScrollCardsSectionV2 } from "@/components/sections/ServicesScrollCardsSectionV2";
import { ServicesThreeCardsRightSectionV3 } from "@/components/sections/ServicesThreeCardsRightSectionV3";
import { TestimonialsCarouselSectionV2 } from "@/components/sections/TestimonialsCarouselSectionV2";
import { TestimonialsCarouselSectionV3 } from "@/components/sections/TestimonialsCarouselSectionV3";
import { TestimonialsMasonrySectionV2 } from "@/components/sections/TestimonialsMasonrySectionV2";
import { TestimonialsMasonrySectionV3 } from "@/components/sections/TestimonialsMasonrySectionV3";
import { TrustBarSection } from "@/components/sections/TrustBarSection";
import { TrustLogoGridSection } from "@/components/sections/TrustLogoMarqueeSection";
import { TrustMarqueeSection } from "@/components/sections/TrustMarqueeSection";
import {
  TrustBarSectionV3,
  TrustLogoGridSectionV3,
  TrustMarqueeSectionV3,
} from "@/components/sections/TrustSectionsV3";
import { PagebuilderShell } from "@/components/sections/PagebuilderShell";
import { pagebuilderRecipes, sectionModes } from "@/content/pagebuilder";
import { sectionLibraryContent } from "@/content/section-library";
import { sectionLibraryV3Content } from "@/content/section-library-v3";
import type { PagebuilderRecipeSection } from "@/content/pagebuilder";

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
      return <NavPrimarySectionV2 {...sectionLibraryContent.navPrimary} />;
    case "NavCenterLogoSectionV2":
      return <NavCenterLogoSectionV2 {...sectionLibraryContent.navPrimary} />;
    case "NavFloatingBentoSectionV2":
      return <NavFloatingBentoSectionV2 {...sectionLibraryContent.navPrimary} />;
    case "HeroBentoSectionV2":
      return (
        <HeroBentoSectionV2
          {...sectionLibraryContent.hero}
          headingLevel={headingLevel}
        />
      );
    case "HeroFullscreenSectionV2":
      return (
        <HeroFullscreenSectionV2
          {...sectionLibraryContent.heroFullscreen}
          headingLevel={headingLevel}
        />
      );
    case "HeroCenteredFloatersSectionV2":
      return (
        <HeroCenteredFloatersSectionV2
          {...sectionLibraryContent.hero}
          headingLevel={headingLevel}
        />
      );
    case "HeroGridMosaicSectionV2":
      return (
        <HeroGridMosaicSectionV2
          {...sectionLibraryContent.heroGridMosaic}
          headingLevel={headingLevel}
        />
      );
    case "HeroContentTopImageBottomSectionV2":
      return (
        <HeroContentTopImageBottomSectionV2
          {...sectionLibraryContent.hero}
          headingLevel={headingLevel}
        />
      );
    case "TrustBarSection":
      return <TrustBarSection {...sectionLibraryContent.trustBar} />;
    case "TrustBarSectionV3":
      return <TrustBarSectionV3 {...sectionLibraryV3Content.trustBar} />;
    case "TrustMarqueeSection":
      return <TrustMarqueeSection {...sectionLibraryContent.trustMarquee} />;
    case "TrustMarqueeSectionV3":
      return <TrustMarqueeSectionV3 {...sectionLibraryV3Content.trustMarquee} />;
    case "TrustLogoGridSection":
      return <TrustLogoGridSection {...sectionLibraryContent.trustLogoMarquee} />;
    case "TrustLogoGridSectionV3":
      return (
        <TrustLogoGridSectionV3
          {...sectionLibraryV3Content.trustLogoMarquee}
        />
      );
    case "ServicesGridSectionV2":
      return <ServicesGridSectionV2 {...sectionLibraryContent.services} />;
    case "ServicesThreeCardsRightSectionV3":
      return (
        <ServicesThreeCardsRightSectionV3
          {...sectionLibraryV3Content.servicesThreeCardsRight}
        />
      );
    case "ServicesScrollCardsSectionV2":
      return (
        <ServicesScrollCardsSectionV2
          {...sectionLibraryContent.servicesScrollCards}
        />
      );
    case "ContentPositioningSplitSectionV2":
      return (
        <ContentPositioningSplitSectionV2
          {...sectionLibraryContent.contentPositioningSplit}
        />
      );
    case "ContentRevealParagraphSectionV2":
      return (
        <ContentRevealParagraphSectionV2
          {...sectionLibraryContent.contentRevealParagraph}
        />
      );
    case "ContentSplitHeadlineImageSectionV2":
      return (
        <ContentSplitHeadlineImageSectionV2
          {...sectionLibraryContent.contentSplitHeadlineImage}
        />
      );
    case "ContentStickyCardStreamSectionV2":
      return (
        <ContentStickyCardStreamSectionV2
          {...sectionLibraryContent.contentStickyCardStream}
        />
      );
    case "ContentStickyIdeasSectionV2":
      return (
        <ContentStickyIdeasSectionV2
          {...sectionLibraryContent.contentStickyIdeas}
        />
      );
    case "ContentAboutCompanySectionV2":
      return (
        <ContentAboutCompanySectionV2
          {...sectionLibraryContent.contentAboutCompany}
        />
      );
    case "ContentRuleHeaderSectionV2":
      return (
        <ContentRuleHeaderSectionV2
          {...sectionLibraryContent.contentRuleHeader}
        />
      );
    case "FAQSectionV2":
      return <FAQSectionV2 {...sectionLibraryContent.faq} />;
    case "FAQSectionV3":
      return <FAQSectionV3 {...sectionLibraryContent.faq} />;
    case "FAQAccordionSectionV2":
      return <FAQAccordionSectionV2 {...sectionLibraryContent.faqAccordion} />;
    case "FAQAccordionSectionV3":
      return <FAQAccordionSectionV3 {...sectionLibraryContent.faqAccordion} />;
    case "TestimonialsCarouselSectionV2":
      return (
        <TestimonialsCarouselSectionV2
          {...sectionLibraryContent.testimonialsCarousel}
        />
      );
    case "TestimonialsCarouselSectionV3":
      return (
        <TestimonialsCarouselSectionV3
          {...sectionLibraryContent.testimonialsCarousel}
        />
      );
    case "TestimonialsMasonrySectionV2":
      return (
        <TestimonialsMasonrySectionV2
          {...sectionLibraryContent.testimonialsMasonry}
        />
      );
    case "TestimonialsMasonrySectionV3":
      return (
        <TestimonialsMasonrySectionV3
          {...sectionLibraryContent.testimonialsMasonry}
        />
      );
    case "ProcessImageChecklistSectionV2":
      return (
        <ProcessImageChecklistSectionV2
          {...sectionLibraryContent.processImageChecklist}
        />
      );
    case "ProcessImageChecklistSectionV3":
      return (
        <ProcessImageChecklistSectionV3
          {...sectionLibraryContent.processImageChecklist}
        />
      );
    case "CTAFullscreenSectionV2":
      return <CTAFullscreenSectionV2 {...sectionLibraryContent.ctaFullscreen} />;
    case "CTAFullscreenSectionV3":
      return <CTAFullscreenSectionV3 {...sectionLibraryContent.ctaFullscreen} />;
    case "CTAScrollRevealOfferSectionV2":
      return (
        <CTAScrollRevealOfferSectionV2
          {...sectionLibraryContent.ctaScrollRevealOffer}
        />
      );
    case "CTAScrollRevealOfferSectionV3":
      return (
        <CTAScrollRevealOfferSectionV3
          {...sectionLibraryContent.ctaScrollRevealOffer}
        />
      );
    case "ContactSectionV2":
      return <ContactSectionV2 {...sectionLibraryContent.contact} />;
    case "ContactSectionV3":
      return <ContactSectionV3 {...sectionLibraryContent.contact} />;
    case "FooterSectionV2":
      return <FooterSectionV2 {...sectionLibraryContent.footer} />;
    case "FooterSectionV3":
      return <FooterSectionV3 {...sectionLibraryContent.footer} />;
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
    HeroBentoSectionV2: (
      <div key="HeroBentoSectionV2">
        {renderPreviewSection(
          {
            component: "HeroBentoSectionV2",
            instruction: "",
            mode: "Hero",
            name: "Split hero image right full height",
          },
          1,
        )}
      </div>
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
    ContentPositioningSplitSectionV2: (
      <div key="ContentPositioningSplitSectionV2">
        {renderPreviewSection(
          {
            component: "ContentPositioningSplitSectionV2",
            instruction: "",
            mode: "Narrative",
            name: "General editorial texture",
          },
          4,
        )}
      </div>
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
