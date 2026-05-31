import { Button } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

type ReviewSnippet = {
  rating: string;
  label: string;
  detail: string;
};

type TrustSignal = {
  value: string;
  label: string;
};

type HeroFullscreenSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  review: ReviewSnippet;
  trustSignals: TrustSignal[];
  headingLevel?: 1 | 2;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FullBleedImage() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-service-ink" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.44),rgb(23_33_29_/_0.12)),linear-gradient(45deg,rgb(255_255_255_/_0.16)_0_1px,transparent_1px_20px)]" />
      <div className="absolute inset-0 bg-service-ink/20" />
    </div>
  );
}

export function HeroFullscreenSectionV2({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  review,
  trustSignals,
  headingLevel = 1,
}: HeroFullscreenSectionV2Props) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="relative flex min-h-svh overflow-hidden bg-service-ink text-white">
      <FullBleedImage />
      <div className="absolute inset-0 bg-service-ink/35" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-linear-to-t from-service-ink via-service-ink/52 to-transparent"
        aria-hidden="true"
      />

      <div
        className={cx(
          "container-site relative z-10 flex min-h-svh items-end justify-between gap-12 py-16 max-lg:flex-col max-lg:items-start max-lg:justify-end max-lg:gap-10 max-md:py-12",
          "fluid-type-frame",
        )}
      >
        <div className="min-w-0">
          <p className={cx("type-label", "text-white/70")}>
            {eyebrow}
          </p>
          <HeadingTag
            className={cx(
              "type-heading-lg",
              "measure-copy-wide",
              "mt-6 text-white",
            )}
          >
            {title}
          </HeadingTag>
          <p
            className={cx(
              "type-text-lg",
              "measure-copy",
              "wrap-pretty",
              "mt-7 text-white/78",
            )}
          >
            {body}
          </p>
          <div className="mt-10 flex flex-wrap gap-3 max-lg:mt-8">
            <RequestServiceButton>{primaryAction}</RequestServiceButton>
            <Button href="#services" variant="secondary">
              {secondaryAction}
            </Button>
          </div>
        </div>

        <aside className="grid w-full max-w-sm shrink-0 grid-cols-2 gap-4 text-white max-lg:max-w-md max-md:gap-3">
          {trustSignals.map((signal) => (
            <div
              className={cx(
                "radius-medium",
                "border border-white/18 bg-white/12 p-5 backdrop-blur-md max-md:p-4",
              )}
              key={signal.label}
            >
              <p className="text-2xl font-semibold leading-none max-md:text-xl">
                {signal.value}
              </p>
              <p className="mt-3 text-sm font-semibold leading-5 text-white/72 max-md:mt-2 max-md:text-xs max-md:leading-4">
                {signal.label}
              </p>
            </div>
          ))}
          <div
            className={cx(
              "radius-medium",
              "col-span-2 border border-white/18 bg-white/12 p-6 backdrop-blur-md max-md:p-4",
            )}
          >
            <p className="text-4xl font-semibold leading-none max-md:text-2xl">
              {review.rating}
            </p>
            <p className="mt-4 text-base font-semibold leading-7 max-md:mt-2 max-md:text-sm max-md:leading-5">
              {review.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/72 max-lg:hidden">
              {review.detail}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
