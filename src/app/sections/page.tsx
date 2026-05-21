import { Container } from "@/components/primitives";
import {
  ContactSection,
  CTAFullscreenSection,
  CTASection,
  FAQAccordionSection,
  FAQSection,
  FeatureSplitSection,
  FooterSection,
  HeroBentoSection,
  HeroFullscreenSection,
  HeroSection,
  NavFloatingBentoSection,
  NavPrimarySection,
  ProcessStepsSection,
  SectionLibraryCollections,
  ServicesBentoCardsSection,
  ServicesGridSection,
  TestimonialsCarouselSection,
  TestimonialsMasonrySection,
  TestimonialsSection,
  TrustLogoMarqueeSection,
  TrustMarqueeSection,
  TrustBarSection,
} from "@/components/sections";
import { sectionLibraryContent } from "@/content/section-library";

const collections = [
  {
    title: "Hero",
    items: [
      {
        label: "Hero section",
        element: <HeroSection {...sectionLibraryContent.hero} headingLevel={2} />,
      },
      {
        label: "Bento hero",
        element: <HeroBentoSection {...sectionLibraryContent.hero} headingLevel={2} />,
      },
      {
        label: "Fullscreen image hero",
        element: (
          <HeroFullscreenSection
            {...sectionLibraryContent.heroFullscreen}
            headingLevel={2}
          />
        ),
      },
    ],
  },
  {
    title: "Navigation",
    items: [
      {
        label: "Primary nav",
        element: <NavPrimarySection {...sectionLibraryContent.navPrimary} />,
      },
      {
        label: "Floating bento nav",
        element: (
          <NavFloatingBentoSection {...sectionLibraryContent.navPrimary} />
        ),
      },
    ],
  },
  {
    title: "Trust",
    items: [
      {
        label: "Trust bar",
        element: <TrustBarSection {...sectionLibraryContent.trustBar} />,
      },
      {
        label: "Trust marquee",
        element: <TrustMarqueeSection {...sectionLibraryContent.trustMarquee} />,
      },
      {
        label: "Trust logo marquee",
        element: (
          <TrustLogoMarqueeSection
            {...sectionLibraryContent.trustLogoMarquee}
          />
        ),
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        label: "Services grid",
        element: <ServicesGridSection {...sectionLibraryContent.services} />,
      },
      {
        label: "Services bento cards",
        element: (
          <ServicesBentoCardsSection
            {...sectionLibraryContent.servicesBento}
          />
        ),
      },
    ],
  },
  {
    title: "Features",
    items: [
      {
        label: "Feature split",
        element: <FeatureSplitSection {...sectionLibraryContent.featureSplit} />,
      },
    ],
  },
  {
    title: "Process",
    items: [
      {
        label: "Process steps",
        element: <ProcessStepsSection {...sectionLibraryContent.process} />,
      },
    ],
  },
  {
    title: "Testimonials",
    items: [
      {
        label: "Testimonials",
        element: <TestimonialsSection {...sectionLibraryContent.testimonials} />,
      },
      {
        label: "Centered testimonial slider",
        element: (
          <TestimonialsCarouselSection
            {...sectionLibraryContent.testimonialsCarousel}
          />
        ),
      },
      {
        label: "Masonry testimonials",
        element: (
          <TestimonialsMasonrySection
            {...sectionLibraryContent.testimonialsMasonry}
          />
        ),
      },
    ],
  },
  {
    title: "FAQ",
    items: [
      {
        label: "FAQ",
        element: <FAQSection {...sectionLibraryContent.faq} />,
      },
      {
        label: "FAQ accordion",
        element: <FAQAccordionSection {...sectionLibraryContent.faqAccordion} />,
      },
    ],
  },
  {
    title: "Conversion",
    items: [
      {
        label: "CTA",
        element: <CTASection {...sectionLibraryContent.cta} />,
      },
      {
        label: "Fullscreen conversion",
        element: <CTAFullscreenSection {...sectionLibraryContent.ctaFullscreen} />,
      },
    ],
  },
  {
    title: "Contact",
    items: [
      {
        label: "Contact section",
        element: <ContactSection {...sectionLibraryContent.contact} />,
      },
    ],
  },
  {
    title: "Footer",
    items: [
      {
        label: "Footer",
        element: <FooterSection {...sectionLibraryContent.footer} />,
      },
    ],
  },
];

export default function SectionsPage() {
  return (
    <main className="bg-white">
      <section className="bg-service-ink py-16 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-widest text-white/65">
            Internal preview
          </p>
          <h1 className="mt-4 text-fluid-heading font-semibold leading-heading">
            Section Library
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Reusable local service section components for previewing layout,
            spacing, and responsive behavior before building a full site.
          </p>
        </Container>
      </section>

      <SectionLibraryCollections collections={collections} />
    </main>
  );
}
