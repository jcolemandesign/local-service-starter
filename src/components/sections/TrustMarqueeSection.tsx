import { Container, Section } from "@/components/primitives";

type TrustMarqueeSectionProps = {
  label: string;
  items: string[];
};

function MarqueeItems({
  items,
  hidden = false,
}: {
  items: string[];
  hidden?: boolean;
}) {
  return (
    <ul
      className="flex shrink-0 items-center gap-6 px-3"
      aria-hidden={hidden ? "true" : undefined}
    >
      {items.map((item) => (
        <li
          className="flex shrink-0 items-center gap-6 text-sm font-semibold uppercase text-service-muted"
          key={item}
        >
          <span>{item}</span>
          <span className="size-1.5 rounded-full bg-service-accent" />
        </li>
      ))}
    </ul>
  );
}

export function TrustMarqueeSection({ label, items }: TrustMarqueeSectionProps) {
  return (
    <Section className="bg-white py-12 max-md:py-10">
      <Container>
        <div className="max-w-md rounded-t-lg border border-b-0 border-service-border bg-service-surface px-7 py-5 max-md:max-w-none">
          <p className="text-base font-semibold leading-7 text-service-ink">
            {label}
          </p>
        </div>

        <div className="overflow-hidden rounded-b-lg rounded-tr-lg border border-service-border bg-service-surface py-6">
          <div className="flex w-max animate-trust-marquee motion-reduce:animate-none">
            <MarqueeItems items={items} />
            <MarqueeItems items={items} hidden />
          </div>
        </div>
      </Container>
    </Section>
  );
}
