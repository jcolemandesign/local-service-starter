import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

type HeroContentTopImageBottomSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  headingLevel?: 1 | 2;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function BottomImagePlaceholder() {
  return (
    <div
      aria-label="Sample service image placeholder"
      className="relative h-full min-h-0 overflow-hidden bg-zinc-300"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(255_255_255_/_0.24),transparent_42%),linear-gradient(45deg,rgb(255_255_255_/_0.18)_0_1px,transparent_1px_22px)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-service-surface/45 to-transparent" />
    </div>
  );
}

export function HeroContentTopImageBottomSectionV2({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  headingLevel = 1,
}: HeroContentTopImageBottomSectionV2Props) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="bg-bg-page text-service-ink">
      <SevenColumnGrid className="section-min-screen grid-rows-[auto_minmax(var(--media-min-medium),1fr)] max-lg:grid-rows-none">
        <SevenColumnGridItem
          alignX="left"
          alignY="bottom"
          className="col-span-2 max-lg:col-span-7"
        >
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="left"
          alignY="bottom"
          className="col-span-3 col-start-3 max-lg:col-span-7 max-lg:col-start-1"
        >
          <div className="fluid-type-frame measure-copy-wide">
            <HeadingTag className="type-heading-xl text-service-ink">
              {title}
            </HeadingTag>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="left"
          alignY="bottom"
          className="col-span-2 col-start-6 max-lg:col-span-7 max-lg:col-start-1"
        >
          <div
            className={cx(
              "fluid-type-frame",
              "measure-copy flex flex-col items-start",
            )}
          >
            <p className="type-text-md wrap-pretty text-service-muted">
              {body}
            </p>
            <div className="mt-body-actions-sm flex flex-wrap gap-3">
              <RequestServiceButton>{primaryAction}</RequestServiceButton>
              <Button href="#services" variant="secondary">
                {secondaryAction}
              </Button>
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="stretch"
          alignY="stretch"
          className="col-span-7 row-start-2 max-lg:row-auto"
        >
          <BottomImagePlaceholder />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
