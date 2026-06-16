import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type TrustItemsProps = {
  items: readonly string[];
  label: string;
};

type TrustLogosProps = {
  label: string;
  logos: readonly string[];
};

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div className="content-padding-x radius-medium flex h-24 items-center justify-center border border-service-border bg-white shadow-service">
      <div className="type-label radius-4 flex h-12 w-full items-center justify-center border border-service-border bg-service-surface text-service-muted">
        {name}
      </div>
    </div>
  );
}

function TextMarqueeItems({
  hidden = false,
  items,
}: {
  hidden?: boolean;
  items: readonly string[];
}) {
  return (
    <ul
      aria-hidden={hidden ? "true" : undefined}
      className="flex shrink-0 items-center inline-gap-lrg px-3"
    >
      {items.map((item) => (
        <li
          className="type-label flex shrink-0 items-center inline-gap-lrg text-service-muted"
          key={item}
        >
          <span>{item}</span>
          <span className="size-1.5 rounded-full bg-service-accent" />
        </li>
      ))}
    </ul>
  );
}

function LogoTrack({
  hidden = false,
  logos,
}: {
  hidden?: boolean;
  logos: readonly string[];
}) {
  return (
    <ul
      aria-hidden={hidden ? "true" : undefined}
      className="flex shrink-0 items-center inline-gap-med px-2"
    >
      {logos.map((logo) => (
        <li className="w-60 shrink-0 max-lg:w-52 max-md:w-44" key={logo}>
          <LogoPlaceholder name={logo} />
        </li>
      ))}
    </ul>
  );
}

export function TrustBarSectionV3({ items, label }: TrustItemsProps) {
  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none" padding="sml">
        <SevenColumnGridItem
          className="content-padding-y col-span-3 border-y border-service-border max-lg:col-span-7"
          measure="copy"
        >
          <p className="type-text-md wrap-pretty font-semibold text-service-ink">
            {label}
          </p>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="content-padding-y col-span-4 col-start-4 border-y border-service-border max-lg:col-span-7 max-lg:col-start-1 max-lg:border-t-0 max-lg:pt-0"
          alignY="middle"
        >
          <ul className="grid grid-cols-4 card-grid-gap-med max-md:grid-cols-2 max-sm:grid-cols-1">
            {items.map((item) => (
              <li
                className="type-text-sm wrap-pretty font-medium text-service-muted"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

export function TrustBarFloatingBentoSectionV3({
  items,
  label,
}: TrustItemsProps) {
  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-none" padding="sml">
        <SevenColumnGridItem
          alignY="stretch"
          className="col-span-3 max-lg:col-span-7"
        >
          <div className="content-padding radius-medium flex min-h-44 items-end bg-service-ink text-white max-md:min-h-0">
            <p className="type-heading-sm">{label}</p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignY="stretch"
          className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1"
        >
          <ul className="grid h-full grid-cols-4 card-grid-gap-sml max-lg:grid-cols-2 max-sm:grid-cols-1">
            {items.map((item, index) => (
              <li
                className="content-padding radius-medium flex min-h-32 flex-col justify-between border border-service-border bg-white shadow-service max-md:min-h-0"
                key={item}
              >
                <span className="type-caption text-service-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="type-text-sm wrap-pretty font-semibold text-service-ink">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

export function TrustMarqueeSectionV3({ items, label }: TrustItemsProps) {
  return (
    <section className="overflow-hidden bg-bg-page">
      <SevenColumnGrid className="section-min-none" padding="sml">
        <SevenColumnGridItem
          className="col-span-3 max-lg:col-span-7"
          alignY="middle"
          measure="copy"
        >
          <p className="type-text-md wrap-pretty font-semibold text-service-ink">
            {label}
          </p>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1"
          alignY="stretch"
        >
          <div className="content-padding-y relative -mr-[var(--site-grid-inset-inline)] h-full overflow-hidden max-lg:mr-0">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-linear-to-r from-bg-page to-bg-page/0 max-md:w-16"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-72 bg-linear-to-l from-bg-page to-bg-page/0 max-lg:w-28 max-md:w-16"
            />
            <div className="flex w-max animate-trust-marquee motion-reduce:animate-none">
              <TextMarqueeItems items={items} />
              <TextMarqueeItems hidden items={items} />
            </div>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

export function TrustLogoMarqueeSectionV3({
  label,
  logos,
}: TrustLogosProps) {
  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none" padding="sml">
        <SevenColumnGridItem
          className="col-span-2 max-lg:col-span-7"
          measure="caption"
        >
          <div className="content-padding radius-medium flex h-full items-center border border-service-border bg-service-surface">
            <p className="type-text-xl wrap-balance font-semibold text-service-ink">
              {label}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-5 col-start-3 max-lg:col-span-7 max-lg:col-start-1"
          alignY="stretch"
        >
          <div className="content-padding-y radius-medium relative h-full min-w-0 overflow-hidden border border-service-border bg-service-surface">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-service-surface to-service-surface/0"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-service-surface to-service-surface/0"
            />
            <div className="flex w-max animate-trust-marquee motion-reduce:animate-none">
              <LogoTrack logos={logos} />
              <LogoTrack hidden logos={logos} />
            </div>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

export function TrustLogoGridSectionV3({ label, logos }: TrustLogosProps) {
  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none" padding="sml">
        <SevenColumnGridItem
          className="col-span-2 max-lg:col-span-7"
          measure="caption"
        >
          <div className="content-padding radius-medium flex h-full items-start border border-service-border bg-service-surface">
            <p className="type-text-xl wrap-balance font-semibold text-service-ink">
              {label}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-5 col-start-3 max-lg:col-span-7 max-lg:col-start-1"
        >
          <ul className="grid grid-cols-5 site-grid-gap max-lg:grid-cols-3 max-sm:grid-cols-2">
            {logos.map((logo) => (
              <li key={logo}>
                <LogoPlaceholder name={logo} />
              </li>
            ))}
          </ul>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
