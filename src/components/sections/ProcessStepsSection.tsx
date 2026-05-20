import { Card, Container, Section, SectionHeading } from "@/components/primitives";

type ProcessStep = {
  title: string;
  body: string;
};

type ProcessStepsSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  steps: ProcessStep[];
};

export function ProcessStepsSection({
  eyebrow,
  title,
  body,
  steps,
}: ProcessStepsSectionProps) {
  return (
    <Section className="bg-service-surface">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} body={body} align="center" />
        <ol className="mt-12 grid grid-cols-3 gap-6 max-md:grid-cols-1">
          {steps.map((step, index) => (
            <Card className="p-7" key={step.title}>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-md bg-service-ink text-sm font-semibold text-white">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-2xl font-semibold text-service-ink">{step.title}</h3>
              <p className="mt-4 text-base leading-7 text-service-muted">{step.body}</p>
            </Card>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
