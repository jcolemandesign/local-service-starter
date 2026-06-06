export const sectionLibraryV3Content = {
  heroSplitFullHeight: {
    eyebrow: "Local service starter",
    title: "Reliable home services built around your schedule.",
    body: "A polished hero pattern for local service companies, with a clear value proposition, supporting proof, and two focused calls to action.",
    imageAlt: "Sample local service project image",
    imageSrc: "/images/bg-image-sample.jpg",
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
    contentAlignX: "left",
    contentAlignY: "middle",
    body: "A large portrait image gives the section a clear visual anchor while the adjacent paragraph carries the main service idea with enough room to feel editorial, direct, and easy to read.",
  },
  servicesThreeCardsRight: {
    eyebrow: "Seven column system",
    title:
      "A reusable section frame for content inside the seven-column system.",
    cards: [
      {
        title: "Shared grid",
        body: "The section uses one seven-column grid so spacing and padding can change without changing the column count.",
      },
      {
        title: "Wrapped content",
        body: "Each content object sits inside a placement wrapper that controls span, alignment, and readable measure.",
      },
      {
        title: "Predictable flow",
        body: "Rows can be composed intentionally while still allowing section content to adapt inside its assigned columns.",
      },
    ],
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
} as const;

export const sectionLibraryV3Collections = [
  {
    title: "Hero",
    items: [
      {
        label: "Split content and image",
        component: "hero-split-full-height-v3",
      },
      {
        label: "Centered with left right floaters",
        component: "hero-centered-floaters-v2",
      },
      {
        label: "Fullscreen image hero",
        component: "hero-fullscreen-v2",
      },
      {
        label: "Grid mosaic hero",
        component: "hero-grid-mosaic-v2",
      },
      {
        label: "Content top image bottom",
        component: "hero-content-top-image-bottom-v2",
      },
      {
        label: "Image top content bottom",
        component: "hero-image-top-content-bottom-v2",
      },
      {
        label: "Stacked header and image",
        component: "hero-stacked-header-image-v2",
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        label: "3 service cards right",
        component: "services-three-cards-right-v3",
      },
    ],
  },
  {
    title: "Trust",
    items: [
      { label: "Trust bar", component: "trust-bar-v3" },
      {
        label: "Floating bento trust bar",
        component: "trust-bar-floating-bento-v3",
      },
      { label: "Trust marquee", component: "trust-marquee-v3" },
      { label: "Trust logo marquee", component: "trust-logo-marquee-v3" },
      { label: "Static trust logo grid", component: "trust-logo-grid-v3" },
    ],
  },
  {
    title: "Effects",
    items: [
      { label: "Rule header content", component: "content-rule-header-v2" },
      { label: "Reveal paragraph", component: "content-reveal-v2" },
      {
        label: "Scroll-written reveal paragraph",
        component: "content-scroll-written-reveal-v2",
      },
      { label: "Sticky ideas content", component: "content-sticky-ideas-v2" },
      {
        label: "Sticky card stream content",
        component: "content-sticky-card-stream-v2",
      },
      {
        label: "Horizontal card carousel content",
        component: "content-horizontal-card-carousel-v2",
      },
      {
        label: "Sticky image panel content",
        component: "content-sticky-image-panel-v3",
      },
      {
        label: "Bottom section slide up",
        component: "content-fixed-cover-fade-v2",
      },
      {
        label: "Split headline image content",
        component: "content-split-headline-image-v2",
      },
    ],
  },
  {
    title: "Features",
    items: [
      {
        label: "Large portrait image, large paragraph",
        component: "feature-portrait-paragraph-v3",
      },
      {
        label: "Overlapping feature rows",
        component: "feature-overlap-rows-v3",
      },
    ],
  },
  {
    title: "Process",
    items: [
      { label: "Process steps", component: "process-steps-v3" },
      {
        label: "Image checklist process",
        component: "process-image-checklist-v3",
      },
    ],
  },
  {
    title: "Testimonials",
    items: [
      { label: "Testimonials", component: "testimonials-v3" },
      {
        label: "Carousel testimonials",
        component: "testimonials-carousel-v3",
      },
      {
        label: "Masonry testimonials",
        component: "testimonials-masonry-v3",
      },
    ],
  },
  {
    title: "FAQ",
    items: [
      { label: "FAQ", component: "faq-v3" },
      { label: "FAQ accordion", component: "faq-accordion-v3" },
    ],
  },
  {
    title: "Conversion",
    items: [
      { label: "CTA", component: "cta-v3" },
      { label: "Fullscreen conversion", component: "cta-fullscreen-v3" },
      {
        label: "Scroll reveal offer conversion",
        component: "cta-scroll-reveal-offer-v3",
      },
    ],
  },
  {
    title: "Contact",
    items: [{ label: "Contact section", component: "contact-v3" }],
  },
  {
    title: "Footer",
    items: [{ label: "Footer", component: "footer-v3" }],
  },
] as const;
