"use client";

import type { CSSProperties, DragEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ContentSplitFixedImageSectionV3,
  type ContentSplitFixedImageRatio,
  type ContentSplitFixedImageVariant,
} from "@/components/sections/ContentSplitFixedImageSectionV3";
import {
  HeroSplitFixedImageSectionV3,
  type HeroSplitFixedImageRatio,
  type HeroSplitFixedImageVariant,
} from "@/components/sections/HeroSplitFixedImageSectionV3";
import {
  HeroSplitFullHeightSectionV3,
  type HeroSplitFullHeightVariant,
} from "@/components/sections/HeroSplitFullHeightSectionV3";
import {
  HeroCompactSectionV3,
  type HeroCompactAlign,
} from "@/components/sections/HeroCompactSectionV3";
import { DownArrowIcon } from "@/components/primitives";
import type { PagebuilderRecipe, SectionMode } from "@/content/pagebuilder";
import { sectionLibraryV3Content } from "@/content/section-library-v3";

type PagebuilderShellProps = {
  previewCatalog: Record<string, ReactNode>;
  previewSections: ReactNode[][];
  recipes: PagebuilderRecipe[];
  sectionModes: SectionMode[];
};

type WorkingSection = PagebuilderRecipe["sectionStack"][number] & {
  id: string;
  included: boolean;
  originalComponent: string;
  originalIndex: number;
};

type DragDropPosition = "before" | "after" | null;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type PreviewVariableStyle = CSSProperties & Record<`--${string}`, string>;

const normalSpacingClassName = "pagebuilder-density-normal";
const splitContentImageComponent = "HeroSplitFullHeightSectionV3";
const fixedRatioSplitComponent = "HeroSplitFixedImageSectionV3";
const contentFixedRatioSplitComponent = "ContentSplitFixedImageSectionV3";
const heroCompactComponent = "HeroCompactSectionV3";
const splitContentImageVariantOptions = [
  {
    label: "Text 3 / Image 4",
    value: "text-3-image-4-right",
  },
  {
    label: "Text 4 / Image 3",
    value: "text-4-image-3-right",
  },
  {
    label: "Image 3 / Text 4",
    value: "image-3-left-text-4",
  },
  {
    label: "Image 4 / Text 3",
    value: "image-4-left-text-3",
  },
] as const;

type SplitContentImageVariant =
  (typeof splitContentImageVariantOptions)[number]["value"];

const fixedRatioSplitVariantOptions = [
  {
    label: "Text 3 / Image 4",
    value: "text-3-image-4-right",
  },
  {
    label: "Text 4 / Image 3",
    value: "text-4-image-3-right",
  },
  {
    label: "Image 3 / Text 4",
    value: "image-3-left-text-4",
  },
  {
    label: "Image 4 / Text 3",
    value: "image-4-left-text-3",
  },
] as const;

const fixedRatioSplitRatioOptions = [
  { label: "3:2", value: "3-2" },
  { label: "2:3", value: "2-3" },
  { label: "4:3", value: "4-3" },
  { label: "3:4", value: "3-4" },
  { label: "5:4", value: "5-4" },
  { label: "4:5", value: "4-5" },
] as const;

type FixedRatioSplitVariant =
  (typeof fixedRatioSplitVariantOptions)[number]["value"];

type FixedRatioSplitRatio =
  (typeof fixedRatioSplitRatioOptions)[number]["value"];

const heroCompactAlignOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
] as const;

const heroCompactAlignments = new Set<string>(
  heroCompactAlignOptions.map((option) => option.value),
);

function readPagebuilderPreviewVariables(): PreviewVariableStyle {
  if (typeof window === "undefined") {
    return {};
  }

  const computedStyle = window.getComputedStyle(document.documentElement);
  const previewVariables: PreviewVariableStyle = {};
  const variablePrefixes = [
    "--border-",
    "--card-",
    "--color-",
    "--container-",
    "--inline-",
    "--layout-",
    "--live-",
    "--radius-",
    "--section-",
    "--semantic-",
    "--shadow-",
    "--site-",
    "--type-",
  ];

  for (const propertyName of computedStyle) {
    if (
      variablePrefixes.some((prefix) => propertyName.startsWith(prefix))
    ) {
      previewVariables[propertyName as `--${string}`] = computedStyle
        .getPropertyValue(propertyName)
        .trim();
    }
  }

  return previewVariables;
}

function isPreviewNavigationSection(section: WorkingSection) {
  return section.mode === "Navigation";
}

function isPreviewHeroSection(section: WorkingSection | undefined) {
  return section?.mode === "Hero";
}

const viewportOptions = [
  {
    id: "main",
    label: "Main",
    contentClassName: "max-w-full",
    frameClassName: "h-full w-full max-w-[90rem]",
    screenClassName: "h-full flex-1",
    sizeLabel: "1440px site canvas",
    brief:
      "Review the template in the 1440px main container with preserved page scrolling.",
  },
] as const;

function getPreviewResponsiveClassName(
  viewportId: (typeof viewportOptions)[number]["id"],
) {
  void viewportId;
  return "";
}

type DesignStyleSettings = {
  showSectionMarkers: boolean;
  viewportId: (typeof viewportOptions)[number]["id"];
};

type PageLayoutSlot = {
  designStyle: DesignStyleSettings;
  name: string;
  stack: WorkingSection[];
};

type TemplatePromotionResponse =
  | {
      ok: true;
      template: {
        id: string;
        name: string;
        sectionCount: number;
      };
      templates: SavedPageTemplate[];
    }
  | { ok: false; error: string };

type SavedPageTemplate = {
  sections: Array<{
    component: string;
    mode: string;
  }>;
};

type SavedPageTemplatesResponse =
  | {
      ok: true;
      templates: SavedPageTemplate[];
    }
  | { ok: false; error: string };

function isTemplateContentSection(section: SavedPageTemplate["sections"][number]) {
  return (
    section.mode !== "Navigation" &&
    section.mode !== "Footer" &&
    !section.component.startsWith("Footer")
  );
}

type SavedPagebuilderOption = {
  designStyle: DesignStyleSettings;
  optionIndex: number;
  optionName: string;
  recipeId: string;
  recipeName: string;
  savedAt: string;
  sectionCount: number;
  sections: WorkingSection[];
};

type SavePagebuilderOptionRequest = {
  designStyle: DesignStyleSettings;
  optionIndex: number;
  optionName: string;
  recipeId: string;
  recipeName: string;
  sections: ReturnType<typeof serializeWorkingSection>[];
};

type SavedPagebuilderOptionsResponse =
  | {
      ok: true;
      options: SavedPagebuilderOption[];
    }
  | { ok: false; error: string };

type SavedPagebuilderOptionResponse =
  | {
      ok: true;
      option: SavedPagebuilderOption;
    }
  | { ok: false; error: string };

function buildOptionSaveRequest(
  recipe: PagebuilderRecipe,
  slot: PageLayoutSlot,
  optionIndex: number,
): SavePagebuilderOptionRequest {
  return {
    designStyle: slot.designStyle,
    optionIndex,
    optionName: slot.name,
    recipeId: recipe.id,
    recipeName: recipe.name,
    sections: slot.stack.map(serializeWorkingSection),
  };
}

function getOptionSignatureKey(payload: SavePagebuilderOptionRequest) {
  return `${payload.recipeId}:${payload.optionIndex}`;
}

function getOptionSignature(payload: SavePagebuilderOptionRequest) {
  return JSON.stringify(payload);
}

type PageInstructionInput = {
  designLabel: string;
  excludedSections: WorkingSection[];
  includedSections: WorkingSection[];
  recipe: PagebuilderRecipe;
  selectedViewport: (typeof viewportOptions)[number];
};

function isSplitContentImageSection(section: WorkingSection) {
  return section.component === splitContentImageComponent;
}

function isFixedRatioSplitSection(section: WorkingSection) {
  return section.component === fixedRatioSplitComponent;
}

function isContentFixedRatioSplitSection(section: WorkingSection) {
  return section.component === contentFixedRatioSplitComponent;
}

function isAnyFixedRatioSplitSection(section: WorkingSection) {
  return (
    isFixedRatioSplitSection(section) || isContentFixedRatioSplitSection(section)
  );
}

function isHeroCompactSection(section: WorkingSection) {
  return section.component === heroCompactComponent;
}

function getSplitContentImageVariantLabel(variant: string | undefined) {
  return splitContentImageVariantOptions.find(
    (option) => option.value === variant,
  )?.label;
}

function getFixedRatioSplitVariantLabel(variant: string | undefined) {
  return fixedRatioSplitVariantOptions.find(
    (option) => option.value === variant,
  )?.label;
}

function getFixedRatioSplitRatioLabel(ratio: string | undefined) {
  return fixedRatioSplitRatioOptions.find((option) => option.value === ratio)
    ?.label;
}

function getHeroCompactAlign(section: WorkingSection) {
  return heroCompactAlignments.has(section.variant ?? "")
    ? (section.variant as HeroCompactAlign)
    : sectionLibraryV3Content.heroCompact.align;
}

function createInitialDesignStyle(): DesignStyleSettings {
  return {
    showSectionMarkers: false,
    viewportId: "main",
  };
}

function createInitialWorkingStack(
  recipe: PagebuilderRecipe,
  slotIndex: number,
) {
  return recipe.sectionStack.map((section, index) => ({
    ...section,
    id: `${recipe.id}-slot-${slotIndex + 1}-${section.component}-${index}`,
    included: false,
    originalComponent: section.component,
    originalIndex: index,
    ratio:
      section.component === fixedRatioSplitComponent ||
      section.component === contentFixedRatioSplitComponent
        ? section.ratio ?? fixedRatioSplitRatioOptions[0].value
        : section.ratio,
    variant:
      section.component === splitContentImageComponent
        ? section.variant ?? splitContentImageVariantOptions[0].value
        : section.component === fixedRatioSplitComponent
          ? section.variant ?? fixedRatioSplitVariantOptions[0].value
          : section.component === contentFixedRatioSplitComponent
            ? section.variant ?? fixedRatioSplitVariantOptions[0].value
            : section.component === heroCompactComponent
              ? section.variant ?? sectionLibraryV3Content.heroCompact.align
              : section.variant,
  }));
}

function createInitialLayoutSlots(recipe: PagebuilderRecipe) {
  return Array.from({ length: 1 }, (_, index) => ({
    designStyle: createInitialDesignStyle(),
    name: "Page Layout",
    stack: createInitialWorkingStack(recipe, index),
  }));
}

function serializeWorkingSection(section: WorkingSection) {
  return {
    component: section.component,
    id: section.id,
    included: section.included,
    instruction: section.instruction,
    mode: section.mode,
    name: section.name,
    originalComponent: section.originalComponent,
    originalIndex: section.originalIndex,
    ratio: section.ratio,
    variant: section.variant,
  };
}

function updateSectionFromSwapOption(
  section: WorkingSection,
  nextOption: (typeof sectionSwapOptions)[number],
): WorkingSection {
  return {
    ...section,
    component: nextOption.component,
    instruction: nextOption.instruction,
    mode: nextOption.mode,
    name: nextOption.name,
    ratio:
      nextOption.component === fixedRatioSplitComponent ||
      nextOption.component === contentFixedRatioSplitComponent
        ? section.ratio ?? fixedRatioSplitRatioOptions[0].value
        : undefined,
    variant:
      nextOption.component === splitContentImageComponent
        ? section.variant ?? splitContentImageVariantOptions[0].value
        : nextOption.component === fixedRatioSplitComponent
          ? section.variant ?? fixedRatioSplitVariantOptions[0].value
          : nextOption.component === contentFixedRatioSplitComponent
            ? section.variant ?? fixedRatioSplitVariantOptions[0].value
            : nextOption.component === heroCompactComponent
              ? sectionLibraryV3Content.heroCompact.align
              : undefined,
  };
}

function copySharedNavigationSection(
  section: WorkingSection,
  sharedNavigation: WorkingSection,
): WorkingSection {
  return {
    ...section,
    component: sharedNavigation.component,
    included: sharedNavigation.included,
    instruction: sharedNavigation.instruction,
    mode: sharedNavigation.mode,
    name: sharedNavigation.name,
    ratio: sharedNavigation.ratio,
    variant: sharedNavigation.variant,
  };
}

function findSharedNavigationSource(layoutSlots: PageLayoutSlot[][]) {
  const navigationSections = layoutSlots.flatMap((recipeSlots) =>
    recipeSlots.flatMap((slot) =>
      slot.stack.filter((section) => section.mode === "Navigation"),
    ),
  );

  return (
    navigationSections.find((section) => section.included) ??
    navigationSections[0]
  );
}

function applySharedNavigationToLayoutSlots(layoutSlots: PageLayoutSlot[][]) {
  const sharedNavigation = findSharedNavigationSource(layoutSlots);

  if (!sharedNavigation) {
    return layoutSlots;
  }

  return layoutSlots.map((recipeSlots) =>
    recipeSlots.map((slot) => ({
      ...slot,
      stack: slot.stack.map((section) =>
        section.mode === "Navigation"
          ? copySharedNavigationSection(section, sharedNavigation)
          : section,
      ),
    })),
  );
}

function applySavedOptionsToLayoutSlots(
  currentSlots: PageLayoutSlot[][],
  recipes: PagebuilderRecipe[],
  savedOptions: SavedPagebuilderOption[],
) {
  return applySharedNavigationToLayoutSlots(
    currentSlots.map((recipeSlots, recipeIndex) =>
      recipeSlots.map((slot, slotIndex) => {
        const recipe = recipes[recipeIndex];
        const savedOption = savedOptions.find(
          (option) =>
            option.recipeId === recipe?.id &&
            option.optionIndex === slotIndex,
        );

        if (!savedOption) {
          return slot;
        }

        return {
          ...slot,
          designStyle: {
            showSectionMarkers: Boolean(
              savedOption.designStyle.showSectionMarkers,
            ),
            viewportId: "main" as const,
          },
          stack: savedOption.sections.map((section, index) => ({
            ...section,
            id:
              section.id || `${savedOption.recipeId}-saved-${slotIndex}-${index}`,
            included: Boolean(section.included),
            originalComponent: section.originalComponent || section.component,
            originalIndex: Number.isFinite(section.originalIndex)
              ? section.originalIndex
              : index,
          })),
        };
      }),
    ),
  );
}

function slugifyTemplateName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const sectionSwapOptions = [
  {
    component: "NavPrimarySectionV2",
    instruction:
      "Use the standard nav when the template needs the clearest service, area, phone, and booking paths.",
    mode: "Navigation",
    name: "Primary navigation",
  },
  {
    component: "NavCenterLogoSectionV2",
    instruction:
      "Use the centered logo nav when the page needs a simple brand anchor with service links and direct contact access.",
    mode: "Navigation",
    name: "Center logo navigation",
  },
  {
    component: "NavFloatingBentoSectionV2",
    instruction:
      "Use the floating nav when the hero needs a polished first-viewport frame.",
    mode: "Navigation",
    name: "Floating bento navigation",
  },
  {
    component: "HeroSplitFullHeightSectionV3",
    instruction:
      "Use h1, one primary booking CTA, one services CTA, and three compact trust stats beside a full-bleed image column.",
    mode: "Hero",
    name: "Split content and full image",
  },
  {
    component: "HeroSplitFixedImageSectionV3",
    instruction:
      "Use a split hero with a bounded fixed-ratio image frame instead of a full-screen image.",
    mode: "Hero",
    name: "Fixed-ratio split image",
  },
  {
    component: "HeroFullscreenSectionV2",
    instruction:
      "Use a strong image, calm h1, review proof, and one visible request path.",
    mode: "Hero",
    name: "Fullscreen image hero",
  },
  {
    component: "HeroCenteredFloatersSectionV2",
    instruction:
      "Use the centered message while floaters carry proof, service cues, or conversion nudges.",
    mode: "Hero",
    name: "Centered with left right floaters",
  },
  {
    component: "HeroGridMosaicSectionV2",
    instruction:
      "Use the mosaic to combine h1, trust proof, service paths, and supporting visuals.",
    mode: "Hero",
    name: "Grid mosaic hero",
  },
  {
    component: "HeroContentTopImageBottomSectionV2",
    instruction:
      "Lead with direct copy first, then use the image below to keep the page useful and quick to understand.",
    mode: "Hero",
    name: "Content top image bottom",
  },
  {
    component: "HeroCompactSectionV3",
    instruction:
      "Use a compact page title, eyebrow, and short descriptor when the page needs a clear header without media or proof blocks.",
    mode: "Hero",
    name: "Compact page hero",
  },
  {
    component: "ServicesBentoCardsSectionV2",
    instruction:
      "Use bento-style service cards when the services need a richer visual scan pattern.",
    mode: "Scan",
    name: "Services bento cards",
  },
  {
    component: "ServicesHoverPanelSectionV2",
    instruction:
      "Use a hover panel when a compact service list should reveal more detail and visual emphasis.",
    mode: "Scan",
    name: "Services hover panel",
  },
  {
    component: "ServicesThreeCardsRightSectionV3",
    instruction:
      "Show top-level service cards on the seven-column page grid, using explicit card size metadata when one card should be larger.",
    mode: "Scan",
    name: "Services cards grid",
  },
  {
    component: "ServicesScrollCardsSectionV2",
    instruction:
      "Use a service rail when there are more service paths than a small grid can handle gracefully.",
    mode: "Scan",
    name: "Scroll service cards",
  },
  {
    component: "ContentHorizontalCardCarouselSectionV2",
    instruction:
      "Use a horizontal card carousel when scan content needs a compact browseable sequence.",
    mode: "Scan",
    name: "Services card carousel",
  },
  {
    component: "QuickPageLinksSectionV2",
    instruction:
      "Offer a small set of useful page paths for visitors who need more context before contacting.",
    mode: "Scan",
    name: "Quick page links",
  },
  {
    component: "ContentRevealParagraphSectionV2",
    instruction:
      "Use a short editorial thesis to slow the page down and frame the service promise.",
    mode: "Narrative",
    name: "Reveal paragraph",
  },
  {
    component: "ContentScrollWrittenRevealSectionV2",
    instruction:
      "Use written reveal copy when a narrative point should build in short, readable beats.",
    mode: "Narrative",
    name: "Scroll written reveal",
  },
  {
    component: "ContentSplitHeadlineImageSectionV2",
    instruction:
      "Translate regular content into an image-led editorial texture with one large positioning line.",
    mode: "Narrative",
    name: "Split headline image content",
  },
  {
    component: "ContentSplitFixedImageSectionV3",
    instruction:
      "Use a content-height split layout when the section needs fixed-ratio imagery without hero-scale height.",
    mode: "Narrative",
    name: "Split content with fixed image",
  },
  {
    component: "ContentStickyCardStreamSectionV2",
    instruction:
      "Keep a promise fixed while supporting details move through response, diagnosis, options, and follow-up.",
    mode: "Narrative",
    name: "Sticky card stream content",
  },
  {
    component: "ContentStickyIdeasSectionV2",
    instruction:
      "Keep core ideas visible while longer copy earns trust.",
    mode: "Narrative",
    name: "Sticky ideas content",
  },
  {
    component: "ContentAboutCompanySectionV2",
    instruction:
      "Use for regular about content with enough visual structure to feel useful instead of generic.",
    mode: "Narrative",
    name: "About company content",
  },
  {
    component: "ContentAboutStorySectionV3",
    instruction:
      "Use for long-form about storytelling when the page needs local context, operating philosophy, and careful trust language.",
    mode: "Narrative",
    name: "About story",
  },
  {
    component: "ContentRuleHeaderSectionV2",
    instruction:
      "Use as lightweight editorial texture to introduce a practical idea without adding a heavy section.",
    mode: "Narrative",
    name: "Rule header content",
  },
  {
    component: "ContentPhotoGalleryCarouselSectionV3",
    instruction:
      "Use a mixed-size horizontal photo gallery when people, projects, or proof images should carry a narrative moment.",
    mode: "Narrative",
    name: "Photo gallery carousel",
  },
  {
    component: "FeaturePortraitParagraphSectionV3",
    instruction:
      "Use an editorial portrait and focused paragraph when a section needs human context or point-of-view.",
    mode: "Narrative",
    name: "Portrait paragraph feature",
  },
  {
    component: "FeatureOverlapRowsSectionV3",
    instruction:
      "Use overlapping feature rows when multiple narrative points need visual momentum without becoming service cards.",
    mode: "Narrative",
    name: "Overlap feature rows",
  },
  {
    component: "FeatureAsymmetricCardsSectionV3",
    instruction:
      "Use an asymmetrical intro and feature card cluster when a why-choose-us section needs scannable proof points.",
    mode: "Narrative",
    name: "Asymmetric feature cards",
  },
  {
    component: "TrustBarSectionV3",
    instruction:
      "Validate the promise immediately with rating, volume, team, and locality claims.",
    mode: "Proof",
    name: "Trust bar",
  },
  {
    component: "TrustBarFloatingBentoSectionV3",
    instruction:
      "Use floating trust proof when compact stats should feel more dimensional than a straight bar.",
    mode: "Proof",
    name: "Floating bento trust bar",
  },
  {
    component: "TrustBarBentoAboutSectionV3",
    instruction:
      "Use crew images mixed with compact proof callouts when an about or trust moment should feel human and field-based.",
    mode: "Proof",
    name: "Bento about us bar",
  },
  {
    component: "TrustMarqueeSection",
    instruction:
      "Use a headline with a scrolling banner when proof points should move beside a stronger editorial claim.",
    mode: "Action",
    name: "Headline with Scrolling Banner",
  },
  {
    component: "TrustMarqueeSectionV3",
    instruction:
      "Use short repeated claims when there are many small proof points.",
    mode: "Proof",
    name: "Trust marquee",
  },
  {
    component: "TrustLogoMarqueeSectionV3",
    instruction:
      "Use scrolling logo proof for affiliations, certifications, training, manufacturer badges, or partner networks.",
    mode: "Proof",
    name: "Logo marquee",
  },
  {
    component: "TrustLogoGridSectionV3",
    instruction:
      "Use static logos or associations when motion would distract from reading.",
    mode: "Proof",
    name: "Static trust logo grid",
  },
  {
    component: "TestimonialsSectionV3",
    instruction:
      "Use the current testimonial section when proof needs a polished structured presentation.",
    mode: "Proof",
    name: "Testimonials",
  },
  {
    component: "TestimonialsCarouselSectionV3",
    instruction:
      "Use longer customer stories only if they contain useful service detail.",
    mode: "Proof",
    name: "Customer stories",
  },
  {
    component: "TestimonialsCarouselCondensedSectionV3",
    instruction:
      "Use condensed customer stories when the page needs three testimonial cards visible at once without introductory copy.",
    mode: "Proof",
    name: "Customer stories condensed",
  },
  {
    component: "TestimonialsMasonrySectionV3",
    instruction:
      "Use varied quote lengths to create a fuller body of evidence.",
    mode: "Proof",
    name: "Masonry testimonials",
  },
  {
    component: "DecisionSplitDecisionSectionV3",
    instruction:
      "Use a compact two-card comparison when a homeowner needs help deciding whether repair or replacement makes more sense after inspection.",
    mode: "Decision",
    name: "Split decision",
  },
  {
    component: "DecisionSplitLargeCardsSectionV3",
    instruction:
      "Use two large three-column decision cards with a simple left-aligned header and link above them.",
    mode: "Decision",
    name: "Split large cards",
  },
  {
    component: "ProcessStepsSectionV3",
    instruction:
      "Use current process steps when the page needs a clearer, more styled decision sequence.",
    mode: "Decision",
    name: "Process steps",
  },
  {
    component: "FAQSectionV3",
    instruction:
      "Include only the questions that affect whether someone contacts you.",
    mode: "Utility",
    name: "FAQ",
  },
  {
    component: "FAQAccordionSectionV3",
    instruction:
      "Handle objections with expandable answers and no vague copy.",
    mode: "Utility",
    name: "FAQ accordion",
  },
  {
    component: "ProcessImageChecklistSectionV3",
    instruction:
      "Turn process uncertainty into clear expectations before contact.",
    mode: "Decision",
    name: "Process image checklist",
  },
  {
    component: "CTASectionV3",
    instruction:
      "Use the current conversion band when the page needs a polished direct next step.",
    mode: "Action",
    name: "CTA",
  },
  {
    component: "CTAFullscreenSectionV3",
    instruction:
      "Use the strongest conversion treatment for a memorable final booking moment.",
    mode: "Action",
    name: "Fullscreen conversion",
  },
  {
    component: "CTAScrollRevealOfferSectionV3",
    instruction:
      "Use a discovered offer or next-step reveal to transition from trust into action.",
    mode: "Action",
    name: "Scroll reveal offer conversion",
  },
  {
    component: "ContentFixedCoverFadeSectionV2",
    instruction:
      "Use a fixed-cover fade when the action moment should feel immersive and image-led.",
    mode: "Action",
    name: "Fixed cover fade",
  },
  {
    component: "ServiceAreaZipLookupSectionV3",
    instruction:
      "Use when visitors need to confirm service coverage before starting a request.",
    mode: "Utility",
    name: "Service area zip lookup",
  },
  {
    component: "ContactSectionV3",
    instruction:
      "Close with phone, email, hours, and a simple form or request path.",
    mode: "Utility",
    name: "Contact section",
  },
  {
    component: "FooterSectionV3",
    instruction:
      "End with service links, areas, contact details, and legal links.",
    mode: "Utility",
    name: "Footer",
  },
  {
    component: "FooterHorizontalSectionV3",
    instruction:
      "End with a horizontal footer where link groups sit inline and wrap beside their headings.",
    mode: "Utility",
    name: "Horizontal footer",
  },
  {
    component: "FooterCompactSectionV3",
    instruction:
      "End with top-level navigation links, a rule, contact info, social links, and legal links in a compact footer.",
    mode: "Utility",
    name: "Condensed footer",
  },
  {
    component: "FooterLinkPanelSectionV3",
    instruction:
      "End with a large link-panel footer that groups service areas, services, contact paths, social links, and a back-to-top action.",
    mode: "Utility",
    name: "Link panel footer",
  },
] as const;

type SectionSwapOption = (typeof sectionSwapOptions)[number];
type InnerOptionSignifier = {
  label: string;
  pattern: "align" | "full" | "fixed";
};

const innerOptionSignifiers: Partial<
  Record<SectionSwapOption["component"], InnerOptionSignifier>
> = {
  HeroSplitFullHeightSectionV3: {
    label: "Full image split",
    pattern: "full",
  },
  HeroSplitFixedImageSectionV3: {
    label: "Fixed-ratio split",
    pattern: "fixed",
  },
  ContentSplitFixedImageSectionV3: {
    label: "Fixed-ratio split",
    pattern: "fixed",
  },
  HeroCompactSectionV3: {
    label: "Alignment options",
    pattern: "align",
  },
};

function getInnerOptionSignifier(component: string) {
  return innerOptionSignifiers[component as SectionSwapOption["component"]];
}

function InnerLayoutPill({
  signifier,
  tone,
}: {
  signifier: InnerOptionSignifier;
  tone: "dark" | "light";
}) {
  const icon =
    signifier.pattern === "align" ? (
      <span
        aria-hidden="true"
        className="grid h-3.5 w-5 grid-cols-3 items-end gap-0.5 rounded-[2px] border border-current/40 px-0.5 py-0.5"
      >
        <span className="h-1.5 bg-current/35" />
        <span className="h-2.5 bg-current" />
        <span className="h-1.5 bg-current/35" />
      </span>
    ) : (
      <span
        aria-hidden="true"
        className="grid h-3.5 w-5 grid-cols-2 overflow-hidden rounded-[2px] border border-current/40"
      >
        <span className="bg-current/25" />
        <span
          className={cx(
            "bg-current",
            signifier.pattern === "fixed" && "m-0.5 rounded-[1px]",
          )}
        />
      </span>
    );

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em]",
        tone === "dark"
          ? "border-white/15 bg-white/10 text-white/70"
          : "border-service-border bg-service-surface text-service-muted",
      )}
    >
      {icon}
      {signifier.label}
    </span>
  );
}

function buildPageInstruction({
  designLabel,
  excludedSections,
  includedSections,
  recipe,
  selectedViewport,
}: PageInstructionInput) {
  return [
    `Pageworks Page Instruction`,
    ``,
    `Pipeline stage: Pagebuilder`,
    `Target page type: ${designLabel}`,
    `Source recipe id: ${recipe.id}`,
    `Page intent: ${recipe.positioning}`,
    `Viewport/design reference: ${selectedViewport.label} (${selectedViewport.sizeLabel})`,
    ``,
    `Style rules:`,
    ...recipe.styleRules.map((rule) => `- ${rule}`),
    `- Use the universal SevenColumnGrid / SevenColumnGridItem system where an equivalent current section exists.`,
    `- Use common regular/medium section spacing through section-space-med or SevenColumnGrid padding="med", unless a real hero/footer pattern requires its established spacing.`,
    `- Use the existing project typography, radius, surface, and color tokens.`,
    ``,
    `Included section order:`,
    ...includedSections.map(
      (section, index) =>
        `${index + 1}. ${section.component}
   Name: ${section.name}
   Mode: ${section.mode}
   ${
     isSplitContentImageSection(section)
       ? `Variant: ${
           getSplitContentImageVariantLabel(section.variant) ??
           splitContentImageVariantOptions[0].label
         } (${section.variant ?? splitContentImageVariantOptions[0].value})`
       : isAnyFixedRatioSplitSection(section)
         ? `Variant: ${
             getFixedRatioSplitVariantLabel(section.variant) ??
             fixedRatioSplitVariantOptions[0].label
           } (${section.variant ?? fixedRatioSplitVariantOptions[0].value})
   Image ratio: ${
     getFixedRatioSplitRatioLabel(section.ratio) ??
     fixedRatioSplitRatioOptions[0].label
   } (${section.ratio ?? fixedRatioSplitRatioOptions[0].value})`
       : "Variant: default"
   }
   Instruction: ${section.instruction}
   Origin: ${
     section.originalComponent !== section.component
       ? `swapped from ${section.originalComponent}`
       : section.originalIndex === index
         ? "original recipe section"
         : "reordered original recipe section"
   }`,
    ),
    ``,
    `Excluded sections: ${
      excludedSections.length > 0
        ? excludedSections
            .map((section) => `${section.component} (${section.name})`)
            .join(", ")
        : "none"
    }`,
    ``,
    `Bake-in implementation rules:`,
    `- Create a concrete page from this instruction; do not make the page depend on Pagebuilder runtime state.`,
    `- Use existing section components from src/components/sections/.`,
    `- Compose imported sections in the target page; do not paste large raw section markup into app/**/page.tsx.`,
    `- Keep reusable/business-specific copy in src/content/.`,
    `- Use shared primitives, design tokens, type utilities, spacing utilities, and color variables before adding anything new.`,
    `- Preserve desktop-first Tailwind with max-* responsive variants.`,
    `- Do not add new dependencies, redesign unrelated sections, rewrite form/Supabase logic, or add Google Fonts link tags.`,
    `- If a section needs new copy, create concise local-service business copy that matches the section mode and instruction.`,
    ``,
    `Expected output:`,
    `- Clean page route under src/app/ generated from the completed template builder.`,
    `- Page content stored or exported from src/content/.`,
    `- No extra builder/editor controls on the baked page.`,
  ].join("\n");
}

type PagebuilderPreviewWindowProps = {
  activePageLabel: string;
  children: ReactNode;
  contentClassName: string;
  frameClassName: string;
  previewStyle: CSSProperties;
  responsiveClassName: string;
  screenClassName: string;
  showSectionMarkers: boolean;
  sizeLabel: string;
  spacingClassName: string;
};

function PagebuilderPreviewWindow({
  activePageLabel,
  children,
  contentClassName,
  frameClassName,
  previewStyle,
  responsiveClassName,
  screenClassName,
  showSectionMarkers,
  sizeLabel,
  spacingClassName,
}: PagebuilderPreviewWindowProps) {
  return (
    <div
      className={cx(
        "mx-auto flex max-h-full min-h-0 flex-col overflow-hidden rounded border border-service-border bg-white shadow-service transition-all duration-300",
        frameClassName,
      )}
    >
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-service-border bg-service-surface px-3">
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full bg-service-border"
        />
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full bg-service-border"
        />
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full bg-service-accent"
        />
        <div className="ml-2 flex min-w-0 flex-1 items-center rounded-full border border-service-border bg-white px-3 py-1">
          <span className="type-caption truncate font-semibold text-service-muted">
            {sizeLabel} / {activePageLabel}
          </span>
        </div>
      </div>

      <div className={cx("min-h-0 overflow-auto bg-white", screenClassName)}>
        <div
          className={cx(
            "min-h-full w-full bg-white",
            spacingClassName,
            responsiveClassName,
            !showSectionMarkers && "pagebuilder-hide-markers",
          )}
          style={previewStyle}
        >
          <div
            className={cx(
              "fluid-type-frame mx-auto min-h-full w-full bg-white",
              contentClassName,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PagebuilderShell({
  previewCatalog,
  previewSections,
  recipes,
  sectionModes,
}: PagebuilderShellProps) {
  const [activeRecipeId, setActiveRecipeId] = useState(recipes[0]?.id ?? "");
  const [layoutSlots, setLayoutSlots] = useState<PageLayoutSlot[][]>(() =>
    recipes.map((recipe) => createInitialLayoutSlots(recipe)),
  );
  const [activeLayoutSlotIndexes] = useState<number[]>(() =>
    recipes.map(() => 0),
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [dragOverSectionId, setDragOverSectionId] = useState<string | null>(
    null,
  );
  const [dragDropPosition, setDragDropPosition] =
    useState<DragDropPosition>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRenderedPreviewOpen, setIsRenderedPreviewOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isPromotingTemplate, setIsPromotingTemplate] = useState(false);
  const [isSavingOption, setIsSavingOption] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateSlug, setTemplateSlug] = useState("");
  const [templateNotes, setTemplateNotes] = useState("");
  const [optionSaveStatus, setOptionSaveStatus] = useState("");
  const [optionSaveError, setOptionSaveError] = useState("");
  const [templateStatus, setTemplateStatus] = useState("");
  const [templateError, setTemplateError] = useState("");
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const [previewVariableStyle, setPreviewVariableStyle] =
    useState<PreviewVariableStyle>({});
  const [savedPageTemplates, setSavedPageTemplates] = useState<
    SavedPageTemplate[]
  >([]);
  const [savedOptionsLoaded, setSavedOptionsLoaded] = useState(false);
  const addedSectionIdCounterRef = useRef(0);
  const autosaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autosaveSignaturesRef = useRef(new Map<string, string>());

  const activeRecipeIndex = Math.max(
    recipes.findIndex((recipe) => recipe.id === activeRecipeId),
    0,
  );
  const activeRecipe = recipes[activeRecipeIndex] ?? recipes[0];
  const activeLayoutSlotIndex =
    activeLayoutSlotIndexes[activeRecipeIndex] ?? 0;
  const activeLayoutSlots = layoutSlots[activeRecipeIndex] ?? [];
  const activeLayoutSlot =
    activeLayoutSlots[activeLayoutSlotIndex] ?? activeLayoutSlots[0];
  const activePageLabel = activeRecipe?.name ?? `Page ${activeRecipeIndex + 1}`;
  const activeDesignStyle = useMemo(
    () => activeLayoutSlot?.designStyle ?? createInitialDesignStyle(),
    [activeLayoutSlot?.designStyle],
  );
  const activeStack = useMemo(
    () => activeLayoutSlot?.stack ?? [],
    [activeLayoutSlot?.stack],
  );
  const sectionTemplateUsageCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const template of savedPageTemplates) {
      for (const section of template.sections) {
        if (isTemplateContentSection(section)) {
          counts.set(
            section.component,
            (counts.get(section.component) ?? 0) + 1,
          );
        }
      }
    }

    return counts;
  }, [savedPageTemplates]);
  const activeSlotLabel = activeLayoutSlot?.name ?? "Page Layout";
  const selectedSection =
    activeStack.find((section) => section.id === selectedSectionId) ?? null;
  const selectedViewport =
    viewportOptions.find((option) => option.id === activeDesignStyle.viewportId) ??
    viewportOptions[0];
  const includedSections = activeStack.filter((section) => section.included);
  const excludedSections = activeStack.filter((section) => !section.included);
  const pageInstruction = buildPageInstruction({
    designLabel: activePageLabel,
    excludedSections,
    includedSections,
    recipe: activeRecipe,
    selectedViewport,
  });
  const allLayoutInstructions = recipes
    .map((recipe, index) => {
      const slotIndex = activeLayoutSlotIndexes[index] ?? 0;
      const slot = layoutSlots[index]?.[slotIndex] ?? layoutSlots[index]?.[0];
      const stack = slot?.stack ?? [];
      const settings = slot?.designStyle ?? createInitialDesignStyle();
      const viewport =
        viewportOptions.find((option) => option.id === settings?.viewportId) ??
        viewportOptions[0];

      return buildPageInstruction({
        designLabel: recipe.name,
        excludedSections: stack.filter((section) => !section.included),
        includedSections: stack.filter((section) => section.included),
        recipe,
        selectedViewport: viewport,
      });
    })
    .join("\n\n---\n\n");

  useEffect(() => {
    function syncPreviewVariables() {
      setPreviewVariableStyle(readPagebuilderPreviewVariables());
    }

    syncPreviewVariables();
    window.addEventListener("focus", syncPreviewVariables);

    return () => {
      window.removeEventListener("focus", syncPreviewVariables);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedOptions() {
      try {
        const response = await fetch("/api/pagebuilder-options");
        const result =
          (await response.json()) as SavedPagebuilderOptionsResponse;

        if (!isMounted || !response.ok || !result.ok) {
          if (isMounted) {
            setSavedOptionsLoaded(true);
          }
          return;
        }

        setLayoutSlots((currentSlots) =>
          applySavedOptionsToLayoutSlots(
            currentSlots,
            recipes,
            result.options,
          ),
        );
        setSavedOptionsLoaded(true);
      } catch {
        if (isMounted) {
          setOptionSaveError("Saved options could not be loaded.");
          setSavedOptionsLoaded(true);
        }
      }
    }

    void loadSavedOptions();

    return () => {
      isMounted = false;
    };
  }, [recipes]);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedPageTemplates() {
      try {
        const response = await fetch("/api/page-templates");
        const result = (await response.json()) as SavedPageTemplatesResponse;

        if (isMounted && response.ok && result.ok) {
          setSavedPageTemplates(result.templates);
        }
      } catch {
        // Leave counts at zero when the local template registry is unavailable.
      }
    }

    void loadSavedPageTemplates();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!savedOptionsLoaded || !activeRecipe.id) {
      return;
    }

    const payload = buildOptionSaveRequest(
      activeRecipe,
      activeLayoutSlot,
      activeLayoutSlotIndex,
    );
    const signatureKey = getOptionSignatureKey(payload);
    const signature = getOptionSignature(payload);
    const previousSignature = autosaveSignaturesRef.current.get(signatureKey);

    if (!previousSignature) {
      autosaveSignaturesRef.current.set(signatureKey, signature);
      return;
    }

    if (previousSignature === signature) {
      return;
    }

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(async () => {
      try {
        await postPagebuilderOption(payload);
        rememberOptionSaveSignature(payload);
      } catch {
        setOptionSaveError("Pagebuilder autosave failed.");
      }
    }, 800);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [
    activeDesignStyle,
    activeLayoutSlot,
    activeLayoutSlotIndex,
    activeRecipe,
    activeRecipe.id,
    activeRecipe.name,
    activeSlotLabel,
    activeStack,
    savedOptionsLoaded,
  ]);

  function updateActiveStack(updater: (stack: WorkingSection[]) => WorkingSection[]) {
    setLayoutSlots((currentSlots) =>
      currentSlots.map((recipeSlots, recipeIndex) =>
        recipeIndex === activeRecipeIndex
          ? recipeSlots.map((slot, slotIndex) =>
              slotIndex === activeLayoutSlotIndex
                ? {
                    ...slot,
                    stack: updater(slot.stack),
                  }
                : slot,
            )
          : recipeSlots,
      ),
    );
  }

  function moveSection(sectionId: string, direction: -1 | 1) {
    updateActiveStack((stack) => {
      const currentIndex = stack.findIndex(
        (section) => section.id === sectionId,
      );
      const nextIndex = currentIndex + direction;

      if (
        currentIndex < 0 ||
        nextIndex < 0 ||
        nextIndex >= stack.length
      ) {
        return stack;
      }

      const nextStack = [...stack];
      const [item] = nextStack.splice(currentIndex, 1);
      nextStack.splice(nextIndex, 0, item);
      return nextStack;
    });
  }

  function reorderSection(
    draggedId: string,
    targetId: string,
    position: "before" | "after",
  ) {
    if (!draggedId || draggedId === targetId) {
      setDraggedSectionId(null);
      setDragOverSectionId(null);
      setDragDropPosition(null);
      return;
    }

    updateActiveStack((stack) => {
      const nextStack = [...stack];
      const draggedIndex = nextStack.findIndex(
        (section) => section.id === draggedId,
      );

      if (draggedIndex < 0) {
        return stack;
      }

      const [item] = nextStack.splice(draggedIndex, 1);
      const targetStackIndex = nextStack.findIndex(
        (section) => section.id === targetId,
      );

      if (targetStackIndex < 0) {
        return stack;
      }

      nextStack.splice(
        position === "before" ? targetStackIndex : targetStackIndex + 1,
        0,
        item,
      );

      return nextStack;
    });
    setDraggedSectionId(null);
    setDragOverSectionId(null);
    setDragDropPosition(null);
  }

  function getDragDropPosition(
    event: DragEvent<HTMLElement>,
  ): DragDropPosition {
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerRatio = (event.clientY - bounds.top) / bounds.height;
    const inertBand = 0.08;

    if (pointerRatio < 0.5 - inertBand) {
      return "before";
    }

    if (pointerRatio > 0.5 + inertBand) {
      return "after";
    }

    return null;
  }

  function deleteSection(sectionId: string) {
    updateActiveStack((stack) =>
      stack.filter((section) => section.id !== sectionId),
    );

    if (sectionId === selectedSectionId) {
      setSelectedSectionId(null);
    }
  }

  function clearActiveBuildingSpace() {
    updateActiveStack((stack) =>
      stack.map((section) => ({
        ...section,
        included: false,
      })),
    );
    setDraggedSectionId(null);
    setDragOverSectionId(null);
    setSelectedSectionId(null);
    setOptionSaveError("");
    setOptionSaveStatus("Building space cleared.");
  }

  function swapSection(sectionId: string, component: string) {
    const nextOption = sectionSwapOptions.find(
      (option) => option.component === component,
    );
    const currentSection = activeStack.find((section) => section.id === sectionId);

    if (!currentSection || !nextOption || nextOption.mode !== currentSection.mode) {
      return;
    }

    if (currentSection.mode === "Navigation") {
      const nextLayoutSlots = layoutSlots.map((recipeSlots) =>
        recipeSlots.map((slot) => ({
          ...slot,
          stack: slot.stack.map((section) =>
            section.mode === "Navigation"
              ? {
                  ...updateSectionFromSwapOption(section, nextOption),
                  included: currentSection.included,
                }
              : section,
          ),
        })),
      );

      setLayoutSlots(nextLayoutSlots);
      void saveSharedNavigationOptions(nextLayoutSlots);
      setSelectedSectionId(sectionId);
      return;
    }

    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId
          ? updateSectionFromSwapOption(section, nextOption)
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateSplitContentImageVariant(
    sectionId: string,
    variant: SplitContentImageVariant,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isSplitContentImageSection(section)
          ? {
              ...section,
              variant,
            }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateFixedRatioSplitVariant(
    sectionId: string,
    variant: FixedRatioSplitVariant,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isAnyFixedRatioSplitSection(section)
          ? {
              ...section,
              variant,
            }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateHeroCompactAlign(
    sectionId: string,
    align: HeroCompactAlign,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isHeroCompactSection(section)
          ? {
              ...section,
              variant: align,
            }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function updateFixedRatioSplitRatio(
    sectionId: string,
    ratio: FixedRatioSplitRatio,
  ) {
    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId && isAnyFixedRatioSplitSection(section)
          ? {
              ...section,
              ratio,
            }
          : section,
      ),
    );
    setSelectedSectionId(sectionId);
  }

  function addSection(component: string) {
    const nextOption = sectionSwapOptions.find(
      (option) => option.component === component,
    );

    if (!nextOption) {
      return;
    }

    addedSectionIdCounterRef.current += 1;

    const nextSection: WorkingSection = {
      component: nextOption.component,
      id: `${activeRecipe.id}-${nextOption.component}-added-${addedSectionIdCounterRef.current}`,
      included: true,
      instruction: nextOption.instruction,
      mode: nextOption.mode,
      name: nextOption.name,
      originalComponent: nextOption.component,
      originalIndex: -1,
      ratio:
        nextOption.component === fixedRatioSplitComponent ||
        nextOption.component === contentFixedRatioSplitComponent
          ? fixedRatioSplitRatioOptions[0].value
          : undefined,
      variant:
        nextOption.component === splitContentImageComponent
          ? splitContentImageVariantOptions[0].value
          : nextOption.component === fixedRatioSplitComponent
            ? fixedRatioSplitVariantOptions[0].value
            : nextOption.component === contentFixedRatioSplitComponent
              ? fixedRatioSplitVariantOptions[0].value
              : nextOption.component === heroCompactComponent
                ? sectionLibraryV3Content.heroCompact.align
                : undefined,
    };

    updateActiveStack((stack) => {
      const selectedIndex = selectedSection
        ? stack.findIndex((section) => section.id === selectedSection.id)
        : -1;
      const insertIndex = selectedIndex >= 0 ? selectedIndex + 1 : stack.length;
      const nextStack = [...stack];

      nextStack.splice(insertIndex, 0, nextSection);
      return nextStack;
    });
    setSelectedSectionId(nextSection.id);
  }

  async function copyPageInstruction() {
    await navigator.clipboard.writeText(pageInstruction);
  }

  async function copyAllLayoutInstructions() {
    await navigator.clipboard.writeText(allLayoutInstructions);
  }

  function buildActiveOptionSaveRequest(): SavePagebuilderOptionRequest {
    return buildOptionSaveRequest(
      activeRecipe,
      activeLayoutSlot,
      activeLayoutSlotIndex,
    );
  }

  async function postPagebuilderOption(
    payload: SavePagebuilderOptionRequest,
  ) {
    const response = await fetch("/api/pagebuilder-options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as SavedPagebuilderOptionResponse;

    if (!response.ok || !result.ok) {
      throw new Error(
        result.ok ? "Pagebuilder layout save failed." : result.error,
      );
    }

    return result.option;
  }

  function rememberOptionSaveSignature(payload: SavePagebuilderOptionRequest) {
    autosaveSignaturesRef.current.set(
      getOptionSignatureKey(payload),
      getOptionSignature(payload),
    );
  }

  async function saveSharedNavigationOptions(nextSlots: PageLayoutSlot[][]) {
    if (!savedOptionsLoaded) {
      return;
    }

    const payloads = recipes.flatMap((recipe, recipeIndex) => {
      const slotIndex = activeLayoutSlotIndexes[recipeIndex] ?? 0;
      const slot = nextSlots[recipeIndex]?.[slotIndex] ?? nextSlots[recipeIndex]?.[0];

      return slot ? [buildOptionSaveRequest(recipe, slot, slotIndex)] : [];
    });

    if (payloads.length === 0) {
      return;
    }

    setOptionSaveError("");
    setOptionSaveStatus("Saving shared navigation...");

    try {
      await Promise.all(payloads.map((payload) => postPagebuilderOption(payload)));
      payloads.forEach(rememberOptionSaveSignature);
      setOptionSaveStatus(
        `Navigation applied to ${payloads.length} page layouts.`,
      );
    } catch (error) {
      setOptionSaveError(
        error instanceof Error
          ? error.message
          : "Shared navigation save failed.",
      );
    }
  }

  async function saveActiveOption() {
    setIsSavingOption(true);
    setOptionSaveError("");
    setOptionSaveStatus("");

    try {
      const payload = buildActiveOptionSaveRequest();
      const option = await postPagebuilderOption(payload);
      rememberOptionSaveSignature(payload);

      setOptionSaveStatus(
        `Saved ${activePageLabel} layout with ${option.sectionCount} included sections.`,
      );
    } catch (error) {
      setOptionSaveError(
        error instanceof Error ? error.message : "Pagebuilder layout save failed.",
      );
    } finally {
      setIsSavingOption(false);
    }
  }

  function openTemplateModal() {
    const defaultName = `${activePageLabel} Template`;

    setTemplateName(defaultName);
    setTemplateSlug(slugifyTemplateName(defaultName));
    setTemplateNotes("");
    setTemplateStatus("");
    setTemplateError("");
    setIsTemplateModalOpen(true);
  }

  function closeTemplateModal() {
    if (isPromotingTemplate) {
      return;
    }

    setIsTemplateModalOpen(false);
    setTemplateError("");
  }

  async function promoteActiveOptionToTemplate() {
    if (includedSections.length === 0) {
      setTemplateError("Templates need at least one included section.");
      return;
    }

    setIsPromotingTemplate(true);
    setTemplateError("");
    setTemplateStatus("");

    try {
      const response = await fetch("/api/page-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designStyle: activeDesignStyle,
          id: templateSlug,
          name: templateName,
          notes: templateNotes,
          pageType: activeRecipe.name,
          sections: includedSections.map((section) => ({
            component: section.component,
            instruction: section.instruction,
            mode: section.mode,
            name: section.name,
            originalComponent: section.originalComponent,
            originalIndex: section.originalIndex,
            ratio: section.ratio,
            variant: section.variant,
          })),
          sourceOptionName: activeSlotLabel,
          sourceRecipeId: activeRecipe.id,
          sourceRecipeName: activeRecipe.name,
        }),
      });
      const result = (await response.json()) as TemplatePromotionResponse;

      if (!response.ok || !result.ok) {
        setTemplateError(result.ok ? "Template promotion failed." : result.error);
        return;
      }

      setTemplateStatus(
        `Promoted ${result.template.name} with ${result.template.sectionCount} sections.`,
      );
      setSavedPageTemplates(result.templates);
      setIsTemplateModalOpen(false);
    } catch {
      setTemplateError("Template promotion failed.");
    } finally {
      setIsPromotingTemplate(false);
    }
  }

  function refreshPreviewStyles() {
    setPreviewVariableStyle(readPagebuilderPreviewVariables());
    setPreviewRefreshKey((currentKey) => currentKey + 1);
  }

  function renderPreviewWindow() {
    function renderSectionFrame(
      section: WorkingSection,
      options: { className?: string; isOverlay?: boolean } = {},
    ) {
      const isSelected = section.id === selectedSectionId;
      const sectionIndex = includedSections.findIndex(
        (includedSection) => includedSection.id === section.id,
      );
      const headingLevel = sectionIndex === 1 ? 1 : 2;
      const renderedSectionPreview = isSplitContentImageSection(section) ? (
          <HeroSplitFullHeightSectionV3
            {...sectionLibraryV3Content.heroSplitFullHeight}
            headingLevel={headingLevel}
            variant={
              (section.variant ??
                splitContentImageVariantOptions[0]
                  .value) as HeroSplitFullHeightVariant
            }
          />
        ) : isFixedRatioSplitSection(section) ? (
          <HeroSplitFixedImageSectionV3
            {...sectionLibraryV3Content.heroSplitFullHeight}
            headingLevel={headingLevel}
            ratio={
              (section.ratio ??
                fixedRatioSplitRatioOptions[0].value) as HeroSplitFixedImageRatio
            }
            variant={
              (section.variant ??
                fixedRatioSplitVariantOptions[0]
                  .value) as HeroSplitFixedImageVariant
            }
          />
        ) : isContentFixedRatioSplitSection(section) ? (
          <ContentSplitFixedImageSectionV3
            {...sectionLibraryV3Content.heroSplitFullHeight}
            headingLevel={headingLevel}
            ratio={
              (section.ratio ??
                fixedRatioSplitRatioOptions[0]
                  .value) as ContentSplitFixedImageRatio
            }
            variant={
              (section.variant ??
                fixedRatioSplitVariantOptions[0]
                  .value) as ContentSplitFixedImageVariant
            }
          />
        ) : isHeroCompactSection(section) ? (
          <HeroCompactSectionV3
            {...sectionLibraryV3Content.heroCompact}
            align={getHeroCompactAlign(section)}
            headingLevel={headingLevel}
          />
        ) : (
          previewCatalog[section.component] ??
          previewSections[activeRecipeIndex]?.[section.originalIndex] ??
          null
        );

      return (
        <div
          className={cx(
            "group/pagebuilder-section cursor-pointer outline outline-0 outline-offset-0 transition-shadow",
            options.isOverlay ? "absolute" : "relative",
            options.isOverlay && "pointer-events-none",
            options.className,
            isSelected &&
              "z-10 shadow-[0_0_0_3px_var(--color-service-accent)]",
          )}
          data-pagebuilder-section-id={section.id}
          data-pagebuilder-section-component={section.component}
          data-pagebuilder-section-mode={section.mode}
          key={section.id}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setSelectedSectionId(section.id);
          }}
        >
          {renderedSectionPreview}
        </div>
      );
    }

    return (
      <PagebuilderPreviewWindow
        activePageLabel={activePageLabel}
        contentClassName={selectedViewport.contentClassName}
        frameClassName={selectedViewport.frameClassName}
        key={`${activeRecipe.id}-${activeLayoutSlotIndex}-${selectedViewport.id}-${previewRefreshKey}`}
        previewStyle={previewVariableStyle}
        responsiveClassName={getPreviewResponsiveClassName(selectedViewport.id)}
        screenClassName={selectedViewport.screenClassName}
        showSectionMarkers={activeDesignStyle.showSectionMarkers}
        sizeLabel={selectedViewport.sizeLabel}
        spacingClassName={normalSpacingClassName}
      >
        {includedSections.map((section, index) => {
          const nextSection = includedSections[index + 1];
          const previousSection = includedSections[index - 1];

          if (
            isPreviewNavigationSection(section) &&
            isPreviewHeroSection(nextSection)
          ) {
            return (
              <div
                className="pagebuilder-nav-hero-pair relative pt-[var(--section-space-sml)]"
                key={`${section.id}-${nextSection.id}`}
              >
                {renderSectionFrame(section, {
                  className: "inset-x-0 top-0 z-20",
                  isOverlay: true,
                })}
                {renderSectionFrame(nextSection)}
              </div>
            );
          }

          if (
            isPreviewHeroSection(section) &&
            previousSection &&
            isPreviewNavigationSection(previousSection)
          ) {
            return null;
          }

          if (
            isPreviewNavigationSection(section) &&
            nextSection &&
            !isPreviewHeroSection(nextSection)
          ) {
            return renderSectionFrame(section, {
              className: "mb-[var(--section-space-sml)]",
            });
          }

          return renderSectionFrame(section);
        })}
      </PagebuilderPreviewWindow>
    );
  }

  return (
    <section className="h-svh overflow-hidden bg-service-ink text-white max-lg:h-auto max-lg:min-h-svh max-lg:overflow-visible">
      <div className="h-full w-full px-4 py-4 max-md:px-3">
        <div className="grid h-full min-h-0 grid-cols-[22rem_minmax(0,1fr)] items-stretch gap-5 max-lg:h-auto max-lg:grid-cols-1">
          <aside className="grid h-full min-h-0 content-start gap-4 overflow-y-auto overscroll-contain pb-10 pr-1 max-lg:h-auto max-lg:overflow-visible max-lg:pb-0 max-lg:pr-0">
            <div className="radius-medium order-1 border border-white/10 bg-white/8 p-5 shadow-service">
              <h1 className="type-heading-lg text-white">
                Page Builder
              </h1>
              <p className="type-text-sm wrap-pretty mt-heading-body-sm text-white/68">
                Choose, swap, reorder, and preview page sections while the
                implementation brief updates with the live stack.
              </p>
            </div>

            <details className="radius-medium order-2 border border-white/10 bg-white/8 p-5 shadow-service">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 marker:hidden">
                <span className="type-heading-sm text-white">
                  Page Layouts
                </span>
                <span className="type-caption rounded-sm border border-white/10 bg-white/8 px-3 py-1 text-white/64">
                  Open
                </span>
              </summary>
              <div className="mt-4 grid gap-3" role="list">
                {recipes.map((recipe) => {
                  const isActive = recipe.id === activeRecipe.id;

                  return (
                    <div className="grid gap-2" key={recipe.id}>
                      <button
                        aria-current={isActive ? "page" : undefined}
                        className={cx(
                          "radius-4 min-h-11 border px-3 text-left type-text-sm font-semibold transition-colors",
                          isActive
                            ? "border-white/45 bg-white/14 text-white"
                            : "border-white/10 bg-white/8 text-white hover:border-white/45 hover:bg-white/14",
                        )}
                        onClick={() => {
                          setActiveRecipeId(recipe.id);
                          setSelectedSectionId(null);
                        }}
                        type="button"
                      >
                        <span>{recipe.name}</span>
                      </button>

                      {isActive ? (
                        <div className="grid gap-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="radius-4 min-h-9 border border-white/35 bg-white px-3 text-xs font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={isSavingOption}
                              onClick={() => void saveActiveOption()}
                              type="button"
                            >
                              {isSavingOption ? "Saving..." : "Save Layout"}
                            </button>
                            <button
                              className="radius-4 min-h-9 border border-white/20 bg-white/10 px-2.5 text-xs font-semibold text-white transition-colors hover:border-white/45 hover:bg-white/16"
                              onClick={openTemplateModal}
                              type="button"
                            >
                              Promote Layout
                            </button>
                          </div>
                          {optionSaveStatus || optionSaveError ? (
                            <p
                              className={cx(
                                "type-caption rounded-sm border px-3 py-2",
                                optionSaveError
                                  ? "border-red-300/60 bg-red-950/30 text-red-100"
                                  : "border-white/10 bg-white/8 text-white/64",
                              )}
                            >
                              {optionSaveError || optionSaveStatus}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </details>

            <div
              className="radius-medium order-3 border border-white/30 p-5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.16),inset_0_0_0_1px_rgb(255_255_255_/_0.045),0_16px_48px_rgb(0_0_0_/_0.16)] ring-1 ring-white/8"
              style={{
                backgroundColor: "#26332f",
                backgroundImage:
                  "linear-gradient(135deg, rgb(255 255 255 / 0.055) 0%, rgb(255 255 255 / 0.038) 24%, rgb(255 255 255 / 0.018) 45%, transparent 62%, rgb(255 255 255 / 0.018) 80%, rgb(255 255 255 / 0.035) 100%), linear-gradient(180deg, rgb(255 255 255 / 0.03), rgb(255 255 255 / 0.008))",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-5 w-px bg-white/45"
                />
                <h2 className="type-heading-sm text-white">
                  Sections
                </h2>
              </div>
              <div className="mt-4 grid gap-2">
                {includedSections.map((section, index) => {
                  const isActive = section.id === selectedSectionId;
                  const innerOptionSignifier = getInnerOptionSignifier(
                    section.component,
                  );
                  const sectionSwapOptionsForMode = sectionSwapOptions.filter(
                    (option) => option.mode === section.mode,
                  );

                  return (
                    <div
                      className={cx(
                        "radius-4 relative overflow-hidden border transition-colors",
                        isActive
                          ? "border-white/35 bg-white/12 text-white"
                          : "border-white/10 bg-white/8 text-white",
                        section.id === draggedSectionId && "opacity-35",
                        section.id === dragOverSectionId &&
                          dragDropPosition !== null &&
                          "border-white/60",
                      )}
                      key={section.id}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                        const nextPosition = getDragDropPosition(event);

                        setDragOverSectionId(section.id);
                        setDragDropPosition(nextPosition);
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        const dropPosition = getDragDropPosition(event);
                        const droppedSectionId =
                          event.dataTransfer.getData("text/plain") ||
                          draggedSectionId;

                        if (droppedSectionId && dropPosition) {
                          reorderSection(
                            droppedSectionId,
                            section.id,
                            dropPosition,
                          );
                        } else {
                          setDraggedSectionId(null);
                          setDragOverSectionId(null);
                          setDragDropPosition(null);
                        }
                      }}
                    >
                      {section.id === dragOverSectionId && dragDropPosition ? (
                        <span
                          aria-hidden="true"
                          className={cx(
                            "absolute left-2 right-2 z-10 h-0.5 rounded-full bg-white",
                            dragDropPosition === "before"
                              ? "top-0"
                              : "bottom-0",
                          )}
                        />
                      ) : null}
                      <div className="flex min-h-12 items-stretch">
                        <button
                          aria-label={`Drag ${section.name} section`}
                          className="flex w-14 shrink-0 cursor-grab items-center justify-center border-r border-current/10 text-[0.65rem] font-semibold uppercase tracking-normal text-current/65 transition-colors hover:bg-white/10 active:cursor-grabbing"
                          draggable
                          onDragEnd={() => {
                            setDraggedSectionId(null);
                            setDragOverSectionId(null);
                            setDragDropPosition(null);
                          }}
                          onDragStart={(event) => {
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", section.id);
                            setDraggedSectionId(section.id);
                          }}
                          title="Drag to reorder"
                          type="button"
                        >
                          Drag
                        </button>
                        <button
                          aria-expanded={isActive}
                          className={cx(
                            "flex min-h-12 min-w-0 flex-1 items-start justify-between gap-3 px-3 py-2 text-left transition-colors",
                            !isActive &&
                              "hover:border-white/45 hover:bg-white/14",
                          )}
                          onClick={() =>
                            setSelectedSectionId(isActive ? null : section.id)
                          }
                          type="button"
                        >
                          <span className="min-w-0">
                            <span className="type-caption block font-semibold text-current/70">
                              {index + 1}. {section.mode}
                            </span>
                            <span className="mt-1 block truncate text-sm font-semibold">
                              {section.name}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className={cx(
                              "mt-1 flex size-7 shrink-0 items-center justify-center rounded-sm border transition-transform",
                              isActive
                                ? "rotate-180 border-white/25 text-white"
                                : "border-white/10 text-white/60",
                            )}
                          >
                            <DownArrowIcon className="size-3.5" />
                          </span>
                        </button>
                      </div>

                      {isActive ? (
                        <div className="grid gap-4 border-t border-current/10 p-3">
                          <div className="rounded border border-current/10 bg-white/8 p-3">
                            <p className="text-sm font-semibold text-current">
                              {section.name}
                            </p>
                            <p className="type-caption mt-1 text-current/60">
                              {section.component}
                            </p>
                            <span className="mt-3 inline-flex rounded-full border border-current/10 bg-white/10 px-3 py-1 text-xs font-semibold text-current/70">
                              {section.mode}
                            </span>
                            {section.component !== section.originalComponent && (
                              <span className="ml-2 mt-3 inline-flex rounded-full border border-current/20 bg-white/10 px-3 py-1 text-xs font-semibold text-current">
                                swapped
                              </span>
                            )}
                            {innerOptionSignifier ? (
                              <span className="ml-2 mt-3 inline-flex">
                                <InnerLayoutPill
                                  signifier={innerOptionSignifier}
                                  tone="dark"
                                />
                              </span>
                            ) : null}
                          </div>

                          <label className="grid gap-2">
                            <span className="type-caption font-semibold text-current">
                              Alternate
                            </span>
                            <select
                              className="radius-4 min-h-11 border border-white/15 bg-service-ink px-3 text-sm font-semibold text-white outline-none focus:border-white/45"
                              onChange={(event) =>
                                swapSection(section.id, event.target.value)
                              }
                              value={section.component}
                            >
                              {sectionSwapOptionsForMode.map((option) => (
                                <option
                                  key={option.component}
                                  value={option.component}
                                >
                                  {option.name}
                                </option>
                              ))}
                            </select>
                            <span className="type-caption text-current/60">
                              Swaps to another section with the same function.
                            </span>
                          </label>

                          {isSplitContentImageSection(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Split Version
                              </legend>
                              <div className="grid grid-cols-2 gap-2">
                                {splitContentImageVariantOptions.map((option) => {
                                  const optionIsActive =
                                    (section.variant ??
                                      splitContentImageVariantOptions[0]
                                        .value) === option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "radius-4 min-h-10 border px-3 text-left text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "border-white/45 bg-white/16 text-white"
                                          : "border-white/15 bg-white/8 text-white hover:border-white/45 hover:bg-white/14",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateSplitContentImageVariant(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                              <p className="type-caption text-current/60">
                                Choose the text/image column balance for this
                                split hero.
                              </p>
                            </fieldset>
                          ) : null}

                          {isHeroCompactSection(section) ? (
                            <fieldset className="grid gap-2">
                              <legend className="type-caption font-semibold text-current">
                                Alignment
                              </legend>
                              <div className="grid grid-cols-3 gap-2">
                                {heroCompactAlignOptions.map((option) => {
                                  const optionIsActive =
                                    getHeroCompactAlign(section) ===
                                    option.value;

                                  return (
                                    <button
                                      aria-pressed={optionIsActive}
                                      className={cx(
                                        "radius-4 min-h-10 border px-3 text-center text-xs font-semibold transition-colors",
                                        optionIsActive
                                          ? "border-white/45 bg-white/16 text-white"
                                          : "border-white/15 bg-white/8 text-white hover:border-white/45 hover:bg-white/14",
                                      )}
                                      key={option.value}
                                      onClick={() =>
                                        updateHeroCompactAlign(
                                          section.id,
                                          option.value,
                                        )
                                      }
                                      type="button"
                                    >
                                      {option.label}
                                    </button>
                                  );
                                })}
                              </div>
                              <p className="type-caption text-current/60">
                                Choose where the compact title block sits on
                                the seven-column grid.
                              </p>
                            </fieldset>
                          ) : null}

                          {isAnyFixedRatioSplitSection(section) ? (
                            <div className="grid gap-4">
                              <fieldset className="grid gap-2">
                                <legend className="type-caption font-semibold text-current">
                                  Fixed-ratio Layout
                                </legend>
                                <div className="grid gap-2">
                                  {fixedRatioSplitVariantOptions.map((option) => {
                                    const optionIsActive =
                                      (section.variant ??
                                        fixedRatioSplitVariantOptions[0]
                                          .value) === option.value;

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "radius-4 min-h-10 border px-3 text-left text-xs font-semibold transition-colors",
                                          optionIsActive
                                            ? "border-white/45 bg-white/16 text-white"
                                            : "border-white/15 bg-white/8 text-white hover:border-white/45 hover:bg-white/14",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateFixedRatioSplitVariant(
                                            section.id,
                                            option.value,
                                          )
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </fieldset>

                              <fieldset className="grid gap-2">
                                <legend className="type-caption font-semibold text-current">
                                  Image Ratio
                                </legend>
                                <div className="grid grid-cols-3 gap-2">
                                  {fixedRatioSplitRatioOptions.map((option) => {
                                    const optionIsActive =
                                      (section.ratio ??
                                        fixedRatioSplitRatioOptions[0].value) ===
                                      option.value;

                                    return (
                                      <button
                                        aria-pressed={optionIsActive}
                                        className={cx(
                                          "radius-4 min-h-9 border px-2 text-center text-xs font-semibold transition-colors",
                                          optionIsActive
                                            ? "border-white/45 bg-white/16 text-white"
                                            : "border-white/15 bg-white/8 text-white hover:border-white/45 hover:bg-white/14",
                                        )}
                                        key={option.value}
                                        onClick={() =>
                                          updateFixedRatioSplitRatio(
                                            section.id,
                                            option.value,
                                          )
                                        }
                                        type="button"
                                      >
                                        {option.label}
                                      </button>
                                    );
                                  })}
                                </div>
                                <p className="type-caption text-current/60">
                                  Sets the image frame to one of the preferred
                                  landscape or portrait ratios.
                                </p>
                              </fieldset>
                            </div>
                          ) : null}

                          <button
                            className="radius-4 min-h-10 border border-current/10 bg-white/8 px-3 text-sm font-semibold text-current transition-colors hover:border-current/30 hover:bg-white/14"
                            onClick={() => deleteSection(section.id)}
                            type="button"
                          >
                            Delete Section
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="radius-medium order-5 border border-white/10 bg-white/8 p-5 shadow-service">
              <h2 className="type-heading-sm text-white">
                Preview Controls
              </h2>
              <div className="mt-4 grid gap-4">
                <div className="grid gap-2">
                  <span className="type-caption font-semibold text-white">
                    Preview Canvas
                  </span>
                  <div className="radius-4 border border-white/20 bg-white/10 px-3 py-3">
                    <p className="text-sm font-semibold text-white">
                      {selectedViewport.label}
                    </p>
                    <p className="type-caption mt-1 text-white/60">
                      {selectedViewport.sizeLabel}
                    </p>
                  </div>
                  <span className="type-caption text-white/60">
                    All pagebuilder previews use this fixed canvas for
                    agreement and consistency.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="radius-4 min-h-10 border border-white/35 bg-white/14 px-3 text-sm font-semibold text-white transition-colors hover:border-white/55 hover:bg-white/20"
                    onClick={() => setIsPreviewOpen(true)}
                    type="button"
                  >
                    Focus
                  </button>
                  <button
                    className="radius-4 min-h-10 border border-white/10 bg-white/8 px-3 text-sm font-semibold text-white transition-colors hover:border-white/45 hover:bg-white/14"
                    onClick={refreshPreviewStyles}
                    type="button"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <details className="radius-medium group order-6 border border-white/10 bg-white/8 p-5 shadow-service">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <h2 className="type-heading-sm text-white">
                  Add Section
                </h2>
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center border border-white/15 text-white/80 transition-transform group-open:rotate-180"
                >
                  <DownArrowIcon className="size-4" />
                </span>
              </summary>
              <div className="mt-4 grid gap-4">
                {sectionModes.map((mode) => {
                  const options = sectionSwapOptions.filter(
                    (option) => option.mode === mode.name,
                  );

                  if (options.length === 0) {
                    return null;
                  }

                  return (
                    <details
                      className="group/mode rounded border border-white/10 bg-white/6"
                      key={mode.id}
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-left">
                        <span className="min-w-0">
                          <span className="type-caption block font-semibold text-white">
                            {mode.name}
                          </span>
                          <span className="type-caption mt-0.5 block text-white/55">
                            {options.length} section options
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="flex size-7 shrink-0 items-center justify-center border border-white/15 text-white/75 transition-transform group-open/mode:rotate-180"
                        >
                          <DownArrowIcon className="size-3.5" />
                        </span>
                      </summary>
                      <div className="grid gap-1.5 border-t border-white/10 p-2">
                        {options.map((option) => {
                          const templateUsageCount =
                            sectionTemplateUsageCounts.get(option.component) ?? 0;
                          const innerOptionSignifier =
                            getInnerOptionSignifier(option.component);

                          return (
                            <button
                              className="radius-4 grid min-h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-white/10 bg-white/8 px-3 py-2 text-left text-sm font-semibold text-white transition-colors hover:border-white/45 hover:bg-white/14"
                              key={option.component}
                              onClick={() => addSection(option.component)}
                              type="button"
                            >
                              <span className="min-w-0">
                                {!innerOptionSignifier ? (
                                  <span className="block">{option.name}</span>
                                ) : null}
                                {innerOptionSignifier ? (
                                  <InnerLayoutPill
                                    signifier={innerOptionSignifier}
                                    tone="dark"
                                  />
                                ) : null}
                              </span>
                              <span className="flex items-center gap-1.5">
                                {templateUsageCount > 0 ? (
                                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[0.625rem] font-semibold leading-none text-white/65">
                                    {templateUsageCount}
                                  </span>
                                ) : null}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}
              </div>
              <p className="type-caption mt-3 text-white/60">
                Adds after the selected section, or at the bottom.
              </p>
            </details>
          </aside>

          <div className="grid h-full min-h-0 overflow-hidden rounded border border-white/10 bg-service-ink p-2 shadow-service max-lg:h-[78svh]">
            <div className="grid h-full min-h-0 place-items-stretch overflow-hidden">
              {renderPreviewWindow()}
            </div>

            <div className="hidden">
            <div className="radius-medium border border-service-border bg-white p-1.5 shadow-service">
              <div
                aria-label="Pagebuilder design tabs"
                className="grid grid-cols-5 gap-1.5 max-xl:grid-cols-3 max-md:grid-cols-1"
                role="tablist"
              >
                {recipes.map((recipe) => {
                  const isActive = recipe.id === activeRecipe.id;

                  return (
                    <button
                      aria-controls={`recipe-${recipe.id}`}
                      aria-selected={isActive}
                      className={cx(
                        "radius-4 min-h-9 px-2.5 text-left text-xs font-semibold transition-colors",
                        isActive
                          ? "bg-service-ink text-white"
                          : "border border-service-border bg-service-surface text-service-ink hover:border-service-accent hover:text-service-accent",
                      )}
                      id={`tab-${recipe.id}`}
                      key={recipe.id}
                      onClick={() => {
                        setActiveRecipeId(recipe.id);
                        setSelectedSectionId(null);
                      }}
                      role="tab"
                      type="button"
                    >
                      {recipe.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              aria-labelledby={`tab-${activeRecipe.id}`}
              className="grid content-start gap-4"
              id={`recipe-${activeRecipe.id}`}
              role="tabpanel"
            >
              <div className="grid w-full content-start gap-4">
                <section className="radius-medium border border-service-border bg-white p-4 shadow-service">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="type-label text-service-accent">
                        Pagebuilder Design
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-service-ink">
                        {activePageLabel}
                      </h2>
                      <p className="type-caption wrap-pretty mt-1 text-service-muted">
                        {activeRecipe.positioning}
                      </p>
                    </div>
                    <button
                      className="radius-4 min-h-11 shrink-0 border border-service-ink bg-service-ink px-4 text-sm font-semibold text-white transition-colors hover:border-service-accent hover:bg-service-accent"
                      onClick={() => setIsPreviewOpen(true)}
                      type="button"
                    >
                      Focus Preview
                    </button>
                    <button
                      className="radius-4 min-h-11 shrink-0 border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                      onClick={refreshPreviewStyles}
                      type="button"
                    >
                      Refresh Styles
                    </button>
                    <button
                      className="radius-4 min-h-11 shrink-0 border border-service-ink bg-service-ink px-4 text-sm font-semibold text-white transition-colors hover:border-service-accent hover:bg-service-accent disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isSavingOption}
                      onClick={() => void saveActiveOption()}
                      type="button"
                    >
                      {isSavingOption ? "Saving..." : "Save Layout"}
                    </button>
                    <button
                      className="radius-4 min-h-11 shrink-0 border border-service-border bg-white px-3 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                      onClick={openTemplateModal}
                      type="button"
                    >
                      Promote Layout to Template
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[
                      `Layout: ${activeSlotLabel}`,
                      `Viewport: ${selectedViewport.label}`,
                      `Sections: ${includedSections.length}`,
                      "Normal spacing",
                    ].map((rule) => (
                      <span
                        className="rounded-full border border-service-border bg-service-surface px-2.5 py-1 text-xs font-semibold text-service-muted"
                        key={rule}
                      >
                        {rule}
                      </span>
                    ))}
                  </div>
                  {templateStatus ? (
                    <p className="type-caption mt-3 rounded-sm border border-service-border bg-service-surface px-3 py-2 text-service-muted">
                      {templateStatus}
                    </p>
                  ) : null}
                  {optionSaveStatus || optionSaveError ? (
                    <p
                      className={cx(
                        "type-caption mt-3 rounded-sm border px-3 py-2",
                        optionSaveError
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-service-border bg-service-surface text-service-muted",
                      )}
                    >
                      {optionSaveError || optionSaveStatus}
                    </p>
                  ) : null}
                </section>

                <section
                  aria-labelledby="pagebuilder-rendered-preview-button"
                  className="radius-medium overflow-hidden border border-service-border bg-white shadow-service"
                >
                  <button
                    aria-controls="pagebuilder-rendered-preview-panel"
                    aria-expanded={isRenderedPreviewOpen}
                    className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-service-surface/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-service-accent"
                    id="pagebuilder-rendered-preview-button"
                    onClick={() =>
                      setIsRenderedPreviewOpen(
                        (currentIsOpen) => !currentIsOpen,
                      )
                    }
                    type="button"
                  >
                    <span className="min-w-0">
                      <span className="type-label block text-service-accent">
                        Rendered Preview
                      </span>
                      <span className="type-heading-sm mt-2 block text-service-ink">
                        {activePageLabel} page body
                      </span>
                    </span>
                    <span className="flex flex-wrap justify-end gap-2">
                      {[
                        selectedViewport.label,
                        "Normal spacing",
                        "Section builder",
                      ].map((label) => (
                        <span
                          className="rounded-full border border-service-border bg-service-surface px-3 py-1 text-xs font-semibold text-service-muted"
                          key={label}
                        >
                          {label}
                        </span>
                      ))}
                      <span
                        aria-hidden="true"
                        className={`flex size-8 items-center justify-center rounded-sm border border-service-border text-service-accent transition-transform ${
                          isRenderedPreviewOpen ? "rotate-180" : ""
                        }`}
                      >
                        <DownArrowIcon className="size-4" />
                      </span>
                    </span>
                  </button>

                  {isRenderedPreviewOpen ? (
                    <div
                      aria-labelledby="pagebuilder-rendered-preview-button"
                      className="border-t border-service-border p-5"
                      id="pagebuilder-rendered-preview-panel"
                      role="region"
                    >
                      <div className="rounded border border-service-border bg-service-surface p-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-service-ink">
                            {selectedViewport.sizeLabel}
                          </p>
                          <p className="type-caption mt-1 text-service-muted">
                            Click rendered sections to select them, then swap,
                            reorder, or toggle them from the controls.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 h-[72svh] min-h-[36rem] overflow-hidden rounded border border-service-border bg-service-surface p-3 max-md:h-[68svh] max-md:min-h-[28rem] max-sm:min-h-[24rem]">
                        <div className="grid h-full min-h-0 place-items-center overflow-hidden">
                          {renderPreviewWindow()}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </section>

                <details className="radius-medium border border-service-border bg-white p-5 shadow-service">
                  <summary className="cursor-pointer text-sm font-semibold text-service-ink">
                    Section Stack
                  </summary>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded border border-service-border bg-service-surface p-3">
                    <div className="min-w-0">
                      <p className="type-caption font-semibold text-service-ink">
                        Building Space
                      </p>
                      <p className="type-caption mt-1 text-service-muted">
                        {includedSections.length} sections currently included.
                      </p>
                    </div>
                    <button
                      aria-label="Clear all sections from the building space"
                      className="radius-4 inline-flex min-h-10 items-center gap-2 border border-service-border bg-white px-3 text-xs font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={includedSections.length === 0}
                      onClick={clearActiveBuildingSpace}
                      title="Clear building space"
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-6 items-center justify-center rounded-sm border border-current text-sm leading-none"
                      >
                        X
                      </span>
                      <span>Clear</span>
                    </button>
                  </div>
                  <div className="mt-5 grid gap-2 rounded border border-service-border bg-service-surface p-3">
                    <div className="grid gap-3">
                      <p className="type-caption font-semibold text-service-ink">
                        Add Section Template
                      </p>
                      {sectionModes.map((mode) => {
                        const options = sectionSwapOptions.filter(
                          (option) => option.mode === mode.name,
                        );

                        if (options.length === 0) {
                          return null;
                        }

                        return (
                          <details
                            className="group/template-mode rounded border border-service-border bg-white"
                            key={mode.id}
                          >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-left">
                              <span className="min-w-0">
                                <span className="type-caption block font-semibold text-service-ink">
                                  {mode.name}
                                </span>
                                <span className="type-caption mt-0.5 block text-service-muted">
                                  {options.length} section options
                                </span>
                              </span>
                              <span
                                aria-hidden="true"
                                className="flex size-7 shrink-0 items-center justify-center rounded-sm border border-service-border text-service-accent transition-transform group-open/template-mode:rotate-180"
                              >
                                <DownArrowIcon className="size-3.5" />
                              </span>
                            </summary>
                            <div className="grid grid-cols-2 gap-2 border-t border-service-border p-2 max-md:grid-cols-1">
                              {options.map((option) => {
                                const innerOptionSignifier =
                                  getInnerOptionSignifier(option.component);

                                return (
                                  <button
                                    className="radius-4 grid min-h-10 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-service-border bg-white px-3 py-2 text-left text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                                    key={option.component}
                                    onClick={() => addSection(option.component)}
                                    type="button"
                                  >
                                    <span className="min-w-0">
                                      {!innerOptionSignifier ? (
                                        <span className="block">
                                          {option.name}
                                        </span>
                                      ) : null}
                                      {innerOptionSignifier ? (
                                        <InnerLayoutPill
                                          signifier={innerOptionSignifier}
                                          tone="light"
                                        />
                                      ) : null}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </details>
                        );
                      })}
                      <span className="type-caption text-service-muted">
                        Adds after the selected section, or at the bottom if
                        nothing is selected.
                      </span>
                    </div>
                  </div>
                  <ol className="mt-5 grid gap-3">
                    {activeStack.map((section, index) => (
                      <li
                        className={cx(
                          "relative grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-4 rounded border border-service-border bg-service-surface p-4 transition-shadow max-md:grid-cols-[2.5rem_minmax(0,1fr)]",
                          section.id === selectedSectionId &&
                            "shadow-[0_0_0_2px_var(--color-service-accent)]",
                          section.id === draggedSectionId && "opacity-35",
                          section.id === dragOverSectionId &&
                            dragDropPosition !== null &&
                            "border-service-accent",
                          !section.included && "opacity-50",
                        )}
                        draggable
                        onDragEnd={() => {
                          setDraggedSectionId(null);
                          setDragOverSectionId(null);
                          setDragDropPosition(null);
                        }}
                        onDragOver={(event) => {
                          event.preventDefault();
                          event.dataTransfer.dropEffect = "move";
                          const nextPosition = getDragDropPosition(event);

                          setDragOverSectionId(section.id);
                          setDragDropPosition(nextPosition);
                        }}
                        onDragStart={(event) => {
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData(
                            "text/plain",
                            section.id,
                          );
                          setDraggedSectionId(section.id);
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          const dropPosition = getDragDropPosition(event);
                          const droppedSectionId =
                            event.dataTransfer.getData("text/plain") ||
                            draggedSectionId;

                          if (droppedSectionId && dropPosition) {
                            reorderSection(
                              droppedSectionId,
                              section.id,
                              dropPosition,
                            );
                          } else {
                            setDraggedSectionId(null);
                            setDragOverSectionId(null);
                            setDragDropPosition(null);
                          }
                        }}
                        key={section.id}
                      >
                        {section.id === dragOverSectionId && dragDropPosition ? (
                          <span
                            aria-hidden="true"
                            className={cx(
                              "absolute left-3 right-3 h-0.5 rounded-full bg-service-accent",
                              dragDropPosition === "before"
                                ? "top-0"
                                : "bottom-0",
                            )}
                          />
                        ) : null}
                        <span className="flex size-10 cursor-grab items-center justify-center rounded bg-white text-sm font-semibold text-service-accent active:cursor-grabbing">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h4 className="type-heading-sm text-service-ink">
                                {section.name}
                              </h4>
                              <p className="type-caption mt-1 text-service-muted">
                                {section.component}
                              </p>
                            </div>
                            <span className="rounded-full border border-service-border bg-white px-3 py-1 text-xs font-semibold text-service-muted">
                              {section.included
                                ? section.mode
                                : `${section.mode} / excluded`}
                            </span>
                          </div>
                          <p className="type-text-sm wrap-pretty mt-3 text-service-muted">
                            {section.instruction}
                          </p>
                        </div>
                        <div className="grid content-start gap-2 max-md:col-span-2 max-md:grid-cols-4">
                          <button
                            className="radius-4 min-h-9 border border-service-border bg-white px-3 text-xs font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-40"
                            disabled={index === 0}
                            onClick={() => {
                              setSelectedSectionId(section.id);
                              moveSection(section.id, -1);
                            }}
                            type="button"
                          >
                            Up
                          </button>
                          <button
                            className="radius-4 min-h-9 border border-service-border bg-white px-3 text-xs font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-40"
                            disabled={index === activeStack.length - 1}
                            onClick={() => {
                              setSelectedSectionId(section.id);
                              moveSection(section.id, 1);
                            }}
                            type="button"
                          >
                            Down
                          </button>
                          <button
                            className="radius-4 min-h-9 border border-service-border bg-white px-3 text-xs font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                            onClick={() => setSelectedSectionId(section.id)}
                            type="button"
                          >
                            Select
                          </button>
                          <button
                            className="radius-4 min-h-9 border border-service-border bg-white px-3 text-xs font-semibold text-service-muted transition-colors hover:border-service-accent hover:text-service-accent"
                            onClick={() => deleteSection(section.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ol>
                </details>

                <details className="radius-medium border border-service-border bg-white p-5 shadow-service">
                  <summary className="cursor-pointer text-sm font-semibold text-service-ink">
                    Page Instruction
                  </summary>
                  <div className="mt-4 grid grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.45fr)] gap-4 max-lg:grid-cols-1">
                    <div className="grid gap-3">
                      <textarea
                        className="min-h-[34rem] resize-y rounded border border-service-border bg-service-surface p-4 font-mono text-xs leading-6 text-service-ink outline-none focus:border-service-accent"
                        readOnly
                        value={pageInstruction}
                      />
                      <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                        <button
                          className="radius-4 min-h-11 border border-service-ink bg-service-ink px-4 text-sm font-semibold text-white transition-colors hover:border-service-accent hover:bg-service-accent"
                          onClick={copyPageInstruction}
                          type="button"
                        >
                          Copy Page Instruction
                        </button>
                        <button
                          className="radius-4 min-h-11 border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                          onClick={copyAllLayoutInstructions}
                          type="button"
                        >
                          Copy All Page Instructions
                        </button>
                      </div>
                    </div>
                    <div className="rounded border border-service-border bg-service-surface p-4">
                      <p className="type-caption font-semibold text-service-ink">
                        Use {activePageLabel}
                      </p>
                      <p className="type-caption mt-2 text-service-muted">
                        {activeRecipe.positioning}
                      </p>
                      <div className="mt-3 grid gap-2 rounded border border-service-border bg-white p-3">
                        <p className="type-caption text-service-muted">
                          Sections:{" "}
                          <span className="font-semibold text-service-ink">
                            {includedSections.length}
                          </span>
                        </p>
                        <p className="type-caption text-service-muted">
                          Spacing:{" "}
                          <span className="font-semibold text-service-ink">
                            Normal
                          </span>
                        </p>
                        <p className="type-caption text-service-muted">
                          Preview width:{" "}
                          <span className="font-semibold text-service-ink">
                            {selectedViewport.label}
                          </span>
                        </p>
                      </div>
                      <div className="mt-3 grid gap-2 rounded border border-service-border bg-white p-3">
                        {[
                          "Use the existing project typography and color tokens.",
                          "Keep section spacing on the normal shared density.",
                          selectedViewport.brief,
                        ].map((brief) => (
                          <p
                            className="type-caption text-service-muted"
                            key={brief}
                          >
                            {brief}
                          </p>
                        ))}
                      </div>
                      <ol className="mt-3 grid gap-2">
                        {includedSections.map((section, index) => (
                          <li
                            className="type-caption rounded border border-service-border bg-white p-3 text-service-muted"
                            key={`${section.id}-brief`}
                          >
                            <span className="font-semibold text-service-ink">
                              {index + 1}. {section.component}
                            </span>
                            <br />
                            {section.mode}: {section.instruction}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </details>

                <details className="radius-medium border border-service-border bg-white p-5 shadow-service">
                  <summary className="cursor-pointer text-sm font-semibold text-service-ink">
                    Semantic Modes
                  </summary>
                  <div className="mt-4 grid grid-cols-4 gap-3 max-xl:grid-cols-2 max-md:grid-cols-1">
                    {sectionModes.map((mode) => (
                      <div
                        className="rounded border border-service-border bg-service-surface p-3"
                        key={mode.id}
                      >
                        <h3 className="text-sm font-semibold text-service-ink">
                          {mode.name}
                        </h3>
                        <p className="type-caption mt-2 text-service-muted">
                          {mode.intent}
                        </p>
                        <ul className="mt-3 grid gap-2">
                          {mode.rules.map((rule) => (
                            <li
                              className="type-caption text-service-muted"
                              key={rule}
                            >
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      {isTemplateModalOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-service-ink/40 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeTemplateModal();
            }
          }}
        >
          <div
            aria-labelledby="pagebuilder-template-promotion-title"
            aria-modal="true"
            className="w-full max-w-lg rounded-md border border-service-border bg-white p-6 text-service-ink shadow-service"
            role="dialog"
          >
            <p className="type-label text-service-accent">
              Promote layout to template
            </p>
            <h3
              className="type-heading-sm mt-3 text-service-ink"
              id="pagebuilder-template-promotion-title"
            >
              Save {activePageLabel}
            </h3>
            <p className="type-text-sm mt-3 text-service-muted">
              This saves the active page layout as a reusable page template with its
              current included section order, swaps, variants, and layout
              settings.
            </p>
            <label className="type-caption mt-6 block font-semibold text-service-ink">
              Template name
              <input
                className="mt-2 block min-h-11 w-full rounded-sm border border-service-border px-3 text-sm font-normal text-service-ink outline-none focus:border-service-accent"
                value={templateName}
                onChange={(event) => {
                  const nextName = event.target.value;
                  setTemplateName(nextName);
                  setTemplateSlug(slugifyTemplateName(nextName));
                }}
              />
            </label>
            <label className="type-caption mt-4 block font-semibold text-service-ink">
              Template slug
              <input
                className="mt-2 block min-h-11 w-full rounded-sm border border-service-border px-3 text-sm font-normal text-service-ink outline-none focus:border-service-accent"
                value={templateSlug}
                onChange={(event) =>
                  setTemplateSlug(slugifyTemplateName(event.target.value))
                }
              />
            </label>
            <label className="type-caption mt-4 block font-semibold text-service-ink">
              Notes
              <textarea
                className="mt-2 block min-h-24 w-full resize-y rounded-sm border border-service-border px-3 py-2 text-sm font-normal text-service-ink outline-none focus:border-service-accent"
                placeholder="Best use case, business type, or page intent."
                value={templateNotes}
                onChange={(event) => setTemplateNotes(event.target.value)}
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
                {includedSections.length} sections
              </span>
              <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
                {activeRecipe.name}
              </span>
              <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 text-service-muted">
                {activeSlotLabel}
              </span>
            </div>
            {templateError ? (
              <p className="type-caption mt-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-red-700">
                {templateError}
              </p>
            ) : null}
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-sm border border-service-border px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isPromotingTemplate}
                onClick={closeTemplateModal}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-10 items-center justify-center rounded-sm bg-service-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-service-ink disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isPromotingTemplate}
                onClick={() => void promoteActiveOptionToTemplate()}
                type="button"
              >
                {isPromotingTemplate
                  ? "Promoting..."
                  : "Promote Layout to Template"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {isPreviewOpen && (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 grid bg-service-ink/82 p-4 backdrop-blur-sm max-md:p-3"
          role="dialog"
        >
          <button
            aria-label="Close preview"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsPreviewOpen(false)}
            type="button"
          />
          <div className="relative z-10 grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-white/15 bg-white px-3 py-2 shadow-service">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-service-ink">
                  {activePageLabel}
                </p>
                <p className="type-caption truncate text-service-muted">
                  {selectedViewport.sizeLabel} preview
                </p>
              </div>
              <div className="rounded border border-service-border bg-service-surface px-3 py-2">
                <p className="text-xs font-semibold text-service-ink">
                  {selectedViewport.label}
                </p>
              </div>
              <button
                className="min-h-10 shrink-0 rounded border border-service-border bg-service-surface px-3 text-xs font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                onClick={refreshPreviewStyles}
                type="button"
              >
                Refresh Styles
              </button>
              <button
                aria-label="Close preview"
                className="flex size-10 shrink-0 items-center justify-center rounded border border-service-border bg-service-surface text-xl font-semibold leading-none text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                onClick={() => setIsPreviewOpen(false)}
                type="button"
              >
                x
              </button>
            </div>
            <div className="grid min-h-0 place-items-center overflow-hidden">
              {renderPreviewWindow()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
