import Image from "next/image";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type {
  CardLinkGridAlign,
  SectionIcons,
} from "@/content/section-style-options";
import type {
  SectionCardBorder,
  SectionCardFill,
} from "@/content/section-color-recipes";
import { CardLinkShell } from "./CardLinkShell";

export type HorizontalCardLinkGridItem = {
  body: string;
  href: string;
  imageAlt?: string;
  imageSrc?: string;
  title: string;
};

export type HorizontalCardLinkGridSectionV3Props = {
  align?: CardLinkGridAlign;
  cardBorder?: SectionCardBorder;
  cardFill?: SectionCardFill;
  cardLinks?: "on" | "off";
  heading: string;
  icons?: SectionIcons;
  items: readonly HorizontalCardLinkGridItem[];
  linkLabel?: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const alignColumnStarts: Record<
  CardLinkGridAlign,
  readonly [string, string, string]
> = {
  left: ["col-start-1", "col-start-5", "col-start-9"],
  center: ["col-start-2", "col-start-6", "col-start-10"],
  right: ["col-start-3", "col-start-7", "col-start-11"],
  justified: ["col-start-1", "col-start-6", "col-start-11"],
};

const responsiveColumns =
  "max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2";

function ServiceIcon({ index }: { index: number }) {
  if (index === 1) {
    return (
      <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 24 24">
        <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M8.5 4l3.5 2 3.5-2M8.5 20l3.5-2 3.5 2M4 10.2 7.5 12 4 13.8M20 10.2 16.5 12l3.5 1.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.65" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 24 24">
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.65" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 24 24">
      <path d="m14.7 6.3 3-3a5 5 0 0 1-6.4 6.4L5.7 15.3a2 2 0 0 0 3 3l5.6-5.6a5 5 0 0 1 6.4-6.4l-3 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.65" />
      <path d="m4 4 4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.65" />
    </svg>
  );
}

export type HorizontalCardLinkProps = {
  cardBorder: SectionCardBorder;
  cardFill: SectionCardFill;
  cardLinks: "on" | "off";
  icons: SectionIcons;
  imageSizes: string;
  index: number;
  item: HorizontalCardLinkGridItem;
  linkLabel: string;
};

export function HorizontalCardLink({
  cardBorder,
  cardFill,
  cardLinks,
  icons,
  imageSizes,
  index,
  item,
  linkLabel,
}: HorizontalCardLinkProps) {
  return (
    <CardLinkShell
      className={cx(
        "group/card grid h-full min-w-0 grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface text-service-ink shadow-service max-sm:grid-cols-1",
        cardLinks === "on" &&
          "transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
        "recipe-card-context",
        cardFill === "none" && "!bg-transparent !shadow-none",
        cardBorder === "off" && "!border-transparent",
      )}
      href={cardLinks === "on" ? item.href : undefined}
    >
      <div className="fluid-type-frame card-min-short flex min-w-0 flex-col p-[clamp(1.125rem,1.5vw,1.625rem)]">
        {icons === "on" ? (
          <span className="mb-4 grid size-12 place-items-center rounded-[var(--radius-surface-token)] bg-bg-muted text-service-accent">
            <ServiceIcon index={index} />
          </span>
        ) : null}
        <h3 className="type-heading-sm text-service-ink">{item.title}</h3>
        <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
          {item.body}
        </p>
        {cardLinks === "on" ? (
          <span className="type-label mt-auto inline-flex items-center gap-2 pt-5 text-service-accent">
            {linkLabel}
            <span aria-hidden="true" className="transition-transform duration-200 group-hover/card:translate-x-1">
              &rarr;
            </span>
          </span>
        ) : null}
      </div>

      <div className="card-min-short relative overflow-hidden bg-bg-muted max-sm:aspect-[4/3] max-sm:min-h-0">
        {item.imageSrc ? (
          <Image
            alt={item.imageAlt ?? item.title}
            className="object-cover transition duration-300 ease-out group-hover/card:scale-[1.025]"
            fill
            sizes={imageSizes}
            src={item.imageSrc}
          />
        ) : null}
      </div>
    </CardLinkShell>
  );
}

export function HorizontalCardLinkGridSectionV3({
  align = "center",
  cardBorder = "on",
  cardFill = "solid",
  cardLinks = "on",
  heading,
  icons = "on",
  items,
  linkLabel = "View service",
}: HorizontalCardLinkGridSectionV3Props) {
  const columnStarts = alignColumnStarts[align] ?? alignColumnStarts.center;

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none items-stretch" columns={14} padding="med">
        <LayoutGridItem className="col-span-12 col-start-2 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2">
          <h2 className="type-eyebrow text-service-accent">{heading}</h2>
        </LayoutGridItem>

        {items.slice(0, 3).map((item, index) => (
          <LayoutGridItem
            alignY="stretch"
            className={cx("col-span-4", columnStarts[index], responsiveColumns)}
            key={item.title}
          >
            <HorizontalCardLink
              cardBorder={cardBorder}
              cardFill={cardFill}
              cardLinks={cardLinks}
              icons={icons}
              imageSizes="(max-width: 639px) 100vw, (max-width: 1023px) 45vw, 18vw"
              index={index}
              item={item}
              linkLabel={linkLabel}
            />
          </LayoutGridItem>
        ))}
      </LayoutGrid>
    </section>
  );
}
