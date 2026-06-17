import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

type HeroBentoSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  stats: string[];
  headingLevel?: 1 | 2;
};

function PlaceholderImagePanel() {
  return (
    <div
      className="radius-medium relative h-full min-h-0 overflow-hidden bg-service-border"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/2 rotate-12 border-t border-white/45" />
      <div className="absolute inset-x-0 top-1/2 -rotate-12 border-t border-white/45" />
      <div className="absolute inset-8 border border-white/45 max-md:inset-5" />
      <div className="radius-medium absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/60 bg-white/25 text-sm font-semibold uppercase text-service-muted backdrop-blur-sm">
        Image
      </div>
    </div>
  );
}

export function HeroBentoSectionV2({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  stats,
  headingLevel = 1,
}: HeroBentoSectionV2Props) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="bg-white">
      <SevenColumnGrid className="section-min-screen grid-rows-[minmax(0,1fr)] max-lg:grid-rows-none">
        <SevenColumnGridItem
          alignX="left"
          alignY="middle"
          className="radius-medium col-span-3 row-start-1 h-full min-h-0 bg-service-surface p-8 text-service-ink max-lg:col-span-7 max-lg:row-auto max-md:p-6"
        >
          <div className="fluid-type-frame w-full measure-copy-wide">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <HeadingTag className="type-display-lg mt-eyebrow-display text-service-ink">
              {title}
            </HeadingTag>
            <p className="type-text-xl measure-copy wrap-pretty mt-display-body text-service-muted">
              {body}
            </p>
            <div className="mt-body-actions-md flex flex-wrap gap-4 max-lg:hidden">
              <RequestServiceButton>{primaryAction}</RequestServiceButton>
              <Button href="#services" variant="secondary">
                {secondaryAction}
              </Button>
            </div>
            <ul className="mt-12 grid grid-cols-3 gap-4 max-lg:flex max-lg:flex-nowrap max-lg:gap-0 max-lg:overflow-x-auto max-md:mt-8">
              {stats.map((stat) => (
                <li
                  className="type-text-sm border-l border-service-border pl-4 font-semibold text-service-ink max-lg:shrink-0 max-lg:px-4 max-lg:first:border-l-0 max-lg:first:pl-0"
                  key={stat}
                >
                  {stat}
                </li>
              ))}
            </ul>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="stretch"
          alignY="stretch"
          className="col-span-4 col-start-4 row-start-1 h-full min-h-0 overflow-hidden max-lg:media-min-medium max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto"
        >
          <div className="absolute left-8 top-8 z-10 hidden flex-wrap gap-4 max-lg:flex max-md:left-6 max-md:top-6 max-md:gap-3">
            <RequestServiceButton>{primaryAction}</RequestServiceButton>
            <Button href="#services" variant="secondary">
              {secondaryAction}
            </Button>
          </div>
          <PlaceholderImagePanel />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
