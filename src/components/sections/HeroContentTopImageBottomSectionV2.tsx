import { Button } from "@/components/primitives";
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
      className="relative h-full min-h-[28rem] overflow-hidden bg-zinc-300"
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
    <section className="min-h-svh bg-service-surface text-service-ink">
      <div className="grid min-h-svh grid-rows-[minmax(20rem,34svh)_minmax(28rem,1fr)] max-lg:grid-rows-none">
        <div className="container-site grid grid-cols-3 items-end gap-10 pb-10 pt-28 max-lg:grid-cols-1 max-lg:items-start max-lg:gap-6 max-lg:py-16 max-md:py-12">
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
          </div>

          <div className="fluid-type-frame">
            <HeadingTag className="type-heading-xl text-service-ink">
              {title}
            </HeadingTag>
          </div>

          <div
            className={cx(
              "fluid-type-frame",
              "flex flex-col items-start max-lg:max-w-2xl",
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
        </div>

        <BottomImagePlaceholder />
      </div>
    </section>
  );
}
