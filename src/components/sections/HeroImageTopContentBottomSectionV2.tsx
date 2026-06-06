import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
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
      className="radius-large relative h-full min-h-0 overflow-hidden bg-zinc-300"
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
    <section className="overflow-hidden bg-service-surface text-service-ink">
      <SevenColumnGrid className="section-min-screen grid-rows-[minmax(var(--media-min-medium),1fr)_auto] max-lg:grid-rows-none">
        <SevenColumnGridItem
          alignX="stretch"
          alignY="stretch"
          className="col-span-7 row-start-1 max-lg:row-auto"
        >
          <TopImagePlaceholder />
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="left"
          alignY="top"
          className="col-span-3 row-start-2 max-lg:col-span-7 max-lg:row-auto"
        >
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <HeadingTag className="type-heading-xl mt-eyebrow-heading-md text-service-ink">
              {title}
            </HeadingTag>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="left"
          alignY="top"
          className="col-span-3 col-start-4 row-start-2 max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto"
        >
          <div className="fluid-type-frame measure-copy">
            <p className="type-text-lg wrap-pretty text-service-muted">{body}</p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="right"
          alignY="top"
          className="col-span-1 col-start-7 row-start-2 max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto"
        >
          <div className="flex flex-wrap justify-end gap-3 max-lg:justify-start">
            <RequestServiceButton>{primaryAction}</RequestServiceButton>
            <Button href="#services" variant="secondary">
              {secondaryAction}
            </Button>
          </div>
        </SevenColumnGridItem>

        {marqueeItems ? (
          <SevenColumnGridItem className="col-span-7 row-start-3 max-lg:row-auto">
            <InlineMarquee items={marqueeItems} label={marqueeLabel} />
          </SevenColumnGridItem>
        ) : null}
      </SevenColumnGrid>
    </section>
  );
}
