import { Container } from "@/components/primitives";
import {
  ContactSection,
  CTASection,
  FAQSection,
  FeatureSplitSection,
  FooterSection,
  HeroSection,
  ProcessStepsSection,
  ServicesGridSection,
  TestimonialsSection,
  TrustBarSection,
} from "@/components/sections";
import { sectionLibraryContent } from "@/content/section-library";

const examples = [
  {
    label: "Hero section",
    element: <HeroSection {...sectionLibraryContent.hero} headingLevel={2} />,
  },
  {
    label: "Trust bar",
    element: <TrustBarSection {...sectionLibraryContent.trustBar} />,
  },
  {
    label: "Services grid",
    element: <ServicesGridSection {...sectionLibraryContent.services} />,
  },
  {
    label: "Feature split",
    element: <FeatureSplitSection {...sectionLibraryContent.featureSplit} />,
  },
  {
    label: "Process steps",
    element: <ProcessStepsSection {...sectionLibraryContent.process} />,
  },
  {
    label: "Testimonials",
    element: <TestimonialsSection {...sectionLibraryContent.testimonials} />,
  },
  {
    label: "FAQ",
    element: <FAQSection {...sectionLibraryContent.faq} />,
  },
  {
    label: "CTA",
    element: <CTASection {...sectionLibraryContent.cta} />,
  },
  {
    label: "Contact section",
    element: <ContactSection {...sectionLibraryContent.contact} />,
  },
  {
    label: "Footer",
    element: <FooterSection {...sectionLibraryContent.footer} />,
  },
];

function ShowcaseLabel({ label }: { label: string }) {
  return (
    <div className="border-y border-service-border bg-white py-4">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
          {label}
        </p>
      </Container>
    </div>
  );
}

export default function SectionsPage() {
  return (
    <main className="bg-white">
      <section className="bg-service-ink py-16 text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-widest text-white/65">
            Internal preview
          </p>
          <h1 className="mt-4 text-fluid-heading font-semibold leading-tight">
            Section Library
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Reusable local service section components for previewing layout,
            spacing, and responsive behavior before building a full site.
          </p>
        </Container>
      </section>

      {examples.map((example) => (
        <div key={example.label}>
          <ShowcaseLabel label={example.label} />
          {example.element}
        </div>
      ))}
    </main>
  );
}
