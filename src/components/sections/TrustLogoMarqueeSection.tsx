import { Container, Section } from "@/components/primitives";

type TrustLogoMarqueeSectionProps = {
  label: string;
  logos: string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div
      className={cx(
        "radius-medium",
        "flex h-24 items-center justify-center border border-service-border bg-white px-8 shadow-service",
      )}
    >
      <div
        className={cx(
          "type-label",
          "radius-4",
          "flex h-12 w-full items-center justify-center border border-service-border bg-service-surface text-service-muted",
        )}
      >
        {name}
      </div>
    </div>
  );
}

function LogoGrid({ logos }: { logos: string[] }) {
  return (
    <ul
      className="grid grid-cols-6 gap-4 max-lg:grid-cols-3 max-sm:grid-cols-2"
    >
      {logos.map((logo) => (
        <li key={logo}>
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
        <div
          className={cx(
            "radius-medium",
            "border border-service-border bg-service-surface",
          )}
        >
          <div
            className={cx(
              "fluid-type-frame",
              "grid grid-cols-[minmax(14rem,0.28fr)_1fr] gap-10 px-10 py-12 max-lg:grid-cols-1 max-md:px-6 max-md:py-10",
            )}
          >
            <div>
              <p
                className={cx(
                  "type-text-xl",
                  "measure-caption",
                  "wrap-balance",
                  "font-semibold text-service-ink",
                )}
              >
                {label}
              </p>
            </div>

            <div className="min-w-0">
              <LogoGrid logos={logos} />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
