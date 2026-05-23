import { Container, Section } from "@/components/primitives";
import { ImportantIdeasBox } from "./ImportantIdeasBox";

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
            <ImportantIdeasBox ideas={ideas} />
          </aside>
        </div>
      </Container>
    </Section>
  );
}
