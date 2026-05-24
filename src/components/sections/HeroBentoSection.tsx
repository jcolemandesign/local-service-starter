import { Button } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

type HeroBentoSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  stats: string[];
  headingLevel?: 1 | 2;
};

function PlaceholderImagePanel() {
  return (
    <div className="relative h-full overflow-hidden rounded-lg bg-service-border" aria-hidden="true">
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/2 rotate-12 border-t border-white/45" />
      <div className="absolute inset-x-0 top-1/2 -rotate-12 border-t border-white/45" />
      <div className="absolute inset-8 border border-white/45 max-md:inset-5" />
      <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-white/60 bg-white/25 text-sm font-semibold uppercase text-service-muted backdrop-blur-sm">
        Image
      </div>
    </div>
  );
}

export function HeroBentoSection({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  stats,
  headingLevel = 1,
}: HeroBentoSectionProps) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="min-h-svh bg-white p-4 max-md:p-3">
      <div className="grid min-h-[calc(100svh-2rem)] grid-cols-2 gap-4 max-lg:grid-cols-1 max-lg:grid-rows-[45fr_55fr] max-md:min-h-[calc(100svh-1.5rem)] max-md:gap-3">
        <div className="flex min-h-0 items-center rounded-lg bg-service-surface p-12 max-lg:items-end max-lg:p-8 max-md:p-6">
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
            <div className="mt-9 flex flex-wrap gap-4 max-lg:hidden">
              <RequestServiceButton>{primaryAction}</RequestServiceButton>
              <Button href="#services" variant="secondary">
                {secondaryAction}
              </Button>
            </div>
            <ul className="mt-12 grid max-w-2xl grid-cols-3 gap-4 max-lg:flex max-lg:max-w-none max-lg:flex-nowrap max-lg:gap-0 max-lg:overflow-x-auto max-md:mt-8">
              {stats.map((stat) => (
                <li
                  className="border-l border-service-border pl-4 text-sm font-semibold text-service-ink max-lg:shrink-0 max-lg:px-4 max-lg:first:border-l-0 max-lg:first:pl-0"
                  key={stat}
                >
                  {stat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative min-h-0">
          <div className="absolute left-8 top-8 z-10 hidden flex-wrap gap-4 max-lg:flex max-md:left-6 max-md:top-6 max-md:gap-3">
            <RequestServiceButton>{primaryAction}</RequestServiceButton>
            <Button href="#services" variant="secondary">
              {secondaryAction}
            </Button>
          </div>
          <PlaceholderImagePanel />
        </div>
      </div>
    </section>
  );
}
