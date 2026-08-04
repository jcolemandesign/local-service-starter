import { northStarFinancingProgram } from "@/content/financing";
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
  heroCompactService: {
    align: "right" as const,
    eyebrow: "Heat pump service",
    title: "Heat pump repair, maintenance, and replacement.",
    body: "A compact intro for the service this page covers, next to a bounded photo frame and a boxed request path.",
    ctaBody: "Get a technician out today with clear pricing before any work begins.",
    ctaTitle: "Same-day heat pump repair",
    imageAlt: "Technician servicing a heat pump",
    imageSrc: "/images/fpo-image.svg",
    primaryAction: "Request service",
    secondaryAction: "View all services",
    secondaryActionHref: "#services",
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
    imageAlt: "Service image placeholder",
    imageHeight: 1200,
    imageSrc: "/images/fpo-image.svg",
    imageWidth: 1600,
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
  contentMainIdeaGrid: {
    eyebrow: "Replacement planning",
    title: "Replacement is a decision—not a default.",
    body: "A system should be replaced when the evidence supports it, not simply because a repair is inconvenient. Start with the condition of the equipment, the pattern of recent issues, and the value of each available path.",
    points: [
      {
        title: "Repeated repairs",
        body: "Look at repair frequency and total recent spend, not one isolated service call.",
      },
      {
        title: "Uneven comfort",
        body: "Persistent hot and cold areas can reveal capacity, airflow, or distribution concerns.",
      },
      {
        title: "System condition",
        body: "Age matters, but operating condition and component health tell the fuller story.",
      },
      {
        title: "Long-term reliability",
        body: "Compare the expected life of a repair with the stability a replacement may provide.",
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
        eyebrow: "Handoff",
        title: "Internal notes keep the next visit from starting cold.",
        body: "Use extra cards to show how the business carries context from one interaction to the next.",
        meta: "Useful for recurring service plans",
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
  projectCaseStudyGallery: {
    slides: [
      {
        project: "Replacement project",
        title: "A clearer path to dependable whole-home comfort.",
        summary:
          "A planned replacement paired a properly sized heat pump with quieter airflow and a straightforward handoff for the homeowner.",
        imageAlt: "Heat pump equipment staged for a residential replacement project",
        imageSrc: "/images/hvac-unit-truck-wide.png",
        // Intrinsic pixels. The gallery frames each print to its picture's own
        // ratio; supplying it here makes the first paint exact instead of
        // settling once the browser reports it.
        imageWidth: 1774,
        imageHeight: 887,
        equipment: [
          { label: "Equipment", value: "Variable-speed heat pump" },
          { label: "Scope", value: "System replacement" },
          { label: "Timeline", value: "One scheduled visit" },
        ],
        testimonial: {
          quote:
            "The options were clear, the crew was organized, and the house felt balanced that same evening.",
          attribution: "Homeowner · Residential replacement",
        },
      },
      {
        project: "System care",
        title: "Service notes that make the next decision easier.",
        summary:
          "A focused maintenance visit documented the equipment condition and left the household with a practical plan for the coming season.",
        imageAlt: "Technician working on indoor HVAC equipment during a service visit",
        imageSrc: "/images/bg-image-sample%201.jpg",
        imageWidth: 1448,
        imageHeight: 1086,
        equipment: [
          { label: "Equipment", value: "High-efficiency furnace" },
          { label: "Scope", value: "Seasonal maintenance" },
          { label: "Follow-up", value: "Documented recommendations" },
        ],
        testimonial: {
          quote:
            "We knew exactly what was checked and what to keep an eye on before the next season.",
          attribution: "Homeowner · Preventive maintenance",
        },
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
    // Two placeholder slots. Their screen-reader labels default per position
    // inside ContentAboutCompanySectionV2 - they describe the slot, not the
    // business, so they are not demo copy for a client page.
    images: [{}, {}],
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
  contentNarrativeFeatureRail: {
    align: "right" as const,
    eyebrow: "More ways we can help",
    title: "Support that continues beyond the immediate service call.",
    intro:
      "Some of the most useful service options are not repairs or replacements at all. They make it easier to plan, budget, and stay ahead of the next season.",
    paragraphs: [
      "A longer narrative gives these supporting offers enough context to feel useful instead of promotional. Homeowners can understand where each option fits, what kind of problem it solves, and when it may be worth asking about.",
      "The visual rail keeps that explanation connected to the people and work behind the service. Below the image, focused callouts can surface the offers that matter for the current page without competing with its primary repair or replacement path.",
      "Because the callouts are configurable, the same section can support seasonal promotions, payment options, membership plans, rebates, indoor air quality offers, or another secondary feature the business wants to make easier to discover.",
    ],
    bullets: [
      "Keep secondary offers connected to the page story.",
      "Give each callout one clear purpose and next step.",
      "Confirm promotion, financing, and plan details before publishing.",
    ],
    textLinkLabel: "Explore all homeowner resources",
    textLinkHref: "/resources",
    imageAlt: "Technician reviewing service options with a homeowner",
    imageSrc: "/images/bg-image-sample%202.jpg",
    cards: [
      {
        eyebrow: "Seasonal offer",
        title: "Make the next visit easier to plan.",
        body: "Feature a current promotion without interrupting the page's primary service decision.",
        actionLabel: "View current offers",
        actionHref: "/promotions",
      },
      {
        eyebrow: "Payment options",
        title: "Ask about financing for qualified projects.",
        body: "Give larger planned work a clear secondary path while keeping terms and approval details appropriately qualified.",
        actionLabel: "Explore financing",
        actionHref: "/financing",
      },
      {
        eyebrow: "Ongoing care",
        title: "Keep seasonal maintenance organized.",
        body: "Introduce a maintenance plan, recurring visits, or another preventive service offer in a compact callout.",
        actionLabel: "View maintenance plans",
        actionHref: "/maintenance",
      },
    ],
  },
  contentCardTwoUp: {
    align: "left" as const,
    items: [
      {
        title: "Repair or replace, decided with the full picture.",
        body: "A single visible problem rarely tells the whole story. A practical recommendation weighs the system's age, repair history, and efficiency alongside the immediate issue.",
        secondBody:
          "That context is what turns a repair estimate into a decision the homeowner can actually stand behind, instead of a guess made under pressure.",
      },
      {
        title: "What a same-week visit actually includes.",
        body: "A clear visit covers diagnosis, a written explanation of the problem, and options ranked by urgency before any work begins.",
        bullets: [
          "Diagnosis explained in plain terms",
          "Options ranked by urgency, not upsell",
          "Written estimate before work starts",
        ],
      },
      {
        title: "Maintenance that earns its place on the calendar.",
        body: "Seasonal visits only matter if they catch something before it becomes a breakdown. A useful plan documents system condition at every visit, not just a filter change.",
        secondBody:
          "That record is what makes next year's recommendation faster and more accurate than starting from scratch.",
      },
      {
        title: "Financing that fits the actual project.",
        body: "Larger replacements deserve a payment path that's explained as clearly as the equipment itself, with terms confirmed before anyone signs.",
        bullets: [
          "Qualified-project financing options",
          "Terms confirmed before approval",
          "No pressure to decide same-day",
        ],
      },
    ],
  },
  contentSplitHeadlineImage: {
    headlineTop: "Useful service pages",
    headlineBottom: "feel calm first",
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
  serviceCalloutRevealGrid: {
    // closeLabel is the close button's aria-label and defaults in the section
    // component. It describes a control, not the business.
    openHint: "See what to do",
    items: [
      {
        title: "No Heat or No Cooling",
        body: "The system runs but the home is not holding temperature, and adjusting the thermostat no longer changes anything.",
        panelHeading: "Get the system looked at today",
        panelBody:
          "A system that runs without reaching temperature usually points to airflow, refrigerant, or a control problem. Describe what changed and when, and the office will confirm the soonest realistic visit window before anything is scheduled.",
        actionLabel: "Request urgent service",
        actionHref: "/contact",
      },
      {
        title: "Uneven or Weak Airflow",
        body: "Some rooms never match the rest of the house, and the vents in those rooms barely move air even while the system runs.",
        panelHeading: "Find out what is restricting the air",
        panelBody:
          "Rooms that stay warmer or cooler than the rest of the home usually trace back to duct condition, filter restriction, or an undersized system. A technician measures airflow room by room before recommending any change.",
        actionLabel: "Book an airflow check",
        actionHref: "/contact",
      },
      {
        title: "New Noises or Short Cycling",
        body: "The system sounds different than it used to, or it starts and stops again within a few minutes of beginning a cycle.",
        panelHeading: "Have the change checked before it grows",
        panelBody:
          "New sounds and frequent cycling are early signals, and they are far cheaper to address before the system fails outright. Note when the change started and the visit can focus on the components most likely responsible.",
        actionLabel: "Schedule a diagnostic",
        actionHref: "/contact",
      },
      {
        title: "Planning a Replacement",
        body: "The equipment is aging and still running, but you want the repair and replacement options in writing before deciding.",
        panelHeading: "Compare repair and replacement side by side",
        panelBody:
          "Older equipment does not always need replacing right away. You get the current condition, the realistic remaining life, and written pricing for both paths, so the decision can wait until it makes sense for the household.",
        actionLabel: "Request a written quote",
        actionHref: "/contact",
      },
      // Cards five and six exist for the three-across arrangement, which runs
      // to two full rows. The two-across arrangement slices to four and never
      // sees them, so its demo output is unchanged.
      {
        title: "Rising Utility Bills",
        body: "Nothing about the household has changed, but the heating or cooling portion of the bill keeps climbing month over month.",
        panelHeading: "Find where the efficiency went",
        panelBody:
          "A system losing efficiency runs longer to reach the same temperature, and the bill is usually the first place it shows. A technician checks refrigerant charge, airflow, and cycle times to identify what is costing the extra runtime.",
        actionLabel: "Book an efficiency check",
        actionHref: "/contact",
      },
      {
        title: "Humidity or Air Quality",
        body: "The house feels damp or stuffy even at the right temperature, or dust returns almost immediately after cleaning.",
        panelHeading: "Treat the air, not just the temperature",
        panelBody:
          "Comfort problems that persist at the correct temperature usually trace to humidity control, filtration, or ventilation rather than the equipment itself. The visit measures conditions before recommending any equipment change.",
        actionLabel: "Request an air quality visit",
        actionHref: "/contact",
      },
    ],
  },
  serviceCalloutSplitPanel: {
    introHeading: "Start with what the system is actually doing",
    introBody:
      "Most calls start with a symptom rather than a service name, and the right next step depends on which one it is. Choose the description that matches what you are seeing at home and this panel will explain what usually causes it and what the visit involves.",
    openHint: "See what to do",
    items: [
      {
        title: "No Heat or No Cooling",
        body: "The system runs but the home is not holding temperature.",
        panelHeading: "Get the system looked at today",
        panelBody:
          "A system that runs without reaching temperature usually points to airflow, refrigerant, or a control problem. Describe what changed and when, and the office will confirm the soonest realistic visit window before anything is scheduled.",
        actionLabel: "Request urgent service",
        actionHref: "/contact",
      },
      {
        title: "Uneven or Weak Airflow",
        body: "Some rooms never match the rest of the house.",
        panelHeading: "Find out what is restricting the air",
        panelBody:
          "Rooms that stay warmer or cooler than the rest of the home usually trace back to duct condition, filter restriction, or an undersized system. A technician measures airflow room by room before recommending any change.",
        actionLabel: "Book an airflow check",
        actionHref: "/contact",
      },
      {
        title: "New Noises or Short Cycling",
        body: "The system sounds different or cycles too often.",
        panelHeading: "Have the change checked before it grows",
        panelBody:
          "New sounds and frequent cycling are early signals, and they are far cheaper to address before the system fails outright. Note when the change started and the visit can focus on the components most likely responsible.",
        actionLabel: "Schedule a diagnostic",
        actionHref: "/contact",
      },
      {
        title: "Planning a Replacement",
        body: "The equipment is aging and you want options in writing.",
        panelHeading: "Compare repair and replacement side by side",
        panelBody:
          "Older equipment does not always need replacing right away. You get the current condition, the realistic remaining life, and written pricing for both paths, so the decision can wait until it makes sense for the household.",
        actionLabel: "Request a written quote",
        actionHref: "/contact",
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
        title: "Clear Recommendations",
        body: "Repair, maintenance, and replacement guidance based on the home, budget, and timing.",
      },
      {
        title: "Repair-First Approach",
        body: "Explain what is happening, what can wait, and what needs attention now.",
      },
      {
        title: "Fast Response",
        body: "Keep scheduling practical with clear next steps and responsive appointment windows.",
      },
      {
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
        title: "Clear Recommendations",
        body: "Repair, maintenance, and replacement guidance based on the home, budget, and timing.",
      },
      {
        title: "Repair-First Approach",
        body: "Explain what is happening, what can wait, and what needs attention now.",
      },
      {
        title: "Fast Response",
        body: "Keep scheduling practical with clear next steps and responsive appointment windows.",
      },
      {
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
  sectionHeaderSplitLink: {
    title: "Two clear paths after the inspection.",
    body: "Compare what each path involves before deciding, so the choice rests on the system's condition rather than on pressure.",
    actionLabel: "Compare options",
  },
  decisionSplitLargeCards: {
    cards: [
      {
        eyebrow: "Repair",
        title: "Stabilize the current system",
        paragraphs: [
          "Use this card for practical repair guidance, short-term reliability, and what the homeowner should watch after the visit.",
          "A second chunk can cover what the repair does not address, so the homeowner knows which conditions would change the recommendation.",
        ],
        actionLabel: "Talk through a repair",
      },
      {
        eyebrow: "Replace",
        title: "Plan the longer-term move",
        paragraphs: [
          "Use this card for replacement fit, estimate timing, financing notes, and the conditions that make upgrade planning useful.",
          "Keep the chunks roughly level with the other card, so the pair reads as a comparison rather than a recommendation with a footnote.",
        ],
        actionLabel: "Explore replacement options",
      },
    ],
  },
  decisionSplitDecisionLarge: {
    cards: [
      {
        eyebrow: "Repair path",
        title: "Keep the current system working well.",
        paragraphs: [
          "Repair can be the right next step when the issue is contained and the rest of the system is operating dependably.",
          "A clear recommendation should explain what is being fixed now, what to monitor, and what outcome to expect.",
        ],
        points: [
          "The repair solves the current issue directly.",
          "The remaining system condition supports more useful service life.",
          "The cost fits the expected reliability after the visit.",
        ],
        actionLabel: "Talk through a repair",
      },
      {
        eyebrow: "Replacement path",
        title: "Plan the next system with more context.",
        paragraphs: [
          "Replacement is worth comparing when recent repairs, comfort concerns, and system condition point to a less dependable future.",
          "The goal is not to force an upgrade—it is to make the longer-term tradeoffs visible before a decision is urgent.",
        ],
        points: [
          "Review capacity, comfort goals, and current operating costs.",
          "Compare repair investment with the expected remaining service life.",
          "Build an estimate around the home, not just the equipment label.",
        ],
        actionLabel: "Explore replacement options",
      },
    ],
  },
  decisionQuestionTable: {
    eyebrow: "Service prep",
    title: "Before the visit, three details help",
    body: "You do not need to diagnose the problem. These details simply give the technician a clearer starting point.",
    columns: [
      {
        title: "What changed?",
        options: ["No cooling", "Weak airflow", "New sound"],
      },
      {
        title: "When did it start?",
        options: ["Suddenly", "Gradually", "After a restart"],
      },
      {
        title: "Is it running?",
        options: ["Running normally", "Running partly", "Not starting"],
      },
    ],
  },
  decisionQuestionTableFour: {
    columns: [
      {
        title: "What changed?",
        options: ["No cooling", "Weak airflow", "New sound"],
      },
      {
        title: "When did it start?",
        options: ["Suddenly", "Gradually", "After a restart"],
      },
      {
        title: "Is it running?",
        options: ["Running normally", "Running partly", "Not starting"],
      },
      {
        title: "Where is it worst?",
        options: ["One room", "Upstairs only", "The whole home"],
      },
    ],
  },
  decisionMatrixCard: {
    align: "left" as const,
    eyebrow: "Maintenance visit",
    title: "What may be reviewed during the visit?",
    body: "A simple matrix for showing the areas a technician may review without turning the visit into a rigid checklist.",
    quadrants: [
      {
        title: "System controls",
        items: ["Thermostat operation", "General response"],
      },
      {
        title: "Airflow",
        items: ["Filter condition", "General airflow review"],
      },
      {
        title: "Visible equipment",
        items: ["Outdoor-unit review", "Accessible components"],
      },
      {
        title: "System performance",
        items: ["General operation", "Notable changes"],
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
  processStrip: {
    steps: [
      {
        title: "Review the system",
        body: "We evaluate your HVAC system and discuss your comfort goals.",
      },
      {
        title: "Get project options",
        body: "You receive clear options and pricing for the project.",
      },
      {
        title: "Apply for financing",
        body: "Apply in minutes through the current secure lender process.",
      },
      {
        title: "Schedule the work",
        body: "Once approved, the team confirms installation or repair timing.",
      },
    ],
  },
  processStepsStaggered: {
    eyebrow: "Process",
    title: "A clear path from the first change to the next step.",
    body: "Move from the change you noticed to a clear diagnosis, exact pricing, and an approved next step.",
    steps: [
      {
        title: "Describe the change",
        body: "What stopped working, what still works, and when it began.",
      },
      {
        title: "Inspect the system",
        body: "Review the current operation and identify what needs attention.",
      },
      {
        title: "Explain the findings",
        body: "Understand the problem, the proposed scope, and the available options.",
      },
      {
        title: "Review pricing",
        body: "Exact repair pricing follows diagnosis rather than an online guess.",
      },
      {
        title: "Approve the next step",
        body: "Choose whether to proceed with the recommended work.",
      },
    ],
  },
  processStepsBranching: {
    title: "From a cold home to a clear next step",
    steps: [
      {
        title: "Understand the heat loss",
        body: "How much heat remains, what changed, and whether the concern affects the whole home.",
      },
      {
        title: "Inspect the system",
        body: "Review current operation and identify what needs attention before pricing is discussed.",
      },
      {
        title: "Explain the findings",
        body: "Understand the problem, repair scope, and any broader condition concerns.",
      },
    ],
    outcomes: [
      {
        title: "Repair",
        body: "Address the current problem.",
      },
      {
        title: "Larger decision",
        body: "Discuss ongoing care or replacement.",
      },
    ],
  },
  infoStrip: {
    cardLabel: "Gas odor · Smoke or fire · Carbon monoxide alarm",
    body: "Leave the home immediately. Once outside, call 911. If you suspect a gas leak, also contact your gas utility. Do not wait for an HVAC appointment.",
  },
  contactStripSmall: {
    phoneLabel: "Call us",
    phone: "(704) 555-0184",
    emailLabel: "Email us",
    email: "service@northstarhvac.com",
    hoursLabel: "Office hours",
    hours: "Mon–Fri · 7:00 AM–6:00 PM\nSat · 8:00 AM–2:00 PM",
    afterHoursLabel: "After hours",
    afterHoursBody:
      "Leave a message and we follow up when the office reopens. For an urgent safety concern, call 911.",
    locationLabel: "Visit us",
    address: "123 Commerce Drive\nHuntersville, NC 28078",
  },
  contactStripBento: {
    phoneLabel: "Call us",
    phone: "(704) 555-0184",
    emailLabel: "Email us",
    email: "service@northstarhvac.com",
    hoursLabel: "Office hours",
    hours: "Monday–Friday · 7:00 AM–6:00 PM\nSaturday · 8:00 AM–2:00 PM",
    afterHoursLabel: "After-hours support",
    afterHoursBody:
      "Leave a message after hours and our team will follow up when the office reopens. For an urgent safety concern, call 911.",
    locationLabel: "Visit our office",
    address: "123 Commerce Drive\nHuntersville, NC 28078",
  },
  financingCalculator: {
    title: "Estimate a Monthly Payment",
    body: "See how financing could fit your project budget before you request a replacement quote.",
    // The control and result labels are fixed UI chrome and default inside
    // FinancingCalculatorSectionV3. Holding them here made them demo content
    // the mapper spread onto client pages with no field to author them.
    projectTimingDisclosure:
      "Financing approval does not confirm project scope, equipment availability, or installation timing.",
    fallbackMessage:
      "Ask the team about current financing options for qualifying HVAC projects.",
    primaryAction: "Request a Replacement Quote",
    primaryActionHref: "/contact",
    secondaryAction: "Ask About Financing",
    secondaryActionHref: "/contact",
    program: northStarFinancingProgram,
  },
  processImageChecklist: {
    eyebrow: "How it works",
    title: "A prepared visit starts before anyone reaches the door.",
    body: "Use this process pattern when the page needs a quieter explanation with supporting checklist details that arrive after the main message has time to land.",
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
  faqAccordionSidebar: {
    align: "right" as const,
    title: "Still have questions?",
    subhead:
      "Most homeowners have a few practical questions before scheduling. Reach out directly if the answer isn't here.",
    primaryAction: "Contact the team",
    primaryActionHref: "/contact",
    items: [
      {
        question: "Do you provide estimates before work begins?",
        answer:
          "Yes. Customers receive a clear scope, pricing guidance, and an approval point before paid work starts.",
      },
      {
        question: "What areas do you serve?",
        answer:
          "This placeholder can be adapted for city, county, or neighborhood coverage tied to the approved service area.",
      },
      {
        question: "Can customers book recurring maintenance?",
        answer:
          "Yes. This pattern supports one-time visits and recurring service plans, with room for seasonal tune-up scheduling.",
      },
      {
        question: "How quickly can someone schedule service?",
        answer:
          "Availability depends on the service type and current schedule; use this answer for typical response windows.",
      },
    ],
  },
  cta: {
    title: "Ready to turn interest into a booked service call?",
    body: "Use this section near the end of a page to move visitors toward the primary conversion.",
    action: "Start a request",
  },
  ctaImage: {
    eyebrow: "Ready when you are",
    title: "Book the visit that matches the problem.",
    body: "Share what the system is doing now and the office will confirm the right service path, timing, and pricing before any work begins.",
    action: "Start a request",
    secondaryAction: "Explore services",
    secondaryActionHref: "#services",
    imageAlt: "Technician arriving for a scheduled service visit",
    imageSrc: "/images/fpo-image.svg",
  },
  ctaSmallBandImage: {
    action: "Request a replacement quote",
    body: "Let’s find the right solution for your home and your budget.",
    imageAlt: "New HVAC equipment arriving for a residential installation",
    imageSrc: "/images/hvac-unit-truck-wide.png",
    title: "Start with the HVAC project",
  },
  ctaServiceTriage: {
    serviceTitle: "Need service?",
    serviceBody:
      "Choose the path that best matches your system, then continue through the request flow.",
    serviceChoices: [
      {
        label: "AC repair",
        prefill: { requestType: "repair" as const, systemType: "cooling" as const },
      },
      {
        label: "Heating repair",
        prefill: { requestType: "repair" as const, systemType: "heating" as const },
      },
      {
        label: "AC tune-up",
        prefill: { requestType: "maintenance" as const, systemType: "cooling" as const },
      },
      {
        label: "Heating tune-up",
        prefill: { requestType: "maintenance" as const, systemType: "heating" as const },
      },
    ],
    serviceAction: "Start service request",
    urgentTitle: "Not working now?",
    urgentBody: "Urgent heating or cooling issues should call the office directly.",
    urgentPhone: "704-555-0184",
    urgentAction: "Call for urgent service",
    urgentHelper: "For immediate help, please call.",
    customerTitle: "Already a customer?",
    customerBody:
      "Reschedule, ask about an invoice, or follow up on recently completed work.",
    customerAction: "Use the message form below",
    customerActionHref: "#contact",
    customerHelper: "We’re happy to help.",
  },
  featuredOffer: {
    action: "Request the tune-up",
    bannerLabel: "Featured offer",
    benefitBody:
      "Prevent surprise breakdowns, improve efficiency, and stay comfortable through the season.",
    benefitTitle: "A more dependable system starts here.",
    bullets: [
      "Thermostat check",
      "Filter check",
      "Airflow review",
      "Outdoor-unit inspection",
      "General system performance check",
    ],
    dateLabel: "Valid dates",
    dateValue: "Limited seasonal availability",
    eyebrow: "Spring service special",
    heading: "Spring AC tune-up special",
    imageAlt: "Outdoor air conditioning unit beside a home",
    imageSrc: "/images/fpo-image.svg",
    includesLabel: "Includes",
    priceLabel: "Offer price",
    priceValue: "$89",
    terms: "Terms and availability apply.",
  },
  additionalOffers: {
    offers: [
      {
        action: "View offer",
        badge: "Planning",
        body: "Plan ahead with a system evaluation and clear recommendations.",
        dateLabel: "Valid dates",
        dateValue: "Needs review",
        title: "Replacement planning offer",
      },
      {
        action: "View offer",
        badge: "Upcoming",
        body: "Check back soon for the next approved seasonal promotion.",
        dateLabel: "Valid dates",
        dateValue: "Needs review",
        title: "Future seasonal offer",
      },
      {
        action: "View offer",
        badge: "Home comfort",
        body: "Ask about an indoor comfort evaluation for rooms that feel uneven through the season.",
        dateLabel: "Valid dates",
        dateValue: "Needs review",
        title: "Whole-home comfort offer",
      },
    ],
  },
  offerTerms: {
    detailsHeading: "Offer details",
    details: [
      { label: "Valid through", value: "May 31, 2026" },
      { label: "Eligible systems", value: "One residential central AC system" },
      { label: "Service area", value: "Huntersville, Cornelius, Davidson, and Mooresville" },
      { label: "Exclusions", value: "Repairs, parts, refrigerant, and after-hours service" },
      { label: "Combining offers", value: "Cannot be combined with other discounts" },
    ],
    stepsHeading: "What happens next",
    steps: [
      {
        title: "Submit your request",
        body: "Tell us your ZIP code, system type, and preferred timing.",
      },
      {
        title: "We confirm the offer",
        body: "We verify eligibility, address, and current availability.",
      },
      {
        title: "We schedule the visit",
        body: "Our team reaches out to lock in a convenient appointment window.",
      },
      {
        title: "We perform the tune-up",
        body: "Your technician completes the included checks and explains any findings.",
      },
    ],
    assuranceBody:
      "Submitting a request does not reserve promotional availability. Your appointment is confirmed after our team contacts you.",
    action: "Request this offer",
  },
  horizontalCardLinkGrid: {
    heading: "Related services",
    linkLabel: "View service",
    items: [
      {
        title: "Maintenance & Tune-Ups",
        body: "Keep your system running efficiently year-round.",
        href: "/services/maintenance",
        imageAlt: "Technician performing seasonal HVAC maintenance",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "AC Repair",
        body: "Fast, reliable repairs to restore your comfort.",
        href: "/services/ac-repair",
        imageAlt: "Technician repairing residential cooling equipment",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "System Replacement",
        body: "High-efficiency solutions built for your home.",
        href: "/services/system-replacement",
        imageAlt: "High-efficiency outdoor HVAC system",
        imageSrc: "/images/fpo-image.svg",
      },
    ],
  },
  horizontalCardLinkGridTwoUp: {
    heading: "Related services",
    linkLabel: "View service",
    items: [
      {
        title: "AC Repair",
        body: "Fast, reliable repairs to restore dependable home comfort.",
        href: "/services/ac-repair",
        imageAlt: "Technician repairing residential cooling equipment",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        title: "Maintenance & Tune-Ups",
        body: "Seasonal system care that helps equipment run efficiently year-round.",
        href: "/services/maintenance",
        imageAlt: "Technician performing seasonal HVAC maintenance",
        imageSrc: "/images/fpo-image.svg",
      },
    ],
  },
  ctaMuted: {
    title: "Ready to turn interest into a booked service call?",
    body: "Use this section near the end of a page to move visitors toward the primary conversion.",
    action: "Start a request",
    // Shown here so the library preview demonstrates the option. Staged pages
    // only render it when the page copy actually supplies a label - the props
    // mapper falls back to empty, not to this.
    secondaryAction: "Call the office",
    secondaryActionHref: "/contact",
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
    successTitle: "We service your area.",
    successBody: "Send the request and the team will confirm timing.",
    successActionLabel: "Request service",
    successActionHref: "/contact",
    // inputLabel, inputPlaceholder, submitLabel and mapLabel are form furniture
    // and default inside ServiceAreaZipLookupSectionV3.
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
        label: "Text 6 / Image 7",
        variant: "text-3-image-4-right",
      },
      {
        label: "Text 7 / Image 6",
        variant: "text-4-image-3-right",
      },
      {
        label: "Image 6 / Text 7",
        variant: "image-3-left-text-4",
      },
      {
        label: "Image 7 / Text 6",
        variant: "image-4-left-text-3",
      },
    ],
  },
  heroServiceAreaZipLookup: {
    eyebrow: "Service area",
    title: "Do we come to your home?",
    body: "Enter your ZIP code to see whether your address is within our regular or availability-based service area.",
    inputLabel: "ZIP code lookup",
    inputPlaceholder: "ZIP code",
    submitLabel: "Check coverage",
    successTitle: "We service your area.",
    successBody: "Send a request and the team will confirm timing and availability.",
    successActionLabel: "Request service",
    successActionHref: "/contact",
    serviceAreaText:
      "Serving Huntersville, Cornelius, Davidson, Mooresville, and nearby Lake Norman communities.",
    imageAlt: "Local service van parked in a residential neighborhood",
    imageSrc: "/images/fpo-image.svg",
  },
  contentSplitFixedImage: {
    eyebrow: "Guidance before the work",
    title: "Recommendations based on the system itself.",
    paragraphs: [
      "A useful recommendation begins with the equipment, the current problem, and what makes sense for the home before any work is proposed.",
      "That order keeps the conversation grounded in the system's actual condition instead of a generic sales script.",
    ],
    bullets: [
      "Diagnosis before pricing",
      "Repair explained when it's practical",
      "Replacement discussed when the evidence supports it",
    ],
    imageAlt: "Technician reviewing equipment with a homeowner",
    imageSrc: "/images/fpo-image.svg",
    primaryAction: "Request service",
    secondaryAction: "View services",
    secondaryActionHref: "#services",
    stats: [],
  },
  contentSplitFullImage: {
    eyebrow: "How the work gets done",
    title: "The crew that shows up is the crew that finishes.",
    paragraphs: [
      "Every visit is run by a technician who has seen the system before, or who has the full history in front of them when they arrive. Nothing gets handed off mid-job to someone starting from scratch.",
      "That continuity is why the second visit is usually shorter than the first, and why the estimate you approve is the one you end up paying.",
    ],
    bullets: [
      "One technician owns the job start to finish",
      "Full service history on every visit",
      "Written scope before any work begins",
    ],
    imageAlt: "Technician working on a rooftop unit",
    imageSrc: "/images/fpo-image.svg",
    primaryAction: "Request service",
    secondaryAction: "View services",
    secondaryActionHref: "#services",
    stats: [],
  },
  featurePortraitParagraph: {
    contentAlignX: "left" as const,
    contentAlignY: "middle" as const,
    body: "A large portrait image gives the section a clear visual anchor while the adjacent paragraph carries the main service idea with enough room to feel editorial, direct, and easy to read.",
  },
  serviceNeedsPriorityGrid: {
    eyebrow: "Common heat pump needs",
    title: "What are you experiencing?",
    body: "Start with the problem—not an assumption about the solution.",
    linkLabel: "View options",
    priorityEyebrow: "Emergency Service",
    primaryAction: "Request urgent service",
    primaryActionHref: "/contact",
    secondaryAction: "Call with questions",
    secondaryActionHref: "tel:7045550184",
    items: [
      { title: "Weak or Uneven Performance", body: "Some rooms feel different or airflow feels limited.", href: "/services" },
      { title: "Unusual Operation", body: "New sounds, frequent cycling, or other changes need a closer look.", href: "/services" },
      { title: "Planning Ahead", body: "You are considering care, repair, or replacement.", href: "/services" },
      { title: "No Heating and Cooling", body: "If the system has stopped heating or cooling the home, start here. Share what changed, when the problem began, and whether the equipment is still running so the team can help identify the right next step.", href: "/contact" },
    ],
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
  contentThreeColumnMixed: {
    align: "left" as const,
    ctaEyebrow: "Start here",
    ctaTitle: "Book the visit that matches the problem.",
    ctaBody:
      "Share what the system is doing now and the team will confirm the right service path, timing, and pricing before any work begins.",
    primaryAction: "Request service",
    primaryActionHref: "/contact",
    secondaryAction: "Call the office",
    secondaryActionHref: "tel:7045550184",
    longformTitle: "What to expect on the first visit",
    longformIntro:
      "Every visit starts the same way: a full look at the system before anyone talks about parts, pricing, or replacement.",
    longformBody:
      "A technician walks the equipment end to end, checks airflow, refrigerant behavior, and electrical connections, then explains what they find in plain terms. If something looks worn but is still working, you hear that too, along with how much life is realistically left in it.",
    longformDetail:
      "Nothing is taken apart before you have seen the findings and approved a written price. If the repair turns out to be larger than expected once work begins, the technician stops and walks you through the revised options rather than pushing ahead.",
    longformPoints: [
      "Full system inspection",
      "Written price before work",
      "Repair and replace options",
      "Same-day scheduling",
      "Licensed and insured techs",
      "Workmanship guarantee",
    ],
    longformLead:
      "Most visits end with a clear recommendation, a written estimate, and no pressure to decide on the spot.",
    linkLabel: "Learn more",
    images: [
      {
        imageAlt: "Technician inspecting an outdoor heat pump unit",
        imageSrc: "/images/fpo-image.svg",
      },
      {
        imageAlt: "Indoor air handler during a maintenance visit",
        imageSrc: "/images/fpo-image.svg",
      },
    ],
    links: [
      {
        title: "Repair",
        body: "Diagnose the current issue and review practical options.",
        href: "/services",
      },
      {
        title: "Maintenance",
        body: "Keep seasonal service and system care on schedule.",
        href: "/services",
      },
      {
        title: "Replacement",
        body: "Compare repair and replacement paths for older equipment.",
        href: "/services",
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
      { label: "Fullscreen image hero", component: "hero-fullscreen-v2" },
      {
        label: "Centered hero with floaters",
        component: "hero-centered-floaters-v2",
      },
      {
        label: "Content top, image bottom hero",
        component: "hero-content-top-image-bottom-v2",
      },
      {
        label: "Full image split",
        component: "hero-split-full-height-v3",
      },
      {
        label: "Service area ZIP lookup",
        component: "hero-service-area-zip-lookup-v3",
      },
      {
        label: "Fixed-ratio split",
        component: "hero-split-fixed-image-v3",
      },
      {
        label: "Fixed-ratio split bento",
        component: "hero-split-bento-v3",
      },
      {
        label: "Compact hero",
        component: "hero-compact-v3",
      },
      {
        label: "Services hero",
        component: "hero-services-v3",
      },
      {
        label: "Compact service hero",
        component: "hero-compact-service-v3",
      },
    ],
  },
  {
    title: "Section Headers",
    items: [
      {
        label: "Section header content",
        component: "section-header-compact-v3",
      },
      {
        label: "Section Header Simple",
        component: "section-header-large-v3",
      },
      {
        label: "Split link header",
        component: "section-header-split-link-v3",
      },
    ],
  },
  {
    title: "Scan",
      items: [
        { label: "Card links 4-up", component: "four-card-link-grid-v3" },
        { label: "Card links 3-up", component: "three-card-link-grid-v3" },
        {
          label: "Horizontal card links 3-up",
          component: "horizontal-card-link-grid-v3",
        },
        {
          label: "Horizontal card links 2-up",
          component: "horizontal-card-link-grid-two-up-v3",
        },
        { label: "Service needs priority grid", component: "service-needs-priority-grid-v3" },
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
        label: "Main idea support grid",
        component: "content-main-idea-grid-v3",
      },
      {
        label: "About company",
        component: "content-about-company-v2",
      },
      {
        label: "Editorial 3-col",
        component: "content-about-story-v3",
      },
      {
        label: "Longform with feature rail",
        component: "content-narrative-feature-rail-v3",
      },
      {
        label: "Card content 2-up",
        component: "content-card-two-up-v3",
      },
      {
        label: "Mixed content 3-col",
        component: "content-three-column-mixed-v3",
      },
      {
        label: "Split headline image",
        component: "content-split-headline-image-v2",
      },
      {
        label: "Fixed-ratio split",
        component: "content-split-fixed-image-v3",
      },
      {
        label: "Full image split",
        component: "content-split-full-image-v3",
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
        label: "Feature cards 4-up split",
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
      {
        label: "Project case study gallery",
        component: "project-case-study-gallery-v3",
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
      { label: "Trust marquee", component: "trust-marquee-v3" },
      { label: "Trust logo marquee", component: "trust-logo-marquee-v3" },
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
      {
        label: "Decision split large cards",
        component: "decision-split-large-cards-v3",
      },
      {
        label: "Split decision large",
        component: "decision-split-decision-large-v3",
      },
      {
        label: "Table compare 3 col",
        component: "decision-question-table-v3",
      },
      {
        label: "Table compare 4 col",
        component: "decision-question-table-four-v3",
      },
      {
        label: "Matrix card",
        component: "decision-matrix-card-v3",
      },
      { label: "Offer terms", component: "offer-terms-v3" },
      { label: "Process steps", component: "process-steps-v3" },
      { label: "Process strip", component: "process-strip-v3" },
      {
        label: "Process steps staggered",
        component: "process-steps-staggered-v3",
      },
      {
        label: "Process steps branching",
        component: "process-steps-branching-v3",
      },
      {
        label: "Process image checklist",
        component: "process-image-checklist-v3",
      },
      {
        label: "Callout cards with reveal panel",
        component: "service-callout-reveal-grid-v3",
      },
      {
        label: "Callout cards with side panel",
        component: "service-callout-split-panel-v3",
      },
    ],
  },
  {
    title: "Utility",
    items: [
      { label: "Info strip", component: "info-strip-v3" },
      { label: "Contact strip bento", component: "contact-strip-bento-v3" },
      { label: "Contact strip small", component: "contact-strip-small-v3" },
      {
        label: "Financing calculator",
        component: "financing-calculator-v3",
      },
      { label: "FAQ", component: "faq-v3" },
      { label: "FAQ accordion", component: "faq-accordion-v3" },
      {
        label: "FAQ accordion sidebar",
        component: "faq-accordion-sidebar-v3",
      },
      {
        label: "Thank you confirmation",
        component: "thank-you-confirmation-v3",
      },
      {
        label: "Service area zip lookup",
        component: "service-area-zip-lookup-v3",
      },
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
        label: "CTA headline with scrolling banner",
        component: "trust-marquee-legacy",
      },
      { label: "CTA", component: "cta-v3" },
      { label: "CTA with image", component: "cta-image-v3" },
      {
        label: "CTA small band with image",
        component: "cta-small-band-image-v3",
      },
      {
        label: "Service Request Catch-all",
        component: "cta-service-triage-v3",
      },
      { label: "Featured offer", component: "featured-offer-v3" },
      { label: "Additional offers", component: "additional-offers-v3" },
      { label: "Muted CTA", component: "cta-muted-v3" },
      {
        label: "CTA fullscreen conversion",
        component: "cta-fullscreen-v3",
      },
      {
        label: "CTA scroll reveal offer conversion",
        component: "cta-scroll-reveal-offer-v3",
      },
      {
        label: "CTA fixed cover fade",
        component: "content-fixed-cover-fade-v2",
      },
      {
        label: "Contact section modal begin",
        component: "contact-modal-begin-v3",
      },
      { label: "Contact section", component: "contact-v3" },
    ],
  },
] as const;

export type SectionLibraryV3Slug =
  (typeof sectionLibraryV3Collections)[number]["items"][number]["component"];

/**
 * Pure cross-surface identity map. Library previews use kebab-case slugs while
 * pagebuilder recipes and persisted templates use PascalCase component names.
 * Keeping that relationship here lets UI labels change without rewriting the
 * persisted `name` that drives section ids and copy-contract fingerprints.
 */
export const sectionLibraryV3ComponentBySlug = {
  "nav-primary-v2": "NavPrimarySectionV2",
  "nav-center-logo-v2": "NavCenterLogoSectionV2",
  "nav-floating-bento-v2": "NavFloatingBentoSectionV2",
  "hero-fullscreen-v2": "HeroFullscreenSectionV2",
  "hero-centered-floaters-v2": "HeroCenteredFloatersSectionV2",
  "hero-content-top-image-bottom-v2": "HeroContentTopImageBottomSectionV2",
  "hero-split-full-height-v3": "HeroSplitFullHeightSectionV3",
  "hero-service-area-zip-lookup-v3": "HeroServiceAreaZipLookupSectionV3",
  "hero-split-fixed-image-v3": "HeroSplitFixedImageSectionV3",
  "hero-split-bento-v3": "HeroSplitBentoSectionV3",
  "hero-compact-v3": "HeroCompactSectionV3",
  "hero-services-v3": "HeroServicesSectionV3",
  "hero-compact-service-v3": "HeroCompactServiceSectionV3",
  "section-header-compact-v3": "SectionHeaderCompactSectionV3",
  "section-header-large-v3": "SectionHeaderLargeSectionV3",
  "section-header-split-link-v3": "SectionHeaderSplitLinkSectionV3",
  "four-card-link-grid-v3": "FourCardLinkGridSectionV3",
  "three-card-link-grid-v3": "ThreeCardLinkGridSectionV3",
  "horizontal-card-link-grid-v3": "HorizontalCardLinkGridSectionV3",
  "horizontal-card-link-grid-two-up-v3":
    "HorizontalCardLinkGridTwoUpSectionV3",
  "service-needs-priority-grid-v3": "ServiceNeedsPriorityGridSectionV3",
  "service-callout-reveal-grid-v3": "ServiceCalloutRevealGridSectionV3",
  "service-callout-split-panel-v3": "ServiceCalloutSplitPanelSectionV3",
  "content-horizontal-card-carousel-v2":
    "ContentHorizontalCardCarouselSectionV2",
  "quick-page-links-v2": "QuickPageLinksSectionV2",
  "services-three-cards-right-v3": "ServicesThreeCardsRightSectionV3",
  "services-bento-cards-v2": "ServicesBentoCardsSectionV2",
  "services-hover-panel-v2": "ServicesHoverPanelSectionV2",
  "services-scroll-cards-v2": "ServicesScrollCardsSectionV2",
  "content-reveal-paragraph-v2": "ContentRevealParagraphSectionV2",
  "content-scroll-written-reveal-v2": "ContentScrollWrittenRevealSectionV2",
  "content-sticky-card-stream-v2": "ContentStickyCardStreamSectionV2",
  "content-sticky-ideas-v2": "ContentStickyIdeasSectionV2",
  "content-main-idea-grid-v3": "ContentMainIdeaGridSectionV3",
  "content-about-company-v2": "ContentAboutCompanySectionV2",
  "content-about-story-v3": "ContentAboutStorySectionV3",
  "content-narrative-feature-rail-v3":
    "ContentNarrativeFeatureRailSectionV3",
  "content-card-two-up-v3": "ContentCardTwoUpSectionV3",
  "content-three-column-mixed-v3": "ContentThreeColumnMixedSectionV3",
  "content-split-headline-image-v2": "ContentSplitHeadlineImageSectionV2",
  "content-split-fixed-image-v3": "ContentSplitFixedImageSectionV3",
  "content-split-full-image-v3": "ContentSplitFullImageSectionV3",
  "content-rule-header-v2": "ContentRuleHeaderSectionV2",
  "feature-portrait-paragraph-v3": "FeaturePortraitParagraphSectionV3",
  "feature-overlap-rows-v3": "FeatureOverlapRowsSectionV3",
  "feature-asymmetric-cards-v3": "FeatureAsymmetricCardsSectionV3",
  "feature-stacked-cards-v3": "FeatureStackedCardsSectionV3",
  "image-strip-v3": "ImageStripSectionV3",
  "content-photo-gallery-carousel-v3":
    "ContentPhotoGalleryCarouselSectionV3",
  "content-photo-gallery-large-carousel-v3":
    "ContentPhotoGalleryLargeCarouselSectionV3",
  "project-case-study-gallery-v3": "ProjectCaseStudyGallerySectionV3",
  "trust-bar-v3": "TrustBarSectionV3",
  "trust-bar-floating-bento-v3": "TrustBarFloatingBentoSectionV3",
  "trust-marquee-v3": "TrustMarqueeSectionV3",
  "trust-logo-marquee-v3": "TrustLogoMarqueeSectionV3",
  "trust-logo-grid-v3": "TrustLogoGridSectionV3",
  "testimonials-v3": "TestimonialsSectionV3",
  "testimonials-carousel-v3": "TestimonialsCarouselSectionV3",
  "testimonials-carousel-condensed-v3":
    "TestimonialsCarouselCondensedSectionV3",
  "testimonials-masonry-v3": "TestimonialsMasonrySectionV3",
  "decision-split-decision-v3": "DecisionSplitDecisionSectionV3",
  "decision-split-large-cards-v3": "DecisionSplitLargeCardsSectionV3",
  "decision-split-decision-large-v3":
    "DecisionSplitDecisionLargeSectionV3",
  "decision-question-table-v3": "DecisionQuestionTableSectionV3",
  "decision-question-table-four-v3": "DecisionQuestionTableFourSectionV3",
  "decision-matrix-card-v3": "DecisionMatrixCardSectionV3",
  "offer-terms-v3": "OfferTermsSectionV3",
  "process-steps-v3": "ProcessStepsSectionV3",
  "process-strip-v3": "ProcessStripSectionV3",
  "process-steps-staggered-v3": "ProcessStepsStaggeredSectionV3",
  "process-steps-branching-v3": "ProcessStepsBranchingSectionV3",
  "process-image-checklist-v3": "ProcessImageChecklistSectionV3",
  "info-strip-v3": "InfoStripSectionV3",
  "contact-strip-bento-v3": "ContactStripBentoSectionV3",
  "contact-strip-small-v3": "ContactStripSmallSectionV3",
  "financing-calculator-v3": "FinancingCalculatorSectionV3",
  "faq-v3": "FAQSectionV3",
  "faq-accordion-v3": "FAQAccordionSectionV3",
  "faq-accordion-sidebar-v3": "FAQAccordionSidebarSectionV3",
  "thank-you-confirmation-v3": "ThankYouConfirmationSectionV3",
  "service-area-zip-lookup-v3": "ServiceAreaZipLookupSectionV3",
  "contact-modal-begin-v3": "ContactSectionModalBegin",
  "contact-v3": "ContactSectionV3",
  "footer-v3": "FooterSectionV3",
  "footer-horizontal-v3": "FooterHorizontalSectionV3",
  "footer-compact-v3": "FooterCompactSectionV3",
  "footer-link-panel-v3": "FooterLinkPanelSectionV3",
  "trust-marquee-legacy": "TrustMarqueeSection",
  "cta-v3": "CTASectionV3",
  "cta-image-v3": "CTAImageSectionV3",
  "cta-small-band-image-v3": "CTASmallBandImageSectionV3",
  "cta-service-triage-v3": "CTAServiceTriageSectionV3",
  "featured-offer-v3": "FeaturedOfferSectionV3",
  "additional-offers-v3": "AdditionalOffersSectionV3",
  "cta-muted-v3": "CTAMutedSectionV3",
  "cta-fullscreen-v3": "CTAFullscreenSectionV3",
  "cta-scroll-reveal-offer-v3": "CTAScrollRevealOfferSectionV3",
  "content-fixed-cover-fade-v2": "ContentFixedCoverFadeSectionV2",
} as const satisfies Record<SectionLibraryV3Slug, string>;

export const sectionLibraryV3Registry = sectionLibraryV3Collections.flatMap(
  (collection) =>
    collection.items.map((item) => ({
      component: sectionLibraryV3ComponentBySlug[item.component],
      family: collection.title,
      label: item.label,
      slug: item.component,
    })),
);

const sectionLibraryV3EntryByComponent = new Map<
  string,
  (typeof sectionLibraryV3Registry)[number]
>(
  sectionLibraryV3Registry.map((entry) => [entry.component, entry]),
);

export function getCanonicalSectionLabel(
  component: string,
  fallbackLabel: string,
) {
  return sectionLibraryV3EntryByComponent.get(component)?.label ?? fallbackLabel;
}
