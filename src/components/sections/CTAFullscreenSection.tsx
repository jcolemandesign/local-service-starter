import { Button } from "@/components/primitives";

type CTAFullscreenSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  action: string;
};

function PlaceholderBackground() {
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

export function CTAFullscreenSection({
  eyebrow,
  title,
  body,
  action,
}: CTAFullscreenSectionProps) {
  return (
    <section className="relative grid min-h-[80svh] overflow-hidden bg-service-ink px-12 py-16 text-white max-md:px-6 max-md:py-12">
      <PlaceholderBackground />
      <div className="absolute inset-0 bg-service-ink/55" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-linear-to-t from-service-ink via-service-ink/35 to-service-ink/10"
        aria-hidden="true"
      />

      <div className="relative z-10 grid h-full grid-rows-[1fr_auto_1fr] items-center">
        <div />

        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-white/75">
            {eyebrow}
          </p>
          <h2 className="text-fluid-heading font-semibold leading-heading">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-9 text-white/80 max-md:text-lg max-md:leading-8">
            {body}
          </p>
        </div>

        <div className="flex items-end justify-center pt-12">
          <Button
            className="border-white bg-white text-service-ink hover:bg-service-surface"
            href="#contact"
            variant="secondary"
          >
            {action}
          </Button>
        </div>
      </div>
    </section>
  );
}
