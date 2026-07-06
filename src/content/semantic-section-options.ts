export type SemanticSectionLabel =
  | "Navigation"
  | "Hero"
  | "Scan"
  | "Narrative"
  | "Proof"
  | "Decision"
  | "Offer"
  | "Action"
  | "Utility"
  | "Footer";

export type SemanticSectionOption = {
  component: string;
  instruction: string;
  mode: SemanticSectionLabel;
  name: string;
};

export const semanticSectionLabels: SemanticSectionLabel[] = [
  "Navigation",
  "Hero",
  "Scan",
  "Narrative",
  "Proof",
  "Decision",
  "Offer",
  "Action",
  "Utility",
  "Footer",
];

export const semanticSectionOptions: SemanticSectionOption[] = [
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
    instruction: "Show top-level services with consistent title and body length.",
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
    component: "ContentHorizontalCardCarouselSectionV2",
    instruction:
      "Use a horizontal card carousel when scan content needs a compact browseable sequence.",
    mode: "Scan",
    name: "Horizontal card carousel",
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
    instruction: "Keep core ideas visible while longer copy earns trust.",
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
    component: "TrustMarqueeSectionV3",
    instruction: "Use short repeated claims when there are many small proof points.",
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
    component: "TrustLogoGridSection",
    instruction:
      "Use the legacy trust logo grid only when an older static proof treatment is needed.",
    mode: "Proof",
    name: "Legacy trust logo grid",
  },
  {
    component: "TrustLogoGridSectionV3",
    instruction: "Use static logos or associations when motion would distract from reading.",
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
    instruction: "Use longer customer stories only if they contain useful service detail.",
    mode: "Proof",
    name: "Customer stories",
  },
  {
    component: "TestimonialsMasonrySectionV3",
    instruction: "Use varied quote lengths to create a fuller body of evidence.",
    mode: "Proof",
    name: "Masonry testimonials",
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
    instruction: "Include only the questions that affect whether someone contacts you.",
    mode: "Decision",
    name: "FAQ",
  },
  {
    component: "FAQAccordionSectionV3",
    instruction: "Handle objections with expandable answers and no vague copy.",
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
    component: "CTAScrollRevealOfferSectionV3",
    instruction:
      "Use a discovered offer or next-step reveal to transition from trust into action.",
    mode: "Offer",
    name: "Scroll reveal offer conversion",
  },
  {
    component: "TrustMarqueeSection",
    instruction:
      "Use a headline with a scrolling banner when proof points should move beside a stronger editorial claim.",
    mode: "Action",
    name: "Headline with Scrolling Banner",
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
    instruction: "End with service links, areas, contact details, and legal links.",
    mode: "Footer",
    name: "Footer",
  },
];
