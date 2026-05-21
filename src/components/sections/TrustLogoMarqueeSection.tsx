import { Container, Section } from "@/components/primitives";

type TrustLogoMarqueeSectionProps = {
  label: string;
  logos: string[];
};

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex h-24 items-center justify-center rounded-lg border border-service-border bg-white px-8 shadow-service">
      <div className="flex h-12 w-full items-center justify-center rounded-md border border-service-border bg-service-surface text-sm font-semibold uppercase text-service-muted">
        {name}
      </div>
    </div>
  );
}

function LogoTrack({
  logos,
  hidden = false,
}: {
  logos: string[];
  hidden?: boolean;
}) {
  return (
    <ul
      className="flex shrink-0 items-center gap-5 px-2"
      aria-hidden={hidden ? "true" : undefined}
    >
      {logos.map((logo) => (
        <li
          className="w-60 shrink-0 max-lg:w-52 max-md:w-44"
          key={logo}
        >
          <LogoPlaceholder name={logo} />
        </li>
      ))}
    </ul>
  );
}

export function TrustLogoMarqueeSection({
  label,
  logos,
}: TrustLogoMarqueeSectionProps) {
  return (
    <Section className="bg-white py-16 max-md:py-12">
      <Container>
        <div className="overflow-hidden rounded-lg border border-service-border bg-service-surface">
          <div className="flex items-center gap-10 px-10 py-12 max-lg:flex-col max-lg:items-start max-md:px-6 max-md:py-10">
            <div className="basis-1/5">
              <p className="max-w-xs text-xl font-semibold leading-8 text-service-ink">
                {label}
              </p>
            </div>

            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-service-surface to-service-surface/0"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-service-surface to-service-surface/0"
                aria-hidden="true"
              />
              <div className="flex w-max animate-trust-marquee motion-reduce:animate-none">
                <LogoTrack logos={logos} />
                <LogoTrack logos={logos} hidden />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
