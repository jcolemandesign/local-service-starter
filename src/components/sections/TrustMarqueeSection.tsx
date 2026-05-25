import { Container, Section } from "@/components/primitives";
import styles from "./section-v2-type.module.css";

type TrustMarqueeSectionProps = {
  label: string;
  items: string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
          className={cx(
            styles["fluid-label"],
            "flex shrink-0 items-center gap-6 text-service-muted",
          )}
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
        <div
          className={cx(
            styles["fluid-type-frame"],
            styles["radius-medium"],
            "max-w-md rounded-b-none border border-b-0 border-service-border bg-service-surface px-7 py-5 max-md:max-w-none",
          )}
        >
          <p
            className={cx(
              styles["fluid-text-md"],
              styles["measure-copy"],
              styles["wrap-pretty"],
              "font-semibold text-service-ink",
            )}
          >
            {label}
          </p>
        </div>

        <div
          className={cx(
            styles["radius-medium"],
            "overflow-hidden rounded-tl-none border border-service-border bg-service-surface py-6",
          )}
        >
          <div className="flex w-max animate-trust-marquee motion-reduce:animate-none">
            <MarqueeItems items={items} />
            <MarqueeItems items={items} hidden />
          </div>
        </div>
      </Container>
    </Section>
  );
}
