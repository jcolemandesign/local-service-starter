import { Button } from "@/components/primitives";
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
    <section className="relative min-h-svh overflow-hidden bg-service-surface text-service-ink">
      <div className="container-site grid min-h-svh grid-cols-[1fr_minmax(22rem,1fr)_1fr] items-center gap-10 py-16 max-lg:grid-cols-1 max-lg:gap-12 max-md:py-12">
        <HeroCenteredFloatersParallax side="left" />

        <div className="fluid-type-frame mx-auto flex w-full max-w-[34rem] flex-col items-center text-center">
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

        <HeroCenteredFloatersParallax side="right" />

        <div className="hidden grid-cols-2 gap-3 max-lg:grid">
          <div className="radius-medium aspect-[4/3] bg-zinc-200" />
          <div className="radius-medium aspect-[4/3] bg-zinc-300" />
        </div>
      </div>
    </section>
  );
}
