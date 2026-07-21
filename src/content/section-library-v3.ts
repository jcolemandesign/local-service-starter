import { thankYouPageContent } from "@/content/thank-you";

export const sectionLibraryV3Content = {
  hero: {
    eyebrow: "Local service starter",
    title: "Reliable home services built around your schedule.",
    body: "A polished hero pattern for local service companies, with a clear value proposition, supporting proof, and two focused calls to action.",
    primaryAction: "Request service",
    secondaryAction: "View services",
    stats: ["Same-week visits", "Licensed pros", "Clear estimates"],
  },
  heroFullscreen: {
    eyebrow: "Same-week local service",
    title: "Home repairs handled with calm, capable follow-through.",
    body: "A full-bleed hero pattern for service brands that need a strong first impression, a clear request path, and immediate trust proof.",
    primaryAction: "Request service",
    secondaryAction: "View services",
    review: {
      rating: "4.9",
      label: "Average rating from local customers",
      detail: "Based on verified service visits across residential repairs, installations, and maintenance plans.",
    },
    trustSignals: [
      {
        value: "2,400+",
        label: "Completed visits",
      },
      {
        value: "Same-week",
        label: "Scheduling",
      },
    ],
  },
  heroCompact: {
    align: "center" as const,
    eyebrow: "Service area",
    headingSize: "display-lg" as const,
    title: "Straightforward local service, organized for quick decisions.",
    body: "A compact page header for secondary pages that need a clear title, short descriptor, and no extra visual system.",
    primaryAction: "Request service",
    secondaryAction: "View services",
    secondaryActionHref: "#services",
  },
  heroServices: {
    eyebrow: "Heating and cooling services",
    title: "Service options for the system you have.",
    body: "Start with the service path that best matches the current problem, planned upgrade, or ongoing care your equipment needs.",
    imageAlt: "Local service team at work",
    imageSrc: "/images/fpo-image.svg",
    cards: [
      { title: "System Replacement", body: "Plan a system upgrade around the home and equipment." },
      { title: "HVAC Repair", body: "Diagnose the current issue and review practical repair options." },
      { title: "Heat Pump Service", body: "Support heat pump repair, care, or replacement." },
      { title: "Maintenance", body: "Keep seasonal service and system care on schedule." },
      { title: "AC Repair", body: "Address cooling problems and restore dependable operation." },
      { title: "Heating Repair", body: "Resolve heating concerns with a clear service path." },
      { title: "Emergency HVAC", body: "Discuss urgent needs and current service availability." },
    ],
  },
  sectionHeaderCompact: {
    align: "center" as const,
    eyebrow: "Services",
    headingSize: "heading-xl" as const,
    title: "A compact section header for introducing the next page module.",
    body: "A no-min-height section header based on the compact page hero rhythm, built to sit directly above reusable content modules.",
  },
  sectionHeaderLarge: {
    align: "center" as const,
    size: "display-xl" as const,
    title: "A large section header that gives the next module room to land.",
  },
  heroLogoStatement: {
    logoLabel: "Logo",
    statement:
      "Local service pages can feel calm, capable, and immediately useful before a visitor reads the fine print.",
    imageLabel: "Image",
    violatorTop: "Schedule",
    violatorBottom: "Service",
  },
  navPrimary: {
    logoLabel: "Logo",
    phone: "(555) 014-2250",
    action: "Schedule now",
    links: [
      {
        label: "Services",
        items: ["Service 1", "Service 2", "Service 3", "Service 4"],
      },
      {
        label: "Service areas",
        items: ["Service area 1", "Service area 2", "Service area 3", "Service area 4"],
      },
      {
        label: "About",
      },
      {
        label: "Reviews",
      },
    ],
  },
  contentRevealParagraph: {
    lines: [
      "Local service websites need to feel useful",
      "before they feel impressive.",
      "This reusable system keeps proof, clarity,",
      "and conversion close to every section.",
    ],
  },
  contentRuleHeader: {
    eyebrow: "Section intro",
    title:
      "A simple header rhythm for introducing the next idea with a drawn rule and a clear editorial line.",
  },
  contentScrollWrittenReveal: {
    lines: [
      "Service pages can reveal trust gradually",
      "as the visitor moves through the work.",
      "Each line writes itself with the scroll,",
      "then unwrites when the page moves back.",
    ],
  },
  contentStickyIdeas: {
    eyebrow: "Content",
    ideasLabel: "What matters",
    title: "A long-form content pattern for pages that need more room to explain.",
    paragraphs: [
      "A strong service page gives visitors enough context to understand the business without asking them to decode a wall of small copy.",
      "Large paragraph blocks can slow the pace of a page in a useful way, giving important positioning, process details, or values room to breathe.",
      "The sticky idea list keeps the main takeaways visible while someone scrolls through the longer narrative, so the section remains scannable even when the copy gets richer.",
      "Use this pattern for about pages, service philosophy, process explanations, or any moment where the business needs to sound clear, confident, and human.",
    ],
    ideas: [
      "Lead with clarity",
      "Keep proof close",
      "Make scanning easy",
      "Let important copy breathe",
    ],
  },
  contentStickyCardStream: {
    eyebrow: "Service clarity",
    title: "A steady message beside a moving proof stream.",
    body: "Use this section when the page needs one persistent idea while supporting details, proof points, or service moments move through the reader's attention.",
    cards: [
      {
        eyebrow: "First response",
        title: "The request path stays obvious while details unfold.",
        body: "A sticky message can hold the main promise in place while the supporting column explains what happens after a homeowner reaches out.",
      },
      {
        eyebrow: "Visit prep",
        title: "Each card can carry a focused operational proof point.",
        body: "Use the stream for arrival windows, diagnostic steps, photo-backed notes, or practical expectations that make the service feel organized.",
      },
      {
        eyebrow: "Clear options",
        title: "Complex service decisions become easier to scan.",
        body: "The section can slow the page down without becoming static, giving each idea enough room to land as the visitor scrolls.",
      },
      {
        eyebrow: "Follow-through",
        title: "The final card can reinforce confidence before conversion.",
        body: "Close the stream with cleanup, documentation, follow-up, or another trust point that makes the next action feel low-friction.",
      },
    ],
  },
  contentHorizontalCardCarousel: {
    eyebrow: "Capabilities",
    title: "A swipeable card stream for related proof points.",
    body: "Use this section when several service details need to feel connected, tactile, and easy to browse without turning the page into a dense grid.",
    cards: [
      {
        eyebrow: "Scheduling",
        title: "Arrival windows stay clear from the first request.",
        body: "Cards can carry practical details like booking expectations, confirmation steps, and the kind of follow-up customers should expect.",
        meta: "Best for process, proof, or service highlights",
        size: "large" as const,
      },
      {
        eyebrow: "Prep",
        title: "The team reviews job notes before dispatch.",
        body: "Smaller cards keep quick operational points visible without demanding the same weight as the lead item.",
        size: "small" as const,
      },
      {
        eyebrow: "Documentation",
        title: "Photos and notes make recommendations easier to trust.",
        body: "Medium cards are useful for explaining customer-facing benefits that need a little more room than a headline.",
        meta: "Pairs well with service or about pages",
        size: "medium" as const,
      },
      {
        eyebrow: "Options",
        title: "Clear choices help customers decide what happens next.",
        body: "The horizontal flow can hold several related ideas while preserving a clean first read on the left edge.",
        size: "large" as const,
      },
      {
        eyebrow: "Follow-up",
        title: "The final card can close with a simple trust point.",
        body: "The native scroll track stops at the end, and the arrow controls provide a secondary way through the same content.",
        size: "medium" as const,
      },
      {
        eyebrow: "Handoff",
        title: "Internal notes keep the next visit from starting cold.",
        body: "Use extra cards to show how the business carries context from one interaction to the next.",
        meta: "Useful for recurring service plans",
        size: "small" as const,
      },
      {
        eyebrow: "Coverage",
        title: "Service area details can live in the same browsable flow.",
        body: "The rail can stretch for dense local proof without forcing every item into a static grid.",
        size: "medium" as const,
      },
      {
        eyebrow: "Confidence",
        title: "Larger cards can punctuate the stream with stronger claims.",
        body: "A featured item gives the carousel a rhythm shift while still staying part of the same horizontal browsing pattern.",
        meta: "Good for warranties, guarantees, or standout proof",
        size: "large" as const,
      },
      {
        eyebrow: "Care",
        title: "Small practical details are easier to skim in motion.",
        body: "Short cards keep the interaction light and prevent the section from feeling like a long article turned sideways.",
        size: "small" as const,
      },
      {
        eyebrow: "Close",
        title: "End with a next step that feels calm and obvious.",
        body: "The final card can bridge the carousel back into conversion, process, or another section without a hard visual stop.",
        size: "medium" as const,
      },
    ],
  },
  contentPhotoGalleryCarousel: {
    eyebrow: "Field Notes",
    title: "A flexible image rail for people, projects, and proof.",
    body: "A compact rail for mixed project, crew, and proof images.",
    images: [
      {
        alt: "Technician working on indoor HVAC equipment",
        caption: "Service details documented on site.",
        objectPosition: "50% 40%",
        size: "tall" as const,
        src: "/images/bg-image-sample%201.jpg",
      },
      {
        alt: "Technician speaking with a homeowner at the door",
        caption: "Clear conversations before work begins.",
        objectPosition: "42% 42%",
        size: "medium" as const,
        src: "/images/bg-image-sample%202.jpg",
      },
      {
        alt: "HVAC unit staged near a service truck",
        caption: "Replacement work with the right equipment ready.",
        objectPosition: "22% 50%",
        size: "wide" as const,
        src: "/images/hvac-unit-truck-wide.png",
      },
      {
        alt: "Service visit conversation at a home entry",
        caption: "Local service moments that feel human.",
        objectPosition: "58% 42%",
        size: "large" as const,
        src: "/images/bg-image-sample%202.1.jpg",
      },
      {
        alt: "Close service detail from a residential visit",
        caption: "A visual rhythm for trust and context.",
        objectPosition: "50% 50%",
        size: "small" as const,
        src: "/images/bg-image-sample%202.jpg",
      },
    ],
  },
  imageStrip: {
    images: [
      {
        alt: "Technician working on indoor HVAC equipment",
        caption: "Lead image for a project, crew, or service moment.",
        objectPosition: "50% 40%",
        src: "/images/bg-image-sample%201.jpg",
      },
      {
        alt: "Technician speaking with a homeowner at the door",
        caption: "Secondary image with a quieter supporting note.",
        objectPosition: "42% 42%",
        src: "/images/bg-image-sample%202.jpg",
      },
      {
        alt: "HVAC unit staged near a service truck",
        caption: "A second supporting frame for texture and proof.",
        objectPosition: "22% 50%",
        src: "/images/hvac-unit-truck-wide.png",
      },
    ],
  },
  contentFixedCoverFade: {
    backgroundEyebrow: "",
    backgroundTitle: "Let the final message hold before the request path rises.",
    backgroundBody:
      "A steady closing promise gives way to a request form when the visitor is ready to act.",
    backgroundLabel: "Closing CTA",
    foregroundEyebrow: "Contact",
    foregroundTitle: "Tell us what you need and we will follow up clearly.",
    foregroundBody:
      "A compact final request moment for service pages that need a stronger close than a standard contact block.",
    items: [
      "(555) 014-2250",
      "hello@examplelocal.com",
      "Mon-Fri, 8am-6pm",
    ],
  },
  quickPageLinks: {
    eyebrow: "Explore first",
    title: "Useful next steps before starting a request.",
    pageLinks: [
      {
        label: "Services",
        title: "Compare service options",
        body: "Browse the common request paths before starting a message.",
        href: "#services",
      },
      {
        label: "Process",
        title: "See what happens next",
        body: "Review the visit flow, timing, and how recommendations are made.",
        href: "#process",
      },
      {
        label: "Coverage",
        title: "Check the service area",
        body: "Confirm local fit before sending a request.",
        href: "#service-area",
      },
    ],
  },
  contentAboutCompany: {
    eyebrow: "About the company",
    statement:
      "A locally minded service team built around clear communication, careful work, and practical next steps.",
    summary:
      "Meet the team, values, and process behind every visit.",
    action: "Visit about page",
    images: [
      {
        label: "Team",
      },
      {
        label: "Service",
      },
    ],
  },
  contentAboutStory: {
    eyebrow: "About North Star",
    title: "Clear HVAC guidance for Lake Norman homes.",
    intro:
      "North Star HVAC is built for homeowners who need practical heating and cooling help without pressure, scare tactics, or a confusing next step.",
    paragraphs: [
      "The work starts with a simple belief: a service visit should make the decision clearer. Whether the issue is a no-cool call, a heat pump that is struggling, or an older system that may be nearing replacement, the customer should understand what the technician is seeing and what the options mean.",
      "That makes the company story less about a dramatic origin and more about how the work is handled day to day. Clear explanations, clean work areas, and practical repair-vs-replacement guidance are the details that turn a stressful home service moment into something manageable.",
      "The service area matters too. North Star is positioned around Huntersville, Lake Norman, and nearby North Charlotte communities, so the site needs to feel local before it feels promotional. The copy should help people recognize that the team understands seasonal tune-ups, urgent comfort issues, replacement planning, and the questions that come with owning HVAC equipment here.",
      "The strongest about message is steady and specific: repair when repair makes sense, replace when replacement is the better long-term move, and keep the path to a quote or call easy to find.",
    ],
    pullquote:
      "Repair when it makes sense. Replace when it is the better long-term move.",
    notes: [
      {
        label: "Local focus",
        body: "Huntersville, Lake Norman, and nearby North Charlotte communities stay central to the story.",
      },
      {
        label: "Primary work",
        body: "Replacement, heat pump service, maintenance, tune-ups, and repair carry the most strategic weight.",
      },
      {
        label: "Trust angle",
        body: "Use over-a-decade experience, family-owned language, clear explanations, and respectful service without unsupported specifics.",
      },
      {
        label: "Tone guardrail",
        body: "Avoid cheap pricing, guaranteed emergency coverage, exact repair pricing, or unverified warranty and financing claims.",
      },
    ],
  },
  contentSplitHeadlineImage: {
    headlineTop: "Useful service pages",
    headlineBottom: "feel calm first",
    imageLabel: "Texture",
    body: "A concise editorial content block for pairing a large positioning line with a quiet image moment.",
  },
  trustBar: {
    label: "Trusted by homeowners and small businesses across the metro area",
    items: [
      "4.9 average rating",
      "2,400+ jobs completed",
      "Background-checked team",
      "Locally owned",
    ],
  },
  trustMarquee: {
    label:
      "Trusted by homeowners, property managers, and small businesses across the metro area",
    actionLabel: "Request service",
    actionHref: "/contact",
    items: [
      "4.9 average rating",
      "2,400+ jobs completed",
      "Background-checked team",
      "Locally owned",
      "Same-week appointments",
      "Licensed and insured",
      "Upfront estimates",
      "Photo-backed recommendations",
      "Clean job sites",
      "Friendly follow-up",
      "Maintenance plans",
      "Emergency availability",
    ],
  },
  trustLogoMarquee: {
    label: "Recognized as a top service provider",
    logos: [
      "Brand 01",
      "Assoc 02",
      "Partner 03",
      "Award 04",
      "Guild 05",
      "Network 06",
      "Sponsor 07",
      "Board 08",
    ],
  },
  services: {
    eyebrow: "Services",
    title: "Everyday services with a professional system behind them.",
    body: "Use this grid for top-level offerings, short descriptions, and a simple path into deeper service pages.",
    items: [
      {
        title: "Emergency repairs",
        body: "Fast help for urgent issues that need an experienced technician.",
      },
      {
        title: "Preventive maintenance",
        body: "Seasonal tune-ups that reduce surprises and keep equipment working well.",
      },
      {
        title: "Installation",
        body: "Clean, documented installs for new systems, fixtures, and upgrades.",
      },
    ],
  },
  servicesBento: {
    eyebrow: "Services",
    title: "Heating and Cooling Services",
    body: "A larger image-led service card pattern for showing a fuller service set with the two highest-priority offers given more visual weight.",
    items: [
      {
        title: "System Replacement",
        body: "Compare repair and replacement paths with clear guidance on equipment condition and long-term fit.",
        cardSize: "Pattern large slot",
        imageLabel: "Replace",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "HVAC Repair",
        body: "Diagnose heating and cooling problems and review the practical repair path before work begins.",
        cardSize: "Pattern small slot",
        imageLabel: "Repair",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "AC Repair",
        body: "Address cooling failures, weak airflow, and performance concerns with clear next steps.",
        cardSize: "Pattern small slot",
        imageLabel: "Cooling",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Heating Repair",
        body: "Resolve heating issues with practical options after the system has been evaluated.",
        cardSize: "Pattern small slot",
        imageLabel: "Heating",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Seasonal Service",
        body: "Prepare heating or cooling equipment before peak weather with focused seasonal checks.",
        cardSize: "Pattern small slot",
        imageLabel: "Seasonal",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Maintenance & Tune-Ups",
        body: "Schedule seasonal care to review operation, identify developing concerns, and support dependable performance.",
        cardSize: "Pattern large slot",
        imageLabel: "Maintain",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Heat Pump Service",
        body: "Plan heat pump repair, maintenance, or replacement around the system's condition and performance.",
        cardSize: "Pattern large slot",
        imageLabel: "Heat pump",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Emergency HVAC Service",
        body: "Call directly for urgent heating or cooling problems when current availability allows.",
        cardSize: "Pattern small slot",
        imageLabel: "Urgent",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Indoor Air Quality",
        body: "Review practical options for filtration, airflow, humidity, and the home's indoor environment.",
        cardSize: "Pattern small slot",
        imageLabel: "Air quality",
        imageSrc: "/images/fpo-image.svg",
      },
    ],
  },
  fourCardLinkGrid: {
    linkLabel: "Learn more",
    items: [
      {
        title: "System Replacement",
        body: "Compare replacement options when an older heating or cooling system is no longer a dependable fit.",
        href: "/services/system-replacement",
        imageAlt: "Heating and cooling system replacement",
        imageLabel: "Replacement",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "HVAC Repair",
        body: "Review common repair needs, diagnostic steps, and what to expect before service begins.",
        href: "/services/hvac-repair",
        imageAlt: "HVAC repair service",
        imageLabel: "Repair",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Maintenance Plans",
        body: "Keep seasonal service organized with recurring visits and documented system recommendations.",
        href: "/maintenance-plan",
        imageAlt: "Seasonal HVAC maintenance",
        imageLabel: "Maintenance",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Indoor Air Quality",
        body: "Explore filtration, humidity, ventilation, and airflow options for the home’s indoor environment.",
        href: "/services/indoor-air-quality",
        imageAlt: "Indoor air quality service",
        imageLabel: "Air quality",
        imageSrc: "/images/fpo-image.svg",
      },
    ],
  },
  threeCardLinkGrid: {
    linkLabel: "Learn more",
    items: [
      {
        title: "System Replacement",
        body: "Compare replacement options when an older heating or cooling system is no longer a dependable fit.",
        href: "/services/system-replacement",
        imageAlt: "Heating and cooling system replacement",
        imageLabel: "Replacement",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "HVAC Repair",
        body: "Review common repair needs, diagnostic steps, and what to expect before service begins.",
        href: "/services/hvac-repair",
        imageAlt: "HVAC repair service",
        imageLabel: "Repair",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Maintenance Plans",
        body: "Keep seasonal service organized with recurring visits and documented system recommendations.",
        href: "/maintenance-plan",
        imageAlt: "Seasonal HVAC maintenance",
        imageLabel: "Maintenance",
        imageSrc: "/images/fpo-image.svg",
      },
    ],
  },
  servicesHoverPanel: {
    eyebrow: "Services",
    title: "Explore service categories",
    body: "A flexible service browser for local businesses that need to explain related offers without sending visitors away from the page.",
    items: [
      {
        title: "Emergency repairs",
        body: "Fast troubleshooting, clear next steps, and practical repairs for urgent issues that need attention right away.",
        imageLabel: "Repair",
      },
      {
        title: "Maintenance plans",
        body: "Recurring visits, seasonal tune-ups, and documented recommendations that help customers prevent larger surprises.",
        imageLabel: "Care",
      },
      {
        title: "System installation",
        body: "Clean installs for new systems, replacements, and upgrades with a tidy process from estimate to walkthrough.",
        imageLabel: "Install",
      },
      {
        title: "Inspections",
        body: "Detailed checks with photo-backed notes, priority guidance, and simple recommendations customers can understand.",
        imageLabel: "Inspect",
      },
      {
        title: "Commercial service",
        body: "Responsive support for offices, shops, and small facilities that need reliable communication and minimal disruption.",
        imageLabel: "Biz",
      },
      {
        title: "Consultations",
        body: "Helpful planning conversations for customers comparing options, budgets, timelines, and future service needs.",
        imageLabel: "Plan",
      },
    ],
  },
  servicesScrollCards: {
    eyebrow: "Services",
    title: "Service categories that move with the page.",
    viewAllLabel: "View all services",
    items: [
      {
        title: "Emergency repairs",
        imageLabel: "Repair",
      },
      {
        title: "Maintenance plans",
        imageLabel: "Care",
      },
      {
        title: "System installation",
        imageLabel: "Install",
      },
      {
        title: "Inspections",
        imageLabel: "Inspect",
      },
      {
        title: "Commercial service",
        imageLabel: "Biz",
      },
      {
        title: "Consultations",
        imageLabel: "Plan",
      },
    ],
  },
  featureSplit: {
    eyebrow: "Why choose us",
    title: "A service experience that feels organized from the first call.",
    body: "This split section can pair a key message with supporting highlights, media, or a quote.",
    points: ["Transparent arrival windows", "Photo-backed recommendations", "Friendly follow-up after each visit"],
  },
  featureOverlapRows: {
    items: [
      {
        eyebrow: "How we work",
        title: "Service that arrives prepared.",
        body: "Use this feature row for a concise operational promise, process note, or trust-building detail paired with a strong image moment.",
        imageLabel: "Visit",
        position: "top" as const,
      },
      {
        eyebrow: "What customers notice",
        title: "Clear updates after every visit.",
        body: "Mirror the second row to keep the page rhythm moving while giving another short feature room to breathe beside the image.",
        imageLabel: "Follow-up",
        position: "bottom" as const,
      },
    ],
  },
  featureAsymmetricCards: {
    eyebrow: "Why choose us",
    title: "Straightforward service without the runaround.",
    body: "Use this asymmetrical feature section to pair a three-column intro with four compact proof points.",
    actionLabel: "About the team",
    cards: [
      {
        iconLabel: "01",
        title: "Clear Recommendations",
        body: "Repair, maintenance, and replacement guidance based on the home, budget, and timing.",
      },
      {
        iconLabel: "02",
        title: "Repair-First Approach",
        body: "Explain what is happening, what can wait, and what needs attention now.",
      },
      {
        iconLabel: "03",
        title: "Fast Response",
        body: "Keep scheduling practical with clear next steps and responsive appointment windows.",
      },
      {
        iconLabel: "04",
        title: "Local Team",
        body: "Ground the experience in nearby service areas, familiar homes, and steady follow-through.",
      },
    ],
  },
  featureStackedCards: {
    eyebrow: "Why choose us",
    title: "Straightforward service without the runaround.",
    body: "Use this stacked feature section to pair a three-column intro with larger, icon-led proof points.",
    actionLabel: "About the team",
    cards: [
      {
        iconLabel: "01",
        title: "Clear Recommendations",
        body: "Repair, maintenance, and replacement guidance based on the home, budget, and timing.",
      },
      {
        iconLabel: "02",
        title: "Repair-First Approach",
        body: "Explain what is happening, what can wait, and what needs attention now.",
      },
      {
        iconLabel: "03",
        title: "Fast Response",
        body: "Keep scheduling practical with clear next steps and responsive appointment windows.",
      },
      {
        iconLabel: "04",
        title: "Local Team",
        body: "Ground the experience in nearby service areas, familiar homes, and steady follow-through.",
      },
    ],
  },
  decisionSplitDecision: {
    eyebrow: "Repair or replace",
    title: "Clear options before a bigger decision.",
    body: "Use this compact decision section to explain how the team helps homeowners understand whether repair or replacement makes more sense after an inspection.",
    actionLabel: "Talk through options",
    cards: [
      {
        eyebrow: "Repair path",
        title: "When repair still makes sense",
        body: "Explain what can be fixed, what can wait, and how the homeowner can keep the system running without unnecessary work.",
      },
      {
        eyebrow: "Replacement path",
        title: "When replacement is worth pricing",
        body: "Show when age, condition, recurring issues, or comfort goals may make a replacement estimate the more practical next step.",
      },
    ],
  },
  decisionSplitLargeCards: {
    title: "Two clear paths after the inspection.",
    actionLabel: "Compare options",
    cards: [
      {
        eyebrow: "Repair",
        title: "Stabilize the current system",
        body: "Use this card for practical repair guidance, short-term reliability, and what the homeowner should watch after the visit.",
      },
      {
        eyebrow: "Replace",
        title: "Plan the longer-term move",
        body: "Use this card for replacement fit, estimate timing, financing notes, and the conditions that make upgrade planning useful.",
      },
    ],
  },
  process: {
    eyebrow: "Process",
    title: "A simple path from request to resolved.",
    body: "Preview a repeatable step pattern for explaining how the business works.",
    steps: [
      {
        title: "Request",
        body: "Tell us what you need and choose the best way to be contacted.",
      },
      {
        title: "Schedule",
        body: "We confirm timing, scope, and any details needed before arrival.",
      },
      {
        title: "Resolve",
        body: "A trained pro completes the work and explains the result clearly.",
      },
    ],
  },
  processImageChecklist: {
    eyebrow: "How it works",
    title: "A prepared visit starts before anyone reaches the door.",
    body: "Use this process pattern when the page needs a quieter explanation with supporting checklist details that arrive after the main message has time to land.",
    imageLabel: "Process",
    items: [
      "Confirm the request details and preferred contact method.",
      "Review the service history, location notes, and likely materials.",
      "Share timing expectations before the visit is locked in.",
      "Document findings with clear notes and practical recommendations.",
      "Close the loop with next steps the customer can understand.",
    ],
    action: "Talk through the process",
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "Proof that the team shows up well.",
    body: "Use testimonial cards for short, specific trust-building quotes.",
    items: [
      {
        quote: "They were prompt, tidy, and explained every option before starting.",
        author: "Maya R.",
        detail: "Residential repair",
      },
      {
        quote: "The estimate was clear and the work was finished ahead of schedule.",
        author: "Daniel K.",
        detail: "Small business owner",
      },
    ],
  },
  testimonialsCarousel: {
    eyebrow: "Customer stories",
    title: "Longer proof for high-trust service pages.",
    body: "A centered testimonial carousel for pages that need a stronger customer story after the introductory copy.",
    items: [
      {
        quote:
          "From the first call to the final walkthrough, the team made a stressful repair feel completely manageable. They explained the issue clearly, showed me the options, and left the house cleaner than they found it.",
        author: "Amanda Reeves",
        city: "Franklin",
        service: "Emergency repair",
      },
      {
        quote:
          "We had put off replacing our old system because every estimate felt confusing. This team gave us a straightforward plan, arrived exactly when they said they would, and finished the installation without disrupting our workday.",
        author: "Marcus Bennett",
        city: "Brentwood",
        service: "System installation",
      },
      {
        quote:
          "The maintenance visit caught two small problems before they became expensive ones. I appreciated how practical the recommendations were, and I never felt pushed into work we did not actually need.",
        author: "Elena Walsh",
        city: "Nashville",
        service: "Preventive maintenance",
      },
    ],
  },
  testimonialsMasonry: {
    eyebrow: "Reviews",
    title: "A wall of proof from real service visits.",
    body: "A masonry testimonial section for showing a larger review set while keeping the first view focused and scannable.",
    items: [
      {
        quote:
          "They arrived on time, explained the repair in plain language, and gave us a clear price before starting. The whole visit felt organized from beginning to end.",
        author: "Maya R.",
        detail: "Residential repair",
      },
      {
        quote:
          "The estimate was easy to understand and the installation team kept the work area spotless. We knew what was happening at every step.",
        author: "Daniel K.",
        detail: "System installation",
      },
      {
        quote:
          "I called in the morning and had someone scheduled for the next day. The technician was friendly, careful, and honest about what needed attention.",
        author: "Priya S.",
        detail: "Emergency service",
      },
      {
        quote:
          "Our maintenance appointment found a small issue before it became a major repair. That kind of practical advice is exactly why we keep using them.",
        author: "Helen M.",
        detail: "Preventive maintenance",
      },
      {
        quote:
          "They treated our small office like it mattered. The work was finished quickly, communication was consistent, and there were no surprises on the invoice.",
        author: "Andre W.",
        detail: "Small business service",
      },
      {
        quote:
          "Every option was explained without pressure. We picked the repair that made sense for our budget and felt confident about the choice.",
        author: "Lauren P.",
        detail: "Home service consultation",
      },
      {
        quote:
          "The follow-up after the visit was excellent. We received photos, notes, and a simple recommendation for what to watch over the next few months.",
        author: "Chris T.",
        detail: "Inspection visit",
      },
      {
        quote:
          "Booking was simple, the arrival window was accurate, and the technician took time to answer all of our questions before leaving.",
        author: "Nina G.",
        detail: "Recurring service plan",
      },
      {
        quote:
          "They helped us prioritize what was urgent and what could wait. That honesty made it easy to trust the recommendations.",
        author: "Owen B.",
        detail: "Property maintenance",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions customers usually ask first.",
    body: "A compact FAQ block for common concerns before someone contacts the business.",
    items: [
      {
        question: "Do you provide estimates before work begins?",
        answer: "Yes. Customers receive a clear scope and approval point before paid work starts.",
      },
      {
        question: "What areas do you serve?",
        answer: "This placeholder can be swapped for city, county, or neighborhood coverage.",
      },
      {
        question: "Can customers book recurring maintenance?",
        answer: "Yes. This pattern supports one-time visits and recurring service plans.",
      },
    ],
  },
  faqAccordion: {
    eyebrow: "FAQ",
    title: "Clear answers before customers reach out.",
    body: "A full-width accordion pattern for service pages that need organized answers without overwhelming the layout.",
    items: [
      {
        question: "Do you provide estimates before work begins?",
        answer:
          "Yes. Customers receive a clear scope, pricing guidance, and an approval point before paid work starts. If the work changes once we are on site, we explain the reason and confirm the next step first.",
      },
      {
        question: "What areas do you serve?",
        answer:
          "This placeholder can be adapted for city, county, or neighborhood coverage. It works well for businesses that serve a defined metro area and want to make location fit obvious before someone contacts the team.",
      },
      {
        question: "Can customers book recurring maintenance?",
        answer:
          "Yes. This pattern supports one-time visits and recurring service plans, with room to explain seasonal tune-ups, reminder schedules, and what is included in each maintenance appointment.",
      },
      {
        question: "How quickly can someone schedule service?",
        answer:
          "Availability depends on the service type and current schedule, but this section can communicate standard response windows, same-week availability, emergency support, and what customers should expect after submitting a request.",
      },
      {
        question: "Are your technicians licensed and insured?",
        answer:
          "Yes. Use this answer to reinforce credentials, insurance coverage, background checks, training, or any local certifications that help customers feel confident before inviting the team into their home or business.",
      },
    ],
  },
  cta: {
    title: "Ready to turn interest into a booked service call?",
    body: "Use this section near the end of a page to move visitors toward the primary conversion.",
    action: "Start a request",
  },
  ctaFullscreen: {
    eyebrow: "Ready when you are",
    title: "Turn the next visit into a booked service call.",
    body: "A cinematic conversion section for the end of a page, built to focus attention on one clear action.",
    action: "Start a request",
  },
  ctaScrollRevealOffer: {
    introEyebrow: "Seasonal offer",
    introTitle: "A quiet lead-in before the offer takes over the page.",
    introBody:
      "The textured panel above moves away first, letting the sale message feel like it was waiting underneath the page.",
    offerEyebrow: "Limited time service offer",
    offerTitle: "Save 15% on your first scheduled maintenance visit.",
    offerBody:
      "A full-bleed conversion reveal for seasonal promotions, service specials, and moments where the offer should feel discovered instead of dropped into the flow.",
    offerDetail:
      "Offer terms can live here: new customers, eligible service visits, and availability windows.",
    action: "Claim the offer",
    closeEyebrow: "Next step",
    closeTitle: "The follow-up section covers the offer and returns the page to normal rhythm.",
    closeBody:
      "Use the closing panel for reassurance, eligibility details, or a softer transition back into services, testimonials, or FAQ content.",
  },
  serviceAreaZipLookup: {
    eyebrow: "Service areas",
    title: "Serving Huntersville and nearby North Charlotte communities.",
    body: "Give visitors a quick way to confirm coverage before they start a service request.",
    prompt: "Not sure if we service your area?",
    inputLabel: "ZIP code lookup",
    inputPlaceholder: "Enter ZIP code",
    submitLabel: "Check",
    successTitle: "We service your area.",
    successBody: "Send the request and the team will confirm timing.",
    successActionLabel: "Request service",
    successActionHref: "/contact",
    mapLabel: "Local coverage map",
    columns: [
      ["Huntersville", "Cornelius", "Davidson"],
      ["Concord", "North Charlotte", "Lake Norman Area"],
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Make it easy for customers to reach the team.",
    body: "A reusable contact section placeholder for phone, email, hours, and a simple form preview.",
    details: ["(555) 014-2250", "hello@examplelocal.com", "Mon-Fri, 8am-6pm"],
  },
  contactModalBegin: {
    eyebrow: "Request service",
    title: "Start with the kind of help you need.",
    body: "Choose the system and service path that best match the situation. We will carry those answers into the request flow so you can continue without repeating yourself.",
    systemPrompt: "What system needs help?",
    requestPrompt: "What do you need?",
    continueLabel: "Continue",
    helperText: "Your selections will carry into the next step.",
  },
  thankYouConfirmation: thankYouPageContent,
  footer: {
    businessName: "Example Local Service",
    description:
      "Reusable footer structure for local service starters, with clear navigation, service coverage, and contact details in one calm close.",
    quickLinks: [
      {
        label: "Home",
        href: "#",
      },
      {
        label: "About us",
        href: "#",
      },
      {
        label: "Services",
        href: "#services",
      },
      {
        label: "Contact us",
        href: "#contact",
      },
    ],
    services: [
      {
        label: "Emergency repairs",
        href: "#",
      },
      {
        label: "Preventive maintenance",
        href: "#",
      },
      {
        label: "Installation",
        href: "#",
      },
      {
        label: "Inspections",
        href: "#",
      },
    ],
    serviceAreas: [
      {
        label: "Nashville",
        href: "#",
      },
      {
        label: "Franklin",
        href: "#",
      },
      {
        label: "Brentwood",
        href: "#",
      },
      {
        label: "Murfreesboro",
        href: "#",
      },
    ],
    contact: {
      name: "Example Local Service",
      address: "123 Main Street, Nashville, TN 37201",
      phone: "(555) 014-2250",
      email: "hello@examplelocal.com",
    },
    socialLinks: [
      {
        label: "Facebook",
        href: "#",
      },
      {
        label: "Instagram",
        href: "#",
      },
      {
        label: "LinkedIn",
        href: "#",
      },
    ],
    reviewLink: {
      label: "Read our Google reviews",
      href: "#",
    },
    copyright: "(c) 2026 Example Local Service. All rights reserved.",
    privacyLink: {
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    termsLink: {
      label: "Terms",
      href: "/terms",
    },
  },
  heroSplitFullHeight: {
    eyebrow: "Local service starter",
    title: "Reliable home services built around your schedule.",
    body: "A polished hero pattern for local service companies, with a clear value proposition, supporting proof, and two focused calls to action.",
    imageAlt: "FPO image placeholder",
    imageSrc: "/images/fpo-image.svg",
    primaryAction: "Request service",
    secondaryAction: "View services",
    stats: ["Same-week visits", "Licensed pros", "Clear estimates"],
    variants: [
      {
        label: "Text 3 / Image 4",
        variant: "text-3-image-4-right",
      },
      {
        label: "Text 4 / Image 3",
        variant: "text-4-image-3-right",
      },
      {
        label: "Image 3 / Text 4",
        variant: "image-3-left-text-4",
      },
      {
        label: "Image 4 / Text 3",
        variant: "image-4-left-text-3",
      },
    ],
  },
  featurePortraitParagraph: {
    imageLabel: "Portrait feature",
    contentAlignX: "left" as const,
    contentAlignY: "middle" as const,
    body: "A large portrait image gives the section a clear visual anchor while the adjacent paragraph carries the main service idea with enough room to feel editorial, direct, and easy to read.",
  },
  servicesThreeCardsRight: {
    eyebrow: "Priority services",
    title: "Services to list first before the full service set.",
    priorityServices: [
      {
        title: "System Replacement",
        body: "Compare repair and replacement paths with clear guidance on equipment condition and long-term fit.",
        href: "/services",
        imageAlt: "Service image placeholder",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "HVAC Repair",
        body: "Diagnose the current problem and explain the practical repair path before work begins.",
        href: "/services",
        imageAlt: "Service image placeholder",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Heat Pump Service",
        body: "Plan heat pump repair, maintenance, or replacement around the system's condition and performance.",
        href: "/services",
        imageAlt: "Service image placeholder",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Maintenance & Tune-Ups",
        body: "Schedule seasonal care to review operation and identify developing concerns.",
        href: "/services",
        imageAlt: "Service image placeholder",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Seasonal Service",
        body: "Prepare heating or cooling equipment before peak demand.",
        href: "/services",
        imageAlt: "Service image placeholder",
        imageSrc: "/images/fpo-image.svg",
      },
    ],
  },
};

export const sectionLibraryV3Collections = [
  {
    title: "Navigation",
    items: [
      { label: "Primary navigation", component: "nav-primary-v2" },
      { label: "Center logo navigation", component: "nav-center-logo-v2" },
      { label: "Floating bento navigation", component: "nav-floating-bento-v2" },
    ],
  },
  {
    title: "Hero",
    items: [
      { label: "Fullscreen hero", component: "hero-fullscreen-v2" },
      {
        label: "Centered hero with floaters",
        component: "hero-centered-floaters-v2",
      },
      {
        label: "Content top, image bottom hero",
        component: "hero-content-top-image-bottom-v2",
      },
      {
        label: "Split content and full image",
        component: "hero-split-full-height-v3",
      },
      {
        label: "Fixed-ratio split image",
        component: "hero-split-fixed-image-v3",
      },
      {
        label: "Compact page hero",
        component: "hero-compact-v3",
      },
      {
        label: "Services hero",
        component: "hero-services-v3",
      },
    ],
  },
  {
    title: "Section Headers",
    items: [
      {
        label: "Compact section header",
        component: "section-header-compact-v3",
      },
      {
        label: "Large section header",
        component: "section-header-large-v3",
      },
    ],
  },
  {
    title: "Scan",
    items: [
      { label: "Card Links 4 Up", component: "four-card-link-grid-v3" },
      { label: "Card Links 3 Up", component: "three-card-link-grid-v3" },
      {
        label: "Services card carousel",
        component: "content-horizontal-card-carousel-v2",
      },
      {
        label: "Quick page links",
        component: "quick-page-links-v2",
      },
      {
        label: "Priority service cards",
        component: "services-three-cards-right-v3",
      },
      { label: "Services bento cards", component: "services-bento-cards-v2" },
      { label: "Services hover panel", component: "services-hover-panel-v2" },
      { label: "Services scroll cards", component: "services-scroll-cards-v2" },
    ],
  },
  {
    title: "Narrative",
    items: [
      {
        label: "Reveal paragraph",
        component: "content-reveal-paragraph-v2",
      },
      {
        label: "Scroll written reveal",
        component: "content-scroll-written-reveal-v2",
      },
      {
        label: "Sticky card stream",
        component: "content-sticky-card-stream-v2",
      },
      {
        label: "Sticky ideas",
        component: "content-sticky-ideas-v2",
      },
      {
        label: "About company",
        component: "content-about-company-v2",
      },
      {
        label: "Editorial 3 column",
        component: "content-about-story-v3",
      },
      {
        label: "Split headline image",
        component: "content-split-headline-image-v2",
      },
      {
        label: "Split content with fixed image",
        component: "content-split-fixed-image-v3",
      },
      {
        label: "Rule header",
        component: "content-rule-header-v2",
      },
      {
        label: "Editorial portrait",
        component: "feature-portrait-paragraph-v3",
      },
      {
        label: "Overlapping feature rows",
        component: "feature-overlap-rows-v3",
      },
      {
        label: "Asymmetric feature cards",
        component: "feature-asymmetric-cards-v3",
      },
      {
        label: "Stacked feature cards",
        component: "feature-stacked-cards-v3",
      },
    ],
  },
  {
    title: "Images",
    items: [
      {
        label: "Image strip",
        component: "image-strip-v3",
      },
      {
        label: "Photo gallery carousel",
        component: "content-photo-gallery-carousel-v3",
      },
      {
        label: "Large photo gallery carousel",
        component: "content-photo-gallery-large-carousel-v3",
      },
    ],
  },
  {
    title: "Proof",
    items: [
      { label: "Trust bar", component: "trust-bar-v3" },
      {
        label: "Floating bento trust bar",
        component: "trust-bar-floating-bento-v3",
      },
      {
        label: "Bento about us bar",
        component: "trust-bar-bento-about-v3",
      },
      { label: "Trust marquee", component: "trust-marquee-v3" },
      { label: "Logo marquee", component: "trust-logo-marquee-v3" },
      { label: "Static trust logo grid", component: "trust-logo-grid-v3" },
      { label: "Testimonials", component: "testimonials-v3" },
      {
        label: "Carousel testimonials",
        component: "testimonials-carousel-v3",
      },
      {
        label: "Condensed carousel testimonials",
        component: "testimonials-carousel-condensed-v3",
      },
      {
        label: "Masonry testimonials",
        component: "testimonials-masonry-v3",
      },
    ],
  },
  {
    title: "Decision",
    items: [
      { label: "Split decision", component: "decision-split-decision-v3" },
      { label: "Split large cards", component: "decision-split-large-cards-v3" },
      { label: "Process steps", component: "process-steps-v3" },
      {
        label: "Image checklist process",
        component: "process-image-checklist-v3",
      },
    ],
  },
  {
    title: "Utility",
    items: [
      { label: "FAQ", component: "faq-v3" },
      { label: "FAQ accordion", component: "faq-accordion-v3" },
      {
        label: "Thank you confirmation",
        component: "thank-you-confirmation-v3",
      },
      {
        label: "Service area zip lookup",
        component: "service-area-zip-lookup-v3",
      },
      {
        label: "Contact section modal begin",
        component: "contact-modal-begin-v3",
      },
      { label: "Contact section", component: "contact-v3" },
      { label: "Footer", component: "footer-v3" },
      { label: "Horizontal footer", component: "footer-horizontal-v3" },
      { label: "Condensed footer", component: "footer-compact-v3" },
      { label: "Link panel footer", component: "footer-link-panel-v3" },
    ],
  },
  {
    title: "Action",
    items: [
      {
        label: "Headline with Scrolling Banner",
        component: "trust-marquee-legacy",
      },
      { label: "CTA", component: "cta-v3" },
      { label: "Muted CTA", component: "cta-muted-v3" },
      { label: "Fullscreen conversion", component: "cta-fullscreen-v3" },
      {
        label: "Scroll reveal offer conversion",
        component: "cta-scroll-reveal-offer-v3",
      },
      { label: "Fixed cover fade", component: "content-fixed-cover-fade-v2" },
    ],
  },
] as const;
