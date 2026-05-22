import { Container, Section } from "@/components/primitives";

type HeroLogoStatementSectionProps = {
  logoLabel: string;
  statement: string;
  imageLabel: string;
  violatorTop: string;
  violatorBottom: string;
  headingLevel?: 1 | 2;
};

function WideImagePlaceholder({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[16/7] overflow-hidden rounded-lg bg-service-border max-lg:aspect-[4/3]"
    >
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/2 rotate-6 border-t border-white/45" />
      <div className="absolute inset-x-0 top-1/2 -rotate-6 border-t border-white/45" />
      <div className="absolute inset-10 rounded-md border border-white/45 max-md:inset-6" />
      <div className="absolute left-1/2 top-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-white/60 bg-white/25 text-sm font-semibold uppercase text-service-muted backdrop-blur-sm max-md:size-20">
        {label}
      </div>
    </div>
  );
}

function ScheduleViolator({
  bottom,
  top,
}: {
  bottom: string;
  top: string;
}) {
  return (
    <a
      className="absolute right-16 top-0 z-10 flex size-36 -translate-y-1/4 rotate-12 cursor-pointer items-center justify-center rounded-full transition-transform duration-300 ease-out hover:-translate-y-1/4 hover:rotate-12 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent max-lg:right-10 max-lg:size-32 max-md:right-6 max-md:size-28"
      href="#contact"
    >
      <span
        aria-hidden="true"
        className="absolute inset-2 rounded-full bg-service-ink/35 blur-2xl"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-violator-spin rounded-full bg-[conic-gradient(from_0deg,var(--color-service-accent),white,var(--color-service-accent))]"
      />
      <span className="absolute inset-[3px] rounded-full" />
      <span className="relative flex size-[calc(100%-20px)] flex-col items-center justify-center rounded-full bg-service-accent text-center text-sm font-semibold uppercase leading-tight text-white shadow-service max-md:text-xs">
        <svg
          aria-hidden="true"
          className="mb-2 size-5 max-md:mb-1.5 max-md:size-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7z" />
        </svg>
        <span>
          {top}
          <br />
          {bottom}
        </span>
      </span>
    </a>
  );
}

export function HeroLogoStatementSection({
  logoLabel,
  statement,
  imageLabel,
  violatorTop,
  violatorBottom,
  headingLevel = 1,
}: HeroLogoStatementSectionProps) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <Section className="bg-white">
      <Container>
        <a
          className="flex min-h-24 w-full cursor-pointer items-center justify-center rounded-lg border border-service-border bg-service-surface text-sm font-semibold uppercase tracking-widest text-service-muted transition-colors hover:border-service-accent hover:text-service-accent max-md:min-h-20"
          href="#"
        >
          {logoLabel}
        </a>

        <HeadingTag className="mt-16 max-w-6xl text-fluid-heading font-semibold leading-heading text-service-ink max-lg:mt-12">
          {statement}
        </HeadingTag>

        <div className="relative mt-16 max-lg:mt-12">
          <WideImagePlaceholder label={imageLabel} />
          <ScheduleViolator bottom={violatorBottom} top={violatorTop} />
        </div>
      </Container>
    </Section>
  );
}
