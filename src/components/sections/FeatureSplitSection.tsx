import { Card, Container, Section, SectionHeading } from "@/components/primitives";

type FeatureSplitSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
};

export function FeatureSplitSection({
  eyebrow,
  title,
  body,
  points,
}: FeatureSplitSectionProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1 max-lg:gap-10">
          <Card className="p-8">
            <div className="aspect-video rounded-md bg-service-surface p-6">
              <div className="grid h-full grid-cols-2 gap-4">
                <div className="rounded-md bg-white shadow-service" />
                <div className="rounded-md bg-service-accent/15" />
                <div className="col-span-2 rounded-md bg-white shadow-service" />
              </div>
            </div>
          </Card>
          <div>
            <SectionHeading eyebrow={eyebrow} title={title} body={body} />
            <ul className="mt-8 space-y-4">
              {points.map((point) => (
                <li className="flex gap-4 text-base leading-7 text-service-muted" key={point}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-service-accent" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
