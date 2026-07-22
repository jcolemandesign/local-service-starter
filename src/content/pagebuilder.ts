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
  colorRecipe?: import("@/content/section-color-recipes").SectionColorRecipe;
  cardFill?: import("@/content/section-color-recipes").SectionCardFill;
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
    id: "section-header",
    name: "Section Header",
    intent: "Reusable section introductions that separate page modules without becoming page heroes.",
    rules: [
      "Use these before card grids, decisions, FAQs, or utility sections that need a clear lead-in.",
      "Keep the copy short enough to introduce the next section without resetting the page hierarchy.",
      "Avoid using section headers as the page h1 unless the page intentionally has no separate hero.",
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
    id: "images",
    name: "Images",
    intent: "Visual proof, project texture, and browseable photo moments.",
    rules: [
      "Use real project, crew, place, or service images when the visual evidence matters.",
      "Keep captions useful and concrete instead of decorative.",
      "Choose image-led sections when photos should carry the scan, not just support copy.",
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
      "Use pricing notes, guarantees, comparisons, or process clarity.",
      "Answer the concern in plain language before adding detail.",
      "Keep the next action available after the concern is resolved.",
    ],
  },
  {
    id: "utility",
    name: "Utility",
    intent: "Practical information and conversion support.",
    rules: [
      "Use FAQs, forms, contact details, hours, service areas, or maps.",
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
    name: "Home",
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
        name: "Compact section header",
        component: "SectionHeaderCompactSectionV3",
        mode: "Section Header",
        instruction:
          "Introduce the service card grid with a concise eyebrow, heading, and body before the scan section begins.",
      },
      {
        name: "Priority service cards",
        component: "ServicesThreeCardsRightSectionV3",
        mode: "Scan",
        instruction:
          "Show 3-5 priority services the business wants listed first before the full all-services section.",
      },
      {
        name: "FAQ",
        component: "FAQSectionV3",
        mode: "Utility",
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
    name: "About",
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
        mode: "Utility",
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
    name: "Services Overview",
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
        name: "Fullscreen image hero",
        component: "HeroFullscreenSectionV2",
        mode: "Hero",
        instruction:
          "Use a strong image, calm h1, review proof, and one visible request path.",
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
    name: "Individual Service",
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
        mode: "Utility",
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
  {
    id: "service-area",
    name: "Service Area",
    positioning:
      "Service area page for confirming coverage, reinforcing local relevance, and routing visitors into a request path.",
    styleRules: [
      "Keep area confirmation and contact paths close together.",
      "Use local proof without turning the page into thin location SEO copy.",
      "Make service boundaries clear without overpromising urgent availability.",
    ],
    sectionStack: [
      {
        name: "Primary navigation",
        component: "NavPrimarySectionV2",
        mode: "Navigation",
        instruction:
          "Use the standard nav so local coverage visitors can still reach services, phone, and contact paths quickly.",
      },
      {
        name: "Split content and full image",
        component: "HeroSplitFullHeightSectionV3",
        mode: "Hero",
        instruction:
          "Lead with the service area promise, primary towns, one request CTA, and one service CTA.",
      },
      {
        name: "Service area zip lookup",
        component: "ServiceAreaZipLookupSectionV3",
        mode: "Utility",
        instruction:
          "List priority service areas and keep the map visual as an FPO coverage placeholder.",
      },
      {
        name: "Compact section header",
        component: "SectionHeaderCompactSectionV3",
        mode: "Section Header",
        instruction:
          "Introduce the coverage service grid without relying on the grid cards to carry their own heading.",
      },
      {
        name: "Priority service cards",
        component: "ServicesThreeCardsRightSectionV3",
        mode: "Scan",
        instruction:
          "Show 3-5 priority services available in this coverage area before the full all-services section.",
      },
      {
        name: "FAQ",
        component: "FAQSectionV3",
        mode: "Utility",
        instruction:
          "Answer coverage, timing, urgent availability, and nearby-town questions without guaranteeing service everywhere.",
      },
      {
        name: "Contact section",
        component: "ContactSectionV3",
        mode: "Utility",
        instruction:
          "Close with phone, form, and a reminder that urgent issues should call directly.",
      },
    ],
  },
  {
    id: "service-plan",
    name: "Service Plan",
    positioning:
      "Service plan page for explaining memberships, maintenance plans, recurring care, and plan-fit decisions.",
    styleRules: [
      "Make inclusions, exclusions, and next steps easy to compare.",
      "Use proof and FAQ to reduce skepticism around recurring plans.",
      "Avoid exact pricing or terms unless they are confirmed.",
    ],
    sectionStack: [
      {
        name: "Primary navigation",
        component: "NavPrimarySectionV2",
        mode: "Navigation",
        instruction:
          "Use predictable service, plan, and contact paths for maintenance-plan shoppers.",
      },
      {
        name: "Content top image bottom",
        component: "HeroContentTopImageBottomSectionV2",
        mode: "Hero",
        instruction:
          "Introduce the plan promise, who it is for, and one clear request path without inventing terms.",
      },
      {
        name: "Process image checklist",
        component: "ProcessImageChecklistSectionV3",
        mode: "Decision",
        instruction:
          "Show what the plan may include, what needs confirmation, and how the visit cadence works.",
      },
      {
        name: "Cards features 4 up split",
        component: "FeatureAsymmetricCardsSectionV3",
        mode: "Narrative",
        instruction:
          "Explain plan benefits such as fewer surprises, seasonal reminders, priority scheduling, and clear records.",
      },
      {
        name: "FAQ accordion",
        component: "FAQAccordionSectionV3",
        mode: "Utility",
        instruction:
          "Handle questions about pricing, cancellation, inclusions, emergency priority, and plan fit.",
      },
      {
        name: "CTA",
        component: "CTASectionV3",
        mode: "Action",
        instruction:
          "Move visitors toward asking about the service plan or scheduling maintenance.",
      },
    ],
  },
  {
    id: "specials-offers",
    name: "Specials / Offers",
    positioning:
      "Offers page for current specials, seasonal promotions, and limited-time conversion moments.",
    styleRules: [
      "Keep eligibility and terms visible.",
      "Do not imply expired or unverified offers are active.",
      "Use offer urgency carefully and without pressure-heavy copy.",
    ],
    sectionStack: [
      {
        name: "Primary navigation",
        component: "NavPrimarySectionV2",
        mode: "Navigation",
        instruction:
          "Keep services, contact, and phone available while visitors inspect the offer.",
      },
      {
        name: "Fullscreen image hero",
        component: "HeroFullscreenSectionV2",
        mode: "Hero",
        instruction:
          "Lead with the offer category, eligibility note, and one claim path without unsupported savings details.",
      },
      {
        name: "Scroll reveal offer conversion",
        component: "CTAScrollRevealOfferSectionV3",
        mode: "Action",
        instruction:
          "Feature the current offer, terms, and request action in a high-clarity conversion treatment.",
      },
      {
        name: "FAQ accordion",
        component: "FAQAccordionSectionV3",
        mode: "Utility",
        instruction:
          "Answer offer eligibility, expiration, service fit, and financing/payment questions.",
      },
      {
        name: "Contact section",
        component: "ContactSectionV3",
        mode: "Utility",
        instruction:
          "Close with a simple request form and phone path for offer questions.",
      },
    ],
  },
  {
    id: "financing",
    name: "Financing",
    positioning:
      "Financing page for replacement or larger-ticket service decisions where visitors need cautious terms and next steps.",
    styleRules: [
      "Avoid exact terms, rates, or approval claims unless verified.",
      "Pair financing copy with replacement and estimate context.",
      "Keep disclosures and qualification caveats visible.",
    ],
    sectionStack: [
      {
        name: "Center logo navigation",
        component: "NavCenterLogoSectionV2",
        mode: "Navigation",
        instruction:
          "Use a calm nav for a high-consideration decision page with easy contact access.",
      },
      {
        name: "Split content and full image",
        component: "HeroSplitFullHeightSectionV3",
        mode: "Hero",
        instruction:
          "Explain financing availability cautiously with one estimate CTA and one services/replacement path.",
      },
      {
        name: "Process steps",
        component: "ProcessStepsSectionV3",
        mode: "Decision",
        instruction:
          "Show the basic path from estimate to application/approval to installation without inventing provider details.",
      },
      {
        name: "FAQ accordion",
        component: "FAQAccordionSectionV3",
        mode: "Utility",
        instruction:
          "Answer eligibility, terms, credit, payment timing, and what must be confirmed before final copy.",
      },
      {
        name: "CTA",
        component: "CTASectionV3",
        mode: "Action",
        instruction:
          "Prompt visitors to request a replacement estimate or ask about financing options.",
      },
    ],
  },
  {
    id: "contact",
    name: "Contact",
    positioning:
      "Contact page for turning service intent into a clear request, phone call, or quote path.",
    styleRules: [
      "Keep phone, form, hours, and service area visible.",
      "Separate urgent call behavior from non-urgent request behavior.",
      "Avoid adding extra content that distracts from contact completion.",
    ],
    sectionStack: [
      {
        name: "Primary navigation",
        component: "NavPrimarySectionV2",
        mode: "Navigation",
        instruction:
          "Use the standard nav with phone and request action visible.",
      },
      {
        name: "Content top image bottom",
        component: "HeroContentTopImageBottomSectionV2",
        mode: "Hero",
        instruction:
          "State how to contact the business, when to call, and what happens after the form is submitted.",
      },
      {
        name: "Contact section",
        component: "ContactSectionV3",
        mode: "Utility",
        instruction:
          "Show phone, hours, email if approved, service area, and a concise request form.",
      },
      {
        name: "Service area zip lookup",
        component: "ServiceAreaZipLookupSectionV3",
        mode: "Utility",
        instruction:
          "Let visitors confirm whether they are in the service area before submitting.",
      },
      {
        name: "FAQ",
        component: "FAQSectionV3",
        mode: "Utility",
        instruction:
          "Answer response timing, urgent issues, service area, and what information to include.",
      },
    ],
  },
  {
    id: "blog-index",
    name: "Blog Index",
    positioning:
      "Blog index page for organizing educational posts, seasonal advice, and service guidance.",
    styleRules: [
      "Keep browsing scannable and category-led.",
      "Use content cards without overpowering service conversion paths.",
      "Route readers back to service and contact pages when useful.",
    ],
    sectionStack: [
      {
        name: "Primary navigation",
        component: "NavPrimarySectionV2",
        mode: "Navigation",
        instruction:
          "Use standard navigation so education content still connects to service paths.",
      },
      {
        name: "Fullscreen image hero",
        component: "HeroFullscreenSectionV2",
        mode: "Hero",
        instruction:
          "Introduce the resource center with a clear opening message and request path.",
      },
      {
        name: "Services card carousel",
        component: "ContentHorizontalCardCarouselSectionV2",
        mode: "Scan",
        instruction:
          "Show featured posts, categories, or seasonal topics as browseable cards.",
      },
      {
        name: "Compact section header",
        component: "SectionHeaderCompactSectionV3",
        mode: "Section Header",
        instruction:
          "Introduce the related categories or service paths before the card grid.",
      },
      {
        name: "Priority service cards",
        component: "ServicesThreeCardsRightSectionV3",
        mode: "Scan",
        instruction:
          "Connect 3-5 priority article or service paths before routing into the broader service set.",
      },
      {
        name: "CTA",
        component: "CTASectionV3",
        mode: "Action",
        instruction:
          "Invite visitors who need help now to request service instead of continuing to browse.",
      },
    ],
  },
  {
    id: "blog-post",
    name: "Blog Post",
    positioning:
      "Individual blog page for one educational article with useful service context and a soft conversion path.",
    styleRules: [
      "Prioritize readable article pacing.",
      "Avoid making the article feel like a sales page.",
      "Place related services and contact paths after the useful answer.",
    ],
    sectionStack: [
      {
        name: "Primary navigation",
        component: "NavPrimarySectionV2",
        mode: "Navigation",
        instruction:
          "Keep service and contact navigation visible above the article.",
      },
      {
        name: "Content top image bottom",
        component: "HeroContentTopImageBottomSectionV2",
        mode: "Hero",
        instruction:
          "Use the article title as the h1 with a concise summary and supporting image.",
      },
      {
        name: "Sticky ideas content",
        component: "ContentStickyIdeasSectionV2",
        mode: "Narrative",
        instruction:
          "Hold the core article takeaways beside readable explanatory copy.",
      },
      {
        name: "FAQ accordion",
        component: "FAQAccordionSectionV3",
        mode: "Utility",
        instruction:
          "Answer related questions that naturally follow the article topic.",
      },
      {
        name: "CTA",
        component: "CTASectionV3",
        mode: "Action",
        instruction:
          "Offer a soft next step for readers who realize they need service help.",
      },
    ],
  },
  {
    id: "product-listing",
    name: "Product Listing",
    positioning:
      "Product listing page for equipment, systems, or packaged options that need comparison before contact.",
    styleRules: [
      "Keep product claims factual and easy to compare.",
      "Use cards for options and FAQ for fit questions.",
      "Avoid exact specs, rebates, or warranty claims unless verified.",
    ],
    sectionStack: [
      {
        name: "Primary navigation",
        component: "NavPrimarySectionV2",
        mode: "Navigation",
        instruction:
          "Keep service, financing, and contact paths visible while visitors compare options.",
      },
      {
        name: "Fullscreen image hero",
        component: "HeroFullscreenSectionV2",
        mode: "Hero",
        instruction:
          "Frame the product category, comparison need, and request-estimate action.",
      },
      {
        name: "Services bento cards",
        component: "ServicesBentoCardsSectionV2",
        mode: "Scan",
        instruction:
          "Use 6-9 bento-style service or product cards. The fixed layout rhythm is big small small, small small big, then big small small.",
      },
      {
        name: "Process steps",
        component: "ProcessStepsSectionV3",
        mode: "Decision",
        instruction:
          "Explain how visitors move from product interest to recommendation, estimate, and installation.",
      },
      {
        name: "FAQ accordion",
        component: "FAQAccordionSectionV3",
        mode: "Utility",
        instruction:
          "Answer sizing, compatibility, financing, warranty, and estimate questions cautiously.",
      },
      {
        name: "Contact section",
        component: "ContactSectionV3",
        mode: "Utility",
        instruction:
          "Close with a request path for help choosing the right product or system.",
      },
    ],
  },
  {
    id: "thank-you",
    name: "Thank You",
    positioning:
      "Post-submission confirmation page for acknowledging the request, setting follow-up expectations, and giving visitors clear exit paths.",
    styleRules: [
      "Keep the confirmation message immediate and unambiguous.",
      "Explain what happens next without promising an appointment or response time that has not been confirmed.",
      "Keep the page short and avoid introducing another conversion form after submission.",
    ],
    sectionStack: [
      {
        name: "Primary navigation",
        component: "NavPrimarySectionV2",
        mode: "Navigation",
        instruction:
          "Use the standard navigation so visitors can return to core site paths after submitting their request.",
      },
      {
        name: "Thank you confirmation",
        component: "ThankYouConfirmationSectionV3",
        mode: "Utility",
        instruction:
          "Confirm receipt, explain the follow-up sequence, and provide clear links back home or into services.",
      },
      {
        name: "Condensed footer",
        component: "FooterCompactSectionV3",
        mode: "Utility",
        instruction:
          "Close with only the essential navigation, contact, social, and legal links.",
      },
    ],
  },
];
