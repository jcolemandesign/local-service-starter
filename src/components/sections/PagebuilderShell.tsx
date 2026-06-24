"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  HeroSplitFixedImageSectionV3,
  type HeroSplitFixedImageRatio,
  type HeroSplitFixedImageVariant,
} from "@/components/sections/HeroSplitFixedImageSectionV3";
import {
  HeroSplitFullHeightSectionV3,
  type HeroSplitFullHeightVariant,
} from "@/components/sections/HeroSplitFullHeightSectionV3";
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

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type PreviewVariableStyle = CSSProperties & Record<`--${string}`, string>;

const normalSpacingClassName = "pagebuilder-density-normal";
const splitContentImageComponent = "HeroSplitFullHeightSectionV3";
const fixedRatioSplitComponent = "HeroSplitFixedImageSectionV3";
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
    id: "wide",
    label: "Wide",
    contentClassName: "max-w-full",
    frameClassName: "w-full max-w-[min(100%,calc((100svh-7rem)*1.777))]",
    screenClassName: "aspect-[16/9]",
    sizeLabel: "Fluid browser",
    brief: "Review the template in a wide browser-style viewport.",
  },
  {
    id: "main",
    label: "Main",
    contentClassName: "max-w-full",
    frameClassName: "h-full w-full max-w-[90rem]",
    screenClassName: "h-full flex-1",
    sizeLabel: "Main container",
    brief:
      "Review the template in the 1440px main container with preserved page scrolling.",
  },
  {
    id: "desktop",
    label: "Desktop",
    contentClassName: "max-w-full",
    frameClassName: "w-full max-w-[min(72rem,calc((100svh-7rem)*1.6))]",
    screenClassName: "aspect-[16/10]",
    sizeLabel: "Desktop window",
    brief: "Review the template in a proportional desktop window.",
  },
  {
    id: "tablet",
    label: "Tablet",
    contentClassName: "max-w-full",
    frameClassName: "w-full max-w-[min(42rem,calc((100svh-7rem)*0.75))]",
    screenClassName: "aspect-[3/4]",
    sizeLabel: "Tablet window",
    brief: "Review the template in a tablet-shaped window with responsive simplification.",
  },
  {
    id: "mobile",
    label: "Mobile",
    contentClassName: "max-w-full",
    frameClassName: "w-full max-w-[min(24rem,calc((100svh-7rem)*0.5625))]",
    screenClassName: "aspect-[9/16]",
    sizeLabel: "Mobile window",
    brief: "Review the template in a phone-shaped window with responsive simplification.",
  },
] as const;

type DesignStyleSettings = {
  showSectionMarkers: boolean;
  viewportId: (typeof viewportOptions)[number]["id"];
};

type PageLayoutSlot = {
  designStyle: DesignStyleSettings;
  name: string;
  stack: WorkingSection[];
};

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
    included: true,
    originalComponent: section.component,
    originalIndex: index,
    ratio:
      section.component === fixedRatioSplitComponent
        ? section.ratio ?? fixedRatioSplitRatioOptions[0].value
        : section.ratio,
    variant:
      section.component === splitContentImageComponent
        ? section.variant ?? splitContentImageVariantOptions[0].value
        : section.component === fixedRatioSplitComponent
          ? section.variant ?? fixedRatioSplitVariantOptions[0].value
          : section.variant,
  }));
}

function createInitialLayoutSlots(recipe: PagebuilderRecipe) {
  return Array.from({ length: 3 }, (_, index) => ({
    designStyle: createInitialDesignStyle(),
    name: `Option ${index + 1}`,
    stack: createInitialWorkingStack(recipe, index),
  }));
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
    component: "ServicesGridSectionV2",
    instruction:
      "Use a straightforward services grid when the page needs familiar scan-and-compare service cards.",
    mode: "Scan",
    name: "Services grid",
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
      "Show top-level services with consistent title and body length.",
    mode: "Scan",
    name: "Services grid",
  },
  {
    component: "ServicesScrollCardsSectionV2",
    instruction:
      "Use a service rail when there are more service paths than a small grid can handle gracefully.",
    mode: "Scan",
    name: "Scroll service cards",
  },
  {
    component: "ContentRevealParagraphSectionV2",
    instruction:
      "Use a short editorial thesis to slow the page down and frame the service promise.",
    mode: "Narrative",
    name: "Reveal paragraph",
  },
  {
    component: "ContentSplitHeadlineImageSectionV2",
    instruction:
      "Translate regular content into an image-led editorial texture with one large positioning line.",
    mode: "Narrative",
    name: "Split headline image content",
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
    component: "ContentRuleHeaderSectionV2",
    instruction:
      "Use as lightweight editorial texture to introduce a practical idea without adding a heavy section.",
    mode: "Narrative",
    name: "Rule header content",
  },
  {
    component: "TrustBarSectionV3",
    instruction:
      "Validate the promise immediately with rating, volume, team, and locality claims.",
    mode: "Proof",
    name: "Trust bar",
  },
  {
    component: "TrustMarqueeSectionV3",
    instruction:
      "Use short repeated claims when there are many small proof points.",
    mode: "Proof",
    name: "Trust marquee",
  },
  {
    component: "TrustLogoGridSectionV3",
    instruction:
      "Use static logos or associations when motion would distract from reading.",
    mode: "Proof",
    name: "Static trust logo grid",
  },
  {
    component: "TestimonialsCarouselSectionV3",
    instruction:
      "Use longer customer stories only if they contain useful service detail.",
    mode: "Proof",
    name: "Customer stories",
  },
  {
    component: "TestimonialsMasonrySectionV3",
    instruction:
      "Use varied quote lengths to create a fuller body of evidence.",
    mode: "Proof",
    name: "Masonry testimonials",
  },
  {
    component: "FAQSectionV3",
    instruction:
      "Include only the questions that affect whether someone contacts you.",
    mode: "Decision",
    name: "FAQ",
  },
  {
    component: "FAQAccordionSectionV3",
    instruction:
      "Handle objections with expandable answers and no vague copy.",
    mode: "Decision",
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
] as const;

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
       : isFixedRatioSplitSection(section)
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
  const [activeLayoutSlotIndexes, setActiveLayoutSlotIndexes] = useState<
    number[]
  >(() => recipes.map(() => 0));
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRenderedPreviewOpen, setIsRenderedPreviewOpen] = useState(false);
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const [previewVariableStyle, setPreviewVariableStyle] =
    useState<PreviewVariableStyle>({});

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
  const activeDesignStyle =
    activeLayoutSlot?.designStyle ?? createInitialDesignStyle();
  const activeStack = activeLayoutSlot?.stack ?? [];
  const activeSlotLabel = activeLayoutSlot?.name ?? "Option 1";
  const selectedSection =
    activeStack.find((section) => section.id === selectedSectionId) ?? null;
  const selectedViewport =
    viewportOptions.find((option) => option.id === activeDesignStyle.viewportId) ??
    viewportOptions[0];
  const includedSections = activeStack.filter((section) => section.included);
  const excludedSections = activeStack.filter((section) => !section.included);
  const pageInstruction = buildPageInstruction({
    designLabel: `${activePageLabel} - ${activeSlotLabel}`,
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
        designLabel: `${recipe.name} - ${slot?.name ?? "Option 1"}`,
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

  function updateActiveDesignStyle(
    updater: (settings: DesignStyleSettings) => DesignStyleSettings,
  ) {
    setLayoutSlots((currentSlots) =>
      currentSlots.map((recipeSlots, recipeIndex) =>
        recipeIndex === activeRecipeIndex
          ? recipeSlots.map((slot, slotIndex) =>
              slotIndex === activeLayoutSlotIndex
                ? {
                    ...slot,
                    designStyle: updater(slot.designStyle),
                  }
                : slot,
            )
          : recipeSlots,
      ),
    );
  }

  function switchLayoutSlot(recipeIndex: number, slotIndex: number) {
    setActiveLayoutSlotIndexes((currentIndexes) =>
      currentIndexes.map((currentIndex, index) =>
        index === recipeIndex ? slotIndex : currentIndex,
      ),
    );
    setSelectedSectionId(null);
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

  function deleteSection(sectionId: string) {
    updateActiveStack((stack) =>
      stack.filter((section) => section.id !== sectionId),
    );

    if (sectionId === selectedSectionId) {
      setSelectedSectionId(null);
    }
  }

  function swapSection(sectionId: string, component: string) {
    const nextOption = sectionSwapOptions.find(
      (option) => option.component === component,
    );
    const currentSection = activeStack.find((section) => section.id === sectionId);

    if (!currentSection || !nextOption || nextOption.mode !== currentSection.mode) {
      return;
    }

    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              component: nextOption.component,
              instruction: nextOption.instruction,
              mode: nextOption.mode,
              name: nextOption.name,
              ratio:
                nextOption.component === fixedRatioSplitComponent
                  ? section.ratio ?? fixedRatioSplitRatioOptions[0].value
                  : undefined,
              variant:
                nextOption.component === splitContentImageComponent
                  ? section.variant ?? splitContentImageVariantOptions[0].value
                  : nextOption.component === fixedRatioSplitComponent
                    ? section.variant ?? fixedRatioSplitVariantOptions[0].value
                  : undefined,
            }
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
        section.id === sectionId && isFixedRatioSplitSection(section)
          ? {
              ...section,
              variant,
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
        section.id === sectionId && isFixedRatioSplitSection(section)
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

    const nextSection: WorkingSection = {
      component: nextOption.component,
      id: `${activeRecipe.id}-${nextOption.component}-added-${Date.now()}`,
      included: true,
      instruction: nextOption.instruction,
      mode: nextOption.mode,
      name: nextOption.name,
      originalComponent: nextOption.component,
      originalIndex: -1,
      ratio:
        nextOption.component === fixedRatioSplitComponent
          ? fixedRatioSplitRatioOptions[0].value
          : undefined,
      variant:
        nextOption.component === splitContentImageComponent
          ? splitContentImageVariantOptions[0].value
          : nextOption.component === fixedRatioSplitComponent
            ? fixedRatioSplitVariantOptions[0].value
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
        activePageLabel={`${activePageLabel} / ${activeSlotLabel}`}
        contentClassName={selectedViewport.contentClassName}
        frameClassName={selectedViewport.frameClassName}
        key={`${activeRecipe.id}-${activeLayoutSlotIndex}-${selectedViewport.id}-${previewRefreshKey}`}
        previewStyle={previewVariableStyle}
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
                className="pagebuilder-nav-hero-pair relative"
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

          return renderSectionFrame(section);
        })}
      </PagebuilderPreviewWindow>
    );
  }

  return (
    <section className="h-svh overflow-hidden bg-service-ink text-white max-lg:h-auto max-lg:min-h-svh max-lg:overflow-visible">
      <div className="h-full w-full px-4 py-4 max-md:px-3">
        <div className="grid h-full min-h-0 grid-cols-[22rem_minmax(0,1fr)] items-stretch gap-5 max-lg:h-auto max-lg:grid-cols-1">
          <aside className="grid h-full min-h-0 content-start gap-4 overflow-y-auto overscroll-contain pr-1 max-lg:h-auto max-lg:overflow-visible max-lg:pr-0">
            <div className="radius-medium order-1 border border-white/10 bg-white/8 p-5 shadow-service">
              <h1 className="type-heading-lg text-white">
                Page Builder
              </h1>
              <p className="type-text-sm wrap-pretty mt-heading-body-sm text-white/68">
                Choose, swap, reorder, and preview homepage sections while the
                implementation brief updates with the live stack.
              </p>
            </div>

            <div className="radius-medium order-2 border border-white/10 bg-white/8 p-5 shadow-service">
              <h2 className="type-heading-sm text-white">
                Page Layouts
              </h2>
              <div className="mt-4 grid gap-3" role="list">
                {recipes.map((recipe, recipeIndex) => {
                  const isActive = recipe.id === activeRecipe.id;
                  const recipeSlotIndex =
                    activeLayoutSlotIndexes[recipeIndex] ?? 0;
                  const recipeSlots = layoutSlots[recipeIndex] ?? [];

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
                        <span
                          className={cx(
                            "mt-1 block text-xs font-semibold",
                            isActive ? "text-service-muted" : "text-white/55",
                          )}
                        >
                          {recipeSlots[recipeSlotIndex]?.name ?? "Option 1"}
                        </span>
                      </button>

                      {isActive ? (
                        <div
                          aria-label={`${recipe.name} stored layout options`}
                          className="grid grid-cols-3 gap-1.5"
                        >
                          {recipeSlots.map((slot, slotIndex) => {
                            const isSlotActive =
                              slotIndex === recipeSlotIndex;

                            return (
                              <button
                                aria-pressed={isSlotActive}
                                className={cx(
                                  "radius-4 min-h-8 border px-2 text-xs font-semibold transition-colors",
                                  isSlotActive
                                    ? "border-white/45 bg-white/14 text-white"
                                    : "border-white/10 bg-white/8 text-white hover:border-white/45 hover:bg-white/14",
                                )}
                                key={slot.name}
                                onClick={() =>
                                  switchLayoutSlot(recipeIndex, slotIndex)
                                }
                                type="button"
                              >
                                {slot.name}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="radius-medium order-3 border border-white/10 bg-white/8 p-5 shadow-service">
              <h2 className="type-heading-sm text-white">
                Sections
              </h2>
              <div className="mt-4 grid gap-2">
                {includedSections.map((section) => {
                  const isActive = section.id === selectedSectionId;
                  const sectionSwapOptionsForMode = sectionSwapOptions.filter(
                    (option) => option.mode === section.mode,
                  );

                  return (
                    <div
                      className={cx(
                        "radius-4 overflow-hidden border transition-colors",
                        isActive
                          ? "border-white/35 bg-white/12 text-white"
                          : "border-white/10 bg-white/8 text-white",
                      )}
                      key={section.id}
                    >
                      <button
                        aria-expanded={isActive}
                        className={cx(
                          "flex min-h-12 w-full items-start justify-between gap-3 px-3 py-2 text-left transition-colors",
                          !isActive && "hover:border-white/45 hover:bg-white/14",
                        )}
                        onClick={() =>
                          setSelectedSectionId(isActive ? null : section.id)
                        }
                        type="button"
                      >
                        <span className="min-w-0">
                          <span className="type-caption block font-semibold text-current/70">
                            {section.mode}
                          </span>
                          <span className="mt-1 block truncate text-sm font-semibold">
                            {section.name}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={cx(
                            "mt-1 flex size-7 shrink-0 items-center justify-center rounded-sm border text-sm leading-none transition-transform",
                            isActive
                              ? "rotate-180 border-white/25 text-white"
                              : "border-white/10 text-white/60",
                          )}
                        >
                          v
                        </span>
                      </button>

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

                          {isFixedRatioSplitSection(section) ? (
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
                    Preview Width
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {viewportOptions.map((option) => {
                      const isActive = option.id === selectedViewport.id;

                      return (
                        <button
                          className={cx(
                            "radius-4 min-h-10 min-w-20 border px-3 text-sm font-semibold transition-colors max-sm:min-w-0 max-sm:px-2",
                            isActive
                              ? "border-white/45 bg-white/14 text-white"
                              : "border-white/10 bg-white/8 text-white hover:border-white/45 hover:bg-white/14",
                          )}
                          key={option.id}
                          onClick={() =>
                            updateActiveDesignStyle((settings) => ({
                              ...settings,
                              viewportId: option.id,
                            }))
                          }
                          type="button"
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                  <span className="type-caption text-white/60">
                    Changes the rendered preview frame width.
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

            <div className="radius-medium order-6 border border-white/10 bg-white/8 p-5 shadow-service">
              <h2 className="type-heading-sm text-white">
                Add Section
              </h2>
              <label className="mt-4 grid gap-2">
                <span className="type-caption font-semibold text-white">
                  Template
                </span>
                <select
                  className="radius-4 min-h-11 border border-white/15 bg-service-ink px-3 text-sm font-semibold text-white outline-none focus:border-white/45"
                  onChange={(event) => {
                    addSection(event.target.value);
                    event.currentTarget.value = "";
                  }}
                  value=""
                >
                  <option value="">Choose a section...</option>
                  {sectionModes.map((mode) => {
                    const options = sectionSwapOptions.filter(
                      (option) => option.mode === mode.name,
                    );

                    if (options.length === 0) {
                      return null;
                    }

                    return (
                      <optgroup key={mode.id} label={mode.name}>
                        {options.map((option) => (
                          <option
                            key={option.component}
                            value={option.component}
                          >
                            {option.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </label>
              <p className="type-caption mt-3 text-white/60">
                Adds after the selected section, or at the bottom.
              </p>
            </div>
          </aside>

          <div className="grid h-full min-h-0 overflow-hidden rounded border border-white/10 bg-white/10 p-2 shadow-service max-lg:h-[78svh]">
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
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[
                      `Option: ${activeSlotLabel}`,
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
                        {activePageLabel} / {activeSlotLabel} page body
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
                        className={`flex size-8 items-center justify-center rounded-sm border border-service-border text-lg leading-none text-service-accent transition-transform ${
                          isRenderedPreviewOpen ? "rotate-180" : ""
                        }`}
                      >
                        v
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
                  <div className="mt-5 grid gap-2 rounded border border-service-border bg-service-surface p-3">
                    <label className="grid gap-2">
                      <span className="type-caption font-semibold text-service-ink">
                        Add Section Template
                      </span>
                      <select
                        className="radius-4 min-h-11 border border-service-border bg-white px-3 text-sm font-semibold text-service-ink"
                        onChange={(event) => {
                          addSection(event.target.value);
                          event.currentTarget.value = "";
                        }}
                        value=""
                      >
                        <option value="">Choose a section to add...</option>
                        {sectionModes.map((mode) => {
                          const options = sectionSwapOptions.filter(
                            (option) => option.mode === mode.name,
                          );

                          if (options.length === 0) {
                            return null;
                          }

                          return (
                            <optgroup key={mode.id} label={mode.name}>
                              {options.map((option) => (
                                <option
                                  key={option.component}
                                  value={option.component}
                                >
                                  {option.name}
                                </option>
                              ))}
                            </optgroup>
                          );
                        })}
                      </select>
                      <span className="type-caption text-service-muted">
                        Adds after the selected section, or at the bottom if
                        nothing is selected.
                      </span>
                    </label>
                  </div>
                  <ol className="mt-5 grid gap-3">
                    {activeStack.map((section, index) => (
                      <li
                        className={cx(
                          "grid grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-4 rounded border border-service-border bg-service-surface p-4 transition-shadow max-md:grid-cols-[2.5rem_minmax(0,1fr)]",
                          section.id === selectedSectionId &&
                            "shadow-[0_0_0_2px_var(--color-service-accent)]",
                          !section.included && "opacity-50",
                        )}
                        key={section.id}
                      >
                        <span className="flex size-10 items-center justify-center rounded bg-white text-sm font-semibold text-service-accent">
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
                          Copy All Layouts
                        </button>
                      </div>
                    </div>
                    <div className="rounded border border-service-border bg-service-surface p-4">
                      <p className="type-caption font-semibold text-service-ink">
                        Use {activePageLabel} / {activeSlotLabel}
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
                  {activePageLabel} / {activeSlotLabel}
                </p>
                <p className="type-caption truncate text-service-muted">
                  {selectedViewport.sizeLabel} preview
                </p>
              </div>
              <div
                aria-label="Preview viewport"
                className="flex max-w-full flex-wrap gap-1 rounded border border-service-border bg-service-surface p-1"
                role="group"
              >
                {viewportOptions.map((option) => {
                  const isActive = option.id === selectedViewport.id;

                  return (
                    <button
                      className={cx(
                        "radius-4 min-h-8 min-w-16 px-3 text-xs font-semibold transition-colors max-sm:min-w-0 max-sm:px-2",
                        isActive
                          ? "bg-service-ink text-white"
                          : "text-service-muted hover:bg-white hover:text-service-accent",
                      )}
                      key={option.id}
                      onClick={() =>
                        updateActiveDesignStyle((settings) => ({
                          ...settings,
                          viewportId: option.id,
                        }))
                      }
                      type="button"
                    >
                      {option.label}
                    </button>
                  );
                })}
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
