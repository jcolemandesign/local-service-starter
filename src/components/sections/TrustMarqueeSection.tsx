import {
  Button,
  Section,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type TrustMarqueeSectionProps = {
  actionHref?: string;
  actionLabel?: string;
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

export function TrustMarqueeSection({
  actionHref = "/contact",
  actionLabel = "Request service",
  label,
  items,
}: TrustMarqueeSectionProps) {
  return (
    <Section className="overflow-hidden bg-white py-12 max-md:py-10">
      <SevenColumnGrid className="section-min-none items-stretch" padding="none">
        <SevenColumnGridItem className="col-span-4 max-lg:col-span-7">
          <div
            className={cx(
              "relative z-10 -mb-px h-full translate-y-px",
              "fluid-type-frame",
              "rounded-t-[var(--radius-medium-token)] bg-service-surface px-7 py-5 max-md:px-5",
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

        <SevenColumnGridItem
          alignY="stretch"
          className="col-span-3 col-start-5 max-lg:col-span-7 max-lg:col-start-1"
        >
          <div className="relative z-10 -mb-px flex h-full translate-y-px items-center justify-center px-7 py-5 max-md:px-5">
            <Button href={actionHref} treatment="text-lift">
              {actionLabel}
            </Button>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>

      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="overflow-hidden bg-service-surface py-4">
          <div className="flex w-max animate-trust-marquee motion-reduce:animate-none">
            <MarqueeItems items={items} />
            <MarqueeItems items={items} hidden />
          </div>
        </div>
      </div>
    </Section>
  );
}
