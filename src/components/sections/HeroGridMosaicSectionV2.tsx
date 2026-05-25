import { Button } from "@/components/primitives";
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

function PlaceholderImagePanel({ label }: { label: string }) {
  return (
    <div
      className={cx(
        "radius-medium",
        "relative h-full min-h-64 overflow-hidden bg-service-border",
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
    <section className="min-h-svh bg-service-surface p-3">
      <div className="container-site grid min-h-[calc(100svh-1.5rem)] grid-cols-8 grid-rows-6 gap-3 max-lg:min-h-0 max-lg:grid-cols-1 max-lg:grid-rows-none">
        <article
          className={cx(
            "fluid-type-frame",
            "radius-medium",
            "col-span-5 row-span-3 flex flex-col justify-between bg-white p-8 shadow-service max-lg:col-span-1 max-lg:row-auto max-md:p-6",
          )}
        >
          <div>
            <HeadingTag
              className={cx(
                "type-heading-xl",
                "measure-display-wide",
                "wrap-balance",
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

        <div className="col-span-3 row-span-3 col-start-6 row-start-1 max-lg:col-span-1 max-lg:row-auto">
          <PlaceholderImagePanel label={images[0] ?? "Image"} />
        </div>

        <div className="col-span-2 col-start-7 row-span-3 row-start-4 grid grid-rows-3 gap-3 max-lg:col-span-1 max-lg:row-auto max-lg:grid-rows-none">
          {trustSignals.slice(0, 3).map((signal) => (
            <div
              className={cx(
                "fluid-type-frame",
                "radius-medium",
                "flex flex-col justify-end bg-service-ink p-6 text-white max-md:p-5",
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
              "col-span-2 row-span-3 row-start-4 flex flex-col justify-between border border-service-border bg-white p-6 transition-transform duration-300 ease-out hover:-translate-y-1 max-lg:col-span-1 max-lg:row-auto",
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
                  "measure-display-wide",
                  "wrap-balance",
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
      </div>
    </section>
  );
}
