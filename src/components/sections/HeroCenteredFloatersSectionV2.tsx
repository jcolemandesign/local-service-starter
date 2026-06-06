import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import { HeroCenteredFloatersParallax } from "./HeroCenteredFloatersParallax";

type HeroCenteredFloatersSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  headingLevel?: 1 | 2;
};

export function HeroCenteredFloatersSectionV2({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  headingLevel = 1,
}: HeroCenteredFloatersSectionV2Props) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="relative overflow-hidden bg-service-surface text-service-ink">
      <SevenColumnGrid className="section-min-screen">
        <SevenColumnGridItem
          alignX="stretch"
          alignY="middle"
          className="col-span-2 max-lg:hidden"
        >
          <HeroCenteredFloatersParallax side="left" />
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="center"
          alignY="middle"
          className="col-span-3 col-start-3 max-lg:col-span-7 max-lg:col-start-1"
        >
          <div className="fluid-type-frame measure-copy flex w-full flex-col items-center text-center">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <HeadingTag className="type-display-lg mt-eyebrow-display text-service-ink">
              {title}
            </HeadingTag>
            <p className="type-text-lg wrap-pretty mt-display-body text-service-muted">
              {body}
            </p>
            <div className="mt-body-actions-md flex flex-wrap justify-center gap-3">
              <RequestServiceButton>{primaryAction}</RequestServiceButton>
              <Button href="#services" variant="secondary">
                {secondaryAction}
              </Button>
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="stretch"
          alignY="middle"
          className="col-span-2 col-start-6 max-lg:hidden"
        >
          <HeroCenteredFloatersParallax side="right" />
        </SevenColumnGridItem>

        <div className="col-span-7 hidden grid-cols-2 gap-3 max-lg:grid">
          <div className="radius-medium aspect-[4/3] bg-zinc-200" />
          <div className="radius-medium aspect-[4/3] bg-zinc-300" />
        </div>
      </SevenColumnGrid>
    </section>
  );
}
