export const createdPagesIndexContent = {
  eyebrow: "Pageworks / Created Pages",
  title: "Created Pages",
  body: "Baked WIP pages generated from Pagebuilder instructions. These pages are normal route files with concrete section composition and page-specific content.",
  pages: [
    {
      label: "homepage1",
      href: "/created-pages/homepage1",
      status: "WIP",
      sourceRecipe: "classic-service",
      summary:
        "Balanced local service homepage with clear navigation, bento hero, immediate proof, service cards, FAQ, and contact.",
      sections: [
        "NavPrimarySectionV2",
        "HeroBentoSectionV2",
        "TrustBarSection",
        "ServicesGridSectionV2",
        "ContentPositioningSplitSectionV2",
        "FAQSectionV2",
        "ContactSectionV2",
      ],
    },
    {
      label: "homepage2",
      href: "/created-pages/homepage2",
      status: "WIP",
      sourceRecipe: "premium-trust",
      summary:
        "Image-led homepage with premium pacing, editorial proof, service browsing, customer stories, process clarity, and a cinematic close.",
      sections: [
        "NavFloatingBentoSectionV2",
        "HeroFullscreenSectionV2",
        "ContentRevealParagraphSectionV2",
        "ContentSplitHeadlineImageSectionV2",
        "ServicesScrollCardsSectionV2",
        "TestimonialsCarouselSectionV2",
        "ProcessImageChecklistSectionV2",
        "CTAFullscreenSectionV2",
      ],
    },
    {
      label: "about",
      href: "/created-pages/about",
      status: "WIP",
      sourceRecipe: "conversion-heavy",
      summary:
        "About page focused on trust, preparedness, response expectations, team credibility, and clear contact paths.",
      sections: [
        "NavCenterLogoSectionV2",
        "HeroCenteredFloatersSectionV2",
        "TrustBarSection",
        "ServicesScrollCardsSectionV2",
        "ContentStickyCardStreamSectionV2",
        "FAQAccordionSectionV2",
        "ContactSectionV2",
      ],
    },
    {
      label: "services",
      href: "/created-pages/services",
      status: "WIP",
      sourceRecipe: "editorial-local",
      summary:
        "Services overview page with a mosaic first view, comparison-friendly service paths, supporting ideas, proof, and offer close.",
      sections: [
        "NavPrimarySectionV2",
        "HeroGridMosaicSectionV2",
        "ContentRevealParagraphSectionV2",
        "ContentStickyIdeasSectionV2",
        "ContentAboutCompanySectionV2",
        "TrustLogoGridSection",
        "TestimonialsMasonrySectionV2",
        "CTAScrollRevealOfferSectionV2",
      ],
    },
    {
      label: "individual service page",
      href: "/created-pages/individual-service-page",
      status: "WIP",
      sourceRecipe: "compact-utility",
      summary:
        "Single-service page for repair visits with direct copy, proof marquee, service rail, short explanation, FAQ, and footer.",
      sections: [
        "NavFloatingBentoSectionV2",
        "HeroContentTopImageBottomSectionV2",
        "TrustMarqueeSection",
        "ServicesScrollCardsSectionV2",
        "ContentRuleHeaderSectionV2",
        "FAQSectionV2",
        "FooterSectionV2",
      ],
    },
  ],
};

export const createdHomepage1Content = {
  source: {
    sourceStage: "pagebuilder",
    sourceDesign: "homepage1",
    sourceRecipe: "classic-service",
    createdAt: "2026-06-07",
    status: "created-page-wip",
  },
  nav: {
    logoLabel: "Northstar",
    phone: "(555) 014-2250",
    action: "Schedule now",
    links: [
      {
        label: "Services",
        items: ["Repair visits", "Maintenance plans", "Installations", "Inspections"],
      },
      {
        label: "Service areas",
        items: ["Nashville", "Franklin", "Brentwood", "Murfreesboro"],
      },
      {
        label: "About",
      },
      {
        label: "Reviews",
      },
    ],
  },
  hero: {
    eyebrow: "Same-week home service",
    title: "Reliable home repairs with clear timing and careful follow-through.",
    body: "Northstar Home Care helps homeowners handle repairs, maintenance, and small upgrades with straightforward scheduling, practical recommendations, and tidy service visits.",
    primaryAction: "Request service",
    secondaryAction: "View services",
    stats: ["Same-week visits", "Licensed pros", "Clear estimates"],
  },
  trustBar: {
    label: "Trusted for everyday repairs, preventive care, and planned home upgrades.",
    items: [
      "4.9 average rating",
      "2,400+ completed visits",
      "Background-checked team",
      "Locally owned",
    ],
  },
  services: {
    eyebrow: "Services",
    title: "A practical service system for the work homeowners request most.",
    body: "Start with the right service path, then get a clear visit plan before work begins.",
    items: [
      {
        title: "Repair visits",
        body: "Responsive help for leaks, fixtures, small failures, and urgent issues that need a capable technician.",
      },
      {
        title: "Maintenance plans",
        body: "Seasonal checks, tune-ups, and photo-backed notes that help prevent avoidable surprises.",
      },
      {
        title: "Installations",
        body: "Clean upgrades and replacements with a tidy process from estimate through final walkthrough.",
      },
    ],
  },
  positioning: {
    title: "Clear help, close by.",
    body: "Every visit is built around plain-language recommendations, visible next steps, and service notes customers can actually use after the team leaves.",
    action: "About the team",
    imageLabel: "Prepared service visit",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions homeowners usually ask before booking.",
    body: "A few clear answers before the request turns into a scheduled visit.",
    items: [
      {
        question: "Do you provide estimates before work begins?",
        answer:
          "Yes. We review the request, explain the likely scope, and confirm the next step before paid work starts.",
      },
      {
        question: "How soon can someone come out?",
        answer:
          "Most routine visits can be scheduled same-week. Urgent repairs are prioritized based on availability and service area.",
      },
      {
        question: "Can I book recurring maintenance?",
        answer:
          "Yes. Maintenance plans can be set up seasonally or annually depending on the home and service needs.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Tell us what needs attention.",
    body: "Send the basics and the team will follow up with timing, scope, and the clearest next step.",
    details: ["(555) 014-2250", "hello@northstar.example", "Mon-Fri, 8am-6pm"],
  },
};

export const createdHomepage2Content = {
  source: {
    sourceStage: "pagebuilder",
    sourceDesign: "homepage2",
    sourceRecipe: "premium-trust",
    createdAt: "2026-06-07",
    status: "created-page-wip",
  },
  nav: {
    logoLabel: "Northstar",
    phone: "(555) 014-2250",
    action: "Plan a visit",
    links: [
      {
        label: "Services",
        items: ["Planned care", "Repair visits", "Installations", "Inspections"],
      },
      {
        label: "Service areas",
        items: ["Nashville", "Franklin", "Brentwood", "Murfreesboro"],
      },
      { label: "Process" },
      { label: "Reviews" },
    ],
  },
  hero: {
    eyebrow: "Premium home service",
    title: "Home care that feels composed from the first conversation.",
    body: "A more editorial homepage for customers who want careful recommendations, clean communication, and a team that treats the visit like part of the home.",
    primaryAction: "Plan a visit",
    secondaryAction: "Explore services",
    review: {
      rating: "4.9",
      label: "Average rating from planned service visits",
      detail:
        "Based on homeowners who booked repairs, upgrades, inspections, and recurring maintenance.",
    },
    trustSignals: [
      { value: "2,400+", label: "Documented visits" },
      { value: "12 yrs", label: "Local service history" },
    ],
  },
  reveal: {
    lines: [
      "Premium service is not about being precious.",
      "It is about being prepared.",
      "Every visit should make the next decision",
      "feel easier than the last.",
    ],
  },
  split: {
    headlineTop: "Calm service",
    headlineBottom: "built on follow-through",
    imageLabel: "Prepared home visit",
    body: "Use this page when trust needs more room than a dense conversion layout can provide.",
  },
  servicesScroll: {
    eyebrow: "Services",
    title: "Service paths that stay easy to browse.",
    viewAllLabel: "View every service",
    items: [
      { title: "Planned maintenance", imageLabel: "Care" },
      { title: "Repair visits", imageLabel: "Repair" },
      { title: "System upgrades", imageLabel: "Upgrade" },
      { title: "Home inspections", imageLabel: "Inspect" },
      { title: "Property care", imageLabel: "Property" },
    ],
  },
  testimonials: {
    eyebrow: "Customer stories",
    title: "Proof from visits where the details mattered.",
    body: "Longer testimonials help high-trust service pages show the actual experience behind the claims.",
    items: [
      {
        quote:
          "The team gave us a clear plan, protected the work area, and explained the tradeoffs without pushing us into the most expensive option.",
        author: "Amanda Reeves",
        city: "Franklin",
        service: "System upgrade",
      },
      {
        quote:
          "Everything about the visit felt prepared. They knew the notes from my first call and left us with photos, next steps, and no surprises.",
        author: "Marcus Bennett",
        city: "Brentwood",
        service: "Repair visit",
      },
      {
        quote:
          "The maintenance plan finally made our older home feel predictable. We know what needs attention now and what can wait.",
        author: "Elena Walsh",
        city: "Nashville",
        service: "Maintenance plan",
      },
    ],
  },
  process: {
    eyebrow: "How it works",
    title: "The visit is planned before the truck arrives.",
    body: "A premium service page needs to make the operating rhythm visible before someone reaches out.",
    imageLabel: "Visit plan",
    items: [
      "Confirm the service goal and any timing constraints.",
      "Review home notes, photos, and known access details.",
      "Arrive with a clear diagnostic path and practical options.",
      "Document findings so decisions are easier to revisit.",
      "Close with the next step, not a vague recommendation.",
    ],
    action: "Talk through the process",
  },
  cta: {
    eyebrow: "Ready when you are",
    title: "Plan the visit with a team that keeps the details clear.",
    body: "Share the service goal and the team will respond with timing, scope, and the best next step.",
    action: "Start a request",
  },
};

export const createdAboutContent = {
  source: {
    sourceStage: "pagebuilder",
    sourceDesign: "about",
    sourceRecipe: "conversion-heavy",
    createdAt: "2026-06-07",
    status: "created-page-wip",
  },
  nav: {
    logoLabel: "Northstar",
    phone: "(555) 014-2250",
    action: "Contact the team",
    links: [
      {
        label: "Services",
        items: ["Repair visits", "Maintenance", "Installations", "Inspections"],
      },
      { label: "Process" },
      { label: "Reviews" },
      { label: "Contact" },
    ],
  },
  hero: {
    eyebrow: "About Northstar",
    title: "A local service team built around preparedness and plain answers.",
    body: "This about page introduces the operating habits behind every visit: clear communication, careful work, practical recommendations, and follow-through customers can feel.",
    primaryAction: "Contact the team",
    secondaryAction: "View services",
  },
  trustBar: {
    label: "Built for homeowners who want the work explained before decisions get expensive.",
    items: [
      "Licensed technicians",
      "Photo-backed notes",
      "Clear arrival windows",
      "Locally owned",
    ],
  },
  servicesScroll: {
    eyebrow: "What we support",
    title: "The work is varied, but the service rhythm stays consistent.",
    viewAllLabel: "See service paths",
    items: [
      { title: "Urgent repairs", imageLabel: "Repair" },
      { title: "Planned maintenance", imageLabel: "Care" },
      { title: "Fixture upgrades", imageLabel: "Upgrade" },
      { title: "Home inspections", imageLabel: "Inspect" },
    ],
  },
  stream: {
    eyebrow: "How the team works",
    title: "A steadier service visit starts before the appointment.",
    body: "The about page should make the backstage system visible: how requests are handled, how recommendations are explained, and how the team closes the loop.",
    cards: [
      {
        eyebrow: "First response",
        title: "We start by clarifying what success looks like.",
        body: "The first conversation captures the issue, the urgency, access details, and the outcome the customer actually needs.",
      },
      {
        eyebrow: "Visit prep",
        title: "Job notes travel with the team.",
        body: "Technicians review the request before arrival so the visit starts with context instead of repeated questions.",
      },
      {
        eyebrow: "Options",
        title: "Recommendations are explained in plain language.",
        body: "When there is more than one path forward, each option is framed by risk, timing, and practical value.",
      },
      {
        eyebrow: "Closeout",
        title: "Customers leave with notes they can use.",
        body: "Photos, summaries, and follow-up details turn the visit into something easier to remember and act on.",
      },
    ],
  },
  faqAccordion: {
    eyebrow: "FAQ",
    title: "A few things people ask before inviting us in.",
    body: "Clear answers help the about page stay useful instead of purely biographical.",
    items: [
      {
        question: "Are your technicians licensed and insured?",
        answer:
          "Yes. The page can be adapted with license, insurance, training, or certification details for each client business.",
      },
      {
        question: "Do you explain options before work begins?",
        answer:
          "Yes. The team confirms scope, likely timing, and decision points before paid work starts.",
      },
      {
        question: "What happens after the visit?",
        answer:
          "Customers receive a practical summary of what was found, what was completed, and what may need attention later.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Start with a quick note to the team.",
    body: "Share what is happening, where you are, and how soon you need help. The next step should feel simple.",
    details: ["(555) 014-2250", "hello@northstar.example", "Mon-Fri, 8am-6pm"],
  },
};

export const createdServicesContent = {
  source: {
    sourceStage: "pagebuilder",
    sourceDesign: "services",
    sourceRecipe: "editorial-local",
    createdAt: "2026-06-07",
    status: "created-page-wip",
  },
  nav: {
    logoLabel: "Northstar",
    phone: "(555) 014-2250",
    action: "Request service",
    links: [
      {
        label: "Services",
        items: ["Repair visits", "Maintenance plans", "Installations", "Inspections"],
      },
      {
        label: "Service areas",
        items: ["Nashville", "Franklin", "Brentwood", "Murfreesboro"],
      },
      { label: "About" },
      { label: "Reviews" },
    ],
  },
  hero: {
    eyebrow: "Services",
    title: "Service paths with clear fit, proof, and next steps.",
    body: "A services overview should help visitors compare the work available, understand what each path is for, and move toward the most relevant page or request.",
    primaryAction: "Request service",
    secondaryAction: "Compare services",
    images: ["Service visit", "Local area"],
    trustSignals: [
      {
        value: "4.9",
        label: "Average rating from verified local service visits",
      },
      {
        value: "2,400+",
        label: "Completed jobs across repairs, installs, and maintenance",
      },
      {
        value: "Same-week",
        label: "Scheduling options for urgent and planned work",
      },
    ],
    services: [
      {
        title: "Repair visits",
        body: "Fast troubleshooting and clear repair options for issues that need attention now.",
      },
      {
        title: "Maintenance plans",
        body: "Seasonal tune-ups, inspection notes, and recurring care for fewer surprises.",
      },
      {
        title: "Installations",
        body: "Clean upgrades and replacements with simple documentation from estimate to walkthrough.",
      },
    ],
  },
  reveal: {
    lines: [
      "The services page should help people compare.",
      "Not hunt.",
      "Each path needs a clear use case,",
      "a proof point, and an obvious next step.",
    ],
  },
  ideas: {
    eyebrow: "Service clarity",
    title: "Help visitors recognize their situation before asking them to choose.",
    paragraphs: [
      "Most homeowners arrive with a problem, not a category name. The services overview should translate common situations into clear paths.",
      "Each service card needs enough context to compare, but not so much that the page becomes a wall of explanations.",
      "Good service pages keep contact close without making every section feel like a hard sell.",
    ],
    ideas: ["Name the situation", "Show the right next step", "Keep proof nearby"],
  },
  aboutCompany: {
    eyebrow: "Service standards",
    statement:
      "Every service path uses the same baseline: clear timing, careful work, and notes customers can act on.",
    summary:
      "Use this section to reinforce what stays consistent across every offer.",
    action: "Read about the team",
    images: [{ label: "Technician" }, { label: "Service notes" }],
  },
  trustLogos: {
    label: "Recognized by local homeowners, property managers, and service partners",
    logos: [
      "Repair",
      "Care",
      "Install",
      "Inspect",
      "Plan",
      "Follow-up",
      "Local",
      "Trusted",
    ],
  },
  testimonials: {
    eyebrow: "Reviews",
    title: "Proof across different service needs.",
    body: "A larger review wall helps the services page show consistency across repairs, maintenance, and upgrades.",
    items: [
      {
        quote:
          "The repair was explained clearly and the technician showed us exactly what failed before starting.",
        author: "Maya R.",
        detail: "Repair visit",
      },
      {
        quote:
          "The maintenance visit helped us prioritize what mattered and what could wait.",
        author: "Helen M.",
        detail: "Maintenance plan",
      },
      {
        quote:
          "Our installation was clean, organized, and finished with a walkthrough that actually made sense.",
        author: "Daniel K.",
        detail: "Installation",
      },
      {
        quote:
          "They helped us choose the service path that fit the issue instead of overselling the biggest job.",
        author: "Priya S.",
        detail: "Inspection",
      },
    ],
  },
  offer: {
    introEyebrow: "Service planning",
    introTitle: "The right service path should make the next step obvious.",
    introBody:
      "Use the offer reveal when the services page needs a stronger conversion bridge without losing editorial rhythm.",
    offerEyebrow: "Seasonal service offer",
    offerTitle: "Save 15% on your first scheduled maintenance visit.",
    offerBody:
      "A focused offer can help new customers try the service system before a larger repair or upgrade is needed.",
    offerDetail: "New customers only. Availability depends on service area and schedule.",
    action: "Claim the offer",
    closeEyebrow: "Next step",
    closeTitle: "Bring the page back to normal service rhythm.",
    closeBody:
      "After the offer, return to clear service paths, proof, or contact details so the page still feels useful.",
  },
};

export const createdIndividualServicePageContent = {
  source: {
    sourceStage: "pagebuilder",
    sourceDesign: "individual service page",
    sourceRecipe: "compact-utility",
    createdAt: "2026-06-07",
    status: "created-page-wip",
  },
  nav: {
    logoLabel: "Northstar",
    phone: "(555) 014-2250",
    action: "Book repair",
    links: [
      {
        label: "Services",
        items: ["Emergency repairs", "Maintenance plans", "Inspections", "Replacement planning"],
      },
      {
        label: "Service areas",
        items: ["Nashville", "Franklin", "Brentwood", "Murfreesboro"],
      },
      { label: "Process" },
      { label: "Reviews" },
    ],
  },
  hero: {
    eyebrow: "Repair visits",
    title: "A clear repair visit for problems that need attention now.",
    body: "Use this individual service page for one offer. The copy stays direct, the proof stays close, and every section supports booking the right visit.",
    primaryAction: "Book repair",
    secondaryAction: "See related services",
  },
  trustMarquee: {
    label: "Trusted repair support for homeowners across the metro area",
    items: [
      "Same-week appointments",
      "Clear estimates",
      "Licensed technicians",
      "Photo-backed notes",
      "Clean job sites",
      "Friendly follow-up",
      "Local team",
      "4.9 average rating",
    ],
  },
  relatedServices: {
    eyebrow: "Related services",
    title: "Other service paths that pair with repair visits.",
    viewAllLabel: "View all services",
    items: [
      { title: "Emergency repairs", imageLabel: "Urgent" },
      { title: "Preventive maintenance", imageLabel: "Care" },
      { title: "Inspection visits", imageLabel: "Inspect" },
      { title: "Replacement planning", imageLabel: "Plan" },
    ],
  },
  ruleHeader: {
    eyebrow: "What to expect",
    title:
      "A focused repair page should explain the visit, the decision point, and what the customer gets after the work.",
  },
  faq: {
    eyebrow: "Repair FAQ",
    title: "Questions before booking a repair visit.",
    body: "Keep the answers specific to this service so the page feels like a real offer, not a generic FAQ.",
    items: [
      {
        question: "Can I get a repair estimate first?",
        answer:
          "Yes. The team confirms the issue, explains the likely scope, and gives a clear approval point before paid work begins.",
      },
      {
        question: "What if the technician finds a bigger issue?",
        answer:
          "The technician will pause, explain what changed, and outline practical options before continuing.",
      },
      {
        question: "Do you document the repair?",
        answer:
          "Yes. Customers can receive notes, photos, and follow-up recommendations after the visit.",
      },
    ],
  },
  footer: {
    businessName: "Northstar Home Care",
    description:
      "Created WIP footer for the individual service page, keeping service links, areas, and contact details available at the close.",
    quickLinks: [
      { label: "Home", href: "/created-pages/homepage1" },
      { label: "Services", href: "/created-pages/services" },
      { label: "About", href: "/created-pages/about" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { label: "Repair visits", href: "#" },
      { label: "Maintenance plans", href: "#" },
      { label: "Installations", href: "#" },
      { label: "Inspections", href: "#" },
    ],
    serviceAreas: [
      { label: "Nashville", href: "#" },
      { label: "Franklin", href: "#" },
      { label: "Brentwood", href: "#" },
      { label: "Murfreesboro", href: "#" },
    ],
    contact: {
      name: "Northstar Home Care",
      address: "123 Main Street, Nashville, TN 37201",
      phone: "(555) 014-2250",
      email: "hello@northstar.example",
    },
    socialLinks: [
      { label: "Facebook", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
    reviewLink: {
      label: "Read our Google reviews",
      href: "#",
    },
    copyright: "(c) 2026 Northstar Home Care. All rights reserved.",
    privacyLink: {
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    termsLink: {
      label: "Terms",
      href: "/terms",
    },
  },
};
