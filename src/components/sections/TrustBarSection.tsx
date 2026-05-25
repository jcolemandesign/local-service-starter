import { Container, Section } from "@/components/primitives";
import styles from "./section-v2-type.module.css";

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
            styles["fluid-type-frame"],
            "flex items-center justify-between gap-10 border-y border-service-border py-7 max-lg:flex-col max-lg:items-start",
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
          <ul className="grid flex-1 grid-cols-4 gap-4 max-lg:w-full max-md:grid-cols-2 max-sm:grid-cols-1">
            {items.map((item) => (
              <li
                className={cx(
                  styles["fluid-text-sm"],
                  styles["wrap-pretty"],
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
