export type SectionMode = {
  id: string;
  name: string;
  intent: string;
  rules: string[];
};

export type PagebuilderRecipeSection = {
  name: string;
  component: string;
  mode: string;
  instruction: string;
  ratio?: string;
  variant?: string;
};

export type PagebuilderRecipe = {
  id: string;
  name: string;
  positioning: string;
  styleRules: string[];
  sectionStack: PagebuilderRecipeSection[];
};

export const sectionModes: SectionMode[] = [
  {
    id: "navigation",
    name: "Navigation",
    intent: "Orientation, service discovery, and immediate contact access.",
    rules: [
      "Choose the nav pattern before the hero so the first viewport is composed as one system.",
      "Keep service, service area, phone, and primary action paths predictable.",
      "Use floating or centered nav only when the hero composition has room for it.",
    ],
  },
  {
    id: "hero",
    name: "Hero",
    intent: "Primary promise, first action, and first proof.",
    rules: [
      "Use the page h1 here.",
      "Keep one dominant CTA and one supporting path.",
      "Place proof close to the promise, not after several sections.",
    ],
  },
  {
    id: "scan",
    name: "Scan",
    intent: "Fast comprehension through cards, lists, and short labels.",
    rules: [
      "Use repeated cards or rows with parallel structure.",
      "Lead each item with a concrete customer-facing label.",
      "Keep descriptions short enough to compare at a glance.",
    ],
  },
  {
    id: "narrative",
    name: "Narrative",
    intent: "Editorial pacing for trust, process, and positioning.",
    rules: [
      "Use comfortable copy measures and visible paragraph rhythm.",
      "Let one idea lead the section instead of crowding in cards.",
      "Pair richer copy with a quiet image or texture when useful.",
    ],
  },
  {
    id: "proof",
    name: "Proof",
    intent: "Evidence that reduces perceived risk.",
    rules: [
      "Use testimonials, stats, ratings, logos, or field notes.",
      "Make the proof specific to the service context.",
      "Avoid stacking proof so densely that it reads as filler.",
    ],
  },
  {
    id: "decision",
    name: "Decision",
    intent: "Objection handling before the visitor converts.",
    rules: [
      "Use FAQs, pricing notes, guarantees, or process clarity.",
      "Answer the concern in plain language before adding detail.",
      "Keep the next action available after the concern is resolved.",
    ],
  },
  {
    id: "utility",
    name: "Utility",
    intent: "Practical information and conversion support.",
    rules: [
      "Use forms, contact details, hours, service areas, or maps.",
      "Keep interaction targets obvious and reachable.",
      "Do not bury phone, address, or scheduling details in prose.",
    ],
  },
  {
    id: "action",
    name: "Action",
    intent: "Conversion emphasis and final next-step momentum.",
    rules: [
      "Use special button treatments inside real conversion sections when the action needs extra hierarchy.",
      "Keep the treatment tied to a real conversion moment, not decoration.",
      "Repeat special buttons sparingly so they stay meaningful.",
    ],
  },
];

export const pagebuilderRecipes: PagebuilderRecipe[] = [
  {
    id: "classic-service",
    name: "homepage",
    positioning: "Balanced homepage for a broad local service business.",
    styleRules: [
      "Use the corresponding Style Guide typography profile for type decisions.",
      "Alternate white and service-surface sections.",
      "Use one dark or accent conversion moment near the end.",
    ],
    sectionStack: [
      {
        name: "Primary navigation",
        component: "NavPrimarySectionV2",
        mode: "Navigation",
        instruction:
          "Use the standard nav when the template needs the clearest service, area, phone, and booking paths.",
      },
      {
        name: "Split content and full image",
        component: "HeroSplitFullHeightSectionV3",
        mode: "Hero",
        instruction:
          "Use h1, one primary booking CTA, one services CTA, and three compact trust stats beside a full-bleed image column.",
      },
      {
        name: "Trust bar",
        component: "TrustBarSectionV3",
        mode: "Proof",
        instruction:
          "Validate the promise immediately with rating, volume, team, and local ownership claims.",
      },
      {
        name: "Services grid",
        component: "ServicesThreeCardsRightSectionV3",
        mode: "Scan",
        instruction:
          "Show three to six top-level services with consistent title and body length.",
      },
      {
        name: "FAQ",
        component: "FAQSectionV3",
        mode: "Decision",
        instruction:
          "Answer estimates, timing, service area, and maintenance questions.",
      },
      {
        name: "Contact section",
        component: "ContactSectionV3",
        mode: "Utility",
        instruction:
          "Close with phone, email, hours, and a simple form or request path.",
      },
    ],
  },
  {
    id: "conversion-heavy",
    name: "about",
    positioning:
      "About page for explaining trust, process, credibility, and the business story without losing clear contact paths.",
    styleRules: [
      "Use compact-to-normal spacing so the first two viewports stay dense.",
      "Repeat the primary CTA after major decision sections.",
      "Keep proof factual and close to action blocks.",
    ],
    sectionStack: [
      {
        name: "Center logo navigation",
        component: "NavCenterLogoSectionV2",
        mode: "Navigation",
        instruction:
          "Use the centered logo nav when the page needs a simple brand anchor with service links and direct contact access.",
      },
      {
        name: "Centered with left right floaters",
        component: "HeroCenteredFloatersSectionV2",
        mode: "Hero",
        instruction:
          "Use the centered message for urgency while floaters carry immediate proof, service cues, or conversion nudges.",
      },
      {
        name: "Trust bar",
        component: "TrustBarSectionV3",
        mode: "Proof",
        instruction:
          "Use four short claims that validate speed, safety, rating, and locality.",
      },
      {
        name: "Scroll service cards",
        component: "ServicesScrollCardsSectionV2",
        mode: "Scan",
        instruction:
          "Surface urgent service paths quickly and let visitors scan the most relevant offer without leaving the page.",
      },
      {
        name: "Sticky card stream content",
        component: "ContentStickyCardStreamSectionV2",
        mode: "Narrative",
        instruction:
          "Use this as useful content that keeps the promise fixed while response, diagnosis, options, and follow-up details move through.",
      },
      {
        name: "FAQ accordion",
        component: "FAQAccordionSectionV3",
        mode: "Decision",
        instruction:
          "Handle urgent objections with expandable answers and no vague copy.",
      },
      {
        name: "Contact section",
        component: "ContactSectionV3",
        mode: "Utility",
        instruction:
          "Show phone, email, hours, and form in a direct conversion area with a stronger primary button if urgency needs it.",
      },
    ],
  },
  {
    id: "editorial-local",
    name: "services",
    positioning:
      "Services overview page for helping visitors compare core offers, understand fit, and move toward the right next step.",
    styleRules: [
      "Use an expressive heading profile with restrained body copy.",
      "Let narrative sections breathe more than card sections.",
      "Use image texture to support credibility, not decoration alone.",
    ],
    sectionStack: [
      {
        name: "Primary navigation",
        component: "NavPrimarySectionV2",
        mode: "Navigation",
        instruction:
          "Use the standard nav so the slower editorial page still feels easy to operate.",
      },
      {
        name: "Grid mosaic hero",
        component: "HeroGridMosaicSectionV2",
        mode: "Hero",
        instruction:
          "Use the mosaic to combine a clear h1, trust proof, service paths, and supporting visuals in one richer first view.",
      },
      {
        name: "Reveal paragraph",
        component: "ContentRevealParagraphSectionV2",
        mode: "Narrative",
        instruction:
          "Use a short editorial thesis that frames why the business is different.",
      },
      {
        name: "Sticky ideas content",
        component: "ContentStickyIdeasSectionV2",
        mode: "Narrative",
        instruction:
          "Keep the core ideas visible while longer copy earns trust.",
      },
      {
        name: "General editorial texture",
        component: "ContentAboutCompanySectionV2",
        mode: "Narrative",
        instruction:
          "Use this for regular about content with enough visual structure to feel useful instead of generic.",
      },
      {
        name: "Static trust logo grid",
        component: "TrustLogoGridSectionV3",
        mode: "Proof",
        instruction:
          "Use static logos or associations when motion would distract from reading.",
      },
      {
        name: "Masonry testimonials",
        component: "TestimonialsMasonrySectionV3",
        mode: "Proof",
        instruction:
          "Use varied quote lengths to create a fuller body of evidence.",
      },
      {
        name: "Scroll reveal offer conversion",
        component: "CTAScrollRevealOfferSectionV3",
        mode: "Action",
        instruction:
          "Use a discovered offer or next-step reveal to transition from editorial trust into action.",
      },
    ],
  },
  {
    id: "compact-utility",
    name: "individual service page",
    positioning:
      "Individual service page for making one offer easy to understand, trust, and act on.",
    styleRules: [
      "Use the corresponding Style Guide typography profile and normal spacing.",
      "Avoid extra editorial sections unless the service needs explanation.",
      "Keep each section useful on its own.",
    ],
    sectionStack: [
      {
        name: "Floating bento navigation",
        component: "NavFloatingBentoSectionV2",
        mode: "Navigation",
        instruction:
          "Use this nav when the compact page still needs an expressive but contained first viewport.",
      },
      {
        name: "Content top image bottom",
        component: "HeroContentTopImageBottomSectionV2",
        mode: "Hero",
        instruction:
          "Lead with direct copy first, then use the image below to keep the page useful and quick to understand.",
      },
      {
        name: "Trust marquee",
        component: "TrustMarqueeSectionV3",
        mode: "Proof",
        instruction:
          "Use short repeated claims when there are many small proof points.",
      },
      {
        name: "Scroll service cards",
        component: "ServicesScrollCardsSectionV2",
        mode: "Scan",
        instruction:
          "Use a compact service rail when there are more service paths than a small grid can handle gracefully.",
      },
      {
        name: "Rule header content",
        component: "ContentRuleHeaderSectionV2",
        mode: "Narrative",
        instruction:
          "Use this as a lightweight editorial texture to introduce the next practical idea without adding a heavy section.",
      },
      {
        name: "FAQ",
        component: "FAQSectionV3",
        mode: "Decision",
        instruction:
          "Include only the questions that affect whether someone contacts you.",
      },
      {
        name: "Footer",
        component: "FooterSectionV3",
        mode: "Utility",
        instruction:
          "End with service links, areas, contact details, and legal links.",
      },
    ],
  },
];
