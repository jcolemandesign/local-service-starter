import { Card, Container, Section, SectionHeading } from "@/components/primitives";

type Testimonial = {
  quote: string;
  author: string;
  detail: string;
};

type TestimonialsSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  items: Testimonial[];
};

export function TestimonialsSection({
  eyebrow,
  title,
  body,
  items,
}: TestimonialsSectionProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid grid-cols-2 gap-12 max-lg:grid-cols-1 max-lg:gap-10">
          <SectionHeading eyebrow={eyebrow} title={title} body={body} />
          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
            {items.map((item) => (
              <Card className="p-7" key={item.author}>
                <blockquote className="text-xl font-medium leading-8 text-service-ink">
                  &quot;{item.quote}&quot;
                </blockquote>
                <p className="mt-8 text-base font-semibold text-service-ink">{item.author}</p>
                <p className="mt-1 text-sm text-service-muted">{item.detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
