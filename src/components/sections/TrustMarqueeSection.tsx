import {
  Section,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

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
            "type-label",
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
    <Section className="overflow-hidden bg-white py-12 max-md:py-10">
      <SevenColumnGrid
        className="mx-auto w-full max-w-[var(--site-grid-max)] px-[var(--site-grid-inset-inline)]"
        frame="none"
      >
        <SevenColumnGridItem className="col-span-4 max-lg:col-span-3 max-md:col-span-3 max-sm:col-span-1">
          <div
            className={cx(
              "relative z-10 -mb-px translate-y-px",
              "fluid-type-frame",
              "rounded-t-[var(--radius-medium-token)] bg-service-surface px-7 py-5",
            )}
          >
            <p
              className={cx(
                "type-display-lg",
                "wrap-pretty",
                "font-semibold text-service-ink",
              )}
            >
              {label}
            </p>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>

      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div
          className={cx(
            "overflow-hidden bg-service-surface py-4",
          )}
        >
          <div className="flex w-max animate-trust-marquee motion-reduce:animate-none">
            <MarqueeItems items={items} />
            <MarqueeItems items={items} hidden />
          </div>
        </div>
      </div>

    </Section>
  );
}
