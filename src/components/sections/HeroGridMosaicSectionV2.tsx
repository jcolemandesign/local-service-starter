import {
  Button,
  SevenColumnGrid,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

type TrustSignal = {
  value: string;
  label: string;
};

type ServiceCallout = {
  title: string;
  body: string;
};

type HeroGridMosaicSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  images: string[];
  trustSignals: TrustSignal[];
  services: ServiceCallout[];
  headingLevel?: 1 | 2;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PlaceholderImagePanel({
  className,
  label,
}: {
  className?: string;
  label: string;
}) {
  return (
    <div
      className={cx(
        "radius-medium",
        "relative h-full min-h-64 overflow-hidden bg-service-border",
        className,
      )}
      aria-label={`${label} image placeholder`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.34),rgb(23_33_29_/_0.08)),linear-gradient(45deg,rgb(255_255_255_/_0.2)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

function ServiceCardImage({ label }: { label: string }) {
  return (
    <div
      className={cx(
        "radius-4",
        "relative mb-6 aspect-[4/3] overflow-hidden bg-service-border",
      )}
      aria-label={`${label} service image placeholder`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.2),rgb(23_33_29_/_0.04)),linear-gradient(45deg,rgb(255_255_255_/_0.24)_0_1px,transparent_1px_16px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

export function HeroGridMosaicSectionV2({
  title,
  body,
  primaryAction,
  secondaryAction,
  images,
  trustSignals,
  services,
  headingLevel = 1,
}: HeroGridMosaicSectionV2Props) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="[--site-grid-gap:clamp(0.75rem,1vw,1.5rem)] [--site-grid-inset-inline:clamp(1.5rem,4vw,6rem)] [--site-grid-row-gap:clamp(1.5rem,2.5vw,2.5rem)] grid-rows-6 max-lg:grid-rows-none">
        <article
          className={cx(
            "fluid-type-frame",
            "radius-medium",
            "col-span-4 row-span-2 flex h-full w-full min-w-0 flex-col justify-between bg-bg-page p-8 shadow-service [&>*]:min-w-0 max-lg:col-span-7 max-lg:h-auto max-lg:row-auto max-md:p-6",
          )}
        >
          <div>
            <HeadingTag
              className={cx(
                "type-heading-xl",
                "text-service-ink",
              )}
            >
              {title}
            </HeadingTag>
          </div>
          <div className="mt-12">
            <p
              className={cx(
                "type-text-lg",
                "measure-copy",
                "wrap-pretty",
                "mt-5 text-service-muted",
              )}
            >
              {body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <RequestServiceButton>{primaryAction}</RequestServiceButton>
              <Button href="#services" variant="secondary">
                {secondaryAction}
              </Button>
            </div>
          </div>
        </article>

        <div className="col-span-3 col-start-5 row-span-2 row-start-1 w-full min-w-0 max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto">
          <PlaceholderImagePanel
            className="aspect-[3/2] h-auto min-h-0"
            label={images[0] ?? "Image"}
          />
        </div>

        <div className="col-span-1 col-start-7 row-span-4 row-start-3 grid w-full min-w-0 content-start gap-[var(--site-grid-gap)] max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto">
          {trustSignals.slice(0, 3).map((signal) => (
            <div
              className={cx(
                "fluid-type-frame",
                "radius-medium",
                "flex flex-col bg-service-ink p-6 text-white max-md:p-5",
              )}
              key={signal.label}
            >
              <p className="text-2xl font-semibold leading-none">{signal.value}</p>
              <p
                className={cx(
                  "type-text-sm",
                  "wrap-pretty",
                  "mt-3 text-white/72",
                )}
              >
                {signal.label}
              </p>
            </div>
          ))}
        </div>

        {services.slice(0, 3).map((service) => (
          <article
            className={cx(
              "fluid-type-frame",
              "radius-medium",
              "col-span-2 row-span-3 row-start-3 flex w-full min-w-0 flex-col justify-between border border-service-border bg-bg-page p-6 transition-transform duration-300 ease-out hover:-translate-y-1 [&>*]:min-w-0 max-lg:col-span-7 max-lg:row-auto",
            )}
            key={service.title}
          >
            <div>
              <ServiceCardImage label={service.title} />
              <p className={cx("type-label", "text-service-accent")}>
                Service
              </p>
              <h3
                className={cx(
                  "type-heading-sm",
                  "mt-4 text-service-ink",
                )}
              >
                {service.title}
              </h3>
              <p
                className={cx(
                  "type-text-md",
                  "measure-copy",
                  "wrap-pretty",
                  "mt-3 text-service-muted",
                )}
              >
                {service.body}
              </p>
            </div>
            <div
              className={cx(
                "radius-4",
                "mt-6 flex size-11 items-center justify-center bg-service-surface text-service-ink",
              )}
            >
              <span aria-hidden="true">-&gt;</span>
            </div>
          </article>
        ))}
      </SevenColumnGrid>
    </section>
  );
}
