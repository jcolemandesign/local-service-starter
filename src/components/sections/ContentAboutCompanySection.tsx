import { Container, Section } from "@/components/primitives";

type AboutImage = {
  label: string;
};

type ContentAboutCompanySectionProps = {
  eyebrow: string;
  statement: string;
  summary: string;
  action: string;
  images: AboutImage[];
};

function BentoImage({ label }: AboutImage) {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[5/4] min-w-0 overflow-hidden rounded-lg bg-service-border"
    >
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/3 rotate-[-10deg] border-t border-white/45" />
      <div className="absolute inset-x-0 top-2/3 rotate-[10deg] border-t border-white/45" />
      <div className="absolute inset-6 rounded-md border border-white/45 max-md:inset-5" />
      <div className="absolute bottom-6 left-6 rounded-md border border-white/60 bg-white/25 px-4 py-3 text-sm font-semibold uppercase text-service-muted backdrop-blur-sm max-md:bottom-5 max-md:left-5">
        {label}
      </div>
    </div>
  );
}

export function ContentAboutCompanySection({
  eyebrow,
  statement,
  summary,
  action,
  images,
}: ContentAboutCompanySectionProps) {
  return (
    <Section id="about" className="bg-white">
      <Container>
        <div className="grid gap-6">
          <div className="grid grid-cols-[minmax(10rem,1fr)_minmax(0,3fr)] gap-6 max-lg:grid-cols-1">
            <div className="flex min-w-0 items-start">
              <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
                {eyebrow}
              </p>
            </div>
            <h2 className="text-fluid-heading font-semibold leading-heading text-service-ink">
              {statement}
            </h2>
          </div>

          <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(14rem,1fr)] gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
            {images.slice(0, 2).map((image) => (
              <BentoImage key={image.label} label={image.label} />
            ))}

            <div className="flex min-w-0 flex-col justify-between rounded-lg bg-service-surface p-7 max-lg:col-span-2 max-md:col-span-1 max-md:p-6">
              <p className="max-w-md text-xl font-semibold leading-8 text-service-ink max-md:text-lg max-md:leading-7">
                {summary}
              </p>
              <a
                className="mt-10 inline-flex min-h-12 w-fit cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-service-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-service-accent"
                href="#about"
              >
                {action}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
