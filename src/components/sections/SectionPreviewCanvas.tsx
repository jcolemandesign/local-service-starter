"use client";

import { useEffect, useRef, useState } from "react";
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
  body?: string;
  component: string;
  mode: string;
  name: string;
  ratio?: string;
  sourceRole?: string;
  summary?: string;
  variant?: string;
};

type SectionPreviewCanvasProps = {
  eyebrow?: string;
  pageLabel: string;
  sections: PreviewCanvasSection[];
};

const previewViewportWidth = 1536;

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

type StrategyCard = {
  body: string;
  eyebrow?: string;
  title: string;
};

type StrategyFaq = {
  answer: string;
  question: string;
};

type StrategyPreviewContent = {
  body: string;
  bullets: string[];
  cards: StrategyCard[];
  eyebrow: string;
  faqs: StrategyFaq[];
  footerLinks: string[];
  navLinks: string[];
  primaryAction: string;
  rawBody: string;
  secondaryAction: string;
  serviceAreas: string[];
  sourceRole: string;
  summary: string;
  title: string;
};

export function SectionPreviewCanvas({
  eyebrow = "Live Pre-Stage Preview",
  pageLabel,
  sections,
}: SectionPreviewCanvasProps) {
  const previewFrameRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.75);

  useEffect(() => {
    if (!previewFrameRef.current) {
      return;
    }

    const frameElement = previewFrameRef.current;

    function updatePreviewScale() {
      setPreviewScale(frameElement.clientWidth / previewViewportWidth);
    }

    updatePreviewScale();

    const resizeObserver = new ResizeObserver(updatePreviewScale);
    resizeObserver.observe(frameElement);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="min-w-[42rem] overflow-hidden rounded-sm border border-service-border bg-white shadow-sm max-xl:min-w-0">
      <div className="flex items-center justify-between gap-3 border-b border-service-border bg-service-surface px-4 py-3">
        <div>
          <p className="type-caption font-semibold text-service-accent">
            {eyebrow}
          </p>
          <p className="type-caption text-service-muted">{pageLabel}</p>
        </div>
        <span className="type-caption rounded-sm border border-service-border bg-white px-3 py-1 text-service-muted">
          {sections.length} sections
        </span>
      </div>
      <div className="bg-bg-surface p-4">
        <div
          className="mx-auto aspect-video w-full overflow-hidden rounded-sm border border-service-border bg-white shadow-sm"
          ref={previewFrameRef}
        >
          <div className="h-full overflow-y-auto overflow-x-hidden bg-white">
            <div
              className="w-[96rem] bg-white"
              style={{ zoom: previewScale }}
            >
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
      </div>
    </div>
  );
}

function buildStrategyPreviewContent(
  section: PreviewCanvasSection,
): StrategyPreviewContent {
  const rawBody = section.body ?? "";
  const title =
    extractLabeledBlock(rawBody, ["Headline", "Title", "Suggested H1"]) ??
    section.name;
  const eyebrow =
    extractLabeledBlock(rawBody, ["Eyebrow"]) ??
    section.sourceRole ??
    section.mode;
  const body =
    extractLabeledBlock(rawBody, [
      "Body copy",
      "Body",
      "Description",
      "Additional service-area copy",
      "Small note",
      "Footer urgent note",
    ]) ??
    section.summary ??
    title;
  const primaryAction =
    extractLabeledBlock(rawBody, [
      "Primary CTA",
      "Primary button",
      "CTA",
      "Footer CTA",
      "Submit button label",
    ]) ??
    extractInlineValue(rawBody, "Primary button") ??
    "Request service";
  const secondaryAction =
    extractLabeledBlock(rawBody, [
      "Secondary CTA",
      "Secondary link",
      "Secondary/mobile button",
    ]) ??
    extractInlineValue(rawBody, "Secondary/mobile button") ??
    extractInlineValue(rawBody, "Phone") ??
    "Call now";
  const bullets = uniqueStrings([
    ...extractLabeledList(rawBody, [
      "Bullets / proof points",
      "Proof points",
      "Bullets",
      "Trust bullets",
      "Decision cards",
      "Service areas to list",
      "Footer links",
    ]),
    ...extractShortBullets(rawBody),
  ]);

  return {
    body: cleanPreviewText(body),
    bullets,
    cards: extractStrategyCards(rawBody),
    eyebrow: cleanPreviewText(eyebrow),
    faqs: extractFaqs(rawBody),
    footerLinks: extractCsvOrList(rawBody, "Footer links"),
    navLinks: extractCsvOrList(rawBody, "Nav links"),
    primaryAction: cleanPreviewText(primaryAction),
    rawBody,
    secondaryAction: cleanPreviewText(secondaryAction),
    serviceAreas: uniqueStrings([
      ...extractLabeledList(rawBody, ["Service areas to list", "Service Area"]),
      ...extractCsvOrList(rawBody, "Service Area"),
    ]),
    sourceRole: section.sourceRole ?? section.mode,
    summary: section.summary ?? "",
    title: cleanPreviewText(title),
  };
}

function buildNavigationContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.navPrimary,
    action: content.primaryAction,
    links: createNavLinks(content),
    logoLabel:
      extractInlineValue(content.rawBody, "Logo") ??
      extractBusinessName(content) ??
      sectionLibraryV3Content.navPrimary.logoLabel,
    phone:
      extractInlineValue(content.rawBody, "Phone") ??
      sectionLibraryV3Content.navPrimary.phone,
  };
}

function buildHeroContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.hero,
    body: content.body,
    eyebrow: content.eyebrow,
    primaryAction: content.primaryAction,
    secondaryAction: content.secondaryAction,
    stats: createShortItems(content, sectionLibraryV3Content.hero.stats, 3),
    title: content.title,
  };
}

function buildHeroSplitContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.heroSplitFullHeight,
    body: content.body,
    eyebrow: content.eyebrow,
    primaryAction: content.primaryAction,
    secondaryAction: content.secondaryAction,
    stats: createShortItems(
      content,
      sectionLibraryV3Content.heroSplitFullHeight.stats,
      3,
    ),
    title: content.title,
  };
}

function buildHeroFullscreenContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.heroFullscreen,
    body: content.body,
    eyebrow: content.eyebrow,
    primaryAction: content.primaryAction,
    secondaryAction: content.secondaryAction,
    title: content.title,
    trustSignals: createTrustSignals(content),
  };
}

function buildHeroGridContent(content: StrategyPreviewContent) {
  const cards = getUsableCards(content, 3);

  return {
    ...sectionLibraryV3Content.heroGridMosaic,
    body: content.body,
    eyebrow: content.eyebrow,
    primaryAction: content.primaryAction,
    secondaryAction: content.secondaryAction,
    services: cards,
    title: content.title,
    trustSignals: createTrustSignals(content),
  };
}

function buildTrustBarContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.trustBar,
    items: createShortItems(content, sectionLibraryV3Content.trustBar.items, 4),
    label: content.title,
  };
}

function buildTrustMarqueeContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.trustMarquee,
    actionLabel: content.primaryAction,
    items: createShortItems(
      content,
      sectionLibraryV3Content.trustMarquee.items,
      10,
    ),
    label: content.title,
  };
}

function buildTrustLogoContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.trustLogoMarquee,
    label: content.title,
    logos: createShortItems(
      content,
      sectionLibraryV3Content.trustLogoMarquee.logos,
      8,
    ),
  };
}

function buildServicesThreeCardsContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.servicesThreeCardsRight,
    cards: getUsableCards(content, 3),
    eyebrow: content.eyebrow,
    title: content.title,
  };
}

function buildServicesBentoContent(content: StrategyPreviewContent) {
  const fallback = sectionLibraryV3Content.servicesBento.items;

  return {
    ...sectionLibraryV3Content.servicesBento,
    body: content.body,
    eyebrow: content.eyebrow,
    items: getUsableCards(content, 6).map((card, index) => ({
      ...fallback[index % fallback.length],
      body: card.body,
      title: card.title,
    })),
    title: content.title,
  };
}

function buildServicesHoverContent(content: StrategyPreviewContent) {
  const fallback = sectionLibraryV3Content.servicesHoverPanel.items;

  return {
    ...sectionLibraryV3Content.servicesHoverPanel,
    body: content.body,
    eyebrow: content.eyebrow,
    items: getUsableCards(content, 6).map((card, index) => ({
      ...fallback[index % fallback.length],
      body: card.body,
      title: card.title,
    })),
    title: content.title,
  };
}

function buildServicesScrollContent(content: StrategyPreviewContent) {
  const fallback = sectionLibraryV3Content.servicesScrollCards.items;

  return {
    ...sectionLibraryV3Content.servicesScrollCards,
    eyebrow: content.eyebrow,
    items: getUsableCards(content, 6).map((card, index) => ({
      ...fallback[index % fallback.length],
      title: card.title,
    })),
    title: content.title,
    viewAllLabel: content.secondaryAction,
  };
}

function buildHorizontalCardContent(content: StrategyPreviewContent) {
  const fallback = sectionLibraryV3Content.contentHorizontalCardCarousel.cards;

  return {
    ...sectionLibraryV3Content.contentHorizontalCardCarousel,
    body: content.body,
    cards: getUsableCards(content, 8).map((card, index) => ({
      ...fallback[index % fallback.length],
      body: card.body,
      eyebrow: card.eyebrow ?? content.eyebrow,
      title: card.title,
    })),
    eyebrow: content.eyebrow,
    title: content.title,
  };
}

function buildRevealParagraphContent(content: StrategyPreviewContent) {
  return {
    lines: splitIntoPreviewLines(content.body || content.title, 4),
  };
}

function buildSplitHeadlineContent(content: StrategyPreviewContent) {
  const titleLines = splitTitle(content.title);

  return {
    ...sectionLibraryV3Content.contentSplitHeadlineImage,
    body: content.body,
    headlineBottom: titleLines[1],
    headlineTop: titleLines[0],
  };
}

function buildStickyCardStreamContent(content: StrategyPreviewContent) {
  const fallback = sectionLibraryV3Content.contentStickyCardStream.cards;

  return {
    ...sectionLibraryV3Content.contentStickyCardStream,
    body: content.body,
    cards: getUsableCards(content, 4).map((card, index) => ({
      ...fallback[index % fallback.length],
      body: card.body,
      eyebrow: card.eyebrow ?? content.eyebrow,
      title: card.title,
    })),
    eyebrow: content.eyebrow,
    title: content.title,
  };
}

function buildStickyIdeasContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.contentStickyIdeas,
    eyebrow: content.eyebrow,
    ideas: createShortItems(
      content,
      sectionLibraryV3Content.contentStickyIdeas.ideas,
      4,
    ),
    paragraphs: splitIntoParagraphs(content.body, 4),
    title: content.title,
  };
}

function buildAboutCompanyContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.contentAboutCompany,
    action: content.primaryAction,
    eyebrow: content.eyebrow,
    statement: content.title,
    summary: content.body,
  };
}

function buildRuleHeaderContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.contentRuleHeader,
    eyebrow: content.eyebrow,
    title: content.title,
  };
}

function buildPortraitParagraphContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.featurePortraitParagraph,
    body: content.body,
  };
}

function buildFeatureOverlapContent(content: StrategyPreviewContent) {
  const fallback = sectionLibraryV3Content.featureOverlapRows.items;

  return {
    ...sectionLibraryV3Content.featureOverlapRows,
    items: getUsableCards(content, 2).map((card, index) => ({
      ...fallback[index % fallback.length],
      body: card.body,
      eyebrow: card.eyebrow ?? content.eyebrow,
      title: card.title,
    })),
  };
}

function buildFeatureCardsContent(content: StrategyPreviewContent) {
  const fallback = sectionLibraryV3Content.featureAsymmetricCards.cards;

  return {
    ...sectionLibraryV3Content.featureAsymmetricCards,
    actionLabel: content.primaryAction,
    body: content.body,
    cards: getUsableCards(content, 4).map((card, index) => ({
      ...fallback[index % fallback.length],
      body: card.body,
      title: card.title,
    })),
    eyebrow: content.eyebrow,
    title: content.title,
  };
}

function buildFaqContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.faq,
    body: content.body,
    eyebrow: content.eyebrow,
    items:
      content.faqs.length > 0 ? content.faqs : sectionLibraryV3Content.faq.items,
    title: content.title,
  };
}

function buildTestimonialsContent(content: StrategyPreviewContent) {
  const cards = getUsableCards(content, 2);

  return {
    ...sectionLibraryV3Content.testimonials,
    body: content.body,
    eyebrow: content.eyebrow,
    items: cards.map((card, index) => ({
      author: `Proof point ${index + 1}`,
      detail: content.sourceRole,
      quote: card.body || card.title,
    })),
    title: content.title,
  };
}

function buildTestimonialsCarouselContent(content: StrategyPreviewContent) {
  const fallback = sectionLibraryV3Content.testimonialsCarousel.items;

  return {
    ...sectionLibraryV3Content.testimonialsCarousel,
    body: content.body,
    eyebrow: content.eyebrow,
    items: getUsableCards(content, 3).map((card, index) => ({
      ...fallback[index % fallback.length],
      quote: card.body || card.title,
      service: card.title,
    })),
    title: content.title,
  };
}

function buildTestimonialsMasonryContent(content: StrategyPreviewContent) {
  const fallback = sectionLibraryV3Content.testimonialsMasonry.items;

  return {
    ...sectionLibraryV3Content.testimonialsMasonry,
    body: content.body,
    eyebrow: content.eyebrow,
    items: getUsableCards(content, 6).map((card, index) => ({
      ...fallback[index % fallback.length],
      quote: card.body || card.title,
    })),
    title: content.title,
  };
}

function buildProcessContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.process,
    body: content.body,
    eyebrow: content.eyebrow,
    steps: getUsableCards(content, 4),
    title: content.title,
  };
}

function buildProcessChecklistContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.processImageChecklist,
    action: content.primaryAction,
    body: content.body,
    eyebrow: content.eyebrow,
    items: createShortItems(
      content,
      sectionLibraryV3Content.processImageChecklist.items,
      5,
    ),
    title: content.title,
  };
}

function buildCtaContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.cta,
    action: content.primaryAction,
    body: content.body,
    title: content.title,
  };
}

function buildCtaFullscreenContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.ctaFullscreen,
    action: content.primaryAction,
    body: content.body,
    eyebrow: content.eyebrow,
    title: content.title,
  };
}

function buildOfferContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.ctaScrollRevealOffer,
    action: content.primaryAction,
    closeBody: content.secondaryAction,
    closeEyebrow: "Next step",
    closeTitle: content.primaryAction,
    introBody: content.body,
    introEyebrow: content.eyebrow,
    introTitle: content.title,
    offerBody: content.body,
    offerDetail: content.bullets.slice(0, 2).join(" ") || content.summary,
    offerEyebrow: content.eyebrow,
    offerTitle: content.title,
  };
}

function buildFixedCoverContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.contentFixedCoverFade,
    backgroundBody: content.body,
    backgroundEyebrow: content.eyebrow,
    backgroundTitle: content.title,
    foregroundBody: content.body,
    foregroundEyebrow: "Next step",
    foregroundTitle: content.primaryAction,
    items: createContactDetails(content),
  };
}

function buildServiceAreaContent(content: StrategyPreviewContent) {
  const serviceAreas =
    content.serviceAreas.length > 0
      ? content.serviceAreas
      : createShortItems(
          content,
          sectionLibraryV3Content.serviceAreaZipLookup.columns.flat(),
          6,
        );

  return {
    ...sectionLibraryV3Content.serviceAreaZipLookup,
    body: content.body,
    columns: chunkItems(serviceAreas, 2),
    eyebrow: content.eyebrow,
    successActionLabel: content.primaryAction,
    title: content.title,
  };
}

function buildContactContent(content: StrategyPreviewContent) {
  return {
    ...sectionLibraryV3Content.contact,
    body: content.body,
    details: createContactDetails(content),
    eyebrow: content.eyebrow,
    title: content.title,
  };
}

function buildFooterContent(content: StrategyPreviewContent) {
  const businessName =
    extractBusinessName(content) ?? sectionLibraryV3Content.footer.businessName;
  const footerLinks =
    content.footerLinks.length > 0
      ? content.footerLinks
      : ["Home", "Services", "About", "Reviews", "Service Area", "Contact"];
  const services = getUsableCards(content, 6).map((card) => card.title);
  const serviceAreas =
    content.serviceAreas.length > 0
      ? content.serviceAreas
      : createShortItems(
          content,
          sectionLibraryV3Content.footer.serviceAreas.map((area) => area.label),
          6,
        );

  return {
    ...sectionLibraryV3Content.footer,
    businessName,
    contact: {
      address:
        extractInlineValue(content.rawBody, "Address") ??
        sectionLibraryV3Content.footer.contact.address,
      email:
        extractInlineValue(content.rawBody, "Email") ??
        sectionLibraryV3Content.footer.contact.email,
      name: businessName,
      phone:
        extractInlineValue(content.rawBody, "Phone") ??
        sectionLibraryV3Content.footer.contact.phone,
    },
    copyright: `(c) 2026 ${businessName}. All rights reserved.`,
    description: content.body,
    quickLinks: footerLinks.map(toFooterLink),
    reviewLink: {
      label: "Reviews",
      href: "#reviews",
    },
    serviceAreas: serviceAreas.map(toFooterLink),
    services: services.map(toFooterLink),
  };
}

function createNavLinks(content: StrategyPreviewContent) {
  if (content.navLinks.length > 0) {
    return content.navLinks.slice(0, 6).map((label) => ({ label }));
  }

  return sectionLibraryV3Content.navPrimary.links.slice(0, 6);
}

function createTrustSignals(content: StrategyPreviewContent) {
  const items = createShortItems(content, ["Local", "Clear", "Responsive"], 3);

  return items.map((item) => {
    const [value, ...labelParts] = item.split(/\s+/);

    return {
      label: labelParts.join(" ") || item,
      value,
    };
  });
}

function createContactDetails(content: StrategyPreviewContent) {
  return uniqueStrings([
    extractInlineValue(content.rawBody, "Phone") ?? "",
    extractInlineValue(content.rawBody, "Email") ?? "",
    extractLabeledBlock(content.rawBody, ["Hours"]) ?? "",
    extractInlineValue(content.rawBody, "Address") ?? "",
  ]).filter(Boolean);
}

function getUsableCards(
  content: StrategyPreviewContent,
  count: number,
): StrategyCard[] {
  const cards =
    content.cards.length > 0
      ? content.cards
      : content.bullets.map((bullet) => ({
          body: bullet,
          title: titleFromText(bullet),
        }));

  const fallbackCards: StrategyCard[] = [
    {
      body: content.body,
      title: content.title,
    },
  ];

  return fillItems(cards.length > 0 ? cards : fallbackCards, count);
}

function createShortItems(
  content: StrategyPreviewContent,
  fallback: readonly string[],
  count: number,
) {
  const items = uniqueStrings([
    ...content.bullets,
    ...content.cards.map((card) => card.title),
  ]).map((item) => trimSentence(item, 64));

  return fillItems(items.length > 0 ? items : [...fallback], count);
}

function fillItems<T>(items: T[], count: number) {
  return items.slice(0, count);
}

function chunkItems(items: string[], columnCount: number) {
  const columns = Array.from({ length: columnCount }, () => [] as string[]);

  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });

  return columns;
}

function toFooterLink(label: string) {
  return {
    href: `#${slugifyLabel(label)}`,
    label,
  };
}

function extractBusinessName(content: StrategyPreviewContent) {
  return (
    extractInlineValue(content.rawBody, "Business name") ??
    extractInlineValue(content.rawBody, "Logo") ??
    content.cards.find((card) => card.title.toLowerCase().includes("hvac"))
      ?.title
  );
}

function extractLabeledBlock(body: string, labels: string[]) {
  for (const label of labels) {
    const pattern = new RegExp(
      `(?:^|\\n)\\s*\\*\\*${escapeRegExp(label)}:\\*\\*\\s*\\n?([\\s\\S]*?)(?=\\n\\s*\\*\\*[^\\n]+:\\*\\*|\\n\\s*###\\s|\\n\\s*---|$)`,
      "i",
    );
    const match = body.match(pattern);
    const value = cleanPreviewText(match?.[1] ?? "");

    if (value) {
      return value;
    }
  }

  return undefined;
}

function extractInlineValue(body: string, label: string) {
  const boldPattern = new RegExp(
    `(?:^|\\n)\\s*\\*\\*${escapeRegExp(label)}:\\*\\*\\s*\\n?([^\\n]+)`,
    "i",
  );
  const inlinePattern = new RegExp(
    `(?:^|\\n)\\s*[*-]?\\s*${escapeRegExp(label)}:\\s*([^\\n]+)`,
    "i",
  );
  const match = body.match(boldPattern) ?? body.match(inlinePattern);

  return cleanPreviewText(match?.[1] ?? "") || undefined;
}

function extractCsvOrList(body: string, label: string) {
  const inlineValue = extractInlineValue(body, label);
  const blockValue = extractLabeledBlock(body, [label]);
  const value = inlineValue ?? blockValue ?? "";

  return uniqueStrings(
    value
      .split(/,|\n/)
      .map((item) => cleanPreviewText(item.replace(/^[-*]\s*/, "")))
      .filter(Boolean),
  );
}

function extractLabeledList(body: string, labels: string[]) {
  const block = extractLabeledBlock(body, labels);

  if (!block) {
    return [];
  }

  return block
    .split("\n")
    .map((line) => cleanPreviewText(line.replace(/^[-*]\s*/, "")))
    .filter(Boolean)
    .filter((line) => !line.toLowerCase().startsWith("cta:"));
}

function extractShortBullets(body: string) {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => cleanPreviewText(line.replace(/^[-*]\s+/, "")))
    .filter((line) => line.length > 0 && line.length < 110);
}

function extractStrategyCards(body: string): StrategyCard[] {
  const cards: StrategyCard[] = [];
  const lines = body.split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    const stepMatch = line.match(/^###\s+(.+)$/);
    const boldMatch = line.match(/^\*\*([^:*][^:*]{1,80})\*\*$/);
    const rawTitle = stepMatch?.[1] ?? boldMatch?.[1];

    if (!rawTitle) {
      continue;
    }

    const title = cleanPreviewText(rawTitle.replace(/^Step\s+\d+:\s*/i, ""));
    const bodyLines: string[] = [];

    for (let nextIndex = index + 1; nextIndex < lines.length; nextIndex += 1) {
      const nextLine = lines[nextIndex].trim();

      if (
        /^###\s+/.test(nextLine) ||
        /^\*\*[^:*][^*]{1,80}\*\*$/.test(nextLine) ||
        /^---$/.test(nextLine)
      ) {
        break;
      }

      if (nextLine) {
        bodyLines.push(nextLine);
      }
    }

    const cardBody = cleanPreviewText(
      bodyLines
        .filter((bodyLine) => !/^cta:/i.test(bodyLine))
        .join(" "),
    );

    if (title && cardBody && !isLabelLike(title)) {
      cards.push({
        body: cardBody,
        title,
      });
    }
  }

  return cards;
}

function extractFaqs(body: string): StrategyFaq[] {
  const matches = Array.from(body.matchAll(/^###\s+(.+?)\s*$/gm));

  return matches
    .map((match, index) => {
      const start = (match.index ?? 0) + match[0].length;
      const nextStart = matches[index + 1]?.index ?? body.length;
      const question = cleanPreviewText(match[1]);
      const answer = cleanPreviewText(body.slice(start, nextStart));

      return {
        answer,
        question,
      };
    })
    .filter((faq) => faq.question.includes("?") && faq.answer);
}

function splitIntoPreviewLines(value: string, lineCount: number) {
  const words = cleanPreviewText(value).split(/\s+/).filter(Boolean);
  const wordsPerLine = Math.max(4, Math.ceil(words.length / lineCount));
  const lines = Array.from({ length: lineCount }, (_, index) =>
    words.slice(index * wordsPerLine, (index + 1) * wordsPerLine).join(" "),
  ).filter(Boolean);

  return lines.length > 0
    ? lines
    : sectionLibraryV3Content.contentRevealParagraph.lines;
}

function splitIntoParagraphs(value: string, count: number) {
  const paragraphs = value
    .split(/(?<=\.)\s+/)
    .map((paragraph) => cleanPreviewText(paragraph))
    .filter(Boolean);

  return fillItems(
    paragraphs.length > 0
      ? paragraphs
      : [...sectionLibraryV3Content.contentStickyIdeas.paragraphs],
    count,
  );
}

function splitTitle(value: string) {
  const words = value.split(/\s+/).filter(Boolean);
  const midpoint = Math.ceil(words.length / 2);
  const top = words.slice(0, midpoint).join(" ");
  const bottom = words.slice(midpoint).join(" ");

  return [top || value, bottom || ""] as const;
}

function titleFromText(value: string) {
  return trimSentence(value.split(/[,.]/)[0] || value, 48);
}

function trimSentence(value: string, maxLength: number) {
  const cleanValue = cleanPreviewText(value);

  return cleanValue.length > maxLength
    ? `${cleanValue.slice(0, maxLength - 1).trim()}...`
    : cleanValue;
}

function cleanPreviewText(value: string) {
  return value
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/^[-*]\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function isLabelLike(value: string) {
  return /^(additional|body|bullets|confirmation|cta|eyebrow|footer|header|headline|image|optional|primary|secondary|small|urgent)\b/i.test(
    value,
  );
}

function slugifyLabel(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


function renderPreviewSection(section: PreviewCanvasSection, index: number) {
  const headingLevel = isFirstHero(section, index) ? 1 : 2;
  const strategyContent = buildStrategyPreviewContent(section);

  switch (section.component) {
    case "NavPrimarySectionV2":
      return <NavPrimarySectionV2 {...buildNavigationContent(strategyContent)} />;
    case "NavCenterLogoSectionV2":
      return (
        <NavCenterLogoSectionV2 {...buildNavigationContent(strategyContent)} />
      );
    case "NavFloatingBentoSectionV2":
      return (
        <NavFloatingBentoSectionV2 {...buildNavigationContent(strategyContent)} />
      );
    case "HeroSplitFullHeightSectionV3":
      return (
        <HeroSplitFullHeightSectionV3
          {...buildHeroSplitContent(strategyContent)}
          headingLevel={headingLevel}
          variant={getHeroSplitFullHeightVariant(section)}
        />
      );
    case "HeroSplitFixedImageSectionV3":
      return (
        <HeroSplitFixedImageSectionV3
          {...buildHeroSplitContent(strategyContent)}
          headingLevel={headingLevel}
          ratio={getHeroSplitFixedImageRatio(section)}
          variant={getHeroSplitFixedImageVariant(section)}
        />
      );
    case "HeroFullscreenSectionV2":
      return (
        <HeroFullscreenSectionV2
          {...buildHeroFullscreenContent(strategyContent)}
          headingLevel={headingLevel}
        />
      );
    case "HeroCenteredFloatersSectionV2":
      return (
        <HeroCenteredFloatersSectionV2
          {...buildHeroContent(strategyContent)}
          headingLevel={headingLevel}
        />
      );
    case "HeroGridMosaicSectionV2":
      return (
        <HeroGridMosaicSectionV2
          {...buildHeroGridContent(strategyContent)}
          headingLevel={headingLevel}
        />
      );
    case "HeroContentTopImageBottomSectionV2":
      return (
        <HeroContentTopImageBottomSectionV2
          {...buildHeroContent(strategyContent)}
          headingLevel={headingLevel}
        />
      );
    case "TrustBarSectionV3":
      return <TrustBarSectionV3 {...buildTrustBarContent(strategyContent)} />;
    case "TrustBarFloatingBentoSectionV3":
      return (
        <TrustBarFloatingBentoSectionV3
          {...buildTrustBarContent(strategyContent)}
        />
      );
    case "TrustMarqueeSection":
      return <TrustMarqueeSection {...buildTrustMarqueeContent(strategyContent)} />;
    case "TrustMarqueeSectionV3":
      return (
        <TrustMarqueeSectionV3 {...buildTrustMarqueeContent(strategyContent)} />
      );
    case "TrustLogoGridSection":
      return (
        <TrustLogoGridSection {...buildTrustLogoContent(strategyContent)} />
      );
    case "TrustLogoMarqueeSectionV3":
      return (
        <TrustLogoMarqueeSectionV3
          {...buildTrustLogoContent(strategyContent)}
        />
      );
    case "TrustLogoGridSectionV3":
      return (
        <TrustLogoGridSectionV3
          {...buildTrustLogoContent(strategyContent)}
        />
      );
    case "ServicesBentoCardsSectionV2":
      return (
        <ServicesBentoCardsSectionV2
          {...buildServicesBentoContent(strategyContent)}
        />
      );
    case "ServicesHoverPanelSectionV2":
      return (
        <ServicesHoverPanelSectionV2
          {...buildServicesHoverContent(strategyContent)}
        />
      );
    case "ServicesThreeCardsRightSectionV3":
      return (
        <ServicesThreeCardsRightSectionV3
          {...buildServicesThreeCardsContent(strategyContent)}
        />
      );
    case "ServicesScrollCardsSectionV2":
      return (
        <ServicesScrollCardsSectionV2
          {...buildServicesScrollContent(strategyContent)}
        />
      );
    case "ContentHorizontalCardCarouselSectionV2":
      return (
        <ContentHorizontalCardCarouselSectionV2
          {...buildHorizontalCardContent(strategyContent)}
        />
      );
    case "ContentRevealParagraphSectionV2":
      return (
        <ContentRevealParagraphSectionV2
          {...buildRevealParagraphContent(strategyContent)}
        />
      );
    case "ContentScrollWrittenRevealSectionV2":
      return (
        <ContentScrollWrittenRevealSectionV2
          {...buildRevealParagraphContent(strategyContent)}
        />
      );
    case "ContentSplitHeadlineImageSectionV2":
      return (
        <ContentSplitHeadlineImageSectionV2
          {...buildSplitHeadlineContent(strategyContent)}
        />
      );
    case "ContentSplitFixedImageSectionV3":
      return (
        <ContentSplitFixedImageSectionV3
          {...buildHeroSplitContent(strategyContent)}
          headingLevel={headingLevel}
        />
      );
    case "ContentStickyCardStreamSectionV2":
      return (
        <ContentStickyCardStreamSectionV2
          {...buildStickyCardStreamContent(strategyContent)}
        />
      );
    case "ContentStickyIdeasSectionV2":
      return (
        <ContentStickyIdeasSectionV2
          {...buildStickyIdeasContent(strategyContent)}
        />
      );
    case "ContentAboutCompanySectionV2":
      return (
        <ContentAboutCompanySectionV2
          {...buildAboutCompanyContent(strategyContent)}
        />
      );
    case "ContentRuleHeaderSectionV2":
      return (
        <ContentRuleHeaderSectionV2
          {...buildRuleHeaderContent(strategyContent)}
        />
      );
    case "FeaturePortraitParagraphSectionV3":
      return (
        <FeaturePortraitParagraphSectionV3
          {...buildPortraitParagraphContent(strategyContent)}
        />
      );
    case "FeatureOverlapRowsSectionV3":
      return (
        <FeatureOverlapRowsSectionV3
          {...buildFeatureOverlapContent(strategyContent)}
        />
      );
    case "FeatureAsymmetricCardsSectionV3":
      return (
        <FeatureAsymmetricCardsSectionV3
          {...buildFeatureCardsContent(strategyContent)}
        />
      );
    case "FAQSectionV3":
      return <FAQSectionV3 {...buildFaqContent(strategyContent)} />;
    case "FAQAccordionSectionV3":
      return <FAQAccordionSectionV3 {...buildFaqContent(strategyContent)} />;
    case "TestimonialsSectionV3":
      return <TestimonialsSectionV3 {...buildTestimonialsContent(strategyContent)} />;
    case "TestimonialsCarouselSectionV3":
      return (
        <TestimonialsCarouselSectionV3
          {...buildTestimonialsCarouselContent(strategyContent)}
        />
      );
    case "TestimonialsMasonrySectionV2":
      return (
        <TestimonialsMasonrySectionV2
          {...buildTestimonialsMasonryContent(strategyContent)}
        />
      );
    case "TestimonialsMasonrySectionV3":
      return (
        <TestimonialsMasonrySectionV3
          {...buildTestimonialsMasonryContent(strategyContent)}
        />
      );
    case "ProcessImageChecklistSectionV2":
      return (
        <ProcessImageChecklistSectionV2
          {...buildProcessChecklistContent(strategyContent)}
        />
      );
    case "ProcessImageChecklistSectionV3":
      return (
        <ProcessImageChecklistSectionV3
          {...buildProcessChecklistContent(strategyContent)}
        />
      );
    case "ProcessStepsSectionV3":
      return <ProcessStepsSectionV3 {...buildProcessContent(strategyContent)} />;
    case "CTASectionV3":
      return <CTASectionV3 {...buildCtaContent(strategyContent)} />;
    case "CTAFullscreenSectionV2":
      return <CTAFullscreenSectionV2 {...buildCtaFullscreenContent(strategyContent)} />;
    case "CTAFullscreenSectionV3":
      return <CTAFullscreenSectionV3 {...buildCtaFullscreenContent(strategyContent)} />;
    case "CTAScrollRevealOfferSectionV2":
      return (
        <CTAScrollRevealOfferSectionV2
          {...buildOfferContent(strategyContent)}
        />
      );
    case "CTAScrollRevealOfferSectionV3":
      return (
        <CTAScrollRevealOfferSectionV3
          {...buildOfferContent(strategyContent)}
        />
      );
    case "ContentFixedCoverFadeSectionV2":
      return (
        <ContentFixedCoverFadeSectionV2
          {...buildFixedCoverContent(strategyContent)}
        />
      );
    case "ContactSectionV2":
      return <ContactSectionV2 {...buildContactContent(strategyContent)} />;
    case "ServiceAreaZipLookupSectionV3":
      return (
        <ServiceAreaZipLookupSectionV3
          {...buildServiceAreaContent(strategyContent)}
        />
      );
    case "ContactSectionV3":
      return <ContactSectionV3 {...buildContactContent(strategyContent)} />;
    case "FooterSectionV2":
      return <FooterSectionV2 {...buildFooterContent(strategyContent)} />;
    case "FooterSectionV3":
      return <FooterSectionV3 {...buildFooterContent(strategyContent)} />;
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
