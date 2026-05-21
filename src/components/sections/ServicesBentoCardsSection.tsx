import { Container, Section, SectionHeading } from "@/components/primitives";

type ServiceBentoItem = {
  title: string;
  body: string;
  imageLabel: string;
};

type ServicesBentoCardsSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  items: ServiceBentoItem[];
};

function ServiceImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-x-0 top-0 aspect-square overflow-hidden bg-service-border" aria-hidden="true">
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/2 rotate-12 border-t border-white/45" />
      <div className="absolute inset-x-0 top-1/2 -rotate-12 border-t border-white/45" />
      <div className="absolute inset-6 border border-white/45" />
      <div className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-white/60 bg-white/25 text-xs font-semibold uppercase text-service-muted backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}

export function ServicesBentoCardsSection({
  eyebrow,
  title,
  body,
  items,
}: ServicesBentoCardsSectionProps) {
  return (
    <Section id="services-bento" className="bg-white">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          body={body}
          align="center"
        />

        <div className="mt-16 grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:mt-12 max-md:grid-cols-1">
          {items.map((item) => (
            <article
              className="group/service-card relative aspect-[3/4] cursor-pointer overflow-hidden rounded-lg border border-service-border bg-white shadow-service transition-transform duration-300 ease-out hover:scale-[1.015]"
              key={item.title}
            >
              <ServiceImagePlaceholder label={item.imageLabel} />
              <div className="absolute right-3 top-3 flex size-12 items-center justify-center rounded-lg border border-white/60 bg-white/90 text-xl font-semibold leading-none text-service-ink shadow-service transition-colors group-hover/service-card:bg-service-accent group-hover/service-card:text-white">
                <span aria-hidden="true">-&gt;</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex h-[46%] flex-col justify-start bg-[linear-gradient(to_bottom,rgb(255_255_255_/_0)_0%,rgb(255_255_255_/_0.88)_34%,rgb(255_255_255)_48%,rgb(255_255_255)_100%)] px-7 pb-7 pt-20 max-lg:px-6 max-lg:pb-6">
                <h3 className="text-3xl font-semibold leading-tight text-service-ink max-lg:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-4 line-clamp-3 text-base leading-7 text-service-muted">
                  {item.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
