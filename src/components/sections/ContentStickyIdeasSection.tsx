import { Container, Section } from "@/components/primitives";

type ContentStickyIdeasSectionProps = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  ideas: string[];
};

export function ContentStickyIdeasSection({
  eyebrow,
  title,
  paragraphs,
  ideas,
}: ContentStickyIdeasSectionProps) {
  return (
    <Section className="bg-service-surface">
      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-16 max-lg:grid-cols-1 max-lg:gap-12">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-service-accent">
              {eyebrow}
            </p>
            <h2 className="max-w-5xl text-fluid-heading font-semibold leading-heading text-service-ink">
              {title}
            </h2>
            <div className="mt-14 space-y-12">
              {paragraphs.map((paragraph) => (
                <p
                  className="max-w-5xl text-4xl font-semibold leading-heading text-service-ink max-lg:text-3xl max-md:text-2xl"
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <aside className="max-lg:order-first">
            <div className="sticky top-8 rounded-lg border border-service-border bg-white p-7 shadow-service max-lg:static">
              <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
                Important ideas
              </p>
              <ul className="mt-6 grid gap-4">
                {ideas.map((idea) => (
                  <li
                    className="border-l border-service-border pl-4 text-lg font-semibold leading-7 text-service-ink"
                    key={idea}
                  >
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
