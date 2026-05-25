import { Container, Section } from "@/components/primitives";

type TrustBarSectionProps = {
  label: string;
  items: string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function TrustBarSection({ label, items }: TrustBarSectionProps) {
  return (
    <Section className="bg-white py-10 max-md:py-8">
      <Container>
        <div
          className={cx(
            "fluid-type-frame",
            "flex items-center justify-between gap-10 border-y border-service-border py-7 max-lg:flex-col max-lg:items-start",
          )}
        >
          <p
            className={cx(
              "type-text-md",
              "measure-copy",
              "wrap-pretty",
              "font-semibold text-service-ink",
            )}
          >
            {label}
          </p>
          <ul className="grid flex-1 grid-cols-4 gap-4 max-lg:w-full max-md:grid-cols-2 max-sm:grid-cols-1">
            {items.map((item) => (
              <li
                className={cx(
                  "type-text-sm",
                  "wrap-pretty",
                  "font-medium text-service-muted",
                )}
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
