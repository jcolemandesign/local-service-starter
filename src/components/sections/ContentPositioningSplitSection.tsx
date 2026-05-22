import { Container, Section } from "@/components/primitives";

type ContentPositioningSplitSectionProps = {
  title: string;
  body: string;
  action: string;
  imageLabel: string;
};

function PositioningImage({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-full min-h-0 overflow-hidden rounded-lg bg-service-border"
    >
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/2 rotate-12 border-t border-white/45" />
      <div className="absolute inset-x-0 top-1/2 -rotate-12 border-t border-white/45" />
      <div className="absolute inset-8 rounded-md border border-white/45 max-md:inset-5" />
      <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-white/60 bg-white/25 text-sm font-semibold uppercase text-service-muted backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}

export function ContentPositioningSplitSection({
  title,
  body,
  action,
  imageLabel,
}: ContentPositioningSplitSectionProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid min-h-[70svh] grid-cols-2 overflow-hidden rounded-lg bg-service-surface max-lg:grid-cols-1">
          <div className="flex min-h-0 flex-col justify-between p-12 pb-20 pr-0 max-lg:min-h-[48svh] max-lg:p-8 max-lg:pb-14 max-md:p-6 max-md:pb-12">
            <h2 className="text-fluid-heading font-semibold leading-heading text-service-ink">
              {title}
            </h2>

            <div>
              <p className="text-2xl leading-10 text-service-muted max-md:text-xl max-md:leading-8">
                {body}
              </p>

              <a
                className="mt-10 inline-flex min-h-12 w-fit cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-service-ink bg-transparent px-6 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                href="#about"
              >
                {action}
              </a>
            </div>
          </div>

          <div className="min-h-0 p-12 max-lg:min-h-[44svh] max-lg:pt-0 max-md:p-6 max-md:pt-0">
            <PositioningImage label={imageLabel} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
