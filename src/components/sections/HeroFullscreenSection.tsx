import { Button } from "@/components/primitives";

type ReviewSnippet = {
  rating: string;
  label: string;
  detail: string;
};

type HeroFullscreenSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  review: ReviewSnippet;
  headingLevel?: 1 | 2;
};

function PlaceholderImage() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-service-border" aria-hidden="true">
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/2 rotate-12 border-t border-white/45" />
      <div className="absolute inset-x-0 top-1/2 -rotate-12 border-t border-white/45" />
      <div className="absolute inset-10 border border-white/45 max-md:inset-6" />
      <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-white/60 bg-white/25 text-sm font-semibold uppercase text-service-muted backdrop-blur-sm">
        Image
      </div>
    </div>
  );
}

export function HeroFullscreenSection({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  review,
  headingLevel = 1,
}: HeroFullscreenSectionProps) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="relative flex min-h-svh min-h-dvh overflow-hidden bg-service-ink text-white">
      <PlaceholderImage />
      <div className="absolute inset-0 bg-service-ink/45" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-linear-to-t from-service-ink via-service-ink/45 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full items-end justify-between gap-12 p-12 max-lg:flex-col max-lg:items-start max-lg:justify-end max-md:gap-8 max-md:p-6">
        <div className="max-w-4xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-white/75">
            {eyebrow}
          </p>
          <HeadingTag className="max-w-4xl text-fluid-hero font-semibold leading-none">
            {title}
          </HeadingTag>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-white/80 max-md:text-lg max-md:leading-8">
            {body}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button href="#contact">{primaryAction}</Button>
            <Button href="#services" variant="secondary">
              {secondaryAction}
            </Button>
          </div>
        </div>

        <aside className="w-full max-w-sm rounded-lg border border-white/25 bg-white/15 p-6 text-white shadow-service backdrop-blur-md max-lg:max-w-md">
          <p className="text-4xl font-semibold leading-none">{review.rating}</p>
          <p className="mt-4 text-base font-semibold leading-7">{review.label}</p>
          <p className="mt-2 text-sm leading-6 text-white/75">{review.detail}</p>
        </aside>
      </div>
    </section>
  );
}
