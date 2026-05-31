import { Button } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

type NavLink = {
  label: string;
  items?: string[];
};

type ReviewSnippet = {
  rating: string;
  label: string;
  detail: string;
};

type TrustSignal = {
  value: string;
  label: string;
};

type HeroNotchedNavSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  review: ReviewSnippet;
  trustSignals: TrustSignal[];
  logoLabel: string;
  phone: string;
  action: string;
  links: NavLink[];
  headingLevel?: 1 | 2;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function HeroMaskedBackground() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 1600 900"
    >
      <defs>
        <mask id="hero-notched-nav-mask-v2">
          <path
            d="M40 0H350Q390 0 390 40V76Q390 116 430 116H1170Q1210 116 1210 76V40Q1210 0 1250 0H1560Q1600 0 1600 40V860Q1600 900 1560 900H40Q0 900 0 860V40Q0 0 40 0Z"
            fill="white"
          />
        </mask>
        <linearGradient id="hero-notched-nav-base-v2" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#17211d" />
          <stop offset="1" stopColor="#1f7a5a" />
        </linearGradient>
        <radialGradient id="hero-notched-nav-glow-v2" cx="72%" cy="18%" r="42%">
          <stop offset="0" stopColor="white" stopOpacity="0.2" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-notched-nav-shade-v2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#17211d" stopOpacity="0.4" />
          <stop offset="0.58" stopColor="#17211d" stopOpacity="0.18" />
          <stop offset="1" stopColor="#17211d" stopOpacity="0.82" />
        </linearGradient>
        <pattern
          height="24"
          id="hero-notched-nav-grid-v2"
          patternUnits="userSpaceOnUse"
          width="24"
        >
          <path d="M0 24L24 0" stroke="white" strokeOpacity="0.18" />
        </pattern>
      </defs>
      <g mask="url(#hero-notched-nav-mask-v2)">
        <rect fill="url(#hero-notched-nav-base-v2)" height="900" width="1600" />
        <rect fill="url(#hero-notched-nav-grid-v2)" height="900" width="1600" />
        <rect fill="url(#hero-notched-nav-glow-v2)" height="900" width="1600" />
        <rect fill="url(#hero-notched-nav-shade-v2)" height="900" width="1600" />
      </g>
    </svg>
  );
}

export function HeroNotchedNavSectionV2({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  review,
  trustSignals,
  logoLabel,
  phone,
  action,
  links,
  headingLevel = 1,
}: HeroNotchedNavSectionV2Props) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="bg-service-surface py-6 max-md:py-4">
      <div className="container-site">
        <div className="relative min-h-[calc(100svh-3rem)] overflow-hidden rounded-[var(--radius-lg-token)] bg-service-surface text-white max-md:min-h-[calc(100svh-2rem)]">
          <HeroMaskedBackground />

          <nav
            aria-label="Notched hero navigation"
            className={cx(
              "absolute left-1/2 top-0 z-30 flex min-h-20 w-[min(68rem,calc(100%-3rem))] -translate-x-1/2 items-center justify-between gap-6 px-6 text-service-ink max-lg:min-h-16 max-md:w-[calc(100%-2rem)] max-md:px-4",
              "rounded-[var(--radius-lg-token)]",
            )}
          >
            <a
              className={cx(
                "type-label",
                "flex h-11 w-32 shrink-0 items-center justify-center rounded-[var(--radius-md-token)] border border-service-border bg-white text-service-muted",
              )}
              href="#"
            >
              {logoLabel}
            </a>

            <ul className="type-text-sm flex min-w-0 items-center gap-6 font-semibold max-lg:hidden">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    className="block py-3 transition-colors hover:text-service-accent"
                    href="#"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex shrink-0 items-center gap-3 max-md:hidden">
              <Button className="px-5" href="tel:5550142250" variant="secondary">
                {phone}
              </Button>
              <RequestServiceButton>{action}</RequestServiceButton>
            </div>

            <Button className="hidden px-5 max-lg:inline-flex" href="#contact" variant="secondary">
              Menu
            </Button>
          </nav>

          <div
            className={cx(
              "fluid-type-frame",
              "relative z-10 flex min-h-[calc(100svh-3rem)] items-end justify-between gap-12 px-16 pb-16 pt-36 max-lg:flex-col max-lg:items-start max-lg:justify-end max-lg:px-10 max-lg:pb-10 max-md:min-h-[calc(100svh-2rem)] max-md:px-6 max-md:pb-8 max-md:pt-32",
            )}
          >
            <div className="min-w-0">
              <p className="type-label text-white/70">{eyebrow}</p>
              <HeadingTag className="type-display-lg mt-6 max-w-[12ch] text-white">
                {title}
              </HeadingTag>
              <p className="type-text-lg measure-copy mt-7 text-white/78 wrap-pretty">
                {body}
              </p>
              <div className="mt-10 flex flex-wrap gap-3 max-lg:mt-8">
                <RequestServiceButton>{primaryAction}</RequestServiceButton>
                <Button href="#services" variant="secondary">
                  {secondaryAction}
                </Button>
              </div>
            </div>

            <aside className="grid w-full max-w-sm shrink-0 grid-cols-2 gap-4 max-lg:max-w-md max-md:gap-3">
              {trustSignals.map((signal) => (
                <div
                  className="rounded-[var(--radius-md-token)] border border-white/18 bg-white/12 p-5 backdrop-blur-md max-md:p-4"
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
              <div className="col-span-2 rounded-[var(--radius-md-token)] border border-white/18 bg-white/12 p-6 backdrop-blur-md max-md:p-4">
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
        </div>
      </div>
    </section>
  );
}
