import { Button, Container } from "@/components/primitives";

type TrustSignal = {
  value: string;
  label: string;
};

type ServiceCallout = {
  title: string;
  body: string;
};

type HeroGridMosaicSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  images: string[];
  trustSignals: TrustSignal[];
  services: ServiceCallout[];
  headingLevel?: 1 | 2;
};

function PlaceholderImagePanel({ label }: { label: string }) {
  return (
    <div className="relative h-full min-h-56 overflow-hidden rounded-lg bg-service-border" aria-hidden="true">
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/2 rotate-12 border-t border-white/45" />
      <div className="absolute inset-x-0 top-1/2 -rotate-12 border-t border-white/45" />
      <div className="absolute inset-8 border border-white/45 max-md:inset-5" />
      <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-white/60 bg-white/25 text-sm font-semibold uppercase text-service-muted backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}

export function HeroGridMosaicSection({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  images,
  trustSignals,
  services,
  headingLevel = 1,
}: HeroGridMosaicSectionProps) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="bg-service-surface py-4 max-md:py-3">
      <Container>
        <div className="grid min-h-svh grid-cols-6 grid-rows-5 gap-3 max-lg:min-h-0 max-lg:grid-cols-1 max-lg:grid-rows-none">
          <article className="col-span-3 row-span-3 flex items-center rounded-lg bg-white p-10 shadow-service max-lg:col-span-1 max-lg:row-auto max-md:p-6">
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
            </div>
          </article>

          <div className="col-span-2 row-span-2 col-start-4 row-start-1 max-lg:col-span-1 max-lg:row-auto">
            <PlaceholderImagePanel label={images[0] ?? "Image"} />
          </div>

          <div className="col-span-1 row-span-2 col-start-6 row-start-1 max-lg:col-span-1 max-lg:row-auto">
            <PlaceholderImagePanel label={images[1] ?? "Image"} />
          </div>

          {trustSignals.slice(0, 3).map((signal) => (
            <div
              className="row-start-3 flex flex-col justify-end rounded-lg bg-service-ink p-6 text-white max-lg:row-auto max-md:p-5"
              key={signal.label}
            >
              <p className="text-3xl font-semibold leading-none">{signal.value}</p>
              <p className="mt-3 text-sm leading-6 text-white/72">{signal.label}</p>
            </div>
          ))}

          {services.slice(0, 3).map((service) => (
            <article
              className="col-span-2 row-span-2 row-start-4 flex cursor-pointer flex-col justify-between rounded-lg border border-service-border bg-white p-7 transition-transform duration-300 ease-out hover:-translate-y-1 max-lg:col-span-1 max-lg:row-auto max-md:p-6"
              key={service.title}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
                  Service
                </p>
                <h3 className="mt-5 text-2xl font-semibold leading-heading text-service-ink">
                  {service.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-service-muted">
                  {service.body}
                </p>
              </div>
              <div className="mt-8 flex size-11 items-center justify-center rounded-md bg-service-surface text-service-ink">
                <span aria-hidden="true">-&gt;</span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
