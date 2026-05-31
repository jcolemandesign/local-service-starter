import { RequestServiceTrigger } from "@/components/request-service";

type HeroLogoStatementSectionV2Props = {
  logoLabel: string;
  statement: string;
  imageLabel: string;
  violatorTop: string;
  violatorBottom: string;
  headingLevel?: 1 | 2;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function WideImagePlaceholder() {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "radius-medium",
        "relative aspect-[16/7] overflow-hidden bg-service-border max-lg:aspect-[4/3]",
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.3),rgb(23_33_29_/_0.06)),linear-gradient(45deg,rgb(255_255_255_/_0.22)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

function ScheduleViolator({
  bottom,
  top,
}: {
  bottom: string;
  top: string;
}) {
  return (
    <RequestServiceTrigger
      className="absolute right-16 top-0 z-10 flex size-36 -translate-y-1/4 rotate-12 cursor-pointer items-center justify-center rounded-full [--violator-gap:4px] [--violator-stroke:1pt] transition-transform duration-300 ease-out hover:-translate-y-1/4 hover:rotate-12 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent max-lg:right-10 max-lg:size-32 max-md:right-6 max-md:size-28"
      aria-label={`${top} ${bottom}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-2 rounded-full bg-service-ink/35 blur-2xl"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-violator-spin rounded-full bg-[conic-gradient(from_0deg,var(--color-service-accent),white,var(--color-service-accent))] p-[var(--violator-stroke)] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] [-webkit-mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [-webkit-mask-composite:xor]"
      />
      <span className="relative flex size-[calc(100%_-_((var(--violator-gap)_+_var(--violator-stroke))_*_2))] flex-col items-center justify-center rounded-full bg-service-accent text-center text-sm font-semibold uppercase leading-tight text-white shadow-service max-md:text-xs">
        <svg
          aria-hidden="true"
          className="mb-2 size-5 max-md:mb-1.5 max-md:size-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7z" />
        </svg>
        <span>
          {top}
          <br />
          {bottom}
        </span>
      </span>
    </RequestServiceTrigger>
  );
}

export function HeroLogoStatementSectionV2({
  logoLabel,
  statement,
  violatorTop,
  violatorBottom,
  headingLevel = 1,
}: HeroLogoStatementSectionV2Props) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="bg-white py-24 max-lg:py-20 max-md:py-16">
      <div
        className={cx(
          "container-site",
          "fluid-type-frame",
        )}
      >
        <a
          className={cx(
            "type-label",
            "radius-medium",
            "flex min-h-24 w-full cursor-pointer items-center justify-center border border-service-border bg-service-surface text-service-muted transition-colors hover:border-service-accent hover:text-service-accent max-md:min-h-20",
          )}
          href="#"
        >
          {logoLabel}
        </a>

        <HeadingTag
          className={cx(
            "type-display-lg",
            "measure-copy-wide",
            "mt-16 text-service-ink max-lg:mt-12",
          )}
        >
          {statement}
        </HeadingTag>

        <div className="relative mt-16 max-lg:mt-12">
          <WideImagePlaceholder />
          <ScheduleViolator bottom={violatorBottom} top={violatorTop} />
        </div>
      </div>
    </section>
  );
}
