import { Button, Container, Section } from "@/components/primitives";

type CTASectionProps = {
  title: string;
  body: string;
  action: string;
};

export function CTASection({ title, body, action }: CTASectionProps) {
  return (
    <Section className="bg-service-ink">
      <Container>
        <div className="flex items-center justify-between gap-10 max-lg:flex-col max-lg:items-start">
          <div className="max-w-3xl">
            <h2 className="text-fluid-heading font-semibold leading-heading text-white">{title}</h2>
            <p className="mt-5 text-lg leading-8 text-white/75">{body}</p>
          </div>
          <Button
            className="shrink-0 border-white bg-white text-service-ink hover:bg-service-surface"
            href="#contact"
            variant="secondary"
          >
            {action}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
