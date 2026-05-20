import { Button, Container, Section } from "@/components/primitives";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  stats: string[];
  headingLevel?: 1 | 2;
};

export function HeroSection({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  stats,
  headingLevel = 1,
}: HeroSectionProps) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <Section className="bg-service-surface">
      <Container>
        <div className="grid grid-cols-2 items-center gap-16 max-lg:grid-cols-1 max-lg:gap-12">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-service-accent">
              {eyebrow}
            </p>
            <HeadingTag className="text-fluid-hero font-semibold leading-none text-service-ink">
              {title}
            </HeadingTag>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-service-muted max-md:text-lg max-md:leading-8">
              {body}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="#contact">{primaryAction}</Button>
              <Button href="#services" variant="secondary">
                {secondaryAction}
              </Button>
            </div>
            <ul className="mt-12 grid max-w-2xl grid-cols-3 gap-4 max-md:grid-cols-1">
              {stats.map((stat) => (
                <li
                  className="border-l border-service-border pl-4 text-sm font-semibold text-service-ink"
                  key={stat}
                >
                  {stat}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-service-border bg-white p-6 shadow-service">
            <div className="aspect-video rounded-md bg-service-accent/10 p-6">
              <div className="flex h-full flex-col justify-between rounded-md border border-service-border bg-white p-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
                    Preview media
                  </p>
                  <p className="mt-4 text-2xl font-semibold leading-tight text-service-ink">
                    Image, map, booking widget, or service proof can live here.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <span className="h-3 rounded-full bg-service-border" />
                  <span className="h-3 rounded-full bg-service-border" />
                  <span className="h-3 rounded-full bg-service-border" />
                  <span className="h-3 rounded-full bg-service-border" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
