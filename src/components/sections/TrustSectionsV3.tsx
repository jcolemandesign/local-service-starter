import Image from "next/image";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type TrustItemsProps = {
  items: readonly string[];
  label: string;
};

type TrustBarSectionV3Props = TrustItemsProps & {
  className?: string;
};

type CrewImageTile = {
  alt: string;
  objectPosition: string;
  src: string;
};

type TrustLogosProps = {
  label: string;
  logos: readonly string[];
};

const crewImageTiles: CrewImageTile[] = [
  {
    alt: "Service technician working on indoor equipment",
    objectPosition: "50% 40%",
    src: "/images/bg-image-sample%201.jpg",
  },
  {
    alt: "Technician speaking with a homeowner at the front door",
    objectPosition: "42% 42%",
    src: "/images/bg-image-sample%202.jpg",
  },
  {
    alt: "HVAC unit being delivered for a residential installation",
    objectPosition: "22% 50%",
    src: "/images/hvac-unit-truck-wide.png",
  },
  {
    alt: "Service visit conversation at a home entry",
    objectPosition: "58% 42%",
    src: "/images/bg-image-sample%202.1.jpg",
  },
];

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function LogoPlaceholder({
  compact = false,
  name,
}: {
  compact?: boolean;
  name: string;
}) {
  return (
    <div
      className={cx(
        "content-padding-x radius-medium flex items-center justify-center border border-service-border bg-white shadow-service",
        compact ? "h-18" : "h-24",
      )}
    >
      <div
        className={cx(
          "type-label radius-4 flex w-full items-center justify-center border border-service-border bg-service-surface text-service-muted",
          compact ? "h-10" : "h-12",
        )}
      >
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

export function TrustBarSectionV3({
  className,
  items,
  label,
}: TrustBarSectionV3Props) {
  return (
    <section className={cx(className ?? "bg-bg-page")}>
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

function CrewImageCard({
  className,
  image,
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 30vw",
}: {
  className: string;
  image: CrewImageTile;
  sizes?: string;
}) {
  return (
    <div
      className={cx(
        "radius-medium relative overflow-hidden border border-service-border bg-service-surface shadow-service",
        className,
      )}
    >
      <Image
        alt={image.alt}
        className="object-cover"
        fill
        sizes={sizes}
        src={image.src}
        style={{ objectPosition: image.objectPosition }}
      />
    </div>
  );
}

function TrustCalloutCard({
  className,
  index,
  item,
}: {
  className?: string;
  index: number;
  item: string;
}) {
  return (
    <div
      className={cx(
        "content-padding radius-medium flex min-h-32 flex-col justify-between border border-service-border bg-white shadow-service max-md:min-h-0",
        className,
      )}
    >
      <span className="type-caption text-service-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className="type-text-sm wrap-pretty font-semibold text-service-ink">
        {item}
      </p>
    </div>
  );
}

export function TrustBarBentoAboutSectionV3({
  items,
  label,
}: TrustItemsProps) {
  const visibleItems = items.slice(0, 4);

  return (
    <section className="bg-service-surface">
      <SevenColumnGrid
        className="section-min-none items-center"
        padding="sml"
      >
        <SevenColumnGridItem className="col-span-7">
          <div className="grid grid-cols-7 items-center card-grid-gap-sml max-lg:grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1">
            <div className="col-span-2 grid grid-cols-2 card-grid-gap-sml max-lg:col-span-2 max-md:col-span-2 max-sm:col-span-1 max-sm:grid-cols-1">
              <div className="content-padding radius-medium col-span-2 flex aspect-[2/1] items-end border border-service-border bg-white shadow-service max-sm:col-span-1 max-sm:aspect-auto max-sm:min-h-36">
                <p className="type-text-md wrap-pretty font-semibold text-service-ink">
                  {label}
                </p>
              </div>
              <TrustCalloutCard
                className="aspect-square"
                index={0}
                item={visibleItems[0] ?? label}
              />
              <TrustCalloutCard
                className="aspect-square"
                index={1}
                item={visibleItems[1] ?? label}
              />
            </div>

            <CrewImageCard
              className="col-span-2 aspect-[4/5] max-lg:col-span-2"
              image={crewImageTiles[0]}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 28vw"
            />

            <div className="grid card-grid-gap-sml max-lg:col-span-1 max-md:col-span-1">
              <TrustCalloutCard
                className="aspect-square"
                index={2}
                item={visibleItems[2] ?? label}
              />
              <CrewImageCard
                className="aspect-square"
                image={crewImageTiles[1]}
                sizes="(max-width: 768px) 50vw, 16vw"
              />
            </div>

            <div className="col-span-2 grid grid-cols-2 card-grid-gap-sml max-lg:col-span-3 max-md:col-span-2 max-sm:col-span-1 max-sm:grid-cols-1">
              <CrewImageCard
                className="aspect-square"
                image={crewImageTiles[2]}
                sizes="(max-width: 768px) 50vw, 16vw"
              />
              <TrustCalloutCard
                className="aspect-square"
                index={3}
                item={visibleItems[3] ?? label}
              />
              <CrewImageCard
                className="col-span-2 aspect-[3/2] max-sm:col-span-1"
                image={crewImageTiles[3]}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 28vw"
              />
            </div>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

export function TrustMarqueeSectionV3({ items }: TrustItemsProps) {
  return (
    <section className="section-min-none overflow-hidden bg-bg-page py-8 max-md:py-6">
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="flex w-max animate-trust-marquee motion-reduce:animate-none">
          <TextMarqueeItems items={items} />
          <TextMarqueeItems hidden items={items} />
        </div>
      </div>
    </section>
  );
}

export function TrustLogoMarqueeSectionV3({
  logos,
}: TrustLogosProps) {
  return (
    <section className="section-min-none overflow-hidden bg-bg-page py-8 max-md:py-6">
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="flex w-max animate-trust-marquee motion-reduce:animate-none">
          <LogoTrack logos={logos} />
          <LogoTrack hidden logos={logos} />
        </div>
      </div>
    </section>
  );
}

export function TrustLogoGridSectionV3({ label, logos }: TrustLogosProps) {
  const visibleLogos = logos.slice(0, 5);

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none py-6 max-md:py-5">
        <SevenColumnGridItem
          alignY="middle"
          className="col-span-2 max-lg:col-span-7"
          measure="caption"
        >
          <div className="radius-medium flex h-full items-center justify-center border border-service-border bg-service-surface px-5 py-4 text-center">
            <p className="type-text-xl wrap-balance font-semibold text-service-ink">
              {label}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignY="middle"
          className="col-span-5 col-start-3 max-lg:col-span-7 max-lg:col-start-1"
        >
          <ul className="grid grid-cols-5 justify-items-center site-grid-gap max-lg:grid-cols-3 max-sm:grid-cols-2">
            {visibleLogos.map((logo) => (
              <li className="w-full" key={logo}>
                <LogoPlaceholder compact name={logo} />
              </li>
            ))}
          </ul>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
