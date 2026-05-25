import Link from "next/link";
import { Container, Section } from "@/components/primitives";
import { FooterSection } from "@/components/sections";
import { sectionLibraryContent } from "@/content/section-library";

type LegalSection = {
  title: string;
  paragraphs: string[];
  items?: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-white text-service-ink">
      <header className="border-b border-service-border bg-white">
        <Container>
          <div className="flex min-h-16 items-center justify-between gap-5 py-3">
            <Link
              className="text-base font-semibold leading-tight text-service-ink"
              href="/"
            >
              [Business Name]
            </Link>
            <nav aria-label="Legal page navigation">
              <Link
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                href="/sections"
              >
                View site
              </Link>
            </nav>
          </div>
        </Container>
      </header>

      <Section className="bg-service-surface pb-12">
        <Container>
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-fluid-heading font-semibold leading-heading text-service-ink">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-service-muted">
              {intro}
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white pt-12">
        <Container>
          <article className="max-w-4xl">
            <div className="rounded-lg border border-service-border bg-white p-8 shadow-service max-md:p-6">
              <div className="grid gap-10">
                {sections.map((section) => (
                  <section key={section.title}>
                    <h2 className="text-2xl font-semibold leading-tight text-service-ink">
                      {section.title}
                    </h2>
                    <div className="mt-4 grid gap-4 text-base leading-7 text-service-muted">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {section.items ? (
                      <ul className="mt-4 grid gap-2 pl-5 text-base leading-7 text-service-muted">
                        {section.items.map((item) => (
                          <li className="list-disc" key={item}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}
              </div>
            </div>
          </article>
        </Container>
      </Section>

      <FooterSection {...sectionLibraryContent.footer} />
    </main>
  );
}
