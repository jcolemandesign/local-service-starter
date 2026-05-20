import { Card, Container, Section, SectionHeading } from "@/components/primitives";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  items: FAQItem[];
};

export function FAQSection({ eyebrow, title, body, items }: FAQSectionProps) {
  return (
    <Section className="bg-service-surface">
      <Container>
        <div className="grid grid-cols-2 gap-12 max-lg:grid-cols-1">
          <SectionHeading eyebrow={eyebrow} title={title} body={body} />
          <div className="space-y-4">
            {items.map((item) => (
              <Card className="p-6" key={item.question}>
                <h3 className="text-lg font-semibold text-service-ink">{item.question}</h3>
                <p className="mt-3 text-base leading-7 text-service-muted">{item.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
