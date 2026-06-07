import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeading } from "@/components/primitives/SectionHeading";

type PageworksPlaceholderSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
};

export function PageworksPlaceholderSection({
  eyebrow,
  title,
  body,
  items,
}: PageworksPlaceholderSectionProps) {
  return (
    <Section className="min-h-svh bg-bg-surface text-service-ink">
      <Container className="grid gap-10">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          body={body}
          level={1}
          className="fluid-type-frame"
        />
        <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-sm border border-service-border bg-white p-5 shadow-service"
            >
              <p className="type-text-sm text-service-muted">{item}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
