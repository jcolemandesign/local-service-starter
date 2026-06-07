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
import { ServicesGridSectionV2 } from "@/components/sections/ServicesGridSectionV2";
import { ServicesScrollCardsSectionV2 } from "@/components/sections/ServicesScrollCardsSectionV2";
import { TestimonialsCarouselSectionV2 } from "@/components/sections/TestimonialsCarouselSectionV2";
import { TestimonialsMasonrySectionV2 } from "@/components/sections/TestimonialsMasonrySectionV2";
import { TrustBarSection } from "@/components/sections/TrustBarSection";
import { TrustLogoGridSection } from "@/components/sections/TrustLogoMarqueeSection";
import { TrustMarqueeSection } from "@/components/sections/TrustMarqueeSection";
import { DesignLabShell } from "@/components/sections/DesignLabShell";
import { homepageRecipes, sectionModes } from "@/content/design-lab";
import { sectionLibraryContent } from "@/content/section-library";
import type { HomepageSection } from "@/content/design-lab";

function UnknownSection({ section }: { section: HomepageSection }) {
  return (
    <section className="bg-service-surface p-8 text-service-ink">
      <p className="type-label text-service-accent">Preview unavailable</p>
      <h3 className="type-heading-sm mt-3">{section.name}</h3>
      <p className="type-text-sm measure-copy mt-3 text-service-muted">
        {section.component} is listed in the recipe but has not been wired into
        the Page Builder renderer yet.
      </p>
    </section>
  );
}

function renderPreviewSection(section: HomepageSection, index: number) {
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
    case "TrustMarqueeSection":
      return <TrustMarqueeSection {...sectionLibraryContent.trustMarquee} />;
    case "TrustLogoGridSection":
      return <TrustLogoGridSection {...sectionLibraryContent.trustLogoMarquee} />;
    case "ServicesGridSectionV2":
      return <ServicesGridSectionV2 {...sectionLibraryContent.services} />;
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
    case "FAQAccordionSectionV2":
      return <FAQAccordionSectionV2 {...sectionLibraryContent.faqAccordion} />;
    case "TestimonialsCarouselSectionV2":
      return (
        <TestimonialsCarouselSectionV2
          {...sectionLibraryContent.testimonialsCarousel}
        />
      );
    case "TestimonialsMasonrySectionV2":
      return (
        <TestimonialsMasonrySectionV2
          {...sectionLibraryContent.testimonialsMasonry}
        />
      );
    case "ProcessImageChecklistSectionV2":
      return (
        <ProcessImageChecklistSectionV2
          {...sectionLibraryContent.processImageChecklist}
        />
      );
    case "CTAFullscreenSectionV2":
      return <CTAFullscreenSectionV2 {...sectionLibraryContent.ctaFullscreen} />;
    case "CTAScrollRevealOfferSectionV2":
      return (
        <CTAScrollRevealOfferSectionV2
          {...sectionLibraryContent.ctaScrollRevealOffer}
        />
      );
    case "ContactSectionV2":
      return <ContactSectionV2 {...sectionLibraryContent.contact} />;
    case "FooterSectionV2":
      return <FooterSectionV2 {...sectionLibraryContent.footer} />;
    default:
      return <UnknownSection section={section} />;
  }
}

export function DesignLabSection() {
  const previewSections = homepageRecipes.map((recipe) =>
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
    TrustBarSection: (
      <div key="TrustBarSection">
        {renderPreviewSection(
          {
            component: "TrustBarSection",
            instruction: "",
            mode: "Proof",
            name: "Trust bar",
          },
          2,
        )}
      </div>
    ),
    TrustMarqueeSection: (
      <div key="TrustMarqueeSection">
        {renderPreviewSection(
          {
            component: "TrustMarqueeSection",
            instruction: "",
            mode: "Proof",
            name: "Trust marquee",
          },
          2,
        )}
      </div>
    ),
    TrustLogoGridSection: (
      <div key="TrustLogoGridSection">
        {renderPreviewSection(
          {
            component: "TrustLogoGridSection",
            instruction: "",
            mode: "Proof",
            name: "Static trust logo grid",
          },
          2,
        )}
      </div>
    ),
    ServicesGridSectionV2: (
      <div key="ServicesGridSectionV2">
        {renderPreviewSection(
          {
            component: "ServicesGridSectionV2",
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
    FAQSectionV2: (
      <div key="FAQSectionV2">
        {renderPreviewSection(
          {
            component: "FAQSectionV2",
            instruction: "",
            mode: "Decision",
            name: "FAQ",
          },
          6,
        )}
      </div>
    ),
    FAQAccordionSectionV2: (
      <div key="FAQAccordionSectionV2">
        {renderPreviewSection(
          {
            component: "FAQAccordionSectionV2",
            instruction: "",
            mode: "Decision",
            name: "FAQ accordion",
          },
          6,
        )}
      </div>
    ),
    TestimonialsCarouselSectionV2: (
      <div key="TestimonialsCarouselSectionV2">
        {renderPreviewSection(
          {
            component: "TestimonialsCarouselSectionV2",
            instruction: "",
            mode: "Proof",
            name: "Customer stories",
          },
          6,
        )}
      </div>
    ),
    TestimonialsMasonrySectionV2: (
      <div key="TestimonialsMasonrySectionV2">
        {renderPreviewSection(
          {
            component: "TestimonialsMasonrySectionV2",
            instruction: "",
            mode: "Proof",
            name: "Masonry testimonials",
          },
          6,
        )}
      </div>
    ),
    ProcessImageChecklistSectionV2: (
      <div key="ProcessImageChecklistSectionV2">
        {renderPreviewSection(
          {
            component: "ProcessImageChecklistSectionV2",
            instruction: "",
            mode: "Decision",
            name: "Process image checklist",
          },
          6,
        )}
      </div>
    ),
    CTAFullscreenSectionV2: (
      <div key="CTAFullscreenSectionV2">
        {renderPreviewSection(
          {
            component: "CTAFullscreenSectionV2",
            instruction: "",
            mode: "Action",
            name: "Fullscreen conversion",
          },
          7,
        )}
      </div>
    ),
    CTAScrollRevealOfferSectionV2: (
      <div key="CTAScrollRevealOfferSectionV2">
        {renderPreviewSection(
          {
            component: "CTAScrollRevealOfferSectionV2",
            instruction: "",
            mode: "Action",
            name: "Scroll reveal offer conversion",
          },
          7,
        )}
      </div>
    ),
    ContactSectionV2: (
      <div key="ContactSectionV2">
        {renderPreviewSection(
          {
            component: "ContactSectionV2",
            instruction: "",
            mode: "Utility",
            name: "Contact section",
          },
          7,
        )}
      </div>
    ),
    FooterSectionV2: (
      <div key="FooterSectionV2">
        {renderPreviewSection(
          {
            component: "FooterSectionV2",
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
    <DesignLabShell
      previewCatalog={previewCatalog}
      previewSections={previewSections}
      recipes={homepageRecipes}
      sectionModes={sectionModes}
    />
  );
}
