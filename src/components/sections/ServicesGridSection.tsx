import { Card, Container, Section, SectionHeading } from "@/components/primitives";

type ServiceItem = {
  title: string;
  body: string;
};

type ServicesGridSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  items: ServiceItem[];
};

export function ServicesGridSection({
  eyebrow,
  title,
  body,
  items,
}: ServicesGridSectionProps) {
  return (
    <Section id="services" className="bg-service-surface">
      <Container>
        <div className="grid grid-cols-3 items-end gap-6 max-lg:grid-cols-1 max-lg:gap-8">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            className="col-span-2 max-w-none max-lg:col-span-1"
          />
          <p className="text-lg leading-8 text-service-muted max-md:text-base max-md:leading-7">
            {body}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
          {items.map((item) => (
            <Card className="p-7" key={item.title}>
              <div className="mb-8 h-12 w-12 rounded-md bg-service-accent/10" />
              <h3 className="text-2xl font-semibold text-service-ink">{item.title}</h3>
              <p className="mt-4 text-base leading-7 text-service-muted">{item.body}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
