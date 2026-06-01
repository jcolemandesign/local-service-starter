import { Button } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

type HeroImageTopContentBottomSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  marqueeItems?: string[];
  marqueeLabel?: string;
  headingLevel?: 1 | 2;
};

function TopImagePlaceholder() {
  return (
    <div
      aria-label="Sample service image placeholder"
      className="relative h-full min-h-[34rem] overflow-hidden rounded-b-[var(--radius-lg-token)] bg-zinc-300 max-md:min-h-[24rem]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(255_255_255_/_0.22),transparent_46%),linear-gradient(45deg,rgb(255_255_255_/_0.17)_0_1px,transparent_1px_22px)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-service-ink/18 to-transparent" />
    </div>
  );
}

function MarqueeItems({
  hidden = false,
  items,
}: {
  hidden?: boolean;
  items: string[];
}) {
  return (
    <ul
      aria-hidden={hidden ? "true" : undefined}
      className="flex shrink-0 items-center gap-6 px-3"
    >
      {items.map((item) => (
        <li
          className="type-label flex shrink-0 items-center gap-6 text-service-muted"
          key={item}
        >
          <span>{item}</span>
          <span className="size-1.5 rounded-full bg-service-accent" />
        </li>
      ))}
    </ul>
  );
}

function InlineMarquee({
  items,
  label,
}: {
  items: string[];
  label?: string;
}) {
  return (
    <div
      aria-label={label ?? "Trust signals"}
      className="radius-medium col-span-full overflow-hidden border border-service-border bg-white py-5"
    >
      <div className="flex w-max animate-trust-marquee motion-reduce:animate-none">
        <MarqueeItems items={items} />
        <MarqueeItems items={items} hidden />
      </div>
    </div>
  );
}

export function HeroImageTopContentBottomSectionV2({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  marqueeItems,
  marqueeLabel,
  headingLevel = 1,
}: HeroImageTopContentBottomSectionV2Props) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="min-h-svh overflow-hidden bg-service-surface text-service-ink">
      <div className="container-site -mt-16 h-[68svh] min-h-[34rem] pt-0 max-md:-mt-10 max-md:h-auto max-md:min-h-0">
        <TopImagePlaceholder />
      </div>

      <div
        className={
          marqueeItems
            ? "container-site grid grid-cols-3 items-start gap-x-10 gap-y-6 pb-8 pt-12 max-lg:grid-cols-1 max-lg:gap-6 max-md:pb-6 max-md:pt-10"
            : "container-site grid min-h-[32svh] grid-cols-3 items-start gap-x-10 gap-y-6 py-12 max-lg:grid-cols-1 max-lg:gap-6 max-md:py-10"
        }
      >
        <div className="fluid-type-frame">
          <p className="type-label text-service-accent">{eyebrow}</p>
          <HeadingTag className="type-heading-xl mt-eyebrow-heading-md text-service-ink">
            {title}
          </HeadingTag>
        </div>

        <div className="fluid-type-frame">
          <p className="type-text-lg wrap-pretty text-service-muted">{body}</p>
        </div>

        <div className="flex flex-wrap justify-end gap-3 max-lg:justify-start">
          <RequestServiceButton>{primaryAction}</RequestServiceButton>
          <Button href="#services" variant="secondary">
            {secondaryAction}
          </Button>
        </div>

        {marqueeItems ? (
          <InlineMarquee items={marqueeItems} label={marqueeLabel} />
        ) : null}
      </div>
    </section>
  );
}
