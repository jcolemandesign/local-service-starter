import { Container, Section } from "@/components/primitives";

type TrustBarSectionProps = {
  label: string;
  items: string[];
};

export function TrustBarSection({ label, items }: TrustBarSectionProps) {
  return (
    <Section className="bg-white py-10 max-md:py-8">
      <Container>
        <div className="flex items-center justify-between gap-10 border-y border-service-border py-7 max-lg:flex-col max-lg:items-start">
          <p className="max-w-md text-base font-semibold leading-7 text-service-ink">{label}</p>
          <ul className="grid flex-1 grid-cols-4 gap-4 max-lg:w-full max-md:grid-cols-2 max-sm:grid-cols-1">
            {items.map((item) => (
              <li className="text-sm font-medium text-service-muted" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
