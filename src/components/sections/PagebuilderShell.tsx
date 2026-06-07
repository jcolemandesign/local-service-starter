"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PagebuilderRecipe, SectionMode } from "@/content/pagebuilder";

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

const normalSpacingClassName = "pagebuilder-density-normal";
const previewStyle: CSSProperties = {};

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

type PageInstructionInput = {
  designLabel: string;
  excludedSections: WorkingSection[];
  includedSections: WorkingSection[];
  recipe: PagebuilderRecipe;
  selectedViewport: (typeof viewportOptions)[number];
};

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
    component: "HeroBentoSectionV2",
    instruction:
      "Use h1, one primary booking CTA, one services CTA, and three compact trust stats beside a full-height image column.",
    mode: "Hero",
    name: "Split hero image right full height",
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
    component: "ContentPositioningSplitSectionV2",
    instruction:
      "Use as regular mid-page content: one positioning idea, a calm image field, and a clear path.",
    mode: "Narrative",
    name: "General editorial texture",
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
    component: "TrustBarSection",
    instruction:
      "Validate the promise immediately with rating, volume, team, and locality claims.",
    mode: "Proof",
    name: "Trust bar",
  },
  {
    component: "TrustMarqueeSection",
    instruction:
      "Use short repeated claims when there are many small proof points.",
    mode: "Proof",
    name: "Trust marquee",
  },
  {
    component: "TrustLogoGridSection",
    instruction:
      "Use static logos or associations when motion would distract from reading.",
    mode: "Proof",
    name: "Static trust logo grid",
  },
  {
    component: "TestimonialsCarouselSectionV2",
    instruction:
      "Use longer customer stories only if they contain useful service detail.",
    mode: "Proof",
    name: "Customer stories",
  },
  {
    component: "TestimonialsMasonrySectionV2",
    instruction:
      "Use varied quote lengths to create a fuller body of evidence.",
    mode: "Proof",
    name: "Masonry testimonials",
  },
  {
    component: "FAQSectionV2",
    instruction:
      "Include only the questions that affect whether someone contacts you.",
    mode: "Decision",
    name: "FAQ",
  },
  {
    component: "FAQAccordionSectionV2",
    instruction:
      "Handle objections with expandable answers and no vague copy.",
    mode: "Decision",
    name: "FAQ accordion",
  },
  {
    component: "ProcessImageChecklistSectionV2",
    instruction:
      "Turn process uncertainty into clear expectations before contact.",
    mode: "Decision",
    name: "Process image checklist",
  },
  {
    component: "CTAFullscreenSectionV2",
    instruction:
      "Use the strongest conversion treatment for a memorable final booking moment.",
    mode: "Action",
    name: "Fullscreen conversion",
  },
  {
    component: "CTAScrollRevealOfferSectionV2",
    instruction:
      "Use a discovered offer or next-step reveal to transition from trust into action.",
    mode: "Action",
    name: "Scroll reveal offer conversion",
  },
  {
    component: "ContactSectionV2",
    instruction:
      "Close with phone, email, hours, and a simple form or request path.",
    mode: "Utility",
    name: "Contact section",
  },
  {
    component: "FooterSectionV2",
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
    `- Use normal section spacing and the existing project typography and color tokens.`,
    ``,
    `Included section order:`,
    ...includedSections.map(
      (section, index) =>
        `${index + 1}. ${section.component}
   Name: ${section.name}
   Mode: ${section.mode}
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
    `- Baked page route under src/app/ or a WIP Created Pages route.`,
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const iframeDocument = iframe?.contentDocument;

    if (!iframe || !iframeDocument) {
      return;
    }

    const headMarkup = Array.from(
      document.head.querySelectorAll('link[rel="stylesheet"], style'),
    )
      .map((node) => node.outerHTML)
      .join("");

    iframeDocument.open();
    iframeDocument.write(`<!doctype html>
<html>
  <head>
    <base target="_parent" />
    ${headMarkup}
    <style>
      html,
      body,
      #pagebuilder-preview-root {
        min-height: 100%;
        margin: 0;
        background: white;
      }

      body {
        overflow-x: hidden;
      }
    </style>
  </head>
  <body>
    <div id="pagebuilder-preview-root"></div>
  </body>
</html>`);
    iframeDocument.close();

    setPortalRoot(
      iframeDocument.getElementById("pagebuilder-preview-root"),
    );
  }, []);

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
          <span className="truncate text-[0.65rem] font-semibold uppercase tracking-widest text-service-muted">
            {sizeLabel} / {activePageLabel}
          </span>
        </div>
      </div>

      <div className={cx("min-h-0 bg-white", screenClassName)}>
        <iframe
          className="block h-full w-full bg-white"
          ref={iframeRef}
          title={`${sizeLabel} preview`}
        />
        {portalRoot
          ? createPortal(
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
              </div>,
              portalRoot,
            )
          : null}
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
  const [workingStacks, setWorkingStacks] = useState<WorkingSection[][]>(() =>
    recipes.map((recipe) =>
      recipe.sectionStack.map((section, index) => ({
        ...section,
        id: `${recipe.id}-${section.component}-${index}`,
        included: true,
        originalComponent: section.component,
        originalIndex: index,
      })),
    ),
  );
  const [designStyleSettings, setDesignStyleSettings] = useState<
    DesignStyleSettings[]
  >(() =>
    recipes.map((_, index) => ({
      showSectionMarkers: true,
      viewportId: index === 0 ? "main" : "wide",
    })),
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const activeRecipeIndex = Math.max(
    recipes.findIndex((recipe) => recipe.id === activeRecipeId),
    0,
  );
  const activeRecipe = recipes[activeRecipeIndex] ?? recipes[0];
  const activePageLabel = activeRecipe?.name ?? `Page ${activeRecipeIndex + 1}`;
  const activeDesignStyle =
    designStyleSettings[activeRecipeIndex] ??
    designStyleSettings[0] ?? {
      showSectionMarkers: true,
      viewportId: "main",
    };
  const activeStack = workingStacks[activeRecipeIndex] ?? [];
  const selectedSection =
    activeStack.find((section) => section.id === selectedSectionId) ?? null;
  const selectedSwapOptions = selectedSection
    ? sectionSwapOptions.filter((option) => option.mode === selectedSection.mode)
    : [];
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
      const stack = workingStacks[index] ?? [];
      const settings = designStyleSettings[index] ?? designStyleSettings[0];
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

  function updateActiveStack(updater: (stack: WorkingSection[]) => WorkingSection[]) {
    setWorkingStacks((currentStacks) =>
      currentStacks.map((stack, index) =>
        index === activeRecipeIndex ? updater(stack) : stack,
      ),
    );
  }

  function updateActiveDesignStyle(
    updater: (settings: DesignStyleSettings) => DesignStyleSettings,
  ) {
    setDesignStyleSettings((currentSettings) =>
      currentSettings.map((settings, index) =>
        index === activeRecipeIndex ? updater(settings) : settings,
      ),
    );
  }

  function toggleSelectedSection() {
    if (!selectedSection) {
      return;
    }

    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === selectedSection.id
          ? { ...section, included: !section.included }
          : section,
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

  function moveSelectedSection(direction: -1 | 1) {
    if (!selectedSection) {
      return;
    }

    moveSection(selectedSection.id, direction);
  }

  function deleteSection(sectionId: string) {
    updateActiveStack((stack) =>
      stack.filter((section) => section.id !== sectionId),
    );

    if (sectionId === selectedSectionId) {
      setSelectedSectionId(null);
    }
  }

  function swapSelectedSection(component: string) {
    const nextOption = sectionSwapOptions.find(
      (option) => option.component === component,
    );

    if (!selectedSection || !nextOption) {
      return;
    }

    updateActiveStack((stack) =>
      stack.map((section) =>
        section.id === selectedSection.id
          ? {
              ...section,
              component: nextOption.component,
              instruction: nextOption.instruction,
              mode: nextOption.mode,
              name: nextOption.name,
            }
          : section,
      ),
    );
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

  function renderPreviewWindow() {
    return (
      <PagebuilderPreviewWindow
        activePageLabel={activePageLabel}
        contentClassName={selectedViewport.contentClassName}
        frameClassName={selectedViewport.frameClassName}
        previewStyle={previewStyle}
        screenClassName={selectedViewport.screenClassName}
        showSectionMarkers={activeDesignStyle.showSectionMarkers}
        sizeLabel={selectedViewport.sizeLabel}
        spacingClassName={normalSpacingClassName}
      >
        {activeStack
          .filter((section) => section.included)
          .map((section) => {
            const isSelected = section.id === selectedSectionId;

            return (
              <div
                className={cx(
                  "group/pagebuilder-section relative cursor-pointer outline outline-0 outline-offset-0 transition-shadow",
                  isSelected &&
                    "z-10 shadow-[0_0_0_3px_var(--color-service-accent)]",
                )}
                data-pagebuilder-section-id={section.id}
                key={section.id}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setSelectedSectionId(section.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedSectionId(section.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="pagebuilder-section-marker pointer-events-none absolute left-3 top-3 z-30 max-w-[calc(100%-1.5rem)] rounded border border-service-border bg-white/90 px-3 py-2 text-service-ink shadow-service backdrop-blur">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-service-accent">
                    {section.mode}
                  </p>
                  <p className="mt-1 text-xs font-semibold">{section.name}</p>
                </div>
                {previewCatalog[section.component] ??
                  previewSections[activeRecipeIndex]?.[
                    section.originalIndex
                  ] ??
                  null}
              </div>
            );
          })}
      </PagebuilderPreviewWindow>
    );
  }

  return (
    <section className="h-svh overflow-hidden bg-service-surface text-service-ink max-lg:h-auto max-lg:min-h-svh max-lg:overflow-visible">
      <div className="h-full w-full px-4 py-4 max-md:px-3">
        <div className="grid h-full min-h-0 grid-cols-[22rem_minmax(0,1fr)] items-stretch gap-5 max-lg:h-auto max-lg:grid-cols-1">
          <aside className="grid h-full min-h-0 content-start gap-4 overflow-y-auto overscroll-contain pr-1 max-lg:h-auto max-lg:overflow-visible max-lg:pr-0">
            <div className="radius-medium order-1 border border-service-border bg-white p-5 shadow-service">
              <p className="type-label text-service-accent">Pagebuilder</p>
              <h1 className="type-heading-lg mt-eyebrow-heading-md text-service-ink">
                Homepage section builder
              </h1>
              <p className="type-text-sm measure-caption wrap-pretty mt-heading-body-sm text-service-muted">
                Choose, swap, reorder, and preview homepage sections while the
                implementation brief updates with the live stack.
              </p>
            </div>

            <div className="radius-medium order-3 border border-service-border bg-white p-5 shadow-service">
              <h2 className="type-heading-sm text-service-ink">
                Preview Controls
              </h2>
              <div className="mt-4 grid gap-4">
                <div className="grid gap-2">
                  <span className="type-caption font-semibold text-service-ink">
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
                              ? "border-service-ink bg-service-ink text-white"
                              : "border-service-border bg-service-surface text-service-ink hover:border-service-accent hover:text-service-accent",
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
                  <span className="type-caption text-service-muted">
                    Changes the rendered preview frame width.
                  </span>
                </div>

                <label className="flex items-start gap-3 rounded border border-service-border bg-service-surface p-3">
                  <input
                    checked={activeDesignStyle.showSectionMarkers}
                    className="mt-1 size-4 accent-service-accent"
                    onChange={(event) =>
                      updateActiveDesignStyle((settings) => ({
                        ...settings,
                        showSectionMarkers: event.target.checked,
                      }))
                    }
                    type="checkbox"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-service-ink">
                      Show section markers
                    </span>
                    <span className="type-caption mt-1 block text-service-muted">
                      Labels each rendered section in the preview.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="radius-medium sticky top-0 z-20 order-2 border border-service-border bg-white p-5 shadow-service max-lg:static">
              <h2 className="type-heading-sm text-service-ink">
                Selected Section
              </h2>
              {selectedSection ? (
                <div className="mt-4 grid gap-4">
                  <div className="rounded border border-service-border bg-service-surface p-3">
                    <p className="text-sm font-semibold text-service-ink">
                      {selectedSection.name}
                    </p>
                    <p className="type-caption mt-1 text-service-muted">
                      {selectedSection.component}
                    </p>
                          <span className="mt-3 inline-flex rounded-full border border-service-border bg-white px-3 py-1 text-xs font-semibold text-service-muted">
                            {selectedSection.mode}
                          </span>
                          {selectedSection.component !==
                            selectedSection.originalComponent && (
                            <span className="ml-2 mt-3 inline-flex rounded-full border border-service-accent bg-white px-3 py-1 text-xs font-semibold text-service-accent">
                              swapped
                            </span>
                          )}
                        </div>

                  <label className="grid gap-2">
                    <span className="type-caption font-semibold text-service-ink">
                      Swap Within Mode
                    </span>
                    <select
                      className="radius-4 min-h-11 border border-service-border bg-service-surface px-3 text-sm font-semibold text-service-ink"
                      onChange={(event) =>
                        swapSelectedSection(event.target.value)
                      }
                      value={selectedSection.component}
                    >
                      {selectedSwapOptions.map((option) => (
                        <option
                          key={option.component}
                          value={option.component}
                        >
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <span className="type-caption text-service-muted">
                      Keeps the section role while changing the rendered pattern.
                    </span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="radius-4 min-h-10 border border-service-border bg-service-surface px-3 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                      onClick={() => moveSelectedSection(-1)}
                      type="button"
                    >
                      Move Up
                    </button>
                    <button
                      className="radius-4 min-h-10 border border-service-border bg-service-surface px-3 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                      onClick={() => moveSelectedSection(1)}
                      type="button"
                    >
                      Move Down
                    </button>
                  </div>

                  <button
                    className={cx(
                      "radius-4 min-h-11 border px-3 text-sm font-semibold transition-colors",
                      selectedSection.included
                        ? "border-service-border bg-service-surface text-service-ink hover:border-service-accent hover:text-service-accent"
                        : "border-service-accent bg-service-accent text-white",
                    )}
                    onClick={toggleSelectedSection}
                    type="button"
                  >
                    {selectedSection.included
                      ? "Exclude From Preview"
                      : "Include In Preview"}
                  </button>
                </div>
              ) : (
                <p className="type-caption mt-4 rounded border border-service-border bg-service-surface p-3 text-service-muted">
                  Click a section in the rendered preview to inspect and adjust
                  it.
                </p>
              )}
            </div>
          </aside>

          <div className="grid h-full min-h-0 content-start gap-4 overflow-y-auto overscroll-contain pr-1 max-lg:h-auto max-lg:overflow-visible max-lg:pr-0">
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
                      <p className="type-caption measure-copy-wide wrap-pretty mt-1 text-service-muted">
                        {activeRecipe.positioning}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[
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

                <section className="radius-medium border border-service-border bg-white p-5 shadow-service">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="type-label text-service-accent">
                        Rendered Preview
                      </p>
                      <h3 className="type-heading-sm mt-2 text-service-ink">
                        {activePageLabel} page body
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded border border-service-border bg-service-surface p-4 max-md:grid-cols-1">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-service-ink">
                        {selectedViewport.sizeLabel}
                      </p>
                      <p className="type-caption mt-1 text-service-muted">
                        Click rendered sections to select them, then swap,
                        reorder, or toggle them from the controls.
                      </p>
                    </div>
                    <button
                      className="radius-4 min-h-11 border border-service-ink bg-service-ink px-4 text-sm font-semibold text-white transition-colors hover:border-service-accent hover:bg-service-accent"
                      onClick={() => setIsPreviewOpen(true)}
                      type="button"
                    >
                      Focus Preview
                    </button>
                  </div>

                  <div className="mt-4 h-[72svh] min-h-[36rem] overflow-hidden rounded border border-service-border bg-service-surface p-3 max-md:h-[68svh] max-md:min-h-[28rem] max-sm:min-h-[24rem]">
                    <div className="grid h-full min-h-0 place-items-center overflow-hidden">
                      {renderPreviewWindow()}
                    </div>
                  </div>
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
                          <p className="type-text-sm measure-copy-wide wrap-pretty mt-3 text-service-muted">
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
