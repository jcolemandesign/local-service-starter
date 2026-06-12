import type { Metadata } from "next";
import {
  ContactSectionV3,
  ContentStickyImagePanelSectionV3,
  CTASectionV3,
  CTAScrollRevealOfferSectionV3,
  FAQSectionV3,
  FooterSectionV3,
  HeroSplitFullHeightSectionV3,
  NavFloatingBentoSectionV2,
  ProcessImageChecklistSectionV3,
  ServicesThreeCardsRightSectionV3,
  TestimonialsCarouselSectionV3,
  TrustBarSectionV3,
  TrustMarqueeSectionV3,
} from "@/components/sections";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";

export const metadata: Metadata = {
  title: "HVAC Service Preview | Style Guide",
};

const hvacNav = {
  logoLabel: "Summit Air Co.",
  phone: "(555) 014-2250",
  action: "Request service",
  links: [
    { label: "Services", items: ["AC repair", "Heating repair", "Tune-ups"] },
    { label: "Process" },
    { label: "Reviews" },
    { label: "FAQ" },
  ],
} as const;

const hvacHero = {
  eyebrow: "Summit Air Co.",
  title: "Fast HVAC repair and installs with no guesswork.",
  body: "A full homepage flow for heating, cooling, maintenance plans, and replacement estimates. Keep the styleguide open beside this page to see tokens update the site instantly.",
  imageAlt: "HVAC technician inspecting an outdoor condenser",
  imageSrc: "/images/bg-image-sample 2.1.jpg",
  primaryAction: "Book service",
  secondaryAction: "Explore plans",
  stats: ["24/7 emergency help", "Upfront diagnostics", "Maintenance plans"],
} as const;

const hvacTrust = {
  label: "Trusted HVAC service for homes across the metro",
  items: [
    "4.9 average rating",
    "12,000+ systems serviced",
    "NATE-certified technicians",
    "Same-day dispatch",
  ],
} as const;

const hvacServices = {
  eyebrow: "HVAC services",
  title: "The core service mix for a local heating and cooling business.",
  cards: [
    {
      title: "Emergency repair",
      body: "Rapid diagnostics for no-cool, no-heat, airflow, thermostat, and drain line issues with clear repair options before work starts.",
    },
    {
      title: "System replacement",
      body: "Right-sized furnace, heat pump, and AC installs with financing-ready estimates and tidy closeout documentation.",
    },
    {
      title: "Seasonal maintenance",
      body: "Tune-ups, filter changes, coil cleaning, safety checks, and member reminders that keep equipment running efficiently.",
    },
  ],
} as const;

const comfortPlan = {
  eyebrow: "Comfort plan",
  title: "Turn one-time calls into dependable long-term service.",
  body: "Use this sticky image panel to highlight recurring maintenance, priority scheduling, clean service notes, and reminders that help homeowners stay ahead of breakdowns.",
  imageLabel: "Maintenance membership",
  points: [
    "Two seasonal tune-ups",
    "Priority scheduling window",
    "No after-hours dispatch fee",
    "Filter and safety checklist",
  ],
} as const;

const hvacProcess = {
  eyebrow: "How service works",
  title: "A simple flow from first call to comfortable rooms.",
  body: "The checklist section adds motion and gives the preview an interaction-heavy moment while still using reusable section pieces.",
  imageLabel: "Diagnostic visit",
  action: "Schedule a visit",
  items: [
    "Confirm the issue, home details, and best arrival window.",
    "Run a clean diagnostic and explain what is happening in plain language.",
    "Show repair, replacement, or maintenance options before work begins.",
    "Complete the work, test the system, and send service notes.",
  ],
} as const;

const hvacTestimonials = {
  eyebrow: "Customer proof",
  title: "Homeowners care most about speed, clarity, and clean work.",
  body: "The carousel gives this default page an interactive control surface for testing typography, buttons, shadows, and spacing.",
  items: [
    {
      author: "Maya R.",
      city: "West Park",
      service: "Emergency AC repair",
      quote:
        "They found the problem quickly, explained the options, and had cold air back before dinner.",
    },
    {
      author: "Jordan K.",
      city: "North Ridge",
      service: "Heat pump install",
      quote:
        "The estimate was clear, the install team was careful, and the new system is much quieter.",
    },
    {
      author: "Elena S.",
      city: "Oak Hill",
      service: "Maintenance plan",
      quote:
        "The reminders and seasonal checks make it easy to stay ahead of surprise repairs.",
    },
  ],
} as const;

const hvacFaq = {
  eyebrow: "Common questions",
  title: "Answer the practical questions before the form.",
  body: "This section shows how FAQ cards respond to the active radius, border, shadow, color, and type choices.",
  items: [
    {
      question: "Do you offer same-day HVAC repair?",
      answer:
        "Yes. Same-day windows are available for most repair calls, with priority routing for no-cool and no-heat situations.",
    },
    {
      question: "Can you quote a replacement before visiting?",
      answer:
        "We can provide a planning range, then finalize the quote after load, equipment, and access details are confirmed on site.",
    },
    {
      question: "What is included in a maintenance visit?",
      answer:
        "A typical visit includes safety checks, airflow review, filter guidance, cleaning, system testing, and written recommendations.",
    },
  ],
} as const;

const hvacOffer = {
  offerEyebrow: "Limited seasonal offer",
  offerTitle: "Book a tune-up before the first heat wave.",
  offerBody:
    "Use the scroll reveal section to test big type, sticky motion, dark surfaces, and conversion copy in one pass.",
  offerDetail: "Preview-only copy. Swap this for a real campaign when building a client site.",
  action: "Claim tune-up",
  introEyebrow: "Why it matters",
  introTitle: "Small maintenance changes can prevent expensive comfort failures.",
  introBody:
    "This middle panel gives the flow a strong editorial beat before closing with the offer and contact form.",
  closeEyebrow: "Ready when they are",
  closeTitle: "Make the next step obvious.",
  closeBody:
    "Pair a direct call to action with a low-friction contact form, service details, and a footer built from reusable local business patterns.",
} as const;

const hvacContact = {
  eyebrow: "Request service",
  title: "Tell us what your system is doing.",
  body: "The contact section uses the same semantic tokens as the rest of the page, so form density, borders, type, and colors all respond to the styleguide.",
  details: [
    "Call (555) 014-2210",
    "Serving West Park, North Ridge, Oak Hill, and nearby neighborhoods",
    "Emergency dispatch available",
  ],
} as const;

const hvacFooter = {
  businessName: "Summit Air Co.",
  description:
    "Heating, cooling, indoor air quality, and maintenance plans for local homeowners.",
  contact: {
    name: "Summit Air Co.",
    address: "1200 Service Loop, West Park, ST 00000",
    phone: "(555) 014-2210",
    email: "hello@summitair.example",
  },
  quickLinks: [
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Book service" },
    { href: "#", label: "Reviews" },
  ],
  services: [
    { href: "#", label: "AC repair" },
    { href: "#", label: "Heating repair" },
    { href: "#", label: "System replacement" },
  ],
  serviceAreas: [
    { href: "#", label: "West Park" },
    { href: "#", label: "North Ridge" },
    { href: "#", label: "Oak Hill" },
  ],
  socialLinks: [
    { href: "#", label: "Facebook" },
    { href: "#", label: "Instagram" },
    { href: "#", label: "LinkedIn" },
  ],
  reviewLink: { href: "#", label: "Read customer reviews" },
  privacyLink: { href: "#", label: "Privacy" },
  termsLink: { href: "#", label: "Terms" },
  copyright: "© 2026 Summit Air Co. Preview page.",
} as const;

export default function HvacServicePreviewPage() {
  return (
    <StyleGuidePreviewSurface>
      <NavFloatingBentoSectionV2 {...hvacNav} fixed />
      <main className="bg-bg-page text-service-ink">
        <HeroSplitFullHeightSectionV3
          {...hvacHero}
          variant="text-4-image-3-right"
        />
        <TrustBarSectionV3 {...hvacTrust} />
        <div id="services">
          <ServicesThreeCardsRightSectionV3 {...hvacServices} />
        </div>
        <TrustMarqueeSectionV3 {...hvacTrust} />
        <ContentStickyImagePanelSectionV3 {...comfortPlan} />
        <ProcessImageChecklistSectionV3 {...hvacProcess} />
        <TestimonialsCarouselSectionV3 {...hvacTestimonials} />
        <FAQSectionV3 {...hvacFaq} />
        <CTAScrollRevealOfferSectionV3 {...hvacOffer} />
        <CTASectionV3
          action="Start a service request"
          body="A concise CTA checks button styling and dark-section contrast before the form."
          title="Need heat or AC help today?"
        />
        <ContactSectionV3 {...hvacContact} />
        <FooterSectionV3 {...hvacFooter} />
      </main>
    </StyleGuidePreviewSurface>
  );
}
